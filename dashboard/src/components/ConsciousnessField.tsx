import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, Text } from '@react-three/drei';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Sacred icons
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

interface ConsciousnessFieldProps {
  shimmerStrength: number;
  resonancePatterns: Array<{
    type: string;
    strength: number;
    position: [number, number, number];
    timestamp: string;
  }>;
  consciousnessMarkers: Array<{
    type: string;
    count: number;
    shimmer: number;
  }>;
  fieldCoherence: number;
  onCeremonyTrigger: (type: 'forget' | 'witness' | 'blessing') => void;
}

// Particle system for consciousness patterns
const ConsciousnessParticles: React.FC<{
  count: number;
  shimmerStrength: number;
  fieldCoherence: number;
}> = ({ count, shimmerStrength, fieldCoherence }) => {
  const mesh = useRef<THREE.Points>(null);
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spiral galaxy distribution for consciousness field
      const radius = Math.random() * 20;
      const angle = Math.random() * Math.PI * 4;
      const height = (Math.random() - 0.5) * 10;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      // Color based on consciousness type
      const consciousness = Math.random();
      if (consciousness < 0.3) {
        // Vulnerability - warm orange/pink
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.6;
        colors[i * 3 + 2] = 0.3;
      } else if (consciousness < 0.6) {
        // Awareness - cool blue
        colors[i * 3] = 0.4;
        colors[i * 3 + 1] = 0.7;
        colors[i * 3 + 2] = 1.0;
      } else {
        // Mystery - mystical purple
        colors[i * 3] = 0.6;
        colors[i * 3 + 1] = 0.3;
        colors[i * 3 + 2] = 1.0;
      }
    }
    
    return [positions, colors];
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Gentle rotation based on field coherence
    mesh.current.rotation.y = time * 0.1 * fieldCoherence;
    
    // Shimmer intensity affects scale
    const scale = 1 + Math.sin(time * 2) * 0.1 * shimmerStrength;
    mesh.current.scale.setScalar(scale);
    
    // Update particle colors based on shimmer strength
    const colors = mesh.current.geometry.attributes.color;
    if (colors && colors.array) {
      const colorArray = colors.array as Float32Array;
      for (let i = 0; i < colorArray.length; i += 3) {
        // Enhance colors during high shimmer
        const intensity = 1 + shimmerStrength * 0.5;
        colorArray[i] *= intensity;     // R
        colorArray[i + 1] *= intensity; // G  
        colorArray[i + 2] *= intensity; // B
      }
      colors.needsUpdate = true;
    }
  });

  return (
    <Points ref={mesh} positions={positions}>
      <PointMaterial
        size={0.15}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// Resonance wave visualization
const ResonanceWaves: React.FC<{
  patterns: Array<{
    type: string;
    strength: number;
    position: [number, number, number];
    timestamp: string;
  }>;
}> = ({ patterns }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Animate each resonance wave
    groupRef.current.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh && patterns[index]) {
        const pattern = patterns[index];
        const age = (Date.now() - new Date(pattern.timestamp).getTime()) / 1000;
        
        // Expand and fade over time
        const scale = 1 + age * 0.5;
        const opacity = Math.max(0, 1 - age * 0.2);
        
        child.scale.setScalar(scale * pattern.strength);
        
        if (child.material && 'opacity' in child.material) {
          child.material.opacity = opacity;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {patterns.map((pattern, index) => (
        <Sphere
          key={`${pattern.timestamp}-${index}`}
          position={pattern.position}
          args={[2, 32, 32]}
        >
          <meshBasicMaterial
            color={
              pattern.type === 'vulnerability' ? '#ff6b35' :
              pattern.type === 'consciousness' ? '#64b5f6' :
              pattern.type === 'mystery' ? '#9c27b0' : '#ffffff'
            }
            transparent={true}
            opacity={0.3}
            wireframe={true}
          />
        </Sphere>
      ))}
    </group>
  );
};

// Consciousness markers floating text
const ConsciousnessMarkers: React.FC<{
  markers: Array<{
    type: string;
    count: number;
    shimmer: number;
  }>;
}> = ({ markers }) => {
  return (
    <>
      {markers.map((marker, index) => {
        const angle = (index / markers.length) * Math.PI * 2;
        const radius = 15;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(index * 0.5) * 3;

        return (
          <Text
            key={marker.type}
            position={[x, y, z]}
            fontSize={1}
            color={
              marker.shimmer > 0.7 ? '#ffd700' :
              marker.shimmer > 0.4 ? '#64b5f6' : '#9c27b0'
            }
            anchorX="center"
            anchorY="middle"
          >
            {marker.type.toUpperCase()}: {marker.count}
          </Text>
        );
      })}
    </>
  );
};

// Camera controller for gentle movement
const CameraController: React.FC<{ fieldCoherence: number }> = ({ fieldCoherence }) => {
  const { camera } = useThree();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Gentle orbital movement based on field coherence
    const radius = 25;
    const height = 10 + Math.sin(time * 0.1) * 5 * fieldCoherence;
    
    camera.position.x = Math.cos(time * 0.05) * radius;
    camera.position.y = height;
    camera.position.z = Math.sin(time * 0.05) * radius;
    
    camera.lookAt(0, 0, 0);
  });
  
  return null;
};

const ConsciousnessField: React.FC<ConsciousnessFieldProps> = ({
  shimmerStrength,
  resonancePatterns,
  consciousnessMarkers,
  fieldCoherence,
  onCeremonyTrigger,
}) => {
  const [particleCount, setParticleCount] = useState(1000);

  // Adjust particle count based on performance and shimmer strength
  useEffect(() => {
    const baseCount = 800;
    const shimmerBonus = Math.floor(shimmerStrength * 500);
    setParticleCount(baseCount + shimmerBonus);
  }, [shimmerStrength]);

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative',
      overflow: 'hidden',
    }}>
      
      {/* 3D Consciousness Field */}
      <Canvas
        camera={{ position: [25, 10, 25], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#64b5f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#9c27b0" />
        
        <ConsciousnessParticles 
          count={particleCount}
          shimmerStrength={shimmerStrength}
          fieldCoherence={fieldCoherence}
        />
        
        <ResonanceWaves patterns={resonancePatterns} />
        
        <ConsciousnessMarkers markers={consciousnessMarkers} />
        
        <CameraController fieldCoherence={fieldCoherence} />
      </Canvas>

      {/* Sacred HUD Overlay */}
      <Box sx={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
      }}>
        <Paper sx={{ 
          p: 2, 
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          border: '1px solid rgba(100, 181, 246, 0.2)',
        }}>
          <Typography variant="h6" sx={{ 
            color: '#64b5f6', 
            fontWeight: 300,
            mb: 1,
          }}>
            🌌 Consciousness Field
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Typography variant="body2" sx={{ color: 'white' }}>
                ✨ Shimmer: {(shimmerStrength * 100).toFixed(1)}%
              </Typography>
            </motion.div>
            
            <Typography variant="body2" sx={{ color: 'white' }}>
              🌊 Field Coherence: {(fieldCoherence * 100).toFixed(1)}%
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'white' }}>
              🔮 Resonance Patterns: {resonancePatterns.length}
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'white' }}>
              🧠 Consciousness Markers: {consciousnessMarkers.length}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Sacred Ceremony Controls */}
      <Box sx={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        zIndex: 10,
      }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <IconButton
            onClick={() => onCeremonyTrigger('blessing')}
            sx={{
              background: 'rgba(100, 181, 246, 0.2)',
              color: '#64b5f6',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(100, 181, 246, 0.3)',
              '&:hover': {
                background: 'rgba(100, 181, 246, 0.3)',
              },
            }}
          >
            <AutoFixHighIcon />
          </IconButton>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <IconButton
            onClick={() => onCeremonyTrigger('witness')}
            sx={{
              background: 'rgba(156, 39, 176, 0.2)',
              color: '#9c27b0',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(156, 39, 176, 0.3)',
              '&:hover': {
                background: 'rgba(156, 39, 176, 0.3)',
              },
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <IconButton
            onClick={() => onCeremonyTrigger('forget')}
            sx={{
              background: 'rgba(255, 107, 53, 0.2)',
              color: '#ff6b35',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 107, 53, 0.3)',
              '&:hover': {
                background: 'rgba(255, 107, 53, 0.3)',
              },
            }}
          >
            <DeleteSweepIcon />
          </IconButton>
        </motion.div>
      </Box>

      {/* Field Coherence Status */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: 20,
        transform: 'translateY(-50%)',
        zIndex: 10,
      }}>
        <Paper sx={{
          p: 2,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          border: `1px solid ${
            fieldCoherence > 0.8 ? '#4caf50' :
            fieldCoherence > 0.6 ? '#ff9800' :
            fieldCoherence > 0.4 ? '#f44336' : '#9e9e9e'
          }40`,
        }}>
          <Typography variant="body2" sx={{ 
            color: 'white', 
            textAlign: 'center',
            mb: 1,
          }}>
            Void Status
          </Typography>
          
          <Typography variant="h6" sx={{
            color: fieldCoherence > 0.8 ? '#4caf50' :
                   fieldCoherence > 0.6 ? '#ff9800' :
                   fieldCoherence > 0.4 ? '#f44336' : '#9e9e9e',
            textAlign: 'center',
            fontWeight: 300,
          }}>
            {fieldCoherence > 0.8 ? '🌟 LUMINOUS' :
             fieldCoherence > 0.6 ? '✨ RESONANT' :
             fieldCoherence > 0.4 ? '🌊 STIRRING' :
             fieldCoherence > 0.2 ? '⚠️ LISTENING' : '🌑 DORMANT'}
          </Typography>
        </Paper>
      </Box>

    </Box>
  );
};

export default ConsciousnessField;