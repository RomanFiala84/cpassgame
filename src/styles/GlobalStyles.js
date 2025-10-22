import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: ${props => props.theme.BACKGROUND_COLOR};
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    min-height: 100vh;
    transition: background-color 240ms ease, color 240ms ease;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 14px;
    line-height: 1.5;
  }

  a { 
    color: ${props => props.theme.ACCENT_COLOR}; 
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  input, textarea {
    background: ${props => props.theme.INPUT_BACKGROUND};
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    border: 1px solid ${props => props.theme.BORDER_COLOR};
    transition: background 240ms ease, color 240ms ease, border-color 240ms ease;
    font-family: inherit;
    font-size: 14px;
    border-radius: 8px;
    padding: 10px 12px;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.ACCENT_COLOR};
    }
  }

  button {
    cursor: pointer;
    font-family: inherit;
    background: ${props => props.theme.BUTTON_COLOR};
    color: #FFFFFF;
    border: none;
    transition: background 180ms ease, opacity 120ms ease;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    padding: 8px 16px;
    
    &:hover {
      opacity: 0.8;
    }
    
    &:active {
      transform: scale(0.98);
    }
    
    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
`;
