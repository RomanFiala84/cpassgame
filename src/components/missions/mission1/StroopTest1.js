// src/components/missions/mission1/StroopTest1.js
// ═══════════════════════════════════════════════════════════════════════
// STROOP TEST MISSION 1 - S DETEKTÍVOM KONÁROM
// FINÁLNA VERZIA - 48 POLOŽIEK (NÁHODNE PREMIEŠANÉ)
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
  gap: 24px;
  width: 100%;
  justify-items: center;

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 4px solid ${p => p.isSelected ? p.theme.ACCENT_COLOR : 'transparent'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  background: ${p => p.buttonColor};
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &::after {
    content: ${p => p.isSelected ? '"✓"' : '""'};
    position: absolute;
    font-size: 48px;
    font-weight: bold;
    color: white;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
    animation: ${p => p.isSelected ? 'scaleIn 0.3s ease' : 'none'};
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.5);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
    border-width: 3px;

    &::after {
      font-size: 40px;
    }
  }

  @media (max-width: 480px) {
    width: 75px;
    height: 75px;
    border-width: 2px;

    &::after {
      font-size: 32px;
    }
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
// HELPER FUNCTION - SHUFFLE ARRAY
// ═══════════════════════════════════════════════════════════════════════

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT - MISSION 1
// ═══════════════════════════════════════════════════════════════════════

const StroopTest1 = () => {
  const navigate = useNavigate();
  const { dataManager, userId } = useUserStats();
  const [showDetectiveTip, setShowDetectiveTip] = useState(true);

  const colors = {
    RED: { rgb: 'rgba(255, 0, 0, 1)', label: 'Červená' },
    GREEN: { rgb: 'rgba(9, 255, 0, 1)', label: 'Zelená' },
    BLUE: { rgb: 'rgb(1, 0, 255)', label: 'Modrá' },
    YELLOW: { rgb: 'rgba(255, 255, 0, 1)', label: 'Žltá' }
  };

  // ✅ FIXED TRIALS - 48 položiek (24 congruent + 24 incongruent)
  const FIXED_TRIALS_UNSORTED = [
    // ═════════════════════════════════════════════════════
    // CONGRUENT TRIALS (24 položiek)
    // ═════════════════════════════════════════════════════
    { word: 'RED', displayColor: 'RED', congruent: true },
    { word: 'GREEN', displayColor: 'GREEN', congruent: true },
    { word: 'BLUE', displayColor: 'BLUE', congruent: true },
    { word: 'YELLOW', displayColor: 'YELLOW', congruent: true },
    { word: 'RED', displayColor: 'RED', congruent: true },
    { word: 'GREEN', displayColor: 'GREEN', congruent: true },
    { word: 'BLUE', displayColor: 'BLUE', congruent: true },
    { word: 'YELLOW', displayColor: 'YELLOW', congruent: true },
    { word: 'RED', displayColor: 'RED', congruent: true },
    { word: 'GREEN', displayColor: 'GREEN', congruent: true },
    { word: 'BLUE', displayColor: 'BLUE', congruent: true },
    { word: 'YELLOW', displayColor: 'YELLOW', congruent: true },
    { word: 'RED', displayColor: 'RED', congruent: true },
    { word: 'GREEN', displayColor: 'GREEN', congruent: true },
    { word: 'BLUE', displayColor: 'BLUE', congruent: true },
    { word: 'YELLOW', displayColor: 'YELLOW', congruent: true },
    { word: 'RED', displayColor: 'RED', congruent: true },
    { word: 'GREEN', displayColor: 'GREEN', congruent: true },
    { word: 'BLUE', displayColor: 'BLUE', congruent: true },
    { word: 'YELLOW', displayColor: 'YELLOW', congruent: true },
    { word: 'RED', displayColor: 'RED', congruent: true },
    { word: 'GREEN', displayColor: 'GREEN', congruent: true },
    { word: 'BLUE', displayColor: 'BLUE', congruent: true },
    { word: 'YELLOW', displayColor: 'YELLOW', congruent: true },

    // ═════════════════════════════════════════════════════
    // INCONGRUENT TRIALS (24 položiek)
    // ═════════════════════════════════════════════════════
    { word: 'RED', displayColor: 'GREEN', congruent: false },
    { word: 'RED', displayColor: 'BLUE', congruent: false },
    { word: 'RED', displayColor: 'YELLOW', congruent: false },
    { word: 'GREEN', displayColor: 'RED', congruent: false },
    { word: 'GREEN', displayColor: 'BLUE', congruent: false },
    { word: 'GREEN', displayColor: 'YELLOW', congruent: false },
    { word: 'BLUE', displayColor: 'RED', congruent: false },
    { word: 'BLUE', displayColor: 'GREEN', congruent: false },
    { word: 'BLUE', displayColor: 'YELLOW', congruent: false },
    { word: 'YELLOW', displayColor: 'RED', congruent: false },
    { word: 'YELLOW', displayColor: 'GREEN', congruent: false },
    { word: 'YELLOW', displayColor: 'BLUE', congruent: false },
    { word: 'RED', displayColor: 'GREEN', congruent: false },
    { word: 'RED', displayColor: 'BLUE', congruent: false },
    { word: 'GREEN', displayColor: 'RED', congruent: false },
    { word: 'GREEN', displayColor: 'YELLOW', congruent: false },
    { word: 'BLUE', displayColor: 'RED', congruent: false },
    { word: 'BLUE', displayColor: 'GREEN', congruent: false },
    { word: 'YELLOW', displayColor: 'RED', congruent: false },
    { word: 'YELLOW', displayColor: 'BLUE', congruent: false },
    { word: 'RED', displayColor: 'YELLOW', congruent: false },
    { word: 'GREEN', displayColor: 'BLUE', congruent: false },
    { word: 'BLUE', displayColor: 'YELLOW', congruent: false },
    { word: 'YELLOW', displayColor: 'GREEN', congruent: false }
  ];

  // ✅ SHUFFLE - Premiešaj poradie aby neboli farby za sebou
  const FIXED_TRIALS = shuffleArray(FIXED_TRIALS_UNSORTED);

  // ✅ Konvertuj na trials objekty
  const initializeTrials = () => {
    return FIXED_TRIALS.map((trial, i) => ({
      id: i,
      word: trial.word,
      displayColor: colors[trial.displayColor].rgb,
      correctAnswer: trial.displayColor,
      response: null,
      reactionTime: null,
      isCorrect: null,
      timestamp: null,
      congruent: trial.congruent
    }));
  };

  const [trials, setTrials] = useState(() => initializeTrials());
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

  // Congruent vs Incongruent stats
  const congruentTrials = trials.filter(t => t.congruent === true);
  const incongruentTrials = trials.filter(t => t.congruent === false);
  const congruentAccuracy = congruentTrials.length > 0 
    ? Math.round((congruentTrials.filter(t => t.isCorrect).length / congruentTrials.length) * 100)
    : 0;
  const incongruentAccuracy = incongruentTrials.length > 0 
    ? Math.round((incongruentTrials.filter(t => t.isCorrect).length / incongruentTrials.length) * 100)
    : 0;

  // ✅ Detektívov tip
  const detectiveTip = `
    <p>🕵️ <strong>Pozor!</strong> Máme <em>kritickú úlohu</em>!</p>
    <p>Zistili sme, že v správach sa skrýva <strong>tajná šifra</strong>. Aby sme mohli pokračovať v múzeálnej skúsenosti, musíš ju najskôr <strong>vylúštiť</strong>.</p>
    <p>Tvoja úloha:</p>
    <ul style="text-align: left; display: inline-block;">
      <li><strong>Pozri sa na slovo</strong> - uvidíš anglické slovo</li>
      <li><strong>Ale ignoruj slovo!</strong> - Klikni na FARBU, ktorou je slovo napísané</li>
      <li><strong>Buď rýchly a presný</strong> - Čas má vplyv na bezpečnosť 🔐</li>
    </ul>
    <p style="margin-top: 16px; color: #ff5459;"><strong>⚠️ Toto je detekčný test!</strong> Pokúšame sa zistiť, či si dostatočne pozorný. Podvádzanie alebo neopatrnosť budú detegované! 👁️</p>
  `;

  // ✅ saveResults
  const saveResults = useCallback(async (completedTrials) => {
    const correctCount = completedTrials.filter(t => t.isCorrect).length;
    const validRTs = completedTrials.filter(t => t.reactionTime !== null);
    const avgRT = validRTs.length > 0 ? validRTs.reduce((sum, t) => sum + t.reactionTime, 0) / validRTs.length : 0;

    // Separate congruent and incongruent analysis
    const congTrials = completedTrials.filter(t => t.congruent === true);
    const incongTrials = completedTrials.filter(t => t.congruent === false);
    const congAccuracy = congTrials.length > 0 
      ? (congTrials.filter(t => t.isCorrect).length / congTrials.length) * 100
      : 0;
    const incongAccuracy = incongTrials.length > 0
      ? (incongTrials.filter(t => t.isCorrect).length / incongTrials.length) * 100
      : 0;

    const stroopResults = {
      mission: 1,
      testType: 'stroop',
      totalTrials: 48,
      correctAnswers: correctCount,
      accuracy: (correctCount / 48) * 100,
      avgReactionTime: Math.round(avgRT),
      congruentAccuracy: Math.round(congAccuracy),
      incongruentAccuracy: Math.round(incongAccuracy),
      stroopEffect: Math.round(incongAccuracy) - Math.round(congAccuracy),
      trials: completedTrials,
      completedAt: new Date().toISOString()
    };

    try {
      const participantCode = userId || sessionStorage.getItem('participantCode');
      const progress = await dataManager.loadUserProgress(participantCode);
      const updatedProgress = {
        ...progress,
        stroop_test_mission1_results: stroopResults,
        stroop_test_mission1_completed: true
      };
      await dataManager.saveProgress(participantCode, updatedProgress);
      console.log('✅ Stroop test M1 results saved:', stroopResults);
    } catch (error) {
      console.error('❌ Error saving stroop results:', error);
    }
  }, [userId, dataManager]);

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedAnswer(null);
  }, [currentTrialIndex]);

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

    if (currentTrialIndex < 47) {
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
        navigate('/mission1/intervention');
      } else {
        navigate('/mission1/postsb');
      }
    } catch (error) {
      console.error('Error navigating:', error);
      navigate('/mission1/postsb');
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
                  <StatValue $highlight>{correctAnswers}/48</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Presnosť</StatLabel>
                  <StatValue $highlight>{accuracy}%</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Zhodné</StatLabel>
                  <StatValue>{congruentAccuracy}%</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Nezhodné</StatLabel>
                  <StatValue $highlight>{incongruentAccuracy}%</StatValue>
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

          {showDetectiveTip && (
            <DetectiveTipLarge
              tip={`
                <p>🕵️ <strong>Výborně!</strong> Šifru si vylúštil správne!</p>
                <p>Tvoj čas reakcie a presnosť ukazujú, že si <strong>veľmi pozorný</strong> v skúmaní. Takisto sme zaznamenali tvoje pohyby a klikania - všetko sa kvôli bezpečnosti zaznamenáva. 📊</p>
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
              <ProgressFill current={currentTrialIndex + 1} total={48} />
            </ProgressBar>
            <ProgressText>{currentTrialIndex + 1}/48</ProgressText>
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
                buttonColor={colors.RED.rgb}
                title={colors.RED.label}
              />
              <OptionButton
                onClick={() => handleAnswer('GREEN')}
                isSelected={selectedAnswer === 'GREEN'}
                disabled={selectedAnswer !== null}
                buttonColor={colors.GREEN.rgb}
                title={colors.GREEN.label}
              />
              <OptionButton
                onClick={() => handleAnswer('BLUE')}
                isSelected={selectedAnswer === 'BLUE'}
                disabled={selectedAnswer !== null}
                buttonColor={colors.BLUE.rgb}
                title={colors.BLUE.label}
              />
              <OptionButton
                onClick={() => handleAnswer('YELLOW')}
                isSelected={selectedAnswer === 'YELLOW'}
                disabled={selectedAnswer !== null}
                buttonColor={colors.YELLOW.rgb}
                title={colors.YELLOW.label}
              />
            </ButtonGroup>
          </GameArea>

          <Stats>
            <StatItem>
              <StatLabel>Správne: {correctAnswers}/48</StatLabel>
              <StatValue $highlight>{accuracy}%</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Priem. čas</StatLabel>
              <StatValue>{Math.round(avgReactionTime)}ms</StatValue>
            </StatItem>
          </Stats>
        </Wrapper>

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

export default StroopTest1;
