import React from 'react';
import { Box, Skeleton } from '@mui/material';

type SkeletonVariant = 'card' | 'table' | 'form' | 'list' | 'detail';

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  rows?: number;
  columns?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'card',
  rows = 5,
  columns = 4,
}) => {
  if (variant === 'table') {
    return (
      <Box>
        <Skeleton variant="rectangular" height={36} sx={{ mb: 0.5, borderRadius: 0.5 }} />
        {Array.from({ length: rows }).map((_, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} variant="text" sx={{ flex: 1, height: 32 }} />
            ))}
          </Box>
        ))}
      </Box>
    );
  }

  if (variant === 'form') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <Box key={i}>
            <Skeleton variant="text" width={120} height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 0.5 }} />
          </Box>
        ))}
      </Box>
    );
  }

  if (variant === 'list') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Skeleton variant="circular" width={36} height={36} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={18} />
              <Skeleton variant="text" width="40%" height={14} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (variant === 'detail') {
    return (
      <Box>
        <Skeleton variant="text" width="40%" height={28} sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Box key={i}>
              <Skeleton variant="text" width={100} height={16} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  // card variant (default)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
      ))}
    </Box>
  );
};

export default SkeletonLoader;
