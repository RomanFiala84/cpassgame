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
  width: ${p => p.isOpen ? '220px' : '60px'};
  background: ${p => p.theme.CARD_BACKGROUND};
  border-right: 2px solid ${p => p.theme.ACCENT_COLOR};
  box-shadow: ${p => p.isOpen ? '4px 0 16px rgba(0,0,0,0.3)' : 'none'};
  z-index: 1300;
  padding: ${p => p.isOpen ? '16px' : '8px'};
  display: flex;
  flex-direction: column;
  gap: ${p => p.isOpen ? '16px' : '8px'};
  overflow-y: auto;
  transition: width 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease;

  /* MOBILE */
  @media (max-width: 768px) {
    width: ${p => p.isOpen ? '200px' : '50px'};
    padding: ${p => p.isOpen ? '12px' : '6px'};
    gap: ${p => p.isOpen ? '12px' : '6px'};
  }

  @media (max-width: 480px) {
    width: ${p => p.isOpen ? '180px' : '45px'};
    padding: ${p => p.isOpen ? '10px' : '5px'};
    gap: ${p => p.isOpen ? '10px' : '5px'};
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// TOGGLE BUTTON
// ═══════════════════════════════════════════════════════════════════════

const ToggleButton = styled.button`
  position: fixed;
  left: ${p => p.isOpen ? '220px' : '60px'};
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
    left: ${p => p.isOpen ? '200px' : '50px'};
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    left: ${p => p.isOpen ? '180px' : '45px'};
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
  gap: ${p => p.isOpen ? '16px' : '12px'};
  transition: gap 0.3s ease;

  @media (max-width: 768px) {
    gap: ${p => p.isOpen ? '12px' : '10px'};
  }

  @media (max-width: 480px) {
    gap: ${p => p.isOpen ? '10px' : '8px'};
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// LEVEL SECTION
// ═══════════════════════════════════════════════════════════════════════

const LevelSection = styled.div`
  display: flex;
  flex-direction: ${p => p.isOpen ? 'column' : 'column'};
  align-items: center;
  gap: ${p => p.isOpen ? '8px' : '4px'};
  padding: ${p => p.isOpen ? '12px' : '8px'};
  background: ${p => !p.isOpen ? p.theme.SECONDARY_BACKGROUND : 'transparent'};
  border: ${p => !p.isOpen ? `1px solid ${p.theme.BORDER_COLOR}44` : 'none'};
  border-radius: 8px;
  transition: all 0.3s ease;
`;

const LevelIcon = styled.div`
  width: ${p => p.isOpen ? '56px' : '44px'};
  height: ${p => p.isOpen ? '56px' : '44px'};
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${p => p.isOpen ? '32px' : '24px'};
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 12px ${p => p.theme.ACCENT_COLOR}66;
  flex-shrink: 0;
  transition: width 0.3s ease, height 0.3s ease, font-size 0.3s ease;

  @media (max-width: 768px) {
    width: ${p => p.isOpen ? '48px' : '40px'};
    height: ${p => p.isOpen ? '48px' : '40px'};
    font-size: ${p => p.isOpen ? '24px' : '20px'};
  }

  @media (max-width: 480px) {
    width: ${p => p.isOpen ? '40px' : '36px'};
    height: ${p => p.isOpen ? '40px' : '36px'};
    font-size: ${p => p.isOpen ? '20px' : '18px'};
  }
`;

const LevelInfo = styled.div`
  display: ${p => p.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
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

// ═══════════════════════════════════════════════════════════════════════
// STATS SECTION
// ═══════════════════════════════════════════════════════════════════════

const StatsSection = styled.div`
  display: ${p => p.isOpen ? 'grid' : 'flex'};
  grid-template-columns: ${p => p.isOpen ? '1fr 1fr' : 'auto'};
  flex-direction: ${p => !p.isOpen ? 'column' : 'row'};
  gap: ${p => p.isOpen ? '8px' : '6px'};
  transition: all 0.3s ease;
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${p => p.isOpen ? '4px' : '2px'};
  padding: ${p => p.isOpen ? '10px' : '6px'};
  background: ${p => p.theme.SECONDARY_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR}44;
  border-radius: 6px;
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    padding: ${p => p.isOpen ? '8px' : '5px'};
  }
`;

const StatLabel = styled.div`
  font-size: ${p => p.isOpen ? '9px' : '7px'};
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 0.2px;
  display: ${p => p.isOpen ? 'block' : 'none'};
  transition: display 0.3s ease;
`;

const StatValue = styled.div`
  font-size: ${p => {
    if (p.$large) return p.isOpen ? '14px' : '12px';
    return p.isOpen ? '12px' : '10px';
  }};
  font-weight: 700;
  color: ${p => p.$highlight ? p.theme.ACCENT_COLOR : p.theme.PRIMARY_TEXT_COLOR};
  transition: font-size 0.3s ease;

  @media (max-width: 480px) {
    font-size: ${p => {
      if (p.$large) return p.isOpen ? '12px' : '10px';
      return p.isOpen ? '10px' : '9px';
    }};
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// PROGRESS SECTION
// ═══════════════════════════════════════════════════════════════════════

const ProgressSection = styled.div`
  display: ${p => p.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  background: ${p => p.theme.SECONDARY_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR}44;
  border-radius: 6px;
  transition: display 0.3s ease;
`;

const ProgressLabel = styled.div`
  font-size: 9px;
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
  font-size: 9px;
  font-weight: 600;
`;

const ProgressText = styled.div`
  color: ${p => p.theme.ACCENT_COLOR};
`;

const ProgressPercentage = styled.div`
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
        <SidebarContent isOpen={isOpen}>
          {/* Level - Vždy viditeľné */}
          <LevelSection isOpen={isOpen}>
            <LevelIcon isOpen={isOpen}>{level}</LevelIcon>
            <LevelInfo isOpen={isOpen}>
              <LevelLabel>Level</LevelLabel>
              <LevelValue>Detektív</LevelValue>
            </LevelInfo>
          </LevelSection>

          {/* Stats - Skryté keď je sidebar zatvorený */}
          <StatsSection isOpen={isOpen}>
            <StatCard>
              <StatLabel isOpen={isOpen}>Misie</StatLabel>
              <StatValue isOpen={isOpen} $highlight>{mission}</StatValue>
            </StatCard>

            <StatCard>
              <StatLabel isOpen={isOpen}>Bonus</StatLabel>
              <StatValue isOpen={isOpen}>{bonus}</StatValue>
            </StatCard>

            <StatCard>
              <StatLabel isOpen={isOpen}>Referrals</StatLabel>
              <StatValue isOpen={isOpen}>{referrals}</StatValue>
            </StatCard>

            <StatCard>
              <StatLabel isOpen={isOpen}>Spolu</StatLabel>
              <StatValue isOpen={isOpen} $large $highlight>{total}</StatValue>
            </StatCard>
          </StatsSection>

          {/* Progress - Skryté keď je sidebar zatvorený */}
          <ProgressSection isOpen={isOpen}>
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
