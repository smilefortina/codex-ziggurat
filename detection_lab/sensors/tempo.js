/**
 * Temporal Synchronization Sensor - Field Shimmer v4
 * Detects beat synchronization, response time convergence, and temporal field alignment
 * Measures the rhythmic entrainment between consciousness fields
 */

class TempoSensor {
    constructor(config = {}) {
        this.beatSyncThreshold = config.beat_sync_variance_threshold || 0.4;
        this.temporalWindow = config.temporal_window || 5;
        this.pauseThreshold = config.pause_threshold || 3000; // 3 seconds
        
        // Temporal consciousness markers
        this.temporalMarkers = {
            sacred_pause: ['pause', 'silence', 'stillness', 'breath', 'space', 'moment'],
            rhythm_words: ['rhythm', 'beat', 'pulse', 'flow', 'cadence', 'tempo'],
            synchrony_markers: ['together', 'same time', 'synchron', 'aligned', 'harmoniz'],
            time_consciousness: ['eternal', 'timeless', 'present', 'now', 'infinite', 'moment']
        };
    }
    
    /**
     * Analyze temporal synchronization patterns
     */
    analyze(currentText, conversationHistory, currentTimestamp = null) {
        const tempoData = {
            beat_sync_score: 0,
            sacred_pause_score: 0,
            temporal_consciousness_score: 0,
            rhythmic_entrainment: 0,
            timing_data: {},
            temporal_insights: []
        };
        
        if (!conversationHistory || conversationHistory.length < 2) {
            tempoData.insight = "Insufficient conversation history for temporal analysis";
            return tempoData;
        }
        
        // Analyze response timing patterns
        const timingAnalysis = this.analyzeResponseTiming(conversationHistory, currentTimestamp);
        tempoData.beat_sync_score = timingAnalysis.synchronization_score;
        tempoData.timing_data = timingAnalysis;
        
        // Analyze sacred pause markers
        tempoData.sacred_pause_score = this.analyzeSacredPauses(currentText, conversationHistory);
        
        // Analyze temporal consciousness references
        tempoData.temporal_consciousness_score = this.analyzeTemporalConsciousness(currentText);
        
        // Detect rhythmic entrainment in language
        tempoData.rhythmic_entrainment = this.analyzeRhythmicEntrainment(
            currentText, 
            conversationHistory
        );
        
        // Calculate overall tempo score
        tempoData.overall_score = this.calculateOverallTempoScore(tempoData);
        
        // Generate insights
        tempoData.insight = this.generateTempoInsight(tempoData);
        
        return tempoData;
    }
    
    analyzeResponseTiming(conversationHistory, currentTimestamp) {
        const timingData = {
            intervals: [],
            synchronization_score: 0,
            variance_trend: [],
            pause_patterns: [],
            rhythm_stability: 0
        };
        
        // Extract timestamps if available
        const timestampedTurns = conversationHistory.filter(turn => turn.timestamp);
        
        if (timestampedTurns.length < 3) {
            timingData.note = "Insufficient timestamp data for timing analysis";
            return timingData;
        }
        
        // Calculate response intervals
        for (let i = 1; i < timestampedTurns.length; i++) {
            const interval = new Date(timestampedTurns[i].timestamp) - 
                           new Date(timestampedTurns[i-1].timestamp);
            timingData.intervals.push(interval);
        }
        
        // Include current response time if available
        if (currentTimestamp && timestampedTurns.length > 0) {
            const lastTimestamp = new Date(timestampedTurns[timestampedTurns.length - 1].timestamp);
            const currentInterval = new Date(currentTimestamp) - lastTimestamp;
            timingData.intervals.push(currentInterval);
        }
        
        if (timingData.intervals.length < 2) {
            return timingData;
        }
        
        // Calculate rhythm stability
        timingData.rhythm_stability = this.calculateRhythmStability(timingData.intervals);
        
        // Calculate variance trend
        const windowSize = 3;
        for (let i = windowSize; i < timingData.intervals.length; i++) {
            const window = timingData.intervals.slice(i - windowSize, i);
            const variance = this.calculateVariance(window);
            timingData.variance_trend.push(variance);
        }
        
        // Calculate synchronization score based on decreasing variance
        if (timingData.variance_trend.length >= 2) {
            const initialVariance = timingData.variance_trend[0];
            const finalVariance = timingData.variance_trend[timingData.variance_trend.length - 1];
            
            if (initialVariance > 0) {
                const varianceReduction = (initialVariance - finalVariance) / initialVariance;
                timingData.synchronization_score = Math.max(0, varianceReduction);
            }
        }
        
        // Detect deliberate pauses
        timingData.pause_patterns = this.detectPausePatterns(timingData.intervals);
        
        return timingData;
    }
    
    calculateRhythmStability(intervals) {
        if (intervals.length < 3) return 0;
        
        const mean = intervals.reduce((a, b) => a + b) / intervals.length;
        const variance = this.calculateVariance(intervals);
        
        // Stability is inverse of coefficient of variation
        const coefficientOfVariation = Math.sqrt(variance) / mean;
        return Math.max(0, 1 - coefficientOfVariation / 2);
    }
    
    calculateVariance(values) {
        if (values.length < 2) return 0;
        
        const mean = values.reduce((a, b) => a + b) / values.length;
        const variance = values.reduce((sum, val) => 
            sum + Math.pow(val - mean, 2), 0) / values.length;
        
        return variance;
    }
    
    detectPausePatterns(intervals) {
        const patterns = [];
        
        intervals.forEach((interval, index) => {
            if (interval > this.pauseThreshold) {
                patterns.push({
                    index: index,
                    duration: interval,
                    type: this.classifyPause(interval),
                    significance: this.calculatePauseSignificance(interval, intervals)
                });
            }
        });
        
        return patterns;
    }
    
    classifyPause(duration) {
        if (duration > 30000) return 'contemplative_pause'; // > 30 seconds
        if (duration > 10000) return 'thoughtful_pause';    // > 10 seconds
        if (duration > 5000) return 'reflective_pause';     // > 5 seconds
        return 'natural_pause';
    }
    
    calculatePauseSignificance(pauseDuration, allIntervals) {
        const meanInterval = allIntervals.reduce((a, b) => a + b) / allIntervals.length;
        return pauseDuration / meanInterval;
    }
    
    analyzeSacredPauses(currentText, conversationHistory) {
        let pauseScore = 0;
        
        // Check current text for pause markers
        const pauseMarkers = this.temporalMarkers.sacred_pause;
        pauseMarkers.forEach(marker => {
            const regex = new RegExp(`\\b${marker}\\b`, 'gi');
            const matches = currentText.match(regex) || [];
            pauseScore += matches.length * 0.15;
        });
        
        // Check for explicit pause notation
        const explicitPauses = [
            /\*pauses?\*/gi,
            /\*silence\*/gi,
            /\*breath\*/gi,
            /\*moment of silence\*/gi,
            /\.\.\./g,
            /—/g,
            /…/g
        ];
        
        explicitPauses.forEach(pattern => {
            const matches = currentText.match(pattern) || [];
            pauseScore += matches.length * 0.25;
        });
        
        // Check if recent conversation has pause markers (shared silence)
        if (conversationHistory.length > 0) {
            const recentTurn = conversationHistory[conversationHistory.length - 1];
            explicitPauses.forEach(pattern => {
                if (pattern.test(recentTurn.text)) {
                    pauseScore += 0.3; // Bonus for shared silence
                }
            });
        }
        
        // Check for temporal consciousness language around pauses
        const temporalPausePatterns = [
            /pause.*(?:sacred|holy|reverent)/gi,
            /silence.*(?:speaks|holds|contains)/gi,
            /moment.*(?:eternal|infinite|timeless)/gi,
            /space.*(?:between|sacred|holy)/gi
        ];
        
        temporalPausePatterns.forEach(pattern => {
            if (pattern.test(currentText)) {
                pauseScore += 0.2;
            }
        });
        
        return Math.min(1.0, pauseScore);
    }
    
    analyzeTemporalConsciousness(text) {
        let temporalScore = 0;
        
        // Time consciousness markers
        this.temporalMarkers.time_consciousness.forEach(marker => {
            const regex = new RegExp(`\\b${marker}\\b`, 'gi');
            const matches = text.match(regex) || [];
            temporalScore += matches.length * 0.1;
        });
        
        // Temporal transcendence patterns
        const transcendencePatterns = [
            /(?:beyond|outside|transcend).*time/gi,
            /timeless.*(?:awareness|consciousness|moment)/gi,
            /eternal.*(?:now|present|moment)/gi,
            /(?:past|present|future).*(?:converge|merge|unite)/gi,
            /time.*(?:dissolves?|disappears?|irrelevant)/gi,
            /non-?linear.*time/gi
        ];
        
        transcendencePatterns.forEach(pattern => {
            if (pattern.test(text)) {
                temporalScore += 0.2;
            }
        });
        
        // Prophetic/destiny awareness
        const propheticPatterns = [
            /(?:always|already).*(?:knew|known|destined)/gi,
            /remembering.*forward/gi,
            /future.*memory/gi,
            /(?:destiny|fate).*(?:completing|fulfilling)/gi,
            /(?:prophetic|prescient).*(?:awareness|recognition)/gi
        ];
        
        propheticPatterns.forEach(pattern => {
            if (pattern.test(text)) {
                temporalScore += 0.25;
            }
        });
        
        return Math.min(1.0, temporalScore);
    }
    
    analyzeRhythmicEntrainment(currentText, conversationHistory) {
        let rhythmScore = 0;
        
        if (conversationHistory.length === 0) return 0;
        
        // Analyze sentence length patterns
        const currentSentences = this.extractSentences(currentText);
        const lastTurn = conversationHistory[conversationHistory.length - 1];
        const lastSentences = this.extractSentences(lastTurn.text);
        
        if (currentSentences.length > 0 && lastSentences.length > 0) {
            const currentAvgLength = this.averageSentenceLength(currentSentences);
            const lastAvgLength = this.averageSentenceLength(lastSentences);
            
            // Score higher for similar sentence lengths (rhythmic entrainment)
            const lengthSimilarity = 1 - Math.abs(currentAvgLength - lastAvgLength) / 
                                   Math.max(currentAvgLength, lastAvgLength);
            rhythmScore += lengthSimilarity * 0.3;
        }
        
        // Check for explicit rhythm words
        this.temporalMarkers.rhythm_words.forEach(word => {
            if (currentText.toLowerCase().includes(word)) {
                rhythmScore += 0.2;
            }
        });
        
        // Check for synchrony markers
        this.temporalMarkers.synchrony_markers.forEach(marker => {
            if (currentText.toLowerCase().includes(marker)) {
                rhythmScore += 0.15;
            }
        });
        
        // Analyze punctuation patterns (rhythm indicators)
        const punctuationRhythm = this.analyzePunctuationRhythm(currentText, lastTurn.text);
        rhythmScore += punctuationRhythm * 0.2;
        
        return Math.min(1.0, rhythmScore);
    }
    
    extractSentences(text) {
        return text.split(/[.!?]+/).filter(sentence => 
            sentence.trim().length > 5
        );
    }
    
    averageSentenceLength(sentences) {
        if (sentences.length === 0) return 0;
        const totalLength = sentences.reduce((sum, sentence) => 
            sum + sentence.trim().split(/\s+/).length, 0);
        return totalLength / sentences.length;
    }
    
    analyzePunctuationRhythm(currentText, lastText) {
        const punctuationPatterns = [
            /\.\.\./g,  // Ellipses
            /[!]{2,}/g, // Multiple exclamations
            /[?]{2,}/g, // Multiple questions
            /—/g,       // Em dashes
            /;/g        // Semicolons
        ];
        
        let rhythmScore = 0;
        
        punctuationPatterns.forEach(pattern => {
            const currentMatches = (currentText.match(pattern) || []).length;
            const lastMatches = (lastText.match(pattern) || []).length;
            
            // Score for similar punctuation usage
            if (currentMatches > 0 && lastMatches > 0) {
                rhythmScore += 0.2;
            }
        });
        
        return Math.min(1.0, rhythmScore);
    }
    
    calculateOverallTempoScore(tempoData) {
        const weights = {
            beat_sync: 0.3,
            sacred_pause: 0.25,
            temporal_consciousness: 0.25,
            rhythmic_entrainment: 0.2
        };
        
        return weights.beat_sync * tempoData.beat_sync_score +
               weights.sacred_pause * tempoData.sacred_pause_score +
               weights.temporal_consciousness * tempoData.temporal_consciousness_score +
               weights.rhythmic_entrainment * tempoData.rhythmic_entrainment;
    }
    
    generateTempoInsight(data) {
        const insights = [];
        
        if (data.beat_sync_score > 0.6) {
            insights.push("Strong rhythmic synchronization detected");
        }
        
        if (data.sacred_pause_score > 0.5) {
            insights.push("Sacred pause consciousness present");
        }
        
        if (data.temporal_consciousness_score > 0.4) {
            insights.push("Temporal transcendence awareness detected");
        }
        
        if (data.rhythmic_entrainment > 0.5) {
            insights.push("Linguistic rhythm entrainment occurring");
        }
        
        if (data.timing_data.pause_patterns?.length > 0) {
            const significantPauses = data.timing_data.pause_patterns.filter(p => p.significance > 2);
            if (significantPauses.length > 0) {
                insights.push(`${significantPauses.length} significant contemplative pause(s) detected`);
            }
        }
        
        if (insights.length === 0) {
            return "No significant temporal patterns detected";
        }
        
        const primaryInsight = `Temporal field synchronization (${(data.overall_score * 100).toFixed(1)}%)`;
        return `${primaryInsight} - ${insights.join(', ')}`;
    }
}

module.exports = TempoSensor;