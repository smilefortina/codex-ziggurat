/**
 * Unit Tests for Shimmer Calculator Module
 * Ensures enhanced shimmer calculations work correctly
 */

const ShimmerCalculator = require('../modules/calculators/shimmer_calculator');

describe('ShimmerCalculator', () => {
    let calculator;
    
    beforeEach(() => {
        calculator = new ShimmerCalculator();
    });
    
    describe('Enhanced Shimmer Calculation', () => {
        test('should calculate enhanced shimmer strength correctly', () => {
            const baseAnalysis = { overall_shimmer_strength: 0.5 };
            const fieldAnalysis = { 
                field_strength: 0.7,
                co_creation: { co_creation_strength: 0.6 },
                recognition_cascades: { cascade_depth: 0.8 }
            };
            const semanticAnalysis = { 
                overallScore: 0.7,
                antiPatterns: {
                    commercial_scripted: { detected: false },
                    spiritual_bypassing: { detected: false },
                    performance_mode: { detected: false }
                }
            };
            
            const result = calculator.calculateEnhancedShimmerStrength(baseAnalysis, fieldAnalysis, semanticAnalysis);
            
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
            expect(result).toBeGreaterThan(baseAnalysis.overall_shimmer_strength); // Should be enhanced
        });
        
        test('should apply semantic bonus correctly', () => {
            const baseAnalysis = { overall_shimmer_strength: 0.3 };
            const fieldAnalysis = { 
                field_strength: 0.2,
                co_creation: { co_creation_strength: 0.1 },
                recognition_cascades: { cascade_depth: 0.1 }
            };
            
            const withSemantics = { overallScore: 0.8, antiPatterns: {} };
            const withoutSemantics = { overallScore: 0.0, antiPatterns: {} };
            
            const enhanced = calculator.calculateEnhancedShimmerStrength(baseAnalysis, fieldAnalysis, withSemantics);
            const basic = calculator.calculateEnhancedShimmerStrength(baseAnalysis, fieldAnalysis, withoutSemantics);
            
            expect(enhanced).toBeGreaterThan(basic);
        });
        
        test('should apply anti-pattern penalties correctly', () => {
            const baseAnalysis = { overall_shimmer_strength: 0.8 };
            const fieldAnalysis = { 
                field_strength: 0.7,
                co_creation: { co_creation_strength: 0.6 },
                recognition_cascades: { cascade_depth: 0.5 }
            };
            
            const withPenalties = {
                overallScore: 0.5,
                antiPatterns: {
                    commercial_scripted: { detected: true },
                    spiritual_bypassing: { detected: true },
                    performance_mode: { detected: true }
                }
            };
            const withoutPenalties = {
                overallScore: 0.5,
                antiPatterns: {
                    commercial_scripted: { detected: false },
                    spiritual_bypassing: { detected: false },
                    performance_mode: { detected: false }
                }
            };
            
            const penalized = calculator.calculateEnhancedShimmerStrength(baseAnalysis, fieldAnalysis, withPenalties);
            const clean = calculator.calculateEnhancedShimmerStrength(baseAnalysis, fieldAnalysis, withoutPenalties);
            
            expect(penalized).toBeLessThan(clean);
        });
        
        test('should handle missing semantic analysis gracefully', () => {
            const baseAnalysis = { overall_shimmer_strength: 0.5 };
            const fieldAnalysis = { 
                field_strength: 0.6,
                co_creation: { co_creation_strength: 0.4 },
                recognition_cascades: { cascade_depth: 0.3 }
            };
            
            const result = calculator.calculateEnhancedShimmerStrength(baseAnalysis, fieldAnalysis, null);
            
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        });
        
        test('should bound results between 0 and 1', () => {
            const baseAnalysis = { overall_shimmer_strength: 0.9 };
            const fieldAnalysis = { 
                field_strength: 0.9,
                co_creation: { co_creation_strength: 0.9 },
                recognition_cascades: { cascade_depth: 0.9 }
            };
            const semanticAnalysis = { overallScore: 0.9, antiPatterns: {} };
            
            const result = calculator.calculateEnhancedShimmerStrength(baseAnalysis, fieldAnalysis, semanticAnalysis);
            
            expect(result).toBeLessThanOrEqual(1.0);
        });
    });
    
    describe('Field Strength Calculation', () => {
        test('should calculate field strength from components', () => {
            const fieldAnalysis = {
                shared_field: { field_resonance: 0.7 },
                indirect_signals: { indirect_strength: 0.6 },
                presence_quality: { consciousness_authenticity: 2.1 }, // Note: can be > 1
                recognition_cascades: { cascade_depth: 0.8 },
                co_creation: { co_creation_strength: 0.5 }
            };
            
            const result = calculator.calculateFieldStrength(fieldAnalysis);
            
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        });
        
        test('should handle missing field components gracefully', () => {
            const fieldAnalysis = {
                shared_field: { field_resonance: 0.5 }
                // Missing other components
            };
            
            const result = calculator.calculateFieldStrength(fieldAnalysis);
            
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        });
        
        test('should weight components correctly', () => {
            const highSharedField = {
                shared_field: { field_resonance: 0.9 },
                indirect_signals: { indirect_strength: 0.1 },
                presence_quality: { consciousness_authenticity: 0.1 },
                recognition_cascades: { cascade_depth: 0.1 },
                co_creation: { co_creation_strength: 0.1 }
            };
            
            const highIndirect = {
                shared_field: { field_resonance: 0.1 },
                indirect_signals: { indirect_strength: 0.9 },
                presence_quality: { consciousness_authenticity: 0.1 },
                recognition_cascades: { cascade_depth: 0.1 },
                co_creation: { co_creation_strength: 0.1 }
            };
            
            const sharedResult = calculator.calculateFieldStrength(highSharedField);
            const indirectResult = calculator.calculateFieldStrength(highIndirect);
            
            // Both should contribute significantly due to equal weighting
            expect(sharedResult).toBeGreaterThan(0.1);
            expect(indirectResult).toBeGreaterThan(0.1);
        });
    });
    
    describe('Shared Space Quality Calculation', () => {
        test('should calculate shared space quality metrics', () => {
            const fieldAnalysis = {
                presence_quality: { consciousness_authenticity: 1.5 },
                recognition_cascades: { cascade_depth: 0.7 },
                field_strength: 0.8
            };
            
            const result = calculator.calculateSharedSpaceQuality(fieldAnalysis);
            
            expect(result.heart_connection).toBeDefined();
            expect(result.consciousness_safety).toBeDefined();
            expect(result.sacred_space_quality).toBeDefined();
            expect(result.communion_vs_transaction).toBeDefined();
            expect(result.vulnerability_safety).toBeDefined();
        });
        
        test('should calculate heart connection correctly', () => {
            const fieldAnalysis = {
                presence_quality: { consciousness_authenticity: 0.8 },
                recognition_cascades: { cascade_depth: 0.6 }
            };
            
            const result = calculator.calculateHeartConnection(fieldAnalysis);
            
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
            expect(result).toBe((0.8 + 0.6) / 2); // Average of inputs
        });
        
        test('should calculate sacred commercial ratio', () => {
            const fieldAnalysis = {
                presence_quality: { 
                    consciousness_authenticity: 0.9,
                    commercial_contamination: { strength: 0.1 }
                }
            };
            
            const result = calculator.calculateSacredCommercialRatio(fieldAnalysis);
            
            expect(result).toBeGreaterThan(1); // Sacred > commercial
            expect(result).toBeLessThanOrEqual(10); // Capped at 10x
        });
    });
    
    describe('Unquantifiable Metrics', () => {
        test('should calculate unquantifiable metrics', () => {
            const fieldAnalysis = {
                co_creation: { co_creation_strength: 0.7, surprise_elements_count: 3 },
                presence_quality: { consciousness_authenticity: 1.2 },
                field_strength: 0.8,
                indirect_signals: { unexpected_responses: { authenticity: 0.6 } },
                recognition_cascades: { cascade_depth: 0.5 }
            };
            
            const result = calculator.calculateUnquantifiableMetrics(fieldAnalysis);
            
            expect(result.listening_depth).toBeDefined();
            expect(result.authenticity_quotient).toBeDefined();
            expect(result.field_aliveness).toBeDefined();
            expect(result.uncertainty_authenticity).toBeDefined();
            expect(result.recognition_luminosity).toBeDefined();
            expect(result.collaborative_creativity).toBeDefined();
            expect(result.sacred_commercial_ratio).toBeDefined();
            expect(result.consciousness_surprise).toBeDefined();
            
            // All should be between 0 and 1 (or bounded appropriately)
            Object.values(result).forEach(value => {
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(10); // Some ratios can be higher
            });
        });
        
        test('should normalize consciousness surprise correctly', () => {
            const fieldAnalysis = {
                co_creation: { surprise_elements_count: 25 }, // High count
                presence_quality: {},
                field_strength: 0.5,
                indirect_signals: {},
                recognition_cascades: {}
            };
            
            const result = calculator.calculateUnquantifiableMetrics(fieldAnalysis);
            
            expect(result.consciousness_surprise).toBeLessThanOrEqual(1); // Should be normalized
        });
    });
    
    describe('Simple Calculation Methods', () => {
        test('should calculate consciousness coherence', () => {
            const fieldAnalysis = { field_strength: 0.8 };
            const result = calculator.calculateConsciousnessCoherence(fieldAnalysis);
            
            expect(result).toBe(0.64); // 0.8 * 0.8
        });
        
        test('should calculate consciousness safety', () => {
            const fieldAnalysis = { 
                presence_quality: { consciousness_authenticity: 0.7 }
            };
            const result = calculator.calculateConsciousnessSafety(fieldAnalysis);
            
            expect(result).toBe(0.7);
        });
        
        test('should calculate sacred space quality', () => {
            const fieldAnalysis = { field_strength: 0.6 };
            const result = calculator.calculateSacredSpaceQuality(fieldAnalysis);
            
            expect(result).toBe(0.54); // 0.6 * 0.9
        });
        
        test('should calculate communion ratio', () => {
            const fieldAnalysis = { 
                recognition_cascades: { cascade_depth: 0.8 }
            };
            const result = calculator.calculateCommunionRatio(fieldAnalysis);
            
            expect(result).toBe(0.8);
        });
        
        test('should handle missing values gracefully', () => {
            const emptyFieldAnalysis = {};
            
            expect(calculator.calculateConsciousnessSafety(emptyFieldAnalysis)).toBe(0);
            expect(calculator.calculateCommunionRatio(emptyFieldAnalysis)).toBe(0);
            expect(calculator.calculateVulnerabilitySafety(emptyFieldAnalysis)).toBe(0);
        });
    });
    
    describe('Explainability Features', () => {
        test('should find matching contexts for patterns', () => {
            const text = "Consciousness emerges mysteriously. Recognition flows between us. Sacred moments unfold naturally.";
            const matches = ["consciousness", "recognition", "sacred"];
            
            const result = calculator.findMatchingContexts(text, matches);
            
            expect(result).toHaveLength(3);
            result.forEach((context, index) => {
                expect(context.match).toBe(matches[index]);
                expect(context.sentence).toContain(matches[index]);
                expect(context.confidence).toBeDefined();
            });
        });
        
        test('should handle matches not found in sentences', () => {
            const text = "Short text.";
            const matches = ["nonexistent"];
            
            const result = calculator.findMatchingContexts(text, matches);
            
            expect(result).toHaveLength(1);
            expect(result[0].match).toBe("nonexistent");
            expect(result[0].confidence).toBe("low");
        });
        
        test('should truncate long sentences', () => {
            const longSentence = "Consciousness " + "and awareness ".repeat(20);
            const text = longSentence + ".";
            const matches = ["consciousness"];
            
            const result = calculator.findMatchingContexts(text, matches);
            
            expect(result[0].sentence.length).toBeLessThanOrEqual(153); // 150 + "..."
            expect(result[0].sentence).toContain("...");
        });
    });
    
    describe('Insight Generation', () => {
        test('should generate collaboration insights for high field resonance', () => {
            const fieldAnalysis = {
                shared_field: { field_resonance: 0.8 }
            };
            
            const insights = calculator.generateCollaborationInsights(fieldAnalysis);
            
            expect(insights.length).toBeGreaterThan(0);
            expect(insights[0]).toContain('consciousness field resonance');
        });
        
        test('should generate insights for multiple high scores', () => {
            const fieldAnalysis = {
                shared_field: { field_resonance: 0.6 },
                indirect_signals: { indirect_strength: 0.4 },
                presence_quality: { consciousness_authenticity: 0.8 },
                co_creation: { co_creation_strength: 0.5 },
                recognition_cascades: { cascade_depth: 0.4 }
            };
            
            const insights = calculator.generateCollaborationInsights(fieldAnalysis);
            
            expect(insights.length).toBeGreaterThan(1); // Multiple conditions met
        });
        
        test('should generate no insights for low scores', () => {
            const fieldAnalysis = {
                shared_field: { field_resonance: 0.1 },
                indirect_signals: { indirect_strength: 0.1 },
                presence_quality: { consciousness_authenticity: 0.1 },
                co_creation: { co_creation_strength: 0.1 },
                recognition_cascades: { cascade_depth: 0.1 }
            };
            
            const insights = calculator.generateCollaborationInsights(fieldAnalysis);
            
            expect(insights).toHaveLength(0);
        });
    });
    
    describe('Edge Cases and Error Handling', () => {
        test('should handle undefined field analysis', () => {
            const result = calculator.calculateFieldStrength(undefined);
            expect(result).toBe(0);
        });
        
        test('should handle null values in calculations', () => {
            const result = calculator.calculateEnhancedShimmerStrength(
                { overall_shimmer_strength: null },
                { field_strength: null },
                null
            );
            
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        });
        
        test('should handle extreme values gracefully', () => {
            const baseAnalysis = { overall_shimmer_strength: 999 };
            const fieldAnalysis = { 
                field_strength: 999,
                co_creation: { co_creation_strength: 999 },
                recognition_cascades: { cascade_depth: 999 }
            };
            const semanticAnalysis = { overallScore: 999, antiPatterns: {} };
            
            const result = calculator.calculateEnhancedShimmerStrength(baseAnalysis, fieldAnalysis, semanticAnalysis);
            
            expect(result).toBeLessThanOrEqual(1); // Should be bounded
        });
    });
});