import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps } from '@mui/material';

export interface IconButtonProps extends MuiIconButtonProps {
  children?: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ children, ...props }) => {
  return <MuiIconButton {...props}>{children}</MuiIconButton>;
};

export default IconButton;
