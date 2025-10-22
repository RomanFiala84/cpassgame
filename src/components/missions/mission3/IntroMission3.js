import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import { useUserStats } from '../../../contexts/UserStatsContext';

const Container = styled.div`
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;
const Title = styled.h2`
  color: ${p => p.theme.ACCENT_COLOR};
  margin-bottom: 20px;
`;
const Text = styled.p`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 30px;
`;

const IntroMission3 = () => {
  const navigate = useNavigate();
  const { dataManager, userId } = useUserStats();

  useEffect(() => {
    (async () => {
      const prog = await dataManager.loadUserProgress(userId);
      if (!prog.mission3_timestamp_start) {
        prog.mission3_timestamp_start = new Date().toISOString();
        await dataManager.saveProgress(userId, prog);
      }
    })();
  }, [dataManager, userId]);

  return (
    <Layout>
      <Container>
        <Title>🔍 Misia 3: Záverečná analýza</Title>
        <Text>Vyplňte dotazník dôvery (3A) a pokračujte podľa svojej skupiny.</Text>
        <StyledButton accent onClick={() => navigate('/mission3/questionnaire3a')}>
          Pokračovať
        </StyledButton>
      </Container>
    </Layout>
  );
};

export default IntroMission3;
