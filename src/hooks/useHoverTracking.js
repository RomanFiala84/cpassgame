// src/hooks/useHoverTracking.js
// OPTIMALIZOVANÁ VERZIA - Throttling + Memory management

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Detekuje či je mobile zariadenie
 */
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Custom hook pre sledovanie hover a mouse movements
 * ✅ Optimalizovaný s throttlingom a memory managementom
 */
export const useHoverTracking = (contentId, contentType, userId) => {
  const containerRef = useRef(null);
  const positionsRef = useRef([]);
  const hoverStartTimeRef = useRef(null);
  const totalHoverTimeRef = useRef(0);
  const containerDimensionsRef = useRef(null);
  const lastRecordedTimeRef = useRef(0);
  
  const [trackingData, setTrackingData] = useState({
    contentId,
    contentType,
    userId,
    mousePositions: [],
    hoverStartTime: null,
    totalHoverTime: 0,
    isTracking: false,
    isMobile: isMobileDevice(),
    containerDimensions: null,
  });

  // ✅ OPTIMALIZÁCIA - Adaptive sampling rate
  const getRecordInterval = useCallback((positionsCount) => {
    // Zvýš interval ak máme veľa bodov pre úsporu pamäte
    if (positionsCount > 10000) return 50; // 20 FPS
    if (positionsCount > 5000) return 33;  // 30 FPS
    return 16; // 60 FPS
  }, []);

  // ✅ OPTIMALIZÁCIA - Memory cleanup
  const cleanupOldPositions = useCallback(() => {
    const MAX_POSITIONS = 15000; // Maximálny počet bodov v pamäti
    
    if (positionsRef.current.length > MAX_POSITIONS) {
      // Zachovaj každý druhý bod pre udržanie trendu
      positionsRef.current = positionsRef.current.filter((_, index) => index % 2 === 0);
      console.log(`🧹 Memory cleanup: reduced to ${positionsRef.current.length} positions`);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    
    if (isMobileDevice()) {
      console.log('📱 Mobile device detected - tracking disabled');
      return;
    }
    
    if (!container || !userId) return;

    const handleMouseEnter = () => {
      hoverStartTimeRef.current = Date.now();
      lastRecordedTimeRef.current = 0;
      positionsRef.current = [];
      
      // Ulož celé rozmery (vrátane scrollu)
      containerDimensionsRef.current = {
        width: container.scrollWidth,
        height: container.scrollHeight,
        timestamp: Date.now(),
      };
      
      setTrackingData(prev => ({
        ...prev,
        hoverStartTime: hoverStartTimeRef.current,
        isTracking: true,
        mousePositions: [],
        containerDimensions: containerDimensionsRef.current,
      }));
      
      console.log('🖱️ Mouse entered - FULL-PAGE tracking started', {
        fullWidth: container.scrollWidth,
        fullHeight: container.scrollHeight,
      });
    };

    const handleMouseLeave = () => {
      if (!hoverStartTimeRef.current) return;
      
      const duration = Date.now() - hoverStartTimeRef.current;
      totalHoverTimeRef.current += duration;
      
      setTrackingData(prev => ({
        ...prev,
        totalHoverTime: totalHoverTimeRef.current,
        hoverStartTime: null,
        isTracking: false,
        mousePositions: positionsRef.current,
        containerDimensions: containerDimensionsRef.current,
      }));
      
      console.log(`🖱️ Mouse left - tracked ${positionsRef.current.length} positions in ${duration}ms`);
      hoverStartTimeRef.current = null;
    };

    const handleMouseMove = (e) => {
      if (!hoverStartTimeRef.current) return;
      
      const currentTime = Date.now();
      const recordInterval = getRecordInterval(positionsRef.current.length);
      
      // ✅ OPTIMALIZÁCIA - Adaptive throttling
      if (currentTime - lastRecordedTimeRef.current < recordInterval) {
        return;
      }
      
      const rect = container.getBoundingClientRect();
      
      // Absolute pozícia vrátane scrollu
      const x = e.clientX - rect.left + container.scrollLeft;
      const y = e.clientY - rect.top + container.scrollTop;
      
      // Validácia
      if (x < 0 || y < 0 || x > container.scrollWidth || y > container.scrollHeight) {
        return;
      }
      
      // Ukladaj absolute + percentuálnu pozíciu
      positionsRef.current.push({
        x: Math.round(x),
        y: Math.round(y),
        xPercent: (x / container.scrollWidth) * 100,
        yPercent: (y / container.scrollHeight) * 100,
        timestamp: currentTime,
        relativeTime: currentTime - hoverStartTimeRef.current,
      });
      
      lastRecordedTimeRef.current = currentTime;
      
      // ✅ OPTIMALIZÁCIA - Periodické čistenie pamäte
      if (positionsRef.current.length % 1000 === 0) {
        cleanupOldPositions();
      }
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mousemove', handleMouseMove);

    console.log('🖱️ OPTIMALIZED tracking enabled (adaptive FPS with memory management)');

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousemove', handleMouseMove);
      
      // Cleanup
      positionsRef.current = [];
    };
  }, [contentId, contentType, userId, getRecordInterval, cleanupOldPositions]);

  // Getter pre finálne sync dáta
  const getFinalData = useCallback(() => {
    return {
      ...trackingData,
      mousePositions: positionsRef.current,
      totalHoverTime: totalHoverTimeRef.current,
      containerDimensions: containerDimensionsRef.current,
    };
  }, [trackingData]);

  return { 
    containerRef, 
    trackingData,
    getFinalData
  };
};
