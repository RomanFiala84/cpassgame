// src/styles/StyledList.js
// ✅ Všetko v PRIMARY_TEXT_COLOR - jednotný vzhľad

import styled from 'styled-components';

export const GradientCircleList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
  
  > li {
    padding-left: 24px;
    position: relative;
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 1.6;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    list-style: none;
    
    &::before {
      content: '•';
      position: absolute;
      left: 0;
      top: 0;
      color: ${props => props.theme.PRIMARY_TEXT_COLOR};
      font-size: 20px;
      line-height: 1.6;
      font-weight: bold;
    }
    
    strong {
      color: ${props => props.theme.PRIMARY_TEXT_COLOR};  /* ✅ PRIMARY */
      font-weight: 600;
    }
    
    a {
      color: ${props => props.theme.PRIMARY_TEXT_COLOR};  /* ✅ PRIMARY */
      text-decoration: underline;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  @media (max-width: 768px) {
    > li {
      padding-left: 20px;
      font-size: 13px;
      
      &::before {
        font-size: 18px;
      }
    }
  }
  
  @media (max-width: 480px) {
    > li {
      padding-left: 18px;
      font-size: 12px;
      margin-bottom: 6px;
      
      &::before {
        font-size: 16px;
      }
    }
  }
`;

export const NestedListItem = styled.div`
  padding-left: 44px;
  font-size: 14px;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  position: relative;
  margin-bottom: 8px;
  line-height: 1.6;
  
  &::before {
    content: '→';
    position: absolute;
    left: 24px;
    top: 0;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};  /* ✅ PRIMARY */
    font-size: 16px;
    line-height: 1.6;
  }
  
  strong {
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};  /* ✅ PRIMARY */
    font-weight: 600;
  }
  
  a {
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};  /* ✅ PRIMARY */
    text-decoration: underline;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  @media (max-width: 768px) {
    padding-left: 38px;
    font-size: 13px;
    
    &::before {
      left: 20px;
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    padding-left: 32px;
    font-size: 12px;
    
    &::before {
      left: 18px;
      font-size: 13px;
    }
  }
`;
