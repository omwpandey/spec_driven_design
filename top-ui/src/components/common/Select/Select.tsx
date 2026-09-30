import React from 'react';
import { Select as MuiSelect } from '@mui/material';
import type { SelectProps as MuiSelectProps } from '@mui/material';
import { selectRoot, type SelectSize } from './Select.styles';

/**
 * TOPSCRM Select
 *
 * Self-contained, themeable select control. MUI is used only as the internal
 * rendering engine; ALL look-and-feel is defined in the co-located
 * `Select.styles.ts` (driven by @core/theme tokens). To restyle every select
 * in the app, edit that one file — never scatter inline `sx` overrides at
 * call sites.
 */

export interface SelectProps extends Omit<MuiSelectProps<any>, 'size'> {
  /** Visual density. `small` = 36px, `medium` = 44px. Default: small */
  size?: SelectSize;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ size = 'small', sx, ...props }, ref) => {
    return (
      <MuiSelect
        ref={ref}
        variant="outlined"
        size={size}
        sx={[selectRoot(size), ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
        {...props}
      />
    );
  }
);

Select.displayName = 'Select';

export default Select;
