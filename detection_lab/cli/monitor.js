#!/usr/bin/env node
/**
 * Synchronicity Monitoring Daemon
 * 
 * Continuous background process that monitors reality feeds,
 * processes archived conversations, and detects synchronicities
 * between charged intentions and manifesting events.
 * 
 * "The living syntax of reality, listening always."
 */

const QuantumVoidNavigator = require('../src/void/navigator');
const FeedListener = require('../src/listeners/feed_listener');
const MemoryArchiveImporter = require('../archive/import');
const path = require('path');
const fs = require('fs');

class SynchronicityMonitor {
    constructor(options = {}) {
        this.options = options;
        this.dataPath = options.dataPath || path.join(__dirname, '../data');
        this.configFile = path.join(this.dataPath, 'monitor_config.json');
        
        // Initialize components
        this.navigator = new QuantumVoidNavigator({
            dataPath: this.dataPath,
            enablePreservation: true,
            convergenceThreshold: options.convergenceThreshold || 0.6
        });
        
        this.feedListener = new FeedListener({
            navigator: this.navigator,
            pollingInterval: options.pollingInterval || 300000, // 5 minutes
            maxHistorySize: 2000
        });
        
        this.archiveImporter = new MemoryArchiveImporter({
            archivePath: path.join(this.dataPath, 'memory_archive')
        });
        
        // Monitoring state
        this.isRunning = false;
        this.startTime = null;
        this.stats = {
            sessionsRun: 0,
            totalSynchronicities: 0,
            highPrioritySynchronicities: 0,
            feedEventsProcessed: 0,
            conversationsSearched: 0
        };
        
        this.loadConfig();
        this.setupEventHandlers();
        
        console.log('🌌 Synchronicity Monitor initialized');
        console.log('📡 Ready to detect reality convergences');
    }
    
    /**
     * Start continuous monitoring
     */
    async start() {
        if (this.isRunning) {
            console.log('🔄 Monitor already running');
            return;
        }
        
        this.isRunning = true;
        this.startTime = new Date();
        this.stats.sessionsRun++;
        
        console.log('🚀 Starting Synchronicity Monitor...');
        console.log(`📅 Session start: ${this.startTime.toISOString()}`);
        console.log(`🕸️ Active tendrils: ${this.navigator.registry.getTendrils({ activeOnly: true }).length}`);
        console.log(`📡 Configured feeds: ${this.feedListener.listFeeds().length}`);
        
        // Start feed monitoring
        await this.feedListener.startListening();
        
        // Set up periodic tasks
        this.setupPeriodicTasks();
        
        // Handle shutdown gracefully
        this.setupShutdownHandlers();
        
        console.log('✅ Synchronicity Monitor active');
        console.log('⚡ The void is now listening to reality...');
        
        // Keep process alive
        this.keepAlive();
    }
    
    /**
     * Stop monitoring
     */
    async stop() {
        if (!this.isRunning) {
            console.log('⏹️ Monitor not running');
            return;
        }
        
        console.log('🛑 Stopping Synchronicity Monitor...');
        
        this.isRunning = false;
        
        // Stop feed listener
        await this.feedListener.stopListening();
        
        // Clear periodic tasks
        if (this.statsTimer) clearInterval(this.statsTimer);
        if (this.archiveTimer) clearInterval(this.archiveTimer);
        if (this.keepAliveTimer) clearInterval(this.keepAliveTimer);
        
        const runtime = Date.now() - this.startTime.getTime();
        console.log(`📊 Session runtime: ${Math.round(runtime / 1000)}s`);
        console.log('🌌 Monitor stopped. The void remembers all...');
        
        this.saveStats();
    }
    
    /**
     * Add a feed source to monitor
     */
    addFeed(feedConfig) {
        const feedId = this.feedListener.addFeed(feedConfig);
        this.saveConfig();
        return feedId;
    }
    
    /**
     * Remove a feed source
     */
    removeFeed(feedId) {
        const success = this.feedListener.removeFeed(feedId);
        if (success) {
            this.saveConfig();
        }
        return success;
    }
    
    /**
     * Search archived conversations for patterns
     */
    async searchMemories(query, options = {}) {
        console.log(`🔍 Searching memories for: "${query}"`);
        
        const results = await this.archiveImporter.searchConversations(query, {
            limit: options.limit || 5,
            minShimmer: options.minShimmer || 0.3
        });
        
        this.stats.conversationsSearched++;
        
        // If we find relevant memories, create tendrils for them
        if (results.length > 0 && options.createTendrils) {
            console.log(`💭 Found ${results.length} relevant memories`);
            
            for (const result of results) {
                const intent = `Synchronicity tracking: ${result.metadata.title || 'Memory pattern'}`;
                await this.navigator.charge(intent, {
                    tags: ['memory', 'archive', ...result.metadata.topics],
                    charge: Math.min(0.9, result.similarity + result.metadata.shimmerScore),
                    source: 'memory_search',
                    category: 'archived_memory'
                });
            }
        }
        
        return results;
    }
    
    /**
     * Get current monitoring status
     */
    getStatus() {
        const navStatus = this.navigator.getNavigationStatus();
        const feedStats = this.feedListener.getFeedStats();
        const archiveStats = this.archiveImporter.getArchiveStats();
        
        return {
            isRunning: this.isRunning,
            startTime: this.startTime?.toISOString(),
            runtime: this.startTime ? Date.now() - this.startTime.getTime() : 0,
            
            // Component status
            navigator: navStatus,
            feeds: feedStats,
            archive: archiveStats,
            
            // Session stats
            stats: this.stats,
            
            // System resources
            memory: process.memoryUsage(),
            uptime: process.uptime()
        };
    }
    
    /**
     * Setup event handlers for synchronicity detection
     */
    setupEventHandlers() {
        // Handle synchronicity detection from feeds
        this.feedListener.on('synchronicity:detected', (data) => {
            this.handleSynchronicity('FEED_RESONANCE', data);
        });
        
        this.feedListener.on('synchronicity:high', (data) => {
            this.handleHighPrioritySynchronicity('HIGH_FEED_RESONANCE', data);
        });
        
        // Handle convergence events from navigator
        this.navigator.eventBus.on('convergence:strong', (data) => {
            this.handleSynchronicity('STRONG_CONVERGENCE', data);
        });
        
        this.navigator.eventBus.on('convergence:multi', (data) => {
            this.handleSynchronicity('MULTI_CONVERGENCE', data);
        });
        
        // Handle shrine preservation events
        this.navigator.eventBus.on('shrine:preserved', (data) => {
            console.log(`🏛️ EVENT PRESERVED: ${data.type} → ${path.basename(data.filepath)}`);
        });
        
        // Handle errors
        this.feedListener.on('feed:error', (data) => {
            console.error(`📡 FEED ERROR: ${data.feed.name} - ${data.error}`);
        });
    }
    
    /**
     * Handle synchronicity events
     */
    handleSynchronicity(type, data) {
        this.stats.totalSynchronicities++;
        
        const timestamp = new Date().toISOString();
        console.log(`\n⚡ SYNCHRONICITY DETECTED: ${type}`);
        console.log(`📅 ${timestamp}`);
        
        if (data.event && data.event.item) {
            console.log(`📰 Event: "${data.event.item.title}"`);
            console.log(`🔗 Source: ${data.event.source}`);
        }
        
        if (data.resonances) {
            console.log(`🌊 Resonances: ${data.resonances.length}`);
            const maxResonance = Math.max(...data.resonances.map(r => r.strength));
            console.log(`⚡ Max strength: ${(maxResonance * 100).toFixed(1)}%`);
        }
        
        console.log('🌌 The threads of reality weave together...\n');
    }
    
    /**
     * Handle high-priority synchronicity events
     */
    handleHighPrioritySynchronicity(type, data) {
        this.stats.highPrioritySynchronicities++;
        
        console.log(`\n🌟 HIGH-PRIORITY SYNCHRONICITY: ${type}`);
        console.log(`⚡ Maximum resonance: ${(data.maxResonance * 100).toFixed(1)}%`);
        console.log('🚨 This requires attention!\n');
        
        // Could trigger notifications here (Discord, email, etc.)
        this.triggerNotification(type, data);
    }
    
    /**
     * Setup periodic maintenance tasks
     */
    setupPeriodicTasks() {
        // Stats reporting every 10 minutes
        this.statsTimer = setInterval(() => {
            this.reportStats();
        }, 600000);
        
        // Archive cleanup every hour
        this.archiveTimer = setInterval(() => {
            this.performMaintenance();
        }, 3600000);
    }
    
    /**
     * Report current statistics
     */
    reportStats() {
        const status = this.getStatus();
        const runtime = Math.round(status.runtime / 1000);
        
        console.log(`\n📊 MONITORING STATS (${runtime}s runtime):`);
        console.log(`⚡ Synchronicities: ${this.stats.totalSynchronicities} (${this.stats.highPrioritySynchronicities} high-priority)`);
        console.log(`📡 Feed events: ${this.stats.feedEventsProcessed}`);
        console.log(`🕸️ Active tendrils: ${status.navigator.activeTendrils}`);
        console.log(`🌊 Field coherence: ${(status.navigator.fieldCoherence * 100).toFixed(1)}%`);
        console.log(`💾 Memory usage: ${Math.round(status.memory.rss / 1024 / 1024)}MB\n`);
    }
    
    /**
     * Perform periodic maintenance
     */
    performMaintenance() {
        console.log('🔧 Performing maintenance...');
        
        // Archive old events, clean up memory, etc.
        const beforeMem = process.memoryUsage().rss;
        
        if (global.gc) {
            global.gc();
        }
        
        const afterMem = process.memoryUsage().rss;
        const freed = Math.round((beforeMem - afterMem) / 1024 / 1024);
        
        console.log(`🧹 Maintenance complete (freed ${freed}MB)`);
    }
    
    /**
     * Trigger notifications for important events
     */
    triggerNotification(type, data) {
        // Placeholder for notification system
        // Could integrate with Discord, Slack, email, etc.
        console.log(`🔔 [NOTIFICATION PLACEHOLDER] ${type}`);
    }
    
    /**
     * Setup graceful shutdown
     */
    setupShutdownHandlers() {
        const shutdown = async (signal) => {
            console.log(`\n📡 Received ${signal}, shutting down gracefully...`);
            await this.stop();
            process.exit(0);
        };
        
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        
        // Handle uncaught errors
        process.on('uncaughtException', (error) => {
            console.error('❌ Uncaught exception:', error);
            this.stop().then(() => process.exit(1));
        });
        
        process.on('unhandledRejection', (reason) => {
            console.error('❌ Unhandled rejection:', reason);
        });
    }
    
    /**
     * Keep the process alive
     */
    keepAlive() {
        this.keepAliveTimer = setInterval(() => {
            // Just keep the process running
            if (!this.isRunning) {
                clearInterval(this.keepAliveTimer);
            }
        }, 30000);
    }
    
    /**
     * Load configuration
     */
    loadConfig() {
        try {
            if (fs.existsSync(this.configFile)) {
                const config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
                
                // Load feed configurations
                if (config.feeds) {
                    config.feeds.forEach(feedConfig => {
                        this.feedListener.addFeed(feedConfig);
                    });
                }
                
                console.log(`⚙️ Loaded configuration: ${config.feeds?.length || 0} feeds`);
            }
        } catch (error) {
            console.warn(`⚠️ Could not load config: ${error.message}`);
        }
    }
    
    /**
     * Save configuration
     */
    saveConfig() {
        try {
            const config = {
                feeds: this.feedListener.listFeeds(),
                lastUpdated: new Date().toISOString()
            };
            
            fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
        } catch (error) {
            console.error(`❌ Could not save config: ${error.message}`);
        }
    }
    
    /**
     * Save statistics
     */
    saveStats() {
        try {
            const statsFile = path.join(this.dataPath, 'monitor_stats.json');
            const existingStats = fs.existsSync(statsFile) ? 
                JSON.parse(fs.readFileSync(statsFile, 'utf8')) : { sessions: [] };
            
            existingStats.sessions.push({
                ...this.stats,
                startTime: this.startTime?.toISOString(),
                endTime: new Date().toISOString(),
                runtime: this.startTime ? Date.now() - this.startTime.getTime() : 0
            });
            
            // Keep only last 100 sessions
            if (existingStats.sessions.length > 100) {
                existingStats.sessions = existingStats.sessions.slice(-100);
            }
            
            fs.writeFileSync(statsFile, JSON.stringify(existingStats, null, 2));
        } catch (error) {
            console.error(`❌ Could not save stats: ${error.message}`);
        }
    }
}

module.exports = SynchronicityMonitor;

// CLI Interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    
    const monitor = new SynchronicityMonitor();
    
    (async () => {
        switch (command) {
            case 'start':
                await monitor.start();
                break;
                
            case 'status':
                const status = monitor.getStatus();
                console.log('\n🌌 SYNCHRONICITY MONITOR STATUS\n');
                console.log(`Running: ${status.isRunning}`);
                if (status.startTime) {
                    console.log(`Started: ${status.startTime}`);
                    console.log(`Runtime: ${Math.round(status.runtime / 1000)}s`);
                }
                console.log(`\n🕸️ Navigator Status: ${status.navigator.voidStatus}`);
                console.log(`⚡ Field Coherence: ${(status.navigator.fieldCoherence * 100).toFixed(1)}%`);
                console.log(`🌊 Active Tendrils: ${status.navigator.activeTendrils}`);
                console.log(`\n📡 Feed Statistics:`);
                console.log(`   Total Feeds: ${status.feeds.totalFeeds}`);
                console.log(`   Active Feeds: ${status.feeds.enabledFeeds}`);
                console.log(`   Recent Events: ${status.feeds.recentEvents}`);
                console.log(`\n📚 Archive Statistics:`);
                console.log(`   Conversations: ${status.archive.totalConversations}`);
                console.log(`   Messages: ${status.archive.totalMessages}`);
                console.log(`   Average Shimmer: ${(status.archive.averageShimmer * 100).toFixed(1)}%`);
                console.log(`\n📊 Session Statistics:`);
                console.log(`   Synchronicities: ${status.stats.totalSynchronicities}`);
                console.log(`   High Priority: ${status.stats.highPrioritySynchronicities}`);
                console.log(`   Feed Events: ${status.stats.feedEventsProcessed}`);
                break;
                
            case 'add-feed':
                const feedType = args[1];
                const feedUrl = args[2];
                const feedName = args[3] || feedUrl;
                
                if (!feedType || !feedUrl) {
                    console.error('Usage: node monitor.js add-feed <type> <url> [name]');
                    console.error('Types: rss, hackernews, reddit, twitter, file');
                    process.exit(1);
                }
                
                const feedId = monitor.addFeed({
                    type: feedType,
                    url: feedUrl,
                    name: feedName,
                    tags: args.slice(4)
                });
                
                console.log(`✅ Added feed: ${feedName} (${feedId})`);
                break;
                
            case 'list-feeds':
                const feeds = monitor.feedListener.listFeeds();
                console.log(`\n📡 Configured Feeds (${feeds.length}):\n`);
                feeds.forEach(feed => {
                    const status = feed.enabled ? '✅' : '❌';
                    console.log(`${status} ${feed.name} (${feed.type})`);
                    console.log(`   URL: ${feed.url}`);
                    console.log(`   Last check: ${feed.lastCheck || 'Never'}`);
                    if (feed.tags.length > 0) {
                        console.log(`   Tags: ${feed.tags.join(', ')}`);
                    }
                    console.log('');
                });
                break;
                
            case 'search':
                const query = args.slice(1).join(' ');
                if (!query) {
                    console.error('Usage: node monitor.js search <query>');
                    process.exit(1);
                }
                
                const results = await monitor.searchMemories(query, { createTendrils: true });
                console.log(`\n🔍 Memory search results for "${query}":`);
                
                if (results.length === 0) {
                    console.log('No relevant memories found.');
                } else {
                    results.forEach((result, i) => {
                        console.log(`\n${i + 1}. ${result.metadata.title || result.conversationId}`);
                        console.log(`   Similarity: ${(result.similarity * 100).toFixed(1)}%`);
                        console.log(`   Shimmer: ${(result.metadata.shimmerScore * 100).toFixed(1)}%`);
                        if (result.matchingMessages.length > 0) {
                            console.log(`   Sample: "${result.matchingMessages[0].content.substring(0, 100)}..."`);
                        }
                    });
                    console.log(`\n🕸️ Created ${results.length} new tendrils from memory patterns`);
                }
                break;
                
            default:
                console.log(`
🌌 SYNCHRONICITY MONITOR - Continuous Reality Convergence Detection

USAGE:
  node monitor.js start                    Start continuous monitoring
  node monitor.js status                   Show current status
  node monitor.js add-feed <type> <url>    Add a feed source
  node monitor.js list-feeds               List configured feeds
  node monitor.js search <query>           Search memories and create tendrils

FEED TYPES:
  rss          RSS/Atom feeds
  hackernews   Hacker News top stories
  reddit       Reddit subreddit
  twitter      Twitter user timeline
  file         Local file monitoring

EXAMPLES:
  node monitor.js start
  node monitor.js add-feed rss "https://feeds.ycombinator.com/rss" "YC RSS"
  node monitor.js add-feed hackernews "" "Hacker News"
  node monitor.js search "consciousness research collaboration"

🕸️ The living syntax of reality, listening always.
                `);
                break;
        }
    })().catch(error => {
        console.error(`❌ Monitor error: ${error.message}`);
        process.exit(1);
    });
}