// src/components/missions/mission3/Intervention2A.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import { useUserStats } from '../../../contexts/UserStatsContext';
import { getResponseManager } from '../../../utils/ResponseManager';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
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
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
`;

const InterventionContent = styled.div`
  line-height: 1.8;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 15px;
  margin-bottom: 24px;
`;

const ExampleBox = styled.div`
  background: ${p => p.theme.HOVER_OVERLAY};
  border-left: 4px solid ${p => p.theme.ACCENT_COLOR};
  padding: 16px;
  margin: 16px 0;
  border-radius: 4px;
`;

const TimeTracker = styled.div`
  text-align: center;
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const COMPONENT_ID = 'mission3_intervention_a';

const Intervention2A = () => {
  const navigate = useNavigate();
  const { dataManager, userId } = useUserStats();
  const responseManager = getResponseManager(dataManager);

  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    (async () => {
      const prog = await dataManager.loadUserProgress(userId);
      if (!prog.mission3_unlocked && !dataManager.isAdmin(userId)) {
        return navigate('/mainmenu');
      }
    })();
  }, [dataManager, userId, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage > 80) setHasScrolled(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const autoSave = setInterval(async () => {
      const currentTime = Math.floor((Date.now() - startTime) / 1000);
      await responseManager.saveAnswer(userId, COMPONENT_ID, 'time_spent_seconds', currentTime, {
        last_autosave: new Date().toISOString()
      });
    }, 5000);
    return () => clearInterval(autoSave);
  }, [userId, responseManager, startTime]);

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      const finalTime = Math.floor((Date.now() - startTime) / 1000);

      await responseManager.saveMultipleAnswers(
        userId,
        COMPONENT_ID,
        {
          time_spent_seconds: finalTime,
          scrolled_to_bottom: hasScrolled,
          intervention_read: true,
          intervention_type: 'no_trust_building'
        },
        {
          started_at: new Date(startTime).toISOString(),
          completed_at: new Date().toISOString(),
          device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
        }
      );

      navigate('/mission3/questionnaire3b');

    } catch (error) {
      console.error('❌ Error saving intervention data:', error);
      alert('Chyba pri ukladaní. Skús to znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Container>
        <Card>
          <Title>Intervencia A</Title>

          <TimeTracker>
            Čas strávený: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
          </TimeTracker>

          <InterventionContent>
            {/* OBSAH DOPLNÍŠ MANUÁLNE */}
            <h3>Nadpis sekcie</h3>
            <p>Text intervencie bez budovania dôvery.</p>

            <ExampleBox>
              <strong>Príklad:</strong>
              <p style={{ marginTop: 8 }}>Text príkladu.</p>
            </ExampleBox>
          </InterventionContent>

          <ButtonContainer>
            <StyledButton
              accent
              onClick={handleContinue}
              disabled={isSubmitting || timeSpent < 20}
            >
              {timeSpent < 20
                ? `Prečítaj článok (${20 - timeSpent}s)`
                : isSubmitting
                  ? 'Ukladám...'
                  : 'Pokračovať'}
            </StyledButton>
          </ButtonContainer>
        </Card>
      </Container>
    </Layout>
  );
};

export default Intervention2A;
