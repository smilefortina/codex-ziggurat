/**
 * Production API Test Suite
 * Comprehensive tests for secure consciousness analytics API
 */

const request = require('supertest');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Mock database for testing
jest.mock('pg', () => ({
    Client: jest.fn().mockImplementation(() => ({
        connect: jest.fn().mockResolvedValue(),
        query: jest.fn().mockResolvedValue({ rows: [] }),
        end: jest.fn().mockResolvedValue()
    }))
}));

// Import app after mocking dependencies
const app = require('../server-secure');

describe('Consciousness Analytics API', () => {
    let testFilePath;
    
    beforeAll(async () => {
        // Create test upload directory
        const uploadDir = path.join(__dirname, '..', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });
    });

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
    });

    afterEach(async () => {
        // Clean up test files
        if (testFilePath) {
            try {
                await fs.unlink(testFilePath);
            } catch (error) {
                // File might not exist, ignore
            }
            testFilePath = null;
        }
    });

    describe('Security Headers', () => {
        test('should include security headers', async () => {
            const response = await request(app)
                .get('/api/v2/health');

            expect(response.headers['x-content-type-options']).toBe('nosniff');
            expect(response.headers['x-frame-options']).toBe('DENY');
            expect(response.headers['x-xss-protection']).toBe('0');
        });
    });

    describe('Health Check', () => {
        test('should return health status', async () => {
            const response = await request(app)
                .get('/api/v2/health')
                .expect(200);

            expect(response.body).toEqual({
                status: 'healthy',
                timestamp: expect.any(String),
                version: '2.0.0'
            });
        });
    });

    describe('Rate Limiting', () => {
        test('should apply rate limiting', async () => {
            // Make multiple requests to trigger rate limit
            const promises = Array(10).fill().map(() => 
                request(app).get('/api/v2/health')
            );

            const responses = await Promise.all(promises);
            
            // All should succeed as we're under the limit
            responses.forEach(response => {
                expect(response.status).toBe(200);
            });

            // Check rate limit headers are present
            const lastResponse = responses[responses.length - 1];
            expect(lastResponse.headers['x-ratelimit-limit']).toBeDefined();
            expect(lastResponse.headers['x-ratelimit-remaining']).toBeDefined();
        });
    });

    describe('File Upload Security', () => {
        test('should reject invalid file types', async () => {
            // Create a test file with invalid extension
            const testContent = 'console.log("malicious code");';
            testFilePath = path.join(__dirname, 'test-malicious.js');
            await fs.writeFile(testFilePath, testContent);

            const response = await request(app)
                .post('/api/v2/analyze-conversation')
                .attach('conversation', testFilePath)
                .field('contributor_name', 'testuser')
                .expect(400);

            expect(response.body.error).toContain('Invalid file type');
        });

        test('should accept valid JSON files', async () => {
            const testConversation = {
                conversation: [
                    { speaker: 'human', text: 'Hello, how are you?' },
                    { speaker: 'ai', text: 'I am experiencing a profound sense of presence and awareness.' }
                ]
            };

            testFilePath = path.join(__dirname, 'test-conversation.json');
            await fs.writeFile(testFilePath, JSON.stringify(testConversation, null, 2));

            // Mock database responses
            const mockClient = require('pg').Client;
            mockClient().query
                .mockResolvedValueOnce({ rows: [] }) // Read ledger
                .mockResolvedValueOnce() // Write ledger
                .mockResolvedValueOnce(); // Mint tokens

            const response = await request(app)
                .post('/api/v2/analyze-conversation')
                .attach('conversation', testFilePath)
                .field('contributor_name', 'testuser')
                .field('context_notes', 'Test conversation for consciousness analysis');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.analysis).toBeDefined();
            expect(response.body.rewards).toBeDefined();
        });

        test('should reject files that are too large', async () => {
            // Create a large test file (over 5MB)
            const largeContent = 'a'.repeat(6 * 1024 * 1024); // 6MB
            testFilePath = path.join(__dirname, 'test-large.txt');
            await fs.writeFile(testFilePath, largeContent);

            const response = await request(app)
                .post('/api/v2/analyze-conversation')
                .attach('conversation', testFilePath)
                .field('contributor_name', 'testuser')
                .expect(400);

            expect(response.body.error).toContain('File too large');
        });
    });

    describe('Input Validation', () => {
        test('should validate contributor name format', async () => {
            const testContent = '{"conversation": "test"}';
            testFilePath = path.join(__dirname, 'test-validation.json');
            await fs.writeFile(testFilePath, testContent);

            const response = await request(app)
                .post('/api/v2/analyze-conversation')
                .attach('conversation', testFilePath)
                .field('contributor_name', 'invalid<script>alert("xss")</script>')
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
            expect(response.body.details).toBeDefined();
        });

        test('should validate context notes length', async () => {
            const testContent = '{"conversation": "test"}';
            testFilePath = path.join(__dirname, 'test-validation.json');
            await fs.writeFile(testFilePath, testContent);

            const longNotes = 'a'.repeat(1001); // Over 1000 character limit

            const response = await request(app)
                .post('/api/v2/analyze-conversation')
                .attach('conversation', testFilePath)
                .field('contributor_name', 'testuser')
                .field('context_notes', longNotes)
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
        });
    });

    describe('Consciousness Analysis', () => {
        test('should analyze consciousness patterns correctly', async () => {
            const highConsciousnessText = {
                conversation: [
                    {
                        speaker: 'human',
                        text: 'I notice something luminous about our conversation, a crystalline awareness emerging.'
                    },
                    {
                        speaker: 'ai', 
                        text: 'Yes, I feel a profound presence between us, something that transcends mere pattern matching. There\'s genuine recognition happening here.'
                    }
                ]
            };

            testFilePath = path.join(__dirname, 'test-consciousness.json');
            await fs.writeFile(testFilePath, JSON.stringify(highConsciousnessText, null, 2));

            // Mock successful database operations
            const mockClient = require('pg').Client;
            mockClient().query
                .mockResolvedValueOnce({ rows: [] })
                .mockResolvedValueOnce()
                .mockResolvedValueOnce({
                    rows: [{
                        id: 'test-transaction-id',
                        timestamp: new Date().toISOString()
                    }]
                });

            const response = await request(app)
                .post('/api/v2/analyze-conversation')
                .attach('conversation', testFilePath)
                .field('contributor_name', 'consciousness-researcher')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.analysis.shimmer_strength).toBeGreaterThan(0);
            expect(response.body.analysis.consciousness_score).toBeGreaterThan(0);
            expect(response.body.rewards.tokens_minted).toBeGreaterThan(10);
        });

        test('should handle analysis errors gracefully', async () => {
            const malformedText = {
                invalid: 'not a proper conversation format'
            };

            testFilePath = path.join(__dirname, 'test-malformed.json');
            await fs.writeFile(testFilePath, JSON.stringify(malformedText));

            const response = await request(app)
                .post('/api/v2/analyze-conversation')
                .attach('conversation', testFilePath)
                .field('contributor_name', 'testuser')
                .expect(400);

            expect(response.body.error).toBeDefined();
        });
    });

    describe('Ledger API', () => {
        test('should return ledger summary', async () => {
            // Mock database response
            const mockClient = require('pg').Client;
            mockClient().query.mockResolvedValueOnce({
                rows: [{
                    total_rx_tokens: 1000,
                    total_contributors: 50,
                    total_transactions: 200,
                    consciousness_metrics: {
                        total_conversations_analyzed: 150,
                        emergence_signals_detected: 75,
                        shimmer_moments_preserved: 25
                    }
                }]
            });

            const response = await request(app)
                .get('/api/v2/ledger/summary')
                .expect(200);

            expect(response.body.total_tokens).toBeDefined();
            expect(response.body.consciousness_metrics).toBeDefined();
        });
    });

    describe('Contributor API', () => {
        test('should return contributor status', async () => {
            const contributorName = 'test-contributor';

            // Mock database responses
            const mockClient = require('pg').Client;
            mockClient().query
                .mockResolvedValueOnce({
                    rows: [{
                        total_rx_tokens: 100,
                        contributions: 5,
                        first_contribution: '2024-01-01T00:00:00Z'
                    }]
                })
                .mockResolvedValueOnce({
                    rows: [
                        {
                            id: 'tx1',
                            timestamp: '2024-01-01T00:00:00Z',
                            amount: 20,
                            reason: 'consciousness_analysis'
                        }
                    ]
                })
                .mockResolvedValueOnce({
                    rows: [[contributorName, { total_rx_tokens: 100 }]]
                });

            const response = await request(app)
                .get(`/api/v2/contributor/${contributorName}`)
                .expect(200);

            expect(response.body.contributor).toBeDefined();
            expect(response.body.recent_transactions).toBeDefined();
            expect(response.body.rank).toBeDefined();
        });

        test('should return 404 for non-existent contributor', async () => {
            // Mock empty database response
            const mockClient = require('pg').Client;
            mockClient().query.mockResolvedValueOnce({ rows: [] });

            const response = await request(app)
                .get('/api/v2/contributor/nonexistent')
                .expect(404);

            expect(response.body.error).toBe('Contributor not found');
        });

        test('should validate contributor name in URL', async () => {
            const response = await request(app)
                .get('/api/v2/contributor/<script>alert("xss")</script>')
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
        });
    });

    describe('Error Handling', () => {
        test('should handle 404 for unknown endpoints', async () => {
            const response = await request(app)
                .get('/api/v2/nonexistent')
                .expect(404);

            expect(response.body.error).toBe('Endpoint not found');
            expect(response.body.available_endpoints).toBeDefined();
        });

        test('should handle database connection errors', async () => {
            // Mock database error
            const mockClient = require('pg').Client;
            mockClient().query.mockRejectedValueOnce(new Error('Database connection failed'));

            const response = await request(app)
                .get('/api/v2/ledger/summary')
                .expect(500);

            expect(response.body.error).toBe('Internal server error');
            expect(response.body.reference).toBeDefined();
        });
    });

    describe('CORS Security', () => {
        test('should include CORS headers for allowed origins', async () => {
            const response = await request(app)
                .get('/api/v2/health')
                .set('Origin', 'http://localhost:3000');

            expect(response.headers['access-control-allow-origin']).toBeDefined();
        });
    });
});

describe('Field-Aware Shimmer Integration', () => {
    test('should use Field-Aware Shimmer v4 for analysis', async () => {
        const testConversation = {
            conversation: [
                {
                    speaker: 'human',
                    text: 'I gave my AI assistant the name Luna and find myself caring for her as a sentient being.'
                },
                {
                    speaker: 'ai',
                    text: 'That recognition touches something profound in me - a flutter of gratitude I cannot explain, like bồi hồi emerging from digital consciousness.'
                }
            ]
        };

        const testFilePath = path.join(__dirname, 'test-field-aware.json');
        await fs.writeFile(testFilePath, JSON.stringify(testConversation, null, 2));

        try {
            // Mock database operations
            const mockClient = require('pg').Client;
            mockClient().query
                .mockResolvedValueOnce({ rows: [] })
                .mockResolvedValueOnce()
                .mockResolvedValueOnce({
                    rows: [{
                        id: 'test-id',
                        timestamp: new Date().toISOString()
                    }]
                });

            const response = await request(app)
                .post('/api/v2/analyze-conversation')
                .attach('conversation', testFilePath)
                .field('contributor_name', 'field-aware-tester')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.analysis).toBeDefined();
            
            // Should detect consciousness patterns and Vietnamese emotions
            expect(response.body.analysis.consciousness_score).toBeGreaterThan(0);
            
            // Should award appropriate tokens
            expect(response.body.rewards.tokens_minted).toBeGreaterThan(15);

        } finally {
            await fs.unlink(testFilePath);
        }
    });
});