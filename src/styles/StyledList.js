// src/styles/StyledList.js
import styled from 'styled-components';

// Hlavný gradient list
export const GradientCircleList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
  
  /* ✅ Štandardné LI elementy */
  > li {
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
    > li {
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
    > li {
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

// ✅ Vnorený list item - ÚPLNE SAMOSTATNÝ KOMPONENT
export const NestedListItem = styled.li`
  /* ✅ RESET všetkých možných dedených štýlov */
  all: unset;
  display: block;
  box-sizing: border-box;
  
  /* ✅ Vlastné štýly */
  padding-left: 52px !important;
  font-size: 13px !important;
  color: ${props => props.theme.SECONDARY_TEXT_COLOR} !important;
  position: relative !important;
  margin-bottom: 8px !important;
  line-height: 1.6 !important;
  list-style: none !important;
  
  /* ❌ ÚPLNE ZRUŠ akýkoľvek ::before */
  &::before {
    content: none !important;
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
  }
  
  /* ✅ VYTVOR nový marker pomocou ::after */
  &::after {
    content: '' !important;
    display: block !important;
    position: absolute !important;
    left: 28px !important;
    top: 9px !important;
    width: 8px !important;
    height: 8px !important;
    border-radius: 50% !important;
    background: linear-gradient(
      135deg,
      ${props => props.theme.ACCENT_COLOR}66,
      ${props => props.theme.ACCENT_COLOR_2}66
    ) !important;
    opacity: 0.7 !important;
    box-shadow: 0 1px 2px ${props => props.theme.ACCENT_COLOR}22 !important;
  }
  
  @media (max-width: 768px) {
    padding-left: 40px !important;
    font-size: 12px !important;
    
    &::after {
      left: 24px !important;
      width: 7px !important;
      height: 7px !important;
      top: 8px !important;
    }
  }
  
  @media (max-width: 480px) {
    padding-left: 32px !important;
    font-size: 11px !important;
    
    &::after {
      left: 20px !important;
      width: 6px !important;
      height: 6px !important;
      top: 7px !important;
    }
  }
`;
