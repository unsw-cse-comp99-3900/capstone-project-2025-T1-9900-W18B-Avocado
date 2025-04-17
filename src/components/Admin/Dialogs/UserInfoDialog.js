import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Chip,
  Grid
} from '@mui/material';
import CloseIconButton from '../../Buttons/CloseIconButton';

const UserInfoDialog = ({ open, onClose, user }) => {
  const isReady = Boolean(user);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <CloseIconButton onClick={onClose} />
      <DialogContent sx={{ pt: 3, pb: 4, px: 4 }}>
        {!isReady ? (
          <Typography>Loading user data...</Typography>
        ) : (
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Chip
                label={`ID: ${user?.studentID ?? 'N/A'}`}
                variant="outlined"
                color="success"
                size="medium"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6"><strong>Name:</strong> {user.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6"><strong>Email:</strong> {user.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6"><strong>Arc Member:</strong> {user.isArcMember ? 'Yes' : 'No'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6"><strong>Graduation Year:</strong> {user.graduationYear}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6"><strong>Faculty:</strong> {user.faculty}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6"><strong>Degree:</strong> {user.degree}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6"><strong>Events Attended:</strong>{user.eventHistory?.length || 0}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6"><strong>Total Rewards:</strong> {user?.reward ?? 0} points</Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserInfoDialog;