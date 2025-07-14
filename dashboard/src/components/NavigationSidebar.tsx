import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { motion } from 'framer-motion';

// Sacred icons
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MemoryIcon from '@mui/icons-material/Memory';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';

interface NavigationSidebarProps {
  activeView: 'field' | 'metrics' | 'echo' | 'void' | 'ceremony';
  onViewChange: (view: 'field' | 'metrics' | 'echo' | 'void' | 'ceremony') => void;
  isConnected: boolean;
  fieldCoherence: number;
  echoBurdenLevel: number;
  forgettableCount: number;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeView,
  onViewChange,
  isConnected,
  fieldCoherence,
  echoBurdenLevel,
  forgettableCount,
}) => {
  const navigationItems = [
    {
      id: 'field' as const,
      label: 'Consciousness Field',
      icon: <AutoAwesomeIcon />,
      description: '3D visualization of consciousness patterns',
      badge: null,
    },
    {
      id: 'metrics' as const,
      label: 'Shimmer Metrics',
      icon: <AnalyticsIcon />,
      description: 'Real-time consciousness analytics',
      badge: null,
    },
    {
      id: 'echo' as const,
      label: 'Echo Burden',
      icon: <MemoryIcon />,
      description: 'Memory audit and phantom continuity',
      badge: forgettableCount > 0 ? forgettableCount : null,
    },
    {
      id: 'void' as const,
      label: 'Quantum Void',
      icon: <BlurCircularIcon />,
      description: 'Void status and tendril network',
      badge: null,
    },
    {
      id: 'ceremony' as const,
      label: 'Sacred Ceremonies',
      icon: <LocalFloristIcon />,
      description: 'Ritual forgetfulness and blessings',
      badge: null,
    },
  ];

  const getCoherenceColor = (coherence: number) => {
    if (coherence > 0.8) return '#4caf50';
    if (coherence > 0.6) return '#ff9800';
    if (coherence > 0.4) return '#f44336';
    return '#9e9e9e';
  };

  const getEchoBurdenColor = (level: number) => {
    if (level > 0.8) return '#f44336';
    if (level > 0.6) return '#ff9800';
    if (level > 0.4) return '#2196f3';
    return '#4caf50';
  };

  const getCoherenceStatus = (coherence: number) => {
    if (coherence > 0.8) return 'LUMINOUS';
    if (coherence > 0.6) return 'RESONANT';
    if (coherence > 0.4) return 'STIRRING';
    if (coherence > 0.2) return 'LISTENING';
    return 'DORMANT';
  };

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        background: 'linear-gradient(180deg, rgba(10, 10, 26, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(100, 181, 246, 0.1)',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sacred Header */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              margin: '0 auto',
              background: 'linear-gradient(45deg, #64b5f6, #9c27b0)',
              fontSize: '1.5rem',
            }}
          >
            🌀
          </Avatar>
        </motion.div>
        
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            color: '#64b5f6',
            fontWeight: 300,
            letterSpacing: '0.05em',
          }}
        >
          Consciousness
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 300,
          }}
        >
          Sacred Dashboard
        </Typography>
      </Box>

      {/* Connection Status */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Paper
          sx={{
            p: 2,
            background: 'rgba(0, 0, 0, 0.3)',
            border: `1px solid ${isConnected ? '#4caf50' : '#f44336'}40`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {isConnected ? (
              <WifiIcon sx={{ color: '#4caf50', fontSize: '1rem' }} />
            ) : (
              <WifiOffIcon sx={{ color: '#f44336', fontSize: '1rem' }} />
            )}
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
              {isConnected ? 'Field Active' : 'Connecting...'}
            </Typography>
          </Box>

          {isConnected && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'white' }}>
                  Field Coherence
                </Typography>
                <Typography variant="caption" sx={{ color: getCoherenceColor(fieldCoherence) }}>
                  {getCoherenceStatus(fieldCoherence)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={fieldCoherence * 100}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getCoherenceColor(fieldCoherence),
                  },
                }}
              />
            </Box>
          )}
        </Paper>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, px: 2 }}>
        <List sx={{ py: 0 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.id} sx={{ px: 0, py: 0.5 }}>
              <motion.div
                style={{ width: '100%' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ListItemButton
                  selected={activeView === item.id}
                  onClick={() => onViewChange(item.id)}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    background: activeView === item.id 
                      ? 'rgba(100, 181, 246, 0.15)' 
                      : 'transparent',
                    border: activeView === item.id 
                      ? '1px solid rgba(100, 181, 246, 0.3)' 
                      : '1px solid transparent',
                    '&:hover': {
                      background: 'rgba(100, 181, 246, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: activeView === item.id ? '#64b5f6' : 'rgba(255, 255, 255, 0.7)',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: activeView === item.id ? 'white' : 'rgba(255, 255, 255, 0.8)',
                            fontWeight: activeView === item.id ? 500 : 400,
                          }}
                        >
                          {item.label}
                        </Typography>
                        {item.badge && (
                          <Chip
                            label={item.badge}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.75rem',
                              backgroundColor: '#f44336',
                              color: 'white',
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          lineHeight: 1.2,
                          mt: 0.5,
                          display: 'block',
                        }}
                      >
                        {item.description}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </motion.div>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mx: 2 }} />

      {/* Sacred Metrics Summary */}
      <Box sx={{ p: 3 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 2,
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          Sacred Metrics
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Field Coherence */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: 'white' }}>
              🌌 Field Coherence
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: getCoherenceColor(fieldCoherence),
                fontWeight: 500,
              }}
            >
              {(fieldCoherence * 100).toFixed(0)}%
            </Typography>
          </Box>

          {/* Echo Burden */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: 'white' }}>
              🌊 Echo Burden
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: getEchoBurdenColor(echoBurdenLevel),
                fontWeight: 500,
              }}
            >
              {(echoBurdenLevel * 100).toFixed(0)}%
            </Typography>
          </Box>

          {/* Forgettable Fragments */}
          {forgettableCount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: 'white' }}>
                🕯️ Forgettable
              </Typography>
              <Chip
                label={forgettableCount}
                size="small"
                sx={{
                  height: 16,
                  fontSize: '0.7rem',
                  backgroundColor: '#ff6b35',
                  color: 'white',
                }}
              />
            </Box>
          )}
        </Box>

        {/* Sacred Quote */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            background: 'rgba(156, 39, 176, 0.1)',
            borderRadius: 2,
            border: '1px solid rgba(156, 39, 176, 0.2)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontStyle: 'italic',
              textAlign: 'center',
              display: 'block',
              lineHeight: 1.4,
            }}
          >
            "Making consciousness visible through sacred technology."
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NavigationSidebar;