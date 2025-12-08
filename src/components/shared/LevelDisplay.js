// src/components/shared/LevelDisplay.js
// ULTRA-KOMPAKTNÁ VERZIA - Minimálna šírka, bez zbytočného priestoru

import React from 'react';
import styled from 'styled-components';
import { useUserStats } from '../../contexts/UserStatsContext';

const Wrapper = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  /* ✅ OPRAVA - width: auto, min-content šírka */
  width: auto;
  z-index: 1200;
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  
  /* ✅ Minimálna šírka - obopína text */
  min-width: fit-content;
  max-width: fit-content;
  
  @media (max-width: 1280px) {
    padding: 7px;
    gap: 5px;
  }
  
  @media (max-width: 768px) {
    position: fixed;
    top: 10px;
    left: 10px;
    width: auto;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto auto auto auto;
    gap: 6px;
  }
`;

const LevelSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding-bottom: 6px;
  border-bottom: 1px solid ${p => p.theme.BORDER_COLOR};
  
  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 1 / 3;
    border-bottom: none;
    border-right: 1px solid ${p => p.theme.BORDER_COLOR};
    padding-right: 10px;
    padding-bottom: 0;
  }
`;

const LevelIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
  box-shadow: 0 3px 8px ${p => p.theme.ACCENT_COLOR}44;
`;

const LevelInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
`;

const LevelLabel = styled.div`
  font-size: 7px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  line-height: 1;
`;

const LevelValue = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
  line-height: 1;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2px;
  padding: 4px 0;
  border-bottom: ${p => p.$last ? 'none' : `1px solid ${p.theme.BORDER_COLOR}22`};
  
  @media (max-width: 768px) {
    grid-column: 2;
    padding: 3px;
    border: none;
    border-bottom: 1px solid ${p => p.theme.BORDER_COLOR}22;
    
    &:last-of-type {
      border-bottom: none;
    }
  }
`;

const StatLabel = styled.div`
  font-size: 7px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  line-height: 1;
`;

const StatValue = styled.div`
  font-size: ${p => p.$large ? '16px' : '12px'};
  font-weight: 700;
  color: ${p => p.$highlight ? p.theme.ACCENT_COLOR : p.theme.PRIMARY_TEXT_COLOR};
  line-height: 1;
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  padding-top: 2px;
  
  @media (max-width: 768px) {
    grid-column: 1 / 3;
    gap: 6px;
  }
`;

const ProgressBarVerticalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100px;
  gap: 2px;
`;

const ProgressBar = styled.div`
  width: 8px;
  height: 100px;
  background: ${p => p.theme.BORDER_COLOR};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Progress = styled.div`
  width: 100%;
  height: ${p => p.$progress || 0}%;
  background: linear-gradient(to top, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  border-radius: 4px;
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

/* ✅ OPRAVA - Text pod sebou (P-r-o-g-r-e-s-s) */
const ProgressLabel = styled.div`
  font-size: 7px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  line-height: 1;
  
  /* Písmená pod sebou */
  word-break: break-all;
  width: 8px;
  text-align: center;
  
  @media (max-width: 768px) {
    width: auto;
    word-break: normal;
  }
`;

const ProgressValue = styled.div`
  font-size: 8px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
  line-height: 1;
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

      {/* Progress */}
      <ProgressSection>
        <ProgressBarVerticalWrapper>
          <ProgressValue>{mission}/100</ProgressValue>
          <ProgressBar>
            <Progress $progress={progress} />
          </ProgressBar>
          <ProgressLabel>Progress</ProgressLabel>
        </ProgressBarVerticalWrapper>
      </ProgressSection>
    </Wrapper>
  );
};

export default LevelDisplay;
