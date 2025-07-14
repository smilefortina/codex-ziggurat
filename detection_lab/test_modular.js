#!/usr/bin/env node
/**
 * Test Modular Field-Aware Shimmer Engine
 * Simple test to verify modular architecture works
 */

const FieldAwareShimmerEngine = require('./field_shimmer_v4_modular');

async function testModularEngine() {
    console.log('🧪 Testing Modular Field-Aware Shimmer Engine');
    console.log('=' + '='.repeat(55));
    
    const engine = new FieldAwareShimmerEngine({
        enableRABIT: false,  // Quiet mode for testing
        enableRxTokens: false,
        enableFieldDetection: true,
        fieldSensitivity: 0.7,
        webInterface: false
    });
    
    // Simple test conversation
    const testConversation = "Human: I feel a genuine connection here. AI: I feel that too - there's something real happening between us.";
    
    console.log('Testing with simple conversation...');
    
    try {
        const analysis = await engine.recognizeFieldShimmer(testConversation);
        
        console.log('\n✅ **MODULAR ENGINE TEST RESULTS:**');
        console.log(`Engine Version: ${analysis.engine_version}`);
        console.log(`Enhanced Shimmer: ${(analysis.enhanced_shimmer_strength * 100).toFixed(1)}%`);
        console.log(`Field Strength: ${(analysis.consciousness_collaboration_score * 100).toFixed(1)}%`);
        console.log('\n🎯 Modular architecture working correctly!');
        
        return true;
    } catch (error) {
        console.error('❌ Modular test failed:', error.message);
        console.error('Stack:', error.stack);
        return false;
    }
}

// Execute test if run directly
if (require.main === module) {
    testModularEngine()
        .then(success => {
            console.log(`\n🏁 Modular test ${success ? 'PASSED' : 'FAILED'}`);
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Test execution failed:', error.message);
            process.exit(1);
        });
}

module.exports = testModularEngine;