//HOTOVO
// ✅ FINÁLNA VERZIA - S AnimatedBackground a správnymi props

import React from 'react';
import styled from 'styled-components';
import LevelDisplay from '../components/shared/LevelDisplay';
import AnimatedBackground from '../components/shared/AnimatedBackground';

// =====================
// STYLED COMPONENTS
// =====================

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: ${p => p.theme.BACKGROUND_COLOR};
  transition: background 240ms ease;
  position: relative;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
  position: relative;
  z-index: 1;
  
  padding-top: ${p => p.$showLevel ? '70px' : '20px'};  // ✅ Zmenené z 140px
  
  @media (max-width: 1400px) {
    max-width: 1200px;
  }
  
  @media (max-width: 1024px) {
    max-width: 960px;
    padding-top: ${p => p.$showLevel ? '70px' : '20px'};  // ✅ Zmenené z 130px
  }
  
  @media (max-width: 768px) {
    padding: 15px;
    padding-top: ${p => p.$showLevel ? '80px' : '15px'};  // ✅ Zmenené z 180px
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    padding-top: ${p => p.$showLevel ? '90px' : '10px'};  // ✅ Zmenené zo 280px
  }
`;

// =====================
// COMPONENT
// =====================

const Layout = ({ 
  children, 
  showLevelDisplay = true,
  showAnimatedBackground = false,
  cubeCount = 6,
  animationSpeed = 'slow', // 'slow' | 'normal' | 'fast'
  complexity = 'low' // 'low' | 'medium' | 'high'
}) => {
  return (
    <LayoutContainer>
      {/* 🎲 Animované pozadie - IBA KOCKY */}
      {showAnimatedBackground && (
        <AnimatedBackground 
          cubeCount={cubeCount}
          animationSpeed={animationSpeed}
          complexity={complexity}
        />
      )}
      
      {/* 📊 Level Display */}
      {showLevelDisplay && <LevelDisplay />}
      
      {/* 📄 Hlavný obsah */}
      <ContentWrapper $showLevel={showLevelDisplay}>
        {children}
      </ContentWrapper>
    </LayoutContainer>
  );
};

export default Layout;
