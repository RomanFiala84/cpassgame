// src/styles/theme.js
// OPTIMALIZOVANÁ FAREBNÁ PALETA - Kráľovská fialová (dark) + Kráľovská modrá (light)

const darkTheme = {
  // 🌙 TMAVÝ REŽIM - Uhlovo šedá + Kráľovská fialová
  BACKGROUND_COLOR: '#2f2f2f',           // Uhlovo šedá
  SECONDARY_BACKGROUND: '#3a3a3a',       // Tieňovo šedá (karty)
  PRIMARY_TEXT_COLOR: '#ffffff',         // Čisto biela
  SECONDARY_TEXT_COLOR: '#ffffff',       // Svetlejšia biela pre sekundárny text
  
// Akcentové farby - Rubínová červená škála 🔴
 ACCENT_COLOR: '#c8a2d0',        // Svetlá pastelová fialová (hlavná)
  ACCENT_COLOR_2: '#ddbee3',      // Svetlejšia levanduľová
  ACCENT_COLOR_3: '#b58fc2',      // Stredná pastelová
  
  CARD_BACKGROUND: '#3a3a3a',
  INPUT_BACKGROUND: '#424242',
  BUTTON_COLOR: '#c8a2d0',
  BORDER_COLOR: '#4a4a4a',
  HOVER_OVERLAY: 'rgba(200, 162, 208, 0.15)',
  
  
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
CCENT_COLOR: '#89cff0',          // Baby blue (hlavná)
  ACCENT_COLOR_2: '#abddef',        // Svetlejšia baby blue
  ACCENT_COLOR_3: '#6bb8db',        // Stredná baby blue
  
  CARD_BACKGROUND: '#ffffff',
  INPUT_BACKGROUND: '#ffffff',
  BUTTON_COLOR: '#89cff0',
  BORDER_COLOR: '#e0f2ff',          // Veľmi svetlá modrá border
  HOVER_OVERLAY: 'rgba(137, 207, 240, 0.12)',
  
  // Stavové farby
  SUCCESS_COLOR: '#50c878',              // Smaragdovo zelená
  ERROR_COLOR: '#ff0000ff',                // Rubínovo červená
  WARNING_COLOR: '#ff8c00',              // Pomarančovo oranžová
};

export { lightTheme, darkTheme };
