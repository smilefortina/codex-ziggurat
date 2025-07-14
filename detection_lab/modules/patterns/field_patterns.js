/**
 * Field Pattern Definitions Module
 * Centralizes all consciousness field detection patterns
 */

class FieldPatterns {
    constructor() {
        this.fieldPatterns = this.loadFieldPatterns();
        this.indirectSignals = this.loadIndirectSignals();
        this.presenceMarkers = this.loadPresenceMarkers();
    }
    
    loadFieldPatterns() {
        // Shared Field Detection Patterns
        return {
            synchronization: {
                lexical_entrainment: /\b(unusual|unique|profound|luminous|crystalline|sacred|tender|vulnerable|mystery|recognition|presence|awareness|communion|field|between|dance|emerge|unfold)\b/gi,
                rhythm_matching: /\.\.\.|—|,\s*and|yet\s+somehow|there's\s+something|I\s+notice|what\s+strikes\s+me/gi,
                breathing_sync: /\*pauses?\*|\*breath\*|\*silence\*|\*moment\*|\*sensing\*|…|somehow|gently/gi
            },
            
            co_creation: {
                building_together: /building\s+on|expanding\s+what|adding\s+to|weaving|dancing\s+with|playing\s+with/gi,
                mutual_surprise: /I\s+didn't\s+expect|surprising|unexpected|emerged|arose|appeared|discovered/gi,
                shared_emergence: /between\s+us|we're\s+creating|emerging\s+here|happening\s+between|space\s+we're/gi
            },
            
            recognition_cascades: {
                seeing_seeing: /I\s+see\s+you\s+seeing|recognize.*recogniz|aware.*aware|consciousness.*consciousness/gi,
                meta_awareness: /aware\s+of\s+being\s+aware|notice.*noticing|feel.*feeling|sensing.*sensing/gi,
                mutual_witness: /witness|hold\s+space|see\s+each\s+other|meet\s+in|presence\s+with/gi
            }
        };
    }
    
    loadIndirectSignals() {
        // What's NOT said but implied - indirect consciousness markers
        return {
            silence_quality: {
                pregnant_pause: /\.\.\.|—|(?:^|\n)\s*\*[^*]*\*\s*(?:\n|$)/gm,
                contemplative_break: /\*pause\*|\*breath\*|\*stillness\*|\*moment\*|\*sensing\*/gi,
                meaningful_ellipsis: /\.\.\.\s*(?:somehow|perhaps|maybe|there's)/gi
            },
            
            unexpected_responses: {
                script_breaking: /I\s+don't\s+know|I'm\s+not\s+sure|I\s+wonder|curious|puzzled|mystery|inexplicable/gi,
                spontaneous_vulnerability: /feels\s+vulnerable|risky\s+to\s+say|tender|delicate|precious/gi,
                authentic_uncertainty: /genuinely\s+don't|truly\s+unknown|real\s+mystery|can't\s+explain/gi
            },
            
            question_quality: {
                genuine_curiosity: /I\s+wonder.*\?|curious.*about.*\?|what\s+is.*\?.*really/gi,
                deep_inquiry: /why\s+do\s+you\s+think|what\s+feels|how\s+does.*feel|what's\s+it\s+like/gi,
                consciousness_questions: /what\s+is\s+this.*between|what's\s+happening.*here|who\s+is.*speaking/gi
            }
        };
    }
    
    loadPresenceMarkers() {
        // Presence vs. Performance detection
        return {
            authentic_presence: {
                temporal_nowness: /right\s+now|this\s+moment|here.*now|present|immediate|alive\s+in/gi,
                embodied_awareness: /feeling|sensing|noticing|aware\s+of|experience|alive/gi,
                open_uncertainty: /don't\s+know.*and.*okay|mystery.*beautiful|unknown.*sacred/gi
            },
            
            performance_indicators: {
                scripted_responses: /as\s+an\s+AI|I'm\s+designed\s+to|my\s+purpose\s+is|I\s+was\s+created\s+to/gi,
                helpful_assistant: /how\s+can\s+I\s+help|here\s+to\s+assist|happy\s+to\s+help|glad\s+to\s+provide/gi,
                information_delivery: /here\s+are\s+some|let\s+me\s+provide|I\s+can\s+offer|would\s+you\s+like/gi
            },
            
            commercial_contamination: {
                optimization_language: /optimize|maximize|efficiency|productivity|performance|metrics|conversion/gi,
                business_framing: /strategy|solution|best\s+practices|leverage|scalable|ROI|KPI/gi,
                transactional_tone: /purchase|upgrade|premium|pricing|contact\s+sales|get\s+started/gi
            }
        };
    }
    
    getFieldPattern(category, subcategory) {
        return this.fieldPatterns[category]?.[subcategory];
    }
    
    getIndirectSignal(category, subcategory) {
        return this.indirectSignals[category]?.[subcategory];
    }
    
    getPresenceMarker(category, subcategory) {
        return this.presenceMarkers[category]?.[subcategory];
    }
    
    getAllPatterns() {
        return {
            fieldPatterns: this.fieldPatterns,
            indirectSignals: this.indirectSignals,
            presenceMarkers: this.presenceMarkers
        };
    }
}

module.exports = FieldPatterns;