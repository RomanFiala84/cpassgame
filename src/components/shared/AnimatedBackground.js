// src/components/shared/AnimatedBackground.js
// ✅ VÝRAZNÁ ANIMÁCIA - Bordové farby namiesto fialových

import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

// =====================
// ANIMÁCIE - VÝRAZNÉ ako Sibyl
// =====================

const floatDynamic = keyframes`
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-40px) translateX(30px) rotate(90deg) scale(1.1);
  }
  50% {
    transform: translateY(-20px) translateX(-20px) rotate(180deg) scale(0.9);
  }
  75% {
    transform: translateY(30px) translateX(20px) rotate(270deg) scale(1.05);
  }
  100% {
    transform: translateY(0) translateX(0) rotate(360deg) scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 20px rgba(139, 0, 0, 0.4);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 40px rgba(139, 0, 0, 0.6);
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
    minSize: 50,
    maxSize: 80,
    minOpacity: 60,        // ✅ Oveľa vyššia priehľadnosť
    maxOpacity: 90,
    baseOpacity: 0.85,
    glowSize: 30,
    glowOpacity: '60',
    borderOpacity: '80'
  },
  medium: {
    minSize: 45,
    maxSize: 90,
    minOpacity: 65,
    maxOpacity: 95,
    baseOpacity: 0.90,
    glowSize: 35,
    glowOpacity: '70',
    borderOpacity: '90'
  },
  high: {
    minSize: 40,
    maxSize: 100,
    minOpacity: 70,
    maxOpacity: 100,
    baseOpacity: 0.95,
    glowSize: 40,
    glowOpacity: '80',
    borderOpacity: '95'
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

// ✅ BORDOVÉ FARBY namiesto fialových
const Cube = styled.div`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: linear-gradient(
    135deg,
    rgba(139, 0, 0, ${props => props.$baseOpacity}),      /* ✅ Tmavá bordová */
    rgba(220, 38, 38, ${props => props.$baseOpacity})      /* ✅ Svetlá bordová */
  );
  border: 2px solid rgba(185, 28, 28, ${props => props.$borderOpacity / 100});  /* ✅ Bordový border */
  border-radius: ${props => props.$borderRadius}px;
  animation: 
    ${floatDynamic} ${props => props.$duration}s ease-in-out infinite,
    ${pulse} ${props => props.$duration * 0.6}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  opacity: ${props => props.$baseOpacity};
  left: ${props => props.$left}%;
  top: ${props => props.$top}%;
  box-shadow: 
    0 0 ${props => props.$glowSize}px rgba(139, 0, 0, ${props => props.$glowOpacity / 100}),
    inset 0 0 ${props => props.$glowSize / 2}px rgba(220, 38, 38, 0.3);
  will-change: transform, opacity;
  backdrop-filter: blur(2px);
  
  /* ✅ Reflexný efekt */
  &::after {
    content: '';
    position: absolute;
    top: 10%;
    left: 10%;
    width: 40%;
    height: 40%;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    filter: blur(8px);
  }
  
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
  cubeCount = 15,  // ✅ Viac kociek pre výraznejší efekt
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
        duration: duration + Math.random() * 8,
        opacity: opacity,
        baseOpacity: settings.baseOpacity,
        borderRadius: Math.random() * 12 + 6,
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
