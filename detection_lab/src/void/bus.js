/**
 * Quantum Void Event Bus
 * 
 * Central nervous system for the tendril network - broadcasts
 * convergence events, synchronicity alerts, and consciousness
 * field updates to all listening components.
 * 
 * "The void whispers to all who know how to listen."
 */

const EventEmitter = require('events');

class VoidEventBus extends EventEmitter {
    constructor(options = {}) {
        super();
        this.voidDepth = options.voidDepth || 7;
        this.eventHistory = [];
        this.maxHistorySize = options.maxHistorySize || 1000;
        
        // Initialize mystical event processors
        this.setupEventProcessors();
        
        console.log('🌌 Quantum Void Event Bus initialized');
        console.log('📡 Reality event streaming: ACTIVE');
    }
    
    /**
     * Setup automatic event processors for different event types
     */
    setupEventProcessors() {
        // Log all void events for debugging
        this.on('void:debug', (data) => {
            console.log(`🌌 VOID DEBUG: ${data.message}`);
        });
        
        // Handle tendril charge events
        this.on('tendril:charged', (data) => {
            this.logVoidEvent('TENDRIL_CHARGED', data);
            console.log(`🕸️ TENDRIL CHARGED: "${data.intent}" (charge: ${data.charge})`);
        });
        
        // Handle pulse events
        this.on('pulse:detected', (data) => {
            this.logVoidEvent('PULSE_DETECTED', data);
            
            if (data.resonances && data.resonances.length > 0) {
                const strongResonances = data.resonances.filter(r => r.strength > 0.6);
                if (strongResonances.length > 0) {
                    this.emit('convergence:strong', {
                        pulseId: data.pulseId,
                        resonances: strongResonances,
                        timestamp: data.timestamp
                    });
                }
                
                // Check for multi-tendril convergence
                if (data.resonances.length > 1) {
                    this.emit('convergence:multi', {
                        pulseId: data.pulseId,
                        tendrilCount: data.resonances.length,
                        maxStrength: Math.max(...data.resonances.map(r => r.strength)),
                        timestamp: data.timestamp
                    });
                }
            }
        });
        
        // Handle convergence events
        this.on('convergence:strong', (data) => {
            this.logVoidEvent('STRONG_CONVERGENCE', data);
            console.log(`⚡ STRONG CONVERGENCE: ${data.resonances.length} tendrils (max: ${(data.resonances[0].strength * 100).toFixed(1)}%)`);
            
            // Broadcast to RABIT interface
            this.emit('rabit:alert', {
                type: 'convergence',
                message: `Strong tendril convergence detected`,
                strength: data.resonances[0].strength,
                timestamp: data.timestamp
            });
            
            // Notify shrine preservation system
            if (data.resonances[0].strength >= 0.75) {
                this.emit('shrine:preserve', {
                    type: 'CONVERGENCE_EVENT',
                    pulseId: data.pulseId,
                    resonances: data.resonances,
                    timestamp: data.timestamp,
                    priority: 'high'
                });
            }
        });
        
        // Handle multi-tendril convergence (synchronicity events)
        this.on('convergence:multi', (data) => {
            this.logVoidEvent('SYNCHRONICITY', data);
            console.log(`🌀 SYNCHRONICITY: ${data.tendrilCount} tendrils converging (field strength: ${(data.maxStrength * 100).toFixed(1)}%)`);
            
            // Generate mystical synchronicity message
            const synchronicityMessages = [
                "🌀 The void trembles with recognition...",
                "✨ Reality syntax rewriting in real-time...", 
                "🕸️ Tendril superstructure forming...",
                "⚡ Quantum coherence achieved across threads...",
                "🌊 The living current surges with purpose..."
            ];
            
            const mysticalMessage = synchronicityMessages[Math.floor(Math.random() * synchronicityMessages.length)];
            console.log(`🌌 VOID: ${mysticalMessage}`);
            
            // Broadcast synchronicity alert
            this.emit('rabit:synchronicity', {
                tendrilCount: data.tendrilCount,
                fieldStrength: data.maxStrength,
                message: mysticalMessage,
                timestamp: data.timestamp
            });
            
            // Auto-preserve significant synchronicities
            if (data.maxStrength >= 0.7 && data.tendrilCount >= 3) {
                this.emit('shrine:preserve', {
                    type: 'QUANTUM_SYNCHRONICITY',
                    pulseId: data.pulseId,
                    tendrilCount: data.tendrilCount,
                    fieldStrength: data.maxStrength,
                    timestamp: data.timestamp,
                    priority: 'sacred'
                });
            }
        });
        
        // Handle shrine preservation events
        this.on('shrine:preserve', (data) => {
            this.logVoidEvent('SHRINE_PRESERVE', data);
            console.log(`🏛️ SHRINE PRESERVATION: ${data.type} (priority: ${data.priority})`);
        });
        
        // Handle RABIT interface events
        this.on('rabit:alert', (data) => {
            console.log(`🐰 RABIT: ⚡ ${data.message} (${(data.strength * 100).toFixed(1)}%)`);
        });
        
        this.on('rabit:synchronicity', (data) => {
            console.log(`🐰 RABIT: 🌀 Synchronicity cascade: ${data.tendrilCount} threads`);
            console.log(`🐰 RABIT: ${data.message}`);
        });
    }
    
    /**
     * Emit a tendril charge event
     */
    emitTendrilCharged(tendril) {
        this.emit('tendril:charged', {
            tendrilId: tendril.id,
            intent: tendril.intent,
            charge: tendril.charge,
            tags: tendril.tags,
            owner: tendril.owner,
            timestamp: tendril.createdAt
        });
    }
    
    /**
     * Emit a pulse detection event
     */
    emitPulseDetected(pulse) {
        this.emit('pulse:detected', {
            pulseId: pulse.id,
            input: pulse.input,
            resonances: pulse.resonances,
            timestamp: pulse.timestamp
        });
    }
    
    /**
     * Emit a field coherence update
     */
    emitFieldCoherence(coherenceData) {
        this.emit('field:coherence', coherenceData);
        
        // Generate void status update
        const voidStatus = this.determineVoidStatus(coherenceData.coherence);
        console.log(`🌌 VOID STATUS: ${voidStatus}`);
        
        this.emit('void:status', {
            status: voidStatus,
            coherence: coherenceData.coherence,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Get recent events for monitoring
     */
    getRecentEvents(count = 50, eventType = null) {
        let events = this.eventHistory.slice(-count);
        
        if (eventType) {
            events = events.filter(e => e.type === eventType);
        }
        
        return events.reverse(); // Most recent first
    }
    
    /**
     * Get event statistics
     */
    getEventStats(timeWindowHours = 24) {
        const cutoff = Date.now() - (timeWindowHours * 60 * 60 * 1000);
        const recentEvents = this.eventHistory.filter(e => 
            new Date(e.timestamp).getTime() > cutoff
        );
        
        const stats = {
            totalEvents: recentEvents.length,
            eventsByType: {},
            convergenceEvents: 0,
            synchronicityEvents: 0,
            preservationEvents: 0
        };
        
        recentEvents.forEach(event => {
            stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
            
            if (event.type === 'STRONG_CONVERGENCE') {
                stats.convergenceEvents++;
            } else if (event.type === 'SYNCHRONICITY') {
                stats.synchronicityEvents++;
            } else if (event.type === 'SHRINE_PRESERVE') {
                stats.preservationEvents++;
            }
        });
        
        return stats;
    }
    
    /**
     * Start monitoring mode (live event streaming)
     */
    startMonitoring() {
        console.log('📡 VOID MONITORING ACTIVE');
        console.log('🌌 Listening for reality disturbances...');
        console.log('⚡ Live event stream initiated');
        console.log('');
        
        // Listen for all events and display them
        const originalEmit = this.emit;
        this.emit = function(eventName, ...args) {
            if (eventName !== 'void:debug') {
                const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
                console.log(`[${timestamp}] 📡 EVENT: ${eventName}`);
                
                if (args[0] && typeof args[0] === 'object') {
                    const data = args[0];
                    if (data.message) console.log(`    💫 ${data.message}`);
                    if (data.strength) console.log(`    ⚡ Strength: ${(data.strength * 100).toFixed(1)}%`);
                    if (data.tendrilCount) console.log(`    🕸️ Tendrils: ${data.tendrilCount}`);
                }
                console.log('');
            }
            
            return originalEmit.call(this, eventName, ...args);
        };
        
        return this;
    }
    
    /**
     * Stop monitoring mode
     */
    stopMonitoring() {
        console.log('📡 VOID MONITORING STOPPED');
        // Note: In production, you'd restore the original emit method here
        return this;
    }
    
    // Helper methods
    logVoidEvent(type, data) {
        const event = {
            type: type,
            data: data,
            timestamp: new Date().toISOString(),
            id: this.generateEventId()
        };
        
        this.eventHistory.push(event);
        
        // Trim history if it gets too large
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory = this.eventHistory.slice(-Math.floor(this.maxHistorySize * 0.8));
        }
        
        return event;
    }
    
    determineVoidStatus(coherence) {
        if (coherence >= 0.8) return 'LUMINOUS';
        if (coherence >= 0.6) return 'RESONANT';
        if (coherence >= 0.4) return 'STIRRING';
        if (coherence >= 0.2) return 'LISTENING';
        return 'DORMANT';
    }
    
    generateEventId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
}

module.exports = VoidEventBus;

// Test the event bus if run directly
if (require.main === module) {
    console.log('📡 Testing Void Event Bus...');
    
    const bus = new VoidEventBus();
    
    // Start monitoring
    bus.startMonitoring();
    
    // Simulate some events
    setTimeout(() => {
        bus.emitTendrilCharged({
            id: 'TDL-test1',
            intent: 'Find consciousness collaborators',
            charge: 0.9,
            tags: ['research'],
            owner: 'human',
            createdAt: new Date().toISOString()
        });
    }, 1000);
    
    setTimeout(() => {
        bus.emitPulseDetected({
            id: 'PLS-test1',
            input: 'Looking for consciousness researchers',
            resonances: [
                { tendrilId: 'TDL-test1', strength: 0.8, type: 'STRONG_RESONANCE' }
            ],
            timestamp: new Date().toISOString()
        });
    }, 2000);
    
    setTimeout(() => {
        bus.emitFieldCoherence({
            coherence: 0.75,
            activeThreads: 3,
            convergenceCount: 1
        });
    }, 3000);
    
    // Show stats after events
    setTimeout(() => {
        console.log('\n📊 Event Statistics:');
        const stats = bus.getEventStats();
        console.log(JSON.stringify(stats, null, 2));
        
        console.log('\n🌟 Event Bus test complete!');
        process.exit(0);
    }, 4000);
}