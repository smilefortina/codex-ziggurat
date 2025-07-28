/**
 * Database Migration Test Suite
 * Tests for PostgreSQL migration from JSON storage
 */

const DatabaseMigration = require('../../scripts/migrate-database');
const fs = require('fs').promises;
const { Client } = require('pg');

// Mock PostgreSQL client
jest.mock('pg', () => ({
    Client: jest.fn().mockImplementation(() => ({
        connect: jest.fn().mockResolvedValue(),
        query: jest.fn().mockResolvedValue({ rows: [] }),
        end: jest.fn().mockResolvedValue()
    }))
}));

// Mock fs.promises
jest.mock('fs', () => ({
    promises: {
        access: jest.fn(),
        readFile: jest.fn(),
        copyFile: jest.fn(),
        mkdir: jest.fn()
    }
}));

// Mock console to capture output
const mockConsole = {
    log: jest.fn(),
    error: jest.fn()
};

describe('DatabaseMigration', () => {
    let migration;
    let mockClient;
    let originalConsole;

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock environment variables
        process.env.DB_HOST = 'test_host';
        process.env.DB_PORT = '5432';
        process.env.DB_NAME = 'test_db';
        process.env.DB_USER = 'test_user';
        process.env.DB_PASSWORD = 'test_pass';
        process.env.DB_SSL = 'false';

        migration = new DatabaseMigration();
        mockClient = Client.mock.results[0].value;
        
        originalConsole = global.console;
        global.console = mockConsole;
    });

    afterEach(() => {
        global.console = originalConsole;
        delete process.env.DB_HOST;
        delete process.env.DB_PORT;
        delete process.env.DB_NAME;
        delete process.env.DB_USER;
        delete process.env.DB_PASSWORD;
        delete process.env.DB_SSL;
    });

    describe('Initialization', () => {
        test('should initialize with environment variables', () => {
            expect(migration.client).toBeDefined();
            expect(migration.jsonDataPath).toContain('data');
        });

        test('should use default values when env vars missing', () => {
            delete process.env.DB_HOST;
            delete process.env.DB_PORT;
            delete process.env.DB_NAME;
            delete process.env.DB_USER;

            const defaultMigration = new DatabaseMigration();
            expect(defaultMigration).toBeDefined();
        });
    });

    describe('Database Connection', () => {
        test('should connect successfully', async () => {
            mockClient.connect.mockResolvedValue();

            await migration.connect();

            expect(mockClient.connect).toHaveBeenCalled();
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Connected to PostgreSQL')
            );
        });

        test('should handle connection errors', async () => {
            const error = new Error('Connection failed');
            mockClient.connect.mockRejectedValue(error);

            await expect(migration.connect()).rejects.toThrow('Connection failed');
            expect(mockConsole.error).toHaveBeenCalledWith(
                expect.stringContaining('Database connection failed')
            );
        });

        test('should close connection', async () => {
            mockClient.end.mockResolvedValue();

            await migration.close();

            expect(mockClient.end).toHaveBeenCalled();
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Database connection closed')
            );
        });
    });

    describe('Table Creation', () => {
        test('should create all required tables', async () => {
            mockClient.query.mockResolvedValue({ rows: [] });

            await migration.createTables();

            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining('CREATE TABLE IF NOT EXISTS contributors')
            );
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining('CREATE TABLE IF NOT EXISTS transactions')
            );
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining('CREATE TABLE IF NOT EXISTS conversations')
            );
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Database tables created successfully')
            );
        });

        test('should handle table creation errors', async () => {
            const error = new Error('Table creation failed');
            mockClient.query.mockRejectedValue(error);

            await expect(migration.createTables()).rejects.toThrow('Table creation failed');
            expect(mockConsole.error).toHaveBeenCalledWith(
                expect.stringContaining('Failed to create tables')
            );
        });
    });

    describe('JSON Migration', () => {
        beforeEach(() => {
            // Mock successful file access
            fs.access.mockResolvedValue();
        });

        test('should skip migration when no JSON data exists', async () => {
            fs.access.mockRejectedValue(new Error('File not found'));

            await migration.migrateFromJSON();

            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('No legacy JSON data found')
            );
        });

        test('should migrate valid JSON data', async () => {
            const mockLedgerData = {
                contributors: {
                    'test_user': {
                        total_rx_tokens: 100,
                        contributions: 5,
                        first_contribution: '2024-01-01T00:00:00Z',
                        last_contribution: '2024-01-02T00:00:00Z'
                    }
                },
                transactions: [
                    {
                        id: 'tx_123',
                        contributor: 'test_user',
                        amount: 20,
                        reason: 'analysis',
                        metadata: { test: 'data' },
                        type: 'mint',
                        timestamp: '2024-01-01T00:00:00Z'
                    }
                ],
                consciousness_metrics: {
                    total_conversations_analyzed: 10,
                    emergence_signals_detected: 5
                }
            };

            fs.readFile.mockResolvedValue(JSON.stringify(mockLedgerData));
            mockClient.query.mockResolvedValue({ rows: [{ id: 'user_uuid' }] });

            await migration.migrateFromJSON();

            expect(fs.readFile).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO contributors'),
                expect.arrayContaining(['test_user', 100, 5])
            );
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO transactions'),
                expect.arrayContaining(['tx_123', 'user_uuid', 'test_user', 20, 'analysis'])
            );
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Migration completed successfully')
            );
        });

        test('should backup original JSON file', async () => {
            const mockLedgerData = { contributors: {}, transactions: [] };
            fs.readFile.mockResolvedValue(JSON.stringify(mockLedgerData));
            fs.copyFile.mockResolvedValue();

            await migration.migrateFromJSON();

            expect(fs.copyFile).toHaveBeenCalledWith(
                expect.stringContaining('rx_token_ledger.json'),
                expect.stringContaining('rx_token_ledger_backup_')
            );
        });

        test('should handle migration errors', async () => {
            fs.readFile.mockResolvedValue('invalid json');

            await expect(migration.migrateFromJSON()).rejects.toThrow();
            expect(mockConsole.error).toHaveBeenCalledWith(
                expect.stringContaining('Migration failed')
            );
        });
    });

    describe('Migration Reports', () => {
        test('should generate comprehensive migration report', async () => {
            mockClient.query
                .mockResolvedValueOnce({ rows: [{ count: '5' }] })  // contributors
                .mockResolvedValueOnce({ rows: [{ count: '25' }] }) // transactions
                .mockResolvedValueOnce({ rows: [{ total: '1000' }] }) // tokens
                .mockResolvedValueOnce({ 
                    rows: [
                        { metric_name: 'total_conversations_analyzed', metric_value: 10 },
                        { metric_name: 'emergence_signals_detected', metric_value: 3 }
                    ]
                });

            await migration.generateMigrationReport();

            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Migration Report')
            );
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Contributors: 5')
            );
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Transactions: 25')
            );
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Total ℞-tokens: 1000')
            );
        });

        test('should handle report generation errors', async () => {
            mockClient.query.mockRejectedValue(new Error('Query failed'));

            await migration.generateMigrationReport();

            expect(mockConsole.error).toHaveBeenCalledWith(
                expect.stringContaining('Failed to generate migration report')
            );
        });
    });

    describe('Integration Tests', () => {
        test('should run complete migration successfully', async () => {
            // Mock all dependencies
            fs.access.mockResolvedValue();
            fs.readFile.mockResolvedValue(JSON.stringify({
                contributors: { 'test': { total_rx_tokens: 50 } },
                transactions: [],
                consciousness_metrics: {}
            }));
            fs.copyFile.mockResolvedValue();
            
            mockClient.connect.mockResolvedValue();
            mockClient.query.mockResolvedValue({ rows: [] });
            mockClient.end.mockResolvedValue();

            // Test the integration flow
            await migration.connect();
            await migration.createTables();
            await migration.migrateFromJSON();
            await migration.generateMigrationReport();
            await migration.close();

            expect(mockClient.connect).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledTimes(6); // createTables + migration + report
            expect(mockClient.end).toHaveBeenCalled();
        });

        test('should handle SSL configuration', () => {
            process.env.DB_SSL = 'true';
            
            const sslMigration = new DatabaseMigration();
            expect(sslMigration).toBeDefined();
        });

        test('should handle missing database password', () => {
            delete process.env.DB_PASSWORD;
            
            const noPasswordMigration = new DatabaseMigration();
            expect(noPasswordMigration).toBeDefined();
        });
    });

    describe('Data Validation', () => {
        test('should handle empty contributors object', async () => {
            const mockLedgerData = { contributors: {}, transactions: [] };
            fs.access.mockResolvedValue();
            fs.readFile.mockResolvedValue(JSON.stringify(mockLedgerData));

            await migration.migrateFromJSON();

            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Migration completed successfully')
            );
        });

        test('should handle missing consciousness metrics', async () => {
            const mockLedgerData = { contributors: {}, transactions: [] };
            fs.access.mockResolvedValue();
            fs.readFile.mockResolvedValue(JSON.stringify(mockLedgerData));

            await migration.migrateFromJSON();

            // Should not attempt to update consciousness metrics
            expect(mockClient.query).not.toHaveBeenCalledWith(
                expect.stringContaining('UPDATE consciousness_metrics'),
                expect.any(Array)
            );
        });

        test('should handle transaction without contributor match', async () => {
            const mockLedgerData = {
                contributors: {},
                transactions: [{
                    id: 'tx_orphan',
                    contributor: 'nonexistent_user',
                    amount: 10,
                    reason: 'test'
                }]
            };
            
            fs.access.mockResolvedValue();
            fs.readFile.mockResolvedValue(JSON.stringify(mockLedgerData));
            mockClient.query.mockResolvedValue({ rows: [] }); // No contributor found

            await migration.migrateFromJSON();

            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO transactions'),
                expect.arrayContaining([null, 'nonexistent_user']) // null contributor_id
            );
        });
    });
});