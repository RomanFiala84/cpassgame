// src/styles/StyledButton.js
// OPTIMALIZOVANÝ - Viac variantov, lepšie transitions, accessibility

import React from 'react';
import styled, { css } from 'styled-components';

// ✅ NOVÉ - Styly pre rôzne varianty
const buttonVariants = {
  accent: css`
    color: #FFFFFF;
    background: ${props => props.theme.ACCENT_COLOR};
    
    &:hover:not(:disabled) {
      background: ${props => props.theme.ACCENT_COLOR_2};
      box-shadow: 0 6px 20px ${props => props.theme.ACCENT_COLOR}44;
    }
  `,
  
  secondary: css`
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    background: ${props => props.theme.BUTTON_COLOR};
    
    &:hover:not(:disabled) {
      background: ${props => props.theme.ACCENT_COLOR_3};
      box-shadow: 0 6px 20px ${props => props.theme.BUTTON_COLOR}44;
    }
  `,
  
  outline: css`
    color: ${props => props.theme.ACCENT_COLOR};
    background: transparent;
    border: 2px solid ${props => props.theme.ACCENT_COLOR};
    
    &:hover:not(:disabled) {
      background: ${props => props.theme.ACCENT_COLOR};
      color: #FFFFFF;
      box-shadow: 0 6px 20px ${props => props.theme.ACCENT_COLOR}44;
    }
  `,
  
  ghost: css`
    color: ${props => props.theme.ACCENT_COLOR};
    background: transparent;
    border: none;
    
    &:hover:not(:disabled) {
      background: ${props => props.theme.ACCENT_COLOR}22;
    }
  `,
  
  danger: css`
    color: #FFFFFF;
    background: ${props => props.theme.ERROR_COLOR || '#ef4444'};
    
    &:hover:not(:disabled) {
      background: #dc2626;
      box-shadow: 0 6px 20px #ef444444;
    }
  `,
  
  success: css`
    color: #FFFFFF;
    background: ${props => props.theme.SUCCESS_COLOR || '#10b981'};
    
    &:hover:not(:disabled) {
      background: #059669;
      box-shadow: 0 6px 20px #10b98144;
    }
  `,
};

// ✅ NOVÉ - Styly pre rôzne veľkosti
const buttonSizes = {
  small: css`
    font-size: 12px;
    padding: 8px 16px;
    min-width: 80px;
  `,
  
  medium: css`
    font-size: 14px;
    padding: 10px 24px;
    min-width: 120px;
  `,
  
  large: css`
    font-size: 16px;
    padding: 14px 32px;
    min-width: 160px;
  `,
};

const Button = styled.button`
  font-family: inherit;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  /* ✅ Variant styles */
  ${props => {
    if (props.$variant) {
      return buttonVariants[props.$variant];
    }
    // Default variant (accent)
    return props.$accent ? buttonVariants.accent : buttonVariants.secondary;
  }}
  
  /* ✅ Size styles */
  ${props => buttonSizes[props.$size || 'medium']}
  
  /* ✅ Full width */
  ${props => props.$fullWidth && css`
    width: 100%;
    min-width: auto;
  `}
  
  /* ✅ Loading state */
  ${props => props.$loading && css`
    pointer-events: none;
    position: relative;
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spinner 0.6s linear infinite;
    }
    
    @keyframes spinner {
      to { transform: rotate(360deg); }
    }
  `}
  
  /* ✅ Hover & Active effects */
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  /* ✅ Focus state (accessibility) */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.ACCENT_COLOR};
    outline-offset: 2px;
  }
  
  /* ✅ Disabled state */
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  /* ✅ Ripple effect on click */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:active:not(:disabled)::before {
    width: 300px;
    height: 300px;
  }
`;

/**
 * StyledButton - Optimalizované tlačidlo s viacerými variantmi
 * 
 * @param {string} variant - 'accent' (default), 'secondary', 'outline', 'ghost', 'danger', 'success'
 * @param {string} size - 'small', 'medium' (default), 'large'
 * @param {boolean} fullWidth - Roztiahne tlačidlo na plnú šírku
 * @param {boolean} loading - Zobrazí loading spinner
 * @param {boolean} accent - Deprecated, použi variant="accent"
 * 
 * Príklady použitia:
 * 
 * <StyledButton variant="accent">Primárne tlačidlo</StyledButton>
 * <StyledButton variant="outline" size="large">Veľké outline</StyledButton>
 * <StyledButton variant="danger" disabled>Disabled</StyledButton>
 * <StyledButton loading>Načítavam...</StyledButton>
 * <StyledButton fullWidth>Celá šírka</StyledButton>
 */
const StyledButton = ({ 
  children, 
  accent, 
  variant, 
  size = 'medium',
  fullWidth,
  loading,
  ...props 
}) => {
  return (
    <Button 
      $accent={accent}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={loading || props.disabled}
      {...props}
    >
      {children}
    </Button>
  );
};

export default StyledButton;
