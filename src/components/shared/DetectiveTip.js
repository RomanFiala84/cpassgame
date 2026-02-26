// src/components/shared/DetectiveTip.js
// ✅ VERZIA BEZ TEXTOVÉHO BADGE

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

// =====================
// STYLED COMPONENTS - OPTIMALIZOVANÁ VERZIA
// =====================

const TipButton = styled.button`
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  border: 3px solid ${p => p.theme.CARD_BACKGROUND};
  box-shadow: 0 4px 16px rgba(0,0,0,0.35);
  cursor: pointer;
  z-index: 999;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  overflow: hidden;
  
  &:hover {
    transform: scale(1.15) rotate(5deg);
    box-shadow: 0 6px 20px rgba(0,0,0,0.45);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
    bottom: 12px;
    right: 12px;
  }
  
  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
  }
`;

const DetectiveIcon = styled.img`
  width: 110%;
  height: 110%;
  object-fit: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.3s ease;
  
  ${TipButton}:hover & {
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const DetectiveIconFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  
  @media (max-width: 768px) {
    font-size: 26px;
  }
  
  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const TipBubble = styled.div`
  position: fixed;
  bottom: 82px;
  right: 16px;
  max-width: 360px;
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  z-index: 998;
  animation: ${p => p.$isClosing ? 'slideOut' : 'slideIn'} 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  animation-fill-mode: forwards;
  
  /* Decentný gradient pozadie */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at top right,
      ${p => p.theme.ACCENT_COLOR}08 0%,
      transparent 70%
    );
    border-radius: 16px;
    pointer-events: none;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(20px) scale(0.9);
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    right: 30px;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 12px solid ${p => p.theme.ACCENT_COLOR};
  }
  
  @media (max-width: 768px) {
    max-width: 300px;
    right: 12px;
    bottom: 70px;
    padding: 14px;
  }
  
  @media (max-width: 480px) {
    max-width: calc(100vw - 24px);
    left: 12px;
    right: 12px;
    bottom: 62px;
    padding: 12px;
    
    &::after {
      right: 20px;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid ${p => p.theme.ACCENT_COLOR};
    }
  }
`;

const TipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${p => p.theme.BORDER_COLOR};
  position: relative;
  z-index: 1;
`;

const DetectiveAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  box-shadow: 0 2px 6px ${p => p.theme.ACCENT_COLOR}33;
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
`;

const DetectiveAvatarFallback = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${p => p.theme.ACCENT_COLOR};
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 2px 6px ${p => p.theme.ACCENT_COLOR}33;
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
`;

const DetectiveName = styled.div`
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
  font-size: 14px;
  flex: 1;
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const TipText = styled.div`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 14px;
  line-height: 1.6;
  position: relative;
  z-index: 1;
  
  @media (max-width: 480px) {
    font-size: 13px;
    line-height: 1.5;
  }
  
  p {
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  strong {
    color: ${p => p.theme.ACCENT_COLOR};
    font-weight: 600;
  }
  
  em {
    color: ${p => p.theme.ACCENT_COLOR_2};
    font-style: normal;
    font-weight: 500;
  }
`;

const CloseButton = styled.button`
  background: ${p => p.disabled ? 'transparent' : p.theme.BORDER_COLOR}44;
  border: none;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 20px;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  padding: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: all 0.2s ease;
  opacity: ${p => p.disabled ? 0.3 : 1};
  
  &:hover {
    background: ${p => p.disabled ? 'transparent' : p.theme.ACCENT_COLOR};
    color: ${p => p.disabled ? p.theme.SECONDARY_TEXT_COLOR : '#ffffff'};
    transform: ${p => p.disabled ? 'none' : 'rotate(90deg)'};
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
    width: 22px;
    height: 22px;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${p => p.theme.BORDER_COLOR};
  border-radius: 0 0 14px 14px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  animation: progress ${p => p.$duration}s linear;
  box-shadow: 0 0 8px ${p => p.theme.ACCENT_COLOR}66;
  
  @keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
  }
`;

const CountdownTimer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${p => p.theme.ACCENT_COLOR}22;
  border: 1px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 6px;
  padding: 3px 7px;
  font-size: 10px;
  font-weight: 600;
  color: ${p => p.theme.ACCENT_COLOR};
  display: flex;
  align-items: center;
  gap: 3px;
  z-index: 2;
  backdrop-filter: blur(4px);
  
  @media (max-width: 480px) {
    font-size: 9px;
    padding: 2px 6px;
  }
`;

// =====================
// KOMPONENT
// =====================

const DetectiveTip = ({ 
  tip, 
  detectiveName = "Inšpektor Kritan", 
  autoOpen = false,
  autoOpenDelay = 500,
  autoClose = false,
  autoCloseDelay = 8000,
  position = 'right',
  minReadTime = 10000,
  onOpen,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(minReadTime / 1000);
  
  const hasBeenOpenedRef = useRef(false);

  const handleClose = useCallback(() => {
    if (!canClose) return;
    
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsOpen(false);
      if (onClose) onClose();
    }, 400);
  }, [canClose, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    
    if (hasBeenOpenedRef.current) {
      setCanClose(true);
      setCountdown(0);
      return;
    }
    
    hasBeenOpenedRef.current = true;
    setCanClose(false);
    setCountdown(minReadTime / 1000);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanClose(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isOpen, minReadTime]);

  useEffect(() => {
    if (autoOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        if (onOpen) onOpen();
      }, autoOpenDelay);

      return () => clearTimeout(timer);
    }
  }, [autoOpen, autoOpenDelay, onOpen]);

  useEffect(() => {
    if (isOpen && autoClose && canClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, canClose, handleClose]);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
      if (onOpen) onOpen();
    }
  }, [isOpen, handleClose, onOpen]);

  const handleImageError = () => {
    console.warn('Detective image failed to load, using fallback');
    setImageError(true);
  };

  if (!tip) return null;

  const buttonStyle = position === 'left' ? { left: '20px', right: 'auto' } : {};
  const bubbleStyle = position === 'left' ? { left: '20px', right: 'auto' } : {};

  return (
    <>
      <TipButton 
        onClick={handleToggle} 
        title="TIP OD INŠPEKTORA"
        style={buttonStyle}
        aria-label="Otvoriť tip od Inšpektora"
      >
        {!imageError ? (
          <DetectiveIcon 
            src="/images/detective-icon.png" 
            alt=""
            onError={handleImageError}
          />
        ) : (
          <DetectiveIconFallback>🕵️</DetectiveIconFallback>
        )}
      </TipButton>
      
      {(isOpen || isClosing) && (
        <TipBubble style={bubbleStyle} $isClosing={isClosing}>
          {!canClose && (
            <CountdownTimer>
              ⏱️ {countdown}s
            </CountdownTimer>
          )}
          
          <TipHeader>
            {!imageError ? (
              <DetectiveAvatar 
                src="/images/detective-icon.png" 
                alt=""
                onError={handleImageError}
              />
            ) : (
              <DetectiveAvatarFallback>🕵️</DetectiveAvatarFallback>
            )}
            <DetectiveName>{detectiveName}</DetectiveName>
            <CloseButton 
              onClick={handleClose}
              disabled={!canClose}
              aria-label="Zavrieť tip od Inšpektora"
              title={!canClose ? `Prečítajte si prosím informácie ${countdown}s` : 'Zavrieť'}
            >
              ×
            </CloseButton>
          </TipHeader>
          <TipText dangerouslySetInnerHTML={{ __html: tip }} />
          
          {autoClose && canClose && (
            <ProgressBar>
              <ProgressFill $duration={autoCloseDelay / 1000} />
            </ProgressBar>
          )}
        </TipBubble>
      )}
    </>
  );
};

export default DetectiveTip;
