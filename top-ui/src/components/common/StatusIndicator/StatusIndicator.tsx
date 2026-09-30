import React from 'react';
import { Box, Typography } from '@mui/material';

type Status = 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning';

interface StatusIndicatorProps {
  status: Status;
  label?: string;
  size?: 'small' | 'medium';
}

const statusConfig: Record<Status, { color: string; label: string }> = {
  active: { color: '#4CAF50', label: 'Active' },
  inactive: { color: '#9E9E9E', label: 'Inactive' },
  pending: { color: '#FF9800', label: 'Pending' },
  error: { color: '#F44336', label: 'Error' },
  success: { color: '#4CAF50', label: 'Success' },
  warning: { color: '#FF9800', label: 'Warning' },
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'small',
}) => {
  const config = statusConfig[status];
  const dotSize = size === 'small' ? 8 : 10;

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
      <Box
        sx={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: config.color,
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontSize: size === 'small' ? '0.75rem' : '0.8125rem',
          color: config.color,
          fontWeight: 500,
        }}
      >
        {label || config.label}
      </Typography>
    </Box>
  );
};

export default StatusIndicator;
