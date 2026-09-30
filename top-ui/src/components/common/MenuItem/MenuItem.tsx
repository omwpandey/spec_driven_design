import React from 'react';
import { MenuItem as MuiMenuItem, MenuItemProps as MuiMenuItemProps } from '@mui/material';

export interface MenuItemProps extends MuiMenuItemProps {
  children?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ children, ...props }) => {
  return <MuiMenuItem {...props}>{children}</MuiMenuItem>;
};

export default MenuItem;
