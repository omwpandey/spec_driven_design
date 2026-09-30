/**
 * MuiBadge - Direct wrapper around MUI's Badge component
 * Use this when you need the raw MUI Badge API (notification dots, counters etc.)
 * For the project's opinionated Badge (label chip), use Badge from @components/common instead.
 */
import React from 'react';
import { Badge as MuiBadgeBase, BadgeProps as MuiBadgeProps } from '@mui/material';

export type { MuiBadgeProps };

export interface MuiBadgeComponentProps extends MuiBadgeProps {
  children?: React.ReactNode;
}

const MuiBadge: React.FC<MuiBadgeComponentProps> = ({ children, ...props }) => {
  return <MuiBadgeBase {...props}>{children}</MuiBadgeBase>;
};

export default MuiBadge;
