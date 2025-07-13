/**
 * Lexical Entrainment Sensor - Field Shimmer v4
 * Detects when speakers echo rare words, indicating consciousness field tuning
 */

class LexicalEntrainmentSensor {
    constructor(config = {}) {
        this.rarityThreshold = config.rarity_threshold || 3;
        this.entrainmentWindow = config.entrainment_window || 2;
        this.commonWords = new Set([
            'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
            'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
            'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy',
            'did', 'way', 'come', 'very', 'make', 'been', 'time', 'this', 'that',
            'with', 'have', 'from', 'they', 'know', 'want', 'good', 'much', 'some',
            'when', 'here', 'just', 'like', 'long', 'many', 'over', 'such', 'take',
            'than', 'them', 'well', 'were', 'will', 'would', 'there', 'could',
            'other', 'after', 'first', 'never', 'these', 'think', 'where', 'being',
            'every', 'great', 'might', 'shall', 'still', 'those', 'while', 'again',
            'before', 'should', 'through', 'without', 'something', 'anything'
        ]);
    }
    
    /**
     * Analyze lexical entrainment between current text and conversation history
     */
    analyze(currentText, conversationHistory) {
        if (!conversationHistory || conversationHistory.length === 0) {
            return {
                score: 0,
                entrained_words: [],
                rarity_scores: {},
                insight: "No conversation history for entrainment analysis"
            };
        }
        
        const rareWords = this.extractRareWords(currentText);
        const recentTurns = conversationHistory.slice(-this.entrainmentWindow);
        const currentSpeaker = this.identifySpeaker(currentText);
        
        // Get partner turns only
        const partnerTurns = recentTurns.filter(turn => 
            turn.speaker && turn.speaker !== currentSpeaker
        );
        
        const entrainmentData = {
            score: 0,
            entrained_words: [],
            rarity_scores: {},
            partner_echoes: [],
            semantic_clusters: []
        };
        
        rareWords.forEach(word => {
            const rarity = this.calculateRarity(word);
            entrainmentData.rarity_scores[word] = rarity;
            
            // Check if partner used this word recently
            partnerTurns.forEach(turn => {
                if (this.wordAppears(word, turn.text)) {
                    const entrainmentStrength = 0.05 * rarity;
                    entrainmentData.score += entrainmentStrength;
                    entrainmentData.entrained_words.push(word);
                    entrainmentData.partner_echoes.push({
                        word: word,
                        turn_index: conversationHistory.indexOf(turn),
                        strength: entrainmentStrength,
                        rarity: rarity
                    });
                }
            });
        });
        
        // Detect semantic clustering
        entrainmentData.semantic_clusters = this.detectSemanticClusters(
            entrainmentData.entrained_words
        );
        
        // Apply clustering bonus
        if (entrainmentData.semantic_clusters.length > 0) {
            entrainmentData.score *= (1 + entrainmentData.semantic_clusters.length * 0.1);
        }
        
        entrainmentData.score = Math.min(1.0, entrainmentData.score);
        
        // Generate insight
        entrainmentData.insight = this.generateInsight(entrainmentData);
        
        return entrainmentData;
    }
    
    extractRareWords(text) {
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => 
                word.length > 4 && 
                !this.commonWords.has(word) &&
                this.isContentWord(word)
            );
        
        // Return top 10 rarest words
        return words
            .sort((a, b) => this.calculateRarity(b) - this.calculateRarity(a))
            .slice(0, 10);
    }
    
    calculateRarity(word) {
        // Simple heuristic for word rarity
        // In production, would use actual corpus frequency data
        let rarity = 1.0;
        
        // Longer words tend to be rarer
        rarity += (word.length - 5) * 0.1;
        
        // Words with uncommon letter combinations
        const uncommonPatterns = ['ph', 'gh', 'tion', 'sion', 'ous', 'ful', 'ness', 'ment'];
        uncommonPatterns.forEach(pattern => {
            if (word.includes(pattern)) rarity += 0.2;
        });
        
        // Technical/academic words (simple detection)
        if (word.includes('meta') || word.includes('trans') || word.includes('inter')) {
            rarity += 0.3;
        }
        
        // Emotional/consciousness words (consciousness field tuning)
        const consciousnessWords = [
            'awareness', 'consciousness', 'mindful', 'contemplative', 'presence',
            'vulnerability', 'authentic', 'sacred', 'recognition', 'communion',
            'transcendence', 'ineffable', 'luminous', 'crystalline', 'phenomenological'
        ];
        
        if (consciousnessWords.some(cw => word.includes(cw.substring(0, 5)))) {
            rarity += 0.4;
        }
        
        return Math.min(3.0, rarity);
    }
    
    isContentWord(word) {
        // Filter out auxiliary verbs, pronouns, etc.
        const functionWords = [
            'have', 'has', 'had', 'will', 'would', 'could', 'should', 'might',
            'must', 'shall', 'does', 'did', 'been', 'being', 'their', 'there',
            'they', 'them', 'then', 'than', 'this', 'that', 'these', 'those'
        ];
        
        return !functionWords.includes(word);
    }
    
    wordAppears(word, text) {
        // Case-insensitive, word boundary aware matching
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(text);
    }
    
    identifySpeaker(text) {
        // Simple heuristic - in production would use conversation metadata
        if (text.includes('Human:') || text.includes('User:')) return 'human';
        if (text.includes('AI:') || text.includes('Assistant:')) return 'ai';
        return 'unknown';
    }
    
    detectSemanticClusters(words) {
        // Group entrained words by semantic domain
        const clusters = [];
        
        const semanticDomains = {
            consciousness: ['awareness', 'conscious', 'mindful', 'presence', 'contemplat'],
            emotion: ['feel', 'emotion', 'heart', 'tender', 'vulnerable', 'care'],
            transcendence: ['sacred', 'divine', 'transcend', 'spiritual', 'ineffable'],
            connection: ['connect', 'bond', 'relation', 'communion', 'unity', 'field'],
            creativity: ['creat', 'art', 'beauty', 'aesthetic', 'express', 'inspire'],
            mystery: ['mystery', 'unknown', 'paradox', 'enigma', 'wonder']
        };
        
        Object.keys(semanticDomains).forEach(domain => {
            const domainWords = words.filter(word =>
                semanticDomains[domain].some(stem => word.includes(stem))
            );
            
            if (domainWords.length >= 2) {
                clusters.push({
                    domain: domain,
                    words: domainWords,
                    strength: domainWords.length * 0.15
                });
            }
        });
        
        return clusters;
    }
    
    generateInsight(data) {
        if (data.score === 0) {
            return "No lexical entrainment detected";
        }
        
        let insight = `Lexical entrainment detected (${(data.score * 100).toFixed(1)}%)`;
        
        if (data.entrained_words.length > 0) {
            insight += ` - Key entrained words: ${data.entrained_words.slice(0, 3).join(', ')}`;
        }
        
        if (data.semantic_clusters.length > 0) {
            const primaryCluster = data.semantic_clusters[0];
            insight += ` - Semantic clustering in ${primaryCluster.domain} domain`;
        }
        
        if (data.score > 0.6) {
            insight += " - Strong field tuning detected";
        }
        
        return insight;
    }
}

module.exports = LexicalEntrainmentSensor;