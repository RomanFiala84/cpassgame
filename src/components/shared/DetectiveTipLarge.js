// src/components/shared/DetectiveTipLarge.js
// KOMPLETNÁ OPTIMALIZOVANÁ VERZIA - BEZ CLOSE BUTTON

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

const TextBadge = styled.div`
  position: fixed;
  bottom: 8px;
  right: 16px;
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 600;
  color: ${p => p.theme.ACCENT_COLOR};
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  z-index: 998;
  pointer-events: none;
  animation: badgePulse 2s ease-in-out infinite;
  
  @keyframes badgePulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @media (max-width: 768px) {
    bottom: 4px;
    right: 12px;
    font-size: 8px;
    padding: 2px 6px;
  }
  
  @media (max-width: 480px) {
    bottom: 2px;
    right: 12px;
    font-size: 7px;
    padding: 2px 5px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: ${p => p.$isClosing ? 'fadeOut' : 'fadeIn'} 0.3s ease;
  animation-fill-mode: forwards;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

const ModalContainer = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 16px;
  max-width: 850px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  box-shadow: 0 16px 48px rgba(0,0,0,0.5);
  position: relative;
  animation: ${p => p.$isClosing ? 'slideOut' : 'slideIn'} 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  animation-fill-mode: forwards;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.85) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.85) translateY(20px);
    }
  }
  
  @media (max-width: 768px) {
    max-width: 90%;
    flex-direction: column;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    max-width: 95%;
  }
`;

const CountdownBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${p => p.theme.ACCENT_COLOR};
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.25);
  backdrop-filter: blur(4px);
  
  @media (max-width: 480px) {
    font-size: 11px;
    padding: 5px 10px;
    top: 10px;
    right: 10px;
  }
`;

const ContentContainer = styled.div`
  width: 50%;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  order: 1;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${p => p.theme.BORDER_COLOR}33;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${p => p.theme.ACCENT_COLOR};
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
    order: 2;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const DetectiveImageContainer = styled.div`
  position: relative;
  width: 50%;
  min-height: 480px;
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}33, 
    ${p => p.theme.ACCENT_COLOR_2}33
  );
  overflow: hidden;
  order: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Dekoratívny pattern */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 30% 50%,
      ${p => p.theme.ACCENT_COLOR}15 0%,
      transparent 60%
    );
    pointer-events: none;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    min-height: 220px;
    order: 1;
  }
  
  @media (max-width: 480px) {
    min-height: 180px;
  }
`;

const DetectiveImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  position: relative;
  z-index: 2;
  padding: 10px;
  
  @media (max-width: 768px) {
    padding: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 6px;
  }
`;

const DetectiveImageFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 80px;
  }
  
  @media (max-width: 480px) {
    font-size: 60px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${p => p.theme.BORDER_COLOR};
`;

const DetectiveName = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '🕵️';
    font-size: 22px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
    
    &::before {
      font-size: 20px;
    }
  }
`;

const TipText = styled.div`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 16px;
  flex: 1;
  
  @media (max-width: 480px) {
    font-size: 14px;
    line-height: 1.6;
  }
  
  strong {
    color: ${p => p.theme.ACCENT_COLOR};
    font-weight: 600;
  }
  
  em {
    color: ${p => p.theme.ACCENT_COLOR_2};
    font-style: italic;
  }
  
  p {
    margin-bottom: 10px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  ul {
    margin: 8px 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 6px;
    }
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  background: ${p => p.disabled 
    ? p.theme.BORDER_COLOR 
    : `linear-gradient(135deg, ${p.theme.ACCENT_COLOR}, ${p.theme.ACCENT_COLOR_2})`
  };
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
  opacity: ${p => p.disabled ? 0.6 : 1};
  position: relative;
  overflow: hidden;
  
  /* Shine effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: ${p => p.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${p => p.disabled ? '0 3px 10px rgba(0,0,0,0.2)' : '0 5px 15px rgba(0,0,0,0.3)'};
    
    &::before {
      left: ${p => p.disabled ? '-100%' : '100%'};
    }
  }
  
  &:active {
    transform: ${p => p.disabled ? 'none' : 'translateY(0)'};
  }
  
  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`;

// =====================
// COMPONENT
// =====================

const DetectiveTipLarge = ({
  tip,
  detectiveName = "Inšpektor Kritan",
  imageUrl = "/images/detective.png",
  iconUrl = "/images/detective-icon.png",
  buttonText = "Rozumiem!",
  autoOpen = false,
  autoOpenDelay = 500,
  autoClose = false,
  autoCloseDelay = 8000,
  showBadge = true,
  position = 'right',
  minReadTime = 10000,
  onOpen,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [iconError, setIconError] = useState(false);
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
    setImageError(true);
  };

  const handleIconError = () => {
    setIconError(true);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && canClose) {
      handleClose();
    }
  };

  if (!tip) return null;

  const buttonStyle = position === 'left' ? { left: '16px', right: 'auto' } : {};
  const badgeStyle = position === 'left' ? { left: '16px', right: 'auto' } : {};

  return (
    <>
      {/* BUTTON */}
      <TipButton 
        onClick={handleToggle} 
        title="Tip od Inšpektora Kritana"
        style={buttonStyle}
        aria-label="Otvoriť tip od Inšpektora Kritana"
      >
        {!iconError ? (
          <DetectiveIcon 
            src={iconUrl}
            alt=""
            onError={handleIconError}
          />
        ) : (
          <DetectiveIconFallback>🕵️</DetectiveIconFallback>
        )}
      </TipButton>
      
      {/* TEXTOVÝ BADGE POD IKONKOU */}
      {showBadge && !isOpen && (
        <TextBadge style={badgeStyle}>
          Tip od {detectiveName}
        </TextBadge>
      )}
      
      {/* MODAL */}
      {(isOpen || isClosing) && (
        <Overlay $isClosing={isClosing} onClick={handleOverlayClick}>
          <ModalContainer $isClosing={isClosing}>
            {!canClose && (
              <CountdownBadge>
                ⏱️ {countdown}s
              </CountdownBadge>
            )}
            
            <ContentContainer>
              <Header>
                <DetectiveName>{detectiveName}</DetectiveName>
              </Header>
              
              <TipText dangerouslySetInnerHTML={{ __html: tip }} />
              
              <ActionButton 
                onClick={handleClose}
                disabled={!canClose}
                title={!canClose ? `Zostávajúci čas ${countdown}s` : buttonText}
              >
                {!canClose ? `Prečítajte si prosím informácie ${countdown}s...` : buttonText}
              </ActionButton>
            </ContentContainer>
            
            <DetectiveImageContainer>
              {!imageError ? (
                <DetectiveImage 
                  src={imageUrl}
                  alt={detectiveName}
                  onError={handleImageError}
                />
              ) : (
                <DetectiveImageFallback>🕵️</DetectiveImageFallback>
              )}
            </DetectiveImageContainer>
          </ModalContainer>
        </Overlay>
      )}
    </>
  );
};

export default DetectiveTipLarge;
