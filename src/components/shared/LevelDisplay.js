import React from 'react';
import styled from 'styled-components';
import { useUserStats } from '../../contexts/UserStatsContext';

const Wrapper = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  width: auto;
  z-index: 1200;
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: fit-content;
  max-width: fit-content;

  /* DESKTOP - Layout vertikálny (ako pôvodne) */
  @media (max-width: 1024px) {
    padding: 10px;
    gap: 7px;
  }

  /* TABLET - Kompaktnejší layout, presunúť VPRAVO */
  @media (max-width: 768px) {
    position: fixed;
    top: 12px;
    right: 12px;
    left: auto;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto auto auto;
    gap: 8px;
    padding: 10px;
    max-width: calc(100vw - 24px);
  }

  /* MOBILE (portrait) - Vertikálny kompaktný layout */
  @media (max-width: 480px) {
    position: fixed;
    top: 10px;
    right: 10px;
    left: auto;
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 8px;
    max-width: 130px;
  }

  /* MOBILE (landscape) - Horizontal layout */
  @media (max-height: 550px) and (orientation: landscape) {
    top: 8px;
    right: 8px;
    left: auto;
    padding: 8px;
    gap: 6px;
    display: grid;
    grid-template-columns: auto auto auto auto auto;
    grid-template-rows: auto;
    max-width: calc(100vw - 16px);
  }
`;

const LevelSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${p => p.theme.BORDER_COLOR};

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 1 / 3;
    border-bottom: none;
    border-right: 1px solid ${p => p.theme.BORDER_COLOR};
    padding-right: 12px;
    padding-bottom: 0;
    gap: 4px;
  }

  @media (max-width: 480px) {
    flex-direction: row;
    gap: 8px;
    padding-bottom: 0;
    border-bottom: none;
    border-right: none;
  }

  @media (max-height: 550px) and (orientation: landscape) {
    flex-direction: row;
    gap: 6px;
    border-right: 1px solid ${p => p.theme.BORDER_COLOR};
    border-bottom: none;
    padding-right: 8px;
    padding-bottom: 0;
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
  box-shadow: 0 3px 8px ${p => p.theme.ACCENT_COLOR}44;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
    font-size: 24px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 22px;
  }

  @media (max-height: 550px) and (orientation: landscape) {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
`;

const LevelInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  @media (max-width: 480px) {
    gap: 1px;
  }
`;

const LevelLabel = styled.div`
  font-size: 9px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 8px;
  }

  @media (max-width: 480px) {
    font-size: 7px;
    display: none;
  }

  @media (max-height: 550px) and (orientation: landscape) {
    font-size: 7px;
    display: none;
  }
`;

const LevelValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }

  @media (max-height: 550px) and (orientation: landscape) {
    font-size: 10px;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  @media (max-width: 768px) {
    grid-column: 2;
    grid-row: 1 / 3;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0;
  }

  @media (max-height: 550px) and (orientation: landscape) {
    flex-direction: row;
    gap: 1px;
    grid-column: 2 / 6;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 3px;
  padding: 6px 8px;
  border-bottom: 1px solid ${p => p.theme.BORDER_COLOR}22;

  &:last-of-type {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 4px 6px;
    gap: 2px;
    border-bottom: 1px solid ${p => p.theme.BORDER_COLOR}22;

    &:last-of-type {
      border-bottom: none;
    }
  }

  @media (max-width: 480px) {
    padding: 5px 4px;
    gap: 2px;
    border-bottom: 1px solid ${p => p.theme.BORDER_COLOR}22;
    flex-direction: column;

    &:last-of-type {
      border-bottom: none;
    }
  }

  @media (max-height: 550px) and (orientation: landscape) {
    flex-direction: column;
    padding: 4px 6px;
    gap: 2px;
    border-bottom: none;
    border-right: 1px solid ${p => p.theme.BORDER_COLOR}22;
    min-width: 50px;

    &:last-of-type {
      border-right: none;
    }
  }
`;

const StatLabel = styled.div`
  font-size: 9px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 8px;
  }

  @media (max-width: 480px) {
    font-size: 7px;
  }

  @media (max-height: 550px) and (orientation: landscape) {
    font-size: 7px;
  }
`;

const StatValue = styled.div`
  font-size: ${p => p.$large ? '16px' : '13px'};
  font-weight: 700;
  color: ${p => p.$highlight ? p.theme.ACCENT_COLOR : p.theme.PRIMARY_TEXT_COLOR};
  line-height: 1;

  @media (max-width: 768px) {
    font-size: ${p => p.$large ? '14px' : '11px'};
  }

  @media (max-width: 480px) {
    font-size: ${p => p.$large ? '12px' : '10px'};
  }

  @media (max-height: 550px) and (orientation: landscape) {
    font-size: ${p => p.$large ? '12px' : '10px'};
  }
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
  padding-top: 4px;
  border-top: 1px solid ${p => p.theme.BORDER_COLOR}22;

  @media (max-width: 768px) {
    grid-column: 1 / 3;
    gap: 4px;
    padding-top: 4px;
  }

  @media (max-width: 480px) {
    gap: 3px;
    padding-top: 6px;
  }

  @media (max-height: 550px) and (orientation: landscape) {
    display: none;
  }
`;

const ProgressBarVerticalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100px;
  gap: 3px;

  @media (max-width: 768px) {
    height: 80px;
    gap: 2px;
  }

  @media (max-width: 480px) {
    height: 60px;
    gap: 2px;
  }
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

  @media (max-width: 768px) {
    height: 80px;
    width: 7px;
  }

  @media (max-width: 480px) {
    height: 60px;
    width: 6px;
  }
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

const ProgressLabel = styled.div`
  font-size: 8px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  line-height: 1.2;
  word-break: break-all;
  width: 8px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 7px;
    width: 7px;
  }

  @media (max-width: 480px) {
    font-size: 6px;
    width: 6px;
    line-height: 1;
  }
`;

const ProgressValue = styled.div`
  font-size: 9px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
  line-height: 1;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 8px;
  }

  @media (max-width: 480px) {
    font-size: 7px;
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

      {/* Stats Container */}
      <StatsContainer>
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
      </StatsContainer>

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
