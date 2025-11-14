import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook pre sledovanie hover a mouse movements
 * @param {string} contentId - ID príspevku/intervencie/prevencie
 * @param {string} contentType - 'post', 'intervention', 'prevention'
 * @param {string} userId - ID používateľa (z UserStatsContext)
 */
export const useHoverTracking = (contentId, contentType, userId) => {
  const containerRef = useRef(null);
  const [trackingData, setTrackingData] = useState({
    contentId,
    contentType,
    userId,
    mousePositions: [],
    hoverStartTime: null,
    totalHoverTime: 0,
    isTracking: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    
    // Netrackujeme ak:
    // - container neexistuje
    // - používateľ nie je prihlásený
    if (!container || !userId) return;

    let lastRecordedTime = 0;
    const RECORD_INTERVAL = 200; // Zaznamenať každých 200ms

    // Handler pre vstup myši do oblasti
    const handleMouseEnter = () => {
      setTrackingData(prev => ({
        ...prev,
        hoverStartTime: Date.now(),
        isTracking: true,
        mousePositions: [], // Reset pozícií
      }));
    };

    // Handler pre opustenie myši
    const handleMouseLeave = () => {
      setTrackingData(prev => {
        if (!prev.hoverStartTime) return prev;
        
        const duration = Date.now() - prev.hoverStartTime;
        return {
          ...prev,
          totalHoverTime: prev.totalHoverTime + duration,
          hoverStartTime: null,
          isTracking: false,
        };
      });
    };

    // Handler pre pohyb myši
    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      
      // Throttling - zaznamenať iba každých 200ms
      if (currentTime - lastRecordedTime < RECORD_INTERVAL) {
        return;
      }
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setTrackingData(prev => {
        // Ignorovať ak nie je hover active
        if (!prev.hoverStartTime) return prev;
        
        return {
          ...prev,
          mousePositions: [...prev.mousePositions, {
            x: Math.round(x),
            y: Math.round(y),
            timestamp: currentTime,
            relativeTime: currentTime - prev.hoverStartTime,
          }],
        };
      });
      
      lastRecordedTime = currentTime;
    };

    // Pridať event listeners
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [contentId, contentType, userId]);

  return { containerRef, trackingData };
};
