// src/components/main/MainMenu.js - S PRIDANOU SHARING SEKCIOU

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../styles/Layout';
import { useUserStats } from '../../contexts/UserStatsContext';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 14px;
`;

const StatsCard = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// ✅ NOVÉ - SHARING SECTION
const SharingSection = styled.div`
  background: linear-gradient(135deg, ${p => p.theme.ACCENT_COLOR}22, ${p => p.theme.ACCENT_COLOR_2}22);
  border: 2px solid ${p => p.theme.ACCENT_COLOR};
  border-radius: 12px;
  padding: 20px;
  margin: 0 0 30px 0;
  text-align: center;
`;

const SharingTitle = styled.h3`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 700;
`;

const SharingCodeDisplay = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px dashed ${p => p.theme.ACCENT_COLOR};
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
`;

const SharingCode = styled.code`
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 4px;
  color: ${p => p.theme.ACCENT_COLOR};
  font-family: 'Courier New', monospace;
`;

const SharingInfo = styled.p`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 14px;
  margin: 12px 0;
  line-height: 1.6;
`;

const CopyButton = styled.button`
  background: ${p => p.theme.ACCENT_COLOR};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  &:active {
    transform: translateY(0);
  }
`;

const ReferralStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
`;

const ReferralStat = styled.div`
  text-align: center;
`;

const ReferralStatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${p => p.theme.ACCENT_COLOR};
`;

const ReferralStatLabel = styled.div`
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MissionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const MissionCard = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  position: relative;
  cursor: ${p => p.locked ? 'not-allowed' : 'pointer'};
  opacity: ${p => p.locked ? 0.5 : 1};
  transition: all 0.2s ease;

  &:hover {
    transform: ${p => p.locked ? 'none' : 'translateY(-2px)'};
    border-color: ${p => p.locked ? p.theme.BORDER_COLOR : p.theme.ACCENT_COLOR};
  }
`;

const MissionNumber = styled.div`
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 8px;
  font-weight: 600;
  text-transform: uppercase;
`;

const MissionTitle = styled.h3`
  font-size: 16px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  margin-bottom: 12px;
`;

const MissionStatus = styled.div`
  font-size: 12px;
  color: ${p => p.completed ? p.theme.ACCENT_COLOR_3 : p.theme.SECONDARY_TEXT_COLOR};
  font-weight: 600;
  text-transform: uppercase;
`;

const AdminButtons = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
`;

const AdminButton = styled.button`
  background: ${p => p.unlock ? p.theme.ACCENT_COLOR_3 : p.theme.ACCENT_COLOR_2};
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 10px;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${p => p.theme.CARD_BACKGROUND};
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${p => p.theme.HOVER_OVERLAY};
    transform: translateY(-1px);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  background: ${p => p.theme.CARD_BACKGROUND};
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 18px;
  cursor: pointer;
`;

const makeMissionList = (p) => [
  { id: 0, title: 'Misia 0', route: '/mission0/intro', completed: !!p.mission0_completed, locked: !p.mission0_unlocked },
  { id: 1, title: 'Misia 1', route: '/mission1/intro', completed: !!p.mission1_completed, locked: !p.mission1_unlocked },
  { id: 2, title: 'Misia 2', route: '/mission2/intro', completed: !!p.mission2_completed, locked: !p.mission2_unlocked },
  { id: 3, title: 'Misia 3', route: '/mission3/intro', completed: !!p.mission3_completed, locked: !p.mission3_unlocked }
];

const MainMenu = () => {
  const navigate = useNavigate();
  const { userStats, dataManager, userId, logout } = useUserStats();
  const [missions, setMissions] = useState([]);
  const [modal, setModal] = useState({ open: false, type: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false); // ✅ NOVÉ
  const [userProgress, setUserProgress] = useState(null); // ✅ NOVÉ
  const isAdmin = dataManager.isAdmin(userId);

  useEffect(() => {
    if (!userId) return;

    const handleStorage = (e) => {
      if (e.key === dataManager.centralStorageKey) {
        const central = dataManager.getAllParticipantsData();
        const p = central[userId] || {};
        setMissions(makeMissionList(p));
        setUserProgress(p); // ✅ NOVÉ
      }
    };

    const load = async () => {
      try {
        await dataManager.syncAllFromServer();
        const central = dataManager.getAllParticipantsData();
        const p = central[userId] || {};
        setMissions(makeMissionList(p));
        setUserProgress(p); // ✅ NOVÉ
      } catch (error) {
        console.warn('Sync failed, using local data:', error);
        const central = dataManager.getAllParticipantsData();
        const p = central[userId] || {};
        setMissions(makeMissionList(p));
        setUserProgress(p); // ✅ NOVÉ
      }
    };

    load();

    const interval = setInterval(load, 2000);
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
  }, [dataManager, userId]);

  useEffect(() => {
    if (!userId) {
      navigate('/instruction');
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (userId) {
      const loadInitial = async () => {
        try {
          const p = await dataManager.loadUserProgress(userId);
          setMissions(makeMissionList(p));
          setUserProgress(p); // ✅ NOVÉ
        } catch (error) {
          console.warn('Failed to load initial data:', error);
          const central = dataManager.getAllParticipantsData();
          const p = central[userId] || {};
          setMissions(makeMissionList(p));
          setUserProgress(p); // ✅ NOVÉ
        }
      };
      loadInitial();
    }
  }, [dataManager, userId]);

  const handleMissionClick = (m) => {
    if (!m.locked) navigate(m.route);
  };

  const handleExport = () => {
    try {
      dataManager.exportAllParticipantsCSV();
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Chyba pri exportovaní dáta.');
    }
  };

  // ✅ NOVÁ FUNKCIA - Kopírovanie sharing kódu
  const handleCopyCode = () => {
    if (userProgress?.sharing_code) {
      navigator.clipboard.writeText(userProgress.sharing_code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleUnlock = async (id) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      console.log(`🔓 Odomykám misiu ${id}...`);
      await dataManager.unlockMissionForAll(id);
      
      await dataManager.syncAllFromServer();
      const central = dataManager.getAllParticipantsData();
      const p = central[userId] || {};
      setMissions(makeMissionList(p));
      setUserProgress(p); // ✅ NOVÉ
      
      alert(`✅ Misia ${id} bola odomknutá pre všetkých používateľov`);
    } catch (error) {
      console.error('Unlock error:', error);
      alert(`❌ Chyba pri odomykaní misie: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLock = async (id) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      console.log(`🔒 Zamykám misiu ${id}...`);
      await dataManager.lockMissionForAll(id);
      
      await dataManager.syncAllFromServer();
      const central = dataManager.getAllParticipantsData();
      const p = central[userId] || {};
      setMissions(makeMissionList(p));
      setUserProgress(p); // ✅ NOVÉ
      
      alert(`✅ Misia ${id} bola zamknutá pre všetkých používateľov`);
    } catch (error) {
      console.error('Lock error:', error);
      alert(`❌ Chyba pri zamykaní misie: ${error.message}`);
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

  return (
    <Layout>
      <Container>
        <Header>
          <Title>Conspiracy Pass</Title>
          <Subtitle>Staňte sa detektívom a odhaľte pravdu</Subtitle>
          <StatsCard>
            <StatItem>
              <StatValue>{userStats.points}</StatValue>
              <StatLabel>Body</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{missions.filter(m => m.completed).length}/4</StatValue>
              <StatLabel>Dokončené</StatLabel>
            </StatItem>
          </StatsCard>
        </Header>

        {/* ✅ NOVÁ SEKCIA - SHARING */}
        <SharingSection>
          <SharingTitle>🎁 Zdieľajte a získajte body!</SharingTitle>
          
          <SharingCodeDisplay>
            <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>
              Váš zdieľací kód:
            </div>
            <SharingCode>
              {userProgress?.sharing_code || 'Načítavam...'}
            </SharingCode>
          </SharingCodeDisplay>
          
          <CopyButton onClick={handleCopyCode}>
            {copySuccess ? '✅ Skopírované!' : '📋 Kopírovať kód'}
          </CopyButton>
          
          <SharingInfo>
            Zdieľajte tento kód s priateľmi!<br/>
            Za každého nového používateľa získate <strong>+10 bodov</strong> 🎉
          </SharingInfo>
          
          {userProgress?.referrals_count > 0 && (
            <ReferralStats>
              <ReferralStat>
                <ReferralStatValue>{userProgress.referrals_count}</ReferralStatValue>
                <ReferralStatLabel>Odporúčaní</ReferralStatLabel>
              </ReferralStat>
              <ReferralStat>
                <ReferralStatValue>{userProgress.referrals_count * 10}</ReferralStatValue>
                <ReferralStatLabel>Získaných bodov</ReferralStatLabel>
              </ReferralStat>
            </ReferralStats>
          )}
        </SharingSection>

        <MissionsGrid>
          {missions.map(m => (
            <MissionCard
              key={m.id}
              locked={m.locked}
              completed={m.completed}
              onClick={() => handleMissionClick(m)}
            >
              {isAdmin && (
                <AdminButtons>
                  <AdminButton
                    unlock
                    disabled={isUpdating}
                    onClick={e => {
                      e.stopPropagation();
                      handleUnlock(m.id);
                    }}
                  >
                    🔓
                  </AdminButton>
                  <AdminButton
                    disabled={isUpdating}
                    onClick={e => {
                      e.stopPropagation();
                      handleLock(m.id);
                    }}
                  >
                    🔒
                  </AdminButton>
                </AdminButtons>
              )}
              <MissionNumber>Misia {m.id}</MissionNumber>
              <MissionTitle>{m.title}</MissionTitle>
              <MissionStatus completed={m.completed}>
                {m.locked ? '🔒 Uzamknuté' : m.completed ? '✓ Dokončené' : '→ Začať'}
              </MissionStatus>
            </MissionCard>
          ))}
        </MissionsGrid>

        <ButtonGroup>
          <IconButton onClick={() => openModal('help')}>❓ Pomoc</IconButton>
          <IconButton onClick={() => openModal('contest')}>🎁 Súťaž o ceny</IconButton>
          {isAdmin && <IconButton onClick={handleExport}>📤 Exportovať dáta</IconButton>}
          {isAdmin && <IconButton onClick={() => navigate('/admin')}>⚙️ Admin</IconButton>}
          <IconButton onClick={handleLogout}>🔒 Odhlásiť sa</IconButton>
        </ButtonGroup>

        {modal.open && (
          <ModalOverlay onClick={closeModal}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <CloseButton onClick={closeModal}>×</CloseButton>
              {modal.type === 'help' && (
                <>
                  <h3>Pomoc</h3>
                  <p>Kontakt: support@example.com</p>
                </>
              )}
              {modal.type === 'contest' && (
                <>
                  <h3>Súťaž o ceny</h3>
                  <p>1.p.: iPad; 2.p.: slúchadlá; 3.p.: poukážka 50€</p>
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