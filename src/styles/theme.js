// src/styles/theme.js
// OPTIMALIZOVANÁ FAREBNÁ PALETA - Kráľovská fialová (dark) + Kráľovská modrá (light)

const darkTheme = {
  // 🌙 TMAVÝ REŽIM - Uhlovo šedá + Kráľovská fialová
  BACKGROUND_COLOR: '#2f2f2f',           // Uhlovo šedá
  SECONDARY_BACKGROUND: '#3a3a3a',       // Tieňovo šedá (karty)
  PRIMARY_TEXT_COLOR: '#ffffff',         // Čisto biela
  SECONDARY_TEXT_COLOR: '#ffffff',       // Svetlejšia biela pre sekundárny text
  
// Akcentové farby - Rubínová červená škála 🔴
  ACCENT_COLOR: '#ff2d75',        // Jasná magenta (hlavná)
  ACCENT_COLOR_2: '#ff5e95',      // Svetlá ružová magenta
  ACCENT_COLOR_3: '#e91e63',      // Material Design Pink
  
  CARD_BACKGROUND: '#3a3a3a',
  INPUT_BACKGROUND: '#424242',
  BUTTON_COLOR: '#ff2d75',
  BORDER_COLOR: '#4a4a4a',
  HOVER_OVERLAY: 'rgba(255, 45, 117, 0.15)',
  
  // Stavové farby
  SUCCESS_COLOR: '#50c878',              // Smaragdovo zelená
  ERROR_COLOR: '#ff0000ff',                // Rubínovo červená
  WARNING_COLOR: '#ff8c00',              // Pomarančovo oranžová
};

const lightTheme = {
  // ☀️ SVETLÝ REŽIM - Perlovo biela + Kráľovská modrá
  BACKGROUND_COLOR: '#f8f8ff',           // Perlovo biela
  SECONDARY_BACKGROUND: '#ffffff',       // Jasnejšia biela (karty)
  PRIMARY_TEXT_COLOR: '#000000',         // Čisto čierna
  SECONDARY_TEXT_COLOR: '#000000',       // Tmavošedá pre sekundárny text
  
  // Akcentové farby - Kráľovská modrá škála
  ACCENT_COLOR: '#4169e1',               // Kráľovská modrá (hlavná)
  ACCENT_COLOR_2: '#6495ed',             // Svetlejšia kráľovská modrá
  ACCENT_COLOR_3: '#1e3a8a',             // Tmavšia kráľovská modrá
  
  // Komponenty
  CARD_BACKGROUND: '#ffffff',            // Jasnejšia biela karta
  INPUT_BACKGROUND: '#fafafa',           // Svetlé inputy
  BUTTON_COLOR: '#4169e1',               // Modré tlačidlo
  BORDER_COLOR: '#e8e8f0',               // Jemný perlovobiely border
  HOVER_OVERLAY: 'rgba(65, 105, 225, 0.08)', // Modrý hover
  
  // Stavové farby
  SUCCESS_COLOR: '#50c878',              // Smaragdovo zelená
  ERROR_COLOR: '#ff0000ff',                // Rubínovo červená
  WARNING_COLOR: '#ff8c00',              // Pomarančovo oranžová
};

export { lightTheme, darkTheme };
