import React from 'react';
import { Divider as MuiDivider, Typography, Box } from '@mui/material';
import type { DividerProps as MuiDividerProps } from '@mui/material';
import { dividerStyles } from './Divider.styles';

interface DividerProps extends Omit<MuiDividerProps, 'variant'> {
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'fullWidth' | 'inset' | 'middle';
  spacing?: number;
  flexItem?: boolean;
}

const Divider: React.FC<DividerProps> = ({
  label,
  orientation = 'horizontal',
  variant = 'fullWidth',
  spacing = 2,
  flexItem,
  sx,
  ...rest
}) => {
  if (label) {
    return (
      <Box sx={{ ...(dividerStyles.labelWrap as object), my: spacing }}>
        <MuiDivider sx={dividerStyles.labelLine} />
        <Typography sx={dividerStyles.labelText}>{label}</Typography>
        <MuiDivider sx={dividerStyles.labelLine} />
      </Box>
    );
  }

  return (
    <MuiDivider
      orientation={orientation}
      variant={variant}
      flexItem={flexItem}
      sx={[
        {
          my: orientation === 'horizontal' ? spacing : 0,
          mx: orientation === 'vertical' ? spacing : 0,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...rest}
    />
  );
};

export default Divider;
