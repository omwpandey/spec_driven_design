import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { NextIcon } from '../Icon';
import { breadcrumbStyles } from './Breadcrumb.styles';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <Breadcrumbs separator={<NextIcon sx={{ fontSize: 14 }} />} sx={breadcrumbStyles.root}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return isLast ? (
          <Typography key={index} sx={breadcrumbStyles.current}>
            {item.label}
          </Typography>
        ) : (
          <Link
            key={index}
            underline="hover"
            sx={breadcrumbStyles.link}
            onClick={() => item.path && onNavigate?.(item.path)}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
