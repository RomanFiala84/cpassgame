import React from 'react';
import styled from 'styled-components';

const Toggle = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.BORDER_COLOR};
  background: ${props => props.theme.BUTTON_COLOR};
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-size: 14px;
`;

const ThemeToggle = ({ themeName, onToggle }) => {
  return <Toggle onClick={onToggle}>{themeName === 'dark' ? '🌙 Dark' : '☀️ Light'}</Toggle>;
};

export default ThemeToggle;