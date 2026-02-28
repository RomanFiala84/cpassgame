// src/components/shared/AnimatedBackground.js
import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';

// 🌌 Animácia z hĺbky - hore a dole (loop)
const sibilSystemFloat = keyframes`
  0% {
    transform: translateZ(-800px) translateY(100vh) scale(0.3);
    opacity: 0;
  }
  15% {
    opacity: 0.6;
  }
  35% {
    transform: translateZ(-200px) translateY(20vh) scale(0.7);
    opacity: 0.8;
  }
  50% {
    transform: translateZ(0) translateY(-10vh) scale(1);
    opacity: 0.9;
  }
  65% {
    transform: translateZ(-200px) translateY(-40vh) scale(0.7);
    opacity: 0.8;
  }
  85% {
    opacity: 0.4;
  }
  100% {
    transform: translateZ(-800px) translateY(-100vh) scale(0.3);
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
  
  /* ✅ Sibyl System perspektíva */
  perspective: 1500px;
  perspective-origin: 50% 50%;
  
  /* ✅ Optimalizácia pre plynulosť */
  will-change: transform;
  transform: translateZ(0);
`;

// 🎲 Kocka s 3D transformáciou
const Cube = styled.div`
  position: absolute;
  width: ${props => props.$size || '60px'};
  height: ${props => props.$size || '60px'};
  
  /* ✅ Náhodná X pozícia */
  left: ${props => props.$left || '50%'};
  
  /* ✅ Štart pozícia (zdola) */
  bottom: 0;
  
  background: ${props => props.$gradient 
    ? `linear-gradient(135deg, ${props.$color}60, ${props.$color}25)`
    : `${props.$color}45`
  };
  
  border: 2px solid ${props => `${props.$color}40`};
  border-radius: ${props => props.$rounded ? '50%' : '10px'};
  
  opacity: 0;
  
  /* ✅ 3D transformácia */
  transform-style: preserve-3d;
  backface-visibility: hidden;
  
  /* ✅ Animácia hore-dole z hĺbky */
  animation: ${sibilSystemFloat} 
             ${props => props.$duration || '12s'} 
             ease-in-out 
             infinite;
  
  animation-delay: ${props => props.$delay || '0s'};
  
  /* ✅ Jemné rozmazanie pre depth efekt */
  filter: blur(${props => props.$blur || '1.5px'});
  
  /* ✅ GPU akcelerácia */
  will-change: transform, opacity;
  
  /* ✅ Svetelný efekt (glow) */
  box-shadow: 
    0 0 10px ${props => `${props.$color}30`},
    0 0 20px ${props => `${props.$color}15`},
    inset 0 0 10px ${props => `${props.$color}20`};
  
  @media (max-width: 768px) {
    width: ${props => parseInt(props.$size) * 0.6}px;
    height: ${props => parseInt(props.$size) * 0.6}px;
  }
  
  @media (max-width: 480px) {
    width: ${props => parseInt(props.$size) * 0.4}px;
    height: ${props => parseInt(props.$size) * 0.4}px;
  }
`;

// 🎨 Hlavný komponent
const AnimatedBackground = ({ 
  variant = 'gradient',
  cubeCount = 10,
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
  
  // 🎲 Generuj kocky s rôznymi parametrami
  const cubes = [];
  
  for (let i = 0; i < cubeCount; i++) {
    const size = 30 + Math.random() * 70; // 30-100px
    const left = 5 + Math.random() * 90; // 5-95% (nie až na kraj)
    const duration = min + Math.random() * (max - min); // Podľa speed
    const delay = Math.random() * 15; // 0-15s náhodný štart
    const blur = 1 + Math.random() * 2; // 1-3px
    const rounded = Math.random() > 0.7; // 30% šanca na kruh
    
    cubes.push(
      <Cube
        key={i}
        $color={color}
        $gradient={variant === 'gradient'}
        $size={`${size}px`}
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
