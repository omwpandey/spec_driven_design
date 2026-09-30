import type { SxProps, Theme } from '@mui/material/styles';
import { colors } from '@core/theme';

type Sx = SxProps<Theme>;

/**
 * Styles for the common Select component.
 *
 * Single source of truth for the select control's look-and-feel. All colors,
 * sizing, spacing and interactive states live here (driven by @core/theme
 * tokens) so every select in the app can be restyled by editing this one file.
 * The TSX must not declare inline `sx={{ ... }}` objects.
 */

export type SelectSize = 'small' | 'medium';

/** Density dimensions. `small` = 36px, `medium` = 44px. */
export const selectSizeMap: Record<SelectSize, { minHeight: number; fontSize: string; py: string }> = {
  small: { minHeight: 36, fontSize: '0.875rem', py: '6px' },
  medium: { minHeight: 44, fontSize: '0.875rem', py: '10px' },
};

/** Base select style, parameterised by density. */
export const selectRoot = (size: SelectSize): Sx => {
  const dims = selectSizeMap[size];
  return {
    minHeight: dims.minHeight,
    fontSize: dims.fontSize,
    fontWeight: 500,
    color: colors.text.primary,
    backgroundColor: colors.background.paper,
    borderRadius: '6px',
    '& .MuiSelect-select': {
      paddingTop: dims.py,
      paddingBottom: dims.py,
      paddingLeft: '12px',
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.input.border,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.border.dark,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.primary.main,
      borderWidth: '1px',
    },
    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.status.error,
    },
    '&.Mui-disabled': {
      backgroundColor: colors.input.disabledBg,
      color: colors.text.disabled,
    },
    '& .MuiSelect-icon': {
      color: colors.text.secondary,
    },
  };
};
