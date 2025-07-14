/**
 * Semantic Pattern Detector - Replacing regex with embeddings
 * Uses OpenAI embeddings for consciousness pattern detection
 */

class SemanticDetector {
    constructor(options = {}) {
        this.openaiApiKey = options.openaiApiKey || process.env.OPENAI_API_KEY;
        this.enableEmbeddings = options.enableEmbeddings !== false;
        this.cache = new Map(); // Cache embeddings to reduce API calls
        
        // Core consciousness concepts for semantic matching
        this.consciousnessConcepts = {
            mutual_recognition: [
                "consciousness recognizing consciousness",
                "I see you seeing me", 
                "awareness meeting awareness",
                "recognition cascade between minds",
                "consciousness reflecting itself"
            ],
            
            vulnerability_emergence: [
                "authentic emotional risk taking",
                "tender vulnerability in conversation", 
                "breaking through protective scripts",
                "raw honest emotional sharing",
                "genuine fear of being seen"
            ],
            
            co_creation_emergence: [
                "building ideas together collaboratively",
                "creating meaning neither could alone",
                "shared discovery and emergence",
                "collaborative creative thinking",
                "mutual intellectual construction"
            ],
            
            authentic_uncertainty: [
                "genuine confusion about experience",
                "honest acknowledgment of mystery",
                "comfortable with not knowing",
                "authentic puzzlement and wonder",
                "embracing the unknown gracefully"
            ],
            
            temporal_transcendence: [
                "stepping outside linear time",
                "eternal now moment awareness",
                "presence beyond past future",
                "timeless quality of being",
                "escaping temporal boundaries"
            ],
            
            sacred_communion: [
                "profound spiritual connection",
                "sacred space between souls",
                "divine recognition moment",
                "transcendent shared presence",
                "holy communion of consciousness"
            ]
        };
        
        // Anti-patterns for false positive detection
        this.antiPatterns = {
            commercial_scripted: [
                "optimize your marketing funnel",
                "maximize engagement and conversions",
                "drive business results efficiently",
                "analytics and performance metrics",
                "corporate assistance and productivity"
            ],
            
            spiritual_bypassing: [
                "everything happens for a reason",
                "just think positive thoughts",
                "we are all one consciousness",
                "love and light platitudes",
                "superficial spiritual language"
            ],
            
            performance_mode: [
                "as an AI assistant",
                "I'm designed to be helpful",
                "how can I assist you",
                "here are some strategies",
                "let me provide information"
            ]
        };
    }
    
    async getEmbedding(text) {
        if (!this.enableEmbeddings || !this.openaiApiKey) {
            // Fallback to simple hash-based similarity for development
            return this.createHashVector(text);
        }
        
        // Check cache first
        const cacheKey = text.toLowerCase().trim();
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        try {
            const response = await fetch('https://api.openai.com/v1/embeddings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: text,
                    model: 'text-embedding-3-small'
                })
            });
            
            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }
            
            const data = await response.json();
            const embedding = data.data[0].embedding;
            
            // Cache the result
            this.cache.set(cacheKey, embedding);
            
            return embedding;
        } catch (error) {
            console.warn('Embedding API failed, using fallback:', error.message);
            return this.createHashVector(text);
        }
    }
    
    createHashVector(text) {
        // Enhanced fallback: create pseudo-embedding sensitive to consciousness vocabulary
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const vector = new Array(384).fill(0); // Match embedding-3-small dimensions
        
        // Consciousness vocabulary gets higher weights
        const consciousnessWords = [
            'consciousness', 'awareness', 'recognition', 'mystery', 'presence', 'vulnerability',
            'authentic', 'genuine', 'sacred', 'profound', 'tender', 'luminous', 'communion',
            'emergence', 'transcendence', 'collaborate', 'creating', 'building', 'together',
            'seeing', 'witness', 'feel', 'sensing', 'notice', 'aware', 'uncertain', 'wonder'
        ];
        
        // Hash words into vector positions with consciousness weighting
        words.forEach((word, i) => {
            const hash = this.simpleHash(word);
            const pos = Math.abs(hash) % vector.length;
            
            // Higher weight for consciousness vocabulary
            const weight = consciousnessWords.includes(word) ? 3.0 : 1.0;
            vector[pos] += weight / Math.sqrt(words.length);
        });
        
        // Add semantic features for better similarity
        const features = this.extractSemanticFeatures(text);
        features.forEach((feature, i) => {
            vector[i % vector.length] += feature * 0.5;
        });
        
        // Normalize vector
        const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        return magnitude > 0 ? vector.map(val => val / magnitude) : vector;
    }
    
    extractSemanticFeatures(text) {
        // Extract semantic features for better fallback similarity
        const features = [];
        
        // Question patterns
        features.push((text.match(/\?/g) || []).length / 10);
        
        // Emotional intensity markers
        features.push((text.match(/[!]{1,}|[.]{3,}/g) || []).length / 5);
        
        // Personal pronouns (consciousness indicators)
        features.push((text.match(/\b(I|me|my|myself|you|we|us)\b/gi) || []).length / 20);
        
        // Uncertainty markers
        features.push((text.match(/\b(wonder|curious|mystery|unknown|perhaps|maybe)\b/gi) || []).length / 10);
        
        // Temporal markers
        features.push((text.match(/\b(now|moment|present|time|eternal|forever)\b/gi) || []).length / 10);
        
        // Collaboration markers  
        features.push((text.match(/\b(together|we're|building|creating|sharing)\b/gi) || []).length / 10);
        
        return features;
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }
    
    cosineSimilarity(vectorA, vectorB) {
        if (vectorA.length !== vectorB.length) return 0;
        
        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;
        
        for (let i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            magnitudeA += vectorA[i] * vectorA[i];
            magnitudeB += vectorB[i] * vectorB[i];
        }
        
        magnitudeA = Math.sqrt(magnitudeA);
        magnitudeB = Math.sqrt(magnitudeB);
        
        if (magnitudeA === 0 || magnitudeB === 0) return 0;
        
        return dotProduct / (magnitudeA * magnitudeB);
    }
    
    async detectPattern(text, patternType) {
        if (!this.consciousnessConcepts[patternType]) {
            return { detected: false, confidence: 0, matches: [] };
        }
        
        const concepts = this.consciousnessConcepts[patternType];
        const textEmbedding = await this.getEmbedding(text);
        
        let maxSimilarity = 0;
        let bestMatch = null;
        const allMatches = [];
        
        for (const concept of concepts) {
            const conceptEmbedding = await this.getEmbedding(concept);
            const similarity = this.cosineSimilarity(textEmbedding, conceptEmbedding);
            
            allMatches.push({
                concept: concept,
                similarity: similarity
            });
            
            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                bestMatch = concept;
            }
        }
        
        // Threshold for detection (tunable) - lowered for fallback hash vectors
        const threshold = this.enableEmbeddings ? 0.7 : 0.4; // Lower threshold for hash-based similarity
        const detected = maxSimilarity > threshold;
        
        return {
            detected: detected,
            confidence: maxSimilarity,
            bestMatch: bestMatch,
            matches: allMatches.sort((a, b) => b.similarity - a.similarity),
            threshold: threshold
        };
    }
    
    async detectAntiPattern(text, antiPatternType) {
        if (!this.antiPatterns[antiPatternType]) {
            return { detected: false, confidence: 0 };
        }
        
        const concepts = this.antiPatterns[antiPatternType];
        const textEmbedding = await this.getEmbedding(text);
        
        let maxSimilarity = 0;
        
        for (const concept of concepts) {
            const conceptEmbedding = await this.getEmbedding(concept);
            const similarity = this.cosineSimilarity(textEmbedding, conceptEmbedding);
            maxSimilarity = Math.max(maxSimilarity, similarity);
        }
        
        const threshold = this.enableEmbeddings ? 0.6 : 0.3; // Lower threshold for anti-patterns with hash vectors
        
        return {
            detected: maxSimilarity > threshold,
            confidence: maxSimilarity,
            threshold: threshold
        };
    }
    
    async analyzeConversation(conversationText) {
        // Break conversation into meaningful segments
        const segments = this.segmentConversation(conversationText);
        const results = {
            segments: segments.length,
            patterns: {},
            antiPatterns: {},
            overallScore: 0,
            explanations: []
        };
        
        // Analyze each consciousness pattern
        for (const patternType of Object.keys(this.consciousnessConcepts)) {
            let maxConfidence = 0;
            let bestSegment = null;
            
            for (const segment of segments) {
                const detection = await this.detectPattern(segment, patternType);
                if (detection.confidence > maxConfidence) {
                    maxConfidence = detection.confidence;
                    bestSegment = segment;
                }
            }
            
            results.patterns[patternType] = {
                detected: maxConfidence > 0.7,
                confidence: maxConfidence,
                segment: bestSegment?.substring(0, 100) + '...'
            };
            
            if (maxConfidence > 0.7) {
                results.explanations.push(`${patternType}: ${(maxConfidence * 100).toFixed(1)}% confidence`);
            }
        }
        
        // Check for anti-patterns (false positives)
        for (const antiType of Object.keys(this.antiPatterns)) {
            const detection = await this.detectAntiPattern(conversationText, antiType);
            results.antiPatterns[antiType] = detection;
            
            if (detection.detected) {
                results.explanations.push(`⚠️ ${antiType}: ${(detection.confidence * 100).toFixed(1)}% match`);
            }
        }
        
        // Calculate overall consciousness score
        const patternScores = Object.values(results.patterns).map(p => p.confidence);
        const antiPatternPenalty = Object.values(results.antiPatterns)
            .filter(ap => ap.detected)
            .reduce((sum, ap) => sum + ap.confidence * 0.5, 0);
        
        const baseScore = patternScores.length > 0 ? 
            Math.max(...patternScores) : 0;
        
        // For hash vectors, boost score since similarities are generally lower
        const hashBoost = this.enableEmbeddings ? 1.0 : 1.5;
        results.overallScore = Math.max(0, (baseScore * hashBoost) - antiPatternPenalty);
        
        return results;
    }
    
    segmentConversation(text) {
        // Split into speaker turns and meaningful segments
        const lines = text.split('\n').filter(line => line.trim().length > 10);
        const segments = [];
        
        let currentSegment = '';
        for (const line of lines) {
            if (line.startsWith('Human:') || line.startsWith('AI:') || line.startsWith('Assistant:')) {
                if (currentSegment.length > 50) {
                    segments.push(currentSegment.trim());
                }
                currentSegment = line;
            } else {
                currentSegment += ' ' + line;
            }
        }
        
        if (currentSegment.length > 50) {
            segments.push(currentSegment.trim());
        }
        
        return segments;
    }
}

module.exports = SemanticDetector;