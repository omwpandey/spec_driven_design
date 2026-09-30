import type { SxProps, Theme } from '@mui/material/styles';
import { colors } from '@core/theme';

type Sx = SxProps<Theme>;

/**
 * Styles for the common Pagination component.
 *
 * Single source of truth for the pager's look-and-feel. All colors, sizing,
 * spacing and interactive states live here (driven by @core/theme tokens) so
 * every pager in the app can be restyled by editing this one file. The TSX
 * must not declare inline `sx={{ ... }}` objects.
 */
export const paginationStyles = {
  root: {
    '& .MuiPaginationItem-root': {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: colors.text.primary,
      borderColor: colors.input.border,
      minWidth: 32,
      height: 32,
      margin: '0 2px',
      '&:hover': {
        backgroundColor: colors.table.rowHover,
        borderColor: colors.border.dark,
      },
    },
    '& .MuiPaginationItem-root.Mui-selected': {
      backgroundColor: colors.primary.main,
      borderColor: colors.primary.main,
      color: colors.primary.contrastText,
      fontWeight: 600,
      '&:hover': {
        backgroundColor: colors.primary.dark,
        borderColor: colors.primary.dark,
      },
    },
    '& .MuiPaginationItem-root.Mui-disabled': {
      color: colors.text.disabled,
      borderColor: colors.border.light,
    },
    '& .MuiPaginationItem-ellipsis': {
      color: colors.text.secondary,
    },
  } as Sx,
};
