import React, { useState } from 'react';
import styled from 'styled-components';
import { useUserStats } from '../../contexts/UserStatsContext';

// ═══════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS - OPTIMALIZOVANÁ VERZIA
// ═══════════════════════════════════════════════════════════════════════

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: ${p => p.isOpen ? '0' : '-130px'};
  height: auto;
  max-height: 100vh;
  width: 130px;
  background: ${p => p.theme.CARD_BACKGROUND};
  border-right: 2px solid ${p => p.theme.ACCENT_COLOR};
  box-shadow: 4px 0 12px rgba(0,0,0,0.25);
  z-index: 1300;
  padding: 12px 6px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  transition: left 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55), box-shadow 0.3s ease;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${p => p.theme.BORDER_COLOR}33;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${p => p.theme.ACCENT_COLOR};
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    width: 120px;
    left: ${p => p.isOpen ? '0' : '-120px'};
    padding: 10px 5px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    width: 110px;
    left: ${p => p.isOpen ? '0' : '-110px'};
    padding: 8px 4px;
    gap: 7px;
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  left: ${p => p.isOpen ? '130px' : '0'};
  top: 12px;
  width: 40px;
  height: 40px;
  border-radius: 0 8px 8px 0;
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1350;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  padding: 0;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.2);

  &:hover {
    background: linear-gradient(135deg, 
      ${p => p.theme.ACCENT_COLOR_2}, 
      ${p => p.theme.ACCENT_COLOR}
    );
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    left: ${p => p.isOpen ? '120px' : '0'};
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    left: ${p => p.isOpen ? '110px' : '0'};
    width: 32px;
    height: 32px;
    font-size: 13px;
  }
`;

const MiniVersion = styled.div`
  position: fixed;
  left: 0;
  top: 12px;
  width: ${p => !p.isOpen ? 'auto' : '0'};
  height: ${p => !p.isOpen ? '40px' : '0'};
  display: ${p => !p.isOpen ? 'flex' : 'none'};
  align-items: center;
  gap: 6px;
  padding: ${p => !p.isOpen ? '0 10px 0 0' : '0'};
  background: transparent;
  pointer-events: ${p => !p.isOpen ? 'auto' : 'none'};
  z-index: 1299;
  transition: all 0.3s ease;
  margin-left: 48px;

  @media (max-width: 768px) {
    margin-left: 44px;
    height: ${p => !p.isOpen ? '36px' : '0'};
  }

  @media (max-width: 480px) {
    margin-left: 40px;
    height: ${p => !p.isOpen ? '32px' : '0'};
  }
`;

const MiniIcon = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: white;
  box-shadow: 0 2px 6px ${p => p.theme.ACCENT_COLOR}66;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
`;

const MiniInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: fit-content;
`;

const MiniLabel = styled.div`
  font-size: 8px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const MiniValue = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    gap: 8px;
  }

  @media (max-width: 480px) {
    gap: 7px;
  }
`;

const LevelSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
  background: ${p => p.theme.SECONDARY_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR}44;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  
  /* Gradient overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at top,
      ${p => p.theme.ACCENT_COLOR}08 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 8px 6px;
    gap: 5px;
  }

  @media (max-width: 480px) {
    padding: 7px 5px;
    gap: 4px;
  }
`;

const LevelIcon = styled.div`
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: white;
  box-shadow: 0 3px 10px ${p => p.theme.ACCENT_COLOR}66;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  
  /* Shine effect */
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    height: 40%;
    background: linear-gradient(
      180deg,
      rgba(255,255,255,0.3) 0%,
      transparent 100%
    );
    border-radius: 6px 6px 20px 20px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 22px;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
`;

const LevelInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const LevelLabel = styled.div`
  font-size: 8px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 0.3px;

  @media (max-width: 480px) {
    font-size: 7px;
  }
`;

const LevelValue = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 6px;
  background: ${p => p.theme.SECONDARY_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR}44;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${p => p.theme.ACCENT_COLOR}66;
    transform: translateX(2px);
  }

  @media (max-width: 480px) {
    padding: 6px 5px;
    gap: 2px;
  }
`;

const StatLabel = styled.div`
  font-size: 8px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 0.2px;

  @media (max-width: 480px) {
    font-size: 7px;
  }
`;

const StatValue = styled.div`
  font-size: ${p => p.$large ? '14px' : '12px'};
  font-weight: 700;
  color: ${p => p.$highlight ? p.theme.ACCENT_COLOR : p.theme.PRIMARY_TEXT_COLOR};
  text-shadow: ${p => p.$highlight ? `0 1px 3px ${p.theme.ACCENT_COLOR}33` : 'none'};

  @media (max-width: 480px) {
    font-size: ${p => p.$large ? '12px' : '10px'};
  }
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px 6px;
  background: ${p => p.theme.SECONDARY_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR}44;
  border-radius: 6px;

  @media (max-width: 480px) {
    padding: 6px 5px;
    gap: 4px;
  }
`;

const ProgressLabel = styled.div`
  font-size: 8px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 0.2px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 5px;
  background: ${p => p.theme.BORDER_COLOR};
  border-radius: 3px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${p => p.$progress || 0}%;
  background: linear-gradient(to right,
    ${p => p.theme.ACCENT_COLOR},
    ${p => p.theme.ACCENT_COLOR_2}
  );
  transition: width 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 0 6px ${p => p.theme.ACCENT_COLOR}66;
  position: relative;
  
  /* Animated shine */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.4),
      transparent
    );
    animation: shine 2s ease-in-out infinite;
  }
  
  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 8px;
  font-weight: 600;
  gap: 4px;
`;

const ProgressText = styled.div`
  color: ${p => p.theme.ACCENT_COLOR};
`;

const ProgressPercentage = styled.div`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
`;

const SidebarOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 1250;
  opacity: ${p => p.isOpen ? '1' : '0'};
  pointer-events: ${p => p.isOpen ? 'auto' : 'none'};
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    display: block;
  }
`;


// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

const LevelDisplay = () => {
  const { userStats } = useUserStats();
  const [isOpen, setIsOpen] = useState(false); // ✅ DEFAULTNE FALSE = CLOSED

  const mission = userStats?.missionPoints ?? 0;
  const bonus = userStats?.bonusPoints ?? 0;
  const referrals = userStats?.referrals ?? 0;
  const total = userStats?.totalPoints ?? 0;
  const level = userStats?.level ?? 1;

  const progress = Math.min((mission / 100) * 100, 100);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* TOGGLE BUTTON */}
      <ToggleButton 
        isOpen={isOpen} 
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Zatvoriť sidebar' : 'Otvoriť sidebar'}
      >
        {isOpen ? '◀' : '▶'}
      </ToggleButton>

      {/* MINI VERSION - Vedľa buttonu keď je zatvorený */}
      <MiniVersion isOpen={isOpen}>
        <MiniIcon>{level}</MiniIcon>
        <MiniInfo>
          <MiniLabel>Level</MiniLabel>
          <MiniValue>{mission}/100</MiniValue>
        </MiniInfo>
      </MiniVersion>

      {/* OVERLAY NA MOBILE */}
      <SidebarOverlay isOpen={isOpen} onClick={closeSidebar} />

      {/* SIDEBAR - OTVORENÝ */}
      <Wrapper isOpen={isOpen}>
        <SidebarContent>
          {/* Level */}
          <LevelSection>
            <LevelIcon>{level}</LevelIcon>
            <LevelInfo>
              <LevelLabel>Level</LevelLabel>
              <LevelValue>Detektív</LevelValue>
            </LevelInfo>
          </LevelSection>

          {/* Stats - Všetko pod sebou */}
          <StatItem>
            <StatLabel>Misie</StatLabel>
            <StatValue $highlight>{mission}</StatValue>
          </StatItem>

          <StatItem>
            <StatLabel>Bonus</StatLabel>
            <StatValue>{bonus}</StatValue>
          </StatItem>

          <StatItem>
            <StatLabel>Referrals</StatLabel>
            <StatValue>{referrals}</StatValue>
          </StatItem>

          <StatItem>
            <StatLabel>Spolu</StatLabel>
            <StatValue $large $highlight>{total}</StatValue>
          </StatItem>

          {/* Progress */}
          <ProgressSection>
            <ProgressLabel>Pokrok</ProgressLabel>
            <ProgressBarContainer>
              <ProgressBar $progress={progress} />
            </ProgressBarContainer>
            <ProgressInfo>
              <ProgressText>{mission}/100</ProgressText>
              <ProgressPercentage>{Math.round(progress)}%</ProgressPercentage>
            </ProgressInfo>
          </ProgressSection>
        </SidebarContent>
      </Wrapper>
    </>
  );
};

export default LevelDisplay;
