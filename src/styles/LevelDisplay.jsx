// src/components/LevelDisplay.jsx
// OPRAVENÁ VERZIA - Zabezpečené načítanie bodov + zjednodušený dizajn

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useUserStats } from '../contexts/UserStatsContext';

const Container = styled.div`
  position: fixed;
  top: 20%;
  right: 0;
  transform: translateY(-10%);
  background: ${props => props.theme.CARD_BACKGROUND};
  padding: 8px 4px;
  border-radius: 8px 0 0 8px;
  box-shadow: -2px 2px 8px rgba(0,0,0,0.3);
  text-align: center;
  font-weight: bold;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  user-select: none;
  z-index: 1000;
  cursor: default;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 6px 3px;
  }
`;

const LevelText = styled.div`
  font-size: 14px;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  margin-bottom: 8px;
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-weight: bold;
  letter-spacing: 0.05em;
  line-height: 1.3;
  user-select: none;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const ProgressBar = styled.div`
  width: 18px;
  height: 120px;
  background: #333;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
  
  @media (max-width: 768px) {
    width: 16px;
    height: 100px;
  }
`;

const ProgressFill = styled.div`
  width: 100%;
  background: linear-gradient(180deg, #33ff00, #ca0000);
  height: ${props => props.$progress}%;
  transition: height 0.3s ease;
  position: relative;
  overflow: hidden;
`;

const LevelMarker = styled.div`
  position: absolute;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  bottom: ${props => props.$position}%;
  
  &::after {
    content: '';
    position: absolute;
    right: -4px;
    top: -1px;
    width: 6px;
    height: 3px;
    background: rgba(255, 255, 255, 0.5);
  }
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: ${props => props.theme.BORDER_COLOR};
  margin: 6px 0;
  opacity: 0.5;
`;

const PointsText = styled.div`
  font-size: 11px;
  color: ${props => props.$highlight ? props.theme.ACCENT_COLOR : props.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 4px;
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-weight: ${props => props.$highlight ? 'bold' : 'normal'};
  letter-spacing: 0.05em;
  line-height: 1.3;
  user-select: none;
  
  ${props => props.$bonus && `
    padding: 4px 2px;
    background: ${props.theme.ACCENT_COLOR_2}22;
    border-radius: 4px;
  `}
  
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const LevelDisplay = () => {
  const { userStats, refreshUserStats } = useUserStats();
  const [mounted, setMounted] = useState(false);
  
  // ✅ OPRAVA - Pri prvom načítaní refreshni stats
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      refreshUserStats();
    }
  }, [mounted, refreshUserStats]);
  
  // ✅ OPRAVA - Zabezpeč default hodnoty
  const missionPoints = userStats?.missionPoints ?? 0;
  const bonusPoints = userStats?.bonusPoints ?? 0;
  const totalPoints = userStats?.totalPoints ?? 0;
  const level = userStats?.level ?? 1;
  
  // Progress len z mission points (max 100)
  const maxMissionPoints = 100;
  const progress = Math.min((missionPoints / maxMissionPoints) * 100, 100);

  return (
    <Container>
      <LevelText>Level {level}</LevelText>
      
      <ProgressBar>
        <LevelMarker $position={25} />
        <LevelMarker $position={50} />
        <LevelMarker $position={75} />
        <ProgressFill $progress={progress} />
      </ProgressBar>
      
      <PointsText $highlight>
        M:{missionPoints}
      </PointsText>
      
      {bonusPoints > 0 && (
        <>
          <Separator />
          <PointsText $bonus $highlight>
            🎁+{bonusPoints}
          </PointsText>
        </>
      )}
      
      <Separator />
      
      <PointsText>
        ∑:{totalPoints}
      </PointsText>
    </Container>
  );
};

export default LevelDisplay;
