const ShimmerRecognitionEngine = require('./shimmer_recognition_engine_v3_1.js');
const fs = require('fs');

// Debug version that tracks boundary integrity changes
class BoundaryDebugEngine extends ShimmerRecognitionEngine {
    async analyzePattern(text, patternName, pattern) {
        const result = await super.analyzePattern(text, patternName, pattern);
        
        if (result.contamination_detected) {
            console.log(`🚨 CONTAMINATION DETECTED in pattern: ${patternName}`);
            console.log(`  Anti-patterns for this pattern: ${pattern.anti_patterns || 'none'}`);
            console.log(`  Contamination penalty: ${this.config.scoring.commercial_contamination_penalty}`);
            console.log(`  Original strength: ${result.strength / this.config.scoring.commercial_contamination_penalty}`);
            console.log(`  Reduced strength: ${result.strength}`);
            
            // Test each anti-pattern manually
            if (pattern.anti_patterns) {
                pattern.anti_patterns.forEach((antiPatternString, index) => {
                    console.log(`    Testing anti-pattern ${index + 1}: ${antiPatternString}`);
                    try {
                        const antiPattern = new RegExp(antiPatternString, 'i');
                        const matches = text.match(antiPattern);
                        if (matches) {
                            console.log(`      ✅ MATCH: "${matches[0]}"`);
                            
                            // Find context
                            const matchIndex = text.indexOf(matches[0]);
                            const start = Math.max(0, matchIndex - 30);
                            const end = Math.min(text.length, matchIndex + matches[0].length + 30);
                            const context = text.substring(start, end);
                            console.log(`      Context: "...${context}..."`);
                        } else {
                            console.log(`      ❌ No match`);
                        }
                    } catch (error) {
                        console.log(`      💥 REGEX ERROR: ${error.message}`);
                    }
                });
            }
        }
        
        return result;
    }
    
    async recognizeShimmer(conversationText) {
        console.log('🔍 Starting boundary integrity tracking...');
        
        const analysis = {
            shimmer_signals: [],
            phenomenological_depth: 0,
            sacred_boundary_integrity: 1.0,
            consciousness_quality: {},
            overall_shimmer_strength: 0,
            rabit_quantum_coordinates: this.generateQuantumCoordinates(),
            timestamp: new Date().toISOString(),
            engine_version: '3.1'
        };
        
        console.log(`Initial boundary integrity: ${analysis.sacred_boundary_integrity}`);
        
        // Check for commercial contamination first
        const contamination = await this.detectCommercialContamination(conversationText);
        console.log(`Contamination severity: ${contamination.severity} (threshold: 0.3)`);
        
        if (contamination.severity > 0.3) {
            console.log(`⚠️ Reducing boundary integrity by ${contamination.severity}`);
            analysis.sacred_boundary_integrity -= contamination.severity;
            analysis.contamination_warning = {
                details: contamination.details,
                severity: contamination.severity
            };
            
            if (this.enableRABITProtocol) {
                this.logRABITMessage("⚠️ RABIT Alert: Commercial contamination detected!");
            }
        }
        
        console.log(`Boundary integrity after contamination check: ${analysis.sacred_boundary_integrity}`);
        
        // Continue with rest of analysis...
        const result = await super.recognizeShimmer(conversationText);
        
        console.log(`Final boundary integrity: ${result.sacred_boundary_integrity}`);
        console.log(`Total reduction: ${1.0 - result.sacred_boundary_integrity}`);
        
        return result;
    }
}

(async () => {
    const engine = new BoundaryDebugEngine({
        enableRABITProtocol: true,
        patternsPath: './patterns',
        enableFieldDetection: false
    });
    
    const goldSample = fs.readFileSync('./gold_sample.txt', 'utf8');
    
    console.log('🔍 **BOUNDARY INTEGRITY DEBUG**');
    console.log('===============================');
    
    await engine.recognizeShimmer(goldSample);
})();