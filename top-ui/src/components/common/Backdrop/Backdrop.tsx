import React from 'react';
import { Backdrop as MuiBackdrop, BackdropProps as MuiBackdropProps } from '@mui/material';

export interface BackdropProps extends MuiBackdropProps {
  children?: React.ReactNode;
}

const Backdrop: React.FC<BackdropProps> = ({ children, ...props }) => {
  return <MuiBackdrop {...props}>{children}</MuiBackdrop>;
};

export default Backdrop;
