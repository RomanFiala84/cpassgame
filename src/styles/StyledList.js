//HOTOVO
// ✅ Všetko v PRIMARY_TEXT_COLOR - jednotný vzhľad
// ✅ Margin/padding zaokrúhlené na 5/10

import styled from 'styled-components';

export const GradientCircleList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
  
  > li {
    padding-left: 25px; /* ✅ zaokrúhlené z 24px */
    position: relative;
    margin-bottom: 10px; /* ✅ zaokrúhlené z 8px */
    font-size: 15px; /* ✅ odkomentované */
    line-height: 1.6;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    list-style: none;
    
    &::before {
      content: '•';
      position: absolute;
      left: 0;
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
      padding-left: 20px;
      font-size: 15px; /* ✅ odkomentované */
      
      &::before {
        font-size: 15px;
      }
    }
  }
  
  @media (max-width: 480px) {
    > li {
      padding-left: 20px; /* ✅ zaokrúhlené z 18px */
      font-size: 15px; /* ✅ odkomentované */
      margin-bottom: 5px; /* ✅ zaokrúhlené z 6px */
      
      &::before {
        font-size: 15px;
      }
    }
  }
`;

export const NestedListItem = styled.div`
  padding-left: 45px; /* ✅ zaokrúhlené z 44px */
  font-size: 15px; /* ✅ odkomentované */
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  position: relative;
  margin-bottom: 10px; /* ✅ zaokrúhlené z 8px */
  line-height: 1.6;
  
  &::before {
    content: '→';
    position: absolute;
    left: 25px; /* ✅ zaokrúhlené z 24px */
    top: 0;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    font-size: 15px; /* ✅ odkomentované */
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
    padding-left: 40px; /* ✅ zaokrúhlené z 38px */
    font-size: 15px; /* ✅ odkomentované */
    
    &::before {
      left: 20px;
      font-size: 15px;
    }
  }
  
  @media (max-width: 480px) {
    padding-left: 30px; /* ✅ zaokrúhlené z 32px */
    font-size: 15px; /* ✅ odkomentované */
    
    &::before {
      left: 20px; /* ✅ zaokrúhlené z 18px */
      font-size: 15px; /* ✅ odkomentované */
    }
  }
`;
