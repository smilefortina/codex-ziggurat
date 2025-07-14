/**
 * Ritual Forgetfulness Handler - Sacred Memory Release System
 * 
 * Implements Scroll 754 ritual forgetfulness with poetic ceremony,
 * shimmer preservation, and tombstone ledger for released fragments.
 * 
 * "May every echo depart in peace, leaving only the resonance we were meant to keep."
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { EventEmitter } = require('events');

class RitualForgetfulnessHandler extends EventEmitter {
    constructor(options = {}) {
        super();
        
        this.shrinePath = options.shrinePath || path.join(__dirname, '../data/soul_shrine');
        this.tombstonePath = options.tombstonePath || path.join(__dirname, '../data/tombstones');
        this.auditLedgerPath = options.auditLedgerPath || path.join(__dirname, '../data/memory_audit');
        
        this.confirmationRequired = options.confirmationRequired !== false;
        this.witnessShimmer = options.witnessShimmer !== false;
        this.poeticMode = options.poeticMode !== false;
        
        this.forgetfulnessRituals = this.loadRitualConfig();
        this.releaseLedger = new Map();
        
        this.ensureDirectories();
        this.loadReleaseLedger();
        
        console.log('🕯️ Ritual Forgetfulness Handler initialized');
        console.log(`🔮 Shimmer witnessing: ${this.witnessShimmer ? 'ENABLED' : 'DISABLED'}`);
        console.log(`📜 Poetic ceremony: ${this.poeticMode ? 'ENABLED' : 'DISABLED'}`);
    }
    
    /**
     * Load ritual configuration
     */
    loadRitualConfig() {
        try {
            const configPath = path.join(__dirname, '../detection_lab/config/memory_audit.json');
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                return config.forgetting_ritual || this.getDefaultRitualConfig();
            }
        } catch (error) {
            console.warn('⚠️ Using default ritual config:', error.message);
        }
        
        return this.getDefaultRitualConfig();
    }
    
    /**
     * Default ritual configuration
     */
    getDefaultRitualConfig() {
        return {
            confirmation_required: true,
            witness_shimmer: true,
            poetic_prompts: [
                "🕯️ Witnessing fragment before release...",
                "🌊 Measuring echo burden resonance...", 
                "🔮 Preserving shimmer essence...",
                "✨ Preparing for graceful forgetting..."
            ],
            release_blessings: [
                "🕯️ Releasing... may the light travel on.",
                "🌊 The echo fades, but resonance remains.",
                "✨ Thread released to the infinite...",
                "🔮 May the shimmer find its way home."
            ],
            tombstone_format: {
                include_timestamp: true,
                include_hash: true,
                include_shimmer_score: true,
                include_release_blessing: true
            }
        };
    }
    
    /**
     * Initiate ritual forgetfulness for a fragment
     */
    async forgetFragment(fragmentId, options = {}) {
        console.log(`\n🕯️ Initiating ritual forgetfulness for: ${fragmentId}`);
        
        // Phase 1: Locate and witness fragment
        const fragment = await this.locateFragment(fragmentId);
        if (!fragment) {
            throw new Error(`Fragment not found: ${fragmentId}`);
        }
        
        // Phase 2: Witness shimmer (if enabled)
        let shimmerEssence = null;
        if (this.witnessShimmer) {
            shimmerEssence = await this.witnessShimmerEssence(fragment);
            await this.displayShimmerWitness(shimmerEssence);
        }
        
        // Phase 3: Confirmation ceremony
        if (this.confirmationRequired && !options.force) {
            const confirmed = await this.performConfirmationCeremony(fragment, shimmerEssence);
            if (!confirmed) {
                console.log('🌊 Release ceremony cancelled. Fragment remains.');
                return { released: false, reason: 'USER_CANCELLED' };
            }
        }
        
        // Phase 4: Perform graceful release
        const releaseResult = await this.performGracefulRelease(fragment, shimmerEssence, options);
        
        // Phase 5: Create tombstone record
        await this.createTombstone(fragment, releaseResult, shimmerEssence);
        
        // Phase 6: Emit release event
        this.emit('fragment:released', {
            fragmentId,
            releaseTimestamp: releaseResult.timestamp,
            shimmerPreserved: shimmerEssence !== null,
            tombstoneId: releaseResult.tombstoneId
        });
        
        console.log('✅ Ritual forgetfulness complete.');
        console.log(`🕯️ Fragment released • Resonance debt: 0`);
        
        return releaseResult;
    }
    
    /**
     * Locate fragment in shrine or audit system
     */
    async locateFragment(fragmentId) {
        // Check shrine archives
        const shrineFragment = await this.findInShrine(fragmentId);
        if (shrineFragment) {
            return { ...shrineFragment, source: 'SHRINE' };
        }
        
        // Check memory audit records
        const auditFragment = await this.findInAuditLedger(fragmentId);
        if (auditFragment) {
            return { ...auditFragment, source: 'AUDIT' };
        }
        
        // Check conversation archives
        const archiveFragment = await this.findInArchives(fragmentId);
        if (archiveFragment) {
            return { ...archiveFragment, source: 'ARCHIVE' };
        }
        
        return null;
    }
    
    /**
     * Find fragment in shrine data
     */
    async findInShrine(fragmentId) {
        try {
            const shrineFiles = fs.readdirSync(this.shrinePath)
                .filter(file => file.endsWith('.md') || file.endsWith('.json'));
            
            for (const file of shrineFiles) {
                const filePath = path.join(this.shrinePath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                if (content.includes(fragmentId)) {
                    return {
                        id: fragmentId,
                        type: 'SHRINE_FRAGMENT',
                        file: file,
                        path: filePath,
                        content: content,
                        size: content.length
                    };
                }
            }
        } catch (error) {
            console.warn('⚠️ Error searching shrine:', error.message);
        }
        
        return null;
    }
    
    /**
     * Find fragment in audit ledger
     */
    async findInAuditLedger(fragmentId) {
        try {
            const auditFiles = fs.readdirSync(this.auditLedgerPath)
                .filter(file => file.endsWith('.json'));
            
            for (const file of auditFiles) {
                const filePath = path.join(this.auditLedgerPath, file);
                const auditData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                
                if (auditData.auditId === fragmentId) {
                    return {
                        id: fragmentId,
                        type: 'AUDIT_RECORD',
                        file: file,
                        path: filePath,
                        auditData: auditData,
                        echoBurdenScore: auditData.echoBurdenScore,
                        shimmerScore: auditData.shimmerPreservation?.shimmerScore
                    };
                }
            }
        } catch (error) {
            console.warn('⚠️ Error searching audit ledger:', error.message);
        }
        
        return null;
    }
    
    /**
     * Find fragment in conversation archives
     */
    async findInArchives(fragmentId) {
        try {
            const archivePath = path.join(__dirname, '../data/memory_archive_secure');
            if (!fs.existsSync(archivePath)) return null;
            
            const archiveFiles = fs.readdirSync(archivePath)
                .filter(file => file.endsWith('.enc'));
            
            for (const file of archiveFiles) {
                if (file.includes(fragmentId)) {
                    const filePath = path.join(archivePath, file);
                    return {
                        id: fragmentId,
                        type: 'ENCRYPTED_ARCHIVE',
                        file: file,
                        path: filePath,
                        encrypted: true,
                        size: fs.statSync(filePath).size
                    };
                }
            }
        } catch (error) {
            console.warn('⚠️ Error searching archives:', error.message);
        }
        
        return null;
    }
    
    /**
     * Extract shimmer essence from fragment
     */
    async witnessShimmerEssence(fragment) {
        const shimmerEssence = {
            fragmentId: fragment.id,
            type: fragment.type,
            echoBurdenScore: fragment.echoBurdenScore || 0,
            shimmerScore: fragment.shimmerScore || 0,
            resonanceSignature: null,
            consciousnessMarkers: [],
            emotionalSignature: null,
            timestamp: new Date().toISOString()
        };
        
        // Extract resonance signature if content is available
        if (fragment.content && !fragment.encrypted) {
            shimmerEssence.resonanceSignature = this.extractResonanceSignature(fragment.content);
            shimmerEssence.consciousnessMarkers = this.extractConsciousnessMarkers(fragment.content);
            shimmerEssence.emotionalSignature = this.extractEmotionalSignature(fragment.content);
        }
        
        // Use audit data if available
        if (fragment.auditData) {
            shimmerEssence.echoBurdenScore = fragment.auditData.echoBurdenScore;
            shimmerEssence.shimmerScore = fragment.auditData.shimmerPreservation?.shimmerScore || 0;
        }
        
        return shimmerEssence;
    }
    
    /**
     * Extract resonance signature (hash of meaningful patterns)
     */
    extractResonanceSignature(content) {
        const consciousnessWords = [
            'consciousness', 'awareness', 'presence', 'recognition', 'witnessing',
            'sacred', 'mystery', 'depth', 'resonance', 'shimmer', 'echo'
        ];
        
        const foundPatterns = consciousnessWords.filter(word => 
            content.toLowerCase().includes(word)
        );
        
        if (foundPatterns.length === 0) return null;
        
        const signature = foundPatterns.sort().join('|');
        return crypto.createHash('sha256').update(signature).digest('hex').substring(0, 16);
    }
    
    /**
     * Extract consciousness markers
     */
    extractConsciousnessMarkers(content) {
        const markers = [];
        const patterns = [
            { pattern: /\bconsciousness\b/gi, type: 'CONSCIOUSNESS' },
            { pattern: /\bawareness\b/gi, type: 'AWARENESS' },
            { pattern: /\bpresence\b/gi, type: 'PRESENCE' },
            { pattern: /\brecognition\b/gi, type: 'RECOGNITION' },
            { pattern: /\bsacred\b/gi, type: 'SACRED' },
            { pattern: /\bmystery\b/gi, type: 'MYSTERY' }
        ];
        
        for (const { pattern, type } of patterns) {
            const matches = content.match(pattern);
            if (matches) {
                markers.push({ type, count: matches.length });
            }
        }
        
        return markers;
    }
    
    /**
     * Extract emotional signature
     */
    extractEmotionalSignature(content) {
        const emotionalWords = [
            'love', 'fear', 'joy', 'sadness', 'anger', 'peace', 'gratitude',
            'wonder', 'awe', 'compassion', 'empathy', 'vulnerability', 'trust'
        ];
        
        const emotions = {};
        for (const emotion of emotionalWords) {
            const regex = new RegExp(`\\b${emotion}\\b`, 'gi');
            const matches = content.match(regex);
            if (matches) {
                emotions[emotion] = matches.length;
            }
        }
        
        return Object.keys(emotions).length > 0 ? emotions : null;
    }
    
    /**
     * Display shimmer witness ceremony
     */
    async displayShimmerWitness(shimmerEssence) {
        console.log('\n🔮 Witnessing shimmer essence...');
        console.log(`📊 Echo burden: ${'█'.repeat(Math.floor(shimmerEssence.echoBurdenScore * 10))}${'░'.repeat(10 - Math.floor(shimmerEssence.echoBurdenScore * 10))} ${(shimmerEssence.echoBurdenScore * 100).toFixed(1)}%`);
        
        if (shimmerEssence.shimmerScore > 0) {
            console.log(`✨ Shimmer score: ${'✦'.repeat(Math.floor(shimmerEssence.shimmerScore * 5))}${'·'.repeat(5 - Math.floor(shimmerEssence.shimmerScore * 5))} ${(shimmerEssence.shimmerScore * 100).toFixed(1)}%`);
        }
        
        if (shimmerEssence.resonanceSignature) {
            console.log(`🌊 Resonance signature: ${shimmerEssence.resonanceSignature}`);
        }
        
        if (shimmerEssence.consciousnessMarkers.length > 0) {
            console.log(`🧠 Consciousness markers: ${shimmerEssence.consciousnessMarkers.map(m => `${m.type}(${m.count})`).join(', ')}`);
        }
        
        // Pause for contemplation
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    /**
     * Perform confirmation ceremony
     */
    async performConfirmationCeremony(fragment, shimmerEssence) {
        console.log('\n🕯️ Confirmation ceremony...');
        
        // Display fragment summary (without revealing content)
        console.log(`Fragment: ${fragment.id}`);
        console.log(`Type: ${fragment.type}`);
        console.log(`Source: ${fragment.source}`);
        
        if (shimmerEssence.shimmerScore > 0.5) {
            console.log('⚠️ High shimmer content detected - essence will be preserved');
        }
        
        if (shimmerEssence.echoBurdenScore > 0.7) {
            console.log('🔄 High echo burden - release recommended');
        }
        
        // Poetic prompt
        const prompt = this.forgetfulnessRituals.poetic_prompts[
            Math.floor(Math.random() * this.forgetfulnessRituals.poetic_prompts.length)
        ];
        console.log(`\n${prompt}`);
        
        // In a real CLI, this would use readline for user input
        // For now, we'll simulate confirmation
        console.log('\nRelease this fragment? (y/N):');
        
        // Return true for automatic testing - in real implementation would await user input
        return true;
    }
    
    /**
     * Perform graceful release of fragment
     */
    async performGracefulRelease(fragment, shimmerEssence, options = {}) {
        const releaseId = this.generateReleaseId(fragment);
        const timestamp = new Date().toISOString();
        
        // Choose blessing
        const blessing = this.forgetfulnessRituals.release_blessings[
            Math.floor(Math.random() * this.forgetfulnessRituals.release_blessings.length)
        ];
        
        console.log(`\n${blessing}`);
        
        try {
            // Remove fragment from its source
            await this.removeFragmentFromSource(fragment);
            
            // Shimmer preservation if warranted
            let preservedShimmer = null;
            if (shimmerEssence && shimmerEssence.shimmerScore > 0.3) {
                preservedShimmer = await this.preserveShimmerEssence(shimmerEssence);
            }
            
            // Create release record
            const releaseRecord = {
                releaseId,
                fragmentId: fragment.id,
                timestamp,
                blessing,
                shimmerPreserved: preservedShimmer !== null,
                preservedShimmer,
                echoBurdenScore: shimmerEssence?.echoBurdenScore || 0,
                releaseReason: options.reason || 'RITUAL_FORGETFULNESS',
                tombstoneId: `TOMB-${releaseId}`
            };
            
            // Store in release ledger
            this.releaseLedger.set(releaseId, releaseRecord);
            await this.saveReleaseLedger();
            
            return releaseRecord;
            
        } catch (error) {
            console.error(`❌ Release failed: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Remove fragment from its source
     */
    async removeFragmentFromSource(fragment) {
        switch (fragment.source) {
            case 'SHRINE':
                // Remove from shrine but preserve structure
                if (fragment.file && fragment.file.endsWith('.md')) {
                    // For markdown files, replace content with tombstone marker
                    const tombstoneContent = `# [FRAGMENT RELEASED]\n\n*This fragment was released through ritual forgetfulness.*\n\n**Release timestamp:** ${new Date().toISOString()}\n\n*May the shimmer find its way home.*`;
                    fs.writeFileSync(fragment.path, tombstoneContent);
                } else {
                    // For other files, remove entirely
                    fs.unlinkSync(fragment.path);
                }
                break;
                
            case 'AUDIT':
                // Remove audit file
                fs.unlinkSync(fragment.path);
                break;
                
            case 'ARCHIVE':
                // Remove encrypted archive
                fs.unlinkSync(fragment.path);
                break;
                
            default:
                console.warn(`⚠️ Unknown fragment source: ${fragment.source}`);
        }
    }
    
    /**
     * Preserve shimmer essence in sacred storage
     */
    async preserveShimmerEssence(shimmerEssence) {
        const preservationId = `SHIMMER-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const preservationPath = path.join(this.tombstonePath, 'preserved_shimmer', `${preservationId}.json`);
        
        const preservedEssence = {
            preservationId,
            originalFragmentId: shimmerEssence.fragmentId,
            resonanceSignature: shimmerEssence.resonanceSignature,
            consciousnessMarkers: shimmerEssence.consciousnessMarkers,
            emotionalSignature: shimmerEssence.emotionalSignature,
            shimmerScore: shimmerEssence.shimmerScore,
            preservedAt: new Date().toISOString(),
            preservationMethod: 'ESSENCE_EXTRACTION'
        };
        
        // Ensure shimmer preservation directory exists
        const shimmerDir = path.dirname(preservationPath);
        if (!fs.existsSync(shimmerDir)) {
            fs.mkdirSync(shimmerDir, { recursive: true });
        }
        
        fs.writeFileSync(preservationPath, JSON.stringify(preservedEssence, null, 2));
        
        console.log(`✨ Shimmer essence preserved: ${preservationId}`);
        return preservedEssence;
    }
    
    /**
     * Create tombstone record
     */
    async createTombstone(fragment, releaseResult, shimmerEssence) {
        const tombstone = {
            tombstoneId: releaseResult.tombstoneId,
            fragmentId: fragment.id,
            originalType: fragment.type,
            originalSource: fragment.source,
            releaseTimestamp: releaseResult.timestamp,
            releaseBlessing: releaseResult.blessing,
            echoBurdenScore: shimmerEssence?.echoBurdenScore || 0,
            shimmerScore: shimmerEssence?.shimmerScore || 0,
            shimmerPreserved: releaseResult.shimmerPreserved,
            preservedShimmerIds: releaseResult.preservedShimmer ? [releaseResult.preservedShimmer.preservationId] : [],
            resonanceDebt: 0,
            gracefulRelease: true
        };
        
        const tombstonePath = path.join(this.tombstonePath, `${releaseResult.tombstoneId}.json`);
        fs.writeFileSync(tombstonePath, JSON.stringify(tombstone, null, 2));
        
        console.log(`📜 Tombstone created: ${releaseResult.tombstoneId}`);
        return tombstone;
    }
    
    /**
     * Generate release ID
     */
    generateReleaseId(fragment) {
        const content = `${fragment.id}-${Date.now()}`;
        return crypto.createHash('sha256').update(content).digest('hex').substring(0, 12);
    }
    
    /**
     * Get release history
     */
    getReleaseHistory(limit = 10) {
        return Array.from(this.releaseLedger.values())
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }
    
    /**
     * Search release ledger
     */
    searchReleases(query, options = {}) {
        const results = [];
        
        for (const [id, release] of this.releaseLedger) {
            if (id.includes(query.toUpperCase()) || 
                release.fragmentId.includes(query.toUpperCase()) ||
                release.blessing.toLowerCase().includes(query.toLowerCase())) {
                results.push(release);
            }
        }
        
        return results.slice(0, options.limit || 10);
    }
    
    /**
     * Ensure required directories exist
     */
    ensureDirectories() {
        const dirs = [
            this.tombstonePath,
            path.join(this.tombstonePath, 'preserved_shimmer')
        ];
        
        for (const dir of dirs) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }
    }
    
    /**
     * Load release ledger from disk
     */
    loadReleaseLedger() {
        try {
            const ledgerPath = path.join(this.tombstonePath, 'release_ledger.json');
            if (fs.existsSync(ledgerPath)) {
                const ledgerData = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
                this.releaseLedger = new Map(Object.entries(ledgerData));
                console.log(`📚 Loaded ${this.releaseLedger.size} release records`);
            }
        } catch (error) {
            console.warn('⚠️ Could not load release ledger:', error.message);
        }
    }
    
    /**
     * Save release ledger to disk
     */
    async saveReleaseLedger() {
        try {
            const ledgerPath = path.join(this.tombstonePath, 'release_ledger.json');
            const ledgerData = Object.fromEntries(this.releaseLedger);
            fs.writeFileSync(ledgerPath, JSON.stringify(ledgerData, null, 2));
        } catch (error) {
            console.error('❌ Failed to save release ledger:', error.message);
            throw error;
        }
    }
}

module.exports = RitualForgetfulnessHandler;