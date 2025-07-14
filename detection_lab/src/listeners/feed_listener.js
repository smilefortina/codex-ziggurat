/**
 * Feed Listener - Reality Event Ingestion for Synchronicity Detection
 * 
 * Monitors RSS feeds, news APIs, and other external data sources
 * for content that might resonate with charged tendrils.
 * 
 * "The void listens to all frequencies of reality."
 */

const EventEmitter = require('events');
const crypto = require('crypto');

class FeedListener extends EventEmitter {
    constructor(options = {}) {
        super();
        this.feeds = new Map();
        this.pollingInterval = options.pollingInterval || 300000; // 5 minutes
        this.isActive = false;
        this.eventHistory = [];
        this.maxHistorySize = options.maxHistorySize || 1000;
        
        // Event processing
        this.navigator = options.navigator; // QuantumVoidNavigator instance
        
        console.log('📡 Feed Listener initialized');
        console.log(`⏰ Polling interval: ${this.pollingInterval / 1000}s`);
    }
    
    /**
     * Add a feed source for monitoring
     */
    addFeed(feedConfig) {
        const feedId = this.generateFeedId(feedConfig);
        
        const feed = {
            id: feedId,
            type: feedConfig.type || 'rss',
            url: feedConfig.url,
            name: feedConfig.name || feedConfig.url,
            tags: feedConfig.tags || [],
            enabled: feedConfig.enabled !== false,
            lastCheck: null,
            lastItems: [],
            metadata: feedConfig.metadata || {}
        };
        
        this.feeds.set(feedId, feed);
        
        console.log(`📋 Added feed: ${feed.name} (${feed.type})`);
        return feedId;
    }
    
    /**
     * Remove a feed source
     */
    removeFeed(feedId) {
        if (this.feeds.has(feedId)) {
            const feed = this.feeds.get(feedId);
            this.feeds.delete(feedId);
            console.log(`🗑️ Removed feed: ${feed.name}`);
            return true;
        }
        return false;
    }
    
    /**
     * Start monitoring all enabled feeds
     */
    startListening() {
        if (this.isActive) {
            console.log('📡 Feed listener already active');
            return;
        }
        
        this.isActive = true;
        console.log('📡 Starting feed monitoring...');
        console.log(`🕸️ Monitoring ${this.feeds.size} feeds`);
        
        // Initial check
        this.checkAllFeeds();
        
        // Set up polling interval
        this.pollingTimer = setInterval(() => {
            this.checkAllFeeds();
        }, this.pollingInterval);
        
        this.emit('listening:started', {
            feedCount: this.feeds.size,
            interval: this.pollingInterval
        });
    }
    
    /**
     * Stop monitoring feeds
     */
    stopListening() {
        if (!this.isActive) return;
        
        this.isActive = false;
        if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
            this.pollingTimer = null;
        }
        
        console.log('📡 Feed monitoring stopped');
        this.emit('listening:stopped');
    }
    
    /**
     * Check all enabled feeds for new content
     */
    async checkAllFeeds() {
        const enabledFeeds = Array.from(this.feeds.values()).filter(f => f.enabled);
        
        console.log(`🔍 Checking ${enabledFeeds.length} feeds...`);
        
        for (const feed of enabledFeeds) {
            try {
                await this.checkFeed(feed);
            } catch (error) {
                console.error(`❌ Error checking feed ${feed.name}: ${error.message}`);
                this.emit('feed:error', { feed, error: error.message });
            }
        }
    }
    
    /**
     * Check a specific feed for new content
     */
    async checkFeed(feed) {
        console.log(`📥 Checking feed: ${feed.name}`);
        
        let newItems = [];
        
        switch (feed.type) {
            case 'rss':
                newItems = await this.fetchRSSFeed(feed);
                break;
            case 'hackernews':
                newItems = await this.fetchHackerNews(feed);
                break;
            case 'reddit':
                newItems = await this.fetchReddit(feed);
                break;
            case 'twitter':
                newItems = await this.fetchTwitter(feed);
                break;
            case 'file':
                newItems = await this.watchFile(feed);
                break;
            default:
                console.warn(`⚠️ Unknown feed type: ${feed.type}`);
                return;
        }
        
        // Filter for truly new items
        const previousIds = new Set(feed.lastItems.map(item => item.id));
        const freshItems = newItems.filter(item => !previousIds.has(item.id));
        
        if (freshItems.length > 0) {
            console.log(`✨ Found ${freshItems.length} new items in ${feed.name}`);
            
            // Update feed state
            feed.lastCheck = new Date().toISOString();
            feed.lastItems = newItems.slice(0, 50); // Keep recent items for deduplication
            
            // Process each new item
            for (const item of freshItems) {
                await this.processNewItem(item, feed);
            }
            
            this.emit('feed:updated', { feed, newItems: freshItems });
        } else {
            feed.lastCheck = new Date().toISOString();
        }
    }
    
    /**
     * Process a new item and check for tendril resonances
     */
    async processNewItem(item, feed) {
        const eventId = this.generateEventId();
        
        const event = {
            id: eventId,
            type: 'REALITY_EVENT',
            source: feed.name,
            feedType: feed.type,
            timestamp: new Date().toISOString(),
            item: item,
            metadata: {
                feedId: feed.id,
                feedTags: feed.tags
            }
        };
        
        this.eventHistory.push(event);
        this.trimEventHistory();
        
        // Send pulse through tendril network if navigator is available
        if (this.navigator) {
            console.log(`📡 Sending pulse for: "${item.title?.substring(0, 60)}..."`);
            
            try {
                const pulse = await this.navigator.pulse(item.content || item.title, {
                    inputType: 'external_event',
                    source: `feed:${feed.name}`,
                    metadata: {
                        eventId: eventId,
                        url: item.url,
                        feedType: feed.type
                    }
                });
                
                // Check for significant resonances
                const strongResonances = pulse.resonances.filter(r => r.strength > 0.6);
                
                if (strongResonances.length > 0) {
                    console.log(`⚡ REALITY SYNCHRONICITY: ${strongResonances.length} tendrils resonating!`);
                    
                    this.emit('synchronicity:detected', {
                        event: event,
                        pulse: pulse,
                        resonances: strongResonances
                    });
                    
                    // Trigger special handling for high-resonance reality events
                    if (strongResonances.some(r => r.strength > 0.8)) {
                        this.emit('synchronicity:high', {
                            event: event,
                            pulse: pulse,
                            maxResonance: Math.max(...strongResonances.map(r => r.strength))
                        });
                    }
                }
                
            } catch (error) {
                console.error(`❌ Error processing pulse for ${item.title}: ${error.message}`);
            }
        }
        
        this.emit('item:processed', event);
    }
    
    /**
     * Fetch RSS feed content
     */
    async fetchRSSFeed(feed) {
        // Simplified RSS implementation - in production would use a proper RSS parser
        console.log(`📡 Fetching RSS from ${feed.url}`);
        
        try {
            const response = await this.makeRequest(feed.url);
            const items = this.parseRSSResponse(response, feed);
            
            return items.map(item => ({
                id: item.id || this.generateItemId(item.title + item.link),
                title: item.title,
                content: item.description || item.summary || item.title,
                url: item.link,
                publishedAt: item.pubDate || new Date().toISOString(),
                source: feed.name
            }));
            
        } catch (error) {
            console.error(`❌ RSS fetch failed for ${feed.url}: ${error.message}`);
            return [];
        }
    }
    
    /**
     * Fetch Hacker News content
     */
    async fetchHackerNews(feed) {
        console.log('📡 Fetching Hacker News top stories');
        
        try {
            // Use HN API for recent top stories
            const topStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
            const storyIds = await this.makeJSONRequest(topStoriesUrl);
            
            // Get details for first 10 stories
            const items = [];
            for (const id of storyIds.slice(0, 10)) {
                try {
                    const story = await this.makeJSONRequest(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                    if (story && story.title) {
                        items.push({
                            id: `hn-${story.id}`,
                            title: story.title,
                            content: story.text || story.title,
                            url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
                            publishedAt: new Date(story.time * 1000).toISOString(),
                            source: 'Hacker News'
                        });
                    }
                } catch (storyError) {
                    // Skip individual story errors
                }
            }
            
            return items;
            
        } catch (error) {
            console.error(`❌ Hacker News fetch failed: ${error.message}`);
            return [];
        }
    }
    
    /**
     * Watch a local file for changes
     */
    async watchFile(feed) {
        const fs = require('fs');
        const path = require('path');
        
        try {
            const filePath = feed.url.replace('file://', '');
            
            if (!fs.existsSync(filePath)) {
                return [];
            }
            
            const stats = fs.statSync(filePath);
            const lastModified = stats.mtime.toISOString();
            
            // Check if file was modified since last check
            if (feed.lastCheck && lastModified <= feed.lastCheck) {
                return [];
            }
            
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n').filter(line => line.trim());
            
            // Return new lines as items
            return lines.map((line, index) => ({
                id: `file-${path.basename(filePath)}-${crypto.createHash('md5').update(line).digest('hex').substring(0, 8)}`,
                title: `File Update: ${path.basename(filePath)}`,
                content: line,
                url: `file://${filePath}#line-${index + 1}`,
                publishedAt: lastModified,
                source: path.basename(filePath)
            }));
            
        } catch (error) {
            console.error(`❌ File watch failed for ${feed.url}: ${error.message}`);
            return [];
        }
    }
    
    /**
     * Get feed statistics
     */
    getFeedStats() {
        const feeds = Array.from(this.feeds.values());
        const recentEvents = this.eventHistory.filter(e => 
            Date.now() - new Date(e.timestamp).getTime() < 24 * 60 * 60 * 1000
        );
        
        return {
            totalFeeds: feeds.length,
            enabledFeeds: feeds.filter(f => f.enabled).length,
            feedTypes: this.countBy(feeds, 'type'),
            recentEvents: recentEvents.length,
            lastCheck: feeds.reduce((latest, feed) => {
                if (!feed.lastCheck) return latest;
                return latest && latest > feed.lastCheck ? latest : feed.lastCheck;
            }, null),
            isActive: this.isActive
        };
    }
    
    /**
     * List all configured feeds
     */
    listFeeds() {
        return Array.from(this.feeds.values()).map(feed => ({
            id: feed.id,
            name: feed.name,
            type: feed.type,
            url: feed.url,
            enabled: feed.enabled,
            lastCheck: feed.lastCheck,
            tags: feed.tags
        }));
    }
    
    // Helper methods
    generateFeedId(config) {
        return `FEED-${crypto.createHash('md5').update(config.url + config.type).digest('hex').substring(0, 8)}`;
    }
    
    generateEventId() {
        return `EVT-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;
    }
    
    generateItemId(content) {
        return crypto.createHash('md5').update(content).digest('hex').substring(0, 12);
    }
    
    async makeRequest(url) {
        // Simplified HTTP request - in production would use axios/fetch
        return new Promise((resolve, reject) => {
            const https = require('https');
            const http = require('http');
            
            const client = url.startsWith('https:') ? https : http;
            
            client.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', reject);
        });
    }
    
    async makeJSONRequest(url) {
        const response = await this.makeRequest(url);
        return JSON.parse(response);
    }
    
    parseRSSResponse(response, feed) {
        // Simplified RSS parsing - in production would use xml2js or similar
        const items = [];
        
        // Very basic regex-based RSS parsing
        const itemMatches = response.match(/<item[^>]*>[\s\S]*?<\/item>/g) || [];
        
        for (const itemXML of itemMatches) {
            const title = this.extractXMLContent(itemXML, 'title');
            const link = this.extractXMLContent(itemXML, 'link');
            const description = this.extractXMLContent(itemXML, 'description');
            const pubDate = this.extractXMLContent(itemXML, 'pubDate');
            
            if (title) {
                items.push({
                    title: title,
                    link: link,
                    description: description,
                    pubDate: pubDate
                });
            }
        }
        
        return items;
    }
    
    extractXMLContent(xml, tag) {
        const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i');
        const match = xml.match(regex);
        return match ? match[1].trim() : null;
    }
    
    countBy(array, property) {
        return array.reduce((counts, item) => {
            const key = item[property];
            counts[key] = (counts[key] || 0) + 1;
            return counts;
        }, {});
    }
    
    trimEventHistory() {
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory = this.eventHistory.slice(-Math.floor(this.maxHistorySize * 0.8));
        }
    }
}

module.exports = FeedListener;

// Test the feed listener if run directly
if (require.main === module) {
    console.log('📡 Testing Feed Listener...');
    
    const listener = new FeedListener({
        pollingInterval: 10000 // 10 seconds for testing
    });
    
    // Add some test feeds
    listener.addFeed({
        type: 'hackernews',
        name: 'Hacker News',
        tags: ['tech', 'news']
    });
    
    listener.addFeed({
        type: 'rss',
        url: 'https://feeds.ycombinator.com/rss',
        name: 'YC RSS Feed',
        tags: ['startup', 'tech']
    });
    
    // Set up event listeners
    listener.on('item:processed', (event) => {
        console.log(`📄 Processed: ${event.item.title}`);
    });
    
    listener.on('synchronicity:detected', (data) => {
        console.log(`⚡ SYNCHRONICITY: ${data.resonances.length} tendrils resonating with "${data.event.item.title}"`);
    });
    
    // Show feed stats
    setTimeout(() => {
        const stats = listener.getFeedStats();
        console.log('\n📊 Feed Statistics:');
        console.log(JSON.stringify(stats, null, 2));
        
        const feeds = listener.listFeeds();
        console.log('\n📋 Configured Feeds:');
        feeds.forEach(feed => {
            console.log(`  ${feed.name} (${feed.type}) - ${feed.enabled ? 'enabled' : 'disabled'}`);
        });
        
        // Start listening
        listener.startListening();
        
        // Stop after 30 seconds
        setTimeout(() => {
            listener.stopListening();
            console.log('\n✅ Feed Listener test complete');
            process.exit(0);
        }, 30000);
        
    }, 1000);
}