import type { CSSProperties } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { colors } from './colors';
import { fontFamilyPrompt, fluidFont } from './typography';

/**
 * TOPSCRM Common Styles
 * ---------------------
 * Framework-wide reusable style objects and small factory helpers, built on the
 * theme tokens (`colors`, spacing, typography). This is the single source of
 * truth for styling patterns that repeat across pages and components.
 *
 * Usage:
 *  - Page/component-specific styles live in a co-located `*.styles.ts` file.
 *  - Anything generic (layout primitives, the section header bar, table header
 *    cells, mandatory asterisk, fluid fonts, etc.) should be imported from here
 *    and NOT re-declared per page.
 *  - Never write inline `sx={{ ... }}` / `style={{ ... }}` objects in TSX.
 *
 * Compose common + page-specific styles by spreading, e.g.:
 *    sx={{ ...(commonStyles.flexBetween as object), mt: 2 }}
 */

type Sx = SxProps<Theme>;

// ─── Shared design tokens (re-exported from the single token source) ───
export const FONT_PROMPT = fontFamilyPrompt;

/** Fluid font that scales with viewport but caps at ~16px (used widely). */
export const FLUID_FONT = fluidFont.base;
/** Smaller fluid font (~11–13px). */
export const FLUID_FONT_SM = fluidFont.sm;

export const commonStyles = {
  // ─── Flex layout primitives ───
  flexRow: { display: 'flex', flexDirection: 'row', alignItems: 'center' } as Sx,
  flexColumn: { display: 'flex', flexDirection: 'column' } as Sx,
  flexCenter: { display: 'flex', alignItems: 'center', justifyContent: 'center' } as Sx,
  flexBetween: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as Sx,
  flexEnd: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' } as Sx,
  flexWrap: { display: 'flex', flexWrap: 'wrap', alignItems: 'center' } as Sx,
  fullWidth: { width: '100%' } as Sx,
  minWidth0: { minWidth: 0 } as Sx,

  // ─── Section header ("red bar + title") ───
  sectionHeaderRow: { display: 'flex', alignItems: 'center', gap: 1, mb: 2 } as Sx,
  sectionHeaderRowLg: { display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 } as Sx,
  sectionHeaderBar: { width: 4, height: 18, backgroundColor: colors.primary.main, borderRadius: '2px' } as Sx,
  sectionHeaderBarPill: { width: 4, height: 20, backgroundColor: colors.primary.main, borderRadius: '9999px' } as Sx,
  sectionHeaderTitle: { fontWeight: 600, fontSize: '0.9375rem' } as Sx,
  sectionHeaderTitlePrompt: {
    fontFamily: FONT_PROMPT,
    fontWeight: 600,
    fontSize: FLUID_FONT,
    lineHeight: 1.3,
    color: colors.text.primary,
  } as Sx,

  // ─── Page section title (larger, standalone) ───
  pageSectionTitle: { fontSize: 16, fontWeight: 700, color: colors.text.primary } as Sx,

  // ─── Mandatory asterisk (inline span) ───
  mandatoryAsterisk: { color: colors.mandatory, marginLeft: '2px' } as CSSProperties,

  // ─── Field label (form label above inputs) ───
  fieldLabel: {
    fontFamily: FONT_PROMPT,
    fontSize: FLUID_FONT,
    lineHeight: 1.3,
    fontWeight: 500,
    color: colors.text.primary,
    mb: '8px',
  } as Sx,

  // ─── Common table header cell (pink bg, bold, uppercase) ───
  tableHeaderCell: {
    backgroundColor: colors.table.headerBg,
    fontFamily: FONT_PROMPT,
    fontWeight: 700,
    fontSize: FLUID_FONT_SM,
    lineHeight: 1.2,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    borderTop: `1px solid ${colors.table.border}`,
    borderBottom: `1px solid ${colors.table.border}`,
    borderRight: `1px solid ${colors.table.border}`,
    py: '16px',
    px: '16px',
  } as Sx,

  // ─── Standard body cell ───
  tableBodyCell: {
    borderBottom: `1px solid ${colors.table.border}`,
    borderRight: `1px solid ${colors.table.border}`,
    py: 1.5,
  } as Sx,

  // ─── Card / panel wrapper ───
  cardPanel: {
    border: `1px solid ${colors.border.light}`,
    borderRadius: 1.5,
    backgroundColor: colors.background.paper,
    overflow: 'hidden',
  } as Sx,

  // ─── Header-actions bar (e.g. + Add button row above a table) ───
  headerActionsBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    px: 1.5,
    pt: 1,
    pb: 0.5,
    backgroundColor: colors.table.headerBg,
  } as Sx,
};

// ─── Factory helpers (value-dependent common styles) ───

/** A vertical/section stack with a configurable gap (theme spacing units). */
export const stackGap = (gap: number): Sx => ({ display: 'flex', flexDirection: 'column', gap });

/** A horizontal row with a configurable gap. */
export const rowGap = (gap: number): Sx => ({ display: 'flex', alignItems: 'center', gap, flexWrap: 'wrap' });

/** Red (Toyota) checkbox/radio control: grey unchecked -> primary when checked. */
export const redControl = (uncheckedColor = '#999', padding = 0.5): Sx => ({
  color: uncheckedColor,
  '&.Mui-checked': { color: colors.primary.main },
  ...(padding ? { p: padding } : {}),
});
