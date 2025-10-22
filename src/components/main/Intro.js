// src/components/Intro.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../styles/Layout';
import StyledButton from '../../styles/StyledButton';
import { useUserStats } from '../../contexts/UserStatsContext';

const Container = styled.div`
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
  color: ${props => props.theme.ACCENT_COLOR};
`;

const Text = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 30px;
  color: ${props => props.theme.SECONDARY_TEXT_COLOR};
  text-align: center;
`;

const CodeDisplay = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  padding: 15px;
  border-radius: 8px;
  font-family: monospace;
  margin-bottom: 30px;
  width: 100%;
  max-width: 300px;
  text-align: center;
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const Intro = () => {
  const navigate = useNavigate();
  const { dataManager, userId } = useUserStats();
  const [groupCode, setGroupCode] = useState('');

  useEffect(() => {
    if (userId) {
      dataManager.loadUserProgress(userId).then(prog => {
        setGroupCode(prog.group_assignment);
      });
    }
  }, [userId, dataManager]);

  const handleContinue = () => {
    const next = '/mainmenu';
    navigate(next);
  };

  return (
    <Layout>
      <Container>
        <Title>Úvod do výskumu</Title>
        <Text>
          Vitajte späť! Vaša skupina je:
        </Text>
        <CodeDisplay>
          Skupina {groupCode}
        </CodeDisplay>
        <Text>
          V tejto časti vám poskytneme kontext a pokyny pre nasledujúce misie.
        </Text>
        <ButtonContainer>
          <StyledButton accent onClick={handleContinue}>
            Pokračovať na menu
          </StyledButton>
        </ButtonContainer>
      </Container>
    </Layout>
  );
};

export default Intro;
