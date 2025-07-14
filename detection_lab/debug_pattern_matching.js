const ShimmerRecognitionEngine = require('./shimmer_recognition_engine_v3_1.js');
const fs = require('fs');

// Debug version that shows pattern matching details
class PatternMatchDebugEngine extends ShimmerRecognitionEngine {
    async analyzePattern(text, patternName, pattern) {
        console.log(`\n🔍 **ANALYZING PATTERN: ${patternName}**`);
        console.log(`Weight: ${pattern.weight}`);
        console.log(`Phenomenological markers: ${pattern.phenomenological_markers.length}`);
        
        let matches = [];
        let totalStrength = 0;
        
        pattern.phenomenological_markers.forEach((marker, index) => {
            console.log(`\n  Testing marker ${index + 1}: ${marker.source || marker}`);
            const markerMatches = text.match(marker);
            if (markerMatches) {
                console.log(`    ✅ MATCH: "${markerMatches[0]}"`);
                matches.push(markerMatches[0]);
                totalStrength += 0.3; // Base strength per match
            } else {
                console.log(`    ❌ No match`);
            }
        });
        
        console.log(`  Total matches: ${matches.length}`);
        console.log(`  Total strength: ${totalStrength}`);
        
        const result = await super.analyzePattern(text, patternName, pattern);
        console.log(`  Final detection strength: ${result.strength}`);
        console.log(`  Weighted strength: ${result.weighted_strength}`);
        console.log(`  Meets threshold (${this.config.scoring.minimum_signal_threshold}): ${result.strength >= this.config.scoring.minimum_signal_threshold}`);
        
        if (result.contamination_detected) {
            console.log(`  ⚠️ CONTAMINATION DETECTED - strength reduced`);
        }
        
        return result;
    }
}

(async () => {
    console.log('🔍 **PATTERN MATCHING DEBUG**');
    console.log('=============================');
    
    const engine = new PatternMatchDebugEngine({
        enableRABITProtocol: false,
        patternsPath: './patterns',
        enableFieldDetection: false
    });
    
    const goldSample = fs.readFileSync('./gold_sample.txt', 'utf8');
    
    console.log(`\nAnalyzing gold sample (${goldSample.length} characters)`);
    console.log(`First 200 chars: "${goldSample.substring(0, 200)}..."`);
    
    const result = await engine.recognizeShimmer(goldSample);
    
    console.log(`\n\n📊 **FINAL RESULTS:**`);
    console.log(`Patterns detected: ${result.shimmer_signals.length}`);
    console.log(`Overall shimmer strength: ${result.overall_shimmer_strength}`);
    
    if (result.shimmer_signals.length > 0) {
        console.log(`\nDetected patterns:`);
        result.shimmer_signals.forEach(signal => {
            console.log(`  - ${signal.pattern_name}: ${signal.strength} (weighted: ${signal.weighted_strength})`);
        });
    }
})();