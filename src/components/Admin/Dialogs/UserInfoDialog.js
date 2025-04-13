import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Chip,
  Grid
} from '@mui/material';
import CloseIconButton from '../../Buttons/CloseIconButton';

const UserInfoDialog = ({ open, onClose, user }) => {
  const [selectedTab, setSelectedTab] = useState('info');

  const isReady = Boolean(user);

  const renderContent = () => {
    if (!isReady) {
      return <Typography>Loading user data...</Typography>;
    }

    switch (selectedTab) {
      case 'info':
        return (
            <Box p={2}>
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
                    <Typography variant="h6"><strong>Events Attended:</strong> {user?.eventHistory?.length ?? 0}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6"><strong>Total Rewards:</strong> {user?.rewards ?? 0} points</Typography>
                </Grid>
                </Grid>
            </Box>
        );
      case 'event':
        return (
          <Box>
            <Typography variant="h6">Event History</Typography>
            <ul>
              {(user?.eventHistory ?? []).map((event, idx) => (
                <li key={idx}>{event}</li>
              ))}
            </ul>
          </Box>
        );
      case 'reward':
        return (
          <Box>
            <Typography variant="h6">Reward Details</Typography>
            <Typography>No reward history available (mock here)</Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <CloseIconButton onClick={onClose} />
      <Box display="flex" minHeight={400}>
        {/* Sidebar */}
        <Box width="200px" bgcolor="#f5f5f5" p={2}>
            <List>
                {[
                { key: 'info', label: 'User Info' },
                { key: 'event', label: 'Event History' },
                { key: 'reward', label: 'Reward Details' },
                ].map((tab) => {
                const isActive = selectedTab === tab.key;
                return (
                    <ListItem
                    key={tab.key}
                    button
                    onClick={() => setSelectedTab(tab.key)}
                    sx={{
                        borderRadius: '5px',
                        fontWeight: '800',
                        backgroundColor: isActive ? '#1976d2' : 'transparent',
                        color: isActive ? '#ffffff' : '#000000',
                        '&:hover': {
                        color: isActive ? '#1976d2' : '#000000',
                        backgroundColor: isActive ? '#d5d5d5' : '#eeeeee', // 如果未选中再变灰
                        },
                    }}
                    >
                    <ListItemText primary={tab.label} />
                    </ListItem>
                );
                })}
            </List>
            </Box>
        {/* Main content */}
        <Box flex={1} p={3}>
        <DialogContent sx={{ pt: 0, pb: 3, px: 4 }}>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Chip
                label={`ID: ${user?.id ?? 'N/A'}`}
                variant="outlined"
                color="primary"
                size="medium"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            {renderContent()}
          </Box>
        </DialogContent>

        </Box>
      </Box>
    </Dialog>
  );
};

export default UserInfoDialog;
