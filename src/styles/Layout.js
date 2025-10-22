// src/styles/Layout.js
import React from 'react';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: ${p => p.theme.BACKGROUND_COLOR};
  padding: 20px;
  transition: background 240ms ease;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <ContentWrapper>
        {children}
      </ContentWrapper>
    </LayoutContainer>
  );
};

export default Layout;
