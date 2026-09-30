/**
 * Network Status Banner
 *
 * Displays a persistent banner when the user loses internet connectivity
 * or has a slow connection. Auto-dismisses when connection is restored.
 */

import React from 'react';
import { Box, Typography, Slide, WifiOffIcon, SlowIcon } from '@components/common';
import { useErrorContext } from './ErrorContext';

const NetworkStatusBanner: React.FC = () => {
  const { networkStatus } = useErrorContext();

  if (networkStatus.isOnline && !networkStatus.isSlowConnection) {
    return null;
  }

  const isOffline = !networkStatus.isOnline;

  return (
    <Slide direction="down" in={isOffline || networkStatus.isSlowConnection} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: isOffline ? '#D32F2F' : '#F57C00',
          color: '#FFFFFF',
          py: 1,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
        role="alert"
        aria-live="assertive"
      >
        {isOffline ? (
          <WifiOffIcon sx={{ fontSize: 18 }} />
        ) : (
          <SlowIcon sx={{ fontSize: 18 }} />
        )}
        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.8125rem' }}>
          {isOffline
            ? 'You are currently offline. Some features may not be available.'
            : 'Your connection appears to be slow. Some operations may take longer.'}
        </Typography>
      </Box>
    </Slide>
  );
};

export default NetworkStatusBanner;
