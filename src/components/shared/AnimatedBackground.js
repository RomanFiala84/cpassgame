// src/components/shared/AnimatedBackground.js
// ✅ FINÁLNA VERZIA - S globálnou konštantou

import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

// =====================
// ANIMÁCIE
// =====================

const float = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
`;

// =====================
// KONŠTANTY
// =====================

const ANIMATION_TYPES = ['float', 'rotate', 'pulse', 'combined'];

const SPEEDS = {
  slow: 12,
  normal: 8,
  fast: 5
};

const COMPLEXITY_SETTINGS = {
  low: {
    minSize: 30,
    maxSize: 50,
    minOpacity: 10,
    maxOpacity: 20,
    baseOpacity: 0.5,
    glowSize: 15,
    glowOpacity: '15'
  },
  medium: {
    minSize: 20,
    maxSize: 60,
    minOpacity: 15,
    maxOpacity: 25,
    baseOpacity: 0.6,
    glowSize: 20,
    glowOpacity: '20'
  },
  high: {
    minSize: 15,
    maxSize: 70,
    minOpacity: 20,
    maxOpacity: 30,
    baseOpacity: 0.7,
    glowSize: 25,
    glowOpacity: '25'
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
  border: 1px solid ${props => props.theme.ACCENT_COLOR}30;
  border-radius: ${props => props.$borderRadius}px;
  animation: ${props => {
    if (props.$animationType === 'float') {
      return `${float} ${props.$duration}s ease-in-out infinite`;
    } else if (props.$animationType === 'rotate') {
      return `${rotate} ${props.$duration}s linear infinite`;
    } else if (props.$animationType === 'pulse') {
      return `${pulse} ${props.$duration}s ease-in-out infinite`;
    }
    return `${float} ${props.$duration}s ease-in-out infinite, ${rotate} ${props.$duration * 2}s linear infinite`;
  }};
  animation-delay: ${props => props.$delay}s;
  opacity: ${props => props.$baseOpacity};
  left: ${props => props.$left}%;
  top: ${props => props.$top}%;
  box-shadow: 0 0 ${props => props.$glowSize}px ${props => props.theme.ACCENT_COLOR}${props => props.$glowOpacity};
  will-change: transform, opacity;
  
  @media (max-width: 768px) {
    width: ${props => props.$size * 0.8}px;
    height: ${props => props.$size * 0.8}px;
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
  cubeCount = 15,
  animationSpeed = 'normal',
  complexity = 'medium'
}) => {
  const settings = COMPLEXITY_SETTINGS[complexity] || COMPLEXITY_SETTINGS.medium;
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
        duration: duration + Math.random() * 4,
        opacity: opacity.toString(16).padStart(2, '0'),
        baseOpacity: settings.baseOpacity,
        borderRadius: Math.random() * 8 + 2,
        animationType: ANIMATION_TYPES[Math.floor(Math.random() * ANIMATION_TYPES.length)],
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
          $animationType={cube.animationType}
          $glowSize={cube.glowSize}
          $glowOpacity={cube.glowOpacity}
        />
      ))}
    </BackgroundContainer>
  );
};

export default AnimatedBackground;
