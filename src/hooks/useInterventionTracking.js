import { useRef, useEffect, useCallback } from 'react';

export const useInterventionTracking = ({ userId, currentPage }) => {
  const containerRef      = useRef(null);
  const landmarkRefs      = useRef({});
  const mousePositionsRef = useRef([]);
  const trackingStartRef  = useRef(Date.now());
  const lastMoveRef       = useRef(0); // throttle

  useEffect(() => {
    mousePositionsRef.current = [];
    trackingStartRef.current  = Date.now();

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastMoveRef.current < 32) return; // ~30fps throttle
      lastMoveRef.current = now;

      const rect = container.getBoundingClientRect();
      mousePositionsRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top + container.scrollTop,
        timestamp: now,
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

    const normalizedPositions = mousePositionsRef.current.map(pos => ({
      // ✅ clamp: x vždy 0–100, y môže byť >100 pri dlhých stránkach
      x: Math.max(0, Math.min(100, Number(((pos.x / cardWidth)  * 100).toFixed(4)))),
      y: Math.max(0,              Number(((pos.y / cardHeight) * 100).toFixed(4))),
      timestamp: pos.timestamp,
    }));

    // ✅ Landmarks: zachytávaj voči scrollHeight, nie voči viewportu
    const contRect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;
    const landmarks = Object.entries(landmarkRefs.current)
      .filter(([_, el]) => el)
      .map(([id, el]) => {
        const r = el.getBoundingClientRect();
        return {
          id,
          type: 'section',
          position: {
            left:   Math.max(0, Number(((r.left - contRect.left)                      / cardWidth  * 100).toFixed(4))),
            top:    Math.max(0, Number(((r.top  - contRect.top  + scrollTop)          / cardHeight * 100).toFixed(4))),
            width:  Number((r.width  / cardWidth  * 100).toFixed(4)),
            height: Number((r.height / cardHeight * 100).toFixed(4)),
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
