import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface InfoCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label?: string };
  variant?: 'default' | 'outlined' | 'elevated';
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
}) => {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 1,
        border: variant === 'outlined' ? '1px solid #E0E0E0' : 'none',
        boxShadow: variant === 'elevated' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography sx={{ fontSize: '0.75rem', color: '#666666', mb: 0.5 }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: '0.6875rem', color: '#999999', mt: 0.25 }}>
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Typography
              sx={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: trend.value >= 0 ? '#4CAF50' : '#F44336',
                mt: 0.5,
              }}
            >
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%{' '}
              {trend.label && <span style={{ color: '#999999' }}>{trend.label}</span>}
            </Typography>
          )}
        </Box>
        {icon && (
          <Box sx={{ color: '#CC0000', opacity: 0.8 }}>{icon}</Box>
        )}
      </Box>
    </Paper>
  );
};

export default InfoCard;
