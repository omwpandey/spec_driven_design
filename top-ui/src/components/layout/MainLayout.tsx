import React from 'react';
import { Box, IconButton, useMediaQuery, useTheme, Drawer, ChevronRightIcon, ChevronLeftIcon, MenuIcon } from '@components/common';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Header from './Header';
import Sidebar from './Sidebar';
import RouteChangeLoader from './RouteChangeLoader';
import { useAppDispatch, useAppSelector } from '@store';
import { toggleSidebar, setSidebarCollapsed } from '@store/slices/appSlice';
import { colors } from '@core/theme';

const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sidebarCollapsed } = useAppSelector((state) => state.app);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Auto-collapse sidebar on smaller screens
  React.useEffect(() => {
    if (isMobile) {
      dispatch(setSidebarCollapsed(true));
    }
  }, [isMobile, dispatch]);

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      dispatch(toggleSidebar());
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', borderRadius: 0 }}>
      {/* Top Bar - Dealer Info */}
      <TopBar />

      {/* Header with Search */}
      <Header onMenuClick={handleToggle} isMobile={isMobile} />

      {/* Body */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Sidebar />

            {/* Toggle Button - Red circle with chevron */}
            <IconButton
              onClick={handleToggle}
              size="small"
              sx={{
                position: 'absolute',
                // Align vertically with the first (Home) menu item's icon:
                // list top padding (4px) + item margin (2px) + half of the item height (2.5rem / 2)
                top: 'calc(4px + 2px + 1.25rem)',
                right: -14,
                transform: 'translateY(-50%)',
                zIndex: 1200,
                width: 28,
                height: 28,
                backgroundColor: '#EB0A1E',
                color: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                '&:hover': { backgroundColor: '#eb0a1dd0' },
              }}
            >
              {sidebarCollapsed ? (
                <ChevronRightIcon sx={{ fontSize: 18 }} />
              ) : (
                <ChevronLeftIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Box>
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => {
              setMobileOpen(false);
            }}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: 'auto',
                overflow: 'visible',
                boxSizing: 'border-box',
              },
            }}
          >
            <Sidebar />
          </Drawer>
        )}

        {/* Content Area */}
        <Box
          component="main"
          sx={{
            position: 'relative',
            flex: 1,
            overflow: 'auto',
            backgroundColor: colors.background.default,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Route transition loader */}
          <RouteChangeLoader />

          {/*
            Global fluid scaling: `zoom` scales the entire page content
            uniformly — fonts, icons, images, spacing — including hardcoded px.
            At >=1440px zoom is 100% (current/default sizes preserved); it
            scales down to ~78% on smaller screens so everything shrinks
            together rather than overflowing. One place controls the whole app.
          */}
          <Box
            data-app-scale
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              p: { xs: 2, sm: 2.5, md: 3 },
              zoom: 'clamp(78%, 5vw + 28%, 100%)',
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
