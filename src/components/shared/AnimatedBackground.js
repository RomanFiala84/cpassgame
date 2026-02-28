//HOTOVO
// ✅ FINÁLNA VERZIA - Bez ESLint chýb

import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

// =====================
// ANIMÁCIE - ZJEDNODUŠENÉ
// =====================

// =====================
// ANIMÁCIE - WATER DROP WAVE
// =====================

const waterDrop = keyframes`
  0% {
    transform: translateY(-100%) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(100vh) scale(1.5);
    opacity: 0;
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.4;
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

const WaterDrop = styled.div`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size * 1.2}px; /* ✅ Vyšší = kvapka */
  background: radial-gradient(
    ellipse at center,
    rgba(37, 99, 235, ${props => props.$baseOpacity * 1.2}), /* ✅ Modrá kvapka */
    rgba(59, 130, 246, ${props => props.$baseOpacity * 0.8}),
    transparent
  );
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; /* ✅ Tvar kvapky */
  animation: 
    ${waterDrop} ${props => props.$duration}s linear infinite,
    ${ripple} ${props => props.$duration * 0.4}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  left: ${props => props.$left}%;
  top: ${props => props.$top}%;
  filter: blur(${props => props.$size * 0.05}px); /* ✅ Jemný blur pre vodu */
  box-shadow: 
    0 0 ${props => props.$glowSize}px rgba(59, 130, 246, ${props => props.$glowOpacity / 100}),
    inset 0 0 ${props => props.$glowSize * 0.5}px rgba(255, 255, 255, 0.3); /* ✅ Svetelný odraz */
  will-change: transform, opacity;
  
  /* Pseudo-element pre vlny */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150%;
    height: 150%;
    border: 2px solid rgba(59, 130, 246, ${props => props.$baseOpacity * 0.3});
    border-radius: 50%;
    animation: ${ripple} ${props => props.$duration * 0.6}s ease-out infinite;
  }
  
  @media (max-width: 768px) {
    width: ${props => props.$size * 0.7}px;
    height: ${props => props.$size * 0.84}px;
    animation: ${waterDrop} ${props => props.$duration * 1.2}s linear infinite;
  }
  
  @media (max-width: 480px) {
    width: ${props => props.$size * 0.5}px;
    height: ${props => props.$size * 0.6}px;
    filter: blur(${props => props.$size * 0.03}px);
    
    &::before {
      display: none; /* Bez vĺn na mobile */
    }
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
        <WaterDrop  /* ✅ ZMENENÉ z Cube */
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
