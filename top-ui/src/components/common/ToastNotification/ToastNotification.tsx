import React from 'react';
import { Snackbar, Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import {
  CloseIcon,
  ToastSuccessIcon as SuccessIcon,
  ToastErrorIcon as ErrorIcon,
  ToastWarningIcon as WarningIcon,
  ToastInfoIcon as InfoIcon,
} from '../Icon';
import { colors } from '@core/theme';
import { layoutSpacing } from '@core/theme/spacing';
import { useAppSelector } from '@store';

type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

interface ToastNotificationProps {
  open: boolean;
  message: string;
  severity?: ToastSeverity;
  code?: string;
  duration?: number;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  onClose: () => void;
}

/**
 * TOPSCRM Snackbar Standard:
 * - Error: Maroon (#800000) background
 * - Warning: Orange (#FF9800) background
 * - Success: Green (#4CAF50) background
 * - Info: Blue (#2196F3) background
 * - Format: "[Code] + Message"
 * - Long messages: click to view full text in popup
 * - Auto-dismiss after 10 seconds
 */

const bgColorMap: Record<ToastSeverity, string> = {
  error: colors.snackbar.error,
  warning: colors.snackbar.warning,
  success: colors.snackbar.success,
  info: colors.snackbar.info,
};

const iconMap: Record<ToastSeverity, React.ReactNode> = {
  success: (
    <Box sx={{ width: 24, height: 24, borderRadius: '85.71px', backgroundColor: 'rgba(255, 255, 255, 0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3.43px', flexShrink: 0 }}>
      <SuccessIcon sx={{ width: '17.14px', height: '17.14px', color: '#FFFFFF' }} />
    </Box>
  ),
  error: (
    <Box sx={{ width: 24, height: 24, borderRadius: '85.71px', backgroundColor: 'rgba(255, 255, 255, 0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3.43px', flexShrink: 0 }}>
      <ErrorIcon sx={{ width: '17.14px', height: '17.14px', color: '#FFFFFF' }} />
    </Box>
  ),
  warning: (
    <Box sx={{ width: 24, height: 24, borderRadius: '85.71px', backgroundColor: 'rgba(255, 255, 255, 0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3.43px', flexShrink: 0 }}>
      <WarningIcon sx={{ width: '17.14px', height: '17.14px', color: '#FFFFFF' }} />
    </Box>
  ),
  info: (
    <Box sx={{ width: 24, height: 24, borderRadius: '85.71px', backgroundColor: 'rgba(255, 255, 255, 0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3.43px', flexShrink: 0 }}>
      <InfoIcon sx={{ width: '17.14px', height: '17.14px', color: '#FFFFFF' }} />
    </Box>
  ),
};

const ToastNotification: React.FC<ToastNotificationProps> = ({
  open,
  message,
  severity = 'success',
  code,
  duration = 10000,
  // position prop accepted but snackbar uses fixed top-left positioning
  position: _position,
  onClose,
}) => {
  const [showFullDialog, setShowFullDialog] = React.useState(false);
  const { sidebarCollapsed } = useAppSelector((state) => state.app);
  const isLongMessage = message.length > 100;
  const displayMessage = code ? `${code}: ${message}` : message;

  const sidebarLeftValue = sidebarCollapsed ? `${layoutSpacing.sidebarWidth}px` : layoutSpacing.sidebarExpandedWidth;

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClick={() => {
          if (isLongMessage) setShowFullDialog(true);
        }}
        sx={{
          cursor: isLongMessage ? 'pointer' : 'default',
          '&.MuiSnackbar-anchorOriginTopLeft': {
            top: { xs: `${layoutSpacing.toastTopOffset}px !important`, md: `${layoutSpacing.toastTopOffset}px !important` },
            left: { xs: '0 !important', md: `${sidebarLeftValue} !important` },
            right: '0 !important',
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: bgColorMap[severity],
            color: '#FFFFFF',
            padding: '10px 16px',
            borderRadius: '0 0 8px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: '100%',
            minWidth: '100%',
          }}
        >
          {iconMap[severity]}
          <Typography sx={{ fontSize: '0.8125rem', flex: 1, lineHeight: 1.4 }}>
            {isLongMessage ? `${displayMessage.slice(0, 100)}...` : displayMessage}
          </Typography>
          <IconButton size="small" onClick={onClose} sx={{ color: '#FFFFFF', p: '4px' }}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Snackbar>

      {/* Full message dialog for long messages */}
      <Dialog open={showFullDialog} onClose={() => setShowFullDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 600 }}>
          {severity === 'error' ? 'Error Details' : severity === 'warning' ? 'Warning Details' : 'Message Details'}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
            {displayMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFullDialog(false)} variant="contained" size="small">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ToastNotification;
