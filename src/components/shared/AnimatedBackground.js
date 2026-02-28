// src/components/shared/AnimatedBackground.js
import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';

// 📦 Animácia vystupujúcich kociek
const rise = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  20% {
    opacity: 0.4;
  }
  50% {
    transform: translateY(-40vh) scale(1.15);
    opacity: 0.6;
  }
  80% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-80vh) scale(0.9);
    opacity: 0;
  }
`;

// 📦 Kontajner - FIXED position
const BackgroundContainer = styled.div`
  position: fixed; /* ✅ FIXED = nebude scrollovať */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none; /* ✅ Nebráni klikaniu */
  z-index: 0; /* ✅ POD všetkým obsahom */
  will-change: transform; /* ✅ Optimalizácia pre scroll */
`;

// 🎲 Jednotlivá kocka
const Cube = styled.div`
  position: absolute;
  width: ${props => props.$size || '60px'};
  height: ${props => props.$size || '60px'};
  bottom: ${props => props.$bottom || '-80px'};
  left: ${props => props.$left || '50%'};
  
  background: ${props => props.$gradient 
    ? `linear-gradient(135deg, ${props.$color}50, ${props.$color}20)`
    : `${props.$color}40`
  };
  
  border: 2px solid ${props => `${props.$color}30`};
  border-radius: 8px; /* ✅ Zaoblené rohy */
  
  opacity: 0;
  
  animation: ${rise} 
             ${props => props.$duration || '6s'} 
             ease-in-out 
             infinite;
  
  animation-delay: ${props => props.$delay || '0s'};
  
  /* ✅ Jemné rozmazanie */
  filter: blur(${props => props.$blur || '1px'});
  
  /* ✅ Optimalizácia výkonu */
  will-change: transform, opacity;
  transform: translateZ(0); /* GPU acceleration */
  backface-visibility: hidden;
  
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
  cubeCount = 8 // ✅ Kontrolovateľný počet kociek
}) => {
  const theme = useTheme();
  const color = theme.ACCENT_COLOR;
  
  // 🎲 Generuj náhodné kocky
  const cubes = [];
  
  for (let i = 0; i < cubeCount; i++) {
    const size = 40 + Math.random() * 60; // 40-100px
    const left = Math.random() * 100; // 0-100%
    const duration = 5 + Math.random() * 4; // 5-9s
    const delay = Math.random() * 8; // 0-8s
    const blur = variant === 'gradient' ? 1 + Math.random() : 0.5;
    
    cubes.push(
      <Cube
        key={i}
        $color={color}
        $gradient={variant === 'gradient'}
        $size={`${size}px`}
        $left={`${left}%`}
        $bottom="-100px"
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
