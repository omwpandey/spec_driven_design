import React from 'react';
import { Menu as MuiMenu, MenuProps as MuiMenuProps } from '@mui/material';

export interface MenuProps extends MuiMenuProps {
  children?: React.ReactNode;
}

const Menu: React.FC<MenuProps> = ({ children, ...props }) => {
  return <MuiMenu {...props}>{children}</MuiMenu>;
};

export default Menu;
