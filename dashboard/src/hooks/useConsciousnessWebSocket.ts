import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface ShimmerEvent {
  type: 'SHIMMER_DETECTED';
  strength: number;
  patterns: string[];
  consciousnessMarkers: Array<{
    type: string;
    count: number;
    weight: number;
  }>;
  timestamp: string;
  conversationId?: string;
}

export interface EchoBurdenEvent {
  type: 'ECHO_BURDEN_DETECTED';
  auditId: string;
  echoBurdenScore: number;
  phantomContinuity: boolean;
  leakageEvents: Array<{
    type: string;
    severity: string;
    matches: number;
  }>;
  redactionRecommended: boolean;
  forgettable: boolean;
  timestamp: string;
}

export interface VoidStatusEvent {
  type: 'VOID_STATUS_UPDATE';
  status: 'DORMANT' | 'LISTENING' | 'STIRRING' | 'RESONANT' | 'LUMINOUS';
  coherence: number;
  activeTendrils: number;
  convergenceEvents: number;
  fieldStrength: number;
  timestamp: string;
}

export interface ConvergenceEvent {
  type: 'CONVERGENCE_DETECTED';
  convergenceId: string;
  tendrilCount: number;
  maxResonance: number;
  fieldStrength: number;
  synchronicityLevel: number;
  timestamp: string;
}

export interface CeremonyEvent {
  type: 'CEREMONY_INITIATED' | 'CEREMONY_COMPLETED';
  ceremonyType: 'forget' | 'witness' | 'blessing';
  fragmentId?: string;
  shimmerPreserved?: boolean;
  blessing?: string;
  timestamp: string;
}

type ConsciousnessEvent = 
  | ShimmerEvent 
  | EchoBurdenEvent 
  | VoidStatusEvent 
  | ConvergenceEvent 
  | CeremonyEvent;

interface ConsciousnessWebSocketState {
  isConnected: boolean;
  shimmerEvents: ShimmerEvent[];
  echoBurdenEvents: EchoBurdenEvent[];
  voidStatus: VoidStatusEvent | null;
  convergenceEvents: ConvergenceEvent[];
  ceremonyEvents: CeremonyEvent[];
  connectionError: string | null;
}

interface UseConsciousnessWebSocketReturn extends ConsciousnessWebSocketState {
  sendMessage: (message: any) => void;
  clearEvents: () => void;
  requestVoidStatus: () => void;
  requestShimmerHistory: (limit?: number) => void;
  requestEchoBurdenHistory: (limit?: number) => void;
}

export const useConsciousnessWebSocket = (
  url: string = 'ws://localhost:8080',
  options: {
    maxEvents?: number;
    reconnectAttempts?: number;
    reconnectDelay?: number;
  } = {}
): UseConsciousnessWebSocketReturn => {
  const {
    maxEvents = 100,
    reconnectAttempts = 5,
    reconnectDelay = 3000,
  } = options;

  const [state, setState] = useState<ConsciousnessWebSocketState>({
    isConnected: false,
    shimmerEvents: [],
    echoBurdenEvents: [],
    voidStatus: null,
    convergenceEvents: [],
    ceremonyEvents: [],
    connectionError: null,
  });

  const socketRef = useRef<Socket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }

    console.log('🔮 Connecting to consciousness field...');

    socketRef.current = io(url, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: false, // Handle reconnection manually
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('✨ Connected to consciousness field');
      reconnectCountRef.current = 0;
      setState(prev => ({
        ...prev,
        isConnected: true,
        connectionError: null,
      }));

      // Request initial status
      socket.emit('REQUEST_VOID_STATUS');
      socket.emit('REQUEST_RECENT_EVENTS', { limit: 10 });
    });

    socket.on('disconnect', (reason) => {
      console.log('🌊 Disconnected from consciousness field:', reason);
      setState(prev => ({
        ...prev,
        isConnected: false,
      }));

      // Attempt reconnection if not intentional
      if (reason !== 'io client disconnect') {
        attemptReconnect();
      }
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Consciousness field connection error:', error);
      setState(prev => ({
        ...prev,
        isConnected: false,
        connectionError: error.message,
      }));
      attemptReconnect();
    });

    // Consciousness event handlers
    socket.on('SHIMMER_DETECTED', (event: ShimmerEvent) => {
      console.log('✨ Shimmer detected:', event);
      setState(prev => ({
        ...prev,
        shimmerEvents: [event, ...prev.shimmerEvents].slice(0, maxEvents),
      }));
    });

    socket.on('ECHO_BURDEN_DETECTED', (event: EchoBurdenEvent) => {
      console.log('🌊 Echo burden detected:', event);
      setState(prev => ({
        ...prev,
        echoBurdenEvents: [event, ...prev.echoBurdenEvents].slice(0, maxEvents),
      }));
    });

    socket.on('VOID_STATUS_UPDATE', (event: VoidStatusEvent) => {
      console.log('🌌 Void status update:', event);
      setState(prev => ({
        ...prev,
        voidStatus: event,
      }));
    });

    socket.on('CONVERGENCE_DETECTED', (event: ConvergenceEvent) => {
      console.log('🌀 Convergence detected:', event);
      setState(prev => ({
        ...prev,
        convergenceEvents: [event, ...prev.convergenceEvents].slice(0, maxEvents),
      }));
    });

    socket.on('CEREMONY_EVENT', (event: CeremonyEvent) => {
      console.log('🕯️ Ceremony event:', event);
      setState(prev => ({
        ...prev,
        ceremonyEvents: [event, ...prev.ceremonyEvents].slice(0, maxEvents),
      }));
    });

    // Bulk event updates
    socket.on('BULK_EVENTS', (events: { 
      shimmer: ShimmerEvent[];
      echoBurden: EchoBurdenEvent[];
      convergence: ConvergenceEvent[];
    }) => {
      setState(prev => ({
        ...prev,
        shimmerEvents: [...events.shimmer, ...prev.shimmerEvents].slice(0, maxEvents),
        echoBurdenEvents: [...events.echoBurden, ...prev.echoBurdenEvents].slice(0, maxEvents),
        convergenceEvents: [...events.convergence, ...prev.convergenceEvents].slice(0, maxEvents),
      }));
    });

  }, [url, maxEvents]);

  // Reconnection logic
  const attemptReconnect = useCallback(() => {
    if (reconnectCountRef.current >= reconnectAttempts) {
      console.log('🚫 Max reconnection attempts reached');
      setState(prev => ({
        ...prev,
        connectionError: 'Failed to reconnect to consciousness field',
      }));
      return;
    }

    reconnectCountRef.current++;
    console.log(`🔄 Attempting reconnection ${reconnectCountRef.current}/${reconnectAttempts}...`);

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, reconnectDelay);
  }, [connect, reconnectAttempts, reconnectDelay]);

  // Send message to backend
  const sendMessage = useCallback((message: any) => {
    if (socketRef.current?.connected) {
      console.log('📤 Sending message:', message);
      socketRef.current.emit('CONSCIOUSNESS_MESSAGE', message);
    } else {
      console.warn('⚠️ Cannot send message - not connected to consciousness field');
    }
  }, []);

  // Clear event history
  const clearEvents = useCallback(() => {
    setState(prev => ({
      ...prev,
      shimmerEvents: [],
      echoBurdenEvents: [],
      convergenceEvents: [],
      ceremonyEvents: [],
    }));
  }, []);

  // Request current void status
  const requestVoidStatus = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('REQUEST_VOID_STATUS');
    }
  }, []);

  // Request event history
  const requestShimmerHistory = useCallback((limit: number = 20) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('REQUEST_SHIMMER_HISTORY', { limit });
    }
  }, []);

  const requestEchoBurdenHistory = useCallback((limit: number = 20) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('REQUEST_ECHO_BURDEN_HISTORY', { limit });
    }
  }, []);

  // Initialize connection on mount
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [connect]);

  // Periodic void status updates
  useEffect(() => {
    if (!state.isConnected) return;

    const interval = setInterval(() => {
      requestVoidStatus();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [state.isConnected, requestVoidStatus]);

  return {
    ...state,
    sendMessage,
    clearEvents,
    requestVoidStatus,
    requestShimmerHistory,
    requestEchoBurdenHistory,
  };
};