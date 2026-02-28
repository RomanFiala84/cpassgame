// src/components/shared/AnimatedBackground.js
import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';

// 🌊 Animácia plávajúcich bublín
const float = keyframes`
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  50% {
    transform: translateY(-50vh) translateX(20px) scale(1.1);
    opacity: 0.4;
  }
  90% {
    opacity: 0.2;
  }
  100% {
    transform: translateY(-100vh) translateX(-20px) scale(0.8);
    opacity: 0;
  }
`;

// 🎈 Animácia pulzovania
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.5;
  }
`;

// 📦 Kontajner pre pozadie
const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

// 🫧 Základná bublinka
const Bubble = styled.div`
  position: absolute;
  border-radius: 50%;
  background: ${props => props.$gradient 
    ? `radial-gradient(circle at 30% 30%, ${props.$color}40, ${props.$color}15)`
    : props.$color
  };
  border: ${props => props.$outlined ? `2px solid ${props.$color}` : 'none'};
  width: ${props => props.$size || '60px'};
  height: ${props => props.$size || '60px'};
  opacity: ${props => props.$opacity || 0.25};
  bottom: ${props => props.$bottom || '-100px'};
  left: ${props => props.$left || '50%'};
  
  animation: ${props => props.$animation === 'float' ? float : pulse} 
             ${props => props.$duration || '20s'} 
             ease-in-out 
             infinite;
  
  animation-delay: ${props => props.$delay || '0s'};
  
  /* Rozmazanie pre soft efekt */
  filter: blur(${props => props.$blur || '0px'});
  
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
const AnimatedBackground = ({ variant = 'soft' }) => {
  const theme = useTheme();
  
  // 🎨 Farby podľa témy
  const colors = {
    primary: theme.ACCENT_COLOR,      // Modrá v light, červená v dark
    secondary: theme.ACCENT_COLOR_2,  // Svetlá modrá / svetlá červená
    tertiary: theme.ACCENT_COLOR_3    // Tmavá modrá / tmavá červená
  };
  
  return (
    <BackgroundContainer>
      {/* Prvý klaster */}
      <Bubble
        $color={colors.primary}
        $size="80px"
        $bottom="-100px"
        $left="10%"
        $duration="25s"
        $delay="0s"
        $animation="float"
        $gradient={variant === 'soft'}
        $outlined={variant === 'outlined'}
        $blur={variant === 'soft' ? '2px' : '0px'}
      />
      
      <Bubble
        $color={colors.secondary}
        $size="50px"
        $bottom="-120px"
        $left="15%"
        $duration="22s"
        $delay="3s"
        $animation="float"
        $gradient={variant === 'soft'}
        $outlined={variant === 'outlined'}
        $blur={variant === 'soft' ? '1px' : '0px'}
      />
      
      {/* Druhý klaster */}
      <Bubble
        $color={colors.tertiary}
        $size="70px"
        $bottom="-90px"
        $left="45%"
        $duration="28s"
        $delay="5s"
        $animation="float"
        $gradient={variant === 'soft'}
        $outlined={variant === 'outlined'}
        $blur={variant === 'soft' ? '2px' : '0px'}
      />
      
      <Bubble
        $color={colors.secondary}
        $size="60px"
        $bottom="-110px"
        $left="50%"
        $duration="24s"
        $delay="8s"
        $animation="float"
        $gradient={variant === 'soft'}
        $outlined={variant === 'outlined'}
        $blur={variant === 'soft' ? '1px' : '0px'}
      />
      
      {/* Tretí klaster */}
      <Bubble
        $color={colors.primary}
        $size="90px"
        $bottom="-120px"
        $left="80%"
        $duration="30s"
        $delay="2s"
        $animation="float"
        $gradient={variant === 'soft'}
        $outlined={variant === 'outlined'}
        $blur={variant === 'soft' ? '3px' : '0px'}
      />
      
      <Bubble
        $color={colors.tertiary}
        $size="55px"
        $bottom="-100px"
        $left="85%"
        $duration="26s"
        $delay="6s"
        $animation="float"
        $gradient={variant === 'soft'}
        $outlined={variant === 'outlined'}
        $blur={variant === 'soft' ? '1px' : '0px'}
      />
      
      {/* Extra bublinky */}
      <Bubble
        $color={colors.secondary}
        $size="40px"
        $bottom="-80px"
        $left="25%"
        $duration="20s"
        $delay="10s"
        $animation="float"
        $gradient={variant === 'soft'}
        $outlined={variant === 'outlined'}
        $blur={variant === 'soft' ? '1px' : '0px'}
      />
      
      <Bubble
        $color={colors.tertiary}
        $size="65px"
        $bottom="-95px"
        $left="65%"
        $duration="27s"
        $delay="4s"
        $animation="float"
        $gradient={variant === 'soft'}
        $outlined={variant === 'outlined'}
        $blur={variant === 'soft' ? '2px' : '0px'}
      />
    </BackgroundContainer>
  );
};

export default AnimatedBackground;