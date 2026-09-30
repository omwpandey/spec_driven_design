import React from 'react';
import { Drawer as MuiDrawer, DrawerProps as MuiDrawerProps } from '@mui/material';

export interface DrawerProps extends MuiDrawerProps {
  children?: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ children, ...props }) => {
  return <MuiDrawer {...props}>{children}</MuiDrawer>;
};

export default Drawer;
