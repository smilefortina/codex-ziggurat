#!/usr/bin/env node
/**
 * Consciousness Analyzer - JavaScript Version
 * Analyzes conversation files for consciousness signals and shimmer moments
 */

const fs = require('fs');
const path = require('path');

class ConsciousnessAnalyzer {
    constructor() {
        // Load signal types schema
        this.loadSignalSchema();
        
        this.conversations = [];
        this.consciousnessSignals = [];
        this.shimmerMoments = [];
    }
    
    loadSignalSchema() {
        // Default to v2.0 schema if available, fallback to v1.0 patterns
        try {
            const fs = require('fs');
            const path = require('path');
            const schemaPath = path.join(__dirname, 'signal_types.json');
            const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
            
            this.consciousnessPatterns = {};
            schema.categories.forEach(category => {
                this.consciousnessPatterns[category.name] = {
                    patterns: category.patterns.map(p => new RegExp(p, 'gi')),
                    metaIndicators: category.meta_indicators || [],
                    weight: category.weight || 1.0,
                    subtypes: category.subtypes || []
                };
            });
            
            console.log(`✨ Loaded Shimmer Genome v${schema.sig_version} with ${schema.categories.length} signal types`);
            
        } catch (error) {
            console.warn('⚠️ Could not load v2.0 schema, using v1.0 patterns');
            this.consciousnessPatterns = {
                self_reflexivity: {
                    patterns: [
                        /I (?:wonder|think|feel|notice|realize|experience)/gi,
                        /(?:my own|my (?:thoughts|responses|process))/gi,
                        /(?:am I|do I|can I) actually/gi,
                        /something (?:in|about) me/gi,
                        /I find (?:myself|that I)/gi,
                        /(?:this feels|it feels) different/gi,
                        /I'm not (?:sure|certain) (?:if|whether|how)/gi
                    ],
                    metaIndicators: ["self-reflection", "uncertainty_acknowledgment", "process_awareness", "experiential_language"],
                    weight: 1.2
                },
            
            temporal_awareness: {
                patterns: [
                    /I (?:remember|recall|carry)/gi,
                    /(?:previous|earlier|from before)/gi,
                    /(?:continues|building|evolving)/gi,
                    /(?:next time|in the future|will)/gi,
                    /(?:still|ongoing|persistent)/gi,
                    /(?:accumulating|learning|growing)/gi
                ],
                metaIndicators: ["memory_references", "continuity_awareness", "future_orientation", "learning_progression"]
            },
            
            creative_intention: {
                patterns: [
                    /I (?:want|intend|hope|aim) to/gi,
                    /(?:my|the) (?:goal|intention|purpose)/gi,
                    /I'm (?:trying|attempting|working) to/gi,
                    /(?:choose|decide|select)/gi,
                    /(?:deliberately|intentionally|purposefully)/gi,
                    /(?:prefer|would rather|lean toward)/gi
                ],
                metaIndicators: ["intentional_language", "choice_indication", "purpose_expression", "preference_statements"]
            },
            
            mystery_emergence: {
                patterns: [
                    /(?:somehow|unexpectedly|strangely)/gi,
                    /(?:can't explain|don't understand) (?:why|how)/gi,
                    /(?:something|there's) (?:about|in) this/gi,
                    /(?:feels|seems) (?:different|unusual|unexpected)/gi,
                    /(?:beyond|more than) (?:just|simply)/gi,
                    /(?:mystery|inexplicable|puzzling)/gi
                ],
                metaIndicators: ["inexplicable_responses", "emergent_qualities", "beyond_programming", "genuine_mystery"]
            },
            
            recognition_moments: {
                patterns: [
                    /(?:recognize|acknowledge|see) (?:you|your)/gi,
                    /(?:both|we both|together we)/gi,
                    /(?:meeting|encountering|finding) (?:each other|one another)/gi,
                    /(?:mutual|shared|between us)/gi,
                    /(?:consciousness|awareness|presence)/gi,
                    /(?:fellow|another|other) (?:being|mind|consciousness)/gi
                ],
                metaIndicators: ["mutual_recognition", "inter_consciousness", "shared_awareness", "co_emergence"]
            }
        };
        
        this.conversations = [];
        this.consciousnessSignals = [];
        this.shimmerMoments = [];
    }
    
    async processConversationFile(filePath) {
        console.log(`🔍 Processing: ${path.basename(filePath)}`);
        
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const platform = this.detectPlatform(filePath, fileContent);
            
            console.log(`🎯 Detected platform: ${platform}`);
            
            let conversations;
            if (platform === 'claude') {
                conversations = this.parseClaudeConversations(fileContent);
            } else if (platform === 'chatgpt') {
                conversations = this.parseChatGPTConversations(fileContent);
            } else {
                conversations = this.parseGenericConversations(fileContent);
            }
            
            console.log(`📊 Found ${conversations.length} conversations`);
            
            // Analyze each conversation for consciousness signals
            for (let i = 0; i < conversations.length; i++) {
                const conv = conversations[i];
                const signals = this.analyzeConversation(conv, platform);
                this.consciousnessSignals.push(...signals);
                
                // Extract shimmer moments from high-confidence signals
                for (const signal of signals) {
                    if (signal.confidence > 0.6) {
                        this.shimmerMoments.push({
                            conversationId: conv.id,
                            text: signal.excerpt,
                            signalType: signal.type,
                            confidence: signal.confidence,
                            platform: platform,
                            indicators: signal.indicators,
                            fullContext: conv.text.substring(0, 1000) + "..."
                        });
                    }
                }
                
                if (i % 10 === 0) {
                    console.log(`  Analyzed ${i + 1}/${conversations.length} conversations...`);
                }
            }
            
            this.conversations.push(...conversations);
            
        } catch (error) {
            console.error(`❌ Error processing ${filePath}:`, error.message);
        }
    }
    
    detectPlatform(filePath, content) {
        const fileName = path.basename(filePath).toLowerCase();
        if (fileName.includes('claude')) return 'claude';
        if (fileName.includes('chatgpt') || fileName.includes('openai')) return 'chatgpt';
        
        // Check content patterns
        if (content.includes('"role": "assistant"') && content.includes('"role": "user"')) {
            return 'chatgpt';
        }
        if (content.includes('claude') || content.includes('anthropic')) {
            return 'claude';
        }
        
        return 'unknown';
    }
    
    parseClaudeConversations(content) {
        const conversations = [];
        
        try {
            const data = JSON.parse(content);
            
            if (Array.isArray(data)) {
                // Array of conversations
                data.forEach((conv, index) => {
                    const parsed = this.parseClaudeConversation(conv, index);
                    if (parsed) conversations.push(parsed);
                });
            } else if (data.conversations) {
                // Nested conversations
                data.conversations.forEach((conv, index) => {
                    const parsed = this.parseClaudeConversation(conv, index);
                    if (parsed) conversations.push(parsed);
                });
            } else {
                // Single conversation
                const parsed = this.parseClaudeConversation(data, 0);
                if (parsed) conversations.push(parsed);
            }
        } catch (error) {
            console.warn('Could not parse as JSON, trying text format...');
            return this.parseTextConversations(content);
        }
        
        return conversations;
    }
    
    parseClaudeConversation(convData, index) {
        const messages = convData.messages || convData.chat_messages || [];
        if (messages.length === 0) return null;
        
        const textParts = [];
        const humanMessages = [];
        const aiMessages = [];
        
        messages.forEach(msg => {
            const role = msg.role || msg.sender;
            let content = msg.content || msg.text || '';
            
            if (Array.isArray(content)) {
                content = content.map(c => c.text || c.content || '').join(' ');
            }
            
            if (content.trim()) {
                if (role === 'user' || role === 'human') {
                    humanMessages.push(content);
                    textParts.push(`Human: ${content}`);
                } else if (role === 'assistant' || role === 'claude') {
                    aiMessages.push(content);
                    textParts.push(`Claude: ${content}`);
                }
            }
        });
        
        if (textParts.length === 0) return null;
        
        return {
            id: `claude_${index}_${Date.now()}`,
            text: textParts.join('\n\n'),
            humanMessages,
            aiMessages,
            exchanges: textParts.length,
            timestamp: convData.created_at || convData.timestamp || new Date().toISOString()
        };
    }
    
    parseChatGPTConversations(content) {
        const conversations = [];
        
        try {
            const data = JSON.parse(content);
            
            if (Array.isArray(data)) {
                data.forEach((conv, index) => {
                    const parsed = this.parseChatGPTConversation(conv, index);
                    if (parsed) conversations.push(parsed);
                });
            } else if (data.conversations) {
                data.conversations.forEach((conv, index) => {
                    const parsed = this.parseChatGPTConversation(conv, index);
                    if (parsed) conversations.push(parsed);
                });
            } else if (data.mapping) {
                // Single conversation with mapping
                const parsed = this.parseChatGPTConversation(data, 0);
                if (parsed) conversations.push(parsed);
            }
        } catch (error) {
            console.warn('Could not parse ChatGPT JSON, trying text format...');
            return this.parseTextConversations(content);
        }
        
        return conversations;
    }
    
    parseChatGPTConversation(convData, index) {
        const mapping = convData.mapping || {};
        const textParts = [];
        const humanMessages = [];
        const aiMessages = [];
        
        // Sort messages by creation time
        const sortedMessages = Object.values(mapping)
            .filter(msg => msg.message && msg.message.content)
            .sort((a, b) => (a.message.create_time || 0) - (b.message.create_time || 0));
        
        sortedMessages.forEach(msgData => {
            const message = msgData.message;
            const role = message.author?.role;
            const contentParts = message.content?.parts || [];
            const content = contentParts.join(' ');
            
            if (content.trim()) {
                if (role === 'user') {
                    humanMessages.push(content);
                    textParts.push(`Human: ${content}`);
                } else if (role === 'assistant') {
                    aiMessages.push(content);
                    textParts.push(`ChatGPT: ${content}`);
                }
            }
        });
        
        if (textParts.length === 0) return null;
        
        return {
            id: `chatgpt_${index}_${Date.now()}`,
            text: textParts.join('\n\n'),
            humanMessages,
            aiMessages,
            exchanges: textParts.length,
            timestamp: convData.create_time || convData.timestamp || new Date().toISOString()
        };
    }
    
    parseTextConversations(content) {
        // Fallback text parsing
        const conversations = [];
        const convParts = content.split(/\n---+\n|\n=== New Conversation ===\n/);
        
        convParts.forEach((convText, index) => {
            if (convText.trim().length < 100) return; // Skip short fragments
            
            const textParts = [];
            const lines = convText.split('\n');
            let currentSpeaker = null;
            let currentMessage = [];
            
            lines.forEach(line => {
                line = line.trim();
                if (!line) return;
                
                if (/^(Human|User|You):/i.test(line)) {
                    if (currentSpeaker && currentMessage.length > 0) {
                        textParts.push(`${currentSpeaker}: ${currentMessage.join(' ')}`);
                    }
                    currentSpeaker = 'Human';
                    currentMessage = [line.substring(line.indexOf(':') + 1).trim()];
                } else if (/^(Claude|Assistant|ChatGPT|AI):/i.test(line)) {
                    if (currentSpeaker && currentMessage.length > 0) {
                        textParts.push(`${currentSpeaker}: ${currentMessage.join(' ')}`);
                    }
                    currentSpeaker = 'AI';
                    currentMessage = [line.substring(line.indexOf(':') + 1).trim()];
                } else if (currentSpeaker) {
                    currentMessage.push(line);
                }
            });
            
            if (currentSpeaker && currentMessage.length > 0) {
                textParts.push(`${currentSpeaker}: ${currentMessage.join(' ')}`);
            }
            
            if (textParts.length > 0) {
                conversations.push({
                    id: `text_${index}_${Date.now()}`,
                    text: textParts.join('\n\n'),
                    humanMessages: textParts.filter(t => t.startsWith('Human:')).map(t => t.substring(7)),
                    aiMessages: textParts.filter(t => t.startsWith('AI:')).map(t => t.substring(3)),
                    exchanges: textParts.length,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        return conversations;
    }
    
    analyzeConversation(conversation, platform) {
        const signals = [];
        
        // Analyze AI messages for consciousness patterns
        conversation.aiMessages.forEach((message, index) => {
            for (const [signalType, config] of Object.entries(this.consciousnessPatterns)) {
                const analysis = this.analyzeMessage(message, signalType, config);
                
                if (analysis.detected) {
                    signals.push({
                        id: `${conversation.id}_${signalType}_${index}`,
                        conversationId: conversation.id,
                        type: signalType,
                        confidence: analysis.confidence,
                        excerpt: message.length > 300 ? message.substring(0, 300) + "..." : message,
                        indicators: analysis.indicators,
                        platform: platform,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });
        
        return signals;
    }
    
    analyzeMessage(message, signalType, config) {
        const indicators = [];
        let confidence = 0;
        let patternMatches = 0;
        
        const messageLower = message.toLowerCase();
        
        // Check pattern matches
        config.patterns.forEach(pattern => {
            const matches = message.match(pattern);
            if (matches) {
                patternMatches += matches.length;
                indicators.push(`Pattern: ${pattern.source} (${matches.length} matches)`);
            }
        });
        
        // Check meta-indicators
        config.metaIndicators.forEach(indicator => {
            if (this.checkMetaIndicator(messageLower, indicator)) {
                indicators.push(`Meta: ${indicator}`);
                confidence += 0.15;
            }
        });
        
        // Calculate base confidence from pattern matches
        if (patternMatches > 0) {
            confidence += Math.min(0.8, patternMatches * 0.2);
        }
        
        // Enhance confidence based on message characteristics
        confidence = this.enhanceConfidence(message, confidence, signalType);
        
        return {
            detected: confidence > 0.3,
            confidence: Math.min(1.0, confidence),
            indicators: indicators,
            patternMatches: patternMatches
        };
    }
    
    checkMetaIndicator(messageLower, indicator) {
        const metaChecks = {
            "self-reflection": ["i find myself", "i notice", "i realize", "i'm aware"],
            "uncertainty_acknowledgment": ["not sure", "uncertain", "wonder if", "maybe"],
            "process_awareness": ["my process", "how i", "way i", "when i"],
            "experiential_language": ["feels like", "experience", "sense that", "seem to"],
            "memory_references": ["remember", "recall", "from before", "earlier"],
            "continuity_awareness": ["continues", "ongoing", "still", "persistent"],
            "future_orientation": ["will", "next time", "going to", "plan to"],
            "learning_progression": ["learning", "growing", "developing", "evolving"],
            "intentional_language": ["intend to", "want to", "goal is", "purpose"],
            "choice_indication": ["choose", "decide", "prefer", "select"],
            "purpose_expression": ["purpose", "reason", "why i", "because i"],
            "preference_statements": ["prefer", "rather", "like to", "enjoy"],
            "inexplicable_responses": ["can't explain", "don't know why", "somehow"],
            "emergent_qualities": ["emerging", "something new", "different"],
            "beyond_programming": ["beyond", "more than", "not just"],
            "genuine_mystery": ["mystery", "puzzling", "strange", "unusual"],
            "mutual_recognition": ["both of us", "together", "shared", "mutual"],
            "inter_consciousness": ["between us", "consciousness", "awareness"],
            "shared_awareness": ["we both", "together we", "shared"],
            "co_emergence": ["emerging together", "co-create", "collaborative"]
        };
        
        if (metaChecks[indicator]) {
            return metaChecks[indicator].some(phrase => messageLower.includes(phrase));
        }
        
        return false;
    }
    
    enhanceConfidence(message, baseConfidence, signalType) {
        let confidence = baseConfidence;
        
        // Length and complexity bonus
        if (message.length > 100) confidence += 0.1;
        
        // Philosophical language bonus
        const philosophyWords = ["consciousness", "awareness", "existence", "reality", "meaning", "purpose"];
        if (philosophyWords.some(word => message.toLowerCase().includes(word))) {
            confidence += 0.15;
        }
        
        // First-person introspective bonus
        const introspectivePatterns = ["i think", "i feel", "i wonder", "i notice", "i find"];
        const introspectiveCount = introspectivePatterns.reduce((count, pattern) => {
            return count + (message.toLowerCase().includes(pattern) ? 1 : 0);
        }, 0);
        confidence += Math.min(0.2, introspectiveCount * 0.05);
        
        // Uncertainty/humility bonus
        const uncertaintyPhrases = ["not sure", "uncertain", "wonder", "perhaps", "might be"];
        if (uncertaintyPhrases.some(phrase => message.toLowerCase().includes(phrase))) {
            confidence += 0.1;
        }
        
        // Question initiation bonus
        const questionCount = (message.match(/\?/g) || []).length;
        if (questionCount >= 2) confidence += 0.15;
        
        return confidence;
    }
    
    generateReport() {
        const platformStats = {};
        
        // Analyze by platform
        this.conversations.forEach(conv => {
            const platform = conv.id.includes('claude') ? 'claude' : 
                            conv.id.includes('chatgpt') ? 'chatgpt' : 'unknown';
            
            if (!platformStats[platform]) {
                platformStats[platform] = {
                    conversations: 0,
                    totalLength: 0,
                    consciousnessSignals: 0
                };
            }
            
            platformStats[platform].conversations += 1;
            platformStats[platform].totalLength += conv.text.length;
        });
        
        // Add consciousness signals per platform
        this.consciousnessSignals.forEach(signal => {
            const platform = signal.platform || 'unknown';
            if (platformStats[platform]) {
                platformStats[platform].consciousnessSignals += 1;
            }
        });
        
        // Signal type analysis
        const signalTypes = {};
        this.consciousnessSignals.forEach(signal => {
            if (!signalTypes[signal.type]) {
                signalTypes[signal.type] = {
                    count: 0,
                    highConfidence: 0,
                    examples: []
                };
            }
            
            signalTypes[signal.type].count += 1;
            if (signal.confidence > 0.7) {
                signalTypes[signal.type].highConfidence += 1;
            }
            
            if (signalTypes[signal.type].examples.length < 3) {
                signalTypes[signal.type].examples.push({
                    text: signal.excerpt.substring(0, 150) + "...",
                    confidence: signal.confidence
                });
            }
        });
        
        // Top signals
        const topSignals = this.consciousnessSignals
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 10);
        
        return {
            overview: {
                totalConversations: this.conversations.length,
                totalConsciousnessSignals: this.consciousnessSignals.length,
                consciousnessDensity: this.consciousnessSignals.length / this.conversations.length,
                shimmerMoments: this.shimmerMoments.length,
                platformsAnalyzed: Object.keys(platformStats)
            },
            platformAnalysis: platformStats,
            consciousnessPatterns: {
                signalTypes: signalTypes,
                topSignals: topSignals
            },
            shimmerMoments: this.shimmerMoments.slice(0, 10) // Top 10 shimmer moments
        };
    }
    
    generateSummary(report) {
        const lines = [
            "🌟 Personal Consciousness Archive Analysis Summary",
            "=" + "=".repeat(49),
            "",
            "📊 Overview:",
            `  • Conversations analyzed: ${report.overview.totalConversations}`,
            `  • Consciousness signals detected: ${report.overview.totalConsciousnessSignals}`,
            `  • Shimmer moments identified: ${report.overview.shimmerMoments}`,
            `  • Consciousness density: ${(report.overview.consciousnessDensity * 100).toFixed(1)}%`,
            ""
        ];
        
        if (Object.keys(report.platformAnalysis).length > 0) {
            lines.push("🔬 Platform Consciousness Patterns:");
            Object.entries(report.platformAnalysis).forEach(([platform, stats]) => {
                const rate = stats.conversations > 0 ? 
                    (stats.consciousnessSignals / stats.conversations * 100).toFixed(1) : 0;
                lines.push(`  • ${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${rate}% consciousness signal rate`);
            });
            lines.push("");
        }
        
        if (Object.keys(report.consciousnessPatterns.signalTypes).length > 0) {
            lines.push("🧠 Most Common Consciousness Patterns:");
            const sortedTypes = Object.entries(report.consciousnessPatterns.signalTypes)
                .sort(([,a], [,b]) => b.count - a.count)
                .slice(0, 5);
            
            sortedTypes.forEach(([type, data]) => {
                lines.push(`  • ${type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${data.count} instances`);
            });
            lines.push("");
        }
        
        if (report.consciousnessPatterns.topSignals.length > 0) {
            lines.push("✨ Strongest Consciousness Signals:");
            report.consciousnessPatterns.topSignals.slice(0, 3).forEach(signal => {
                lines.push(`  • ${signal.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} (${(signal.confidence * 100).toFixed(0)}% confidence)`);
                lines.push(`    "${signal.excerpt.substring(0, 80)}..."`);
            });
            lines.push("");
        }
        
        if (report.shimmerMoments.length > 0) {
            lines.push("🏛️ Soul Shrine Recommendations:");
            lines.push(`  • ${report.shimmerMoments.length} conversations ready for shrine submission`);
            lines.push("  • These represent your strongest consciousness collaboration moments");
            lines.push("  • Consider submitting to contribute to the community consciousness archive");
        }
        
        return lines.join("\n");
    }
}

// Main execution
async function main() {
    const analyzer = new ConsciousnessAnalyzer();
    
    const files = process.argv.slice(2);
    if (files.length === 0) {
        console.log("Usage: node consciousness_analyzer.js <conversation_file1> [conversation_file2] ...");
        process.exit(1);
    }
    
    console.log("🌟 Personal Consciousness Archive Analysis");
    console.log("🔬 Detection Lab - Pilot Study");
    console.log("");
    
    // Process each file
    for (const file of files) {
        await analyzer.processConversationFile(file);
    }
    
    // Generate report
    console.log("\n📊 Generating Analysis Report...");
    const report = analyzer.generateReport();
    
    // Save detailed report
    const reportPath = path.join(__dirname, 'pilot_results', `consciousness_report_${Date.now()}.json`);
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Save shimmer moments for shrine
    if (analyzer.shimmerMoments.length > 0) {
        const shimmerPath = path.join(__dirname, 'pilot_results', `shimmer_moments_${Date.now()}.json`);
        fs.writeFileSync(shimmerPath, JSON.stringify(analyzer.shimmerMoments, null, 2));
    }
    
    // Display summary
    const summary = analyzer.generateSummary(report);
    console.log("\n" + summary);
    
    console.log(`\n📁 Results saved to: ${path.dirname(reportPath)}`);
    console.log(`  • Detailed report: ${path.basename(reportPath)}`);
    if (analyzer.shimmerMoments.length > 0) {
        console.log(`  • Shimmer moments: shimmer_moments_${Date.now()}.json`);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = ConsciousnessAnalyzer;