import type { ThemeOptions } from '@mui/material/styles';

type TypographyOptions = NonNullable<ThemeOptions['typography']>;

/**
 * TOPSCRM Typography Standard
 * 
 * English: Prompt
 * Thai: TH Sarabun New
 * 
 * Baseline: 1920px desktop
 * Thai uses +2px for visual parity
 * 
 * Hierarchy:
 * - H1 (Page Header): EN 28 SemiBold / TH 30 Bold
 * - H2 (Page Title): EN 28 SemiBold / TH 30 Bold
 * - H3 (Section/Tabs): EN 18 SemiBold / TH 20 Bold
 * - H4 (Nav Titles): EN 16 Regular / TH 18 Medium
 * - H5 (Subheading): EN 16 SemiBold / TH 18 Bold
 * - H6 (Small heading): EN 14 SemiBold / TH 16 Bold
 * - Body1 (Input/Table body): EN 14 Regular / TH 16 Regular
 * - Body2 (Labels): EN 14 Medium / TH 16 Medium
 * - Button: EN 14 SemiBold / TH 16 Bold
 * - Caption (Breadcrumbs/Small): EN 12 Medium / TH 14 Medium
 * - Overline (Smaller details): EN 12 Regular / TH 14 Regular
 */
/**
 * Font-size tokens (rem, scale with the fluid root font-size).
 * Use these instead of hardcoding rem/px sizes in style objects.
 */
export const fontSize = {
  xs: '0.625rem',    // 10px
  sm: '0.6875rem',   // 11px
  md: '0.75rem',     // 12px
  lg: '0.8125rem',   // 13px
  base: '0.875rem',  // 14px (body/table)
  xl: '0.9375rem',   // 15px
  xxl: '1rem',       // 16px
  h3: '1.125rem',    // 18px
  h1: '1.75rem',     // 28px
} as const;

/** Fluid font sizes (viewport-scaled, capped). Single source of truth. */
export const fluidFont = {
  /** ~12–16px */
  base: 'clamp(0.75rem, 0.55vw + 0.55rem, 1rem)',
  /** ~11–13px */
  sm: 'clamp(0.6875rem, 0.3vw + 0.6rem, 0.8125rem)',
} as const;

/** Shared font-family token. */
export const fontFamilyPrompt = "'Prompt', sans-serif";

export const typography: TypographyOptions = {
  fontFamily: '"Prompt", "TH Sarabun New", "Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: 14,
  h1: {
    fontSize: '1.75rem',    // 28px
    fontWeight: 600,        // SemiBold
    lineHeight: 1.25,
  },
  h2: {
    fontSize: '1.75rem',    // 28px
    fontWeight: 600,
    lineHeight: 1.25,
  },
  h3: {
    fontSize: '1.125rem',   // 18px
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: '1rem',       // 16px
    fontWeight: 400,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1rem',       // 16px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '0.875rem',   // 14px
    fontWeight: 600,
    lineHeight: 1.5,
  },
  subtitle1: {
    fontSize: '1rem',       // 16px
    fontWeight: 500,
  },
  subtitle2: {
    fontSize: '0.875rem',   // 14px
    fontWeight: 500,
  },
  body1: {
    fontSize: '0.875rem',   // 14px - Input/Table body
    fontWeight: 400,        // Regular
    lineHeight: 1.45,
  },
  body2: {
    fontSize: '0.875rem',   // 14px - Labels
    fontWeight: 500,        // Medium
    lineHeight: 1.45,
  },
  button: {
    fontSize: '0.875rem',   // 14px
    fontWeight: 400,        // Regular (Font 3 standard)
    lineHeight: '16px',     // line height/16
    textTransform: 'none',
  },
  caption: {
    fontSize: '0.75rem',    // 12px - Breadcrumbs
    fontWeight: 500,        // Medium
    lineHeight: 1.4,
  },
  overline: {
    fontSize: '0.75rem',    // 12px - Smaller details
    fontWeight: 400,
    lineHeight: 1.4,
    textTransform: 'none',
  },
};
