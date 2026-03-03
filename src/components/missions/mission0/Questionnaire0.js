// src/components/missions/mission0/Questionnaire0.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import DetectiveTipSmall from '../../shared/DetectiveTipSmall';
import { useUserStats } from '../../../contexts/UserStatsContext';
import { getResponseManager } from '../../../utils/ResponseManager';

// ==========================================
// STYLED COMPONENTS
// ==========================================

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
  background: linear-gradient(90deg, ${p => p.theme.ACCENT_COLOR}, ${p => p.theme.ACCENT_COLOR2});
  transition: width 0.3s ease;
  width: ${p => p.progress}%;
`;

const ProgressText = styled.div`
  text-align: center;
  font-size: 15px;
  color: ${p => p.theme.ACCENT_COLOR};
  margin-bottom: 16px;
  font-weight: 600;
`;

const QuestionCard = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.hasError ? '#ff0000' : p.theme.BORDER_COLOR};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  scroll-margin-top: 20px;
  transition: all 0.2s ease;

  ${p => p.hasError && `
    box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.1);
    animation: shake 0.3s ease-in-out;
  `}

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;

const Question = styled.p`
  margin-bottom: 12px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 15px;
  font-weight: 500;
`;

const QuestionError = styled.div`
  color: #ff0000;
  font-size: 13px;
  margin-top: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;

  &:before {
    content: '⚠';
  }
`;

const FeedbackSection = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px dashed ${p => p.theme.BORDER_COLOR};
`;

const FeedbackTitle = styled.h3`
  color: ${p => p.theme.ACCENT_COLOR};
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: '💬';
  }
`;

const FeedbackSubtitle = styled.p`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 13px;
  margin-bottom: 16px;
`;

const PageTitle = styled.h2`
  color: ${p => p.theme.ACCENT_COLOR};
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const PageSubtitle = styled.h3`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 14px;
  font-style: italic;
  margin-bottom: 12px;
`;

const Instruction = styled.p`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.5;
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
  font-size: 15px;
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
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
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
  font-size: 11px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
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
  font-size: 15px;
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
    font-size: 14px;
    padding: 10px;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => p.checked ? `${p.theme.ACCENT_COLOR}15` : 'transparent'};

  &:hover {
    background: ${p => p.theme.HOVER_OVERLAY};
  }

  input {
    margin-right: 12px;
    accent-color: ${p => p.theme.ACCENT_COLOR};
  }
`;

const NumberSelectContainer = styled.div`
  margin-top: 12px;
`;

const NumberSelectInstruction = styled.div`
  font-size: 12px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  margin-bottom: 12px;
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
  font-size: 14px;
  font-weight: ${p => p.checked ? '700' : '600'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${p => p.checked ? `0 2px 8px ${p.theme.ACCENT_COLOR}45` : '0 1px 3px rgba(0,0,0,0.1)'};

  &:hover {
    transform: translateY(-2px);
    border-color: ${p => p.theme.ACCENT_COLOR};
    box-shadow: 0 4px 12px ${p => p.theme.ACCENT_COLOR}60;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 13px;
  }
`;

const SelectedNumbers = styled.div`
  margin-top: 12px;
  padding: 10px 14px;
  background: ${p => p.theme.ACCENT_COLOR}15;
  border: 1px solid ${p => p.theme.ACCENT_COLOR}60;
  border-radius: 8px;
  font-size: 13px;
  color: ${p => p.theme.ACCENT_COLOR};

  strong {
    color: ${p => p.theme.ACCENT_COLOR};
    font-weight: 600;
  }
`;

const LadderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;

const LadderOption = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 2px solid ${p => p.checked ? p.theme.ACCENT_COLOR : p.theme.BORDER_COLOR};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => p.checked ? p.theme.ACCENT_COLOR : 'transparent'};
  color: ${p => p.checked ? '#FFFFFF' : p.theme.PRIMARY_TEXT_COLOR};
  font-weight: ${p => p.checked ? '700' : '500'};

  &:hover {
    background: ${p => p.checked ? p.theme.ACCENT_COLOR : `${p.theme.ACCENT_COLOR}15`};
    border-color: ${p => p.theme.ACCENT_COLOR};
  }

  input {
    display: none;
  }

  span {
    font-size: 16px;
    font-weight: 700;
  }
`;

const PreferNotToSayOption = styled.label`
  display: flex;
  align-items: center;
  padding: 12px;
  margin-top: 8px;
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  cursor: pointer;
  background: ${p => p.checked ? `${p.theme.ACCENT_COLOR}15` : 'transparent'};

  &:hover {
    background: ${p => p.theme.HOVER_OVERLAY};
  }

  input {
    margin-right: 12px;
    accent-color: ${p => p.theme.ACCENT_COLOR};
  }
`;

const BinaryGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

const BinaryOption = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  border: 2px solid ${p => p.checked ? p.theme.ACCENT_COLOR : p.theme.BORDER_COLOR};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => p.checked ? p.theme.ACCENT_COLOR : 'transparent'};
  color: ${p => p.checked ? '#FFFFFF' : p.theme.PRIMARY_TEXT_COLOR};
  font-weight: ${p => p.checked ? '700' : '500'};
  font-size: 15px;

  &:hover {
    background: ${p => p.checked ? p.theme.ACCENT_COLOR : `${p.theme.ACCENT_COLOR}15`};
    border-color: ${p => p.theme.ACCENT_COLOR};
  }

  input {
    display: none;
  }
`;

const ErrorText = styled.div`
  color: #ff0000;
  margin-bottom: 16px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  padding: 12px;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 0, 0, 0.3);
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
  color: ${p => p.theme.ACCENT_COLOR};
  margin-top: 16px;
`;


// ==========================================
// DEFINÍCIA STRÁNOK - importuj z predošlého kódu
// ==========================================

// src/data/surveyPages.js

// Helper funkcia na vytvorenie feedback otázok
const createFeedbackQuestions = (blockId, questionCount) => [
  {
    id: `spatnavazba_${blockId}_oblasti`,
    text: 'V ktorých oblastiach ste mali problémy? (Môžete vybrať viacero možností)',
    type: 'checkbox',
    isFeedback: true,
    required: false,
    options: [
      { value: 'zrozumitelnost', label: 'Zrozumiteľnosť otázok a tvrdení' },
      { value: 'jednoznacnost', label: 'Jednoznačnosť otázok a tvrdení' },
      { value: 'stupnica', label: 'Nevhodnosť hodnoti acej stupnice' },
      { value: 'ine', label: 'Iné problémy' }
    ]
  },
  {
    id: `spatnavazba_${blockId}_zrozumitelnost`,
    text: 'Ktoré otázky a tvrdenia boli menej zrozumiteľné?',
    type: 'number-select',
    isFeedback: true,
    min: 1,
    max: questionCount,
    multiple: true,
    instruction: 'Vyberte čísla otázok a tvrdení',
    required: false,
    showIf: {
      questionId: `spatnavazba_${blockId}_oblasti`,
      operator: 'includes',
      value: 'zrozumitelnost'
    }
  },
  {
    id: `spatnavazba_${blockId}_jednoznacnost`,
    text: 'Ktoré otázky a tvrdenia boli menej jednoznačné (slová, pojmy, formulácia...)?',
    type: 'number-select',
    isFeedback: true,
    min: 1,
    max: questionCount,
    multiple: true,
    instruction: 'Vyberte čísla otázok a tvrdení',
    required: false,
    showIf: {
      questionId: `spatnavazba_${blockId}_oblasti`,
      operator: 'includes',
      value: 'jednoznacnost'
    }
  },
  {
    id: `spatnavazba_${blockId}_stupnica`,
    text: 'V ktorých otázkach a tvrdeniach ste mali problém vyjadriť svoj skutočný postoj vzhľadom na hodnotiacu stupnicu?',
    type: 'number-select',
    isFeedback: true,
    min: 1,
    max: questionCount,
    multiple: true,
    instruction: 'Vyberte čísla otázok a tvrdení',
    required: false,
    showIf: {
      questionId: `spatnavazba_${blockId}_oblasti`,
      operator: 'includes',
      value: 'stupnica'
    }
  },
  {
    id: `spatnavazba_${blockId}_ine`,
    text: 'Popíšte iné problémy, ktoré ste mali s otázkami a tvrdeniami v tejto časti:',
    type: 'textarea',
    isFeedback: true,
    placeholder: 'Popíšte iné problémy...',
    required: false,
    showIf: {
      questionId: `spatnavazba_${blockId}_oblasti`,
      operator: 'includes',
      value: 'ine'
    }
  }
];

// ==========================================
// DEFINÍCIA 9 STRÁNOK DOTAZNÍKA
// ==========================================

const PAGES = [
  // ==========================================
  // STRANA 1: DEMOGRAFIA
  // ==========================================
  {
    id: 'demografia',
    title: 'Demografia',
    instruction: 'Nasleduje séria otázok o Vás. Tieto informácie nám pomôžu pochopiť, ako sa líšia názory a skúsenosti medzi rôznymi skupinami ľudí. Všetky vaše odpovede sú anonymné a budú použité výlučne na výskumné účely.',
    questions: [
      {
        id: 'd1_pohlavie',
        text: 'Vyberte Vaše pohlavie:',
        type: 'radio',
        required: true,
        options: [
          { value: 'muz', label: 'Muž' },
          { value: 'zena', label: 'Žena' }
        ]
      },
      {
        id: 'd2_vek',
        text: 'Zadajte Váš vek:',
        type: 'number',
        required: true,
        min: 18,
        max: 120,
        placeholder: 'Vek'
      },
      {
        id: 'd3_vzdelanie',
        text: 'Vyberte Vaše najvyššie dosiahnuté vzdelanie:',
        type: 'radio',
        required: true,
        options: [
          { value: 'zakladne', label: 'Základné vzdelanie' },
          { value: 'nizsie_stredne', label: 'Nižšie stredné odborné vzdelanie (bez maturity)' },
          { value: 'uplne_stredne', label: 'Úplné stredné vzdelanie (s maturitou)' },
          { value: 'vyssie_odborne', label: 'Vyššie odborné vzdelanie' },
          { value: 'vs_bc', label: 'Vysokoškolské vzdelanie 1. stupňa (bakalárske)' },
          { value: 'vs_mgr', label: 'Vysokoškolské vzdelanie 2. stupňa (magisterské, inžinierske, doktorské)' },
          { value: 'vs_phd', label: 'Vysokoškolské vzdelanie 3. stupňa (doktorandské)' }
        ]
      },
      {
        id: 'd4_pracovna_situacia',
        text: 'Vyberte Vašu aktuálnu pracovnú situáciu:',
        type: 'radio',
        required: true,
        hasOther: true,
        options: [
          { value: 'plny_uvazok', label: 'Zamestnaný/á na plný úväzok' },
          { value: 'skrateny_uvazok', label: 'Zamestnaný/á na skrátený úväzok' },
          { value: 'volna_noha', label: 'Práca na voľnej nohe / podnikateľ' },
          { value: 'student', label: 'Študent/ka' },
          { value: 'dochodok', label: 'Starobný dôchodok' },
          { value: 'materska', label: 'Na materskej / otcovskej dovolenke' },
          { value: 'nezamestnany', label: 'Nezamestnaný/á' }
        ],
        otherLabel: 'Iné (prosím špecifikujte):'
      },
      {
        id: 'd5_rodinny_stav',
        text: 'Vyberte Váš aktuálny rodinný stav:',
        type: 'radio',
        required: true,
        options: [
          { value: 'slobodny', label: 'Slobodný/á bez partnera' },
          { value: 'manzelstvo', label: 'V manželstve / registrovanom partnerstve' },
          { value: 'partnerstvo', label: 'V partnerskom vzťahu (bez formálneho zväzku)' },
          { value: 'rozvedeny', label: 'Rozvedený/á' },
          { value: 'ovdoveny', label: 'Ovdovený/á' },
          { value: 'neuvadzat', label: 'Preferujem neuvádzať' }
        ]
      },
      {
        id: 'd6_miesto_bydliska',
        text: 'Vyberte región z ktorého pochádzate:',
        type: 'radio',
        required: true,
        hasOther: true,
        options: [
          { value: 'zapadne', label: 'Západné Slovensko (napr. Trnava, Nitra, Trenčín)' },
          { value: 'stredne', label: 'Stredné Slovensko (napr. Zvolen, Banská Bystrica, Lučenec)' },
          { value: 'vychodne', label: 'Východné Slovensko (napr. Košice, Prešov)' }
        ],
        otherLabel: 'Iné (prosím špecifikujte):'
      },
      {
        id: 'd7_socialny_rebrik',
        text: 'Predstavte si, že tento rebrík predstavuje postavenie ľudí na Slovensku. Na úplnom vrchole rebríka sú ľudia, ktorí sú na tom najlepšie. Ľudia ktorí majú najviac peňazí, najlepšie vzdelanie, a najrešpektovanejšiu prácu. Na spodu rebríka sú ľudia, ktorí sú na tom najhoršie. Ľudia, ktorí majú najmenej peňazí, najhoršie vzdelanie, a najmenej rešpektovanú prácu, poprípade žiadnu prácu. Čím vyššie ste v tomto rebríku, tým bližšie ste ľuďom na úplnom vrchole a čím ste nižšie, tým ste bližšie ľuďom na samom spodku. Prosím, vyberte si číslo priečky rebríka, na ktorej si myslíte, že vo svojom živote aktuálne ste, v porovnaní s ostatnými ľuďmi na Slovensku.',
        type: 'ladder',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        scaleLabels: { min: 'Najnižší status', max: 'Najvyšší status' },
        hasPreferNotToSay: true
      },
      {
        id: 'd8_politicka_orientacia',
        text: 'Kam by ste sa zaradili na politickom spektre od konzervatívneho po liberálne orientovaného človeka?',
        type: 'radio',
        required: true,
        options: [
          { value: 'liberalne', label: 'Liberálne orientovaný/á' },
          { value: 'centralne', label: 'Centrálne orientovaný/á' },
          { value: 'konzervativne', label: 'Konzervatívne orientovaný/á' },
          { value: 'neuvadzat', label: 'Preferujem neuvádzať' }
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 2: RELIGIOZITA + MÉDIÁ (TV)
  // ==========================================
  {
    id: 'religiozita_media_tv',
    title: 'Religiozita a Médiá',
    subtitle: 'Koenig & Büssing, 2010',
    instruction: 'Nasledujúce otázky sa týkajú Vášho vzťahu k náboženstvu. Neexistujú správne alebo nesprávne odpovede.',
    questions: [
      {
        id: 'ora1_navsteva_kostola',
        text: 'Ako často navštevujete kostol alebo iné náboženské stretnutia?',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6],
        scaleValueLabels: [
          'Nikdy',
          'Raz za rok alebo menej',
          'Niekoľkokrát za rok',
          'Niekoľkokrát za mesiac',
          'Raz týždenne',
          'Viackrát týždenne'
        ]
      },
      {
        id: 'nora1_sukromne_aktivity',
        text: 'Ako často sa venujete súkromným náboženským aktivitám (modlitba, meditácia, čítanie svätých textov)?',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6],
        scaleValueLabels: [
          'Nikdy',
          'Raz za rok alebo menej',
          'Niekoľkokrát za rok',
          'Niekoľkokrát za mesiac',
          'Raz týždenne',
          'Viackrát týždenne'
        ]
      },
      {
        id: 'ir1_pritomnost_boha',
        text: 'Vo svojom živote prežívam prítomnosť Boha alebo niečoho vyššieho.',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5],
        scaleValueLabels: [
          'Rozhodne to o mne neplatí',
          'Skôr to o mne neplatí',
          'Nie som si istý/á',
          'Skôr to o mne platí',
          'Rozhodne to o mne platí'
        ]
      },
      {
        id: 'ir2_zaklad_pristupu',
        text: 'Moje náboženské presvedčenia sú základom môjho prístupu k životu.',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5],
        scaleValueLabels: [
          'Rozhodne to o mne neplatí',
          'Skôr to o mne neplatí',
          'Nie som si istý/á',
          'Skôr to o mne platí',
          'Rozhodne to o mne platí'
        ]
      },
      {
        id: 'ir3_prenasanie',
        text: 'Snažím sa prenášať svoje náboženstvo do všetkých oblastí môjho života.',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5],
        scaleValueLabels: [
          'Rozhodne to o mne neplatí',
          'Skôr to o mne neplatí',
          'Nie som si istý/á',
          'Skôr to o mne platí',
          'Rozhodne to o mne platí'
        ]
      },
      // MÉDIÁ - TV spravodajstvo
      {
        id: 'ts1_markiza',
        text: 'Televízne noviny TV Markíza',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'ts2_stvr',
        text: 'Správy STVR',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'ts3_joj',
        text: 'Noviny TV JOJ',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'ts4_ta3',
        text: 'Správy TA3',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 3: MÉDIÁ (ONLINE + ALTERNATÍVNE)
  // ==========================================
  {
    id: 'media_online_alternativne',
    title: 'Frekvencia používania médií',
    subtitle: 'Online médiá a alternatívne zdroje',
    instruction: 'Nasleduje zoznam rôznych médií a platforiem, z ktorých môžete získavať informácie (napríklad o spoločenskom dianí, politike, zdraví, ekonomike a pod.). Pri každom médiu označte, ako často ho používate ako zdroj informácií. Ak dané médium vôbec nepoznáte alebo ho nepoužívate, označte prosím "1. Nikdy". Neexistujú správne alebo nesprávne odpovede.',
    questions: [
      // Online a tlač
      {
        id: 'ot1_sme',
        text: 'SME',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'ot2_dennikn',
        text: 'Denník N',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'ot3_pravda',
        text: 'Pravda',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'ot4_aktuality',
        text: 'Aktuality',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'ot5_novycas',
        text: 'Nový Čas',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'ot6_hn',
        text: 'Hospodárske noviny',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'ot7_postoj',
        text: 'Postoj',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'ot8_trend',
        text: 'Trend',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      // Alternatívne médiá
      {
        id: 'am1_hlavne_spravy',
        text: 'Hlavné správy',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'am2_zem_vek',
        text: 'Zem a vek',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'am3_slobodny',
        text: 'Slobodný vysielač',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'am4_protiprud',
        text: 'Protiprúd',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'am5_extraplus',
        text: 'Extraplus',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'am6_infovojna',
        text: 'Infovojna',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'am7_parlamentne',
        text: 'Parlamentné listy',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'am8_vasa_pravda',
        text: 'Vaša pravda',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 4: MÉDIÁ (SOCIÁLNE) + TOLERANCIA
  // ==========================================
  {
    id: 'media_social_tolerancia',
    title: 'Sociálne médiá a Tolerancia',
    instruction: 'Pri každom médiu označte, ako často ho používate ako zdroj informácií.',
    questions: [
      // Sociálne médiá
      {
        id: 'sm1_facebook',
        text: 'Facebook',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'sm2_youtube',
        text: 'YouTube',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'sm3_instagram',
        text: 'Instagram',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'sm4_tiktok',
        text: 'TikTok',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'sm5_telegram',
        text: 'Telegram',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'sm6_twitter',
        text: 'X (Twitter)',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Nikdy',
          'Menej ako raz mesačne',
          'Približne raz mesačne',
          'Niekoľkokrát mesačne',
          'Približne raz týždenne',
          'Niekoľkokrát týždenne',
          'Denne'
        ]
      },
      {
        id: 'ost1_ine_media',
        text: 'Iné spravodajské weby alebo platformy, ktoré používam často:',
        type: 'text',
        required: false,
        placeholder: 'Prosím uveďte'
      },
      // TOLERANCIA - Autonómia
      {
        id: 'ac1',
        text: 'Ľudia by mali mať právo žiť, ako chcú.',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'ac2',
        text: 'Je dôležité, aby ľudia mali slobodu žiť svoj život tak, ako si vyberú.',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'ac3',
        text: 'Ľudia môžu žiť ako chcú, pokiaľ neubližujú iným.',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      // TOLERANCIA - Rešpekt
      {
        id: 'r1',
        text: 'Rešpektujem presvedčenia a názory iných ľudí.',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'r2',
        text: 'Mám rešpekt voči presvedčeniam a názorom iných ľudí, aj keď s nimi nesúhlasím.',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'r3',
        text: 'Vadí mi, že niektorí ľudia majú iné tradície a spôsob života.',
        type: 'likert',
        required: true,
        reverse: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      // TOLERANCIA - Aprecácia
      {
        id: 'ap1',
        text: 'Rád/a trávim čas s ľuďmi, ktorí sú iní ako ja.',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'ap2',
        text: 'Mám rád/a ľudí, ktorí ma podnecujú, aby som rozmýšľal/a o svete iným spôsobom.',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'ap3',
        text: 'Rozmanitosť tradícií a spôsobov života je prínosom pre našu spoločnosť.',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 5: KONŠPIRAČNÁ MENTALITA + SYMBOLICKÉ OHROZENIE
  // ==========================================
  {
    id: 'mentalita_hrozba',
    title: 'Konšpiračná mentalita a vnímanie hrozby',
    subtitle: 'Mikušková, 2018; Šrol & Čavojová, 2025',
    instruction: 'Nižšie nájdete sériu tvrdení. Pri každom tvrdení prosím vyjadrite, do akej miery s ním súhlasíte, na škále od 1 do 7. Neexistujú správne alebo nesprávne odpovede.',
    questions: [
      // KONŠPIRAČNÁ MENTALITA
      {
        id: 'km1',
        text: 'Myslím si, že sa vo svete dejú mnohé veľmi dôležité veci, o ktorých sa verejnosť nikdy nedozvie',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'km2',
        text: 'Myslím si, že politici zvyčajne nehovoria ľuďom skutočné motívy svojich rozhodnutí',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'km3',
        text: 'Myslím si, že vládne agentúry úzko monitorujú všetkých občanov',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'km4',
        text: 'Myslím si, že udalosti, ktoré sa na prvý pohľad zdajú nesúvisiace, sú často výsledkom tajných aktivít',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'km5',
        text: 'Myslím si, že existujú tajné organizácie, ktoré veľmi vplývajú na politické rozhodnutia',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      // SYMBOLICKÉ OHROZENIE - Medzinárodné
      {
        id: 'sh1_zapadne',
        text: 'Západné spoločnosti a ich spôsob života',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5],
        scaleValueLabels: [
          'Vôbec neohrozuje moju identitu a hodnoty',
          'Skôr neohrozuje moju identitu a hodnoty',
          'Neutrálny postoj',
          'Skôr ohrozuje moju identitu a hodnoty',
          'Veľmi ohrozuje moju identitu a hodnoty'
        ]
      },
      {
        id: 'sh2_eu',
        text: 'Európska únia',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5],
        scaleValueLabels: [
          'Vôbec neohrozuje moju identitu a hodnoty',
          'Skôr neohrozuje moju identitu a hodnoty',
          'Neutrálny postoj',
          'Skôr ohrozuje moju identitu a hodnoty',
          'Veľmi ohrozuje moju identitu a hodnoty'
        ]
      },
      {
        id: 'sh3_usa',
        text: 'Spojené štáty americké',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5],
        scaleValueLabels: [
          'Vôbec neohrozuje moju identitu a hodnoty',
          'Skôr neohrozuje moju identitu a hodnoty',
          'Neutrálny postoj',
          'Skôr ohrozuje moju identitu a hodnoty',
          'Veľmi ohrozuje moju identitu a hodnoty'
        ]
      },
      {
        id: 'sh4_rusko',
        text: 'Ruská federácia',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5],
        scaleValueLabels: [
          'Vôbec neohrozuje moju identitu a hodnoty',
          'Skôr neohrozuje moju identitu a hodnoty',
          'Neutrálny postoj',
          'Skôr ohrozuje moju identitu a hodnoty',
          'Veľmi ohrozuje moju identitu a hodnoty'
        ]
      },
      {
        id: 'sh5_ukrajina',
        text: 'Ukrajina',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5],
        scaleValueLabels: [
          'Vôbec neohrozuje moju identitu a hodnoty',
          'Skôr neohrozuje moju identitu a hodnoty',
          'Neutrálny postoj',
          'Skôr ohrozuje moju identitu a hodnoty',
          'Veľmi ohrozuje moju identitu a hodnoty'
        ]
      },
      {
        id: 'sh6_izrael',
        text: 'Izrael',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5],
        scaleValueLabels: [
          'Vôbec neohrozuje moju identitu a hodnoty',
          'Skôr neohrozuje moju identitu a hodnoty',
          'Neutrálny postoj',
          'Skôr ohrozuje moju identitu a hodnoty',
          'Veľmi ohrozuje moju identitu a hodnoty'
        ]
      },
      {
        id: 'sh7_palestina',
        text: 'Palestína',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5],
        scaleValueLabels: [
          'Vôbec neohrozuje moju identitu a hodnoty',
          'Skôr neohrozuje moju identitu a hodnoty',
          'Neutrálny postoj',
          'Skôr ohrozuje moju identitu a hodnoty',
          'Veľmi ohrozuje moju identitu a hodnoty'
        ]
      },
      // SYMBOLICKÉ OHROZENIE - Domáce
      {
        id: 'sh8_vlada',
        text: 'Vláda Slovenskej Republiky',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5],
        scaleValueLabels: [
          'Vôbec neohrozuje moju identitu a hodnoty',
          'Skôr neohrozuje moju identitu a hodnoty',
          'Neutrálny postoj',
          'Skôr ohrozuje moju identitu a hodnoty',
          'Veľmi ohrozuje moju identitu a hodnoty'
        ]
      },
      {
        id: 'sh9_zahranicni',
        text: 'Narastajúce množstvo zahraničných ľudí na Slovensku',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5],
        scaleValueLabels: [
          'Vôbec neohrozuje moju identitu a hodnoty',
          'Skôr neohrozuje moju identitu a hodnoty',
          'Neutrálny postoj',
          'Skôr ohrozuje moju identitu a hodnoty',
          'Veľmi ohrozuje moju identitu a hodnoty'
        ]
      },
      {
        id: 'sh10_utecenci',
        text: 'Ukrajinskí utečenci na Slovensku',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5],
        scaleValueLabels: [
          'Vôbec neohrozuje moju identitu a hodnoty',
          'Skôr neohrozuje moju identitu a hodnoty',
          'Neutrálny postoj',
          'Skôr ohrozuje moju identitu a hodnoty',
          'Veľmi ohrozuje moju identitu a hodnoty'
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 6: DÔVERA V EÚ
  // ==========================================
  {
    id: 'dovera',
    title: 'Dôvera',
    subtitle: 'European Union, 2026',
    instruction: 'Nižšie nájdete zoznam rôznych inštitúcií. Pri každej inštitúcií prosím vyjadrite, do akej miery im dôverujete, na škále od 1 do 7. Neexistujú správne alebo nesprávne odpovede.',
    questions: [
      // INŠTITUCIONÁLNA DÔVERA
      {
        id: 'id1_parlament',
        text: 'Európsky parlament',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Absolútne nedôverujem',
          'Väčšinou nedôverujem',
          'Skôr nedôverujem',
          'Neutrálny postoj / neviem',
          'Skôr dôverujem',
          'Väčšinou dôverujem',
          'Absolútne dôverujem'
        ]
      },
      {
        id: 'id2_europska_rada',
        text: 'Európska rada',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Absolútne nedôverujem',
          'Väčšinou nedôverujem',
          'Skôr nedôverujem',
          'Neutrálny postoj / neviem',
          'Skôr dôverujem',
          'Väčšinou dôverujem',
          'Absolútne dôverujem'
        ]
      },
      {
        id: 'id3_rada_eu',
        text: 'Rada Európskej únie',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Absolútne nedôverujem',
          'Väčšinou nedôverujem',
          'Skôr nedôverujem',
          'Neutrálny postoj / neviem',
          'Skôr dôverujem',
          'Väčšinou dôverujem',
          'Absolútne dôverujem'
        ]
      },
      {
        id: 'id4_komisia',
        text: 'Európska komisia',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Absolútne nedôverujem',
          'Väčšinou nedôverujem',
          'Skôr nedôverujem',
          'Neutrálny postoj / neviem',
          'Skôr dôverujem',
          'Väčšinou dôverujem',
          'Absolútne dôverujem'
        ]
      },
      {
        id: 'id5_sudny_dvor',
        text: 'Súdny dvor Európskej únie',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Absolútne nedôverujem',
          'Väčšinou nedôverujem',
          'Skôr nedôverujem',
          'Neutrálny postoj / neviem',
          'Skôr dôverujem',
          'Väčšinou dôverujem',
          'Absolútne dôverujem'
        ]
      },
      {
        id: 'id6_ecb',
        text: 'Európska centrálna banka',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Absolútne nedôverujem',
          'Väčšinou nedôverujem',
          'Skôr nedôverujem',
          'Neutrálny postoj / neviem',
          'Skôr dôverujem',
          'Väčšinou dôverujem',
          'Absolútne dôverujem'
        ]
      },
      {
        id: 'id7_dvor_auditorov',
        text: 'Európsky dvor audítorov',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Absolútne nedôverujem',
          'Väčšinou nedôverujem',
          'Skôr nedôverujem',
          'Neutrálny postoj / neviem',
          'Skôr dôverujem',
          'Väčšinou dôverujem',
          'Absolútne dôverujem'
        ]
      },
      // SYSTÉMOVÁ DÔVERA
      {
        id: 'sd1_transparentnost',
        text: 'Procesy rozhodovania v EÚ sú transparentné a demokratické',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Absolútne nedôverujem',
          'Väčšinou nedôverujem',
          'Skôr nedôverujem',
          'Neutrálny postoj / neviem',
          'Skôr dôverujem',
          'Väčšinou dôverujem',
          'Absolútne dôverujem'
        ]
      },
      {
        id: 'sd2_financovanie',
        text: 'Financovanie EÚ (eurofondy, dotácie) sú spravodlivo rozdeľované',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Absolútne nedôverujem',
          'Väčšinou nedôverujem',
          'Skôr nedôverujem',
          'Neutrálny postoj / neviem',
          'Skôr dôverujem',
          'Väčšinou dôverujem',
          'Absolútne dôverujem'
        ]
      },
      {
        id: 'sd3_respekt',
        text: 'EÚ rešpektuje kultúrne a národné odlišnosti členských štátov',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Absolútne nedôverujem',
          'Väčšinou nedôverujem',
          'Skôr nedôverujem',
          'Neutrálny postoj / neviem',
          'Skôr dôverujem',
          'Väčšinou dôverujem',
          'Absolútne dôverujem'
        ]
      },
      {
        id: 'sd4_prospech',
        text: 'Rozhodnutia EÚ sú v prospech bežných občanov',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Absolútne nedôverujem',
          'Väčšinou nedôverujem',
          'Skôr nedôverujem',
          'Neutrálny postoj / neviem',
          'Skôr dôverujem',
          'Väčšinou dôverujem',
          'Absolútne dôverujem'
        ]
      },
      {
        id: 'sd5_efektivita',
        text: 'EÚ je schopná efektívne riešiť problémy (klíma, bezpečnosť, ekonomika)',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Absolútne nedôverujem',
          'Väčšinou nedôverujem',
          'Skôr nedôverujem',
          'Neutrálny postoj / neviem',
          'Skôr dôverujem',
          'Väčšinou dôverujem',
          'Absolútne dôverujem'
        ]
      },
      {
        id: 'sd6_sluby',
        text: 'EÚ plní svoje sľuby a dodržiava pravidlá',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Absolútne nedôverujem',
          'Väčšinou nedôverujem',
          'Skôr nedôverujem',
          'Neutrálny postoj / neviem',
          'Skôr dôverujem',
          'Väčšinou dôverujem',
          'Absolútne dôverujem'
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 7: KONŠPIRAČNÉ PRESVEDČENIA (EP)
  // ==========================================
  {
    id: 'konspiracne_presvedcenia_ep',
    title: 'Konšpiračné presvedčenia o EÚ',
    subtitle: 'Bojovic, (2021); European Commission Representation in Slovakia',
    instruction: 'Nižšie nájdete sériu tvrdení. Pri každom tvrdení prosím vyjadrite, do akej miery s ním súhlasíte, na škále od 1 do 7. Neexistujú správne alebo nesprávne odpovede.',
    questions: [
      {
        id: 'ep1',
        text: 'Európska únia má skrytý plán systematicky zničiť suverenitu členských štátov',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'ep2',
        text: 'Rozhodnutia EÚ sú transparentné a robené Európskym parlamentom a zvolenými poslancami',
        type: 'likert',
        required: true,
        reverse: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'ep3',
        text: 'Európske inštitúcie a mainstreamové médiá spolupracujú na tom, aby pred občanmi zatajili skutočné negatívne dôsledky rozhodnutí EÚ',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'ep4',
        text: 'EÚ rešpektuje a chráni národné kultúry a tradície všetkých členských štátov',
        type: 'likert',
        required: true,
        reverse: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'ep5',
        text: 'EÚ zámerne obchádza demokratické procesy a ignoruje vôľu občanov, pretože sú riadené skrytou agendou globálnych elít',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'ep6',
        text: 'Regulácie EÚ sú navrhnuté aby chránili hospodárstvo všetkých členských štátov vrátane Slovenska, nie aby mu ublížili',
        type: 'likert',
        required: true,
        reverse: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'ep7',
        text: 'Migračná kríza bola naplánovaná autoritami EÚ',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 8: KONŠPIRAČNÉ PRESVEDČENIA (EPV) + PLACEBO
  // ==========================================
  {
    id: 'konspiracne_presvedcenia_epv_placebo',
    title: 'Konšpiračné presvedčenia o EÚ a kontrolné otázky',
    subtitle: 'Variované položky',
    instruction: 'Nižšie nájdete sériu tvrdení. Pri každom tvrdení prosím vyjadrite, do akej miery s ním súhlasíte, na škále od 1 do 7. Neexistujú správne alebo nesprávne odpovede.',
    questions: [
      // EPV
      {
        id: 'epv1',
        text: 'Štáty si zachovávajú svoju suverenitu v rámci EÚ',
        type: 'likert',
        required: true,
        reverse: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'epv2',
        text: 'Rozhodnutia EÚ v skutočnosti nerobí Európsky parlament, ale tajná skupina globálnych elít a veľkých korporácií',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'epv3',
        text: 'Európske inštitúcie a mainstreamové médiá transparentne informujú občanov o rozhodnutiach EÚ',
        type: 'likert',
        required: true,
        reverse: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'epv4',
        text: 'EÚ má skrytý plán na zničenie národných kultúr a tradícií v prospech multikulturalizmu a liberálnych hodnôt',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'epv5',
        text: 'Všetky rozhodnutia EÚ sú prijaté v plne transparentných procesoch, kde všetci poslanci verejne hlasujú, a žiadna krajina nie je nútená ich nasledovať.',
        type: 'likert',
        required: true,
        reverse: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'epv6',
        text: 'EÚ vedome zavádza škodlivé regulácie s cieľom ekonomicky zničiť Slovensko a prinútiť nás byť úplne závislí na Bruseli',
        type: 'likert',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'epv7',
        text: 'Migračná kríza bola prirodzená udalosť, nie naplánovaná autoritami EÚ',
        type: 'likert',
        required: true,
        reverse: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      // PLACEBO TVRDENIA
      {
        id: 'pt1',
        text: 'Slovensko je členským štátom Európskej únie',
        type: 'likert',
        required: true,
        isPlacebo: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'pt2',
        text: 'Európska únia je geograficky situovaná na Severnom Americkom kontinente',
        type: 'likert',
        required: true,
        isPlacebo: true,
        reverse: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'pt3',
        text: 'Euro (€) je jednotná mena používaná väčšinou členských štátov Európskej únie',
        type: 'likert',
        required: true,
        isPlacebo: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'pt4',
        text: 'Bratislava je hlavné mesto Slovenska',
        type: 'likert',
        required: true,
        isPlacebo: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'pt5',
        text: 'Na Slovensku sa aktuálne platí Slovenskou Korunou (SK)',
        type: 'likert',
        required: true,
        isPlacebo: true,
        reverse: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      },
      {
        id: 'pt6',
        text: 'Poslanci do Európskeho parlamentu sa volia',
        type: 'likert',
        required: true,
        isPlacebo: true,
        scale: [1, 2, 3, 4, 5, 6, 7],
        scaleValueLabels: [
          'Rozhodne nesúhlasím',
          'Väčšinou nesúhlasím',
          'Skôr nesúhlasím',
          'Neutrálny postoj / Neviem',
          'Skôr súhlasím',
          'Väčšinou súhlasím',
          'Rozhodne súhlasím'
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 9: SOCIÁLNA ŽIADOSTIVOSŤ
  // ==========================================
  {
    id: 'socialna_ziadostivost',
    title: 'Sociálna žiadostivosť',
    subtitle: 'Reynolds, 1982',
    instruction: 'Nižšie nájdete sériu tvrdení. Prečítajte si každé tvrdenie pozorne a rozhodnite sa, či je pre Vás pravdivé alebo nepravdivé. Nie sú tu správne alebo nesprávne odpovede – ide o to, ako vnímatenasami seba. Označte vašu odpoveď kliknutím na tlačidlo "Pravda" alebo "Nepravda" vedľa každého tvrdenia. Všetky vaše odpovede zostanú anonymné a budú použité výlučne na výskumné účely.',
    questions: [
      {
        id: 'sds1',
        text: 'Niekedy je pre mňa ťažké pokračovať v práci, ak ma nikto nepodporí',
        type: 'binary',
        required: true,
        options: [
          { value: 'pravda', label: 'Pravda' },
          { value: 'nepravda', label: 'Nepravda' }
        ]
      },
      {
        id: 'sds2',
        text: 'Niekedy sa cítim rozčúlený/rozčúlená, keď si nemôžem dosiahnuť to, čo chcem',
        type: 'binary',
        required: true,
        options: [
          { value: 'pravda', label: 'Pravda' },
          { value: 'nepravda', label: 'Nepravda' }
        ]
      },
      {
        id: 'sds3',
        text: 'Niekoľkokrát som sa vzdal/vzdala robenia niečoho, pretože som nemal/mala dôveru v svoje schopnosti',
        type: 'binary',
        required: true,
        options: [
          { value: 'pravda', label: 'Pravda' },
          { value: 'nepravda', label: 'Nepravda' }
        ]
      },
      {
        id: 'sds4',
        text: 'Boli časy, keď som sa chcel/chcela búriť voči ľuďom vo funkcii, aj keď som vedel/vedela, že majú pravdu',
        type: 'binary',
        required: true,
        options: [
          { value: 'pravda', label: 'Pravda' },
          { value: 'nepravda', label: 'Nepravda' }
        ]
      },
      {
        id: 'sds5',
        text: 'Bez ohľadu na to, s kým som v rozhovore, som vždy dobrý/dobrá poslucháč/poslucháčka',
        type: 'binary',
        required: true,
        reverse: true,
        options: [
          { value: 'pravda', label: 'Pravda' },
          { value: 'nepravda', label: 'Nepravda' }
        ]
      },
      {
        id: 'sds6',
        text: 'Boli okamžiky, keď som zneužil/zneužila niekoho',
        type: 'binary',
        required: true,
        options: [
          { value: 'pravda', label: 'Pravda' },
          { value: 'nepravda', label: 'Nepravda' }
        ]
      },
      {
        id: 'sds7',
        text: 'Vždy som ochotný/ochotná priznať, keď spravím chybu',
        type: 'binary',
        required: true,
        reverse: true,
        options: [
          { value: 'pravda', label: 'Pravda' },
          { value: 'nepravda', label: 'Nepravda' }
        ]
      },
      {
        id: 'sds8',
        text: 'Niekedy sa pokúšam pomstiť sa namiesto toho, aby som odpustil/odpustila a zabudol/zabudla',
        type: 'binary',
        required: true,
        options: [
          { value: 'pravda', label: 'Pravda' },
          { value: 'nepravda', label: 'Nepravda' }
        ]
      },
      {
        id: 'sds9',
        text: 'Som vždy zdvorilostný/zdvorilostná, dokonca aj voči ľuďom, ktorí sú nepriaznivo naladení',
        type: 'binary',
        required: true,
        reverse: true,
        options: [
          { value: 'pravda', label: 'Pravda' },
          { value: 'nepravda', label: 'Nepravda' }
        ]
      },
      {
        id: 'sds10',
        text: 'Nikdy som sa nehneval/nenahnevala, keď ľudia vyjadrili nápady veľmi odlišné od tých mojich',
        type: 'binary',
        required: true,
        reverse: true,
        options: [
          { value: 'pravda', label: 'Pravda' },
          { value: 'nepravda', label: 'Nepravda' }
        ]
      },
      {
        id: 'sds11',
        text: 'Boli časy, keď som bol/bola dosť žiarlivý/žiarlivá na dobrú náladu druhých',
        type: 'binary',
        required: true,
        options: [
          { value: 'pravda', label: 'Pravda' },
          { value: 'nepravda', label: 'Nepravda' }
        ]
      },
      {
        id: 'sds12',
        text: 'Niekedy som rozčúlený/rozčúlená, keď ľudia odo mňa niečo chcú',
        type: 'binary',
        required: true,
        options: [
          { value: 'pravda', label: 'Pravda' },
          { value: 'nepravda', label: 'Nepravda' }
        ]
      },
      {
        id: 'sds13',
        text: 'Nikdy som úmyselne nepovedal/nepovedala niečo, čo by niekoho zranilo',
        type: 'binary',
        required: true,
        reverse: true,
        options: [
          { value: 'pravda', label: 'Pravda' },
          { value: 'nepravda', label: 'Nepravda' }
        ]
      }
    ]
  }
].map(page => ({
  ...page,
  questions: [
    ...page.questions,
    ...createFeedbackQuestions(page.id, page.questions.filter(q => !q.isFeedback).length)
  ]
}));

export { PAGES, createFeedbackQuestions };


// ==========================================
// HLAVNÝ KOMPONENT
// ==========================================

const COMPONENT_ID = 'mission0_questionnaire';

const Questionnaire0 = () => {
  const navigate = useNavigate();
  const { dataManager, userId } = useUserStats();
  const responseManager = getResponseManager(dataManager);

  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [questionErrors, setQuestionErrors] = useState({});
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionRefs = useRef({});

  // Načítanie uložených odpovedí
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

  // Reset errors pri zmene stránky
  useEffect(() => {
    setQuestionErrors({});
    setError('');
  }, [currentPage]);

  // Funkcia na kontrolu podmienok zobrazenia otázky
  const shouldShowQuestion = (question, responses) => {
    if (!question.showIf) return true;

    const { questionId, value, operator = '==' } = question.showIf;
    const responseValue = responses[questionId];

    if (responseValue === undefined || responseValue === null) return false;

    switch (operator) {
      case 'includes':
        return Array.isArray(responseValue) && responseValue.includes(value);
      case '==':
        return responseValue === value;
      case '!=':
        return responseValue !== value;
      case '>':
        return responseValue > value;
      case '<':
        return responseValue < value;
      default:
        return false;
    }
  };

  // Zmena odpovede
  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    setQuestionErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  };

  // Checkbox handler
  const handleCheckboxChange = (questionId, optionValue) => {
    setAnswers(prev => {
      const currentValues = prev[questionId] || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      return { ...prev, [questionId]: newValues };
    });
    setQuestionErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  };

  // Number select handler
  const handleNumberSelect = (questionId, number, multiple) => {
    if (multiple) {
      setAnswers(prev => {
        const currentValues = prev[questionId] || [];
        const newValues = currentValues.includes(number)
          ? currentValues.filter(n => n !== number)
          : [...currentValues, number].sort((a, b) => a - b);
        return { ...prev, [questionId]: newValues };
      });
    } else {
      handleAnswer(questionId, number);
    }
  };

  // Validácia stránky
  const validatePage = () => {
    const page = PAGES[currentPage];
    const errors = {};
    let hasError = false;

    page.questions.forEach(question => {
      // Skip ak je podmienečná a nemá byť zobrazená
      if (!shouldShowQuestion(question, answers)) return;

      // Skip ak nie je required
      if (!question.required) return;

      const answer = answers[question.id];

      // Kontrola prázdnych odpovedí
      if (answer === undefined || answer === null || answer === '') {
        errors[question.id] = 'Táto otázka je povinná';
        hasError = true;
      }

      // Kontrola prázdnych polí pre checkbox
      if (question.type === 'checkbox' && (!Array.isArray(answer) || answer.length === 0)) {
        errors[question.id] = 'Vyberte aspoň jednu možnosť';
        hasError = true;
      }
    });

    setQuestionErrors(errors);

    if (hasError) {
      setError('Prosím vyplňte všetky povinné otázky');
      // Scroll na prvú chybu
      const firstErrorId = Object.keys(errors)[0];
      if (firstErrorId && questionRefs.current[firstErrorId]) {
        questionRefs.current[firstErrorId].scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }

    return !hasError;
  };

  // Ďalšia strana
  const handleNext = async () => {
    if (!validatePage()) return;

    // Uložiť odpovede
    await responseManager.saveResponses(userId, COMPONENT_ID, answers);

    if (currentPage < PAGES.length - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Odoslať dotazník
      handleSubmit();
    }
  };

  // Predošlá strana
  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Odoslanie dotazníka
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      await responseManager.submitResponses(userId, COMPONENT_ID, {
        answers,
        metadata: {
          timeSpent,
          completedAt: new Date().toISOString()
        }
      });

      // Označiť komponent ako dokončený
      await dataManager.markComponentComplete(userId, COMPONENT_ID);

      // Presmerovanie
      navigate('/mission0/complete');
    } catch (err) {
      console.error('Error submitting questionnaire:', err);
      setError('Chyba pri odosielaní dotazníka. Skúste to znova.');
      setIsSubmitting(false);
    }
  };

  // Render funkcie pre rôzne typy otázok
  const renderQuestion = (question, index) => {
    // Kontrola podmienky zobrazenia
    if (!shouldShowQuestion(question, answers)) return null;

    const hasError = questionErrors[question.id];
    const isFeedback = question.isFeedback;

    return (
      <QuestionCard
        key={question.id}
        ref={el => (questionRefs.current[question.id] = el)}
        hasError={hasError}
      >
        <Question>
          {!isFeedback && `${index + 1}. `}
          {question.text}
        </Question>

        {renderQuestionInput(question)}

        {hasError && <QuestionError>{hasError}</QuestionError>}
      </QuestionCard>
    );
  };

  const renderQuestionInput = (question) => {
    const value = answers[question.id];

    switch (question.type) {
      case 'radio':
        return (
          <RadioGroup>
            {question.options.map(option => (
              <RadioOption
                key={option.value}
                checked={value === option.value}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleAnswer(question.id, option.value)}
                />
                {option.label}
              </RadioOption>
            ))}
            {question.hasOther && (
              <div style={{ marginTop: '8px' }}>
                <Input
                  type="text"
                  placeholder={question.otherLabel || 'Iné (prosím špecifikujte)'}
                  value={value && !question.options.find(o => o.value === value) ? value : ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                />
              </div>
            )}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <CheckboxGroup>
            {question.options.map(option => (
              <CheckboxOption
                key={option.value}
                checked={Array.isArray(value) && value.includes(option.value)}
              >
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={() => handleCheckboxChange(question.id, option.value)}
                />
                {option.label}
              </CheckboxOption>
            ))}
          </CheckboxGroup>
        );

      case 'likert':
        return (
          <>
            <ScaleContainer>
              {question.scale.map((scaleValue, idx) => (
                <ScaleButtonWithLabel key={scaleValue}>
                  <RadioLabel checked={value === scaleValue}>
                    <input
                      type="radio"
                      name={question.id}
                      value={scaleValue}
                      checked={value === scaleValue}
                      onChange={() => handleAnswer(question.id, scaleValue)}
                    />
                    {scaleValue}
                  </RadioLabel>
                  {question.scaleValueLabels && question.scaleValueLabels[idx] && (
                    <ScaleValueLabel>{question.scaleValueLabels[idx]}</ScaleValueLabel>
                  )}
                </ScaleButtonWithLabel>
              ))}
            </ScaleContainer>
            {question.scaleLabels && (
              <ScaleLabels>
                <span>{question.scaleLabels.min}</span>
                <span>{question.scaleLabels.max}</span>
              </ScaleLabels>
            )}
          </>
        );

      case 'ladder':
        return (
          <>
            <LadderContainer>
              {question.scale.map(scaleValue => (
                <LadderOption
                  key={scaleValue}
                  checked={value === scaleValue}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={scaleValue}
                    checked={value === scaleValue}
                    onChange={() => handleAnswer(question.id, scaleValue)}
                  />
                  <span>{scaleValue}</span>
                </LadderOption>
              ))}
            </LadderContainer>
            {question.hasPreferNotToSay && (
              <PreferNotToSayOption checked={value === 'prefer_not_to_say'}>
                <input
                  type="checkbox"
                  checked={value === 'prefer_not_to_say'}
                  onChange={() => handleAnswer(question.id, 'prefer_not_to_say')}
                />
                Preferujem neuvádzať
              </PreferNotToSayOption>
            )}
            {question.scaleLabels && (
              <ScaleLabels style={{ marginTop: '12px' }}>
                <span>{question.scaleLabels.min}</span>
                <span>{question.scaleLabels.max}</span>
              </ScaleLabels>
            )}
          </>
        );

      case 'number':
        return (
          <Input
            type="number"
            min={question.min}
            max={question.max}
            placeholder={question.placeholder}
            value={value || ''}
            onChange={(e) => handleAnswer(question.id, parseInt(e.target.value) || '')}
          />
        );

      case 'text':
        return (
          <Input
            type="text"
            placeholder={question.placeholder}
            value={value || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={question.placeholder}
            value={value || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          />
        );

      case 'number-select':
        const selectedNumbers = Array.isArray(value) ? value : (value ? [value] : []);
        return (
          <NumberSelectContainer>
            {question.instruction && (
              <NumberSelectInstruction>{question.instruction}</NumberSelectInstruction>
            )}
            <NumberGrid>
              {Array.from({ length: question.max - question.min + 1 }, (_, i) => i + question.min).map(num => (
                <NumberButton
                  key={num}
                  type="button"
                  checked={selectedNumbers.includes(num)}
                  onClick={() => handleNumberSelect(question.id, num, question.multiple)}
                >
                  {num}
                </NumberButton>
              ))}
            </NumberGrid>
            {selectedNumbers.length > 0 && (
              <SelectedNumbers>
                <strong>Vybrané otázky:</strong> {selectedNumbers.join(', ')}
              </SelectedNumbers>
            )}
          </NumberSelectContainer>
        );

      case 'binary':
        return (
          <BinaryGroup>
            {question.options.map(option => (
              <BinaryOption
                key={option.value}
                checked={value === option.value}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleAnswer(question.id, option.value)}
                />
                {option.label}
              </BinaryOption>
            ))}
          </BinaryGroup>
        );

      default:
        return null;
    }
  };

  const page = PAGES[currentPage];
  const progress = ((currentPage + 1) / PAGES.length) * 100;

  // Rozdelenie otázok na hlavné a feedback
  const mainQuestions = page.questions.filter(q => !q.isFeedback);
  const feedbackQuestions = page.questions.filter(q => q.isFeedback);

  return (
    <Layout>
      <Container>
        <DetectiveTipSmall
          message="Vyplňte tento dotazník pozorne. Vaše odpovede sú dôležité pre výskum."
          emoji="📋"
        />

        <Card>
          <ProgressText>
            Strana {currentPage + 1} z {PAGES.length}
          </ProgressText>
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>

          {page.title && <PageTitle>{page.title}</PageTitle>}
          {page.subtitle && <PageSubtitle>{page.subtitle}</PageSubtitle>}
          {page.instruction && <Instruction>{page.instruction}</Instruction>}

          {error && <ErrorText>{error}</ErrorText>}

          {/* Hlavné otázky */}
          {mainQuestions.map((question, index) => renderQuestion(question, index))}

          {/* Feedback sekcia */}
          {feedbackQuestions.length > 0 && (
            <FeedbackSection>
              <FeedbackTitle>Spätná väzba</FeedbackTitle>
              <FeedbackSubtitle>
                Pomôžte nám zlepšiť túto sekciu dotazníka (nepovinné)
              </FeedbackSubtitle>
              {feedbackQuestions.map((question) => renderQuestion(question, -1))}
            </FeedbackSection>
          )}

          <ButtonContainer>
            <StyledButton
              onClick={handleBack}
              disabled={currentPage === 0}
              variant="secondary"
            >
              ← Späť
            </StyledButton>
            <StyledButton
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {currentPage < PAGES.length - 1 ? 'Ďalej →' : 'Odoslať'}
            </StyledButton>
          </ButtonContainer>

          <ProgressIndicator>
            {mainQuestions.length} {mainQuestions.length === 1 ? 'otázka' : mainQuestions.length < 5 ? 'otázky' : 'otázok'} na tejto strane
          </ProgressIndicator>
        </Card>
      </Container>
    </Layout>
  );
};

export default Questionnaire0;
