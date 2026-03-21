// src/hooks/useInterventionTracking.js

import { useRef, useEffect, useCallback } from 'react';

export const useInterventionTracking = ({ userId, currentPage }) => {
  const containerRef      = useRef(null);
  const landmarkRefs      = useRef({});
  const mousePositionsRef = useRef([]);
  const trackingStartRef  = useRef(Date.now());
  const lastMoveRef       = useRef(0);

  useEffect(() => {
    mousePositionsRef.current = [];
    trackingStartRef.current  = Date.now();

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastMoveRef.current < 32) return;
      lastMoveRef.current = now;

      const rect = container.getBoundingClientRect();

      // ✅ FIX 1: window.scrollY namiesto container.scrollTop
      // Card scrolluje cez window, nie cez seba
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top + window.scrollY;

      mousePositionsRef.current.push({ x, y, timestamp: now });
    };

    // ✅ Počúvaj na window — zachytí pohyb aj keď myš nie je priamo nad containerom
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [currentPage]);

  const setLandmark = useCallback((id) => (el) => {
    landmarkRefs.current[id] = el;
  }, []);

  const saveTracking = useCallback(async (contentId) => {
    if (mousePositionsRef.current.length === 0 || !containerRef.current) return;

    const container  = containerRef.current;
    const cardWidth  = container.offsetWidth;
    const cardHeight = container.scrollHeight; // ✅ celá výška vrátane scrollovaného obsahu

    const normalizedPositions = mousePositionsRef.current
      .filter(pos => {
        // ✅ FIX: Vyfiltruj pozície mimo kontajner (x aj y)
        return pos.x >= 0 && pos.x <= cardWidth
            && pos.y >= 0 && pos.y <= cardHeight; // ✅ pridané y <= cardHeight
      })
      .map(pos => ({
        x: Math.max(0, Math.min(100, Number(((pos.x / cardWidth)  * 100).toFixed(4)))),
        y: Math.max(0, Math.min(100, Number(((pos.y / cardHeight) * 100).toFixed(4)))), // ✅ pridané Math.min(100,...)
        timestamp: pos.timestamp,
      }));

    // ✅ FIX 2: Landmarks — vypočítaj offsetTop relatívne k containerRef.current
    // (nie cez getBoundingClientRect ktorý závisí od scroll pozície)
    const containerTop  = container.getBoundingClientRect().top  + window.scrollY;
    const containerLeft = container.getBoundingClientRect().left;

    const landmarks = Object.entries(landmarkRefs.current)
      .filter(([_, el]) => el)
      .map(([id, el]) => {
        const elTop  = el.getBoundingClientRect().top  + window.scrollY;
        const elLeft = el.getBoundingClientRect().left;

        return {
          id,
          type: 'section',
          position: {
            left:   Math.max(0, Number(((elLeft - containerLeft)   / cardWidth  * 100).toFixed(4))),
            top:    Math.max(0, Number(((elTop  - containerTop)    / cardHeight * 100).toFixed(4))),
            width:  Number((el.offsetWidth  / cardWidth  * 100).toFixed(4)),
            height: Number((el.offsetHeight / cardHeight * 100).toFixed(4)),
          },
        };
      });

    await fetch('/api/save-tracking', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        contentId,
        contentType: 'intervention',
        mousePositions: normalizedPositions,
        landmarks,
        containerDimensions: {
          originalWidth:  cardWidth,
          originalHeight: cardHeight,
          storageFormat:  'percent',
        },
        timeSpent: Math.floor((Date.now() - trackingStartRef.current) / 1000),
      }),
    }).catch(err => console.warn('⚠️ Tracking save failed:', err));
  }, [userId]);

  return { containerRef, setLandmark, saveTracking };
};
