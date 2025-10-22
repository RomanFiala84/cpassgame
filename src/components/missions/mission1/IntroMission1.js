import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import { useUserStats } from '../../../contexts/UserStatsContext';

const Container = styled.div`
  padding: 40px; max-width: 800px; margin: 0 auto; text-align: center;
`;
const Title = styled.h2`
  color: ${p => p.theme.ACCENT_COLOR}; margin-bottom: 20px;
`;
const Text = styled.p`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR}; margin-bottom: 30px;
`;

const IntroMission1 = () => {
  const navigate = useNavigate();
  const { dataManager, userId } = useUserStats();
  const [group, setGroup] = useState('');

  useEffect(() => {
    dataManager.loadUserProgress(userId).then(p => setGroup(p.group_assignment));
    dataManager.loadUserProgress(userId).then(async prog => {
      if (!prog.mission1_timestamp_start) {
        prog.mission1_timestamp_start = new Date().toISOString();
        await dataManager.saveProgress(userId, prog);
      }
    });
  }, [dataManager, userId]);

  const handleContinue = () => navigate('/mission1/questionnaire1a');

  return (
    <Layout>
      <Container>
        <Title>🔍 Misia 1: Hodnotenie dôvery</Title>
        <Text>
          Vaša skupina: {group}
        </Text>
        <Text>
          Najskôr vyplňte dotazník týkajúci sa dôvery.
        </Text>
        <StyledButton accent onClick={handleContinue}>
          Pokračovať
        </StyledButton>
      </Container>
    </Layout>
  );
};

export default IntroMission1;
