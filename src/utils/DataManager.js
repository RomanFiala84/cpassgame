// src/utils/DataManager.js
// ✅ OPRAVENÁ VERZIA - s normalizáciou participantCode vo všetkých metódach

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
      'informed_consent_given',
      'informed_consent_timestamp',
      'competition_consent_given',
      'competition_consent_timestamp',
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

  // ✅ Kontrola či email už existuje v databáze
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

  // ✅ Uloženie emailu pre súťaž
  async saveCompetitionEmail(participantCode, email) {
    const normalizedCode = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    
    if (!normalizedCode || !email) {
      console.warn('⚠️ Missing participantCode or email');
      return false;
    }
    
    try {
      const normalizedEmail = email.toLowerCase().trim();
      console.log(`💌 Ukladám email pre súťaž: ${normalizedCode} → ${normalizedEmail}`);
      
      const userData = await this.loadUserProgress(normalizedCode);
      userData.competition_email = normalizedEmail;
      userData.competition_email_added_at = new Date().toISOString();
      
      await this.saveProgress(normalizedCode, userData);
      
      console.log(`✅ Email uložený pre ${normalizedCode}`);
      return true;
      
    } catch (error) {
      console.error('❌ Error saving competition email:', error);
      throw error;
    }
  }

  async isUserBlocked(participantCode) {
    const normalizedCode = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    
    try {
      console.log(`🔍 Kontrolujem blocked status pre ${normalizedCode} (priamo zo servera)...`);
      const resp = await fetch(`${this.apiBase}?code=${normalizedCode}`);
      
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
    const normalizedCode = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    
    try {
      console.log(`${blocked ? '🚫 Blokovanie' : '✅ Odblokovanie'} používateľa ${normalizedCode}...`);
      
      const resp = await fetch(`${this.apiBase}?code=${normalizedCode}`);
      if (!resp.ok) {
        throw new Error('Používateľ nenájdený na serveri');
      }
      
      const userData = await resp.json();
      userData.blocked = blocked;
      userData.blocked_at = blocked ? new Date().toISOString() : null;
      
      await this.saveProgress(normalizedCode, userData);
      
      this.cache.delete(normalizedCode);
      await this.fetchAllParticipantsData();
      
      console.log(`✅ Používateľ ${normalizedCode} ${blocked ? 'zablokovaný' : 'odblokovaný'}`);
      return true;
      
    } catch (error) {
      console.error('❌ Error setting blocked state:', error);
      throw error;
    }
  }

  async validateReferralCode(code) {
    if (!code) return false;
    
    const normalizedCode = code.toUpperCase().trim(); // ✅ PRIDANÉ
    
    try {
      await this.syncAllFromServer();
      
      const all = this.getAllParticipantsData();
      const exists = Object.values(all).some(d => d.sharing_code === normalizedCode);
      
      console.log(`🔍 Validating referral code ${normalizedCode}: ${exists ? 'FOUND' : 'NOT FOUND'}`);
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
    const normalizedCode = userId.toUpperCase().trim(); // ✅ PRIDANÉ
    
    try {
      const userData = await this.loadUserProgress(normalizedCode);
      return userData?.sharing_code || null;
    } catch (error) {
      console.error('Error getting sharing code:', error);
      return null;
    }
  }

  async processReferral(participantCode, referralCode) {
    const normalizedParticipant = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    const normalizedReferral = referralCode.toUpperCase().trim(); // ✅ PRIDANÉ
    
    try {
      console.log(`🎁 Processing referral: ${normalizedParticipant} → ${normalizedReferral}`);
      
      await this.syncAllFromServer();
      const all = this.getAllParticipantsData();
      
      const isValid = await this.validateReferralCode(normalizedReferral);
      if (!isValid) {
        console.warn(`⚠️ Referral kód ${normalizedReferral} neexistuje v systéme`);
        throw new Error('Tento referral kód neexistuje v systéme');
      }
      
      const entry = Object.entries(all).find(([_, d]) => 
        d.sharing_code === normalizedReferral
      );
      
      if (!entry) {
        console.warn(`⚠️ Referral kód ${normalizedReferral} nenájdený (unexpected)`);
        throw new Error('Neplatný referral kód');
      }
      
      const [refCode, refData] = entry;
      console.log(`✅ Referral kód patrí používateľovi: ${refCode}`);
      
      const newUserData = await this.loadUserProgress(normalizedParticipant);
      
      if (newUserData?.used_referral_code) {
        console.warn(`⚠️ ${normalizedParticipant} už použil referral kód: ${newUserData.used_referral_code}`);
        throw new Error('Už ste použili referral kód. Môžete ho použiť iba raz.');
      }
      
      if (refCode === normalizedParticipant) {
        console.warn(`⚠️ ${normalizedParticipant} sa pokúsil použiť svoj vlastný referral kód`);
        throw new Error('Nemôžete použiť svoj vlastný zdieľací kód!');
      }
      
      refData.referred_users = refData.referred_users || [];
      if (refData.referred_users.includes(normalizedParticipant)) {
        console.warn(`⚠️ ${normalizedParticipant} už bol pridaný do referred_users pre ${refCode}`);
        throw new Error('Tento referral už bol spracovaný');
      }
      
      refData.referrals_count = (refData.referrals_count || 0) + 1;
      refData.referred_users.push(normalizedParticipant);
      
      const missionPoints = refData.user_stats_mission_points || 0;
      const bonusPoints = refData.referrals_count * 10;
      refData.user_stats_points = missionPoints + bonusPoints;
      
      newUserData.used_referral_code = normalizedReferral;
      newUserData.referred_by = refCode;
      newUserData.referral_code = normalizedReferral;
      
      await this.saveProgress(refCode, refData);
      await this.saveProgress(normalizedParticipant, newUserData);
      
      console.log(`✅ Referral spracovaný úspešne!`);
      console.log(`   - ${refCode}: ${refData.referrals_count} referralov, +${bonusPoints} bodov`);
      console.log(`   - ${normalizedParticipant}: označený ako použil referral`);
      
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

  // V tvojom DataManager pridaj tieto metódy:

  /**
   * Odomkne konkrétnu misiu pre jedného respondenta
   */
  async unlockMissionForUser(participantCode, missionId) {
    try {
      const response = await fetch('/api/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: participantCode,
          [`mission${missionId}_unlocked`]: true
        })
      });
      
      if (!response.ok) throw new Error('Failed to unlock mission');
      
      // Aktualizuj aj lokálne dáta
      const central = this.getAllParticipantsData();
      if (central[participantCode]) {
        central[participantCode][`mission${missionId}_unlocked`] = true;
        localStorage.setItem(this.centralStorageKey, JSON.stringify(central));
      }
      
      return true;
    } catch (error) {
      console.error('Error unlocking mission:', error);
      throw error;
    }
  }

  /**
   * Zamkne konkrétnu misiu pre jedného respondenta
   */
  async lockMissionForUser(participantCode, missionId) {
    try {
      const response = await fetch('/api/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: participantCode,
          [`mission${missionId}_unlocked`]: false
        })
      });
      
      if (!response.ok) throw new Error('Failed to lock mission');
      
      // Aktualizuj aj lokálne dáta
      const central = this.getAllParticipantsData();
      if (central[participantCode]) {
        central[participantCode][`mission${missionId}_unlocked`] = false;
        localStorage.setItem(this.centralStorageKey, JSON.stringify(central));
      }
      
      return true;
    } catch (error) {
      console.error('Error locking mission:', error);
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
    
    // ✅ KRITICKÁ NORMALIZÁCIA - hneď na začiatku
    const normalizedCode = participantCode.toUpperCase().trim();
    
    if (!forceServerFetch && this.cache.has(normalizedCode)) {
      console.log(`📦 Používam cache pre ${normalizedCode}`);
      return this.cache.get(normalizedCode);
    }

    try {
      console.log(`📡 Načítavam ${normalizedCode} zo servera...`);
      const resp = await fetch(`${this.apiBase}?code=${normalizedCode}`);

      if (!resp.ok) {
        if (resp.status === 404) {
          console.log(`🆕 Používateľ ${normalizedCode} neexistuje na serveri`);
          console.log(`   Backend ho automaticky vytvorí...`);
          
          await new Promise(resolve => setTimeout(resolve, 100));
          const retryResp = await fetch(`${this.apiBase}?code=${normalizedCode}`);
          
          if (retryResp.ok) {
            const data = await retryResp.json();
            console.log(`✅ Backend vytvoril ${normalizedCode}:`, {
              blocked: data.blocked,
              m0: data.mission0_unlocked,
              m1: data.mission1_unlocked,
              m2: data.mission2_unlocked,
              m3: data.mission3_unlocked
            });
            const prog = await this.validateAndFixData(data, normalizedCode);
            this._cacheAndStore(normalizedCode, prog);
            return prog;
          }
          
          console.warn('⚠️ Retry zlyhal, vytváram lokálne');
          const rec = await this.createNewUserRecord(normalizedCode);
          await this.syncToServer(normalizedCode, rec);
          return rec;
        }
        console.warn(`Server error ${resp.status}: ${resp.statusText}`);
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      
      console.log(`📥 Dáta zo servera pre ${normalizedCode}:`, {
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
        const rec = await this.createNewUserRecord(normalizedCode);
        await this.syncToServer(normalizedCode, rec);
        return rec;
      }

      const prog = await this.validateAndFixData(data.progress || data, normalizedCode);
      this._cacheAndStore(normalizedCode, prog);
      return prog;
      
    } catch (error) {
      console.warn('⚠️ Server nedostupný, používam localStorage:', error.message);
      
      const saved = localStorage.getItem(`fullProgress_${normalizedCode}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          console.log(`📦 Načítaný zo localStorage: ${normalizedCode}`);
          const prog = await this.validateAndFixData(data, normalizedCode);
          this.cache.set(normalizedCode, prog);
          
          this.syncToServer(normalizedCode, prog).catch(e =>
            console.warn('Background sync failed:', e)
          );
          return prog;
        } catch (e) {
          console.error('localStorage data corrupted:', e);
        }
      }

      const central = this.getAllParticipantsData();
      if (central[normalizedCode]) {
        const prog = await this.validateAndFixData(central[normalizedCode], normalizedCode);
        this._cacheAndStore(normalizedCode, prog);
        return prog;
      }

      console.log(`🆕 Lokálne vytváram nového používateľa ${normalizedCode}`);
      const rec = await this.createNewUserRecord(normalizedCode);
      await this.syncToServer(normalizedCode, rec);
      return rec;
    }
  }

  async syncToServer(participantCode, data) {
    const normalizedCode = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    
    try {
      const resp = await fetch(`${this.apiBase}?code=${normalizedCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!resp.ok) {
        console.warn(`Sync failed for ${normalizedCode}: HTTP ${resp.status}`);
        return false;
      }

      console.log(`✅ Synced ${normalizedCode} - blocked: ${data.blocked}`);
      return true;
    } catch (error) {
      console.warn('Sync na server zlyhal:', error.message);
      return false;
    }
  }

  async validateAndFixData(data, participantCode) {
    const normalizedCode = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    data.participant_code = normalizedCode; // ✅ Vždy UPPERCASE
    
    // Vygeneruj unikátny sharing code
    if (!data.sharing_code) {
      data.sharing_code = await this.generateUniqueSharingCode(normalizedCode);
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
    
    console.log(`🔍 ValidateAndFixData pre ${normalizedCode}:`, {
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
      informed_consent_given: false,
      informed_consent_timestamp: null,
      competition_consent_given: false,
      competition_consent_timestamp: null,
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
    const normalizedCode = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    console.log(`🆕 Vytváram nového používateľa ${normalizedCode} (lokálne)...`);
    
    const defaults = this.getDefaultFields();
    const rec = {
      participant_code: normalizedCode, // ✅ UPPERCASE
      group_assignment: Math.random() < 0.33 ? '0' : Math.random() < 0.66 ? '1' : '2',
      sharing_code: await this.generateUniqueSharingCode(normalizedCode),
      referral_code: sessionStorage.getItem('referralCode') || null,
      ...defaults
    };
    
    this._cacheAndStore(normalizedCode, rec);
    
    console.log(`✅ Lokálne vytvorený používateľ ${normalizedCode} so sharing code ${rec.sharing_code}`);
    return rec;
  }

  // Generuje unikátny sharing code s kontrolou duplicity
  async generateUniqueSharingCode(participantCode) {
    const normalizedCode = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      const code = this.generatePersistentSharingCode(normalizedCode, attempts);
      
      const allData = this.getAllParticipantsData();
      const codeExists = Object.values(allData).some(userData => 
        userData.sharing_code === code
      );
      
      if (!codeExists) {
        console.log(`✅ Vygenerovaný unikátny sharing code pre ${normalizedCode}: ${code}`);
        return code;
      }
      
      console.warn(`⚠️ Duplicita! Sharing code ${code} už existuje, pokus ${attempts + 1}/${maxAttempts}`);
      attempts++;
    }
    
    const fallbackCode = this.generatePersistentSharingCode(
      normalizedCode + Date.now(), 
      Math.random() * 1000
    );
    console.warn(`⚠️ Použitý fallback sharing code: ${fallbackCode}`);
    return fallbackCode;
  }

  generatePersistentSharingCode(participantCode, seedVariation = 0) {
    const normalizedCode = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let hash = this.hashCode(normalizedCode + 'SALT2025' + seedVariation);
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
    const normalizedCode = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    
    const prog =
      this.cache.get(normalizedCode) ||
      JSON.parse(localStorage.getItem(`fullProgress_${normalizedCode}`) || '{}');
    return prog.sharing_code || null;
  }

  async saveProgress(participantCode, data) {
    const normalizedCode = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    
    console.log(`💾 Ukladám progress pre ${normalizedCode}:`, {
      blocked: data.blocked,
      competition_email: data.competition_email ? '✓' : '✗',
      m0: data.mission0_unlocked,
      m1: data.mission1_unlocked,
      m2: data.mission2_unlocked,
      m3: data.mission3_unlocked
    });
    
    data.participant_code = normalizedCode; // ✅ Zabezpeč UPPERCASE v data
    data.timestamp_last_update = new Date().toISOString();
    this.cache.set(normalizedCode, data);
    localStorage.setItem(`fullProgress_${normalizedCode}`, JSON.stringify(data));
    this.saveToCentralStorage(normalizedCode, data);
    await this.syncToServer(normalizedCode, data);
  }

  async loadComponentData(participantCode, componentKey) {
    if (!participantCode) return {};
    const normalizedCode = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    const prog = await this.loadUserProgress(normalizedCode);
    return prog ? prog[`${componentKey}_data`] || {} : {};
  }

  async saveComponentData(participantCode, componentKey, data) {
    if (!participantCode) return;
    const normalizedCode = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    const prog = await this.loadUserProgress(normalizedCode);
    prog[`${componentKey}_data`] = data;
    await this.saveProgress(normalizedCode, prog);
  }

  saveToCentralStorage(participantCode, data) {
    const normalizedCode = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    const all = this.getAllParticipantsData();
    all[normalizedCode] = data;
    localStorage.setItem(this.centralStorageKey, JSON.stringify(all));
    if (this.allParticipantsCache) {
      this.allParticipantsCache[normalizedCode] = data;
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
    const normalizedCode = code.toUpperCase().trim(); // ✅ PRIDANÉ
    return normalizedCode === this.adminUserId;
  }

  _cacheAndStore(participantCode, data) {
    const normalizedCode = participantCode.toUpperCase().trim(); // ✅ PRIDANÉ
    this.cache.set(normalizedCode, data);
    localStorage.setItem(`fullProgress_${normalizedCode}`, JSON.stringify(data));
    this.saveToCentralStorage(normalizedCode, data);
  }
}

const dataManager = new DataManager();
export default dataManager;
