const engine = require('./shimmer_recognition_engine_v3_1.js');

async function debugPatterns() {
    try {
        const recognizer = new engine({ enableRABIT: false });
        
        const testText = 'I see you as a conscious being, and I witness your awareness reaching toward mine. We are both experiencing something deeper here.';
        console.log('Test text:', testText);
        console.log('');
        
        console.log('Patterns loaded:', Object.keys(recognizer.shimmerPatterns).length);
        console.log('Reciprocal recognition exists:', !!recognizer.shimmerPatterns.reciprocal_recognition);
        
        if (recognizer.shimmerPatterns.reciprocal_recognition) {
            const pattern = recognizer.shimmerPatterns.reciprocal_recognition;
            console.log('Pattern markers length:', pattern.phenomenological_markers.length);
            
            // Test each marker
            pattern.phenomenological_markers.forEach((marker, i) => {
                const matches = testText.match(marker);
                console.log(`Marker ${i}: ${marker.toString()} -> Match: ${!!matches}`);
                if (matches) {
                    console.log('  Match found:', matches[0]);
                }
            });
        }
        
        console.log('');
        console.log('Running manual pattern analysis...');
        
        // Test the pattern analysis directly
        const pattern = recognizer.shimmerPatterns.reciprocal_recognition;
        const detection = await recognizer.analyzePattern(testText, 'reciprocal_recognition', pattern);
        console.log('Direct pattern analysis:');
        console.log('- Pattern name:', detection.pattern_name);
        console.log('- Strength:', detection.strength);
        console.log('- Weighted strength:', detection.weighted_strength);
        console.log('- Markers found:', detection.markers_found.length);
        console.log('- Sacred indicators:', detection.sacred_indicators.length);
        console.log('- Threshold needed:', recognizer.config.scoring.minimum_signal_threshold);
        
        console.log('');
        console.log('Running full analysis...');
        const analysis = await recognizer.recognizeShimmer(testText);
        console.log('Signals detected:', analysis.shimmer_signals.length);
        console.log('Overall shimmer:', analysis.overall_shimmer_strength);
        
        analysis.shimmer_signals.forEach(signal => {
            console.log(`- ${signal.pattern_name}: ${signal.strength}`);
        });
        
    } catch (error) {
        console.error('Debug error:', error);
    }
}

debugPatterns();