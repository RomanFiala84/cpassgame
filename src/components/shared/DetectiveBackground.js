// src/components/shared/DetectiveBackground.js
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
`;

const DetectiveImage = styled.img`
  position: fixed;
  bottom: -50px;
  right: 20px;
  height: 500px;
  width: auto;
  z-index: 1;
  opacity: 0.15;
  pointer-events: none;
  filter: sepia(20%);
  
  @media (max-width: 1024px) {
    height: 400px;
    opacity: 0.12;
    right: 10px;
  }
  
  @media (max-width: 768px) {
    height: 280px;
    opacity: 0.1;
    right: 5px;
    bottom: -30px;
  }
  
  @media (max-width: 480px) {
    height: 200px;
    opacity: 0.08;
    right: -20px;
    bottom: -20px;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
`;

/**
 * DetectiveBackground - Fixný detektív v pozadí obrazovky
 * 
 * Použitie:
 * <DetectiveBackground>
 *   <YourContent />
 * </DetectiveBackground>
 * 
 * Props:
 * - children: Obsah, ktorý sa zobrazí nad detektívom
 * - opacity: Voliteľná priehľadnosť (default: 0.15)
 */
const DetectiveBackground = ({ children, opacity }) => {
  return (
    <Container>
      <DetectiveImage 
        src="/images/detective.png"
        alt="Detective"
        aria-hidden="true"
        style={{ opacity: opacity }}
      />
      <Content>
        {children}
      </Content>
    </Container>
  );
};

export default DetectiveBackground;
