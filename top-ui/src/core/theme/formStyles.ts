import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Shared style for all form field labels.
 *
 * TOPSCRM Standard:
 * - Font family: Prompt (inherited from theme, set explicitly here for safety)
 * - Font weight: 400 (Regular)
 * - Responsive font size: xs 0.5rem / sm 0.625rem / md 1rem (16px)
 * - Line height: 16px
 * - Letter spacing: 0px
 *
 * Import and spread this into the label Typography's `sx` so every
 * form control renders labels consistently.
 */
// Fixed 1rem (16px) label size. Global scaling is handled by the app-wide
// `zoom` in MainLayout, which shrinks all form labels together with the rest
// of the UI on smaller screens while keeping this size on normal desktops.
export const formLabelFontSize = '1rem' as const;

/**
 * Default left inset for form field labels. Applied so every label aligns
 * consistently regardless of which component or page renders it. Shared here
 * as a single source of truth (imported by page-specific style files too).
 */
export const formLabelInset = '16px' as const;

export const formLabelStyle: SxProps<Theme> = {
  fontFamily: "Prompt",
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: formLabelFontSize,
  lineHeight: 1.4,
  letterSpacing: '0px',
  pl: formLabelInset,
};
