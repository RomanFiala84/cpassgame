import React, { useState } from 'react';
import styled from 'styled-components';
import { useUserStats } from '../../contexts/UserStatsContext';

// ═══════════════════════════════════════════════════════════════════════
// SIDEBAR WRAPPER - Slide-in/out animácia
// ═══════════════════════════════════════════════════════════════════════

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background: ${p => p.theme.CARD_BACKGROUND};
  border-right: 2px solid ${p => p.theme.ACCENT_COLOR};
  box-shadow: ${p => p.isOpen ? '4px 0 16px rgba(0,0,0,0.3)' : 'none'};
  z-index: 1300;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform: translateX(${p => p.isOpen ? '0' : '-100%'});

  /* MOBILE */
  @media (max-width: 768px) {
    width: 240px;
    padding: 12px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    width: 220px;
    padding: 10px;
    gap: 10px;
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// TOGGLE BUTTON
// ═══════════════════════════════════════════════════════════════════════

const ToggleButton = styled.button`
  position: fixed;
  left: ${p => p.isOpen ? '280px' : '0'};
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
    left: ${p => p.isOpen ? '240px' : '0'};
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    left: ${p => p.isOpen ? '220px' : '0'};
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
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
// CONTENT
// ═══════════════════════════════════════════════════════════════════════

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const LevelSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${p => p.theme.ACCENT_COLOR};

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const LevelIcon = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 12px ${p => p.theme.ACCENT_COLOR}66;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 52px;
    height: 52px;
    font-size: 28px;
  }

  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
`;

const LevelInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const LevelLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const LevelValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  background: ${p => p.theme.SECONDARY_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR}44;
  border-radius: 8px;

  @media (max-width: 480px) {
    padding: 10px;
    gap: 4px;
  }
`;

const StatLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 0.2px;
`;

const StatValue = styled.div`
  font-size: ${p => p.$large ? '18px' : '14px'};
  font-weight: 700;
  color: ${p => p.$highlight ? p.theme.ACCENT_COLOR : p.theme.PRIMARY_TEXT_COLOR};

  @media (max-width: 480px) {
    font-size: ${p => p.$large ? '16px' : '12px'};
  }
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: ${p => p.theme.SECONDARY_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR}44;
  border-radius: 8px;
`;

const ProgressLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 0.2px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background: ${p => p.theme.BORDER_COLOR};
  border-radius: 3px;
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
  align-items: center;
  margin-top: 4px;
`;

const ProgressText = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
`;

const ProgressPercentage = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
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

      {/* OVERLAY NA MOBILE */}
      <SidebarOverlay isOpen={isOpen} onClick={closeSidebar} />

      {/* SIDEBAR */}
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

          {/* Stats Grid */}
          <StatsGrid>
            <StatCard>
              <StatLabel>Misie</StatLabel>
              <StatValue $highlight>{mission}</StatValue>
            </StatCard>

            <StatCard>
              <StatLabel>Bonus</StatLabel>
              <StatValue>{bonus}</StatValue>
            </StatCard>

            <StatCard>
              <StatLabel>Referrals</StatLabel>
              <StatValue>{referrals}</StatValue>
            </StatCard>

            <StatCard>
              <StatLabel>Spolu</StatLabel>
              <StatValue $large $highlight>{total}</StatValue>
            </StatCard>
          </StatsGrid>

          {/* Progress */}
          <ProgressSection>
            <ProgressLabel>Pokrok v misiách</ProgressLabel>
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
