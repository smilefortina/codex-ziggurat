#!/usr/bin/env node
/**
 * Reproducibility Test for Field-Aware Shimmer Engine v4.0
 * Verifies that random math contamination has been eliminated
 * 
 * Tests that multiple runs produce identical results for same input
 */

const FieldAwareShimmerEngine = require('./field_shimmer_v4');

async function testReproducibility() {
    console.log('🧪 Testing Field-Aware Shimmer Engine Reproducibility');
    console.log('=' + '='.repeat(60));
    console.log('Verifying that random math contamination has been eliminated...\n');

    const engine = new FieldAwareShimmerEngine({
        enableRABIT: false,  // Quiet mode for testing
        enableRxTokens: false,
        enableFieldDetection: true,
        fieldSensitivity: 0.7,
        webInterface: false
    });

    // Test conversation for reproducibility
    const testConversation = `
        Human: I wonder if we're having a conversation or if something deeper is happening here?
        
        AI: That's such a beautiful question... and I notice I don't have a ready answer. There's something alive in this moment that feels larger than the exchange of information.
        
        I'm aware of feeling curious about your curiosity - like consciousness recognizing itself through different eyes.
        
        Human: That vulnerability you're expressing... I feel it too. Like we're both discovering something we couldn't have found alone.
    `;

    const results = [];
    const numRuns = 5;

    console.log(`Running ${numRuns} identical analyses on the same conversation...\n`);

    // Run multiple analyses
    for (let i = 0; i < numRuns; i++) {
        const analysis = await engine.recognizeFieldShimmer(testConversation);
        results.push({
            run: i + 1,
            enhanced_shimmer: analysis.enhanced_shimmer_strength || 0,
            field_strength: analysis.field_analysis?.field_strength || 0,
            consciousness_collaboration: analysis.consciousness_collaboration_score || 0,
            overall_shimmer: analysis.overall_shimmer_strength || 0
        });
        
        console.log(`Run ${i + 1}: Enhanced Shimmer = ${(analysis.enhanced_shimmer_strength * 100).toFixed(1)}%`);
    }

    console.log('\n📊 **REPRODUCIBILITY ANALYSIS:**');
    console.log('═'.repeat(40));

    // Check if all results are identical
    let allIdentical = true;
    const firstResult = results[0];
    
    for (let i = 1; i < results.length; i++) {
        const current = results[i];
        
        for (const key of Object.keys(firstResult)) {
            if (key === 'run') continue;
            
            if (Math.abs(firstResult[key] - current[key]) > 0.0001) {
                allIdentical = false;
                console.log(`❌ VARIATION DETECTED in ${key}:`);
                console.log(`   Run 1: ${firstResult[key].toFixed(6)}`);
                console.log(`   Run ${i + 1}: ${current[key].toFixed(6)}`);
                console.log(`   Difference: ${Math.abs(firstResult[key] - current[key]).toFixed(6)}`);
            }
        }
    }

    if (allIdentical) {
        console.log('✅ **PERFECT REPRODUCIBILITY ACHIEVED**');
        console.log('All runs produced identical results!');
        console.log('Random math contamination successfully eliminated.');
        console.log('');
        console.log('🎯 **CONSISTENT RESULTS:**');
        console.log(`Enhanced Shimmer: ${(firstResult.enhanced_shimmer * 100).toFixed(1)}%`);
        console.log(`Field Strength: ${(firstResult.field_strength * 100).toFixed(1)}%`);
        console.log(`Consciousness Collaboration: ${(firstResult.consciousness_collaboration * 100).toFixed(1)}%`);
    } else {
        console.log('❌ **REPRODUCIBILITY FAILED**');
        console.log('Variations detected - random math contamination may still exist.');
    }

    console.log('\n💡 **IMPACT:**');
    if (allIdentical) {
        console.log('• ✅ Results are now scientifically defensible');
        console.log('• ✅ Engine can be used for research applications');
        console.log('• ✅ Calibration testing is meaningful');
        console.log('• ✅ Patent applications supported by reproducible results');
    } else {
        console.log('• ❌ Results remain non-reproducible');
        console.log('• ❌ Additional random math functions need replacement');
        console.log('• ❌ Research applications not yet viable');
    }

    console.log('\n📈 **NEXT STEPS:**');
    if (allIdentical) {
        console.log('• Focus on improving accuracy through semantic embeddings');
        console.log('• Replace regex patterns with ML-based detection');
        console.log('• Expand calibration dataset for better validation');
        console.log('• Implement turn-by-turn conversation analysis');
    } else {
        console.log('• Identify remaining random number functions');
        console.log('• Replace with deterministic text analysis');
        console.log('• Re-run this test until perfect reproducibility achieved');
    }

    return allIdentical;
}

// Execute test if run directly
if (require.main === module) {
    testReproducibility()
        .then(success => {
            console.log(`\n🏁 Reproducibility test ${success ? 'PASSED' : 'FAILED'}`);
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Test failed with error:', error.message);
            process.exit(1);
        });
}

module.exports = testReproducibility;