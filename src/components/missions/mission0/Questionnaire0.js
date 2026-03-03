// src/components/missions/mission0/Questionnaire0.js
// ČASŤ 1/3: IMPORTS + STYLED COMPONENTS

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import DetectiveTipSmall from '../../shared/DetectiveTipSmall';
import { useUserStats } from '../../../contexts/UserStatsContext';
import { getResponseManager } from '../../../utils/ResponseManager';

// ==========================================
// STYLED COMPONENTS - LAYOUT
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

const Title = styled.h2`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
`;

const Subtitle = styled.h3`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-align: center;
  font-size: 14px;
  font-style: italic;
  margin-top: -12px;
  margin-bottom: 20px;
`;

const Instruction = styled.div`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 14px;
  margin-bottom: 20px;
  padding: 12px;
  background: ${p => p.theme.ACCENT_COLOR}10;
  border-radius: 6px;
  line-height: 1.5;
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${p => p.theme.BORDER_COLOR};
  border-radius: 3px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${p => p.theme.ACCENT_COLOR};
  transition: width 0.3s ease;
  width: ${p => p.progress}%;
`;

const ProgressText = styled.div`
  text-align: center;
  font-size: 14px;
  color: ${p => p.theme.ACCENT_COLOR};
  margin-bottom: 12px;
  font-weight: 600;
`;

const QuestionCard = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 1px solid ${p => p.hasError ? '#ff0000' : p.theme.BORDER_COLOR};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  scroll-margin-top: 20px;
  transition: all 0.2s ease;

  ${p => p.hasError && `
    box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.1);
  `}
`;

const Question = styled.p`
  margin-bottom: 12px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
`;

const QuestionError = styled.div`
  color: #ff0000;
  font-size: 13px;
  margin-top: 8px;
  font-weight: 500;
`;

// ==========================================
// STYLED COMPONENTS - ACCORDION LIKERT
// ==========================================

const AccordionQuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AccordionQuestionItem = styled.div`
  border: 2px solid ${p => p.isActive ? p.theme.ACCENT_COLOR : p.isCompleted ? '#4CAF50' : p.theme.BORDER_COLOR};
  border-radius: 8px;
  background: ${p => p.theme.CARD_BACKGROUND};
  transition: all 0.3s ease;
  
  ${p => p.isActive && `
    box-shadow: 0 4px 12px ${p.theme.ACCENT_COLOR}40;
  `}
`;

const AccordionQuestionHeader = styled.div`
  padding: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s ease;
  
  &:hover {
    background: ${p => p.theme.HOVER_OVERLAY};
  }
`;

const AccordionQuestionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const AccordionQuestionNumber = styled.span`
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
  font-size: 16px;
  min-width: 30px;
`;

const AccordionQuestionText = styled.span`
  font-size: 14px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-weight: 500;
  line-height: 1.5;
`;

const AccordionQuestionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
`;

const CheckIcon = styled.span`
  color: #4CAF50;
  font-size: 20px;
  font-weight: 700;
`;

const AccordionAnswerPreview = styled.div`
  font-size: 13px;
  color: ${p => p.theme.ACCENT_COLOR};
  font-weight: 600;
  padding: 4px 12px;
  background: ${p => p.theme.ACCENT_COLOR}15;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

const AccordionScaleContainer = styled.div`
  padding: 20px 16px 16px 16px;
  border-top: 1px solid ${p => p.theme.BORDER_COLOR};
  animation: slideDown 0.3s ease;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const AccordionScaleButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
`;

const AccordionScaleButton = styled.button`
  flex: 1;
  padding: 12px 8px;
  border: 2px solid ${p => p.checked ? p.theme.ACCENT_COLOR : p.theme.BORDER_COLOR};
  border-radius: 8px;
  background: ${p => p.checked ? p.theme.ACCENT_COLOR : p.theme.CARD_BACKGROUND};
  color: ${p => p.checked ? '#ffffff' : p.theme.PRIMARY_TEXT_COLOR};
  font-size: 16px;
  font-weight: ${p => p.checked ? '700' : '600'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${p => p.checked ? p.theme.ACCENT_COLOR : p.theme.HOVER_OVERLAY};
    border-color: ${p => p.theme.ACCENT_COLOR};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const AccordionScaleLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-style: italic;
  margin-bottom: 16px;
`;

const AccordionScaleDescriptions = styled.div`
  background: ${p => p.theme.ACCENT_COLOR}08;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AccordionScaleDescItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${p => p.isSelected ? p.theme.ACCENT_COLOR : p.theme.SECONDARY_TEXT_COLOR};
  font-weight: ${p => p.isSelected ? '600' : '400'};
  padding: 4px 8px;
  border-radius: 4px;
  background: ${p => p.isSelected ? p.theme.ACCENT_COLOR + '20' : 'transparent'};
  
  .number {
    font-weight: 700;
    min-width: 20px;
  }
  
  .description {
    flex: 1;
  }
  
  ${p => p.isSelected && `
    &::before {
      content: '→';
      color: ${p.theme.ACCENT_COLOR};
      font-weight: 700;
    }
  `}
`;

// ==========================================
// STYLED COMPONENTS - RADIO & CHECKBOX
// ==========================================

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  background: transparent;
  border-radius: 4px;
  
  &:hover {
    background: ${p => p.theme.HOVER_OVERLAY};
  }
  
  input[type="radio"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid ${p => p.theme.BORDER_COLOR};
    border-radius: 50%;
    margin-right: 16px;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    transition: all 0.2s ease;
    
    &:checked {
      border-color: ${p => p.theme.ACCENT_COLOR};
      
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${p => p.theme.ACCENT_COLOR};
      }
    }
    
    &:hover {
      border-color: ${p => p.theme.ACCENT_COLOR};
    }
  }
  
  span {
    color: ${p => p.theme.PRIMARY_TEXT_COLOR};
    font-size: 14px;
    line-height: 1.5;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  background: transparent;
  border-radius: 4px;
  
  &:hover {
    background: ${p => p.theme.HOVER_OVERLAY};
  }
  
  input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid ${p => p.theme.BORDER_COLOR};
    border-radius: 2px;
    margin-right: 16px;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    transition: all 0.2s ease;
    
    &:checked {
      background: ${p => p.theme.ACCENT_COLOR};
      border-color: ${p => p.theme.ACCENT_COLOR};
      
      &::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 2px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }
    
    &:hover {
      border-color: ${p => p.theme.ACCENT_COLOR};
    }
  }
  
  span {
    color: ${p => p.theme.PRIMARY_TEXT_COLOR};
    font-size: 14px;
    line-height: 1.5;
  }
`;

// ==========================================
// STYLED COMPONENTS - LIKERT SCALE
// ==========================================

const ScaleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
`;

const ScaleButtonWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ScaleRadioLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  
  input[type="radio"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid ${p => p.theme.BORDER_COLOR};
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
    margin-bottom: 4px;
    
    &:checked {
      border-color: ${p => p.theme.ACCENT_COLOR};
      
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${p => p.theme.ACCENT_COLOR};
      }
    }
    
    &:hover {
      border-color: ${p => p.theme.ACCENT_COLOR};
      background: ${p => p.theme.ACCENT_COLOR}10;
    }
  }
  
  .scale-number {
    font-size: 13px;
    font-weight: 600;
    color: ${p => p.theme.PRIMARY_TEXT_COLOR};
    margin-bottom: 4px;
  }
`;

const ScaleValueLabel = styled.span`
  font-size: 10px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-align: center;
  line-height: 1.3;
  word-break: break-word;
  hyphens: auto;
  max-width: 100%;
`;

const ScaleLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-style: italic;
`;

// ==========================================
// STYLED COMPONENTS - TEXT INPUTS
// ==========================================

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
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: ${p => p.theme.CARD_BACKGROUND};
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
  
  &:focus {
    outline: none;
    border-color: ${p => p.theme.ACCENT_COLOR};
  }
  
  &::placeholder {
    color: ${p => p.theme.SECONDARY_TEXT_COLOR};
    opacity: 0.6;
  }
`;
const BinaryGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const BinaryOption = styled.label`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  background: transparent;
  border-radius: 4px;
  
  &:hover {
    background: ${p => p.theme.HOVER_OVERLAY};
  }
  
  input[type="radio"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid ${p => p.theme.BORDER_COLOR};
    border-radius: 50%;
    margin-right: 16px;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    transition: all 0.2s ease;
    
    &:checked {
      border-color: ${p => p.theme.ACCENT_COLOR};
      
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${p => p.theme.ACCENT_COLOR};
      }
    }
    
    &:hover {
      border-color: ${p => p.theme.ACCENT_COLOR};
    }
  }
  
  span {
    color: ${p => p.theme.PRIMARY_TEXT_COLOR};
    font-size: 14px;
    font-weight: 500;
  }
`;

const LadderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const LadderOption = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  background: transparent;
  border-radius: 4px;
  
  &:hover {
    background: ${p => p.theme.HOVER_OVERLAY};
  }
  
  input[type="radio"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid ${p => p.theme.BORDER_COLOR};
    border-radius: 50%;
    margin-right: 16px;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    transition: all 0.2s ease;
    
    &:checked {
      border-color: ${p => p.theme.ACCENT_COLOR};
      
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${p => p.theme.ACCENT_COLOR};
      }
    }
    
    &:hover {
      border-color: ${p => p.theme.ACCENT_COLOR};
    }
  }
  
  .ladder-content {
    display: flex;
    align-items: center;
    flex: 1;
  }
  
  .ladder-number {
    font-size: 16px;
    font-weight: 700;
    color: ${p => p.theme.ACCENT_COLOR};
    margin-left: auto;
  }
`;

const PreferNotToSayOption = styled.label`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  margin-top: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  background: transparent;
  border-radius: 4px;
  border-top: 1px solid ${p => p.theme.BORDER_COLOR};
  
  &:hover {
    background: ${p => p.theme.HOVER_OVERLAY};
  }
  
  input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid ${p => p.theme.BORDER_COLOR};
    border-radius: 2px;
    margin-right: 16px;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    transition: all 0.2s ease;
    
    &:checked {
      background: ${p => p.theme.ACCENT_COLOR};
      border-color: ${p => p.theme.ACCENT_COLOR};
      
      &::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 2px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }
    
    &:hover {
      border-color: ${p => p.theme.ACCENT_COLOR};
    }
  }
  
  span {
    color: ${p => p.theme.PRIMARY_TEXT_COLOR};
    font-size: 14px;
    font-style: italic;
  }
`;

// ==========================================
// STYLED COMPONENTS - NUMBER SELECT
// ==========================================

const NumberSelectContainer = styled.div`
  margin-top: 12px;
`;

const NumberSelectInstruction = styled.div`
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 12px;
`;

const NumberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
  gap: 8px;
`;

const NumberButton = styled.button`
  padding: 10px;
  border: 2px solid ${p => p.checked ? p.theme.ACCENT_COLOR : p.theme.BORDER_COLOR};
  border-radius: 6px;
  background: ${p => p.checked ? p.theme.ACCENT_COLOR : p.theme.CARD_BACKGROUND};
  color: ${p => p.checked ? '#ffffff' : p.theme.PRIMARY_TEXT_COLOR};
  font-size: 14px;
  font-weight: ${p => p.checked ? '700' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${p => p.checked ? p.theme.ACCENT_COLOR : p.theme.HOVER_OVERLAY};
    border-color: ${p => p.theme.ACCENT_COLOR};
  }
`;

const SelectedNumbers = styled.div`
  margin-top: 12px;
  padding: 10px;
  background: ${p => p.theme.ACCENT_COLOR}15;
  border: 1px solid ${p => p.theme.ACCENT_COLOR}60;
  border-radius: 6px;
  font-size: 13px;
  color: ${p => p.theme.ACCENT_COLOR};
`;

// ==========================================
// STYLED COMPONENTS - FEEDBACK & UI
// ==========================================

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
  
  &:before {
    content: '💬';
  }
`;

const FeedbackSubtitle = styled.p`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 13px;
  margin-bottom: 16px;
`;

const ErrorText = styled.div`
  color: ${p => p.theme.ACCENT_COLOR_2 || '#ff0000'};
  margin-bottom: 16px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  padding: 12px;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
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

// ==========================================
// KONŠTANTY
// ==========================================

const COMPONENT_ID = 'questionnaire0';

// ==========================================
// HELPER FUNKCIA - FEEDBACK OTÁZKY
// ==========================================

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
      { value: 'stupnica', label: 'Nevhodnosť hodnotiacej stupnice' },
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

// ==========================================
// DEFINÍCIA PAGES - KOMPLETNÝ DOTAZNÍK
// ==========================================

const PAGES = [
  // ==========================================
  // STRANA 1: DEMOGRAFIA (bez zmeny)
  // ==========================================
  {
    id: 'demografia',
    title: 'Demografia',
    subtitle: 'Základné informácie o Vás',
    instruction: 'Nasleduje séria otázok o Vás. Tieto informácie nám pomôžu pochopiť, ako sa líšia názory a skúsenosti medzi rôznymi skupinami ľudí. Všetky vaše odpovede sú anonymné a budú použité výlučne na výskumné účely.',
    questions: [
      {
        id: 'd1_pohlavie',
        text: 'Vyberte Vaše pohlavie:',
        type: 'binary',
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
        placeholder: 'Váš vek'
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
          { value: 'vys_1', label: 'Vysokoškolské vzdelanie 1. stupňa (bakalárske)' },
          { value: 'vys_2', label: 'Vysokoškolské vzdelanie 2. stupňa (magisterské, inžinierske, doktorské)' },
          { value: 'vys_3', label: 'Vysokoškolské vzdelanie 3. stupňa (doktorandské)' }
        ]
      },
      {
        id: 'd4_pracovna_situacia',
        text: 'Vyberte Vašu aktuálnu situáciu:',
        type: 'radio',
        required: true,
        hasOther: true,
        otherLabel: 'Iné (prosím špecifikujte)',
        options: [
          { value: 'plny_uvazok', label: 'Zamestnaný/á na plný úväzok' },
          { value: 'skrateny_uvazok', label: 'Zamestnaný/á na skrátený úväzok' },
          { value: 'volna_noha', label: 'Práca na voľnej nohe / podnikateľ' },
          { value: 'student', label: 'Študent/ka' },
          { value: 'dochodok', label: 'Starobný dôchodok' },
          { value: 'materska', label: 'Na materskej / otcovskej dovolenke' },
          { value: 'nezamestany', label: 'Nezamestnaný/á' }
        ]
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
          { value: 'prefer_not', label: 'Preferujem neuvádzať' }
        ]
      },
      {
        id: 'd6_miesto_bydliska',
        text: 'Vyberte región z ktorého pochádzate:',
        type: 'radio',
        required: true,
        hasOther: true,
        otherLabel: 'Iné (prosím špecifikujte)',
        options: [
          { value: 'zapadne', label: 'Západné Slovensko (napr. Trnava, Nitra, Trenčín)' },
          { value: 'stredne', label: 'Stredné Slovensko (napr. Zvolen, Banská Bystrica, Lučenec)' },
          { value: 'vychodne', label: 'Východné Slovensko (napr. Košice, Prešov)' }
        ]
      },
      {
        id: 'd7_socialny_rebrik',
        text: 'Predstavte si, že tento rebrík predstavuje postavenie ľudí na Slovensku. Na úplnom vrchole rebríka sú ľudia, ktorí sú na tom najlepšie. Ľudia ktorí majú najviac peňazí, najlepšie vzdelanie, a najrešpektovanejšiu prácu. Na spodku rebríka sú ľudia, ktorí sú na tom najhoršie. Ľudia, ktorí majú najmenej peňazí, najhoršie vzdelanie, a najmenej rešpektovanú prácu, poprípade žiadnu prácu. Čím vyššie ste v tomto rebríku, tým bližšie ste ľuďom na úplnom vrchole a čím ste nižšie, tým ste bližšie ľuďom na samom spodku. Prosím, vyberte si číslo priečky rebríka, na ktorej si myslíte, že vo svojom živote aktuálne ste, v porovnaní s ostatnými ľuďmi na Slovensku.',
        type: 'ladder',
        required: true,
        scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        hasPreferNotToSay: true,
        scaleLabels: {
          min: 'Najnižší status',
          max: 'Najvyšší status'
        }
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
          { value: 'prefer_not', label: 'Preferujem neuvádzať' }
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 2: RELIGIOZITA (ACCORDION)
  // ==========================================
  {
    id: 'religiozita',
    title: 'Religiozita',
    subtitle: 'Koenig & Büssing, 2010',
    instruction: 'Nasledujúce otázky sa týkajú Vášho vzťahu k náboženstvu. Neexistujú správne alebo nesprávne odpovede. Kliknite na otázku a vyberte odpoveď.',
    questions: [
      {
        id: 'religiozita_accordion',
        text: '',
        type: 'accordion-likert',
        required: false,
        questions: [
          {
            id: 'ora1',
            text: 'Ako často navštevujete kostol alebo náboženské stretnutia?',
            scale: [1, 2, 3, 4, 5, 6],
            scaleLabels: { min: 'Nikdy', max: 'Viackrát týždenne' },
            scaleValueLabels: ['Nikdy', 'Raz za rok alebo menej', 'Niekoľkokrát za rok', 'Niekoľkokrát za mesiac', 'Raz týždenne', 'Viackrát týždenne']
          },
          {
            id: 'nora1',
            text: 'Ako často sa venujete súkromným náboženským aktivitám (modlitba, meditácia, čítanie svätých textov)?',
            scale: [1, 2, 3, 4, 5, 6],
            scaleLabels: { min: 'Nikdy', max: 'Viackrát týždenne' },
            scaleValueLabels: ['Nikdy', 'Raz za rok alebo menej', 'Niekoľkokrát za rok', 'Niekoľkokrát za mesiac', 'Raz týždenne', 'Viackrát týždenne']
          },
          {
            id: 'ir1',
            text: 'Vo svojom živote prežívam prítomnosť Boha alebo niečoho vyššieho.',
            scale: [1, 2, 3, 4, 5],
            scaleLabels: { min: 'Rozhodne neplatí', max: 'Rozhodne platí' },
            scaleValueLabels: ['Rozhodne to o mne neplatí', 'Skôr to o mne neplatí', 'Nie som si istý/á', 'Skôr to o mne platí', 'Rozhodne to o mne platí']
          },
          {
            id: 'ir2',
            text: 'Moje náboženské presvedčenie sú základom môjho prístupu k životu.',
            scale: [1, 2, 3, 4, 5],
            scaleLabels: { min: 'Rozhodne neplatí', max: 'Rozhodne platí' },
            scaleValueLabels: ['Rozhodne to o mne neplatí', 'Skôr to o mne neplatí', 'Nie som si istý/á', 'Skôr to o mne platí', 'Rozhodne to o mne platí']
          },
          {
            id: 'ir3',
            text: 'Snažím sa prenášať svoje náboženstvo do všetkých oblastí môjho života.',
            scale: [1, 2, 3, 4, 5],
            scaleLabels: { min: 'Rozhodne neplatí', max: 'Rozhodne platí' },
            scaleValueLabels: ['Rozhodne to o mne neplatí', 'Skôr to o mne neplatí', 'Nie som si istý/á', 'Skôr to o mne platí', 'Rozhodne to o mne platí']
          }
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 3: FREKVENCIA MÉDIÍ (ACCORDION)
  // ==========================================
  {
    id: 'media',
    title: 'Frekvencia používania médií',
    instruction: 'Nasleduje zoznam médií a platforiem. Pri každom médiu označte, ako často ho používate ako zdroj informácií. Kliknite na médium a vyberte frekvenciu.',
    questions: [
      {
        id: 'media_accordion',
        text: '',
        type: 'accordion-likert',
        required: false,
        questions: [
          // Televízne spravodajstvo
          { id: 'ts1', text: 'Televízne noviny TV Markíza', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'ts2', text: 'Správy STVR', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'ts3', text: 'Noviny TV JOJ', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'ts4', text: 'Správy TA3', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          
          // Online a tlač
          { id: 'ot1', text: 'SME', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'ot2', text: 'Denník N', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'ot3', text: 'Pravda', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'ot4', text: 'Aktuality', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'ot5', text: 'Nový Čas', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'ot6', text: 'Hospodárske noviny', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'ot7', text: 'Postoj', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'ot8', text: 'Trend', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          
          // Alternatívne médiá
          { id: 'am1', text: 'Hlavné správy', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'am2', text: 'Zem a vek', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'am3', text: 'Slobodný vysielač', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'am4', text: 'Protiprúd', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'am5', text: 'Extraplus', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'am6', text: 'Infovojna', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'am7', text: 'Parlamentné listy', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'am8', text: 'Vaša pravda', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          
          // Sociálne médiá
          { id: 'sm1', text: 'Facebook', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'sm2', text: 'YouTube', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'sm3', text: 'Instagram', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'sm4', text: 'TikTok', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'sm5', text: 'Telegram', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] },
          { id: 'sm6', text: 'X (Twitter)', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Nikdy', max: 'Denne' }, scaleValueLabels: ['Nikdy', 'Menej ako raz mesačne', 'Približne raz mesačne', 'Niekoľkokrát mesačne', 'Približne raz týždenne', 'Niekoľkokrát týždenne', 'Denne'] }
        ]
      },
      {
        id: 'ost1',
        text: 'Iné spravodajské weby alebo platformy, ktoré používam často (prosím uveďte):',
        type: 'text',
        required: false,
        placeholder: 'Napíšte názvy médií...'
      }
    ]
  },

  // ==========================================
  // STRANA 4-8: Pokračovanie v ďalšej správe...
  // ==========================================
  // ==========================================
  // STRANA 4: TOLERANCIA (ACCORDION)
  // ==========================================
  {
    id: 'tolerancia',
    title: 'Tolerancia',
    subtitle: 'Prošek et al., 2025',
    instruction: 'Nižšie nájdete sériu tvrdení o rôznych aspektoch spôsobu, ako by ľudia mali žiť a ako sa máme vzájomne brať v ohľade na ich odlišnosti. Kliknite na tvrdenie a vyjadrite svoju úroveň súhlasu.',
    questions: [
      {
        id: 'tolerancia_accordion',
        text: '',
        type: 'accordion-likert',
        required: false,
        questions: [
          // Autonómia
          { id: 'ac1', text: 'Ľudia by mali mať právo žiť, ako chcú.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'ac2', text: 'Je dôležité, aby ľudia mali slobodu žiť svoj život tak, ako si vyberú.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'ac3', text: 'Ľudia môžu žiť ako chcú, pokiaľ neubližujú iným.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          
          // Rešpekt
          { id: 'r1', text: 'Rešpektujem presvedčenia a názory iných ľudí.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'r2', text: 'Mám rešpekt voči presvedčeniam a názorom iných ľudí, aj keď s nimi nesúhlasím.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'r3', text: 'Vadí mi, že niektorí ľudia majú iné tradície a spôsob života.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          
          // Aprecácia
          { id: 'ap1', text: 'Rád/a trávim čas s ľuďmi, ktorí sú iní ako ja.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'ap2', text: 'Mám rád/a ľudí, ktorí ma podnecujú, aby som rozmýšľal/a o svete iným spôsobom.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'ap3', text: 'Rozmanitosť tradícií a spôsobov života je prínosom pre našu spoločnosť.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] }
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 5: KONŠPIRAČNÁ MENTALITA (ACCORDION)
  // ==========================================
  {
    id: 'konspiracia_mentalita',
    title: 'Konšpiračná mentalita',
    subtitle: 'Mikušková, 2018',
    instruction: 'Nižšie nájdete sériu tvrdení. Pri každom tvrdení prosím vyjadrite, do akej miery s ním súhlasíte. Kliknite na tvrdenie a vyberte odpoveď.',
    questions: [
      {
        id: 'konspiracia_mentalita_accordion',
        text: '',
        type: 'accordion-likert',
        required: false,
        questions: [
          { id: 'km1', text: 'Myslím si, že sa vo svete dejú mnohé veľmi dôležité veci, o ktorých sa verejnosť nikdy nedozvie.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'km2', text: 'Myslím si, že politici zvyčajne nehovoria ľuďom skutočné motívy svojich rozhodnutí.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'km3', text: 'Myslím si, že vládne agentúry úzko monitorujú všetkých občanov.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'km4', text: 'Myslím si, že udalosti, ktoré sa na prvý pohľad zdajú nesúvisiace, sú často výsledkom tajných aktivít.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'km5', text: 'Myslím si, že existujú tajné organizácie, ktoré veľmi vplývajú na politické rozhodnutia.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] }
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 6: SYMBOLICKÉ OHROZENIE (ACCORDION)
  // ==========================================
  {
    id: 'symbolicke_ohrozenie',
    title: 'Symbolické ohrozenie a pocit hrozby',
    subtitle: 'Šrol & Čavojová, 2025',
    instruction: 'Niektorí ľudia tvrdia, že existujú isté skupiny ľudí či krajiny, ktoré ohrozujú našu vlastnú identitu a hodnoty. Myslíte si vy osobne, že nasledujúce skupiny či krajiny ohrozujú vašu identitu a hodnoty? Kliknite na položku a vyjadrite vašu úroveň vnemu hrozby.',
    questions: [
      {
        id: 'symbolicke_ohrozenie_accordion',
        text: '',
        type: 'accordion-likert',
        required: false,
        questions: [
          // Medzinárodné supermoci a systémy
          { id: 'sh1', text: 'Západné spoločnosti a ich spôsob života', scale: [1, 2, 3, 4, 5], scaleLabels: { min: 'Vôbec neohrozuje', max: 'Veľmi ohrozuje' }, scaleValueLabels: ['Vôbec neohrozuje moju identitu a hodnoty', 'Skôr neohrozuje moju identitu a hodnoty', 'Neutrálny postoj', 'Skôr ohrozuje moju identitu a hodnoty', 'Veľmi ohrozuje moju identitu a hodnoty'] },
          { id: 'sh2', text: 'Európska únia', scale: [1, 2, 3, 4, 5], scaleLabels: { min: 'Vôbec neohrozuje', max: 'Veľmi ohrozuje' }, scaleValueLabels: ['Vôbec neohrozuje moju identitu a hodnoty', 'Skôr neohrozuje moju identitu a hodnoty', 'Neutrálny postoj', 'Skôr ohrozuje moju identitu a hodnoty', 'Veľmi ohrozuje moju identitu a hodnoty'] },
          { id: 'sh3', text: 'Spojené štáty americké', scale: [1, 2, 3, 4, 5], scaleLabels: { min: 'Vôbec neohrozuje', max: 'Veľmi ohrozuje' }, scaleValueLabels: ['Vôbec neohrozuje moju identitu a hodnoty', 'Skôr neohrozuje moju identitu a hodnoty', 'Neutrálny postoj', 'Skôr ohrozuje moju identitu a hodnoty', 'Veľmi ohrozuje moju identitu a hodnoty'] },
          { id: 'sh4', text: 'Ruská federácia', scale: [1, 2, 3, 4, 5], scaleLabels: { min: 'Vôbec neohrozuje', max: 'Veľmi ohrozuje' }, scaleValueLabels: ['Vôbec neohrozuje moju identitu a hodnoty', 'Skôr neohrozuje moju identitu a hodnoty', 'Neutrálny postoj', 'Skôr ohrozuje moju identitu a hodnoty', 'Veľmi ohrozuje moju identitu a hodnoty'] },
          { id: 'sh5', text: 'Ukrajina', scale: [1, 2, 3, 4, 5], scaleLabels: { min: 'Vôbec neohrozuje', max: 'Veľmi ohrozuje' }, scaleValueLabels: ['Vôbec neohrozuje moju identitu a hodnoty', 'Skôr neohrozuje moju identitu a hodnoty', 'Neutrálny postoj', 'Skôr ohrozuje moju identitu a hodnoty', 'Veľmi ohrozuje moju identitu a hodnoty'] },
          { id: 'sh6', text: 'Izrael', scale: [1, 2, 3, 4, 5], scaleLabels: { min: 'Vôbec neohrozuje', max: 'Veľmi ohrozuje' }, scaleValueLabels: ['Vôbec neohrozuje moju identitu a hodnoty', 'Skôr neohrozuje moju identitu a hodnoty', 'Neutrálny postoj', 'Skôr ohrozuje moju identitu a hodnoty', 'Veľmi ohrozuje moju identitu a hodnoty'] },
          { id: 'sh7', text: 'Palestína', scale: [1, 2, 3, 4, 5], scaleLabels: { min: 'Vôbec neohrozuje', max: 'Veľmi ohrozuje' }, scaleValueLabels: ['Vôbec neohrozuje moju identitu a hodnoty', 'Skôr neohrozuje moju identitu a hodnoty', 'Neutrálny postoj', 'Skôr ohrozuje moju identitu a hodnoty', 'Veľmi ohrozuje moju identitu a hodnoty'] },
          
          // Domáce a migračné faktory
          { id: 'sh8', text: 'Vláda Slovenskej Republiky', scale: [1, 2, 3, 4, 5], scaleLabels: { min: 'Vôbec neohrozuje', max: 'Veľmi ohrozuje' }, scaleValueLabels: ['Vôbec neohrozuje moju identitu a hodnoty', 'Skôr neohrozuje moju identitu a hodnoty', 'Neutrálny postoj', 'Skôr ohrozuje moju identitu a hodnoty', 'Veľmi ohrozuje moju identitu a hodnoty'] },
          { id: 'sh9', text: 'Narastajúce množstvo zahraničných ľudí na Slovensku', scale: [1, 2, 3, 4, 5], scaleLabels: { min: 'Vôbec neohrozuje', max: 'Veľmi ohrozuje' }, scaleValueLabels: ['Vôbec neohrozuje moju identitu a hodnoty', 'Skôr neohrozuje moju identitu a hodnoty', 'Neutrálny postoj', 'Skôr ohrozuje moju identitu a hodnoty', 'Veľmi ohrozuje moju identitu a hodnoty'] },
          { id: 'sh10', text: 'Ukrajinskí utečenci na Slovensku', scale: [1, 2, 3, 4, 5], scaleLabels: { min: 'Vôbec neohrozuje', max: 'Veľmi ohrozuje' }, scaleValueLabels: ['Vôbec neohrozuje moju identitu a hodnoty', 'Skôr neohrozuje moju identitu a hodnoty', 'Neutrálny postoj', 'Skôr ohrozuje moju identitu a hodnoty', 'Veľmi ohrozuje moju identitu a hodnoty'] }
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 7: DÔVERA (ACCORDION)
  // ==========================================
  {
    id: 'dovera',
    title: 'Dôvera',
    subtitle: 'European Union, 2026',
    instruction: 'Nižšie nájdete zoznam rôznych inštitúcií a tvrdení o procesoch EÚ. Pri každej položke prosím vyjadrite, do akej miery im dôverujete. Kliknite na položku a vyberte odpoveď.',
    questions: [
      {
        id: 'dovera_accordion',
        text: '',
        type: 'accordion-likert',
        required: false,
        questions: [
          // Inštitucionálna dôvera
          { id: 'id1', text: 'Európsky parlament', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Absolútne nedôverujem', max: 'Absolútne dôverujem' }, scaleValueLabels: ['Absolútne nedôverujem', 'Väčšinou nedôverujem', 'Skôr nedôverujem', 'Neutrálny postoj', 'Skôr dôverujem', 'Väčšinou dôverujem', 'Absolútne dôverujem'] },
          { id: 'id2', text: 'Európska rada', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Absolútne nedôverujem', max: 'Absolútne dôverujem' }, scaleValueLabels: ['Absolútne nedôverujem', 'Väčšinou nedôverujem', 'Skôr nedôverujem', 'Neutrálny postoj', 'Skôr dôverujem', 'Väčšinou dôverujem', 'Absolútne dôverujem'] },
          { id: 'id3', text: 'Rada Európskej únie', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Absolútne nedôverujem', max: 'Absolútne dôverujem' }, scaleValueLabels: ['Absolútne nedôverujem', 'Väčšinou nedôverujem', 'Skôr nedôverujem', 'Neutrálny postoj', 'Skôr dôverujem', 'Väčšinou dôverujem', 'Absolútne dôverujem'] },
          { id: 'id4', text: 'Európska komisia', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Absolútne nedôverujem', max: 'Absolútne dôverujem' }, scaleValueLabels: ['Absolútne nedôverujem', 'Väčšinou nedôverujem', 'Skôr nedôverujem', 'Neutrálny postoj', 'Skôr dôverujem', 'Väčšinou dôverujem', 'Absolútne dôverujem'] },
          { id: 'id5', text: 'Súdny dvor Európskej únie', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Absolútne nedôverujem', max: 'Absolútne dôverujem' }, scaleValueLabels: ['Absolútne nedôverujem', 'Väčšinou nedôverujem', 'Skôr nedôverujem', 'Neutrálny postoj', 'Skôr dôverujem', 'Väčšinou dôverujem', 'Absolútne dôverujem'] },
          { id: 'id6', text: 'Európska centrálna banka', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Absolútne nedôverujem', max: 'Absolútne dôverujem' }, scaleValueLabels: ['Absolútne nedôverujem', 'Väčšinou nedôverujem', 'Skôr nedôverujem', 'Neutrálny postoj', 'Skôr dôverujem', 'Väčšinou dôverujem', 'Absolútne dôverujem'] },
          { id: 'id7', text: 'Európsky dvor audítorov', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Absolútne nedôverujem', max: 'Absolútne dôverujem' }, scaleValueLabels: ['Absolútne nedôverujem', 'Väčšinou nedôverujem', 'Skôr nedôverujem', 'Neutrálny postoj', 'Skôr dôverujem', 'Väčšinou dôverujem', 'Absolútne dôverujem'] },
          
          // Systémová dôvera
          { id: 'sd1', text: 'Procesy rozhodovania v EÚ sú transparentné a demokratické.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Absolútne nedôverujem', max: 'Absolútne dôverujem' }, scaleValueLabels: ['Absolútne nedôverujem', 'Väčšinou nedôverujem', 'Skôr nedôverujem', 'Neutrálny postoj', 'Skôr dôverujem', 'Väčšinou dôverujem', 'Absolútne dôverujem'] },
          { id: 'sd2', text: 'Financovanie EÚ (eurofondy, dotácie) sú spravodlivo rozdeľované.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Absolútne nedôverujem', max: 'Absolútne dôverujem' }, scaleValueLabels: ['Absolútne nedôverujem', 'Väčšinou nedôverujem', 'Skôr nedôverujem', 'Neutrálny postoj', 'Skôr dôverujem', 'Väčšinou dôverujem', 'Absolútne dôverujem'] },
          { id: 'sd3', text: 'EÚ rešpektuje kultúrne a národné odlišnosti členských štátov.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Absolútne nedôverujem', max: 'Absolútne dôverujem' }, scaleValueLabels: ['Absolútne nedôverujem', 'Väčšinou nedôverujem', 'Skôr nedôverujem', 'Neutrálny postoj', 'Skôr dôverujem', 'Väčšinou dôverujem', 'Absolútne dôverujem'] },
          { id: 'sd4', text: 'Rozhodnutia EÚ sú v prospech bežných občanov.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Absolútne nedôverujem', max: 'Absolútne dôverujem' }, scaleValueLabels: ['Absolútne nedôverujem', 'Väčšinou nedôverujem', 'Skôr nedôverujem', 'Neutrálny postoj', 'Skôr dôverujem', 'Väčšinou dôverujem', 'Absolútne dôverujem'] },
          { id: 'sd5', text: 'EÚ je schopná efektívne riešiť problémy (klíma, bezpečnosť, ekonomika).', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Absolútne nedôverujem', max: 'Absolútne dôverujem' }, scaleValueLabels: ['Absolútne nedôverujem', 'Väčšinou nedôverujem', 'Skôr nedôverujem', 'Neutrálny postoj', 'Skôr dôverujem', 'Väčšinou dôverujem', 'Absolútne dôverujem'] },
          { id: 'sd6', text: 'EÚ plní svoje sľuby a dodržiava pravidlá.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Absolútne nedôverujem', max: 'Absolútne dôverujem' }, scaleValueLabels: ['Absolútne nedôverujem', 'Väčšinou nedôverujem', 'Skôr nedôverujem', 'Neutrálny postoj', 'Skôr dôverujem', 'Väčšinou dôverujem', 'Absolútne dôverujem'] }
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 8: KONŠPIRAČNÉ PRESVEDČENIA (ACCORDION)
  // ==========================================
  {
    id: 'konspiracia_presvedcenia',
    title: 'Konšpiračné presvedčenia',
    subtitle: 'Bojovic, 2021; European Commission',
    instruction: 'Nižšie nájdete sériu tvrdení. Pri každom tvrdení prosím vyjadrite, do akej miery s ním súhlasíte. Kliknite na tvrdenie a vyberte odpoveď.',
    questions: [
      {
        id: 'konspiracia_presvedcenia_accordion',
        text: '',
        type: 'accordion-likert',
        required: false,
        questions: [
          // EÚ konšpiračné presvedčenia
          { id: 'ep1', text: 'Európska únia má skrytý plán systematicky zničiť suverenitu členských štátov.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'ep2', text: 'Rozhodnutia EÚ sú transparentné a robené Európskym parlamentom a zvolenými poslancami.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'ep3', text: 'Európske inštitúcie a mainstreamové médiá spolupracujú na tom, aby pred občanmi zatajili skutočné negatívne dôsledky rozhodnutí EÚ.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'ep4', text: 'EÚ rešpektuje a chráni národné kultúry a tradície všetkých členských štátov.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'ep5', text: 'EÚ zámerne obchádza demokratické procesy a ignoruje vôľu občanov, pretože sú riadené skrytou agendou globálnych elít.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'ep6', text: 'Regulácie EÚ sú navrhnuté aby chránili hospodárstvo všetkých členských štátov vrátane Slovenska, nie aby mu ublížili.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'ep7', text: 'Migračná kríza bola naplánovaná autoritami EÚ.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          
          // EÚ konšpiračné presvedčenia variované
          { id: 'epv1', text: 'Štáty si zachovávajú svoju suverenitu v rámci EÚ.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'epv2', text: 'Rozhodnutia EÚ v skutočnosti nerobí Európsky parlament, ale tajná skupina globálnych elít a veľkých korporácií.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'epv3', text: 'Európske inštitúcie a mainstreamové médiá transparentne informujú občanov o rozhodnutiach EÚ.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'epv4', text: 'EÚ má skrytý plán na zničenie národných kultúr a tradícií v prospech multikulturalizmu a liberálnych hodnôt.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'epv5', text: 'Všetky rozhodnutia EÚ sú prijaté v plne transparentných procesoch, kde všetci poslanci verejne hlasujú, a žiadna krajina nie je nútená ich nasledovať.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'epv6', text: 'EÚ vedome zavádza škodlivé regulácie s cieľom ekonomicky zničiť Slovensko a prinútiť nás byť úplne závislí na Bruseli.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'epv7', text: 'Migračná kríza bola prirodzená udalosť, nie naplánovaná autoritami EÚ.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          
          // Placebo tvrdenia
          { id: 'pt1', text: 'Slovensko je členským štátom Európskej únie.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'pt2', text: 'Európska únia je geograficky situovaná na Severnom Americkom kontinente.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'pt3', text: 'Euro (€) je jednotná mena používaná väčšinou členských štátov Európskej únie.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'pt4', text: 'Bratislava je hlavné mesto Slovenska.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'pt5', text: 'Na Slovensku sa aktuálne platí Slovenskou Korunou (SK).', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] },
          { id: 'pt6', text: 'Poslanci do Európskeho parlamentu sa volia.', scale: [1, 2, 3, 4, 5, 6, 7], scaleLabels: { min: 'Rozhodne nesúhlasím', max: 'Rozhodne súhlasím' }, scaleValueLabels: ['Rozhodne nesúhlasím', 'Väčšinou nesúhlasím', 'Skôr nesúhlasím', 'Neutrálny postoj', 'Skôr súhlasím', 'Väčšinou súhlasím', 'Rozhodne súhlasím'] }
        ]
      }
    ]
  },

  // ==========================================
  // STRANA 9: SOCIÁLNA ŽIADOSTIVOSŤ (bez zmeny - binary)
  // ==========================================
  {
    id: 'socialna_ziadostivost',
    title: 'Sociálna žiadostivosť',
    subtitle: 'Reynolds, 1982',
    instruction: 'Nižšie nájdete sériu tvrdení. Prečítajte si každé tvrdenie pozorne a rozhodnite sa, či je pre Vás pravdivé alebo nepravdivé. Nie sú tu správne alebo nesprávne odpovede – ide o to, ako vnímate sami seba. Všetky vaše odpovede zostanú anonymné a budú použité výlučne na výskumné účely.',
    questions: [
      { id: 'sds1', text: 'Niekedy je pre mňa ťažké pokračovať v práci, ak ma nikto nepodporí.', type: 'binary', required: true, options: [{ value: 'pravda', label: 'Pravda' }, { value: 'nepravda', label: 'Nepravda' }] },
      { id: 'sds2', text: 'Niekedy sa cítim rozčúlený/rozčúlená, keď si nemôžem dosiahnuť to, čo chcem.', type: 'binary', required: true, options: [{ value: 'pravda', label: 'Pravda' }, { value: 'nepravda', label: 'Nepravda' }] },
      { id: 'sds3', text: 'Niekoľkokrát som sa vzdal/vzdala robenia niečoho, pretože som nemal/mala dôveru v svoje schopnosti.', type: 'binary', required: true, options: [{ value: 'pravda', label: 'Pravda' }, { value: 'nepravda', label: 'Nepravda' }] },
      { id: 'sds4', text: 'Boli časy, keď som sa chcel/chcela búriť voči ľuďom vo funkcii, aj keď som vedel/vedela, že majú pravdu.', type: 'binary', required: true, options: [{ value: 'pravda', label: 'Pravda' }, { value: 'nepravda', label: 'Nepravda' }] },
      { id: 'sds5', text: 'Bez ohľadu na to, s kým som v rozhovore, som vždy dobrý/dobrá poslucháč/poslucháčka.', type: 'binary', required: true, options: [{ value: 'pravda', label: 'Pravda' }, { value: 'nepravda', label: 'Nepravda' }] },
      { id: 'sds6', text: 'Boli okamžiky, keď som zneužil/zneužila niekoho.', type: 'binary', required: true, options: [{ value: 'pravda', label: 'Pravda' }, { value: 'nepravda', label: 'Nepravda' }] },
      { id: 'sds7', text: 'Vždy som ochotný/ochotná priznať, keď spravím chybu.', type: 'binary', required: true, options: [{ value: 'pravda', label: 'Pravda' }, { value: 'nepravda', label: 'Nepravda' }] },
      { id: 'sds8', text: 'Niekedy sa pokúšam pomstiť sa namiesto toho, aby som odpustil/odpustila a zabudol/zabudla.', type: 'binary', required: true, options: [{ value: 'pravda', label: 'Pravda' }, { value: 'nepravda', label: 'Nepravda' }] },
      { id: 'sds9', text: 'Som vždy zdvorilostný/zdvorilostná, dokonca aj voči ľuďom, ktorí sú nepriaznivo naladení.', type: 'binary', required: true, options: [{ value: 'pravda', label: 'Pravda' }, { value: 'nepravda', label: 'Nepravda' }] },
      { id: 'sds10', text: 'Nikdy som sa nehneval/nenahnevala, keď ľudia vyjadrili nápady veľmi odlišné od tých mojich.', type: 'binary', required: true, options: [{ value: 'pravda', label: 'Pravda' }, { value: 'nepravda', label: 'Nepravda' }] },
      { id: 'sds11', text: 'Boli časy, keď som bol/bola dosť žiarlivý/žiarlivá na dobrú náladu druhých.', type: 'binary', required: true, options: [{ value: 'pravda', label: 'Pravda' }, { value: 'nepravda', label: 'Nepravda' }] },
      { id: 'sds12', text: 'Niekedy som rozčúlený/rozčúlená, keď ľudia odo mňa niečo chcú.', type: 'binary', required: true, options: [{ value: 'pravda', label: 'Pravda' }, { value: 'nepravda', label: 'Nepravda' }] },
      { id: 'sds13', text: 'Nikdy som úmyselne nepovedal/nepovedala niečo, čo by niekoho zranilo.', type: 'binary', required: true, options: [{ value: 'pravda', label: 'Pravda' }, { value: 'nepravda', label: 'Nepravda' }] }
    ]
  }
].map(page => ({
  ...page,
  questions: [
    ...page.questions,
    ...createFeedbackQuestions(page.id, page.questions.filter(q => !q.isFeedback && q.type !== 'accordion-likert').length)
  ]
}));



// ==========================================
// HLAVNÝ KOMPONENT
// ==========================================

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
  const [activeAccordionId, setActiveAccordionId] = useState(null);

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
    setActiveAccordionId(null);
  }, [currentPage]);

  // Kontrola podmienok zobrazenia otázky
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

  // Zmena odpovede s auto-save
  const handleAnswer = async (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    setQuestionErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
    
    await responseManager.saveAnswer(userId, COMPONENT_ID, questionId, value);
  };

  // Checkbox handler
  const handleCheckboxChange = async (questionId, optionValue) => {
    const currentValues = answers[questionId] || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    
    await handleAnswer(questionId, newValues);
  };

  // Number select handler
  const handleNumberSelect = async (questionId, number, multiple) => {
    if (multiple) {
      const currentValues = answers[questionId] || [];
      const newValues = currentValues.includes(number)
        ? currentValues.filter(n => n !== number)
        : [...currentValues, number].sort((a, b) => a - b);
      await handleAnswer(questionId, newValues);
    } else {
      await handleAnswer(questionId, number);
    }
  };

  // Accordion handler
  const handleAccordionClick = (subQuestionId) => {
    setActiveAccordionId(activeAccordionId === subQuestionId ? null : subQuestionId);
  };

  const handleAccordionAnswer = async (accordionQuestions, subQuestionId, scaleValue) => {
    await handleAnswer(subQuestionId, scaleValue);
    
    const currentIndex = accordionQuestions.findIndex(q => q.id === subQuestionId);
    
    if (currentIndex < accordionQuestions.length - 1) {
      setTimeout(() => {
        const nextQuestion = accordionQuestions[currentIndex + 1];
        setActiveAccordionId(nextQuestion.id);
        
        const nextElement = questionRefs.current[nextQuestion.id];
        if (nextElement) {
          nextElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    } else {
      setTimeout(() => {
        setActiveAccordionId(null);
      }, 300);
    }
  };

  // Validácia stránky
  const validatePage = () => {
    const page = PAGES[currentPage];
    const errors = {};
    let hasError = false;

    const validateQuestion = (question) => {
      if (!shouldShowQuestion(question, answers)) return;
      if (!question.required) return;

      const answer = answers[question.id];

      if (answer === undefined || answer === null || answer === '') {
        errors[question.id] = 'Táto otázka je povinná';
        hasError = true;
      }

      if (question.type === 'checkbox' && (!Array.isArray(answer) || answer.length === 0)) {
        errors[question.id] = 'Vyberte aspoň jednu možnosť';
        hasError = true;
      }
    };

    page.questions.forEach(question => {
      if (question.type === 'accordion-likert' && question.questions) {
        question.questions.forEach(validateQuestion);
      } else {
        validateQuestion(question);
      }
    });

    setQuestionErrors(errors);

    if (hasError) {
      setError('Prosím vyplňte všetky povinné otázky');
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

    if (currentPage < PAGES.length - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
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

      await dataManager.markComponentComplete(userId, COMPONENT_ID);
      navigate('/mission0/complete');
    } catch (err) {
      console.error('Error submitting questionnaire:', err);
      setError('Chyba pri odosielaní dotazníka. Skúste to znova.');
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // RENDER FUNKCIE
  // ==========================================

  const renderQuestionInput = (question) => {
    const value = answers[question.id];

    switch (question.type) {
      case 'accordion-likert':
        const accordionQuestions = question.questions || [];
        
        return (
          <AccordionQuestionList>
            {accordionQuestions.map((subQuestion, index) => {
              const subValue = answers[subQuestion.id];
              const isActive = activeAccordionId === subQuestion.id;
              const isCompleted = subValue !== undefined && subValue !== null;
              
              let valueDescription = '';
              if (isCompleted && subQuestion.scaleValueLabels) {
                const valueIndex = subQuestion.scale.indexOf(subValue);
                valueDescription = subQuestion.scaleValueLabels[valueIndex] || '';
              }
              
              return (
                <AccordionQuestionItem
                  key={subQuestion.id}
                  ref={el => (questionRefs.current[subQuestion.id] = el)}
                  isActive={isActive}
                  isCompleted={isCompleted}
                >
                  <AccordionQuestionHeader
                    onClick={() => handleAccordionClick(subQuestion.id)}
                  >
                    <AccordionQuestionTitle>
                      <AccordionQuestionNumber>{index + 1}.</AccordionQuestionNumber>
                      <AccordionQuestionText>{subQuestion.text}</AccordionQuestionText>
                    </AccordionQuestionTitle>
                    
                    <AccordionQuestionStatus>
                      {isCompleted && (
                        <>
                          <CheckIcon>✓</CheckIcon>
                          <AccordionAnswerPreview>
                            {subValue} - {valueDescription}
                          </AccordionAnswerPreview>
                        </>
                      )}
                      {!isCompleted && (
                        <span style={{ color: '#ff9800', fontSize: '12px' }}>Nevyplnené</span>
                      )}
                    </AccordionQuestionStatus>
                  </AccordionQuestionHeader>
                  
                  {isActive && (
                    <AccordionScaleContainer>
                      <AccordionScaleButtons>
                        {subQuestion.scale.map(scaleValue => (
                          <AccordionScaleButton
                            key={scaleValue}
                            type="button"
                            checked={subValue === scaleValue}
                            onClick={() => handleAccordionAnswer(accordionQuestions, subQuestion.id, scaleValue)}
                          >
                            {scaleValue}
                          </AccordionScaleButton>
                        ))}
                      </AccordionScaleButtons>
                      
                      {subQuestion.scaleLabels && (
                        <AccordionScaleLabels>
                          <span>{subQuestion.scaleLabels.min}</span>
                          <span>{subQuestion.scaleLabels.max}</span>
                        </AccordionScaleLabels>
                      )}
                      
                      {subQuestion.scaleValueLabels && (
                        <AccordionScaleDescriptions>
                          {subQuestion.scale.map((scaleValue, idx) => (
                            <AccordionScaleDescItem
                              key={scaleValue}
                              isSelected={subValue === scaleValue}
                            >
                              <span className="number">{scaleValue}:</span>
                              <span className="description">
                                {subQuestion.scaleValueLabels[idx]}
                              </span>
                            </AccordionScaleDescItem>
                          ))}
                        </AccordionScaleDescriptions>
                      )}
                    </AccordionScaleContainer>
                  )}
                </AccordionQuestionItem>
              );
            })}
          </AccordionQuestionList>
        );

      case 'radio':
        return (
          <RadioGroup>
            {question.options.map(option => (
              <RadioOption key={option.value}>
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleAnswer(question.id, option.value)}
                />
                <span>{option.label}</span>
              </RadioOption>
            ))}
            {question.hasOther && (
              <div style={{ marginTop: '8px', paddingLeft: '36px' }}>
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
              <CheckboxOption key={option.value}>
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={() => handleCheckboxChange(question.id, option.value)}
                />
                <span>{option.label}</span>
              </CheckboxOption>
            ))}
          </CheckboxGroup>
        );

      case 'likert':
        return (
          <>
            <ScaleContainer>
              {question.scale.map((scaleValue, idx) => (
                <ScaleButtonWrapper key={scaleValue}>
                  <ScaleRadioLabel>
                    <input
                      type="radio"
                      name={question.id}
                      value={scaleValue}
                      checked={value === scaleValue}
                      onChange={() => handleAnswer(question.id, scaleValue)}
                    />
                    <div className="scale-number">{scaleValue}</div>
                  </ScaleRadioLabel>
                  {question.scaleValueLabels && question.scaleValueLabels[idx] && (
                    <ScaleValueLabel>{question.scaleValueLabels[idx]}</ScaleValueLabel>
                  )}
                </ScaleButtonWrapper>
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
                <LadderOption key={scaleValue}>
                  <input
                    type="radio"
                    name={question.id}
                    value={scaleValue}
                    checked={value === scaleValue}
                    onChange={() => handleAnswer(question.id, scaleValue)}
                  />
                  <div className="ladder-content">
                    <span className="ladder-number">{scaleValue}</span>
                  </div>
                </LadderOption>
              ))}
            </LadderContainer>
            {question.hasPreferNotToSay && (
              <PreferNotToSayOption>
                <input
                  type="checkbox"
                  checked={value === 'prefer_not_to_say'}
                  onChange={() => handleAnswer(question.id, 'prefer_not_to_say')}
                />
                <span>Preferujem neuvádzať</span>
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

      case 'binary':
        return (
          <BinaryGroup>
            {question.options.map(option => (
              <BinaryOption key={option.value}>
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleAnswer(question.id, option.value)}
                />
                <span>{option.label}</span>
              </BinaryOption>
            ))}
          </BinaryGroup>
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
                <strong>Vybrané:</strong> {selectedNumbers.join(', ')}
              </SelectedNumbers>
            )}
          </NumberSelectContainer>
        );

      default:
        return null;
    }
  };

  const renderQuestion = (question, index) => {
    if (!shouldShowQuestion(question, answers)) return null;
    if (question.type === 'accordion-likert') {
      return (
        <div key={question.id}>
          {renderQuestionInput(question)}
        </div>
      );
    }

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

  // ==========================================
  // RENDER HLAVNÉHO UI
  // ==========================================

  const page = PAGES[currentPage];
  const progress = ((currentPage + 1) / PAGES.length) * 100;
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

          {page.title && <Title>{page.title}</Title>}
          {page.subtitle && <Subtitle>{page.subtitle}</Subtitle>}
          {page.instruction && <Instruction>{page.instruction}</Instruction>}

          {error && <ErrorText>{error}</ErrorText>}

          {mainQuestions.map((question, index) => renderQuestion(question, index))}

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
              accent
            >
              {isSubmitting ? 'Ukladám...' : (currentPage < PAGES.length - 1 ? 'Ďalej →' : 'Odoslať')}
            </StyledButton>
          </ButtonContainer>

          <ProgressIndicator>
            Dokončených strán: {currentPage} / {PAGES.length}
          </ProgressIndicator>
        </Card>
      </Container>
    </Layout>
  );
};

export default Questionnaire0;
