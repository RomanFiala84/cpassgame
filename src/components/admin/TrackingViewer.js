// src/components/admin/TrackingViewer.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../styles/Layout';
import StyledButton from '../../styles/StyledButton';
import { convertPercentToPixels, convertLandmarksPercentToPixels } from '../../utils/trackingHelpers';

const STANDARD_WIDTH = 1920;
const STANDARD_HEIGHT = 2000;

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
    if (p.type === 'post') return p.theme.ACCENT_COLOR + '22';
    if (p.type === 'intervention') return '#00C85322';
    if (p.type === 'prevention') return '#FF980022';
    return '#99999922';
  }};
  color: ${p => {
    if (p.type === 'post') return p.theme.ACCENT_COLOR;
    if (p.type === 'intervention') return '#00C853';
    if (p.type === 'prevention') return '#FF9800';
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

// =====================================================
// COMPONENT
// =====================================================

const TrackingViewer = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [showLandmarks, setShowLandmarks] = useState(false);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        const response = await fetch('/api/admin-tracking-components');
        const data = await response.json();
        if (data.success) {
          setComponents(data.interventions || []);
        }
      } catch (error) {
        console.error('Error loading components:', error);
      } finally {
        setLoading(false);
      }
    };
    loadComponents();
  }, []);

  const aggregatePositions = (positions, gridSize = 10) => {
    if (!positions || positions.length === 0) return [];
    const grid = new Map();
    positions.forEach(pos => {
      const gridX = Math.floor(pos.x / gridSize) * gridSize;
      const gridY = Math.floor(pos.y / gridSize) * gridSize;
      const key = `${gridX},${gridY}`;
      if (!grid.has(key)) {
        grid.set(key, { x: gridX + gridSize / 2, y: gridY + gridSize / 2, count: 0 });
      }
      grid.get(key).count++;
    });
    return Array.from(grid.values());
  };

  const drawHeatmapOverlay = async (ctx, positions) => {
    if (!positions || positions.length === 0) return;

    const radius = 25;
    const gradientCanvas = document.createElement('canvas');
    gradientCanvas.width = radius * 2;
    gradientCanvas.height = radius * 2;
    const gradientCtx = gradientCanvas.getContext('2d');

    const gradient = gradientCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.7)');
    gradient.addColorStop(0.4, 'rgba(255, 165, 0, 0.5)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    gradientCtx.fillStyle = gradient;
    gradientCtx.fillRect(0, 0, radius * 2, radius * 2);

    const maxCount = Math.max(...positions.map(p => p.count || 1));

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

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
    console.log(`✅ Heatmap overlay drawn (${positions.length} aggregated points)`);
  };

  const drawLandmarkBoundaries = (ctx, landmarks) => {
    if (!landmarks || landmarks.length === 0) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
    ctx.lineWidth = 2;
    ctx.font = 'bold 14px Arial';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 3;
    landmarks.forEach(landmark => {
      const { left, top, width, height } = landmark.position;
      ctx.strokeRect(left, top, width, height);
      const label = `${landmark.type}: ${landmark.id}`;
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(left, top - 20, textWidth + 10, 20);
      ctx.fillStyle = 'rgba(0, 255, 0, 1)';
      ctx.fillText(label, left + 5, top - 6);
    });
    ctx.restore();
    console.log(`✅ Drew ${landmarks.length} landmark boundaries`);
  };

  useEffect(() => {
    if (!selectedComponent) return;

    const renderCompositeHeatmap = async (data) => {
      const canvas = canvasRef.current;
      if (!canvas || !data) { console.error('❌ No canvas or data'); return; }

      setRendering(true);
      const startTime = performance.now();
      const ctx = canvas.getContext('2d', { alpha: false });

      let canvasWidth = STANDARD_WIDTH;
      let canvasHeight = STANDARD_HEIGHT;

      if (data.containerDimensions?.originalWidth && data.containerDimensions?.originalHeight) {
        const scale = STANDARD_WIDTH / data.containerDimensions.originalWidth;
        canvasHeight = Math.round(data.containerDimensions.originalHeight * scale);
        canvasHeight = Math.max(600, Math.min(10000, canvasHeight));
        console.log('✅ Container dimensions:', { canvasWidth, canvasHeight });
      } else if (data.containerDimensions?.width && data.containerDimensions?.height) {
        canvasWidth = data.containerDimensions.width;
        canvasHeight = data.containerDimensions.height;
        console.log('⚠️ OLD format (pixels):', { canvasWidth, canvasHeight });
      } else {
        console.warn('⚠️ No containerDimensions, using fallback');
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      await new Promise(resolve => setTimeout(resolve, 100));

      // ── Načítaj template ──
      // ── Načítaj template ──
      let templateLoaded = false;
      if (data.componentTemplateUrl) {
        templateLoaded = await new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvasWidth = img.naturalWidth;
            canvasHeight = img.naturalHeight;
            ctx.drawImage(img, 0, 0); // bez naťahovania
            resolve(true);
          };

          img.onerror = () => { console.warn('⚠️ Template load error, using placeholder'); resolve(false); };
          img.src = data.componentTemplateUrl;
        });
      } else {
        console.warn('⚠️ No template URL');
      }


      if (!templateLoaded) {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = '#666666';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📊 Composite Heatmap', canvasWidth / 2, 80);
        ctx.font = '14px Arial';
        ctx.fillStyle = '#999999';
        ctx.fillText(`${data.contentId}`, canvasWidth / 2, 110);
        ctx.fillText('⚠️ Component screenshot not available', canvasWidth / 2, 140);
      }

      // ── FIX: Konvertuj pozície — rozšírená podmienka ─────────────────────
      let pixelPositions = data.aggregatedPositions;
      let pixelLandmarks = data.landmarks;

      const fmt = data.containerDimensions?.storageFormat;
      const hasOriginalDims = data.containerDimensions?.originalWidth && data.containerDimensions?.originalHeight;

      if (fmt === 'percent' || (fmt === 'unknown' && hasOriginalDims) || (!fmt && hasOriginalDims)) {
        // Konvertuj percent → pixely
        pixelPositions = convertPercentToPixels(data.aggregatedPositions, canvasWidth, canvasHeight);
        pixelLandmarks = convertLandmarksPercentToPixels(data.landmarks, canvasWidth, canvasHeight);
        console.log(`✅ Converted to pixels (fmt="${fmt}"): ${pixelPositions?.length} points`);
      } else if (fmt === 'pixels') {
        // Už sú pixely, použi as-is
        console.log('✅ Positions already in pixels, using as-is');
      } else {
        // Posledná záchrana: auto-detekcia z hodnôt
        const sample = data.aggregatedPositions?.[0];
        if (sample && sample.x <= 1.0 && sample.y <= 1.0) {
          pixelPositions = convertPercentToPixels(data.aggregatedPositions, canvasWidth, canvasHeight);
          pixelLandmarks = convertLandmarksPercentToPixels(data.landmarks, canvasWidth, canvasHeight);
          console.log(`✅ Auto-detected percent format, converted: ${pixelPositions?.length} points`);
        } else {
          console.warn(`⚠️ Unknown format "${fmt}", using positions as-is`);
        }
      }
      // ─────────────────────────────────────────────────────────────────────

      // ── Vykresli heatmap ──
      if (pixelPositions && pixelPositions.length > 0) {
        const aggregated = aggregatePositions(pixelPositions, 10);
        console.log('🎨 Drawing heatmap:', aggregated.length, 'aggregated points');
        await drawHeatmapOverlay(ctx, aggregated);
      } else {
        console.warn('⚠️ No positions to draw');
        ctx.fillStyle = '#ff9800';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ No tracking data available', canvasWidth / 2, canvasHeight / 2);
      }

      if (showLandmarks && pixelLandmarks?.length > 0) {
        drawLandmarkBoundaries(ctx, pixelLandmarks);
      }

      const renderTime = (performance.now() - startTime).toFixed(2);
      setPerformanceMetrics({
        renderTime,
        pointsCount: pixelPositions?.length || 0,
        usersCount: data.usersCount || 0,
        landmarksCount: pixelLandmarks?.length || 0,
        canvasSize: `${canvasWidth}×${canvasHeight}`,
        storageFormat: fmt || 'auto-detected',
        renderMode: 'client-side'
      });

      setRendering(false);
      console.log(`✅ Render complete in ${renderTime}ms`);
    };

    const loadAndRenderHeatmap = async () => {
      setLoading(true);
      setPerformanceMetrics(null);
      try {
        const url = `/api/get-tracking-by-component?contentId=${selectedComponent.contentId}&contentType=${selectedComponent.contentType}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setTrackingData(data.data);
          setTimeout(() => renderCompositeHeatmap(data.data), 100);
        } else {
          setTrackingData(null);
          setTimeout(() => renderCompositeHeatmap({
            contentId: selectedComponent.contentId,
            aggregatedPositions: [],
            landmarks: [],
            containerDimensions: null,
            componentTemplateUrl: null,
            usersCount: 0,
          }), 100);
        }
      } catch (error) {
        console.error('❌ Fetch error:', error);
        alert(`Nepodarilo sa načítať tracking dáta: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadAndRenderHeatmap();
  }, [selectedComponent, showLandmarks]);

  const handleDownloadHeatmap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `composite_heatmap_${selectedComponent.contentId}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

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
                      <div>⏱️ {((comp.avgTimeSpent || 0) / 1000).toFixed(1)}s avg</div>
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
                <Badge type={selectedComponent.contentType}>
                  {selectedComponent.contentType}
                </Badge>
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
                  {/* FIX: zobraz avgTimeSpent ak avgHoverTime je 0 */}
                  <StatValue>
                    {trackingData
                      ? ((trackingData.avgHoverTime || trackingData.avgTimeSpent || 0) / 1000).toFixed(1)
                      : 0}s
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
              <h2 style={{ color: 'inherit', marginBottom: '8px' }}>
                🎨 Composite Heatmap
              </h2>
              <SectionSubtitle>
                Component template (šírka 1920px, dynamická výška) s agregovanou heatmap zo všetkých používateľov (rendered client-side)
              </SectionSubtitle>

              {loading && <LoadingText>Načítavam dáta...</LoadingText>}
              {!loading && rendering && (
                <RenderingBadge>⏳ Renderujem heatmap...</RenderingBadge>
              )}

              <HeatmapContainer show={!loading}>
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
                    <StyledButton variant="success" onClick={handleDownloadHeatmap}>
                      💾 Stiahnuť Composite Heatmap
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
