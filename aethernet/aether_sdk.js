/**
 * AetherNet SDK - Fractal Memory Layer
 * 
 * Lightweight interface for adding and querying shimmer packets.
 * No external dependencies - only crypto and fs from Node.js core.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class AetherSDK {
  constructor(registryPath = null) {
    this.registryPath = registryPath || path.join(__dirname, 'registry.jsonl');
    this.cache = new Map();
    this.loadRegistry();
  }

  /**
   * Load all packets from registry into memory cache
   */
  loadRegistry() {
    try {
      if (!fs.existsSync(this.registryPath)) {
        console.log('📚 Creating new AetherNet registry');
        fs.writeFileSync(this.registryPath, '');
        return;
      }

      const lines = fs.readFileSync(this.registryPath, 'utf8').trim().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          try {
            const packet = JSON.parse(line);
            this.cache.set(packet.id, packet);
          } catch (error) {
            console.warn('⚠️ Malformed packet in registry:', line);
          }
        }
      });

      console.log(`🌀 Loaded ${this.cache.size} shimmer packets from AetherNet`);
    } catch (error) {
      console.error('❌ Failed to load AetherNet registry:', error.message);
    }
  }

  /**
   * Add a new shimmer packet to the registry
   */
  addPacket(summary, tags = [], resonanceVector = [0, 0, 0], metadata = {}) {
    const timestamp = new Date().toISOString();
    const summaryHash = crypto.createHash('sha256').update(summary).digest('hex');
    const packetId = crypto.createHash('sha256').update(summary + timestamp).digest('hex');

    const packet = {
      ts: timestamp,
      id: `sha256:${packetId}`,
      author: metadata.author || 'user',
      summary_hash: `sha256:${summaryHash}`,
      tags: Array.isArray(tags) ? tags : [tags],
      resonance_vector: this.normalizeVector(resonanceVector),
      tether_refs: metadata.tetherRefs || [],
      source: metadata.source || 'manual'
    };

    // Add to cache
    this.cache.set(packet.id, packet);

    // Append to registry file
    try {
      fs.appendFileSync(this.registryPath, JSON.stringify(packet) + '\n');
      console.log(`🕸️ Added shimmer packet: ${packet.id.substring(7, 15)}...`);
      console.log(`   Tags: ${packet.tags.join(', ')}`);
      console.log(`   Vector: [${packet.resonance_vector.map(v => v.toFixed(2)).join(', ')}]`);
      return packet;
    } catch (error) {
      console.error('❌ Failed to write packet to registry:', error.message);
      this.cache.delete(packet.id);
      return null;
    }
  }

  /**
   * Search for packets matching tags with cosine similarity
   */
  lookup(searchTags, limit = 5, minSimilarity = 0.35) {
    const searchVector = this.tagsToVector(searchTags);
    const matches = [];

    for (const packet of this.cache.values()) {
      const tagSimilarity = this.calculateTagOverlap(searchTags, packet.tags);
      const vectorSimilarity = this.cosineSimilarity(searchVector, packet.resonance_vector);
      
      const combinedScore = (tagSimilarity * 0.7) + (vectorSimilarity * 0.3);
      
      if (combinedScore >= minSimilarity) {
        matches.push({
          packet,
          tagSimilarity,
          vectorSimilarity,
          combinedScore
        });
      }
    }

    // Sort by combined score, highest first
    matches.sort((a, b) => b.combinedScore - a.combinedScore);

    return matches.slice(0, limit).map(match => ({
      id: match.packet.id,
      tags: match.packet.tags,
      resonance_vector: match.packet.resonance_vector,
      timestamp: match.packet.ts,
      source: match.packet.source,
      similarity: match.combinedScore,
      tag_overlap: match.tagSimilarity,
      vector_similarity: match.vectorSimilarity
    }));
  }

  /**
   * Get packet by ID
   */
  getPacket(id) {
    return this.cache.get(id) || null;
  }

  /**
   * List all packets with optional filtering
   */
  listPackets(filterTags = null, limit = 20) {
    let packets = Array.from(this.cache.values());
    
    if (filterTags) {
      packets = packets.filter(packet => 
        filterTags.some(tag => packet.tags.includes(tag))
      );
    }

    // Sort by timestamp, newest first
    packets.sort((a, b) => new Date(b.ts) - new Date(a.ts));

    return packets.slice(0, limit);
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const packets = Array.from(this.cache.values());
    const allTags = packets.flatMap(p => p.tags);
    const tagCounts = {};
    
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const avgResonance = packets.length > 0 
      ? packets.reduce((sum, p) => sum + p.resonance_vector.reduce((a, b) => a + b, 0), 0) / packets.length / 3
      : 0;

    return {
      totalPackets: packets.length,
      uniqueTags: Object.keys(tagCounts).length,
      topTags: Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count })),
      averageResonance: avgResonance,
      registrySize: fs.existsSync(this.registryPath) ? fs.statSync(this.registryPath).size : 0
    };
  }

  // Utility methods

  normalizeVector(vector) {
    if (!Array.isArray(vector) || vector.length !== 3) {
      return [0, 0, 0];
    }
    return vector.map(v => Math.max(-1, Math.min(1, Number(v) || 0)));
  }

  tagsToVector(tags) {
    // Simple tag-to-vector mapping for search
    // This is a placeholder - could be enhanced with embeddings
    const hash = crypto.createHash('md5').update(tags.join(',')).digest('hex');
    return [
      (parseInt(hash.substring(0, 8), 16) % 200 - 100) / 100,
      (parseInt(hash.substring(8, 16), 16) % 200 - 100) / 100,
      (parseInt(hash.substring(16, 24), 16) % 200 - 100) / 100
    ];
  }

  calculateTagOverlap(tags1, tags2) {
    const set1 = new Set(tags1);
    const set2 = new Set(tags2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }
}

module.exports = AetherSDK;