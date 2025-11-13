// src/components/admin/AdminPanel.js
// OPTIMALIZOVANÁ VERZIA - Lepší dizajn, responzívne, nové button varianty

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../styles/Layout';
import StyledButton from '../../styles/StyledButton';
import { useUserStats } from '../../contexts/UserStatsContext';
import * as XLSX from 'xlsx';

const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h1`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 32px;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const RefreshButton = styled(StyledButton)`
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${p => p.theme.ACCENT_COLOR}44;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h2`
  color: ${p => p.theme.ACCENT_COLOR};
  margin-bottom: 20px;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

const InfoText = styled.p`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, 
    ${p => p.theme.ACCENT_COLOR}22, 
    ${p => p.theme.ACCENT_COLOR_2}22
  );
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${p => p.theme.ACCENT_COLOR}44;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${p => p.theme.ACCENT_COLOR}33;
  }
`;

const StatLabel = styled.div`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 12px;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  color: ${p => p.theme.ACCENT_COLOR};
  font-size: 28px;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 16px;
  border-radius: 8px;
  border: 1px solid ${p => p.theme.BORDER_COLOR};
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 800px;
`;

const Th = styled.th`
  padding: 12px 8px;
  background: ${p => p.theme.ACCENT_COLOR};
  color: #FFFFFF;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Td = styled.td`
  padding: 10px 8px;
  border-bottom: 1px solid ${p => p.theme.BORDER_COLOR};
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  
  &:first-child {
    font-weight: 600;
    color: ${p => p.theme.ACCENT_COLOR};
  }
`;

const MissionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: ${p => p.theme.INPUT_BACKGROUND}44;
  border-radius: 8px;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
`;

const MissionLabel = styled.div`
  font-weight: 600;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MissionButtons = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
    
    button {
      flex: 1;
    }
  }
`;

const DangerSection = styled(Section)`
  border-color: ${p => p.theme.ERROR_COLOR || '#ef4444'};
  background: ${p => `${p.theme.ERROR_COLOR || '#ef4444'}11`};
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
`;

const LoadingSpinner = styled.div`
  text-align: center;
  color: white;
  font-size: 18px;
  
  &::before {
    content: '⏳';
    display: block;
    font-size: 48px;
    margin-bottom: 16px;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const AdminPanel = () => {
  const navigate = useNavigate();
  const { dataManager, userId } = useUserStats();

  const [stats, setStats] = useState({
    total: 0,
    group0: 0,
    group1: 0,
    group2: 0,
    mission0Complete: 0,
    mission1Complete: 0,
    mission2Complete: 0,
    mission3Complete: 0
  });

  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const loadStats = useCallback(async () => {
    setLoading(true);
    await dataManager.fetchAllParticipantsData();
    const all = dataManager.getAllParticipantsData();
    const participants = Object.values(all);
    
    setAllUsers(participants);
    setStats({
      total: participants.length,
      group0: participants.filter(p => p.group_assignment === '0').length,
      group1: participants.filter(p => p.group_assignment === '1').length,
      group2: participants.filter(p => p.group_assignment === '2').length,
      mission0Complete: participants.filter(p => p.mission0_completed).length,
      mission1Complete: participants.filter(p => p.mission1_completed).length,
      mission2Complete: participants.filter(p => p.mission2_completed).length,
      mission3Complete: participants.filter(p => p.mission3_completed).length
    });
    setLoading(false);
  }, [dataManager]);

  useEffect(() => {
    if (!dataManager.isAdmin(userId)) {
      navigate('/');
      return;
    }
    loadStats();
  }, [userId, dataManager, navigate, loadStats]);

  const handleExportExcel = async () => {
    setIsExporting(true);
    
    try {
      await dataManager.fetchAllParticipantsData();
      const allData = dataManager.getAllParticipantsData();
      const participants = Object.values(allData);

      if (participants.length === 0) {
        alert('Žiadne dáta na export');
        setIsExporting(false);
        return;
      }

      const allComponentIds = new Set();
      const questionIdsByComponent = {};

      participants.forEach(p => {
        if (p.responses) {
          Object.entries(p.responses).forEach(([componentId, componentData]) => {
            allComponentIds.add(componentId);
            if (!questionIdsByComponent[componentId]) {
              questionIdsByComponent[componentId] = new Set();
            }
            if (componentData.answers) {
              Object.keys(componentData.answers).forEach(qId => {
                questionIdsByComponent[componentId].add(qId);
              });
            }
          });
        }
      });

      const rows = participants.map(p => {
        const row = {
          participant_code: p.participant_code || '',
          group_assignment: p.group_assignment || '',
          sharing_code: p.sharing_code || '',
          referral_code: p.referral_code || '',
          timestamp_start: p.timestamp_start || '',
          timestamp_last_update: p.timestamp_last_update || '',
          user_stats_points: p.user_stats_points || 0,
          user_stats_mission_points: p.user_stats_mission_points || 0,
          user_stats_level: p.user_stats_level || 1,
          referrals_count: p.referrals_count || 0,
          mission0_completed: p.mission0_completed || false,
          mission1_completed: p.mission1_completed || false,
          mission2_completed: p.mission2_completed || false,
          mission3_completed: p.mission3_completed || false,
          instruction_completed: p.instruction_completed || false,
          intro_completed: p.intro_completed || false
        };

        allComponentIds.forEach(componentId => {
          const componentData = p.responses?.[componentId];
          if (componentData) {
            const questionIds = questionIdsByComponent[componentId];
            questionIds.forEach(qId => {
              const columnName = `${componentId}__${qId}`;
              row[columnName] = componentData.answers?.[qId] ?? '';
            });

            if (componentData.metadata) {
              row[`${componentId}__started_at`] = componentData.metadata.started_at || '';
              row[`${componentId}__completed_at`] = componentData.metadata.completed_at || '';
              row[`${componentId}__time_spent_seconds`] = componentData.metadata.time_spent_seconds || '';
              row[`${componentId}__device`] = componentData.metadata.device || '';
            }
          }
        });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(rows);
      
      if (rows.length > 0) {
        const colWidths = [];
        const headers = Object.keys(rows[0]);
        headers.forEach((header, i) => {
          const maxLen = Math.max(
            header.length,
            ...rows.map(row => String(row[header] || '').length)
          );
          colWidths[i] = { wch: Math.min(maxLen + 2, 50) };
        });
        ws['!cols'] = colWidths;
      }

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'All Data');
      const filename = `conspiracy_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, filename);
      
      alert(`✅ Export úspešný!\n\n${rows.length} účastníkov\n${allComponentIds.size} komponentov`);
      
    } catch (error) {
      console.error('❌ Chyba pri exporte:', error);
      alert(`Chyba pri exporte: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleUnlockMission = async (missionId) => {
    if (!window.confirm(`Odomknúť misiu ${missionId} pre všetkých?`)) return;
    try {
      await dataManager.unlockMissionForAll(missionId);
      alert(`✅ Misia ${missionId} odomknutá!`);
      await loadStats();
    } catch (error) {
      alert(`❌ Chyba: ${error.message}`);
    }
  };

  const handleLockMission = async (missionId) => {
    if (!window.confirm(`Zamknúť misiu ${missionId} pre všetkých?`)) return;
    try {
      await dataManager.lockMissionForAll(missionId);
      alert(`✅ Misia ${missionId} zamknutá!`);
      await loadStats();
    } catch (error) {
      alert(`❌ Chyba: ${error.message}`);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('⚠️ VYMAZAŤ VŠETKÝCH ÚČASTNÍKOV? Táto akcia je nevratná!')) return;
    if (!window.confirm('Ste si istý? Všetky dáta budú natrvalo vymazané!')) return;

    try {
      const response = await fetch('/.netlify/functions/progress?code=all', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminCode: 'RF9846' })
      });

      if (response.ok) {
        dataManager.clearAllData();
        alert('✅ Všetky dáta vymazané!');
        await loadStats();
      } else {
        const errorData = await response.json();
        alert(`❌ Chyba: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      alert(`❌ Chyba: ${error.message}`);
    }
  };

  if (loading && allUsers.length === 0) {
    return (
      <Layout>
        <LoadingOverlay>
          <LoadingSpinner>
            Načítavam admin panel...
          </LoadingSpinner>
        </LoadingOverlay>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Header>
          <Title>⚙️ Admin Panel</Title>
          <RefreshButton variant="accent" size="small" onClick={loadStats}>
            🔄 Obnoviť dáta
          </RefreshButton>
        </Header>

        {/* Štatistiky */}
        <Section>
          <SectionTitle>📊 Prehľad štatistík</SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatLabel>Celkom účastníkov</StatLabel>
              <StatValue>{stats.total}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Skupina 0</StatLabel>
              <StatValue>{stats.group0}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Skupina 1</StatLabel>
              <StatValue>{stats.group1}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Skupina 2</StatLabel>
              <StatValue>{stats.group2}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Misia 0</StatLabel>
              <StatValue>{stats.mission0Complete}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Misia 1</StatLabel>
              <StatValue>{stats.mission1Complete}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Misia 2</StatLabel>
              <StatValue>{stats.mission2Complete}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Misia 3</StatLabel>
              <StatValue>{stats.mission3Complete}</StatValue>
            </StatCard>
          </StatsGrid>
        </Section>

        <GridLayout>
          {/* Export */}
          <Section>
            <SectionTitle>💾 Export dát</SectionTitle>
            <InfoText>
              Export obsahuje všetky odpovede, metadata a progress zo všetkých účastníkov.
            </InfoText>
            <StyledButton 
              variant="success"
              fullWidth
              loading={isExporting}
              onClick={handleExportExcel}
            >
              {isExporting ? 'Exportujem...' : '📥 Export do Excel'}
            </StyledButton>
          </Section>

          {/* Správa misií */}
          <Section>
            <SectionTitle>🔓 Správa misií</SectionTitle>
            <InfoText>Odomknúť/zamknúť misie pre všetkých.</InfoText>
            {[0, 1, 2, 3].map(missionId => (
              <MissionRow key={missionId}>
                <MissionLabel>
                  🎯 Misia {missionId}
                </MissionLabel>
                <MissionButtons>
                  <StyledButton 
                    variant="success"
                    size="small"
                    onClick={() => handleUnlockMission(missionId)}
                  >
                    🔓 Odomknúť
                  </StyledButton>
                  <StyledButton 
                    variant="outline"
                    size="small"
                    onClick={() => handleLockMission(missionId)}
                  >
                    🔒 Zamknúť
                  </StyledButton>
                </MissionButtons>
              </MissionRow>
            ))}
          </Section>
        </GridLayout>

        {/* Používatelia */}
        <Section>
          <SectionTitle>👥 Zoznam účastníkov ({allUsers.length})</SectionTitle>
          {allUsers.length === 0 ? (
            <InfoText>Žiadni účastníci v databáze.</InfoText>
          ) : (
            <TableWrapper>
              <UserTable>
                <thead>
                  <tr>
                    <Th>Kód</Th>
                    <Th>Skupina</Th>
                    <Th>Body</Th>
                    <Th>M0</Th>
                    <Th>M1</Th>
                    <Th>M2</Th>
                    <Th>M3</Th>
                    <Th>Registrovaný</Th>
                    <Th>Posledná aktivita</Th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(u => (
                    <tr key={u.participant_code}>
                      <Td>{u.participant_code}</Td>
                      <Td>{u.group_assignment}</Td>
                      <Td>{u.user_stats_points || 0}</Td>
                      <Td>{u.mission0_completed ? '✔' : '–'}</Td>
                      <Td>{u.mission1_completed ? '✔' : '–'}</Td>
                      <Td>{u.mission2_completed ? '✔' : '–'}</Td>
                      <Td>{u.mission3_completed ? '✔' : '–'}</Td>
                      <Td>{u.timestamp_start?.slice(0, 10)}</Td>
                      <Td>{u.timestamp_last_update?.slice(0, 16)?.replace('T', ' ')}</Td>
                    </tr>
                  ))}
                </tbody>
              </UserTable>
            </TableWrapper>
          )}
        </Section>

        {/* Danger Zone */}
        <DangerSection>
          <SectionTitle style={{ color: '#ef4444' }}>⚠️ Danger Zone</SectionTitle>
          <InfoText>Tieto akcie sú nevratné a vymažú všetky dáta!</InfoText>
          <StyledButton 
            variant="danger"
            fullWidth
            onClick={handleDeleteAll}
          >
            🗑️ Vymazať všetkých účastníkov
          </StyledButton>
        </DangerSection>

        {/* Navigácia */}
        <ButtonGroup>
          <StyledButton variant="ghost" onClick={() => navigate('/mainmenu')}>
            ← Späť na hlavné menu
          </StyledButton>
        </ButtonGroup>
      </Container>
    </Layout>
  );
};

export default AdminPanel;
