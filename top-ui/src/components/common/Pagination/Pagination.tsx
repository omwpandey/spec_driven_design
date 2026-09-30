import React from 'react';
import { Pagination as MuiPagination } from '@mui/material';
import type { PaginationProps as MuiPaginationProps } from '@mui/material';
import { paginationStyles } from './Pagination.styles';

/**
 * TOPSCRM Pagination
 *
 * Self-contained, themeable pagination control. MUI is used only as the
 * internal rendering engine; ALL look-and-feel is defined in the co-located
 * `Pagination.styles.ts` (driven by @core/theme tokens). To restyle every
 * pager in the app, edit that one file — never scatter inline `sx` overrides
 * at call sites.
 */

export interface PaginationProps extends MuiPaginationProps {}

const Pagination: React.FC<PaginationProps> = ({ sx, ...props }) => {
  return (
    <MuiPagination
      shape="rounded"
      variant="outlined"
      sx={[paginationStyles.root, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      {...props}
    />
  );
};

export default Pagination;
