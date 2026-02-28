// src/components/shared/AnimatedBackground.js
// ✅ FINÁLNA VERZIA - Subtílny efekt, bez chýb

import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

// =====================
// ANIMÁCIE - SUBTÍLNE
// =====================

const floatSubtle = keyframes`
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
`;

// =====================
// KONŠTANTY - MIMO komponentu
// =====================

const SPEEDS = {
  slow: 15,
  normal: 12,
  fast: 8
};

const COMPLEXITY_SETTINGS = {
  low: {
    minSize: 40,
    maxSize: 60,
    minOpacity: 3,
    maxOpacity: 5,
    baseOpacity: 0.25,
    glowSize: 10,
    glowOpacity: '08',
    borderOpacity: '15'
  },
  medium: {
    minSize: 35,
    maxSize: 70,
    minOpacity: 4,
    maxOpacity: 8,
    baseOpacity: 0.35,
    glowSize: 12,
    glowOpacity: '0a',
    borderOpacity: '18'
  },
  high: {
    minSize: 30,
    maxSize: 80,
    minOpacity: 6,
    maxOpacity: 12,
    baseOpacity: 0.45,
    glowSize: 15,
    glowOpacity: '0d',
    borderOpacity: '1c'
  }
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
    ${props => props.theme.ACCENT_COLOR}${props => props.$opacity},
    ${props => props.theme.ACCENT_COLOR_2}${props => props.$opacity}
  );
  border: 1px solid ${props => props.theme.ACCENT_COLOR}${props => props.$borderOpacity};
  border-radius: ${props => props.$borderRadius}px;
  animation: ${floatSubtle} ${props => props.$duration}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  opacity: ${props => props.$baseOpacity};
  left: ${props => props.$left}%;
  top: ${props => props.$top}%;
  box-shadow: 0 0 ${props => props.$glowSize}px ${props => props.theme.ACCENT_COLOR}${props => props.$glowOpacity};
  will-change: transform;
  
  @media (max-width: 768px) {
    width: ${props => props.$size * 0.75}px;
    height: ${props => props.$size * 0.75}px;
  }
  
  @media (max-width: 480px) {
    width: ${props => props.$size * 0.6}px;
    height: ${props => props.$size * 0.6}px;
  }
`;

// =====================
// COMPONENT
// =====================

const AnimatedBackground = ({ 
  cubeCount = 12,
  animationSpeed = 'normal',
  complexity = 'low'
}) => {
  const settings = COMPLEXITY_SETTINGS[complexity] || COMPLEXITY_SETTINGS.low;
  const duration = SPEEDS[animationSpeed] || SPEEDS.normal;

  const cubes = useMemo(() => {
    return Array.from({ length: cubeCount }, (_, i) => {
      const size = Math.random() * (settings.maxSize - settings.minSize) + settings.minSize;
      const opacity = Math.floor(Math.random() * (settings.maxOpacity - settings.minOpacity) + settings.minOpacity);
      
      return {
        id: `cube-${i}`,
        size: size,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * duration,
        duration: duration + Math.random() * 6,
        opacity: opacity.toString(16).padStart(2, '0'),
        baseOpacity: settings.baseOpacity,
        borderRadius: Math.random() * 6 + 3,
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
