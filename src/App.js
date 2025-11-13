// src/App.js
// OPRAVENÁ VERZIA - useLocation funguje správne

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './styles/theme';
import ScrollToTop from './styles/ScrollToTop';
import { GlobalStyles } from './styles/GlobalStyles';
import ThemeToggle from './styles/ThemeToggle';
import { UserStatsProvider } from './contexts/UserStatsContext';

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENTS
// ═══════════════════════════════════════════════════════════
import Instruction from './components/main/Instruction';
import Intro from './components/main/Intro';
import MainMenu from './components/main/MainMenu';

// ═══════════════════════════════════════════════════════════
// ADMIN COMPONENTS
// ═══════════════════════════════════════════════════════════
import AdminPanel from './components/admin/AdminPanel';

// ═══════════════════════════════════════════════════════════
// SPECIAL AGENT MISSION (Mission 0)
// ═══════════════════════════════════════════════════════════
import IntroMission0 from './components/missions/mission0/IntroMission0';
import Questionnaire0 from './components/missions/mission0/Questionnaire0';
import OutroMission0 from './components/missions/mission0/OutroMission0';

// ═══════════════════════════════════════════════════════════
// MISSION 1
// ═══════════════════════════════════════════════════════════
import IntroMission1 from './components/missions/mission1/IntroMission1';
import Questionnaire1A from './components/missions/mission1/Questionnaire1A';
import Prevention1 from './components/missions/mission1/Prevention1';
import PostsA1 from './components/missions/mission1/PostsA1';
import Intervention1 from './components/missions/mission1/Intervention1';
import PostsB1 from './components/missions/mission1/PostsB1';
import Questionnaire1B from './components/missions/mission1/Questionnaire1B';
import OutroMission1 from './components/missions/mission1/OutroMission1';

// ═══════════════════════════════════════════════════════════
// MISSION 2
// ═══════════════════════════════════════════════════════════
import IntroMission2 from './components/missions/mission2/IntroMission2';
import Questionnaire2A from './components/missions/mission2/Questionnaire2A';
import Prevention2 from './components/missions/mission2/Prevention2';
import PostsA2 from './components/missions/mission2/PostsA2';
import Intervention2 from './components/missions/mission2/Intervention2';
import PostsB2 from './components/missions/mission2/PostsB2';
import Questionnaire2B from './components/missions/mission2/Questionnaire2B';
import OutroMission2 from './components/missions/mission2/OutroMission2';

// ═══════════════════════════════════════════════════════════
// MISSION 3
// ═══════════════════════════════════════════════════════════
import IntroMission3 from './components/missions/mission3/IntroMission3';
import Questionnaire3A from './components/missions/mission3/Questionnaire3A';
import Prevention3 from './components/missions/mission3/Prevention3';
import PostsA3 from './components/missions/mission3/PostsA3';
import Intervention3 from './components/missions/mission3/Intervention3';
import PostsB3 from './components/missions/mission3/PostsB3';
import Questionnaire3B from './components/missions/mission3/Questionnaire3B';
import OutroMission3 from './components/missions/mission3/OutroMission3';

// ✅ Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center',
          background: '#0a0a0a',
          color: '#ffffff'
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>🚨</h1>
          <h2 style={{ marginBottom: '16px' }}>Niečo sa pokazilo</h2>
          <p style={{ marginBottom: '24px', color: '#b8b8b8' }}>
            Obnovte stránku alebo kontaktujte podporu
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#9d4edd',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            🔄 Obnoviť stránku
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre style={{
              marginTop: '24px',
              padding: '16px',
              background: '#1a1a1a',
              borderRadius: '8px',
              fontSize: '12px',
              textAlign: 'left',
              maxWidth: '600px',
              overflow: 'auto'
            }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// ✅ OPRAVENÉ - AppContent už nepoužíva useLocation
function AppContent() {
  return (
    <Routes>
      {/* ═══════════════════════════════════════════════════════════
          MAIN FLOW
          ═══════════════════════════════════════════════════════════ */}
      <Route path="/" element={<Instruction />} />
      <Route path="/instruction" element={<Instruction />} />
      <Route path="/intro" element={<Intro />} />
      <Route path="/mainmenu" element={<MainMenu />} />
      
      {/* ═══════════════════════════════════════════════════════════
          ADMIN
          ═══════════════════════════════════════════════════════════ */}
      <Route path="/admin" element={<AdminPanel />} />

      {/* ═══════════════════════════════════════════════════════════
          SPECIAL AGENT MISSION (Mission 0)
          ═══════════════════════════════════════════════════════════ */}
      <Route path="/mission0/intro" element={<IntroMission0 />} />
      <Route path="/mission0/questionnaire" element={<Questionnaire0 />} />
      <Route path="/mission0/outro" element={<OutroMission0 />} />

      {/* ═══════════════════════════════════════════════════════════
          MISSION 1
          ═══════════════════════════════════════════════════════════ */}
      <Route path="/mission1/intro" element={<IntroMission1 />} />
      <Route path="/mission1/questionnaire1a" element={<Questionnaire1A />} />
      <Route path="/mission1/prevention" element={<Prevention1 />} />
      <Route path="/mission1/postsa" element={<PostsA1 />} />
      <Route path="/mission1/intervention" element={<Intervention1 />} />
      <Route path="/mission1/postsb" element={<PostsB1 />} />
      <Route path="/mission1/questionnaire1b" element={<Questionnaire1B />} />
      <Route path="/mission1/outro" element={<OutroMission1 />} />

      {/* ═══════════════════════════════════════════════════════════
          MISSION 2
          ═══════════════════════════════════════════════════════════ */}
      <Route path="/mission2/intro" element={<IntroMission2 />} />
      <Route path="/mission2/questionnaire2a" element={<Questionnaire2A />} />
      <Route path="/mission2/prevention" element={<Prevention2 />} />
      <Route path="/mission2/postsa" element={<PostsA2 />} />
      <Route path="/mission2/intervention" element={<Intervention2 />} />
      <Route path="/mission2/postsb" element={<PostsB2 />} />
      <Route path="/mission2/questionnaire2b" element={<Questionnaire2B />} />
      <Route path="/mission2/outro" element={<OutroMission2 />} />

      {/* ═══════════════════════════════════════════════════════════
          MISSION 3
          ═══════════════════════════════════════════════════════════ */}
      <Route path="/mission3/intro" element={<IntroMission3 />} />
      <Route path="/mission3/questionnaire3a" element={<Questionnaire3A />} />
      <Route path="/mission3/prevention" element={<Prevention3 />} />
      <Route path="/mission3/postsa" element={<PostsA3 />} />
      <Route path="/mission3/intervention" element={<Intervention3 />} />
      <Route path="/mission3/postsb" element={<PostsB3 />} />
      <Route path="/mission3/questionnaire3b" element={<Questionnaire3B />} />
      <Route path="/mission3/outro" element={<OutroMission3 />} />

      {/* ✅ 404 Page */}
      <Route path="*" element={
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '72px', marginBottom: '16px' }}>404</h1>
          <p style={{ marginBottom: '24px' }}>Stránka nebola nájdená</p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: '#9d4edd',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            ← Späť na hlavnú stránku
          </button>
        </div>
      } />
    </Routes>
  );
}

function App() {
  const [themeName, setThemeName] = React.useState(() => {
    try {
      return localStorage.getItem('app_theme') || 'dark';
    } catch (e) {
      console.warn('Could not access localStorage:', e);
      return 'dark';
    }
  });

  const theme = themeName === 'light' ? lightTheme : darkTheme;

  const toggleTheme = () => {
    const next = themeName === 'dark' ? 'light' : 'dark';
    setThemeName(next);
    try {
      localStorage.setItem('app_theme', next);
    } catch (e) {
      console.warn('Could not save theme:', e);
    }
  };

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <UserStatsProvider>
          <BrowserRouter>
            <GlobalStyles />
            <ScrollToTop />
            
            {/* Theme Toggle */}
            <div style={{ 
              position: 'fixed', 
              top: '16px', 
              right: '16px', 
              zIndex: 999 
            }}>
              <ThemeToggle themeName={themeName} onToggle={toggleTheme} />
            </div>

            {/* ✅ OPRAVENÉ - AppContent je VNÚTRI BrowserRouter */}
            <AppContent />
          </BrowserRouter>
        </UserStatsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
