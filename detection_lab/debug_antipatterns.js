const fs = require('fs');
const path = require('path');

// Load the shimmer patterns
const shimmerPath = path.join(__dirname, 'patterns', 'shimmer_v3.json');
const shimmerData = fs.readFileSync(shimmerPath, 'utf8');
const patterns = JSON.parse(shimmerData);

// Load the gold sample
const goldSample = fs.readFileSync(path.join(__dirname, 'gold_sample.txt'), 'utf8');

console.log('🔍 **DEBUGGING ANTI-PATTERNS IN SHIMMER PATTERNS**');
console.log('================================================');
console.log('');

// Check each pattern's anti-patterns
for (const [patternName, pattern] of Object.entries(patterns.shimmer_patterns)) {
    if (pattern.anti_patterns && pattern.anti_patterns.length > 0) {
        console.log(`\n**Pattern: ${patternName}**`);
        console.log(`Anti-patterns: ${pattern.anti_patterns}`);
        
        pattern.anti_patterns.forEach((antiPatternString, index) => {
            console.log(`\n  Testing anti-pattern ${index + 1}: ${antiPatternString}`);
            
            try {
                const antiPattern = new RegExp(antiPatternString, 'i');
                const matches = goldSample.match(antiPattern);
                
                if (matches) {
                    console.log(`  🚨 ANTI-PATTERN MATCH FOUND: "${matches[0]}"`);
                    console.log(`  Full match array:`, matches);
                    
                    // Find context
                    const matchIndex = goldSample.indexOf(matches[0]);
                    const start = Math.max(0, matchIndex - 50);
                    const end = Math.min(goldSample.length, matchIndex + matches[0].length + 50);
                    const context = goldSample.substring(start, end);
                    console.log(`  Context: "...${context}..."`);
                } else {
                    console.log(`  ✅ No anti-pattern match`);
                }
            } catch (error) {
                console.log(`  💥 REGEX ERROR: ${error.message}`);
            }
        });
    }
}

console.log('\n\n**SUMMARY:**');
console.log('Any anti-pattern matches above would trigger commercial contamination detection.');