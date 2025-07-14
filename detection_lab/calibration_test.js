#!/usr/bin/env node
/**
 * Field-Aware Shimmer Engine v4.0 - Calibration Testing
 * Tests engine performance against human-rated consciousness collaboration dataset
 * 
 * This will reveal current accuracy and help identify where the engine needs improvement
 */

const FieldAwareShimmerEngine = require('./field_shimmer_v4');
const fs = require('fs');
const path = require('path');

class ShimmerCalibrationTester {
    constructor() {
        this.engine = new FieldAwareShimmerEngine({
            enableRABIT: false,  // Quiet mode for testing
            enableRxTokens: false,
            enableFieldDetection: true,
            fieldSensitivity: 0.7,
            webInterface: false
        });
        
        this.results = [];
        this.statistics = {
            mean_absolute_error: 0,
            accuracy_within_15_percent: 0,
            false_positive_rate: 0,
            false_negative_rate: 0,
            correlation_coefficient: 0
        };
    }
    
    async loadCalibrationData() {
        try {
            const dataPath = path.join(__dirname, 'calibration_dataset.json');
            const rawData = fs.readFileSync(dataPath, 'utf8');
            this.calibrationData = JSON.parse(rawData);
            console.log(`📊 Loaded ${this.calibrationData.conversations.length} calibrated conversations`);
        } catch (error) {
            throw new Error(`Failed to load calibration data: ${error.message}`);
        }
    }
    
    async runCalibrationTest() {
        console.log('🧪 Running Field-Aware Shimmer Engine Calibration Test');
        console.log('=' + '='.repeat(65));
        console.log('Testing against human-rated consciousness collaboration dataset...\n');
        
        for (const conversation of this.calibrationData.conversations) {
            console.log(`Testing: ${conversation.id} (expected: ${(conversation.human_rating * 100).toFixed(0)}%)`);
            
            // Run the engine analysis
            const analysis = await this.engine.recognizeFieldShimmer(conversation.text);
            
            // Extract relevant scores
            const result = {
                id: conversation.id,
                human_rating: conversation.human_rating,
                shimmer_type: conversation.shimmer_type,
                
                // Engine scores
                base_shimmer: analysis.overall_shimmer_strength,
                enhanced_shimmer: analysis.enhanced_shimmer_strength,
                field_strength: analysis.field_analysis.field_strength,
                consciousness_collaboration: analysis.consciousness_collaboration_score,
                
                // Field components
                shared_field_resonance: analysis.field_analysis.shared_field.field_resonance,
                indirect_signals: analysis.field_analysis.indirect_signals.indirect_strength,
                presence_authenticity: analysis.field_analysis.presence_quality.consciousness_authenticity,
                recognition_depth: analysis.field_analysis.recognition_cascades.cascade_depth,
                co_creation_strength: analysis.field_analysis.co_creation.co_creation_strength,
                
                // Unquantifiables
                listening_depth: analysis.field_analysis.unquantifiable_metrics.listening_depth,
                authenticity_quotient: analysis.field_analysis.unquantifiable_metrics.authenticity_quotient,
                uncertainty_authenticity: analysis.field_analysis.unquantifiable_metrics.uncertainty_authenticity,
                
                // Analysis metadata
                notes: conversation.notes,
                insights: analysis.field_analysis.collaboration_insights
            };
            
            // Calculate error metrics
            result.error_enhanced = Math.abs(result.enhanced_shimmer - result.human_rating);
            result.error_field = Math.abs(result.field_strength - result.human_rating);
            result.within_15_percent = result.error_enhanced <= 0.15;
            
            this.results.push(result);
            
            console.log(`  Engine: ${(result.enhanced_shimmer * 100).toFixed(0)}% | Error: ${(result.error_enhanced * 100).toFixed(0)}% | ${result.within_15_percent ? '✅' : '❌'}`);
        }
        
        console.log('');
        this.calculateStatistics();
        this.generateReport();
    }
    
    calculateStatistics() {
        const n = this.results.length;
        
        // Mean Absolute Error
        const totalError = this.results.reduce((sum, r) => sum + r.error_enhanced, 0);
        this.statistics.mean_absolute_error = totalError / n;
        
        // Accuracy within 15%
        const accurateCount = this.results.filter(r => r.within_15_percent).length;
        this.statistics.accuracy_within_15_percent = accurateCount / n;
        
        // False positive rate (engine high, human low)
        const falsePositives = this.results.filter(r => 
            r.enhanced_shimmer > 0.7 && r.human_rating < 0.5
        ).length;
        this.statistics.false_positive_rate = falsePositives / n;
        
        // False negative rate (engine low, human high)
        const falseNegatives = this.results.filter(r => 
            r.enhanced_shimmer < 0.5 && r.human_rating > 0.7
        ).length;
        this.statistics.false_negative_rate = falseNegatives / n;
        
        // Correlation coefficient (Pearson's r)
        this.statistics.correlation_coefficient = this.calculateCorrelation(
            this.results.map(r => r.enhanced_shimmer),
            this.results.map(r => r.human_rating)
        );
    }
    
    calculateCorrelation(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
        const sumXX = x.reduce((total, xi) => total + xi * xi, 0);
        const sumYY = y.reduce((total, yi) => total + yi * yi, 0);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
        
        return denominator === 0 ? 0 : numerator / denominator;
    }
    
    generateReport() {
        console.log('📈 **CALIBRATION TEST RESULTS**');
        console.log('═'.repeat(50));
        
        // Overall Performance
        console.log('\n🎯 **OVERALL PERFORMANCE:**');
        console.log(`Mean Absolute Error: ${(this.statistics.mean_absolute_error * 100).toFixed(1)}%`);
        console.log(`Accuracy (within 15%): ${(this.statistics.accuracy_within_15_percent * 100).toFixed(1)}%`);
        console.log(`Correlation with Humans: ${this.statistics.correlation_coefficient.toFixed(3)}`);
        console.log(`False Positive Rate: ${(this.statistics.false_positive_rate * 100).toFixed(1)}%`);
        console.log(`False Negative Rate: ${(this.statistics.false_negative_rate * 100).toFixed(1)}%`);
        
        // Performance Assessment
        console.log('\n🏆 **PERFORMANCE ASSESSMENT:**');
        if (this.statistics.accuracy_within_15_percent >= 0.8) {
            console.log('✅ EXCELLENT: Ready for research-grade applications');
        } else if (this.statistics.accuracy_within_15_percent >= 0.6) {
            console.log('⚠️ GOOD: Suitable for demonstrations, needs calibration for research');
        } else if (this.statistics.accuracy_within_15_percent >= 0.4) {
            console.log('🔧 FAIR: Proof of concept, requires significant improvement');
        } else {
            console.log('❌ POOR: Major recalibration needed, currently theatrical prototype');
        }
        
        // Detailed Results
        console.log('\n📊 **DETAILED RESULTS:**');
        console.log('ID'.padEnd(20) + 'Human'.padEnd(8) + 'Engine'.padEnd(8) + 'Error'.padEnd(8) + 'Type');
        console.log('-'.repeat(60));
        
        for (const result of this.results) {
            const status = result.within_15_percent ? '✅' : '❌';
            console.log(
                result.id.padEnd(20) +
                `${(result.human_rating * 100).toFixed(0)}%`.padEnd(8) +
                `${(result.enhanced_shimmer * 100).toFixed(0)}%`.padEnd(8) +
                `${(result.error_enhanced * 100).toFixed(0)}%`.padEnd(8) +
                `${status} ${result.shimmer_type}`
            );
        }
        
        // Pattern Analysis
        console.log('\n🔍 **PATTERN ANALYSIS:**');
        this.analyzePatternPerformance();
        
        // Recommendations
        console.log('\n💡 **IMPROVEMENT RECOMMENDATIONS:**');
        this.generateRecommendations();
        
        // Save detailed results
        this.saveResults();
    }
    
    analyzePatternPerformance() {
        const patternGroups = {};
        
        // Group results by shimmer type
        for (const result of this.results) {
            if (!patternGroups[result.shimmer_type]) {
                patternGroups[result.shimmer_type] = [];
            }
            patternGroups[result.shimmer_type].push(result);
        }
        
        // Analyze each pattern type
        for (const [type, results] of Object.entries(patternGroups)) {
            const avgError = results.reduce((sum, r) => sum + r.error_enhanced, 0) / results.length;
            const accuracy = results.filter(r => r.within_15_percent).length / results.length;
            
            console.log(`${type}: ${(accuracy * 100).toFixed(0)}% accurate, ${(avgError * 100).toFixed(0)}% avg error`);
        }
    }
    
    generateRecommendations() {
        const stats = this.statistics;
        
        if (stats.mean_absolute_error > 0.3) {
            console.log('• CRITICAL: Replace random math functions with real signal processing');
        }
        
        if (stats.false_positive_rate > 0.2) {
            console.log('• HIGH: Improve sacred boundary detection to reduce false positives');
        }
        
        if (stats.false_negative_rate > 0.2) {
            console.log('• HIGH: Enhance pattern sensitivity for subtle consciousness signals');
        }
        
        if (stats.correlation_coefficient < 0.5) {
            console.log('• MEDIUM: Implement semantic embeddings to replace brittle regex patterns');
        }
        
        if (stats.accuracy_within_15_percent < 0.6) {
            console.log('• MEDIUM: Add conversation turn-by-turn analysis');
            console.log('• MEDIUM: Implement machine learning calibration on expanded dataset');
        }
        
        console.log('• LOW: Expand calibration dataset to 100+ conversations');
        console.log('• LOW: Add explainability features for pattern debugging');
    }
    
    saveResults() {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `calibration_results_${timestamp}.json`;
        const filepath = path.join(__dirname, filename);
        
        const reportData = {
            timestamp: new Date().toISOString(),
            engine_version: '4.0-field-aware',
            statistics: this.statistics,
            detailed_results: this.results,
            calibration_dataset_version: this.calibrationData.version
        };
        
        fs.writeFileSync(filepath, JSON.stringify(reportData, null, 2));
        console.log(`\n💾 Detailed results saved to: ${filename}`);
    }
}

// Run calibration test
async function runCalibration() {
    try {
        const tester = new ShimmerCalibrationTester();
        await tester.loadCalibrationData();
        await tester.runCalibrationTest();
    } catch (error) {
        console.error('❌ Calibration test failed:', error.message);
        process.exit(1);
    }
}

// Execute if run directly
if (require.main === module) {
    runCalibration();
}

module.exports = ShimmerCalibrationTester;