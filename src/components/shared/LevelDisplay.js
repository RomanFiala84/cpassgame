// src/components/shared/LevelDisplay.js
// FINÁLNA VERZIA - Vertikálny progress bar zdola nahor

import React from 'react';
import styled from 'styled-components';
import { useUserStats } from '../../contexts/UserStatsContext';

const Wrapper = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  /* ✅ OPRAVA - Štvrtinová šírka */
  width: 25%;
  min-width: 180px;
  max-width: 200px;
  z-index: 1200;
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  @media (max-width: 1024px) {
    width: 25%;
    min-width: 160px;
    padding: 14px 10px;
    gap: 8px;
  }
  
  @media (max-width: 768px) {
    position: static;
    width: 100%;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const LevelSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${p => p.theme.BORDER_COLOR};
`;

const LevelIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  color: white;
  box-shadow: 0 3px 8px ${p => p.theme.ACCENT_COLOR}44;
`;

const LevelInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const LevelLabel = styled.div`
  font-size: 9px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LevelValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  padding: 8px 0;
  border-bottom: ${p => p.$last ? 'none' : `1px solid ${p.theme.BORDER_COLOR}22`};
`;

const StatLabel = styled.div`
  font-size: 9px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const StatValue = styled.div`
  font-size: ${p => p.$large ? '24px' : '18px'};
  font-weight: 700;
  color: ${p => p.$highlight ? p.theme.ACCENT_COLOR : p.theme.PRIMARY_TEXT_COLOR};
  line-height: 1;
`;

const ProgressSection = styled.div`
  display: flex;
  /* ✅ ZMENA - flex-direction: column → row s alignment */
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
  padding-top: 6px;
`;

const ProgressLabelText = styled.div`
  font-size: 9px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  /* ✅ ZMENA - rotácia na 90° */
  writing-mode: vertical-rl;
  text-orientation: mixed;
  width: 12px;
  text-align: center;
`;

const ProgressValue = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
  /* ✅ ZMENA - vertikálny text */
  writing-mode: vertical-rl;
  text-orientation: mixed;
  min-width: 20px;
  text-align: center;
`;

/* ✅ NOVÝ - Wrapper pre vertikálny progress bar */
const ProgressBarVerticalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 150px;
  gap: 4px;
`;

/* ✅ ZMENA - Vertikálny progress bar */
const ProgressBar = styled.div`
  width: 12px;
  height: 150px;
  background: ${p => p.theme.BORDER_COLOR};
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

/* ✅ ZMENA - Gradient zdola nahor (to top) */
const Progress = styled.div`
  width: 100%;
  height: ${p => p.$progress || 0}%;
  background: linear-gradient(to top, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  border-radius: 6px;
  transition: height 0.4s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
`;

const LevelDisplay = () => {
  const { userStats } = useUserStats();

  const mission = userStats?.missionPoints ?? 0;
  const bonus = userStats?.bonusPoints ?? 0;
  const referrals = userStats?.referrals ?? 0;
  const total = userStats?.totalPoints ?? 0;
  const level = userStats?.level ?? 1;

  const progress = Math.min((mission / 100) * 100, 100);

  return (
    <Wrapper>
      {/* Level */}
      <LevelSection>
        <LevelIcon>{level}</LevelIcon>
        <LevelInfo>
          <LevelLabel>Level</LevelLabel>
          <LevelValue>Detektív</LevelValue>
        </LevelInfo>
      </LevelSection>

      {/* Misie */}
      <StatItem>
        <StatLabel>Misie</StatLabel>
        <StatValue $highlight>{mission}</StatValue>
      </StatItem>

      {/* Bonus */}
      <StatItem>
        <StatLabel>Bonus</StatLabel>
        <StatValue>{bonus}</StatValue>
      </StatItem>

      {/* Referrals */}
      <StatItem>
        <StatLabel>Referrals</StatLabel>
        <StatValue>{referrals}</StatValue>
      </StatItem>

      {/* Celkové body */}
      <StatItem $last>
        <StatLabel>Spolu</StatLabel>
        <StatValue $large $highlight>{total}</StatValue>
      </StatItem>

      {/* ✅ ZMENA - Progress s vertikálnym barom */}
      <ProgressSection>
        <ProgressBarVerticalWrapper>
          <ProgressValue>{mission}/100</ProgressValue>
          <ProgressBar>
            <Progress $progress={progress} />
          </ProgressBar>
          <ProgressLabelText>Progress</ProgressLabelText>
        </ProgressBarVerticalWrapper>
      </ProgressSection>
    </Wrapper>
  );
};

export default LevelDisplay;
