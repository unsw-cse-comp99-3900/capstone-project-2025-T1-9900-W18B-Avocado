import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const SwitchUserStatusDialog = ({ open, onClose, onConfirm, user }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="switch-dialog-title"
      aria-describedby="switch-dialog-description"
    >
      <DialogTitle id="switch-dialog-title">
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="warning" />
          <Typography variant="h6" fontWeight="bold">Switch User Status</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        Are you sure you want to{" "}
        <strong>{user?.active ? "disable" : "enable"}</strong> user{" "}
        <strong>{user?.name || "Unknown"}</strong> <strong>(ID: {user?.id || "Unknown"})</strong>?
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SwitchUserStatusDialog;