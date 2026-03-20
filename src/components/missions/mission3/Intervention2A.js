// src/components/missions/mission3/Intervention2A.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import DetectiveTipSmall from '../../shared/DetectiveTipSmall';
import { useUserStats } from '../../../contexts/UserStatsContext';
import { getResponseManager } from '../../../utils/ResponseManager';
import {
  saveTrackingWithVisualization,
  generateAndUploadComponentTemplate,
} from '../../../utils/trackingHelpers';

// ── Styled Components ─────────────────────────────────────────────────────────

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
`;

const PageTitle = styled.h2`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  text-align: center;
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 700;
`;

const PageSubtitle = styled.p`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-align: center;
  font-size: 14px;
  margin-bottom: 24px;
`;

const ModuleTitle = styled.h3`
  color: ${p => p.theme.ACCENT_COLOR};
  font-size: 17px;
  font-weight: 700;
  margin: 28px 0 14px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid ${p => p.theme.ACCENT_COLOR}44;
`;

const SectionTitle = styled.h4`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 15px;
  font-weight: 700;
  margin: 20px 0 8px 0;
`;

const BodyText = styled.p`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 14px;
`;

const ItemLabel = styled.strong`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  display: block;
  margin-bottom: 2px;
  font-size: 15px;
`;

const ItemDesc = styled.span`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 14px;
  line-height: 1.6;
`;

const ContentList = styled.ol`
  padding-left: 20px;
  margin: 8px 0 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ContentListItem = styled.li`
  font-size: 15px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  line-height: 1.7;
`;

const NestedList = styled.ol`
  list-style-type: lower-alpha;
  padding-left: 20px;
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const NestedItem = styled.li`
  font-size: 14px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  line-height: 1.6;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${p => p.theme.BORDER_COLOR};
  margin: 24px 0;
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const ProgressTrack = styled.div`
  flex: 1;
  height: 6px;
  background: ${p => p.theme.BORDER_COLOR};
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.pct}%;
  background: linear-gradient(to right, ${p => p.theme.ACCENT_COLOR}, ${p => p.theme.ACCENT_COLOR_2});
  transition: width 0.4s ease;
`;

const ProgressLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${p => p.theme.ACCENT_COLOR};
  white-space: nowrap;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

// ── Obsah stránok ─────────────────────────────────────────────────────────────

const Page1Content = () => (
  <>
    <ModuleTitle>🧠 Modul 1 — placeholder</ModuleTitle>
    <SectionTitle>Nadpis sekcie</SectionTitle>
    <BodyText>Text intervencie.</BodyText>
    <Divider />
    <SectionTitle>Nadpis sekcie 2</SectionTitle>
    <ContentList>
      <ContentListItem>
        <ItemLabel>Položka 1</ItemLabel>
        <ItemDesc>Popis položky.</ItemDesc>
      </ContentListItem>
    </ContentList>
  </>
);

const Page2Content = () => (
  <>
    <ModuleTitle>🏛️ Modul 2 — placeholder</ModuleTitle>
    <SectionTitle>Nadpis sekcie</SectionTitle>
    <BodyText>Text intervencie.</BodyText>
    <Divider />
    <ContentList>
      <ContentListItem>
        <ItemLabel>Položka 1</ItemLabel>
        <ItemDesc>Popis položky.</ItemDesc>
      </ContentListItem>
    </ContentList>
  </>
);

const Page3Content = () => (
  <>
    <ModuleTitle>🚦 Modul 3 — placeholder</ModuleTitle>
    <SectionTitle>Nadpis sekcie</SectionTitle>
    <BodyText>Text intervencie.</BodyText>
    <Divider />
    <ContentList>
      <ContentListItem>
        <ItemLabel>Položka 1</ItemLabel>
        <ItemDesc>Popis položky.</ItemDesc>
      </ContentListItem>
    </ContentList>
  </>
);

// ── Konfigurácia stránok ──────────────────────────────────────────────────────

const PAGES = [
  {
    key: 'page0',
    title: 'Modul 1 — placeholder',
    subtitle: 'Informačné očkovanie',
    content: <Page1Content />,
    detectiveTipIntro: `<p><strong>Placeholder tip pre stránku 1.</strong></p>`,
  },
  {
    key: 'page1',
    title: 'Modul 2 — placeholder',
    subtitle: 'Budovanie dôvery',
    content: <Page2Content />,
    detectiveTipIntro: `<p><strong>Placeholder tip pre stránku 2.</strong></p>`,
  },
  {
    key: 'page2',
    title: 'Modul 3 — placeholder',
    subtitle: 'Bonus',
    content: <Page3Content />,
    detectiveTipIntro: `<p><strong>Placeholder tip pre stránku 3.</strong></p>`,
  },
];

const TOTAL_PAGES = PAGES.length;
const COMPONENT_ID = 'mission3_intervention_a';

// ═══════════════════════════════════════════════════════════════════════════════
// Hlavný komponent
// ═══════════════════════════════════════════════════════════════════════════════

const Intervention2A = () => {
  const navigate = useNavigate();
  const { dataManager, userId } = useUserStats();
  const responseManager = getResponseManager(dataManager);

  const [currentPage, setCurrentPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef(null);
  const mousePositionsRef = useRef([]);
  const trackingStartRef = useRef(Date.now());
  const startTime = useRef(Date.now());

  // Guard — mission3
  useEffect(() => {
    (async () => {
      const prog = await dataManager.loadUserProgress(userId);
      if (!prog.mission3_unlocked && !dataManager.isAdmin(userId)) {
        navigate('/mainmenu');
      }
    })();
  }, [dataManager, userId, navigate]);

  // Autosave času
  useEffect(() => {
    const autoSave = setInterval(async () => {
      const t = Math.floor((Date.now() - startTime.current) / 1000);
      await responseManager.saveAnswer(userId, COMPONENT_ID, 'time_spent_seconds', t, {
        last_autosave: new Date().toISOString(),
        current_page: currentPage,
      });
    }, 5000);
    return () => clearInterval(autoSave);
  }, [userId, responseManager, currentPage]);

  // ── Mouse tracking ────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    mousePositionsRef.current = [];
    trackingStartRef.current = Date.now();

    const templateTimer = setTimeout(() => {
      generateAndUploadComponentTemplate(
        container,
        `intervention2A_${PAGES[currentPage].key}`,
        'intervention'
      );
    }, 300);

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mousePositionsRef.current.push({
        x: e.clientX - rect.left + window.scrollX,
        y: e.clientY - rect.top + window.scrollY,
        timestamp: Date.now(),
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(templateTimer);
      container.removeEventListener('mousemove', handleMouseMove);

      if (mousePositionsRef.current.length > 0) {
        saveTrackingWithVisualization(
          {
            userId,
            contentId: `intervention2A_${PAGES[currentPage].key}`,
            contentType: 'intervention',
            mousePositions: mousePositionsRef.current,
            landmarks: [],
            containerDimensions: {
              width: container.scrollWidth,
              height: container.scrollHeight,
            },
            timeSpent: Math.floor((Date.now() - trackingStartRef.current) / 1000),
          },
          container
        ).catch(err => console.warn('⚠️ Tracking save failed:', err));
      }
    };
  }, [currentPage, userId]);

  // ── Navigácia ─────────────────────────────────────────────────────────────

  const handleNext = async () => {
    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const finalTime = Math.floor((Date.now() - startTime.current) / 1000);
      await responseManager.saveMultipleAnswers(
        userId,
        COMPONENT_ID,
        {
          time_spent_seconds: finalTime,
          intervention_read: true,
          intervention_type: 'no_trust_building',
          pages_completed: TOTAL_PAGES,
        },
        {
          started_at: new Date(startTime.current).toISOString(),
          completed_at: new Date().toISOString(),
          device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        }
      );
      navigate('/mission3/questionnaire3b');
    } catch (error) {
      console.error('❌ Error saving intervention data:', error);
      alert('Chyba pri ukladaní. Skús to znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const page = PAGES[currentPage];
  const isLastPage = currentPage === TOTAL_PAGES - 1;

  return (
    <Layout>
      <Container>
        <div ref={containerRef}>
          <Card>
            <ProgressBar>
              <ProgressTrack>
                <ProgressFill pct={((currentPage + 1) / TOTAL_PAGES) * 100} />
              </ProgressTrack>
              <ProgressLabel>{currentPage + 1} / {TOTAL_PAGES}</ProgressLabel>
            </ProgressBar>

            <PageTitle>{page.title}</PageTitle>
            <PageSubtitle>{page.subtitle}</PageSubtitle>

            <DetectiveTipSmall
              key={`intro-${currentPage}`}
              tip={page.detectiveTipIntro}
              detectiveName="Inšpektor Kritan"
              autoOpen={true}
              autoOpenDelay={200}
            />

            {page.content}

            <ButtonContainer>
              <StyledButton
                accent
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Ukladám...'
                  : isLastPage
                    ? '🎓 Dokončiť tréning!'
                    : 'Pokračovať ďalej →'}
              </StyledButton>
            </ButtonContainer>
          </Card>
        </div>
      </Container>
    </Layout>
  );
};

export default Intervention2A;
