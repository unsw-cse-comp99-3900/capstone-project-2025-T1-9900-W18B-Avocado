import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const DeleteEventDialog = ({ open, onClose, onConfirm, event }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon color="error" />
            <Typography variant="h6" fontWeight="bold">Confirm Deletion</Typography>
        </Box>
        </DialogTitle>
      <DialogContent>
        Are you sure you want to delete event{" "}
        <strong>{event?.name || "Unknown"}</strong>?
        This action cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteEventDialog;