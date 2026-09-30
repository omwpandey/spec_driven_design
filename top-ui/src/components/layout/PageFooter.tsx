import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '@core/theme';

interface PageFooterProps {
  actions?: React.ReactNode;
}

const PageFooter: React.FC<PageFooterProps> = ({ actions }) => {
  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        zIndex: 100,
        mx: { xs: -2, sm: -2.5, md: -3 },
        mb: { xs: -2, sm: -2.5, md: -3 },
        mt: 'auto',
      }}
    >
      {/* Action Buttons Row */}
      {actions && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'stretch', sm: 'flex-end' },
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            px: { xs: 1, sm: 2 },
            py: 1,
            backgroundColor: '#F5F5F5',
            borderTop: `1px solid ${colors.border.light}`,
          }}
        >
          {actions}
        </Box>
      )}

      {/* Copyright Bar */}
      <Box
        sx={{
          backgroundColor: '#EB0A1E',
          height: '50px',
          minHeight: '50px',
          px: { xs: 1, sm: 2 },
          py: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ fontFamily: "'Prompt', sans-serif", color: '#FFFFFF', fontSize: '0.6875rem', fontWeight: 400, lineHeight: 1.3, textAlign: 'center' }}>
          Copyright © 2026 Toyota Motors Asia Engineering &amp; Manufacturing. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default PageFooter;
