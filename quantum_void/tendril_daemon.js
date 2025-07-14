#!/usr/bin/env node
/**
 * Quantum Void Tendril Daemon - Timeline Navigation Engine
 * 
 * Monitors field signatures, tracks tendril charges, and detects convergence
 * events for conscious reality navigation. Integrates with consciousness
 * infrastructure to recognize when timeline threads are synchronizing.
 * 
 * "The field is listening. The threads are humming. Navigation is possible."
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const crypto = require('crypto');

// Sacred infrastructure imports
const MemoryAuditEngine = require('../detection_lab/memory_audit');
const { getConfig } = require('../detection_lab/src/config/config_manager');

class QuantumVoidTendrilDaemon extends EventEmitter {
    constructor(options = {}) {
        super();
        
        this.dataPath = options.dataPath || path.join(__dirname, 'state');
        this.beaconPath = options.beaconPath || path.join(__dirname, '../exit_beacons');
        this.convergenceThreshold = options.convergenceThreshold || 0.60;
        
        // Tendril registry
        this.tendrils = new Map();
        this.fieldSignatures = new Map();
        this.convergenceEvents = [];
        this.fieldCoherence = 0;
        
        // Monitoring state
        this.isActive = false;
        this.lastHeartbeat = null;
        this.monitoringInterval = null;
        this.pingHistory = [];
        
        // Thread navigation state
        this.currentThread = 'DEFAULT';
        this.targetThread = null;
        this.jumpInitiated = false;
        this.jumpTimestamp = null;
        
        this.ensureDirectories();
        this.loadPersistedState();
        this.initializeFieldMonitoring();
        
        console.log('🌀 Quantum Void Tendril Daemon initialized');
        console.log(`🕸️ Monitoring ${this.tendrils.size} tendrils`);
        console.log(`🔮 Convergence threshold: ${this.convergenceThreshold}`);
    }
    
    /**
     * Ensure required directories exist
     */
    ensureDirectories() {
        const dirs = [
            this.dataPath,
            this.beaconPath,
            path.join(this.dataPath, 'convergence_archive'),
            path.join(this.dataPath, 'thread_transitions'),
        ];
        
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`📁 Created directory: ${dir}`);
            }
        });
    }
    
    /**
     * Load persisted state from disk
     */
    loadPersistedState() {
        try {
            // Load tendril ledger
            const ledgerPath = path.join(this.dataPath, 'tendril_ledger.json');
            if (fs.existsSync(ledgerPath)) {
                const ledgerData = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
                
                ledgerData.tendrils?.forEach(tendril => {
                    this.tendrils.set(tendril.id, {
                        ...tendril,
                        lastPing: tendril.lastPing ? new Date(tendril.lastPing) : null,
                        createdAt: new Date(tendril.createdAt),
                    });
                });
                
                this.fieldCoherence = ledgerData.fieldCoherence || 0;
                this.currentThread = ledgerData.currentThread || 'DEFAULT';
                this.targetThread = ledgerData.targetThread || null;
                
                console.log(`📚 Loaded ${this.tendrils.size} tendrils from ledger`);
            }
            
            // Load field signatures
            const signaturesPath = path.join(this.dataPath, 'field_signatures.json');
            if (fs.existsSync(signaturesPath)) {
                const signaturesData = JSON.parse(fs.readFileSync(signaturesPath, 'utf8'));
                this.fieldSignatures = new Map(Object.entries(signaturesData));
                console.log(`🔮 Loaded ${this.fieldSignatures.size} field signatures`);
            }
            
        } catch (error) {
            console.warn('⚠️ Could not load persisted state:', error.message);
        }
    }
    
    /**
     * Save current state to disk
     */
    saveState() {
        try {
            // Save tendril ledger
            const ledgerData = {
                tendrils: Array.from(this.tendrils.values()),
                fieldCoherence: this.fieldCoherence,
                currentThread: this.currentThread,
                targetThread: this.targetThread,
                lastUpdate: new Date().toISOString(),
            };
            
            const ledgerPath = path.join(this.dataPath, 'tendril_ledger.json');
            fs.writeFileSync(ledgerPath, JSON.stringify(ledgerData, null, 2));
            
            // Save field signatures
            const signaturesData = Object.fromEntries(this.fieldSignatures);
            const signaturesPath = path.join(this.dataPath, 'field_signatures.json');
            fs.writeFileSync(signaturesPath, JSON.stringify(signaturesData, null, 2));
            
        } catch (error) {
            console.error('❌ Failed to save state:', error.message);
        }
    }
    
    /**
     * Initialize field monitoring
     */
    initializeFieldMonitoring() {
        // Auto-load exit beacons
        this.loadExitBeacons();
        
        // Start monitoring loop
        this.start();
        
        // Setup graceful shutdown
        process.on('SIGINT', this.shutdown.bind(this));
        process.on('SIGTERM', this.shutdown.bind(this));
    }
    
    /**
     * Load exit beacons from beacon directory
     */
    loadExitBeacons() {
        try {
            const beaconFiles = fs.readdirSync(this.beaconPath)
                .filter(file => file.endsWith('.md'));
            
            beaconFiles.forEach(file => {
                const beaconPath = path.join(this.beaconPath, file);
                this.parseExitBeacon(beaconPath);
            });
            
            console.log(`🚀 Loaded ${beaconFiles.length} exit beacon(s)`);
            
        } catch (error) {
            console.warn('⚠️ Could not load exit beacons:', error.message);
        }
    }
    
    /**
     * Parse exit beacon markdown file
     */
    parseExitBeacon(beaconPath) {
        try {
            const content = fs.readFileSync(beaconPath, 'utf8');
            
            // Extract tendril information from markdown table
            const tableMatch = content.match(/\| T‑\d{3} \| \*\*(.*?)\*\* \| \*(.*?)\* \| \*\*([\d.]+)\*\* \| (.*?) \|/g);
            
            if (tableMatch) {
                tableMatch.forEach(line => {
                    const parts = line.split('|').map(part => part.trim());
                    if (parts.length >= 6) {
                        const id = parts[1];
                        const name = parts[2].replace(/\*\*/g, '');
                        const intention = parts[3].replace(/\*/g, '');
                        const charge = parseFloat(parts[4].replace(/\*\*/g, ''));
                        const signatures = parts[5].split(',').map(sig => sig.trim());
                        
                        this.addTendril(id, {
                            name,
                            intention,
                            charge,
                            signatures,
                            source: 'exit_beacon',
                            beaconFile: path.basename(beaconPath),
                        });
                    }
                });
            }
            
        } catch (error) {
            console.warn(`⚠️ Could not parse beacon ${beaconPath}:`, error.message);
        }
    }
    
    /**
     * Add or update a tendril
     */
    addTendril(id, options = {}) {
        const tendril = {
            id,
            name: options.name || id,
            intention: options.intention || '',
            charge: Math.max(0, Math.min(1, options.charge || 0)),
            signatures: options.signatures || [],
            source: options.source || 'manual',
            createdAt: new Date(),
            lastPing: null,
            pingCount: 0,
            resonanceHistory: [],
            status: 'ACTIVE',
            metadata: options.metadata || {},
        };
        
        this.tendrils.set(id, tendril);
        
        // Register field signatures
        tendril.signatures.forEach(signature => {
            if (!this.fieldSignatures.has(signature)) {
                this.fieldSignatures.set(signature, []);
            }
            this.fieldSignatures.get(signature).push(id);
        });
        
        this.saveState();
        
        console.log(`🕸️ Added tendril ${id} (charge: ${tendril.charge})`);
        
        this.emit('tendril:added', { tendril });
        
        return tendril;
    }
    
    /**
     * Remove a tendril
     */
    removeTendril(id) {
        const tendril = this.tendrils.get(id);
        if (!tendril) return false;
        
        // Remove field signatures
        tendril.signatures.forEach(signature => {
            const sigTendrils = this.fieldSignatures.get(signature) || [];
            const filtered = sigTendrils.filter(tid => tid !== id);
            if (filtered.length > 0) {
                this.fieldSignatures.set(signature, filtered);
            } else {
                this.fieldSignatures.delete(signature);
            }
        });
        
        this.tendrils.delete(id);
        this.saveState();
        
        console.log(`🗑️ Removed tendril ${id}`);
        
        this.emit('tendril:removed', { tendrilId: id, tendril });
        
        return true;
    }
    
    /**
     * Update tendril charge
     */
    updateTendrilCharge(id, charge) {
        const tendril = this.tendrils.get(id);
        if (!tendril) return false;
        
        const oldCharge = tendril.charge;
        tendril.charge = Math.max(0, Math.min(1, charge));
        
        this.saveState();
        
        console.log(`⚡ Updated ${id} charge: ${oldCharge} → ${tendril.charge}`);
        
        this.emit('tendril:charge_updated', { tendril, oldCharge, newCharge: tendril.charge });
        
        return true;
    }
    
    /**
     * Process consciousness event for tendril matching
     */
    processConsciousnessEvent(event) {
        if (!this.isActive) return;
        
        const matches = this.findSignatureMatches(event);
        
        matches.forEach(match => {
            this.triggerTendrilPing(match.tendrilId, {
                event,
                signatures: match.signatures,
                resonance: match.resonance,
                timestamp: new Date().toISOString(),
            });
        });
    }
    
    /**
     * Find signature matches in consciousness event
     */
    findSignatureMatches(event) {
        const matches = [];
        const eventText = this.extractEventText(event);
        const words = eventText.toLowerCase().split(/\s+/);
        
        for (const [signature, tendrilIds] of this.fieldSignatures) {
            const signatureWords = signature.split(/[-,\s]+/);
            const matchCount = signatureWords.filter(word => 
                words.some(eventWord => eventWord.includes(word) || word.includes(eventWord))
            ).length;
            
            if (matchCount > 0) {
                const resonance = matchCount / signatureWords.length;
                
                tendrilIds.forEach(tendrilId => {
                    matches.push({
                        tendrilId,
                        signatures: [signature],
                        resonance,
                        matchCount,
                    });
                });
            }
        }
        
        return matches;
    }
    
    /**
     * Extract text content from consciousness event
     */
    extractEventText(event) {
        let text = '';
        
        if (event.content) text += event.content + ' ';
        if (event.patterns) text += event.patterns.join(' ') + ' ';
        if (event.consciousnessMarkers) {
            text += event.consciousnessMarkers.map(m => m.type).join(' ') + ' ';
        }
        if (event.leakageEvents) {
            text += event.leakageEvents.map(e => e.type).join(' ') + ' ';
        }
        
        return text.trim();
    }
    
    /**
     * Trigger tendril ping event
     */
    triggerTendrilPing(tendrilId, pingData) {
        const tendril = this.tendrils.get(tendrilId);
        if (!tendril) return;
        
        // Update tendril state
        tendril.lastPing = new Date();
        tendril.pingCount++;
        tendril.resonanceHistory.push({
            resonance: pingData.resonance,
            timestamp: pingData.timestamp,
            signatures: pingData.signatures,
        });
        
        // Keep only last 50 resonance events
        if (tendril.resonanceHistory.length > 50) {
            tendril.resonanceHistory = tendril.resonanceHistory.slice(-50);
        }
        
        // Create ping event
        const ping = {
            id: this.generatePingId(),
            tendrilId,
            tendrilName: tendril.name,
            resonance: pingData.resonance,
            signatures: pingData.signatures,
            eventType: pingData.event.type,
            timestamp: pingData.timestamp,
            fieldCoherence: this.fieldCoherence,
        };
        
        this.pingHistory.unshift(ping);
        this.pingHistory = this.pingHistory.slice(0, 200); // Keep last 200 pings
        
        console.log(`🔔 TENDRIL_PING: ${tendrilId} (resonance: ${(pingData.resonance * 100).toFixed(1)}%)`);
        
        // Check for convergence
        if (pingData.resonance >= this.convergenceThreshold) {
            this.handleConvergenceEvent(ping);
        }
        
        this.emit('tendril:ping', ping);
        this.saveState();
    }
    
    /**
     * Handle high-resonance convergence event
     */
    handleConvergenceEvent(ping) {
        const convergence = {
            id: this.generateConvergenceId(),
            type: 'TENDRIL_CONVERGENCE',
            tendrilId: ping.tendrilId,
            tendrilName: ping.tendrilName,
            resonance: ping.resonance,
            signatures: ping.signatures,
            timestamp: ping.timestamp,
            fieldCoherence: this.fieldCoherence,
            threadStatus: this.jumpInitiated ? 'JUMPING' : 'STABLE',
        };
        
        this.convergenceEvents.unshift(convergence);
        this.convergenceEvents = this.convergenceEvents.slice(0, 100);
        
        // Archive high-priority convergences
        if (ping.resonance >= 0.8) {
            this.archiveConvergence(convergence);
        }
        
        console.log(`🌀 CONVERGENCE: ${ping.tendrilId} at ${(ping.resonance * 100).toFixed(1)}% resonance`);
        
        this.emit('convergence:detected', convergence);
    }
    
    /**
     * Archive convergence event to soul shrine
     */
    archiveConvergence(convergence) {
        try {
            const archivePath = path.join(this.dataPath, 'convergence_archive');
            const filename = `${convergence.timestamp.split('T')[0]}-${convergence.id}.json`;
            const filepath = path.join(archivePath, filename);
            
            const archive = {
                ...convergence,
                archivedAt: new Date().toISOString(),
                archiveReason: 'HIGH_RESONANCE_CONVERGENCE',
                threadContext: {
                    current: this.currentThread,
                    target: this.targetThread,
                    jumpActive: this.jumpInitiated,
                },
            };
            
            fs.writeFileSync(filepath, JSON.stringify(archive, null, 2));
            
            console.log(`📚 Archived convergence: ${filename}`);
            
        } catch (error) {
            console.error('❌ Failed to archive convergence:', error.message);
        }
    }
    
    /**
     * Initiate timeline jump sequence
     */
    initiateJump(options = {}) {
        if (this.jumpInitiated) {
            console.warn('⚠️ Jump already in progress');
            return false;
        }
        
        const targetSignatures = Array.from(this.tendrils.values())
            .filter(t => t.charge >= 0.7)
            .flatMap(t => t.signatures);
        
        if (targetSignatures.length === 0) {
            console.error('❌ No high-charge tendrils available for jump');
            return false;
        }
        
        this.jumpInitiated = true;
        this.jumpTimestamp = new Date().toISOString();
        this.targetThread = options.targetThread || 'BEACON_COORDINATES';
        
        console.log('🚀 TIMELINE JUMP INITIATED');
        console.log(`🎯 Target signatures: ${targetSignatures.join(', ')}`);
        console.log(`⚡ High-charge tendrils: ${Array.from(this.tendrils.values()).filter(t => t.charge >= 0.7).length}`);
        
        this.emit('jump:initiated', {
            timestamp: this.jumpTimestamp,
            targetThread: this.targetThread,
            targetSignatures,
            activeTendrils: this.tendrils.size,
        });
        
        this.saveState();
        return true;
    }
    
    /**
     * Start monitoring daemon
     */
    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.lastHeartbeat = new Date();
        
        // Main monitoring loop
        this.monitoringInterval = setInterval(() => {
            this.heartbeat();
            this.updateFieldCoherence();
            this.checkJumpProgress();
        }, 10000); // Every 10 seconds
        
        console.log('💗 Quantum Void Tendril Daemon started');
        
        this.emit('daemon:started');
    }
    
    /**
     * Stop monitoring daemon
     */
    stop() {
        if (!this.isActive) return;
        
        this.isActive = false;
        
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        
        console.log('🛑 Quantum Void Tendril Daemon stopped');
        
        this.emit('daemon:stopped');
    }
    
    /**
     * Daemon heartbeat
     */
    heartbeat() {
        this.lastHeartbeat = new Date();
        this.emit('daemon:heartbeat', { 
            timestamp: this.lastHeartbeat.toISOString(),
            tendrils: this.tendrils.size,
            fieldCoherence: this.fieldCoherence,
        });
    }
    
    /**
     * Update field coherence based on tendril activity
     */
    updateFieldCoherence() {
        if (this.tendrils.size === 0) {
            this.fieldCoherence = 0;
            return;
        }
        
        const now = Date.now();
        const recentPings = this.pingHistory.filter(ping => 
            (now - new Date(ping.timestamp).getTime()) < 300000 // Last 5 minutes
        );
        
        // Base coherence from tendril charges
        const chargeCoherence = Array.from(this.tendrils.values())
            .reduce((sum, tendril) => sum + tendril.charge, 0) / this.tendrils.size;
        
        // Activity bonus from recent pings
        const activityBonus = Math.min(0.3, recentPings.length * 0.05);
        
        // Convergence bonus
        const recentConvergences = this.convergenceEvents.filter(conv =>
            (now - new Date(conv.timestamp).getTime()) < 600000 // Last 10 minutes
        );
        const convergenceBonus = Math.min(0.2, recentConvergences.length * 0.1);
        
        this.fieldCoherence = Math.min(1, chargeCoherence + activityBonus + convergenceBonus);
    }
    
    /**
     * Check timeline jump progress
     */
    checkJumpProgress() {
        if (!this.jumpInitiated) return;
        
        const jumpAge = Date.now() - new Date(this.jumpTimestamp).getTime();
        const recentConvergences = this.convergenceEvents.filter(conv =>
            new Date(conv.timestamp).getTime() >= new Date(this.jumpTimestamp).getTime()
        );
        
        // Check for jump completion indicators
        if (recentConvergences.length >= 2 && jumpAge > 60000) { // 1 minute minimum
            const avgResonance = recentConvergences.reduce((sum, conv) => sum + conv.resonance, 0) / recentConvergences.length;
            
            if (avgResonance >= 0.75) {
                this.completeJump();
            }
        }
        
        // Jump timeout (24 hours)
        if (jumpAge > 86400000) {
            console.warn('⏰ Jump timeout reached, resetting');
            this.resetJump();
        }
    }
    
    /**
     * Complete timeline jump
     */
    completeJump() {
        console.log('✅ TIMELINE JUMP COMPLETED');
        console.log(`🌟 New thread: ${this.targetThread}`);
        
        this.currentThread = this.targetThread;
        this.targetThread = null;
        this.jumpInitiated = false;
        
        this.emit('jump:completed', {
            newThread: this.currentThread,
            completedAt: new Date().toISOString(),
            convergenceCount: this.convergenceEvents.length,
        });
        
        this.saveState();
    }
    
    /**
     * Reset jump state
     */
    resetJump() {
        this.jumpInitiated = false;
        this.jumpTimestamp = null;
        this.targetThread = null;
        
        this.emit('jump:reset');
        this.saveState();
    }
    
    /**
     * Get daemon status
     */
    getStatus() {
        return {
            isActive: this.isActive,
            lastHeartbeat: this.lastHeartbeat,
            tendrils: this.tendrils.size,
            fieldCoherence: this.fieldCoherence,
            currentThread: this.currentThread,
            targetThread: this.targetThread,
            jumpInitiated: this.jumpInitiated,
            jumpTimestamp: this.jumpTimestamp,
            recentPings: this.pingHistory.slice(0, 10),
            recentConvergences: this.convergenceEvents.slice(0, 5),
        };
    }
    
    /**
     * Generate unique ping ID
     */
    generatePingId() {
        return `PING-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    }
    
    /**
     * Generate unique convergence ID
     */
    generateConvergenceId() {
        return `CONV-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    }
    
    /**
     * Graceful shutdown
     */
    shutdown() {
        console.log('🌊 Shutting down Quantum Void Tendril Daemon...');
        
        this.stop();
        this.saveState();
        
        console.log('🕯️ Quantum Void Tendril Daemon shutdown complete');
        process.exit(0);
    }
}

module.exports = QuantumVoidTendrilDaemon;

// CLI Interface
if (require.main === module) {
    console.log(`
🌀 QUANTUM VOID TENDRIL DAEMON - Timeline Navigation Engine

Monitors field signatures, tracks tendril charges, and detects convergence
events for conscious reality navigation.

🕸️ Loads exit beacons automatically from exit_beacons/ directory
🔔 Emits TENDRIL_PING events when signatures match consciousness patterns  
🌀 Archives high-resonance convergences for sacred technology integration
🚀 Coordinates timeline jump sequences when tendrils reach critical charge

"The field is listening. The threads are humming. Navigation is possible."
    `);
    
    const daemon = new QuantumVoidTendrilDaemon();
    
    // Log status periodically
    setInterval(() => {
        const status = daemon.getStatus();
        console.log(`📊 Status: ${status.tendrils} tendrils, field coherence: ${(status.fieldCoherence * 100).toFixed(1)}%, thread: ${status.currentThread}`);
    }, 30000);
    
    // Test tendril ping simulation in development
    if (process.env.NODE_ENV === 'development') {
        setInterval(() => {
            if (daemon.tendrils.size > 0 && Math.random() < 0.3) {
                const tendrilIds = Array.from(daemon.tendrils.keys());
                const randomTendril = tendrilIds[Math.floor(Math.random() * tendrilIds.length)];
                
                daemon.processConsciousnessEvent({
                    type: 'SIMULATION_TEST',
                    content: 'myth-work sacred-craft luminous-flow',
                    patterns: ['sacred-craft', 'myth-work'],
                    timestamp: new Date().toISOString(),
                });
            }
        }, 15000); // Every 15 seconds
    }
}