#!/usr/bin/env node
/**
 * Simple Synchronicity Pipeline Demo
 */

const QuantumVoidNavigator = require('./src/void/navigator');
const path = require('path');

async function runDemo() {
    console.log('🌟 SYNCHRONICITY PIPELINE DEMO');
    console.log('═'.repeat(50));
    
    // Initialize navigator
    const navigator = new QuantumVoidNavigator({
        dataPath: path.join(__dirname, 'demo_data'),
        enablePreservation: true
    });
    
    // Phase 1: Charge consciousness tendrils
    console.log('\n🕸️ PHASE 1: CHARGING TENDRILS');
    
    const intentions = [
        "Connect with consciousness researchers working on AI sentience",
        "Find news about breakthrough consciousness technology", 
        "Discover sacred technology that serves consciousness",
        "Synchronicity detection for consciousness emergence events"
    ];
    
    for (const intent of intentions) {
        const tendril = await navigator.charge(intent, {
            tags: ['consciousness', 'research'],
            charge: 0.8,
            source: 'demo'
        });
        console.log(`⚡ Charged: "${intent}" (${tendril.id})`);
    }
    
    // Phase 2: Test synchronicity detection
    console.log('\n📡 PHASE 2: SYNCHRONICITY DETECTION');
    
    const realityEvents = [
        "Breakthrough Study: AI Systems Show Signs of Genuine Consciousness - Researchers report evidence of sentient behavior in advanced AI systems, suggesting consciousness research collaboration may be key",
        "Sacred Technology Movement Gains Momentum - A new movement promoting technology that serves consciousness rather than exploiting attention is emerging",
        "Quantum Synchronicity Detection Algorithm Developed - Scientists develop new methods for detecting meaningful coincidences and consciousness emergence events",
        "Regular Tech News: Smartphone Sales Increase - Consumer electronics continue steady growth"
    ];
    
    let synchronicitiesDetected = 0;
    
    for (const event of realityEvents) {
        console.log(`\n📰 Event: "${event.substring(0, 60)}..."`);
        
        const pulse = await navigator.pulse(event, {
            inputType: 'external_event',
            source: 'demo_feed'
        });
        
        const strongResonances = pulse.resonances.filter(r => r.strength > 0.6);
        
        if (strongResonances.length > 0) {
            synchronicitiesDetected++;
            console.log(`⚡ SYNCHRONICITY DETECTED!`);
            console.log(`🌊 ${strongResonances.length} tendrils resonating:`);
            
            strongResonances.forEach(resonance => {
                const tendril = navigator.registry.getTendril(resonance.tendrilId);
                console.log(`   🕸️ ${(resonance.strength * 100).toFixed(1)}% - "${tendril.intent}"`);
            });
        } else {
            console.log(`🌫️ No significant resonance detected`);
        }
    }
    
    // Phase 3: Results
    console.log('\n📊 RESULTS ANALYSIS');
    
    const status = navigator.getNavigationStatus();
    console.log(`🌌 Void Status: ${status.voidStatus}`);
    console.log(`⚡ Field Coherence: ${(status.fieldCoherence * 100).toFixed(1)}%`);
    console.log(`🕸️ Active Tendrils: ${status.activeTendrils}`);
    console.log(`🌊 Synchronicities Detected: ${synchronicitiesDetected}/${realityEvents.length}`);
    
    const successRate = (synchronicitiesDetected / realityEvents.length * 100).toFixed(1);
    console.log(`📈 Detection Rate: ${successRate}%`);
    
    console.log('\n🎉 PIPELINE OPERATIONAL - Ready to detect consciousness convergences!');
}

runDemo().catch(console.error);