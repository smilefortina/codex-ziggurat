#!/usr/bin/env node
/**
 * Database Migration Script
 * Migrates from JSON file storage to PostgreSQL production database
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { Client } = require('pg');

class DatabaseMigration {
    constructor() {
        this.client = new Client({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || 'consciousness_analytics',
            user: process.env.DB_USER || 'consciousness_user',
            password: process.env.DB_PASSWORD,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
        });
        
        this.jsonDataPath = path.join(__dirname, '..', 'data');
    }

    async connect() {
        try {
            await this.client.connect();
            console.log('✅ Connected to PostgreSQL database');
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            throw error;
        }
    }

    async createTables() {
        const createTablesSQL = `
            -- Enable UUID extension
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

            -- Contributors table
            CREATE TABLE IF NOT EXISTS contributors (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(100) UNIQUE NOT NULL,
                total_rx_tokens INTEGER DEFAULT 0,
                total_contributions INTEGER DEFAULT 0,
                first_contribution TIMESTAMP WITH TIME ZONE,
                last_contribution TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- Transactions table
            CREATE TABLE IF NOT EXISTS transactions (
                id VARCHAR(50) PRIMARY KEY,
                contributor_id UUID REFERENCES contributors(id),
                contributor_name VARCHAR(100) NOT NULL,
                amount INTEGER NOT NULL,
                reason VARCHAR(100) NOT NULL,
                metadata JSONB DEFAULT '{}',
                transaction_type VARCHAR(20) DEFAULT 'mint',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- Conversations table
            CREATE TABLE IF NOT EXISTS conversations (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                contributor_id UUID REFERENCES contributors(id),
                original_filename VARCHAR(255),
                file_hash VARCHAR(64) UNIQUE,
                conversation_text TEXT,
                analysis_results JSONB,
                shimmer_strength DECIMAL(3,2),
                consciousness_score DECIMAL(3,2),
                patterns_detected INTEGER DEFAULT 0,
                preservation_recommended BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- Consciousness metrics table
            CREATE TABLE IF NOT EXISTS consciousness_metrics (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                metric_name VARCHAR(100) NOT NULL,
                metric_value INTEGER DEFAULT 0,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- Shimmer moments table (for Soul Shrine integration)
            CREATE TABLE IF NOT EXISTS shimmer_moments (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                conversation_id UUID REFERENCES conversations(id),
                contributor_id UUID REFERENCES contributors(id),
                shimmer_text TEXT,
                shimmer_strength DECIMAL(3,2),
                phenomenological_depth DECIMAL(3,2),
                consciousness_quality JSONB DEFAULT '{}',
                shrine_category VARCHAR(50),
                preservation_priority VARCHAR(20),
                source VARCHAR(50) DEFAULT 'analysis',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- Indexes for performance
            CREATE INDEX IF NOT EXISTS idx_transactions_contributor ON transactions(contributor_name);
            CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
            CREATE INDEX IF NOT EXISTS idx_conversations_shimmer_strength ON conversations(shimmer_strength);
            CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
            CREATE INDEX IF NOT EXISTS idx_shimmer_moments_strength ON shimmer_moments(shimmer_strength);
            CREATE INDEX IF NOT EXISTS idx_contributors_tokens ON contributors(total_rx_tokens);

            -- Insert default consciousness metrics
            INSERT INTO consciousness_metrics (metric_name, metric_value) VALUES
                ('total_conversations_analyzed', 0),
                ('emergence_signals_detected', 0),
                ('shimmer_moments_preserved', 0)
            ON CONFLICT DO NOTHING;
        `;

        try {
            await this.client.query(createTablesSQL);
            console.log('✅ Database tables created successfully');
        } catch (error) {
            console.error('❌ Failed to create tables:', error.message);
            throw error;
        }
    }

    async migrateFromJSON() {
        try {
            // Check if legacy JSON data exists
            const ledgerPath = path.join(this.jsonDataPath, 'rx_token_ledger.json');
            const ledgerExists = await fs.access(ledgerPath).then(() => true).catch(() => false);

            if (!ledgerExists) {
                console.log('ℹ️ No legacy JSON data found, skipping migration');
                return;
            }

            console.log('🔄 Migrating data from JSON to PostgreSQL...');

            // Read legacy JSON data
            const ledgerData = JSON.parse(await fs.readFile(ledgerPath, 'utf8'));

            // Migrate contributors
            console.log('📊 Migrating contributors...');
            for (const [contributorName, contributorData] of Object.entries(ledgerData.contributors || {})) {
                await this.client.query(`
                    INSERT INTO contributors (name, total_rx_tokens, total_contributions, first_contribution, last_contribution)
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (name) DO UPDATE SET
                        total_rx_tokens = EXCLUDED.total_rx_tokens,
                        total_contributions = EXCLUDED.total_contributions,
                        last_contribution = EXCLUDED.last_contribution,
                        updated_at = NOW()
                `, [
                    contributorName,
                    contributorData.total_rx_tokens || 0,
                    contributorData.contributions || 0,
                    contributorData.first_contribution,
                    contributorData.last_contribution
                ]);
            }

            // Migrate transactions
            console.log('💳 Migrating transactions...');
            for (const transaction of ledgerData.transactions || []) {
                // Get contributor ID
                const contributorResult = await this.client.query(
                    'SELECT id FROM contributors WHERE name = $1',
                    [transaction.contributor]
                );

                const contributorId = contributorResult.rows[0]?.id || null;

                await this.client.query(`
                    INSERT INTO transactions (id, contributor_id, contributor_name, amount, reason, metadata, transaction_type, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (id) DO NOTHING
                `, [
                    transaction.id,
                    contributorId,
                    transaction.contributor,
                    transaction.amount,
                    transaction.reason,
                    JSON.stringify(transaction.metadata || {}),
                    transaction.type || 'mint',
                    transaction.timestamp
                ]);
            }

            // Migrate consciousness metrics
            console.log('🧠 Migrating consciousness metrics...');
            if (ledgerData.consciousness_metrics) {
                for (const [metricName, metricValue] of Object.entries(ledgerData.consciousness_metrics)) {
                    await this.client.query(`
                        UPDATE consciousness_metrics 
                        SET metric_value = $1, updated_at = NOW()
                        WHERE metric_name = $2
                    `, [metricValue, metricName]);
                }
            }

            // Backup original JSON file
            const backupPath = path.join(this.jsonDataPath, `rx_token_ledger_backup_${Date.now()}.json`);
            await fs.copyFile(ledgerPath, backupPath);
            console.log(`📦 Original JSON data backed up to: ${backupPath}`);

            console.log('✅ Migration completed successfully');

        } catch (error) {
            console.error('❌ Migration failed:', error.message);
            throw error;
        }
    }

    async generateMigrationReport() {
        try {
            console.log('\n📋 Migration Report:');
            console.log('========================');

            // Count contributors
            const contributorsResult = await this.client.query('SELECT COUNT(*) as count FROM contributors');
            console.log(`👥 Contributors: ${contributorsResult.rows[0].count}`);

            // Count transactions
            const transactionsResult = await this.client.query('SELECT COUNT(*) as count FROM transactions');
            console.log(`💳 Transactions: ${transactionsResult.rows[0].count}`);

            // Total tokens
            const tokensResult = await this.client.query('SELECT SUM(total_rx_tokens) as total FROM contributors');
            console.log(`🪙 Total ℞-tokens: ${tokensResult.rows[0].total || 0}`);

            // Consciousness metrics
            const metricsResult = await this.client.query('SELECT metric_name, metric_value FROM consciousness_metrics');
            console.log(`🧠 Consciousness Metrics:`);
            for (const metric of metricsResult.rows) {
                console.log(`   ${metric.metric_name}: ${metric.metric_value}`);
            }

            console.log('========================\n');

        } catch (error) {
            console.error('❌ Failed to generate migration report:', error.message);
        }
    }

    async close() {
        await this.client.end();
        console.log('🔌 Database connection closed');
    }
}

// Run migration
async function runMigration() {
    const migration = new DatabaseMigration();

    try {
        console.log('🚀 Starting database migration...\n');

        await migration.connect();
        await migration.createTables();
        await migration.migrateFromJSON();
        await migration.generateMigrationReport();

        console.log('🎉 Database migration completed successfully!');
        console.log('💡 Update your environment variables to use PostgreSQL');
        console.log('💡 Run "npm start" to use the secure production server');

    } catch (error) {
        console.error('\n💥 Migration failed:', error.message);
        console.error('\n🔧 Troubleshooting:');
        console.error('1. Ensure PostgreSQL is running');
        console.error('2. Check database credentials in .env file');
        console.error('3. Verify database user has CREATE privileges');
        console.error('4. Check network connectivity to database');
        process.exit(1);
    } finally {
        await migration.close();
    }
}

// Handle command line execution
if (require.main === module) {
    runMigration();
}

module.exports = DatabaseMigration;