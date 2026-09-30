import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

/**
 * TOPSCRM Theme Configuration
 * 
 * Standards applied:
 * - Font: Prompt (EN), TH Sarabun New (TH)
 * - Primary: #EB0A1E (Toyota Red)
 * - Mandatory fields: #EB0A1E with *
 * - Non-mandatory: #58595B
 * - Buttons: 10px spacing, correct hierarchy
 * - Tables: left-aligned text, right-aligned numbers, center-aligned actions
 * - Validation: fixed line height, no layout shift
 * - Numeric: US format (1,000.00)
 * - Snackbar: Maroon=error, Orange=warning, Green=success
 * - Accordion: all expanded by default
 */
const baseTheme = createTheme({
  // Enable CSS variables — eliminates Context re-renders for theme changes
  cssVariables: true,
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    error: {
      main: colors.mandatory,
    },
    warning: {
      main: colors.status.warning,
    },
    success: {
      main: colors.status.success,
    },
    info: {
      main: colors.status.info,
    },
    divider: colors.border.light,
  },
  typography,
  spacing,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Prompt", "Sarabun", "TH Sarabun New", "Roboto", sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 400,
          fontSize: '0.875rem',
          borderRadius: 4,
          minHeight: 40,
          padding: '6px 9px',
          gap: 8,
          border: '1px solid #E6E6E6',
          boxShadow: '0px 2.67px 5.33px 0px #0000001A !important',
          '&:hover, &:focus, &:active, &.Mui-focusVisible': {
            boxShadow: '0px 2.67px 5.33px 0px #0000001A !important',
          },
        },
        contained: {
          boxShadow: '0px 2.67px 5.33px 0px #0000001A !important',
          '&:hover, &:focus, &:active, &.Mui-focusVisible': {
            boxShadow: '0px 2.67px 5.33px 0px #0000001A !important',
          },
        },
        sizeSmall: {
          minHeight: 32,
          fontSize: '0.8125rem',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            fontSize: '1rem', // 16px at default root; scales with fluid html font-size
            fontFamily: '"Prompt", sans-serif',
            fontWeight: 400,
            lineHeight: 1.5,
            color: '#1A1A1A',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E5E7EB',
              borderWidth: '1.09px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E5E7EB',
            },
          },
          '& .MuiFormHelperText-root': {
            marginLeft: 0,
            marginTop: 2,
            fontSize: '0.75rem',
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          fontSize: '1rem', // 16px at default root; scales with fluid html font-size
          fontFamily: '"Prompt", sans-serif',
          fontWeight: 400,
          lineHeight: 1.5,
          borderRadius: 4,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E5E7EB',
            borderWidth: '1.09px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E5E7EB',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '1rem', // 16px at default root; scales with fluid html font-size
          fontFamily: '"Prompt", sans-serif',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${colors.border.light}`,
          boxShadow: 'none',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#FEF3F4',
          '& .MuiTableCell-head': {
            color: '#1A1A1A',
            fontFamily: '"Prompt", sans-serif',
            fontWeight: 700,
            fontSize: '0.875rem', // 14px at default root; scales with fluid html font-size
            lineHeight: 1.5,
            textTransform: 'uppercase',
            textAlign: 'left',
            whiteSpace: 'nowrap', // keep headers on one line (scaled down, not wrapped)
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.table.border}`,
          borderRight: '1px solid #E6E6E6',
          padding: '16px',
          fontSize: '1rem', // 16px at default root; scales with fluid html font-size
          fontFamily: '"Prompt", sans-serif',
          fontWeight: 400,
          lineHeight: 1.5,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.75rem',
        },
      },
    },
    // Radio & Checkbox: default control color #F5F5F7, turning Toyota red
    // (#EB0A1E) when selected/checked. `!important` ensures it also overrides
    // the per-instance inline `sx={{ color, '&.Mui-checked': {...} }}` on pages.
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#1A1A1A !important',
          '&.Mui-checked': { color: '#EB0A1E !important' },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#1A1A1A !important',
          '&.Mui-checked': { color: '#EB0A1E !important' },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: 'none',
          boxShadow: 'none',
          '&:before': { display: 'none' },
        },
      },
      defaultProps: {
        defaultExpanded: true, // All accordion expanded by default
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.75rem',
          backgroundColor: '#333333',
        },
      },
    },
  },
});

// Global font scaling is handled by the fluid root font-size in index.css
// (html { font-size: clamp(12.5px, 0.5vw + 11.5px, 16px) }). Because all
// typography here uses rem units, every variant — and MUI tables/inputs whose
// px sizes we converted to rem — scales down smoothly on smaller screens while
// staying at its CURRENT size on normal/large desktops. We therefore do NOT
// also apply responsiveFontSizes(), which would double-shrink the text.
export const theme = baseTheme;

export { colors } from './colors';
export { typography, fontSize, fluidFont, fontFamilyPrompt } from './typography';
export { spacing, layoutSpacing, space, radius } from './spacing';
export { customShadows } from './shadows';
export { formLabelStyle, formLabelFontSize, formLabelInset } from './formStyles';
export {
  commonStyles,
  stackGap,
  rowGap,
  redControl,
  FONT_PROMPT,
  FLUID_FONT,
  FLUID_FONT_SM,
} from './commonStyles';
