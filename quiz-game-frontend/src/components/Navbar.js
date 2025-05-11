import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { Menu as MenuIcon, EmojiEvents, Home, Person, SportsEsports } from '@mui/icons-material';
import { motion } from 'framer-motion';

const navItems = [
  {
    text: 'Trang Chủ',
    path: '/',
    icon: <Home />,
  },
  {
    text: 'Chơi Game',
    path: '/game',
    icon: <SportsEsports />,
  },
  {
    text: 'Bảng Xếp Hạng',
    path: '/leaderboard',
    icon: <EmojiEvents />,
  },
  {
    text: 'Hồ Sơ',
    path: '/game',
    icon: <Person />,
  },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    setProfileDialogOpen(true);
  };

  const handleProfileDialogClose = () => {
    setProfileDialogOpen(false);
    setPlayerName('');
    setError('');
  };

  const handleProfileSubmit = () => {
    if (!playerName.trim()) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }
    navigate(`/profile/${playerName.trim()}`);
    handleProfileDialogClose();
  };

  const handleNavItemClick = (item, e) => {
    if (item.text === 'Hồ Sơ') {
      handleProfileClick(e);
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Quiz Game
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={(e) => handleNavItemClick(item, e)}
            selected={location.pathname === item.path}
            sx={{
              color: 'inherit',
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'background.paper' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <EmojiEvents sx={{ color: 'primary.main' }} />
            Quiz Game
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  onClick={(e) => handleNavItemClick(item, e)}
                  startIcon={item.icon}
                  color={location.pathname === item.path ? 'primary' : 'inherit'}
                  variant={location.pathname === item.path ? 'contained' : 'text'}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Profile Dialog */}
      <Dialog 
        open={profileDialogOpen} 
        onClose={handleProfileDialogClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: `linear-gradient(45deg, ${theme.palette.background.paper} 30%, ${theme.palette.background.default} 90%)`,
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}>
          <Person color="primary" />
          Xem Hồ Sơ Người Chơi
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Tên người chơi"
            type="text"
            fullWidth
            variant="outlined"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError('');
            }}
            error={!!error}
            helperText={error}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleProfileDialogClose}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleProfileSubmit}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Xem Hồ Sơ
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default Navbar; 