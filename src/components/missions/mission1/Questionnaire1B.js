// src/components/missions/mission1/Questionnaire1B.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import { useUserStats } from '../../../contexts/UserStatsContext';

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
  margin-bottom: 20px;
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

const Statement = styled.p`
  margin-bottom: 12px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 14px;
  font-weight: 500;
`;

const ScaleContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const RadioLabel = styled.label`
  flex: 1;
  max-width: 120px;
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
  text-align: center;
  
  &:hover {
    background: ${p => p.checked ? p.theme.ACCENT_COLOR : p.theme.HOVER_OVERLAY};
  }
  
  input {
    display: none;
  }
`;

const ErrorText = styled.div`
  color: ${p => p.theme.ACCENT_COLOR_2};
  margin-bottom: 16px;
  text-align: center;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const actions = ['Mám plnú dôveru', 'Nie som si istý', 'Nemôžem dôverovať'];

const Questionnaire1B = () => {
  const navigate = useNavigate();
  const { dataManager, userId, addPoints } = useUserStats();
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const progress = await dataManager.loadUserProgress(userId);
      // OPRAVA: Použiť špecifický kľúč pre 1B
      const saved = (progress && progress['questionnaire1b_data']) || {};
      setAnswers(saved.answers || {});
    })();
  }, [dataManager, userId]);

  const handleChange = (idx, val) => {
    setAnswers(a => ({ ...a, [idx]: val }));
    setError('');
  };

  const handleContinue = async () => {
    if (actions.some((_, i) => !answers[i])) {
      setError('Prosím označte všetky odpovede.');
      return;
    }
    
    // OPRAVA: Ukladať do oddelených kľúčov
    const progress = await dataManager.loadUserProgress(userId);
    progress['questionnaire1b_data'] = { answers, timestamp: new Date().toISOString() };
    await dataManager.saveProgress(userId, progress);
    
    await addPoints(10, 'questionnaire1b');
    navigate('/mission1/outro');
  };

  return (
    <Layout>
      <Container>
        <Card>
          <Title>Dotazník 1B – Finálna dôvera</Title>
          
          {actions.map((action, i) => (
            <QuestionCard key={i}>
              <Statement>{action}</Statement>
              <ScaleContainer>
                {[1, 2, 3].map(v => (
                  <RadioLabel key={v} checked={answers[i] === v}>
                    <input
                      type="radio"
                      checked={answers[i] === v}
                      onChange={() => handleChange(i, v)}
                    />
                    {v}
                  </RadioLabel>
                ))}
              </ScaleContainer>
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

export default Questionnaire1B;
