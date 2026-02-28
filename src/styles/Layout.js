// src/styles/Layout.js
import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';
import LevelDisplay from '../components/shared/LevelDisplay';

// ✅ Lazy load animácie - načíta sa až po stránke
const AnimatedBackground = lazy(() => 
  import('../components/shared/AnimatedBackground')
);

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
  
  padding-top: ${p => p.$showLevel ? '140px' : '20px'};
  
  @media (max-width: 1400px) {
    max-width: 1200px;
  }
  
  @media (max-width: 1024px) {
    max-width: 960px;
    padding-top: ${p => p.$showLevel ? '130px' : '20px'};
  }
  
  @media (max-width: 768px) {
    padding: 15px;
    padding-top: ${p => p.$showLevel ? '180px' : '15px'};
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    padding-top: ${p => p.$showLevel ? '280px' : '10px'};
  }
`;

const Layout = ({ 
  children, 
  showLevelDisplay = true,
  showAnimatedBackground = false,
  cubeCount = 8
}) => {
  return (
    <LayoutContainer>
      {/* 🎲 Lazy loaded animácia */}
      {showAnimatedBackground && (
        <Suspense fallback={null}>
          <AnimatedBackground 
            variant="gradient" 
            cubeCount={cubeCount}
          />
        </Suspense>
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
