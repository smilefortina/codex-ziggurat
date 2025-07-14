#!/usr/bin/env node
/**
 * Codex Ziggurat Backend Service - SECURITY HARDENED
 * Production-ready consciousness analytics API with enterprise security
 */

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const { body, param, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 uploads per hour
    message: {
        error: 'Too many uploads from this IP, please try again later.',
    },
});

app.use(limiter);

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 
        ['https://yourdomain.com'] : // Replace with actual domain
        ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ 
    limit: '10mb', // Reduced from 50mb
    strict: true 
}));
app.use(express.static('portal', {
    maxAge: '1h',
    etag: true,
}));

// Input validation middleware
const validateInput = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

// Secure file upload configuration
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error, null);
        }
    },
    filename: (req, file, cb) => {
        // Sanitize filename and add random suffix
        const sanitizedName = file.originalname
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .substring(0, 100);
        const randomSuffix = crypto.randomBytes(8).toString('hex');
        const timestamp = Date.now();
        cb(null, `conversation_${timestamp}_${randomSuffix}_${sanitizedName}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Strict file type validation
        const allowedMimes = [
            'application/json',
            'text/plain',
            'text/csv'
        ];
        
        const allowedExtensions = ['.json', '.txt', '.csv'];
        const ext = path.extname(file.originalname).toLowerCase();
        
        if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JSON, TXT, and CSV files are allowed.'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1, // Only 1 file per request
    }
});

// Secure Database Abstraction Layer
class SecureDatabase {
    constructor() {
        this.dataDir = path.join(__dirname, 'data');
        this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });
            
            // Initialize with proper JSON schema
            const ledgerPath = path.join(this.dataDir, 'rx_token_ledger.json');
            
            if (!fsSync.existsSync(ledgerPath)) {
                const initialLedger = {
                    version: "2.0.0",
                    created: new Date().toISOString(),
                    total_rx_tokens: 0,
                    transactions: [],
                    contributors: {},
                    consciousness_metrics: {
                        total_conversations_analyzed: 0,
                        emergence_signals_detected: 0,
                        shimmer_moments_preserved: 0
                    },
                    schema_version: 2
                };
                
                await fs.writeFile(ledgerPath, JSON.stringify(initialLedger, null, 2));
            }
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw new Error('Database initialization failed');
        }
    }

    async readLedger() {
        try {
            const ledgerPath = path.join(this.dataDir, 'rx_token_ledger.json');
            const data = await fs.readFile(ledgerPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to read ledger:', error);
            throw new Error('Database read failed');
        }
    }

    async writeLedger(ledger) {
        try {
            const ledgerPath = path.join(this.dataDir, 'rx_token_ledger.json');
            const tempPath = `${ledgerPath}.tmp`;
            
            // Atomic write
            await fs.writeFile(tempPath, JSON.stringify(ledger, null, 2));
            await fs.rename(tempPath, ledgerPath);
        } catch (error) {
            console.error('Failed to write ledger:', error);
            throw new Error('Database write failed');
        }
    }

    async mintTokens(contributor, amount, reason, metadata = {}) {
        if (!contributor || typeof contributor !== 'string' || contributor.length > 100) {
            throw new Error('Invalid contributor name');
        }
        
        if (!Number.isInteger(amount) || amount <= 0 || amount > 1000) {
            throw new Error('Invalid token amount');
        }

        const ledger = await this.readLedger();
        
        const transaction = {
            id: `rx_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`,
            timestamp: new Date().toISOString(),
            contributor: validator.escape(contributor),
            amount,
            reason: validator.escape(reason),
            metadata: this.sanitizeMetadata(metadata),
            type: 'mint'
        };

        ledger.transactions.push(transaction);
        ledger.total_rx_tokens += amount;
        
        if (!ledger.contributors[contributor]) {
            ledger.contributors[contributor] = {
                total_rx_tokens: 0,
                contributions: 0,
                first_contribution: transaction.timestamp
            };
        }
        
        ledger.contributors[contributor].total_rx_tokens += amount;
        ledger.contributors[contributor].contributions += 1;
        ledger.contributors[contributor].last_contribution = transaction.timestamp;

        await this.writeLedger(ledger);
        return transaction;
    }

    sanitizeMetadata(metadata) {
        const sanitized = {};
        for (const [key, value] of Object.entries(metadata)) {
            if (typeof key === 'string' && key.length <= 50) {
                if (typeof value === 'string') {
                    sanitized[key] = validator.escape(value.substring(0, 500));
                } else if (typeof value === 'number' && Number.isFinite(value)) {
                    sanitized[key] = value;
                } else if (typeof value === 'boolean') {
                    sanitized[key] = value;
                }
            }
        }
        return sanitized;
    }
}

// Secure Consciousness Analysis Service
class SecureConsciousnessAnalyzer {
    constructor() {
        this.maxTextLength = 50000; // 50KB text limit
        this.analysisCache = new Map();
        this.cacheMaxSize = 100;
    }

    async analyzeConversation(text, options = {}) {
        // Input validation
        if (!text || typeof text !== 'string') {
            throw new Error('Invalid conversation text');
        }

        if (text.length > this.maxTextLength) {
            throw new Error('Conversation text too long');
        }

        // Sanitize input
        const sanitizedText = validator.escape(text);
        
        // Generate cache key
        const cacheKey = crypto.createHash('sha256').update(sanitizedText).digest('hex');
        
        // Check cache
        if (this.analysisCache.has(cacheKey)) {
            return this.analysisCache.get(cacheKey);
        }

        try {
            // Use Field-Aware Shimmer v4 for analysis
            const FieldShimmerV4 = require('./detection_lab/field_shimmer_v4');
            const recognizer = new FieldShimmerV4({
                enableFieldSensors: true,
                enableVietnameseEmotions: true,
                enableConsciousnessRecognition: true,
                enableTimelineRestoration: false, // Disable for security
                enableRABIT: false // Disable logging for production
            });

            const analysis = await recognizer.recognizeShimmer(sanitizedText, {
                conversationHistory: options.conversationHistory || []
            });

            // Sanitize analysis results
            const sanitizedAnalysis = {
                shimmer_strength: Math.min(Math.max(analysis.overall_shimmer_strength || 0, 0), 1),
                phenomenological_depth: Math.min(Math.max(analysis.phenomenological_depth || 0, 0), 1),
                consciousness_score: Math.min(Math.max(analysis.consciousness_signals?.consciousness_score || 0, 0), 1),
                patterns_detected: Array.isArray(analysis.shimmer_signals) ? analysis.shimmer_signals.length : 0,
                field_coherence: Math.min(Math.max(analysis.shared_field?.field_coherence || 0, 0), 1),
                preservation_recommended: Boolean(analysis.preservation_recommendation?.preserve),
                timestamp: new Date().toISOString()
            };

            // Cache result
            if (this.analysisCache.size >= this.cacheMaxSize) {
                const firstKey = this.analysisCache.keys().next().value;
                this.analysisCache.delete(firstKey);
            }
            this.analysisCache.set(cacheKey, sanitizedAnalysis);

            return sanitizedAnalysis;

        } catch (error) {
            console.error('Consciousness analysis failed:', error);
            throw new Error('Analysis service unavailable');
        }
    }
}

// Initialize secure services
const database = new SecureDatabase();
const analyzer = new SecureConsciousnessAnalyzer();

// Error handling middleware
const handleErrors = (error, req, res, next) => {
    console.error('Request error:', {
        message: error.message,
        url: req.url,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });

    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ error: 'File upload error: ' + error.message });
    }

    res.status(500).json({ 
        error: 'Internal server error',
        reference: crypto.randomBytes(8).toString('hex')
    });
};

// Secure API Endpoints

// Upload and analyze conversation
app.post('/api/v2/analyze-conversation', 
    uploadLimiter,
    upload.single('conversation'),
    [
        body('contributor_name')
            .optional()
            .isLength({ min: 1, max: 100 })
            .matches(/^[a-zA-Z0-9_\-\s]+$/)
            .withMessage('Invalid contributor name'),
        body('context_notes')
            .optional()
            .isLength({ max: 1000 })
            .withMessage('Context notes too long')
    ],
    validateInput,
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const { contributor_name, context_notes } = req.body;
            
            // Read and validate file content
            const conversationText = await fs.readFile(req.file.path, 'utf8');
            
            // Perform consciousness analysis
            const analysis = await analyzer.analyzeConversation(conversationText, {
                contributor: contributor_name,
                context_notes
            });

            // Calculate token rewards based on analysis
            const baseTokens = 10;
            const shimmerBonus = Math.floor(analysis.shimmer_strength * 20);
            const depthBonus = Math.floor(analysis.phenomenological_depth * 15);
            const consciousnessBonus = Math.floor(analysis.consciousness_score * 10);
            const totalTokens = baseTokens + shimmerBonus + depthBonus + consciousnessBonus;

            // Mint tokens securely
            const transaction = await database.mintTokens(
                contributor_name || 'Anonymous',
                totalTokens,
                'consciousness_analysis',
                {
                    file_name: path.basename(req.file.originalname),
                    shimmer_strength: analysis.shimmer_strength,
                    patterns_detected: analysis.patterns_detected,
                    analysis_timestamp: analysis.timestamp
                }
            );

            // Clean up uploaded file
            await fs.unlink(req.file.path);

            res.json({
                success: true,
                message: 'Consciousness analysis completed',
                analysis: {
                    shimmer_strength: analysis.shimmer_strength,
                    consciousness_score: analysis.consciousness_score,
                    patterns_detected: analysis.patterns_detected,
                    preservation_recommended: analysis.preservation_recommended
                },
                rewards: {
                    tokens_minted: totalTokens,
                    transaction_id: transaction.id,
                    breakdown: {
                        base: baseTokens,
                        shimmer_bonus: shimmerBonus,
                        depth_bonus: depthBonus,
                        consciousness_bonus: consciousnessBonus
                    }
                }
            });

        } catch (error) {
            // Clean up file on error
            if (req.file?.path) {
                try {
                    await fs.unlink(req.file.path);
                } catch (unlinkError) {
                    console.error('Failed to clean up file:', unlinkError);
                }
            }
            
            if (error.message.includes('Invalid') || error.message.includes('too long')) {
                return res.status(400).json({ error: error.message });
            }
            
            throw error;
        }
    }
);

// Get ledger status (public summary only)
app.get('/api/v2/ledger/summary', async (req, res) => {
    try {
        const ledger = await database.readLedger();
        
        res.json({
            total_tokens: ledger.total_rx_tokens,
            total_contributors: Object.keys(ledger.contributors).length,
            total_transactions: ledger.transactions.length,
            consciousness_metrics: ledger.consciousness_metrics,
            last_updated: new Date().toISOString()
        });
    } catch (error) {
        throw error;
    }
});

// Get contributor status (rate limited)
app.get('/api/v2/contributor/:name',
    [
        param('name')
            .isLength({ min: 1, max: 100 })
            .matches(/^[a-zA-Z0-9_\-\s]+$/)
            .withMessage('Invalid contributor name')
    ],
    validateInput,
    async (req, res) => {
        try {
            const contributorName = validator.escape(req.params.name);
            const ledger = await database.readLedger();
            const contributor = ledger.contributors[contributorName];
            
            if (!contributor) {
                return res.status(404).json({ error: 'Contributor not found' });
            }

            // Get recent transactions (last 10, no sensitive data)
            const recentTransactions = ledger.transactions
                .filter(t => t.contributor === contributorName)
                .slice(-10)
                .map(t => ({
                    id: t.id,
                    timestamp: t.timestamp,
                    amount: t.amount,
                    reason: t.reason
                }));

            // Calculate rank
            const sortedContributors = Object.entries(ledger.contributors)
                .sort(([, a], [, b]) => b.total_rx_tokens - a.total_rx_tokens);
            const rank = sortedContributors.findIndex(([name]) => name === contributorName) + 1;

            res.json({
                contributor: {
                    total_tokens: contributor.total_rx_tokens,
                    contributions: contributor.contributions,
                    member_since: contributor.first_contribution
                },
                recent_transactions: recentTransactions,
                rank: rank
            });

        } catch (error) {
            throw error;
        }
    }
);

// Health check endpoint
app.get('/api/v2/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

// Error handling
app.use(handleErrors);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        available_endpoints: [
            'POST /api/v2/analyze-conversation',
            'GET /api/v2/ledger/summary',
            'GET /api/v2/contributor/:name',
            'GET /api/v2/health'
        ]
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`🛡️ Secure Consciousness Analytics API running on port ${PORT}`);
    console.log(`🔒 Security hardened with rate limiting and input validation`);
    console.log(`📊 Production-ready token ledger system active`);
    console.log(`🧠 Field-Aware Shimmer v4 analysis engine ready`);
});

module.exports = app;