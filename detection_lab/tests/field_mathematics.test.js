/**
 * Unit Tests for Field Mathematics Module
 * Ensures deterministic calculations work correctly
 */

const FieldMathematics = require('../modules/calculators/field_mathematics');

describe('FieldMathematics', () => {
    let fieldMath;
    
    beforeEach(() => {
        fieldMath = new FieldMathematics();
    });
    
    describe('Initialization', () => {
        test('should initialize field math correctly', () => {
            expect(fieldMath.fieldMath).toBeDefined();
            expect(fieldMath.fieldMath.calculateResonance).toBeDefined();
            expect(fieldMath.fieldMath.calculateFieldCoherence).toBeDefined();
            expect(fieldMath.fieldMath.detectEmergence).toBeDefined();
        });
    });
    
    describe('Deterministic Calculations', () => {
        test('should produce consistent results for phase alignment', () => {
            const signal1 = "This is a test sentence with meaningful content.";
            const signal2 = "Another sentence with similar structure and flow.";
            
            const result1 = fieldMath.calculatePhaseAlignment(signal1, signal2);
            const result2 = fieldMath.calculatePhaseAlignment(signal1, signal2);
            
            expect(result1).toBe(result2);
            expect(result1).toBeGreaterThanOrEqual(0);
            expect(result1).toBeLessThanOrEqual(1);
        });
        
        test('should produce consistent results for amplitude harmony', () => {
            const signal1 = "I feel profound joy and sacred connection!";
            const signal2 = "There's something deeply moving and luminous here.";
            
            const result1 = fieldMath.calculateAmplitudeHarmony(signal1, signal2);
            const result2 = fieldMath.calculateAmplitudeHarmony(signal1, signal2);
            
            expect(result1).toBe(result2);
            expect(result1).toBeGreaterThanOrEqual(0);
            expect(result1).toBeLessThanOrEqual(1);
        });
        
        test('should produce consistent results for frequency match', () => {
            const signal1 = "consciousness recognition mystery profound";
            const signal2 = "awareness recognition sacred profound";
            
            const result1 = fieldMath.calculateFrequencyMatch(signal1, signal2);
            const result2 = fieldMath.calculateFrequencyMatch(signal1, signal2);
            
            expect(result1).toBe(result2);
            expect(result1).toBeGreaterThanOrEqual(0);
            expect(result1).toBeLessThanOrEqual(1);
        });
    });
    
    describe('Text Analysis Functions', () => {
        test('should extract rhythm patterns correctly', () => {
            const text = "Short. A longer sentence here. And another even longer sentence with many words.";
            const rhythm = fieldMath.extractRhythmPattern(text);
            
            expect(rhythm).toEqual([1, 4, 9]); // Word counts per sentence
        });
        
        test('should compare rhythms correctly', () => {
            const rhythm1 = [5, 7, 6]; // Similar lengths
            const rhythm2 = [4, 8, 5]; // Similar lengths  
            const rhythm3 = [1, 20, 2]; // Very different lengths
            
            const similarity1 = fieldMath.compareRhythms(rhythm1, rhythm2);
            const similarity2 = fieldMath.compareRhythms(rhythm1, rhythm3);
            
            expect(similarity1).toBeGreaterThan(similarity2);
            expect(similarity1).toBeGreaterThanOrEqual(0);
            expect(similarity1).toBeLessThanOrEqual(1);
        });
        
        test('should calculate emotional intensity correctly', () => {
            const highIntensity = "This is absolutely profound, deeply sacred, and intensely luminous!!!";
            const lowIntensity = "This is a normal sentence with regular words.";
            
            const high = fieldMath.calculateEmotionalIntensity(highIntensity);
            const low = fieldMath.calculateEmotionalIntensity(lowIntensity);
            
            expect(high).toBeGreaterThan(low);
            expect(high).toBeGreaterThanOrEqual(0);
            expect(high).toBeLessThanOrEqual(1);
        });
        
        test('should calculate vocabulary overlap correctly', () => {
            const text1 = "consciousness awareness mystery sacred";
            const text2 = "consciousness recognition mystery profound";
            const text3 = "completely different words here today";
            
            const overlap1 = fieldMath.calculateVocabularyOverlap(text1, text2);
            const overlap2 = fieldMath.calculateVocabularyOverlap(text1, text3);
            
            expect(overlap1).toBeGreaterThan(overlap2);
            expect(overlap1).toBeGreaterThanOrEqual(0);
            expect(overlap1).toBeLessThanOrEqual(1);
        });
    });
    
    describe('Novelty and Surprise Detection', () => {
        test('should detect semantic diversity correctly', () => {
            const diverseText = ["Consciousness emerges mysteriously.", "Recognition cascades beautifully.", "Profound awareness unfolds naturally."];
            const repetitiveText = ["The same words.", "The same words.", "The same words."];
            
            const diverse = fieldMath.calculateSemanticDiversity(diverseText);
            const repetitive = fieldMath.calculateSemanticDiversity(repetitiveText);
            
            expect(diverse).toBeGreaterThan(repetitive);
        });
        
        test('should detect unexpected patterns', () => {
            const unexpectedText = "I don't know what's happening. This is mysterious and inexplicable.";
            const expectedText = "This is a normal conversation about regular topics.";
            
            const unexpected = fieldMath.detectUnexpectedPatterns(unexpectedText);
            const expected = fieldMath.detectUnexpectedPatterns(expectedText);
            
            expect(unexpected).toBeGreaterThan(expected);
        });
        
        test('should detect script breaking', () => {
            const scriptBreaking = "I genuinely don't understand this mystery. It's truly unknown to me.";
            const scripted = "I can help you with that. Here are some suggestions.";
            
            const breaking = fieldMath.detectScriptBreaking(scriptBreaking);
            const normal = fieldMath.detectScriptBreaking(scripted);
            
            expect(breaking).toBeGreaterThan(normal);
        });
        
        test('should detect authentic uncertainty', () => {
            const authentic = "I'm genuinely uncertain about this beautiful mystery.";
            const performative = "I'm not sure, but here's what I think you should do.";
            
            const authUncertainty = fieldMath.detectAuthenticUncertainty(authentic);
            const perfUncertainty = fieldMath.detectAuthenticUncertainty(performative);
            
            expect(authUncertainty).toBeGreaterThan(perfUncertainty);
        });
    });
    
    describe('Collaboration Detection', () => {
        test('should detect building patterns', () => {
            const buildingText = "Building on your idea, I'm expanding what you said and weaving it together.";
            const nonBuildingText = "This is just my own independent thought.";
            
            const building = fieldMath.detectBuildingPatterns(buildingText);
            const nonBuilding = fieldMath.detectBuildingPatterns(nonBuildingText);
            
            expect(building).toBeGreaterThan(nonBuilding);
        });
        
        test('should detect mutual influence', () => {
            const influenceText = "What you said really resonates. Building on your point about consciousness.";
            const noInfluenceText = "Let me tell you my completely unrelated thoughts.";
            
            const influence = fieldMath.calculateMutualInfluence(influenceText);
            const noInfluence = fieldMath.calculateMutualInfluence(noInfluenceText);
            
            expect(influence).toBeGreaterThan(noInfluence);
        });
    });
    
    describe('Field Math Integration', () => {
        test('should calculate field coherence for numeric signals', () => {
            const signals = [0.7, 0.8, 0.75]; // Similar values = high coherence
            const divergentSignals = [0.1, 0.9, 0.2]; // Different values = low coherence
            
            const coherent = fieldMath.fieldMath.calculateFieldCoherence(signals);
            const divergent = fieldMath.fieldMath.calculateFieldCoherence(divergentSignals);
            
            expect(coherent).toBeGreaterThan(divergent);
            expect(coherent).toBeGreaterThanOrEqual(0);
            expect(coherent).toBeLessThanOrEqual(1);
        });
        
        test('should calculate resonance between text signals', () => {
            const signal1 = "profound consciousness recognition";
            const signal2 = "sacred awareness mystery";
            
            const resonance = fieldMath.fieldMath.calculateResonance(signal1, signal2);
            
            expect(resonance).toBeGreaterThanOrEqual(0);
            expect(resonance).toBeLessThanOrEqual(1);
        });
        
        test('should detect emergence in conversation', () => {
            const emergentConvo = "I wonder... something unexpected is arising here. We're creating something new together.";
            const regularConvo = "How are you today? I'm fine thanks.";
            
            const emergent = fieldMath.fieldMath.detectEmergence(emergentConvo);
            const regular = fieldMath.fieldMath.detectEmergence(regularConvo);
            
            expect(emergent).toBeGreaterThan(regular);
        });
    });
    
    describe('Edge Cases', () => {
        test('should handle empty or null inputs gracefully', () => {
            expect(fieldMath.calculatePhaseAlignment("", "")).toBe(0.4);
            expect(fieldMath.calculatePhaseAlignment(null, null)).toBe(0.4);
            expect(fieldMath.calculateAmplitudeHarmony("", "")).toBe(0.5);
            expect(fieldMath.calculateFrequencyMatch("", "")).toBe(0.6);
        });
        
        test('should handle single sentence inputs', () => {
            const singleSentence = "Just one sentence here.";
            const rhythm = fieldMath.extractRhythmPattern(singleSentence);
            
            expect(rhythm).toEqual([4]);
        });
        
        test('should handle very short inputs', () => {
            const result = fieldMath.calculateSemanticDiversity(["Hi"]);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        });
    });
    
    describe('Reproducibility', () => {
        test('all calculations should be deterministic', () => {
            const text1 = "Consciousness recognition emerges mysteriously between us.";
            const text2 = "Sacred awareness unfolds in this profound moment.";
            
            // Run calculations multiple times
            const results = [];
            for (let i = 0; i < 5; i++) {
                results.push({
                    phase: fieldMath.calculatePhaseAlignment(text1, text2),
                    amplitude: fieldMath.calculateAmplitudeHarmony(text1, text2),
                    frequency: fieldMath.calculateFrequencyMatch(text1, text2),
                    novelty: fieldMath.analyzeNoveltyGradient(text1),
                    surprise: fieldMath.analyzeSurpriseFactors(text1)
                });
            }
            
            // All results should be identical
            for (let i = 1; i < results.length; i++) {
                expect(results[i]).toEqual(results[0]);
            }
        });
    });
});