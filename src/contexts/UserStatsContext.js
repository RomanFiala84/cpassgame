// src/contexts/UserStatsContext.js
// FINÁLNA VERZIA - Optimalizovaný refresh a zabezpečenie proti reset bodov

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
    referrals: 0
  });

  const intervalRef = useRef(null);
  const isLoadingRef = useRef(false);
  const lastLoadedUserIdRef = useRef(null); // ✅ NOVÉ - sledovanie posledného načítaného userId

  const login = useCallback(async (id) => {
    sessionStorage.setItem('participantCode', id);
    setUserId(id);
    const progress = await dataManager.loadUserProgress(id);
    progress.instruction_completed = true;
    progress.current_progress_step = 'intro';
    await dataManager.saveProgress(id, progress);
  }, [dataManager]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('participantCode');
    setUserId(null);
    lastLoadedUserIdRef.current = null; // ✅ RESET
    setUserStats({
      level: 1,
      points: 0,
      missionPoints: 0,
      bonusPoints: 0,
      totalPoints: 0,
      completedMissions: [],
      referrals: 0
    });
  }, []);

  useEffect(() => {
    const updateUserId = () => {
      const currentId = sessionStorage.getItem('participantCode');

      if (currentId && !['0', '1', '2'].includes(currentId) && currentId !== userId) {
        console.log('📊 UserStats userId zmena:', userId, '->', currentId);
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

  const loadUserStats = useCallback(async () => {
    if (!userId || isLoadingRef.current) return;

    isLoadingRef.current = true;

    try {
      console.log(`📊 Načítavam stats pre: ${userId}`);

      const progress = await dataManager.loadUserProgress(userId);
      if (progress) {
        const missionPoints = progress.user_stats_mission_points || 0;
        const bonusPoints = (progress.referrals_count || 0) * 10;
        const totalPoints = missionPoints + bonusPoints;
        
        const level = Math.min(Math.floor(missionPoints / 25) + 1, 5);

        const updatedStats = {
          level: level,
          points: totalPoints, // ✅ ZMENENÉ - synchronizované s totalPoints
          missionPoints: missionPoints,
          bonusPoints: bonusPoints,
          totalPoints: totalPoints,
          referrals: progress.referrals_count || 0,
          completedMissions: Array.isArray(progress.completedMissions) ? progress.completedMissions : []
        };

        // ✅ NOVÉ - Aktualizuj len ak sa userId zmenil alebo je to prvé načítanie
        if (lastLoadedUserIdRef.current !== userId || userStats.totalPoints === 0) {
          setUserStats(updatedStats);
          lastLoadedUserIdRef.current = userId;
          console.log(`✅ Stats načítané pre ${userId}:`, updatedStats);
        } else {
          // ✅ Tichý update - len ak sa body zmenili
          if (userStats.totalPoints !== totalPoints) {
            setUserStats(updatedStats);
            console.log(`✅ Stats aktualizované pre ${userId}:`, updatedStats);
          }
        }
      }
    } catch (error) {
      console.error('❌ Chyba pri načítaní stats:', error);
      // ✅ NOVÉ - Nereset stats pri chybe, ponechaj existujúce
      if (userStats.totalPoints === 0) {
        setUserStats({
          level: 1,
          points: 0,
          missionPoints: 0,
          bonusPoints: 0,
          totalPoints: 0,
          completedMissions: [],
          referrals: 0
        });
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, [userId, dataManager, userStats.totalPoints]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === dataManager.centralStorageKey) {
        loadUserStats();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [dataManager.centralStorageKey, loadUserStats]);

  // ✅ VYLEPŠENÉ - Načítaj stats len pri zmene userId
  useEffect(() => {
    if (!userId || isLoadingRef.current) return;

    // ✅ Ak je to nový userId, clear cache
    if (lastLoadedUserIdRef.current !== userId) {
      dataManager.cache.clear();
      loadUserStats();
    }

    const interval = setInterval(() => {
      loadUserStats();
    }, 10000); // ✅ ZMENENÉ - Interval každých 10s namiesto 5s

    return () => clearInterval(interval);
  }, [userId, loadUserStats, dataManager]);

  useEffect(() => {
    if (userId && !isLoadingRef.current && lastLoadedUserIdRef.current !== userId) {
      loadUserStats();
    }
  }, [loadUserStats, userId]);

  const addMissionPoints = useCallback(async (missionId) => {
    if (!userId) {
      console.warn('❌ Nie je userId pre pridanie bodov za misiu');
      return false;
    }

    console.log(`🎯 Pridávam 25 bodov za misiu: ${missionId} pre: ${userId}`);

    try {
      const progress = await dataManager.loadUserProgress(userId);

      if (progress.completedMissions && progress.completedMissions.includes(missionId)) {
        console.log(`⚠️ Misia ${missionId} už bola dokončená pre ${userId}`);
        return false;
      }

      const currentMissionPoints = progress.user_stats_mission_points || 0;
      const newMissionPoints = Math.min(currentMissionPoints + 25, 100);
      
      const newLevel = Math.min(Math.floor(newMissionPoints / 25) + 1, 5);
      
      const newCompletedMissions = [...(progress.completedMissions || []), missionId];

      const bonusPoints = (progress.referrals_count || 0) * 10;
      const totalPoints = newMissionPoints + bonusPoints;

      const newStats = {
        level: newLevel,
        points: totalPoints, // ✅ SYNCHRONIZOVANÉ
        missionPoints: newMissionPoints,
        bonusPoints: bonusPoints,
        totalPoints: totalPoints,
        completedMissions: newCompletedMissions,
        referrals: progress.referrals_count || 0
      };

      const updatedProgress = {
        ...progress,
        user_stats_mission_points: newMissionPoints,
        user_stats_level: newLevel,
        user_stats_points: totalPoints, // ✅ PRIDANÉ - synchronizuj aj staré pole
        completedMissions: newCompletedMissions,
        [`${missionId}_completed`]: true
      };

      await dataManager.saveProgress(userId, updatedProgress);
      setUserStats(newStats);

      console.log(`✅ Nové stats po misii ${missionId} pre ${userId}:`, newStats);
      return true;
    } catch (error) {
      console.error('❌ Chyba pri pridávaní bodov za misiu:', error);
      return false;
    }
  }, [userId, dataManager]);

  const addReferralPoints = useCallback(async () => {
    if (!userId) {
      console.warn('❌ Nie je userId pre pridanie referral bodov');
      return false;
    }

    console.log(`🎁 Pridávam 10 bodov za použitie referral kódu pre: ${userId}`);

    try {
      const progress = await dataManager.loadUserProgress(userId);

      const newReferralsCount = (progress.referrals_count || 0) + 1;
      const bonusPoints = newReferralsCount * 10;

      const missionPoints = progress.user_stats_mission_points || 0;
      const totalPoints = missionPoints + bonusPoints;
      const level = Math.min(Math.floor(missionPoints / 25) + 1, 5);

      const newStats = {
        level: level,
        points: totalPoints, // ✅ SYNCHRONIZOVANÉ
        missionPoints: missionPoints,
        bonusPoints: bonusPoints,
        totalPoints: totalPoints,
        completedMissions: progress.completedMissions || [],
        referrals: newReferralsCount
      };

      const updatedProgress = {
        ...progress,
        referrals_count: newReferralsCount,
        user_stats_points: totalPoints // ✅ PRIDANÉ
      };

      await dataManager.saveProgress(userId, updatedProgress);
      setUserStats(newStats);

      console.log(`✅ Nové stats po referral pre ${userId}:`, newStats);
      return true;
    } catch (error) {
      console.error('❌ Chyba pri pridávaní referral bodov:', error);
      return false;
    }
  }, [userId, dataManager]);

  const addPoints = useCallback(async (amount, sectionId) => {
    console.warn('⚠️ addPoints je deprecated - používaj addMissionPoints alebo addReferralPoints');
    
    if (sectionId && sectionId.includes('mission')) {
      return await addMissionPoints(sectionId);
    }
    
    return false;
  }, [addMissionPoints]);

  const refreshUserStats = useCallback(async () => {
    if (userId) {
      console.log('🔄 Manuálny refresh stats pre:', userId);
      await loadUserStats();
    }
  }, [userId, loadUserStats]);

  const clearAllData = useCallback(() => {
    dataManager.clearAllData();
    lastLoadedUserIdRef.current = null; // ✅ RESET
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
    throw new Error('useUserStats musí byť použité v UserStatsProvider');
  }
  return context;
};

export default UserStatsContext;
