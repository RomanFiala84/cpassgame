// src/styles/StyledList.js
// UNIVERZÁLNE LISTY S KRUHOVÝMI ODRÁŽKAMI

import styled from 'styled-components';

// ═══════════════════════════════════════════════════
// 1️⃣ ČÍSLOVANÝ LIST S KRUHOVÝMI ODRÁŽKAMI
// ═══════════════════════════════════════════════════

export const CircleNumberList = styled.ol`
  list-style: none;
  counter-reset: item;
  padding-left: 0;
  margin: ${props => props.margin || '12px 0'};
  
  li {
    padding-left: ${props => props.size === 'small' ? '40px' : props.size === 'large' ? '56px' : '48px'};
    position: relative;
    margin-bottom: ${props => props.gap || '16px'};
    counter-increment: item;
    font-size: ${props => props.fontSize || '14px'};
    line-height: 1.6;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    
    /* Kruhová číslovaná odrážka */
    &::before {
      content: counter(item);
      position: absolute;
      left: 0;
      top: 0;
      width: ${props => props.size === 'small' ? '28px' : props.size === 'large' ? '40px' : '32px'};
      height: ${props => props.size === 'small' ? '28px' : props.size === 'large' ? '40px' : '32px'};
      background: ${props => props.accentColor || props.theme.ACCENT_COLOR};
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: ${props => props.size === 'small' ? '12px' : props.size === 'large' ? '16px' : '14px'};
      flex-shrink: 0;
      transition: all 0.3s ease;
    }
    
    /* Hover efekt */
    &:hover::before {
      transform: scale(1.1);
      box-shadow: 0 4px 12px ${props => props.accentColor || props.theme.ACCENT_COLOR}66;
    }
    
    /* Responzívne */
    @media (max-width: 768px) {
      padding-left: ${props => props.size === 'large' ? '48px' : '40px'};
      font-size: ${props => props.fontSize || '13px'};
      margin-bottom: ${props => props.gap || '14px'};
      
      &::before {
        width: ${props => props.size === 'large' ? '36px' : '28px'};
        height: ${props => props.size === 'large' ? '36px' : '28px'};
        font-size: ${props => props.size === 'large' ? '14px' : '12px'};
      }
    }
    
    @media (max-width: 480px) {
      padding-left: 36px;
      font-size: 12px;
      
      &::before {
        width: 24px;
        height: 24px;
        font-size: 11px;
      }
    }
  }
`;

// ═══════════════════════════════════════════════════
// 2️⃣ CHECKMARK LIST (✓)
// ═══════════════════════════════════════════════════

export const CheckmarkList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: ${props => props.margin || '8px 0'};
  
  li {
    padding-left: ${props => props.size === 'small' ? '24px' : '28px'};
    position: relative;
    margin-bottom: ${props => props.gap || '8px'};
    font-size: ${props => props.fontSize || '14px'};
    line-height: 1.5;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      top: 0;
      color: ${props => props.accentColor || props.theme.ACCENT_COLOR};
      font-weight: bold;
      font-size: ${props => props.size === 'small' ? '14px' : '16px'};
      transition: transform 0.2s ease;
    }
    
    &:hover::before {
      transform: scale(1.2);
    }
    
    @media (max-width: 480px) {
      padding-left: 22px;
      font-size: ${props => props.fontSize || '13px'};
      
      &::before {
        font-size: 14px;
      }
    }
  }
`;

// ═══════════════════════════════════════════════════
// 3️⃣ GRADIENT CIRCLE LIST
// ═══════════════════════════════════════════════════

export const GradientCircleList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: ${props => props.margin || '12px 0'};
  
  /* PRVÁ ÚROVEŇ - veľké gradient odrážky */
  > li {
    padding-left: ${props => props.size === 'small' ? '28px' : '32px'};
    position: relative;
    margin-bottom: ${props => props.gap || '12px'};
    font-size: ${props => props.fontSize || '14px'};
    line-height: 1.6;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 6px;
      width: ${props => props.size === 'small' ? '10px' : '12px'};
      height: ${props => props.size === 'small' ? '10px' : '12px'};
      border-radius: 50%;
      background: linear-gradient(
        135deg,
        ${props => props.theme.ACCENT_COLOR},
        ${props => props.theme.ACCENT_COLOR_2}
      );
      transition: all 0.3s ease;
    }
    
    &:hover::before {
      transform: scale(1.3);
      box-shadow: 0 2px 8px ${props => props.theme.ACCENT_COLOR}66;
    }
    
    /* ✅ VNORENÉ <ul> */
    ul {
      margin-top: 8px;
      margin-bottom: 8px;
      padding-left: 0;
      list-style: none; /* Vypni default odrážky */
      
      /* DRUHÁ ÚROVEŇ - menšie gradient odrážky */
      li {
        padding-left: 20px; /* Menší padding */
        margin-bottom: 6px;
        font-size: 0.95em; /* Mierne menší text */
        position: relative;
        
        /* Menšia gradient odrážka */
        &::before {
          content: '';
          display: block;
          position: absolute;
          left: 0;
          top: 7px;
          width: 8px; /* Menšia ako hlavná odrážka */
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            ${props => props.theme.ACCENT_COLOR},
            ${props => props.theme.ACCENT_COLOR_2}
          );
          transition: all 0.3s ease;
        }
        
        &:hover::before {
          transform: scale(1.2);
          box-shadow: 0 1px 6px ${props => props.theme.ACCENT_COLOR}66;
        }
      }
    }
  }
  
  @media (max-width: 480px) {
    > li {
      padding-left: 24px;
      font-size: ${props => props.fontSize || '13px'};
      
      &::before {
        width: 10px;
        height: 10px;
        top: 5px;
      }
      
      ul li {
        padding-left: 18px;
        font-size: 12px;
        
        &::before {
          width: 7px;
          height: 7px;
          top: 6px;
        }
      }
    }
  }
`;


// ═══════════════════════════════════════════════════
// 4️⃣ ARROW LIST (→)
// ═══════════════════════════════════════════════════

export const ArrowList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: ${props => props.margin || '8px 0'};
  
  li {
    padding-left: ${props => props.size === 'small' ? '24px' : '28px'};
    position: relative;
    margin-bottom: ${props => props.gap || '8px'};
    font-size: ${props => props.fontSize || '14px'};
    line-height: 1.5;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    
    &::before {
      content: '→';
      position: absolute;
      left: 0;
      top: 0;
      color: ${props => props.accentColor || props.theme.ACCENT_COLOR};
      font-weight: bold;
      font-size: ${props => props.size === 'small' ? '14px' : '16px'};
    }
    
    @media (max-width: 480px) {
      padding-left: 22px;
      font-size: ${props => props.fontSize || '13px'};
    }
  }
`;

// ═══════════════════════════════════════════════════
// 5️⃣ VNORENÉ LISTY (nested)
// ═══════════════════════════════════════════════════

export const NestedList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: ${props => props.margin || '12px 0'};
  
  /* Prvý level - checkmark */
  > li {
    padding-left: 28px;
    position: relative;
    margin-bottom: 12px;
    font-size: ${props => props.fontSize || '14px'};
    line-height: 1.6;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      top: 0;
      color: ${props => props.theme.ACCENT_COLOR};
      font-weight: bold;
      font-size: 16px;
    }
    
    /* Druhý level - šípka */
    > ul {
      margin-top: 8px;
      padding-left: 0;
      
      > li {
        padding-left: 24px;
        margin-bottom: 6px;
        font-size: 13px;
        
        &::before {
          content: '→';
          left: 0;
          color: ${props => props.theme.SECONDARY_TEXT_COLOR};
          font-size: 14px;
        }
      }
    }
  }
  
  @media (max-width: 480px) {
    > li {
      padding-left: 24px;
      font-size: 13px;
      
      &::before {
        font-size: 14px;
      }
      
      > ul > li {
        padding-left: 20px;
        font-size: 12px;
      }
    }
  }
`;

