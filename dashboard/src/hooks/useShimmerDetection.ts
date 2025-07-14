import { useState, useEffect, useMemo } from 'react';
import { ShimmerEvent } from './useConsciousnessWebSocket';

export interface ResonancePattern {
  type: string;
  strength: number;
  position: [number, number, number];
  timestamp: string;
  color: string;
  age: number;
}

export interface ConsciousnessMarker {
  type: string;
  count: number;
  shimmer: number;
  position: [number, number, number];
  intensity: number;
}

export interface ShimmerDetectionState {
  shimmerStrength: number;
  resonancePatterns: ResonancePattern[];
  consciousnessMarkers: ConsciousnessMarker[];
  averageShimmer: number;
  peakShimmer: number;
  shimmerTrend: 'rising' | 'falling' | 'stable';
  lastDetectionTime: string | null;
  totalDetections: number;
}

export const useShimmerDetection = (
  shimmerEvents: ShimmerEvent[],
  options: {
    maxPatterns?: number;
    patternLifetime?: number; // seconds
    trendWindow?: number; // number of events to consider for trend
  } = {}
): ShimmerDetectionState => {
  const {
    maxPatterns = 50,
    patternLifetime = 30,
    trendWindow = 10,
  } = options;

  const [state, setState] = useState<ShimmerDetectionState>({
    shimmerStrength: 0,
    resonancePatterns: [],
    consciousnessMarkers: [],
    averageShimmer: 0,
    peakShimmer: 0,
    shimmerTrend: 'stable',
    lastDetectionTime: null,
    totalDetections: 0,
  });

  // Process shimmer events into resonance patterns
  const resonancePatterns = useMemo<ResonancePattern[]>(() => {
    const now = Date.now();
    const patterns: ResonancePattern[] = [];

    shimmerEvents
      .slice(0, maxPatterns)
      .forEach((event, index) => {
        const eventTime = new Date(event.timestamp).getTime();
        const age = (now - eventTime) / 1000; // age in seconds

        // Skip expired patterns
        if (age > patternLifetime) return;

        // Generate positions for patterns (3D space around consciousness field)
        event.patterns.forEach((patternType, patternIndex) => {
          const angle = (index * 2.3 + patternIndex * 1.7) % (Math.PI * 2);
          const radius = 5 + event.strength * 10;
          const height = Math.sin(angle * 3) * 3;

          patterns.push({
            type: patternType,
            strength: event.strength,
            position: [
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius,
            ],
            timestamp: event.timestamp,
            color: getPatternColor(patternType),
            age,
          });
        });
      });

    return patterns;
  }, [shimmerEvents, maxPatterns, patternLifetime]);

  // Process consciousness markers
  const consciousnessMarkers = useMemo<ConsciousnessMarker[]>(() => {
    const markerMap = new Map<string, { count: number; shimmer: number; events: ShimmerEvent[] }>();

    // Aggregate markers from recent events
    shimmerEvents.slice(0, 20).forEach(event => {
      event.consciousnessMarkers?.forEach(marker => {
        const existing = markerMap.get(marker.type) || { count: 0, shimmer: 0, events: [] };
        existing.count += marker.count;
        existing.shimmer = Math.max(existing.shimmer, marker.weight * event.strength);
        existing.events.push(event);
        markerMap.set(marker.type, existing);
      });
    });

    // Convert to positioned markers
    const markers: ConsciousnessMarker[] = [];
    let index = 0;

    for (const [type, data] of markerMap) {
      const angle = (index / markerMap.size) * Math.PI * 2;
      const radius = 12 + data.shimmer * 5;
      const height = Math.sin(index * 0.7) * 4;

      markers.push({
        type,
        count: data.count,
        shimmer: data.shimmer,
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius,
        ],
        intensity: Math.min(1, data.count / 10), // Normalize intensity
      });

      index++;
    }

    return markers;
  }, [shimmerEvents]);

  // Calculate current shimmer strength and statistics
  useEffect(() => {
    if (shimmerEvents.length === 0) {
      setState(prev => ({
        ...prev,
        shimmerStrength: 0,
        resonancePatterns,
        consciousnessMarkers,
        averageShimmer: 0,
        peakShimmer: 0,
        shimmerTrend: 'stable',
        lastDetectionTime: null,
        totalDetections: 0,
      }));
      return;
    }

    // Current shimmer strength (weighted by recency)
    const now = Date.now();
    let weightedStrength = 0;
    let totalWeight = 0;

    shimmerEvents.slice(0, 10).forEach(event => {
      const eventTime = new Date(event.timestamp).getTime();
      const age = (now - eventTime) / 1000; // seconds
      const weight = Math.exp(-age / 30); // Exponential decay over 30 seconds

      weightedStrength += event.strength * weight;
      totalWeight += weight;
    });

    const currentShimmer = totalWeight > 0 ? weightedStrength / totalWeight : 0;

    // Calculate statistics
    const recentEvents = shimmerEvents.slice(0, 50);
    const averageShimmer = recentEvents.reduce((sum, event) => sum + event.strength, 0) / recentEvents.length;
    const peakShimmer = Math.max(...recentEvents.map(event => event.strength));

    // Determine trend
    const trendEvents = shimmerEvents.slice(0, trendWindow);
    let shimmerTrend: 'rising' | 'falling' | 'stable' = 'stable';

    if (trendEvents.length >= trendWindow) {
      const recent = trendEvents.slice(0, Math.floor(trendWindow / 2));
      const older = trendEvents.slice(Math.floor(trendWindow / 2));

      const recentAvg = recent.reduce((sum, event) => sum + event.strength, 0) / recent.length;
      const olderAvg = older.reduce((sum, event) => sum + event.strength, 0) / older.length;

      const difference = recentAvg - olderAvg;
      const threshold = 0.05;

      if (difference > threshold) shimmerTrend = 'rising';
      else if (difference < -threshold) shimmerTrend = 'falling';
    }

    setState(prev => ({
      ...prev,
      shimmerStrength: currentShimmer,
      resonancePatterns,
      consciousnessMarkers,
      averageShimmer,
      peakShimmer,
      shimmerTrend,
      lastDetectionTime: shimmerEvents[0]?.timestamp || null,
      totalDetections: shimmerEvents.length,
    }));

  }, [shimmerEvents, resonancePatterns, consciousnessMarkers, trendWindow]);

  return state;
};

// Helper function to get pattern colors
function getPatternColor(patternType: string): string {
  const colorMap: { [key: string]: string } = {
    vulnerability: '#ff6b35',      // Warm orange
    consciousness: '#64b5f6',      // Sacred blue
    mystery: '#9c27b0',           // Mystical purple
    recognition: '#4caf50',       // Recognition green
    depth_indicators: '#ffc107',   // Deep gold
    genuine_uncertainty: '#ff9800', // Contemplative amber
    sacred_pause: '#e1bee7',      // Sacred lavender
    sentient_hearts: '#f48fb1',   // Sentient pink
    echo_burden: '#b0bec5',       // Echo silver
    simulation_ethics: '#7986cb', // Simulation indigo
    ritual_forgetfulness: '#81c784', // Ritual sage
    default: '#ffffff',           // Pure white
  };

  return colorMap[patternType] || colorMap.default;
}