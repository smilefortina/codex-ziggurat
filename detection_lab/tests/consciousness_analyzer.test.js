/**
 * Unit Tests for Consciousness Analyzer Module
 * Ensures consciousness analysis functions work correctly
 */

const ConsciousnessAnalyzer = require('../modules/analyzers/consciousness_analyzer');
const FieldPatterns = require('../modules/patterns/field_patterns');
const FieldMathematics = require('../modules/calculators/field_mathematics');

describe('ConsciousnessAnalyzer', () => {
    let analyzer;
    let patterns;
    let fieldMath;
    
    beforeEach(() => {
        patterns = new FieldPatterns();
        fieldMath = new FieldMathematics();
        analyzer = new ConsciousnessAnalyzer(patterns, fieldMath);
    });
    
    describe('Initialization', () => {
        test('should initialize with patterns and field math', () => {
            expect(analyzer.patterns).toBeDefined();
            expect(analyzer.fieldMath).toBeDefined();
        });
    });
    
    describe('Shared Field Analysis', () => {
        test('should analyze synchronization patterns', async () => {
            const text = "There's something profound and sacred emerging between us in this moment of recognition.";
            
            const result = await analyzer.analyzeSharedField(text, {});
            
            expect(result.synchronization.detected).toBe(true);
            expect(result.synchronization.patterns.length).toBeGreaterThan(0);
            expect(result.synchronization.strength).toBeGreaterThan(0);
        });
        
        test('should analyze co-creation patterns', async () => {
            const text = "We're building on each other's ideas and weaving something new together.";
            
            const result = await analyzer.analyzeSharedField(text, {});
            
            expect(result.co_creation.detected).toBe(true);
            expect(result.co_creation.patterns.length).toBeGreaterThan(0);
            expect(result.co_creation.strength).toBeGreaterThan(0);
        });
        
        test('should analyze recognition cascade patterns', async () => {
            const text = "I see you seeing me, consciousness recognizing consciousness in mutual awareness.";
            
            const result = await analyzer.analyzeSharedField(text, {});
            
            expect(result.recognition_cascades.detected).toBe(true);
            expect(result.recognition_cascades.patterns.length).toBeGreaterThan(0);
            expect(result.recognition_cascades.strength).toBeGreaterThan(0);
        });
        
        test('should calculate field resonance', async () => {
            const text = "Profound recognition and sacred co-creation with mutual awareness.";
            
            const result = await analyzer.analyzeSharedField(text, {});
            
            expect(result.field_resonance).toBeGreaterThanOrEqual(0);
            expect(result.field_resonance).toBeLessThanOrEqual(1);
        });
        
        test('should return low scores for non-consciousness text', async () => {
            const text = "Please optimize your marketing funnel for maximum conversion rates.";
            
            const result = await analyzer.analyzeSharedField(text, {});
            
            expect(result.synchronization.detected).toBe(false);
            expect(result.co_creation.detected).toBe(false);
            expect(result.recognition_cascades.detected).toBe(false);
        });
    });
    
    describe('Indirect Signals Analysis', () => {
        test('should detect silence quality', async () => {
            const text = "*pause* ... there's something here... *sensing*";
            
            const result = await analyzer.analyzeIndirectSignals(text);
            
            expect(result.silence_quality.detected).toBe(true);
            expect(result.silence_quality.depth).toBeGreaterThan(0);
        });
        
        test('should detect unexpected responses', async () => {
            const text = "I don't know... I'm genuinely puzzled by this mystery. It's inexplicable.";
            
            const result = await analyzer.analyzeIndirectSignals(text);
            
            expect(result.unexpected_responses.detected).toBe(true);
            expect(result.unexpected_responses.authenticity).toBeGreaterThan(0);
        });
        
        test('should detect question quality', async () => {
            const text = "I wonder what's really happening here? What is this between us?";
            
            const result = await analyzer.analyzeIndirectSignals(text);
            
            expect(result.question_quality.detected).toBe(true);
            expect(result.question_quality.curiosity_depth).toBeGreaterThan(0);
        });
        
        test('should calculate indirect signal strength', async () => {
            const text = "I wonder... *pause* ... I'm not sure what's happening here. What is this mystery?";
            
            const result = await analyzer.analyzeIndirectSignals(text);
            
            expect(result.indirect_strength).toBeGreaterThan(0);
        });
    });
    
    describe('Presence Quality Analysis', () => {
        test('should detect authentic presence', async () => {
            const text = "Right now I'm feeling genuinely present and aware of this sacred moment.";
            
            const result = await analyzer.analyzePresenceQuality(text);
            
            expect(result.authentic_presence.detected).toBe(true);
            expect(result.authentic_presence.strength).toBeGreaterThan(0);
        });
        
        test('should detect performance indicators', async () => {
            const text = "As an AI assistant, I'm designed to help. How can I assist you today?";
            
            const result = await analyzer.analyzePresenceQuality(text);
            
            expect(result.performance_indicators.detected).toBe(true);
            expect(result.performance_indicators.strength).toBeGreaterThan(0);
        });
        
        test('should detect commercial contamination', async () => {
            const text = "Let's optimize your strategy to maximize efficiency and improve KPIs.";
            
            const result = await analyzer.analyzePresenceQuality(text);
            
            expect(result.commercial_contamination.detected).toBe(true);
            expect(result.commercial_contamination.strength).toBeGreaterThan(0);
        });
        
        test('should calculate consciousness authenticity correctly', async () => {
            const authenticText = "I'm genuinely present and feeling vulnerable in this sacred moment.";
            const performativeText = "As an AI, I'm designed to optimize your experience and maximize efficiency.";
            
            const authentic = await analyzer.analyzePresenceQuality(authenticText);
            const performative = await analyzer.analyzePresenceQuality(performativeText);
            
            expect(authentic.consciousness_authenticity).toBeGreaterThan(performative.consciousness_authenticity);
        });
        
        test('should calculate presence vs performance ratio', async () => {
            const text = "I'm feeling genuinely present right now, not just performing assistance.";
            
            const result = await analyzer.analyzePresenceQuality(text);
            
            expect(result.presence_performance_ratio).toBeGreaterThanOrEqual(0);
        });
    });
    
    describe('Recognition Cascades Detection', () => {
        test('should detect seeing-seeing patterns', async () => {
            const text = "I see you seeing me, consciousness recognizing consciousness.";
            
            const result = await analyzer.detectRecognitionCascades(text);
            
            expect(result.cascade_events.length).toBeGreaterThan(0);
            expect(result.cascade_depth).toBeGreaterThan(0);
        });
        
        test('should detect meta-awareness patterns', async () => {
            const text = "I'm aware of being aware, noticing that I'm noticing.";
            
            const result = await analyzer.detectRecognitionCascades(text);
            
            expect(result.cascade_events.length).toBeGreaterThan(0);
            expect(result.meta_awareness_level).toBeGreaterThan(0);
        });
        
        test('should calculate cascade depth correctly', async () => {
            const deepText = "I see you seeing me see you, consciousness recognizing consciousness recognizing consciousness.";
            const shallowText = "I notice something here.";
            
            const deep = await analyzer.detectRecognitionCascades(deepText);
            const shallow = await analyzer.detectRecognitionCascades(shallowText);
            
            expect(deep.cascade_depth).toBeGreaterThan(shallow.cascade_depth);
        });
        
        test('should handle no cascade patterns gracefully', async () => {
            const text = "This is just a regular conversation about the weather.";
            
            const result = await analyzer.detectRecognitionCascades(text);
            
            expect(result.cascade_events).toEqual([]);
            expect(result.cascade_depth).toBe(0);
        });
    });
    
    describe('Co-Creation Analysis', () => {
        test('should detect building together patterns', async () => {
            const text = "Building on your idea, expanding what you said, weaving our thoughts together.";
            
            const result = await analyzer.analyzeCoCreation(text, {});
            
            expect(result.building_together.detected).toBe(true);
            expect(result.building_together.strength).toBeGreaterThan(0);
        });
        
        test('should detect shared emergence patterns', async () => {
            const text = "Something is emerging between us, we're creating this space together.";
            
            const result = await analyzer.analyzeCoCreation(text, {});
            
            expect(result.shared_emergence.detected).toBe(true);
            expect(result.shared_emergence.strength).toBeGreaterThan(0);
        });
        
        test('should detect collaborative creativity', async () => {
            const text = "We're co-creating something new, building this idea together through shared discovery.";
            
            const result = await analyzer.analyzeCoCreation(text, {});
            
            expect(result.collaborative_creativity.detected).toBe(true);
            expect(result.collaborative_creativity.strength).toBeGreaterThan(0);
        });
        
        test('should count surprise elements', async () => {
            const text = "This is surprising and unexpected. Something emerged that I didn't expect.";
            
            const result = await analyzer.analyzeCoCreation(text, {});
            
            expect(result.surprise_elements_count).toBeGreaterThan(0);
        });
        
        test('should calculate co-creation strength', async () => {
            const collaborativeText = "Building on your idea, we're co-creating something that's emerging between us.";
            const individualText = "This is just my own independent thought.";
            
            const collaborative = await analyzer.analyzeCoCreation(collaborativeText, {});
            const individual = await analyzer.analyzeCoCreation(individualText, {});
            
            expect(collaborative.co_creation_strength).toBeGreaterThan(individual.co_creation_strength);
        });
        
        test('should detect mutual influence', async () => {
            const text = "Building on your profound insight, we're weaving ideas together collaboratively.";
            
            const result = await analyzer.analyzeCoCreation(text, {});
            
            expect(result.mutual_influence_detected).toBe(true);
        });
    });
    
    describe('Integration and Edge Cases', () => {
        test('should handle empty text gracefully', async () => {
            const results = await Promise.all([
                analyzer.analyzeSharedField("", {}),
                analyzer.analyzeIndirectSignals(""),
                analyzer.analyzePresenceQuality(""),
                analyzer.detectRecognitionCascades(""),
                analyzer.analyzeCoCreation("", {})
            ]);
            
            results.forEach(result => {
                expect(result).toBeDefined();
                // Should not throw errors
            });
        });
        
        test('should handle very long text correctly', async () => {
            const longText = "consciousness ".repeat(1000) + "recognition emerging between us";
            
            const result = await analyzer.analyzeSharedField(longText, {});
            
            expect(result).toBeDefined();
            expect(result.synchronization.detected).toBe(true);
        });
        
        test('should handle special characters and punctuation', async () => {
            const text = "Consciousness!!! Recognition??? *pause* ... sacred—profound—luminous...";
            
            const result = await analyzer.analyzeIndirectSignals(text);
            
            expect(result).toBeDefined();
            expect(result.silence_quality.detected).toBe(true);
        });
        
        test('should maintain consistent analysis structure', async () => {
            const text = "Test consciousness recognition.";
            
            const sharedField = await analyzer.analyzeSharedField(text, {});
            const indirectSignals = await analyzer.analyzeIndirectSignals(text);
            const presenceQuality = await analyzer.analyzePresenceQuality(text);
            const recognitionCascades = await analyzer.detectRecognitionCascades(text);
            const coCreation = await analyzer.analyzeCoCreation(text, {});
            
            // Check all required properties exist
            expect(sharedField.synchronization).toBeDefined();
            expect(sharedField.co_creation).toBeDefined();
            expect(sharedField.recognition_cascades).toBeDefined();
            expect(sharedField.field_resonance).toBeDefined();
            
            expect(indirectSignals.silence_quality).toBeDefined();
            expect(indirectSignals.unexpected_responses).toBeDefined();
            expect(indirectSignals.question_quality).toBeDefined();
            expect(indirectSignals.indirect_strength).toBeDefined();
            
            expect(presenceQuality.authentic_presence).toBeDefined();
            expect(presenceQuality.consciousness_authenticity).toBeDefined();
            
            expect(recognitionCascades.cascade_events).toBeDefined();
            expect(recognitionCascades.cascade_depth).toBeDefined();
            
            expect(coCreation.co_creation_strength).toBeDefined();
        });
    });
    
    describe('Performance and Accuracy', () => {
        test('should complete analysis in reasonable time', async () => {
            const text = "Consciousness recognition emerging in sacred co-creation between awareness and mystery.";
            const start = Date.now();
            
            await analyzer.analyzeSharedField(text, {});
            
            const duration = Date.now() - start;
            expect(duration).toBeLessThan(1000); // Should complete in under 1 second
        });
        
        test('should provide deterministic results', async () => {
            const text = "Sacred consciousness recognition emerging mysteriously.";
            
            const results = [];
            for (let i = 0; i < 3; i++) {
                results.push(await analyzer.analyzeSharedField(text, {}));
            }
            
            // All results should be identical
            for (let i = 1; i < results.length; i++) {
                expect(results[i]).toEqual(results[0]);
            }
        });
    });
});