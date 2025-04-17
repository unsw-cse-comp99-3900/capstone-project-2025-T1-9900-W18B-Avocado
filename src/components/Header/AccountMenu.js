import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RedeemIcon from '@mui/icons-material/Redeem';
import { AiOutlineRadarChart } from "react-icons/ai";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const role = localStorage.getItem("userRole");
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                transition: 'background-color 0.3s',
                backgroundColor: open ? '#a8e847' : '#235858',
                '&:hover': {
                  backgroundColor: '#a8e847',
                },
              }}
            >
              <PersonIcon fontSize="small" />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <Avatar>
            <PersonIcon fontSize="small" />
          </Avatar>
          Profile
        </MenuItem>

        <Divider />

        {/* ✅ 非 Admin 用户显示这些选项 */}
        {role !== "Admin" && ([
          <MenuItem key="schedule" onClick={() => navigate('/schedule')}>
            <ListItemIcon>
              <EventIcon fontSize="small" />
            </ListItemIcon>
            Schedule
          </MenuItem>,

          <MenuItem key="reward-history" onClick={() => navigate('/reward-history')}>
            <ListItemIcon>
              <EmojiEventsIcon fontSize="small" />
            </ListItemIcon>
            Event & Reward History
          </MenuItem>,

          <MenuItem key="redeem" onClick={() => navigate('/redeem')}>
            <ListItemIcon>
              <RedeemIcon fontSize="small" />
            </ListItemIcon>
            Redeem Reward
          </MenuItem>,

          <MenuItem key="career-coach" onClick={() => navigate('/settings')}>
            <ListItemIcon>
              <AiOutlineRadarChart fontSize="20px" />
            </ListItemIcon>
            Career Coach
          </MenuItem>,

          <Divider key="divider-bottom" />
        ])}

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
