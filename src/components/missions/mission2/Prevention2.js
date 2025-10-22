// src/components/missions/mission2/Prevention2.js
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

const Prevention2 = () => {
  const { dataManager, userId, addPoints } = useUserStats();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const progress = await dataManager.loadUserProgress(userId);
      if (!progress.prevention2_timestamp_start) {
        progress.prevention2_timestamp_start = new Date().toISOString();
        await dataManager.saveProgress(userId, progress);
      }
    })();
  }, [dataManager, userId]);

  const handleContinue = async () => {
    const progress = await dataManager.loadUserProgress(userId);
    progress.prevention2_timestamp_end = new Date().toISOString();
    await dataManager.saveProgress(userId, progress);
    
    await addPoints(15, 'prevention2');
    navigate('/mission2/postsb');
  };

  return (
    <Layout>
      <Container>
        <Card>
          <Title>Preventívne informácie - Misia 2</Title>
          <Content>
            Prečítajte si dôležité informácie o kritickej analýze zdrojov.
          </Content>
        </Card>
        
        <InfoCard>
          <InfoTitle>Overovanie zdrojov</InfoTitle>
          <InfoText>
            Pri čítaní správ vždy overujte, či pochádza z dôveryhodného zdroja. 
            Sledujte, kto článok publikoval a aké má motívy.
          </InfoText>
        </InfoCard>
        
        <InfoCard>
          <InfoTitle>Faktografické kontroly</InfoTitle>
          <InfoText>
            Využívajte fact-checking weby na overenie tvrdení. Porovnávajte 
            informácie z viacerých nezávislých zdrojov.
          </InfoText>
        </InfoCard>
        
        <InfoCard>
          <InfoTitle>Mediálna gramotnosť</InfoTitle>
          <InfoText>
            Rozvíjajte schopnosť kriticky hodnotiť mediálny obsah. Rozlišujte 
            medzi faktami a názorom, a uvedomujte si manipulačné techniky.
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

export default Prevention2;
