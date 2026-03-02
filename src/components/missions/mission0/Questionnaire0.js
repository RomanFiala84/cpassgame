// src/components/missions/mission0/Questionnaire0.js
// ✅ MULTI-PAGE s LIKERT ŠKÁLAMI + LABELS POD TLAČIDLAMI

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import DetectiveTipSmall from '../../shared/DetectiveTipSmall';
import { useUserStats } from '../../../contexts/UserStatsContext';
import { getResponseManager } from '../../../utils/ResponseManager';

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
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

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${p => p.theme.BORDER_COLOR};
  border-radius: 4px;
  margin-bottom: 24px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${p => p.theme.ACCENT_COLOR},
    ${p => p.theme.ACCENT_COLOR_2}
  );
  transition: width 0.3s ease;
  width: ${p => p.progress}%;
`;

const ProgressText = styled.div`
  text-align: center;
  font-size: 14px;
  color: ${p => p.theme.ACCENT_COLOR};
  margin-bottom: 16px;
  font-weight: 600;
`;

const QuestionCard = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const Question = styled.p`
  margin-bottom: 12px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 14px;
  font-weight: 500;
`;

const ScaleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

// ✅ NOVÉ: Wrapper pre tlačidlo + label
const ScaleButtonWithLabel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 0; // Pre správne fungovanie flex
`;

const RadioLabel = styled.label`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => p.checked ? p.theme.ACCENT_COLOR : 'transparent'};
  color: ${p => p.checked ? '#FFFFFF' : p.theme.PRIMARY_TEXT_COLOR};
  font-size: 14px;
  font-weight: 600;
  
  &:hover {
    background: ${p => p.checked ? p.theme.ACCENT_COLOR : p.theme.HOVER_OVERLAY};
  }
  
  input {
    display: none;
  }
`;

// ✅ NOVÉ: Label pod tlačidlom
const ScaleValueLabel = styled.span`
  font-size: 10px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-align: center;
  line-height: 1.2;
  word-break: break-word;
  hyphens: auto;
  
  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

const ScaleLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
`;

// ✅ Radio buttons pre výber z možností
const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => p.checked ? p.theme.ACCENT_COLOR : 'transparent'};
  color: ${p => p.checked ? '#FFFFFF' : p.theme.PRIMARY_TEXT_COLOR};
  
  &:hover {
    background: ${p => p.checked ? p.theme.ACCENT_COLOR : `${p.theme.ACCENT_COLOR}15`};
  }
  
  input {
    margin-right: 12px;
    accent-color: ${p => p.theme.ACCENT_COLOR};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 4px;
  font-size: 14px;
  background: ${p => p.theme.CARD_BACKGROUND};
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  
  &:focus {
    outline: none;
    border-color: ${p => p.theme.ACCENT_COLOR};
  }
`;

const ErrorText = styled.div`
  color: ${p => p.theme.ACCENT_COLOR_2};
  margin-bottom: 16px;
  text-align: center;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  gap: 12px;
`;

const ProgressIndicator = styled.div`
  text-align: center;
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-top: 16px;
`;

// ✅ DEFINÍCIA STRÁNOK (PAGES) s OTÁZKAMI
const PAGES = [
  {
    id: 'demografia',
    title: 'Demografia',
    instruction: 'Nasleduje séria otázok o Vás. Tieto informácie nám pomôžu pochopiť, ako sa líšia názory a skúsenosti medzi rôznymi skupinami ľudí.',
    questions: [
      {
        id: 'd1_pohlavie',
        text: 'Vyberte Vaše pohlavie:',
        type: 'radio',
        options: [
          { value: 'muz', label: 'Muž' },
          { value: 'zena', label: 'Žena' }
        ]
      },
      {
        id: 'd2_vek',
        text: 'Zadajte Váš vek:',
        type: 'number'
      },
      {
        id: 'd3_vzdelanie',
        text: 'Vyberte Vaše najvyššie dosiahnuté vzdelanie:',
        type: 'radio',
        options: [
          { value: 'zakladne', label: 'Základné vzdelanie' },
          { value: 'stredne_bez', label: 'Nižšie stredné odborné (bez maturity)' },
          { value: 'stredne_s', label: 'Úplné stredné (s maturitou)' },
          { value: 'bc', label: 'Vysokoškolské 1. stupňa (bakalárske)' },
          { value: 'mgr', label: 'Vysokoškolské 2. stupňa (magisterské)' },
          { value: 'phd', label: 'Vysokoškolské 3. stupňa (doktorandské)' }
        ]
      }
    ]
  },
  {
    id: 'religiozita',
    title: 'Religiozita',
    instruction: 'Nasledujúce otázky sa týkajú Vášho vzťahu k náboženstvu. Neexistujú správne alebo nesprávne odpovede.',
    questions: [
      {
        id: 'r1_organizovane',
        text: 'Ako často sa zúčastňujete na náboženských obradoch (napr. omša, modlitba v mešite)?',
        type: 'likert',
        scale: [1, 2, 3, 4, 5, 6],
        scaleValueLabels: [
          'Nikdy',
          'Raz za rok',
          'Niekoľko-krát za rok',
          'Niekoľko-krát za mesiac',
          'Raz týždenne',
          'Viackrát týždenne'
        ]
      },
      {
        id: 'r2_modlitba',
        text: 'Ako často sa modlíte alebo meditujete súkromne?',
        type: 'likert',
        scale: [1, 2, 3, 4, 5, 6],
        scaleValueLabels: [
          'Nikdy',
          'Raz za rok',
          'Niekoľko-krát za rok',
          'Niekoľko-krát za mesiac',
          'Raz týždenne',
          'Viackrát týždenne'
        ]
      },
      {
        id: 'r3_vnutorna',
        text: 'Do akej miery je náboženstvo dôležitou súčasťou vašej osobnej identity?',
        type: 'likert',
        scale: [1, 2, 3, 4, 5],
        scaleLabels: { min: 'Vôbec nie', max: 'Veľmi veľa' }
      }
    ]
  },
  {
    id: 'media',
    title: 'Frekvenčné médiá',
    instruction: 'Ako často používate nasledujúce zdroje informácií?',
    questions: [
      {
        id: 'm1_tv',
        text: 'Sledujete televízne spravodajstvo (napr. RTVS, Markíza, JOJ)?',
        type: 'likert',
        scale: [1, 2, 3, 4, 5, 6],
        scaleValueLabels: [
          'Nikdy',
          'Raz za rok',
          'Niekoľko-krát za rok',
          'Niekoľko-krát za mesiac',
          'Raz týždenne',
          'Viackrát týždenne'
        ]
      },
      {
        id: 'm2_online',
        text: 'Čítate online správy (napr. SME.sk, Denník N, Aktuality.sk)?',
        type: 'likert',
        scale: [1, 2, 3, 4, 5, 6],
        scaleValueLabels: [
          'Nikdy',
          'Raz za rok',
          'Niekoľko-krát za rok',
          'Niekoľko-krát za mesiac',
          'Raz týždenne',
          'Viackrát týždenne'
        ]
      },
      {
        id: 'm3_alternativne',
        text: 'Používate alternatívne médiá (napr. Hlavné správy, Zem a vek)?',
        type: 'likert',
        scale: [1, 2, 3, 4, 5, 6],
        scaleValueLabels: [
          'Nikdy',
          'Raz za rok',
          'Niekoľko-krát za rok',
          'Niekoľko-krát za mesiac',
          'Raz týždenne',
          'Viackrát týždenne'
        ]
      },
      {
        id: 'm4_social',
        text: 'Získavate informácie zo sociálnych sietí (Facebook, Instagram, TikTok)?',
        type: 'likert',
        scale: [1, 2, 3, 4, 5, 6],
        scaleValueLabels: [
          'Nikdy',
          'Raz za rok',
          'Niekoľko-krát za rok',
          'Niekoľko-krát za mesiac',
          'Raz týždenne',
          'Viackrát týždenne'
        ]
      }
    ]
  },
  {
    id: 'tolerancia',
    title: 'Tolerancia',
    instruction: 'Označte, do akej miery súhlasíte alebo nesúhlasíte s nasledujúcimi výrokmi.',
    questions: [
      {
        id: 't1_autonomia',
        text: 'Každý človek má právo na vlastný názor, aj keď s ním nesúhlasím.',
        type: 'likert',
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleLabels: { min: 'Vôbec nesúhlasím', max: 'Úplne súhlasím' }
      },
      {
        id: 't2_respekt',
        text: 'Rešpektujem ľudí, ktorí majú iné hodnoty ako ja.',
        type: 'likert',
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleLabels: { min: 'Vôbec nesúhlasím', max: 'Úplne súhlasím' }
      },
      {
        id: 't3_ocenenie',
        text: 'Oceňujem rozmanitosť názorov v spoločnosti.',
        type: 'likert',
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleLabels: { min: 'Vôbec nesúhlasím', max: 'Úplne súhlasím' }
      }
    ]
  },
  {
    id: 'mentalita',
    title: 'Konšpiračná mentalita',
    instruction: 'Označte, do akej miery súhlasíte alebo nesúhlasíte s nasledujúcimi výrokmi.',
    questions: [
      {
        id: 'km1',
        text: 'Existujú tajné organizácie, ktoré majú veľký vplyv na politické rozhodnutia.',
        type: 'likert',
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleLabels: { min: 'Vôbec nesúhlasím', max: 'Úplne súhlasím' }
      },
      {
        id: 'km2',
        text: 'Politici nám zvyčajne nezverejňujú skutočné dôvody svojich rozhodnutí.',
        type: 'likert',
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleLabels: { min: 'Vôbec nesúhlasím', max: 'Úplne súhlasím' }
      },
      {
        id: 'km3',
        text: 'Vládne agentúry dôkladne sledujú všetkých občanov.',
        type: 'likert',
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleLabels: { min: 'Vôbec nesúhlasím', max: 'Úplne súhlasím' }
      },
      {
        id: 'km4',
        text: 'Udalosti, ktoré na povrchu navzájom nesúvisia, sú často výsledkom tajných aktivít.',
        type: 'likert',
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleLabels: { min: 'Vôbec nesúhlasím', max: 'Úplne súhlasím' }
      },
      {
        id: 'km5',
        text: 'Existujú tajné organizácie, ktoré významne ovplyvňujú politické rozhodnutia.',
        type: 'likert',
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleLabels: { min: 'Vôbec nesúhlasím', max: 'Úplne súhlasím' }
      }
    ]
  }
];

const COMPONENT_ID = 'mission0_questionnaire';

const Questionnaire0 = () => {
  const navigate = useNavigate();
  const { dataManager, userId } = useUserStats();
  const responseManager = getResponseManager(dataManager);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Načítaj uložené odpovede
  useEffect(() => {
    const loadSaved = async () => {
      if (!userId) return;
      
      const saved = await responseManager.loadResponses(userId, COMPONENT_ID);
      if (saved.answers && Object.keys(saved.answers).length > 0) {
        setAnswers(saved.answers);
      }
    };
    
    loadSaved();
  }, [userId, responseManager]);

  // Handler pre zmenu odpovede s auto-save
  const handleChange = async (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    setError('');
    
    // Auto-save do DB
    try {
      await responseManager.saveAnswer(
        userId,
        COMPONENT_ID,
        questionId,
        value
      );
    } catch (err) {
      console.warn('Auto-save failed:', err);
    }
  };

  // Validácia aktuálnej stránky
  const isCurrentPageComplete = () => {
    const currentQuestions = PAGES[currentPage].questions;
    return currentQuestions.every(q => {
      const answer = answers[q.id];
      return answer !== undefined && answer !== null && answer !== '';
    });
  };

  // Previous page
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      setError('');
      window.scrollTo(0, 0);
    }
  };

  // Next page alebo Submit
  const handleNext = async () => {
    if (!isCurrentPageComplete()) {
      setError('Prosím odpovedzte na všetky otázky na tejto stránke.');
      return;
    }
    
    setError('');
    
    // Ak nie sme na poslednej stránke -> ďalšia stránka
    if (currentPage < PAGES.length - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
      return;
    }
    
    // Ak sme na poslednej stránke -> SUBMIT
    setIsSubmitting(true);
    
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      // Ulož všetky odpovede s metadata
      await responseManager.saveMultipleAnswers(
        userId,
        COMPONENT_ID,
        answers,
        {
          time_spent_seconds: timeSpent,
          device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          completed_at: new Date().toISOString()
        }
      );
      
      // Označ misiu 0 ako dokončenú
      const progress = await dataManager.loadUserProgress(userId);
      progress.mission0_completed = true;
      await dataManager.saveProgress(userId, progress);
      
      // Naviguj na outro
      navigate('/mission0/outro');
      
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      setError('Chyba pri ukladaní odpovedí. Skúste to znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ RENDER OTÁZKY podľa typu
  const renderQuestion = (question) => {
    const answer = answers[question.id];

    // LIKERT škála s LABELS POD TLAČIDLAMI
    if (question.type === 'likert') {
      return (
        <>
          <ScaleContainer>
            {question.scale.map((v, index) => (
              <ScaleButtonWithLabel key={v}>
                <RadioLabel checked={answer === v}>
                  <input
                    type="radio"
                    name={question.id}
                    checked={answer === v}
                    onChange={() => handleChange(question.id, v)}
                  />
                  {v}
                </RadioLabel>
                
                {/* ✅ Label pod tlačidlom */}
                {question.scaleValueLabels && question.scaleValueLabels[index] && (
                  <ScaleValueLabel>
                    {question.scaleValueLabels[index]}
                  </ScaleValueLabel>
                )}
              </ScaleButtonWithLabel>
            ))}
          </ScaleContainer>
          
          {/* Klasické min/max labels ako fallback */}
          {!question.scaleValueLabels && question.scaleLabels && (
            <ScaleLabels>
              <span>{question.scaleLabels.min}</span>
              <span>{question.scaleLabels.max}</span>
            </ScaleLabels>
          )}
        </>
      );
    }

    // RADIO buttons (výber z možností)
    if (question.type === 'radio') {
      return (
        <RadioGroup>
          {question.options.map(option => (
            <RadioOption key={option.value} checked={answer === option.value}>
              <input
                type="radio"
                name={question.id}
                checked={answer === option.value}
                onChange={() => handleChange(question.id, option.value)}
              />
              {option.label}
            </RadioOption>
          ))}
        </RadioGroup>
      );
    }

    // NUMBER input (vek)
    if (question.type === 'number') {
      return (
        <Input
          type="number"
          value={answer || ''}
          onChange={(e) => handleChange(question.id, e.target.value)}
          placeholder="Napíšte číslo..."
        />
      );
    }

    // TEXT input
    if (question.type === 'text') {
      return (
        <Input
          type="text"
          value={answer || ''}
          onChange={(e) => handleChange(question.id, e.target.value)}
          placeholder="Napíšte odpoveď..."
        />
      );
    }

    return null;
  };

  // Progress výpočty
  const currentPageData = PAGES[currentPage];
  const totalPages = PAGES.length;
  const progress = ((currentPage + 1) / totalPages) * 100;
  
  const answeredOnCurrentPage = currentPageData.questions.filter(q => 
    answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== ''
  ).length;

  return (
    <Layout>
      <Container>
        <Card>
          <Title>{currentPageData.title}</Title>
          
          <ProgressText>
            Stránka {currentPage + 1} z {totalPages}
          </ProgressText>
          
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>
          
          <DetectiveTipSmall
            title="💡 Tip"
            icon="🕵️"
            tip={currentPageData.instruction}
          />
          
          {currentPageData.questions.map((question) => (
            <QuestionCard key={question.id}>
              <Question>{question.text}</Question>
              {renderQuestion(question)}
            </QuestionCard>
          ))}
          
          {error && <ErrorText>{error}</ErrorText>}
          
          <ButtonContainer>
            <StyledButton 
              onClick={handlePrevious}
              disabled={currentPage === 0}
            >
              ← Späť
            </StyledButton>
            
            <StyledButton 
              accent 
              onClick={handleNext}
              disabled={!isCurrentPageComplete() || isSubmitting}
            >
              {currentPage === totalPages - 1
                ? (isSubmitting ? 'Ukladám...' : 'Dokončiť')
                : 'Pokračovať →'}
            </StyledButton>
          </ButtonContainer>
          
          <ProgressIndicator>
            Vyplnené: {answeredOnCurrentPage} / {currentPageData.questions.length}
          </ProgressIndicator>
        </Card>
      </Container>
    </Layout>
  );
};

export default Questionnaire0;
