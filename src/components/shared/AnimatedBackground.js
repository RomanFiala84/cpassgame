// src/components/shared/AnimatedBackground.js
import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';

// 📦 Animácia vystupujúcich kociek (3D efekt)
const rise = keyframes`
  0% {
    transform: translateZ(0) scale(1);
    opacity: 0;
  }
  20% {
    opacity: 0.6;
  }
  50% {
    transform: translateZ(100px) scale(1.2);
    opacity: 0.8;
  }
  80% {
    opacity: 0.4;
  }
  100% {
    transform: translateZ(200px) scale(0.8);
    opacity: 0;
  }
`;

// 🎲 Pulzovanie pre statické kocky
const pulse = keyframes`
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
`;

// 📦 Kontajner s perspektívou pre 3D efekt
const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  perspective: 1000px;
  perspective-origin: center center;
`;

// 🎨 Grid kontajner pre šachovnicu
const GridContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0;
  transform-style: preserve-3d;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    grid-template-rows: repeat(auto-fit, minmax(60px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
    grid-template-rows: repeat(auto-fit, minmax(40px, 1fr));
  }
`;

// 🎲 Jednotlivá kocka
const Cube = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.$gradient 
    ? `linear-gradient(135deg, ${props.$color}60, ${props.$color}20)`
    : `${props.$color}40`
  };
  border: 1px solid ${props => props.$color}30;
  opacity: ${props => props.$static ? 0.2 : 0};
  
  animation: ${props => props.$animate ? rise : pulse} 
             ${props => props.$duration || '4s'} 
             ease-in-out 
             infinite;
  
  animation-delay: ${props => props.$delay || '0s'};
  
  transform-style: preserve-3d;
  backface-visibility: hidden;
  
  filter: blur(${props => props.$blur || '1px'});
  
  transition: all 0.3s ease;
`;

// 🎨 Hlavný komponent
const AnimatedBackground = ({ variant = 'gradient', intensity = 'medium' }) => {
  const theme = useTheme();
  
  // 🎨 Farby podľa témy
  const color = theme.ACCENT_COLOR;
  
  // ✅ OPRAVA: Definuj config PRED použitím
  const intensityConfig = {
    light: { animate: 10, static: 30, duration: '5s' },
    medium: { animate: 15, static: 20, duration: '4s' },
    heavy: { animate: 25, static: 15, duration: '3s' }
  };
  
  // 🎯 Vyber config podľa intenzity
  const config = intensityConfig[intensity] || intensityConfig.medium;
  
  // 🎲 Generuj šachovnicový pattern
  const cubes = [];
  const rows = 12; // Počet riadkov
  const cols = 16; // Počet stĺpcov
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Šachovnicový vzor (len párne pozície)
      const isCheckerboard = (row + col) % 2 === 0;
      
      if (!isCheckerboard) continue;
      
      // Náhodne vyber ktoré kocky sa budú animovať
      const shouldAnimate = Math.random() < (config.animate / 100);
      const delay = Math.random() * 6; // Náhodný delay 0-6s
      
      cubes.push(
        <Cube
          key={`${row}-${col}`}
          $color={color}
          $gradient={variant === 'gradient'}
          $animate={shouldAnimate}
          $static={!shouldAnimate}
          $duration={`${3 + Math.random() * 2}s`} // 3-5s
          $delay={`${delay}s`}
          $blur={variant === 'gradient' ? '2px' : '1px'}
        />
      );
    }
  }
  
  return (
    <BackgroundContainer>
      <GridContainer>
        {cubes}
      </GridContainer>
    </BackgroundContainer>
  );
};

export default AnimatedBackground;
