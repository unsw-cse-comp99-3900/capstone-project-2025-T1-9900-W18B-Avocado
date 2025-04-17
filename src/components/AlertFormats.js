import React from 'react';
import { Alert } from '@mui/material';

export const ErrAlert = ({ children }) => (
  <Alert severity="error">{children}</Alert>
);

export const SuccessAlert = ({ children }) => (
  <Alert severity="success">{children}</Alert>
);

export const InfoAlert = ({ children }) => (
  <Alert severity="info">{children}</Alert>
);

export const WarningAlert = ({ children }) => (
  <Alert severity="warning">{children}</Alert>
);