// src/components/shared/AnimatedBackground.js
import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';

// 🌌 Sibyl System - Pulzovanie z hĺbky na statickej pozícii
const sibilDepthPulse = keyframes`
  0% {
    transform: translateZ(-1200px) scale(0.2);
    opacity: 0.3;
  }
  25% {
    transform: translateZ(-600px) scale(0.5);
    opacity: 0.6;
  }
  50% {
    transform: translateZ(0px) scale(1);
    opacity: 0.85;
  }
  75% {
    transform: translateZ(-600px) scale(0.5);
    opacity: 0.6;
  }
  100% {
    transform: translateZ(-1200px) scale(0.2);
    opacity: 0.3;
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
  
  /* ✅ Sibyl System perspektíva */
  perspective: 2000px;
  perspective-origin: 50% 50%;
  
  /* ✅ Optimalizácia */
  will-change: transform;
  transform: translateZ(0);
`;

// 🎲 Kocka so statickou XY pozíciou, pulzuje v Z-osi
const Cube = styled.div`
  position: absolute;
  width: ${props => props.$size || '60px'};
  height: ${props => props.$size || '60px'};
  
  /* ✅ FIXNÉ XY pozície - kocka sa nehýbe horizontálne */
  top: ${props => props.$top || '50%'};
  left: ${props => props.$left || '50%'};
  
  /* ✅ Centrovaná transformácia */
  transform-origin: center center;
  margin-left: ${props => -(parseInt(props.$size) / 2)}px;
  margin-top: ${props => -(parseInt(props.$size) / 2)}px;
  
  background: ${props => props.$gradient 
    ? `linear-gradient(135deg, ${props.$color}55, ${props.$color}20)`
    : `${props.$color}40`
  };
  
  border: 2px solid ${props => `${props.$color}35`};
  border-radius: ${props => props.$rounded ? '50%' : '12px'};
  
  /* ✅ Kocka NEMIZNE - min opacity 0.3 */
  opacity: 0.5;
  
  /* ✅ 3D transformácia */
  transform-style: preserve-3d;
  backface-visibility: hidden;
  
  /* ✅ Pulzovanie z hĺbky - NEKONEČNÝ LOOP */
  animation: ${sibilDepthPulse} 
             ${props => props.$duration || '12s'} 
             ease-in-out 
             infinite;
  
  animation-delay: ${props => props.$delay || '0s'};
  
  /* ✅ Jemné rozmazanie pre depth efekt */
  filter: blur(${props => props.$blur || '1px'});
  
  /* ✅ GPU akcelerácia */
  will-change: transform, opacity;
  
  /* ✅ Svetelný efekt (glow) */
  box-shadow: 
    0 0 15px ${props => `${props.$color}25`},
    0 0 30px ${props => `${props.$color}12`},
    inset 0 0 15px ${props => `${props.$color}18`};
  
  @media (max-width: 768px) {
    width: ${props => parseInt(props.$size) * 0.6}px;
    height: ${props => parseInt(props.$size) * 0.6}px;
    margin-left: ${props => -(parseInt(props.$size) * 0.6 / 2)}px;
    margin-top: ${props => -(parseInt(props.$size) * 0.6 / 2)}px;
  }
  
  @media (max-width: 480px) {
    width: ${props => parseInt(props.$size) * 0.4}px;
    height: ${props => parseInt(props.$size) * 0.4}px;
    margin-left: ${props => -(parseInt(props.$size) * 0.4 / 2)}px;
    margin-top: ${props => -(parseInt(props.$size) * 0.4 / 2)}px;
  }
`;

// 🎨 Hlavný komponent
const AnimatedBackground = ({ 
  variant = 'gradient',
  cubeCount = 12,
  speed = 'normal' // 'slow' | 'normal' | 'fast'
}) => {
  const theme = useTheme();
  const color = theme.ACCENT_COLOR;
  
  // ⚡ Rýchlosť animácie
  const speedConfig = {
    slow: { min: 15, max: 25 },
    normal: { min: 10, max: 18 },
    fast: { min: 6, max: 12 }
  };
  
  const { min, max } = speedConfig[speed] || speedConfig.normal;
  
  // 🎲 Generuj grid pattern kociek (ako Sibyl System)
  const cubes = [];
  const gridRows = 4;
  const gridCols = 4;
  
  // ✅ Vytvor pravidelný grid s náhodnými variáciami
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      // Preskakovanie pre menej hustý grid
      if (cubes.length >= cubeCount) break;
      if (Math.random() > 0.7) continue; // 30% šanca skipnúť
      
      // ✅ STATICKÉ pozície v grid patterni
      const top = 15 + (row * 25) + (Math.random() * 8 - 4); // 15%, 40%, 65%, 90% + jitter
      const left = 15 + (col * 25) + (Math.random() * 8 - 4); // 15%, 40%, 65%, 90% + jitter
      
      const size = 40 + Math.random() * 50; // 40-90px
      const duration = min + Math.random() * (max - min);
      const delay = Math.random() * 12; // 0-12s náhodný štart fázy
      const blur = 0.8 + Math.random() * 1.5; // 0.8-2.3px
      const rounded = Math.random() > 0.6; // 40% šanca na kruh
      
      cubes.push(
        <Cube
          key={`${row}-${col}-${cubes.length}`}
          $color={color}
          $gradient={variant === 'gradient'}
          $size={`${size}px`}
          $top={`${top}%`}
          $left={`${left}%`}
          $duration={`${duration}s`}
          $delay={`${delay}s`}
          $blur={`${blur}px`}
          $rounded={rounded}
        />
      );
    }
  }
  
  // ✅ Pridaj ešte pár náhodných kociek mimo grid
  const randomCount = Math.floor(cubeCount * 0.3);
  for (let i = 0; i < randomCount; i++) {
    const size = 30 + Math.random() * 60;
    const top = 5 + Math.random() * 90;
    const left = 5 + Math.random() * 90;
    const duration = min + Math.random() * (max - min);
    const delay = Math.random() * 15;
    const blur = 1 + Math.random() * 2;
    const rounded = Math.random() > 0.5;
    
    cubes.push(
      <Cube
        key={`random-${i}`}
        $color={color}
        $gradient={variant === 'gradient'}
        $size={`${size}px`}
        $top={`${top}%`}
        $left={`${left}%`}
        $duration={`${duration}s`}
        $delay={`${delay}s`}
        $blur={`${blur}px`}
        $rounded={rounded}
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
