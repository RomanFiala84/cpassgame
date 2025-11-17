// src/components/admin/TrackingViewer.js
// OPTIMALIZOVANÁ VERZIA - Batch rendering + Offscreen Canvas + Agregácia

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../styles/Layout';
import StyledButton from '../../styles/StyledButton';

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
  background: #ffffff;
`;

const CanvasWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
`;

const HeatmapCanvas = styled.canvas`
  display: block;
  max-width: 100%;
  height: auto;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 16px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${p => p.theme.BORDER_COLOR};
  border-radius: 2px;
  overflow: hidden;
  margin-top: 16px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${p => p.theme.ACCENT_COLOR};
  width: ${p => p.progress}%;
  transition: width 0.3s ease;
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

const CloudinaryImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 20px;
`;

const CloudinaryImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 2px solid ${p => p.theme.BORDER_COLOR};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    border-color: ${p => p.theme.ACCENT_COLOR};
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.9);
  display: ${p => p.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${p => p.theme.ACCENT_COLOR};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${p => p.theme.ACCENT_COLOR_2};
    transform: scale(1.1);
  }
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

const TrackingViewer = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const [renderProgress, setRenderProgress] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  // Načítať zoznam komponentov
  useEffect(() => {
    const loadComponents = async () => {
      try {
        const response = await fetch('/api/admin-tracking-components');
        const data = await response.json();
        
        if (data.success) {
          setComponents(data.components || []);
        }
      } catch (error) {
        console.error('Error loading components:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
  }, []);

  // Načítať tracking dáta pre vybraný komponent
  useEffect(() => {
    if (!selectedComponent) return;

    const loadTrackingData = async () => {
      setLoading(true);
      setRenderProgress(0);
      try {
        const response = await fetch(
          `/api/get-tracking-by-component?contentId=${selectedComponent.contentId}&contentType=${selectedComponent.contentType}`
        );
        const data = await response.json();
        
        if (data.success) {
          setTrackingData(data.data);
          setRenderProgress(50);
          
          // Agreguj dáta pred renderovaním
          const aggregatedData = aggregatePositions(data.data.aggregatedPositions);
          setRenderProgress(75);
          
          // Vykresli optimalizovanú heatmap
          await drawHeatmapOptimized(aggregatedData, data.data.containerDimensions);
          setRenderProgress(100);
        }
      } catch (error) {
        console.error('Error loading tracking data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrackingData();
  }, [selectedComponent]);

  // ✅ NOVÁ FUNKCIA - Agregácia dát pre zníženie počtu bodov
  const aggregatePositions = (positions, gridSize = 10) => {
    if (!positions || positions.length === 0) return [];
    
    const startTime = performance.now();
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
    
    const aggregated = Array.from(grid.values());
    const endTime = performance.now();
    
    console.log(`📊 Aggregation: ${positions.length} → ${aggregated.length} points in ${(endTime - startTime).toFixed(2)}ms`);
    
    return aggregated;
  };

  // ✅ OPTIMALIZOVANÁ FUNKCIA - Batch rendering + Offscreen Canvas
  const drawHeatmapOptimized = async (positions, containerDims) => {
    const canvas = canvasRef.current;
    if (!canvas || !positions || positions.length === 0) return;

    const startTime = performance.now();
    const ctx = canvas.getContext('2d', { alpha: false });
    
    // Nastavenie rozmerov
    const fullWidth = containerDims?.width || 1000;
    const fullHeight = containerDims?.height || 2000;
    
    canvas.width = fullWidth;
    canvas.height = fullHeight;

    // Vyčistiť canvas - biely background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, fullWidth, fullHeight);

    console.log('🎨 Drawing optimized heatmap:', {
      positionsCount: positions.length,
      canvasSize: `${fullWidth}x${fullHeight}`,
    });

    // ✅ OFFSCREEN CANVAS - Vytvor gradient template raz
    if (!offscreenCanvasRef.current) {
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = 50;
      offscreenCanvas.height = 50;
      const offscreenCtx = offscreenCanvas.getContext('2d');
      
      const gradient = offscreenCtx.createRadialGradient(25, 25, 0, 25, 25, 25);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.6)');
      gradient.addColorStop(0.4, 'rgba(255, 165, 0, 0.4)');
      gradient.addColorStop(0.7, 'rgba(255, 255, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      offscreenCtx.fillStyle = gradient;
      offscreenCtx.fillRect(0, 0, 50, 50);
      
      offscreenCanvasRef.current = offscreenCanvas;
    }

    // ✅ BATCH RENDERING - Vykresli všetky body naraz
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    // Vykresli body v dávkach pre lepší výkon
    const batchSize = 1000;
    for (let i = 0; i < positions.length; i += batchSize) {
      const batch = positions.slice(i, Math.min(i + batchSize, positions.length));
      
      batch.forEach(pos => {
        // Použiť intenzitu podľa počtu (ak je k dispozícii)
        const intensity = pos.count ? Math.min(pos.count / 10, 1) : 1;
        ctx.globalAlpha = intensity * 0.6;
        
        // Použiť offscreen canvas pre rýchlejšie rendering
        ctx.drawImage(offscreenCanvasRef.current, pos.x - 25, pos.y - 25);
      });
      
      // Umožni prehliadaču update UI medzi dávkami
      if (i + batchSize < positions.length) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    ctx.restore();

    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    setPerformanceMetrics({
      renderTime: renderTime.toFixed(2),
      pointsCount: positions.length,
      avgTimePerPoint: (renderTime / positions.length).toFixed(4),
      canvasSize: `${fullWidth}x${fullHeight}`,
    });

    console.log(`✅ Heatmap rendered in ${renderTime.toFixed(2)}ms (${(renderTime / positions.length).toFixed(4)}ms per point)`);
  };

  const handleDownloadHeatmap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `heatmap_${selectedComponent.contentId}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Získať Cloudinary obrázky
  const getCloudinaryImages = () => {
    if (!trackingData?.individualRecords) return [];
    
    return trackingData.individualRecords
      .map(record => record.cloudinaryData?.url)
      .filter(url => url !== null && url !== undefined);
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

        {!selectedComponent ? (
          <Section>
            <h2>Vyberte komponent na zobrazenie</h2>
            <ComponentGrid>
              {components.map((comp, idx) => (
                <ComponentCard
                  key={idx}
                  onClick={() => setSelectedComponent(comp)}
                >
                  <ComponentTitle>
                    <Badge type={comp.contentType}>{comp.contentType}</Badge>
                    {comp.contentId}
                  </ComponentTitle>
                  <MetaInfo>
                    <div>👥 {comp.usersCount} users</div>
                    <div>📍 {comp.totalPoints?.toLocaleString()} points</div>
                    <div>⏱️ {(comp.avgHoverTime / 1000).toFixed(1)}s avg</div>
                    <div>📊 {comp.recordsCount} records</div>
                    {comp.visualizationsCount > 0 && (
                      <div>🖼️ {comp.visualizationsCount} visualizations</div>
                    )}
                  </MetaInfo>
                </ComponentCard>
              ))}
            </ComponentGrid>
          </Section>
        ) : (
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
                  <StatLabel>Avg Hover Time</StatLabel>
                  <StatValue>
                    {trackingData ? (trackingData.avgHoverTime / 1000).toFixed(1) : 0}s
                  </StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>Records</StatLabel>
                  <StatValue>{trackingData?.recordsCount || 0}</StatValue>
                </StatBox>
              </StatsRow>
            </Section>

            <Section>
              <h2>🎨 Optimalizovaná Agregovaná Heatmap</h2>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                Heatmap s batch renderingom a offscreen canvas optimalizáciou
              </p>
              
              {loading && (
                <>
                  <LoadingText>Renderujem heatmap...</LoadingText>
                  <ProgressBar>
                    <ProgressFill progress={renderProgress} />
                  </ProgressBar>
                </>
              )}
              
              <HeatmapContainer>
                <CanvasWrapper>
                  <HeatmapCanvas ref={canvasRef} />
                </CanvasWrapper>
              </HeatmapContainer>
              
              {performanceMetrics && (
                <PerformanceInfo>
                  <div>⚡ Render time: {performanceMetrics.renderTime}ms</div>
                  <div>📍 Points rendered: {performanceMetrics.pointsCount}</div>
                  <div>⏱️ Avg per point: {performanceMetrics.avgTimePerPoint}ms</div>
                  <div>📐 Canvas size: {performanceMetrics.canvasSize}</div>
                </PerformanceInfo>
              )}
              
              <ButtonGroup>
                <StyledButton variant="success" onClick={handleDownloadHeatmap}>
                  💾 Stiahnuť Heatmap
                </StyledButton>
                <StyledButton variant="outline" onClick={() => setSelectedComponent(null)}>
                  ← Späť na zoznam
                </StyledButton>
              </ButtonGroup>
            </Section>

            {getCloudinaryImages().length > 0 && (
              <Section>
                <h2>🖼️ Cloudinary Vizualizácie ({getCloudinaryImages().length})</h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                  Individuálne heatmap obrázky uložené v Cloudinary
                </p>
                <CloudinaryImageGrid>
                  {getCloudinaryImages().map((url, idx) => (
                    <CloudinaryImage
                      key={idx}
                      src={url}
                      alt={`Heatmap ${idx + 1}`}
                      onClick={() => setModalImage(url)}
                    />
                  ))}
                </CloudinaryImageGrid>
              </Section>
            )}
          </>
        )}

        <Modal show={modalImage !== null} onClick={() => setModalImage(null)}>
          <CloseButton onClick={() => setModalImage(null)}>×</CloseButton>
          {modalImage && <ModalImage src={modalImage} alt="Full size heatmap" />}
        </Modal>
      </Container>
    </Layout>
  );
};

export default TrackingViewer;
