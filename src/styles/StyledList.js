// src/styles/StyledList.js
import styled from 'styled-components';

// Hlavný gradient list
export const GradientCircleList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
  
  /* ✅ Priame deti LI (hlavné odrážky) */
  > li {
    padding-left: 28px;
    position: relative;
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 1.6;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    list-style: none;
    
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

// ✅ Vnorený list item - SAMOSTATNÝ DIV
export const NestedListItem = styled.div`
  padding-left: 52px;
  font-size: 13px;
  color: ${props => props.theme.SECONDARY_TEXT_COLOR};
  position: relative;
  margin-bottom: 8px;
  line-height: 1.6;
  
  /* ✅ Menšia odrážka */
  &::before {
    content: '';
    position: absolute;
    left: 28px;
    top: 9px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      ${props => props.theme.ACCENT_COLOR}66,
      ${props => props.theme.ACCENT_COLOR_2}66
    );
    opacity: 0.7;
    box-shadow: 0 1px 2px ${props => props.theme.ACCENT_COLOR}22;
  }
  
  @media (max-width: 768px) {
    padding-left: 40px;
    font-size: 12px;
    
    &::before {
      left: 24px;
      width: 7px;
      height: 7px;
      top: 8px;
    }
  }
  
  @media (max-width: 480px) {
    padding-left: 32px;
    font-size: 11px;
    
    &::before {
      left: 20px;
      width: 6px;
      height: 6px;
      top: 7px;
    }
  }
`;
