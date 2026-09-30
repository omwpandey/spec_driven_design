import React from 'react';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';

export interface LinkProps extends MuiLinkProps {
  children?: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ children, ...props }) => {
  return <MuiLink {...props}>{children}</MuiLink>;
};

export default Link;
