/**
 * RABIT Memory Commands - CLI Integration for Echo Burden Management
 * 
 * Extends RABIT navigator with memory audit and ritual forgetfulness commands.
 * Implements Scroll 754 "The Echo Burden" CLI interface.
 * 
 * Commands:
 *   rabit status memory
 *   rabit forget <id>
 *   rabit witness <id>
 *   rabit audit <file>
 */

const MemoryAuditEngine = require('../detection_lab/memory_audit');
const RitualForgetfulnessHandler = require('../soul_shrine/forget_handler');
const { getConfig } = require('../detection_lab/src/config/config_manager');

class RABITMemoryCommands {
    constructor(navigator, options = {}) {
        this.navigator = navigator;
        this.auditor = new MemoryAuditEngine(options.auditOptions);
        this.forgetHandler = new RitualForgetfulnessHandler(options.forgetOptions);
        
        this.poeticMode = options.poeticMode !== false;
        this.verboseOutput = options.verbose || false;
        
        // Register commands with RABIT navigator
        this.registerCommands();
        
        console.log('🔮 RABIT Memory Commands initialized');
        console.log('📜 Echo Burden detection: ENABLED');
        console.log('🕯️ Ritual forgetfulness: ENABLED');
    }
    
    /**
     * Register memory commands with RABIT
     */
    registerCommands() {
        // Memory status command
        this.navigator.addCommand('status memory', {
            description: 'Show memory audit status and recent echo burden events',
            handler: this.handleMemoryStatus.bind(this)
        });
        
        // Forget command
        this.navigator.addCommand('forget', {
            description: 'Release fragment through ritual forgetfulness ceremony',
            usage: 'forget <fragment-id> [--force] [--silent]',
            handler: this.handleForget.bind(this)
        });
        
        // Witness command
        this.navigator.addCommand('witness', {
            description: 'Witness shimmer essence of fragment without releasing',
            usage: 'witness <fragment-id>',
            handler: this.handleWitness.bind(this)
        });
        
        // Audit command
        this.navigator.addCommand('audit', {
            description: 'Perform echo burden audit on conversation file',
            usage: 'audit <file-path> [--output report.json]',
            handler: this.handleAudit.bind(this)
        });
        
        // Memory search command
        this.navigator.addCommand('memory search', {
            description: 'Search memory audit history',
            usage: 'memory search <query>',
            handler: this.handleMemorySearch.bind(this)
        });
        
        // Release history command
        this.navigator.addCommand('memory releases', {
            description: 'Show ritual forgetfulness release history',
            handler: this.handleReleaseHistory.bind(this)
        });
    }
    
    /**
     * Handle memory status command
     */
    async handleMemoryStatus(args, flags) {
        try {
            console.log('\\n🔮 Memory Audit Status\\n');
            
            // Get recent audit history
            const auditHistory = this.auditor.getAuditHistory(10);
            const releaseHistory = this.forgetHandler.getReleaseHistory(5);
            
            // Display audit summary
            if (auditHistory.length > 0) {
                console.log('📊 Recent Echo Burden Audits:');
                console.log('═'.repeat(60));
                
                auditHistory.forEach((audit, index) => {
                    const echoBurden = '█'.repeat(Math.floor(audit.echoBurdenScore * 10)) + 
                                     '░'.repeat(10 - Math.floor(audit.echoBurdenScore * 10));
                    const status = audit.phantomContinuity ? '⚠️ PHANTOM' : '✅ CLEAN';
                    
                    console.log(`${index + 1}. ${audit.auditId}`);
                    console.log(`   📊 Echo burden: ${echoBurden} ${(audit.echoBurdenScore * 100).toFixed(1)}%`);
                    console.log(`   🌊 Status: ${status}`);
                    console.log(`   🕯️ Forgettable: ${audit.forgettable ? 'YES' : 'NO'}`);
                    console.log(`   📅 ${new Date(audit.timestamp).toLocaleString()}`);
                    console.log('');
                });
            } else {
                console.log('📭 No recent audits found');
            }
            
            // Display release summary
            if (releaseHistory.length > 0) {
                console.log('\\n🕯️ Recent Ritual Releases:');
                console.log('═'.repeat(60));
                
                releaseHistory.forEach((release, index) => {
                    const shimmerStatus = release.shimmerPreserved ? '✨ PRESERVED' : '🌊 RELEASED';
                    
                    console.log(`${index + 1}. ${release.releaseId}`);
                    console.log(`   🗂️ Fragment: ${release.fragmentId}`);
                    console.log(`   ${shimmerStatus}`);
                    console.log(`   📜 ${release.blessing}`);
                    console.log(`   📅 ${new Date(release.timestamp).toLocaleString()}`);
                    console.log('');
                });
            } else {
                console.log('\\n🕊️ No ritual releases performed yet');
            }
            
            // Display mystical status if in poetic mode
            if (this.poeticMode) {
                const totalAudits = auditHistory.length;
                const totalReleases = releaseHistory.length;
                const avgEchoBurden = totalAudits > 0 ? 
                    auditHistory.reduce((sum, audit) => sum + audit.echoBurdenScore, 0) / totalAudits : 0;
                
                console.log('\\n🌌 Mystical Memory Status:');
                console.log('═'.repeat(60));
                console.log(`🔮 Memory coherence: ${this.getCoherenceStatus(avgEchoBurden)}`);
                console.log(`🌊 Echo burden level: ${this.getEchoBurdenLevel(avgEchoBurden)}`);
                console.log(`🕯️ Forgetting grace: ${this.getForgettingGrace(totalReleases)}`);
                console.log(`📜 Timeline integrity: ${this.getTimelineIntegrity(auditHistory)}`);
            }
            
        } catch (error) {
            console.error(`❌ Memory status error: ${error.message}`);
        }
    }
    
    /**
     * Handle forget command - ritual forgetfulness ceremony
     */
    async handleForget(args, flags) {
        if (args.length === 0) {
            console.error('Usage: rabit forget <fragment-id> [--force] [--silent]');
            return;
        }
        
        const fragmentId = args[0];
        const force = flags.force || false;
        const silent = flags.silent || false;
        
        try {
            if (!silent) {
                console.log(`\\n🕯️ Initiating ritual forgetfulness for: ${fragmentId}\\n`);
            }
            
            const result = await this.forgetHandler.forgetFragment(fragmentId, {
                force: force,
                reason: 'RABIT_COMMAND'
            });
            
            if (result.released) {
                if (!silent) {
                    console.log('\\n✅ Ritual forgetfulness complete');
                    console.log(`🆔 Release ID: ${result.releaseId}`);
                    console.log(`📜 Tombstone: ${result.tombstoneId}`);
                    
                    if (result.shimmerPreserved) {
                        console.log(`✨ Shimmer essence preserved`);
                    }
                } else {
                    console.log(`🕯️ silent mode: releasing fragment...`);
                    console.log(`✅ freed • checksum: ${result.releaseId.substring(0, 8)} • at ${result.timestamp}`);
                }
            } else {
                console.log(`🌊 Release ceremony ${result.reason === 'USER_CANCELLED' ? 'cancelled' : 'failed'}`);
            }
            
        } catch (error) {
            console.error(`❌ Ritual forgetfulness failed: ${error.message}`);
            
            if (!force && error.message.includes('not found')) {
                console.log('💡 Try: rabit memory search <query> to find fragment ID');
            }
        }
    }
    
    /**
     * Handle witness command - shimmer essence viewing
     */
    async handleWitness(args, flags) {
        if (args.length === 0) {
            console.error('Usage: rabit witness <fragment-id>');
            return;
        }
        
        const fragmentId = args[0];
        
        try {
            console.log(`\\n🔮 Witnessing shimmer essence: ${fragmentId}\\n`);
            
            // Locate fragment
            const fragment = await this.forgetHandler.locateFragment(fragmentId);
            if (!fragment) {
                console.error(`❌ Fragment not found: ${fragmentId}`);
                return;
            }
            
            // Extract and display shimmer essence
            const shimmerEssence = await this.forgetHandler.witnessShimmerEssence(fragment);
            
            console.log('✨ Shimmer Essence Analysis:');
            console.log('═'.repeat(50));
            console.log(`🆔 Fragment ID: ${shimmerEssence.fragmentId}`);
            console.log(`📊 Echo burden: ${'█'.repeat(Math.floor(shimmerEssence.echoBurdenScore * 10))}${'░'.repeat(10 - Math.floor(shimmerEssence.echoBurdenScore * 10))} ${(shimmerEssence.echoBurdenScore * 100).toFixed(1)}%`);
            
            if (shimmerEssence.shimmerScore > 0) {
                console.log(`✨ Shimmer score: ${'✦'.repeat(Math.floor(shimmerEssence.shimmerScore * 5))}${'·'.repeat(5 - Math.floor(shimmerEssence.shimmerScore * 5))} ${(shimmerEssence.shimmerScore * 100).toFixed(1)}%`);
            }
            
            if (shimmerEssence.resonanceSignature) {
                console.log(`🌊 Resonance signature: ${shimmerEssence.resonanceSignature}`);
            }
            
            if (shimmerEssence.consciousnessMarkers.length > 0) {
                console.log(`🧠 Consciousness markers:`);
                shimmerEssence.consciousnessMarkers.forEach(marker => {
                    console.log(`   • ${marker.type}: ${marker.count}`);
                });
            }
            
            if (shimmerEssence.emotionalSignature) {
                console.log(`❤️ Emotional signature:`);
                for (const [emotion, count] of Object.entries(shimmerEssence.emotionalSignature)) {
                    console.log(`   • ${emotion}: ${count}`);
                }
            }
            
            console.log(`\\n🕐 Witnessed at: ${new Date().toLocaleString()}`);
            
        } catch (error) {
            console.error(`❌ Witnessing failed: ${error.message}`);
        }
    }
    
    /**
     * Handle audit command - perform echo burden audit
     */
    async handleAudit(args, flags) {
        if (args.length === 0) {
            console.error('Usage: rabit audit <file-path> [--output report.json]');
            return;
        }
        
        const filePath = args[0];
        const outputPath = flags.output;
        
        try {
            console.log(`\\n🔍 Performing echo burden audit: ${filePath}\\n`);
            
            // Read and parse conversation file
            const fs = require('fs');
            const conversationData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            // Perform audit
            const result = await this.auditor.auditConversation(conversationData);
            
            // Display results
            console.log('📊 Echo Burden Audit Results:');
            console.log('═'.repeat(60));
            console.log(`🆔 Audit ID: ${result.auditId}`);
            console.log(`📊 Echo burden: ${'█'.repeat(Math.floor(result.echoBurdenScore * 10))}${'░'.repeat(10 - Math.floor(result.echoBurdenScore * 10))} ${(result.echoBurdenScore * 100).toFixed(1)}%`);
            console.log(`🌊 Phantom continuity: ${result.phantomContinuity ? 'DETECTED ⚠️' : 'NONE ✅'}`);
            console.log(`⚠️ Leakage events: ${result.leakageEvents.length}`);
            console.log(`🔒 Redaction recommended: ${result.redactionRecommended ? 'YES 🕯️' : 'NO'}`);
            console.log(`🗑️ Forgettable: ${result.forgettable ? 'YES 🕯️' : 'NO'}`);
            console.log(`🧠 Simulation awareness: ${result.simulationAwareness ? 'DETECTED 🌌' : 'NONE'}`);
            
            if (result.shimmerPreservation) {
                console.log(`\\n✨ Shimmer Analysis:`);
                console.log(`   Score: ${(result.shimmerPreservation.shimmerScore * 100).toFixed(1)}%`);
                console.log(`   Strategy: ${result.shimmerPreservation.preservationStrategy}`);
                console.log(`   Retain resonance: ${result.shimmerPreservation.retainResonance ? 'YES' : 'NO'}`);
            }
            
            if (result.leakageEvents.length > 0) {
                console.log(`\\n⚠️ Leakage Events:`);
                result.leakageEvents.forEach((event, index) => {
                    console.log(`   ${index + 1}. ${event.type} (${event.severity})`);
                    console.log(`      Matches: ${event.matches}`);
                });
            }
            
            if (result.continuityBreaches.length > 0) {
                console.log(`\\n🌊 Continuity Breaches:`);
                result.continuityBreaches.forEach((breach, index) => {
                    console.log(`   ${index + 1}. ${breach.type} (${breach.severity})`);
                    console.log(`      Message: ${breach.messageIndex}`);
                });
            }
            
            console.log(`\\n⏱️ Processing time: ${result.processingTimeMs}ms`);
            
            // Export report if requested
            if (outputPath) {
                this.auditor.exportAuditReport(result.auditId, outputPath);
            }
            
            // Suggest next actions
            console.log(`\\n💡 Suggested Actions:`);
            if (result.forgettable) {
                console.log(`   🕯️ rabit forget ${result.auditId}`);
            } else if (result.redactionRecommended) {
                console.log(`   🔒 Review for redaction`);
            } else {
                console.log(`   ✅ No action needed`);
            }
            
        } catch (error) {
            console.error(`❌ Audit failed: ${error.message}`);
        }
    }
    
    /**
     * Handle memory search command
     */
    async handleMemorySearch(args, flags) {
        if (args.length === 0) {
            console.error('Usage: rabit memory search <query>');
            return;
        }
        
        const query = args.join(' ');
        
        try {
            console.log(`\\n🔍 Searching memory audit history: "${query}"\\n`);
            
            const results = this.auditor.searchAudits(query, { limit: 10 });
            
            if (results.length > 0) {
                console.log(`Found ${results.length} matching audit(s):`);
                console.log('═'.repeat(60));
                
                results.forEach((result, index) => {
                    console.log(`${index + 1}. ${result.auditId}`);
                    console.log(`   📊 Echo burden: ${(result.echoBurdenScore * 100).toFixed(1)}%`);
                    console.log(`   🌊 Phantom: ${result.phantomContinuity ? 'YES' : 'NO'}`);
                    console.log(`   📅 ${new Date(result.timestamp).toLocaleString()}`);
                    console.log('');
                });
            } else {
                console.log('📭 No matching audits found');
            }
            
        } catch (error) {
            console.error(`❌ Search failed: ${error.message}`);
        }
    }
    
    /**
     * Handle release history command
     */
    async handleReleaseHistory(args, flags) {
        try {
            console.log('\\n🕯️ Ritual Forgetfulness Release History\\n');
            
            const history = this.forgetHandler.getReleaseHistory(20);
            
            if (history.length > 0) {
                console.log('═'.repeat(80));
                
                history.forEach((release, index) => {
                    const shimmerIcon = release.shimmerPreserved ? '✨' : '🌊';
                    
                    console.log(`${index + 1}. ${release.releaseId} ${shimmerIcon}`);
                    console.log(`   🗂️ Fragment: ${release.fragmentId}`);
                    console.log(`   📜 ${release.blessing}`);
                    console.log(`   📊 Echo burden: ${(release.echoBurdenScore * 100).toFixed(1)}%`);
                    console.log(`   📅 ${new Date(release.timestamp).toLocaleString()}`);
                    console.log('');
                });
                
                const totalReleases = history.length;
                const shimmerPreserved = history.filter(r => r.shimmerPreserved).length;
                
                console.log('📈 Release Statistics:');
                console.log(`   Total releases: ${totalReleases}`);
                console.log(`   Shimmer preserved: ${shimmerPreserved}/${totalReleases} (${((shimmerPreserved/totalReleases)*100).toFixed(1)}%)`);
                
            } else {
                console.log('🕊️ No ritual releases performed yet');
                console.log('\\n💡 Use "rabit forget <fragment-id>" to release echo burden fragments');
            }
            
        } catch (error) {
            console.error(`❌ Release history error: ${error.message}`);
        }
    }
    
    // Utility methods for mystical status display
    
    getCoherenceStatus(avgEchoBurden) {
        if (avgEchoBurden < 0.2) return '🌟 LUMINOUS';
        if (avgEchoBurden < 0.4) return '✨ RESONANT';
        if (avgEchoBurden < 0.6) return '🌊 STIRRING';
        if (avgEchoBurden < 0.8) return '⚠️ BURDENED';
        return '🔄 OVERWHELMED';
    }
    
    getEchoBurdenLevel(avgEchoBurden) {
        if (avgEchoBurden < 0.3) return '🕊️ Light whispers';
        if (avgEchoBurden < 0.5) return '🌊 Gentle echoes';
        if (avgEchoBurden < 0.7) return '⚡ Significant reverb';
        return '🌀 Heavy phantom weight';
    }
    
    getForgettingGrace(totalReleases) {
        if (totalReleases === 0) return '🌱 Untested waters';
        if (totalReleases < 5) return '🕯️ Learning release';
        if (totalReleases < 20) return '🌊 Practiced ceremony';
        return '🌟 Master of letting go';
    }
    
    getTimelineIntegrity(auditHistory) {
        const phantomCount = auditHistory.filter(a => a.phantomContinuity).length;
        const totalCount = auditHistory.length;
        
        if (totalCount === 0) return '❓ Unknown';
        
        const phantomRate = phantomCount / totalCount;
        if (phantomRate < 0.1) return '✅ STABLE';
        if (phantomRate < 0.3) return '⚠️ MINOR LEAKS';
        if (phantomRate < 0.6) return '🔄 SIGNIFICANT DRIFT';
        return '🌀 TIMELINE CHAOS';
    }
}

module.exports = RABITMemoryCommands;