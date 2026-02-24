// src/utils/DataManager.js
// FINÁLNA VERZIA - s kontrolou duplicitných emailov + unikátnych sharing kódov

import * as XLSX from 'xlsx';

class DataManager {
  constructor() {
    this.centralStorageKey = 'allParticipantsData';
    this.adminUserId = 'RF9846';
    this.cache = new Map();
    this.allParticipantsCache = null;
    this.apiBase = '/api/progress';

    this.clearAllData = () => {
      this.cache.clear();
      this.allParticipantsCache = null;
      Object.keys(localStorage)
        .filter(
          key =>
            key.startsWith('fullProgress_') ||
            key === this.centralStorageKey
        )
        .forEach(key => localStorage.removeItem(key));
      sessionStorage.removeItem('participantCode');
      sessionStorage.removeItem('referralCode');
      console.log('❌ Všetky dáta boli vymazané.');
    };
  }

  getVariableList() {
    return [
      'participant_code',
      'blocked',
      'group_assignment',
      'sharing_code',
      'referral_code',
      'used_referral_code',
      'referred_by',
      'competition_email',
      'timestamp_start',
      'timestamp_last_update',
      'informed_consent_given',           // ✅ PRIDANÉ
      'informed_consent_timestamp',       // ✅ PRIDANÉ
      'competition_consent_given',        // ✅ PRIDANÉ
      'competition_consent_timestamp',    // ✅ PRIDANÉ
      'session_count',
      'total_time_spent',
      'instruction_completed',
      'intro_completed',
      'user_stats_points',
      'user_stats_mission_points',
      'user_stats_level',
      'referrals_count',
      'referred_users',
      'completedMissions',
      'mainmenu_visits',
      'mission0_unlocked',
      'mission0_completed',
      'mission1_unlocked',
      'mission1_completed',
      'mission2_unlocked',
      'mission2_completed',
      'mission3_unlocked',
      'mission3_completed',
      'all_missions_completed'
    ];
  }

  // ✅ NOVÁ METÓDA - Kontrola či email už existuje v databáze
  async checkEmailExists(email) {
    if (!email) return false;
    
    try {
      const normalizedEmail = email.toLowerCase().trim();
      console.log(`🔍 Kontrolujem duplicitný email: ${normalizedEmail}`);
      
      await this.syncAllFromServer();
      const allData = this.getAllParticipantsData();
      
      const emailExists = Object.values(allData).some(userData => {
        const userEmail = userData.competition_email;
        if (!userEmail) return false;
        return userEmail.toLowerCase().trim() === normalizedEmail;
      });
      
      if (emailExists) {
        console.log(`⚠️ Email ${normalizedEmail} už bol použitý`);
        return true;
      }
      
      console.log(`✅ Email ${normalizedEmail} je voľný`);
      return false;
      
    } catch (error) {
      console.error('❌ Error checking email:', error);
      return false;
    }
  }

  // ✅ NOVÁ METÓDA - Uloženie emailu pre súťaž
  async saveCompetitionEmail(participantCode, email) {
    if (!participantCode || !email) {
      console.warn('⚠️ Missing participantCode or email');
      return false;
    }
    
    try {
      const normalizedEmail = email.toLowerCase().trim();
      console.log(`💌 Ukladám email pre súťaž: ${participantCode} → ${normalizedEmail}`);
      
      const userData = await this.loadUserProgress(participantCode);
      userData.competition_email = normalizedEmail;
      userData.competition_email_added_at = new Date().toISOString();
      
      await this.saveProgress(participantCode, userData);
      
      console.log(`✅ Email uložený pre ${participantCode}`);
      return true;
      
    } catch (error) {
      console.error('❌ Error saving competition email:', error);
      throw error;
    }
  }

  async isUserBlocked(participantCode) {
    try {
      console.log(`🔍 Kontrolujem blocked status pre ${participantCode} (priamo zo servera)...`);
      const resp = await fetch(`${this.apiBase}?code=${participantCode}`);
      
      if (!resp.ok) {
        console.warn(`⚠️ Could not check blocked status from server: ${resp.status}`);
        return false;
      }
      
      const userData = await resp.json();
      console.log(`   → Blocked status: ${userData?.blocked ? 'ZABLOKOVANÝ' : 'Aktívny'}`);
      return userData?.blocked || false;
      
    } catch (error) {
      console.error('❌ Error checking blocked status:', error);
      return false;
    }
  }

  async setBlockedState(participantCode, blocked) {
    try {
      console.log(`${blocked ? '🚫 Blokovanie' : '✅ Odblokovanie'} používateľa ${participantCode}...`);
      
      const resp = await fetch(`${this.apiBase}?code=${participantCode}`);
      if (!resp.ok) {
        throw new Error('Používateľ nenájdený na serveri');
      }
      
      const userData = await resp.json();
      userData.blocked = blocked;
      userData.blocked_at = blocked ? new Date().toISOString() : null;
      
      await this.saveProgress(participantCode, userData);
      
      this.cache.delete(participantCode);
      await this.fetchAllParticipantsData();
      
      console.log(`✅ Používateľ ${participantCode} ${blocked ? 'zablokovaný' : 'odblokovaný'}`);
      return true;
      
    } catch (error) {
      console.error('❌ Error setting blocked state:', error);
      throw error;
    }
  }

  async validateReferralCode(code) {
    if (!code) return false;
    
    try {
      await this.syncAllFromServer();
      
      const all = this.getAllParticipantsData();
      const exists = Object.values(all).some(d => d.sharing_code === code.toUpperCase());
      
      console.log(`🔍 Validating referral code ${code}: ${exists ? 'FOUND' : 'NOT FOUND'}`);
      return exists;
    } catch (error) {
      console.error('Error validating referral code:', error);
      return false;
    }
  }

  async validateSharingCode(code) {
    return await this.validateReferralCode(code);
  }

  async getUserSharingCode(userId) {
    try {
      const userData = await this.loadUserProgress(userId);
      return userData?.sharing_code || null;
    } catch (error) {
      console.error('Error getting sharing code:', error);
      return null;
    }
  }

  async processReferral(participantCode, referralCode) {
    try {
      console.log(`🎁 Processing referral: ${participantCode} → ${referralCode}`);
      
      await this.syncAllFromServer();
      const all = this.getAllParticipantsData();
      
      const isValid = await this.validateReferralCode(referralCode);
      if (!isValid) {
        console.warn(`⚠️ Referral kód ${referralCode} neexistuje v systéme`);
        throw new Error('Tento referral kód neexistuje v systéme');
      }
      
      const entry = Object.entries(all).find(([_, d]) => 
        d.sharing_code === referralCode.toUpperCase()
      );
      
      if (!entry) {
        console.warn(`⚠️ Referral kód ${referralCode} nenájdený (unexpected)`);
        throw new Error('Neplatný referral kód');
      }
      
      const [refCode, refData] = entry;
      console.log(`✅ Referral kód patrí používateľovi: ${refCode}`);
      
      const newUserData = await this.loadUserProgress(participantCode);
      
      if (newUserData?.used_referral_code) {
        console.warn(`⚠️ ${participantCode} už použil referral kód: ${newUserData.used_referral_code}`);
        throw new Error('Už ste použili referral kód. Môžete ho použiť iba raz.');
      }
      
      if (refCode === participantCode) {
        console.warn(`⚠️ ${participantCode} sa pokúsil použiť svoj vlastný referral kód`);
        throw new Error('Nemôžete použiť svoj vlastný zdieľací kód!');
      }
      
      refData.referred_users = refData.referred_users || [];
      if (refData.referred_users.includes(participantCode)) {
        console.warn(`⚠️ ${participantCode} už bol pridaný do referred_users pre ${refCode}`);
        throw new Error('Tento referral už bol spracovaný');
      }
      
      refData.referrals_count = (refData.referrals_count || 0) + 1;
      refData.referred_users.push(participantCode);
      
      const missionPoints = refData.user_stats_mission_points || 0;
      const bonusPoints = refData.referrals_count * 10;
      refData.user_stats_points = missionPoints + bonusPoints;
      
      newUserData.used_referral_code = referralCode.toUpperCase();
      newUserData.referred_by = refCode;
      newUserData.referral_code = referralCode.toUpperCase();
      
      await this.saveProgress(refCode, refData);
      await this.saveProgress(participantCode, newUserData);
      
      console.log(`✅ Referral spracovaný úspešne!`);
      console.log(`   - ${refCode}: ${refData.referrals_count} referralov, +${bonusPoints} bodov`);
      console.log(`   - ${participantCode}: označený ako použil referral`);
      
      return {
        success: true,
        referrerCode: refCode,
        referrerCount: refData.referrals_count,
        bonusPoints: bonusPoints
      };
      
    } catch (error) {
      console.error('❌ Error processing referral:', error);
      throw error;
    }
  }

  async unlockMissionForAll(missionId) {
    console.log(`🔓 Odomykám misiu ${missionId} pre všetkých...`);
    
    try {
      const response = await fetch(`${this.apiBase}?code=missions-unlock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, adminCode: this.adminUserId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ Batch unlock ${missionId} na serveri (${result.modifiedCount} používateľov)`);

      await this.fetchAllParticipantsData();
      this.cache.clear();
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.centralStorageKey,
        newValue: localStorage.getItem(this.centralStorageKey),
        url: window.location.href
      }));

      console.log(`✅ Misia ${missionId} odomknutá pre všetkých`);
      return result;
      
    } catch (error) {
      console.error('❌ Unlock failed:', error);
      throw error;
    }
  }

  async lockMissionForAll(missionId) {
    console.log(`🔒 Zamykám misiu ${missionId} pre všetkých...`);
    
    try {
      const response = await fetch(`${this.apiBase}?code=missions-lock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, adminCode: this.adminUserId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ Batch lock ${missionId} na serveri (${result.modifiedCount} používateľov)`);

      await this.fetchAllParticipantsData();
      this.cache.clear();
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.centralStorageKey,
        newValue: localStorage.getItem(this.centralStorageKey),
        url: window.location.href
      }));

      console.log(`✅ Misia ${missionId} zamknutá pre všetkých`);
      return result;
      
    } catch (error) {
      console.error('❌ Lock failed:', error);
      throw error;
    }
  }

  async fetchAllParticipantsData() {
    try {
      console.log('📥 Načítavam všetkých používateľov z backendu...');
      const resp = await fetch(`${this.apiBase}?code=all`);
      
      if (!resp.ok) {
        console.warn('⚠️ Server vrátil chybu:', resp.status);
        return this.getAllParticipantsData();
      }
      
      const allData = await resp.json();
      
      this.allParticipantsCache = allData;
      localStorage.setItem(this.centralStorageKey, JSON.stringify(allData));
      
      Object.entries(allData).forEach(([code, data]) => {
        localStorage.setItem(`fullProgress_${code}`, JSON.stringify(data));
      });
      
      console.log(`✅ Načítaných ${Object.keys(allData).length} používateľov z backendu`);
      return allData;
      
    } catch (e) {
      console.warn('⚠️ Fetch všetkých dát zlyhal:', e);
      return this.getAllParticipantsData();
    }
  }

  async syncAllFromServer() {
    return await this.fetchAllParticipantsData();
  }

  async loadUserProgress(participantCode, forceServerFetch = false) {
    if (!participantCode) return null;
    
    if (!forceServerFetch && this.cache.has(participantCode)) {
      console.log(`📦 Používam cache pre ${participantCode}`);
      return this.cache.get(participantCode);
    }

    try {
      console.log(`📡 Načítavam ${participantCode} zo servera...`);
      const resp = await fetch(`${this.apiBase}?code=${participantCode}`);

      if (!resp.ok) {
        if (resp.status === 404) {
          console.log(`🆕 Používateľ ${participantCode} neexistuje na serveri`);
          console.log(`   Backend ho automaticky vytvorí...`);
          
          await new Promise(resolve => setTimeout(resolve, 100));
          const retryResp = await fetch(`${this.apiBase}?code=${participantCode}`);
          
          if (retryResp.ok) {
            const data = await retryResp.json();
            console.log(`✅ Backend vytvoril ${participantCode}:`, {
              blocked: data.blocked,
              m0: data.mission0_unlocked,
              m1: data.mission1_unlocked,
              m2: data.mission2_unlocked,
              m3: data.mission3_unlocked
            });
            const prog = await this.validateAndFixData(data, participantCode);
            this._cacheAndStore(participantCode, prog);
            return prog;
          }
          
          console.warn('⚠️ Retry zlyhal, vytváram lokálne');
          const rec = await this.createNewUserRecord(participantCode);
          await this.syncToServer(participantCode, rec);
          return rec;
        }
        console.warn(`Server error ${resp.status}: ${resp.statusText}`);
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      
      console.log(`📥 Dáta zo servera pre ${participantCode}:`, {
        blocked: data.blocked,
        blocked_at: data.blocked_at,
        competition_email: data.competition_email ? '✓' : '✗',
        mission0_unlocked: data.mission0_unlocked,
        mission1_unlocked: data.mission1_unlocked,
        mission2_unlocked: data.mission2_unlocked,
        mission3_unlocked: data.mission3_unlocked
      });
      
      if (!data || Object.keys(data).length === 0) {
        console.log(`🆕 Server vrátil prázdne dáta`);
        const rec = await this.createNewUserRecord(participantCode);
        await this.syncToServer(participantCode, rec);
        return rec;
      }

      const prog = await this.validateAndFixData(data.progress || data, participantCode);
      this._cacheAndStore(participantCode, prog);
      return prog;
      
    } catch (error) {
      console.warn('⚠️ Server nedostupný, používam localStorage:', error.message);
      
      const saved = localStorage.getItem(`fullProgress_${participantCode}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          console.log(`📦 Načítaný zo localStorage: ${participantCode}`);
          const prog = await this.validateAndFixData(data, participantCode);
          this.cache.set(participantCode, prog);
          
          this.syncToServer(participantCode, prog).catch(e =>
            console.warn('Background sync failed:', e)
          );
          return prog;
        } catch (e) {
          console.error('localStorage data corrupted:', e);
        }
      }

      const central = this.getAllParticipantsData();
      if (central[participantCode]) {
        const prog = await this.validateAndFixData(central[participantCode], participantCode);
        this._cacheAndStore(participantCode, prog);
        return prog;
      }

      console.log(`🆕 Lokálne vytváram nového používateľa ${participantCode}`);
      const rec = await this.createNewUserRecord(participantCode);
      await this.syncToServer(participantCode, rec);
      return rec;
    }
  }

  async syncToServer(participantCode, data) {
    try {
      const resp = await fetch(`${this.apiBase}?code=${participantCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!resp.ok) {
        console.warn(`Sync failed for ${participantCode}: HTTP ${resp.status}`);
        return false;
      }

      console.log(`✅ Synced ${participantCode} - blocked: ${data.blocked}`);
      return true;
    } catch (error) {
      console.warn('Sync na server zlyhal:', error.message);
      return false;
    }
  }

  // ✅ OPRAVENÁ METÓDA - async a kontrola duplicity
  async validateAndFixData(data, participantCode) {
    data.participant_code = participantCode;
    
    // ✅ Vygeneruj unikátny sharing code
    if (!data.sharing_code) {
      data.sharing_code = await this.generateUniqueSharingCode(participantCode);
    }
    
    if (!['0', '1', '2'].includes(data.group_assignment)) {
      data.group_assignment = Math.random() < 0.33 ? '0' : Math.random() < 0.66 ? '1' : '2';
    }
    
    const defaults = this.getDefaultFields();
    
    const preserveFields = [
      'blocked',
      'blocked_at',
      'competition_email',
      'competition_email_added_at',
      'mission0_unlocked',
      'mission1_unlocked',
      'mission2_unlocked',
      'mission3_unlocked',
      'mission0_completed',
      'mission1_completed',
      'mission2_completed',
      'mission3_completed',
      'all_missions_completed',
      'instruction_completed',
      'intro_completed'
    ];
    
    Object.entries(defaults).forEach(([k, v]) => {
      if (preserveFields.includes(k)) {
        if (data[k] === undefined) {
          data[k] = v;
        }
      } else {
        if (data[k] == null) {
          data[k] = v;
        }
      }
    });
    
    data.timestamp_last_update = new Date().toISOString();
    
    console.log(`🔍 ValidateAndFixData pre ${participantCode}:`, {
      blocked: data.blocked,
      blocked_at: data.blocked_at,
      sharing_code: data.sharing_code,
      competition_email: data.competition_email ? '✓' : '✗',
      m0: data.mission0_unlocked,
      m1: data.mission1_unlocked,
      m2: data.mission2_unlocked,
      m3: data.mission3_unlocked
    });
    
    return data;
  }

  getDefaultFields() {
    return {
      timestamp_start: new Date().toISOString(),
      current_progress_step: 'instruction',
      session_count: 1,
      total_time_spent: 0,
      blocked: false,
      blocked_at: null,
      competition_email: null,
      competition_email_added_at: null,
      informed_consent_given: false,          // ✅ PRIDANÉ
      informed_consent_timestamp: null,       // ✅ PRIDANÉ
      competition_consent_given: false,       // ✅ PRIDANÉ
      competition_consent_timestamp: null,    // ✅ PRIDANÉ
      instruction_completed: false,
      intro_completed: false,
      user_stats_points: 0,
      user_stats_mission_points: 0,
      user_stats_level: 1,
      completedSections: [],
      completedMissions: [],
      referrals_count: 0,
      referred_users: [],
      used_referral_code: null,
      referred_by: null,
      mainmenu_visits: 0,
      mission0_completed: false,
      mission0_unlocked: false,
      mission1_completed: false,
      mission1_unlocked: false,
      mission2_completed: false,
      mission2_unlocked: false,
      mission3_completed: false,
      mission3_unlocked: false,
      all_missions_completed: false,
      responses: {}
    };
  }

  async createNewUserRecord(participantCode) {
    console.log(`🆕 Vytváram nového používateľa ${participantCode} (lokálne)...`);
    
    const defaults = this.getDefaultFields();
    const rec = {
      participant_code: participantCode,
      group_assignment: Math.random() < 0.33 ? '0' : Math.random() < 0.66 ? '1' : '2',
      sharing_code: await this.generateUniqueSharingCode(participantCode),
      referral_code: sessionStorage.getItem('referralCode') || null,
      ...defaults
    };
    
    this._cacheAndStore(participantCode, rec);
    
    console.log(`✅ Lokálne vytvorený používateľ ${participantCode} so sharing code ${rec.sharing_code}`);
    return rec;
  }

  // ✅ NOVÁ METÓDA - Generuje unikátny sharing code s kontrolou duplicity
  async generateUniqueSharingCode(participantCode) {
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      // Vygeneruj kód s variáciou v seede
      const code = this.generatePersistentSharingCode(participantCode, attempts);
      
      // 🔍 Skontroluj či kód už existuje
      const allData = this.getAllParticipantsData();
      const codeExists = Object.values(allData).some(userData => 
        userData.sharing_code === code
      );
      
      if (!codeExists) {
        console.log(`✅ Vygenerovaný unikátny sharing code pre ${participantCode}: ${code}`);
        return code;
      }
      
      console.warn(`⚠️ Duplicita! Sharing code ${code} už existuje, pokus ${attempts + 1}/${maxAttempts}`);
      attempts++;
    }
    
    // Fallback: použij timestamp ak zlyhalo 50 pokusov
    const fallbackCode = this.generatePersistentSharingCode(
      participantCode + Date.now(), 
      Math.random() * 1000
    );
    console.warn(`⚠️ Použitý fallback sharing code: ${fallbackCode}`);
    return fallbackCode;
  }

  // ✅ UPRAVENÁ METÓDA - pridaný seed parameter pre variáciu
  generatePersistentSharingCode(participantCode, seedVariation = 0) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let hash = this.hashCode(participantCode + 'SALT2025' + seedVariation);
    let code = '';
    
    for (let i = 0; i < 6; i++) {
      hash = (hash * 9301 + 49297) % 233280;
      code += chars[hash % chars.length];
    }
    
    return code;
  }

  hashCode(str) {
    let h = 0;
    for (const c of String(str)) {
      h = (h << 5) - h + c.charCodeAt(0);
      h &= h;
    }
    return Math.abs(h);
  }

  getSharingCode(participantCode) {
    const prog =
      this.cache.get(participantCode) ||
      JSON.parse(localStorage.getItem(`fullProgress_${participantCode}`) || '{}');
    return prog.sharing_code || null;
  }

  async saveProgress(participantCode, data) {
    console.log(`💾 Ukladám progress pre ${participantCode}:`, {
      blocked: data.blocked,
      competition_email: data.competition_email ? '✓' : '✗',
      m0: data.mission0_unlocked,
      m1: data.mission1_unlocked,
      m2: data.mission2_unlocked,
      m3: data.mission3_unlocked
    });
    
    data.timestamp_last_update = new Date().toISOString();
    this.cache.set(participantCode, data);
    localStorage.setItem(`fullProgress_${participantCode}`, JSON.stringify(data));
    this.saveToCentralStorage(participantCode, data);
    await this.syncToServer(participantCode, data);
  }

  async loadComponentData(participantCode, componentKey) {
    if (!participantCode) return {};
    const prog = await this.loadUserProgress(participantCode);
    return prog ? prog[`${componentKey}_data`] || {} : {};
  }

  async saveComponentData(participantCode, componentKey, data) {
    if (!participantCode) return;
    const prog = await this.loadUserProgress(participantCode);
    prog[`${componentKey}_data`] = data;
    await this.saveProgress(participantCode, prog);
  }

  saveToCentralStorage(participantCode, data) {
    const all = this.getAllParticipantsData();
    all[participantCode] = data;
    localStorage.setItem(this.centralStorageKey, JSON.stringify(all));
    if (this.allParticipantsCache) {
      this.allParticipantsCache[participantCode] = data;
    }
  }

  getAllParticipantsData() {
    if (this.allParticipantsCache) {
      return this.allParticipantsCache;
    }
    return JSON.parse(localStorage.getItem(this.centralStorageKey) || '{}');
  }

  exportAllParticipantsCSV() {
    const all = this.getAllParticipantsData();
    const codes = Object.keys(all);
    if (!codes.length) return alert('Žiadni účastníci');
    const variables = this.getVariableList();
    const rows = codes.map(code => {
      const rec = all[code];
      return variables.map(varName => JSON.stringify(rec[varName] ?? '')).join(',');
    });
    const header = variables.join(',');
    const csvContent = [header, ...rows].join('\n');
    this.downloadCSV(csvContent);
  }

  exportAllParticipantsXLSX() {
    const all = this.getAllParticipantsData();
    const variables = this.getVariableList();
    const data = [variables];
    Object.values(all).forEach(rec => data.push(variables.map(v => rec[v] ?? '')));
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');
    XLSX.writeFile(wb, `export_${Date.now()}.xlsx`);
  }

  downloadCSV(content) {
    const blob = new Blob([content], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `export_${new Date().toISOString()}.csv`;
    link.click();
  }

  isAdmin(code) {
    return code === this.adminUserId;
  }

  _cacheAndStore(participantCode, data) {
    this.cache.set(participantCode, data);
    localStorage.setItem(`fullProgress_${participantCode}`, JSON.stringify(data));
    this.saveToCentralStorage(participantCode, data);
  }
}

const dataManager = new DataManager();
export default dataManager;
