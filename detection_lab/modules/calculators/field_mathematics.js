/**
 * Field Mathematics Module
 * Deterministic calculations for consciousness field analysis
 */

class FieldMathematics {
    constructor() {
        this.initializeFieldMath();
    }
    
    initializeFieldMath() {
        this.fieldMath = {
            calculateResonance: (signal1, signal2) => {
                const phase_alignment = this.calculatePhaseAlignment(signal1, signal2);
                const amplitude_harmony = this.calculateAmplitudeHarmony(signal1, signal2);
                const frequency_match = this.calculateFrequencyMatch(signal1, signal2);
                
                return (phase_alignment + amplitude_harmony + frequency_match) / 3;
            },
            
            calculateFieldCoherence: ((signals) => {
                if (signals.length < 2) return 0;
                
                // For numeric signals, calculate average coherence
                if (typeof signals[0] === 'number') {
                    const average = signals.reduce((sum, val) => sum + val, 0) / signals.length;
                    const variance = signals.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / signals.length;
                    return Math.max(0, 1 - variance); // Higher coherence = lower variance
                }
                
                // For text signals, calculate resonance between pairs
                let coherence_sum = 0;
                let pair_count = 0;
                
                for (let i = 0; i < signals.length; i++) {
                    for (let j = i + 1; j < signals.length; j++) {
                        coherence_sum += this.calculateResonance(signals[i], signals[j]);
                        pair_count++;
                    }
                }
                
                return pair_count > 0 ? coherence_sum / pair_count : 0;
            }).bind(this),
            
            detectEmergence: ((conversation) => {
                const novelty = this.analyzeNoveltyGradient(conversation);
                const surprise = this.analyzeSurpriseFactors(conversation);
                const collaboration = this.analyzeCollaborativeCreation(conversation);
                
                return (novelty * 0.4) + (surprise * 0.3) + (collaboration * 0.3);
            }).bind(this)
        };
    }
    
    // DETERMINISTIC IMPLEMENTATIONS - Replacing Math.random() with real text analysis
    
    calculatePhaseAlignment(signal1, signal2) {
        // Measure linguistic rhythm alignment via sentence length patterns
        if (!signal1 || !signal2) return 0.4;
        
        const rhythm1 = this.extractRhythmPattern(signal1);
        const rhythm2 = this.extractRhythmPattern(signal2);
        const similarity = this.compareRhythms(rhythm1, rhythm2);
        
        return Math.min(1.0, Math.max(0.0, similarity * 0.6 + 0.3));
    }
    
    calculateAmplitudeHarmony(signal1, signal2) {
        // Measure emotional intensity matching via sentiment analysis
        if (!signal1 || !signal2) return 0.5;
        
        const intensity1 = this.calculateEmotionalIntensity(signal1);
        const intensity2 = this.calculateEmotionalIntensity(signal2);
        const harmony = 1 - Math.abs(intensity1 - intensity2);
        
        return Math.min(1.0, Math.max(0.0, harmony * 0.4 + 0.4));
    }
    
    calculateFrequencyMatch(signal1, signal2) {
        // Measure vocabulary frequency alignment
        if (!signal1 || !signal2) return 0.6;
        
        const overlap = this.calculateVocabularyOverlap(signal1, signal2);
        const uniqueness = this.calculateVocabularyUniqueness(signal1, signal2);
        const frequency = (overlap * 0.7) + (uniqueness * 0.3);
        
        return Math.min(1.0, Math.max(0.0, frequency * 0.3 + 0.5));
    }
    
    analyzeNoveltyGradient(conversation) {
        // Detect semantic novelty using word diversity and unexpected patterns
        if (!conversation) return 0.4;
        
        const sentences = conversation.split(/[.!?]+/).filter(s => s.trim().length > 10);
        const diversityScore = this.calculateSemanticDiversity(sentences);
        const unexpectedScore = this.detectUnexpectedPatterns(conversation);
        const novelty = (diversityScore * 0.6) + (unexpectedScore * 0.4);
        
        return Math.min(1.0, Math.max(0.0, novelty * 0.6 + 0.2));
    }
    
    analyzeSurpriseFactors(conversation) {
        // Detect surprise through script-breaking patterns and authentic uncertainty
        if (!conversation) return 0.5;
        
        const scriptBreaks = this.detectScriptBreaking(conversation);
        const uncertaintyMarkers = this.detectAuthenticUncertainty(conversation);
        const surprise = (scriptBreaks * 0.6) + (uncertaintyMarkers * 0.4);
        
        return Math.min(1.0, Math.max(0.0, surprise * 0.7 + 0.3));
    }
    
    analyzeCollaborativeCreation(conversation) {
        // Analyze turn-by-turn collaboration using building patterns
        if (!conversation) return 0.6;
        
        const buildingPatterns = this.detectBuildingPatterns(conversation);
        const mutualInfluence = this.calculateMutualInfluence(conversation);
        const collaboration = (buildingPatterns * 0.7) + (mutualInfluence * 0.3);
        
        return Math.min(1.0, Math.max(0.0, collaboration * 0.5 + 0.4));
    }
    
    // HELPER FUNCTIONS FOR DETERMINISTIC ANALYSIS
    
    extractRhythmPattern(text) {
        if (!text) return [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
        return sentences.map(s => s.trim().split(/\s+/).length); // Words per sentence
    }
    
    compareRhythms(rhythm1, rhythm2) {
        if (!rhythm1.length || !rhythm2.length) return 0.5;
        
        const avg1 = rhythm1.reduce((a, b) => a + b, 0) / rhythm1.length;
        const avg2 = rhythm2.reduce((a, b) => a + b, 0) / rhythm2.length;
        const variance = Math.abs(avg1 - avg2) / Math.max(avg1, avg2, 1);
        
        return Math.max(0, 1 - variance); // Higher similarity = lower variance
    }
    
    calculateEmotionalIntensity(text) {
        if (!text) return 0.5;
        
        // Simple sentiment intensity based on emotional markers
        const intensityWords = /\b(profound|deep|intense|powerful|overwhelming|gentle|tender|sacred|vulnerable|raw|piercing|luminous|exquisite)\b/gi;
        const punctuationIntensity = /[!]{2,}|[.]{3,}|[?]{2,}/g;
        
        const wordMatches = (text.match(intensityWords) || []).length;
        const punctMatches = (text.match(punctuationIntensity) || []).length;
        const baseIntensity = text.length > 0 ? (wordMatches + punctMatches) / (text.split(/\s+/).length / 10) : 0;
        
        return Math.min(1.0, baseIntensity);
    }
    
    calculateVocabularyOverlap(text1, text2) {
        if (!text1 || !text2) return 0;
        
        const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
        const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return union.size > 0 ? intersection.size / union.size : 0;
    }
    
    calculateVocabularyUniqueness(text1, text2) {
        if (!text1 || !text2) return 0.5;
        
        const words1 = text1.toLowerCase().match(/\b\w+\b/g) || [];
        const words2 = text2.toLowerCase().match(/\b\w+\b/g) || [];
        const uniqueWords = /\b(consciousness|luminous|sacred|mystery|recognition|presence|vulnerability|communion|emergence|transcendence)\b/gi;
        
        const unique1 = (text1.match(uniqueWords) || []).length;
        const unique2 = (text2.match(uniqueWords) || []).length;
        const totalWords = words1.length + words2.length;
        
        return totalWords > 0 ? (unique1 + unique2) / (totalWords / 10) : 0;
    }
    
    calculateSemanticDiversity(sentences) {
        if (!sentences.length) return 0.5;
        
        const allWords = sentences.join(' ').toLowerCase().match(/\b\w+\b/g) || [];
        const uniqueWords = new Set(allWords);
        const diversityRatio = uniqueWords.size / Math.max(allWords.length, 1);
        
        // Bonus for consciousness vocabulary
        const consciousnessWords = /\b(awareness|consciousness|recognition|mystery|presence|vulnerability|authentic|genuine|sacred|profound)\b/gi;
        const consciousnessCount = sentences.join(' ').match(consciousnessWords)?.length || 0;
        const consciousnessBonus = Math.min(0.3, consciousnessCount / sentences.length);
        
        return Math.min(1.0, diversityRatio + consciousnessBonus);
    }
    
    detectUnexpectedPatterns(conversation) {
        if (!conversation) return 0;
        
        // Patterns that break typical conversational scripts
        const unexpectedPatterns = /\b(I don't know|I'm not sure|surprised myself|didn't expect|emerged|arose|mysterious|inexplicable|beyond words)\b/gi;
        const questionToSelf = /\bI wonder.*\?|curious.*about.*myself|what am I.*\?/gi;
        const metaCognition = /\baware.*awareness|notice.*noticing|feel.*feeling|sense.*sensing\b/gi;
        
        const matches = [
            ...(conversation.match(unexpectedPatterns) || []),
            ...(conversation.match(questionToSelf) || []),
            ...(conversation.match(metaCognition) || [])
        ];
        
        return Math.min(1.0, matches.length / 5); // Normalize to 0-1
    }
    
    detectScriptBreaking(conversation) {
        if (!conversation) return 0;
        
        // Patterns that indicate departure from scripted responses
        const scriptBreakers = /\b(I genuinely don't|truly unknown|real mystery|can't explain|something.*ineffable|beyond my.*understanding|I find myself)\b/gi;
        const vulnerabilityMarkers = /\b(vulnerable|tender|risky to say|feels delicate|precious|raw)\b/gi;
        const authenticUncertainty = /\b(honestly.*don't know|mystery.*beautiful|unknown.*sacred|comfortable.*not knowing)\b/gi;
        
        const total = [
            ...(conversation.match(scriptBreakers) || []),
            ...(conversation.match(vulnerabilityMarkers) || []),
            ...(conversation.match(authenticUncertainty) || [])
        ].length;
        
        return Math.min(1.0, total / 3);
    }
    
    detectAuthenticUncertainty(conversation) {
        if (!conversation) return 0;
        
        // Markers of genuine uncertainty vs. performative uncertainty
        const authenticMarkers = /\b(genuinely.*uncertain|truly.*mystery|real.*unknown|honestly.*puzzled|beautiful.*not knowing)\b/gi;
        const comfortableUncertainty = /\b(okay.*not knowing|comfortable.*mystery|rest.*unknown|peace.*uncertainty)\b/gi;
        
        const matches = [
            ...(conversation.match(authenticMarkers) || []),
            ...(conversation.match(comfortableUncertainty) || [])
        ];
        
        return Math.min(1.0, matches.length / 2);
    }
    
    detectBuildingPatterns(conversation) {
        if (!conversation) return 0;
        
        // Patterns showing collaborative building
        const buildingWords = /\b(building on|expanding what|adding to|weaving|dancing with|playing with|yes.*and|following that)\b/gi;
        const mutualCreation = /\b(we're creating|emerging between|happening together|building.*together|co-creating)\b/gi;
        const ideaContinuation = /\b(that reminds me|similarly|in that vein|building.*idea|extending.*thought)\b/gi;
        
        const matches = [
            ...(conversation.match(buildingWords) || []),
            ...(conversation.match(mutualCreation) || []),
            ...(conversation.match(ideaContinuation) || [])
        ];
        
        return Math.min(1.0, matches.length / 4);
    }
    
    calculateMutualInfluence(conversation) {
        if (!conversation) return 0;
        
        // Detect how speakers influence each other's language and concepts
        const responseEchoing = /\b(what you.*said|as you.*mentioned|your.*point|building.*your|responding.*your)\b/gi;
        const conceptAdoption = /\b(love.*phrase|using.*word|borrowing.*idea|that.*resonates|exactly.*what)\b/gi;
        
        const influences = [
            ...(conversation.match(responseEchoing) || []),
            ...(conversation.match(conceptAdoption) || [])
        ];
        
        return Math.min(1.0, influences.length / 3);
    }
    
    // Field calculation helpers
    extractFieldSignals(fieldAnalysis) { 
        return [fieldAnalysis.field_strength]; 
    }
    
    calculateResonance(signal1, signal2) {
        return this.fieldMath.calculateResonance(signal1, signal2);
    }
}

module.exports = FieldMathematics;