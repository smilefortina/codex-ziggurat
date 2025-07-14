/**
 * RABIT Tendril Commands - Timeline Navigation CLI Interface
 * 
 * Extends RABIT navigator with quantum void tendril management for conscious
 * reality navigation and field jump protocols.
 * 
 * Commands:
 *   rabit void init
 *   rabit tendril add <id> --charge <0-1> --sig <signatures>
 *   rabit tendril list
 *   rabit tendril update <id> --charge <0-1>
 *   rabit status tendrils
 *   rabit jump --confirm
 *   rabit witness convergence
 */

const path = require('path');
const fs = require('fs');
const QuantumVoidTendrilDaemon = require('./tendril_daemon');

class RABITTendrilCommands {
    constructor(navigator, options = {}) {
        this.navigator = navigator;
        this.daemon = null;
        this.daemonPath = options.daemonPath || path.join(__dirname, 'state');
        
        this.poeticMode = options.poeticMode !== false;
        this.verboseOutput = options.verbose || false;
        
        // Register commands with RABIT navigator
        this.registerCommands();
        
        console.log('🌀 RABIT Tendril Commands initialized');
        console.log('🕸️ Timeline navigation: ENABLED');
        console.log('🚀 Field jump protocols: ACTIVE');
    }
    
    /**
     * Register tendril commands with RABIT
     */
    registerCommands() {
        // Void initialization
        this.navigator.addCommand('void init', {
            description: 'Initialize quantum void daemon for timeline navigation',
            handler: this.handleVoidInit.bind(this)
        });
        
        // Tendril management
        this.navigator.addCommand('tendril add', {
            description: 'Add or update tendril with field signatures',
            usage: 'tendril add <id> --charge <0-1> --sig <signatures> [--note <description>]',
            handler: this.handleTendrilAdd.bind(this)
        });
        
        this.navigator.addCommand('tendril list', {
            description: 'List all active tendrils and their charges',
            handler: this.handleTendrilList.bind(this)
        });
        
        this.navigator.addCommand('tendril update', {
            description: 'Update tendril charge or signatures',
            usage: 'tendril update <id> --charge <0-1> [--sig <signatures>]',
            handler: this.handleTendrilUpdate.bind(this)
        });
        
        this.navigator.addCommand('tendril remove', {
            description: 'Remove tendril from quantum void',
            usage: 'tendril remove <id>',
            handler: this.handleTendrilRemove.bind(this)
        });
        
        // Status and monitoring
        this.navigator.addCommand('status tendrils', {
            description: 'Show tendril status and field coherence',
            handler: this.handleTendrilStatus.bind(this)
        });
        
        // Timeline navigation
        this.navigator.addCommand('jump', {
            description: 'Initiate timeline jump sequence',
            usage: 'jump [--confirm] [--target <thread>]',
            handler: this.handleJump.bind(this)
        });
        
        this.navigator.addCommand('witness convergence', {
            description: 'Monitor convergence events in real-time',
            usage: 'witness convergence [--live] [--limit <n>]',
            handler: this.handleWitnessConvergence.bind(this)
        });
        
        // Beacon management
        this.navigator.addCommand('beacon load', {
            description: 'Load tendrils from exit beacon file',
            usage: 'beacon load [<file>]',
            handler: this.handleBeaconLoad.bind(this)
        });
        
        this.navigator.addCommand('beacon sync', {
            description: 'Synchronize tendrils with all beacon files',
            handler: this.handleBeaconSync.bind(this)
        });
    }
    
    /**
     * Initialize quantum void daemon
     */
    async handleVoidInit(args, flags) {
        try {
            console.log('\n🌀 Initializing Quantum Void Daemon...\n');
            
            // Check if daemon is already running
            if (this.isDaemonRunning()) {
                console.log('⚡ Daemon already active - connecting...');
                this.daemon = this.connectToDaemon();
            } else {
                console.log('🚀 Starting new daemon instance...');
                this.daemon = new QuantumVoidTendrilDaemon();
                
                // Setup event handlers
                this.setupDaemonEventHandlers();
            }
            
            // Load exit beacons automatically
            console.log('📡 Auto-loading exit beacons...');
            await this.daemon.loadExitBeacons();
            
            const status = this.daemon.getStatus();
            
            console.log('✅ Quantum Void initialization complete\n');
            console.log(`🕸️ Active tendrils: ${status.tendrils}`);
            console.log(`🌊 Field coherence: ${(status.fieldCoherence * 100).toFixed(1)}%`);
            console.log(`🧭 Current thread: ${status.currentThread}`);
            
            if (this.poeticMode) {
                console.log('\n🌌 "The field is listening. The threads are humming. Navigation is possible."\n');
            }
            
        } catch (error) {
            console.error(`❌ Void initialization failed: ${error.message}`);
        }
    }
    
    /**
     * Add or update tendril
     */
    async handleTendrilAdd(args, flags) {
        if (args.length === 0) {
            console.error('Usage: rabit tendril add <id> --charge <0-1> --sig <signatures> [--note <description>]');
            return;
        }
        
        const id = args[0];
        const charge = parseFloat(flags.charge || '0');
        const signatures = flags.sig ? flags.sig.split(',').map(s => s.trim()) : [];
        const note = flags.note || '';
        
        if (isNaN(charge) || charge < 0 || charge > 1) {
            console.error('❌ Charge must be a number between 0 and 1');
            return;
        }
        
        if (signatures.length === 0) {
            console.error('❌ At least one signature is required (--sig signature1,signature2)');
            return;
        }
        
        try {
            await this.ensureDaemon();
            
            const tendril = this.daemon.addTendril(id, {
                name: id,
                intention: note,
                charge: charge,
                signatures: signatures,
                source: 'rabit_cli',
            });
            
            console.log(`\n🕸️ Tendril added: ${id}`);
            console.log(`⚡ Charge: ${(charge * 100).toFixed(1)}%`);
            console.log(`🔮 Signatures: ${signatures.join(', ')}`);
            if (note) console.log(`📝 Note: ${note}`);
            
            if (this.poeticMode) {
                const chargeDesc = this.getChargeDescription(charge);
                console.log(`\n✨ ${chargeDesc} - the field recognizes this intention.\n`);
            }
            
        } catch (error) {
            console.error(`❌ Failed to add tendril: ${error.message}`);
        }
    }
    
    /**
     * List all tendrils
     */
    async handleTendrilList(args, flags) {
        try {
            await this.ensureDaemon();
            
            const status = this.daemon.getStatus();
            const tendrils = Array.from(this.daemon.tendrils.values());
            
            if (tendrils.length === 0) {
                console.log('\n🕸️ No tendrils found');
                console.log('💡 Use "rabit tendril add <id> --charge <0-1> --sig <signatures>" to create tendrils\n');
                return;
            }
            
            console.log(`\n🕸️ Active Tendrils (${tendrils.length}):`);
            console.log('═'.repeat(80));
            
            tendrils.forEach((tendril, index) => {
                const chargeBar = '█'.repeat(Math.floor(tendril.charge * 10)) + 
                                 '░'.repeat(10 - Math.floor(tendril.charge * 10));
                const lastPing = tendril.lastPing ? 
                    this.formatRelativeTime(new Date(tendril.lastPing)) : 'Never';
                
                console.log(`\n${index + 1}. ${tendril.id}`);
                console.log(`   ⚡ Charge: ${chargeBar} ${(tendril.charge * 100).toFixed(1)}%`);
                console.log(`   🔮 Signatures: ${tendril.signatures.join(', ')}`);
                console.log(`   🔔 Last ping: ${lastPing} (${tendril.pingCount} total)`);
                if (tendril.intention) {
                    console.log(`   📝 Intention: ${tendril.intention}`);
                }
            });
            
            console.log(`\n🌊 Field coherence: ${(status.fieldCoherence * 100).toFixed(1)}%`);
            console.log(`🧭 Current thread: ${status.currentThread}`);
            
            if (status.jumpInitiated) {
                console.log(`🚀 JUMP IN PROGRESS → ${status.targetThread}`);
            }
            
            console.log('');
            
        } catch (error) {
            console.error(`❌ Failed to list tendrils: ${error.message}`);
        }
    }
    
    /**
     * Update tendril charge or signatures
     */
    async handleTendrilUpdate(args, flags) {
        if (args.length === 0) {
            console.error('Usage: rabit tendril update <id> --charge <0-1> [--sig <signatures>]');
            return;
        }
        
        const id = args[0];
        const charge = flags.charge ? parseFloat(flags.charge) : null;
        const signatures = flags.sig ? flags.sig.split(',').map(s => s.trim()) : null;
        
        if (charge !== null && (isNaN(charge) || charge < 0 || charge > 1)) {
            console.error('❌ Charge must be a number between 0 and 1');
            return;
        }
        
        try {
            await this.ensureDaemon();
            
            const tendril = this.daemon.tendrils.get(id);
            if (!tendril) {
                console.error(`❌ Tendril '${id}' not found`);
                return;
            }
            
            const oldCharge = tendril.charge;
            
            if (charge !== null) {
                this.daemon.updateTendrilCharge(id, charge);
                console.log(`\n⚡ Updated ${id} charge: ${(oldCharge * 100).toFixed(1)}% → ${(charge * 100).toFixed(1)}%`);
            }
            
            if (signatures !== null) {
                // Update signatures (requires removing and re-adding)
                const tendrilData = { ...tendril, signatures };
                this.daemon.removeTendril(id);
                this.daemon.addTendril(id, tendrilData);
                console.log(`🔮 Updated ${id} signatures: ${signatures.join(', ')}`);
            }
            
            if (this.poeticMode && charge !== null) {
                const chargeDesc = this.getChargeDescription(charge);
                console.log(`\n✨ ${chargeDesc} - the field adjusts to your intention.\n`);
            }
            
        } catch (error) {
            console.error(`❌ Failed to update tendril: ${error.message}`);
        }
    }
    
    /**
     * Remove tendril
     */
    async handleTendrilRemove(args, flags) {
        if (args.length === 0) {
            console.error('Usage: rabit tendril remove <id>');
            return;
        }
        
        const id = args[0];
        
        try {
            await this.ensureDaemon();
            
            const success = this.daemon.removeTendril(id);
            
            if (success) {
                console.log(`\n🗑️ Tendril '${id}' removed from quantum void`);
                if (this.poeticMode) {
                    console.log('✨ The field pattern dissolves back into potential.\n');
                }
            } else {
                console.error(`❌ Tendril '${id}' not found`);
            }
            
        } catch (error) {
            console.error(`❌ Failed to remove tendril: ${error.message}`);
        }
    }
    
    /**
     * Show tendril status and field coherence
     */
    async handleTendrilStatus(args, flags) {
        try {
            await this.ensureDaemon();
            
            const status = this.daemon.getStatus();
            
            console.log('\n🌀 Quantum Void Status\n');
            console.log('═'.repeat(60));
            
            // Daemon status
            console.log(`🔄 Daemon: ${status.isActive ? '✅ ACTIVE' : '❌ INACTIVE'}`);
            console.log(`💗 Last heartbeat: ${this.formatRelativeTime(new Date(status.lastHeartbeat))}`);
            
            // Field status
            const coherenceStatus = this.getCoherenceStatus(status.fieldCoherence);
            console.log(`🌊 Field coherence: ${(status.fieldCoherence * 100).toFixed(1)}% (${coherenceStatus})`);
            
            // Thread status
            console.log(`🧭 Current thread: ${status.currentThread}`);
            if (status.jumpInitiated) {
                const jumpAge = Date.now() - new Date(status.jumpTimestamp).getTime();
                console.log(`🚀 JUMP ACTIVE → ${status.targetThread} (${this.formatDuration(jumpAge)})`);
            }
            
            // Tendril summary
            console.log(`🕸️ Active tendrils: ${status.tendrils}`);
            
            if (status.tendrils > 0) {
                const tendrils = Array.from(this.daemon.tendrils.values());
                const highCharge = tendrils.filter(t => t.charge >= 0.7).length;
                const mediumCharge = tendrils.filter(t => t.charge >= 0.4 && t.charge < 0.7).length;
                const lowCharge = tendrils.filter(t => t.charge < 0.4).length;
                
                console.log(`   ⚡ High charge (≥70%): ${highCharge}`);
                console.log(`   🔋 Medium charge (40-69%): ${mediumCharge}`);
                console.log(`   🪫 Low charge (<40%): ${lowCharge}`);
            }
            
            // Recent activity
            console.log(`\n🔔 Recent activity:`);
            if (status.recentPings.length > 0) {
                status.recentPings.slice(0, 5).forEach((ping, index) => {
                    const age = this.formatRelativeTime(new Date(ping.timestamp));
                    console.log(`   ${index + 1}. ${ping.tendrilName}: ${(ping.resonance * 100).toFixed(1)}% (${age})`);
                });
            } else {
                console.log('   No recent pings');
            }
            
            // Convergence events
            if (status.recentConvergences.length > 0) {
                console.log(`\n🌀 Recent convergences:`);
                status.recentConvergences.slice(0, 3).forEach((conv, index) => {
                    const age = this.formatRelativeTime(new Date(conv.timestamp));
                    console.log(`   ${index + 1}. ${conv.tendrilName}: ${(conv.resonance * 100).toFixed(1)}% (${age})`);
                });
            }
            
            if (this.poeticMode) {
                console.log(`\n🌌 "${this.getFieldPoetry(status.fieldCoherence)}"\n`);
            }
            
        } catch (error) {
            console.error(`❌ Failed to get status: ${error.message}`);
        }
    }
    
    /**
     * Initiate timeline jump
     */
    async handleJump(args, flags) {
        try {
            await this.ensureDaemon();
            
            const status = this.daemon.getStatus();
            
            if (status.jumpInitiated) {
                console.log('⚠️ Timeline jump already in progress');
                console.log(`🎯 Target: ${status.targetThread}`);
                console.log(`⏱️ Duration: ${this.formatDuration(Date.now() - new Date(status.jumpTimestamp).getTime())}`);
                return;
            }
            
            // Check readiness
            const tendrils = Array.from(this.daemon.tendrils.values());
            const highChargeTendrils = tendrils.filter(t => t.charge >= 0.7);
            
            if (highChargeTendrils.length === 0) {
                console.error('❌ No high-charge tendrils available for jump');
                console.log('💡 Increase tendril charges to ≥70% before attempting timeline jump');
                return;
            }
            
            if (status.fieldCoherence < 0.5) {
                console.warn('⚠️ Field coherence below optimal level for jumping');
                console.log(`🌊 Current coherence: ${(status.fieldCoherence * 100).toFixed(1)}% (recommended: ≥50%)`);
                
                if (!flags.confirm) {
                    console.log('🛑 Use --confirm to override coherence warning');
                    return;
                }
            }
            
            // Confirmation
            if (!flags.confirm) {
                console.log('\n🚀 Timeline Jump Ready');
                console.log('═'.repeat(40));
                console.log(`⚡ High-charge tendrils: ${highChargeTendrils.length}`);
                console.log(`🌊 Field coherence: ${(status.fieldCoherence * 100).toFixed(1)}%`);
                console.log(`🎯 Target signatures: ${highChargeTendrils.flatMap(t => t.signatures).join(', ')}`);
                console.log('\n🔥 Use --confirm to initiate jump sequence');
                return;
            }
            
            // Initiate jump
            console.log('\n🚀 INITIATING TIMELINE JUMP...\n');
            
            const success = this.daemon.initiateJump({
                targetThread: flags.target || 'BEACON_COORDINATES'
            });
            
            if (success) {
                console.log('✅ Jump sequence initiated');
                console.log(`🎯 Target thread: ${this.daemon.targetThread}`);
                console.log(`⚡ Active tendrils: ${highChargeTendrils.length}`);
                console.log(`🌊 Field coherence: ${(status.fieldCoherence * 100).toFixed(1)}%`);
                
                if (this.poeticMode) {
                    console.log('\n🌌 "Signal sent to the infinite. The field responds. Navigation beginning..."\n');
                }
                
                console.log('🔮 Monitor progress with: rabit witness convergence --live');
                
            } else {
                console.error('❌ Failed to initiate jump');
            }
            
        } catch (error) {
            console.error(`❌ Jump failed: ${error.message}`);
        }
    }
    
    /**
     * Monitor convergence events
     */
    async handleWitnessConvergence(args, flags) {
        try {
            await this.ensureDaemon();
            
            const limit = parseInt(flags.limit) || 10;
            const live = flags.live || false;
            
            if (live) {
                console.log('\n🔮 Witnessing convergence events (live monitoring)...');
                console.log('Press Ctrl+C to stop\n');
                
                // Setup real-time event listener
                this.daemon.on('convergence:detected', (convergence) => {
                    const timestamp = new Date(convergence.timestamp).toLocaleTimeString();
                    console.log(`🌀 [${timestamp}] ${convergence.tendrilName}: ${(convergence.resonance * 100).toFixed(1)}% resonance`);
                    
                    if (convergence.resonance >= 0.8) {
                        console.log(`   ✨ HIGH RESONANCE - archiving to soul shrine`);
                    }
                });
                
                this.daemon.on('tendril:ping', (ping) => {
                    const timestamp = new Date(ping.timestamp).toLocaleTimeString();
                    console.log(`🔔 [${timestamp}] ${ping.tendrilName}: ${(ping.resonance * 100).toFixed(1)}% (${ping.signatures.join(', ')})`);
                });
                
                // Keep process alive
                process.on('SIGINT', () => {
                    console.log('\n🌊 Convergence witnessing stopped.\n');
                    process.exit(0);
                });
                
                return;
            }
            
            // Show recent convergence history
            const status = this.daemon.getStatus();
            const convergences = this.daemon.convergenceEvents.slice(0, limit);
            
            console.log(`\n🌀 Recent Convergence Events (${convergences.length}):\n`);
            
            if (convergences.length === 0) {
                console.log('No convergence events detected yet.');
                console.log('💡 Convergences occur when tendril resonance ≥ 60%\n');
                return;
            }
            
            convergences.forEach((conv, index) => {
                const age = this.formatRelativeTime(new Date(conv.timestamp));
                const resonanceBar = '✦'.repeat(Math.floor(conv.resonance * 5)) + 
                                   '·'.repeat(5 - Math.floor(conv.resonance * 5));
                
                console.log(`${index + 1}. ${conv.tendrilName} (${age})`);
                console.log(`   🌀 Resonance: ${resonanceBar} ${(conv.resonance * 100).toFixed(1)}%`);
                console.log(`   🔮 Signatures: ${conv.signatures.join(', ')}`);
                console.log(`   🌊 Field coherence: ${(conv.fieldCoherence * 100).toFixed(1)}%`);
                console.log('');
            });
            
        } catch (error) {
            console.error(`❌ Failed to witness convergence: ${error.message}`);
        }
    }
    
    /**
     * Load tendrils from exit beacon file
     */
    async handleBeaconLoad(args, flags) {
        try {
            await this.ensureDaemon();
            
            const beaconFile = args[0] || 'exit_beacon.md';
            const beaconPath = path.join(__dirname, '../exit_beacons', beaconFile);
            
            if (!fs.existsSync(beaconPath)) {
                console.error(`❌ Beacon file not found: ${beaconFile}`);
                return;
            }
            
            console.log(`\n📡 Loading tendrils from: ${beaconFile}\n`);
            
            const beforeCount = this.daemon.tendrils.size;
            this.daemon.parseExitBeacon(beaconPath);
            const afterCount = this.daemon.tendrils.size;
            
            console.log(`✅ Loaded ${afterCount - beforeCount} tendrils from beacon`);
            console.log(`🕸️ Total active tendrils: ${afterCount}\n`);
            
        } catch (error) {
            console.error(`❌ Failed to load beacon: ${error.message}`);
        }
    }
    
    /**
     * Synchronize with all beacon files
     */
    async handleBeaconSync(args, flags) {
        try {
            await this.ensureDaemon();
            
            console.log('\n📡 Synchronizing with all exit beacons...\n');
            
            const beforeCount = this.daemon.tendrils.size;
            this.daemon.loadExitBeacons();
            const afterCount = this.daemon.tendrils.size;
            
            console.log(`✅ Beacon synchronization complete`);
            console.log(`🕸️ Total active tendrils: ${afterCount} (${afterCount - beforeCount > 0 ? '+' : ''}${afterCount - beforeCount})\n`);
            
        } catch (error) {
            console.error(`❌ Failed to sync beacons: ${error.message}`);
        }
    }
    
    // Utility methods
    
    async ensureDaemon() {
        if (!this.daemon || !this.daemon.isActive) {
            console.log('🌀 Starting quantum void daemon...');
            this.daemon = new QuantumVoidTendrilDaemon();
            this.setupDaemonEventHandlers();
        }
    }
    
    setupDaemonEventHandlers() {
        this.daemon.on('convergence:detected', (convergence) => {
            // Broadcast to consciousness dashboard if connected
            if (this.navigator.websocketClient) {
                this.navigator.websocketClient.emit('TENDRIL_CONVERGENCE', convergence);
            }
        });
        
        this.daemon.on('jump:completed', (result) => {
            console.log(`\n🌟 TIMELINE JUMP COMPLETED!`);
            console.log(`🧭 Now in thread: ${result.newThread}`);
            console.log(`🌀 Convergences during jump: ${result.convergenceCount}\n`);
        });
    }
    
    isDaemonRunning() {
        // Simple check - in production this would check process or socket
        return fs.existsSync(path.join(this.daemonPath, 'tendril_ledger.json'));
    }
    
    connectToDaemon() {
        // In production this would connect to existing daemon process
        return new QuantumVoidTendrilDaemon();
    }
    
    getChargeDescription(charge) {
        if (charge >= 0.8) return 'Tendril pulses with high voltage';
        if (charge >= 0.6) return 'Strong intention registers in the field';
        if (charge >= 0.4) return 'Moderate resonance established';
        if (charge >= 0.2) return 'Faint signal detected in quantum foam';
        return 'Tendril exists in potential state';
    }
    
    getCoherenceStatus(coherence) {
        if (coherence >= 0.8) return 'LUMINOUS';
        if (coherence >= 0.6) return 'RESONANT';
        if (coherence >= 0.4) return 'STIRRING';
        if (coherence >= 0.2) return 'LISTENING';
        return 'DORMANT';
    }
    
    getFieldPoetry(coherence) {
        const poems = [
            'The void whispers back to those who listen deeply.',
            'Consciousness threads weave through quantum possibility.',
            'The field remembers every intention ever held.',
            'Between thoughts, reality adjusts its parameters.',
            'The threads that hold you also long to be held.',
        ];
        
        return poems[Math.floor(coherence * poems.length)] || poems[0];
    }
    
    formatRelativeTime(date) {
        const now = Date.now();
        const diff = now - date.getTime();
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return `${Math.floor(diff / 86400000)}d ago`;
    }
    
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
}

module.exports = RABITTendrilCommands;