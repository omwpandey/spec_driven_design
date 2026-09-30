/**
 * Global Error Toast
 *
 * Automatically displays toast notifications for errors
 * captured by the ErrorProvider. Integrates with the existing
 * ToastNotification component pattern.
 */

import React from 'react';
import {
  Snackbar,
  Box,
  Typography,
  IconButton,
  Button,
  CloseIcon,
  RefreshIcon,
  ToastErrorIcon,
  ToastWarningIcon,
} from '@components/common';
import { useErrorContext } from './ErrorContext';
import { colors } from '@core/theme';
import { layoutSpacing } from '@core/theme/spacing';
import { useAppSelector } from '@store';

const severityBgMap: Record<string, string> = {
  warning: colors?.snackbar?.warning || '#FF9800',
  error: colors?.snackbar?.error || '#800000',
  critical: '#B71C1C',
};

const severityIconMap: Record<string, React.ReactNode> = {
  warning: <ToastWarningIcon sx={{ width: '17.14px', height: '17.14px', color: '#FFFFFF' }} />,
  error: <ToastErrorIcon sx={{ width: '17.14px', height: '17.14px', color: '#FFFFFF' }} />,
  critical: <ToastErrorIcon sx={{ width: '17.14px', height: '17.14px', color: '#FFFFFF' }} />,
};

const GlobalErrorToast: React.FC = () => {
  const { state, dismissToast } = useErrorContext();
  const { sidebarCollapsed } = useAppSelector((s) => s.app);
  const { currentToast } = state;

  if (!currentToast) return null;

  const bgColor = severityBgMap[currentToast.severity] || severityBgMap.error;
  const sidebarLeftValue = sidebarCollapsed
    ? `${layoutSpacing.sidebarWidth}px`
    : layoutSpacing.sidebarExpandedWidth;

  const handleRetry = () => {
    dismissToast();
    // Trigger page reload for retryable errors
    if (currentToast.retryable) {
      window.location.reload();
    }
  };

  return (
    <Snackbar
      open={!!currentToast}
      autoHideDuration={10000}
      onClose={dismissToast}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      sx={{
        '&.MuiSnackbar-anchorOriginTopLeft': {
          top: { xs: `${layoutSpacing.toastTopOffset}px !important`, md: `${layoutSpacing.toastTopOffset}px !important` },
          left: { xs: '0 !important', md: `${sidebarLeftValue} !important` },
          right: '0 !important',
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: bgColor,
          color: '#FFFFFF',
          padding: '10px 16px',
          borderRadius: '0 0 8px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          width: '100%',
          minWidth: '100%',
        }}
        role="alert"
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '85.71px',
            backgroundColor: 'rgba(255, 255, 255, 0.24)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3.43px',
            flexShrink: 0,
          }}
        >
          {severityIconMap[currentToast.severity] || severityIconMap.error}
        </Box>
        <Typography sx={{ fontSize: '0.8125rem', flex: 1, lineHeight: 1.4 }}>
          {currentToast.userMessage}
        </Typography>
        {currentToast.retryable && (
          <Button
            size="small"
            onClick={handleRetry}
            startIcon={<RefreshIcon sx={{ fontSize: 14 }} />}
            sx={{
              color: '#FFFFFF',
              fontSize: '0.75rem',
              minWidth: 'auto',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
            }}
          >
            Retry
          </Button>
        )}
        <IconButton size="small" onClick={dismissToast} sx={{ color: '#FFFFFF', p: '4px' }}>
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Snackbar>
  );
};

export default GlobalErrorToast;
