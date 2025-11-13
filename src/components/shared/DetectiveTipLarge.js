// src/components/shared/DetectiveTipLarge.js
// VEĽKÁ VERZIA - s veľkým obrázkom detektíva

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: ${p => p.isClosing ? 'fadeOut' : 'fadeIn'} 0.3s ease;
  
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
  border: 3px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  animation: ${p => p.isClosing ? 'slideOut' : 'slideIn'} 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.8) translateY(30px);
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
      transform: scale(0.8) translateY(30px);
    }
  }
  
  @media (max-width: 768px) {
    max-width: 90%;
  }
  
  @media (max-width: 480px) {
    max-width: 95%;
    border-radius: 16px;
  }
`;

const DetectiveImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}33, 
    ${p => p.theme.ACCENT_COLOR_2}33
  );
  overflow: hidden;
  
  @media (max-width: 480px) {
    height: 200px;
  }
`;

const DetectiveImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const DetectiveImageFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120px;
  
  @media (max-width: 480px) {
    font-size: 80px;
  }
`;

const ContentContainer = styled.div`
  padding: 30px;
  overflow-y: auto;
  
  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${p => p.theme.BORDER_COLOR};
`;

const DetectiveName = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${p => p.theme.BORDER_COLOR};
    color: ${p => p.theme.PRIMARY_TEXT_COLOR};
    transform: rotate(90deg);
  }
`;

const TipText = styled.div`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    font-size: 15px;
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
    margin-bottom: 12px;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const DetectiveTipLarge = ({
  tip = "Tip od detektíva!",
  detectiveName = "Detektív Conan",
  imageUrl = "/images/detective.png",
  buttonText = "Rozumiem!",
  onClose,
  autoOpen = true,
  autoOpenDelay = 500,
  autoClose = false,
  autoCloseDelay = 8000
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      if (onClose) onClose();
    }, 400);
  }, [onClose]);

  // Auto-open
  useEffect(() => {
    if (autoOpen && !isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, autoOpenDelay);
      return () => clearTimeout(timer);
    }
  }, [autoOpen, autoOpenDelay, isOpen]);

  // Auto-close
  useEffect(() => {
    if (autoClose && isOpen && !isClosing) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, isOpen, isClosing, autoCloseDelay, handleClose]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay isClosing={isClosing} onClick={handleOverlayClick}>
      <ModalContainer isClosing={isClosing}>
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
        
        <ContentContainer>
          <Header>
            <DetectiveName>{detectiveName}</DetectiveName>
            <CloseButton onClick={handleClose} aria-label="Zavrieť">
              ×
            </CloseButton>
          </Header>
          
          <TipText dangerouslySetInnerHTML={{ __html: tip }} />
          
          <ActionButton onClick={handleClose}>
            {buttonText}
          </ActionButton>
        </ContentContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default DetectiveTipLarge;
