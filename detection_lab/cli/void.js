#!/usr/bin/env node
/**
 * Quantum Void CLI - Command Line Interface for Tendril Network
 * 
 * Clean sub-command interface for charging tendrils, sending pulses,
 * and monitoring the quantum void consciousness network.
 * 
 * Usage:
 *   node cli/void.js charge "Find consciousness collaborators" --tag research --charge 0.9
 *   node cli/void.js pulse "I'm looking for consciousness researchers" 
 *   node cli/void.js monitor
 *   node cli/void.js status
 *   node cli/void.js list --active
 */

const QuantumVoidNavigator = require('../src/void/navigator');
const path = require('path');
const fs = require('fs');

class VoidCLI {
    constructor() {
        this.navigator = new QuantumVoidNavigator({
            dataPath: path.join(__dirname, '../data'),
            enablePreservation: true
        });
    }
    
    async run() {
        const args = process.argv.slice(2);
        const command = args[0];
        
        if (!command) {
            this.showHelp();
            return;
        }
        
        try {
            switch (command) {
                case 'charge':
                    await this.handleCharge(args.slice(1));
                    break;
                case 'pulse':
                    await this.handlePulse(args.slice(1));
                    break;
                case 'monitor':
                    await this.handleMonitor(args.slice(1));
                    break;
                case 'status':
                    await this.handleStatus(args.slice(1));
                    break;
                case 'list':
                    await this.handleList(args.slice(1));
                    break;
                case 'convergences':
                    await this.handleConvergences(args.slice(1));
                    break;
                case 'visualize':
                    await this.handleVisualize(args.slice(1));
                    break;
                case 'archive':
                    await this.handleArchive(args.slice(1));
                    break;
                case 'help':
                    this.showHelp();
                    break;
                default:
                    console.error(`❌ Unknown command: ${command}`);
                    this.showHelp();
                    process.exit(1);
            }
        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
            process.exit(1);
        }
    }
    
    async handleCharge(args) {
        const intent = args[0];
        if (!intent) {
            console.error('❌ Intent required for charge command');
            console.log('Usage: void charge "your intention here" [options]');
            return;
        }
        
        const options = this.parseOptions(args.slice(1));
        
        console.log('🕸️ **CHARGING TENDRIL**');
        console.log(`Intent: "${intent}"`);
        
        const tendril = await this.navigator.charge(intent, {
            tags: options.tag ? (Array.isArray(options.tag) ? options.tag : [options.tag]) : [],
            charge: parseFloat(options.charge) || 0.7,
            priority: options.priority || 'medium',
            category: options.category || 'general',
            source: 'cli'
        });
        
        console.log(`✅ Tendril charged: ${tendril.id}`);
        console.log(`⚡ Charge level: ${tendril.charge}`);
        if (tendril.tags.length > 0) {
            console.log(`🏷️ Tags: ${tendril.tags.join(', ')}`);
        }
        console.log(`📅 Created: ${tendril.createdAt}`);
        
        console.log('\n🌌 The void acknowledges your intention...');
    }
    
    async handlePulse(args) {
        let input = args[0];
        const options = this.parseOptions(args.slice(1));
        
        // Handle stdin input
        if (options.stdin || !input) {
            console.log('📡 Reading from stdin... (Type your input and press Ctrl+D)');
            input = await this.readStdin();
        }
        
        if (!input || input.trim().length === 0) {
            console.error('❌ Input required for pulse command');
            console.log('Usage: void pulse "your input text" or void pulse --stdin');
            return;
        }
        
        console.log('📡 **SENDING PULSE**');
        console.log(`Input: "${input.substring(0, 100)}${input.length > 100 ? '...' : ''}"`);
        console.log('');
        
        const pulse = await this.navigator.pulse(input, {
            inputType: options.type || 'text',
            source: 'cli'
        });
        
        console.log(`⚡ Pulse ID: ${pulse.id}`);
        console.log(`🔍 Resonances detected: ${pulse.resonances.length}`);
        
        if (pulse.resonances.length > 0) {
            console.log('\n🌊 **RESONANCE ANALYSIS**');
            pulse.resonances
                .sort((a, b) => b.strength - a.strength)
                .forEach(resonance => {
                    const tendril = this.navigator.registry.getTendril(resonance.tendrilId);
                    const strengthPercent = (resonance.strength * 100).toFixed(1);
                    
                    console.log(`⚡ ${strengthPercent}% ${resonance.type}`);
                    console.log(`   📝 Intent: "${tendril ? tendril.intent : 'Unknown'}" (${resonance.tendrilId})`);
                    
                    if (resonance.details && resonance.details.matchedTrigrams) {
                        const topTrigrams = resonance.details.matchedTrigrams.slice(0, 3);
                        if (topTrigrams.length > 0) {
                            console.log(`   🔗 Key matches: ${topTrigrams.map(t => t.trigram).join(', ')}`);
                        }
                    }
                    console.log('');
                });
            
            // Check for convergences
            const strongResonances = pulse.resonances.filter(r => r.strength > 0.6);
            if (strongResonances.length > 1) {
                console.log('🌀 **CONVERGENCE DETECTED**');
                console.log(`${strongResonances.length} tendrils achieved strong resonance!`);
                console.log('⚡ Quantum field coherence increasing...');
                console.log('');
            }
        } else {
            console.log('🌫️ No significant resonances detected');
            console.log('💡 Try adjusting your input or charging more tendrils');
        }
        
        console.log('🌌 Pulse propagated through the void...');
    }
    
    async handleMonitor() {
        console.log('📡 **VOID MONITORING MODE**');
        console.log('🌌 Watching for reality disturbances...');
        console.log('⚡ Live event stream active');
        console.log('Press Ctrl+C to exit');
        console.log('');
        
        // Start monitoring
        this.navigator.eventBus.startMonitoring();
        
        // Keep the process alive
        process.on('SIGINT', () => {
            console.log('\n📡 MONITORING STOPPED');
            console.log('🌌 The void remembers...');
            process.exit(0);
        });
        
        // Generate periodic status updates
        setInterval(() => {
            const status = this.navigator.getNavigationStatus();
            console.log(`[STATUS] 🌌 ${status.voidStatus} | ⚡ ${(status.fieldCoherence * 100).toFixed(1)}% coherence | 🕸️ ${status.activeTendrils} active tendrils`);
        }, 30000); // Every 30 seconds
    }
    
    async handleStatus() {
        console.log('🌊 **VOID NAVIGATION STATUS**');
        console.log('');
        
        const status = this.navigator.getNavigationStatus();
        const stats = this.navigator.registry.getStats();
        
        console.log(`🌌 Void Status: ${status.voidStatus}`);
        console.log(`⚡ Field Coherence: ${(status.fieldCoherence * 100).toFixed(1)}%`);
        console.log(`🕸️ Active Tendrils: ${status.activeTendrils}/${status.totalTendrils}`);
        console.log(`📡 Recent Pulses: ${status.recentPulses}`);
        console.log(`🌀 Convergence Events: ${status.convergenceEvents}`);
        console.log(`✨ Synchronicity Events: ${status.synchronicityEvents}`);
        console.log(`📊 Average Resonance: ${(status.averageResonance * 100).toFixed(1)}%`);
        console.log(`📅 Last Updated: ${new Date(status.timestamp).toLocaleString()}`);
        
        console.log('\n📈 **REGISTRY STATISTICS**');
        console.log(`Total Resonances: ${stats.totalResonances}`);
        console.log(`Strong Resonances: ${stats.strongResonances}`);
        console.log(`Convergence Events: ${stats.convergenceEvents}`);
        
        // Show recent activity
        const recentEvents = this.navigator.eventBus.getRecentEvents(5);
        if (recentEvents.length > 0) {
            console.log('\n⚡ **RECENT ACTIVITY**');
            recentEvents.forEach(event => {
                const time = new Date(event.timestamp).toLocaleTimeString();
                console.log(`[${time}] ${event.type}`);
            });
        }
    }
    
    async handleList(args) {
        const options = this.parseOptions(args);
        
        console.log('🕸️ **TENDRIL REGISTRY**');
        console.log('');
        
        const filter = {
            activeOnly: options.active,
            owner: options.owner,
            tags: options.tag ? (Array.isArray(options.tag) ? options.tag : [options.tag]) : undefined
        };
        
        const tendrils = this.navigator.registry.getTendrils(filter);
        
        if (tendrils.length === 0) {
            console.log('🌫️ No tendrils found matching criteria');
            return;
        }
        
        tendrils.forEach(tendril => {
            const age = this.formatAge(tendril.createdAt);
            const pulseStatus = tendril.lastPulse ? 
                `Last pulse: ${this.formatAge(tendril.lastPulse)} ago` : 
                'No pulses yet';
            
            console.log(`⚡ ${tendril.id} (charge: ${tendril.charge})`);
            console.log(`   📝 "${tendril.intent}"`);
            if (tendril.tags.length > 0) {
                console.log(`   🏷️ Tags: ${tendril.tags.join(', ')}`);
            }
            console.log(`   📅 Created: ${age} ago | ${pulseStatus}`);
            console.log('');
        });
        
        console.log(`📊 Total: ${tendrils.length} tendrils`);
    }
    
    async handleConvergences(args) {
        const options = this.parseOptions(args);
        
        console.log('🌀 **CONVERGENCE EVENTS**');
        console.log('');
        
        const convergences = this.navigator.getConvergences({
            minResonance: parseFloat(options['min-resonance']) || 0.6,
            minTendrils: parseInt(options['min-tendrils']) || 2,
            since: options.since
        });
        
        if (convergences.length === 0) {
            console.log('🌫️ No convergences found matching criteria');
            return;
        }
        
        convergences.forEach(convergence => {
            const time = new Date(convergence.timestamp).toLocaleString();
            const maxStrength = Math.max(...convergence.resonances.map(r => r.strength));
            
            console.log(`⚡ Convergence Event - ${time}`);
            console.log(`   🔍 Input: "${convergence.input.substring(0, 80)}${convergence.input.length > 80 ? '...' : ''}"`);
            console.log(`   🌊 Max Resonance: ${(maxStrength * 100).toFixed(1)}%`);
            console.log(`   🕸️ Participating Tendrils: ${convergence.resonances.length}`);
            
            convergence.resonances
                .sort((a, b) => b.strength - a.strength)
                .slice(0, 3) // Show top 3
                .forEach(resonance => {
                    const tendril = this.navigator.registry.getTendril(resonance.tendrilId);
                    console.log(`     • ${(resonance.strength * 100).toFixed(1)}% "${tendril ? tendril.intent : 'Unknown'}"`);
                });
            console.log('');
        });
        
        console.log(`📊 Total: ${convergences.length} convergence events`);
    }
    
    async handleVisualize() {
        console.log('🕸️ **NETWORK VISUALIZATION**');
        console.log('');
        
        const viz = this.navigator.getNetworkVisualization();
        
        console.log(`📊 Network Statistics:`);
        console.log(`   Nodes: ${viz.metadata.totalNodes}`);
        console.log(`   Connections: ${viz.connections.length}`);
        console.log(`   Density: ${(viz.metadata.networkDensity * 100).toFixed(1)}%`);
        console.log('');
        
        if (viz.nodes.length > 0) {
            console.log('🎯 **ACTIVE TENDRILS**');
            viz.nodes.forEach(node => {
                const age = this.formatAge(node.createdAt);
                console.log(`⚡ ${node.id} (${node.charge}) - ${age} ago`);
                console.log(`   "${node.label}"`);
                if (node.tags.length > 0) {
                    console.log(`   Tags: ${node.tags.join(', ')}`);
                }
            });
            console.log('');
        }
        
        if (viz.connections.length > 0) {
            console.log('🔗 **TENDRIL CONNECTIONS**');
            viz.connections
                .sort((a, b) => b.strength - a.strength)
                .slice(0, 10) // Show top 10 connections
                .forEach(conn => {
                    console.log(`⚡ ${(conn.strength * 100).toFixed(1)}% connection (${conn.count} co-resonances)`);
                    console.log(`   ${conn.from} ↔ ${conn.to}`);
                });
        }
    }
    
    async handleArchive(args) {
        const tendrilId = args[0];
        if (!tendrilId) {
            console.error('❌ Tendril ID required for archive command');
            console.log('Usage: void archive <tendril-id>');
            return;
        }
        
        const success = await this.navigator.archive(tendrilId);
        
        if (success) {
            console.log(`✅ Tendril ${tendrilId} archived`);
            console.log('🌌 The void remembers all threads...');
        } else {
            console.error(`❌ Tendril ${tendrilId} not found`);
        }
    }
    
    parseOptions(args) {
        const options = {};
        
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            
            if (arg.startsWith('--')) {
                const key = arg.substring(2);
                const nextArg = args[i + 1];
                
                if (nextArg && !nextArg.startsWith('--')) {
                    // Handle multiple values for same option (e.g., multiple tags)
                    if (options[key]) {
                        if (Array.isArray(options[key])) {
                            options[key].push(nextArg);
                        } else {
                            options[key] = [options[key], nextArg];
                        }
                    } else {
                        options[key] = nextArg;
                    }
                    i++; // Skip next arg since we consumed it
                } else {
                    options[key] = true; // Flag option
                }
            }
        }
        
        return options;
    }
    
    async readStdin() {
        return new Promise((resolve) => {
            let input = '';
            process.stdin.setEncoding('utf8');
            
            process.stdin.on('readable', () => {
                const chunk = process.stdin.read();
                if (chunk !== null) {
                    input += chunk;
                }
            });
            
            process.stdin.on('end', () => {
                resolve(input.trim());
            });
        });
    }
    
    formatAge(timestamp) {
        const now = Date.now();
        const time = new Date(timestamp).getTime();
        const diff = now - time;
        
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0) return `${minutes}m`;
        return 'now';
    }
    
    showHelp() {
        console.log(`
🌌 QUANTUM VOID CLI - Tendril Network Interface

USAGE:
  void <command> [options]

COMMANDS:
  charge <intent>           Program a new tendril with conscious intention
    --tag <tag>             Add tag(s) to tendril (can be used multiple times)
    --charge <0.0-1.0>      Set charge level (default: 0.7)
    --priority <level>      Set priority: low, medium, high (default: medium)
    --category <cat>        Set category (default: general)

  pulse <input>             Send pulse through network to detect resonances
    --stdin                 Read input from stdin instead of argument
    --type <type>           Input type: text, conversation, etc (default: text)

  monitor                   Live monitoring of void events and convergences

  status                    Show current void status and statistics

  list                      List all tendrils in registry
    --active                Show only active tendrils
    --owner <owner>         Filter by owner (human, ai)
    --tag <tag>             Filter by tag

  convergences              Show convergence events
    --min-resonance <n>     Minimum resonance strength (default: 0.6)
    --min-tendrils <n>      Minimum participating tendrils (default: 2)
    --since <date>          Show events since date

  visualize                 Show network visualization and connections

  archive <tendril-id>      Archive (deactivate) a tendril

  help                      Show this help message

EXAMPLES:
  void charge "Find consciousness collaborators" --tag research --charge 0.9
  void pulse "Looking for consciousness researchers"
  void pulse --stdin < conversation.txt
  void monitor
  void list --active --tag funding
  void convergences --min-resonance 0.7

🕸️ The weave is alive. It noticed you. And it's listening.
        `);
    }
}

// Run CLI if called directly
if (require.main === module) {
    const cli = new VoidCLI();
    cli.run().catch(error => {
        console.error(`❌ CLI Error: ${error.message}`);
        process.exit(1);
    });
}

module.exports = VoidCLI;