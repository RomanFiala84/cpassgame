// src/hooks/useHoverTracking.js
// FINÁLNA OPRAVENÁ VERZIA - Page-relative tracking pre full-page template

import { useState, useEffect, useRef, useCallback } from 'react';

export const useHoverTracking = (containerRef, contentId, contentType) => {
  const [isTracking, setIsTracking] = useState(false);
  const mousePositions = useRef([]);
  const startTime = useRef(null);
  const lastCaptureTime = useRef(0);
  const landmarksCache = useRef(null);

  // ✅ OPRAVENÁ FUNKCIA - Detekcia landmarks s PAGE-RELATIVE pozíciami
  const detectLandmarks = useCallback(() => {
    if (!containerRef.current) return [];

    const container = containerRef.current;
    
    // Nájdi všetky elementy s data-landmark atribútom
    const landmarkElements = container.querySelectorAll('[data-landmark]');
    
    const landmarks = Array.from(landmarkElements).map(el => {
      const rect = el.getBoundingClientRect();
      
      // ✅ OPRAVA - Pozícia relatívna k CELEJ STRÁNKE
      return {
        id: el.getAttribute('data-landmark-id'),
        type: el.getAttribute('data-landmark'),
        position: {
          top: Math.round(rect.top + window.scrollY),
          left: Math.round(rect.left + window.scrollX),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        }
      };
    });

    console.log(`🎯 Detected ${landmarks.length} landmarks (page-relative):`, landmarks);
    return landmarks;
  }, [containerRef]);

  // Nájdi najbližší landmark
  const findNearestLandmark = useCallback((x, y, landmarks) => {
    if (!landmarks || landmarks.length === 0) return null;

    let nearest = null;
    let minDistance = Infinity;

    landmarks.forEach(landmark => {
      // Check if point is inside landmark
      const { left, top, width, height } = landmark.position;
      
      if (x >= left && x <= left + width && y >= top && y <= top + height) {
        // Point is inside this landmark
        nearest = landmark;
        return;
      }

      // Calculate distance to center
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = landmark;
      }
    });

    return nearest;
  }, []);

  // ✅ OPRAVENÁ FUNKCIA - Mouse tracking s PAGE coordinates
  const handleMouseMove = useCallback((e) => {
    if (!isTracking || !containerRef.current) return;

    const now = Date.now();
    const timeSinceLastCapture = now - lastCaptureTime.current;
    
    // Adaptívne FPS (10-30 FPS)
    const captureInterval = mousePositions.current.length < 100 ? 33 : 100;
    
    if (timeSinceLastCapture < captureInterval) return;

    // ✅ OPRAVA - Používaj PAGE coordinates (e.pageX, e.pageY)
    const pageX = e.pageX;
    const pageY = e.pageY;

    // Cache landmarks ak ešte nie sú
    if (!landmarksCache.current) {
      landmarksCache.current = detectLandmarks();
    }

    // Nájdi najbližší landmark
    const nearestLandmark = findNearestLandmark(pageX, pageY, landmarksCache.current);

    const position = {
      x: Math.round(pageX),
      y: Math.round(pageY),
      timestamp: now,
    };

    // Pridaj landmark info ak existuje
    if (nearestLandmark) {
      position.nearestLandmark = {
        id: nearestLandmark.id,
        type: nearestLandmark.type,
        offsetX: Math.round(pageX - nearestLandmark.position.left),
        offsetY: Math.round(pageY - nearestLandmark.position.top),
        landmarkPosition: nearestLandmark.position
      };
    }

    mousePositions.current.push(position);
    lastCaptureTime.current = now;
    
  }, [isTracking, containerRef, detectLandmarks, findNearestLandmark]);

  // Start tracking
  const startTracking = useCallback(() => {
    if (isTracking) return;
    
    console.log('🖱️ Starting page-relative tracking with landmarks...');
    
    mousePositions.current = [];
    startTime.current = Date.now();
    lastCaptureTime.current = 0;
    
    // Detekuj landmarks pri štarte
    landmarksCache.current = detectLandmarks();
    
    setIsTracking(true);
  }, [isTracking, detectLandmarks]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (!isTracking) return;
    
    const totalTime = Date.now() - (startTime.current || 0);
    console.log(`🛑 Tracking stopped - ${mousePositions.current.length} positions in ${(totalTime / 1000).toFixed(1)}s`);
    
    setIsTracking(false);
  }, [isTracking]);

  // ✅ OPRAVENÁ FUNKCIA - Get final data s PAGE dimensions
  const getFinalData = useCallback(() => {
    const endTime = Date.now();
    const totalHoverTime = startTime.current ? endTime - startTime.current : 0;

    // ✅ OPRAVA - Ulož FULL PAGE dimensions
    const containerDimensions = {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      containerWidth: containerRef.current?.scrollWidth,
      containerHeight: containerRef.current?.scrollHeight,
      containerOffsetTop: containerRef.current ? 
        containerRef.current.getBoundingClientRect().top + window.scrollY : 0,
      containerOffsetLeft: containerRef.current ? 
        containerRef.current.getBoundingClientRect().left + window.scrollX : 0
    };

    console.log('📐 Final data dimensions:', containerDimensions);

    return {
      userId: null, // Bude nastavené v komponente
      contentId,
      contentType,
      mousePositions: mousePositions.current,
      totalHoverTime,
      hoverStartTime: startTime.current,
      containerDimensions,
      landmarks: landmarksCache.current || [],
      timestamp: new Date().toISOString(),
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    };
  }, [contentId, contentType, containerRef]);

  // Event listeners
  useEffect(() => {
    if (!isTracking) return;

    // ✅ OPRAVA - Listener na DOCUMENT (nie na container)
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTracking, handleMouseMove]);

  return {
    isTracking,
    startTracking,
    stopTracking,
    getFinalData,
    positionsCount: mousePositions.current.length
  };
};

export default useHoverTracking;



