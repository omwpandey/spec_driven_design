import React from 'react';
import { Chip } from '@mui/material';
import { badgeColorMap, badgeSize, type BadgeVariant } from './Badge.styles';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'small' | 'medium';
  onClick?: () => void;
  onDelete?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'small',
  onClick,
  onDelete,
}) => {
  const { bg, color } = badgeColorMap[variant];

  return (
    <Chip
      label={label}
      size={size}
      onClick={onClick}
      onDelete={onDelete}
      sx={badgeSize(size, bg, color)}
    />
  );
};

export default Badge;
