// src/components/main/Instruction.js
// KOMPLETNÁ VERZIA s validáciou ABCDMM a referral kódmi + OCHRANA PROTI ZNEUŽITIU

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../styles/Layout';
import StyledButton from '../../styles/StyledButton';
import { useUserStats } from '../../contexts/UserStatsContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 32px;
  text-align: center;
  margin-bottom: 25px;
  background: linear-gradient(
    45deg,
    ${props => props.theme.ACCENT_COLOR},
    ${props => props.theme.ACCENT_COLOR_2}
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const InstructionText = styled.div`
  font-size: 18px;
  line-height: 1.6;
  max-width: 700px;
  margin-bottom: 30px;
  color: ${props => props.theme.SECONDARY_TEXT_COLOR};
  text-align: center;
`;

const ConsentBox = styled.div`
  background-color: ${p => p.theme.CARD_BACKGROUND};
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
  border: 2px solid ${p => (p.hasError ? 'red' : '#ccc')};
`;

const CodeBox = styled.div`
  background-color: ${p => p.theme.CARD_BACKGROUND};
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
  border: 2px solid ${p => (p.hasError ? 'red' : '#ccc')};
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
  transform: scale(1.12);
`;

const InputLabel = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid ${props => (props.hasError ? 'red' : props.theme.BORDER_COLOR)};
  border-radius: 8px;
  font-size: 17px;
  background-color: ${props => props.theme.INPUT_BACKGROUND};
  color: #fff;
  margin-bottom: 12px;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.ACCENT_COLOR};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const Note = styled.div`
  font-size: 13px;
  color: #888;
  margin-top: 6px;
`;

const InfoBox = styled.div`
  background: ${p => p.theme.HOVER_OVERLAY};
  border-left: 4px solid ${p => p.hasError ? '#ff6b6b' : p.theme.ACCENT_COLOR};
  padding: 16px;
  margin-bottom: 20px;
  max-width: 600px;
  width: 100%;
  border-radius: 8px;
`;

const InfoTitle = styled.div`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 16px;
`;

const InfoText = styled.div`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 14px;
  line-height: 1.6;
`;

const ExampleCode = styled.code`
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: ${p => p.theme.ACCENT_COLOR};
  font-weight: 600;
`;

export default function Instruction() {
  const navigate = useNavigate();
  const { login, dataManager } = useUserStats();

  const [participantCode, setParticipantCode] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [hasReferral, setHasReferral] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [errors, setErrors] = useState({});
  const [referralAlreadyUsed, setReferralAlreadyUsed] = useState(false); // ✅ NOVÉ
  const [isLoading, setIsLoading] = useState(false); // ✅ NOVÉ
  const [isCheckingCode, setIsCheckingCode] = useState(false); // ✅ NOVÉ

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

  // ✅ NOVÁ FUNKCIA - Kontrola, či používateľ už zadal referral kód
  const checkReferralStatus = async (userCode) => {
    if (!userCode || userCode.length !== 6) return false;
    
    try {
      setIsCheckingCode(true);
      const userData = await dataManager.loadUserProgress(userCode);
      
      // Ak used_referral_code existuje a nie je prázdne, používateľ už kód zadal
      if (userData?.used_referral_code) {
        console.log(`⚠️ Používateľ ${userCode} už použil referral kód: ${userData.used_referral_code}`);
        setReferralAlreadyUsed(true);
        setHasReferral(false); // ✅ Automaticky zruš checkbox
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

  // ✅ UPRAVENÁ VALIDÁCIA
  const validate = async () => {
    const e = {};
    
    if (!consentGiven) {
      e.consent = 'Musíte súhlasiť s účasťou.';
    }
    
    const codeValidation = validateParticipantCode(participantCode);
    if (!codeValidation.valid) {
      e.participant = 'Neplatný formát kódu. Použite formát: 4 písmená + mesiac (napr. RMIL11), TEST01-TEST60, alebo RF9846';
    }
    
    // ✅ NOVÉ - Kontrola referral kódu
    if (hasReferral) {
      // Kontrola, či používateľ už nepoužil kód
      if (referralAlreadyUsed) {
        e.referral = 'Už ste použili referral kód. Nemôžete ho zadať znova.';
      }
      // Kontrola formátu
      else if (!referralCode || !/^[A-Z0-9]{6}$/.test(referralCode.trim())) {
        e.referral = 'Referral kód musí mať presne 6 znakov (písmená a čísla).';
      }
      // Kontrola existencie v systéme
      else {
        const valid = await dataManager.validateReferralCode(referralCode.trim().toUpperCase());
        if (!valid) {
          e.referral = 'Tento referral kód neexistuje v systéme.';
        } else {
          // ✅ NOVÉ - Kontrola, či používateľ nepoužíva vlastný kód
          const userSharingCode = await dataManager.getUserSharingCode(participantCode.toUpperCase());
          if (userSharingCode && userSharingCode === referralCode.trim().toUpperCase()) {
            e.referral = '❌ Nemôžete použiť svoj vlastný zdieľací kód!';
          }
        }
      }
    }
    
    return e;
  };

  // ✅ UPRAVENÁ FUNKCIA handleStart
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
    
    sessionStorage.setItem('participantCode', upperCode);
    
    // ✅ UPRAVENÉ - Process referral iba ak používateľ ešte nepoužil kód
    if (hasReferral && !referralAlreadyUsed && referralCode.trim()) {
      try {
        await dataManager.processReferral(upperCode, referralCode.trim().toUpperCase());
      } catch (error) {
        console.error('Referral processing error:', error);
        setErrors({ referral: 'Chyba pri spracovaní referral kódu. Skúste znova.' });
        setIsLoading(false);
        return;
      }
    }
    
    await login(upperCode);
    setIsLoading(false);
    
    if (codeValidation.type === 'admin') {
      navigate('/admin');
    } else {
      navigate('/intro');
    }
  };

  return (
    <Layout>
      <Container>
        <Title>🔑 Conspiracy Pass – Prihlásenie</Title>
        <InstructionText>
          Zadajte svoj kód účastníka podľa inštrukcií nižšie, prípadne referral kód, a súhlaste s účasťou.
        </InstructionText>

        <InfoBox>
          <InfoTitle>ℹ️ Formát prihlasovacieho kódu</InfoTitle>
          <InfoText>
            Váš kód sa skladá z:<br/>
            • <strong>1. písmeno</strong> mena<br/>
            • <strong>3. písmeno</strong> mena<br/>
            • <strong>2. písmeno</strong> priezviska<br/>
            • <strong>4. písmeno</strong> priezviska<br/>
            • <strong>Mesiac narodenia</strong> (2 číslice: 01-12)<br/>
            <br/>
            <strong>Príklad:</strong> Pre <strong>Roman Milanko</strong> narodený v <strong>novembri</strong>:<br/>
            → <ExampleCode>RMIL11</ExampleCode>
            <br/><br/>
            <strong>Testovacie účty:</strong> TEST01, TEST02, ... TEST60<br/>
            <strong>Admin:</strong> RF9846
          </InfoText>
        </InfoBox>

        <ConsentBox hasError={!!errors.consent} id="consent-box">
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={consentGiven}
              onChange={e => {
                setConsentGiven(e.target.checked);
                setErrors(prev => ({ ...prev, consent: null }));
              }}
            />
            <label>Súhlasím s účasťou</label>
          </CheckboxContainer>
          {errors.consent && <ErrorText>{errors.consent}</ErrorText>}
        </ConsentBox>

        <CodeBox hasError={!!errors.participant}>
          <InputLabel htmlFor="participantCode">Kód účastníka*</InputLabel>
          <Input
            id="participantCode"
            type="text"
            value={participantCode}
            onChange={async (e) => {
              const newCode = e.target.value.toUpperCase();
              setParticipantCode(newCode);
              setErrors(prev => ({ ...prev, participant: null, referral: null }));
              
              // ✅ NOVÉ - Automatická kontrola pri zmene kódu
              if (newCode.length === 6) {
                await checkReferralStatus(newCode);
              } else {
                setReferralAlreadyUsed(false);
              }
            }}
            placeholder="RMIL11"
            hasError={!!errors.participant}
            maxLength={6}
            disabled={isLoading}
          />
          {errors.participant && <ErrorText>{errors.participant}</ErrorText>}
          {isCheckingCode && <Note>Kontrolujem referral status...</Note>}
          {!isCheckingCode && <Note>Zadajte kód podľa inštrukcií vyššie (všetky písmená VEĽKÉ)</Note>}
        </CodeBox>

        {/* ✅ UPRAVENÝ CHECKBOX - Zakázaný, ak používateľ už použil kód */}
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            checked={hasReferral}
            onChange={e => {
              if (!referralAlreadyUsed) {
                setHasReferral(e.target.checked);
                setErrors(prev => ({ ...prev, referral: null }));
              }
            }}
            disabled={referralAlreadyUsed || isLoading}
          />
          <label style={{ 
            color: referralAlreadyUsed ? '#888' : 'inherit',
            textDecoration: referralAlreadyUsed ? 'line-through' : 'none'
          }}>
            Mám referral kód od priateľa
          </label>
        </CheckboxContainer>

        {/* ✅ NOVÉ - Upozornenie ak už bol kód použitý */}
        {referralAlreadyUsed && (
          <InfoBox hasError>
            <InfoTitle>⚠️ Referral kód už bol použitý</InfoTitle>
            <InfoText>
              Už ste zadali referral kód pri predošlom prihlásení. 
              Každý používateľ môže použiť referral kód <strong>iba raz</strong>.
            </InfoText>
          </InfoBox>
        )}

        {hasReferral && !referralAlreadyUsed && (
          <CodeBox hasError={!!errors.referral}>
            <InputLabel htmlFor="referralCode">Referral kód</InputLabel>
            <Input
              id="referralCode"
              type="text"
              value={referralCode}
              onChange={e => {
                setReferralCode(e.target.value.toUpperCase());
                setErrors(prev => ({ ...prev, referral: null }));
              }}
              placeholder="ABC123"
              hasError={!!errors.referral}
              maxLength={6}
              disabled={isLoading}
            />
            {errors.referral && <ErrorText>{errors.referral}</ErrorText>}
            <Note>Váš priateľ dostane +10 bodov za odporúčanie! 🎁</Note>
          </CodeBox>
        )}

        <ButtonContainer>
          <StyledButton accent onClick={handleStart} disabled={isLoading || isCheckingCode}>
            {isLoading ? '⏳ Načítavam...' : 'Prihlásiť sa'}
          </StyledButton>
        </ButtonContainer>
      </Container>
    </Layout>
  );
}
