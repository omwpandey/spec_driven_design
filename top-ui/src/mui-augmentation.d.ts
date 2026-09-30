/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * MUI v6 type augmentations for backwards-compatible prop usage.
 *
 * MUI v6 moved some shorthand props (fontWeight, fontSize, textAlign, etc.)
 * out of the direct component API and into `sx`. These augmentations allow
 * continued usage during the migration period.
 */
import '@mui/material/Typography';
import '@mui/material/Stack';
import '@mui/material/Dialog';
import '@mui/material/ListItemText';
import '@mui/material/Autocomplete';

declare module '@mui/material/Typography' {
  interface TypographyOwnProps {
    fontWeight?: number | string;
    fontSize?: number | string;
    textAlign?: 'left' | 'center' | 'right' | 'justify' | 'inherit' | string;
  }
}

declare module '@mui/material/Stack' {
  interface StackOwnProps {
    justifyContent?: string;
    alignItems?: string;
    flexWrap?: string;
    gap?: number | string;
  }
}

declare module '@mui/material/Dialog' {
  interface DialogProps {
    PaperProps?: object;
  }
}

declare module '@mui/material/ListItemText' {
  interface ListItemTextProps<
    PrimaryTypographyComponent extends React.ElementType = 'span',
    SecondaryTypographyComponent extends React.ElementType = 'p',
  > {
    primaryTypographyProps?: object;
    secondaryTypographyProps?: object;
  }
}
