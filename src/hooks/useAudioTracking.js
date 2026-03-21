// src/hooks/useAudioTracking.js

import { useState, useCallback, useRef } from 'react';

/**
 * useAudioTracking
 *
 * Sleduje ktoré nahrávky respondent prehrával a ukladá do ResponseManager.
 *
 * Params:
 *   userId          {string}
 *   componentId     {string}   napr. 'mission2_intervention_a'
 *   responseManager {object}
 *   requiredAudios  {string[]} zoznam audioId ktoré sú povinné pre aktuálnu stránku
 *   initialPlayed   {object}   { [audioId]: true } — načítané zo servera
 */
const useAudioTracking = ({
  userId,
  componentId,
  responseManager,
  requiredAudios = [],
  initialPlayed  = {},
}) => {
  const [playedAudios, setPlayedAudios] = useState(() => ({ ...initialPlayed }));
  const savingRef = useRef(false);

  // Zavolá sa z SectionAudioPlayer keď respondent dosiahne prah
  const markAudioPlayed = useCallback(async (audioId) => {
    if (!audioId) return;

    // Aktualizuj lokálny stav
    setPlayedAudios(prev => {
      if (prev[audioId]) return prev; // už evidovaný
      return { ...prev, [audioId]: true };
    });

    // Ulož do DB (debounced — nečakáme na predchádzajúci save)
    if (savingRef.current) return;
    savingRef.current = true;
    try {
      await responseManager.saveAnswer(
        userId,
        componentId,
        'audio_played',
        audioId,
        { timestamp: new Date().toISOString() }
      );
    } catch (e) {
      console.warn('[useAudioTracking] save failed:', e);
    } finally {
      savingRef.current = false;
    }
  }, [userId, componentId, responseManager]);

  // Či sú všetky povinné nahrávky prehrané
  const allRequiredPlayed = requiredAudios.every(id => playedAudios[id]);

  return { playedAudios, markAudioPlayed, allRequiredPlayed };
};

export default useAudioTracking;
