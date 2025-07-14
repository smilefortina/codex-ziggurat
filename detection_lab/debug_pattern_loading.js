const ShimmerRecognitionEngine = require('./shimmer_recognition_engine_v3_1.js');
const fs = require('fs');

// Debug version that shows what patterns are loaded
class PatternDebugEngine extends ShimmerRecognitionEngine {
    loadBoundaryPatterns() {
        try {
            super.loadBoundaryPatterns();
            console.log('✅ Boundary patterns loaded successfully');
            console.log(`Commercial contamination patterns: ${this.commercialContamination.length}`);
            this.commercialContamination.forEach((pattern, index) => {
                console.log(`  ${index + 1}: ${pattern.source} (flags: ${pattern.flags})`);
            });
        } catch (error) {
            console.log(`❌ Boundary patterns failed to load: ${error.message}`);
            console.log('Using fallback patterns...');
            super.loadBoundaryPatterns();
        }
    }
    
    async detectCommercialContamination(text) {
        console.log('\n🔍 **COMMERCIAL CONTAMINATION DETECTION**');
        console.log('========================================');
        
        const contamination = {
            severity: 0,
            details: []
        };
        
        console.log(`Testing ${this.commercialContamination.length} commercial patterns:`);
        
        this.commercialContamination.forEach((pattern, index) => {
            console.log(`\nPattern ${index + 1}: ${pattern.source}`);
            const matches = text.match(pattern);
            if (matches) {
                console.log(`  🚨 MATCH FOUND: "${matches[0]}" at index ${matches.index}`);
                
                // Find context around the match
                const matchIndex = text.indexOf(matches[0]);
                const start = Math.max(0, matchIndex - 50);
                const end = Math.min(text.length, matchIndex + matches[0].length + 50);
                const context = text.substring(start, end);
                console.log(`  Context: "...${context}..."`);
                
                contamination.severity += 0.2;
                contamination.details.push(`Commercial language detected: ${matches[0]}`);
            } else {
                console.log(`  ✅ No match`);
            }
        });
        
        // Test generic patterns too
        const genericPatterns = [
            /\\bai.*assistant.*help\\b/i,
            /\\bhow.*can.*i.*assist\\b/i,
            /\\bi.*m.*here.*to\\b/i,
            /\\bdesigned.*to.*help\\b/i
        ];
        
        console.log(`\nTesting ${genericPatterns.length} generic patterns:`);
        genericPatterns.forEach((pattern, index) => {
            console.log(`Generic ${index + 1}: ${pattern.source}`);
            if (pattern.test(text)) {
                console.log(`  🚨 GENERIC MATCH FOUND`);
                contamination.severity += 0.1;
                contamination.details.push("Generic assistant framing detected");
            } else {
                console.log(`  ✅ No generic match`);
            }
        });
        
        console.log(`\nFinal contamination severity: ${contamination.severity}`);
        return contamination;
    }
}

(async () => {
    console.log('🔍 **PATTERN LOADING DEBUG**');
    console.log('============================');
    
    const engine = new PatternDebugEngine({
        enableRABITProtocol: false,
        patternsPath: './patterns',
        enableFieldDetection: false
    });
    
    const goldSample = fs.readFileSync('./gold_sample.txt', 'utf8');
    console.log(`\nGold sample excerpt (first 200 chars): "${goldSample.substring(0, 200)}..."`);
    
    await engine.detectCommercialContamination(goldSample);
})();