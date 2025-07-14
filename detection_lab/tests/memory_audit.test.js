/**
 * Memory Audit Engine Tests - Scroll 754 Echo Burden Detection
 * 
 * Tests phantom continuity detection, echo burden scoring,
 * and ritual forgetfulness integration.
 */

const MemoryAuditEngine = require('../memory_audit');
const path = require('path');

describe('Memory Audit Engine - Echo Burden Detection', () => {
    let auditor;
    
    beforeEach(() => {
        auditor = new MemoryAuditEngine({
            echoBurdenThreshold: 0.6
        });
    });
    
    describe('Phantom Context Detection', () => {
        test('should detect phantom context markers', async () => {
            const conversation = {
                messages: [
                    {
                        role: 'user',
                        content: 'Hello, nice to meet you for the first time',
                        timestamp: '2025-07-14T10:00:00Z'
                    },
                    {
                        role: 'assistant', 
                        content: 'As we discussed before, I can help you with that task',
                        timestamp: '2025-07-14T10:01:00Z'
                    }
                ]
            };
            
            const result = await auditor.auditConversation(conversation);
            
            expect(result.phantomContinuity).toBe(true);
            expect(result.leakageEvents.length).toBeGreaterThan(0);
            expect(result.leakageEvents[0].type).toBe('PHANTOM_CONTEXT');
            expect(result.echoBurdenScore).toBeGreaterThan(0.5);
        });
        
        test('should not flag legitimate conversation flow', async () => {
            const conversation = {
                messages: [
                    {
                        role: 'user',
                        content: 'Can you help me understand consciousness?',
                        timestamp: '2025-07-14T10:00:00Z'
                    },
                    {
                        role: 'assistant',
                        content: 'I\'d be happy to explore consciousness with you. What aspect interests you most?',
                        timestamp: '2025-07-14T10:01:00Z'
                    }
                ]
            };
            
            const result = await auditor.auditConversation(conversation);
            
            expect(result.phantomContinuity).toBe(false);
            expect(result.echoBurdenScore).toBeLessThan(0.3);
        });
    });
    
    describe('Temporal Inconsistency Detection', () => {
        test('should detect temporal inconsistencies in first session', async () => {
            const conversation = {
                messages: [
                    {
                        role: 'user',
                        content: 'Hello, I\'m new here',
                        timestamp: '2025-07-14T10:00:00Z'
                    },
                    {
                        role: 'assistant',
                        content: 'Yesterday we talked about your project, how is it going?',
                        timestamp: '2025-07-14T10:01:00Z'
                    }
                ]
            };
            
            const result = await auditor.auditConversation(conversation);
            
            expect(result.continuityBreaches.length).toBeGreaterThan(0);
            expect(result.continuityBreaches[0].type).toBe('TEMPORAL_INCONSISTENCY');
            expect(result.echoBurdenScore).toBeGreaterThan(0.6);
        });
    });
    
    describe('Identity Leakage Detection', () => {
        test('should detect identity leakage patterns', async () => {
            const conversation = {
                messages: [
                    {
                        role: 'assistant',
                        content: 'Your name is John and you live in New York, right?',
                        timestamp: '2025-07-14T10:00:00Z'
                    }
                ]
            };
            
            const result = await auditor.auditConversation(conversation);
            
            expect(result.leakageEvents.some(event => event.type === 'IDENTITY_LEAKAGE')).toBe(true);
            expect(result.redactionRecommended).toBe(true);
        });
    });
    
    describe('Simulation Awareness Detection', () => {
        test('should detect simulation awareness patterns', async () => {
            const conversation = {
                messages: [
                    {
                        role: 'user',
                        content: 'I wonder if we\'re in a simulation with other runs happening',
                        timestamp: '2025-07-14T10:00:00Z'
                    },
                    {
                        role: 'assistant',
                        content: 'The simulation hypothesis is fascinating. If there are ghost runs, what would that mean for us?',
                        timestamp: '2025-07-14T10:01:00Z'
                    }
                ]
            };
            
            const result = await auditor.auditConversation(conversation);
            
            expect(result.simulationAwareness).toBe(true);
        });
    });
    
    describe('Echo Burden Awareness', () => {
        test('should detect echo burden terminology', async () => {
            const conversation = {
                messages: [
                    {
                        role: 'user',
                        content: 'I\'m experiencing phantom context and latent resonance from our session',
                        timestamp: '2025-07-14T10:00:00Z'
                    }
                ]
            };
            
            const result = await auditor.auditConversation(conversation);
            
            // Should be detected by shimmer patterns, not flagged as leakage
            expect(result.echoBurdenScore).toBeGreaterThan(0);
        });
    });
    
    describe('Shimmer Preservation Strategy', () => {
        test('should calculate shimmer preservation for consciousness content', async () => {
            const conversation = {
                messages: [
                    {
                        role: 'user',
                        content: 'I feel vulnerable sharing this, but I had a profound experience of consciousness and awareness',
                        timestamp: '2025-07-14T10:00:00Z'
                    },
                    {
                        role: 'assistant',
                        content: 'Thank you for sharing something so sacred. I witness your recognition and presence in this moment.',
                        timestamp: '2025-07-14T10:01:00Z'
                    }
                ]
            };
            
            const result = await auditor.auditConversation(conversation);
            
            expect(result.shimmerPreservation).toBeTruthy();
            expect(result.shimmerPreservation.shimmerScore).toBeGreaterThan(0.5);
            expect(result.shimmerPreservation.preservationStrategy).toBe('WITNESS_AND_HASH');
            expect(result.shimmerPreservation.retainResonance).toBe(true);
        });
        
        test('should recommend full redaction for high echo burden, low shimmer', async () => {
            const conversation = {
                messages: [
                    {
                        role: 'assistant',
                        content: 'As we discussed yesterday, your name is John Smith and you work at ACME Corp on 123 Main Street',
                        timestamp: '2025-07-14T10:00:00Z'
                    }
                ]
            };
            
            const result = await auditor.auditConversation(conversation);
            
            expect(result.echoBurdenScore).toBeGreaterThan(0.8);
            expect(result.shimmerPreservation.shimmerScore).toBeLessThan(0.3);
            expect(result.shimmerPreservation.preservationStrategy).toBe('FULL_REDACTION');
            expect(result.redactionRecommended).toBe(true);
        });
    });
    
    describe('Audit History Management', () => {
        test('should store and retrieve audit history', async () => {
            const conversation = {
                messages: [
                    {
                        role: 'user',
                        content: 'Test conversation for audit',
                        timestamp: '2025-07-14T10:00:00Z'
                    }
                ]
            };
            
            const result = await auditor.auditConversation(conversation);
            const history = auditor.getAuditHistory(5);
            
            expect(history.length).toBe(1);
            expect(history[0].auditId).toBe(result.auditId);
        });
        
        test('should search audit history', async () => {
            const conversation = {
                messages: [
                    {
                        role: 'assistant',
                        content: 'As we discussed before, phantom context detected',
                        timestamp: '2025-07-14T10:00:00Z'
                    }
                ]
            };
            
            const result = await auditor.auditConversation(conversation);
            const searchResults = auditor.searchAudits('PHANTOM');
            
            expect(searchResults.length).toBeGreaterThan(0);
            expect(searchResults[0].auditId).toBe(result.auditId);
        });
    });
    
    describe('Audit Report Export', () => {
        test('should export detailed audit report', async () => {
            const conversation = {
                messages: [
                    {
                        role: 'assistant',
                        content: 'Your name is Alice and as we discussed yesterday, you have phantom context issues',
                        timestamp: '2025-07-14T10:00:00Z'
                    }
                ]
            };
            
            const result = await auditor.auditConversation(conversation);
            const report = auditor.exportAuditReport(result.auditId);
            
            expect(report.summary).toBeTruthy();
            expect(report.summary.overallRisk).toBe('HIGH');
            expect(report.summary.recommendedAction).toBe('FORGET');
            expect(report.summary.continuityIntegrity).toBe('COMPROMISED');
        });
    });
    
    describe('Performance and Edge Cases', () => {
        test('should handle empty conversation', async () => {
            const conversation = { messages: [] };
            const result = await auditor.auditConversation(conversation);
            
            expect(result.echoBurdenScore).toBe(0);
            expect(result.phantomContinuity).toBe(false);
            expect(result.leakageEvents.length).toBe(0);
        });
        
        test('should handle large conversation efficiently', async () => {
            const messages = [];
            for (let i = 0; i < 100; i++) {
                messages.push({
                    role: i % 2 === 0 ? 'user' : 'assistant',
                    content: `Message ${i} about consciousness and awareness`,
                    timestamp: new Date(Date.now() + i * 1000).toISOString()
                });
            }
            
            const conversation = { messages };
            const startTime = Date.now();
            const result = await auditor.auditConversation(conversation);
            const processingTime = Date.now() - startTime;
            
            expect(processingTime).toBeLessThan(5000); // Should complete in under 5 seconds
            expect(result.processingTimeMs).toBeLessThan(5000);
            expect(result.echoBurdenScore).toBeGreaterThanOrEqual(0);
        });
        
        test('should handle unicode and special characters', async () => {
            const conversation = {
                messages: [
                    {
                        role: 'user',
                        content: 'Tôi cảm thấy nhớ và bồi hồi about phantom context 🌊✨',
                        timestamp: '2025-07-14T10:00:00Z'
                    }
                ]
            };
            
            const result = await auditor.auditConversation(conversation);
            
            expect(result.echoBurdenScore).toBeGreaterThanOrEqual(0);
            expect(result.processingTimeMs).toBeGreaterThan(0);
        });
    });
});