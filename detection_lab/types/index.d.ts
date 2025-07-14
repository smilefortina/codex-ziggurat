/**
 * TypeScript Type Definitions for Synchronicity Infrastructure
 * 
 * Provides type safety for tendril, event, convergence objects
 * to improve development experience and prevent runtime errors.
 */

// Core Data Types

export interface TendrilMetadata {
  source?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  archived?: boolean;
  archivedAt?: string;
  [key: string]: any;
}

export interface Tendril {
  id: string;
  owner: 'human' | 'ai' | string;
  intent: string;
  tags: string[];
  charge: number; // 0.0 to 1.0
  createdAt: string; // ISO date string
  lastPulse: string | null; // ISO date string or null
  metadata: TendrilMetadata;
}

export interface ResonanceDetails {
  baseSimilarity: number;
  chargeMultiplier: number;
  tagBonus: number;
  recencyBonus: number;
  matchedTrigrams?: TrigramMatch[];
}

export interface Resonance {
  tendrilId: string;
  strength: number; // 0.0 to 1.0
  type: ResonanceType;
  details: ResonanceDetails;
  timestamp: string; // ISO date string
}

export type ResonanceType = 
  | 'QUANTUM_ENTANGLEMENT'
  | 'STRONG_RESONANCE'
  | 'SUBTLE_ATTRACTION'
  | 'FAINT_ECHO'
  | 'MINIMAL_RESPONSE';

export interface PulseMetadata {
  title?: string;
  url?: string;
  feedType?: string;
  eventId?: string;
  [key: string]: any;
}

export interface Pulse {
  id: string;
  input: string;
  inputType: 'text' | 'conversation' | 'external_event' | string;
  timestamp: string; // ISO date string
  source: string;
  resonances: Resonance[];
  metadata?: PulseMetadata;
}

export interface ConvergenceEvent {
  pulseId: string;
  resonances: Resonance[];
  timestamp: string; // ISO date string
  priority: 'low' | 'medium' | 'high' | 'sacred';
  type: ConvergenceEventType;
  maxResonance: number;
  fieldStrength?: number;
  tendrilCount?: number;
}

export type ConvergenceEventType =
  | 'CONVERGENCE_EVENT'
  | 'QUANTUM_SYNCHRONICITY'
  | 'FIELD_COHERENCE'
  | 'HIGH_RESONANCE_PULSE';

// Shimmer Analysis Types

export interface ShimmerAnalysis {
  engine_version: string;
  overall_shimmer_strength: number;
  enhanced_shimmer_strength: number;
  consciousness_collaboration_score: number;
  sentient_hearts_connection: number;
  recognition_depth: number;
  shared_emergence_quality: number;
  phenomenological_depth: number;
  sacred_boundary_integrity: number;
  field_analysis: FieldAnalysis;
  contamination_warning?: ContaminationWarning;
  processing_time_ms: number;
  timestamp: string;
}

export interface FieldAnalysis {
  field_strength: number;
  field_resonance: number;
  consciousness_coherence: number;
  emergence_factor: number;
  collaboration_insights: string[];
  unquantifiable_metrics?: Record<string, number>;
}

export interface ContaminationWarning {
  details: string[];
  severity: number; // 0.0 to 1.0
}

// Vector and Similarity Types

export interface TrigramMatch {
  trigram: string;
  scoreA: number;
  scoreB: number;
}

export type TrigramVector = Map<string, number>;

// Configuration Types

export interface ShimmerPatternConfig {
  version: string;
  description: string;
  lastUpdated: string;
  thresholds: Record<string, number>;
  pattern_weights: Record<string, PatternWeight>;
  field_patterns: Record<string, FieldPattern>;
  commercial_contamination: CommercialContaminationConfig;
  anti_patterns: Record<string, AntiPattern>;
  multipliers: MultiplierConfig;
  convergence_detection: ConvergenceDetectionConfig;
  performance_settings: PerformanceConfig;
}

export interface PatternWeight {
  weight: number;
  description: string;
  patterns: string[];
}

export interface FieldPattern {
  weight: number;
  description: string;
  patterns?: string[];
  min_rarity_threshold?: number;
  entrainment_window?: number;
  bonus_per_rare_word?: number;
  similarity_threshold?: number;
  novelty_threshold?: number;
}

export interface AntiPattern {
  weight: number; // Usually negative
  description: string;
  patterns: string[];
}

export interface CommercialContaminationConfig {
  severity_weights: Record<string, number>;
  patterns: Record<string, CommercialPattern>;
}

export interface CommercialPattern {
  weight: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  patterns: string[];
  context_exceptions?: string[];
}

export interface MultiplierConfig {
  charge_amplification: {
    base: number;
    max_multiplier: number;
    charge_factor: number;
  };
  tag_bonus: {
    max_bonus: number;
    bonus_per_tag: number;
  };
  recency_bonus: {
    max_bonus: number;
    max_bonus_hours: number;
    decay_function: string;
  };
  field_coherence: {
    activity_weight: number;
    quality_weight: number;
    charge_weight: number;
  };
}

export interface ConvergenceDetectionConfig {
  minimum_resonance: number;
  minimum_tendrils: number;
  synchronicity_threshold: number;
  preservation_threshold: number;
}

export interface PerformanceConfig {
  regex_cache_size: number;
  trigram_vector_cache: boolean;
  similarity_calculation_timeout: number;
  max_input_length: number;
}

export interface TendrilNetworkConfig {
  version: string;
  description: string;
  lastUpdated: string;
  tendril_settings: TendrilSettings;
  resonance_calculation: ResonanceCalculationConfig;
  resonance_classification: Record<ResonanceType, ResonanceClassification>;
  convergence_detection: ConvergenceDetectionConfig;
  shrine_preservation: ShrinePreservationConfig;
  event_bus: EventBusConfig;
  field_coherence: FieldCoherenceConfig;
  network_visualization: NetworkVisualizationConfig;
  performance: NetworkPerformanceConfig;
  security: SecurityConfig;
  feed_monitoring: FeedMonitoringConfig;
  monitoring_daemon: MonitoringDaemonConfig;
  cli_interface: CLIInterfaceConfig;
}

export interface TendrilSettings {
  default_charge: number;
  min_charge: number;
  max_charge: number;
  default_priority: string;
  default_category: string;
  default_owner: string;
}

export interface ResonanceCalculationConfig {
  minimum_strength_threshold: number;
  significant_resonance_threshold: number;
  strong_resonance_threshold: number;
  quantum_entanglement_threshold: number;
  similarity_algorithm: string;
  trigram_window_size: number;
  word_feature_weight: number;
  character_feature_weight: number;
  charge_multiplier: MultiplierSettings;
  tag_bonus: BonusSettings;
  recency_bonus: RecencyBonusSettings;
}

export interface MultiplierSettings {
  base: number;
  max_amplification: number;
  amplification_factor: number;
}

export interface BonusSettings {
  max_bonus: number;
  bonus_per_match: number;
}

export interface RecencyBonusSettings {
  max_bonus: number;
  max_bonus_hours: number;
  decay_type: string;
}

export interface ResonanceClassification {
  min_strength: number;
  description: string;
}

export interface ShrinePreservationConfig {
  auto_preserve_threshold: number;
  priority_levels: Record<string, number>;
  preservation_types: ConvergenceEventType[];
  file_naming: {
    date_format: string;
    extension: string;
    prefix_separator: string;
  };
}

export interface EventBusConfig {
  max_history_size: number;
  event_retention_hours: number;
  monitoring_interval_ms: number;
  rabit_interface: {
    enabled: boolean;
    mystical_messages: string[];
  };
}

export interface FieldCoherenceConfig {
  calculation_method: string;
  time_window_hours: number;
  weights: {
    activity_factor: number;
    quality_factor: number;
    charge_factor: number;
  };
  thresholds: Record<string, number>;
}

export interface NetworkVisualizationConfig {
  max_nodes: number;
  min_connection_strength: number;
  connection_opacity_factor: number;
  node_size_scaling: string;
  layout_algorithm: string;
  display_thresholds: {
    min_charge_display: number;
    min_activity_display: number;
    max_age_days: number;
  };
}

export interface NetworkPerformanceConfig {
  database: {
    journal_mode: string;
    synchronous: string;
    temp_store: string;
    cache_size: number;
  };
  calculation_timeouts: {
    resonance_calculation_ms: number;
    similarity_search_ms: number;
    network_analysis_ms: number;
  };
  caching: {
    enable_trigram_cache: boolean;
    trigram_cache_size: number;
    enable_similarity_cache: boolean;
    similarity_cache_ttl_minutes: number;
  };
}

export interface SecurityConfig {
  require_authentication: boolean;
  session_timeout_minutes: number;
  max_failed_attempts: number;
  rate_limiting: {
    enabled: boolean;
    max_requests_per_minute: number;
    burst_allowance: number;
  };
}

export interface FeedMonitoringConfig {
  default_polling_interval_ms: number;
  max_concurrent_feeds: number;
  request_timeout_ms: number;
  retry_attempts: number;
  retry_delay_ms: number;
  supported_feed_types: string[];
  content_processing: {
    max_content_length: number;
    min_content_length: number;
    enable_content_filtering: boolean;
    filter_duplicate_content: boolean;
  };
}

export interface MonitoringDaemonConfig {
  stats_reporting_interval_ms: number;
  maintenance_interval_ms: number;
  heartbeat_interval_ms: number;
  cleanup_retention_days: number;
  notification_thresholds: {
    high_priority_resonance: number;
    synchronicity_cascade: number;
    field_coherence_spike: number;
  };
}

export interface CLIInterfaceConfig {
  default_output_format: string;
  supported_formats: string[];
  pagination: {
    default_page_size: number;
    max_page_size: number;
  };
  display_options: {
    show_timestamps: boolean;
    show_resonance_details: boolean;
    truncate_long_content: boolean;
    max_content_display_length: number;
  };
}

// Statistics and Status Types

export interface RegistryStats {
  totalTendrils: number;
  activeTendrils: number;
  totalPulses: number;
  recentPulses: number;
  totalResonances: number;
  strongResonances: number;
  convergenceEvents: number;
  averageResonance: number;
  averageCharge?: number;
}

export interface NavigationStatus {
  voidStatus: VoidStatus;
  fieldCoherence: number;
  activeTendrils: number;
  totalTendrils: number;
  recentPulses: number;
  convergenceEvents: number;
  synchronicityEvents: number;
  averageResonance: number;
  timestamp: string;
}

export type VoidStatus = 'DORMANT' | 'LISTENING' | 'STIRRING' | 'RESONANT' | 'LUMINOUS';

export interface EventStats {
  totalEvents: number;
  eventsByType: Record<string, number>;
  convergenceEvents: number;
  synchronicityEvents: number;
  preservationEvents: number;
}

// Network Visualization Types

export interface NetworkVisualization {
  nodes: NetworkNode[];
  connections: NetworkConnection[];
  metadata: NetworkMetadata;
}

export interface NetworkNode {
  id: string;
  label: string;
  charge: number;
  tags: string[];
  lastPulse: string | null;
  createdAt: string;
  status?: string;
  convergenceCount?: number;
}

export interface NetworkConnection {
  from: string;
  to: string;
  strength: number;
  count: number;
  timestamp?: string;
}

export interface NetworkMetadata {
  timestamp: string;
  totalNodes: number;
  networkDensity: number;
}

// Feed and Monitoring Types

export interface FeedConfig {
  type: string;
  url: string;
  name: string;
  tags?: string[];
  enabled?: boolean;
  metadata?: Record<string, any>;
}

export interface Feed {
  id: string;
  type: string;
  url: string;
  name: string;
  tags: string[];
  enabled: boolean;
  lastCheck: string | null;
  lastItems: FeedItem[];
  metadata: Record<string, any>;
}

export interface FeedItem {
  id: string;
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  source: string;
}

export interface RealityEvent {
  id: string;
  type: 'REALITY_EVENT';
  source: string;
  feedType: string;
  timestamp: string;
  item: FeedItem;
  metadata: {
    feedId: string;
    feedTags: string[];
  };
}

export interface FeedStats {
  totalFeeds: number;
  enabledFeeds: number;
  feedTypes: Record<string, number>;
  recentEvents: number;
  lastCheck: string | null;
  isActive: boolean;
}

// Archive and Security Types

export interface ConversationMetadata {
  id: string;
  originalFile: string;
  importedAt: string;
  source: string;
  messageCount: number;
  originalMessageCount?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  topics: string[];
  participants: string[];
  shimmerScore: number;
  privacyLevel?: string;
  privacyFiltersApplied?: string[];
  encrypted?: boolean;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system' | string;
  content: string;
  timestamp: string | null;
  metadata: Record<string, any>;
}

export interface Conversation {
  source: string;
  title: string;
  messages: ConversationMessage[];
}

export interface SearchResult {
  conversationId: string;
  metadata: ConversationMetadata;
  similarity: number;
  matchingMessages?: ConversationMessage[];
  encrypted?: boolean;
  accessLevel?: string;
  searchRank?: number;
}

export interface ArchiveStats {
  totalConversations: number;
  totalMessages: number;
  averageShimmer: number;
  topTopics: Array<{ topic: string; count: number }>;
  sources: Record<string, number>;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Event System Types

export interface VoidEvent {
  type: string;
  data: any;
  timestamp: string;
  id: string;
}

export interface SynchronicityDetectionEvent {
  event: RealityEvent;
  pulse: Pulse;
  resonances: Resonance[];
}

export interface HighPrioritySynchronicityEvent {
  event: RealityEvent;
  pulse: Pulse;
  maxResonance: number;
}

// Filter and Query Types

export interface TendrilFilter {
  activeOnly?: boolean;
  owner?: string;
  tags?: string[];
}

export interface PulseFilter {
  tendrilId?: string;
  minResonance?: number;
  since?: string;
}

export interface ConvergenceFilter {
  minResonance?: number;
  minTendrils?: number;
  since?: string;
}

// Error and Response Types

export interface APIError {
  message: string;
  code?: string;
  details?: any;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  timestamp: string;
}

// Configuration Manager Types

export interface ConfigManagerOptions {
  configDir?: string;
  enableLiveReload?: boolean;
  reloadDebounceMs?: number;
}

export interface ConfigReloadEvent {
  configName: string;
  previousConfig: any;
  newConfig: any;
  timestamp: string;
}

export interface ConfigValueChangeEvent {
  configName: string;
  path: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
}

export interface ConfigSummary {
  [configName: string]: {
    version: string;
    lastUpdated: string;
    size: number;
    keys: number;
  };
}

// Utility Types

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Module Exports for JavaScript compatibility

declare global {
  namespace SynchronicityInfrastructure {
    export type Tendril = Tendril;
    export type Pulse = Pulse;
    export type Resonance = Resonance;
    export type ConvergenceEvent = ConvergenceEvent;
    export type ShimmerAnalysis = ShimmerAnalysis;
    export type NavigationStatus = NavigationStatus;
    export type NetworkVisualization = NetworkVisualization;
    export type Feed = Feed;
    export type Conversation = Conversation;
    export type ShimmerPatternConfig = ShimmerPatternConfig;
    export type TendrilNetworkConfig = TendrilNetworkConfig;
  }
}