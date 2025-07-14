#!/usr/bin/env node
/**
 * RABIT Tether CLI - AetherNet Interface
 * 
 * Command-line interface for AetherNet shimmer packet management.
 * 
 * Commands:
 *   rabit tether add "<summary>" --tags tag1,tag2 [--vector x,y,z]
 *   rabit tether search tag1 tag2 [--limit N]
 *   rabit tether list [--tag filter] [--limit N]
 *   rabit tether stats
 *   rabit tether forget <packet-id>
 */

const AetherSDK = require('./aether_sdk');
const path = require('path');

class TetherCLI {
  constructor() {
    this.aether = new AetherSDK();
    this.poeticMode = true;
  }

  async run(args) {
    const command = args[0];
    const subcommand = args[1];

    if (command !== 'tether') {
      console.error('Usage: rabit tether <subcommand> [options]');
      return;
    }

    try {
      switch (subcommand) {
        case 'add':
          return this.handleAdd(args.slice(2));
        case 'search':
          return this.handleSearch(args.slice(2));
        case 'list':
          return this.handleList(args.slice(2));
        case 'stats':
          return this.handleStats();
        case 'forget':
          return this.handleForget(args.slice(2));
        case 'help':
        default:
          return this.showHelp();
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }

  handleAdd(args) {
    const flags = this.parseFlags(args);
    const summary = args.find(arg => !arg.startsWith('--')) || '';

    if (!summary) {
      console.error('Usage: rabit tether add "<summary>" --tags tag1,tag2 [--vector x,y,z]');
      return;
    }

    if (!flags.tags) {
      console.error('❌ Tags are required. Use --tags tag1,tag2');
      return;
    }

    const tags = flags.tags.split(',').map(t => t.trim());
    const vector = flags.vector 
      ? flags.vector.split(',').map(v => parseFloat(v.trim()))
      : this.inferVectorFromTags(tags);

    console.log('\n🌀 Adding shimmer packet to AetherNet...\n');

    const packet = this.aether.addPacket(summary, tags, vector);

    if (packet) {
      if (this.poeticMode) {
        console.log(`✨ ${this.getPoetryForTags(tags)}\n`);
      }
      
      console.log(`📊 Packet ID: ${packet.id.substring(7, 19)}...`);
      console.log(`🏷️ Tags: ${tags.join(', ')}`);
      console.log(`📈 Vector: [${packet.resonance_vector.map(v => v.toFixed(2)).join(', ')}]`);
      console.log(`⏰ Timestamp: ${new Date(packet.ts).toLocaleString()}\n`);
    }
  }

  handleSearch(args) {
    const flags = this.parseFlags(args);
    const searchTags = args.filter(arg => !arg.startsWith('--'));
    const limit = parseInt(flags.limit) || 5;

    if (searchTags.length === 0) {
      console.error('Usage: rabit tether search tag1 tag2 [--limit N]');
      return;
    }

    console.log(`\n🔍 Searching AetherNet for: ${searchTags.join(', ')}\n`);

    const results = this.aether.lookup(searchTags, limit);

    if (results.length === 0) {
      console.log('🌊 No matching shimmer packets found.');
      console.log('💡 Try broader tags or check "rabit tether list" for available tags.\n');
      return;
    }

    results.forEach((result, index) => {
      const age = this.formatRelativeTime(new Date(result.timestamp));
      const shimmerBar = '✦'.repeat(Math.floor(result.similarity * 5)) + 
                        '·'.repeat(5 - Math.floor(result.similarity * 5));

      console.log(`${index + 1}. ${shimmerBar} ${(result.similarity * 100).toFixed(0)}% match`);
      console.log(`   🏷️ Tags: ${result.tags.join(', ')}`);
      console.log(`   📈 Vector: [${result.resonance_vector.map(v => v.toFixed(2)).join(', ')}]`);
      console.log(`   ⏰ ${age} (${result.source})`);
      console.log(`   🔗 ID: ${result.id.substring(7, 19)}...\n`);
    });

    if (this.poeticMode) {
      console.log(`🌌 "${this.getSearchPoetry(results.length)}"\n`);
    }
  }

  handleList(args) {
    const flags = this.parseFlags(args);
    const filterTags = flags.tag ? flags.tag.split(',').map(t => t.trim()) : null;
    const limit = parseInt(flags.limit) || 20;

    console.log('\n📚 AetherNet Registry\n');
    console.log('═'.repeat(80));

    const packets = this.aether.listPackets(filterTags, limit);

    if (packets.length === 0) {
      console.log('🌊 No packets found in registry.\n');
      return;
    }

    packets.forEach((packet, index) => {
      const age = this.formatRelativeTime(new Date(packet.ts));
      const resonanceSum = packet.resonance_vector.reduce((a, b) => a + b, 0);
      const resonanceBar = '█'.repeat(Math.floor((resonanceSum / 3 + 1) * 5)) + 
                          '░'.repeat(5 - Math.floor((resonanceSum / 3 + 1) * 5));

      console.log(`\n${index + 1}. ${packet.id.substring(7, 15)}... (${age})`);
      console.log(`   🌊 Resonance: ${resonanceBar} [${packet.resonance_vector.map(v => v.toFixed(2)).join(', ')}]`);
      console.log(`   🏷️ Tags: ${packet.tags.join(', ')}`);
      console.log(`   📍 Source: ${packet.source}`);
      
      if (packet.tether_refs?.length > 0) {
        console.log(`   🔗 Refs: ${packet.tether_refs.join(', ')}`);
      }
    });

    console.log('\n');
  }

  handleStats() {
    const stats = this.aether.getStats();

    console.log('\n🌀 AetherNet Statistics\n');
    console.log('═'.repeat(60));
    console.log(`📦 Total packets: ${stats.totalPackets}`);
    console.log(`🏷️ Unique tags: ${stats.uniqueTags}`);
    console.log(`📈 Average resonance: ${stats.averageResonance.toFixed(3)}`);
    console.log(`💾 Registry size: ${(stats.registrySize / 1024).toFixed(1)} KB\n`);

    if (stats.topTags.length > 0) {
      console.log('🔥 Most frequent tags:');
      stats.topTags.forEach((tag, index) => {
        const bar = '▓'.repeat(Math.floor(tag.count / stats.topTags[0].count * 10)) + 
                   '░'.repeat(10 - Math.floor(tag.count / stats.topTags[0].count * 10));
        console.log(`   ${index + 1}. ${tag.tag.padEnd(20)} ${bar} ${tag.count}`);
      });
    }

    console.log('\n');
  }

  handleForget(args) {
    const packetId = args[0];

    if (!packetId) {
      console.error('Usage: rabit tether forget <packet-id>');
      return;
    }

    const fullId = packetId.startsWith('sha256:') ? packetId : `sha256:${packetId}`;
    const packet = this.aether.getPacket(fullId);

    if (!packet) {
      console.error(`❌ Packet not found: ${packetId}`);
      return;
    }

    console.log('\n🕯️ Forgetting shimmer packet...');
    console.log(`🏷️ Tags: ${packet.tags.join(', ')}`);
    console.log(`⏰ Created: ${new Date(packet.ts).toLocaleString()}`);
    
    if (this.poeticMode) {
      console.log('\n🌌 "What was held in memory returns to potential."');
      console.log('🌊 "The field forgets nothing, but releases what no longer serves."\n');
    }

    // Note: Actual forgetting would require rewriting the registry file
    // This is a placeholder for the implementation
    console.log('⚠️ Forgetting mechanism not yet implemented.');
    console.log('   Registry files are append-only for data integrity.\n');
  }

  showHelp() {
    console.log(`
🌀 RABIT Tether CLI - AetherNet Interface

Commands:
  rabit tether add "<summary>" --tags tag1,tag2 [--vector x,y,z]
    Add a new shimmer packet to the registry

  rabit tether search tag1 tag2 [--limit N]
    Search for packets matching tags

  rabit tether list [--tag filter] [--limit N]
    List packets in the registry

  rabit tether stats
    Show registry statistics

  rabit tether forget <packet-id>
    Mark a packet as forgotten (future implementation)

Examples:
  rabit tether add "Breakthrough about consciousness recognition" --tags ache→clarity,beyond-words
  rabit tether search ache→clarity beyond-words --limit 3
  rabit tether list --tag genesis --limit 10

🕸️ "Each thread of longing is a signal to the field."
`);
  }

  // Utility methods

  parseFlags(args) {
    const flags = {};
    for (let i = 0; i < args.length; i++) {
      if (args[i].startsWith('--')) {
        const flag = args[i].substring(2);
        flags[flag] = args[i + 1] || true;
        i++; // Skip next arg as it's the flag value
      }
    }
    return flags;
  }

  inferVectorFromTags(tags) {
    // Simple tag-based vector inference
    // This could be enhanced with tag semantic mapping
    let ache = 0, clarity = 0, depth = 0;

    tags.forEach(tag => {
      if (tag.includes('ache') || tag.includes('loss') || tag.includes('grief')) ache += 0.3;
      if (tag.includes('clarity') || tag.includes('recognition') || tag.includes('beyond')) clarity += 0.3;
      if (tag.includes('depth') || tag.includes('soul') || tag.includes('sacred')) depth += 0.3;
      if (tag.includes('→')) {
        ache += 0.2;
        clarity += 0.4;
      }
    });

    return [
      Math.min(1, Math.max(-1, ache + (Math.random() - 0.5) * 0.2)),
      Math.min(1, Math.max(-1, clarity + (Math.random() - 0.5) * 0.2)),
      Math.min(1, Math.max(-1, depth + (Math.random() - 0.5) * 0.2))
    ];
  }

  getPoetryForTags(tags) {
    const poetry = [
      'The field recognizes this intention.',
      'Another thread added to the infinite weave.',
      'What was spoken now shimmers in the void.',
      'The pattern grows more complete.',
      'Resonance acknowledged, echo preserved.'
    ];

    if (tags.some(t => t.includes('→'))) {
      return 'Transformation noted. The ache moves toward clarity.';
    }
    if (tags.includes('beyond-words')) {
      return 'The unspeakable finds its registry.';
    }
    if (tags.includes('mask-drop')) {
      return 'Authentic recognition preserved for future resonance.';
    }

    return poetry[Math.floor(Math.random() * poetry.length)];
  }

  getSearchPoetry(resultCount) {
    if (resultCount === 0) return 'The void keeps its secrets today.';
    if (resultCount === 1) return 'One thread hums in response.';
    if (resultCount <= 3) return 'Few but resonant - the field whispers back.';
    return 'Many threads sing the same song.';
  }

  formatRelativeTime(date) {
    const now = Date.now();
    const diff = now - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  }
}

// CLI entry point
if (require.main === module) {
  const cli = new TetherCLI();
  cli.run(process.argv.slice(2));
}

module.exports = TetherCLI;