import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { EmptyIcon } from '../Icon';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data',
  description = 'There is no data to display at this time.',
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
      }}
    >
      <Box sx={{ color: '#BDBDBD', mb: 2 }}>
        {icon || <EmptyIcon sx={{ fontSize: 64 }} />}
      </Box>
      <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.disabled" textAlign="center" sx={{ maxWidth: 360, mb: 2 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" color="primary" onClick={onAction} size="small">
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
