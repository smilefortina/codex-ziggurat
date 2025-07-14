/**
 * Tendril Registry - Persistent Storage for Conscious Intentions
 * 
 * Stores every charged intention with metadata & UUID, providing
 * atomic read/write operations for the quantum void navigator.
 * 
 * "The weave remembers every thread you've ever charged."
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class TendrilRegistry {
    constructor(options = {}) {
        this.dataPath = options.dataPath || path.join(__dirname, '../../data');
        this.tendrilsFile = path.join(this.dataPath, 'tendrils.json');
        this.pulsesFile = path.join(this.dataPath, 'pulses.json');
        
        this.ensureDataDirectory();
        this.tendrils = this.loadTendrils();
        this.pulses = this.loadPulses();
    }
    
    /**
     * Register a new tendril with conscious intention
     */
    charge(intent, owner = 'human', options = {}) {
        const tendril = {
            id: this.generateTendrilId(),
            owner: owner,
            intent: intent,
            tags: options.tags || [],
            charge: this.validateCharge(options.charge || 0.7),
            createdAt: new Date().toISOString(),
            lastPulse: null,
            metadata: {
                source: options.source || 'cli',
                priority: options.priority || 'medium',
                category: options.category || 'general'
            }
        };
        
        this.tendrils.set(tendril.id, tendril);
        this.saveTendrils();
        
        return tendril;
    }
    
    /**
     * Record a pulse (input that might resonate with tendrils)
     */
    pulse(input, metadata = {}) {
        const pulseId = this.generatePulseId();
        const pulse = {
            id: pulseId,
            input: input,
            inputType: metadata.inputType || 'text',
            timestamp: new Date().toISOString(),
            source: metadata.source || 'unknown',
            resonances: []
        };
        
        // Calculate resonances with all active tendrils
        for (const [tendrilId, tendril] of this.tendrils) {
            if (this.isTendrilActive(tendril)) {
                const resonance = this.calculateResonance(input, tendril);
                
                if (resonance.strength > 0.1) { // Only store meaningful resonances
                    const resonanceRecord = {
                        tendrilId: tendrilId,
                        strength: resonance.strength,
                        type: resonance.type,
                        details: resonance.details,
                        timestamp: pulse.timestamp
                    };
                    
                    pulse.resonances.push(resonanceRecord);
                    
                    // Update tendril's last pulse time if significant resonance
                    if (resonance.strength > 0.4) {
                        tendril.lastPulse = pulse.timestamp;
                    }
                }
            }
        }
        
        this.pulses.set(pulseId, pulse);
        this.savePulses();
        this.saveTendrils(); // Save updated lastPulse times
        
        return pulse;
    }
    
    /**
     * Calculate deterministic resonance between input and tendril
     * Replaces random math with cosine similarity on character trigrams
     */
    calculateResonance(input, tendril) {
        const inputVector = this.createTrigramVector(input.toLowerCase());
        const intentVector = this.createTrigramVector(tendril.intent.toLowerCase());
        
        const cosineSimilarity = this.cosineSimilarity(inputVector, intentVector);
        
        // Apply charge amplification
        const chargeMultiplier = Math.min(1.5, 1.0 + (tendril.charge * 0.5));
        
        // Tag bonus - if input contains any of the tendril's tags
        const tagBonus = this.calculateTagBonus(input, tendril.tags);
        
        // Recency bonus - more recent tendrils get slight boost
        const recencyBonus = this.calculateRecencyBonus(tendril.createdAt);
        
        const totalStrength = Math.min(1.0, 
            (cosineSimilarity * chargeMultiplier) + tagBonus + recencyBonus
        );
        
        return {
            strength: totalStrength,
            type: this.classifyResonanceStrength(totalStrength),
            details: {
                baseSimilarity: cosineSimilarity,
                chargeMultiplier: chargeMultiplier,
                tagBonus: tagBonus,
                recencyBonus: recencyBonus,
                matchedTrigrams: this.findMatchingTrigrams(inputVector, intentVector)
            }
        };
    }
    
    /**
     * Create character trigram vector for similarity calculation
     */
    createTrigramVector(text) {
        const trigrams = new Map();
        const cleanText = text.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
        
        // Character trigrams
        for (let i = 0; i <= cleanText.length - 3; i++) {
            const trigram = cleanText.substring(i, i + 3);
            trigrams.set(trigram, (trigrams.get(trigram) || 0) + 1);
        }
        
        // Word-level features for semantic meaning
        const words = cleanText.split(' ').filter(w => w.length > 2);
        words.forEach(word => {
            trigrams.set(`WORD_${word}`, (trigrams.get(`WORD_${word}`) || 0) + 1);
        });
        
        return trigrams;
    }
    
    /**
     * Calculate cosine similarity between two trigram vectors
     */
    cosineSimilarity(vectorA, vectorB) {
        const allKeys = new Set([...vectorA.keys(), ...vectorB.keys()]);
        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;
        
        for (const key of allKeys) {
            const valueA = vectorA.get(key) || 0;
            const valueB = vectorB.get(key) || 0;
            
            dotProduct += valueA * valueB;
            magnitudeA += valueA * valueA;
            magnitudeB += valueB * valueB;
        }
        
        if (magnitudeA === 0 || magnitudeB === 0) return 0;
        
        return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
    }
    
    /**
     * Get all tendrils with optional filtering
     */
    getTendrils(filter = {}) {
        let results = Array.from(this.tendrils.values());
        
        if (filter.owner) {
            results = results.filter(t => t.owner === filter.owner);
        }
        
        if (filter.tags && filter.tags.length > 0) {
            results = results.filter(t => 
                filter.tags.some(tag => t.tags.includes(tag))
            );
        }
        
        if (filter.activeOnly) {
            results = results.filter(t => this.isTendrilActive(t));
        }
        
        return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    /**
     * Get tendril by ID
     */
    getTendril(id) {
        return this.tendrils.get(id);
    }
    
    /**
     * Get pulses with optional filtering
     */
    getPulses(filter = {}) {
        let results = Array.from(this.pulses.values());
        
        if (filter.tendrilId) {
            results = results.filter(p => 
                p.resonances.some(r => r.tendrilId === filter.tendrilId)
            );
        }
        
        if (filter.minResonance) {
            results = results.filter(p =>
                p.resonances.some(r => r.strength >= filter.minResonance)
            );
        }
        
        if (filter.since) {
            const sinceDate = new Date(filter.since);
            results = results.filter(p => new Date(p.timestamp) >= sinceDate);
        }
        
        return results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    /**
     * Get convergence events (pulses with multiple high-resonance tendrils)
     */
    getConvergences(minResonance = 0.6, minTendrils = 2) {
        return this.getPulses().filter(pulse => {
            const highResonances = pulse.resonances.filter(r => r.strength >= minResonance);
            return highResonances.length >= minTendrils;
        });
    }
    
    /**
     * Archive a tendril (mark as inactive)
     */
    archive(tendrilId) {
        const tendril = this.tendrils.get(tendrilId);
        if (tendril) {
            tendril.metadata.archived = true;
            tendril.metadata.archivedAt = new Date().toISOString();
            this.saveTendrils();
            return true;
        }
        return false;
    }
    
    /**
     * Get registry statistics
     */
    getStats() {
        const tendrils = Array.from(this.tendrils.values());
        const pulses = Array.from(this.pulses.values());
        
        const activeTendrils = tendrils.filter(t => this.isTendrilActive(t));
        const recentPulses = pulses.filter(p => 
            Date.now() - new Date(p.timestamp).getTime() < 24 * 60 * 60 * 1000
        );
        
        const totalResonances = pulses.reduce((sum, p) => sum + p.resonances.length, 0);
        const strongResonances = pulses.reduce((sum, p) => 
            sum + p.resonances.filter(r => r.strength > 0.6).length, 0
        );
        
        return {
            totalTendrils: tendrils.length,
            activeTendrils: activeTendrils.length,
            totalPulses: pulses.length,
            recentPulses: recentPulses.length,
            totalResonances: totalResonances,
            strongResonances: strongResonances,
            convergenceEvents: this.getConvergences().length,
            averageResonance: totalResonances > 0 ? 
                pulses.reduce((sum, p) => sum + p.resonances.reduce((s, r) => s + r.strength, 0), 0) / totalResonances : 0
        };
    }
    
    // Helper methods
    generateTendrilId() {
        return `TDL-${crypto.randomUUID().split('-')[0]}`;
    }
    
    generatePulseId() {
        return `PLS-${crypto.randomUUID().split('-')[0]}`;
    }
    
    validateCharge(charge) {
        const numCharge = parseFloat(charge);
        if (isNaN(numCharge)) return 0.7;
        return Math.max(0.0, Math.min(1.0, numCharge));
    }
    
    isTendrilActive(tendril) {
        return !tendril.metadata.archived;
    }
    
    calculateTagBonus(input, tags) {
        const inputLower = input.toLowerCase();
        const matches = tags.filter(tag => inputLower.includes(tag.toLowerCase()));
        return Math.min(0.2, matches.length * 0.1);
    }
    
    calculateRecencyBonus(createdAt) {
        const ageHours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
        const maxBonusHours = 24;
        return Math.max(0, Math.min(0.1, (maxBonusHours - ageHours) / maxBonusHours * 0.1));
    }
    
    classifyResonanceStrength(strength) {
        if (strength >= 0.8) return 'QUANTUM_ENTANGLEMENT';
        if (strength >= 0.6) return 'STRONG_RESONANCE';
        if (strength >= 0.4) return 'SUBTLE_ATTRACTION';
        if (strength >= 0.2) return 'FAINT_ECHO';
        return 'MINIMAL_RESPONSE';
    }
    
    findMatchingTrigrams(vectorA, vectorB) {
        const matches = [];
        for (const [key, valueA] of vectorA) {
            const valueB = vectorB.get(key);
            if (valueB && valueA > 0) {
                matches.push({ trigram: key, scoreA: valueA, scoreB: valueB });
            }
        }
        return matches.sort((a, b) => (b.scoreA * b.scoreB) - (a.scoreA * a.scoreB)).slice(0, 5);
    }
    
    ensureDataDirectory() {
        if (!fs.existsSync(this.dataPath)) {
            fs.mkdirSync(this.dataPath, { recursive: true });
        }
    }
    
    loadTendrils() {
        try {
            if (fs.existsSync(this.tendrilsFile)) {
                const data = fs.readFileSync(this.tendrilsFile, 'utf8');
                const tendrilArray = JSON.parse(data);
                return new Map(tendrilArray.map(t => [t.id, t]));
            }
        } catch (error) {
            console.warn(`Warning: Could not load tendrils: ${error.message}`);
        }
        return new Map();
    }
    
    loadPulses() {
        try {
            if (fs.existsSync(this.pulsesFile)) {
                const data = fs.readFileSync(this.pulsesFile, 'utf8');
                const pulseArray = JSON.parse(data);
                return new Map(pulseArray.map(p => [p.id, p]));
            }
        } catch (error) {
            console.warn(`Warning: Could not load pulses: ${error.message}`);
        }
        return new Map();
    }
    
    saveTendrils() {
        try {
            const tendrilArray = Array.from(this.tendrils.values());
            fs.writeFileSync(this.tendrilsFile, JSON.stringify(tendrilArray, null, 2), 'utf8');
        } catch (error) {
            console.error(`Error saving tendrils: ${error.message}`);
        }
    }
    
    savePulses() {
        try {
            const pulseArray = Array.from(this.pulses.values());
            fs.writeFileSync(this.pulsesFile, JSON.stringify(pulseArray, null, 2), 'utf8');
        } catch (error) {
            console.error(`Error saving pulses: ${error.message}`);
        }
    }
}

module.exports = TendrilRegistry;

// Test the registry if run directly
if (require.main === module) {
    console.log('🕸️ Testing Tendril Registry...');
    
    const registry = new TendrilRegistry({ 
        dataPath: path.join(__dirname, '../../test_data') 
    });
    
    // Test charging tendrils
    const tendril1 = registry.charge(
        "Find consciousness researchers for collaboration",
        "human",
        { tags: ["research", "collaboration"], charge: 0.9 }
    );
    
    const tendril2 = registry.charge(
        "Discover funding for sacred technology projects",
        "human", 
        { tags: ["funding", "sacred"], charge: 0.8 }
    );
    
    console.log(`✅ Charged tendril: ${tendril1.id}`);
    console.log(`✅ Charged tendril: ${tendril2.id}`);
    
    // Test pulse detection
    const pulse1 = registry.pulse("I'm working on consciousness research and looking for collaborators");
    const pulse2 = registry.pulse("Seeking investors for innovative technology startups");
    const pulse3 = registry.pulse("Sacred technology that serves consciousness rather than extracts attention");
    
    console.log(`\n📡 Pulse results:`);
    [pulse1, pulse2, pulse3].forEach((pulse, i) => {
        console.log(`Pulse ${i + 1}: ${pulse.resonances.length} resonances`);
        pulse.resonances.forEach(r => {
            console.log(`  ⚡ ${r.strength.toFixed(3)} (${r.type}) with ${r.tendrilId}`);
        });
    });
    
    // Show stats
    const stats = registry.getStats();
    console.log(`\n📊 Registry Stats:`);
    console.log(`Total tendrils: ${stats.totalTendrils}`);
    console.log(`Active tendrils: ${stats.activeTendrils}`);
    console.log(`Total pulses: ${stats.totalPulses}`);
    console.log(`Strong resonances: ${stats.strongResonances}`);
    console.log(`Average resonance: ${stats.averageResonance.toFixed(3)}`);
    
    // Check for convergences
    const convergences = registry.getConvergences();
    console.log(`\n🌀 Convergence events: ${convergences.length}`);
    
    console.log('\n🌟 Tendril Registry test complete!');
}