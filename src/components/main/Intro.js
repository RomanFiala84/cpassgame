// src/components/main/Intro.js
// S VEĽKÝM DETECTIVE TIP

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../styles/Layout';
import StyledButton from '../../styles/StyledButton';
import { useUserStats } from '../../contexts/UserStatsContext';
import DetectiveTipLarge from '../shared/DetectiveTipLarge'; // ✅ ZMENENÉ

const Container = styled.div`
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 20px;
  color: ${props => props.theme.ACCENT_COLOR};
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
  
  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.h2`
  font-size: 20px;
  margin-bottom: 30px;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  text-align: center;
  font-weight: 600;
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Text = styled.p`
  font-size: 18px;
  line-height: 1.8;
  margin-bottom: 24px;
  color: ${props => props.theme.SECONDARY_TEXT_COLOR};
  text-align: center;
  max-width: 600px;
  
  @media (max-width: 480px) {
    font-size: 16px;
    line-height: 1.6;
  }
`;

const GroupCard = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 3px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 12px;
  padding: 24px 40px;
  margin: 30px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  
  @media (max-width: 480px) {
    padding: 20px 30px;
  }
`;

const GroupLabel = styled.div`
  font-size: 14px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
  text-align: center;
`;

const GroupValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
  text-align: center;
  font-family: monospace;
  
  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    
    button {
      width: 100%;
    }
  }
`;

const Intro = () => {
  const navigate = useNavigate();
  const { dataManager, userId } = useUserStats();
  const [groupCode, setGroupCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGroup = async () => {
      if (userId) {
        try {
          const prog = await dataManager.loadUserProgress(userId);
          setGroupCode(prog.group_assignment || '0');
        } catch (error) {
          console.error('Error loading user progress:', error);
          setGroupCode('0');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadGroup();
  }, [userId, dataManager]);

  const handleContinue = () => {
    navigate('/mainmenu');
  };

  return (
    <Layout>
      <Container>
        <Title>🔍 Vitajte v Conspiracy Pass!</Title>
        
        <Subtitle>Vaše priradenie</Subtitle>
        
        {isLoading ? (
          <GroupCard>
            <GroupLabel>Načítavam...</GroupLabel>
            <GroupValue>⏳</GroupValue>
          </GroupCard>
        ) : (
          <GroupCard>
            <GroupLabel>Vaša výskumná skupina</GroupLabel>
            <GroupValue>Skupina {groupCode}</GroupValue>
          </GroupCard>
        )}
        
        <Text>
          Ste pripravení vydať sa na dobrodružstvo plné tajomstiev a odhaľovania pravdy? 
          Vaše detektívne schopnosti budú testované v rôznych misiách.
        </Text>

        <ButtonContainer>
          <StyledButton accent onClick={handleContinue} disabled={isLoading}>
            {isLoading ? 'Načítavam...' : '🚀 Začať výcvik'}
          </StyledButton>
        </ButtonContainer>

        {/* ✅ VEĽKÝ DETECTIVE TIP S OBRÁZKOM */}
        <DetectiveTipLarge
          detectiveName="Detektív Conan"
          imageUrl="/images/detective.png"
          tip={`
            <p>Vitajte, <strong>mladý detektíve</strong>!</p>
            <p>Ja som detektív Conan a budem vašim sprievodcom na ceste odhaľovania pravdy a boja proti dezinformáciám.</p>
            <p>Spoločne s mojím verným nemeckým ovčiakom preskúmame záhadné prípady a naučíme sa rozpoznávať <strong>manipuláciu a konšpiračné teórie</strong>.</p>
            <p><em>Pripravte sa na detektívne dobrodružstvo! 🕵️</em></p>
          `}
          buttonText="🚀 Začať výcvik!"
          autoOpen={true}
          autoOpenDelay={500}
          autoClose={false}
        />
      </Container>
    </Layout>
  );
};

export default Intro;
