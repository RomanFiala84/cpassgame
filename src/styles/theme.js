// src/styles/theme.js
// OPTIMALIZOVANÁ FAREBNÁ PALETA - Fialová/Čierna (dark) + Béžová/Tyrkysová (light)

const darkTheme = {
  // 🌙 TMAVÝ REŽIM - Čierna + Fialová
  BACKGROUND_COLOR: '#0a0a0a',           // Hlboká čierna
  PRIMARY_TEXT_COLOR: '#ffffff',         // Biela
  SECONDARY_TEXT_COLOR: '#b8b8b8',       // Svetlošedá
  
  // Akcentové farby - Fialová škála
  ACCENT_COLOR: '#9d4edd',               // Jasná fialová (hlavná)
  ACCENT_COLOR_2: '#c77dff',             // Svetlejšia fialová
  ACCENT_COLOR_3: '#7b2cbf',             // Tmavšia fialová
  
  // Komponenty
  CARD_BACKGROUND: '#1a1a1a',            // Tmavošedá karta
  INPUT_BACKGROUND: '#2a2a2a',           // Tmavé inputy
  BUTTON_COLOR: '#9d4edd',               // Fialové tlačidlo
  BORDER_COLOR: '#2d2d2d',               // Jemný border
  HOVER_OVERLAY: 'rgba(157, 78, 221, 0.1)', // Fialový hover
  
  // Dodatočné farby
  SUCCESS_COLOR: '#10b981',              // Zelená pre success
  ERROR_COLOR: '#ef4444',                // Červená pre error
  WARNING_COLOR: '#f59e0b',              // Oranžová pre warning
};

const lightTheme = {
  // ☀️ SVETLÝ REŽIM - Béžová + Tyrkysová
  BACKGROUND_COLOR: '#faf7f2',           // Svetlá béžová
  PRIMARY_TEXT_COLOR: '#1a1a1a',         // Tmavošedá (nie čierna)
  SECONDARY_TEXT_COLOR: '#6b6b6b',       // Strednošedá
  
  // Akcentové farby - Tyrkysová škála
  ACCENT_COLOR: '#14b8a6',               // Tyrkysová (hlavná)
  ACCENT_COLOR_2: '#0d9488',             // Tmavšia tyrkysová
  ACCENT_COLOR_3: '#2dd4bf',             // Svetlejšia tyrkysová
  
  // Komponenty
  CARD_BACKGROUND: '#ffffff',            // Biela karta
  INPUT_BACKGROUND: '#f5f5f5',           // Svetlošedé inputy
  BUTTON_COLOR: '#14b8a6',               // Tyrkysové tlačidlo
  BORDER_COLOR: '#e5ddd1',               // Béžový border
  HOVER_OVERLAY: 'rgba(20, 184, 166, 0.08)', // Tyrkysový hover
  
  // Dodatočné farby
  SUCCESS_COLOR: '#10b981',              // Zelená
  ERROR_COLOR: '#ef4444',                // Červená
  WARNING_COLOR: '#f59e0b',              // Oranžová
};

export { lightTheme, darkTheme };
