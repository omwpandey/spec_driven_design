import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = true,
  color = 'primary',
  size = 'small',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <Box sx={{ width: '100%' }}>
      {(label || showPercentage) && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          {label && (
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{label}</Typography>
          )}
          {showPercentage && (
            <Typography sx={{ fontSize: '0.6875rem', color: '#666666' }}>{clampedValue}%</Typography>
          )}
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={clampedValue}
        color={color}
        sx={{
          height: size === 'small' ? 6 : 10,
          borderRadius: 3,
          backgroundColor: '#F0F0F0',
          '& .MuiLinearProgress-bar': { borderRadius: 3 },
        }}
      />
    </Box>
  );
};

export default ProgressBar;
