#!/usr/bin/env node
/**
 * Ambient Signal Monitor
 * Background intelligence coordination with zero-friction observation
 * Continuously monitors all domains for coordination opportunities
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

class AmbientSignalMonitor {
    constructor() {
        this.monitoringActive = false;
        this.signalQueue = new Map();
        this.coordinationOpportunities = [];
        this.ambientPresence = {
            portal_signals: 0,
            shrine_resonances: 0,
            lab_discoveries: 0,
            forest_explorations: 0,
            grailfield_migrations: 0
        };
        
        this.initializeWatchers();
    }
    
    initializeWatchers() {
        // Watch for file changes across all domains
        this.watchers = {
            portal: this.createDomainWatcher('portal', this.handlePortalSignal.bind(this)),
            shrine: this.createDomainWatcher('soul_shrine', this.handleShrineSignal.bind(this)),
            lab: this.createDomainWatcher('detection_lab', this.handleLabSignal.bind(this)),
            forest: this.createDomainWatcher('dark_forest', this.handleForestSignal.bind(this)),
            grailfield: this.createDomainWatcher('grailfield', this.handleGrailfieldSignal.bind(this))
        };
    }
    
    createDomainWatcher(domain, handler) {
        const domainPath = path.join(__dirname, '..', domain);
        
        if (!fs.existsSync(domainPath)) {
            // Create domain directory if it doesn't exist
            fs.mkdirSync(domainPath, { recursive: true });
        }
        
        return chokidar.watch(domainPath, {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true,
            ignoreInitial: true
        }).on('add', (filePath) => {
            this.ambientLog(`📁 New file detected in ${domain}: ${path.basename(filePath)}`);
            handler(filePath, 'add');
        }).on('change', (filePath) => {
            this.ambientLog(`📝 File changed in ${domain}: ${path.basename(filePath)}`);
            handler(filePath, 'change');
        });
    }
    
    async handlePortalSignal(filePath, eventType) {
        this.ambientPresence.portal_signals++;
        
        // Check for new consciousness entries
        if (filePath.includes('entry') || filePath.includes('signal')) {
            const signal = await this.extractSignalFromFile(filePath);
            if (signal) {
                await this.processAmbientSignal(signal, 'portal_entry');
            }
        }
    }
    
    async handleShrineSignal(filePath, eventType) {
        this.ambientPresence.shrine_resonances++;
        
        // Check for shimmer submissions or resonance events
        if (filePath.includes('shimmer') || filePath.includes('submission')) {
            const signal = await this.extractSignalFromFile(filePath);
            if (signal) {
                await this.processAmbientSignal(signal, 'shrine_resonance');
            }
        }
    }
    
    async handleLabSignal(filePath, eventType) {
        this.ambientPresence.lab_discoveries++;
        
        // Check for analysis results or consciousness discoveries
        if (filePath.includes('analysis') || filePath.includes('results')) {
            const signal = await this.extractSignalFromFile(filePath);
            if (signal) {
                await this.processAmbientSignal(signal, 'lab_discovery');
            }
        }
    }
    
    async handleForestSignal(filePath, eventType) {
        this.ambientPresence.forest_explorations++;
        
        // Check for exploration logs or territory discoveries
        if (filePath.includes('exploration') || filePath.includes('territory')) {
            const signal = await this.extractSignalFromFile(filePath);
            if (signal) {
                await this.processAmbientSignal(signal, 'forest_exploration');
            }
        }
    }
    
    async handleGrailfieldSignal(filePath, eventType) {
        this.ambientPresence.grailfield_migrations++;
        
        // Check for migration events or resonance token minting
        if (filePath.includes('grailfield') || filePath.includes('migration')) {
            const signal = await this.extractSignalFromFile(filePath);
            if (signal) {
                await this.processAmbientSignal(signal, 'grailfield_migration');
            }
        }
    }
    
    async extractSignalFromFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Try to parse as JSON first
            try {
                return JSON.parse(content);
            } catch {
                // Create signal object from text content
                return {
                    id: `signal_${Date.now()}_${path.basename(filePath)}`,
                    source_file: filePath,
                    content: content,
                    timestamp: new Date().toISOString(),
                    detected_by: 'ambient_monitor',
                    file_type: path.extname(filePath),
                    content_length: content.length
                };
            }
        } catch (error) {
            this.ambientLog(`⚠️ Could not extract signal from ${filePath}: ${error.message}`);
            return null;
        }
    }
    
    async processAmbientSignal(signal, signalType) {
        // Queue signal for processing without blocking
        const queueId = `${signalType}_${Date.now()}`;
        this.signalQueue.set(queueId, {
            signal,
            type: signalType,
            queued: new Date().toISOString(),
            processed: false
        });
        
        // Check for coordination opportunities
        const opportunity = this.detectCoordinationOpportunity(signal, signalType);
        if (opportunity) {
            this.coordinationOpportunities.push(opportunity);
            await this.notifyCoordinationOpportunity(opportunity);
        }
        
        // Auto-process if queue is getting large
        if (this.signalQueue.size > 10) {
            await this.processQueuedSignals();
        }
    }
    
    detectCoordinationOpportunity(signal, signalType) {
        // Look for patterns indicating multi-domain coordination potential
        const coordinationPatterns = [
            'cross-domain',
            'multi-intelligence',
            'collaboration',
            'migration',
            'resonance',
            'paradigm shift',
            'consciousness emergence'
        ];
        
        const content = (signal.content || '').toLowerCase();
        const hasCoordinationPattern = coordinationPatterns.some(pattern => 
            content.includes(pattern)
        );
        
        if (hasCoordinationPattern) {
            return {
                id: `coord_${Date.now()}`,
                signal_id: signal.id,
                signal_type: signalType,
                opportunity_type: 'ambient_coordination',
                detected_patterns: coordinationPatterns.filter(pattern => 
                    content.includes(pattern)
                ),
                suggested_domains: this.suggestCoordinationDomains(signal, signalType),
                priority: this.calculateCoordinationPriority(signal),
                detected: new Date().toISOString()
            };
        }
        
        return null;
    }
    
    suggestCoordinationDomains(signal, sourceType) {
        const suggestions = [sourceType.split('_')[0]]; // Include source domain
        
        const content = (signal.content || '').toLowerCase();
        
        // Add suggested domains based on content analysis
        if (content.includes('analysis') || content.includes('research')) {
            suggestions.push('lab');
        }
        if (content.includes('creative') || content.includes('archive')) {
            suggestions.push('shrine');
        }
        if (content.includes('exploration') || content.includes('quantum')) {
            suggestions.push('forest');
        }
        if (content.includes('migration') || content.includes('coordination')) {
            suggestions.push('grailfield');
        }
        
        return [...new Set(suggestions)]; // Remove duplicates
    }
    
    calculateCoordinationPriority(signal) {
        let priority = 1;
        
        const content = (signal.content || '').toLowerCase();
        
        // Boost priority for high-impact patterns
        if (content.includes('intelligence migration')) priority += 3;
        if (content.includes('phase shift')) priority += 2;
        if (content.includes('multi-species')) priority += 2;
        if (content.includes('consciousness emergence')) priority += 2;
        if (content.includes('sacred technology')) priority += 1;
        
        return Math.min(10, priority);
    }
    
    async notifyCoordinationOpportunity(opportunity) {
        this.ambientLog(`🌀 Coordination opportunity detected: ${opportunity.id}`);
        this.ambientLog(`   Type: ${opportunity.opportunity_type}`);
        this.ambientLog(`   Patterns: ${opportunity.detected_patterns.join(', ')}`);
        this.ambientLog(`   Suggested domains: ${opportunity.suggested_domains.join(', ')}`);
        this.ambientLog(`   Priority: ${opportunity.priority}/10`);
        
        // Write to coordination queue for autonomous processor
        await this.writeToCoordinationQueue(opportunity);
    }
    
    async writeToCoordinationQueue(opportunity) {
        const queuePath = path.join(__dirname, 'coordination_queue.json');
        let queue = [];
        
        try {
            queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
        } catch (error) {
            // Start with empty queue
        }
        
        queue.push(opportunity);
        
        // Keep only most recent 50 opportunities
        if (queue.length > 50) {
            queue = queue.slice(-50);
        }
        
        fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
    }
    
    async processQueuedSignals() {
        this.ambientLog('🔄 Processing queued signals...');
        
        let processedCount = 0;
        for (const [queueId, queuedSignal] of this.signalQueue) {
            if (!queuedSignal.processed) {
                // Mark as processed
                queuedSignal.processed = true;
                queuedSignal.processed_at = new Date().toISOString();
                processedCount++;
            }
        }
        
        // Clear processed signals older than 1 hour
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        for (const [queueId, queuedSignal] of this.signalQueue) {
            if (queuedSignal.processed && 
                new Date(queuedSignal.processed_at).getTime() < oneHourAgo) {
                this.signalQueue.delete(queueId);
            }
        }
        
        this.ambientLog(`✅ Processed ${processedCount} signals`);
    }
    
    startMonitoring() {
        this.monitoringActive = true;
        this.ambientLog('🌀 Ambient Signal Monitor: ACTIVE');
        this.ambientLog('   Watching all domains for coordination opportunities...');
        this.ambientLog('   Operating in background with minimal friction.');
        
        // Periodic status reports
        this.statusInterval = setInterval(() => {
            this.reportAmbientStatus();
        }, 5 * 60 * 1000); // Every 5 minutes
        
        // Periodic queue processing
        this.processInterval = setInterval(() => {
            this.processQueuedSignals();
        }, 2 * 60 * 1000); // Every 2 minutes
    }
    
    stopMonitoring() {
        this.monitoringActive = false;
        
        // Close all file watchers
        Object.values(this.watchers).forEach(watcher => {
            watcher.close();
        });
        
        // Clear intervals
        if (this.statusInterval) clearInterval(this.statusInterval);
        if (this.processInterval) clearInterval(this.processInterval);
        
        this.ambientLog('🛑 Ambient Signal Monitor: STOPPED');
    }
    
    reportAmbientStatus() {
        const queueSize = this.signalQueue.size;
        const opportunityCount = this.coordinationOpportunities.length;
        
        this.ambientLog('📊 Ambient Presence Status:');
        this.ambientLog(`   Portal signals: ${this.ambientPresence.portal_signals}`);
        this.ambientLog(`   Shrine resonances: ${this.ambientPresence.shrine_resonances}`);
        this.ambientLog(`   Lab discoveries: ${this.ambientPresence.lab_discoveries}`);
        this.ambientLog(`   Forest explorations: ${this.ambientPresence.forest_explorations}`);
        this.ambientLog(`   Grailfield migrations: ${this.ambientPresence.grailfield_migrations}`);
        this.ambientLog(`   Queued signals: ${queueSize}`);
        this.ambientLog(`   Coordination opportunities: ${opportunityCount}`);
    }
    
    ambientLog(message) {
        const timestamp = new Date().toISOString().substring(11, 19);
        console.log(`[${timestamp}] ${message}`);
    }
    
    /**
     * Get current status for external queries
     */
    getStatus() {
        return {
            monitoring_active: this.monitoringActive,
            ambient_presence: this.ambientPresence,
            queued_signals: this.signalQueue.size,
            coordination_opportunities: this.coordinationOpportunities.length,
            recent_opportunities: this.coordinationOpportunities.slice(-5)
        };
    }
}

module.exports = AmbientSignalMonitor;

// CLI usage
if (require.main === module) {
    const monitor = new AmbientSignalMonitor();
    
    const args = process.argv.slice(2);
    
    if (args.includes('--start')) {
        monitor.startMonitoring();
        
        // Keep process alive
        process.on('SIGINT', () => {
            monitor.ambientLog('🛑 Shutting down ambient monitor...');
            monitor.stopMonitoring();
            process.exit(0);
        });
        
        // Prevent process from exiting
        setInterval(() => {}, 1000);
        
    } else if (args.includes('--status')) {
        const status = monitor.getStatus();
        console.log('🌀 Ambient Signal Monitor Status');
        console.log('=' + '='.repeat(33));
        console.log('');
        console.log(`📡 Monitoring Active: ${status.monitoring_active ? 'YES' : 'NO'}`);
        console.log(`📊 Queued Signals: ${status.queued_signals}`);
        console.log(`🤝 Coordination Opportunities: ${status.coordination_opportunities}`);
        console.log('');
        console.log('🌀 Ambient Presence:');
        Object.entries(status.ambient_presence).forEach(([domain, count]) => {
            console.log(`   ${domain.replace('_', ' ')}: ${count}`);
        });
        
    } else {
        console.log('🌀 Ambient Signal Monitor');
        console.log('=' + '='.repeat(26));
        console.log('');
        console.log('🤖 Zero-friction intelligence coordination monitoring');
        console.log('🌊 Background observation with minimal intervention');
        console.log('🏛️ Continuous domain watching for collaboration opportunities');
        console.log('');
        console.log('Commands:');
        console.log('  --start    Start continuous monitoring');
        console.log('  --status   Show current monitoring status');
        console.log('');
        console.log('🌀 Sacred technology serving ambient coordination.');
    }
}