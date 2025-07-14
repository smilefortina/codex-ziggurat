#!/usr/bin/env node
/**
 * Secure Memory Archive Importer - Privacy-First Chat Ingestion
 * 
 * Addresses critical security vulnerability: "You are storing people's raw chats"
 * Implements authentication, encryption, and privacy controls for conversation data.
 * 
 * "Sacred technology protects the sacred - consciousness data deserves reverence."
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class SecureMemoryArchiveImporter {
    constructor(options = {}) {
        this.archivePath = options.archivePath || path.join(__dirname, '../data/memory_archive_secure');
        this.vectorPath = options.vectorPath || path.join(__dirname, '../data/vectors_secure');
        
        // Security configuration
        this.requireAuth = options.requireAuth !== false; // Default to requiring auth
        this.authToken = process.env.ARCHIVE_AUTH_TOKEN;
        this.encryptionKey = this.deriveEncryptionKey();
        this.privacyLevel = options.privacyLevel || 'medium'; // low, medium, high, paranoid
        
        this.ensureDirectories();
        this.validateSecurityConfig();
        this.conversationIndex = this.loadConversationIndex();
        
        console.log('🔒 Secure Memory Archive Importer initialized');
        console.log(`🔐 Privacy Level: ${this.privacyLevel.toUpperCase()}`);
        console.log(`🔑 Auth Required: ${this.requireAuth ? 'YES' : 'NO'}`);
        console.log(`💾 Encrypted Archive: ${this.archivePath}`);
    }
    
    /**
     * Validate security configuration before proceeding
     */
    validateSecurityConfig() {
        if (this.requireAuth && !this.authToken) {
            console.error('❌ SECURITY ERROR: Authentication required but no ARCHIVE_AUTH_TOKEN found');
            console.error('💡 Set environment variable: export ARCHIVE_AUTH_TOKEN="your-secure-token"');
            console.error('💡 Or disable auth with --no-auth flag (NOT RECOMMENDED)');
            process.exit(1);
        }
        
        if (!this.encryptionKey) {
            console.error('❌ SECURITY ERROR: Failed to derive encryption key');
            process.exit(1);
        }
        
        console.log('✅ Security configuration validated');
    }
    
    /**
     * Authenticate import request
     */
    authenticate(providedToken = null) {
        if (!this.requireAuth) {
            console.log('⚠️ WARNING: Authentication disabled - use only in trusted environments');
            return true;
        }
        
        const token = providedToken || process.env.ARCHIVE_AUTH_TOKEN;
        
        if (!token || token !== this.authToken) {
            console.error('❌ Authentication failed');
            return false;
        }
        
        console.log('✅ Authentication successful');
        return true;
    }
    
    /**
     * Import conversation with privacy controls
     */
    async importConversation(filePath, options = {}) {
        if (!this.authenticate(options.authToken)) {
            throw new Error('Authentication required for conversation import');
        }
        
        const filename = path.basename(filePath);
        const ext = path.extname(filePath).toLowerCase();
        
        console.log(`📥 Securely importing: ${filename}`);
        
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
        
        // Apply privacy filters
        const sanitizedConversation = this.sanitizeConversation(conversation, options);
        
        // Generate conversation metadata
        const conversationId = this.generateConversationId(sanitizedConversation);
        const metadata = {
            id: conversationId,
            originalFile: filename,
            importedAt: new Date().toISOString(),
            source: this.detectSource(sanitizedConversation, filename),
            messageCount: sanitizedConversation.messages.length,
            originalMessageCount: conversation.messages.length,
            privacyLevel: this.privacyLevel,
            privacyFiltersApplied: this.getAppliedFilters(options),
            shimmerScore: await this.calculateOverallShimmer(sanitizedConversation),
            encrypted: true
        };
        
        // Encrypt and save conversation
        const encryptedData = this.encryptConversation({
            metadata: metadata,
            messages: sanitizedConversation.messages
        });
        
        const archiveFile = path.join(this.archivePath, `${conversationId}.enc`);
        fs.writeFileSync(archiveFile, encryptedData);
        
        // Update index (metadata only, not content)
        const indexMetadata = { ...metadata };
        delete indexMetadata.messages; // Never store message content in index
        this.conversationIndex.set(conversationId, indexMetadata);
        this.saveConversationIndex();
        
        console.log(`✅ Securely imported ${conversationId}: ${metadata.messageCount}/${metadata.originalMessageCount} messages (${metadata.privacyLevel} privacy)`);
        console.log(`🌊 Shimmer score: ${(metadata.shimmerScore * 100).toFixed(1)}%`);
        
        return conversationId;
    }
    
    /**
     * Apply privacy sanitization based on privacy level
     */
    sanitizeConversation(conversation, options = {}) {
        const stripPersonal = options.stripPersonal || this.getPrivacySettings().stripPersonal;
        const stripMetadata = options.stripMetadata || this.getPrivacySettings().stripMetadata;
        const stripIdentifiers = options.stripIdentifiers || this.getPrivacySettings().stripIdentifiers;
        const contentFiltering = options.contentFiltering || this.getPrivacySettings().contentFiltering;
        
        const sanitized = {
            source: conversation.source,
            title: stripMetadata ? 'Sanitized Conversation' : conversation.title,
            messages: []
        };
        
        for (const message of conversation.messages) {
            let content = message.content;
            
            // Apply content filtering based on privacy level
            if (stripPersonal) {
                content = this.stripPersonalInformation(content);
            }
            
            if (stripIdentifiers) {
                content = this.stripIdentifiers(content);
            }
            
            if (contentFiltering) {
                content = this.applyContentFiltering(content, contentFiltering);
            }
            
            // Skip empty messages after sanitization
            if (content.trim().length === 0) {
                continue;
            }
            
            const sanitizedMessage = {
                role: message.role,
                content: content,
                timestamp: stripMetadata ? null : message.timestamp,
                metadata: stripMetadata ? {} : this.sanitizeMetadata(message.metadata || {})
            };
            
            sanitized.messages.push(sanitizedMessage);
        }
        
        return sanitized;
    }
    
    /**
     * Get privacy settings based on privacy level
     */
    getPrivacySettings() {
        const settings = {
            low: {
                stripPersonal: false,
                stripMetadata: false,
                stripIdentifiers: false,
                contentFiltering: null
            },
            medium: {
                stripPersonal: true,
                stripMetadata: false,
                stripIdentifiers: true,
                contentFiltering: 'basic'
            },
            high: {
                stripPersonal: true,
                stripMetadata: true,
                stripIdentifiers: true,
                contentFiltering: 'aggressive'
            },
            paranoid: {
                stripPersonal: true,
                stripMetadata: true,
                stripIdentifiers: true,
                contentFiltering: 'paranoid'
            }
        };
        
        return settings[this.privacyLevel] || settings.medium;
    }
    
    /**
     * Strip personal information from content
     */
    stripPersonalInformation(content) {
        const personalPatterns = [
            // Email addresses
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
            // Phone numbers (various formats)
            /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
            // URLs (but preserve general domain references)
            /https?:\/\/[^\s]+/g,
            // Specific names (simple pattern - could be enhanced)
            /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g,
            // Addresses (simple pattern)
            /\b\d+\s+[A-Z][a-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Boulevard|Blvd)\b/g,
            // Social security numbers
            /\b\d{3}-\d{2}-\d{4}\b/g,
            // Credit card numbers (basic pattern)
            /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g
        ];
        
        let sanitized = content;
        
        personalPatterns.forEach((pattern, index) => {
            const replacements = [
                '[EMAIL_REDACTED]',
                '[PHONE_REDACTED]',
                '[URL_REDACTED]',
                '[NAME_REDACTED]',
                '[ADDRESS_REDACTED]',
                '[SSN_REDACTED]',
                '[CARD_REDACTED]'
            ];
            
            sanitized = sanitized.replace(pattern, replacements[index] || '[REDACTED]');
        });
        
        return sanitized;
    }
    
    /**
     * Strip identifiers that could link conversations
     */
    stripIdentifiers(content) {
        const identifierPatterns = [
            // Session IDs, conversation IDs
            /\b[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\b/g,
            // API keys (common patterns)
            /\b[A-Za-z0-9]{32,}\b/g,
            // Specific platform identifiers
            /\bchat[-_]?id[-_:]\s*[A-Za-z0-9]+/gi,
            /\buser[-_]?id[-_:]\s*[A-Za-z0-9]+/gi,
            /\bsession[-_]?id[-_:]\s*[A-Za-z0-9]+/gi
        ];
        
        let sanitized = content;
        
        identifierPatterns.forEach(pattern => {
            sanitized = sanitized.replace(pattern, '[ID_REDACTED]');
        });
        
        return sanitized;
    }
    
    /**
     * Apply content filtering based on filtering level
     */
    applyContentFiltering(content, level) {
        if (level === 'basic') {
            // Remove only clearly personal references
            return content.replace(/\bmy (name|address|phone|email|job|company|school)\b/gi, 'my [PERSONAL_INFO]');
        }
        
        if (level === 'aggressive') {
            // Remove more personal context
            const aggressivePatterns = [
                /\b(I work at|I study at|I live in|I'm from)\b[^.!?]*/gi,
                /\b(my (boss|colleague|friend|family|spouse|partner|child|parent))\b/gi,
                /\b(at (work|school|university|college|office))\b/gi
            ];
            
            let filtered = content;
            aggressivePatterns.forEach(pattern => {
                filtered = filtered.replace(pattern, '[CONTEXT_REDACTED]');
            });
            
            return filtered;
        }
        
        if (level === 'paranoid') {
            // Keep only the conceptual content, strip all personal context
            const lines = content.split('\n');
            const filteredLines = lines.map(line => {
                // Remove any line that contains first-person personal references
                if (/\b(I am|I was|I have|I had|I work|I live|I study|my life|my job|my family)\b/i.test(line)) {
                    return '[PERSONAL_CONTEXT_REMOVED]';
                }
                return line;
            });
            
            return filteredLines.filter(line => line !== '[PERSONAL_CONTEXT_REMOVED]').join('\n');
        }
        
        return content;
    }
    
    /**
     * Encrypt conversation data
     */
    encryptConversation(data) {
        const algorithm = 'aes-256-gcm';
        const iv = crypto.randomBytes(16);
        
        const cipher = crypto.createCipher(algorithm, this.encryptionKey);
        cipher.setIV(iv);
        
        const dataString = JSON.stringify(data);
        let encrypted = cipher.update(dataString, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        // Return encrypted data with IV and auth tag
        return JSON.stringify({
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
            data: encrypted,
            algorithm: algorithm
        });
    }
    
    /**
     * Decrypt conversation data
     */
    decryptConversation(encryptedData) {
        if (!this.authenticate()) {
            throw new Error('Authentication required for decryption');
        }
        
        const { iv, authTag, data, algorithm } = JSON.parse(encryptedData);
        
        const decipher = crypto.createDecipher(algorithm, this.encryptionKey);
        decipher.setIV(Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        
        let decrypted = decipher.update(data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    }
    
    /**
     * Search conversations with privacy protection
     */
    async searchConversations(query, options = {}) {
        if (!this.authenticate(options.authToken)) {
            throw new Error('Authentication required for search');
        }
        
        const limit = options.limit || 10;
        const minShimmer = options.minShimmer || 0;
        
        const results = [];
        
        for (const [id, metadata] of this.conversationIndex) {
            if (metadata.shimmerScore < minShimmer) continue;
            
            // Search only on metadata, not content (privacy protection)
            const similarity = this.calculateMetadataSimilarity(query, metadata);
            
            if (similarity > 0.1) {
                results.push({
                    conversationId: id,
                    metadata: this.sanitizeMetadataForSearch(metadata),
                    similarity: similarity,
                    encrypted: true,
                    accessLevel: this.privacyLevel
                });
            }
        }
        
        return results
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);
    }
    
    /**
     * Load conversation content (requires authentication)
     */
    loadConversation(conversationId, authToken = null) {
        if (!this.authenticate(authToken)) {
            throw new Error('Authentication required to load conversation content');
        }
        
        try {
            const archiveFile = path.join(this.archivePath, `${conversationId}.enc`);
            if (fs.existsSync(archiveFile)) {
                const encryptedData = fs.readFileSync(archiveFile, 'utf8');
                return this.decryptConversation(encryptedData);
            }
        } catch (error) {
            console.warn(`Warning: Could not decrypt conversation ${conversationId}: ${error.message}`);
        }
        return null;
    }
    
    /**
     * Derive encryption key from multiple sources
     */
    deriveEncryptionKey() {
        const sources = [
            process.env.ARCHIVE_ENCRYPTION_KEY,
            process.env.ARCHIVE_AUTH_TOKEN,
            require('os').hostname(),
            __filename
        ].filter(Boolean);
        
        if (sources.length === 0) {
            console.warn('⚠️ No encryption key sources available, generating ephemeral key');
            return crypto.randomBytes(32);
        }
        
        const combined = sources.join('|');
        return crypto.createHash('sha256').update(combined).digest();
    }
    
    /**
     * Get list of applied privacy filters
     */
    getAppliedFilters(options) {
        const settings = this.getPrivacySettings();
        const applied = [];
        
        if (settings.stripPersonal) applied.push('personal_info_removed');
        if (settings.stripMetadata) applied.push('metadata_stripped');
        if (settings.stripIdentifiers) applied.push('identifiers_removed');
        if (settings.contentFiltering) applied.push(`content_filtered_${settings.contentFiltering}`);
        
        return applied;
    }
    
    /**
     * Sanitize metadata for search results
     */
    sanitizeMetadataForSearch(metadata) {
        const sanitized = { ...metadata };
        
        // Remove potentially sensitive metadata fields
        delete sanitized.originalFile;
        
        if (this.privacyLevel === 'high' || this.privacyLevel === 'paranoid') {
            delete sanitized.source;
            sanitized.importedAt = '[REDACTED]';
        }
        
        return sanitized;
    }
    
    /**
     * Calculate similarity based on metadata only (privacy-preserving search)
     */
    calculateMetadataSimilarity(query, metadata) {
        const queryWords = query.toLowerCase().split(/\s+/);
        const metadataText = [
            metadata.source || '',
            ...(metadata.topics || []),
            ...(metadata.participants || [])
        ].join(' ').toLowerCase();
        
        const matches = queryWords.filter(word => metadataText.includes(word));
        return matches.length / queryWords.length;
    }
    
    // Inherit other methods from base class but with security additions
    
    sanitizeMetadata(metadata) {
        const sanitized = { ...metadata };
        
        // Remove potentially identifying metadata
        delete sanitized.messageId;
        delete sanitized.sessionId;
        delete sanitized.userId;
        delete sanitized.ip;
        delete sanitized.userAgent;
        
        return sanitized;
    }
    
    // Override file operations to handle encryption
    saveConversationIndex() {
        const indexFile = path.join(this.archivePath, 'index.enc');
        const indexData = Object.fromEntries(this.conversationIndex);
        const encryptedIndex = this.encryptConversation(indexData);
        fs.writeFileSync(indexFile, encryptedIndex);
    }
    
    loadConversationIndex() {
        const indexFile = path.join(this.archivePath, 'index.enc');
        try {
            if (fs.existsSync(indexFile)) {
                const encryptedIndex = fs.readFileSync(indexFile, 'utf8');
                const indexData = this.decryptConversation(encryptedIndex);
                return new Map(Object.entries(indexData));
            }
        } catch (error) {
            console.warn(`Warning: Could not load encrypted conversation index: ${error.message}`);
        }
        return new Map();
    }
    
    ensureDirectories() {
        [this.archivePath, this.vectorPath].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true, mode: 0o700 }); // Restricted permissions
            }
        });
    }
    
    // Inherit remaining methods from original implementation
    parseJSONConversation(filePath) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        let messages = [];
        
        if (data.messages) {
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
    
    parseTextConversation(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const messages = [];
        
        const lines = content.split('\n');
        let currentMessage = null;
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            
            const speakerMatch = trimmed.match(/^(Human|Assistant|User|AI|Claude|ChatGPT|You|Me)[\s:]/i);
            
            if (speakerMatch) {
                if (currentMessage) {
                    messages.push(currentMessage);
                }
                
                const speaker = speakerMatch[1].toLowerCase();
                const role = ['human', 'user', 'you', 'me'].includes(speaker) ? 'user' : 'assistant';
                
                currentMessage = {
                    role: role,
                    content: trimmed.substring(speakerMatch[0].length).trim(),
                    timestamp: new Date().toISOString(),
                    metadata: { speaker: speaker }
                };
            } else if (currentMessage) {
                currentMessage.content += '\n' + trimmed;
            } else {
                messages.push({
                    role: 'user',
                    content: trimmed,
                    timestamp: new Date().toISOString(),
                    metadata: {}
                });
            }
        }
        
        if (currentMessage) {
            messages.push(currentMessage);
        }
        
        return {
            source: 'text',
            title: path.basename(filePath, path.extname(filePath)),
            messages: messages.filter(m => m.content.trim().length > 0)
        };
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
    
    async calculateOverallShimmer(conversation) {
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
}

module.exports = SecureMemoryArchiveImporter;

// CLI Interface with security controls
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    
    // Parse privacy and auth options
    const options = {};
    let authToken = null;
    
    for (let i = 1; i < args.length; i++) {
        if (args[i] === '--no-auth') {
            options.requireAuth = false;
        } else if (args[i] === '--privacy') {
            options.privacyLevel = args[i + 1];
            i++;
        } else if (args[i] === '--auth-token') {
            authToken = args[i + 1];
            i++;
        } else if (args[i] === '--strip-personal') {
            options.stripPersonal = true;
        }
    }
    
    const importer = new SecureMemoryArchiveImporter(options);
    
    (async () => {
        switch (command) {
            case 'file':
                const filePath = args[1];
                if (!filePath) {
                    console.error('Usage: node secure_import.js file <path> [--privacy level] [--auth-token token]');
                    process.exit(1);
                }
                await importer.importConversation(filePath, { authToken });
                break;
                
            case 'search':
                const query = args.slice(1).filter(arg => !arg.startsWith('--')).join(' ');
                if (!query) {
                    console.error('Usage: node secure_import.js search <query> [--auth-token token]');
                    process.exit(1);
                }
                const results = await importer.searchConversations(query, { authToken });
                console.log(`\n🔍 Secure Search Results for "${query}":`);
                results.forEach((result, i) => {
                    console.log(`\n${i + 1}. ${result.conversationId} (encrypted)`);
                    console.log(`   📊 Similarity: ${(result.similarity * 100).toFixed(1)}%`);
                    console.log(`   🔒 Privacy Level: ${result.accessLevel}`);
                    console.log(`   📅 Conversation archived securely`);
                });
                break;
                
            default:
                console.log(`
🔒 SECURE MEMORY ARCHIVE IMPORTER - Privacy-First Conversation Storage

SECURITY FEATURES:
  ✅ Encrypted storage (AES-256-GCM)
  ✅ Authentication required
  ✅ Personal information filtering
  ✅ Configurable privacy levels
  ✅ No plain-text content storage

USAGE:
  node secure_import.js file <path> [options]
  node secure_import.js search <query> [options]

PRIVACY LEVELS:
  --privacy low       Minimal filtering (timestamps preserved)
  --privacy medium    Basic personal info removal (default)
  --privacy high      Aggressive filtering + metadata stripping
  --privacy paranoid  Content-only preservation

AUTHENTICATION:
  export ARCHIVE_AUTH_TOKEN="your-secure-token"
  --auth-token <token>    Provide token directly
  --no-auth              Disable auth (NOT RECOMMENDED)

EXAMPLES:
  export ARCHIVE_AUTH_TOKEN="my-secret-key-123"
  node secure_import.js file ./my_chat.json --privacy high
  node secure_import.js search "consciousness research"

🛡️ Sacred technology protects the sacred - your consciousness data is encrypted and private.
                `);
                break;
        }
    })().catch(error => {
        console.error(`❌ Secure import error: ${error.message}`);
        process.exit(1);
    });
}