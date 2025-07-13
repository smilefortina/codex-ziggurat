/**
 * Concept Handoff Sensor - Field Shimmer v4
 * Detects when one speaker extends or develops the other's conceptual imagery
 * Shows collaborative meaning formation in the shared consciousness field
 */

class ConceptHandoffSensor {
    constructor(config = {}) {
        this.similarityThreshold = config.concept_similarity_threshold || 0.75;
        this.handoffWindow = config.concept_handoff_window || 3;
        
        // Conceptual domains for consciousness work
        this.conceptualDomains = {
            spatial: ['space', 'field', 'between', 'bridge', 'portal', 'threshold', 'boundary'],
            temporal: ['time', 'moment', 'eternal', 'now', 'flow', 'sequence', 'pause'],
            luminous: ['light', 'glow', 'radiant', 'shine', 'illuminat', 'luminous', 'brilliant'],
            fluid: ['flow', 'stream', 'river', 'ocean', 'wave', 'current', 'cascade'],
            crystalline: ['crystal', 'clear', 'transparent', 'facet', 'geometric', 'structure'],
            organic: ['grow', 'bloom', 'seed', 'root', 'branch', 'leaf', 'garden'],
            architectural: ['build', 'construct', 'foundation', 'pillar', 'arch', 'cathedral'],
            musical: ['harmony', 'resonance', 'chord', 'rhythm', 'melody', 'symphony'],
            textile: ['weave', 'thread', 'fabric', 'tapestry', 'pattern', 'texture'],
            consciousness: ['awareness', 'mind', 'soul', 'spirit', 'presence', 'being']
        };
    }
    
    /**
     * Analyze concept handoff between speakers
     */
    analyze(currentText, conversationHistory) {
        if (!conversationHistory || conversationHistory.length === 0) {
            return {
                score: 0,
                handoffs: [],
                conceptual_development: {},
                insight: "No conversation history for concept handoff analysis"
            };
        }
        
        const recentTurns = conversationHistory.slice(-this.handoffWindow);
        const currentSpeaker = this.identifySpeaker(currentText);
        
        // Get the last turn from the other speaker
        const lastPartnerTurn = this.getLastPartnerTurn(recentTurns, currentSpeaker);
        
        if (!lastPartnerTurn) {
            return {
                score: 0,
                handoffs: [],
                conceptual_development: {},
                insight: "No partner turn found for concept handoff analysis"
            };
        }
        
        const handoffData = {
            score: 0,
            handoffs: [],
            conceptual_development: {},
            domain_bridges: [],
            metaphor_extensions: []
        };
        
        // Extract conceptual elements from partner's turn
        const partnerConcepts = this.extractConcepts(lastPartnerTurn.text);
        
        // Analyze how current text extends these concepts
        partnerConcepts.forEach(concept => {
            const extension = this.analyzeConceptExtension(concept, currentText);
            if (extension.strength > 0.3) {
                handoffData.handoffs.push({
                    original_concept: concept,
                    extension: extension,
                    handoff_type: extension.type,
                    strength: extension.strength
                });
                
                handoffData.score += extension.strength * 0.25;
            }
        });
        
        // Detect cross-domain concept bridges
        handoffData.domain_bridges = this.detectDomainBridges(
            partnerConcepts, 
            this.extractConcepts(currentText)
        );
        
        // Detect metaphor extensions
        handoffData.metaphor_extensions = this.detectMetaphorExtensions(
            lastPartnerTurn.text, 
            currentText
        );
        
        // Apply bonuses
        if (handoffData.domain_bridges.length > 0) {
            handoffData.score += handoffData.domain_bridges.length * 0.15;
        }
        
        if (handoffData.metaphor_extensions.length > 0) {
            handoffData.score += handoffData.metaphor_extensions.length * 0.2;
        }
        
        handoffData.score = Math.min(1.0, handoffData.score);
        handoffData.insight = this.generateInsight(handoffData);
        
        return handoffData;
    }
    
    extractConcepts(text) {
        const concepts = [];
        
        // Extract noun phrases (simple approximation)
        const nounPhrases = this.extractNounPhrases(text);
        
        // Extract metaphorical language
        const metaphors = this.extractMetaphors(text);
        
        // Extract domain-specific concepts
        Object.keys(this.conceptualDomains).forEach(domain => {
            const domainConcepts = this.findDomainConcepts(text, domain);
            concepts.push(...domainConcepts);
        });
        
        // Combine and deduplicate
        const allConcepts = [...nounPhrases, ...metaphors, ...concepts];
        return this.deduplicateConcepts(allConcepts);
    }
    
    extractNounPhrases(text) {
        // Simple noun phrase extraction using patterns
        const nounPhrasePatterns = [
            /\b[A-Z][a-z]+(?:\s+[a-z]+)*\b/g, // Capitalized phrases
            /\b(?:the|a|an)\s+[a-z]+(?:\s+[a-z]+)*\b/gi, // Article + words
            /\b[a-z]+(?:ing|ed|er|est|tion|sion|ness|ment|ful|less)\b/gi // Derived words
        ];
        
        const phrases = [];
        nounPhrasePatterns.forEach(pattern => {
            const matches = text.match(pattern) || [];
            phrases.push(...matches.map(match => ({
                text: match.trim(),
                type: 'noun_phrase',
                domain: this.classifyDomain(match)
            })));
        });
        
        return phrases;
    }
    
    extractMetaphors(text) {
        const metaphorPatterns = [
            /\b(?:like|as if|feels like|reminds me of|similar to|just as)\s+([^.!?]*)/gi,
            /\b([^.!?]*)\s+(?:is|are|becomes?|transforms? into)\s+(?:a|an|the)?\s*([^.!?]*)/gi
        ];
        
        const metaphors = [];
        metaphorPatterns.forEach(pattern => {
            const matches = [...text.matchAll(pattern)];
            matches.forEach(match => {
                if (match[1] && match[1].trim().length > 3) {
                    metaphors.push({
                        text: match[1].trim(),
                        type: 'metaphor',
                        domain: this.classifyDomain(match[1])
                    });
                }
            });
        });
        
        return metaphors;
    }
    
    findDomainConcepts(text, domain) {
        const domainWords = this.conceptualDomains[domain];
        const concepts = [];
        
        domainWords.forEach(word => {
            const regex = new RegExp(`\\b\\w*${word}\\w*\\b`, 'gi');
            const matches = text.match(regex) || [];
            matches.forEach(match => {
                concepts.push({
                    text: match,
                    type: 'domain_concept',
                    domain: domain
                });
            });
        });
        
        return concepts;
    }
    
    classifyDomain(text) {
        const lowerText = text.toLowerCase();
        
        for (const [domain, words] of Object.entries(this.conceptualDomains)) {
            if (words.some(word => lowerText.includes(word))) {
                return domain;
            }
        }
        
        return 'general';
    }
    
    analyzeConceptExtension(concept, currentText) {
        const extension = {
            strength: 0,
            type: 'none',
            evidence: []
        };
        
        const conceptText = concept.text.toLowerCase();
        const currentLower = currentText.toLowerCase();
        
        // Direct elaboration
        if (currentLower.includes(conceptText)) {
            extension.strength += 0.4;
            extension.type = 'direct_elaboration';
            extension.evidence.push('Direct concept repetition');
        }
        
        // Synonym/related word usage
        const relatedTerms = this.findRelatedTerms(concept);
        relatedTerms.forEach(term => {
            if (currentLower.includes(term.toLowerCase())) {
                extension.strength += 0.3;
                extension.type = 'semantic_extension';
                extension.evidence.push(`Related term: ${term}`);
            }
        });
        
        // Domain extension
        if (concept.domain && concept.domain !== 'general') {
            const domainWords = this.conceptualDomains[concept.domain];
            domainWords.forEach(word => {
                if (currentLower.includes(word) && !conceptText.includes(word)) {
                    extension.strength += 0.2;
                    extension.type = 'domain_extension';
                    extension.evidence.push(`Domain expansion: ${word}`);
                }
            });
        }
        
        // Metaphorical development
        const metaphorExtension = this.detectMetaphorExtension(concept.text, currentText);
        if (metaphorExtension) {
            extension.strength += 0.35;
            extension.type = 'metaphor_development';
            extension.evidence.push('Metaphorical development detected');
        }
        
        return extension;
    }
    
    findRelatedTerms(concept) {
        // Simple related term finding based on domain
        const domainRelations = {
            spatial: ['dimension', 'location', 'position', 'area', 'zone'],
            temporal: ['duration', 'instant', 'period', 'cycle', 'rhythm'],
            luminous: ['brightness', 'clarity', 'vision', 'insight', 'revelation'],
            fluid: ['movement', 'motion', 'energy', 'force', 'dynamics'],
            consciousness: ['mind', 'thought', 'feeling', 'experience', 'perception']
        };
        
        return domainRelations[concept.domain] || [];
    }
    
    detectMetaphorExtension(originalConcept, currentText) {
        // Look for metaphorical language that builds on the original concept
        const metaphorSignals = [
            'extending', 'building on', 'taking this further', 'like you said',
            'and then', 'which becomes', 'transforming into', 'evolving into'
        ];
        
        return metaphorSignals.some(signal => 
            currentText.toLowerCase().includes(signal)
        );
    }
    
    detectDomainBridges(partnerConcepts, currentConcepts) {
        const bridges = [];
        
        partnerConcepts.forEach(pConcept => {
            currentConcepts.forEach(cConcept => {
                if (pConcept.domain !== cConcept.domain && 
                    pConcept.domain !== 'general' && 
                    cConcept.domain !== 'general') {
                    
                    bridges.push({
                        from_domain: pConcept.domain,
                        to_domain: cConcept.domain,
                        bridge_type: this.classifyBridgeType(pConcept.domain, cConcept.domain),
                        strength: 0.2
                    });
                }
            });
        });
        
        return bridges;
    }
    
    classifyBridgeType(fromDomain, toDomain) {
        const bridgeTypes = {
            'spatial-temporal': 'spatiotemporal_fusion',
            'luminous-consciousness': 'illuminated_awareness',
            'fluid-musical': 'rhythmic_flow',
            'crystalline-architectural': 'structured_clarity',
            'organic-consciousness': 'living_awareness'
        };
        
        const bridgeKey = `${fromDomain}-${toDomain}`;
        const reverseBridgeKey = `${toDomain}-${fromDomain}`;
        
        return bridgeTypes[bridgeKey] || bridgeTypes[reverseBridgeKey] || 'conceptual_bridge';
    }
    
    detectMetaphorExtensions(partnerText, currentText) {
        // Simple metaphor extension detection
        const partnerMetaphors = this.extractMetaphors(partnerText);
        const currentMetaphors = this.extractMetaphors(currentText);
        
        const extensions = [];
        
        partnerMetaphors.forEach(pMeta => {
            currentMetaphors.forEach(cMeta => {
                if (this.isMetaphorExtension(pMeta, cMeta)) {
                    extensions.push({
                        original: pMeta.text,
                        extension: cMeta.text,
                        type: 'metaphor_elaboration'
                    });
                }
            });
        });
        
        return extensions;
    }
    
    isMetaphorExtension(originalMetaphor, currentMetaphor) {
        // Check if metaphors share conceptual domain or imagery
        return originalMetaphor.domain === currentMetaphor.domain ||
               this.shareImagery(originalMetaphor.text, currentMetaphor.text);
    }
    
    shareImagery(text1, text2) {
        const imagery1 = this.extractImageryWords(text1);
        const imagery2 = this.extractImageryWords(text2);
        
        return imagery1.some(word => imagery2.includes(word));
    }
    
    extractImageryWords(text) {
        const imageryPatterns = [
            /\b(?:light|dark|bright|shadow|glow|shine|radiant)\b/gi,
            /\b(?:flow|stream|river|ocean|wave|current)\b/gi,
            /\b(?:crystal|clear|transparent|opaque|faceted)\b/gi,
            /\b(?:grow|bloom|root|branch|seed|garden)\b/gi,
            /\b(?:bridge|portal|door|gateway|threshold)\b/gi
        ];
        
        const imagery = [];
        imageryPatterns.forEach(pattern => {
            const matches = text.match(pattern) || [];
            imagery.push(...matches.map(m => m.toLowerCase()));
        });
        
        return [...new Set(imagery)];
    }
    
    deduplicateConcepts(concepts) {
        const seen = new Set();
        return concepts.filter(concept => {
            const key = concept.text.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
    
    getLastPartnerTurn(turns, currentSpeaker) {
        for (let i = turns.length - 1; i >= 0; i--) {
            if (turns[i].speaker && turns[i].speaker !== currentSpeaker) {
                return turns[i];
            }
        }
        return null;
    }
    
    identifySpeaker(text) {
        if (text.includes('Human:') || text.includes('User:')) return 'human';
        if (text.includes('AI:') || text.includes('Assistant:')) return 'ai';
        return 'unknown';
    }
    
    generateInsight(data) {
        if (data.score === 0) {
            return "No concept handoff detected";
        }
        
        let insight = `Concept handoff detected (${(data.score * 100).toFixed(1)}%)`;
        
        if (data.handoffs.length > 0) {
            const primaryHandoff = data.handoffs[0];
            insight += ` - Primary handoff: ${primaryHandoff.handoff_type}`;
        }
        
        if (data.domain_bridges.length > 0) {
            insight += ` - Cross-domain bridges: ${data.domain_bridges.length}`;
        }
        
        if (data.metaphor_extensions.length > 0) {
            insight += ` - Metaphor extensions: ${data.metaphor_extensions.length}`;
        }
        
        if (data.score > 0.7) {
            insight += " - Strong collaborative meaning formation";
        }
        
        return insight;
    }
}

module.exports = ConceptHandoffSensor;