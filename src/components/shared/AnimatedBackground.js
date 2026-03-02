// ✅ FINÁLNA VERZIA - Ambient Background Motion
// 🎨 Plynulé tekuté tvary s gradientmi

import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

// =====================
// ANIMÁCIE - TEKUTÉ POHYBY
// =====================

const liquidFlow = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  25% {
    transform: translate(30px, -30px) scale(1.1);
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
  50% {
    transform: translate(-20px, -50px) scale(1.15);
    border-radius: 40% 60% 50% 40% / 60% 50% 60% 40%;
  }
  75% {
    transform: translate(-40px, -20px) scale(1.08);
    border-radius: 70% 30% 50% 50% / 30% 50% 50% 60%;
  }
  100% {
    transform: translate(0, 0) scale(1);
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
`;

const breathe = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.9;
  }
`;

// =====================
// KONŠTANTY
// =====================

const SPEEDS = {
  slow: 20,
  normal: 15,
  fast: 10
};

const COMPLEXITY_SETTINGS = {
  low: {
    minSize: 150,
    maxSize: 300,
    baseOpacity: 0.5,
  },
  medium: {
    minSize: 180,
    maxSize: 350,
    baseOpacity: 0.6,
  },
  high: {
    minSize: 200,
    maxSize: 400,
    baseOpacity: 0.7,
  }
};

// ✅ Pomocná funkcia na generovanie pozícií
const generatePositions = (count, minDistance) => {
  const positions = [];
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    const maxAttempts = 50;
    let validPosition = null;
    
    while (attempts < maxAttempts && !validPosition) {
      const candidate = {
        left: Math.random() * 100,
        top: Math.random() * 100
      };
      
      const isTooClose = positions.some(existing => {
        const dx = existing.left - candidate.left;
        const dy = existing.top - candidate.top;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < minDistance;
      });
      
      if (!isTooClose) {
        validPosition = candidate;
      }
      
      attempts++;
    }
    
    if (!validPosition) {
      validPosition = {
        left: Math.random() * 100,
        top: Math.random() * 100
      };
    }
    
    positions.push(validPosition);
  }
  
  return positions;
};

// =====================
// STYLED COMPONENTS
// =====================

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  background: ${props => props.theme.BACKGROUND_COLOR};
`;

const LiquidBlob = styled.div`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: ${props => props.$gradient};
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  animation: 
    ${liquidFlow} ${props => props.$duration}s ease-in-out infinite,
    ${breathe} ${props => props.$duration * 1.5}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  left: ${props => props.$left}%;
  top: ${props => props.$top}%;
  filter: blur(${props => props.$blur}px);
  opacity: ${props => props.$baseOpacity};
  mix-blend-mode: ${props => props.$blendMode};
  will-change: transform, opacity;
  
  @media (max-width: 768px) {
    width: ${props => props.$size * 0.7}px;
    height: ${props => props.$size * 0.7}px;
  }
  
  @media (max-width: 480px) {
    width: ${props => props.$size * 0.5}px;
    height: ${props => props.$size * 0.5}px;
    filter: blur(${props => props.$blur * 0.7}px);
  }
`;

// =====================
// COMPONENT
// =====================

const AnimatedBackground = ({ 
  cubeCount = 5,
  animationSpeed = 'slow',
  complexity = 'low'
}) => {
  const settings = COMPLEXITY_SETTINGS[complexity] || COMPLEXITY_SETTINGS.low;
  const duration = SPEEDS[animationSpeed] || SPEEDS.slow;

  const blobs = useMemo(() => {
    const minDistance = 15;
    const positions = generatePositions(cubeCount, minDistance);
    
    // ✅ Výrazné červeno-modré gradienty
    const gradients = [
      'radial-gradient(circle at 30% 50%, rgba(220, 38, 38, 0.7), rgba(185, 28, 28, 0.3))', // Červená
      'radial-gradient(circle at 70% 50%, rgba(37, 99, 235, 0.7), rgba(29, 78, 216, 0.3))', // Modrá
      'radial-gradient(circle at 50% 30%, rgba(239, 68, 68, 0.7), rgba(220, 38, 38, 0.3))', // Svetlejšia červená
      'radial-gradient(circle at 50% 70%, rgba(59, 130, 246, 0.7), rgba(37, 99, 235, 0.3))', // Svetlejšia modrá
      'radial-gradient(circle at 40% 60%, rgba(248, 113, 113, 0.7), rgba(239, 68, 68, 0.3))', // Extra červená
    ];
    
    return positions.map((pos, i) => {
      const size = Math.random() * (settings.maxSize - settings.minSize) + settings.minSize;
      
      return {
        id: `blob-${i}`,
        size: size,
        left: pos.left,
        top: pos.top,
        delay: i * 2,
        duration: duration + (i % 3) * 3,
        baseOpacity: settings.baseOpacity,
        blur: 20 + Math.random() * 20, // 20-40px blur
        gradient: gradients[i % gradients.length],
        blendMode: i % 2 === 0 ? 'normal' : 'screen' // Mix blend modes
      };
    });
  }, [cubeCount, duration, settings]);

  return (
    <BackgroundContainer>
      {blobs.map(blob => (
        <LiquidBlob
          key={blob.id}
          $size={blob.size}
          $left={blob.left}
          $top={blob.top}
          $delay={blob.delay}
          $duration={blob.duration}
          $baseOpacity={blob.baseOpacity}
          $blur={blob.blur}
          $gradient={blob.gradient}
          $blendMode={blob.blendMode}
        />
      ))}
    </BackgroundContainer>
  );
};

export default AnimatedBackground;
