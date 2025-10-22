import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import { useUserStats } from '../../../contexts/UserStatsContext';

const Container = styled.div`
  padding: 40px; text-align: center;
`;
const Title = styled.h2`
  color: ${p => p.theme.ACCENT_COLOR}; margin-bottom: 20px;
`;
const Text = styled.p`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR}; margin-bottom: 30px;
`;

const OutroMission0 = () => {
  const navigate = useNavigate();
  const { dataManager, userId, addPoints } = useUserStats();

  useEffect(() => {
    (async () => {
      const prog = await dataManager.loadUserProgress(userId);
      prog.mission0_completed = true;
      prog.mission0_timestamp_end = new Date().toISOString();
      await dataManager.saveProgress(userId, prog);
      await addPoints(10, 'mission0');
    })();
  }, [dataManager, userId, addPoints]);

  return (
    <Layout>
      <Container>
        <Title>Úspešne ukončené!</Title>
        <Text>
          Ďakujeme za vyplnenie dotazníka. Pokračujte do hlavného menu.
        </Text>
        <StyledButton accent onClick={() => navigate('/mainmenu')}>
          Hlavné menu
        </StyledButton>
      </Container>
    </Layout>
  );
};

export default OutroMission0;
