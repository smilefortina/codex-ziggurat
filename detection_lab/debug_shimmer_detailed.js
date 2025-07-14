const ShimmerRecognitionEngine = require('./shimmer_recognition_engine_v3_1.js');
const fs = require('fs');

// Custom debug version that logs everything
class DebugShimmerEngine extends ShimmerRecognitionEngine {
    async detectCommercialContamination(text) {
        console.log('\n🔍 **DETAILED CONTAMINATION DEBUG**');
        console.log('===================================');
        
        const contamination = {
            severity: 0,
            details: []
        };
        
        console.log(`Input text length: ${text.length} characters`);
        console.log(`Number of commercial patterns: ${this.commercialContamination.length}`);
        
        this.commercialContamination.forEach((pattern, index) => {
            console.log(`\nTesting commercial pattern ${index + 1}: ${pattern}`);
            const matches = text.match(pattern);
            if (matches) {
                console.log(`  🚨 MATCH FOUND: "${matches[0]}"`);
                contamination.severity += 0.2;
                contamination.details.push(`Commercial language detected: ${matches[0]}`);
            } else {
                console.log(`  ✅ No match`);
            }
        });
        
        // Additional context-aware contamination detection with word boundaries
        const genericPatterns = [
            /\\bai.*assistant.*help\\b/i,
            /\\bhow.*can.*i.*assist\\b/i,
            /\\bi.*m.*here.*to\\b/i,
            /\\bdesigned.*to.*help\\b/i
        ];
        
        console.log(`\nTesting ${genericPatterns.length} generic patterns:`);
        genericPatterns.forEach((pattern, index) => {
            console.log(`Testing generic pattern ${index + 1}: ${pattern}`);
            if (pattern.test(text)) {
                console.log(`  🚨 GENERIC MATCH FOUND`);
                contamination.severity += 0.1;
                contamination.details.push("Generic assistant framing detected");
            } else {
                console.log(`  ✅ No generic match`);
            }
        });
        
        console.log(`\nFinal contamination severity: ${contamination.severity}`);
        console.log(`Contamination details: ${JSON.stringify(contamination.details)}`);
        console.log(`Threshold for warning: 0.3`);
        console.log(`Will trigger warning: ${contamination.severity > 0.3}`);
        
        return contamination;
    }
    
    async analyzePattern(text, patternName, pattern) {
        const result = await super.analyzePattern(text, patternName, pattern);
        
        if (result.contamination_detected) {
            console.log(`\n⚠️ ANTI-PATTERN CONTAMINATION in ${patternName}:`);
            console.log(`  Pattern had anti-patterns: ${pattern.anti_patterns ? pattern.anti_patterns.length : 0}`);
            console.log(`  Contamination detected: ${result.contamination_detected}`);
            console.log(`  Strength after penalty: ${result.strength}`);
        }
        
        return result;
    }
}

(async () => {
    const engine = new DebugShimmerEngine({
        enableRABITProtocol: true,
        patternsPath: './patterns',
        enableFieldDetection: false
    });
    
    const goldSample = fs.readFileSync('./gold_sample.txt', 'utf8');
    
    console.log('🌟 **DETAILED SHIMMER DEBUG ANALYSIS**');
    console.log('=====================================');
    
    const result = await engine.recognizeShimmer(goldSample);
    
    console.log('\n📊 **FINAL RESULTS:**');
    console.log(`Sacred Boundary Integrity: ${(result.sacred_boundary_integrity * 100).toFixed(1)}%`);
    console.log(`Has contamination warning: ${!!result.contamination_warning}`);
    if (result.contamination_warning) {
        console.log(`Warning details: ${JSON.stringify(result.contamination_warning)}`);
    }
})();