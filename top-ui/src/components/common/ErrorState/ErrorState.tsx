import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ErrorOutlinedIcon as ErrorIcon } from '../Icon';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Retry',
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
      <ErrorIcon sx={{ fontSize: 64, color: '#F44336', mb: 2 }} />
      <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.disabled" textAlign="center" sx={{ maxWidth: 360, mb: 2 }}>
        {description}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="error" onClick={onRetry} size="small">
          {retryLabel}
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
