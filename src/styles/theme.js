// ✅ FINÁLNA VERZIA - Fialová schéma, optimalizovaná pre čitateľnosť
// 🎨 Moderná, elegantná, príjemná na oči

const darkTheme = {
  // 🌙 TMAVÝ REŽIM - Tmavošedá + fialová pastel
  BACKGROUND_COLOR: '#1a1a1a',
  SECONDARY_BACKGROUND: '#242424',
  PRIMARY_TEXT_COLOR: '#ffffff',
  SECONDARY_TEXT_COLOR: '#ff4848',
  
  // ✅ Akcentové farby - Fialová škála 💜
  ACCENT_COLOR: '#a78bfa', // Pastelová fialová (svetlejšia)
  ACCENT_COLOR_2: '#9333ea', // Stredná fialová
  ACCENT_COLOR_3: '#7e22ce', // Tmavšia fialová
  
  CARD_BACKGROUND: '#2a2a2a',
  INPUT_BACKGROUND: '#303030',
  BUTTON_COLOR: '#a78bfa',
  BORDER_COLOR: '#404040',
  HOVER_OVERLAY: 'rgba(167, 139, 250, 0.12)',
  
  // Stavové farby
  SUCCESS_COLOR: '#6ee7b7', // ⬅️ Svetlejšia zelená (miesto #4ce16c)
  ERROR_COLOR: '#fca5a5', // ⬅️ Svetlejšia červená (miesto #ff0000)
  WARNING_COLOR: '#fbbf24', // ⬅️ Svetlejšia oranžová (miesto #ff8c00)
};

const lightTheme = {
  // ☀️ SVETLÝ REŽIM - Stredná šedá + tmavá fialová
  BACKGROUND_COLOR: '#d8d8d8', // Stredná šedá (nesvietí)
  SECONDARY_BACKGROUND: '#c8c8c8',
  PRIMARY_TEXT_COLOR: '#000000',
  SECONDARY_TEXT_COLOR: '#ff4848',
  
  // ✅ Akcentové farby - Fialová škála 💜
  ACCENT_COLOR: '#7c3aed', // Tmavá fialová (funguje aj ako pozadie)
  ACCENT_COLOR_2: '#6d28d9', // Stredná fialová
  ACCENT_COLOR_3: '#5b21b6', // Najtemnejšia fialová
  
  CARD_BACKGROUND: '#e8e8e8', // Svetlejšia než pozadie
  INPUT_BACKGROUND: '#f0f0f0', // Najsvetlejšia (ale nie biela)
  BUTTON_COLOR: '#7c3aed',
  BORDER_COLOR: '#b0b0b0',
  HOVER_OVERLAY: 'rgba(124, 58, 237, 0.08)',
  
  // Stavové farby
  SUCCESS_COLOR: '#059669', // Tmavá zelená
  ERROR_COLOR: '#dc2626', // Tmavá červená
  WARNING_COLOR: '#d97706', // Tmavá oranžová
};

export { lightTheme, darkTheme };
