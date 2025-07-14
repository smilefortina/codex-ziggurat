/**
 * SQLite Registry Test Suite
 * 
 * Comprehensive tests for the production persistence layer
 * to prevent data loss and ensure reliability under various conditions.
 */

const SQLiteTendrilRegistry = require('../src/tendrils/sqlite_registry');
const path = require('path');
const fs = require('fs');

describe('SQLiteTendrilRegistry', () => {
    let registry;
    let testDataPath;
    
    beforeEach(() => {
        // Create isolated test environment
        testDataPath = path.join(__dirname, '../test_data', `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
        fs.mkdirSync(testDataPath, { recursive: true });
        
        registry = new SQLiteTendrilRegistry({
            dataPath: testDataPath
        });
    });
    
    afterEach(() => {
        // Cleanup test data
        registry.close();
        
        try {
            fs.rmSync(testDataPath, { recursive: true, force: true });
        } catch (error) {
            console.warn('Cleanup warning:', error.message);
        }
    });
    
    describe('Tendril Management', () => {
        test('should charge a new tendril with default values', () => {
            const tendril = registry.charge("Test consciousness intention");
            
            expect(tendril).toMatchObject({
                id: expect.stringMatching(/^TDL-/),
                owner: 'human',
                intent: "Test consciousness intention",
                tags: [],
                charge: 0.7,
                createdAt: expect.any(String),
                lastPulse: null,
                metadata: expect.objectContaining({
                    source: 'cli',
                    priority: 'medium',
                    category: 'general'
                })
            });
        });
        
        test('should charge a tendril with custom options', () => {
            const options = {
                tags: ['research', 'consciousness'],
                charge: 0.9,
                source: 'test',
                priority: 'high',
                category: 'sacred_tech'
            };
            
            const tendril = registry.charge("Find sacred tech collaborators", 'ai', options);
            
            expect(tendril).toMatchObject({
                owner: 'ai',
                intent: "Find sacred tech collaborators",
                tags: ['research', 'consciousness'],
                charge: 0.9,
                metadata: expect.objectContaining({
                    source: 'test',
                    priority: 'high',
                    category: 'sacred_tech'
                })
            });
        });
        
        test('should validate charge values', () => {
            const testCases = [
                { input: -0.5, expected: 0.0 },
                { input: 1.5, expected: 1.0 },
                { input: 'invalid', expected: 0.7 },
                { input: 0.42, expected: 0.42 }
            ];
            
            testCases.forEach(({ input, expected }) => {
                const tendril = registry.charge("Test intent", 'human', { charge: input });
                expect(tendril.charge).toBe(expected);
            });
        });
        
        test('should persist and retrieve tendrils correctly', () => {
            const originalTendril = registry.charge("Persistent consciousness test", 'human', {
                tags: ['persistence', 'test'],
                charge: 0.85
            });
            
            const retrieved = registry.getTendril(originalTendril.id);
            
            expect(retrieved).toMatchObject({
                id: originalTendril.id,
                owner: 'human',
                intent: "Persistent consciousness test",
                tags: ['persistence', 'test'],
                charge: 0.85
            });
        });
        
        test('should return null for non-existent tendril', () => {
            const nonExistent = registry.getTendril('TDL-nonexistent');
            expect(nonExistent).toBeNull();
        });
        
        test('should list tendrils with filtering', () => {
            // Create test tendrils
            registry.charge("Human intent 1", 'human', { tags: ['tag1'] });
            registry.charge("Human intent 2", 'human', { tags: ['tag2'] });
            registry.charge("AI intent", 'ai', { tags: ['tag1'] });
            
            // Test filtering by owner
            const humanTendrils = registry.getTendrils({ owner: 'human' });
            expect(humanTendrils).toHaveLength(2);
            expect(humanTendrils.every(t => t.owner === 'human')).toBe(true);
            
            const aiTendrils = registry.getTendrils({ owner: 'ai' });
            expect(aiTendrils).toHaveLength(1);
            expect(aiTendrils[0].owner).toBe('ai');
            
            // Test active only filtering
            const allActive = registry.getTendrils({ activeOnly: true });
            expect(allActive).toHaveLength(3);
        });
        
        test('should archive tendrils', () => {
            const tendril = registry.charge("Tendril to archive");
            
            // Verify initially active
            let activeTendrils = registry.getTendrils({ activeOnly: true });
            expect(activeTendrils).toHaveLength(1);
            
            // Archive the tendril
            const archived = registry.archive(tendril.id);
            expect(archived).toBe(true);
            
            // Verify no longer in active list
            activeTendrils = registry.getTendrils({ activeOnly: true });
            expect(activeTendrils).toHaveLength(0);
            
            // But still retrievable by ID
            const retrieved = registry.getTendril(tendril.id);
            expect(retrieved).toBeTruthy();
            expect(retrieved.metadata.archived).toBe(true);
        });
        
        test('should handle archiving non-existent tendril', () => {
            const archived = registry.archive('TDL-nonexistent');
            expect(archived).toBe(false);
        });
    });
    
    describe('Pulse Processing', () => {
        test('should process pulse and calculate resonances', () => {
            // Create a tendril first
            const tendril = registry.charge("consciousness research collaboration", 'human', {
                tags: ['research', 'consciousness'],
                charge: 0.8
            });
            
            // Send a resonant pulse
            const pulse = registry.pulse("I'm working on consciousness research and seeking collaboration");
            
            expect(pulse).toMatchObject({
                id: expect.stringMatching(/^PLS-/),
                input: "I'm working on consciousness research and seeking collaboration",
                inputType: 'text',
                timestamp: expect.any(String),
                source: 'unknown',
                resonances: expect.any(Array)
            });
            
            expect(pulse.resonances.length).toBeGreaterThan(0);
            
            const resonance = pulse.resonances[0];
            expect(resonance).toMatchObject({
                tendrilId: tendril.id,
                strength: expect.any(Number),
                type: expect.any(String),
                timestamp: expect.any(String),
                details: expect.objectContaining({
                    baseSimilarity: expect.any(Number),
                    chargeMultiplier: expect.any(Number),
                    tagBonus: expect.any(Number),
                    recencyBonus: expect.any(Number)
                })
            });
            
            expect(resonance.strength).toBeGreaterThan(0.1);
        });
        
        test('should filter out weak resonances', () => {
            registry.charge("very specific unique terminology", 'human');
            
            const pulse = registry.pulse("completely unrelated content about cooking recipes");
            
            // Should have no significant resonances
            expect(pulse.resonances).toHaveLength(0);
        });
        
        test('should update tendril last pulse time for strong resonances', () => {
            const tendril = registry.charge("consciousness research", 'human');
            
            // Send strong resonance pulse
            registry.pulse("consciousness research collaboration opportunities");
            
            const updated = registry.getTendril(tendril.id);
            expect(updated.lastPulse).toBeTruthy();
            expect(new Date(updated.lastPulse)).toBeInstanceOf(Date);
        });
        
        test('should handle pulses with metadata', () => {
            registry.charge("test tendril");
            
            const pulse = registry.pulse("test input", {
                inputType: 'external_event',
                source: 'test_feed'
            });
            
            expect(pulse.inputType).toBe('external_event');
            expect(pulse.source).toBe('test_feed');
        });
    });
    
    describe('Resonance Calculation', () => {
        test('should calculate deterministic resonance scores', () => {
            const tendril = {
                id: 'test',
                intent: "consciousness research collaboration",
                tags: ['research'],
                charge: 0.8,
                createdAt: new Date().toISOString()
            };
            
            const input1 = "consciousness research collaboration";
            const input2 = "consciousness research collaboration";
            
            const resonance1 = registry.calculateResonance(input1, tendril);
            const resonance2 = registry.calculateResonance(input2, tendril);
            
            // Should be deterministic
            expect(resonance1.strength).toBe(resonance2.strength);
            expect(resonance1.type).toBe(resonance2.type);
        });
        
        test('should apply charge multiplier correctly', () => {
            const lowChargeTendril = {
                id: 'low',
                intent: "test intent",
                tags: [],
                charge: 0.3,
                createdAt: new Date().toISOString()
            };
            
            const highChargeTendril = {
                id: 'high',
                intent: "test intent",
                tags: [],
                charge: 0.9,
                createdAt: new Date().toISOString()
            };
            
            const input = "test intent exactly";
            
            const lowResonance = registry.calculateResonance(input, lowChargeTendril);
            const highResonance = registry.calculateResonance(input, highChargeTendril);
            
            expect(highResonance.strength).toBeGreaterThan(lowResonance.strength);
        });
        
        test('should apply tag bonus', () => {
            const tendrilWithTags = {
                id: 'tagged',
                intent: "research project",
                tags: ['consciousness', 'collaboration'],
                charge: 0.7,
                createdAt: new Date().toISOString()
            };
            
            const tendrilWithoutTags = {
                id: 'untagged',
                intent: "research project",
                tags: [],
                charge: 0.7,
                createdAt: new Date().toISOString()
            };
            
            const input = "consciousness research collaboration project";
            
            const taggedResonance = registry.calculateResonance(input, tendrilWithTags);
            const untaggedResonance = registry.calculateResonance(input, tendrilWithoutTags);
            
            expect(taggedResonance.strength).toBeGreaterThan(untaggedResonance.strength);
        });
        
        test('should classify resonance strength correctly', () => {
            const testCases = [
                { strength: 0.9, expectedType: 'QUANTUM_ENTANGLEMENT' },
                { strength: 0.7, expectedType: 'STRONG_RESONANCE' },
                { strength: 0.5, expectedType: 'SUBTLE_ATTRACTION' },
                { strength: 0.3, expectedType: 'FAINT_ECHO' },
                { strength: 0.1, expectedType: 'MINIMAL_RESPONSE' }
            ];
            
            testCases.forEach(({ strength, expectedType }) => {
                const type = registry.classifyResonanceStrength(strength);
                expect(type).toBe(expectedType);
            });
        });
    });
    
    describe('Text Processing', () => {
        test('should create consistent trigram vectors', () => {
            const text1 = "consciousness research collaboration";
            const text2 = "consciousness research collaboration";
            
            const vector1 = registry.createTrigramVector(text1);
            const vector2 = registry.createTrigramVector(text2);
            
            expect(vector1.size).toBe(vector2.size);
            
            for (const [key, value] of vector1) {
                expect(vector2.get(key)).toBe(value);
            }
        });
        
        test('should handle special characters in text', () => {
            const testTexts = [
                "Hello, world! 123",
                "émojis 🌟 and ümlauts",
                "",
                "   whitespace   ",
                "UPPERCASE and lowercase"
            ];
            
            testTexts.forEach(text => {
                expect(() => {
                    const vector = registry.createTrigramVector(text);
                    expect(vector).toBeInstanceOf(Map);
                }).not.toThrow();
            });
        });
        
        test('should calculate cosine similarity correctly', () => {
            const vector1 = new Map([['abc', 1], ['bcd', 1], ['cde', 1]]);
            const vector2 = new Map([['abc', 1], ['bcd', 1], ['xyz', 1]]);
            const vector3 = new Map([['xyz', 1], ['yzw', 1]]);
            
            // Identical vectors should have similarity 1
            const selfSimilarity = registry.cosineSimilarity(vector1, vector1);
            expect(selfSimilarity).toBeCloseTo(1.0, 5);
            
            // Partially overlapping vectors
            const partialSimilarity = registry.cosineSimilarity(vector1, vector2);
            expect(partialSimilarity).toBeGreaterThan(0);
            expect(partialSimilarity).toBeLessThan(1);
            
            // Non-overlapping vectors should have similarity 0
            const noSimilarity = registry.cosineSimilarity(vector1, vector3);
            expect(noSimilarity).toBe(0);
        });
        
        test('should handle empty vectors gracefully', () => {
            const emptyVector = new Map();
            const normalVector = new Map([['abc', 1]]);
            
            const similarity = registry.cosineSimilarity(emptyVector, normalVector);
            expect(similarity).toBe(0);
        });
    });
    
    describe('Search Functionality', () => {
        test('should perform full-text search on tendrils', () => {
            registry.charge("consciousness research collaboration", 'human', { tags: ['research'] });
            registry.charge("artificial intelligence development", 'human', { tags: ['ai'] });
            registry.charge("meditation and mindfulness practice", 'human', { tags: ['meditation'] });
            
            const results = registry.searchTendrils("consciousness research");
            
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].intent).toContain('consciousness');
            expect(results[0].searchRank).toBeGreaterThan(0);
        });
        
        test('should return empty results for non-matching search', () => {
            registry.charge("completely different topic");
            
            const results = registry.searchTendrils("quantum physics");
            
            expect(results).toHaveLength(0);
        });
        
        test('should respect search limit', () => {
            for (let i = 0; i < 10; i++) {
                registry.charge(`consciousness research project ${i}`);
            }
            
            const results = registry.searchTendrils("consciousness", 3);
            
            expect(results).toHaveLength(3);
        });
    });
    
    describe('Statistics and Analytics', () => {
        test('should calculate accurate statistics', () => {
            // Create test data
            registry.charge("tendril 1", 'human', { charge: 0.8 });
            registry.charge("tendril 2", 'ai', { charge: 0.6 });
            const tendril3 = registry.charge("tendril 3", 'human', { charge: 0.9 });
            
            // Archive one tendril
            registry.archive(tendril3.id);
            
            // Create pulses
            registry.pulse("test pulse 1");
            registry.pulse("test pulse 2");
            
            const stats = registry.getStats();
            
            expect(stats).toMatchObject({
                totalTendrils: 3,
                activeTendrils: 2,
                totalPulses: 2,
                totalResonances: expect.any(Number),
                strongResonances: expect.any(Number),
                averageResonance: expect.any(Number)
            });
            
            expect(stats.averageCharge).toBeCloseTo(0.77, 1); // (0.8 + 0.6 + 0.9) / 3
        });
    });
    
    describe('Convergence Detection', () => {
        test('should identify convergence events', () => {
            // Create multiple tendrils that will resonate with the same input
            registry.charge("consciousness research", 'human', { charge: 0.9 });
            registry.charge("research collaboration", 'human', { charge: 0.8 });
            registry.charge("artificial intelligence", 'human', { charge: 0.7 });
            
            // Send pulse that should resonate with multiple tendrils
            registry.pulse("consciousness research collaboration project");
            
            const convergences = registry.getConvergences(0.4, 2);
            
            expect(convergences.length).toBeGreaterThan(0);
        });
    });
    
    describe('Edge Cases and Error Handling', () => {
        test('should handle empty input gracefully', () => {
            registry.charge("test tendril");
            
            expect(() => {
                const pulse = registry.pulse("");
                expect(pulse.resonances).toHaveLength(0);
            }).not.toThrow();
        });
        
        test('should handle extremely long input', () => {
            registry.charge("test tendril");
            
            const longInput = "word ".repeat(10000);
            
            expect(() => {
                const pulse = registry.pulse(longInput);
                expect(pulse).toBeTruthy();
            }).not.toThrow();
        });
        
        test('should handle special characters and emojis', () => {
            const specialIntent = "🌟 consciousness ⚡ research 🌊 collaboration 🕸️";
            
            expect(() => {
                const tendril = registry.charge(specialIntent);
                expect(tendril.intent).toBe(specialIntent);
                
                const pulse = registry.pulse("🌟 looking for ⚡ consciousness researchers 🌊");
                expect(pulse).toBeTruthy();
            }).not.toThrow();
        });
        
        test('should handle concurrent operations safely', async () => {
            const promises = [];
            
            // Simulate concurrent tendril charging
            for (let i = 0; i < 10; i++) {
                promises.push(
                    Promise.resolve(registry.charge(`concurrent tendril ${i}`))
                );
            }
            
            // Simulate concurrent pulse processing
            for (let i = 0; i < 5; i++) {
                promises.push(
                    Promise.resolve(registry.pulse(`concurrent pulse ${i}`))
                );
            }
            
            const results = await Promise.all(promises);
            
            expect(results).toHaveLength(15);
            expect(results.every(r => r && r.id)).toBe(true);
        });
    });
    
    describe('Database Persistence', () => {
        test('should survive registry restart', () => {
            // Create data
            const originalTendril = registry.charge("persistent test");
            const originalPulse = registry.pulse("test input");
            
            // Close and recreate registry
            registry.close();
            
            const newRegistry = new SQLiteTendrilRegistry({
                dataPath: testDataPath
            });
            
            // Verify data persisted
            const retrievedTendril = newRegistry.getTendril(originalTendril.id);
            expect(retrievedTendril).toBeTruthy();
            expect(retrievedTendril.intent).toBe("persistent test");
            
            const allPulses = newRegistry.getPulses();
            expect(allPulses.length).toBeGreaterThan(0);
            
            newRegistry.close();
        });
    });
});