import { useRef, useEffect, useCallback } from 'react';

export const useInterventionTracking = ({ userId, currentPage }) => {
  const containerRef      = useRef(null);
  const landmarkRefs      = useRef({});
  const mousePositionsRef = useRef([]);
  const trackingStartRef  = useRef(Date.now());

  useEffect(() => {
    mousePositionsRef.current = [];
    trackingStartRef.current  = Date.now();

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mousePositionsRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top + window.scrollY,
        timestamp: Date.now(),
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [currentPage]);

  const setLandmark = useCallback((id) => (el) => {
    landmarkRefs.current[id] = el;
  }, []);

  const saveTracking = useCallback(async (contentId) => {
    if (mousePositionsRef.current.length === 0 || !containerRef.current) return;

    const container  = containerRef.current;
    const cardWidth  = container.offsetWidth;
    const cardHeight = container.scrollHeight;

    // ✅ 0–100 percent
    const normalizedPositions = mousePositionsRef.current.map(pos => ({
      x: Number(((pos.x / cardWidth) * 100).toFixed(4)),
      y: Number(((pos.y / cardHeight) * 100).toFixed(4)),
      timestamp: pos.timestamp,
    }));

    const contRect = container.getBoundingClientRect();
    const landmarks = Object.entries(landmarkRefs.current)
      .filter(([_, el]) => el)
      .map(([id, el]) => {
        const r = el.getBoundingClientRect();
        return {
          id,
          type: 'section',
          position: {
            left:   Number(((r.left - contRect.left) / cardWidth * 100).toFixed(4)),
            top:    Number(((r.top - contRect.top + window.scrollY) / cardHeight * 100).toFixed(4)),
            width:  Number((r.width / cardWidth * 100).toFixed(4)),
            height: Number((r.height / cardHeight * 100).toFixed(4)),
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
          storageFormat:  'percent', // ✅ skutočne 0–100
        },
        timeSpent: Math.floor((Date.now() - trackingStartRef.current) / 1000),
      }),
    }).catch(err => console.warn('⚠️ Tracking save failed:', err));
  }, [userId]);

  return { containerRef, setLandmark, saveTracking };
};
