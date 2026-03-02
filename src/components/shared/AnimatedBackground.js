// ✅ FINÁLNA VERZIA - Particles (Jemné svietiace bodky)
// ⭐ Subtílne, profesionálne, ideálne pre výskum

import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

// =====================
// ANIMÁCIE - PARTICLES
// =====================

// Vytvorenie viacerých animácií pre rôzne smery
const particleFloat1 = keyframes`
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translate(30px, -80px);
    opacity: 0;
  }
`;

const particleFloat2 = keyframes`
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translate(-40px, -70px);
    opacity: 0;
  }
`;

const particleFloat3 = keyframes`
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translate(20px, -90px);
    opacity: 0;
  }
`;

const particleFloat4 = keyframes`
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translate(-30px, -85px);
    opacity: 0;
  }
`;

const twinkle = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
`;

// =====================
// KONŠTANTY
// =====================

const SPEEDS = {
  slow: 8,   // ⬅️ Pomalé particles
  normal: 6,
  fast: 4
};

const COMPLEXITY_SETTINGS = {
  low: {
    particleCount: 30,
    minSize: 2,
    maxSize: 4,
    baseOpacity: 0.5,
  },
  medium: {
    particleCount: 50,
    minSize: 2,
    maxSize: 5,
    baseOpacity: 0.6,
  },
  high: {
    particleCount: 80,
    minSize: 2,
    maxSize: 6,
    baseOpacity: 0.7,
  }
};

// ✅ Pomocná funkcia na generovanie pozícií
const generatePositions = (count) => {
  const positions = [];
  
  for (let i = 0; i < count; i++) {
    positions.push({
      left: Math.random() * 100,
      top: Math.random() * 100
    });
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

// ✅ Mapa animácií
const animations = [particleFloat1, particleFloat2, particleFloat3, particleFloat4];

const Particle = styled.div`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: ${props => props.$gradient};
  border-radius: 50%;
  animation: 
    ${props => animations[props.$animationIndex]} ${props => props.$duration}s ease-in-out infinite,
    ${twinkle} ${props => props.$duration * 0.6}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  left: ${props => props.$left}%;
  top: ${props => props.$top}%;
  box-shadow: 0 0 ${props => props.$size * 2}px ${props => props.$glowColor};
  will-change: transform, opacity;
  
  @media (max-width: 768px) {
    width: ${props => props.$size * 0.8}px;
    height: ${props => props.$size * 0.8}px;
  }
  
  @media (max-width: 480px) {
    width: ${props => props.$size * 0.6}px;
    height: ${props => props.$size * 0.6}px;
    box-shadow: none;
  }
`;

// =====================
// COMPONENT
// =====================

const AnimatedBackground = ({ 
  cubeCount = 50, // ⬅️ Počet particles
  animationSpeed = 'normal',
  complexity = 'medium'
}) => {
  const settings = COMPLEXITY_SETTINGS[complexity] || COMPLEXITY_SETTINGS.low;
  const duration = SPEEDS[animationSpeed] || SPEEDS.slow;
  const particleCount = cubeCount || settings.particleCount;

  const particles = useMemo(() => {
    const positions = generatePositions(particleCount);
    
    // ✅ Farebné varianty - fialová škála
    // ✅ JASNEJŠIE bordové particles - zvýšená opacity

    const colors = [
    {
        gradient: 'radial-gradient(circle, rgba(185, 28, 28, 1.0), rgba(153, 27, 27, 0.7))', // ⬅️ 0.9 → 1.0, 0.4 → 0.7
        glow: 'rgba(185, 28, 28, 0.9)' // ⬅️ 0.6 → 0.9
    },
    {
        gradient: 'radial-gradient(circle, rgba(220, 38, 38, 1.0), rgba(185, 28, 28, 0.7))',
        glow: 'rgba(220, 38, 38, 0.9)'
    },
    {
        gradient: 'radial-gradient(circle, rgba(239, 68, 68, 1.0), rgba(220, 38, 38, 0.7))',
        glow: 'rgba(239, 68, 68, 0.9)'
    },
    {
        gradient: 'radial-gradient(circle, rgba(159, 18, 57, 1.0), rgba(136, 19, 55, 0.7))',
        glow: 'rgba(159, 18, 57, 0.9)'
    },
    {
        gradient: 'radial-gradient(circle, rgba(190, 24, 93, 1.0), rgba(159, 18, 57, 0.7))',
        glow: 'rgba(190, 24, 93, 0.9)'
    },
    {
        gradient: 'radial-gradient(circle, rgba(127, 29, 29, 1.0), rgba(109, 40, 40, 0.7))',
        glow: 'rgba(127, 29, 29, 0.9)'
    },
    ];


    
    return positions.map((pos, i) => {
      const size = Math.random() * (settings.maxSize - settings.minSize) + settings.minSize;
      const colorVariant = colors[i % colors.length];
      
      return {
        id: `particle-${i}`,
        size: size,
        left: pos.left,
        top: pos.top,
        delay: Math.random() * duration, // ⬅️ Náhodný delay pre každú particle
        duration: duration + Math.random() * 3,
        animationIndex: i % 4, // ⬅️ Index animácie (0-3)
        gradient: colorVariant.gradient,
        glowColor: colorVariant.glow
      };
    });
  }, [particleCount, duration, settings]);

  return (
    <BackgroundContainer>
      {particles.map(particle => (
        <Particle
          key={particle.id}
          $size={particle.size}
          $left={particle.left}
          $top={particle.top}
          $delay={particle.delay}
          $duration={particle.duration}
          $animationIndex={particle.animationIndex}
          $gradient={particle.gradient}
          $glowColor={particle.glowColor}
        />
      ))}
    </BackgroundContainer>
  );
};

export default AnimatedBackground;
