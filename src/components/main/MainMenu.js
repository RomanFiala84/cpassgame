// src/components/main/MainMenu.js
// VERZIA s DetectiveTipLarge namiesto export tlačidla

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../styles/Layout';
import StyledButton from '../../styles/StyledButton';
import { useUserStats } from '../../contexts/UserStatsContext';
import DetectiveTipLarge from '../shared/DetectiveTipLarge';

// =====================
// STYLED COMPONENTS - OPTIMALIZOVANÁ VERZIA
// =====================

const Container = styled.div`
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Title = styled.h1`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 6px;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const InstructionCard = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border-left: 3px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 3px 8px rgba(0,0,0,0.12);
    border-left-width: 4px;
  }
  
  h4 {
    color: ${p => p.theme.ACCENT_COLOR};
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 14px;
  }
`;

const InstructionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    color: ${p => p.theme.PRIMARY_TEXT_COLOR};
    padding: 6px 0 6px 22px;
    position: relative;
    line-height: 1.5;
    font-size: 14px;
    
    &:before {
      content: "▸";
      position: absolute;
      left: 6px;
      color: ${p => p.theme.ACCENT_COLOR};
      font-weight: bold;
    }
  }
  
  @media (max-width: 480px) {
    li {
      font-size: 13px;
      padding: 5px 0 5px 20px;
    }
  }
`;

const SubNote = styled.div`
  background: ${p => p.theme.ACCENT_COLOR}11;
  border-radius: 6px;
  padding: 8px 10px;
  margin-top: 6px;
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  line-height: 1.4;
  border-left: 2px solid ${p => p.theme.ACCENT_COLOR}44;
  
  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const InstructionsWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
`;

const StatsCard = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.theme.ACCENT_COLOR}44;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-around;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  /* Decentný gradient */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      ${p => p.theme.ACCENT_COLOR}08 0%,
      transparent 60%
    );
    pointer-events: none;
  }
  
  &:hover {
    border-color: ${p => p.theme.ACCENT_COLOR}66;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    padding: 14px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${p => p.theme.ACCENT_COLOR}08;
  }
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
  margin-bottom: 4px;
  text-shadow: 0 1px 3px ${p => p.theme.ACCENT_COLOR}22;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  margin-bottom: 16px;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

// ✅ UPRAVENÉ - Grid layout pre misie
const MissionsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MissionCard = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.locked ? p.theme.BORDER_COLOR : p.theme.ACCENT_COLOR}44;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  position: relative;
  cursor: ${p => p.locked ? 'not-allowed' : 'pointer'};
  opacity: ${p => p.locked ? 0.6 : 1};
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  overflow: hidden;
  min-height: 180px;
  
  /* Gradient overlay pre dokončené misie */
  ${p => p.completed && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        ${p.theme.ACCENT_COLOR}08 0%,
        transparent 70%
      );
      pointer-events: none;
    }
  `}

  &:hover {
    transform: ${p => p.locked ? 'none' : 'translateY(-2px)'};
    border-color: ${p => p.locked ? p.theme.BORDER_COLOR : p.theme.ACCENT_COLOR};
    box-shadow: ${p => p.locked ? '0 2px 6px rgba(0,0,0,0.08)' : `0 4px 12px ${p.theme.ACCENT_COLOR}33`};
  }
  
  @media (max-width: 480px) {
    padding: 14px;
    min-height: 160px;
  }
`;

const MissionIcon = styled.div`
  width: 64px;
  height: 64px;
  min-width: 64px;
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}, 
    ${p => p.theme.ACCENT_COLOR_2}
  );
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 2px 8px ${p => p.theme.ACCENT_COLOR}44;
  
  @media (max-width: 480px) {
    width: 56px;
    height: 56px;
    min-width: 56px;
    font-size: 28px;
  }
`;

const MissionContent = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MissionNumber = styled.div`
  font-size: 11px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 3px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MissionTitle = styled.h3`
  font-size: 15px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  margin-bottom: 4px;
  font-weight: 600;
  line-height: 1.3;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const MissionStatus = styled.div`
  font-size: 11px;
  color: ${p => p.completed ? '#10b981' : p.theme.SECONDARY_TEXT_COLOR};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const AdminButtons = styled.div`
  display: flex;
  gap: 6px;
  position: relative;
  z-index: 1;
  width: 100%;
  justify-content: center;
  margin-top: 8px;
`;


const AdminButton = styled.button`
  background: ${p => p.$unlock ? '#10b981' : p.theme.ACCENT_COLOR};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  
  &:hover:not(:disabled) {
    opacity: 0.85;
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

// ✅ NOVÉ - Špeciálne styled buttony pre tieto akcie
const InfoButton = styled(StyledButton)`
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}22, 
    ${p => p.theme.ACCENT_COLOR_2}22
  );
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  color: ${p => p.theme.ACCENT_COLOR};
  
  &:hover {
    background: linear-gradient(135deg, 
      ${p => p.theme.ACCENT_COLOR}, 
      ${p => p.theme.ACCENT_COLOR_2}
    );
    color: white;
    transform: translateY(-2px);
  }
`;

const ContestButton = styled(StyledButton)`
  background: linear-gradient(135deg, 
    #fbbf2422, 
    #f59e0b22
  );
  border: 2px solid #f59e0b;
  color: #f59e0b;
  
  &:hover {
    background: linear-gradient(135deg, 
      #fbbf24, 
      #f59e0b
    );
    color: white;
    transform: translateY(-2px);
  }
`;

const LogoutButton = styled(StyledButton)`
  background: linear-gradient(135deg, 
    #ef444422, 
    #dc262622
  );
  border: 2px solid #ef4444;
  color: #ef4444;
  
  &:hover {
    background: linear-gradient(135deg, 
      #ef4444, 
      #dc2626
    );
    color: white;
    transform: translateY(-2px);
  }
`;


const SharingSection = styled.div`
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}22, 
    ${p => p.theme.ACCENT_COLOR_2}22
  );
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  margin-top: 16px;
  position: relative;
  overflow: hidden;
  
  /* Dekoratívny gradient */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      ${p => p.theme.ACCENT_COLOR}15 0%,
      transparent 50%
    );
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const SharingTitle = styled.h3`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 700;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '🎁';
    margin-right: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const SharingCodeDisplay = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px dashed ${p => p.theme.ACCENT_COLOR};
  border-radius: 12px;
  padding: 16px;
  margin: 12px 0;
  position: relative;
  z-index: 1;
  transition: all 0.2s ease;
  
  &:hover {
    border-style: solid;
    box-shadow: 0 2px 8px ${p => p.theme.ACCENT_COLOR}33;
  }
`;

const SharingCodeLabel = styled.div`
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const SharingCode = styled.code`
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 4px;
  color: ${p => p.theme.ACCENT_COLOR};
  font-family: 'Courier New', monospace;
  text-shadow: 0 2px 4px ${p => p.theme.ACCENT_COLOR}22;
  
  @media (max-width: 768px) {
    font-size: 28px;
    letter-spacing: 3px;
  }
  
  @media (max-width: 480px) {
    font-size: 24px;
    letter-spacing: 2px;
  }
`;

const LinkDisplay = styled.div`
  background: ${p => p.theme.INPUT_BACKGROUND};
  border: 2px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 12px;
  padding: 12px;
  margin: 12px 0;
  word-break: break-all;
  text-align: left;
  position: relative;
  z-index: 1;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${p => p.theme.ACCENT_COLOR}66;
  }
`;

const LinkLabel = styled.div`
  font-size: 11px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const LinkText = styled.code`
  font-size: 13px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-family: 'Courier New', monospace;
  line-height: 1.5;
  
  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const ShareButtonsGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SharingInfo = styled.p`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 13px;
  margin: 12px 0;
  line-height: 1.5;
  position: relative;
  z-index: 1;
  
  strong {
    color: ${p => p.theme.ACCENT_COLOR};
    font-weight: 600;
  }
`;

const ReferralStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const ReferralStat = styled.div`
  text-align: center;
  padding: 8px 16px;
  background: ${p => p.theme.CARD_BACKGROUND}88;
  border-radius: 10px;
  backdrop-filter: blur(4px);
`;

const ReferralStatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${p => p.theme.ACCENT_COLOR};
  text-shadow: 0 1px 3px ${p => p.theme.ACCENT_COLOR}33;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ReferralStatLabel = styled.div`
  font-size: 10px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  position: relative;
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 16px;
  padding: 24px;
  max-width: 600px;
  width: 100%;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  max-height: 85vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  h3 {
    color: ${p => p.theme.ACCENT_COLOR};
    margin-bottom: 16px;
    font-size: 20px;
    text-align: center;
  }
  
  h4 {
    color: ${p => p.theme.ACCENT_COLOR};
    font-size: 14px;
    font-weight: 700;
    margin-top: 16px;
    margin-bottom: 8px;
    border-bottom: 2px solid ${p => p.theme.ACCENT_COLOR}33;
    padding-bottom: 4px;
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 10px;
    font-size: 14px;
  }
  
  ul {
    margin: 6px 0 12px 0;
    padding-left: 18px;
    
    li {
      line-height: 1.6;
      margin-bottom: 6px;
      font-size: 14px;
    }
    
    ul {
      margin: 6px 0 6px 0;
      padding-left: 18px;
      
      li {
        font-size: 13px;
        list-style-type: circle;
      }
    }
  }
  
  a {
    color: ${p => p.theme.ACCENT_COLOR};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${p => p.theme.BORDER_COLOR}33;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${p => p.theme.ACCENT_COLOR};
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    max-height: 90vh;
    
    h3 {
      font-size: 18px;
    }
    
    h4 {
      font-size: 13px;
    }
    
    p, li {
      font-size: 13px;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${p => p.theme.BORDER_COLOR}44;
  border: none;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 20px;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${p => p.theme.ACCENT_COLOR};
    color: #ffffff;
    transform: rotate(90deg);
  }
`;


const makeMissionList = (p) => [
  { id: 0, title: 'Misia 0 (Predvýskum)', route: '/mission0/intro', completed: !!p.mission0_completed, locked: !p.mission0_unlocked, icon: '🎯' },
  { id: 1, title: 'Misia 1 (Úvodný dotazník)', route: '/mission1/intro', completed: !!p.mission1_completed, locked: !p.mission1_unlocked, icon: '🔍' },
  { id: 2, title: 'Misia 2 (Prvá časť hlavného výskumu)', route: '/mission2/intro', completed: !!p.mission2_completed, locked: !p.mission2_unlocked, icon: '🕵️' },
  { id: 3, title: 'Misia 3 (Druhá časť hlavného výskumu)', route: '/mission3/intro', completed: !!p.mission3_completed, locked: !p.mission3_unlocked, icon: '🎭' }
];

const MainMenu = () => {
  const navigate = useNavigate();
  const { userStats, dataManager, userId, logout } = useUserStats();
  const [missions, setMissions] = useState([]);
  const [modal, setModal] = useState({ open: false, type: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [userProgress, setUserProgress] = useState(null);
  const isAdmin = dataManager.isAdmin(userId);

  useEffect(() => {
    if (!userId) {
      navigate('/instruction');
      return;
    }

    const loadData = async () => {
      try {
        await dataManager.syncAllFromServer();
        const central = dataManager.getAllParticipantsData();
        const p = central[userId] || {};
        setMissions(makeMissionList(p));
        setUserProgress(p);
      } catch (error) {
        console.warn('Sync failed, using local data:', error);
        const central = dataManager.getAllParticipantsData();
        const p = central[userId] || {};
        setMissions(makeMissionList(p));
        setUserProgress(p);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000);

    const handleStorage = (e) => {
      if (e.key === dataManager.centralStorageKey) {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
  }, [dataManager, userId, navigate]);

  const handleMissionClick = (m) => {
    if (!m.locked) navigate(m.route);
  };

  const generateReferralLink = () => {
    const baseUrl = window.location.origin;
    const referralCode = userProgress?.sharing_code;
    return `${baseUrl}/?ref=${referralCode}`;
  };

  const handleCopyCode = () => {
    if (userProgress?.sharing_code) {
      navigator.clipboard.writeText(userProgress.sharing_code);
      setCopySuccess('code');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleCopyLink = () => {
    const link = generateReferralLink();
    navigator.clipboard.writeText(link);
    setCopySuccess('link');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const handleUnlock = async (id) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await dataManager.unlockMissionForAll(id);
      await dataManager.syncAllFromServer();
      const central = dataManager.getAllParticipantsData();
      const p = central[userId] || {};
      setMissions(makeMissionList(p));
      setUserProgress(p);
      alert(`✅ Misia ${id} bola odomknutá`);
    } catch (error) {
      alert(`❌ Chyba: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLock = async (id) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await dataManager.lockMissionForAll(id);
      await dataManager.syncAllFromServer();
      const central = dataManager.getAllParticipantsData();
      const p = central[userId] || {};
      setMissions(makeMissionList(p));
      setUserProgress(p);
      alert(`✅ Misia ${id} bola zamknutá`);
    } catch (error) {
      alert(`❌ Chyba: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const openModal = (type) => setModal({ open: true, type });
  const closeModal = () => setModal({ open: false, type: '' });
  const handleLogout = () => {
    logout();
    navigate('/instruction');
  };

  // ✅ NOVÝ - Príbeh a inštrukcie pre DetectiveTip
  const detectiveStory = `
    <p>Potrebujete pomôcť?</p>
  
    <ul>
      <li><strong>Ktorou časťou mám začať?</strong></li>
        <ul>
          <li>Ak sa účastníte predvýskumu začnite prosím Misiou 0.</li>
            <ul>
              <li>Po ukončení predvýskumu bude táto misia uzamknutá a účasť v nej už nebude možná.</li>
            </ul>
          <li>Ak sa účastníte prvej časti hlavného výskumu začnite prosím Misiou 1 a pokračujete Misiou 2.</li>
            <ul>
              <li>Po ukončení predvýskumu budú tieto misie neustále odomknuté.</li>
              <li>Pre spustenie týchto misií nie je potrebné mať absolvovanú Misiu 0.</li>
            </ul>
          <li>Ak sa účastníte druhej časti hlavného výskumu pokračujte prosím Misiou 3.</li>
            <ul>
              <li>Po ukončení prvej časti hlavného výskumu bude táto misia neustále odomknutá.</li>
              <li>Pred spustením Misie 3 si prosím skontrulujte v hlavnom menu, či máte dokočenú Misiu 1 a Misiu 2.</li>
            </ul>
        </ul>
    </ul>
    
    <ul> 
      <li><strong>Čo nájdem v hlavnom menu?</strong></li>
        <ul>
            <li>Bočný panel s aktuálnou detektívnou úrovňou a bodmi.</li>
            <li>Panel s aktuálnym progresom misií a celkový počet nazbiernaných bodov.</li>
            <li>Zonzam všetkých misií.</li>
            <li>Odkaz na pomoc.</li>
            <li>Odkaz na pravidlá a podmienky súťaže.</li>
            <li>Možnosť odhlásenia z aplikácie.</li>
            <li>Zonzam všetkých misií.</li>
            <li>Váš osobný refferal kód, ktorý môžete zdieľať s priateľmi.</li>
        </ul>
    </ul>

  `;

  return (
    <Layout>
      <Container>
        <Header>
          <Title>CP-PASS</Title>
          <InstructionsWrapper>
            <InstructionCard>
              <h4>Ktorou časťou mám začať?</h4>
              
              <InstructionList>
                <li><strong>Ak sa účastníte predvýskumu - začnite prosím Misiou 0.</strong></li>
              </InstructionList>
              <SubNote>
                Po ukončení predvýskumu bude táto misia uzamknutá a účasť v nej už nebude možná.
              </SubNote>
              
              <InstructionList style={{ marginTop: '12px' }}>
                <li><strong>Ak sa účastníte prvej časti hlavného výskumu - začnite prosím Misiou 1 a pokračujete Misiou 2.</strong></li>
              </InstructionList>
              <SubNote>
                Po ukončení predvýskumu budú tieto misie neustále odomknuté.<br/>
                Pre spustenie týchto misií nie je potrebné mať absolvovanú Misiu 0.
              </SubNote>
              
              <InstructionList style={{ marginTop: '12px' }}>
                <li><strong>Ak sa účastníte druhej časti hlavného výskumu - pokračujte prosím Misiou 3.</strong></li>
              </InstructionList>
              <SubNote>
                Po ukončení prvej časti hlavného výskumu bude táto misia neustále odomknutá.<br/>
                Pred spustením Misie 3 si prosím skontrulujte v hlavnom menu, či máte dokočenú Misiu 1 a Misiu 2.
              </SubNote>
            </InstructionCard>
          </InstructionsWrapper>
          <StatsCard>
            <StatItem>
              <StatValue>{userStats.totalPoints || 0}</StatValue>
              <StatLabel>Celkové získané body:</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{missions.filter(m => m.completed).length}/4</StatValue>
              <StatLabel>Počet dokončených misií:</StatLabel>
            </StatItem>
          </StatsCard>
        </Header>

        <SectionTitle>Misie (časti výskumu):</SectionTitle>
        <MissionsList>
          {missions.map(m => (
            <MissionCard
              key={m.id}
              locked={m.locked}
              completed={m.completed}
              onClick={() => handleMissionClick(m)}
            >
              <MissionIcon>{m.icon}</MissionIcon>
              <MissionContent>
                <MissionNumber>Misia {m.id}</MissionNumber>
                <MissionTitle>{m.title}</MissionTitle>
                <MissionStatus completed={m.completed}>
                  {m.locked ? '🔒 Misia je uzamknutá' : m.completed ? '✅ Misia je dokončená' : '▶️ Spustiť misiu'}
                </MissionStatus>
              </MissionContent>
              {isAdmin && (
                <AdminButtons>
                  <AdminButton
                    $unlock
                    disabled={isUpdating}
                    onClick={e => {
                      e.stopPropagation();
                      handleUnlock(m.id);
                    }}
                  >
                    🔓 Odomknúť
                  </AdminButton>
                  <AdminButton
                    disabled={isUpdating}
                    onClick={e => {
                      e.stopPropagation();
                      handleLock(m.id);
                    }}
                  >
                    🔒 Zamknúť
                  </AdminButton>
                </AdminButtons>
              )}
            </MissionCard>
          ))}
        </MissionsList>

        <ButtonGroup>
          <InfoButton size="medium" onClick={() => openModal('help')}>
            ❓ Pomoc
          </InfoButton>
          
          <ContestButton size="medium" onClick={() => openModal('contest')}>
            🎁 Súťaž
          </ContestButton>
          
          {isAdmin && (
            <StyledButton variant="accent" size="medium" onClick={() => navigate('/admin')}>
              ⚙️ Admin panel
            </StyledButton>
          )}
          
          <LogoutButton size="medium" onClick={handleLogout}>
            🚪 Odhlásiť sa
          </LogoutButton>
        </ButtonGroup>


        <SharingSection>
          <SharingTitle>Zdieľajte výskum a získajte body!</SharingTitle>
          
          <SharingCodeDisplay>
            <SharingCodeLabel>Váš refferal kód:</SharingCodeLabel>
            <SharingCode>
              {userProgress?.sharing_code || '━━━━━━'}
            </SharingCode>
          </SharingCodeDisplay>
          
          <LinkDisplay>
            <LinkLabel>🔗 Link s automatickým zadaním kódu:</LinkLabel>
            <LinkText>{generateReferralLink()}</LinkText>
          </LinkDisplay>
          
          <ShareButtonsGroup>
            <StyledButton 
              variant="accent"
              onClick={handleCopyCode}
            >
              {copySuccess === 'code' ? '✅ Kód bol skopírovaný!' : '📋 Kopírovať iba kód'}
            </StyledButton>
            <StyledButton 
              variant="success"
              onClick={handleCopyLink}
            >
              {copySuccess === 'link' ? '✅ Link bol skopírovaný!' : '🔗 Kopírovať link s kódom'}
            </StyledButton>
          </ShareButtonsGroup>
          
          <SharingInfo>
            Zdieľajte kód alebo link s priateľmi!<br/>
            Za každého nového respondenta získate <strong>+10 bodov</strong>
          </SharingInfo>
          
          {userProgress?.referrals_count > 0 && (
            <ReferralStats>
              <ReferralStat>
                <ReferralStatValue>{userProgress.referrals_count}</ReferralStatValue>
                <ReferralStatLabel>Počet odporúčaní</ReferralStatLabel>
              </ReferralStat>
              <ReferralStat>
                <ReferralStatValue>+{userProgress.referrals_count * 10}</ReferralStatValue>
                <ReferralStatLabel>Počet bonusových bodov</ReferralStatLabel>
              </ReferralStat>
            </ReferralStats>
          )}
        </SharingSection>

        {/* ✅ NOVÉ - DetectiveTipLarge namiesto Export tlačidla */}
        <DetectiveTipLarge
          tip={detectiveStory}
          detectiveName="Inšpektor Kritan"
          imageUrl="/images/detective.png"
          iconUrl="/images/detective-icon.png"
          buttonText="Rozumiem!"
          autoOpen={false}
          showBadge={true}
          position="right"
        />

        {modal.open && (
          <ModalOverlay onClick={closeModal}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <CloseButton onClick={closeModal}>×</CloseButton>
              {modal.type === 'help' && (
                <>
                  <h3>Čo ak sa počas výskumu cítim znepokojený/á?</h3>
                  
                  <ul>
                    <li>Je úplne v poriadku mať z niektorých tém alebo tvrdení nepríjemný pocit - dotýkajú sa citlivých spoločenských tém.</li>
                    <li>Odporúčame o svojich pocitoch alebo otázkach hovoriť s niekým, komu dôverujete (priateľ, rodina, odborník).</li>
                    <li>Ak máte pocit, že na vás podobné informácie dlhodobo pôsobia stresujúco alebo úzkostne, môže byť užitočné poradiť sa so psychológom alebo iným odborníkom.</li>
                    <h4>Dostupné zdroje pomoci:
                      <ul>
                        <li>Kontakt na výskumníka - <a href="mailto:roman.fiala@tvu.sk">roman.fiala@tvu.sk</a></li>
                        <li>IPčko - <a href="https://ipcko.sk" target="_blank" rel="noopener noreferrer">https://ipcko.sk</a></li>
                        <li>Linka dôvery - <a href="https://www.linkanezabudka.sk" target="_blank" rel="noopener noreferrer">https://www.linkanezabudka.sk</a></li>
                      </ul>
                    </h4>
                  </ul>
                </>
              )}
              {modal.type === 'contest' && (
                <>
                  <h3>🎁 Pravidlá a podmienky súťaže:</h3>
                  
                  <h4>Organizátor súťaže:</h4>
                  <ul>
                    <li>Organizátorom súťaže je hlavný zodpovedný riešiteľ výskumu - Roman Fiala.</li>
                  </ul>

                  <h4>Účastníci súťaže:</h4>
                  <ul>
                    <li>Súťaže sa môžu zúčastniť osoby, ktoré dovŕšili 18 rokov a vyjadrili informovaný súhlas s účasťou vo výskume.</li>
                  </ul>

                  <h4>Podmienky zaradenia do žrebovania:</h4>
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

                  <h4>Trvanie súťaže:</h4>
                  <ul>
                    <li>Súťaž prebieha v období od spustenia predvýskumu - marec 2026 do ukončenia hlavného výskumu - apríl 2026.</li>
                    <li>Pozor - predvýskum bude dostupný iba do spustenia hlavného výskumu, to znamená že po jeho spustení predvýskum už nebude možné absolvovať.</li>
                    <li>Do žrebovania budú zaradení len účastníci, ktorí splnia podmienky účasti v tomto časovom intervale.</li>
                  </ul>

                  <h4>Bodovanie účasti v súťaži:</h4>
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

                  <h4>Výhry:</h4>
                  <ul>
                    <li>Hlavnou cenou je darčekový poukaz v hodnote 30 € pre jedného výhercu.</li>
                    <li>Vedľajšími cenami sú darčekové poukazy, každý v hodnote 10 € pre piatich výhercov.</li>
                    <li>Výhercovia si určia v ktorom obchode si chcú uplatniť darčekový poukaz a na základe toho im bude poukaz poskytnutý.</li>
                    <li>Organizátor si vyhradzuje právo zmeniť typ ceny za inú v rovnakej alebo vyššej hodnote (napr. iný typ poukážky), ak pôvodnú cenu nebude možné zabezpečiť.</li>
                  </ul>

                  <h4>Žrebovanie výhercov:</h4>
                  <ul>
                    <li>Žrebovanie prebehne najneskôr do 10 dní po ukončení hlavného výskumu.</li>
                    <li>Žrebovanie bude realizované náhodným výberom z databázy e-mailových adries účastníkov, ktorí splnili podmienky účasti.</li>
                    <li>Žrebovanie vykoná organizátor za prítomnosti svedkov a bude zaznamenané na videozáznam s časovou stopou.</li>
                  </ul>

                  <h4>Oznámenie a odovzdanie výhry:</h4>
                  <ul>
                    <li>Výhercovia budú kontaktovaní e-mailom najneskôr do 5 dní od žrebovania.</li>
                    <li>Ak výherca do 10 pracovných dní od odoslania e-mailu nereaguje alebo odmietne výhru, cena môže byť pridelená náhradníkovi, ktorý bude vyžrebovaný rovnakým spôsobom.</li>
                    <li>Výhra bude odovzdaná elektronicky formou poukazu.</li>
                  </ul>

                  <h4>Ochrana osobných údajov:</h4>
                  <ul>
                    <li>Kontaktný e-mail nebude spájaný s odpoveďami v predvýskume ani v hlavnom výskume.</li>
                    <li>Údaje budú použité výhradne na účely kontaktovania výhercu a budú uchovávané len po dobu trvania súťaže a odovzdania výhry, následne budú bezpečne zlikvidované.</li>
                    <li>Spracovanie osobných údajov prebieha v súlade s GDPR a zákonom č. 18/2018 Z. z.</li>
                  </ul>

                  <h4>Vylúčenie zo súťaže:</h4>
                  <ul>
                    <li>Organizátor si vyhradzuje právo vylúčiť účastníka zo súťaže, ak:
                      <ul>
                        <li>Porušil tieto pravidlá a podmienky súťaže.</li>
                        <li>Uviedol zjavne nepravdivé údaje alebo iným spôsobom zneužil mechanizmus súťaže (napr. viacnásobná registrácia s rôznymi e-mailmi).</li>
                      </ul>
                    </li>
                  </ul>

                  <h4>Zodpovednosť organizátora:</h4>
                  <ul>
                    <li>Organizátor nezodpovedá za technické problémy (napr. výpadky internetu, poruchy zariadenia účastníka), ktoré znemožnia alebo skomplikujú účasť v súťaži alebo dokončenie výskumu.</li>
                  </ul>
                </>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </Layout>
  );
};

export default MainMenu;
