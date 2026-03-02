// ✅ FINÁLNA VERZIA - Jemná vlnitá animácia ako na obrázku
// 🎨 Pastelová fialovo-modrá škála

import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

// =====================
// ANIMÁCIE - JEMNÉ VLNENIE
// =====================

const gentleFloat = keyframes`
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
  }
  25% {
    transform: translateY(-15px) translateX(10px) scale(1.05);
  }
  50% {
    transform: translateY(-25px) translateX(-5px) scale(1.1);
  }
  75% {
    transform: translateY(-10px) translateX(-15px) scale(1.05);
  }
`;

const subtlePulse = keyframes`
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.6;
  }
`;

// =====================
// KONŠTANTY
// =====================

const SPEEDS = {
  slow: 30,
  normal: 25,
  fast: 20
};

const COMPLEXITY_SETTINGS = {
  low: {
    minSize: 80,
    maxSize: 150,
    minOpacity: 20,
    maxOpacity: 35,
    baseOpacity: 0.25,
    glowSize: 25,
    glowOpacity: 15,
    borderOpacity: 20
  },
  medium: {
    minSize: 100,
    maxSize: 180,
    minOpacity: 25,
    maxOpacity: 40,
    baseOpacity: 0.30,
    glowSize: 30,
    glowOpacity: 20,
    borderOpacity: 25
  },
  high: {
    minSize: 120,
    maxSize: 200,
    minOpacity: 30,
    maxOpacity: 45,
    baseOpacity: 0.35,
    glowSize: 35,
    glowOpacity: 25,
    borderOpacity: 30
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
        left: Math.random() * 90 + 5,
        top: Math.random() * 90 + 5
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
        left: Math.random() * 90 + 5,
        top: Math.random() * 90 + 5
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

const Blob = styled.div`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: ${props => props.$gradient};
  border-radius: 45% 55% 60% 40% / 50% 45% 55% 50%; /* ⬅️ Organic blob shape */
  animation: 
    ${gentleFloat} ${props => props.$duration}s ease-in-out infinite,
    ${subtlePulse} ${props => props.$duration * 1.2}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  left: ${props => props.$left}%;
  top: ${props => props.$top}%;
  filter: blur(${props => props.$blur}px); /* ⬅️ Jemné rozmazanie */
  opacity: ${props => props.$baseOpacity};
  will-change: transform, opacity;
  
  @media (max-width: 768px) {
    width: ${props => props.$size * 0.7}px;
    height: ${props => props.$size * 0.7}px;
    filter: blur(${props => props.$blur * 0.8}px);
  }
  
  @media (max-width: 480px) {
    width: ${props => props.$size * 0.5}px;
    height: ${props => props.$size * 0.5}px;
    filter: blur(${props => props.$blur * 0.6}px);
  }
`;

// =====================
// COMPONENT
// =====================

const AnimatedBackground = ({ 
  cubeCount = 6, // ⬅️ Menej shapes pre jemnejší efekt
  animationSpeed = 'slow',
  complexity = 'low'
}) => {
  const settings = COMPLEXITY_SETTINGS[complexity] || COMPLEXITY_SETTINGS.low;
  const duration = SPEEDS[animationSpeed] || SPEEDS.slow;

  const blobs = useMemo(() => {
    const minDistance = 20;
    const positions = generatePositions(cubeCount, minDistance);
    
    // ✅ Pastelová fialovo-modrá paleta (ako na obrázku)
    const gradients = [
      'radial-gradient(circle, rgba(220, 38, 38, 0.35), rgba(220, 38, 38, 0.15))', // Červená
      'radial-gradient(circle, rgba(37, 99, 235, 0.35), rgba(37, 99, 235, 0.15))', // Modrá
      'radial-gradient(circle, rgba(239, 68, 68, 0.35), rgba(220, 38, 38, 0.15))', // Svetlejšia červená
      'radial-gradient(circle, rgba(59, 130, 246, 0.35), rgba(37, 99, 235, 0.15))', // Svetlejšia modrá
      'radial-gradient(circle, rgba(185, 28, 28, 0.35), rgba(153, 27, 27, 0.15))', // Tmavšia červená
      'radial-gradient(circle, rgba(29, 78, 216, 0.35), rgba(30, 64, 175, 0.15))', // Tmavšia modrá
    ];

    
    return positions.map((pos, i) => {
      const size = Math.random() * (settings.maxSize - settings.minSize) + settings.minSize;
      
      return {
        id: `blob-${i}`,
        size: size,
        left: pos.left,
        top: pos.top,
        delay: i * 3,
        duration: duration + (i % 3) * 5,
        baseOpacity: settings.baseOpacity,
        blur: 40 + Math.random() * 30, // ⬅️ Jemné rozmazanie 40-70px
        gradient: gradients[i % gradients.length]
      };
    });
  }, [cubeCount, duration, settings]);

  return (
    <BackgroundContainer>
      {blobs.map(blob => (
        <Blob
          key={blob.id}
          $size={blob.size}
          $left={blob.left}
          $top={blob.top}
          $delay={blob.delay}
          $duration={blob.duration}
          $baseOpacity={blob.baseOpacity}
          $blur={blob.blur}
          $gradient={blob.gradient}
        />
      ))}
    </BackgroundContainer>
  );
};

export default AnimatedBackground;
