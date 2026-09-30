import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ open, message = 'Loading...' }) => {
  return (
    <Backdrop open={open} sx={{ zIndex: 9999, color: '#fff', flexDirection: 'column', gap: 2 }}>
      <CircularProgress color="inherit" />
      <Typography variant="body2">{message}</Typography>
    </Backdrop>
  );
};

export default LoadingOverlay;
