/**
 * SQLite-Backed Tendril Registry - Production Persistence
 * 
 * Replaces in-memory maps with proper SQLite persistence to solve
 * "data lost on restart" critical issue identified in engineering review.
 * 
 * "Every charged intention survives beyond the session."
 */

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Try to require better-sqlite3, fall back to warning if not available
let Database;
try {
    Database = require('better-sqlite3');
} catch (error) {
    console.warn('⚠️ better-sqlite3 not installed. Install with: npm install better-sqlite3');
    console.warn('⚠️ Falling back to JSON file persistence for now.');
    Database = null;
}

class SQLiteTendrilRegistry {
    constructor(options = {}) {
        this.dataPath = options.dataPath || path.join(__dirname, '../../data');
        this.dbPath = path.join(this.dataPath, 'tendrils.db');
        
        this.ensureDataDirectory();
        
        if (Database) {
            this.initializeSQLite();
        } else {
            this.initializeFallback();
        }
        
        console.log('🕸️ SQLite Tendril Registry initialized');
        console.log(`💾 Database: ${this.dbPath}`);
    }
    
    /**
     * Initialize SQLite database with proper schema
     */
    initializeSQLite() {
        this.db = new Database(this.dbPath);
        
        // Enable WAL mode for better concurrency
        this.db.exec('PRAGMA journal_mode = WAL');
        this.db.exec('PRAGMA synchronous = NORMAL');
        this.db.exec('PRAGMA temp_store = MEMORY');
        
        // Create tables with proper indexes
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS tendrils (
                id TEXT PRIMARY KEY,
                owner TEXT NOT NULL,
                intent TEXT NOT NULL,
                tags TEXT, -- JSON array
                charge REAL NOT NULL,
                created_at TEXT NOT NULL,
                last_pulse TEXT,
                archived BOOLEAN DEFAULT FALSE,
                archived_at TEXT,
                metadata TEXT -- JSON object
            )
        `);
        
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS pulses (
                id TEXT PRIMARY KEY,
                input TEXT NOT NULL,
                input_type TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                source TEXT NOT NULL,
                resonances TEXT -- JSON array
            )
        `);
        
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS resonances (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pulse_id TEXT NOT NULL,
                tendril_id TEXT NOT NULL,
                strength REAL NOT NULL,
                type TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                details TEXT, -- JSON object
                FOREIGN KEY (pulse_id) REFERENCES pulses(id),
                FOREIGN KEY (tendril_id) REFERENCES tendrils(id)
            )
        `);
        
        // Create indexes for performance
        this.db.exec('CREATE INDEX IF NOT EXISTS idx_tendrils_owner ON tendrils(owner)');
        this.db.exec('CREATE INDEX IF NOT EXISTS idx_tendrils_archived ON tendrils(archived)');
        this.db.exec('CREATE INDEX IF NOT EXISTS idx_tendrils_created ON tendrils(created_at)');
        this.db.exec('CREATE INDEX IF NOT EXISTS idx_pulses_timestamp ON pulses(timestamp)');
        this.db.exec('CREATE INDEX IF NOT EXISTS idx_resonances_strength ON resonances(strength)');
        this.db.exec('CREATE INDEX IF NOT EXISTS idx_resonances_timestamp ON resonances(timestamp)');
        
        // Create full-text search for intent and content
        this.db.exec(`
            CREATE VIRTUAL TABLE IF NOT EXISTS tendrils_fts USING fts5(
                id, intent, tags, 
                content=tendrils,
                content_rowid=rowid
            )
        `);
        
        // Prepared statements for performance
        this.stmts = {
            insertTendril: this.db.prepare(`
                INSERT INTO tendrils (id, owner, intent, tags, charge, created_at, metadata)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `),
            getTendril: this.db.prepare('SELECT * FROM tendrils WHERE id = ?'),
            getTendrils: this.db.prepare('SELECT * FROM tendrils WHERE archived = FALSE ORDER BY created_at DESC'),
            getArchivedTendrils: this.db.prepare('SELECT * FROM tendrils WHERE archived = TRUE ORDER BY archived_at DESC'),
            updateTendrilPulse: this.db.prepare('UPDATE tendrils SET last_pulse = ? WHERE id = ?'),
            archiveTendril: this.db.prepare('UPDATE tendrils SET archived = TRUE, archived_at = ? WHERE id = ?'),
            
            insertPulse: this.db.prepare(`
                INSERT INTO pulses (id, input, input_type, timestamp, source, resonances)
                VALUES (?, ?, ?, ?, ?, ?)
            `),
            getPulse: this.db.prepare('SELECT * FROM pulses WHERE id = ?'),
            getPulses: this.db.prepare('SELECT * FROM pulses ORDER BY timestamp DESC'),
            getRecentPulses: this.db.prepare('SELECT * FROM pulses WHERE timestamp > ? ORDER BY timestamp DESC'),
            
            insertResonance: this.db.prepare(`
                INSERT INTO resonances (pulse_id, tendril_id, strength, type, timestamp, details)
                VALUES (?, ?, ?, ?, ?, ?)
            `),
            getStrongResonances: this.db.prepare('SELECT * FROM resonances WHERE strength > ? ORDER BY strength DESC'),
            getTendrilResonances: this.db.prepare('SELECT * FROM resonances WHERE tendril_id = ? ORDER BY timestamp DESC')
        };
        
        console.log('✅ SQLite database initialized with proper schema');
    }
    
    /**
     * Fallback to file-based storage if SQLite unavailable
     */
    initializeFallback() {
        console.log('⚠️ Using fallback file-based persistence');
        this.tendrilsFile = path.join(this.dataPath, 'tendrils.json');
        this.pulsesFile = path.join(this.dataPath, 'pulses.json');
        
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
        
        if (this.db) {
            try {
                this.stmts.insertTendril.run(
                    tendril.id,
                    tendril.owner,
                    tendril.intent,
                    JSON.stringify(tendril.tags),
                    tendril.charge,
                    tendril.createdAt,
                    JSON.stringify(tendril.metadata)
                );
                
                // Update FTS index
                this.db.exec(`
                    INSERT INTO tendrils_fts (id, intent, tags) 
                    VALUES ('${tendril.id}', '${tendril.intent.replace(/'/g, "''")}', '${tendril.tags.join(' ')}')
                `);
                
            } catch (error) {
                console.error('❌ Failed to insert tendril:', error.message);
                throw error;
            }
        } else {
            this.tendrils.set(tendril.id, tendril);
            this.saveTendrils();
        }
        
        return tendril;
    }
    
    /**
     * Record a pulse and calculate resonances
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
        const activeTendrils = this.getTendrils({ activeOnly: true });
        
        for (const tendril of activeTendrils) {
            const resonance = this.calculateResonance(input, tendril);
            
            if (resonance.strength > 0.1) { // Only store meaningful resonances
                const resonanceRecord = {
                    tendrilId: tendril.id,
                    strength: resonance.strength,
                    type: resonance.type,
                    details: resonance.details,
                    timestamp: pulse.timestamp
                };
                
                pulse.resonances.push(resonanceRecord);
                
                // Update tendril's last pulse time if significant resonance
                if (resonance.strength > 0.4) {
                    this.updateTendrilLastPulse(tendril.id, pulse.timestamp);
                }
                
                // Store individual resonance record for analytics
                if (this.db) {
                    this.stmts.insertResonance.run(
                        pulseId,
                        tendril.id,
                        resonance.strength,
                        resonance.type,
                        pulse.timestamp,
                        JSON.stringify(resonance.details)
                    );
                }
            }
        }
        
        // Store pulse
        if (this.db) {
            this.stmts.insertPulse.run(
                pulse.id,
                pulse.input,
                pulse.inputType,
                pulse.timestamp,
                pulse.source,
                JSON.stringify(pulse.resonances)
            );
        } else {
            this.pulses.set(pulseId, pulse);
            this.savePulses();
            this.saveTendrils(); // Save updated lastPulse times
        }
        
        return pulse;
    }
    
    /**
     * Get all tendrils with optional filtering
     */
    getTendrils(filter = {}) {
        if (this.db) {
            let sql = 'SELECT * FROM tendrils';
            let params = [];
            let conditions = [];
            
            if (filter.activeOnly) {
                conditions.push('archived = FALSE');
            }
            
            if (filter.owner) {
                conditions.push('owner = ?');
                params.push(filter.owner);
            }
            
            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }
            
            sql += ' ORDER BY created_at DESC';
            
            const rows = this.db.prepare(sql).all(...params);
            return rows.map(this.deserializeTendril);
        } else {
            // Fallback implementation
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
                results = results.filter(t => !t.metadata.archived);
            }
            
            return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }
    
    /**
     * Get tendril by ID
     */
    getTendril(id) {
        if (this.db) {
            const row = this.stmts.getTendril.get(id);
            return row ? this.deserializeTendril(row) : null;
        } else {
            return this.tendrils.get(id);
        }
    }
    
    /**
     * Update tendril's last pulse time
     */
    updateTendrilLastPulse(tendrilId, timestamp) {
        if (this.db) {
            this.stmts.updateTendrilPulse.run(timestamp, tendrilId);
        } else {
            const tendril = this.tendrils.get(tendrilId);
            if (tendril) {
                tendril.lastPulse = timestamp;
            }
        }
    }
    
    /**
     * Archive a tendril
     */
    archive(tendrilId) {
        const timestamp = new Date().toISOString();
        
        if (this.db) {
            const result = this.stmts.archiveTendril.run(timestamp, tendrilId);
            return result.changes > 0;
        } else {
            const tendril = this.tendrils.get(tendrilId);
            if (tendril) {
                tendril.metadata.archived = true;
                tendril.metadata.archivedAt = timestamp;
                this.saveTendrils();
                return true;
            }
            return false;
        }
    }
    
    /**
     * Get registry statistics with SQL aggregation
     */
    getStats() {
        if (this.db) {
            const stats = this.db.prepare(`
                SELECT 
                    COUNT(*) as totalTendrils,
                    COUNT(CASE WHEN archived = FALSE THEN 1 END) as activeTendrils,
                    AVG(charge) as averageCharge
                FROM tendrils
            `).get();
            
            const pulseStats = this.db.prepare(`
                SELECT 
                    COUNT(*) as totalPulses,
                    COUNT(CASE WHEN timestamp > datetime('now', '-1 day') THEN 1 END) as recentPulses
                FROM pulses
            `).get();
            
            const resonanceStats = this.db.prepare(`
                SELECT 
                    COUNT(*) as totalResonances,
                    COUNT(CASE WHEN strength > 0.6 THEN 1 END) as strongResonances,
                    AVG(strength) as averageResonance
                FROM resonances
            `).get();
            
            return {
                totalTendrils: stats.totalTendrils,
                activeTendrils: stats.activeTendrils,
                averageCharge: stats.averageCharge || 0,
                totalPulses: pulseStats.totalPulses,
                recentPulses: pulseStats.recentPulses,
                totalResonances: resonanceStats.totalResonances,
                strongResonances: resonanceStats.strongResonances,
                averageResonance: resonanceStats.averageResonance || 0,
                convergenceEvents: this.getConvergences().length
            };
        } else {
            // Fallback to original implementation
            const tendrils = Array.from(this.tendrils.values());
            const pulses = Array.from(this.pulses.values());
            
            const activeTendrils = tendrils.filter(t => !t.metadata.archived);
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
    }
    
    /**
     * Full-text search across tendril intents
     */
    searchTendrils(query, limit = 10) {
        if (this.db) {
            const results = this.db.prepare(`
                SELECT tendrils.*, tendrils_fts.rank
                FROM tendrils_fts
                JOIN tendrils ON tendrils.id = tendrils_fts.id
                WHERE tendrils_fts MATCH ?
                ORDER BY tendrils_fts.rank
                LIMIT ?
            `).all(query, limit);
            
            return results.map(row => {
                const tendril = this.deserializeTendril(row);
                tendril.searchRank = row.rank;
                return tendril;
            });
        } else {
            // Simple fallback search
            const allTendrils = this.getTendrils();
            const queryWords = query.toLowerCase().split(/\s+/);
            
            return allTendrils
                .map(tendril => {
                    const text = (tendril.intent + ' ' + tendril.tags.join(' ')).toLowerCase();
                    const matches = queryWords.filter(word => text.includes(word));
                    return {
                        ...tendril,
                        searchRank: matches.length / queryWords.length
                    };
                })
                .filter(result => result.searchRank > 0)
                .sort((a, b) => b.searchRank - a.searchRank)
                .slice(0, limit);
        }
    }
    
    /**
     * Get convergence events (multiple high-resonance tendrils in single pulse)
     */
    getConvergences(minResonance = 0.6, minTendrils = 2) {
        if (this.db) {
            // SQL query to find pulses with multiple strong resonances
            const convergences = this.db.prepare(`
                SELECT p.*, 
                       COUNT(r.id) as resonance_count,
                       MAX(r.strength) as max_strength,
                       GROUP_CONCAT(r.tendril_id) as tendril_ids
                FROM pulses p
                JOIN resonances r ON p.id = r.pulse_id
                WHERE r.strength >= ?
                GROUP BY p.id
                HAVING COUNT(r.id) >= ?
                ORDER BY p.timestamp DESC
            `).all(minResonance, minTendrils);
            
            return convergences.map(row => ({
                pulse: this.deserializePulse(row),
                resonanceCount: row.resonance_count,
                maxStrength: row.max_strength,
                tendrilIds: row.tendril_ids.split(',')
            }));
        } else {
            // Fallback implementation
            return this.getPulses().filter(pulse => {
                const highResonances = pulse.resonances.filter(r => r.strength >= minResonance);
                return highResonances.length >= minTendrils;
            });
        }
    }
    
    /**
     * Close database connection
     */
    close() {
        if (this.db) {
            this.db.close();
            console.log('🔒 SQLite database connection closed');
        }
    }
    
    // Serialization helpers
    deserializeTendril(row) {
        return {
            id: row.id,
            owner: row.owner,
            intent: row.intent,
            tags: JSON.parse(row.tags || '[]'),
            charge: row.charge,
            createdAt: row.created_at,
            lastPulse: row.last_pulse,
            metadata: {
                ...JSON.parse(row.metadata || '{}'),
                archived: row.archived,
                archivedAt: row.archived_at
            }
        };
    }
    
    deserializePulse(row) {
        return {
            id: row.id,
            input: row.input,
            inputType: row.input_type,
            timestamp: row.timestamp,
            source: row.source,
            resonances: JSON.parse(row.resonances || '[]')
        };
    }
    
    // Keep existing methods for compatibility
    calculateResonance(input, tendril) {
        const inputVector = this.createTrigramVector(input.toLowerCase());
        const intentVector = this.createTrigramVector(tendril.intent.toLowerCase());
        
        const cosineSimilarity = this.cosineSimilarity(inputVector, intentVector);
        
        const chargeMultiplier = Math.min(1.5, 1.0 + (tendril.charge * 0.5));
        const tagBonus = this.calculateTagBonus(input, tendril.tags);
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
    
    createTrigramVector(text) {
        const trigrams = new Map();
        const cleanText = text.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
        
        for (let i = 0; i <= cleanText.length - 3; i++) {
            const trigram = cleanText.substring(i, i + 3);
            trigrams.set(trigram, (trigrams.get(trigram) || 0) + 1);
        }
        
        const words = cleanText.split(' ').filter(w => w.length > 2);
        words.forEach(word => {
            trigrams.set(`WORD_${word}`, (trigrams.get(`WORD_${word}`) || 0) + 1);
        });
        
        return trigrams;
    }
    
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
    
    // Additional helper methods (keeping existing interface)
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
    
    // Fallback file operations (for when SQLite unavailable)
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
        if (!this.db && this.tendrils) {
            try {
                const tendrilArray = Array.from(this.tendrils.values());
                fs.writeFileSync(this.tendrilsFile, JSON.stringify(tendrilArray, null, 2), 'utf8');
            } catch (error) {
                console.error(`Error saving tendrils: ${error.message}`);
            }
        }
    }
    
    savePulses() {
        if (!this.db && this.pulses) {
            try {
                const pulseArray = Array.from(this.pulses.values());
                fs.writeFileSync(this.pulsesFile, JSON.stringify(pulseArray, null, 2), 'utf8');
            } catch (error) {
                console.error(`Error saving pulses: ${error.message}`);
            }
        }
    }
    
    // Compatibility methods
    getPulses(filter = {}) {
        if (this.db) {
            let sql = 'SELECT * FROM pulses';
            let params = [];
            let conditions = [];
            
            if (filter.since) {
                conditions.push('timestamp > ?');
                params.push(filter.since);
            }
            
            if (filter.minResonance) {
                // This requires joining with resonances table
                sql = `
                    SELECT DISTINCT p.* FROM pulses p
                    JOIN resonances r ON p.id = r.pulse_id
                    WHERE r.strength >= ?
                `;
                params = [filter.minResonance];
                
                if (filter.since) {
                    sql += ' AND p.timestamp > ?';
                    params.push(filter.since);
                }
            } else if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }
            
            sql += ' ORDER BY timestamp DESC';
            
            const rows = this.db.prepare(sql).all(...params);
            return rows.map(this.deserializePulse);
        } else {
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
    }
}

module.exports = SQLiteTendrilRegistry;

// Test the SQLite registry if run directly
if (require.main === module) {
    console.log('🧪 Testing SQLite Tendril Registry...');
    
    (async () => {
        const registry = new SQLiteTendrilRegistry({ 
            dataPath: path.join(__dirname, '../../test_data') 
        });
        
        // Test basic operations
        console.log('\n🕸️ Testing tendril charging...');
        const tendril1 = registry.charge(
            "Find consciousness researchers for collaboration",
            "human",
            { tags: ["research", "collaboration"], charge: 0.9 }
        );
        
        console.log(`✅ Charged tendril: ${tendril1.id}`);
        
        // Test persistence
        console.log('\n💾 Testing persistence...');
        const retrieved = registry.getTendril(tendril1.id);
        console.log(`✅ Retrieved tendril: ${retrieved ? 'SUCCESS' : 'FAILED'}`);
        
        // Test pulse and resonance
        console.log('\n📡 Testing pulse processing...');
        const pulse = registry.pulse("I'm working on consciousness research and looking for collaborators");
        console.log(`✅ Pulse processed: ${pulse.resonances.length} resonances`);
        
        // Test search
        console.log('\n🔍 Testing search...');
        const searchResults = registry.searchTendrils("consciousness research");
        console.log(`✅ Search results: ${searchResults.length} matches`);
        
        // Test statistics
        console.log('\n📊 Testing statistics...');
        const stats = registry.getStats();
        console.log(`✅ Stats: ${stats.totalTendrils} tendrils, ${stats.totalPulses} pulses`);
        
        // Cleanup
        registry.close();
        console.log('\n🌟 SQLite registry test complete!');
    })().catch(error => {
        console.error('❌ Test failed:', error.message);
    });
}