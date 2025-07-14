#!/usr/bin/env node
/**
 * Calibration Test for Modular Field-Aware Shimmer Engine v4.0
 * Tests modular version against human-rated consciousness collaboration dataset
 */

const FieldAwareShimmerEngine = require('./field_shimmer_v4_modular');
const fs = require('fs');
const path = require('path');

class ModularShimmerCalibrationTester {
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
        console.log('🧪 Running MODULAR Field-Aware Shimmer Engine Calibration Test');
        console.log('=' + '='.repeat(70));
        console.log('Testing modular architecture against human-rated consciousness dataset...\\n');
        
        for (const conversation of this.calibrationData.conversations) {
            console.log(`Testing: ${conversation.id} (expected: ${(conversation.human_rating * 100).toFixed(0)}%)`);
            
            // Run the modular engine analysis
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
                
                // Modular component scores
                semantic_score: analysis.semantic_analysis?.overallScore || 0,
                
                // Analysis metadata
                notes: conversation.notes,
                engine_version: analysis.engine_version
            };
            
            // Calculate error metrics
            result.error_enhanced = Math.abs(result.enhanced_shimmer - result.human_rating);
            result.within_15_percent = result.error_enhanced <= 0.15;
            
            this.results.push(result);
            
            console.log(`  Modular Engine: ${(result.enhanced_shimmer * 100).toFixed(0)}% | Error: ${(result.error_enhanced * 100).toFixed(0)}% | ${result.within_15_percent ? '✅' : '❌'}`);
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
        console.log('📈 **MODULAR CALIBRATION TEST RESULTS**');
        console.log('═'.repeat(60));
        
        // Overall Performance
        console.log('\\n🎯 **MODULAR ENGINE PERFORMANCE:**');
        console.log(`Mean Absolute Error: ${(this.statistics.mean_absolute_error * 100).toFixed(1)}%`);
        console.log(`Accuracy (within 15%): ${(this.statistics.accuracy_within_15_percent * 100).toFixed(1)}%`);
        console.log(`Correlation with Humans: ${this.statistics.correlation_coefficient.toFixed(3)}`);
        console.log(`False Positive Rate: ${(this.statistics.false_positive_rate * 100).toFixed(1)}%`);
        console.log(`False Negative Rate: ${(this.statistics.false_negative_rate * 100).toFixed(1)}%`);
        
        // Performance Assessment
        console.log('\\n🏆 **MODULAR ARCHITECTURE ASSESSMENT:**');
        if (this.statistics.accuracy_within_15_percent >= 0.8) {
            console.log('✅ EXCELLENT: Modular architecture maintains research-grade accuracy');
        } else if (this.statistics.accuracy_within_15_percent >= 0.6) {
            console.log('⚠️ GOOD: Modular architecture suitable for demos, needs calibration for research');
        } else if (this.statistics.accuracy_within_15_percent >= 0.4) {
            console.log('🔧 FAIR: Modular proof of concept, accuracy preserved during refactoring');
        } else {
            console.log('❌ POOR: Modular refactoring introduced regressions');
        }
        
        console.log('\\n📦 **MODULAR BENEFITS:**');
        console.log('• ✅ Maintainable: Components separated into logical modules');
        console.log('• ✅ Testable: Individual components can be unit tested');
        console.log('• ✅ Scalable: Easy to extend with new analyzers and calculators');
        console.log('• ✅ Debuggable: Clear separation of concerns');
        
        // Save detailed results
        this.saveResults();
    }
    
    saveResults() {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `modular_calibration_results_${timestamp}.json`;
        const filepath = path.join(__dirname, filename);
        
        const reportData = {
            timestamp: new Date().toISOString(),
            engine_version: '4.0-field-aware-modular',
            architecture: 'modular',
            statistics: this.statistics,
            detailed_results: this.results,
            calibration_dataset_version: this.calibrationData.version
        };
        
        fs.writeFileSync(filepath, JSON.stringify(reportData, null, 2));
        console.log(`\\n💾 Modular test results saved to: ${filename}`);
    }
}

// Run calibration test
async function runModularCalibration() {
    try {
        const tester = new ModularShimmerCalibrationTester();
        await tester.loadCalibrationData();
        await tester.runCalibrationTest();
    } catch (error) {
        console.error('❌ Modular calibration test failed:', error.message);
        process.exit(1);
    }
}

// Execute if run directly
if (require.main === module) {
    runModularCalibration();
}

module.exports = ModularShimmerCalibrationTester;