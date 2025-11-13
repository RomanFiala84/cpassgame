// src/utils/ResponseManager.js
// OPTIMALIZOVANÁ VERZIA - Synchronizácia s novým bodovým systémom

class ResponseManager {
  constructor(dataManager) {
    this.dataManager = dataManager;
  }

  /**
   * Univerzálne uloženie odpovede
   * @param {string} participantCode - Kód účastníka
   * @param {string} componentId - Identifikátor komponenty (napr. "mission1_questionnaire1a")
   * @param {string} questionId - Identifikátor otázky (napr. "trust_media_1")
   * @param {any} value - Hodnota odpovede
   * @param {object} metadata - Dodatočné metadáta (voliteľné)
   */
  async saveAnswer(participantCode, componentId, questionId, value, metadata = {}) {
    if (!participantCode) {
      console.warn('❌ Missing participantCode');
      return false;
    }

    try {
      const progress = await this.dataManager.loadUserProgress(participantCode);
      
      if (!progress.responses) {
        progress.responses = {};
      }
      
      if (!progress.responses[componentId]) {
        progress.responses[componentId] = {
          answers: {},
          metadata: {
            started_at: new Date().toISOString()
          }
        };
      }
      
      progress.responses[componentId].answers[questionId] = value;
      progress.responses[componentId].metadata.last_updated = new Date().toISOString();
      
      if (Object.keys(metadata).length > 0) {
        progress.responses[componentId].metadata = {
          ...progress.responses[componentId].metadata,
          ...metadata
        };
      }
      
      await this.dataManager.saveProgress(participantCode, progress);
      
      console.log(`✅ Saved: ${componentId}.${questionId} = ${value}`);
      return true;
      
    } catch (error) {
      console.error('❌ Error saving answer:', error);
      return false;
    }
  }

  /**
   * Uloženie viacerých odpovede naraz (celý dotazník)
   * @param {string} participantCode
   * @param {string} componentId
   * @param {object} answers - Objekt všetkých odpovede { questionId: value }
   * @param {object} metadata - Metadata pre celý komponent
   */
  async saveMultipleAnswers(participantCode, componentId, answers, metadata = {}) {
    if (!participantCode) {
      console.warn('❌ Missing participantCode');
      return false;
    }

    try {
      const progress = await this.dataManager.loadUserProgress(participantCode);
      
      if (!progress.responses) {
        progress.responses = {};
      }
      
      const existingMetadata = progress.responses[componentId]?.metadata || {
        started_at: new Date().toISOString()
      };
      
      progress.responses[componentId] = {
        answers: answers,
        metadata: {
          ...existingMetadata,
          completed_at: new Date().toISOString(),
          ...metadata
        }
      };
      
      progress[`${componentId}_completed`] = true;
      
      await this.dataManager.saveProgress(participantCode, progress);
      
      console.log(`✅ Saved ${Object.keys(answers).length} answers for ${componentId}`);
      return true;
      
    } catch (error) {
      console.error('❌ Error saving multiple answers:', error);
      return false;
    }
  }

  /**
   * Načítanie odpovede
   * @param {string} participantCode
   * @param {string} componentId
   * @returns {object} { answers: {}, metadata: {} }
   */
  async loadResponses(participantCode, componentId) {
    if (!participantCode) return { answers: {}, metadata: {} };
    
    try {
      const progress = await this.dataManager.loadUserProgress(participantCode);
      
      if (!progress.responses || !progress.responses[componentId]) {
        return { answers: {}, metadata: {} };
      }
      
      return progress.responses[componentId];
      
    } catch (error) {
      console.error('❌ Error loading responses:', error);
      return { answers: {}, metadata: {} };
    }
  }

  /**
   * Načítanie konkrétnej odpovede
   * @param {string} participantCode
   * @param {string} componentId
   * @param {string} questionId
   * @returns {any} Hodnota odpovede alebo null
   */
  async loadAnswer(participantCode, componentId, questionId) {
    const responses = await this.loadResponses(participantCode, componentId);
    return responses.answers[questionId] || null;
  }

  /**
   * Zmazanie odpovede (napr. pri restartu misie)
   * @param {string} participantCode
   * @param {string} componentId
   */
  async deleteResponses(participantCode, componentId) {
    if (!participantCode) return false;
    
    try {
      const progress = await this.dataManager.loadUserProgress(participantCode);
      
      if (progress.responses && progress.responses[componentId]) {
        delete progress.responses[componentId];
        delete progress[`${componentId}_completed`];
        
        await this.dataManager.saveProgress(participantCode, progress);
        console.log(`✅ Deleted responses for ${componentId}`);
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ Error deleting responses:', error);
      return false;
    }
  }

  /**
   * Získanie všetkých question IDs zo všetkých účastníkov
   * (Použije sa pri exporte na vytvorenie všetkých stĺpcov)
   */
  getAllQuestionIds() {
    const allData = this.dataManager.getAllParticipantsData();
    const questionIds = new Map();
    
    Object.values(allData).forEach(participant => {
      if (!participant.responses) return;
      
      Object.entries(participant.responses).forEach(([componentId, data]) => {
        if (!questionIds.has(componentId)) {
          questionIds.set(componentId, new Set());
        }
        
        Object.keys(data.answers).forEach(questionId => {
          questionIds.get(componentId).add(questionId);
        });
      });
    });
    
    const result = {};
    questionIds.forEach((ids, componentId) => {
      result[componentId] = Array.from(ids).sort();
    });
    
    return result;
  }

  /**
   * Export všetkých odpovedí do formátu pre analýzu
   * @returns {Array} Array objektov ready pre CSV/XLSX export
   */
  exportAllResponses() {
    const allData = this.dataManager.getAllParticipantsData();
    const allQuestionIds = this.getAllQuestionIds();
    
    const rows = Object.values(allData).map(participant => {
      const row = {
        participant_code: participant.participant_code,
        group_assignment: participant.group_assignment,
        sharing_code: participant.sharing_code, // ✅ PRIDANÉ
        referral_code: participant.referral_code, // ✅ PRIDANÉ
        used_referral_code: participant.used_referral_code, // ✅ PRIDANÉ
        referred_by: participant.referred_by, // ✅ PRIDANÉ
        referrals_count: participant.referrals_count || 0, // ✅ PRIDANÉ
        user_stats_points: participant.user_stats_points || 0,
        user_stats_mission_points: participant.user_stats_mission_points || 0, // ✅ PRIDANÉ
        user_stats_level: participant.user_stats_level || 1,
        mission0_completed: participant.mission0_completed || false, // ✅ PRIDANÉ
        mission1_completed: participant.mission1_completed || false, // ✅ PRIDANÉ
        mission2_completed: participant.mission2_completed || false, // ✅ PRIDANÉ
        mission3_completed: participant.mission3_completed || false, // ✅ PRIDANÉ
        timestamp_start: participant.timestamp_start,
        timestamp_last_update: participant.timestamp_last_update
      };
      
      // Pridaj všetky odpovede
      if (participant.responses) {
        Object.entries(allQuestionIds).forEach(([componentId, questionIds]) => {
          const componentData = participant.responses[componentId];
          
          if (componentData) {
            questionIds.forEach(questionId => {
              const columnName = `${componentId}__${questionId}`;
              row[columnName] = componentData.answers[questionId] ?? '';
            });
            
            if (componentData.metadata) {
              row[`${componentId}__started_at`] = componentData.metadata.started_at || '';
              row[`${componentId}__completed_at`] = componentData.metadata.completed_at || '';
              row[`${componentId}__time_spent_seconds`] = componentData.metadata.time_spent_seconds || '';
              row[`${componentId}__device`] = componentData.metadata.device || ''; // ✅ PRIDANÉ
            }
          } else {
            questionIds.forEach(questionId => {
              row[`${componentId}__${questionId}`] = '';
            });
          }
        });
      }
      
      return row;
    });
    
    return rows;
  }

  /**
   * Export do CSV
   */
  exportToCSV() {
    const data = this.exportAllResponses();
    if (data.length === 0) {
      alert('Žiadne dáta na export');
      return;
    }
    
    const columns = Object.keys(data[0]);
    const header = columns.join(',');
    
    const rows = data.map(row => {
      return columns.map(col => {
        const value = row[col];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
    });
    
    const csvContent = [header, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `responses_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    
    console.log(`✅ Exported ${data.length} participants to CSV`);
  }

  /**
   * Export do XLSX (Excel)
   */
  async exportToXLSX() {
    const XLSX = await import('xlsx');
    
    const data = this.exportAllResponses();
    if (data.length === 0) {
      alert('Žiadne dáta na export');
      return;
    }
    
    const ws = XLSX.utils.json_to_sheet(data);
    
    // ✅ PRIDANÉ - Auto-width pre stĺpce
    const colWidths = [];
    const headers = Object.keys(data[0]);
    headers.forEach((header, i) => {
      const maxLen = Math.max(
        header.length,
        ...data.map(row => String(row[header] || '').length)
      );
      colWidths[i] = { wch: Math.min(maxLen + 2, 50) };
    });
    ws['!cols'] = colWidths;
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Responses');
    
    const filename = `responses_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    console.log(`✅ Exported ${data.length} participants to XLSX`);
  }

  /**
   * ✅ NOVÁ FUNKCIA - Validácia integrity dát
   */
  validateDataIntegrity(participantCode) {
    const progress = this.dataManager.getAllParticipantsData()[participantCode];
    if (!progress) return { valid: false, errors: ['User not found'] };

    const errors = [];

    // Kontrola bodového systému
    const missionPoints = progress.user_stats_mission_points || 0;
    const bonusPoints = (progress.referrals_count || 0) * 10;
    const expectedTotal = missionPoints + bonusPoints;
    const actualTotal = progress.user_stats_points || 0;

    if (expectedTotal !== actualTotal) {
      errors.push(`Points mismatch: expected ${expectedTotal}, got ${actualTotal}`);
    }

    // Kontrola levelu
    const expectedLevel = Math.min(Math.floor(missionPoints / 25) + 1, 5);
    const actualLevel = progress.user_stats_level || 1;

    if (expectedLevel !== actualLevel) {
      errors.push(`Level mismatch: expected ${expectedLevel}, got ${actualLevel}`);
    }

    // Kontrola completedMissions
    const completedCount = [
      progress.mission0_completed,
      progress.mission1_completed,
      progress.mission2_completed,
      progress.mission3_completed
    ].filter(Boolean).length;

    const expectedMissionPoints = completedCount * 25;
    if (missionPoints !== expectedMissionPoints) {
      errors.push(`Mission points mismatch: ${completedCount} missions × 25 = ${expectedMissionPoints}, but got ${missionPoints}`);
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      data: {
        missionPoints,
        bonusPoints,
        totalPoints: expectedTotal,
        level: expectedLevel,
        completedMissions: completedCount
      }
    };
  }

  /**
   * ✅ NOVÁ FUNKCIA - Oprava bodov pre používateľa
   */
  async fixUserPoints(participantCode) {
    try {
      const progress = await this.dataManager.loadUserProgress(participantCode);

      // Prepočítaj body
      const completedMissions = [
        progress.mission0_completed,
        progress.mission1_completed,
        progress.mission2_completed,
        progress.mission3_completed
      ].filter(Boolean);

      const missionPoints = completedMissions.length * 25;
      const bonusPoints = (progress.referrals_count || 0) * 10;
      const totalPoints = missionPoints + bonusPoints;
      const level = Math.min(Math.floor(missionPoints / 25) + 1, 5);

      // Aktualizuj
      progress.user_stats_mission_points = missionPoints;
      progress.user_stats_points = totalPoints;
      progress.user_stats_level = level;
      progress.completedMissions = completedMissions.map((_, i) => `mission${i}`);

      await this.dataManager.saveProgress(participantCode, progress);

      console.log(`✅ Fixed points for ${participantCode}:`, {
        missionPoints,
        bonusPoints,
        totalPoints,
        level
      });

      return true;
    } catch (error) {
      console.error('❌ Error fixing points:', error);
      return false;
    }
  }
}

// Export singleton instance
let responseManagerInstance = null;

export const getResponseManager = (dataManager) => {
  if (!responseManagerInstance) {
    responseManagerInstance = new ResponseManager(dataManager);
  }
  return responseManagerInstance;
};

export default ResponseManager;
