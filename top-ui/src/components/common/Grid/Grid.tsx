import React from 'react';
import { default as MuiGrid } from '@mui/material/Grid';
import type { GridProps as MuiGridProps } from '@mui/material/Grid';

export interface GridProps extends MuiGridProps {
  children?: React.ReactNode;
}

const Grid: React.FC<GridProps> = ({ children, ...props }) => {
  return <MuiGrid {...props}>{children}</MuiGrid>;
};

export default Grid;
