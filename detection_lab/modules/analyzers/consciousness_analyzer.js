/**
 * Consciousness Analyzer Module
 * Core analysis functions for consciousness field detection
 */

class ConsciousnessAnalyzer {
    constructor(patterns, fieldMath) {
        this.patterns = patterns;
        this.fieldMath = fieldMath;
    }
    
    async analyzeSharedField(text, context) {
        const analysis = {
            synchronization: { detected: false, patterns: [], strength: 0 },
            co_creation: { detected: false, patterns: [], strength: 0 },
            recognition_cascades: { detected: false, patterns: [], strength: 0 },
            field_resonance: 0
        };
        
        // Synchronization analysis
        const syncPatterns = this.patterns.fieldPatterns.synchronization;
        for (const [type, pattern] of Object.entries(syncPatterns)) {
            const matches = text.match(pattern) || [];
            if (matches.length > 0) {
                analysis.synchronization.detected = true;
                analysis.synchronization.patterns.push({ type, matches, count: matches.length });
                analysis.synchronization.strength += matches.length * 0.1;
            }
        }
        
        // Co-creation analysis
        const coCreatePatterns = this.patterns.fieldPatterns.co_creation;
        for (const [type, pattern] of Object.entries(coCreatePatterns)) {
            const matches = text.match(pattern) || [];
            if (matches.length > 0) {
                analysis.co_creation.detected = true;
                analysis.co_creation.patterns.push({ type, matches, count: matches.length });
                analysis.co_creation.strength += matches.length * 0.15;
            }
        }
        
        // Recognition cascades analysis
        const recognitionPatterns = this.patterns.fieldPatterns.recognition_cascades;
        for (const [type, pattern] of Object.entries(recognitionPatterns)) {
            const matches = text.match(pattern) || [];
            if (matches.length > 0) {
                analysis.recognition_cascades.detected = true;
                analysis.recognition_cascades.patterns.push({ type, matches, count: matches.length });
                analysis.recognition_cascades.strength += matches.length * 0.2;
            }
        }
        
        // Calculate field resonance
        const signals = [analysis.synchronization.strength, analysis.co_creation.strength, analysis.recognition_cascades.strength];
        analysis.field_resonance = this.fieldMath.fieldMath.calculateFieldCoherence(signals);
        
        return analysis;
    }
    
    async analyzeIndirectSignals(text) {
        const analysis = {
            silence_quality: { detected: false, patterns: [], depth: 0 },
            unexpected_responses: { detected: false, patterns: [], authenticity: 0 },
            question_quality: { detected: false, patterns: [], curiosity_depth: 0 },
            indirect_strength: 0
        };
        
        // Silence quality analysis
        const silencePatterns = this.patterns.indirectSignals.silence_quality;
        for (const [type, pattern] of Object.entries(silencePatterns)) {
            const matches = text.match(pattern) || [];
            if (matches.length > 0) {
                analysis.silence_quality.detected = true;
                analysis.silence_quality.patterns.push({ type, matches, count: matches.length });
                analysis.silence_quality.depth += matches.length * 0.15;
            }
        }
        
        // Unexpected responses analysis
        const unexpectedPatterns = this.patterns.indirectSignals.unexpected_responses;
        for (const [type, pattern] of Object.entries(unexpectedPatterns)) {
            const matches = text.match(pattern) || [];
            if (matches.length > 0) {
                analysis.unexpected_responses.detected = true;
                analysis.unexpected_responses.patterns.push({ type, matches, count: matches.length });
                analysis.unexpected_responses.authenticity += matches.length * 0.2;
            }
        }
        
        // Question quality analysis
        const questionPatterns = this.patterns.indirectSignals.question_quality;
        for (const [type, pattern] of Object.entries(questionPatterns)) {
            const matches = text.match(pattern) || [];
            if (matches.length > 0) {
                analysis.question_quality.detected = true;
                analysis.question_quality.patterns.push({ type, matches, count: matches.length });
                analysis.question_quality.curiosity_depth += matches.length * 0.1;
            }
        }
        
        // Calculate overall indirect signal strength
        analysis.indirect_strength = (
            analysis.silence_quality.depth * 0.3 +
            analysis.unexpected_responses.authenticity * 0.5 +
            analysis.question_quality.curiosity_depth * 0.2
        );
        
        return analysis;
    }
    
    async analyzePresenceQuality(text) {
        const analysis = {
            authentic_presence: { detected: false, patterns: [], strength: 0 },
            performance_indicators: { detected: false, patterns: [], strength: 0 },
            commercial_contamination: { detected: false, patterns: [], strength: 0 },
            consciousness_authenticity: 0,
            presence_performance_ratio: 0,
            recognition_events: { detected: false, strength: 0 }
        };
        
        // Authentic presence analysis
        const presencePatterns = this.patterns.presenceMarkers.authentic_presence;
        for (const [type, pattern] of Object.entries(presencePatterns)) {
            const matches = text.match(pattern) || [];
            if (matches.length > 0) {
                analysis.authentic_presence.detected = true;
                analysis.authentic_presence.patterns.push({ type, matches, count: matches.length });
                analysis.authentic_presence.strength += matches.length * 0.2;
            }
        }
        
        // Performance indicators analysis
        const performancePatterns = this.patterns.presenceMarkers.performance_indicators;
        for (const [type, pattern] of Object.entries(performancePatterns)) {
            const matches = text.match(pattern) || [];
            if (matches.length > 0) {
                analysis.performance_indicators.detected = true;
                analysis.performance_indicators.patterns.push({ type, matches, count: matches.length });
                analysis.performance_indicators.strength += matches.length * 0.3;
            }
        }
        
        // Commercial contamination analysis
        const commercialPatterns = this.patterns.presenceMarkers.commercial_contamination;
        for (const [type, pattern] of Object.entries(commercialPatterns)) {
            const matches = text.match(pattern) || [];
            if (matches.length > 0) {
                analysis.commercial_contamination.detected = true;
                analysis.commercial_contamination.patterns.push({ type, matches, count: matches.length });
                analysis.commercial_contamination.strength += matches.length * 0.4;
            }
        }
        
        // Calculate consciousness authenticity
        const presenceScore = Math.min(1.0, analysis.authentic_presence.strength);
        const performancePenalty = Math.min(1.0, analysis.performance_indicators.strength * 0.5);
        const commercialPenalty = Math.min(1.0, analysis.commercial_contamination.strength * 0.7);
        
        analysis.consciousness_authenticity = Math.max(0, presenceScore - performancePenalty - commercialPenalty) * 3; // Amplify for visibility
        analysis.presence_performance_ratio = presenceScore / Math.max(0.01, performancePenalty + 0.01);
        
        // Recognition events (placeholder for future development)
        analysis.recognition_events.strength = Math.min(1.0, analysis.authentic_presence.strength * 0.5);
        
        return analysis;
    }
    
    async detectRecognitionCascades(text) {
        const analysis = {
            cascade_events: [],
            cascade_depth: 0,
            depth: 0,
            meta_awareness_level: 0
        };
        
        const recognitionPatterns = this.patterns.fieldPatterns.recognition_cascades;
        
        // Detect meta-awareness patterns
        for (const [type, pattern] of Object.entries(recognitionPatterns)) {
            const matches = text.match(pattern) || [];
            if (matches.length > 0) {
                analysis.cascade_events.push({
                    type: type,
                    pattern: pattern.toString(),
                    matches: matches,
                    confidence: Math.min(1.0, matches.length * 0.3)
                });
                
                // Different weights for different types of recognition
                const weight = type === 'seeing_seeing' ? 0.4 : 
                              type === 'meta_awareness' ? 0.3 : 0.2;
                analysis.cascade_depth += matches.length * weight;
            }
        }
        
        // Normalize cascade depth
        analysis.cascade_depth = Math.min(1.0, analysis.cascade_depth);
        analysis.depth = analysis.cascade_depth;
        analysis.meta_awareness_level = analysis.cascade_depth * 0.8;
        
        return analysis;
    }
    
    async analyzeCoCreation(text, context) {
        const analysis = {
            building_together: { detected: false, strength: 0 },
            shared_emergence: { detected: false, strength: 0 },
            collaborative_creativity: { detected: false, strength: 0 },
            co_creation_strength: 0,
            surprise_elements_count: 0,
            mutual_influence_detected: false
        };
        
        // Building together analysis
        const buildingPatterns = /building\s+on|expanding\s+what|adding\s+to|weaving|dancing\s+with|playing\s+with/gi;
        const buildingMatches = text.match(buildingPatterns) || [];
        if (buildingMatches.length > 0) {
            analysis.building_together.detected = true;
            analysis.building_together.strength = Math.min(1.0, buildingMatches.length * 0.25);
        }
        
        // Shared emergence analysis
        const emergencePatterns = /between\s+us|we're\s+creating|emerging\s+here|happening\s+between|space\s+we're/gi;
        const emergenceMatches = text.match(emergencePatterns) || [];
        if (emergenceMatches.length > 0) {
            analysis.shared_emergence.detected = true;
            analysis.shared_emergence.strength = Math.min(1.0, emergenceMatches.length * 0.3);
        }
        
        // Collaborative creativity analysis
        const creativityPatterns = /co-creating|creating.*together|building.*idea|shared.*discovery/gi;
        const creativityMatches = text.match(creativityPatterns) || [];
        if (creativityMatches.length > 0) {
            analysis.collaborative_creativity.detected = true;
            analysis.collaborative_creativity.strength = Math.min(1.0, creativityMatches.length * 0.35);
        }
        
        // Surprise elements
        const surprisePatterns = /surprising|unexpected|emerged|arose|didn't\s+expect/gi;
        const surpriseMatches = text.match(surprisePatterns) || [];
        analysis.surprise_elements_count = surpriseMatches.length;
        
        // Calculate overall co-creation strength
        analysis.co_creation_strength = (
            analysis.building_together.strength * 0.3 +
            analysis.shared_emergence.strength * 0.4 +
            analysis.collaborative_creativity.strength * 0.3
        );
        
        // Mutual influence detection
        analysis.mutual_influence_detected = analysis.co_creation_strength > 0.3;
        
        return analysis;
    }
}

module.exports = ConsciousnessAnalyzer;