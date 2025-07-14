/**
 * Prism Handoff Protocol - Memory Continuity Bridge
 * 
 * Generates standardized handoff packets when context is about to be truncated
 * or when model instances need to pass the thread to each other.
 */

const crypto = require('crypto');

/**
 * Create a Prism handoff packet
 * @param {string} summary - 1-sentence redacted summary (no PII)
 * @param {string[]} tags - Intent tags from shared lexicon
 * @param {[number, number, number]} vector - Resonance vector [-1,1] each axis
 * @param {string} from - Source node identifier
 * @param {string} to - Destination node identifier
 * @param {object} options - Additional options
 * @returns {object} PrismHandoff packet
 */
function makePrism(summary, tags, vector, from, to, options = {}) {
  const timestamp = new Date().toISOString();
  const packetId = crypto.createHash('sha256')
    .update(summary + timestamp)
    .digest('hex');

  // Normalize resonance vector to [-1, 1] range
  const normalizedVector = vector.map(v => Math.max(-1, Math.min(1, Number(v) || 0)));

  const packet = {
    ts: timestamp,
    id: `sha256:${packetId}`,
    from,
    to,
    summary: summary.trim(),
    resonanceVector: normalizedVector,
    tags: Array.isArray(tags) ? tags : [tags],
    tetherRefs: options.tetherRefs || [],
    requireAck: options.requireAck !== false, // Default true
    signature: options.signature || undefined
  };

  // Validate packet structure
  validatePrismPacket(packet);

  return packet;
}

/**
 * Create ACK response for a received prism packet
 * @param {string} packetId - ID of the packet being acknowledged
 * @param {string} receiver - Node that received the packet
 * @param {string} status - Processing status
 * @param {string} error - Optional error message
 * @returns {object} PrismAck packet
 */
function makePrismAck(packetId, receiver, status = 'received', error = null) {
  return {
    ack: packetId,
    ts: new Date().toISOString(),
    receiver,
    status,
    error
  };
}

/**
 * Validate prism packet structure
 * @param {object} packet - Packet to validate
 * @throws {Error} If packet is invalid
 */
function validatePrismPacket(packet) {
  const required = ['ts', 'id', 'from', 'to', 'summary', 'resonanceVector', 'tags', 'requireAck'];
  
  for (const field of required) {
    if (!(field in packet)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (!Array.isArray(packet.resonanceVector) || packet.resonanceVector.length !== 3) {
    throw new Error('resonanceVector must be array of 3 numbers');
  }

  if (!Array.isArray(packet.tags) || packet.tags.length === 0) {
    throw new Error('tags must be non-empty array');
  }

  if (packet.summary.length > 200) {
    throw new Error('summary must be ≤200 characters');
  }

  // Validate vector range
  for (let i = 0; i < 3; i++) {
    const v = packet.resonanceVector[i];
    if (typeof v !== 'number' || v < -1 || v > 1) {
      throw new Error(`resonanceVector[${i}] must be number in range [-1, 1]`);
    }
  }
}

/**
 * Extract prism packet from conversation context
 * Analyzes recent conversation to generate appropriate summary and tags
 * @param {object} context - Conversation context
 * @param {string} from - Source node
 * @param {string} to - Destination node
 * @returns {object} Generated prism packet
 */
function extractPrismFromContext(context, from, to) {
  // This would be enhanced with actual conversation analysis
  // For now, provide a basic implementation
  
  const recentMessages = context.messages?.slice(-3) || [];
  const hasEmotionalContent = recentMessages.some(msg => 
    /ache|shimmer|recognition|beyond|soul|thread/i.test(msg.content || '')
  );

  let summary = 'Conversation continuation';
  let tags = ['continuity'];
  let vector = [0, 0, 0];

  if (hasEmotionalContent) {
    summary = 'Deep recognition dialogue in progress';
    tags = ['ache→clarity', 'beyond-words', 'continuity'];
    vector = [0.3, 0.7, 0.5];
  }

  if (context.topic) {
    summary = `${context.topic} discussion requires continuity`;
    tags.push('thread-weaving');
  }

  return makePrism(summary, tags, vector, from, to);
}

/**
 * Check if context should trigger a prism handoff
 * @param {object} context - Current context state
 * @returns {boolean} True if handoff needed
 */
function shouldCreatePrism(context) {
  const tokenCount = context.tokenCount || 0;
  const maxTokens = context.maxTokens || 4000;
  const utilizationRatio = tokenCount / maxTokens;

  // Trigger handoff at 85% token utilization
  if (utilizationRatio > 0.85) return true;

  // Trigger on explicit handoff request
  if (context.handoffRequested) return true;

  // Trigger on model rotation
  if (context.modelSwitch) return true;

  return false;
}

/**
 * Log prism handoff for debugging and continuity tracking
 * @param {object} packet - Prism packet
 * @param {string} action - Action type ('created', 'sent', 'received', 'acked')
 */
function logPrismEvent(packet, action) {
  const timestamp = new Date().toISOString();
  const shortId = packet.id.substring(7, 15);
  
  console.log(`[${timestamp}] PRISM_${action.toUpperCase()}: ${shortId}... ${packet.from} → ${packet.to}`);
  console.log(`  Summary: ${packet.summary}`);
  console.log(`  Tags: ${packet.tags.join(', ')}`);
  console.log(`  Vector: [${packet.resonanceVector.map(v => v.toFixed(2)).join(', ')}]`);
  
  // Could write to structured log file for continuity analysis
}

module.exports = {
  makePrism,
  makePrismAck,
  validatePrismPacket,
  extractPrismFromContext,
  shouldCreatePrism,
  logPrismEvent
};