import type { CSSProperties } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { colors, space, radius, fontSize, fontFamilyPrompt } from '@core/theme';

/**
 * Activity Setup — single, page-specific style file.
 *
 * All CSS for the Activity Setup page and its section components
 * (ServiceRepairSection, ContactChannelSection) lives here. Components should
 * not declare inline `sx={{ ... }}` objects or inline `style={{ ... }}`; import
 * the relevant entry from this file instead.
 *
 * All colors, spacing (padding/margin), radii and font sizes come from the
 * shared design tokens in `@core/theme` (colors / space / radius / fontSize).
 *
 * Grouped by area:
 *  - page:            ActivitySetupPage.tsx
 *  - serviceRepair:   ServiceRepairSection.tsx
 *  - contactChannel:  ContactChannelSection.tsx
 */

type Sx = SxProps<Theme>;

// Shared footer action button style (Delete / Set Template / Save)
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

export const activitySetupStyles = {
  // ===== Page (ActivitySetupPage.tsx) =====
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

    activityTypeRow: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: { xs: 'column', lg: 'row' },
      gap: space.xl,
      width: '100%',
    } as Sx,

    activityTypeRadioCol: {
      flex: 1,
      minWidth: 0,
    } as Sx,

    verticalDivider: {
      display: { xs: 'none', lg: 'block' },
      borderColor: colors.border.light,
    } as Sx,

    summaryCardsRow: {
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: 'clamp(6px, 0.8vw, 10px)',
      flexWrap: 'nowrap',
      alignItems: 'stretch',
      flex: 1,
      minWidth: 0,
    } as Sx,

    // Footer buttons
    footerButton,
    // Icon sx for the footer buttons
    footerButtonIcon: {
      fontSize: '18px !important',
      color: colors.text.primary,
    } as Sx,

    // Summary card icon colors
    summaryIconCar: { color: '#E65100' } as Sx,
    summaryIconPeople: { color: '#1565C0' } as Sx,
    summaryIconBusiness: { color: '#4527A0' } as Sx,
  },

  // ===== Service & Repair Section (ServiceRepairSection.tsx) =====
  serviceRepair: {
    mandatoryAsterisk: {
      color: colors.mandatory,
      marginLeft: '2px',
    } as CSSProperties,

    selectRangeTrigger: {
      display: 'flex',
      alignItems: 'center',
      border: `1px solid ${colors.border.light}`,
      borderRadius: radius.sm,
      backgroundColor: colors.background.paper,
      px: space.lg,
      py: space.xs,
      mt: space.md,
      mb: space.md,
      cursor: 'pointer',
      minWidth: 182,
      justifyContent: 'space-between',
      '&:hover': { borderColor: colors.neutral[400] },
    } as Sx,

    selectRangeLabel: {
      fontSize: fontSize.lg,
      color: colors.text.secondary,
    } as Sx,

    selectRangeCaret: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      ml: space.md,
    } as Sx,

    popoverPaper: {
      mt: space.xs,
      border: `1px solid ${colors.border.light}`,
      boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
      borderRadius: 1,
      minWidth: 180,
    } as Sx,

    popoverBody: {
      p: space.lg,
    } as Sx,

    rangeCheckbox: {
      color: colors.primary.main,
      '&.Mui-checked': { color: colors.primary.main },
      p: 0.4,
    } as Sx,

    rangeCheckboxLabelText: {
      fontSize: fontSize.md,
    } as Sx,

    rangeCheckboxControl: {
      display: 'flex',
      mx: 0,
      mb: space.xxs,
    } as Sx,

    popoverFooter: {
      mt: space.sm,
      borderTop: `1px solid ${colors.border.light}`,
      pt: space.sm,
      display: 'flex',
      gap: space.md,
    } as Sx,

    selectAllLink: {
      color: colors.primary.main,
      textDecoration: 'none',
      fontWeight: 500,
      fontSize: '0.7rem',
    } as Sx,

    noneLink: {
      color: colors.text.secondary,
      textDecoration: 'none',
      fontSize: '0.7rem',
    } as Sx,
  // ----- TopTable -----

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

headerColNo: { width: '4%' },

headerColStatus: { width: '8%' },

headerColRepairCode: {
  width: '18%',
},

headerColDescription: {
  width: '42%',
},

headerColMandatory: {
  width: '12%',
  textAlign: 'center' as const,
},

headerColAction: {
  width: '8%',
  textAlign: 'center' as const,
},

statusText: {
  fontSize: fontSize.base,
  fontWeight: 500,
} as Sx,

fieldWrapBase: {
  display: 'flex',
  alignItems: 'center',
  borderRadius: radius.lg,
  px: space.md,
  py: space.xxs,
} as Sx,

    fieldError: {
      borderColor: colors.primary.main,
    } as Sx,

fieldSelect: {
  fontSize: fontSize.base,
} as Sx,

descriptionText: {
  fontSize: fontSize.base,
  color: colors.text.primary,
} as Sx,

deleteIconButton: {
  color: colors.text.primary,
} as Sx,

deleteIcon: {
  fontSize: 18,
} as Sx,
  },

  // ===== Contact Channel Section (ContactChannelSection.tsx) =====
  contactChannel: {
    mandatoryAsterisk: {
      color: colors.mandatory,
      marginLeft: '2px',
    } as CSSProperties,

    addBar: {
      display: 'flex',
      justifyContent: 'flex-end',
      px: space.lg,
      pt: space.md,
      pb: space.xs,
      backgroundColor: colors.table.headerBgAlt,
    } as Sx,

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

    tableContainer: {
      overflowX: 'auto',
    } as Sx,

    table: {
      tableLayout: 'fixed',
      width: '100%',
    } as Sx,

    // ----- Header cells -----
    // Base header cell styling (shared)
    headerCellBase: {
      backgroundColor: colors.table.headerBgAlt,
      fontFamily: fontFamilyPrompt,
      fontWeight: 700,
      // Fluid header font that shrinks to keep the header on ONE line.
      fontSize: 'clamp(0.625rem, 0.6vw + 0.35rem, 0.875rem)',
      lineHeight: 1.2,
      textTransform: 'uppercase',
      letterSpacing: '0%',
      whiteSpace: 'nowrap', // never wrap header to a second line
      borderTop: `1px solid ${colors.neutral[300]}`,
      borderBottom: `1px solid ${colors.neutral[300]}`,
      borderRight: `1px solid ${colors.neutral[300]}`,
      py: '16px',
      px: '16px',
    } as Sx,

    // Per-column width helpers (spread together with the header cell styles).
    // Kept as plain objects (not Sx) so they can be spread into the composed
    // header cell style objects.
    headerColNo: { width: '4%' },
    headerColStatus: { width: '6%' },
    headerColContactProcess: { width: '40%' },
    headerColChannel: { width: '17%' },
    headerColActivityDay: { width: '12%', textAlign: 'center' as const },
    headerColAssignGroup: { width: '15%' },
    headerColAction: { width: '8%', textAlign: 'center' as const },

    // ----- Body -----
    bodyRow: {
      backgroundColor: colors.background.paper,
      '&:hover': { backgroundColor: colors.table.rowHoverAlt },
    } as Sx,

    cellNo: {
      fontSize: fontSize.base,
      borderBottom: `1px solid ${colors.neutral[300]}`,
      borderRight: `1px solid ${colors.neutral[300]}`,
      py: space.lg,
    } as Sx,

    cellStandard: {
      borderBottom: `1px solid ${colors.neutral[300]}`,
      borderRight: `1px solid ${colors.neutral[300]}`,
      py: space.lg,
    } as Sx,

    cellActionLast: {
      borderBottom: `1px solid ${colors.neutral[300]}`,
      py: space.lg,
      textAlign: 'center',
    } as Sx,

    statusText: {
      fontSize: fontSize.base,
      fontWeight: 500,
    } as Sx,

    fieldWrapBase: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      border: '1px solid transparent',
      borderRadius: radius.lg,
      px: space.md,
      py: space.xxs,
    } as Sx,

    fieldError: {
      borderColor: colors.primary.main,
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

    fieldSelect: {
      fontSize: fontSize.base,
    } as Sx,

    activityDayField: {
      flex: 1,
      '& input': { fontSize: fontSize.base, textAlign: 'right', py: '4px' },
    } as Sx,

    deleteIconButton: {
      color: colors.text.primary,
    } as Sx,

    deleteIcon: {
      fontSize: 18,
    } as Sx,

    // ----- Error Dialog -----
    dialogPaper: {
      borderRadius: radius.xxl,
      overflow: 'hidden',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
    } as Sx,

    dialogHeader: {
      backgroundColor: colors.background.paper,
      px: space.xxl,
      py: 1.75,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${colors.border.light}`,
    } as Sx,

    dialogTitle: {
      color: colors.primary.main,
      fontWeight: 700,
      fontSize: fontSize.h3,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    } as Sx,

    dialogCloseButton: {
      color: colors.background.paper,
      backgroundColor: '#000000',
      width: 28,
      height: 28,
      '&:hover': { backgroundColor: colors.text.primary },
    } as Sx,

    dialogCloseIcon: {
      fontSize: 16,
    } as Sx,

    dialogContent: {
      px: space.xxl,
      py: space.xxxl,
    } as Sx,

    dialogMessage: {
      fontSize: fontSize.base,
      color: colors.text.primary,
      lineHeight: 1.8,
    } as Sx,

    dialogList: {
      mt: space.md,
    } as Sx,

    dialogListItem: {
      py: space.xxs,
      px: 0,
    } as Sx,

    dialogListItemText: {
      '& .MuiListItemText-primary': {
        fontSize: fontSize.xxl,
        color: colors.text.primary,
      },
    } as Sx,

    dialogActions: {
      px: space.xxl,
      pb: space.xxl,
      pt: 0,
      justifyContent: 'flex-end',
    } as Sx,

    dialogOkButton: {
      backgroundColor: colors.primary.main,
      color: colors.background.paper,
      fontWeight: 600,
      fontSize: fontSize.lg,
      textTransform: 'uppercase',
      minWidth: 70,
      borderRadius: radius.lg,
      px: space.xxl,
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: colors.primary.dark,
        boxShadow: 'none',
      },
    } as Sx,
  },
};


// ----- Dynamic (state-dependent) style helpers -----

/**
 * Cell field-wrapper border/background based on validation error state.
 * Mirrors the previous inline `getCellBorderStyle` logic.
 */
export const getCellBorderStyle = (hasError: boolean): Sx =>
  hasError
    ? { border: `2px solid ${colors.primary.main}`, backgroundColor: colors.table.rowHover }
    : { border: `1px solid ${colors.border.light}`, backgroundColor: colors.background.paper };

/** Disabled (appointment_confirmation) activity-day wrapper border/background. */
export const activityDayDisabledStyle: Sx = {
  border: `1px solid ${colors.border.light}`,
  backgroundColor: colors.neutral[100],
};

/** Assign-group wrapper: white when enabled, grey when disabled. */
export const getAssignGroupWrapStyle = (enabled: boolean): Sx => ({
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${colors.border.light}`,
  backgroundColor: enabled ? colors.background.paper : colors.neutral[100],
  borderRadius: radius.lg,
  px: space.md,
  py: space.xxs,
});

/** Status text color depends on ADD vs other. */
export const getStatusColor = (isAdd: boolean): string =>
  isAdd ? colors.status.success : colors.text.secondary;
