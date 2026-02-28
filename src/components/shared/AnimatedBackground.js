// src/components/shared/AnimatedBackground.js
import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';

// 🌌 Animácia z hĺbky dopredu (z-axis)
const comeFromDepth = keyframes`
  0% {
    transform: translateZ(-1000px) scale(0.1);
    opacity: 0;
  }
  20% {
    opacity: 0.4;
  }
  50% {
    transform: translateZ(-200px) scale(0.6);
    opacity: 0.7;
  }
  80% {
    opacity: 0.5;
  }
  100% {
    transform: translateZ(0) scale(1);
    opacity: 0;
  }
`;

// 📦 Kontajner s 3D perspektívou
const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  
  /* ✅ 3D perspektíva pre depth efekt */
  perspective: 1200px;
  perspective-origin: 50% 50%;
  
  /* ✅ Optimalizácia pre plynulosť */
  will-change: transform;
`;

// 🎲 Kocka s 3D transformáciou
const Cube = styled.div`
  position: absolute;
  width: ${props => props.$size || '60px'};
  height: ${props => props.$size || '60px'};
  
  /* ✅ Náhodná pozícia */
  top: ${props => props.$top || '50%'};
  left: ${props => props.$left || '50%'};
  
  background: ${props => props.$gradient 
    ? `linear-gradient(135deg, ${props.$color}50, ${props.$color}20)`
    : `${props.$color}40`
  };
  
  border: 2px solid ${props => `${props.$color}30`};
  border-radius: 8px;
  
  opacity: 0;
  
  /* ✅ 3D transformácia */
  transform-style: preserve-3d;
  backface-visibility: hidden;
  
  /* ✅ SPOMALENÁ animácia (8-15s namiesto 5-9s) */
  animation: ${comeFromDepth} 
             ${props => props.$duration || '10s'} 
             ease-out 
             infinite;
  
  animation-delay: ${props => props.$delay || '0s'};
  
  /* ✅ Jemné rozmazanie */
  filter: blur(${props => props.$blur || '1px'});
  
  /* ✅ GPU akcelerácia */
  will-change: transform, opacity;
  
  @media (max-width: 768px) {
    width: ${props => parseInt(props.$size) * 0.7}px;
    height: ${props => parseInt(props.$size) * 0.7}px;
  }
  
  @media (max-width: 480px) {
    width: ${props => parseInt(props.$size) * 0.5}px;
    height: ${props => parseInt(props.$size) * 0.5}px;
  }
`;

// 🎨 Hlavný komponent
const AnimatedBackground = ({ 
  variant = 'gradient', 
  cubeCount = 8 
}) => {
  const theme = useTheme();
  const color = theme.ACCENT_COLOR;
  
  // 🎲 Generuj kocky s rôznymi hĺbkami
  const cubes = [];
  
  for (let i = 0; i < cubeCount; i++) {
    const size = 40 + Math.random() * 60; // 40-100px
    const top = Math.random() * 100; // 0-100%
    const left = Math.random() * 100; // 0-100%
    
    // ✅ SPOMALENÉ - 8-15s namiesto 5-9s
    const duration = 8 + Math.random() * 7; // 8-15s
    
    // ✅ Náhodný delay pre organický efekt
    const delay = Math.random() * 10; // 0-10s
    
    const blur = variant === 'gradient' ? 1 + Math.random() : 0.5;
    
    cubes.push(
      <Cube
        key={i}
        $color={color}
        $gradient={variant === 'gradient'}
        $size={`${size}px`}
        $top={`${top}%`}
        $left={`${left}%`}
        $duration={`${duration}s`}
        $delay={`${delay}s`}
        $blur={`${blur}px`}
      />
    );
  }
  
  return (
    <BackgroundContainer>
      {cubes}
    </BackgroundContainer>
  );
};

export default AnimatedBackground;
