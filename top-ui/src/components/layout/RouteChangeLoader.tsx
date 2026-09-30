import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@components/common';

/**
 * Simulated route-change loader.
 *
 * Every time the route (pathname) changes, this shows a loading overlay for a
 * fixed duration to mimic waiting for an API response. Once real APIs are wired
 * up, replace the timer with the actual request promise.
 */

// How long to keep the loader visible per navigation (ms).
const LOADER_DURATION = 3000;

const RouteChangeLoader: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // Show the loader on every route change (and on first mount).
    setLoading(true);

    // Simulate an API call that resolves after LOADER_DURATION.
    // Replace this timer with your real API promise, e.g.:
    //   fetchData(location.pathname).finally(() => setLoading(false));
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, LOADER_DURATION);

    return () => {
      window.clearTimeout(timer);
    };
  }, [location.pathname]);

  if (!loading) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        // Above the sidebar (1100/1200) and its overlay so the menu is
        // covered and not clickable while the loader is visible.
        zIndex: (theme) => theme.zIndex.modal + 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        // Block all pointer interaction with underlying UI while loading.
        pointerEvents: 'all',
      }}
    >
      <CircularProgress sx={{ color: '#EB0A1E' }} />
    </Box>
  );
};

export default RouteChangeLoader;
