// src/styles/theme.js
// ✅ FINÁLNA VERZIA - Obe témy fialové, optimalizované pre čitateľnosť

const darkTheme = {
  // 🌙 TMAVÝ REŽIM - Uhlovo šedá + Kráľovská fialová
  BACKGROUND_COLOR: '#2f2f2f',
  SECONDARY_BACKGROUND: '#3a3a3a',
  PRIMARY_TEXT_COLOR: '#ffffff',
  SECONDARY_TEXT_COLOR: '#e0e0e0',
  
  // ✅ Akcentové farby - Kráľovská fialová škála 💜
  ACCENT_COLOR: '#b565d8',
  ACCENT_COLOR_2: '#d084f0',
  ACCENT_COLOR_3: '#9b4ec7',
  
  CARD_BACKGROUND: '#3a3a3a',
  INPUT_BACKGROUND: '#424242',
  BUTTON_COLOR: '#b565d8',
  BORDER_COLOR: '#4a4a4a',
  HOVER_OVERLAY: 'rgba(181, 101, 216, 0.18)',
  
  // Stavové farby
  SUCCESS_COLOR: '#50c878',
  ERROR_COLOR: '#ff0000',
  WARNING_COLOR: '#ff8c00',
};

const lightTheme = {
  // ☀️ SVETLÝ REŽIM - Perlovo biela + Kráľovská fialová
  BACKGROUND_COLOR: '#f8f8ff',
  SECONDARY_BACKGROUND: '#ffffff',
  PRIMARY_TEXT_COLOR: '#000000',
  SECONDARY_TEXT_COLOR: '#4a4a4a',
  
  // ✅ Akcentové farby - Kráľovská fialová škála 💜 (ROVNAKÉ AKO DARK)
  ACCENT_COLOR: '#b565d8',
  ACCENT_COLOR_2: '#d084f0',
  ACCENT_COLOR_3: '#9b4ec7',
  
  CARD_BACKGROUND: '#ffffff',
  INPUT_BACKGROUND: '#ffffff',
  BUTTON_COLOR: '#b565d8',
  BORDER_COLOR: '#d8d0e8', // ✅ Svetlo fialová border (namiesto modrej)
  HOVER_OVERLAY: 'rgba(181, 101, 216, 0.15)',
  
  // Stavové farby
  SUCCESS_COLOR: '#50c878',
  ERROR_COLOR: '#ff0000',
  WARNING_COLOR: '#ff8c00',
};

export { lightTheme, darkTheme };
