import React from 'react';
import { Box } from '@mui/material';

interface PageContainerProps {
  children: React.ReactNode;
  spacing?: number;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, spacing = 2.5 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing,
        width: '100%',
        minHeight: '100%',
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;
