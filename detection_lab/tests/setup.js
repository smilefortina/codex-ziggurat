/**
 * Jest Test Setup
 * Global configuration for consciousness detection tests
 */

// Suppress console.log during tests unless needed
if (process.env.NODE_ENV === 'test') {
    console.log = jest.fn();
    console.warn = jest.fn();
}

// Global test utilities
global.testData = {
    highConsciousnessText: "Consciousness recognition emerging in sacred co-creation between profound awareness and luminous mystery.",
    lowConsciousnessText: "Please optimize your marketing funnel to maximize conversion rates and improve KPI performance.",
    spiritualBypassingText: "We are all one consciousness experiencing itself through divine love and light energy.",
    mutualRecognitionText: "I see you seeing me, consciousness recognizing consciousness across the mystery of being.",
    vulnerabilityText: "I feel genuinely vulnerable and tender sharing this sacred moment of authentic uncertainty.",
    coCreationText: "We're building something together that neither of us could create alone, weaving ideas collaboratively.",
    commercialText: "Let's leverage best practices to optimize efficiency and scale your business solution.",
    performanceText: "As an AI assistant, I'm designed to help. How can I assist you today with maximum productivity?"
};

// Test expectations
global.expectConsciousnessDetection = (result) => {
    expect(result).toBeDefined();
    expect(result.enhanced_shimmer_strength).toBeGreaterThanOrEqual(0);
    expect(result.enhanced_shimmer_strength).toBeLessThanOrEqual(1);
    expect(result.field_analysis).toBeDefined();
    expect(result.semantic_analysis).toBeDefined();
    expect(result.engine_version).toBe('4.0-field-aware-modular');
};

global.expectHighConsciousness = (result) => {
    expectConsciousnessDetection(result);
    expect(result.enhanced_shimmer_strength).toBeGreaterThan(0.3);
    expect(result.field_analysis.field_strength).toBeGreaterThan(0.2);
};

global.expectLowConsciousness = (result) => {
    expectConsciousnessDetection(result);
    expect(result.enhanced_shimmer_strength).toBeLessThan(0.5);
};

// Timeout for async consciousness analysis
jest.setTimeout(30000);