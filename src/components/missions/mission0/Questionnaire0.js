// src/components/missions/mission0/Questionnaire0.js

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
const Title = styled.h2`
  color: ${p => p.theme.ACCENT_COLOR};
  text-align: center;
  margin-bottom: 15px;
`;
const Question = styled.p`
  margin: 10px 0;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
`;
const ErrorText = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const questions = [
  { id: 1, text: 'Vek:' },
  { id: 2, text: 'Povolanie:' },
  { id: 3, text: 'Máte záujem o konšpiračné teórie?' }
];

export default function Questionnaire0() {
  const navigate = useNavigate();
  const { dataManager, userId, addPoints } = useUserStats();
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  // start timer for component
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // load existing answers
    (async () => {
      const progress = await dataManager.loadUserProgress(userId);
      const saved = (progress && progress.questionnaire0_data) || {};
      if (saved.answers) setAnswers(saved.answers);
    })();

    // on unmount, save duration
    return () => {
      const duration = Date.now() - startTime;
      dataManager.saveComponentData(userId, 'questionnaire0', { duration });
    };
  }, [dataManager, userId, startTime]);

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setError('');
  };

  const handleNext = async () => {
    if (questions.some(q => !answers[q.id])) {
      setError('Prosím odpovedzte na všetky otázky.');
      return;
    }
    const progress = await dataManager.loadUserProgress(userId);
    progress.questionnaire0_data = { answers };
    await dataManager.saveProgress(userId, progress);
    await addPoints(10, 'questionnaire0');
    navigate('/mission0/outro');
  };

  return (
    <Layout>
      <Container>
        <Title>Dotazník 0 – Demografia</Title>
        {questions.map(q => (
          <div key={q.id}>
            <Question>{q.text}</Question>
            <input
              type="text"
              value={answers[q.id] || ''}
              onChange={e => handleChange(q.id, e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
            />
          </div>
        ))}
        {error && <ErrorText>{error}</ErrorText>}
        <StyledButton accent onClick={handleNext}>
          Pokračovať
        </StyledButton>
      </Container>
    </Layout>
  );
}
