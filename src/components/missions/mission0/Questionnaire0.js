// src/components/missions/mission0/Questionnaire0.js
// ✅ FEEDBACK PRIAMO V BLOKU OTÁZOK (na tej istej stránke)

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

// ✅ FEEDBACK SEKCIA - vizuálne oddelená
const FeedbackSection = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px dashed ${p => p.theme.BORDER_COLOR};
`;

const FeedbackTitle = styled.h3`
  color: ${p => p.theme.ACCENT_COLOR};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FeedbackSubtitle = styled.p`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 13px;
  margin-bottom: 16px;
  font-style: italic;
`;

const ScaleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

const ScaleButtonWithLabel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 0;
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

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: ${p => p.theme.INPUT_BACKGROUND};
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${p => p.theme.ACCENT_COLOR};
    box-shadow: 0 0 0 3px ${p => p.theme.ACCENT_COLOR}22;
  }
  
  &::placeholder {
    color: ${p => p.theme.SECONDARY_TEXT_COLOR};
    opacity: 0.6;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    padding: 10px;
  }
`;

const NumberSelectContainer = styled.div`
  margin-top: 12px;
`;

const NumberSelectInstruction = styled.div`
  font-size: 13px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 12px;
  font-style: italic;
`;

const NumberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 8px;
  margin-top: 8px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
  }
`;

const NumberButton = styled.button`
  padding: 12px;
  border: 2px solid ${p => p.checked ? p.theme.ACCENT_COLOR : p.theme.BORDER_COLOR};
  border-radius: 8px;
  background: ${p => p.checked ? p.theme.ACCENT_COLOR : p.theme.CARD_BACKGROUND};
  color: ${p => p.checked ? '#ffffff' : p.theme.PRIMARY_TEXT_COLOR};
  font-size: 15px;
  font-weight: ${p => p.checked ? '700' : '600'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${p => p.checked 
    ? `0 2px 8px ${p.theme.ACCENT_COLOR}44` 
    : '0 1px 3px rgba(0,0,0,0.1)'};
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${p => p.theme.ACCENT_COLOR};
    box-shadow: 0 4px 12px ${p => p.theme.ACCENT_COLOR}33;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const SelectedNumbers = styled.div`
  margin-top: 12px;
  padding: 10px 14px;
  background: ${p => p.theme.ACCENT_COLOR}11;
  border: 1px solid ${p => p.theme.ACCENT_COLOR}33;
  border-radius: 8px;
  font-size: 14px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  
  strong {
    color: ${p => p.theme.ACCENT_COLOR};
    font-weight: 600;
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

// ✅ Funkcia na vytvorenie feedback otázok
const createFeedbackQuestions = (blockId, questionCount) => [
  {
    id: `fb_${blockId}_problems`,
    text: 'V ktorých oblastiach ste mali problémy? (môžete vybrať viacero)',
    type: 'checkbox',
    isFeedback: true,
    options: [
      { value: 'zrozumitelnost', label: 'Zrozumiteľnosť otázok' },
      { value: 'stupnica', label: 'Hodnotiaca stupnica' },
      { value: 'duplicita', label: 'Opakujúce sa otázky' },
      { value: 'citlivost', label: 'Citlivé témy' },
      { value: 'ine', label: 'Iné problémy' }
    ]
  },
  {
    id: `fb_${blockId}_clarity_questions`,
    text: 'Ktoré otázky boli nezrozumiteľné? (vyberte čísla otázok)',
    type: 'number-select',
    isFeedback: true,
    min: 1,
    max: questionCount,
    multiple: true,
    instruction: 'Kliknite na čísla problémových otázok:',
    required: false,
    showIf: {
      questionId: `fb_${blockId}_problems`,
      operator: 'includes',
      value: 'zrozumitelnost'
    }
  },
  {
    id: `fb_${blockId}_clarity_detail`,
    text: 'Čo konkrétne vám nebolo jasné? (slová, pojmy, formulácia...)',
    type: 'textarea',
    isFeedback: true,
    placeholder: 'Napríklad: "Otázka 3 - nerozumel/a som pojmu \'konšpiračná mentalita\'"',
    required: false,
    showIf: {
      questionId: `fb_${blockId}_problems`,
      operator: 'includes',
      value: 'zrozumitelnost'
    }
  },
  {
    id: `fb_${blockId}_scale_detail`,
    text: 'Čo konkrétne bolo problematické na hodnotiacej stupnici?',
    type: 'textarea',
    isFeedback: true,
    placeholder: 'Napríklad: "Príliš veľa možností" alebo "Neviem ako hodnotiť neutrálny postoj"',
    required: false,
    showIf: {
      questionId: `fb_${blockId}_problems`,
      operator: 'includes',
      value: 'stupnica'
    }
  },
  {
    id: `fb_${blockId}_duplicate_questions`,
    text: 'Ktoré otázky sa opakovali? (vyberte čísla otázok)',
    type: 'number-select',
    isFeedback: true,
    min: 1,
    max: questionCount,
    multiple: true,
    instruction: 'Kliknite na čísla opakujúcich sa otázok:',
    required: false,
    showIf: {
      questionId: `fb_${blockId}_problems`,
      operator: 'includes',
      value: 'duplicita'
    }
  },
  {
    id: `fb_${blockId}_sensitive_questions`,
    text: 'Ktoré otázky boli citlivé? (vyberte čísla otázok)',
    type: 'number-select',
    isFeedback: true,
    min: 1,
    max: questionCount,
    multiple: true,
    instruction: 'Kliknite na čísla citlivých otázok:',
    required: false,
    showIf: {
      questionId: `fb_${blockId}_problems`,
      operator: 'includes',
      value: 'citlivost'
    }
  },
  {
    id: `fb_${blockId}_other_detail`,
    text: 'Prosím popíšte iné problémy:',
    type: 'textarea',
    isFeedback: true,
    placeholder: 'Akékoľvek ďalšie pripomienky...',
    required: false,
    showIf: {
      questionId: `fb_${blockId}_problems`,
      operator: 'includes',
      value: 'ine'
    }
  }
];

// ✅ DEFINÍCIA STRÁNOK s FEEDBACK priamo v bloku
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
].map(page => ({
  ...page,
  questions: [
    ...page.questions,
    ...createFeedbackQuestions(page.id, page.questions.length)
  ]
}));

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

  const shouldShowQuestion = (question, responses) => {
    if (!question.showIf) return true;
    
    const { questionId, value, operator = 'includes' } = question.showIf;
    const responseValue = responses[questionId];
    
    if (responseValue === undefined || responseValue === null) {
      return false;
    }
    
    switch (operator) {
      case 'includes':
        return Array.isArray(responseValue) && responseValue.includes(value);
      case '===':
        return responseValue === value;
      case '!==':
        return responseValue !== value;
      case '>':
        return responseValue > value;
      case '<':
        return responseValue < value;
      case '>=':
        return responseValue >= value;
      case '<=':
        return responseValue <= value;
      case 'any':
        return Array.isArray(responseValue) && responseValue.length > 0;
      default:
        return responseValue === value;
    }
  };

  const handleChange = async (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    setError('');
    
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

  const handleNumberSelect = (questionId, number) => {
    const current = answers[questionId] || [];
    const updated = current.includes(number)
      ? current.filter(n => n !== number)
      : [...current, number].sort((a, b) => a - b);
    
    handleChange(questionId, updated);
  };

  const isCurrentPageComplete = () => {
    const currentPageData = PAGES[currentPage];
    const visibleQuestions = currentPageData.questions.filter(q => 
      shouldShowQuestion(q, answers) && !q.isFeedback // Feedback nie je povinný
    );
    
    return visibleQuestions.every(q => {
      if (q.required === false) return true;
      const answer = answers[q.id];
      return answer !== undefined && answer !== null && answer !== '';
    });
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      setError('');
      window.scrollTo(0, 0);
    }
  };

  const handleNext = async () => {
    if (!isCurrentPageComplete()) {
      setError('Prosím odpovedzte na všetky povinné otázky na tejto stránke.');
      return;
    }
    
    setError('');
    
    if (currentPage < PAGES.length - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
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
      
      const progress = await dataManager.loadUserProgress(userId);
      progress.mission0_completed = true;
      await dataManager.saveProgress(userId, progress);
      
      navigate('/mission0/outro');
      
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      setError('Chyba pri ukladaní odpovedí. Skúste to znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question, index) => {
    if (!shouldShowQuestion(question, answers)) {
      return null;
    }

    return (
      <QuestionCard key={question.id}>
        <Question>{index + 1}. {question.text}</Question>
        
        {question.type === 'likert' && (
          <>
            <ScaleContainer>
              {question.scale.map((v, idx) => (
                <ScaleButtonWithLabel key={v}>
                  <RadioLabel checked={answers[question.id] === v}>
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === v}
                      onChange={() => handleChange(question.id, v)}
                    />
                    {v}
                  </RadioLabel>
                  
                  {question.scaleValueLabels && question.scaleValueLabels[idx] && (
                    <ScaleValueLabel>
                      {question.scaleValueLabels[idx]}
                    </ScaleValueLabel>
                  )}
                </ScaleButtonWithLabel>
              ))}
            </ScaleContainer>
            
            {!question.scaleValueLabels && question.scaleLabels && (
              <ScaleLabels>
                <span>{question.scaleLabels.min}</span>
                <span>{question.scaleLabels.max}</span>
              </ScaleLabels>
            )}
          </>
        )}

        {question.type === 'radio' && (
          <RadioGroup>
            {question.options.map(option => (
              <RadioOption 
                key={option.value} 
                checked={answers[question.id] === option.value}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={answers[question.id] === option.value}
                  onChange={() => handleChange(question.id, option.value)}
                />
                {option.label}
              </RadioOption>
            ))}
          </RadioGroup>
        )}

        {question.type === 'checkbox' && (
          <RadioGroup>
            {question.options.map(option => {
              const currentAnswer = answers[question.id] || [];
              const isChecked = currentAnswer.includes(option.value);
              
              return (
                <RadioOption
                  key={option.value}
                  checked={isChecked}
                  onClick={() => {
                    const updated = isChecked
                      ? currentAnswer.filter(v => v !== option.value)
                      : [...currentAnswer, option.value];
                    handleChange(question.id, updated);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                  />
                  {option.label}
                </RadioOption>
              );
            })}
          </RadioGroup>
        )}

        {question.type === 'number-select' && (
          <NumberSelectContainer>
            {question.instruction && (
              <NumberSelectInstruction>
                {question.instruction}
              </NumberSelectInstruction>
            )}
            
            <NumberGrid>
              {Array.from(
                { length: question.max - question.min + 1 },
                (_, i) => question.min + i
              ).map(num => {
                const currentAnswer = answers[question.id] || [];
                const isChecked = currentAnswer.includes(num);
                
                return (
                  <NumberButton
                    key={num}
                    type="button"
                    checked={isChecked}
                    onClick={() => handleNumberSelect(question.id, num)}
                  >
                    {num}
                  </NumberButton>
                );
              })}
            </NumberGrid>
            
            {(answers[question.id] || []).length > 0 && (
              <SelectedNumbers>
                <strong>Vybrané otázky:</strong> {(answers[question.id] || []).join(', ')}
              </SelectedNumbers>
            )}
          </NumberSelectContainer>
        )}

        {question.type === 'textarea' && (
          <Textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={4}
          />
        )}

        {question.type === 'number' && (
          <Input
            type="number"
            value={answers[question.id] || ''}
            onChange={(e) => handleChange(question.id, e.target.value)}
            placeholder="Napíšte číslo..."
          />
        )}

        {question.type === 'text' && (
          <Input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleChange(question.id, e.target.value)}
            placeholder="Napíšte odpoveď..."
          />
        )}
      </QuestionCard>
    );
  };

  const currentPageData = PAGES[currentPage];
  const totalPages = PAGES.length;
  const progress = ((currentPage + 1) / totalPages) * 100;
  
  // Rozdeľ otázky na content a feedback
  const contentQuestions = currentPageData.questions.filter(q => !q.isFeedback);
  const feedbackQuestions = currentPageData.questions.filter(q => q.isFeedback);
  
  const visibleContentQuestions = contentQuestions.filter(q => 
    shouldShowQuestion(q, answers)
  );
  
  const visibleFeedbackQuestions = feedbackQuestions.filter(q => 
    shouldShowQuestion(q, answers)
  );
  
  const answeredContentQuestions = visibleContentQuestions.filter(q => 
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
            tip={currentPageData.instruction}
            detectiveName="Inšpektor Kritan"
            autoOpen={true}
          />
          
          {/* ✅ CONTENT OTÁZKY */}
          {contentQuestions.map((question, idx) => renderQuestion(question, idx))}
          
          {/* ✅ FEEDBACK SEKCIA - vizuálne oddelená */}
          {feedbackQuestions.length > 0 && (
            <FeedbackSection>
              <FeedbackTitle>
                📋 Spätná väzba
              </FeedbackTitle>
              <FeedbackSubtitle>
                Pomôžte nám zlepšiť tento dotazník (nepovinné)
              </FeedbackSubtitle>
              
              {visibleFeedbackQuestions.map((question, idx) => 
                renderQuestion(question, contentQuestions.length + idx)
              )}
            </FeedbackSection>
          )}
          
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
            Vyplnené: {answeredContentQuestions} / {visibleContentQuestions.length}
            {feedbackQuestions.length > 0 && ' (Feedback je nepovinný)'}
          </ProgressIndicator>
        </Card>
      </Container>
    </Layout>
  );
};

export default Questionnaire0;
