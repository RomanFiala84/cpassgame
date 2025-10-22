import React, { useEffect } from 'react';
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

const IntroMission0 = () => {
  const navigate = useNavigate();
  const { dataManager, userId } = useUserStats();

  useEffect(() => {
    const recordStart = async () => {
      const prog = await dataManager.loadUserProgress(userId);
      if (!prog.mission0_timestamp_start) {
        prog.mission0_timestamp_start = new Date().toISOString();
        await dataManager.saveProgress(userId, prog);
      }
    };
    recordStart();
  }, [dataManager, userId]);

  const handleContinue = () => navigate('/mission0/questionnaire');

  return (
    <Layout>
      <Container>
        <Title>🕵️ Špeciálna Agentúra</Title>
        <Text>
          [translate:Vstúpte do kože špeciálneho agenta a pomôžte nám odhaliť pravdu.]  
          [translate:Vyplňte demografický dotazník a začnite misiu.]
        </Text>
        <StyledButton accent onClick={handleContinue}>
          Pokračovať na Questionnaire 0
        </StyledButton>
      </Container>
    </Layout>
  );
};

export default IntroMission0;
