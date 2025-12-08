// src/components/StroopTest1.js
// ═══════════════════════════════════════════════════════════════════════
// STROOP TEST MISSION 1 - S DETEKTÍVOM KONÁROM
// Detektív instruuje respondenta že musí vyluštiť tajnú šifru
// ═══════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useUserStats } from '../../../contexts/UserStatsContext';
import DetectiveTipLarge from '../../shared/DetectiveTipLarge';
import PageTransition from '../../shared/PageTransition';

// ═══════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${p => p.theme.ACCENT_COLOR}22, ${p => p.theme.ACCENT_COLOR_2}22);
  padding: 20px;
`;

const Wrapper = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 16px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);

  @media (max-width: 768px) {
    padding: 30px 20px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;

  @media (max-width: 480px) {
    margin-bottom: 30px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  margin: 0 0 12px 0;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin: 0 0 8px 0;
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Instructions = styled.p`
  font-size: 14px;
  color: ${p => p.theme.ACCENT_COLOR};
  margin: 0;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;

  @media (max-width: 480px) {
    margin-bottom: 30px;
  }
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: ${p => p.theme.BORDER_COLOR};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => (p.current / p.total) * 100}%;
  background: linear-gradient(to right, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${p => p.theme.ACCENT_COLOR};
  min-width: 50px;
  text-align: right;
`;

const GameArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 480px) {
    gap: 30px;
    margin-bottom: 30px;
  }
`;

const Question = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-align: center;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const StroopWord = styled.div`
  font-size: 72px;
  font-weight: 700;
  color: ${p => p.displayColor};
  text-align: center;
  font-family: Arial, sans-serif;
  letter-spacing: 4px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    font-size: 56px;
  }

  @media (max-width: 480px) {
    font-size: 48px;
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const OptionButton = styled.button`
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid ${p => p.theme.BORDER_COLOR};
  background: ${p => p.isSelected ? p.theme.ACCENT_COLOR : 'transparent'};
  color: ${p => p.isSelected ? 'white' : p.theme.PRIMARY_TEXT_COLOR};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${p => p.theme.ACCENT_COLOR}22;
    border-color: ${p => p.theme.ACCENT_COLOR};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 14px;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 20px;
  background: ${p => p.theme.SECONDARY_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR}44;
  border-radius: 8px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${p => p.$highlight ? p.theme.ACCENT_COLOR : p.theme.PRIMARY_TEXT_COLOR};
`;

const CompletionMessage = styled.div`
  text-align: center;
  padding: 40px 20px;

  @media (max-width: 480px) {
    padding: 30px 16px;
  }
`;

const CompletionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
  margin: 0 0 16px 0;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const CompletionText = styled.p`
  font-size: 16px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin: 0 0 24px 0;
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ContinueButton = styled.button`
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${p => p.theme.ACCENT_COLOR}66;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 10px 24px;
    font-size: 14px;
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT - MISSION 1
// ═══════════════════════════════════════════════════════════════════════

const StroopTest2 = () => {
  const navigate = useNavigate();
  const { dataManager, userId } = useUserStats();
  const [showDetectiveTip, setShowDetectiveTip] = useState(true);

  const colors = {
    RED: 'rgb(255, 84, 89)',
    GREEN: 'rgb(50, 184, 198)',
    BLUE: 'rgb(59, 130, 246)',
    YELLOW: 'rgb(245, 158, 11)'
  };

  const colorNames = ['RED', 'GREEN', 'BLUE', 'YELLOW'];

  const generateTrials = () => {
    const trials = [];
    for (let i = 0; i < 9; i++) {
      const wordColor = colorNames[Math.floor(Math.random() * colorNames.length)];
      let displayColor = colorNames[Math.floor(Math.random() * colorNames.length)];

      if (Math.random() > 0.5) {
        displayColor = wordColor;
      }

      trials.push({
        id: i,
        word: wordColor,
        displayColor: colors[displayColor],
        correctAnswer: displayColor,
        response: null,
        reactionTime: null,
        isCorrect: null,
        timestamp: null
      });
    }
    return trials;
  };

  const [trials, setTrials] = useState(generateTrials());
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const currentTrial = trials[currentTrialIndex];

  const correctAnswers = trials.filter(t => t.isCorrect === true).length;
  const accuracy = trials.length > 0 ? Math.round((correctAnswers / trials.length) * 100) : 0;
  const validReactions = trials.filter(t => t.reactionTime !== null);
  const avgReactionTime = validReactions.length > 0 
    ? validReactions.reduce((sum, t) => sum + t.reactionTime, 0) / validReactions.length
    : 0;

  // ✅ Detektívov tip
  const detectiveTip = `
    <p>🕵️ <strong>Pozor!</strong> Máme <em>kritickú úlohu</em>!</p>
    <p>Zistili sme, že v správach sa skrýva <strong>tajná šifra</strong>. Aby sme mohli pokračovať v múzeálnej skúsenosti, musíš ju najskôr <strong>vylúštiť</strong>.</p>
    <p>Tvoja úloha:</p>
    <ul style="text-align: left; display: inline-block;">
      <li><strong>Pozri sa na slovo</strong> - uvidíš anglické slovo</li>
      <li><strong>Ale ignoruj slovo!</strong> - Kluk na FARBU, ktorou je slovo napísané</li>
      <li><strong>Buď rýchly a presný</strong> - Čas má vplyv na bezpečnosť 🔐</li>
    </ul>
    <p style="margin-top: 16px; color: #ff5459;"><strong>⚠️ Toto je detekčný test!</strong> Pokúšame sa zistiť, či si dostatočne pozorný. Podvádzanie alebo neopatrnosť budú detegované! 👁️</p>
  `;

  // ✅ MOVED saveResults here with useCallback
  const saveResults = useCallback(async (completedTrials) => {
    const correctCount = completedTrials.filter(t => t.isCorrect).length;
    const validRTs = completedTrials.filter(t => t.reactionTime !== null);
    const avgRT = validRTs.length > 0 ? validRTs.reduce((sum, t) => sum + t.reactionTime, 0) / validRTs.length : 0;

    const stroopResults = {
      mission: 2,
      testType: 'stroop',
      totalTrials: 9,
      correctAnswers: correctCount,
      accuracy: (correctCount / 9) * 100,
      avgReactionTime: Math.round(avgRT),
      trials: completedTrials,
      completedAt: new Date().toISOString()
    };

    try {
      const participantCode = userId || sessionStorage.getItem('participantCode');
      const progress = await dataManager.loadUserProgress(participantCode);
      const updatedProgress = {
        ...progress,
        stroop_test_mission2_results: stroopResults,
        stroop_test_mission2_completed: true
      };
      await dataManager.saveProgress(participantCode, updatedProgress);
      console.log('✅ Stroop test M2 results saved:', stroopResults);
    } catch (error) {
      console.error('❌ Error saving stroop results:', error);
    }
  }, [userId, dataManager]);

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedAnswer(null);
  }, [currentTrialIndex]);

  // ✅ handleAnswer now has saveResults in dependencies
  const handleAnswer = useCallback((answer) => {
    const endTime = Date.now();
    const reactionTime = endTime - startTime;
    const isCorrect = answer === currentTrial.correctAnswer;

    const updatedTrial = {
      ...currentTrial,
      response: answer,
      reactionTime,
      isCorrect,
      timestamp: new Date().toISOString()
    };

    const updatedTrials = [...trials];
    updatedTrials[currentTrialIndex] = updatedTrial;
    setTrials(updatedTrials);

    if (currentTrialIndex < 8) {
      setTimeout(() => {
        setCurrentTrialIndex(currentTrialIndex + 1);
      }, 500);
    } else {
      setIsCompleted(true);
      saveResults(updatedTrials);
    }

    setSelectedAnswer(answer);
  }, [currentTrial, currentTrialIndex, startTime, trials, saveResults]);

  const handleContinue = async () => {
    try {
      const participantCode = userId || sessionStorage.getItem('participantCode');
      const progress = await dataManager.loadUserProgress(participantCode);
      const group = String(progress.group_assignment);

      if (group === '1') {
        navigate('/mission2/intervention');
      } else {
        navigate('/mission2/postsb');
      }
    } catch (error) {
      console.error('Error navigating:', error);
      navigate('/mission2/postsb');
    }
  };

  if (isCompleted) {
    return (
      <PageTransition>
        <Container>
          <Wrapper>
            <CompletionMessage>
              <CompletionTitle>🎉 Šifra vylúštená!</CompletionTitle>
              <CompletionText>
                Výborná práca! Tvoja presnosť: <strong>{accuracy}%</strong>
                <br />
                Čas reakcie: <strong>{Math.round(avgReactionTime)}ms</strong>
              </CompletionText>

              <Stats>
                <StatItem>
                  <StatLabel>Správne</StatLabel>
                  <StatValue $highlight>{correctAnswers}/9</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Presnosť</StatLabel>
                  <StatValue $highlight>{accuracy}%</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Priem. čas</StatLabel>
                  <StatValue>{Math.round(avgReactionTime)}ms</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Najrýchlejší</StatLabel>
                  <StatValue>{validReactions.length > 0 ? Math.min(...trials.map(t => t.reactionTime || Infinity)) : 0}ms</StatValue>
                </StatItem>
              </Stats>

              <CompletionText style={{ marginTop: '24px' }}>
                Pokračujme v preskúmaní záveru. 🔍
              </CompletionText>

              <ContinueButton onClick={handleContinue}>
                Pokračovať →
              </ContinueButton>
            </CompletionMessage>
          </Wrapper>

          {/* ✅ DETEKTÍVOV TIP - Pri dokončení */}
          {showDetectiveTip && (
            <DetectiveTipLarge
              tip={`
                <p>🕵️ <strong>Výborně!</strong> Šifru si vylúštil správne!</p>
                <p>Tvoj čas reakcie a presnosť ukazujú, že si <strong>veľmi pozorný</strong> skúmaní. Takisto sme zaznamenali tvoje pohyby a klikania - všetko sa kvôli bezpečnosti zaznamenáva. 📊</p>
                <p><strong>Pokračuj ďalej v múzeálnej skúsenosti!</strong> 🎖️</p>
              `}
              detectiveName="🕵️ Detektív Konan"
              imageUrl="/images/detective.png"
              buttonText="Chápem!"
              minReadTime={5000}
              showBadge={false}
              onClose={() => setShowDetectiveTip(false)}
            />
          )}
        </Container>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Container>
        <Wrapper>
          <Header>
            <Title>Tajná Šifra</Title>
            <Subtitle>🔐 Kritická múzeálna úloha</Subtitle>
            <Instructions>
              Klikni na FARBU slova (nie na samotné slovo!)
            </Instructions>
          </Header>

          <ProgressContainer>
            <ProgressBar>
              <ProgressFill current={currentTrialIndex + 1} total={9} />
            </ProgressBar>
            <ProgressText>{currentTrialIndex + 1}/9</ProgressText>
          </ProgressContainer>

          <GameArea>
            <Question>Aká je FARBA?</Question>
            {currentTrial && (
              <StroopWord displayColor={currentTrial.displayColor}>
                {currentTrial.word}
              </StroopWord>
            )}

            <ButtonGroup>
              <OptionButton
                onClick={() => handleAnswer('RED')}
                isSelected={selectedAnswer === 'RED'}
                disabled={selectedAnswer !== null}
                style={{ borderColor: colors.RED }}
              >
                🔴 Červená
              </OptionButton>
              <OptionButton
                onClick={() => handleAnswer('GREEN')}
                isSelected={selectedAnswer === 'GREEN'}
                disabled={selectedAnswer !== null}
                style={{ borderColor: colors.GREEN }}
              >
                🟢 Zelená
              </OptionButton>
              <OptionButton
                onClick={() => handleAnswer('BLUE')}
                isSelected={selectedAnswer === 'BLUE'}
                disabled={selectedAnswer !== null}
                style={{ borderColor: colors.BLUE }}
              >
                🔵 Modrá
              </OptionButton>
              <OptionButton
                onClick={() => handleAnswer('YELLOW')}
                isSelected={selectedAnswer === 'YELLOW'}
                disabled={selectedAnswer !== null}
                style={{ borderColor: colors.YELLOW }}
              >
                🟡 Žltá
              </OptionButton>
            </ButtonGroup>
          </GameArea>

          <Stats>
            <StatItem>
              <StatLabel>Správne: {correctAnswers}/9</StatLabel>
              <StatValue $highlight>{accuracy}%</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Priem. čas</StatLabel>
              <StatValue>{Math.round(avgReactionTime)}ms</StatValue>
            </StatItem>
          </Stats>
        </Wrapper>

        {/* ✅ DETEKTÍVOV TIP - Na začiatku */}
        {showDetectiveTip && (
          <DetectiveTipLarge
            tip={detectiveTip}
            detectiveName="🕵️ Detektív Konan"
            imageUrl="/images/detective.png"
            buttonText="Rozumiem, vyluštiť šifru!"
            autoOpen={true}
            autoOpenDelay={300}
            minReadTime={10000}
            showBadge={true}
            onClose={() => setShowDetectiveTip(false)}
          />
        )}
      </Container>
    </PageTransition>
  );
};

export default StroopTest2;
