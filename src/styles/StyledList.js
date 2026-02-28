// src/styles/StyledList.js
import styled from 'styled-components';

export const GradientCircleList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
  
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
        ${props => props.theme.ACCENT_COLOR_2 || props.theme.ACCENT_COLOR}
      );
      box-shadow: 0 2px 4px ${props => props.theme.ACCENT_COLOR}33;
      opacity: 1;
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

// ✅ OPRAVENÝ NestedListItem s support pre strong a a
export const NestedListItem = styled.div`
  padding-left: 52px;
  font-size: 14px;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  position: relative;
  margin-bottom: 10px;
  line-height: 1.6;
  
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
      ${props => props.theme.ACCENT_COLOR},
      ${props => props.theme.ACCENT_COLOR_2 || props.theme.ACCENT_COLOR}
    );
    box-shadow: 0 2px 4px ${props => props.theme.ACCENT_COLOR}33;
    opacity: 1;
  }
  
  /* ✅ PRIDANÉ - support pre strong */
  strong {
    color: ${props => props.theme.ACCENT_COLOR};
    font-weight: 600;
  }
  
  /* ✅ PRIDANÉ - support pre linky */
  a {
    color: ${props => props.theme.ACCENT_COLOR};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  @media (max-width: 768px) {
    padding-left: 40px;
    font-size: 13px;
    
    &::before {
      left: 24px;
      width: 6px;
      height: 6px;
      top: 8px;
    }
  }
  
  @media (max-width: 480px) {
    padding-left: 32px;
    font-size: 12px;
    
    &::before {
      left: 20px;
      width: 5px;
      height: 5px;
      top: 7px;
    }
  }
`;
