// src/styles/theme.js
// OPTIMALIZOVANÁ FAREBNÁ PALETA - Kráľovská fialová (dark) + Kráľovská modrá (light)

const darkTheme = {
  // 🌙 TMAVÝ REŽIM - Uhlovo šedá + Kráľovská fialová
  BACKGROUND_COLOR: '#2f2f2f',           // Uhlovo šedá
  SECONDARY_BACKGROUND: '#3a3a3a',       // Tieňovo šedá (karty)
  PRIMARY_TEXT_COLOR: '#ffffff',         // Čisto biela
  SECONDARY_TEXT_COLOR: '#ffffff',       // Svetlejšia biela pre sekundárny text
  
// Akcentové farby - Rubínová červená škála 🔴
 ACCENT_COLOR: '#b565d8',          // Sýtejšia fialová (hlavná)
  ACCENT_COLOR_2: '#d084f0',        // Svetlejšia sýta
  ACCENT_COLOR_3: '#9b4ec7',        // Tmavšia sýta
  
  CARD_BACKGROUND: '#3a3a3a',
  INPUT_BACKGROUND: '#424242',
  BUTTON_COLOR: '#b565d8',
  BORDER_COLOR: '#4a4a4a',
  HOVER_OVERLAY: 'rgba(181, 101, 216, 0.18)',
  
  
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
  ACCENT_COLOR: '#b565d8',          // Sýtejšia fialová (hlavná)
  ACCENT_COLOR_2: '#d084f0',        // Svetlejšia sýta
  ACCENT_COLOR_3: '#9b4ec7',        // Tmavšia sýta
  
  CARD_BACKGROUND: '#3a3a3a',
  INPUT_BACKGROUND: '#424242',
  BUTTON_COLOR: '#b565d8',
  BORDER_COLOR: '#4a4a4a',
  HOVER_OVERLAY: 'rgba(181, 101, 216, 0.18)',
  
  // Stavové farby
  SUCCESS_COLOR: '#50c878',              // Smaragdovo zelená
  ERROR_COLOR: '#ff0000ff',                // Rubínovo červená
  WARNING_COLOR: '#ff8c00',              // Pomarančovo oranžová
};

export { lightTheme, darkTheme };
