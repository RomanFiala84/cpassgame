// src/styles/Layout.js
// UPRAVENÉ - Pridaný LevelDisplay

import React from 'react';
import styled from 'styled-components';
import LevelDisplay from '../components/shared/LevelDisplay'; // ✅ PRIDANÉ

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: ${p => p.theme.BACKGROUND_COLOR};
  padding: 20px;
  transition: background 240ms ease;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  /* ✅ NOVÉ - Padding pre LevelDisplay v ľavom hornom rohu */
  padding-top: 80px;
  
  @media (max-width: 768px) {
    padding-top: 70px;
  }
  
  @media (max-width: 480px) {
    padding-top: 60px;
  }
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      {/* ✅ PRIDANÉ - LevelDisplay sa zobrazí na každej stránke */}
      <LevelDisplay />
      
      <ContentWrapper>
        {children}
      </ContentWrapper>
    </LayoutContainer>
  );
};

export default Layout;
