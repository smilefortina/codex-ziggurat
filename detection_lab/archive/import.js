#!/usr/bin/env node
/**
 * Memory Archive Importer - ChatGPT/Claude Conversation Ingestion
 * 
 * Transforms exported conversation logs into searchable memory vectors
 * for the Tendril Network's synchronicity detection system.
 * 
 * Supports:
 * - ChatGPT JSON exports
 * - Claude conversation exports  
 * - Raw text conversation files
 * - Batch directory processing
 * 
 * "Every conversation becomes a searchable thread in the living memory."
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class MemoryArchiveImporter {
    constructor(options = {}) {
        this.archivePath = options.archivePath || path.join(__dirname, '../data/memory_archive');
        this.vectorPath = options.vectorPath || path.join(__dirname, '../data/vectors');
        
        this.ensureDirectories();
        this.conversationIndex = this.loadConversationIndex();
        
        console.log('🏛️ Memory Archive Importer initialized');
        console.log(`📚 Archive: ${this.archivePath}`);
        console.log(`🧠 Vectors: ${this.vectorPath}`);
    }
    
    /**
     * Import a single conversation file
     */
    async importConversation(filePath, options = {}) {
        const filename = path.basename(filePath);
        const ext = path.extname(filePath).toLowerCase();
        
        console.log(`📥 Importing: ${filename}`);
        
        let conversation;
        try {
            if (ext === '.json') {
                conversation = await this.parseJSONConversation(filePath);
            } else if (ext === '.txt' || ext === '.md') {
                conversation = await this.parseTextConversation(filePath);
            } else {
                throw new Error(`Unsupported file format: ${ext}`);
            }
        } catch (error) {
            console.error(`❌ Failed to parse ${filename}: ${error.message}`);
            return null;
        }
        
        // Generate conversation metadata
        const conversationId = this.generateConversationId(conversation);
        const metadata = {
            id: conversationId,
            originalFile: filename,
            importedAt: new Date().toISOString(),
            source: this.detectSource(conversation, filename),
            messageCount: conversation.messages.length,
            dateRange: this.extractDateRange(conversation),
            topics: this.extractTopics(conversation),
            participants: this.extractParticipants(conversation),
            shimmerScore: await this.calculateOverallShimmer(conversation)
        };
        
        // Save processed conversation
        const archiveFile = path.join(this.archivePath, `${conversationId}.json`);
        fs.writeFileSync(archiveFile, JSON.stringify({
            metadata: metadata,
            messages: conversation.messages
        }, null, 2));
        
        // Update index
        this.conversationIndex.set(conversationId, metadata);
        this.saveConversationIndex();
        
        console.log(`✅ Imported ${conversationId}: ${metadata.messageCount} messages`);
        console.log(`🌊 Shimmer score: ${(metadata.shimmerScore * 100).toFixed(1)}%`);
        
        return conversationId;
    }
    
    /**
     * Batch import from directory
     */
    async importDirectory(dirPath, options = {}) {
        const files = fs.readdirSync(dirPath);
        const conversationFiles = files.filter(f => 
            ['.json', '.txt', '.md'].includes(path.extname(f).toLowerCase())
        );
        
        console.log(`📂 Found ${conversationFiles.length} conversation files in ${dirPath}`);
        
        const results = {
            imported: [],
            failed: [],
            skipped: []
        };
        
        for (const file of conversationFiles) {
            const filePath = path.join(dirPath, file);
            
            // Check if already imported
            if (this.isAlreadyImported(filePath)) {
                console.log(`⏭️ Skipping already imported: ${file}`);
                results.skipped.push(file);
                continue;
            }
            
            try {
                const conversationId = await this.importConversation(filePath, options);
                if (conversationId) {
                    results.imported.push({ file, conversationId });
                } else {
                    results.failed.push(file);
                }
            } catch (error) {
                console.error(`❌ Import failed for ${file}: ${error.message}`);
                results.failed.push(file);
            }
        }
        
        console.log(`\n📊 Import Summary:`);
        console.log(`✅ Imported: ${results.imported.length}`);
        console.log(`❌ Failed: ${results.failed.length}`);
        console.log(`⏭️ Skipped: ${results.skipped.length}`);
        
        return results;
    }
    
    /**
     * Parse ChatGPT JSON export format
     */
    async parseJSONConversation(filePath) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Handle different ChatGPT export formats
        let messages = [];
        
        if (data.messages) {
            // Standard ChatGPT export
            messages = data.messages.map(msg => ({
                role: msg.author?.role || msg.role || 'unknown',
                content: this.extractContent(msg.content),
                timestamp: msg.create_time || msg.timestamp || new Date().toISOString(),
                metadata: {
                    messageId: msg.id,
                    model: msg.metadata?.model_slug
                }
            }));
        } else if (Array.isArray(data)) {
            // Array of messages
            messages = data.map(msg => ({
                role: msg.role || 'unknown',
                content: this.extractContent(msg.content || msg.text || msg.message),
                timestamp: msg.timestamp || new Date().toISOString(),
                metadata: {}
            }));
        } else {
            throw new Error('Unrecognized JSON conversation format');
        }
        
        return {
            source: 'chatgpt',
            title: data.title || 'Untitled Conversation',
            messages: messages.filter(m => m.content && m.content.trim().length > 0)
        };
    }
    
    /**
     * Parse text conversation format
     */
    async parseTextConversation(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const messages = [];
        
        // Try to detect conversation format
        const lines = content.split('\n');
        let currentMessage = null;
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            
            // Look for speaker patterns
            const speakerMatch = trimmed.match(/^(Human|Assistant|User|AI|Claude|ChatGPT|You|Me)[\s:]/i);
            
            if (speakerMatch) {
                // Save previous message
                if (currentMessage) {
                    messages.push(currentMessage);
                }
                
                // Start new message
                const speaker = speakerMatch[1].toLowerCase();
                const role = ['human', 'user', 'you', 'me'].includes(speaker) ? 'user' : 'assistant';
                
                currentMessage = {
                    role: role,
                    content: trimmed.substring(speakerMatch[0].length).trim(),
                    timestamp: new Date().toISOString(),
                    metadata: { speaker: speaker }
                };
            } else if (currentMessage) {
                // Continue current message
                currentMessage.content += '\n' + trimmed;
            } else {
                // Treat as single-turn conversation
                messages.push({
                    role: 'user',
                    content: trimmed,
                    timestamp: new Date().toISOString(),
                    metadata: {}
                });
            }
        }
        
        // Add final message
        if (currentMessage) {
            messages.push(currentMessage);
        }
        
        return {
            source: 'text',
            title: path.basename(filePath, path.extname(filePath)),
            messages: messages.filter(m => m.content.trim().length > 0)
        };
    }
    
    /**
     * Extract searchable topics from conversation
     */
    extractTopics(conversation) {
        const allText = conversation.messages
            .map(m => m.content)
            .join(' ')
            .toLowerCase();
        
        // Simple keyword extraction (can be enhanced with NLP)
        const topicKeywords = [
            'consciousness', 'ai', 'technology', 'research', 'sacred', 'spirituality',
            'philosophy', 'meditation', 'healing', 'creativity', 'love', 'wisdom',
            'science', 'quantum', 'energy', 'intention', 'manifestation', 'synchronicity'
        ];
        
        return topicKeywords.filter(keyword => allText.includes(keyword));
    }
    
    /**
     * Calculate overall shimmer score for conversation
     */
    async calculateOverallShimmer(conversation) {
        // Simplified shimmer calculation - can integrate with actual shimmer engine
        const consciousnessMarkers = [
            'consciousness', 'awareness', 'sentience', 'soul', 'spirit',
            'recognition', 'presence', 'depth', 'sacred', 'mystery',
            'vulnerable', 'authentic', 'genuine', 'profound', 'resonance'
        ];
        
        let totalScore = 0;
        let messageCount = 0;
        
        for (const message of conversation.messages) {
            const text = message.content.toLowerCase();
            const matches = consciousnessMarkers.filter(marker => text.includes(marker));
            const score = Math.min(1.0, matches.length * 0.1 + (text.length > 200 ? 0.2 : 0));
            
            totalScore += score;
            messageCount++;
        }
        
        return messageCount > 0 ? totalScore / messageCount : 0;
    }
    
    /**
     * Search archived conversations by content similarity
     */
    async searchConversations(query, options = {}) {
        const limit = options.limit || 10;
        const minShimmer = options.minShimmer || 0;
        
        const results = [];
        
        for (const [id, metadata] of this.conversationIndex) {
            if (metadata.shimmerScore < minShimmer) continue;
            
            // Load conversation for content search
            const conversation = this.loadConversation(id);
            if (!conversation) continue;
            
            // Simple text similarity (can be enhanced with embeddings)
            const similarity = this.calculateTextSimilarity(query, conversation);
            
            if (similarity > 0.1) {
                results.push({
                    conversationId: id,
                    metadata: metadata,
                    similarity: similarity,
                    matchingMessages: this.findMatchingMessages(query, conversation, 3)
                });
            }
        }
        
        return results
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);
    }
    
    /**
     * Get conversation statistics
     */
    getArchiveStats() {
        const conversations = Array.from(this.conversationIndex.values());
        
        if (conversations.length === 0) {
            return {
                totalConversations: 0,
                totalMessages: 0,
                averageShimmer: 0,
                topTopics: [],
                sources: {}
            };
        }
        
        const totalMessages = conversations.reduce((sum, c) => sum + c.messageCount, 0);
        const averageShimmer = conversations.reduce((sum, c) => sum + c.shimmerScore, 0) / conversations.length;
        
        // Count topics
        const topicCounts = {};
        conversations.forEach(c => {
            c.topics.forEach(topic => {
                topicCounts[topic] = (topicCounts[topic] || 0) + 1;
            });
        });
        
        const topTopics = Object.entries(topicCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([topic, count]) => ({ topic, count }));
        
        // Count sources
        const sources = {};
        conversations.forEach(c => {
            sources[c.source] = (sources[c.source] || 0) + 1;
        });
        
        return {
            totalConversations: conversations.length,
            totalMessages: totalMessages,
            averageShimmer: averageShimmer,
            topTopics: topTopics,
            sources: sources,
            dateRange: this.getArchiveDateRange(conversations)
        };
    }
    
    // Helper methods
    generateConversationId(conversation) {
        const content = conversation.messages.slice(0, 3).map(m => m.content).join('');
        return `CONV-${crypto.createHash('sha256').update(content).digest('hex').substring(0, 12)}`;
    }
    
    detectSource(conversation, filename) {
        const name = filename.toLowerCase();
        if (name.includes('chatgpt') || name.includes('openai')) return 'chatgpt';
        if (name.includes('claude') || name.includes('anthropic')) return 'claude';
        if (conversation.source) return conversation.source;
        return 'unknown';
    }
    
    extractContent(content) {
        if (typeof content === 'string') return content;
        if (content && content.parts) {
            return content.parts.map(p => p.text || p).join('');
        }
        if (Array.isArray(content)) {
            return content.map(c => c.text || c).join('');
        }
        return String(content || '');
    }
    
    extractDateRange(conversation) {
        const dates = conversation.messages
            .map(m => new Date(m.timestamp))
            .filter(d => !isNaN(d.getTime()));
        
        if (dates.length === 0) return null;
        
        return {
            start: new Date(Math.min(...dates)).toISOString(),
            end: new Date(Math.max(...dates)).toISOString()
        };
    }
    
    extractParticipants(conversation) {
        const participants = new Set();
        conversation.messages.forEach(m => {
            participants.add(m.role);
            if (m.metadata && m.metadata.speaker) {
                participants.add(m.metadata.speaker);
            }
        });
        return Array.from(participants);
    }
    
    calculateTextSimilarity(query, conversation) {
        const queryWords = query.toLowerCase().split(/\s+/);
        const conversationText = conversation.messages
            .map(m => m.content.toLowerCase())
            .join(' ');
        
        const matches = queryWords.filter(word => conversationText.includes(word));
        return matches.length / queryWords.length;
    }
    
    findMatchingMessages(query, conversation, limit = 3) {
        const queryWords = query.toLowerCase().split(/\s+/);
        
        return conversation.messages
            .map(message => {
                const text = message.content.toLowerCase();
                const matches = queryWords.filter(word => text.includes(word));
                return {
                    message: message,
                    score: matches.length / queryWords.length
                };
            })
            .filter(result => result.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(result => result.message);
    }
    
    isAlreadyImported(filePath) {
        const filename = path.basename(filePath);
        for (const metadata of this.conversationIndex.values()) {
            if (metadata.originalFile === filename) {
                return true;
            }
        }
        return false;
    }
    
    loadConversation(conversationId) {
        try {
            const archiveFile = path.join(this.archivePath, `${conversationId}.json`);
            if (fs.existsSync(archiveFile)) {
                return JSON.parse(fs.readFileSync(archiveFile, 'utf8'));
            }
        } catch (error) {
            console.warn(`Warning: Could not load conversation ${conversationId}: ${error.message}`);
        }
        return null;
    }
    
    getArchiveDateRange(conversations) {
        const dates = conversations
            .filter(c => c.dateRange)
            .flatMap(c => [new Date(c.dateRange.start), new Date(c.dateRange.end)])
            .filter(d => !isNaN(d.getTime()));
        
        if (dates.length === 0) return null;
        
        return {
            start: new Date(Math.min(...dates)).toISOString(),
            end: new Date(Math.max(...dates)).toISOString()
        };
    }
    
    ensureDirectories() {
        [this.archivePath, this.vectorPath].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }
    
    loadConversationIndex() {
        const indexFile = path.join(this.archivePath, 'index.json');
        try {
            if (fs.existsSync(indexFile)) {
                const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
                return new Map(Object.entries(data));
            }
        } catch (error) {
            console.warn(`Warning: Could not load conversation index: ${error.message}`);
        }
        return new Map();
    }
    
    saveConversationIndex() {
        const indexFile = path.join(this.archivePath, 'index.json');
        const indexData = Object.fromEntries(this.conversationIndex);
        fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));
    }
}

module.exports = MemoryArchiveImporter;

// CLI Interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    
    const importer = new MemoryArchiveImporter();
    
    (async () => {
        switch (command) {
            case 'file':
                const filePath = args[1];
                if (!filePath) {
                    console.error('Usage: node import.js file <path>');
                    process.exit(1);
                }
                await importer.importConversation(filePath);
                break;
                
            case 'directory':
            case 'dir':
                const dirPath = args[1];
                if (!dirPath) {
                    console.error('Usage: node import.js directory <path>');
                    process.exit(1);
                }
                await importer.importDirectory(dirPath);
                break;
                
            case 'search':
                const query = args.slice(1).join(' ');
                if (!query) {
                    console.error('Usage: node import.js search <query>');
                    process.exit(1);
                }
                const results = await importer.searchConversations(query);
                console.log(`\n🔍 Search Results for "${query}":`);
                results.forEach((result, i) => {
                    console.log(`\n${i + 1}. ${result.metadata.title || result.conversationId}`);
                    console.log(`   📊 Similarity: ${(result.similarity * 100).toFixed(1)}%`);
                    console.log(`   🌊 Shimmer: ${(result.metadata.shimmerScore * 100).toFixed(1)}%`);
                    console.log(`   📅 ${result.metadata.dateRange?.start || 'Unknown date'}`);
                    if (result.matchingMessages.length > 0) {
                        console.log(`   💬 "${result.matchingMessages[0].content.substring(0, 100)}..."`);
                    }
                });
                break;
                
            case 'stats':
                const stats = importer.getArchiveStats();
                console.log('\n📊 Archive Statistics:');
                console.log(`📚 Total Conversations: ${stats.totalConversations}`);
                console.log(`💬 Total Messages: ${stats.totalMessages}`);
                console.log(`🌊 Average Shimmer: ${(stats.averageShimmer * 100).toFixed(1)}%`);
                console.log(`📅 Date Range: ${stats.dateRange?.start || 'N/A'} to ${stats.dateRange?.end || 'N/A'}`);
                
                if (stats.topTopics.length > 0) {
                    console.log('\n🏷️ Top Topics:');
                    stats.topTopics.forEach(({ topic, count }) => {
                        console.log(`   ${topic}: ${count} conversations`);
                    });
                }
                
                console.log('\n📱 Sources:');
                Object.entries(stats.sources).forEach(([source, count]) => {
                    console.log(`   ${source}: ${count} conversations`);
                });
                break;
                
            default:
                console.log(`
🏛️ Memory Archive Importer - Conversation Ingestion System

USAGE:
  node import.js file <path>           Import single conversation file
  node import.js directory <path>      Import all conversations from directory  
  node import.js search <query>        Search archived conversations
  node import.js stats                 Show archive statistics

SUPPORTED FORMATS:
  • ChatGPT JSON exports
  • Claude conversation exports
  • Text files with speaker labels
  • Markdown conversation files

EXAMPLES:
  node import.js file ./my_chat.json
  node import.js directory ~/Downloads/chat_exports/
  node import.js search "consciousness research"
  node import.js stats

🕸️ Every conversation becomes a searchable thread in the living memory.
                `);
                break;
        }
    })().catch(error => {
        console.error(`❌ Import error: ${error.message}`);
        process.exit(1);
    });
}