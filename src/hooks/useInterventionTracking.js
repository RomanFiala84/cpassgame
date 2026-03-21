// src/hooks/useInterventionTracking.js
import { useRef, useEffect, useCallback } from 'react';

export const useInterventionTracking = ({ userId, currentPage }) => {
  const containerRef     = useRef(null);
  const landmarkRefs     = useRef({});
  const mousePositionsRef = useRef([]);
  const trackingStartRef  = useRef(Date.now());

  // Reset pri každej zmene stránky
  useEffect(() => {
    mousePositionsRef.current  = [];
    trackingStartRef.current   = Date.now();

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mousePositionsRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top + window.scrollY, // ← scroll kompenzácia
        timestamp: Date.now(),
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [currentPage]);

  // Pomocná funkcia — registruj landmark
  const setLandmark = useCallback((id) => (el) => {
    landmarkRefs.current[id] = el;
  }, []);

  // Uloženie trackingu
  const saveTracking = useCallback(async (contentId) => {
    if (mousePositionsRef.current.length === 0 || !containerRef.current) return;

    const container  = containerRef.current;
    const cardWidth  = container.offsetWidth;
    const cardHeight = container.scrollHeight;

    // Normalizácia 0.0–1.0
    const normalizedPositions = mousePositionsRef.current.map(pos => ({
      x: pos.x / cardWidth,
      y: pos.y / cardHeight,
      timestamp: pos.timestamp,
    }));

    // Landmarks — pozície sekcií normalizované 0.0–1.0
    const contRect = container.getBoundingClientRect();
    const landmarks = Object.entries(landmarkRefs.current)
      .filter(([_, el]) => el)
      .map(([id, el]) => {
        const r = el.getBoundingClientRect();
        return {
          id,
          type: 'section',
          position: {
            left:   (r.left   - contRect.left)               / cardWidth,
            top:    (r.top    - contRect.top  + window.scrollY) / cardHeight,
            width:  r.width   / cardWidth,
            height: r.height  / cardHeight,
          },
        };
      });

    await fetch('/api/save-tracking', {
      method: 'POST',
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
          storageFormat:  'percent', // 0.0–1.0
        },
        timeSpent: Math.floor((Date.now() - trackingStartRef.current) / 1000),
      }),
    }).catch(err => console.warn('⚠️ Tracking save failed:', err));
  }, [userId]);

  return { containerRef, setLandmark, saveTracking };
};
