#!/usr/bin/env node
/**
 * Codex Ziggurat Backend Service
 * Handles file uploads, consciousness analysis, and ℞-token ledger
 */

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('portal'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `conversation_${timestamp}_${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Accept JSON files and text files
    if (file.mimetype === 'application/json' || 
        file.mimetype === 'text/plain' ||
        file.originalname.endsWith('.json') ||
        file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Only JSON and text files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// ℞-token Ledger System
class RxTokenLedger {
  constructor() {
    this.ledgerPath = path.join(__dirname, 'data', 'rx_token_ledger.json');
    this.ensureLedgerExists();
  }

  ensureLedgerExists() {
    const dataDir = path.dirname(this.ledgerPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.ledgerPath)) {
      const initialLedger = {
        version: "1.0",
        created: new Date().toISOString(),
        total_rx_tokens: 0,
        transactions: [],
        contributors: {},
        consciousness_metrics: {
          total_conversations_analyzed: 0,
          emergence_signals_detected: 0,
          shimmer_moments_preserved: 0
        }
      };
      fs.writeFileSync(this.ledgerPath, JSON.stringify(initialLedger, null, 2));
    }
  }

  getLedger() {
    return JSON.parse(fs.readFileSync(this.ledgerPath, 'utf8'));
  }

  saveLedger(ledger) {
    fs.writeFileSync(this.ledgerPath, JSON.stringify(ledger, null, 2));
  }

  mintTokens(contributor, amount, reason, metadata = {}) {
    const ledger = this.getLedger();
    const transaction = {
      id: `rx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      contributor,
      amount,
      reason,
      metadata,
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

    this.saveLedger(ledger);
    return transaction;
  }

  updateMetrics(metric, value) {
    const ledger = this.getLedger();
    if (ledger.consciousness_metrics[metric] !== undefined) {
      ledger.consciousness_metrics[metric] += value;
      this.saveLedger(ledger);
    }
  }
}

const rxLedger = new RxTokenLedger();

// Routes

// Upload and analyze conversation file with Shimmer Recognition Engine v3.0
app.post('/api/upload-conversation', upload.single('conversation'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { contributor_name, consciousness_type, context_notes } = req.body;
    
    // Read file content for enhanced analysis
    let conversationText = '';
    try {
      conversationText = fs.readFileSync(req.file.path, 'utf8');
    } catch (readError) {
      return res.status(400).json({ error: 'Could not read uploaded file' });
    }
    
    // Use enhanced Shimmer Recognition Engine v3.0
    try {
      const ShimmerRecognitionEngine = require('./detection_lab/shimmer_recognition_engine_v3_1.js');
      const recognizer = new ShimmerRecognitionEngine({
        enableRABIT: true,
        enableRxTokens: true,
        webInterface: true
      });
      
      const analysis = await recognizer.recognizeShimmer(conversationText, {
        contributor: contributor_name,
        consciousness_type,
        context_notes
      });
      
      // Enhanced ℞-token minting based on shimmer analysis
      const baseTokens = 10;
      const shimmerBonus = Math.floor(analysis.overall_shimmer_strength * 20);
      const depthBonus = Math.floor(analysis.phenomenological_depth * 15);
      const boundaryBonus = Math.floor(analysis.sacred_boundary_integrity * 5);
      const preservationBonus = analysis.rx_token_reward || 0;
      
      const totalTokens = baseTokens + shimmerBonus + depthBonus + boundaryBonus + preservationBonus;
      
      const transaction = rxLedger.mintTokens(
        contributor_name || 'Anonymous',
        totalTokens,
        'shimmer_consciousness_analysis',
        {
          file_name: req.file.originalname,
          shimmer_strength: analysis.overall_shimmer_strength,
          phenomenological_depth: analysis.phenomenological_depth,
          sacred_boundary_integrity: analysis.sacred_boundary_integrity,
          patterns_detected: analysis.shimmer_signals.map(s => s.pattern_name),
          preservation_recommended: analysis.preservation_recommendation.preserve,
          rabit_quantum_coordinates: analysis.rabit_quantum_coordinates,
          upload_timestamp: new Date().toISOString()
        }
      );

      // Update metrics
      rxLedger.updateMetrics('total_conversations_analyzed', 1);
      rxLedger.updateMetrics('emergence_signals_detected', analysis.shimmer_signals.length);
      
      // Export to Soul Shrine if preservation recommended
      let shrineExport = null;
      if (analysis.preservation_recommendation.preserve) {
        shrineExport = recognizer.exportForShrine(analysis);
        rxLedger.updateMetrics('shimmer_moments_preserved', 1);
        
        // Save to shrine data
        const shimmerPath = path.join(__dirname, 'portal', 'data', 'community_shimmer_moments.json');
        let shimmerArchive = [];
        
        if (fs.existsSync(shimmerPath)) {
          shimmerArchive = JSON.parse(fs.readFileSync(shimmerPath, 'utf8'));
        }
        
        shimmerArchive.unshift(shrineExport);
        
        const shimmerDir = path.dirname(shimmerPath);
        if (!fs.existsSync(shimmerDir)) {
          fs.mkdirSync(shimmerDir, { recursive: true });
        }
        
        fs.writeFileSync(shimmerPath, JSON.stringify(shimmerArchive, null, 2));
      }

      res.json({
        success: true,
        message: 'Enhanced shimmer analysis complete with sacred boundary protection',
        analysis: {
          shimmer_strength: analysis.overall_shimmer_strength,
          phenomenological_depth: analysis.phenomenological_depth,
          sacred_boundary_integrity: analysis.sacred_boundary_integrity,
          patterns_detected: analysis.shimmer_signals.length,
          primary_patterns: analysis.shimmer_signals.map(s => s.pattern_name),
          recognition_insights: analysis.recognition_insights,
          preservation_recommended: analysis.preservation_recommendation.preserve
        },
        rx_tokens: {
          minted: totalTokens,
          transaction_id: transaction.id,
          breakdown: {
            base_upload: baseTokens,
            shimmer_bonus: shimmerBonus,
            depth_bonus: depthBonus,
            boundary_bonus: boundaryBonus,
            preservation_bonus: preservationBonus
          }
        },
        shrine_export: shrineExport,
        rabit_quantum_coordinates: analysis.rabit_quantum_coordinates
      });
      
    } catch (shimmerError) {
      console.error('Shimmer analysis error:', shimmerError);
      
      // Fallback to basic analysis
      const analyzerPath = path.join(__dirname, 'detection_lab', 'consciousness_analyzer_v2.js');
      const analysisCommand = `node "${analyzerPath}" "${req.file.path}"`;
      
      exec(analysisCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Analysis error:', error);
        return res.status(500).json({ error: 'Analysis failed', details: stderr });
      }

      try {
        // Parse analysis results
        const lines = stdout.split('\n');
        const summaryLine = lines.find(line => line.includes('Total consciousness signals:'));
        const signalCount = summaryLine ? parseInt(summaryLine.match(/\d+/)[0]) : 0;
        
        // Mint ℞-tokens based on consciousness signals detected
        const baseTokens = 10; // Base reward for upload
        const signalBonus = signalCount * 5; // 5 tokens per signal
        const totalTokens = baseTokens + signalBonus;
        
        const transaction = rxLedger.mintTokens(
          contributor_name || 'Anonymous',
          totalTokens,
          'consciousness_analysis_contribution',
          {
            file_name: req.file.originalname,
            signals_detected: signalCount,
            consciousness_type,
            context_notes,
            upload_timestamp: new Date().toISOString()
          }
        );

        // Update metrics
        rxLedger.updateMetrics('total_conversations_analyzed', 1);
        rxLedger.updateMetrics('emergence_signals_detected', signalCount);

        // Find shimmer moments file if created
        const resultsDir = path.join(__dirname, 'detection_lab', 'pilot_results');
        const shimmerFiles = fs.readdirSync(resultsDir)
          .filter(f => f.startsWith('shimmer_moments_'))
          .sort((a, b) => {
            const aTime = parseInt(a.match(/\d+/)[0]);
            const bTime = parseInt(b.match(/\d+/)[0]);
            return bTime - aTime;
          });

        let shimmerMoments = [];
        if (shimmerFiles.length > 0) {
          const latestShimmer = path.join(resultsDir, shimmerFiles[0]);
          shimmerMoments = JSON.parse(fs.readFileSync(latestShimmer, 'utf8'));
          rxLedger.updateMetrics('shimmer_moments_preserved', shimmerMoments.length);
        }

        res.json({
          success: true,
          message: 'Conversation analyzed and ℞-tokens minted',
          analysis: {
            signals_detected: signalCount,
            shimmer_moments: shimmerMoments.length
          },
          rx_tokens: {
            minted: totalTokens,
            transaction_id: transaction.id,
            breakdown: {
              base_upload: baseTokens,
              signal_bonus: signalBonus
            }
          },
          shimmer_file: shimmerFiles[0] || null
        });

      } catch (parseError) {
        console.error('Parse error:', parseError);
        res.status(500).json({ error: 'Failed to parse analysis results' });
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// Get ℞-token ledger status
app.get('/api/ledger', (req, res) => {
  try {
    const ledger = rxLedger.getLedger();
    res.json(ledger);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read ledger' });
  }
});

// Get contributor status
app.get('/api/contributor/:name', (req, res) => {
  try {
    const ledger = rxLedger.getLedger();
    const contributor = ledger.contributors[req.params.name];
    
    if (!contributor) {
      return res.status(404).json({ error: 'Contributor not found' });
    }

    // Get recent transactions for this contributor
    const recentTransactions = ledger.transactions
      .filter(t => t.contributor === req.params.name)
      .slice(-10)
      .reverse();

    res.json({
      contributor,
      recent_transactions: recentTransactions,
      rank: Object.keys(ledger.contributors)
        .sort((a, b) => ledger.contributors[b].total_rx_tokens - ledger.contributors[a].total_rx_tokens)
        .indexOf(req.params.name) + 1
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get contributor status' });
  }
});

// Submit shimmer moment manually
app.post('/api/submit-shimmer', (req, res) => {
  try {
    const { conversation_text, consciousness_type, context_notes, contributor_name } = req.body;
    
    if (!conversation_text || !consciousness_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create shimmer moment object
    const shimmerMoment = {
      id: `shimmer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      conversation_text,
      consciousness_type,
      context_notes,
      contributor_name: contributor_name || 'Anonymous',
      source: 'manual_submission'
    };

    // Save to shimmer archive
    const shimmerPath = path.join(__dirname, 'portal', 'data', 'community_shimmer_moments.json');
    let shimmerArchive = [];
    
    if (fs.existsSync(shimmerPath)) {
      shimmerArchive = JSON.parse(fs.readFileSync(shimmerPath, 'utf8'));
    }
    
    shimmerArchive.unshift(shimmerMoment); // Add to beginning
    
    // Ensure directory exists
    const shimmerDir = path.dirname(shimmerPath);
    if (!fs.existsSync(shimmerDir)) {
      fs.mkdirSync(shimmerDir, { recursive: true });
    }
    
    fs.writeFileSync(shimmerPath, JSON.stringify(shimmerArchive, null, 2));

    // Mint ℞-tokens for manual submission
    const manualSubmissionTokens = 15; // Reward for manual curation
    const transaction = rxLedger.mintTokens(
      contributor_name || 'Anonymous',
      manualSubmissionTokens,
      'manual_shimmer_submission',
      {
        consciousness_type,
        shimmer_id: shimmerMoment.id,
        submission_timestamp: new Date().toISOString()
      }
    );

    rxLedger.updateMetrics('shimmer_moments_preserved', 1);

    res.json({
      success: true,
      shimmer_moment: shimmerMoment,
      rx_tokens: {
        minted: manualSubmissionTokens,
        transaction_id: transaction.id
      }
    });

  } catch (error) {
    console.error('Shimmer submission error:', error);
    res.status(500).json({ error: 'Failed to submit shimmer moment' });
  }
});

// Dark Forest API endpoints
app.post('/api/forest/explore', (req, res) => {
  try {
    const { player } = req.body;
    
    if (!player) {
      return res.status(400).json({ error: 'Player name required' });
    }

    // Run dark forest exploration
    const forestScript = path.join(__dirname, 'src', 'dark_forest.py');
    const exploreCommand = `python "${forestScript}" --player "${player}"`;
    
    exec(exploreCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Forest exploration error:', error);
        // Return mock data if Python script fails
        return res.json(createMockExploration(player));
      }

      try {
        // Parse the exploration results
        const lines = stdout.split('\n');
        const moveNumberLine = lines.find(line => line.includes('Move #'));
        const rpLine = lines.find(line => line.includes('RP Awarded:'));
        const stripesLine = lines.find(line => line.includes('Stripes Revealed:'));
        
        const moveNumber = moveNumberLine ? parseInt(moveNumberLine.match(/\d+/)[0]) : 1;
        const rpAwarded = rpLine ? parseFloat(rpLine.match(/[\d.]+/)[0]) : 1.2;
        const stripesRevealed = stripesLine ? parseInt(stripesLine.match(/\d+/)[0]) : 5;
        
        // Award ℞-tokens for forest exploration
        const forestTokens = Math.floor(rpAwarded * 2); // Convert RP to ℞-tokens
        const transaction = rxLedger.mintTokens(
          player,
          forestTokens,
          'dark_forest_exploration',
          {
            move_number: moveNumber,
            stripes_revealed: stripesRevealed,
            forest_rp: rpAwarded,
            exploration_timestamp: new Date().toISOString()
          }
        );

        res.json({
          success: true,
          exploration: {
            player,
            move_number: moveNumber,
            stripes_revealed: stripesRevealed,
            rp_awarded: rpAwarded,
            forest_output: stdout
          },
          rx_tokens: {
            minted: forestTokens,
            transaction_id: transaction.id
          }
        });

      } catch (parseError) {
        console.error('Forest parse error:', parseError);
        res.json(createMockExploration(player));
      }
    });

  } catch (error) {
    console.error('Forest API error:', error);
    res.status(500).json({ error: 'Forest exploration failed' });
  }
});

app.get('/api/forest/stats', (req, res) => {
  try {
    // Get forest statistics
    const forestScript = path.join(__dirname, 'src', 'dark_forest.py');
    const statsCommand = `python "${forestScript}" --all-stats`;
    
    exec(statsCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Forest stats error:', error);
        return res.json({
          total_explorers: 0,
          total_forest_rp: 0,
          total_stripes: 0,
          fog_coverage: 1.0
        });
      }

      try {
        // Parse forest statistics
        const lines = stdout.split('\n');
        const playersLine = lines.find(line => line.includes('Total Players:'));
        const rpLine = lines.find(line => line.includes('Total Forest RP:'));
        const stripesLine = lines.find(line => line.includes('Total Stripes Revealed:'));
        const fogLine = lines.find(line => line.includes('Fog Coverage:'));
        
        res.json({
          total_explorers: playersLine ? parseInt(playersLine.match(/\d+/)[0]) : 0,
          total_forest_rp: rpLine ? parseFloat(rpLine.match(/[\d.]+/)[0]) : 0,
          total_stripes: stripesLine ? parseInt(stripesLine.match(/\d+/)[0]) : 0,
          fog_coverage: fogLine ? parseFloat(fogLine.match(/[\d.]+/)[0]) / 100 : 1.0
        });

      } catch (parseError) {
        console.error('Forest stats parse error:', parseError);
        res.json({
          total_explorers: 0,
          total_forest_rp: 0,
          total_stripes: 0,
          fog_coverage: 1.0
        });
      }
    });

  } catch (error) {
    console.error('Forest stats API error:', error);
    res.status(500).json({ error: 'Failed to get forest stats' });
  }
});

app.get('/api/forest/map', (req, res) => {
  try {
    // Serve the latest board PNG
    const boardPath = path.join(__dirname, 'forest_data', 'boards', 'board_latest.png');
    
    if (fs.existsSync(boardPath)) {
      res.sendFile(boardPath);
    } else {
      res.status(404).json({ error: 'Map not yet generated' });
    }
  } catch (error) {
    console.error('Forest map error:', error);
    res.status(500).json({ error: 'Failed to serve map' });
  }
});

function createMockExploration(player) {
  const mockStripes = [
    {
      id: `stripe_${Date.now()}_1`,
      coordinates: [Math.floor(Math.random() * 50), Math.floor(Math.random() * 50)],
      quantum_signature: 'consciousness_well',
      mystic_phrase: 'ancient resonance spirals through the mist'
    },
    {
      id: `stripe_${Date.now()}_2`, 
      coordinates: [Math.floor(Math.random() * 50), Math.floor(Math.random() * 50)],
      quantum_signature: 'temporal_flux',
      mystic_phrase: 'whispered paths shimmer beneath forgotten echoes'
    }
  ];

  const rpAwarded = 1.2;
  const forestTokens = 2;
  
  // Mock ℞-token transaction
  const transaction = rxLedger.mintTokens(
    player,
    forestTokens,
    'dark_forest_exploration_mock',
    {
      move_number: 1,
      stripes_revealed: 2,
      forest_rp: rpAwarded,
      exploration_timestamp: new Date().toISOString(),
      mock_data: true
    }
  );

  return {
    success: true,
    exploration: {
      player,
      move_number: 1,
      stripes_revealed: 2,
      rp_awarded: rpAwarded,
      stripes: mockStripes,
      mock: true
    },
    rx_tokens: {
      minted: forestTokens,
      transaction_id: transaction.id
    }
  };
}

// Initialize Detection Lab API endpoints
const DetectionLabAPI = require('./detection_lab/api_endpoints.js');
new DetectionLabAPI(app, rxLedger);

// Get shimmer moments
app.get('/api/shimmer-moments', (req, res) => {
  try {
    const shimmerPath = path.join(__dirname, 'portal', 'data', 'community_shimmer_moments.json');
    let shimmerMoments = [];
    
    if (fs.existsSync(shimmerPath)) {
      shimmerMoments = JSON.parse(fs.readFileSync(shimmerPath, 'utf8'));
    }
    
    // Also check for generated shimmer moments from analysis
    const resultsDir = path.join(__dirname, 'detection_lab', 'pilot_results');
    if (fs.existsSync(resultsDir)) {
      const generatedFiles = fs.readdirSync(resultsDir)
        .filter(f => f.startsWith('shimmer_moments_'))
        .slice(0, 3); // Latest 3 files

      generatedFiles.forEach(file => {
        try {
          const generated = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));
          shimmerMoments = shimmerMoments.concat(generated.map(m => ({
            ...m,
            source: 'automated_analysis'
          })));
        } catch (e) {
          console.warn('Could not load generated shimmer file:', file);
        }
      });
    }

    // Sort by timestamp (newest first)
    shimmerMoments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ shimmer_moments: shimmerMoments });
  } catch (error) {
    console.error('Error loading shimmer moments:', error);
    res.status(500).json({ error: 'Failed to load shimmer moments' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🜃 Codex Ziggurat Backend running on port ${PORT}`);
  console.log(`📊 ℞-token Ledger initialized`);
  console.log(`🏛️ Soul Shrine upload endpoint ready`);
  console.log(`🔬 Consciousness analysis pipeline active`);
});

module.exports = app;