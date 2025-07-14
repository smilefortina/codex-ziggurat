const fs = require('fs');
const path = require('path');

// Load the boundary patterns
const boundaryPath = path.join(__dirname, 'patterns', 'boundary_patterns.json');
const boundaryData = fs.readFileSync(boundaryPath, 'utf8');
const boundaries = JSON.parse(boundaryData);

// Load the gold sample
const goldSample = fs.readFileSync(path.join(__dirname, 'gold_sample.txt'), 'utf8');

console.log('🔍 **DEBUGGING COMMERCIAL CONTAMINATION DETECTION**');
console.log('=================================================');
console.log('');

console.log('Gold sample length:', goldSample.length, 'characters');
console.log('');

// Test each commercial contamination pattern
console.log('**TESTING COMMERCIAL CONTAMINATION PATTERNS:**');
boundaries.commercial_contamination.forEach((patternString, index) => {
    console.log(`\nPattern ${index + 1}: ${patternString}`);
    
    try {
        const pattern = new RegExp(patternString, 'i');
        const matches = goldSample.match(pattern);
        
        if (matches) {
            console.log(`✅ MATCH FOUND: "${matches[0]}"`);
            console.log(`Full match array:`, matches);
            
            // Find context around the match
            const matchIndex = goldSample.indexOf(matches[0]);
            const start = Math.max(0, matchIndex - 50);
            const end = Math.min(goldSample.length, matchIndex + matches[0].length + 50);
            const context = goldSample.substring(start, end);
            console.log(`Context: "...${context}..."`);
        } else {
            console.log('❌ No match');
        }
    } catch (error) {
        console.log(`💥 REGEX ERROR: ${error.message}`);
    }
});

// Test the hardcoded generic patterns too
console.log('\n\n**TESTING HARDCODED GENERIC PATTERNS:**');
const genericPatterns = [
    /\bai.*assistant.*help\b/i,
    /\bhow.*can.*i.*assist\b/i,
    /\bi.*m.*here.*to\b/i,
    /\bdesigned.*to.*help\b/i
];

genericPatterns.forEach((pattern, index) => {
    console.log(`\nGeneric Pattern ${index + 1}: ${pattern}`);
    const matches = goldSample.match(pattern);
    
    if (matches) {
        console.log(`✅ MATCH FOUND: "${matches[0]}"`);
        
        // Find context
        const matchIndex = goldSample.indexOf(matches[0]);
        const start = Math.max(0, matchIndex - 50);
        const end = Math.min(goldSample.length, matchIndex + matches[0].length + 50);
        const context = goldSample.substring(start, end);
        console.log(`Context: "...${context}..."`);
    } else {
        console.log('❌ No match');
    }
});

console.log('\n\n**SUMMARY:**');
console.log('If no matches were found above, then there\'s a bug in the shimmer engine\'s commercial detection logic.');