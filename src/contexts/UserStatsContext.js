// src/contexts/UserStatsContext.js
// ✅ FINÁLNY BODOVÝ SYSTÉM:
// - Mission 0 (Predvýskum): 50 bodov
// - Mission 1 (Hlavný výskum 1): 25 bodov
// - Mission 2 (Hlavný výskum 2): 25 bodov
// - Mission 3 (Hlavný výskum 3): 25 bodov
// - Referral: 10 bodov za každého nového účastníka
// - Minimálne na žrebovanie: 50 bodov

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import DataManager from '../utils/DataManager';

const UserStatsContext = createContext();

export const UserStatsProvider = ({ children }) => {
  const [dataManager] = useState(DataManager);
  const [userId, setUserId] = useState(null);
  const [userStats, setUserStats] = useState({
    level: 1,
    points: 0,
    missionPoints: 0,
    bonusPoints: 0,
    totalPoints: 0,
    completedMissions: [],
    referrals: 0,
    eligibleForRaffle: false
  });

  const intervalRef = useRef(null);
  const autoRefreshIntervalRef = useRef(null);
  const isLoadingRef = useRef(false);
  const lastLoadedUserIdRef = useRef(null);

  // ✅ PO - Bezpečné spracovanie null
  const login = useCallback(async (id) => {
  try {
    console.log(`🔐 Login attempt for: ${id}`);
    
    const userData = await dataManager.loadUserProgress(id, true);
    
    if (!userData) {
      console.error(`❌ Login failed: Nepodarilo sa načítať používateľa ${id}`);
      return { 
        success: false, 
        blocked: false, 
        error: 'Nepodarilo sa načítať používateľa. Skúste to znova.' 
      };
    }
    
    if (userData.blocked) {
      console.log(`❌ Login zamietnutý: Účastník ${id} je blokovaný`);
      sessionStorage.removeItem('participantCode');
      return { 
        success: false, 
        blocked: true, 
        message: 'Účet je blokovaný administrátorom' 
      };
    }
    
    sessionStorage.setItem('participantCode', id);
    
    // ✅✅✅ PRIDAJ TENTO RIADOK - nastav userId okamžite ✅✅✅
    setUserId(id);
    
    userData.instruction_completed = true;
    userData.current_progress_step = 'intro';
    
    const saved = await dataManager.saveProgress(id, userData);
    if (!saved) {
      console.warn('⚠️ Progress not saved to server, but login successful');
    }
    
    console.log(`✅ Login successful for: ${id}`);
    return { success: true, blocked: false };
    
  } catch (error) {
    console.error('❌ Login error:', error);
    return { 
      success: false, 
      blocked: false, 
      error: error.message || 'Neočakávaná chyba pri prihlásení' 
    };
  }
}, [dataManager]);


  // ✅ PO - Vyčistí VŠETKY intervaly a listenery
  const logout = useCallback(() => {
    console.log('🚪 Logging out and cleaning up resources...');
    
    // Vyčisti sessionStorage
    sessionStorage.removeItem('participantCode');
    
    // Resetuj state
    setUserId(null);
    lastLoadedUserIdRef.current = null;
    
    // ✅ Vyčisti auto-refresh interval
    if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef.current);
      autoRefreshIntervalRef.current = null;
      console.log('✅ Auto-refresh interval cleared');
    }
    
    // ✅ Vyčisti polling interval z useEffect (riadok 108)
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('✅ Polling interval cleared');
    }
    
    // Resetuj loading flag
    isLoadingRef.current = false;
    
    // Resetuj stats
    setUserStats({
      level: 1,
      points: 0,
      missionPoints: 0,
      bonusPoints: 0,
      totalPoints: 0,
      completedMissions: [],
      referrals: 0,
      eligibleForRaffle: false
    });
    
    console.log('✅ Logout complete');
  }, []);


  useEffect(() => {
    const updateUserId = () => {
      const currentId = sessionStorage.getItem('participantCode');

      if (currentId && !['0', '1', '2'].includes(currentId) && currentId !== userId) {
        console.log('📊 UserStats userId change:', userId, '->', currentId);
        setUserId(currentId);
      } else if (!currentId && userId) {
        console.log('📊 UserStats userId reset');
        logout();
      }
    };

    updateUserId();
    intervalRef.current = setInterval(updateUserId, 5000);

    window.addEventListener('storage', updateUserId);
    window.addEventListener('focus', updateUserId);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('storage', updateUserId);
      window.removeEventListener('focus', updateUserId);
    };
  }, [userId, logout]);

  // ✅ FINÁLNA FUNKCIA - Výpočet bodov
  const calculatePoints = (progress) => {
    let missionPoints = 0;
    const completedMissions = progress.completedMissions || [];

    // ✅ Mission 0 (Predvýskum) = 50 bodov
    if (completedMissions.includes('mission0')) {
      missionPoints += 50;
    }

    // ✅ Mission 1 = 25 bodov
    if (completedMissions.includes('mission1')) {
      missionPoints += 25;
    }

    // ✅ Mission 2 = 25 bodov
    if (completedMissions.includes('mission2')) {
      missionPoints += 25;
    }

    // ✅ Mission 3 = 25 bodov
    if (completedMissions.includes('mission3')) {
      missionPoints += 25;
    }

    // ✅ Bonus body za referraly (10 bodov/referral)
    const bonusPoints = (progress.referrals_count || 0) * 10;
    
    const totalPoints = missionPoints + bonusPoints;

    // ✅ Level (každých 25 bodov = 1 level, max 5)
    const level = Math.min(Math.floor(totalPoints / 25) + 1);
    
    const mainMissions = ['mission1', 'mission2', 'mission3'];
    const completedMainMissions = mainMissions.filter(m => completedMissions.includes(m)).length;
    const progressPercent = (completedMainMissions / 3) * 100; // 33.33% za každú

    // ✅ Bonusový progress za Mission 0 (25% extra)
    const hasMission0 = completedMissions.includes('mission0');
    const totalProgressPercent = progressPercent + (hasMission0 ? 25 : 0);

    // ✅ Oprávnenie na žrebovanie (min 50 bodov)
    const eligibleForRaffle = totalPoints >= 50;

    return {
      level,
      points: totalPoints,
      missionPoints,
      bonusPoints,
      totalPoints,
      eligibleForRaffle,
      completedMissions,
      referrals: progress.referrals_count || 0,
      progressPercent: totalProgressPercent  // ⬅️ Môže byť 0-125%
    };
  };

  const loadUserStats = useCallback(async (forceRefresh = false) => {
    if (!userId || isLoadingRef.current) return;

    isLoadingRef.current = true;

    try {
      console.log(`📊 Loading stats for: ${userId}${forceRefresh ? ' (forced)' : ''}`);

      const progress = await dataManager.loadUserProgress(userId, forceRefresh);
      if (progress) {
        const updatedStats = calculatePoints(progress);
        
        setUserStats(updatedStats);
        lastLoadedUserIdRef.current = userId;
        console.log(`✅ Stats loaded for ${userId}:`, updatedStats);
      }
    } catch (error) {
      console.error('❌ Error loading stats:', error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [userId, dataManager]);

  useEffect(() => {
    if (!userId || isLoadingRef.current) return;

    if (lastLoadedUserIdRef.current !== userId) {
      console.log(`🔄 User changed, loading stats for: ${userId}`);
      loadUserStats();
    }

    console.log('⏰ Starting 60s auto-refresh timer for mission unlock detection');
    
    autoRefreshIntervalRef.current = setInterval(async () => {
      if (isLoadingRef.current) {
        console.log('⏭️ Skip refresh - still loading');
        return;
      }
      
      isLoadingRef.current = true;
      try {
        await dataManager.loadUserProgress(userId, true);
        await loadUserStats(true);
      } catch (error) {
        console.error('❌ Auto-refresh error:', error);
      } finally {
        isLoadingRef.current = false;
      }
    }, 60000);


    return () => {
      if (autoRefreshIntervalRef.current) {
        console.log('🛑 Stopping auto-refresh timer');
        clearInterval(autoRefreshIntervalRef.current);
        autoRefreshIntervalRef.current = null;
      }
    };
  }, [userId, loadUserStats, dataManager]);

  useEffect(() => {
    if (userId && !isLoadingRef.current && lastLoadedUserIdRef.current !== userId) {
      loadUserStats();
    }
  }, [loadUserStats, userId]);

  const addMissionPoints = useCallback(async (missionId) => {
    if (!userId) {
      console.warn('❌ No userId for adding mission points');
      return false;
    }

    console.log(`🎯 Adding points for mission: ${missionId} for: ${userId}`);

    try {
      const progress = await dataManager.loadUserProgress(userId);

      if (progress.completedMissions && progress.completedMissions.includes(missionId)) {
        console.log(`⚠️ Mission ${missionId} already completed for ${userId}`);
        return false;
      }

      const newCompletedMissions = [...(progress.completedMissions || []), missionId];

      const updatedProgress = {
        ...progress,
        completedMissions: newCompletedMissions,
        [`${missionId}_completed`]: true
      };

      // ✅ Prepočítaj body s novým systémom
      const newStats = calculatePoints(updatedProgress);

      // ✅ Ulož do progress
      updatedProgress.user_stats_mission_points = newStats.missionPoints;
      updatedProgress.user_stats_level = newStats.level;
      updatedProgress.user_stats_points = newStats.totalPoints;

      await dataManager.saveProgress(userId, updatedProgress);
      setUserStats(newStats);

      console.log(`✅ New stats after mission ${missionId} for ${userId}:`, newStats);
      return true;
    } catch (error) {
      console.error('❌ Error adding mission points:', error);
      return false;
    }
  }, [userId, dataManager]);

  const addReferralPoints = useCallback(async () => {
    if (!userId) {
      console.warn('❌ No userId for adding referral points');
      return false;
    }

    console.log(`🎁 Adding 10 points for referral for: ${userId}`);

    try {
      const progress = await dataManager.loadUserProgress(userId);
      const newReferralsCount = (progress.referrals_count || 0) + 1;

      const updatedProgress = {
        ...progress,
        referrals_count: newReferralsCount
      };

      // ✅ Prepočítaj body s novým systémom
      const newStats = calculatePoints(updatedProgress);

      // ✅ Ulož do progress
      updatedProgress.user_stats_points = newStats.totalPoints;

      await dataManager.saveProgress(userId, updatedProgress);
      setUserStats(newStats);

      console.log(`✅ New stats after referral for ${userId}:`, newStats);
      return true;
    } catch (error) {
      console.error('❌ Error adding referral points:', error);
      return false;
    }
  }, [userId, dataManager]);

  const addPoints = useCallback(async (amount, sectionId) => {
    console.warn('⚠️ addPoints is deprecated - use addMissionPoints or addReferralPoints');
    
    if (sectionId && sectionId.includes('mission')) {
      return await addMissionPoints(sectionId);
    }
    
    return false;
  }, [addMissionPoints]);

  const refreshUserStats = useCallback(async () => {
    if (userId) {
      console.log('🔄 Manual refresh stats for:', userId);
      await dataManager.loadUserProgress(userId, true);
      await loadUserStats(true);
    }
  }, [userId, loadUserStats, dataManager]);

  const clearAllData = useCallback(() => {
    dataManager.clearAllData();
    lastLoadedUserIdRef.current = null;
    
    if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef.current);
      autoRefreshIntervalRef.current = null;
    }
  }, [dataManager]);

  return (
    <UserStatsContext.Provider
      value={{
        userStats,
        addPoints,
        addMissionPoints,
        addReferralPoints,
        refreshUserStats,
        dataManager,
        userId,
        login,
        logout,
        clearAllData
      }}
    >
      {children}
    </UserStatsContext.Provider>
  );
};

export const useUserStats = () => {
  const context = useContext(UserStatsContext);
  if (!context) {
    throw new Error('useUserStats must be used within UserStatsProvider');
  }
  return context;
};

export default UserStatsContext;
