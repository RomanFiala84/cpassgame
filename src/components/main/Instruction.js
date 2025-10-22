// src/components/Instruction.js

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
  max-width: 600px;
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
  max-width: 430px;
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

  &:focus {
    outline: none;
    border-color: ${props => props.theme.ACCENT_COLOR};
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

export default function Instruction() {
  const navigate = useNavigate();
  const { login, dataManager } = useUserStats();

  const [participantCode, setParticipantCode] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [hasReferral, setHasReferral] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = async () => {
    const e = {};
    if (!consentGiven) e.consent = 'Musíte súhlasiť s účasťou.';
    if (!/^[A-Z0-9]{4,10}$/.test(participantCode))
      e.participant = 'Kód musí byť 4–10 veľkých písmen alebo číslic.';
    if (hasReferral) {
      if (!/^[A-Z0-9]{4}$/.test(referralCode)) {
        e.referral = 'Referral kód musí mať presne 4 znaky.';
      } else {
        const valid = await dataManager.validateReferralCode(referralCode);
        if (!valid) e.referral = 'Referral kód neexistuje.';
      }
    }
    return e;
  };

  const handleStart = async () => {
    const e = await validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    if (hasReferral) {
      await dataManager.processReferral(participantCode, referralCode);
    }
    await login(participantCode);
    navigate('/intro');
  };

  const generateNewCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += i < 2 || i >= 4
        ? chars[Math.floor(Math.random() * chars.length)]
        : nums[Math.floor(Math.random() * nums.length)];
    }
    setParticipantCode(code);
  };

  return (
    <Layout>
      <Container>
        <Title>🔑 Conspiracy Pass – Prihlásenie</Title>
        <InstructionText>
          Zadajte svoj kód účastníka, prípadne referral kód, a súhlaste s účasťou.
        </InstructionText>

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
          <div style={{ display: 'flex', gap: '10px' }}>
            <Input
              id="participantCode"
              type="text"
              value={participantCode}
              onChange={e => {
                setParticipantCode(e.target.value.toUpperCase());
                setErrors(prev => ({ ...prev, participant: null }));
              }}
              placeholder="AB12XY"
              hasError={!!errors.participant}
              maxLength={10}
              style={{ flex: 1 }}
            />
            <StyledButton onClick={generateNewCode}>🎲 Generovať</StyledButton>
          </div>
          {errors.participant && <ErrorText>{errors.participant}</ErrorText>}
          <Note>Ak nemáte kód, kliknite na "Generovať"</Note>
        </CodeBox>

        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            checked={hasReferral}
            onChange={e => setHasReferral(e.target.checked)}
          />
          <label>Mám referral kód</label>
        </CheckboxContainer>

        {hasReferral && (
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
              placeholder="XY12"
              hasError={!!errors.referral}
              maxLength={4}
            />
            {errors.referral && <ErrorText>{errors.referral}</ErrorText>}
            <Note>Získajte bonusové body s referral kódom</Note>
          </CodeBox>
        )}

        <ButtonContainer>
          <StyledButton accent onClick={handleStart}>
            Prihlásiť sa
          </StyledButton>
        </ButtonContainer>
      </Container>
    </Layout>
  );
}
