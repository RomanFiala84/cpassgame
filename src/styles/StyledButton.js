// src/styles/StyledButton.js
import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.accent ? '#FFFFFF' : props.theme.PRIMARY_TEXT_COLOR};
  background-color: ${props => props.accent ? props.theme.ACCENT_COLOR : props.theme.BUTTON_COLOR};
  border: none;
  outline: none;
  padding: 10px 24px;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  min-width: 120px;

  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
  }
`;

const StyledButton = ({ children, accent, ...props }) => {
  return (
    <Button accent={accent} {...props}>
      {children}
    </Button>
  );
};

export default StyledButton;
