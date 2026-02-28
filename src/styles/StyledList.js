// src/styles/StyledList.js

import styled from 'styled-components';

// Existujúci GradientCircleList
export const GradientCircleList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
  
  li {
    padding-left: 28px;
    position: relative;
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 1.6;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: linear-gradient(
        135deg,
        ${props => props.theme.ACCENT_COLOR},
        ${props => props.theme.ACCENT_COLOR_2}
      );
      box-shadow: 0 2px 4px ${props => props.theme.ACCENT_COLOR}33;
    }
    
    strong {
      color: ${props => props.theme.ACCENT_COLOR};
      font-weight: 600;
    }
    
    a {
      color: ${props => props.theme.ACCENT_COLOR};
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  @media (max-width: 768px) {
    li {
      padding-left: 24px;
      font-size: 13px;
      
      &::before {
        width: 10px;
        height: 10px;
        top: 7px;
      }
    }
  }
  
  @media (max-width: 480px) {
    li {
      padding-left: 20px;
      font-size: 12px;
      margin-bottom: 8px;
      
      &::before {
        width: 8px;
        height: 8px;
        top: 6px;
      }
    }
  }
`;

// ✨ NOVÝ - Vnorený list item
// Vnorený list item - ROVNAKÝ AKO HLAVNÝ, LEN ODSADENÝ
export const NestedListItem = styled.li`
  padding-left: 52px !important; /* Iba extra odsadenie */
  
  /* Všetko ostatné zdedí z GradientCircleList */
  
  &::before {
    left: 28px !important; /* Gradient kruh posunutý doprava */
  }
  
  @media (max-width: 768px) {
    padding-left: 40px !important;
    
    &::before {
      left: 24px !important;
    }
  }
  
  @media (max-width: 480px) {
    padding-left: 32px !important;
    
    &::before {
      left: 20px !important;
    }
  }
`;

