// src/components/LevelDisplay.jsx

import React from 'react';
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
`;

const LevelText = styled.div`
  font-size: 14px;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  margin-bottom: 8px;
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-weight: normal;
  letter-spacing: 0.05em;
  line-height: 1.3;
  user-select: none;
`;

const PointsText = styled.div`
  font-size: 12px;
  color: ${props => props.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 8px;
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-weight: normal;
  letter-spacing: 0.05em;
  line-height: 1.3;
  user-select: none;
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
`;

const ProgressFill = styled.div`
  width: 100%;
  background: linear-gradient(180deg, #33ff00, #ca0000);
  height: ${props => props.$progress}%;
  transition: height 0.3s ease;
  position: relative;
  overflow: hidden;
`;

const LevelDisplay = () => {
  const { userStats } = useUserStats();
  const progress = (userStats.points / 100) * 100;

  return (
    <Container>
      <LevelText>Level {userStats.level}</LevelText>
      <ProgressBar>
        <ProgressFill $progress={progress} />
      </ProgressBar>
      <PointsText>{userStats.points} bodov</PointsText>
    </Container>
  );
};

export default LevelDisplay;
