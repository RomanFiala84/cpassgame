// src/components/missions/mission2/Intervention2.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import { useUserStats } from '../../../contexts/UserStatsContext';

const Container = styled.div`
  padding: 20px;
  max-width: 700px;
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
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
`;

const Description = styled.p`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 30px;
  text-align: center;
  font-size: 14px;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TaskCard = styled.div`
  padding: 20px;
  border-radius: 8px;
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.completed ? p.theme.ACCENT_COLOR_3 : p.theme.BORDER_COLOR};
  transition: all 0.3s ease;
`;

const TaskTitle = styled.h3`
  margin-bottom: 10px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 16px;
  font-weight: 600;
`;

const TaskQuestion = styled.p`
  margin-bottom: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  background: ${p => p.theme.INPUT_BACKGROUND};
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${p => p.theme.ACCENT_COLOR};
  }
  
  &::placeholder {
    color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding: 12px;
  background: ${p => p.checked ? 'rgba(0, 211, 129, 0.1)' : 'transparent'};
  border-radius: 8px;
  transition: background 0.2s ease;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  cursor: pointer;
  accent-color: ${p => p.theme.ACCENT_COLOR_3};
`;

const CheckboxLabel = styled.label`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 14px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const tasks = [
  { id: 't1', title: 'Analýza zdrojov', question: 'Ako overíte dôveryhodnosť zdroja?' },
  { id: 't2', title: 'Rozpoznanie manipulácie', question: 'Aké techniky manipulácie poznáte?' }
];

const Intervention2 = () => {
  const { dataManager, userId, addPoints } = useUserStats();
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const progress = await dataManager.loadUserProgress(userId);
      const saved = (progress && progress['intervention2_data']) || { taskAnswers: {}, completedTasks: {} };
      setAnswers(saved.taskAnswers || {});
      setCompleted(saved.completedTasks || {});
    })();
  }, [dataManager, userId]);

  const handleChange = (id, val) => {
    setAnswers(a => ({ ...a, [id]: val }));
  };

  const handleComplete = (id, checked) => {
    setCompleted(c => ({ ...c, [id]: checked }));
    
    (async () => {
      const progress = await dataManager.loadUserProgress(userId);
      const cur = progress['intervention2_data'] || { taskAnswers: {}, completedTasks: {} };
      cur.taskAnswers = { ...(cur.taskAnswers || {}), [id]: answers[id] || '' };
      cur.completedTasks = { ...(cur.completedTasks || {}), [id]: checked };
      cur.timestamp = new Date().toISOString();
      progress['intervention2_data'] = cur;
      await dataManager.saveProgress(userId, progress);
    })();
  };

  const handleContinue = async () => {
    if (!tasks.every(t => completed[t.id])) {
      alert('Prosím dokončite všetky úlohy pred pokračovaním.');
      return;
    }
    
    await addPoints(15, 'intervention2');
    navigate('/mission2/postsb');
  };

  return (
    <Layout>
      <Container>
        <Card>
          <Title>Intervenčný tréning - Misia 2</Title>
          <Description>
            Vyplňte nasledujúce úlohy zamerané na rozvoj kritického myslenia.
          </Description>
        </Card>
        
        <TaskList>
          {tasks.map(t => (
            <TaskCard key={t.id} completed={completed[t.id]}>
              <TaskTitle>{t.title}</TaskTitle>
              <TaskQuestion>{t.question}</TaskQuestion>
              <TextArea
                value={answers[t.id] || ''}
                onChange={e => handleChange(t.id, e.target.value)}
                placeholder="Napíšte vašu odpoveď..."
              />
              <CheckboxContainer checked={completed[t.id]}>
                <Checkbox
                  type="checkbox"
                  id={`checkbox-${t.id}`}
                  checked={completed[t.id] || false}
                  onChange={e => handleComplete(t.id, e.target.checked)}
                />
                <CheckboxLabel htmlFor={`checkbox-${t.id}`}>
                  Úloha dokončená
                </CheckboxLabel>
              </CheckboxContainer>
            </TaskCard>
          ))}
        </TaskList>
        
        <ButtonContainer>
          <StyledButton accent onClick={handleContinue}>
            Pokračovať
          </StyledButton>
        </ButtonContainer>
      </Container>
    </Layout>
  );
};

export default Intervention2;
