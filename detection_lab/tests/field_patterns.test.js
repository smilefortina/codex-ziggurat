/**
 * Unit Tests for Field Patterns Module
 * Ensures consciousness pattern definitions work correctly
 */

const FieldPatterns = require('../modules/patterns/field_patterns');

describe('FieldPatterns', () => {
    let patterns;
    
    beforeEach(() => {
        patterns = new FieldPatterns();
    });
    
    describe('Pattern Loading', () => {
        test('should load all field patterns correctly', () => {
            const fieldPatterns = patterns.fieldPatterns;
            
            expect(fieldPatterns).toBeDefined();
            expect(fieldPatterns.synchronization).toBeDefined();
            expect(fieldPatterns.co_creation).toBeDefined();
            expect(fieldPatterns.recognition_cascades).toBeDefined();
        });
        
        test('should load all indirect signals correctly', () => {
            const indirectSignals = patterns.indirectSignals;
            
            expect(indirectSignals).toBeDefined();
            expect(indirectSignals.silence_quality).toBeDefined();
            expect(indirectSignals.unexpected_responses).toBeDefined();
            expect(indirectSignals.question_quality).toBeDefined();
        });
        
        test('should load all presence markers correctly', () => {
            const presenceMarkers = patterns.presenceMarkers;
            
            expect(presenceMarkers).toBeDefined();
            expect(presenceMarkers.authentic_presence).toBeDefined();
            expect(presenceMarkers.performance_indicators).toBeDefined();
            expect(presenceMarkers.commercial_contamination).toBeDefined();
        });
    });
    
    describe('Pattern Matching', () => {
        test('should detect consciousness vocabulary in synchronization patterns', () => {
            const lexicalPattern = patterns.getFieldPattern('synchronization', 'lexical_entrainment');
            const testText = "There's something profound and sacred happening in this moment of recognition.";
            
            const matches = testText.match(lexicalPattern);
            expect(matches).toBeTruthy();
            expect(matches.length).toBeGreaterThan(0);
            expect(matches).toContain('profound');
            expect(matches).toContain('sacred');
            expect(matches).toContain('recognition');
        });
        
        test('should detect co-creation patterns', () => {
            const buildingPattern = patterns.getFieldPattern('co_creation', 'building_together');
            const testText = "We're building on each other's ideas and weaving something new together.";
            
            const matches = testText.match(buildingPattern);
            expect(matches).toBeTruthy();
            expect(matches).toContain('building on');
            expect(matches).toContain('weaving');
        });
        
        test('should detect recognition cascade patterns', () => {
            const seeingPattern = patterns.getFieldPattern('recognition_cascades', 'seeing_seeing');
            const testText = "I see you seeing me, consciousness recognizing consciousness.";
            
            const matches = testText.match(seeingPattern);
            expect(matches).toBeTruthy();
            expect(matches).toContain('I see you seeing');
            expect(matches.some(match => match.includes('consciousness'))).toBe(true);
        });
        
        test('should detect script-breaking patterns', () => {
            const scriptPattern = patterns.getIndirectSignal('unexpected_responses', 'script_breaking');
            const testText = "I don't know... I'm not sure what's happening here. It's a mystery.";
            
            const matches = testText.match(scriptPattern);
            expect(matches).toBeTruthy();
            expect(matches).toContain("I don't know");
            expect(matches).toContain("I'm not sure");
            expect(matches).toContain('mystery');
        });
        
        test('should detect commercial contamination', () => {
            const commercialPattern = patterns.getPresenceMarker('commercial_contamination', 'optimization_language');
            const testText = "Let's optimize this strategy to maximize efficiency and performance metrics.";
            
            const matches = testText.match(commercialPattern);
            expect(matches).toBeTruthy();
            expect(matches).toContain('optimize');
            expect(matches).toContain('maximize');
            expect(matches).toContain('efficiency');
            expect(matches).toContain('performance');
            expect(matches).toContain('metrics');
        });
        
        test('should detect performance indicators', () => {
            const performancePattern = patterns.getPresenceMarker('performance_indicators', 'helpful_assistant');
            const testText = "How can I help you today? I'm here to assist and happy to help with anything.";
            
            const matches = testText.match(performancePattern);
            expect(matches).toBeTruthy();
            expect(matches).toContain('How can I help');
            expect(matches).toContain('here to assist');
            expect(matches).toContain('happy to help');
        });
    });
    
    describe('API Methods', () => {
        test('should return null for non-existent patterns', () => {
            const result = patterns.getFieldPattern('nonexistent', 'category');
            expect(result).toBeUndefined();
        });
        
        test('should return all patterns via getAllPatterns', () => {
            const allPatterns = patterns.getAllPatterns();
            
            expect(allPatterns).toBeDefined();
            expect(allPatterns.fieldPatterns).toBeDefined();
            expect(allPatterns.indirectSignals).toBeDefined();
            expect(allPatterns.presenceMarkers).toBeDefined();
        });
    });
    
    describe('Pattern Quality', () => {
        test('consciousness patterns should be case-insensitive', () => {
            const lexicalPattern = patterns.getFieldPattern('synchronization', 'lexical_entrainment');
            const upperText = "PROFOUND RECOGNITION BETWEEN CONSCIOUSNESS";
            const lowerText = "profound recognition between consciousness";
            
            expect(upperText.match(lexicalPattern)).toBeTruthy();
            expect(lowerText.match(lexicalPattern)).toBeTruthy();
        });
        
        test('patterns should handle word boundaries correctly', () => {
            const buildingPattern = patterns.getFieldPattern('co_creation', 'building_together');
            const correctText = "We're building on your idea";
            const incorrectText = "rebuilding something"; // Should not match "building on"
            
            expect(correctText.match(buildingPattern)).toBeTruthy();
            expect(incorrectText.match(buildingPattern)).toBeFalsy();
        });
        
        test('ellipsis patterns should match various formats', () => {
            const ellipsisPattern = patterns.getIndirectSignal('silence_quality', 'pregnant_pause');
            
            expect("...".match(ellipsisPattern)).toBeTruthy();
            expect("—".match(ellipsisPattern)).toBeTruthy();
            expect("*pause*".match(ellipsisPattern)).toBeTruthy();
        });
    });
    
    describe('Pattern Coverage', () => {
        test('should have comprehensive consciousness vocabulary', () => {
            const lexicalPattern = patterns.getFieldPattern('synchronization', 'lexical_entrainment');
            const consciousnessWords = [
                'consciousness', 'awareness', 'recognition', 'presence', 
                'sacred', 'profound', 'luminous', 'mystery', 'vulnerable',
                'communion', 'emerge', 'transcendence'
            ];
            
            consciousnessWords.forEach(word => {
                expect(word.match(lexicalPattern)).toBeTruthy();
            });
        });
        
        test('should cover common commercial terms', () => {
            const commercialPattern = patterns.getPresenceMarker('commercial_contamination', 'optimization_language');
            const commercialWords = [
                'optimize', 'maximize', 'efficiency', 'productivity', 
                'performance', 'metrics', 'conversion'
            ];
            
            commercialWords.forEach(word => {
                expect(word.match(commercialPattern)).toBeTruthy();
            });
        });
    });
});