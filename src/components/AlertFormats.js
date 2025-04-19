import React, { useState } from "react";
import { Snackbar, SnackbarContent, IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";

const baseStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "0.95rem",
  fontWeight: 600,
  px: 2,
  py: 1,
  minWidth: 320,
  maxWidth: 480,
};

const getStyle = (color) => ({
  ...baseStyle,
  backgroundColor: color,
  color: "#fff",
});

const AlertSnackbar = ({ open, onClose, message, icon, style }) => (
  <Snackbar
    open={open}
    autoHideDuration={3000}
    onClose={onClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <SnackbarContent
      message={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon}
          {message}
        </span>
      }
      sx={style}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  </Snackbar>
);

export const SuccessAlert = ({ open, onClose, message }) => (
  <AlertSnackbar
    open={open}
    onClose={onClose}
    message={message}
    icon={<CheckCircleIcon fontSize="small" />}
    style={getStyle("#4caf50")}
  />
);

export const ErrAlert = ({ open, onClose, message }) => (
  <AlertSnackbar
    open={open}
    onClose={onClose}
    message={message}
    icon={<ErrorIcon fontSize="small" />}
    style={getStyle("#f44336")}
  />
);

export const InfoAlert = ({ open, onClose, message }) => (
  <AlertSnackbar
    open={open}
    onClose={onClose}
    message={message}
    icon={<InfoIcon fontSize="small" />}
    style={getStyle("#2196f3")}
  />
);

export const WarningAlert = ({ open, onClose, message }) => (
  <AlertSnackbar
    open={open}
    onClose={onClose}
    message={message}
    icon={<WarningIcon fontSize="small" />}
    style={getStyle("#ff9800")}
  />
);