// src/components/missions/mission3/Prevention3.js
import React, { useEffect } from 'react';
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

const Content = styled.div`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const InfoCard = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
`;

const InfoTitle = styled.h3`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const InfoText = styled.p`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 14px;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const Prevention3 = () => {
  const { dataManager, userId, addPoints } = useUserStats();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const progress = await dataManager.loadUserProgress(userId);
      if (!progress.prevention3_timestamp_start) {
        progress.prevention3_timestamp_start = new Date().toISOString();
        await dataManager.saveProgress(userId, progress);
      }
    })();
  }, [dataManager, userId]);

  const handleContinue = async () => {
    const progress = await dataManager.loadUserProgress(userId);
    progress.prevention3_timestamp_end = new Date().toISOString();
    await dataManager.saveProgress(userId, progress);
    
    await addPoints(15, 'prevention3');
    navigate('/mission3/postsb');
  };

  return (
    <Layout>
      <Container>
        <Card>
          <Title>Preventívne informácie - Misia 3</Title>
          <Content>
            Prečítajte si záverečné odporúčania pre bezpečnú navigáciu v informačnom priestore.
          </Content>
        </Card>
        
        <InfoCard>
          <InfoTitle>Zodpovedné zdieľanie</InfoTitle>
          <InfoText>
            Pred zdieľaním informácií sa uistite, že sú overené a pravdivé. 
            Šírenie dezinformácií môže mať vážne dôsledky.
          </InfoText>
        </InfoCard>
        
        <InfoCard>
          <InfoTitle>Emócie vs. Fakty</InfoTitle>
          <InfoText>
            Buďte ostražití voči obsahu, ktorý vyvoláva silné emócie. Tieto 
            materiály sú často navrhnuté tak, aby manipulovali vaše správanie.
          </InfoText>
        </InfoCard>
        
        <InfoCard>
          <InfoTitle>Neustále vzdelávanie</InfoTitle>
          <InfoText>
            Kritické myslenie je zručnosť, ktorú treba neustále rozvíjať. 
            Buďte zvedaví, pýtajte sa otázky a nikdy neprestávajte sa učiť.
          </InfoText>
        </InfoCard>
        
        <ButtonContainer>
          <StyledButton accent onClick={handleContinue}>
            Pokračovať
          </StyledButton>
        </ButtonContainer>
      </Container>
    </Layout>
  );
};

export default Prevention3;
