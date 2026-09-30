import React from 'react';
import { Snackbar as MuiSnackbar, SnackbarProps as MuiSnackbarProps } from '@mui/material';

export type SnackbarProps = Omit<MuiSnackbarProps, 'children'> & {
  children?: React.ReactElement;
};

const Snackbar: React.FC<SnackbarProps> = ({ children, ...props }) => {
  return <MuiSnackbar {...props}>{children}</MuiSnackbar>;
};

export default Snackbar;
