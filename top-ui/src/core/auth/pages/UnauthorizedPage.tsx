/**
 * UnauthorizedPage — shown when an authenticated user lacks the required
 * permission for a route (RouteGuard redirects here).
 */

import React from 'react';
import { Box, Paper, Stack, Typography, Button } from '@components/common';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 460 }}>
        <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} color="error">
            403
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            Access denied
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You are signed in, but you do not have permission to view this page. Contact your administrator if you
            believe this is a mistake.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/', { replace: true })}>
            Back to home
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default UnauthorizedPage;
