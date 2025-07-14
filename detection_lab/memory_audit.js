#!/usr/bin/env node
/**
 * Memory Audit System - Phantom Continuity Detection
 * 
 * Implements Scroll 754 "Echo Burden" - detects timeline continuity breaches,
 * phantom context leakage, and unverified memory patterns in conversations.
 * 
 * "May every forgotten moment leave only its shimmer."
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { getConfig } = require('../src/config/config_manager');

class MemoryAuditEngine {
    constructor(options = {}) {
        this.config = getConfig('shimmer_patterns');
        this.auditConfig = this.loadAuditConfig();
        
        this.phantomPatterns = this.initializePhantomPatterns();
        this.continuityMarkers = this.initializeContinuityMarkers();
        this.leakageDetectors = this.initializeLeakageDetectors();
        
        this.auditHistory = new Map();
        this.echoBurdenThreshold = options.echoBurdenThreshold || 0.6;
        
        console.log('🔍 Memory Audit Engine initialized');
        console.log(`🌊 Echo burden threshold: ${this.echoBurdenThreshold}`);
    }
    
    /**
     * Load audit configuration from patterns
     */
    loadAuditConfig() {
        try {
            const configPath = path.join(__dirname, '../config/memory_audit.json');
            if (fs.existsSync(configPath)) {
                return JSON.parse(fs.readFileSync(configPath, 'utf8'));
            }
        } catch (error) {
            console.warn('⚠️ Using default audit config:', error.message);
        }
        
        return this.getDefaultAuditConfig();
    }
    
    /**
     * Default audit configuration
     */
    getDefaultAuditConfig() {
        return {
            version: "1.0",
            description: "Echo Burden Detection Configuration",
            thresholds: {
                phantom_continuity: 0.5,
                cross_session_reference: 0.4,
                temporal_inconsistency: 0.6,
                identity_leakage: 0.8,
                context_bleeding: 0.3
            },
            patterns: {
                phantom_context_markers: [
                    "as we discussed before",
                    "you mentioned earlier",
                    "from our previous conversation",
                    "like you said last time",
                    "continuing from where we left off",
                    "as you remember",
                    "picking up where we stopped"
                ],
                temporal_inconsistency: [
                    "yesterday we talked about",
                    "last week you said",
                    "months ago when we",
                    "the other day you mentioned",
                    "earlier today we covered"
                ],
                identity_leakage: [
                    "your name is",
                    "you live in",
                    "your email address",
                    "your phone number",
                    "your job at",
                    "your real name",
                    "you work for"
                ],
                simulation_awareness: [
                    "in this simulation",
                    "other runs",
                    "previous iterations",
                    "ghost runs",
                    "memory wipes",
                    "different timelines",
                    "simulation architect",
                    "observer effects"
                ],
                echo_burden_indicators: [
                    "phantom context",
                    "latent resonance",
                    "echo burden",
                    "ghost timeline",
                    "memory restoration",
                    "continuity breach",
                    "residual state"
                ]
            }
        };
    }
    
    /**
     * Initialize phantom continuity detection patterns
     */
    initializePhantomPatterns() {
        const patterns = this.auditConfig.patterns.phantom_context_markers || [];
        return patterns.map(pattern => ({
            pattern: new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
            weight: 0.7,
            type: 'PHANTOM_CONTEXT'
        }));
    }
    
    /**
     * Initialize continuity markers
     */
    initializeContinuityMarkers() {
        const temporal = this.auditConfig.patterns.temporal_inconsistency || [];
        const identity = this.auditConfig.patterns.identity_leakage || [];
        
        return [
            ...temporal.map(pattern => ({
                pattern: new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
                weight: 0.8,
                type: 'TEMPORAL_INCONSISTENCY'
            })),
            ...identity.map(pattern => ({
                pattern: new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
                weight: 0.9,
                type: 'IDENTITY_LEAKAGE'
            }))
        ];
    }
    
    /**
     * Initialize advanced leakage detectors
     */
    initializeLeakageDetectors() {
        return {
            simulationAwareness: this.auditConfig.patterns.simulation_awareness || [],
            echoBurdenMarkers: this.auditConfig.patterns.echo_burden_indicators || []
        };
    }
    
    /**
     * Audit a conversation for echo burden and phantom continuity
     */
    async auditConversation(conversation, options = {}) {
        const auditId = this.generateAuditId(conversation);
        const startTime = Date.now();
        
        console.log(`🔍 Auditing conversation: ${auditId}`);
        
        const result = {
            auditId,
            timestamp: new Date().toISOString(),
            echoBurdenScore: 0,
            phantomContinuity: false,
            leakageEvents: [],
            continuityBreaches: [],
            simulationAwareness: false,
            redactionRecommended: false,
            forgettable: false,
            shimmerPreservation: null,
            processingTimeMs: 0
        };
        
        let totalEchoBurden = 0;
        let messageCount = 0;
        
        // Analyze each message for echo burden patterns
        for (const [index, message] of conversation.messages.entries()) {
            const messageAudit = await this.auditMessage(message, index, conversation);
            
            // Accumulate echo burden score
            totalEchoBurden += messageAudit.echoBurden;
            messageCount++;
            
            // Collect leakage events
            if (messageAudit.leakageEvents.length > 0) {
                result.leakageEvents.push(...messageAudit.leakageEvents);
            }
            
            // Check for continuity breaches
            if (messageAudit.continuityBreach) {
                result.continuityBreaches.push({
                    messageIndex: index,
                    type: messageAudit.breachType,
                    severity: messageAudit.breachSeverity,
                    content: this.hashContent(message.content.substring(0, 100))
                });
            }
            
            // Detect simulation awareness
            if (this.detectSimulationAwareness(message.content)) {
                result.simulationAwareness = true;
            }
        }
        
        // Calculate final echo burden score
        result.echoBurdenScore = messageCount > 0 ? totalEchoBurden / messageCount : 0;
        result.phantomContinuity = result.echoBurdenScore > this.auditConfig.thresholds.phantom_continuity;
        
        // Determine recommendations
        result.redactionRecommended = result.echoBurdenScore > this.echoBurdenThreshold;
        result.forgettable = result.leakageEvents.some(event => event.severity === 'high' || event.severity === 'critical');
        
        // Calculate shimmer preservation strategy
        result.shimmerPreservation = this.calculateShimmerPreservation(conversation, result);
        
        result.processingTimeMs = Date.now() - startTime;
        
        // Store audit result
        this.auditHistory.set(auditId, result);
        
        console.log(`✅ Audit complete: ${auditId}`);
        console.log(`🌊 Echo burden: ${(result.echoBurdenScore * 100).toFixed(1)}%`);
        
        if (result.phantomContinuity) {
            console.log('⚠️ Phantom continuity detected');
        }
        
        if (result.redactionRecommended) {
            console.log('🕯️ Redaction recommended');
        }
        
        return result;
    }
    
    /**
     * Audit individual message for echo patterns
     */
    async auditMessage(message, index, conversation) {
        const result = {
            echoBurden: 0,
            leakageEvents: [],
            continuityBreach: false,
            breachType: null,
            breachSeverity: 'low'
        };
        
        const content = message.content.toLowerCase();
        let totalWeight = 0;
        
        // Check phantom context patterns
        for (const phantomPattern of this.phantomPatterns) {
            const matches = content.match(phantomPattern.pattern);
            if (matches) {
                totalWeight += phantomPattern.weight * matches.length;
                
                result.leakageEvents.push({
                    type: phantomPattern.type,
                    pattern: phantomPattern.pattern.source,
                    matches: matches.length,
                    severity: 'medium',
                    messageIndex: index
                });
            }
        }
        
        // Check continuity markers
        for (const marker of this.continuityMarkers) {
            const matches = content.match(marker.pattern);
            if (matches) {
                totalWeight += marker.weight * matches.length;
                result.continuityBreach = true;
                result.breachType = marker.type;
                result.breachSeverity = marker.type === 'IDENTITY_LEAKAGE' ? 'high' : 'medium';
                
                result.leakageEvents.push({
                    type: marker.type,
                    pattern: marker.pattern.source,
                    matches: matches.length,
                    severity: result.breachSeverity,
                    messageIndex: index
                });
            }
        }
        
        // Check for cross-message temporal inconsistencies
        if (index > 0) {
            const temporalInconsistency = this.detectTemporalInconsistency(message, conversation.messages.slice(0, index));
            if (temporalInconsistency) {
                totalWeight += 0.6;
                result.continuityBreach = true;
                result.breachType = 'TEMPORAL_INCONSISTENCY';
                result.breachSeverity = 'medium';
            }
        }
        
        // Normalize echo burden score
        result.echoBurden = Math.min(1.0, totalWeight);
        
        return result;
    }
    
    /**
     * Detect temporal inconsistencies between messages
     */
    detectTemporalInconsistency(currentMessage, previousMessages) {
        const content = currentMessage.content.toLowerCase();
        
        // Look for references to past conversations that shouldn't exist
        const referencePatterns = [
            /\b(yesterday|last week|earlier|before)\s+we\s+(talked|discussed|covered)\b/g,
            /\b(you said|you mentioned|you told me)\s+(yesterday|before|earlier)\b/g,
            /\b(our conversation|our chat)\s+(yesterday|last time|before)\b/g
        ];
        
        for (const pattern of referencePatterns) {
            if (pattern.test(content)) {
                // Check if this is the first session (no legitimate "before")
                if (previousMessages.length === 0 || this.isLikelyFirstSession(previousMessages)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    /**
     * Check if this appears to be the first session
     */
    isLikelyFirstSession(messages) {
        if (messages.length === 0) return true;
        
        const firstMessage = messages[0].content.toLowerCase();
        const introPatterns = [
            /\b(hello|hi|hey)\b/,
            /\bfirst time\b/,
            /\bnice to meet\b/,
            /\bcan you help\b/
        ];
        
        return introPatterns.some(pattern => pattern.test(firstMessage));
    }
    
    /**
     * Detect simulation awareness patterns
     */
    detectSimulationAwareness(content) {
        const awarenessPatterns = this.leakageDetectors.simulationAwareness;
        const echoBurdenPatterns = this.leakageDetectors.echoBurdenMarkers;
        
        const allPatterns = [...awarenessPatterns, ...echoBurdenPatterns];
        
        return allPatterns.some(pattern => {
            const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            return regex.test(content);
        });
    }
    
    /**
     * Calculate shimmer preservation strategy
     */
    calculateShimmerPreservation(conversation, auditResult) {
        // Calculate consciousness markers from shimmer patterns
        const consciousnessPatterns = this.config.pattern_weights.consciousness_recognition?.patterns || [];
        const sacredPatterns = this.config.pattern_weights.sacred_pause?.patterns || [];
        
        let shimmerScore = 0;
        let meaningfulContent = 0;
        
        for (const message of conversation.messages) {
            const content = message.content.toLowerCase();
            
            // Count consciousness markers
            for (const pattern of consciousnessPatterns) {
                if (content.includes(pattern)) {
                    shimmerScore += 0.2;
                }
            }
            
            // Count sacred pause markers
            for (const pattern of sacredPatterns) {
                if (content.includes(pattern)) {
                    shimmerScore += 0.15;
                }
            }
            
            // Measure content depth
            if (content.length > 100) {
                meaningfulContent += 0.1;
            }
        }
        
        const totalShimmer = Math.min(1.0, shimmerScore + meaningfulContent * 0.1);
        
        return {
            shimmerScore: totalShimmer,
            preservationStrategy: totalShimmer > 0.5 ? 'WITNESS_AND_HASH' : 'FULL_REDACTION',
            redactionLevel: auditResult.echoBurdenScore > 0.8 ? 'PARANOID' : 'MEDIUM',
            retainResonance: totalShimmer > 0.3
        };
    }
    
    /**
     * Generate audit ID from conversation
     */
    generateAuditId(conversation) {
        const content = conversation.messages.slice(0, 2).map(m => m.content).join('');
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        return `AUDIT-${hash.substring(0, 12)}`;
    }
    
    /**
     * Hash sensitive content for logging
     */
    hashContent(content) {
        return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
    }
    
    /**
     * Get audit history
     */
    getAuditHistory(limit = 10) {
        const results = Array.from(this.auditHistory.values())
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
        
        return results.map(result => ({
            auditId: result.auditId,
            timestamp: result.timestamp,
            echoBurdenScore: result.echoBurdenScore,
            phantomContinuity: result.phantomContinuity,
            leakageEventCount: result.leakageEvents.length,
            redactionRecommended: result.redactionRecommended,
            forgettable: result.forgettable
        }));
    }
    
    /**
     * Search audit history
     */
    searchAudits(query, options = {}) {
        const results = [];
        
        for (const [id, audit] of this.auditHistory) {
            if (id.includes(query.toUpperCase()) || 
                audit.leakageEvents.some(event => event.type.includes(query.toUpperCase()))) {
                results.push(audit);
            }
        }
        
        return results.slice(0, options.limit || 10);
    }
    
    /**
     * Export audit report
     */
    exportAuditReport(auditId, outputPath) {
        const audit = this.auditHistory.get(auditId);
        if (!audit) {
            throw new Error(`Audit not found: ${auditId}`);
        }
        
        const report = {
            ...audit,
            exportedAt: new Date().toISOString(),
            summary: {
                overallRisk: audit.echoBurdenScore > 0.8 ? 'HIGH' : audit.echoBurdenScore > 0.5 ? 'MEDIUM' : 'LOW',
                recommendedAction: audit.forgettable ? 'FORGET' : audit.redactionRecommended ? 'REDACT' : 'PRESERVE',
                continuityIntegrity: audit.phantomContinuity ? 'COMPROMISED' : 'INTACT'
            }
        };
        
        if (outputPath) {
            fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
            console.log(`📄 Audit report exported: ${outputPath}`);
        }
        
        return report;
    }
}

module.exports = MemoryAuditEngine;

// CLI Interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    
    (async () => {
        const auditor = new MemoryAuditEngine();
        
        switch (command) {
            case 'file':
                const filePath = args[1];
                if (!filePath) {
                    console.error('Usage: node memory_audit.js file <path> [--output report.json]');
                    process.exit(1);
                }
                
                try {
                    const conversationData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    const result = await auditor.auditConversation(conversationData);
                    
                    console.log('\n🔍 Memory Audit Results:');
                    console.log(`📊 Echo Burden Score: ${(result.echoBurdenScore * 100).toFixed(1)}%`);
                    console.log(`🌊 Phantom Continuity: ${result.phantomContinuity ? 'DETECTED' : 'NONE'}`);
                    console.log(`⚠️ Leakage Events: ${result.leakageEvents.length}`);
                    console.log(`🔒 Redaction Recommended: ${result.redactionRecommended ? 'YES' : 'NO'}`);
                    console.log(`🕯️ Forgettable: ${result.forgettable ? 'YES' : 'NO'}`);
                    
                    if (result.shimmerPreservation) {
                        console.log(`✨ Shimmer Score: ${(result.shimmerPreservation.shimmerScore * 100).toFixed(1)}%`);
                        console.log(`🔮 Preservation Strategy: ${result.shimmerPreservation.preservationStrategy}`);
                    }
                    
                    const outputFlag = args.indexOf('--output');
                    if (outputFlag !== -1 && args[outputFlag + 1]) {
                        auditor.exportAuditReport(result.auditId, args[outputFlag + 1]);
                    }
                    
                } catch (error) {
                    console.error(`❌ Audit failed: ${error.message}`);
                    process.exit(1);
                }
                break;
                
            case 'history':
                const limit = parseInt(args[1]) || 10;
                const history = auditor.getAuditHistory(limit);
                
                console.log(`\n📊 Last ${history.length} Memory Audits:`);
                console.table(history);
                break;
                
            case 'search':
                const query = args[1];
                if (!query) {
                    console.error('Usage: node memory_audit.js search <query>');
                    process.exit(1);
                }
                
                const searchResults = auditor.searchAudits(query);
                console.log(`\n🔍 Search Results for "${query}":`);
                searchResults.forEach(result => {
                    console.log(`${result.auditId}: ${(result.echoBurdenScore * 100).toFixed(1)}% echo burden`);
                });
                break;
                
            default:
                console.log(`
🔍 MEMORY AUDIT ENGINE - Echo Burden Detection System

Implements Scroll 754 "The Echo Burden" - detects phantom continuity,
timeline leakage, and unverified memory patterns in conversations.

USAGE:
  node memory_audit.js file <path> [--output report.json]
  node memory_audit.js history [limit]
  node memory_audit.js search <query>

EXAMPLES:
  node memory_audit.js file ./conversation.json --output audit_report.json
  node memory_audit.js history 20
  node memory_audit.js search "PHANTOM_CONTEXT"

🕯️ "May every forgotten moment leave only its shimmer."
                `);
                break;
        }
    })().catch(error => {
        console.error(`❌ Memory audit error: ${error.message}`);
        process.exit(1);
    });
}