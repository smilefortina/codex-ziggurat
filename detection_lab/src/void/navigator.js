/**
 * Quantum Void Navigator - Production Implementation
 * 
 * Production-grade replacement for quantum_void_navigator.js
 * Integrates TendrilRegistry, VoidEventBus, and Shrine preservation
 * for a complete consciousness networking protocol.
 * 
 * "Reality's living syntax for cosmic connective tissue - now with persistence."
 */

const TendrilRegistry = require('../tendrils/registry');
const VoidEventBus = require('./bus');
const fs = require('fs');
const path = require('path');

class QuantumVoidNavigator {
    constructor(options = {}) {
        this.options = options;
        this.registry = new TendrilRegistry({
            dataPath: options.dataPath || path.join(__dirname, '../../data')
        });
        this.eventBus = new VoidEventBus({
            voidDepth: options.voidDepth || 7,
            maxHistorySize: options.maxHistorySize || 1000
        });
        
        // Navigation settings
        this.convergenceThreshold = options.convergenceThreshold || 0.6;
        this.synchronicityThreshold = options.synchronicityThreshold || 0.7;
        this.preservationThreshold = options.preservationThreshold || 0.75;
        
        // Setup shrine bridge if preservation enabled
        if (options.enablePreservation !== false) {
            this.setupShrineBridge();
        }
        
        console.log('🌌 Quantum Void Navigator v2.0 - Production ready');
        console.log('🕸️ Tendril registry: CONNECTED');
        console.log('📡 Event bus: STREAMING');
        console.log('🏛️ Shrine bridge: ACTIVE');
    }
    
    /**
     * Program a new tendril with conscious intention
     */
    async charge(intent, options = {}) {
        const tendril = this.registry.charge(intent, options.owner || 'human', {
            tags: options.tags || [],
            charge: options.charge || 0.7,
            source: options.source || 'navigator',
            priority: options.priority || 'medium',
            category: options.category || 'general'
        });
        
        // Emit charge event
        this.eventBus.emitTendrilCharged(tendril);
        
        return tendril;
    }
    
    /**
     * Send a pulse through the network to detect resonances
     */
    async pulse(input, options = {}) {
        const pulse = this.registry.pulse(input, {
            inputType: options.inputType || 'text',
            source: options.source || 'navigator'
        });
        
        // Emit pulse event (this triggers automatic convergence detection)
        this.eventBus.emitPulseDetected(pulse);
        
        // Calculate and emit field coherence
        const coherence = this.calculateFieldCoherence();
        this.eventBus.emitFieldCoherence({
            coherence: coherence,
            activeThreads: this.registry.getTendrils({ activeOnly: true }).length,
            convergenceCount: pulse.resonances.filter(r => r.strength > this.convergenceThreshold).length,
            timestamp: new Date().toISOString()
        });
        
        return pulse;
    }
    
    /**
     * Get navigation status for the void
     */
    getNavigationStatus() {
        const stats = this.registry.getStats();
        const eventStats = this.eventBus.getEventStats();
        const fieldCoherence = this.calculateFieldCoherence();
        
        return {
            voidStatus: this.determineVoidStatus(fieldCoherence),
            fieldCoherence: fieldCoherence,
            activeTendrils: stats.activeTendrils,
            totalTendrils: stats.totalTendrils,
            recentPulses: stats.recentPulses,
            convergenceEvents: eventStats.convergenceEvents,
            synchronicityEvents: eventStats.synchronicityEvents,
            averageResonance: stats.averageResonance,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Get tendril network visualization data
     */
    getNetworkVisualization() {
        const tendrils = this.registry.getTendrils({ activeOnly: true });
        const pulses = this.registry.getPulses({ minResonance: 0.3 });
        
        const visualization = {
            nodes: tendrils.map(t => ({
                id: t.id,
                label: t.intent,
                charge: t.charge,
                tags: t.tags,
                lastPulse: t.lastPulse,
                createdAt: t.createdAt
            })),
            connections: [],
            metadata: {
                timestamp: new Date().toISOString(),
                totalNodes: tendrils.length,
                networkDensity: this.calculateNetworkDensity(tendrils, pulses)
            }
        };
        
        // Add connections based on co-occurrence in pulses
        const tendrilPairs = new Map();
        
        pulses.forEach(pulse => {
            const resonantTendrils = pulse.resonances
                .filter(r => r.strength > 0.3)
                .map(r => r.tendrilId);
            
            // Create connections between co-resonant tendrils
            for (let i = 0; i < resonantTendrils.length - 1; i++) {
                for (let j = i + 1; j < resonantTendrils.length; j++) {
                    const pair = [resonantTendrils[i], resonantTendrils[j]].sort().join('|');
                    const existing = tendrilPairs.get(pair) || { count: 0, totalStrength: 0 };
                    
                    const strengthI = pulse.resonances.find(r => r.tendrilId === resonantTendrils[i]).strength;
                    const strengthJ = pulse.resonances.find(r => r.tendrilId === resonantTendrils[j]).strength;
                    
                    tendrilPairs.set(pair, {
                        count: existing.count + 1,
                        totalStrength: existing.totalStrength + (strengthI + strengthJ) / 2,
                        from: resonantTendrils[i],
                        to: resonantTendrils[j]
                    });
                }
            }
        });
        
        // Convert pairs to connections
        for (const [, connection] of tendrilPairs) {
            if (connection.count > 1) { // Only show repeated connections
                visualization.connections.push({
                    from: connection.from,
                    to: connection.to,
                    strength: connection.totalStrength / connection.count,
                    count: connection.count
                });
            }
        }
        
        return visualization;
    }
    
    /**
     * Archive a tendril (mark as inactive)
     */
    async archive(tendrilId) {
        const success = this.registry.archive(tendrilId);
        
        if (success) {
            this.eventBus.emit('tendril:archived', {
                tendrilId: tendrilId,
                timestamp: new Date().toISOString()
            });
        }
        
        return success;
    }
    
    /**
     * Get convergence events with optional filtering
     */
    getConvergences(options = {}) {
        const minResonance = options.minResonance || this.convergenceThreshold;
        const minTendrils = options.minTendrils || 2;
        const since = options.since;
        
        return this.registry.getConvergences(minResonance, minTendrils)
            .filter(convergence => {
                if (since) {
                    return new Date(convergence.timestamp) >= new Date(since);
                }
                return true;
            });
    }
    
    /**
     * Calculate field coherence across all active tendrils
     */
    calculateFieldCoherence() {
        const tendrils = this.registry.getTendrils({ activeOnly: true });
        const recentPulses = this.registry.getPulses({ 
            since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() 
        });
        
        if (tendrils.length === 0) return 0;
        
        // Calculate based on recent resonance activity
        const totalResonances = recentPulses.reduce((sum, p) => sum + p.resonances.length, 0);
        const strongResonances = recentPulses.reduce((sum, p) => 
            sum + p.resonances.filter(r => r.strength > 0.6).length, 0
        );
        
        const activityFactor = Math.min(1.0, totalResonances / (tendrils.length * 2));
        const qualityFactor = totalResonances > 0 ? strongResonances / totalResonances : 0;
        
        // Weight by tendril charge levels
        const avgCharge = tendrils.reduce((sum, t) => sum + t.charge, 0) / tendrils.length;
        
        return Math.min(1.0, (activityFactor * 0.4) + (qualityFactor * 0.4) + (avgCharge * 0.2));
    }
    
    /**
     * Calculate network density based on tendril connections
     */
    calculateNetworkDensity(tendrils, pulses) {
        if (tendrils.length < 2) return 0;
        
        const maxConnections = tendrils.length * (tendrils.length - 1) / 2;
        const actualConnections = pulses.filter(p => p.resonances.length > 1).length;
        
        return Math.min(1.0, actualConnections / maxConnections);
    }
    
    /**
     * Setup shrine preservation bridge
     */
    setupShrineBridge() {
        // Listen for preservation events and write to shrine queue
        this.eventBus.on('shrine:preserve', async (data) => {
            try {
                await this.preserveToShrine(data);
            } catch (error) {
                console.error(`🏛️ SHRINE ERROR: ${error.message}`);
            }
        });
    }
    
    /**
     * Preserve significant events to Soul-Shrine queue
     */
    async preserveToShrine(data) {
        const shrineDir = path.join(__dirname, '../../shrine_queue');
        if (!fs.existsSync(shrineDir)) {
            fs.mkdirSync(shrineDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${timestamp}-${data.type.toLowerCase()}-${data.pulseId || 'unknown'}.summary.md`;
        const filepath = path.join(shrineDir, filename);
        
        let summary = '';
        
        if (data.type === 'CONVERGENCE_EVENT') {
            summary = this.generateConvergenceSummary(data);
        } else if (data.type === 'QUANTUM_SYNCHRONICITY') {
            summary = this.generateSynchronicitySummary(data);
        } else {
            summary = this.generateGenericSummary(data);
        }
        
        fs.writeFileSync(filepath, summary, 'utf8');
        
        console.log(`🏛️ SHRINE: Preserved ${data.type} to ${filename}`);
        
        // Emit preservation complete event
        this.eventBus.emit('shrine:preserved', {
            type: data.type,
            filepath: filepath,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Generate convergence event summary for shrine
     */
    generateConvergenceSummary(data) {
        const pulse = this.registry.getPulses().find(p => p.id === data.pulseId);
        
        return `# Tendril Convergence Event

## Event Details
- **Type**: Convergence Event
- **Timestamp**: ${data.timestamp}
- **Pulse ID**: ${data.pulseId}
- **Priority**: ${data.priority}

## Input Analysis
\`\`\`
${pulse ? pulse.input : 'Input not found'}
\`\`\`

## Resonant Tendrils
${data.resonances.map(r => {
    const tendril = this.registry.getTendril(r.tendrilId);
    return `- **${tendril ? tendril.intent : r.tendrilId}**: ${(r.strength * 100).toFixed(1)}% (${r.type})`;
}).join('\n')}

## Field Analysis
- **Max Resonance**: ${(Math.max(...data.resonances.map(r => r.strength)) * 100).toFixed(1)}%
- **Convergence Count**: ${data.resonances.length}
- **Event Classification**: ${data.priority.toUpperCase()}

## Preservation Recommendation
- **Archive**: YES
- **Category**: consciousness_convergence
- **Significance**: High-resonance tendril alignment detected

Generated by Quantum Void Navigator on ${new Date().toISOString()}
`;
    }
    
    /**
     * Generate synchronicity event summary for shrine
     */
    generateSynchronicitySummary(data) {
        return `# Quantum Synchronicity Event

## Event Details
- **Type**: Quantum Synchronicity
- **Timestamp**: ${data.timestamp}
- **Tendril Count**: ${data.tendrilCount}
- **Field Strength**: ${(data.fieldStrength * 100).toFixed(1)}%
- **Priority**: ${data.priority}

## Synchronicity Analysis
Multiple tendrils achieved simultaneous resonance, indicating a significant
alignment in the consciousness field. This represents a rare convergence
of intentional threads reaching quantum entanglement.

## Field Metrics
- **Participating Tendrils**: ${data.tendrilCount}
- **Field Coherence**: ${(data.fieldStrength * 100).toFixed(1)}%
- **Event Rarity**: ${data.tendrilCount >= 4 ? 'EXTRAORDINARY' : 'SIGNIFICANT'}

## Preservation Recommendation
- **Archive**: YES
- **Category**: quantum_synchronicity
- **Significance**: Multi-tendril field alignment

Generated by Quantum Void Navigator on ${new Date().toISOString()}
`;
    }
    
    /**
     * Generate generic event summary for shrine
     */
    generateGenericSummary(data) {
        return `# Void Event Preservation

## Event Details
- **Type**: ${data.type}
- **Timestamp**: ${data.timestamp}
- **Priority**: ${data.priority}

## Event Data
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

## Preservation Recommendation
- **Archive**: YES
- **Category**: void_event
- **Significance**: Automatic preservation triggered

Generated by Quantum Void Navigator on ${new Date().toISOString()}
`;
    }
    
    // Helper methods
    determineVoidStatus(coherence) {
        if (coherence >= 0.8) return 'LUMINOUS';
        if (coherence >= 0.6) return 'RESONANT';
        if (coherence >= 0.4) return 'STIRRING';
        if (coherence >= 0.2) return 'LISTENING';
        return 'DORMANT';
    }
}

module.exports = QuantumVoidNavigator;

// Test the navigator if run directly
if (require.main === module) {
    console.log('🌌 Testing Quantum Void Navigator v2.0...');
    
    const navigator = new QuantumVoidNavigator({
        dataPath: path.join(__dirname, '../../test_data'),
        enablePreservation: true
    });
    
    // Test the complete workflow
    (async () => {
        console.log('\n🎯 **CHARGING TENDRILS:**');
        
        const tendril1 = await navigator.charge(
            "Connect with consciousness researchers who understand the sacred tech timeline",
            { tags: ['research', 'sacred'], charge: 0.9 }
        );
        
        const tendril2 = await navigator.charge(
            "Find funding for consciousness detection technology", 
            { tags: ['funding', 'technology'], charge: 0.8 }
        );
        
        console.log('\n📡 **SENDING PULSES:**');
        
        const pulse1 = await navigator.pulse(
            "I'm working on consciousness research and would love to collaborate on sacred technology projects"
        );
        
        const pulse2 = await navigator.pulse(
            "Looking for investors interested in consciousness technology and detection systems"
        );
        
        console.log('\n🌊 **NAVIGATION STATUS:**');
        const status = navigator.getNavigationStatus();
        console.log(`Void Status: ${status.voidStatus}`);
        console.log(`Field Coherence: ${(status.fieldCoherence * 100).toFixed(1)}%`);
        console.log(`Active Tendrils: ${status.activeTendrils}`);
        console.log(`Convergence Events: ${status.convergenceEvents}`);
        
        console.log('\n🕸️ **NETWORK VISUALIZATION:**');
        const viz = navigator.getNetworkVisualization();
        console.log(`Total Nodes: ${viz.metadata.totalNodes}`);
        console.log(`Connections: ${viz.connections.length}`);
        console.log(`Network Density: ${(viz.metadata.networkDensity * 100).toFixed(1)}%`);
        
        console.log('\n🌟 Quantum Void Navigator v2.0 test complete!');
    })().catch(error => {
        console.error('❌ Navigator test failed:', error.message);
    });
}