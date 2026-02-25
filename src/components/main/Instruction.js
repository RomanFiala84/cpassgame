// src/components/main/Instruction.js
// FINÁLNA VERZIA s kontrolou duplicitných emailov

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../styles/Layout';
import StyledButton from '../../styles/StyledButton';
import { useUserStats } from '../../contexts/UserStatsContext';

// =====================
// STYLED COMPONENTS
// =====================

// =====================
// STYLED COMPONENTS
// =====================

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 30px 15px;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  text-align: center;
  margin-bottom: 16px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.ACCENT_COLOR},
    ${props => props.theme.ACCENT_COLOR_2}
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
  
  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  line-height: 1.6;
  max-width: 800px; /* ✅ Zmenené na 800px */
  margin-bottom: 32px;
  color: ${props => props.theme.SECONDARY_TEXT_COLOR};
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 24px;
  }
`;

const InstructionsSection = styled.div`
  width: 100%;
  max-width: 800px; /* ✅ Zostáva 800px */
  margin-bottom: 32px;
`;

const WelcomeText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  text-align: center;
  margin-bottom: 24px;
`;

const AccordionItem = styled.div`
  margin-bottom: 12px;
  border: 1px solid ${props => props.theme.BORDER_COLOR};
  border-radius: 12px;
  overflow: hidden;
  background: ${props => props.theme.CARD_BACKGROUND};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.ACCENT_COLOR}66;
  }
`;

const AccordionHeader = styled.button`
  width: 100%;
  padding: 16px 20px;
  background: ${props => props.$isOpen ? props.theme.CARD_BACKGROUND : 'transparent'};
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$isOpen ? props.theme.ACCENT_COLOR : props.theme.PRIMARY_TEXT_COLOR};
  transition: all 0.2s ease;
  font-family: inherit;
  
  &:hover {
    color: ${props => props.theme.ACCENT_COLOR};
  }
  
  @media (max-width: 768px) {
    font-size: 15px;
    padding: 14px 16px;
  }
`;

const AccordionIcon = styled.span`
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.3s ease;
  font-size: 14px;
  color: ${props => props.theme.ACCENT_COLOR};
`;

const AccordionContent = styled.div`
  max-height: ${props => props.$isOpen ? '3000px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

const AccordionInner = styled.div`
  padding: ${props => props.$isOpen ? '0 20px 20px 20px' : '0 20px'};
  color: ${props => props.theme.SECONDARY_TEXT_COLOR};
  line-height: 1.8;
  font-size: 14px;
  
  h3 {
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    margin: 16px 0 8px 0;
    font-size: 15px;
    font-weight: 600;
  }
  
  ul {
    margin: 8px 0;
    padding-left: 24px;
  }
  
  li {
    margin-bottom: 8px;
  }
  
  p {
    margin-bottom: 12px;
  }
  
  strong {
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    font-weight: 600;
  }
  
  a {
    color: ${props => props.theme.ACCENT_COLOR};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
    
    h3 {
      font-size: 14px;
    }
  }
`;

const FormCard = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.$hasError ? '#ef4444' : p.theme.BORDER_COLOR};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 800px; /* ✅ Zmenené z 600px na 800px */
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${p => p.$hasError ? '#ef4444' : p.theme.ACCENT_COLOR}66;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
  
  label {
    cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
    color: ${p => p.$disabled ? p.theme.SECONDARY_TEXT_COLOR : p.theme.PRIMARY_TEXT_COLOR};
    text-decoration: ${p => p.$disabled ? 'line-through' : 'none'};
    opacity: ${p => p.$disabled ? 0.6 : 1};
    user-select: none;
    font-size: 15px;
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  accent-color: ${p => p.theme.ACCENT_COLOR};
`;

const InputLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-size: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : props.theme.BORDER_COLOR};
  border-radius: 10px;
  font-size: 16px;
  background: ${props => props.theme.INPUT_BACKGROUND};
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : props.theme.ACCENT_COLOR};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? '#ef444422' : `${props.theme.ACCENT_COLOR}22`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${props => props.theme.BORDER_COLOR};
  }
  
  &::placeholder {
    text-transform: none;
    letter-spacing: normal;
    font-weight: normal;
    opacity: 0.5;
  }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 13px;
  margin-top: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '⚠️';
  }
`;

const Note = styled.div`
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-top: 8px;
  line-height: 1.5;
`;

const InfoBox = styled.div`
  background: ${p => p.$hasError ? '#ef444411' : `${p.theme.ACCENT_COLOR}11`};
  border-left: 4px solid ${p => p.$hasError ? '#ef4444' : p.theme.ACCENT_COLOR};
  padding: 20px;
  margin-bottom: 24px;
  max-width: 800px; /* ✅ Zmenené z 600px na 800px */
  width: 100%;
  border-radius: 12px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const InfoTitle = styled.div`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-weight: 700;
  margin-bottom: 12px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoText = styled.div`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 14px;
  line-height: 1.8;
  
  strong {
    color: ${p => p.theme.PRIMARY_TEXT_COLOR};
    font-weight: 600;
  }
`;

const ExampleCode = styled.code`
  background: ${p => p.theme.INPUT_BACKGROUND};
  padding: 4px 10px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  color: ${p => p.theme.ACCENT_COLOR};
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 1px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  width: 100%;
  max-width: 800px; /* ✅ Zmenené z 600px na 800px */
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const BlockedWarning = styled.div`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: 2px solid #b91c1c;
  border-radius: 16px;
  padding: 32px;
  margin: 24px 0;
  max-width: 800px; /* ✅ Zmenené z 600px na 800px */
  width: 100%;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
  text-align: center;
  animation: shake 0.5s ease-in-out;
  scroll-margin-top: 20px;
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  
  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const BlockedIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const BlockedTitle = styled.h2`
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const BlockedMessage = styled.p`
  color: #fecaca;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ContactInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
  color: #fef2f2;
  font-size: 14px;
  
  strong {
    color: #ffffff;
  }
`;

const ClearCodeButton = styled(StyledButton)`
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ReferralNotice = styled.div`
  background: ${p => `${p.theme.ACCENT_COLOR}22`};
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  max-width: 800px; /* ✅ Zmenené z 600px na 800px */
  width: 100%;
  text-align: center;
  animation: slideIn 0.5s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ReferralNoticeText = styled.div`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 14px;
  margin-bottom: 8px;
  
  strong {
    color: ${p => p.theme.ACCENT_COLOR};
    font-weight: 700;
    font-size: 18px;
    letter-spacing: 2px;
  }
`;

const CompetitionSection = styled(FormCard)`
  background: ${p => `${p.theme.ACCENT_COLOR}11`};
  border-color: ${p => p.theme.ACCENT_COLOR}44;
`;

const CompetitionTitle = styled.h3`
  color: ${p => p.theme.ACCENT_COLOR};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const CompetitionText = styled.p`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const EmailInput = styled(Input)`
  text-transform: none;
  letter-spacing: normal;
`;

const RulesSection = styled.div`
  width: 100%;
  max-width: 800px; /* ✅ Zmenené z 600px na 800px */
  margin-bottom: 20px;
`;

const RulesAccordion = styled(AccordionItem)`
  border-color: ${p => p.theme.ACCENT_COLOR}44;
  
  &:hover {
    border-color: ${p => p.theme.ACCENT_COLOR};
  }
`;


// =====================
// MAIN COMPONENT
// =====================

export default function Instruction() {
  const navigate = useNavigate();
  const { login, dataManager } = useUserStats();

  const [participantCode, setParticipantCode] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [hasReferral, setHasReferral] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [competitionConsent, setCompetitionConsent] = useState(false);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [referralAlreadyUsed, setReferralAlreadyUsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [referralFromUrl, setReferralFromUrl] = useState(false);
  const [openSections, setOpenSections] = useState({});
  
  const blockedWarningRef = useRef(null);

  useEffect(() => {
  const checkExistingSession = async () => {
    const existingCode = sessionStorage.getItem('participantCode');
    
    if (existingCode && !['0', '1', '2'].includes(existingCode)) {
      console.log(`🔍 Kontrolujem existujúcu session: ${existingCode}`);
      
      try {
        const userData = await dataManager.loadUserProgress(existingCode, true);
        
        if (userData?.blocked) {
          console.log(`❌ Účastník ${existingCode} je blokovaný - odhlasenie`);
          sessionStorage.removeItem('participantCode');
          setParticipantCode(existingCode);
          setIsBlocked(true);
          setTimeout(() => {
            blockedWarningRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    }
  };

  checkExistingSession();
}, [dataManager]);

  // URL referral check
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode && refCode.length === 6) {
      console.log(`🔗 URL obsahuje referral code: ${refCode}`);
      
      const upperRef = refCode.toUpperCase();
      sessionStorage.setItem('referralCode', upperRef);
      
      setReferralCode(upperRef);
      setHasReferral(true);
      setReferralFromUrl(true);
      
      console.log(`✅ Referral kód automaticky vyplnený: ${upperRef}`);
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const validateEmail = (email) => {
    if (!email) return true;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateParticipantCode = (code) => {
    const upperCode = code.toUpperCase().trim();
    
    if (upperCode === 'RF9846') {
      return { valid: true, type: 'admin' };
    }
    
    const testPattern = /^TEST([0-5][0-9]|60)$/;
    if (testPattern.test(upperCode)) {
      return { valid: true, type: 'test' };
    }
    
    const participantPattern = /^[A-Z]{4}(0[1-9]|1[0-2])$/;
    if (participantPattern.test(upperCode)) {
      return { valid: true, type: 'participant' };
    }
    
    return { valid: false, type: null };
  };

  const checkReferralStatus = async (userCode) => {
    if (!userCode || userCode.length !== 6) return false;
    
    try {
      setIsCheckingCode(true);
      
      const userData = await dataManager.loadUserProgress(userCode, true);
      
      if (userData?.blocked) {
        console.log(`🚫 Používateľ ${userCode} je blokovaný`);
        setIsBlocked(true);
        
        setTimeout(() => {
          blockedWarningRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 100);
        
        return true;
      } else {
        setIsBlocked(false);
      }
      
      if (userData?.used_referral_code) {
        console.log(`⚠️ Používateľ ${userCode} už použil referral kód`);
        setReferralAlreadyUsed(true);
        setHasReferral(false);
        return true;
      }
      
      setReferralAlreadyUsed(false);
      return false;
    } catch (error) {
      console.warn('Could not check referral status:', error);
      return false;
    } finally {
      setIsCheckingCode(false);
    }
  };

  const validate = async () => {
    const e = {};
    
    if (isBlocked) {
      e.blocked = 'Váš účet bol zablokovaný administrátorom.';
      return e;
    }
    
    if (!consentGiven) {
      e.consent = 'Pre zapojenie sa do výskumu je potrebné poskytnúť informovaný súhlas s podmienkami výskumu.';
    }
    
    const codeValidation = validateParticipantCode(participantCode);
    if (!codeValidation.valid) {
      e.participant = 'Zadali ste neplatný formát identifikačného kódu respondenta. Zadajte identifikačný kód podľa inštrukcií.';
    }
    
    // ✅ Email validácia
    if (email && !validateEmail(email)) {
      e.email = 'Prosím zadajte e-mailovú adresu v správnom formáte.';
    }
    
    // ✅ Kontrola duplicitného emailu
    if (email && validateEmail(email)) {
      try {
        const exists = await dataManager.checkEmailExists(email);
        if (exists) {
          e.email = 'Táto e-mailová adresa už bola zaregistrovaná v súťaži.';
        }
      } catch (error) {
        console.error('Error checking email:', error);
      }
    }
    
    // ✅ Ak je zadaný email, súhlas so súťažou je povinný
    if (email && !competitionConsent) {
      e.competitionConsent = 'Pre zapojenie sa do súťaže je potrebné poskytnúť informovaný súhlas s pravidlami a podmienkami súťaže.';
    }
    
    if (hasReferral) {
      if (referralAlreadyUsed) {
        e.referral = 'Už ste použili referral kód.';
      } else if (!referralCode || !/^[A-Z0-9]{6}$/.test(referralCode.trim())) {
        e.referral = 'Referral kód musí mať presne 6 znakov.';
      } else {
        const valid = await dataManager.validateReferralCode(referralCode.trim().toUpperCase());
        if (!valid) {
          e.referral = 'Tento referral kód neexistuje.';
        } else {
          const userSharingCode = await dataManager.getUserSharingCode(participantCode.toUpperCase());
          if (userSharingCode && userSharingCode === referralCode.trim().toUpperCase()) {
            e.referral = 'Nemôžete použiť svoj vlastný referral kód!';
          }
        }
      }
    }
    
    return e;
  };

  const handleStart = async () => {
  setIsLoading(true);
  const e = await validate();
  setErrors(e);
  
  if (Object.keys(e).length) {
    setIsLoading(false);
    return;
  }

  const codeValidation = validateParticipantCode(participantCode);
  const upperCode = participantCode.toUpperCase();
  
  // ✅ ODSTRÁNENÉ - sessionStorage.setItem('participantCode', upperCode);
  
  // ✅ NOVÉ - Ulož informovaný súhlas PRED login
  try {
    const userData = await dataManager.loadUserProgress(upperCode);
    
    // Informovaný súhlas s výskumom
    userData.informed_consent_given = consentGiven;
    userData.informed_consent_timestamp = new Date().toISOString();
    
    // Súhlas so súťažou (ak je zadaný email)
    if (email && competitionConsent) {
      userData.competition_consent_given = true;
      userData.competition_consent_timestamp = new Date().toISOString();
    }
    
    await dataManager.saveProgress(upperCode, userData);
    console.log(`✅ Súhlasy uložené pre ${upperCode}`);
    
  } catch (error) {
    console.error('Error saving consents:', error);
  }

  // ✅ Ulož email ak je validný
  if (email && validateEmail(email) && competitionConsent) {
    try {
      await dataManager.saveCompetitionEmail(upperCode, email);
      console.log(`✅ Email pre súťaž uložený: ${email}`);
    } catch (error) {
      console.error('Email save error:', error);
    }
  }
  
  // Spracuj referral kód
  if (hasReferral && !referralAlreadyUsed && referralCode.trim()) {
    try {
      await dataManager.processReferral(upperCode, referralCode.trim().toUpperCase());
    } catch (error) {
      console.error('Referral processing error:', error);
      setErrors({ referral: 'Chyba pri spracovaní referral kódu. Zadajte kód znova.' });
      setIsLoading(false);
      return;
    }
  }
  
  // ✅ OPRAVENÉ - Spracuj výsledok loginu
  const loginResult = await login(upperCode);
  
  if (!loginResult.success) {
    if (loginResult.blocked) {
      // Ak je blokovaný, zobraz upozornenie
      setIsBlocked(true);
      setParticipantCode(upperCode);
      setErrors({ blocked: 'Tento účet bol zablokovaný administrátorom.' });
      setTimeout(() => {
        blockedWarningRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      setErrors({ general: loginResult.message || 'Chyba pri prihlásení' });
    }
    setIsLoading(false);
    return; // ⭐ ZASTAVÍ prihlásenie
  }

  setIsLoading(false);
  
  // ✅ Redirect len ak je prihlásenie úspešné
  if (codeValidation.type === 'admin') {
    navigate('/admin');
  } else {
    navigate('/intro');
  }
};


  const handleClearCode = () => {
    setParticipantCode('');
    setIsBlocked(false);
    setReferralAlreadyUsed(false);
    setErrors({});
    setConsentGiven(false);
    setCompetitionConsent(false);
    setHasReferral(false);
    setReferralCode('');
    setReferralFromUrl(false);
    setEmail('');
  };

  const instructionsSections = [
    {
      id: 'podmienky',
      title: 'Aké sú podmienky účasti vo výskume?',
      content: (
        <>
          <ul>
            <li>Účasť je určená len pre dospelé osoby (18 a viac rokov), ktoré sú schopné samostatne posúdiť informácie o výskume a rozhodnúť sa o svojej účasti.</li>
            <li>Pre účasť je ďalej potrebné, aby účastník pochádzal/a zo Slovenska, prípadne mal/a trvalý/dlhodobý pobyt na území Slovenskej republiky.</li>
            <li>Pozorne si prečítajte každú otázku a tvrdenie, odpovedajte prosím úprimne. Veľmi dlho nad otázkami a tvrdeniami nepremýšľajte. Pri jednotlivých položkách nie sú správne alebo nesprávne odpovede.</li>
            <li>Pre lepšie spracovanie dát vás prosíme aby ste použili počítač alebo notebook, ak použijete mobilný telefón alebo tablet neobmedzí to vašu účasť vo výskume.</li>
            <li>V prípade porušenia podmienok výskumu, môžete byť z výskumu a súťaže o ceny vylúčený, následkom čoho bude zablokovanie vášho prístupu do aplikácie.</li>
          </ul>
        </>
      )
    },
    {
      id: 'ciel',
      title: 'Čo je cieľom predvýskumu a hlavného výskumu?',
      content: (
        <>
          <ul>
            <li>Predvýskum:</li>
            <ul> 
              <li>Predtým ako spustíme hlavný výskum, potrebujeme overiť, že všetky otázky a tvrdenia v dotazníku sú zrozumiteľné a jednoznačné.</li>
            </ul>
            <li>Hlavný výskum:</li>
            <ul>
              <li>Cieľom nášho hlavného výskumu je lepšie porozumieť tomu, ako ľudia na Slovensku vnímajú inštitúcie Európskej únie, ako im dôverujú a aké faktory s tým súvisia. V našom výskume sme sa preto zameriavame na to ako informácie o fungovaní EÚ a jej prínosoch môžu pôsobiť na presvedčenia a mieru dôvery v inštitúcie EÚ.</li>
            </ul>
          </ul>
        </>
      )
    },
    {
      id: 'priebehPred',
      title: 'Ako bude prebiehať predvýskum?',
      content: (
        <>
          <ul>
            <li>V predvýskume prejdete sériou otázok a tvrdení - dotazník (5-10 minút).</li>
            <li>Pri hodnotení neexistujú správne ani nesprávne odpovede a po každom bloku otázok vás požiadame o spätnú väzbu.</li>
            <li>Budeme sa pýtať napríklad na:</li>
            <ul>
              <li>Zrozumiteľnosť: Bola otázka alebo tvrdenie významovo jasná? Rozumeli ste všetkým použitým slovám?</li>
              <li>Jednoznačnosť: Mohli by ste si otázku vyložiť viacerými spôsobmi?</li>
              <li>Významová zhoda: Pri niektorých položkách vám ukážeme dva rôzne spôsoby formulácie toho istého tvrdenia. Budeme sa pýtať, či podľa vás znamenajú to isté, alebo sa v niečom líšia.</li>
              <li>Hodnotiaca stupnica: Bola stupnica odpovedí zrozumiteľná a mali ste pocit, že dokážete vyjadriť svoj skutočný postoj?</li>
            </ul>
          </ul>
        </>
      )
    },
    {
      id: 'priebehHlavny',
      title: 'Ako bude prebiehať hlavný výskum?',
      content: (
        <>
          <ul>
            <li>Výskum prebieha online formou interaktívnej aplikácie.</li>
            <li>Pozostáva z troch fáz:</li>
              <ul>
                <li>Úvodný dotazník (5-10 minút)</li>
                <li>Misia 1 (10-15 minút) - Prebehne bezprostredne po dokončení úvodného dotazníka</li>
                <li>Misia 2 (10-15 minút) - Prebehne po piatich dňoch od dokončenia Misie 1</li>
              </ul>
            <li>Počas výskumu budeme automaticky zaznamenávať vaše interakcie s aplikáciou pre účely výskumu.</li>
          </ul>
        </>
      )
    },
    {
      id: 'spracovanie',
      title: 'Ako budú spracované výsledky a chránené vaše údaje?',
      content: (
        <>
          <ul>
            <li>Odpovede, ktoré nám poskytnete vyplnením dotazníka, budú použité výhradne na výskumné účely.</li>
            <li>Výsledky budú spracované a zverejňované len v anonymizovanej, súhrnnej forme, takže z nich nebude možné spätne identifikovať konkrétnu osobu.</li>
            <li>V dotazníku neuvádzate žiadne osobné identifikačné údaje ani IP adresu a namiesto mena si vytvoríte jedinečný kód.</li>
            <li>Všetky údaje sú anonymné, dôverné a uložené v zabezpečenej databáze, ku ktorej má prístup len výskumný tím.</li>
            <li>Ak poskytnete e‑mailovú adresu kvôli zapojeniu sa do súťaže alebo do ďalšej časti výskumu, bude použitá výhradne na tieto účely a po ukončení súťaže a výskumu bude bezprostredne vymazaná.</li>
          </ul>
        </>
      )
    },
    {
      id: 'odstupenie',
      title: 'Môžem odstúpiť?',
      content: (
        <>
          <ul>
            <li>Áno. Účasť je dobrovoľná a môžete kedykoľvek odstúpiť bez udania dôvodu.</li>
            <li>Môžete tiež požiadať o vymazanie údajov, ktoré budú odstránené najneskôr do 7 dní po ukončení výskumu.</li>
          </ul>
        </>
      )
    },
    {
      id: 'rizika',
      title: 'Aké sú riziká účasti vo výskume?',
      content: (
        <>
          <ul>
            <li>Účasť nepredstavuje žiadne závažné riziká.</li>
            <li>Niektoré tvrdenia sa dotýkajú citlivých spoločenských tém, čo môže vyvolať mierne emocionálne napätie.</li>
            <li>Ak pocítite akúkoľvek nepohodu, môžete účasť kedykoľvek ukončiť, prípadne využiť niektorý z kontaktov pre pomoc uvedených nižšie.</li>
          </ul>
        </>
      )
    },
    {
      id: 'podpora',
      title: 'Čo ak sa budem počas výskumu cítiť znepokojení?',
      content: (
        <>
          <ul>
            <li>Je úplne v poriadku mať z niektorých tém alebo tvrdení nepríjemný pocit -- dotýkajú sa citlivých spoločenských tém.</li>
            <ul>
              <li>Odporúčame o svojich pocitoch alebo otázkach hovoriť s niekým, komu dôverujete (priateľ, rodina, odborník).</li>
              <li>Ak máte pocit, že na vás podobné informácie dlhodobo pôsobia stresujúco alebo úzkostne, môže byť užitočné poradiť sa so psychológom alebo iným odborníkom.</li>
            </ul>
            <li>Dostupné zdroje pomoci:</li>
            <ul>
              <li>Kontakt na výskumníka - <a href="mailto:roman.fiala@tvu.sk">roman.fiala@tvu.sk</a></li>
              <li>IPčko - <a href="https://ipcko.sk" target="_blank" rel="noopener noreferrer">https://ipcko.sk</a></li>
              <li>Linka dôvery - <a href="https://www.linkanezabudka.sk" target="_blank" rel="noopener noreferrer">https://www.linkanezabudka.sk</a></li>
            </ul>
          </ul>
        </>
      )
    },
    {
      id: 'sutaz',
      title: 'Súťaž',
      content: (
        <>
          <ul>
            <li>Súťaž bude vyhodnotená na základe stanovených pravidiel do 10 dní od ukončenia hlavného výskumu.</li>
            <li>Podrobné informácie o bodovaní, cenách a podmienkach účasti nájdete nižšie v sekcii Pravidlá a podmienky súťaže.</li>
          </ul>
        </>
      )
    },
    {
      id: 'kontakt',
      title: 'Kontakt',
      content: (
        <>
          <ul> 
            <li>V prípade, že máte otázky k samotnému výskumu, môžete nás kontaktovať na uvedenom e‑maile -- radi vám poskytneme doplňujúce informácie.</li>
            <li>Výskumník: Roman Fiala<br/>
            Psychológia, 3. roč. Bc.<br/>
            Katedra psychológie, Filozofická fakulta, Trnavská univerzita v Trnave<br/>
            Email: <a href="mailto:roman.fiala@tvu.sk">roman.fiala@tvu.sk</a></li>
          </ul>
        </>
      )
    }
  ];

  return (
    <Layout showLevelDisplay={false}>
      <Container>
        <Title><strong>CP-PASS</strong></Title>
        <Subtitle>
          <strong>Milá respondentka, milý respondent, ďakujeme vám za váš čas a ochotu zúčastniť sa v našom výskume.</strong>
        </Subtitle>

        {/* Expandable sekcie s inštrukciami */}
        <InstructionsSection>
          <WelcomeText>
            <strong>Prečítajte si prosím pozorne podmienky a inštrukcie k výskumu.</strong>
          </WelcomeText>
          
          {instructionsSections.map(section => (
            <AccordionItem key={section.id}>
              <AccordionHeader 
                onClick={() => toggleSection(section.id)}
                $isOpen={openSections[section.id]}
              >
                {section.title}
                <AccordionIcon $isOpen={openSections[section.id]}>▼</AccordionIcon>
              </AccordionHeader>
              <AccordionContent $isOpen={openSections[section.id]}>
                <AccordionInner $isOpen={openSections[section.id]}>
                  {section.content}
                </AccordionInner>
              </AccordionContent>
            </AccordionItem>
          ))}
        </InstructionsSection>

        {/* Indikátor automaticky vyplneného referral kódu */}
        {referralFromUrl && referralCode && (
          <ReferralNotice>
            <ReferralNoticeText>
              Referral kód bol automaticky vyplnený: <strong>{referralCode}</strong>
            </ReferralNoticeText>
            <ReferralNoticeText style={{ marginTop: '8px', fontSize: '13px' }}>
              Váš priateľ/ka dostane +10 bodov za odporúčanie!
            </ReferralNoticeText>
          </ReferralNotice>
        )}

        {/* Blokovanie používateľa */}
        {isBlocked && (
          <BlockedWarning ref={blockedWarningRef}>
            <BlockedIcon>🚫</BlockedIcon>
            <BlockedTitle>Váš prístup bol zamietnutý</BlockedTitle>
            <BlockedMessage>
              Váš účet <strong>{participantCode}</strong> bol zablokovaný administrátorom.
            </BlockedMessage>
            <BlockedMessage>
              Nemôžete sa prihlásiť do aplikácie výskumu, kým vám administrátor váš účet neodblokuje.
            </BlockedMessage>
            <ContactInfo>
              <strong>V prípade otázky, z akého dôvodu bol váš účet zablokovaný, kontaktujte prosím administrátora</strong><br/>
              <strong>Email: roman.fiala@tvu.sk</strong>
            </ContactInfo>
            
            <ClearCodeButton
              variant="ghost"
              size="small"
              onClick={handleClearCode}
            >
              ↻ Použiť iný účet
            </ClearCodeButton>
          </BlockedWarning>
        )}

        {/* 1. INFORMOVANÝ SÚHLAS */}
        <FormCard $hasError={!!errors.consent}>
          <div>
            <CheckboxContainer 
              $disabled={isBlocked}
              onClick={() => !isBlocked && setConsentGiven(!consentGiven)}>
              <Checkbox
                type="checkbox"
                checked={consentGiven}
                disabled={isBlocked}
                onChange={(e) => setConsentGiven(e.target.checked)}
              />
              <label>SÚHLASÍM SO SPRACOVANÍM ÚDAJOV A PARTICIPÁCIOU NA VÝSKUME</label>
            </CheckboxContainer>
            
            <div style={{ fontSize: '0.9em', color: '#666', lineHeight: '1.6', marginTop: '15px', paddingLeft: '24px' }}>
              <strong>Prehlasujem, že:</strong><br/>
              <strong>Bol(a) som informovaný(á) o účele, priebehu a podmienkach výskumu prostredníctvom informačného listu.</strong><br/>
              <strong>Rozumiem, že v prípade porušenia podmienok výskumu, môžem byť z výskumu a súťaže o ceny vylúčený, následkom čoho bude zablokovanie môjho prístupu do aplikácie.</strong><br/>
              <strong>Mám vedomosť o svojich právach a povinnostiach počas výskumu.</strong><br/>
              <strong>Rozumiem, že moja účasť je dobrovoľná a môžem kedykoľvek odstúpiť bez penalizácie.</strong><br/>
              <strong>Rozumiem, že moje osobné údaje budú spracované v súlade s GDPR a zákonom č. 18/2018 Z. z..</strong><br/>
              <strong>Rozumiem, že budú zaznamenávané moje interakcie s aplikáciou pre vedeckú analýzu.</strong><br/>
              <strong>Súhlasím s anonymizáciou a publikáciou mojich údajov v súhrnnej forme.</strong><br/>
              <strong>Uvedomujem si a súhlasím so všetkým uvedeným vyššie.</strong>
            </div>
          </div>
          {errors.consent && <ErrorText>{errors.consent}</ErrorText>}
        </FormCard>



        {/* 2. FORMAT PRIHLASOVACIEHO KÓDU */}
        <InfoBox>
          <InfoTitle>Inštrukcie pre prihlásenie:</InfoTitle>
          <InfoText>
            <ul>
               <li><strong>Do výskumu sa ako respondenti budete prihlasovať pomocou identifikačného kódu respondenta (IKR)</strong></li> 
               <li><strong>Kód sa skladá zo štyroch znakov a dvojčíslia, ktoré budú pri vašom zadávaní zapísané automaticky veľkým písmom. Napr. <ExampleCode>ABCD01</ExampleCode></strong></li> 
               <li><strong>Tento kód slúži na to aby bola zachovaná vaša anonymita a aby ste si kód pri ďalšom prihlásení nemuseli pamätať.</strong></li> 
               <li><strong>Prosím zadajte kód podľa následujúcich inštrukcií:</strong></li> 
              <ul>
                <li><strong>Pre 1. znak: Zadajte prvé písmeno vášho mena.</strong></li> 
                <li><strong>Pre 2. znak: Zadajte posledné písmeno vášho mena.</strong></li> 
                <li><strong>Pre 3. znak: Zadajte druhé písmeno vášho priezviska.</strong></li> 
                <li><strong>Pre 4. znak: Zadajte tretie písmeno vášho priezviska.</strong></li> 
                <li><strong>Pre dvojčíslie: Zadajte číselne váš mesiac narodenia vo formáte MM (napr. pre 1. január zadajte 01).</strong></li> 
                <li><strong>Príklad: Jožko Mrkvička narodený v novembri = JORK11</strong></li> 
              </ul>
               <li><strong>V prípade ak ste sa do výskumu ešte neprihlásili a IKR už existuje, zadajte prosím:</strong></li> 
              <ul>
                <li><strong>Namiesto 1. znaku: Zadajte 1. písmeno okresu v ktorom žijete.</strong></li> 
                <li><strong>Príklad: Jožko Mrkvička narodený v novembri z okresu Trenčín= TORK11</strong></li> 
              </ul>
            </ul>
          </InfoText>
        </InfoBox>

        {/* 3. KÓD ÚČASTNÍKA */}
        <FormCard $hasError={!!errors.participant || !!errors.blocked}>
          <InputLabel htmlFor="participant-code">Zadajte váš identifikačný kód respondenta pre prihlásenie:</InputLabel>
          <Input
            id="participant-code"
            type="text"
            placeholder="Napr. ABCD01"
            value={participantCode}
            onChange={(e) => setParticipantCode(e.target.value)}
            onBlur={(e) => checkReferralStatus(e.target.value)}
            disabled={isBlocked}
            maxLength={6}
            $hasError={!!errors.participant || !!errors.blocked}
            autoComplete="off"
          />
          {errors.participant && <ErrorText>{errors.participant}</ErrorText>}
          {errors.blocked && <ErrorText>{errors.blocked}</ErrorText>}
          <Note>Zadajte prosím kód podľa inštrukcií.</Note>
        </FormCard>

        {/* 4. EMAIL PRE SÚŤAŽ */}
        <CompetitionSection>
          <CompetitionTitle>Zapojte sa do súťaže o ceny</CompetitionTitle>
          <CompetitionText>
            <ul>
                <li><strong>Pre zapojenie do súťaže je potrebné zadať e-mailovú adresu a absolovať predvýskum alebo prvú časť hlavného výskumu.</strong></li>
                <li><strong>Súťaž funguje na základe bodovacieho systému:</strong></li>
                <ul>
                  <li><strong>Za absolvovanie predvýskumu získava účastník 50 bodov.</strong></li>
                  <li><strong>Za absolvovanie prvej časti hlavného výskumu získava účastník 50 bodov.</strong></li>
                  <li><strong>Za absolvovanie druhej časti hlavného výskumu (follow up meranie) získava účastník 25 bodov.</strong></li>
                  <li><strong>Za odporúčanie ďalším účastníkom získava účastník 10 bodov za každého nového účastníka.</strong></li>
                </ul>
                <li><strong>Hlavnou cenou je darčekový poukaz v hodnote 30 € pre jedného výhercu.</strong></li>
                <li><strong>Vedľajšími cenami sú darčekové poukazy, každý v hodnote 10€ pre piatich výhercov.</strong></li>
                <li><strong>Viac informácií o súťaži nájdete v sekcii Pravidlá a podmienky súťaže.</strong></li>
            </ul>
          </CompetitionText>
          
          <InputLabel htmlFor="email">Zadajte prosím e-mailovú adresu pre zapojenie do súťaže (nepovinné)</InputLabel>
          <EmailInput
            id="email"
            type="email"
            placeholder="vas.email@príklad.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isBlocked}
            $hasError={!!errors.email}
            autoComplete="email"
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
            <Note>
              <ul>
                <li><strong>Kontaktný e-mail nebude spájaný s odpoveďami v predvýskume ani v hlavnom výskume.</strong></li>
                <li><strong>E-mailová adresa bude použitá výhradne na účely kontaktovania výhercov a budú uchovávané len po dobu trvania súťaže a odovzdania výhry, následne budú bezpečne zlikvidované.</strong></li>
              </ul>
            </Note>
        </CompetitionSection>

        {/* 5. INFORMOVANÝ SÚHLAS SO SÚŤAŽOU - zobrazí sa len ak je zadaný email */}
        {email && (
          <FormCard $hasError={!!errors.competitionConsent}>
            <div>
              <CheckboxContainer 
                $disabled={isBlocked}
                onClick={() => !isBlocked && setCompetitionConsent(!competitionConsent)}>
                <Checkbox
                  type="checkbox"
                  checked={competitionConsent}
                  disabled={isBlocked}
                  onChange={(e) => setCompetitionConsent(e.target.checked)}
                />
                <label>
                  SÚHLASÍM SO SPRACOVANÍM OSOBNÝCH ÚDAJOV A PARTICIPÁCIOU V SÚŤAŽI
                </label>
              </CheckboxContainer>
              
              <div style={{ fontSize: '0.9em', color: '#666', lineHeight: '1.6', marginTop: '15px', paddingLeft: '24px' }}>
                <strong>Prehlasujem, že:</strong><br/>
                <strong>Súhlasím s účasťou v súťaži a potvrdzujem, že som si Pravidlá a podmienky súťaže prečítal/a, porozumel/a im a súhlasím s nimi.</strong><br/>
                <strong>Rozumiem, že v prípade porušenia podmienok súťaže, môžem byť zo súťaže o ceny vylúčený.</strong><br/>
                <strong>Mám vedomosť o svojich právach a povinnostiach počas súťaže.</strong><br/>
                <strong>Rozumiem, že moja účasť je dobrovoľná a môžem kedykoľvek odstúpiť bez penalizácie.</strong><br/>
                <strong>Rozumiem, že moje osobné údaje budú spracované v súlade s GDPR a zákonom č. 18/2018 Z. z..</strong><br/>
                <strong>Uvedomujem si a súhlasím so všetkým uvedeným vyššie.</strong>
              </div>
              
              <div style={{ fontSize: '0.9em', color: '#666', lineHeight: '1.6', marginTop: '12px', paddingLeft: '24px' }}>
                <strong>Pre viac informácií si prečítajte prosím sekciu Pravidlá a podmienky súťaže</strong>
              </div>
            </div>
            {errors.competitionConsent && <ErrorText>{errors.competitionConsent}</ErrorText>}
          </FormCard>
        )}


        {/* 6. REFERRAL KÓD */}
        {!referralAlreadyUsed && (
          <FormCard $hasError={!!errors.referral}>
            <CheckboxContainer
              $disabled={isBlocked}
              onClick={() => !isBlocked && setHasReferral(!hasReferral)}
            >
              <Checkbox
                type="checkbox"
                checked={hasReferral}
                disabled={isBlocked}
                onChange={(e) => setHasReferral(e.target.checked)}
              />
              <label>Mám referral kód:</label>
            </CheckboxContainer>

            {hasReferral && (
              <>
                <InputLabel htmlFor="referral-code" style={{ marginTop: '16px' }}>
                  Referral kód {referralFromUrl && '(automaticky vyplnený)'}
                </InputLabel>
                <Input
                  id="referral-code"
                  type="text"
                  placeholder="Zadajte 6-znakový kód"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  disabled={isBlocked || referralFromUrl}
                  maxLength={6}
                  $hasError={!!errors.referral}
                  autoComplete="off"
                />
                {errors.referral && <ErrorText>{errors.referral}</ErrorText>}
                <Note>
                  {referralFromUrl 
                    ? 'Kód bol vyplnený automaticky z odkazu' 
                    : 'Zadajte 6-znakový kód ktorý vám bol poskytnutý respondentom od ktorého ste prišli do nášho výskumu.'}
                </Note>
              </>
            )}
          </FormCard>
        )}

        {/* 7. PRAVIDLÁ A PODMIENKY SÚŤAŽE - Expandable sekcia */}
        <RulesSection>
          <RulesAccordion>
            <AccordionHeader 
              onClick={() => toggleSection('rules')}
              $isOpen={openSections['rules']}
            >
              Pravidlá a podmienky súťaže
              <AccordionIcon $isOpen={openSections['rules']}>▼</AccordionIcon>
            </AccordionHeader>
            <AccordionContent $isOpen={openSections['rules']}>
              <AccordionInner $isOpen={openSections['rules']}>
                <h3>Organizátor súťaže:</h3>
                <ul>
                  <li>Organizátorom súťaže je hlavný zodpovedný riešiteľ výskumu - Roman Fiala.</li>
                </ul>

                <h3>Účastníci súťaže:</h3>
                <ul>
                  <li>Súťaže sa môžu zúčastniť osoby, ktoré dovŕšili 18 rokov a vyjadrili informovaný súhlas s účasťou vo výskume.</li>
                </ul>

                <h3>Podmienky zaradenia do žrebovania:</h3>
                <ul>
                  <li>Podmienky účasti uvedené v tejto časti sú zároveň podmienkami na získanie minimálneho počtu 50 bodov potrebných na zaradenie do žrebovania.</li>
                  <li>Účastník bude zaradený do žrebovania o ceny, ak:
                    <ul>
                      <li>Absolvuje aspoň jednu z požadovaných častí výskumu: Predvýskum alebo prvú časť hlavného výskumu.</li>
                      <li>Pravdivo a úplne vyplní všetky povinné položky predvýskumu alebo prvej časti hlavného výskumu.</li>
                      <li>Poskytne kontaktný e-mail určený výhradne na účely súťaže, ktorý nie je spájaný s výskumnými dátami.</li>
                    </ul>
                  </li>
                  <li>Účasť v súťaži nie je podmienkou účasti vo výskume, respondent sa môže zúčastniť výskumu aj bez poskytnutia kontaktného e-mailu.</li>
                </ul>

                <h3>Trvanie súťaže:</h3>
                <ul>
                  <li>Súťaž prebieha v období od spustenia predvýskumu -- marec 2026 do ukončenia hlavného výskumu -- apríl 2026.</li>
                  <li>Pozor -- predvýskum bude dostupný iba do spustenia hlavného výskumu, to znamená že po jeho spustení predvýskum už nebude možné absolvovať.</li>
                  <li>Do žrebovania budú zaradení len účastníci, ktorí splnia podmienky účasti v tomto časovom intervale.</li>
                </ul>

                <h3>Bodovanie účasti v súťaži:</h3>
                <ul>
                  <li>Každý získaný bod predstavuje jeden žreb v súťaži. Účastník s vyšším počtom bodov tak má vyššiu pravdepodobnosť výhry. Minimálnou podmienkou zaradenia do žrebovania je získanie minimálne 50 bodov.</li>
                  <li>Za absolvovanie predvýskumu získava účastník 50 bodov.</li>
                  <li>Za absolvovanie prvej časti hlavného výskumu získava účastník 50 bodov.</li>
                  <li>Za absolvovanie druhej časti hlavného výskumu (follow-up meranie) získava účastník 25 bodov.</li>
                  <li>Za odporúčanie ďalším účastníkom 10 bodov za nového účastníka.
                    <ul>
                      <li>Každý účastník, ktorý absolvuje aspoň predvýskum alebo prvú časť hlavného výskumu, získa jedinečný referral kód.</li>
                      <li>Ak nový účastník pri vstupe do štúdie uvedie referral kód osoby, ktorá ho pozvala, a sám splní podmienky účasti, osoba, ktorá referral kód zdieľala, získa za každé takéto platné odporúčanie 10 bodov.</li>
                      <li>Za toho istého nového účastníka možno referral kód započítať len raz a len jednému odporúčateľovi.</li>
                      <li>Referral kód nemá vplyv na samotný priebeh výskumu, slúži iba na pridelenie bodov do súťaže.</li>
                    </ul>
                  </li>
                </ul>

                <h3>Výhry:</h3>
                <ul>
                  <li>Hlavnou cenou je darčekový poukaz v hodnote 30 € pre jedného výhercu.</li>
                  <li>Vedľajšími cenami sú darčekové poukazy, každý v hodnote 10 € pre piatich výhercov.</li>
                  <li>Výhercovia si určia v ktorom obchode si chcú uplatniť darčekový poukaz a na základe toho im bude poukaz poskytnutý.</li>
                  <li>Organizátor si vyhradzuje právo zmeniť typ ceny za inú v rovnakej alebo vyššej hodnote (napr. iný typ poukážky), ak pôvodnú cenu nebude možné zabezpečiť.</li>
                </ul>

                <h3>Žrebovanie výhercov:</h3>
                <ul>
                  <li>Žrebovanie prebehne najneskôr do 10 dní po ukončení hlavného výskumu.</li>
                  <li>Žrebovanie bude realizované náhodným výberom z databázy e-mailových adries účastníkov, ktorí splnili podmienky účasti.</li>
                  <li>Žrebovanie vykoná organizátor za prítomnosti svedkov a bude zaznamenané na videozáznam s časovou stopou.</li>
                </ul>

                <h3>Oznámenie a odovzdanie výhry:</h3>
                <ul>
                  <li>Výhercovia budú kontaktovaní e-mailom najneskôr do 5 dní od žrebovania.</li>
                  <li>Ak výherca do 10 pracovných dní od odoslania e-mailu nereaguje alebo odmietne výhru, cena môže byť pridelená náhradníkovi, ktorý bude vyžrebovaný rovnakým spôsobom.</li>
                  <li>Výhra bude odovzdaná elektronicky formou poukazu.</li>
                </ul>

                <h3>Ochrana osobných údajov:</h3>
                <ul>
                  <li>Kontaktný e-mail nebude spájaný s odpoveďami v predvýskume ani v hlavnom výskume.</li>
                  <li>Údaje budú použité výhradne na účely kontaktovania výhercu a budú uchovávané len po dobu trvania súťaže a odovzdania výhry, následne budú bezpečne zlikvidované.</li>
                  <li>Spracovanie osobných údajov prebieha v súlade s GDPR a zákonom č. 18/2018 Z. z.</li>
                </ul>

                <h3>Vylúčenie zo súťaže:</h3>
                <ul>
                  <li>Organizátor si vyhradzuje právo vylúčiť účastníka zo súťaže, ak:</li>
                  <ul>
                    <li>Porušil tieto pravidlá a podmienky súťaže.</li>
                    <li>Uviedol zjavne nepravdivé údaje alebo iným spôsobom zneužil mechanizmus súťaže (napr. viacnásobná registrácia s rôznymi e-mailmi).</li>
                  </ul>
                </ul>

                <h3>Zodpovednosť organizátora:</h3>
                <ul>
                  <li>Organizátor nezodpovedá za technické problémy (napr. výpadky internetu, poruchy zariadenia účastníka), ktoré znemožnia alebo skomplikujú účasť v súťaži alebo dokončenie výskumu.</li>
                </ul>
              </AccordionInner>
            </AccordionContent>
          </RulesAccordion>
        </RulesSection>

        {/* Tlačidlá */}
        <ButtonContainer>
          <StyledButton
            onClick={handleStart}
            disabled={isLoading || isBlocked || isCheckingCode}
          >
            {isLoading ? 'Načítavam...' : isCheckingCode ? 'Kontrolujem kód...' : 'Prihlásiť sa do aplikácie výskumu →'}
          </StyledButton>
        </ButtonContainer>
      </Container>
    </Layout>
  );
}
