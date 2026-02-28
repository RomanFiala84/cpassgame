//HOTOVO
// ✅ OPRAVENÉ - odrážky správne zarovnané v Accordion

import styled from 'styled-components';

export const GradientCircleList = styled.ul`
  list-style: none;
  padding-left: 25px; /* ✅ OPRAVENÉ z 0 na 25px */
  margin: 0;
  
  > li {
    padding-left: 0; /* ✅ OPRAVENÉ - li už nemá extra padding */
    position: relative;
    margin-bottom: 10px;
    font-size: 15px;
    line-height: 1.6;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    list-style: none;
    
    &::before {
      content: '•';
      position: absolute;
      left: -20px; /* ✅ OPRAVENÉ - odrážka vľavo od textu */
      top: 0;
      color: ${props => props.theme.PRIMARY_TEXT_COLOR};
      font-size: 15px;
      line-height: 1.6;
      font-weight: bold;
    }
    
    strong {
      color: ${props => props.theme.PRIMARY_TEXT_COLOR};
      font-weight: 600;
    }
    
    a {
      color: ${props => props.theme.PRIMARY_TEXT_COLOR};
      text-decoration: underline;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  @media (max-width: 768px) {
    > li {
      font-size: 15px;
      
      &::before {
        font-size: 15px;
        left: -20px;
      }
    }
  }
  
  @media (max-width: 480px) {
    > li {
      font-size: 15px;
      margin-bottom: 5px;
      
      &::before {
        font-size: 15px;
        left: -20px;
      }
    }
  }
`;

export const NestedListItem = styled.div`
  padding-left: 25px; /* ✅ OPRAVENÉ z 45px */
  font-size: 15px;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  position: relative;
  margin-bottom: 10px;
  line-height: 1.6;
  
  &::before {
    content: '→';
    position: absolute;
    left: 0; /* ✅ OPRAVENÉ z 25px */
    top: 0;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    font-size: 15px;
    line-height: 1.6;
  }
  
  strong {
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    font-weight: 600;
  }
  
  a {
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    text-decoration: underline;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  @media (max-width: 768px) {
    padding-left: 25px;
    font-size: 15px;
    
    &::before {
      left: 0;
      font-size: 15px;
    }
  }
  
  @media (max-width: 480px) {
    padding-left: 25px;
    font-size: 15px;
    
    &::before {
      left: 0;
      font-size: 15px;
    }
  }
`;
