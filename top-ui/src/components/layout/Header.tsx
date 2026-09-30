import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import {
  Box,
  Typography,
  Button,
  InputBase,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  SearchIcon,
  PersonIcon,
  SettingsIcon,
  LogoutIcon,
  LockIcon,
  NotificationsIcon,
  MenuIcon,
} from '@components/common';
import { ListItemIcon, ListItemText } from '@components/common';
import MuiAvatar from '@components/common/MuiAvatar';
import MuiBadge from '@components/common/MuiBadge';
import { useAppDispatch, useAppSelector } from '@store';
import { logout } from '@store/slices/authSlice';
import { APP_DEFAULTS } from '@constants/appDefaults';
import { LanguageSwitcher } from '@components/common';
import { useTranslation } from '@hooks';
import { KeyboardArrowDownIcon } from '@components/common';

const searchTabKeys = ['header_search_plate', 'header_search_mobile', 'header_search_phone', 'header_search_name', 'header_search_vin'];

interface HeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isMobile = false }) => {
  const configUser = useAppSelector((state) => state.config.user);
  const authUser = useAppSelector((state) => state.auth.user);
  const user = authUser
    ? {
        ...configUser,
        name: authUser.name || configUser.name,
        initials:
          authUser.name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || configUser.initials,
        email: authUser.email || configUser.email,
        role: authUser.role || configUser.role,
      }
    : configUser;
  const dispatch = useAppDispatch();
  const { instance } = useMsal();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('header_search_plate');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const profileMenuOpen = Boolean(anchorEl);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    void instance.logoutRedirect();
  };

  return (
    <Box
      sx={{
        backgroundColor: '#EB0A1E',
        height: { xs: 60, md: 56 },
        display: 'flex',
        alignItems: 'center',
        px: { xs: 1, sm: 1.5, md: 2 },
        gap: 0.5,
      }}
    >
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton onClick={onMenuClick} size="small" sx={{ mr: 0.5, color: '#FFFFFF' }}>
          <MenuIcon />
        </IconButton>
      )}

      {/* Logo */}
      <Box sx={{ flexShrink: 0, width: { xs: 'auto', sm: '10rem', md: '13rem', lg: '16.5rem' } }}>
          <Typography
            sx={{
              fontWeight: 700,
              color: '#FFFFFF',
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
              whiteSpace: 'nowrap',
              mr: { xs: 0.5, md: 1.5 },
              letterSpacing: '0.5px',
              display: { xs: 'none', sm: 'block' },
              width:'6.063rem',
              height:'2.125rem',
            }}
          >
            TOYOTA{' '}
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                color: '#FFFFFF',
                letterSpacing: '0.1px',
                fontFamily: 'Prompt',
              }}
            >
              TopsCRM
            </Typography>
          </Typography>
      </Box>

      {/* Search Tabs - Hidden on small and medium screens */}
      <Box sx={{ ml: { lg: '1.188%' }, flexShrink: 0, display: { xs: 'none', lg: 'block' } }}>
        {!isSmall && (
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: '0.625rem' }}>
            {searchTabKeys.map((tabKey) => (
              <Button
                key={tabKey}
                size="small"
                onClick={() => setActiveTab(tabKey)}
                sx={{
                  minWidth: { sm: 56, md: 64 },
                  height: { sm: 28, md: 30 },
                  fontSize: { sm: '0.75rem', md: '0.8125rem' },
                  fontWeight: 500,
                  color: activeTab === tabKey ? '#EB0A1E' : '#58595B',
                  backgroundColor: activeTab === tabKey ? '#FFFFFF' : '#FFE5E5',
                  border: 'none',
                  borderRadius: '6px',
                  px: { sm: 1.5, md: 2 },
                  textTransform: 'none',
                  lineHeight: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: activeTab === tabKey ? '#FFFFFF' : '#FFD6D6',
                    boxShadow: 'none',
                  },
                }}
              >
                {t(tabKey)}
              </Button>
            ))}
          </Box>
        )}
      </Box>
      {/* Search Input */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid rgba(255,255,255,0.3)',
          backgroundColor: '#FFFFFF',
          borderRadius: '15rem',
          px: 1,
          height: { xs: 28, md: 36 },
          flex: { xs: '1 1 auto', sm: '1 1 200px', md: '1 1 331px' },
          minWidth: 0,
          maxWidth: { md: '20.688rem' },
          ml: { xs: 0.5, sm: 1 },
        }}
      >
        <SearchIcon sx={{ color: '#49454F', fontSize: '1rem', flexShrink: 0 }} />
        <InputBase
          placeholder={t('search_btn')}
          sx={{
            ml: 0.5,
            color: '#111111',
            backgroundColor: '#FFFFFF',
            borderRadius: '15rem',
            fontSize: '0.8125rem',
            flex: 1,
            minWidth: 0,
            '& input::placeholder': { color: 'rgba(0,0,0,0.5)', opacity: 1 },
          }}
        />
      </Box>

      {/* Search Button */}
      <Box sx={{margin:'0'}}>
        <Button
          variant="contained"
          size="small"
          startIcon={!isSmall ? <SearchIcon sx={{ fontSize: '1rem' }} /> : undefined}
          sx={{
            backgroundColor: '#ffffff',
            color: '#EB0A1E',
            height: { xs: 28, md: 30 },
            fontSize: '0.8125rem',
            fontWeight: 500,
            px: { xs: 1.5, md: 2 },
            textTransform: 'none',
            borderRadius: '15rem',
            boxShadow: 'none',
            minWidth: { xs: 36, md: 'auto' },
            '&:hover': { backgroundColor: '#ffffff', boxShadow: 'none' },
          }}
        >
          {isSmall ? <SearchIcon sx={{ fontSize: 16 }} /> : t('search_btn')}
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }} />

      {/* Right Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, md: 1.5 } }}>
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Profile Section with Dropdown */}
        <Box
          onClick={handleProfileClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            cursor: 'pointer',
            px: 0.5,
            py: 0.25,
            borderRadius: 1,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
          }}
        >
          <MuiBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#4CAF50',
                color: '#4CAF50',
                width: 10,
                height: 10,
                borderRadius: '50%',
                border: '2px solid #FFFFFF',
              },
            }}
          >
            <MuiAvatar
              sx={{
                width: { xs: 26, md: 28 },
                height: { xs: 26, md: 28 },
                backgroundColor: '#ffffff',
                color: '#EB0A1E',
                fontSize: '0.65rem',
                fontWeight: 600,
              }}
            >
              {user?.initials ?? APP_DEFAULTS.user.initials}
            </MuiAvatar>
          </MuiBadge>
          {!isSmall && (
            <Box>
              <Typography
                sx={{ color: '#FFFFFF', fontSize: '0.75rem', lineHeight: 1.3, fontWeight: 500 }}
              >
                {user?.name ?? APP_DEFAULTS.user.name}
              </Typography>
              <Typography
                sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.625rem', lineHeight: 1.2 }}
              >
                {user?.role ?? APP_DEFAULTS.user.role}
              </Typography>
            </Box>
          )}
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.625rem', ml: 0.25, display: { xs: 'none', sm: 'block' } }}>
            <KeyboardArrowDownIcon />
          </Typography>
        </Box>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={profileMenuOpen}
          onClose={handleProfileClose}
          onClick={handleProfileClose}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 1,
                boxShadow: '0px 4px 16px rgba(0,0,0,0.12)',
                '& .MuiMenuItem-root': {
                  fontSize: '0.8125rem',
                  py: 1,
                  px: 2,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #E0E0E0' }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name ?? APP_DEFAULTS.user.name}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#666666' }}>{user?.email ?? APP_DEFAULTS.user.email}</Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: '#999999', mt: 0.25 }}>
              {t('profile_role')}: {user?.role ?? APP_DEFAULTS.user.role}
            </Typography>
          </Box>
          <MenuItem>
            <ListItemIcon><PersonIcon sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText>{t('profile_my_profile')}</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon><LockIcon sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText>{t('profile_change_password')}</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon><NotificationsIcon sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText>{t('profile_notifications')}</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon><SettingsIcon sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText>{t('profile_settings')}</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: '#CC0000' }}>
            <ListItemIcon><LogoutIcon sx={{ fontSize: 18, color: '#CC0000' }} /></ListItemIcon>
            <ListItemText>{t('profile_logout')}</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
