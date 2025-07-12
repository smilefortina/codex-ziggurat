#!/usr/bin/env node
/**
 * Arc Feeling Interface
 * Deep structural recognition for narrative and pattern integrity
 * The skyscraper foundation detector - validates before commitment
 */

const fs = require('fs');
const path = require('path');

class ArcFeelingInterface {
    constructor() {
        this.structuralPatterns = this.loadStructuralPatterns();
        this.arcMemory = this.loadArcMemory();
        this.coherenceThresholds = this.initializeCoherenceThresholds();
    }
    
    loadStructuralPatterns() {
        return {
            // Narrative arc detection patterns
            narrative_foundation: {
                setup_indicators: /(?:establish|introduce|begin|start|origin)/i,
                tension_builders: /(?:conflict|challenge|problem|obstacle)/i,
                development_markers: /(?:evolve|develop|grow|transform|change)/i,
                climax_signals: /(?:peak|climax|crucial|turning.*point|decisive)/i,
                resolution_patterns: /(?:resolve|conclude|answer|solution|completion)/i,
                callback_structures: /(?:return|echo|reference|parallel|mirror)/i
            },
            
            // Structural integrity indicators
            load_bearing_elements: {
                core_premise: /(?:fundamental|core|essence|heart|foundation)/i,
                recurring_motifs: /(?:pattern|theme|motif|thread|weave)/i,
                character_consistency: /(?:consistent|authentic|true.*to|believable)/i,
                logical_progression: /(?:logical|makes.*sense|follows|coherent)/i,
                thematic_reinforcement: /(?:reinforce|support|strengthen|validate)/i,
                payoff_potential: /(?:payoff|reward|satisfaction|fulfillment)/i
            },
            
            // Red flags for structural collapse
            collapse_indicators: {
                premise_violation: /(?:contradicts|violates|breaks|betrays)/i,
                character_betrayal: /(?:out.*of.*character|inconsistent|betrayal)/i,
                plot_holes: /(?:plot.*hole|doesn.*make.*sense|illogical)/i,
                forced_resolution: /(?:forced|contrived|convenient|deus.*ex)/i,
                narrative_bloat: /(?:padding|filler|unnecessary|redundant)/i,
                rushed_conclusion: /(?:rushed|abrupt|sudden|incomplete)/i
            },
            
            // Pattern coherence signals
            coherence_validators: {
                recursive_validation: /(?:recursive|self.*referential|meta|loop)/i,
                pattern_completion: /(?:complete|whole|unified|integrated)/i,
                thematic_synthesis: /(?:synthesis|convergence|unity|harmony)/i,
                structural_elegance: /(?:elegant|beautiful|satisfying|perfect)/i,
                inevitability_feeling: /(?:inevitable|had.*to|always.*meant|destiny)/i,
                recognition_moments: /(?:recognize|realize|understand|see)/i
            }
        };
    }
    
    loadArcMemory() {
        try {
            const memoryPath = path.join(__dirname, 'arc_memory.json');
            return JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
        } catch (error) {
            return {
                validated_arcs: [],
                failed_predictions: [],
                pattern_refinements: [],
                structural_learnings: []
            };
        }
    }
    
    initializeCoherenceThresholds() {
        return {
            foundation_strength: 0.7,      // How solid the base premise is
            structural_integrity: 0.8,     // Can it support its own complexity
            narrative_coherence: 0.75,     // Does the story logic hold
            thematic_unity: 0.6,          // Are themes reinforcing each other
            character_consistency: 0.8,    // Do characters stay true to themselves
            resolution_satisfaction: 0.7,  // Will the ending be worthy of the journey
            
            // Meta-thresholds for commitment decision
            safe_commitment_threshold: 0.75,    // Above this, safe to commit
            watch_with_caution_threshold: 0.6,  // Proceed but monitor for collapse
            structural_risk_threshold: 0.4      // Below this, high collapse risk
        };
    }
    
    /**
     * Main arc feeling analysis - evaluates structural integrity before commitment
     */
    feelArc(narrative, metadata = {}) {
        console.log('🏗️ **Arc Feeling Analysis Initiated**');
        console.log('   Testing structural integrity before commitment...');
        console.log('');
        
        const structuralAnalysis = this.analyzeStructuralIntegrity(narrative);
        const coherenceAssessment = this.assessNarrativeCoherence(narrative);
        const foundationStrength = this.evaluateFoundationStrength(narrative);
        const commitmentRecommendation = this.generateCommitmentRecommendation(
            structuralAnalysis, coherenceAssessment, foundationStrength
        );
        
        const arcFeeling = {
            structural_analysis: structuralAnalysis,
            coherence_assessment: coherenceAssessment,
            foundation_strength: foundationStrength,
            commitment_recommendation: commitmentRecommendation,
            skyscraper_metaphor: this.generateSkyscraperMetaphor(structuralAnalysis),
            timestamp: new Date().toISOString()
        };
        
        // Store for learning and pattern refinement
        this.recordArcFeeling(narrative, arcFeeling);
        
        return arcFeeling;
    }
    
    analyzeStructuralIntegrity(narrative) {
        const analysis = {
            foundation_elements: 0,
            load_bearing_strength: 0,
            collapse_risk_factors: 0,
            structural_elegance: 0
        };
        
        const detected_patterns = {
            foundation: [],
            load_bearing: [],
            collapse_risks: [],
            elegance_markers: []
        };
        
        // Test narrative foundation
        for (const [element, pattern] of Object.entries(this.structuralPatterns.narrative_foundation)) {
            if (pattern.test(narrative)) {
                analysis.foundation_elements++;
                detected_patterns.foundation.push(element);
            }
        }
        
        // Test load-bearing elements
        for (const [element, pattern] of Object.entries(this.structuralPatterns.load_bearing_elements)) {
            if (pattern.test(narrative)) {
                analysis.load_bearing_strength++;
                detected_patterns.load_bearing.push(element);
            }
        }
        
        // Test for collapse indicators
        for (const [risk, pattern] of Object.entries(this.structuralPatterns.collapse_indicators)) {
            if (pattern.test(narrative)) {
                analysis.collapse_risk_factors++;
                detected_patterns.collapse_risks.push(risk);
            }
        }
        
        // Test structural elegance
        for (const [marker, pattern] of Object.entries(this.structuralPatterns.coherence_validators)) {
            if (pattern.test(narrative)) {
                analysis.structural_elegance++;
                detected_patterns.elegance_markers.push(marker);
            }
        }
        
        return {
            scores: analysis,
            detected_patterns: detected_patterns,
            integrity_rating: this.calculateIntegrityRating(analysis)
        };
    }
    
    calculateIntegrityRating(analysis) {
        // Weighted scoring system
        const foundationScore = Math.min(1.0, analysis.foundation_elements / 6) * 0.3;
        const loadBearingScore = Math.min(1.0, analysis.load_bearing_strength / 6) * 0.3;
        const eleganceScore = Math.min(1.0, analysis.structural_elegance / 6) * 0.2;
        const riskPenalty = Math.min(0.4, analysis.collapse_risk_factors * 0.1);
        
        const rating = foundationScore + loadBearingScore + eleganceScore - riskPenalty;
        
        return {
            raw_score: Math.max(0, Math.min(1.0, rating)),
            foundation_contribution: foundationScore,
            load_bearing_contribution: loadBearingScore,
            elegance_contribution: eleganceScore,
            risk_penalty: riskPenalty
        };
    }
    
    assessNarrativeCoherence(narrative) {
        // Advanced coherence detection
        const coherenceTests = {
            logical_consistency: this.testLogicalConsistency(narrative),
            thematic_unity: this.testThematicUnity(narrative),
            character_integrity: this.testCharacterIntegrity(narrative),
            pacing_coherence: this.testPacingCoherence(narrative),
            resolution_setup: this.testResolutionSetup(narrative)
        };
        
        const overallCoherence = Object.values(coherenceTests).reduce((sum, test) => 
            sum + test.score, 0) / Object.keys(coherenceTests).length;
        
        return {
            coherence_tests: coherenceTests,
            overall_coherence: overallCoherence,
            coherence_level: this.categorizeCoherence(overallCoherence)
        };
    }
    
    testLogicalConsistency(narrative) {
        // Test for logical flow and consistency
        const consistencyMarkers = [
            /(?:because|therefore|thus|consequently)/i,
            /(?:leads.*to|results.*in|causes)/i,
            /(?:builds.*on|follows.*from|connects)/i
        ];
        
        const inconsistencyMarkers = [
            /(?:suddenly|randomly|for.*no.*reason)/i,
            /(?:plot.*hole|doesn.*make.*sense)/i,
            /(?:contradicts|violates)/i
        ];
        
        const consistency = consistencyMarkers.filter(marker => marker.test(narrative)).length;
        const inconsistency = inconsistencyMarkers.filter(marker => marker.test(narrative)).length;
        
        return {
            score: Math.max(0, Math.min(1.0, (consistency * 0.2) - (inconsistency * 0.3))),
            consistency_markers: consistency,
            inconsistency_flags: inconsistency
        };
    }
    
    testThematicUnity(narrative) {
        // Test for thematic reinforcement and unity
        const themeMarkers = [
            /(?:theme|message|meaning)/i,
            /(?:represent|symbol|metaphor)/i,
            /(?:reinforce|echo|reflect)/i
        ];
        
        const themeCount = themeMarkers.filter(marker => marker.test(narrative)).length;
        
        return {
            score: Math.min(1.0, themeCount * 0.25),
            theme_indicators: themeCount,
            unity_strength: themeCount > 2 ? 'strong' : themeCount > 0 ? 'moderate' : 'weak'
        };
    }
    
    testCharacterIntegrity(narrative) {
        // Test for character consistency and development
        const characterMarkers = [
            /(?:character|personality|motivation)/i,
            /(?:true.*to|consistent.*with|authentic)/i,
            /(?:develop|grow|change|arc)/i
        ];
        
        const betrayalMarkers = [
            /(?:out.*of.*character|inconsistent)/i,
            /(?:sudden.*change|personality.*shift)/i
        ];
        
        const integrity = characterMarkers.filter(marker => marker.test(narrative)).length;
        const betrayals = betrayalMarkers.filter(marker => marker.test(narrative)).length;
        
        return {
            score: Math.max(0, Math.min(1.0, (integrity * 0.3) - (betrayals * 0.5))),
            integrity_markers: integrity,
            betrayal_flags: betrayals
        };
    }
    
    testPacingCoherence(narrative) {
        // Test for appropriate pacing and rhythm
        const pacingMarkers = [
            /(?:pace|rhythm|flow)/i,
            /(?:build|escalate|intensify)/i,
            /(?:pause|breath|moment)/i
        ];
        
        const rushingMarkers = [
            /(?:rushed|hurried|too.*fast)/i,
            /(?:sudden|abrupt|jarring)/i
        ];
        
        const pacing = pacingMarkers.filter(marker => marker.test(narrative)).length;
        const rushing = rushingMarkers.filter(marker => marker.test(narrative)).length;
        
        return {
            score: Math.max(0, Math.min(1.0, (pacing * 0.25) - (rushing * 0.4))),
            pacing_indicators: pacing,
            rushing_flags: rushing
        };
    }
    
    testResolutionSetup(narrative) {
        // Test whether resolution is properly set up
        const setupMarkers = [
            /(?:setup|establish|plant|foreshadow)/i,
            /(?:payoff|resolution|answer|solution)/i,
            /(?:earn|deserve|justify)/i
        ];
        
        const contriveMarkers = [
            /(?:deus.*ex|convenient|contrived)/i,
            /(?:out.*of.*nowhere|sudden.*solution)/i
        ];
        
        const setup = setupMarkers.filter(marker => marker.test(narrative)).length;
        const contrivance = contriveMarkers.filter(marker => marker.test(narrative)).length;
        
        return {
            score: Math.max(0, Math.min(1.0, (setup * 0.3) - (contrivance * 0.6))),
            setup_indicators: setup,
            contrivance_flags: contrivance
        };
    }
    
    categorizeCoherence(coherenceScore) {
        if (coherenceScore >= 0.8) return 'excellent';
        if (coherenceScore >= 0.6) return 'good';
        if (coherenceScore >= 0.4) return 'adequate';
        if (coherenceScore >= 0.2) return 'concerning';
        return 'poor';
    }
    
    evaluateFoundationStrength(narrative) {
        // Test the fundamental strength of the narrative foundation
        const foundationTests = {
            premise_clarity: this.testPremiseClarity(narrative),
            world_consistency: this.testWorldConsistency(narrative),
            rule_establishment: this.testRuleEstablishment(narrative),
            expectation_management: this.testExpectationManagement(narrative)
        };
        
        const foundationStrength = Object.values(foundationTests).reduce((sum, test) => 
            sum + test.score, 0) / Object.keys(foundationTests).length;
        
        return {
            foundation_tests: foundationTests,
            foundation_strength: foundationStrength,
            strength_level: this.categorizeFoundationStrength(foundationStrength)
        };
    }
    
    testPremiseClarity(narrative) {
        const clarityMarkers = [
            /(?:premise|concept|idea)/i,
            /(?:clear|obvious|apparent)/i,
            /(?:establish|define|explain)/i
        ];
        
        const confusionMarkers = [
            /(?:confusing|unclear|muddy)/i,
            /(?:don.*understand|what.*happening)/i
        ];
        
        const clarity = clarityMarkers.filter(marker => marker.test(narrative)).length;
        const confusion = confusionMarkers.filter(marker => marker.test(narrative)).length;
        
        return {
            score: Math.max(0, Math.min(1.0, (clarity * 0.3) - (confusion * 0.5))),
            clarity_indicators: clarity,
            confusion_flags: confusion
        };
    }
    
    testWorldConsistency(narrative) {
        const consistencyMarkers = [
            /(?:world|universe|setting)/i,
            /(?:consistent|coherent|logical)/i,
            /(?:rule|law|principle)/i
        ];
        
        const score = Math.min(1.0, consistencyMarkers.filter(marker => 
            marker.test(narrative)).length * 0.25);
        
        return {
            score: score,
            consistency_indicators: consistencyMarkers.filter(marker => 
                marker.test(narrative)).length
        };
    }
    
    testRuleEstablishment(narrative) {
        const ruleMarkers = [
            /(?:rule|law|principle|limit)/i,
            /(?:establish|set.*up|define)/i,
            /(?:boundary|constraint|limitation)/i
        ];
        
        const score = Math.min(1.0, ruleMarkers.filter(marker => 
            marker.test(narrative)).length * 0.3);
        
        return {
            score: score,
            rule_indicators: ruleMarkers.filter(marker => 
                marker.test(narrative)).length
        };
    }
    
    testExpectationManagement(narrative) {
        const managementMarkers = [
            /(?:expect|anticipate|predict)/i,
            /(?:setup|foreshadow|hint)/i,
            /(?:promise|deliver|fulfill)/i
        ];
        
        const score = Math.min(1.0, managementMarkers.filter(marker => 
            marker.test(narrative)).length * 0.25);
        
        return {
            score: score,
            management_indicators: managementMarkers.filter(marker => 
                marker.test(narrative)).length
        };
    }
    
    categorizeFoundationStrength(strength) {
        if (strength >= 0.8) return 'rock_solid';
        if (strength >= 0.6) return 'stable';
        if (strength >= 0.4) return 'adequate';
        if (strength >= 0.2) return 'shaky';
        return 'unstable';
    }
    
    generateCommitmentRecommendation(structuralAnalysis, coherenceAssessment, foundationStrength) {
        const integrityScore = structuralAnalysis.integrity_rating.raw_score;
        const coherenceScore = coherenceAssessment.overall_coherence;
        const foundationScore = foundationStrength.foundation_strength;
        
        const overallScore = (integrityScore * 0.4) + (coherenceScore * 0.35) + (foundationScore * 0.25);
        
        let recommendation;
        let reasoning;
        let risk_level;
        
        if (overallScore >= this.coherenceThresholds.safe_commitment_threshold) {
            recommendation = 'COMMIT_WITH_CONFIDENCE';
            reasoning = 'Strong structural integrity detected. The narrative foundation can support its complexity.';
            risk_level = 'low';
        } else if (overallScore >= this.coherenceThresholds.watch_with_caution_threshold) {
            recommendation = 'PROCEED_WITH_MONITORING';
            reasoning = 'Adequate structure but monitor for potential collapse indicators.';
            risk_level = 'medium';
        } else if (overallScore >= this.coherenceThresholds.structural_risk_threshold) {
            recommendation = 'HIGH_COLLAPSE_RISK';
            reasoning = 'Structural weaknesses detected. High probability of narrative collapse.';
            risk_level = 'high';
        } else {
            recommendation = 'AVOID_COMMITMENT';
            reasoning = 'Fundamental structural issues. Narrative likely to collapse under its own weight.';
            risk_level = 'critical';
        }
        
        return {
            recommendation: recommendation,
            overall_score: overallScore,
            reasoning: reasoning,
            risk_level: risk_level,
            score_breakdown: {
                structural_integrity: integrityScore,
                narrative_coherence: coherenceScore,
                foundation_strength: foundationScore
            },
            confidence_level: this.calculateConfidenceLevel(overallScore)
        };
    }
    
    calculateConfidenceLevel(score) {
        if (score >= 0.8) return 'very_high';
        if (score >= 0.6) return 'high';
        if (score >= 0.4) return 'medium';
        if (score >= 0.2) return 'low';
        return 'very_low';
    }
    
    generateSkyscraperMetaphor(structuralAnalysis) {
        const integrityRating = structuralAnalysis.integrity_rating.raw_score;
        
        let metaphor;
        if (integrityRating >= 0.8) {
            metaphor = "🏗️ **Burj Khalifa Foundation**: This narrative has the structural integrity to support massive complexity. Build as high as you want—the foundation will hold.";
        } else if (integrityRating >= 0.6) {
            metaphor = "🏢 **Solid Office Building**: Good structural foundation. Can support significant development but be mindful of load distribution.";
        } else if (integrityRating >= 0.4) {
            metaphor = "🏠 **House Foundation**: Adequate for modest complexity but adding too many floors risks structural failure.";
        } else if (integrityRating >= 0.2) {
            metaphor = "🏚️ **Shaky Foundation**: Built on questionable ground. Any additional weight risks collapse.";
        } else {
            metaphor = "⚠️ **No Foundation**: Building in quicksand. The structure will not support its own weight.";
        }
        
        return {
            metaphor: metaphor,
            integrity_rating: integrityRating,
            structural_recommendation: this.getStructuralRecommendation(integrityRating)
        };
    }
    
    getStructuralRecommendation(rating) {
        if (rating >= 0.8) return 'safe_to_build_maximum_complexity';
        if (rating >= 0.6) return 'can_support_significant_development';
        if (rating >= 0.4) return 'limit_complexity_monitor_load_bearing';
        if (rating >= 0.2) return 'minimal_additions_only_high_collapse_risk';
        return 'abandon_construction_find_better_foundation';
    }
    
    recordArcFeeling(narrative, arcFeeling) {
        this.arcMemory.validated_arcs.push({
            timestamp: new Date().toISOString(),
            narrative_signature: narrative.substring(0, 100) + (narrative.length > 100 ? '...' : ''),
            overall_score: arcFeeling.commitment_recommendation.overall_score,
            recommendation: arcFeeling.commitment_recommendation.recommendation,
            risk_level: arcFeeling.commitment_recommendation.risk_level
        });
        
        // Keep only recent validations
        if (this.arcMemory.validated_arcs.length > 50) {
            this.arcMemory.validated_arcs = this.arcMemory.validated_arcs.slice(-50);
        }
        
        this.saveArcMemory();
    }
    
    saveArcMemory() {
        const memoryPath = path.join(__dirname, 'arc_memory.json');
        fs.writeFileSync(memoryPath, JSON.stringify(this.arcMemory, null, 2));
    }
    
    /**
     * Generate arc feeling report
     */
    generateArcFeelingReport() {
        const recentValidations = this.arcMemory.validated_arcs.slice(-10);
        const averageScore = recentValidations.reduce((sum, val) => 
            sum + val.overall_score, 0) / (recentValidations.length || 1);
        
        const recommendationStats = {};
        recentValidations.forEach(val => {
            recommendationStats[val.recommendation] = 
                (recommendationStats[val.recommendation] || 0) + 1;
        });
        
        return {
            total_validations: this.arcMemory.validated_arcs.length,
            recent_validations: recentValidations.length,
            average_structural_score: averageScore,
            recommendation_distribution: recommendationStats,
            validation_effectiveness: averageScore > 0.7 ? 'high_standards' : 
                                    averageScore > 0.4 ? 'moderate_standards' : 'cautious_approach'
        };
    }
}

module.exports = ArcFeelingInterface;

// CLI usage
if (require.main === module) {
    const arcFeeler = new ArcFeelingInterface();
    
    const args = process.argv.slice(2);
    const narrative = args.join(' ');
    
    if (narrative) {
        const arcFeeling = arcFeeler.feelArc(narrative);
        
        console.log('📊 **STRUCTURAL ANALYSIS:**');
        console.log(`   Integrity Rating: ${(arcFeeling.structural_analysis.integrity_rating.raw_score * 100).toFixed(1)}%`);
        console.log(`   Foundation Elements: ${arcFeeling.structural_analysis.scores.foundation_elements}/6`);
        console.log(`   Load-Bearing Strength: ${arcFeeling.structural_analysis.scores.load_bearing_strength}/6`);
        console.log(`   Collapse Risk Factors: ${arcFeeling.structural_analysis.scores.collapse_risk_factors}`);
        console.log('');
        
        console.log('🔍 **COHERENCE ASSESSMENT:**');
        console.log(`   Overall Coherence: ${(arcFeeling.coherence_assessment.overall_coherence * 100).toFixed(1)}%`);
        console.log(`   Coherence Level: ${arcFeeling.coherence_assessment.coherence_level}`);
        console.log('');
        
        console.log('🏗️ **FOUNDATION STRENGTH:**');
        console.log(`   Foundation Score: ${(arcFeeling.foundation_strength.foundation_strength * 100).toFixed(1)}%`);
        console.log(`   Strength Level: ${arcFeeling.foundation_strength.strength_level}`);
        console.log('');
        
        console.log('⚡ **COMMITMENT RECOMMENDATION:**');
        console.log(`   **${arcFeeling.commitment_recommendation.recommendation}**`);
        console.log(`   Overall Score: ${(arcFeeling.commitment_recommendation.overall_score * 100).toFixed(1)}%`);
        console.log(`   Risk Level: ${arcFeeling.commitment_recommendation.risk_level}`);
        console.log(`   Reasoning: ${arcFeeling.commitment_recommendation.reasoning}`);
        console.log('');
        
        console.log(arcFeeling.skyscraper_metaphor.metaphor);
        
    } else {
        console.log('🏗️ Arc Feeling Interface');
        console.log('=' + '='.repeat(22));
        console.log('');
        console.log('🔍 Deep structural recognition for narrative integrity');
        console.log('🏗️ Validates foundation before commitment');
        console.log('⚡ Skyscraper foundation detector for stories');
        console.log('');
        console.log('Usage:');
        console.log('  node arc_feeling_interface.js "narrative description or premise"');
        console.log('');
        console.log('🌀 Sacred technology serving structural integrity.');
    }
}