//HOTOVO
// ✅ FINÁLNA VERZIA - Bez ESLint chýb

import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

// =====================
// ANIMÁCIE - ZJEDNODUŠENÉ
// =====================

const floatSimple = keyframes`
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) translateX(20px) rotate(180deg);
  }
`;

const pulse = keyframes`
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
  slow: 25,
  normal: 20,
  fast: 15
};

const COMPLEXITY_SETTINGS = {
  low: {
    minSize: 60,
    maxSize: 100,
    minOpacity: 25,
    maxOpacity: 45,
    baseOpacity: 0.35,
    glowSize: 15,
    glowOpacity: 30,
    borderOpacity: 40
  },
  medium: {
    minSize: 50,
    maxSize: 90,
    minOpacity: 30,
    maxOpacity: 50,
    baseOpacity: 0.40,
    glowSize: 18,
    glowOpacity: 35,
    borderOpacity: 45
  },
  high: {
    minSize: 40,
    maxSize: 80,
    minOpacity: 35,
    maxOpacity: 55,
    baseOpacity: 0.45,
    glowSize: 20,
    glowOpacity: 40,
    borderOpacity: 50
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
    
    // Fallback ak sa nepodarí nájsť validnú pozíciu
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

const Cube = styled.div`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: linear-gradient(
    135deg,
    rgba(139, 0, 0, ${props => props.$baseOpacity}),
    rgba(220, 38, 38, ${props => props.$baseOpacity})
  );
  border: 1px solid rgba(185, 28, 28, ${props => props.$borderOpacity / 100});
  border-radius: ${props => props.$borderRadius}px;
  animation: 
    ${floatSimple} ${props => props.$duration}s ease-in-out infinite,
    ${pulse} ${props => props.$duration * 0.8}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  left: ${props => props.$left}%;
  top: ${props => props.$top}%;
  box-shadow: 0 0 ${props => props.$glowSize}px rgba(139, 0, 0, ${props => props.$glowOpacity / 100});
  will-change: transform;
  
  @media (max-width: 768px) {
    width: ${props => props.$size * 0.7}px;
    height: ${props => props.$size * 0.7}px;
    animation: ${floatSimple} ${props => props.$duration * 1.5}s ease-in-out infinite;
  }
  
  @media (max-width: 480px) {
    width: ${props => props.$size * 0.5}px;
    height: ${props => props.$size * 0.5}px;
    border: none;
    box-shadow: none;
  }
`;

// =====================
// COMPONENT
// =====================

const AnimatedBackground = ({ 
  cubeCount = 8,
  animationSpeed = 'slow',
  complexity = 'low'
}) => {
  const settings = COMPLEXITY_SETTINGS[complexity] || COMPLEXITY_SETTINGS.low;
  const duration = SPEEDS[animationSpeed] || SPEEDS.slow;

  const cubes = useMemo(() => {
    const minDistance = 25;
    const positions = generatePositions(cubeCount, minDistance);
    
    return positions.map((pos, i) => {
      const size = Math.random() * (settings.maxSize - settings.minSize) + settings.minSize;
      const opacity = Math.floor(Math.random() * (settings.maxOpacity - settings.minOpacity) + settings.minOpacity);
      
      return {
        id: `cube-${i}`,
        size: size,
        left: pos.left,
        top: pos.top,
        delay: i * 2,
        duration: duration + (i % 3) * 3,
        opacity: opacity,
        baseOpacity: settings.baseOpacity,
        borderRadius: Math.random() * 8 + 4,
        borderOpacity: settings.borderOpacity,
        glowSize: settings.glowSize,
        glowOpacity: settings.glowOpacity
      };
    });
  }, [cubeCount, duration, settings]);

  return (
    <BackgroundContainer>
      {cubes.map(cube => (
        <Cube
          key={cube.id}
          $size={cube.size}
          $left={cube.left}
          $top={cube.top}
          $delay={cube.delay}
          $duration={cube.duration}
          $opacity={cube.opacity}
          $baseOpacity={cube.baseOpacity}
          $borderRadius={cube.borderRadius}
          $borderOpacity={cube.borderOpacity}
          $glowSize={cube.glowSize}
          $glowOpacity={cube.glowOpacity}
        />
      ))}
    </BackgroundContainer>
  );
};

export default AnimatedBackground;
