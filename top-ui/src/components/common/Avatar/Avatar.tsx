import React from 'react';
import { Avatar as MuiAvatar, Box, Typography } from '@mui/material';
import { avatarSizeMap, avatarPalette, avatarStyles } from './Avatar.styles';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  subtitle?: string;
}

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const getColorFromName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (name.codePointAt(i) ?? 0) + ((hash << 5) - hash);
  }
  return avatarPalette[Math.abs(hash) % avatarPalette.length];
};

const Avatar: React.FC<AvatarProps> = ({
  name = '',
  src,
  size = 'medium',
  showName = false,
  subtitle,
}) => {
  const { avatar, font } = avatarSizeMap[size];

  return (
    <Box sx={avatarStyles.wrap}>
      <MuiAvatar
        src={src}
        sx={avatarStyles.avatar(src ? 'transparent' : getColorFromName(name), avatar, font)}
      >
        {!src && getInitials(name)}
      </MuiAvatar>
      {showName && (
        <Box>
          <Typography sx={avatarStyles.name}>{name}</Typography>
          {subtitle && <Typography sx={avatarStyles.subtitle}>{subtitle}</Typography>}
        </Box>
      )}
    </Box>
  );
};

export default Avatar;
