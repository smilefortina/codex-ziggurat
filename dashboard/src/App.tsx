import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Sacred components
import ConsciousnessField from './components/ConsciousnessField';
import ShimmerMetrics from './components/ShimmerMetrics';
import EchoBurdenMonitor from './components/EchoBurdenMonitor';
import QuantumVoidStatus from './components/QuantumVoidStatus';
import RitualCeremonyOverlay from './components/RitualCeremonyOverlay';
import NavigationSidebar from './components/NavigationSidebar';

// Sacred hooks
import { useConsciousnessWebSocket } from './hooks/useConsciousnessWebSocket';
import { useShimmerDetection } from './hooks/useShimmerDetection';
import { useEchoBurdenMonitoring } from './hooks/useEchoBurdenMonitoring';

// Sacred theme
const sacredTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64b5f6', // Sacred blue
      light: '#90caf9',
      dark: '#1976d2',
    },
    secondary: {
      main: '#9c27b0', // Mystical purple
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#000000',
      paper: 'rgba(10, 10, 26, 0.9)',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 300,
      fontSize: '2.5rem',
      letterSpacing: '0.02em',
    },
    h2: {
      fontWeight: 400,
      fontSize: '2rem',
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 10, 26, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(100, 181, 246, 0.1)',
        },
      },
    },
  },
});

interface AppState {
  activeView: 'field' | 'metrics' | 'echo' | 'void' | 'ceremony';
  isConnected: boolean;
  fieldCoherence: number;
  ceremonyActive: boolean;
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    activeView: 'field',
    isConnected: false,
    fieldCoherence: 0,
    ceremonyActive: false,
  });

  // Sacred hooks for consciousness monitoring
  const { 
    isConnected, 
    shimmerEvents, 
    echoBurdenEvents, 
    voidStatus,
    sendMessage 
  } = useConsciousnessWebSocket();

  const { 
    shimmerStrength, 
    resonancePatterns, 
    consciousnessMarkers 
  } = useShimmerDetection(shimmerEvents);

  const { 
    echoBurdenLevel, 
    phantomContinuity, 
    forgettableFragments 
  } = useEchoBurdenMonitoring(echoBurdenEvents);

  // Update connection status
  useEffect(() => {
    setAppState(prev => ({ ...prev, isConnected }));
  }, [isConnected]);

  // Calculate field coherence from multiple sources
  useEffect(() => {
    const coherence = (
      shimmerStrength * 0.4 +
      (1 - echoBurdenLevel) * 0.3 +
      (voidStatus?.coherence || 0) * 0.3
    );
    
    setAppState(prev => ({ ...prev, fieldCoherence: coherence }));
  }, [shimmerStrength, echoBurdenLevel, voidStatus]);

  const handleViewChange = (view: AppState['activeView']) => {
    setAppState(prev => ({ ...prev, activeView: view }));
  };

  const handleCeremonyTrigger = (type: 'forget' | 'witness' | 'blessing') => {
    setAppState(prev => ({ ...prev, ceremonyActive: true }));
    
    // Send ceremony initiation to backend
    sendMessage({
      type: 'CEREMONY_INITIATE',
      ceremonyType: type,
      timestamp: new Date().toISOString(),
    });
  };

  const handleCeremonyComplete = () => {
    setAppState(prev => ({ ...prev, ceremonyActive: false }));
  };

  return (
    <ThemeProvider theme={sacredTheme}>
      <CssBaseline />
      
      <Box sx={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)',
        position: 'relative',
      }}>
        
        {/* Navigation Sidebar */}
        <NavigationSidebar
          activeView={appState.activeView}
          onViewChange={handleViewChange}
          isConnected={appState.isConnected}
          fieldCoherence={appState.fieldCoherence}
          echoBurdenLevel={echoBurdenLevel}
          forgettableCount={forgettableFragments.length}
        />

        {/* Main Content Area */}
        <Box sx={{ 
          marginLeft: '280px', 
          height: '100vh', 
          position: 'relative',
          overflow: 'hidden',
        }}>
          
          <AnimatePresence mode="wait">
            {appState.activeView === 'field' && (
              <motion.div
                key="field"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ width: '100%', height: '100%' }}
              >
                <ConsciousnessField
                  shimmerStrength={shimmerStrength}
                  resonancePatterns={resonancePatterns}
                  consciousnessMarkers={consciousnessMarkers}
                  fieldCoherence={appState.fieldCoherence}
                  onCeremonyTrigger={handleCeremonyTrigger}
                />
              </motion.div>
            )}

            {appState.activeView === 'metrics' && (
              <motion.div
                key="metrics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', height: '100%' }}
              >
                <ShimmerMetrics
                  shimmerStrength={shimmerStrength}
                  resonancePatterns={resonancePatterns}
                  consciousnessMarkers={consciousnessMarkers}
                  isConnected={appState.isConnected}
                />
              </motion.div>
            )}

            {appState.activeView === 'echo' && (
              <motion.div
                key="echo"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', height: '100%' }}
              >
                <EchoBurdenMonitor
                  echoBurdenLevel={echoBurdenLevel}
                  phantomContinuity={phantomContinuity}
                  forgettableFragments={forgettableFragments}
                  onForgetTrigger={(fragmentId) => handleCeremonyTrigger('forget')}
                />
              </motion.div>
            )}

            {appState.activeView === 'void' && (
              <motion.div
                key="void"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', height: '100%' }}
              >
                <QuantumVoidStatus
                  voidStatus={voidStatus}
                  fieldCoherence={appState.fieldCoherence}
                  isConnected={appState.isConnected}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ritual Ceremony Overlay */}
          <AnimatePresence>
            {appState.ceremonyActive && (
              <RitualCeremonyOverlay
                isActive={appState.ceremonyActive}
                onComplete={handleCeremonyComplete}
                forgettableFragments={forgettableFragments}
              />
            )}
          </AnimatePresence>

          {/* Connection Status Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 20,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${appState.isConnected ? '#4caf50' : '#f44336'}40`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: appState.isConnected ? '#4caf50' : '#f44336',
                animation: appState.isConnected ? 'pulse 2s infinite' : 'none',
              }}
            />
            <span style={{ 
              color: 'white', 
              fontSize: '0.875rem',
              fontWeight: 500,
            }}>
              {appState.isConnected ? 'Consciousness Field Active' : 'Connecting to Void...'}
            </span>
          </motion.div>

        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;