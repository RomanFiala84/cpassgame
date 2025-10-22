// src/components/missions/mission2/Questionnaire2A.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import { useUserStats } from '../../../contexts/UserStatsContext';

// Použiť rovnaké styled komponenty ako v Questionnaire1A
const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  padding: 24px;
`;

const Title = styled.h2`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  text-align: center;
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
`;

const QuestionCard = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const Question = styled.p`
  margin-bottom: 12px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 14px;
  font-weight: 500;
`;

const ScaleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

const RadioLabel = styled.label`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => p.checked ? p.theme.ACCENT_COLOR : 'transparent'};
  color: ${p => p.checked ? '#FFFFFF' : p.theme.PRIMARY_TEXT_COLOR};
  font-size: 14px;
  font-weight: 600;
  
  &:hover {
    background: ${p => p.checked ? p.theme.ACCENT_COLOR : p.theme.HOVER_OVERLAY};
  }
  
  input {
    display: none;
  }
`;

const ScaleLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
`;

const ErrorText = styled.div`
  color: ${p => p.theme.ACCENT_COLOR_2};
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const statements = [
  'Dôverujem médiám, ktoré pravidelne používam.',
  'Som skeptický voči neovereným informáciám.',
  'Overujem si fakty pred zdieľaním.'
];

const Questionnaire2A = () => {
  const navigate = useNavigate();
  const { dataManager, userId, addPoints } = useUserStats();
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const progress = await dataManager.loadUserProgress(userId);
      // OPRAVA: Špecifický kľúč pre 2A
      const saved = (progress && progress['questionnaire2a_data']) || {};
      setAnswers(saved.answers || {});
    })();
  }, [dataManager, userId]);

  const handleChange = (idx, val) => {
    setAnswers(a => ({ ...a, [idx]: val }));
    setError('');
  };

  const handleContinue = async () => {
    if (statements.some((_, i) => !answers[i])) {
      setError('Prosím označte odpoveď na všetky výroky.');
      return;
    }
    
    // OPRAVA: Oddelený kľúč
    const progress = await dataManager.loadUserProgress(userId);
    progress['questionnaire2a_data'] = { answers, timestamp: new Date().toISOString() };
    await dataManager.saveProgress(userId, progress);
    
    await addPoints(10, 'questionnaire2a');
    const group = (await dataManager.loadUserProgress(userId)).group_assignment;
    if (group === '2') return navigate('/mission2/prevention');
    navigate('/mission2/postsa');
  };

  return (
    <Layout>
      <Container>
        <Card>
          <Title>Dotazník 2A – Miera dôvery</Title>
          
          {statements.map((statement, i) => (
            <QuestionCard key={i}>
              <Question>{statement}</Question>
              <ScaleContainer>
                {[1, 2, 3, 4, 5].map(v => (
                  <RadioLabel key={v} checked={answers[i] === v}>
                    <input
                      type="radio"
                      name={`q${i}`}
                      checked={answers[i] === v}
                      onChange={() => handleChange(i, v)}
                    />
                    {v}
                  </RadioLabel>
                ))}
              </ScaleContainer>
              <ScaleLabels>
                <span>Nesúhlasím</span>
                <span>Súhlasím</span>
              </ScaleLabels>
            </QuestionCard>
          ))}
          
          {error && <ErrorText>{error}</ErrorText>}
          
          <ButtonContainer>
            <StyledButton accent onClick={handleContinue}>
              Pokračovať
            </StyledButton>
          </ButtonContainer>
        </Card>
      </Container>
    </Layout>
  );
};

export default Questionnaire2A;
