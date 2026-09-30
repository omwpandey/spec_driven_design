import React from 'react';
import { Paper as MuiPaper, PaperProps as MuiPaperProps } from '@mui/material';

export interface PaperProps extends MuiPaperProps {
  children?: React.ReactNode;
}

const Paper: React.FC<PaperProps> = ({ children, ...props }) => {
  return <MuiPaper {...props}>{children}</MuiPaper>;
};

export default Paper;
