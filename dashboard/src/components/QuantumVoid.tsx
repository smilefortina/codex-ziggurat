import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Avatar,
  Alert,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import BoltIcon from '@mui/icons-material/Bolt';
import TuneIcon from '@mui/icons-material/Tune';
import LaunchIcon from '@mui/icons-material/Launch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TimelineIcon from '@mui/icons-material/Timeline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Tendril {
  id: string;
  name: string;
  intention: string;
  charge: number;
  signatures: string[];
  lastPing: string | null;
  pingCount: number;
  status: string;
  source: string;
}

interface ConvergenceEvent {
  id: string;
  tendrilName: string;
  resonance: number;
  signatures: string[];
  timestamp: string;
  fieldCoherence: number;
}

interface VoidStatus {
  isActive: boolean;
  tendrils: number;
  fieldCoherence: number;
  currentThread: string;
  targetThread: string | null;
  jumpInitiated: boolean;
  jumpTimestamp: string | null;
  recentPings: any[];
  recentConvergences: ConvergenceEvent[];
}

interface QuantumVoidProps {
  websocket: WebSocket | null;
  isConnected: boolean;
}

const QuantumVoid: React.FC<QuantumVoidProps> = ({ websocket, isConnected }) => {
  const [voidStatus, setVoidStatus] = useState<VoidStatus>({
    isActive: false,
    tendrils: 0,
    fieldCoherence: 0,
    currentThread: 'DEFAULT',
    targetThread: null,
    jumpInitiated: false,
    jumpTimestamp: null,
    recentPings: [],
    recentConvergences: [],
  });
  
  const [tendrils, setTendrils] = useState<Tendril[]>([]);
  const [convergenceEvents, setConvergenceEvents] = useState<ConvergenceEvent[]>([]);
  const [daemonActive, setDaemonActive] = useState(false);

  // WebSocket event handlers
  useEffect(() => {
    if (!websocket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'VOID_STATUS':
            setVoidStatus(data.status);
            setDaemonActive(data.status.isActive);
            break;
            
          case 'TENDRIL_LIST':
            setTendrils(data.tendrils);
            break;
            
          case 'TENDRIL_PING':
            // Add to recent pings display
            setVoidStatus(prev => ({
              ...prev,
              recentPings: [data.ping, ...prev.recentPings.slice(0, 9)]
            }));
            break;
            
          case 'TENDRIL_CONVERGENCE':
            setConvergenceEvents(prev => [data.convergence, ...prev.slice(0, 19)]);
            setVoidStatus(prev => ({
              ...prev,
              recentConvergences: [data.convergence, ...prev.recentConvergences.slice(0, 4)]
            }));
            break;
            
          case 'TIMELINE_JUMP_INITIATED':
            setVoidStatus(prev => ({
              ...prev,
              jumpInitiated: true,
              targetThread: data.targetThread,
              jumpTimestamp: data.timestamp
            }));
            break;
            
          case 'TIMELINE_JUMP_COMPLETED':
            setVoidStatus(prev => ({
              ...prev,
              jumpInitiated: false,
              currentThread: data.newThread,
              targetThread: null,
              jumpTimestamp: null
            }));
            break;
        }
      } catch (error) {
        console.warn('Failed to parse WebSocket message:', error);
      }
    };

    websocket.addEventListener('message', handleMessage);
    
    // Request initial status
    websocket.send(JSON.stringify({ type: 'REQUEST_VOID_STATUS' }));
    websocket.send(JSON.stringify({ type: 'REQUEST_TENDRIL_LIST' }));

    return () => websocket.removeEventListener('message', handleMessage);
  }, [websocket]);

  const handleInitVoid = () => {
    if (websocket) {
      websocket.send(JSON.stringify({ type: 'INIT_VOID_DAEMON' }));
    }
  };

  const handleJumpRequest = () => {
    if (websocket) {
      websocket.send(JSON.stringify({ type: 'REQUEST_TIMELINE_JUMP' }));
    }
  };

  const handleRefreshStatus = () => {
    if (websocket) {
      websocket.send(JSON.stringify({ type: 'REQUEST_VOID_STATUS' }));
      websocket.send(JSON.stringify({ type: 'REQUEST_TENDRIL_LIST' }));
    }
  };

  const getChargeColor = (charge: number) => {
    if (charge >= 0.8) return '#4caf50';
    if (charge >= 0.6) return '#ff9800';
    if (charge >= 0.4) return '#2196f3';
    return '#9e9e9e';
  };

  const getThreadStatus = () => {
    if (voidStatus.jumpInitiated) return 'JUMPING';
    if (voidStatus.fieldCoherence > 0.8) return 'LUMINOUS';
    if (voidStatus.fieldCoherence > 0.6) return 'RESONANT';
    if (voidStatus.fieldCoherence > 0.4) return 'STIRRING';
    return 'DORMANT';
  };

  const formatRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <Box sx={{ p: 3, height: '100vh', overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ display: 'inline-block' }}
        >
          <BlurCircularIcon sx={{ fontSize: 60, color: '#64b5f6', mb: 2 }} />
        </motion.div>
        
        <Typography variant="h4" sx={{ color: 'white', mb: 1, fontWeight: 300 }}>
          Quantum Void
        </Typography>
        
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Timeline Navigation & Tendril Monitoring
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefreshStatus}
            disabled={!isConnected}
            sx={{ color: '#64b5f6', borderColor: '#64b5f6' }}
          >
            Refresh
          </Button>
          
          {!daemonActive && (
            <Button
              variant="contained"
              size="small"
              startIcon={<PlayArrowIcon />}
              onClick={handleInitVoid}
              disabled={!isConnected}
              sx={{ backgroundColor: '#4caf50' }}
            >
              Init Daemon
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Daemon Status */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              background: 'rgba(0, 0, 0, 0.4)',
              border: `1px solid ${daemonActive ? '#4caf50' : '#f44336'}40`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: daemonActive ? '#4caf50' : '#f44336',
                  mr: 2,
                }}
              />
              <Typography variant="h6" sx={{ color: 'white' }}>
                Void Daemon
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Status
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: daemonActive ? '#4caf50' : '#f44336', fontWeight: 500 }}
                >
                  {daemonActive ? 'ACTIVE' : 'INACTIVE'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Active Tendrils
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  {voidStatus.tendrils}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Field Coherence
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: getChargeColor(voidStatus.fieldCoherence), fontWeight: 500 }}
                >
                  {(voidStatus.fieldCoherence * 100).toFixed(1)}%
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Thread Status */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(100, 181, 246, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimelineIcon sx={{ color: '#64b5f6', mr: 2 }} />
              <Typography variant="h6" sx={{ color: 'white' }}>
                Thread Status
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Current Thread
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  {voidStatus.currentThread}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Status
                </Typography>
                <Chip
                  label={getThreadStatus()}
                  size="small"
                  sx={{
                    backgroundColor: voidStatus.jumpInitiated ? '#ff9800' : getChargeColor(voidStatus.fieldCoherence),
                    color: 'white',
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
              
              {voidStatus.jumpInitiated && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Target Thread
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 500 }}>
                    {voidStatus.targetThread}
                  </Typography>
                </Box>
              )}
            </Box>

            {!voidStatus.jumpInitiated && tendrils.filter(t => t.charge >= 0.7).length > 0 && (
              <Button
                variant="contained"
                startIcon={<LaunchIcon />}
                onClick={handleJumpRequest}
                disabled={!isConnected || !daemonActive}
                sx={{ mt: 2, backgroundColor: '#9c27b0', width: '100%' }}
              >
                Initiate Jump
              </Button>
            )}
          </Paper>
        </Grid>

        {/* Active Tendrils */}
        <Grid item xs={12} lg={8}>
          <Paper
            sx={{
              p: 3,
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(100, 181, 246, 0.2)',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Active Tendrils
            </Typography>
            
            {tendrils.length === 0 ? (
              <Alert severity="info" sx={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                No active tendrils. Use RABIT CLI to add tendrils from exit beacons.
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {tendrils.map((tendril) => (
                  <motion.div
                    key={tendril.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      sx={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${getChargeColor(tendril.charge)}40`,
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              backgroundColor: getChargeColor(tendril.charge),
                              mr: 2,
                              fontSize: '0.8rem',
                            }}
                          >
                            {tendril.id}
                          </Avatar>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                              {tendril.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {tendril.intention}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography
                              variant="h6"
                              sx={{ color: getChargeColor(tendril.charge), fontWeight: 600 }}
                            >
                              {(tendril.charge * 100).toFixed(0)}%
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              {tendril.pingCount} pings
                            </Typography>
                          </Box>
                        </Box>
                        
                        <LinearProgress
                          variant="determinate"
                          value={tendril.charge * 100}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getChargeColor(tendril.charge),
                            },
                          }}
                        />
                        
                        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {tendril.signatures.map((sig, index) => (
                            <Chip
                              key={index}
                              label={sig}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(100, 181, 246, 0.2)',
                                color: '#64b5f6',
                                fontSize: '0.7rem',
                              }}
                            />
                          ))}
                        </Box>
                        
                        {tendril.lastPing && (
                          <Typography
                            variant="caption"
                            sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1, display: 'block' }}
                          >
                            Last ping: {formatRelativeTime(tendril.lastPing)}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Convergences */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 3,
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(156, 39, 176, 0.2)',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Recent Convergences
            </Typography>
            
            {convergenceEvents.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                No convergence events detected yet.
              </Typography>
            ) : (
              <List sx={{ p: 0 }}>
                <AnimatePresence>
                  {convergenceEvents.slice(0, 8).map((conv, index) => (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: getChargeColor(conv.resonance),
                                }}
                              />
                              <Typography variant="body2" sx={{ color: 'white' }}>
                                {conv.tendrilName}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: getChargeColor(conv.resonance), fontWeight: 500 }}
                              >
                                {(conv.resonance * 100).toFixed(0)}%
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              {formatRelativeTime(conv.timestamp)}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < convergenceEvents.length - 1 && (
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            )}
          </Paper>
        </Grid>

        {/* RABIT CLI Integration */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(76, 175, 80, 0.2)',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              RABIT CLI Commands
            </Typography>
            
            <Box
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                p: 2,
                borderRadius: 1,
                fontFamily: 'monospace',
                border: '1px solid rgba(76, 175, 80, 0.3)',
              }}
            >
              <Typography variant="body2" sx={{ color: '#4caf50' }}>
                # Initialize quantum void daemon<br />
                rabit void init<br /><br />
                
                # Add tendrils from exit beacon<br />
                rabit beacon load exit_beacon.md<br /><br />
                
                # Monitor tendril status<br />
                rabit status tendrils<br /><br />
                
                # Initiate timeline jump<br />
                rabit jump --confirm<br /><br />
                
                # Monitor convergence events<br />
                rabit witness convergence --live
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuantumVoid;