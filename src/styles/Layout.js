// src/styles/Layout.js
// FINÁLNA VERZIA - Širší layout pre Full HD + AnimatedBackground

import React from 'react';
import styled from 'styled-components';
import LevelDisplay from '../components/shared/LevelDisplay';
import AnimatedBackground from '../components/shared/AnimatedBackground';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: ${p => p.theme.BACKGROUND_COLOR};
  transition: background 240ms ease;
  position: relative; /* ✅ Pre correct z-index stacking */
  overflow-x: hidden; /* ✅ Zabráni horizontal scrollu od bublín */
`;

const ContentWrapper = styled.div`
  /* ✅ ZVÄČŠENÉ - Pre Full HD (1920×1080) */
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
  position: relative; /* ✅ Vytvorí stacking context */
  z-index: 1; /* ✅ Obsah NAD bublinkami */
  
  padding-top: ${p => p.$showLevel ? '140px' : '20px'};
  
  /* Desktop - stredné rozlíšenie */
  @media (max-width: 1400px) {
    max-width: 1200px;
  }
  
  /* Laptop */
  @media (max-width: 1024px) {
    max-width: 960px;
    padding-top: ${p => p.$showLevel ? '130px' : '20px'};
  }
  
  /* Tablet */
  @media (max-width: 768px) {
    padding: 15px;
    padding-top: ${p => p.$showLevel ? '180px' : '15px'};
  }
  
  /* Mobile */
  @media (max-width: 480px) {
    padding: 10px;
    padding-top: ${p => p.$showLevel ? '280px' : '10px'};
  }
`;

const Layout = ({ children, showLevelDisplay = true }) => {
  return (
    <LayoutContainer>
      {/* 🫧 Animované pozadie - POD všetkým */}
      <AnimatedBackground variant="medium" />
      
      {/* 📊 Level Display - NAD pozadím, POD obsahom */}
      {showLevelDisplay && <LevelDisplay />}
      
      {/* 📄 Hlavný obsah - NAD všetkým */}
      <ContentWrapper $showLevel={showLevelDisplay}>
        {children}
      </ContentWrapper>
    </LayoutContainer>
  );
};

export default Layout;
