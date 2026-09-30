/**
 * MuiAvatar - Direct wrapper around MUI's Avatar component
 * Use this when you need the raw MUI Avatar API (with sx props etc.)
 * For the project's opinionated Avatar with auto-initials, use Avatar from @components/common instead.
 */
import React from 'react';
import { Avatar as MuiAvatarBase, AvatarProps as MuiAvatarProps } from '@mui/material';

export type { MuiAvatarProps };

export interface MuiAvatarComponentProps extends MuiAvatarProps {
  children?: React.ReactNode;
}

const MuiAvatar: React.FC<MuiAvatarComponentProps> = ({ children, ...props }) => {
  return <MuiAvatarBase {...props}>{children}</MuiAvatarBase>;
};

export default MuiAvatar;
