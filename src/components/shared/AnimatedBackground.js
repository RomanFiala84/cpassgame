// src/components/shared/AnimatedBackground.js
import React, { useEffect, useRef } from 'react';
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
  
  /* ✅ MOBIL - zredukuj efekty */
  @media (max-width: 768px) {
    perspective: 1000px;
    
    /* ✅ Vypni animácie na mobiloch s nízkym výkonom */
    @media (prefers-reduced-motion: reduce) {
      display: none;
    }
  }
`;

// 🎲 Kocka so statickou XY pozíciou, pulzuje v Z-osi
const Cube = styled.div`
  position: absolute;
  width: ${props => props.$size || '60px'};
  height: ${props => props.$size || '60px'};
  
  /* ✅ FIXNÉ XY pozície */
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
  
  /* ✅ TABLET - zmenšené kocky */
  @media (max-width: 1024px) {
    width: ${props => parseInt(props.$size) * 0.7}px;
    height: ${props => parseInt(props.$size) * 0.7}px;
    margin-left: ${props => -(parseInt(props.$size) * 0.7 / 2)}px;
    margin-top: ${props => -(parseInt(props.$size) * 0.7 / 2)}px;
    filter: blur(${props => parseFloat(props.$blur) * 0.8}px);
  }
  
  /* ✅ MOBIL - ešte menšie kocky + jednoduchšie efekty */
  @media (max-width: 768px) {
    width: ${props => parseInt(props.$size) * 0.5}px;
    height: ${props => parseInt(props.$size) * 0.5}px;
    margin-left: ${props => -(parseInt(props.$size) * 0.5 / 2)}px;
    margin-top: ${props => -(parseInt(props.$size) * 0.5 / 2)}px;
    
    /* ✅ Zjednodušené efekty pre výkon */
    filter: blur(${props => parseFloat(props.$blur) * 0.5}px);
    box-shadow: 
      0 0 10px ${props => `${props.$color}20`},
      inset 0 0 10px ${props => `${props.$color}15`};
    
    /* ✅ Pomalšia animácia = menej CPU */
    animation-duration: ${props => parseFloat(props.$duration) * 1.5}s;
  }
  
  /* ✅ Malé mobily - minimálne efekty */
  @media (max-width: 480px) {
    width: ${props => parseInt(props.$size) * 0.4}px;
    height: ${props => parseInt(props.$size) * 0.4}px;
    margin-left: ${props => -(parseInt(props.$size) * 0.4 / 2)}px;
    margin-top: ${props => -(parseInt(props.$size) * 0.4 / 2)}px;
    
    filter: blur(${props => parseFloat(props.$blur) * 0.3}px);
    box-shadow: 0 0 5px ${props => `${props.$color}15`};
    border-width: 1px;
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
  const containerRef = useRef(null);
  
  // ⚡ Rýchlosť animácie
  const speedConfig = {
    slow: { min: 15, max: 25 },
    normal: { min: 10, max: 18 },
    fast: { min: 6, max: 12 }
  };
  
  const { min, max } = speedConfig[speed] || speedConfig.normal;
  
  // ✅ DETEKCIA MOBILU/TABLETU
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth <= 1024 && window.innerWidth > 768;
  
  // ✅ Redukovaný počet kociek na mobiloch
  const effectiveCubeCount = isMobile 
    ? Math.floor(cubeCount * 0.5) // 50% na mobile
    : isTablet 
      ? Math.floor(cubeCount * 0.7) // 70% na tablete
      : cubeCount; // 100% na desktope
  
  // 🎲 Generuj grid pattern kociek
  const cubes = [];
  const gridRows = isMobile ? 3 : 4;
  const gridCols = isMobile ? 3 : 4;
  
  // ✅ Vytvor pravidelný grid s náhodnými variáciami
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      if (cubes.length >= effectiveCubeCount) break;
      if (Math.random() > 0.7) continue;
      
      const top = 15 + (row * 25) + (Math.random() * 8 - 4);
      const left = 15 + (col * 25) + (Math.random() * 8 - 4);
      
      // ✅ Menšie kocky na mobile
      const baseSize = isMobile ? 30 : 40;
      const sizeRange = isMobile ? 30 : 50;
      const size = baseSize + Math.random() * sizeRange;
      
      const duration = min + Math.random() * (max - min);
      const delay = Math.random() * 12;
      const blur = isMobile ? 0.5 : (0.8 + Math.random() * 1.5);
      const rounded = Math.random() > 0.6;
      
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
  
  // ✅ Pridaj pár náhodných kociek mimo grid (menej na mobile)
  const randomCount = Math.floor(effectiveCubeCount * (isMobile ? 0.2 : 0.3));
  for (let i = 0; i < randomCount; i++) {
    const baseSize = isMobile ? 25 : 30;
    const sizeRange = isMobile ? 40 : 60;
    const size = baseSize + Math.random() * sizeRange;
    
    const top = 5 + Math.random() * 90;
    const left = 5 + Math.random() * 90;
    const duration = min + Math.random() * (max - min);
    const delay = Math.random() * 15;
    const blur = isMobile ? 0.6 : (1 + Math.random() * 2);
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
  
  // ✅ FIX PRE RESET ANIMÁCIE PRI KLIKNUTÍ
  useEffect(() => {
    const handleInteraction = () => {
      if (!containerRef.current) return;
      
      // ✅ Trigger reflow pre reset animácie
      const container = containerRef.current;
      
      // Metóda 1: Dočasne vypni animácie
      const cubes = container.querySelectorAll('div');
      cubes.forEach(cube => {
        cube.style.animationPlayState = 'paused';
      });
      
      // Po krátkom čase ich znova zapni
      requestAnimationFrame(() => {
        cubes.forEach(cube => {
          cube.style.animationPlayState = 'running';
        });
      });
    };
    
    // ✅ Počúvaj na click, scroll, touch
    document.addEventListener('click', handleInteraction);
    document.addEventListener('scroll', handleInteraction, { passive: true });
    document.addEventListener('touchstart', handleInteraction, { passive: true });
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);
  
  // ✅ MOBIL - Pausni animácie pri scrolle pre výkon
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;
    
    let scrollTimeout;
    let isScrolling = false;
    
    const handleMobileScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      
      // ✅ Začni scroll - pausni animácie
      if (!isScrolling) {
        isScrolling = true;
        const cubes = container.querySelectorAll('div');
        cubes.forEach(cube => {
          cube.style.animationPlayState = 'paused';
        });
      }
      
      // ✅ Clear predchádzajúci timeout
      clearTimeout(scrollTimeout);
      
      // ✅ Obnov animácie po 150ms po skončení scrollu
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        const cubes = container.querySelectorAll('div');
        cubes.forEach(cube => {
          cube.style.animationPlayState = 'running';
        });
      }, 150);
    };
    
    window.addEventListener('scroll', handleMobileScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleMobileScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isMobile]);
  
  return (
    <BackgroundContainer ref={containerRef}>
      {cubes}
    </BackgroundContainer>
  );
};

export default AnimatedBackground;
