import React, { useState } from 'react';
import styled from 'styled-components';
import { useUserStats } from '../../contexts/UserStatsContext';

// ═══════════════════════════════════════════════════════════════════════
// SIDEBAR WRAPPER
// ═══════════════════════════════════════════════════════════════════════

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${p => p.isOpen ? '140px' : '0'};
  background: ${p => p.theme.CARD_BACKGROUND};
  border-right: ${p => p.isOpen ? `2px solid ${p.theme.ACCENT_COLOR}` : 'none'};
  box-shadow: ${p => p.isOpen ? '4px 0 16px rgba(0,0,0,0.3)' : 'none'};
  z-index: 1300;
  padding: ${p => p.isOpen ? '16px 8px' : '0'};
  display: flex;
  flex-direction: column;
  gap: ${p => p.isOpen ? '12px' : '0'};
  overflow-y: auto;
  transition: width 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease;

  @media (max-width: 768px) {
    width: ${p => p.isOpen ? '130px' : '0'};
    padding: ${p => p.isOpen ? '12px 6px' : '0'};
    gap: ${p => p.isOpen ? '10px' : '0'};
  }

  @media (max-width: 480px) {
    width: ${p => p.isOpen ? '120px' : '0'};
    padding: ${p => p.isOpen ? '10px 5px' : '0'};
    gap: ${p => p.isOpen ? '8px' : '0'};
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// TOGGLE BUTTON
// ═══════════════════════════════════════════════════════════════════════

const ToggleButton = styled.button`
  position: fixed;
  left: ${p => p.isOpen ? '140px' : '0'};
  top: 16px;
  width: 44px;
  height: 44px;
  border-radius: 0 8px 8px 0;
  background: ${p => p.theme.ACCENT_COLOR};
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1350;
  transition: left 0.3s ease;
  padding: 0;

  &:hover {
    background: ${p => p.theme.ACCENT_COLOR_2};
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    left: ${p => p.isOpen ? '130px' : '0'};
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    left: ${p => p.isOpen ? '120px' : '0'};
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// MINI VERSION - Vedľa toggle buttonu
// ═══════════════════════════════════════════════════════════════════════

const MiniVersion = styled.div`
  position: fixed;
  left: 0;
  top: 16px;
  width: ${p => !p.isOpen ? 'auto' : '0'};
  height: ${p => !p.isOpen ? '44px' : '0'};
  display: ${p => !p.isOpen ? 'flex' : 'none'};
  align-items: center;
  gap: 6px;
  padding: ${p => !p.isOpen ? '0 12px 0 0' : '0'};
  background: transparent;
  pointer-events: ${p => !p.isOpen ? 'auto' : 'none'};
  z-index: 1299;
  transition: all 0.3s ease;
  margin-left: 52px;

  @media (max-width: 768px) {
    margin-left: 48px;
  }

  @media (max-width: 480px) {
    margin-left: 44px;
  }
`;

const MiniIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
  box-shadow: 0 2px 8px ${p => p.theme.ACCENT_COLOR}66;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
`;

const MiniInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: fit-content;
`;

const MiniLabel = styled.div`
  font-size: 8px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
`;

const MiniValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// SIDEBAR CONTENT
// ═══════════════════════════════════════════════════════════════════════

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: gap 0.3s ease;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// LEVEL SECTION
// ═══════════════════════════════════════════════════════════════════════

const LevelSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px;
  background: ${p => p.theme.SECONDARY_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR}44;
  border-radius: 8px;

  @media (max-width: 768px) {
    padding: 8px;
    gap: 4px;
  }

  @media (max-width: 480px) {
    padding: 6px;
    gap: 3px;
  }
`;

const LevelIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 12px ${p => p.theme.ACCENT_COLOR}66;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    font-size: 24px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
`;

const LevelInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 100%;
`;

const LevelLabel = styled.div`
  font-size: 9px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 0.3px;

  @media (max-width: 480px) {
    font-size: 8px;
  }
`;

const LevelValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════════════════

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px;
  background: ${p => p.theme.SECONDARY_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR}44;
  border-radius: 6px;

  @media (max-width: 480px) {
    padding: 6px;
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

  @media (max-width: 480px) {
    font-size: ${p => p.$large ? '12px' : '10px'};
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════════════════════════════════════

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background: ${p => p.theme.SECONDARY_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR}44;
  border-radius: 6px;

  @media (max-width: 480px) {
    padding: 6px;
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
  height: 4px;
  background: ${p => p.theme.BORDER_COLOR};
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${p => p.$progress || 0}%;
  background: linear-gradient(to right,
    ${p => p.theme.ACCENT_COLOR},
    ${p => p.theme.ACCENT_COLOR_2}
  );
  transition: width 0.4s ease;
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

// ═══════════════════════════════════════════════════════════════════════
// OVERLAY NA MOBILE
// ═══════════════════════════════════════════════════════════════════════

const SidebarOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
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
  const [isOpen, setIsOpen] = useState(true);

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
