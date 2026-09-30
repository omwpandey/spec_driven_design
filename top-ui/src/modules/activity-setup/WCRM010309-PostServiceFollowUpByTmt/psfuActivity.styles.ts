import type { CSSProperties } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { colors, space, radius, fontSize, fontFamilyPrompt } from '@core/theme';

/**
 * [WCRM010309] TMT Activity Maintenance — Post Service Follow Up (PSFU)
 *
 * Single, page-specific style file for the TMT Activity Maintenance (PSFU)
 * screen and its PSFU Item grid section. Components import entries from here
 * instead of declaring inline `sx`/`style` objects.
 *
 * All colors, spacing, radii and font sizes come from the shared design tokens
 * in `@core/theme`.
 *
 * Grouped by area:
 *  - page:     tmtActivityMaintenancePage.tsx
 *  - psfuItem: psfuItemSection.tsx
 */

type Sx = SxProps<Theme>;

// Shared footer action button (Save) — mirrors the reference screen footer.
const footerButton: Sx = {
  color: colors.text.primary,
  backgroundColor: colors.background.paper,
  fontSize: fontSize.base,
  fontWeight: 500,
  textTransform: 'none',
  px: space.xxxl,
  py: space.md,
  borderRadius: radius.md,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  '&:hover': { backgroundColor: colors.neutral[100], borderColor: colors.neutral[500] },
};

export const psfuActivityStyles = {
  // ===== Page (tmtActivityMaintenancePage.tsx) =====
  page: {
    loadingWrap: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
    } as Sx,

    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: space.xxl,
      mt: -1.4,
    } as Sx,

    activityTypeRadioCol: {
      width: '100%',
      minWidth: 0,
    } as Sx,

    footerButton,
    footerButtonIcon: {
      fontSize: '18px !important',
      color: colors.text.primary,
    } as Sx,
  },

  // ===== PSFU Item Section (PsfuItemSection.tsx) =====
  psfuItem: {
    mandatoryAsterisk: {
      color: colors.mandatory,
      marginLeft: '2px',
    } as CSSProperties,

    addButtonIcon: {
      fontSize: '14px !important',
    } as Sx,

    addButton: {
      fontSize: fontSize.base,
      px: space.lg,
      py: space.xs,
      mt: space.md,
      mb: space.md,
      color: colors.text.primary,
      fontWeight: 500,
      textTransform: 'none',
      backgroundColor: colors.background.paper,
    } as Sx,

    // ----- Per-column width helpers (spread with header cell styles) -----
    headerColNo: { width: '5%' },
    headerColStatus: { width: '8%' },
    headerColItems: { width: '62%' },
    headerColMandatory: { width: '13%', textAlign: 'center' as const },
    headerColAction: { width: '12%', textAlign: 'center' as const },

    statusText: {
      fontSize: fontSize.base,
      fontWeight: 500,
    } as Sx,

    // Item dropdown field wrapper (mirrors reference fieldWrap + border states)
    fieldWrapBase: {
      display: 'flex',
      alignItems: 'center',
      borderRadius: radius.lg,
      px: space.md,
      py: space.xxs,
    } as Sx,

    errorDot: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      backgroundColor: colors.primary.main,
      flexShrink: 0,
      cursor: 'pointer',
      mr: space.sm,
    } as Sx,

    // Wraps the field + inline error message in a single vertical cell so the
    // message renders directly beneath the input (mirrors the reference).
    fieldCell: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      width: '100%',
    } as Sx,

    // Inline required/duplicate message shown under the field (always visible
    // once the row is touched — not a hover tooltip).
    errorHelperText: {
      color: colors.mandatory,
      fontSize: fontSize.sm,
      lineHeight: 1.4,
      mt: space.xxs,
      pl: space.xs,
    } as Sx,

    fieldSelect: {
      fontSize: fontSize.base,
    } as Sx,

    mandatoryCell: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    } as Sx,

    mandatoryCheckbox: {
      color: colors.neutral[500],
      '&.Mui-checked': { color: colors.primary.main },
      p: 0.4,
    } as Sx,

    deleteIconButton: {
      color: colors.text.primary,
    } as Sx,

    deleteIcon: {
      fontSize: 18,
    } as Sx,

    // Header font styling reference (kept for parity with fontFamilyPrompt token)
    headerFontFamily: fontFamilyPrompt,
  },
};

// ----- Dynamic (state-dependent) style helpers -----

/** Item cell field-wrapper border/background based on validation error state. */
export const getPsfuCellBorderStyle = (hasError: boolean): Sx =>
  hasError
    ? { border: `2px solid ${colors.primary.main}`, backgroundColor: colors.table.rowHover }
    : { border: `1px solid ${colors.border.light}`, backgroundColor: colors.background.paper };

/** Status text color: green for ADD, grey for others (UPD/DEL). */
export const getPsfuStatusColor = (isAdd: boolean): string =>
  isAdd ? colors.status.success : colors.text.secondary;
