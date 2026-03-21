// src/components/admin/TrackingViewer.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate }       from 'react-router-dom';
import styled                from 'styled-components';
import Layout                from '../../styles/Layout';
import StyledButton          from '../../styles/StyledButton';
import { convertPercentToPixels, convertLandmarksPercentToPixels } from '../../utils/trackingHelpers';

const STANDARD_WIDTH = 1920;

// ── Styled Components ─────────────────────────────────────────────────────────

const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
`;
const Title = styled.h1`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 32px;
  margin: 0;
  @media (max-width: 768px) { font-size: 24px; }
`;
const Section = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
`;
const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const ComponentCard = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 2px solid ${p => p.selected ? p.theme.ACCENT_COLOR : p.theme.BORDER_COLOR};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    border-color: ${p => p.theme.ACCENT_COLOR};
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;
const ComponentTitle = styled.div`
  font-weight: 600;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;
const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  background: ${p => {
    if (p.type === 'post')         return p.theme.ACCENT_COLOR + '22';
    if (p.type === 'intervention') return '#00C85322';
    if (p.type === 'prevention')   return '#FF980022';
    return '#99999922';
  }};
  color: ${p => {
    if (p.type === 'post')         return p.theme.ACCENT_COLOR;
    if (p.type === 'intervention') return '#00C853';
    if (p.type === 'prevention')   return '#FF9800';
    return '#999999';
  }};
`;
const MetaInfo = styled.div`
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const HeatmapContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 20px auto;
  border: 2px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  overflow: auto;
  background: #f5f5f5;
  min-height: 400px;
  display: ${p => p.show ? 'block' : 'none'};
`;
const CanvasWrapper = styled.div`
  position: relative;
  width: fit-content;
  min-width: 100%;
`;
const HeatmapCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: auto;
`;
const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 16px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin: 20px 0;
`;
const StatBox = styled.div`
  background: linear-gradient(135deg,
    ${p => p.theme.ACCENT_COLOR}11,
    ${p => p.theme.ACCENT_COLOR_2}11
  );
  padding: 16px;
  border-radius: 8px;
  text-align: center;
`;
const StatLabel = styled.div`
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;
const PerformanceInfo = styled.div`
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-top: 12px;
  padding: 12px;
  background: ${p => p.theme.ACCENT_COLOR}11;
  border-radius: 6px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;
const SectionSubtitle = styled.p`
  font-size: 14px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 16px;
  line-height: 1.5;
`;
const DebugToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  cursor: pointer;
  margin-top: 12px;
  input { cursor: pointer; }
`;
const RenderingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${p => p.theme.ACCENT_COLOR}22;
  border: 1px solid ${p => p.theme.ACCENT_COLOR}44;
  border-radius: 20px;
  font-size: 12px;
  color: ${p => p.theme.ACCENT_COLOR};
  margin-bottom: 12px;
`;
const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 16px;
`;

// ── Component ─────────────────────────────────────────────────────────────────

const TrackingViewer = () => {
  const navigate  = useNavigate();
  const canvasRef = useRef(null);

  const [components,         setComponents]        = useState([]);
  const [selectedComponent,  setSelectedComponent] = useState(null);
  const [trackingData,       setTrackingData]       = useState(null);
  const [loading,            setLoading]            = useState(true);
  const [rendering,          setRendering]          = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [showLandmarks,      setShowLandmarks]      = useState(false);

  // ── Načítaj zoznam komponentov ──────────────────────────────────────────────
  useEffect(() => {
    const loadComponents = async () => {
      try {
        const response = await fetch('/api/admin-tracking-components');
        const data     = await response.json();
        if (data.success) setComponents(data.interventions || []);
      } catch (error) {
        console.error('Error loading components:', error);
      } finally {
        setLoading(false);
      }
    };
    loadComponents();
  }, []);

  // ── Fetch tracking dát pri zmene selectedComponent ──────────────────────────
  useEffect(() => {
    if (!selectedComponent) return;

    const loadTrackingData = async () => {
      setLoading(true);
      setPerformanceMetrics(null);
      setTrackingData(null);
      try {
        const url      = `/api/get-tracking-by-component?contentId=${selectedComponent.contentId}&contentType=${selectedComponent.contentType}`;
        const response = await fetch(url);
        const data     = await response.json();

        if (data.success) {
          setTrackingData(data.data);
        } else {
          setTrackingData({
            contentId:            selectedComponent.contentId,
            aggregatedPositions:  [],
            landmarks:            [],
            containerDimensions:  null,
            componentTemplateUrl: null,
            usersCount:           0,
          });
        }
      } catch (error) {
        console.error('❌ Fetch error:', error);
        alert(`Nepodarilo sa načítať tracking dáta: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadTrackingData();
  }, [selectedComponent]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const aggregatePositions = useCallback((positions, gridSize = 10) => {
    if (!positions || positions.length === 0) return [];
    const grid = new Map();
    positions.forEach(pos => {
      const gridX = Math.floor(pos.x / gridSize) * gridSize;
      const gridY = Math.floor(pos.y / gridSize) * gridSize;
      const key   = `${gridX},${gridY}`;
      if (!grid.has(key)) grid.set(key, { x: gridX + gridSize / 2, y: gridY + gridSize / 2, count: 0 });
      grid.get(key).count++;
    });
    return Array.from(grid.values());
  }, []);

  const drawHeatmapOverlay = useCallback(async (ctx, positions) => {
    if (!positions || positions.length === 0) return;
    const radius         = 25;
    const gradientCanvas = document.createElement('canvas');
    gradientCanvas.width  = radius * 2;
    gradientCanvas.height = radius * 2;
    const gradientCtx    = gradientCanvas.getContext('2d');
    const gradient = gradientCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0,   'rgba(255, 0,   0,   0.7)');
    gradient.addColorStop(0.4, 'rgba(255, 165, 0,   0.5)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 0,   0.3)');
    gradient.addColorStop(1,   'rgba(0,   0,   0,   0  )');
    gradientCtx.fillStyle = gradient;
    gradientCtx.fillRect(0, 0, radius * 2, radius * 2);

    const maxCount = Math.max(...positions.map(p => p.count || 1));
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.imageSmoothingEnabled    = true;
    ctx.imageSmoothingQuality    = 'high';

    const BATCH_SIZE = 100;
    for (let i = 0; i < positions.length; i += BATCH_SIZE) {
      const batch = positions.slice(i, i + BATCH_SIZE);
      batch.forEach(pos => {
        const intensity = (pos.count || 1) / maxCount;
        ctx.globalAlpha = Math.min(0.4 + intensity * 0.6, 1);
        ctx.drawImage(gradientCanvas, pos.x - radius, pos.y - radius);
      });
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    ctx.restore();
  }, []);

  const drawLandmarkBoundaries = useCallback((ctx, landmarks) => {
    if (!landmarks || landmarks.length === 0) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
    ctx.lineWidth   = 2;
    ctx.font        = 'bold 14px Arial';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur  = 3;
    landmarks.forEach(landmark => {
      const { left, top, width, height } = landmark.position;
      ctx.strokeRect(left, top, width, height);
      const label     = `${landmark.type}: ${landmark.id}`;
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle   = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(left, top - 20, textWidth + 10, 20);
      ctx.fillStyle   = 'rgba(0, 255, 0, 1)';
      ctx.fillText(label, left + 5, top - 6);
    });
    ctx.restore();
  }, []);

  // ── Hlavný render ─────────────────────────────────────────────────────────────

  const renderCompositeHeatmap = useCallback(async (data) => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    setRendering(true);
    const startTime = performance.now();
    const ctx = canvas.getContext('2d', { alpha: false });

    // ── FIX 1: Výška z originalHeight×scale, nie STANDARD_HEIGHT=2000 ──────
    let canvasWidth  = STANDARD_WIDTH;
    let canvasHeight = STANDARD_WIDTH; // square fallback — lepší ako 2000

    if (data.containerDimensions?.originalWidth && data.containerDimensions?.originalHeight) {
      const scale  = STANDARD_WIDTH / data.containerDimensions.originalWidth;
      canvasHeight = Math.max(600, Math.min(10000, Math.round(data.containerDimensions.originalHeight * scale)));
    } else if (data.containerDimensions?.width && data.containerDimensions?.height) {
      canvasWidth  = data.containerDimensions.width;
      canvasHeight = data.containerDimensions.height;
    }

    canvas.width  = canvasWidth;
    canvas.height = canvasHeight;

    await new Promise(resolve => setTimeout(resolve, 100));

    // ── Načítaj template ─────────────────────────────────────────────────────
    let templateLoaded = false;
    if (data.componentTemplateUrl) {
      templateLoaded = await new Promise((resolve) => {
        const img       = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          // template definuje finálne rozmery canvasu
          canvas.width  = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvasWidth   = img.naturalWidth;
          canvasHeight  = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
          resolve(true);
        };
        img.onerror = () => { console.warn('⚠️ Template load error'); resolve(false); };
        img.src = data.componentTemplateUrl;
      });
    }

    if (!templateLoaded) {
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = '#666666';
      ctx.font      = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('📊 Composite Heatmap', canvasWidth / 2, 80);
      ctx.font      = '14px Arial';
      ctx.fillStyle = '#999999';
      ctx.fillText(`${data.contentId}`, canvasWidth / 2, 110);
      ctx.fillText('⚠️ Component screenshot not available', canvasWidth / 2, 140);
    }

    // ── FIX 2: Reprezentatívna vzorka z celého poľa, nie len prvých 10 ──────
    const allPositions = data.aggregatedPositions || [];
    let pixelPositions = allPositions;
    let pixelLandmarks = data.landmarks || [];

    const fmt         = data.containerDimensions?.storageFormat;
    const hasOrigDims = !!(data.containerDimensions?.originalWidth && data.containerDimensions?.originalHeight);

    const detectFormat = () => {
      if (allPositions.length === 0) return null;
      const step        = Math.max(1, Math.floor(allPositions.length / 20));
      const sample      = allPositions.filter((_, i) => i % step === 0).slice(0, 20);
      const sortedX     = [...sample.map(p => p.x)].sort((a, b) => a - b);
      const sortedY     = [...sample.map(p => p.y)].sort((a, b) => a - b);
      const medianX     = sortedX[Math.floor(sortedX.length / 2)];
      const medianY     = sortedY[Math.floor(sortedY.length / 2)];
      const maxX        = sortedX[sortedX.length - 1];
      const maxY        = sortedY[sortedY.length - 1];
      if (medianX <= 1.0 && medianY <= 1.0 && maxX <= 1.05 && maxY <= 1.05) return '0-1';
      if (medianX <= 100 && maxX <= 105)                                      return 'percent';
      return 'pixels';
    };

    if (fmt === 'percent' || fmt === 'unknown' || (!fmt && hasOrigDims)) {
      pixelPositions = convertPercentToPixels(allPositions, canvasWidth, canvasHeight);
      pixelLandmarks = convertLandmarksPercentToPixels(pixelLandmarks, canvasWidth, canvasHeight);
      console.log(`✅ fmt="${fmt}" → converted ${pixelPositions?.length} points`);
    } else if (fmt === 'pixels') {
      console.log('✅ fmt="pixels" → using as-is');
    } else {
      // ── FIX 3: Auto-detekcia z reprezentatívnej vzorky ───────────────────
      const detected = detectFormat();
      if (detected === '0-1') {
        const rescaled          = allPositions.map(p => ({ ...p, x: p.x * 100, y: p.y * 100 }));
        const rescaledLandmarks = pixelLandmarks.map(l => ({
          ...l,
          position: {
            top:    l.position.top    * 100,
            left:   l.position.left   * 100,
            width:  l.position.width  * 100,
            height: l.position.height * 100,
          },
        }));
        pixelPositions = convertPercentToPixels(rescaled, canvasWidth, canvasHeight);
        pixelLandmarks = convertLandmarksPercentToPixels(rescaledLandmarks, canvasWidth, canvasHeight);
        console.log(`✅ Auto-detected 0-1 → rescaled+converted ${pixelPositions?.length} points`);
      } else if (detected === 'percent') {
        pixelPositions = convertPercentToPixels(allPositions, canvasWidth, canvasHeight);
        pixelLandmarks = convertLandmarksPercentToPixels(pixelLandmarks, canvasWidth, canvasHeight);
        console.log(`✅ Auto-detected percent → converted ${pixelPositions?.length} points`);
      } else if (detected === 'pixels') {
        console.warn('⚠️ Auto-detected pixels → using as-is');
      } else {
        console.warn('⚠️ No positions — nothing to render');
      }
    }

    // ── Kresli heatmap ────────────────────────────────────────────────────────
    if (pixelPositions && pixelPositions.length > 0) {
      const aggregated = aggregatePositions(pixelPositions, 10);
      await drawHeatmapOverlay(ctx, aggregated);
    } else {
      ctx.fillStyle = '#ff9800';
      ctx.font      = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ No tracking data available', canvasWidth / 2, canvasHeight / 2);
    }

    if (showLandmarks && pixelLandmarks?.length > 0) {
      drawLandmarkBoundaries(ctx, pixelLandmarks);
    }

    const renderTime = (performance.now() - startTime).toFixed(2);
    setPerformanceMetrics({
      renderTime,
      pointsCount:    pixelPositions?.length || 0,
      usersCount:     data.usersCount        || 0,
      landmarksCount: pixelLandmarks?.length || 0,
      canvasSize:     `${canvasWidth}×${canvasHeight}`,
      storageFormat:  fmt || 'auto-detected',
      renderMode:     'client-side',
    });

    setRendering(false);
    console.log(`✅ Render complete in ${renderTime}ms`);
  // ── FIX 4: canvasRef odstránený z deps (useRef je stabilný) ─────────────
  }, [showLandmarks, aggregatePositions, drawHeatmapOverlay, drawLandmarkBoundaries]);

  useEffect(() => {
    if (!trackingData) return;
    renderCompositeHeatmap(trackingData);
  }, [trackingData, renderCompositeHeatmap]);

  // ── FIX 5: Refresh — nový objekt → useEffect detekuje zmenu ─────────────────
  const handleRefresh = useCallback(() => {
    setSelectedComponent(prev => ({ ...prev }));
  }, []);

  // ── Download ──────────────────────────────────────────────────────────────────
  const handleDownloadHeatmap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link    = document.createElement('a');
    link.download = `composite_heatmap_${selectedComponent.contentId}_${Date.now()}.png`;
    link.href     = canvas.toDataURL('image/png');
    link.click();
  }, [selectedComponent]);

  // ── Render ────────────────────────────────────────────────────────────────────

  if (loading && components.length === 0) {
    return (
      <Layout showLevelDisplay={false}>
        <Container>
          <LoadingText>Načítavam tracking dáta...</LoadingText>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout showLevelDisplay={false}>
      <Container>
        <Header>
          <Title>🔥 Tracking Heatmap Viewer</Title>
          <StyledButton variant="outline" onClick={() => navigate('/admin')}>
            ← Späť na Admin Panel
          </StyledButton>
        </Header>

        {!selectedComponent && (
          <Section>
            <h2 style={{ color: 'inherit', marginBottom: '16px' }}>
              Vyberte komponent na zobrazenie
            </h2>
            {components.length === 0 ? (
              <EmptyState>
                📭 Žiadne tracking dáta zatiaľ neexistujú.<br />
                <small>Spusti intervenciu a pohni myšou, potom sa tu zobrazia dáta.</small>
              </EmptyState>
            ) : (
              <ComponentGrid>
                {components.map((comp, idx) => (
                  <ComponentCard key={idx} onClick={() => setSelectedComponent(comp)}>
                    <ComponentTitle>
                      <Badge type={comp.contentType}>{comp.contentType}</Badge>
                      {comp.contentId}
                    </ComponentTitle>
                    <MetaInfo>
                      <div>👥 {comp.usersCount} users</div>
                      <div>📍 {comp.totalPoints?.toLocaleString()} points</div>
                      <div>⏱️ {(comp.avgTimeSpent || 0).toFixed(1)}s avg</div>
                      <div>📊 {comp.recordsCount} records</div>
                    </MetaInfo>
                  </ComponentCard>
                ))}
              </ComponentGrid>
            )}
          </Section>
        )}

        {selectedComponent && (
          <>
            <Section>
              <ComponentTitle>
                <Badge type={selectedComponent.contentType}>{selectedComponent.contentType}</Badge>
                {selectedComponent.contentId}
              </ComponentTitle>
              <StatsRow>
                <StatBox>
                  <StatLabel>Users</StatLabel>
                  <StatValue>{trackingData?.usersCount || 0}</StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>Total Points</StatLabel>
                  <StatValue>{trackingData?.totalPositions?.toLocaleString() || 0}</StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>Avg Time</StatLabel>
                  <StatValue>
                    {(trackingData?.avgHoverTime || trackingData?.avgTimeSpent || 0).toFixed(1)}s
                  </StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>Records</StatLabel>
                  <StatValue>{trackingData?.recordsCount || 0}</StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>Landmarks</StatLabel>
                  <StatValue>{trackingData?.landmarks?.length || 0}</StatValue>
                </StatBox>
              </StatsRow>
            </Section>

            <Section>
              <h2 style={{ color: 'inherit', marginBottom: '8px' }}>🎨 Composite Heatmap</h2>
              <SectionSubtitle>
                Component template (šírka 1920px, dynamická výška) s agregovanou heatmap zo všetkých používateľov (rendered client-side)
              </SectionSubtitle>

              {loading && <LoadingText>Načítavam dáta...</LoadingText>}
              {!loading && rendering && <RenderingBadge>⏳ Renderujem heatmap...</RenderingBadge>}

              {/* FIX 6: Canvas skrytý aj počas rendering — žiadny prázdny flash */}
              <HeatmapContainer show={!loading && !rendering}>
                <CanvasWrapper>
                  <HeatmapCanvas ref={canvasRef} />
                </CanvasWrapper>
              </HeatmapContainer>

              {!loading && !rendering && performanceMetrics && (
                <PerformanceInfo>
                  <div>⚡ Render: {performanceMetrics.renderTime}ms</div>
                  <div>📍 Points: {performanceMetrics.pointsCount}</div>
                  <div>👥 Users: {performanceMetrics.usersCount}</div>
                  <div>🎯 Landmarks: {performanceMetrics.landmarksCount}</div>
                  <div>📐 Size: {performanceMetrics.canvasSize}</div>
                  <div>💾 Format: {performanceMetrics.storageFormat}</div>
                  <div>🖥️ Mode: {performanceMetrics.renderMode}</div>
                </PerformanceInfo>
              )}

              {!loading && !rendering && (
                <>
                  <DebugToggle>
                    <input
                      type="checkbox"
                      checked={showLandmarks}
                      onChange={(e) => setShowLandmarks(e.target.checked)}
                    />
                    🔍 Show Landmark Boundaries (Debug Mode)
                  </DebugToggle>
                  <ButtonGroup>
                    {performanceMetrics && (
                      <StyledButton variant="success" onClick={handleDownloadHeatmap}>
                        💾 Stiahnuť Composite Heatmap
                      </StyledButton>
                    )}
                    <StyledButton variant="outline" onClick={handleRefresh}>
                      🔄 Obnoviť dáta
                    </StyledButton>
                    <StyledButton variant="outline" onClick={() => setSelectedComponent(null)}>
                      ← Späť na zoznam
                    </StyledButton>
                  </ButtonGroup>
                </>
              )}
            </Section>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default TrackingViewer;
