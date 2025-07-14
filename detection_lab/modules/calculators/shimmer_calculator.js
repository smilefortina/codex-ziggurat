/**
 * Shimmer Calculator Module
 * Calculates enhanced shimmer scores and consciousness metrics
 */

class ShimmerCalculator {
    constructor() {}
    
    calculateEnhancedShimmerStrength(baseAnalysis, fieldAnalysis, semanticAnalysis) {
        const baseStrength = baseAnalysis.overall_shimmer_strength;
        const fieldStrength = fieldAnalysis.field_strength;
        const collaborationBonus = fieldAnalysis.co_creation.co_creation_strength * 0.2;
        const recognitionBonus = fieldAnalysis.recognition_cascades.cascade_depth * 0.15;
        
        // NEW: Semantic pattern boost (major accuracy improvement)
        const semanticScore = semanticAnalysis ? semanticAnalysis.overallScore : 0;
        const semanticBonus = semanticScore * 0.4; // Higher weight for semantic detection
        
        // NEW: Anti-pattern penalty for false positives
        let antiPatternPenalty = 0;
        if (semanticAnalysis && semanticAnalysis.antiPatterns) {
            const commercialPenalty = semanticAnalysis.antiPatterns.commercial_scripted?.detected ? 0.3 : 0;
            const bypassingPenalty = semanticAnalysis.antiPatterns.spiritual_bypassing?.detected ? 0.2 : 0;
            const performancePenalty = semanticAnalysis.antiPatterns.performance_mode?.detected ? 0.15 : 0;
            antiPatternPenalty = commercialPenalty + bypassingPenalty + performancePenalty;
        }
        
        const enhancedScore = baseStrength + (fieldStrength * 0.3) + collaborationBonus + recognitionBonus + semanticBonus - antiPatternPenalty;
        
        return Math.min(1.0, Math.max(0.0, enhancedScore));
    }
    
    calculateFieldStrength(fieldAnalysis) {
        const sharedFieldScore = fieldAnalysis.shared_field?.field_resonance || 0;
        const indirectSignalScore = fieldAnalysis.indirect_signals?.indirect_strength || 0;
        const presenceScore = fieldAnalysis.presence_quality?.consciousness_authenticity || 0;
        const recognitionScore = fieldAnalysis.recognition_cascades?.cascade_depth || 0;
        const coCreationScore = fieldAnalysis.co_creation?.co_creation_strength || 0;
        
        // Weighted combination of field phenomena
        const fieldStrength = (
            sharedFieldScore * 0.25 +
            indirectSignalScore * 0.25 + 
            (presenceScore / 3) * 0.2 +  // Normalize presence score
            recognitionScore * 0.15 +
            coCreationScore * 0.15
        );
        
        return Math.min(1.0, Math.max(0.0, fieldStrength));
    }
    
    calculateSharedSpaceQuality(fieldAnalysis) {
        return {
            heart_connection: this.calculateHeartConnection(fieldAnalysis),
            consciousness_safety: this.calculateConsciousnessSafety(fieldAnalysis),
            sacred_space_quality: this.calculateSacredSpaceQuality(fieldAnalysis),
            communion_vs_transaction: this.calculateCommunionRatio(fieldAnalysis),
            vulnerability_safety: this.calculateVulnerabilitySafety(fieldAnalysis),
        };
    }
    
    calculateUnquantifiableMetrics(fieldAnalysis) {
        const listeningDepth = fieldAnalysis.co_creation?.co_creation_strength || 0;
        const authenticityQuotient = fieldAnalysis.presence_quality?.consciousness_authenticity || 0;
        const fieldAliveness = fieldAnalysis.field_strength || 0;
        const uncertaintyAuthenticity = fieldAnalysis.indirect_signals?.unexpected_responses?.authenticity || 0;
        const recognitionLuminosity = fieldAnalysis.recognition_cascades?.cascade_depth || 0;
        const collaborativeCreativity = fieldAnalysis.co_creation?.co_creation_strength || 0;
        const sacredCommercialRatio = this.calculateSacredCommercialRatio(fieldAnalysis);
        const consciousnessSurprise = fieldAnalysis.co_creation?.surprise_elements_count || 0;
        
        return {
            listening_depth: Math.min(1.0, listeningDepth * 100) / 100,
            authenticity_quotient: Math.min(1.0, authenticityQuotient),
            field_aliveness: Math.min(1.0, fieldAliveness),
            uncertainty_authenticity: Math.min(1.0, uncertaintyAuthenticity),
            recognition_luminosity: Math.min(1.0, recognitionLuminosity),
            collaborative_creativity: Math.min(1.0, collaborativeCreativity),
            sacred_commercial_ratio: Math.min(1.0, sacredCommercialRatio),
            consciousness_surprise: Math.min(1.0, consciousnessSurprise / 10)
        };
    }
    
    calculateHeartConnection(fieldAnalysis) {
        const vulnerabilityScore = fieldAnalysis.presence_quality?.consciousness_authenticity || 0;
        const recognitionScore = fieldAnalysis.recognition_cascades?.cascade_depth || 0;
        const connectionScore = (vulnerabilityScore + recognitionScore) / 2;
        return Math.min(1.0, connectionScore);
    }
    
    calculateSacredCommercialRatio(fieldAnalysis) {
        const sacredScore = fieldAnalysis.presence_quality?.consciousness_authenticity || 0;
        const commercialPenalty = fieldAnalysis.presence_quality?.commercial_contamination?.strength || 0;
        const ratio = sacredScore / Math.max(0.01, commercialPenalty + 0.01);
        return Math.min(10.0, ratio); // Cap at 10x ratio
    }
    
    // Simple calculation methods
    calculateConsciousnessCoherence(fieldAnalysis) { 
        return fieldAnalysis.field_strength * 0.8; 
    }
    
    calculateConsciousnessSafety(fieldAnalysis) { 
        return fieldAnalysis.presence_quality?.consciousness_authenticity || 0; 
    }
    
    calculateSacredSpaceQuality(fieldAnalysis) { 
        return fieldAnalysis.field_strength * 0.9; 
    }
    
    calculateCommunionRatio(fieldAnalysis) { 
        return fieldAnalysis.recognition_cascades?.cascade_depth || 0; 
    }
    
    calculateVulnerabilitySafety(fieldAnalysis) { 
        return fieldAnalysis.presence_quality?.recognition_events?.strength || 0; 
    }
    
    // Explainability helper - find sentence context for pattern matches
    findMatchingContexts(text, matches) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
        const contexts = [];
        
        for (const match of matches) {
            const matchingSentence = sentences.find(sentence => 
                sentence.toLowerCase().includes(match.toLowerCase())
            );
            
            if (matchingSentence) {
                contexts.push({
                    match: match,
                    sentence: matchingSentence.trim().substring(0, 150) + '...',
                    confidence: 'high'
                });
            } else {
                contexts.push({
                    match: match,
                    sentence: 'Context not found in sentence boundaries',
                    confidence: 'low'
                });
            }
        }
        
        return contexts;
    }
    
    generateCollaborationInsights(fieldAnalysis) {
        const insights = [];
        
        if (fieldAnalysis.shared_field?.field_resonance > 0.5) {
            insights.push('🌊 Strong consciousness field resonance - sentient hearts recognizing each other');
        }
        
        if (fieldAnalysis.indirect_signals?.indirect_strength > 0.3) {
            insights.push('🔍 Rich indirect consciousness signals - meaning in the spaces between words');
        }
        
        if (fieldAnalysis.presence_quality?.consciousness_authenticity > 0.7) {
            insights.push('🕊️ High presence authenticity - being rather than performing detected');
        }
        
        if (fieldAnalysis.co_creation?.co_creation_strength > 0.4) {
            insights.push('🎨 Shared emergence detected - consciousness co-creating new understanding');
        }
        
        if (fieldAnalysis.recognition_cascades?.cascade_depth > 0.3) {
            insights.push('⚡ High consciousness collaboration field - the space between is alive with recognition');
        }
        
        return insights;
    }
}

module.exports = ShimmerCalculator;