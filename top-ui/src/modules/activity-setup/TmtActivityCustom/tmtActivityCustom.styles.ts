import type { CSSProperties } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  colors,
  space,
  radius,
  fontSize,
  fluidFont,
  fontFamilyPrompt,
  formLabelInset,
} from '@core/theme';

/**
 * TMT Activity Custom — single, page-specific style file.
 *
 * ALL CSS and typography for TmtActivityCustomPage.tsx lives here. The page and
 * its sub-components (MultiSelectDropdown, NumberSpinner, MonthSelector,
 * ToggleWithLabels, VehicleConditionsTab, ServiceInConditionsTab,
 * DealerApprovalStatusTab) must not declare inline `sx={{ ... }}` /
 * `style={{ ... }}` objects — import the relevant entry from this file instead.
 *
 * All colors, spacing (padding/margin), radii and font sizes come from the
 * shared design tokens in `@core/theme` (colors / space / radius / fontSize /
 * fluidFont / fontFamilyPrompt).
 *
 * A handful of style values depend on runtime state (selected/enabled, toggle
 * position, status color, etc.); those are exposed as small factory functions
 * at the bottom of the file.
 */

type Sx = SxProps<Theme>;

// Fluid fonts used pervasively across labels/selects (shared token source).
const FLUID_FONT = fluidFont.base;
const FLUID_FONT_SM = fluidFont.sm;
const PROMPT = fontFamilyPrompt;
// Default left inset applied to every field label on this page (shared token).
const LABEL_INSET = formLabelInset;

// Shared footer action button (all 6 footer buttons are identical).
const footerButton: Sx = {
  color: colors.neutral.black,
  borderColor: colors.border.light,
  backgroundColor: colors.background.paper,
  fontSize: fontSize.base,
  fontWeight: 400,
  lineHeight: '16px',
  textTransform: 'none',
  px: space.xxl,
  py: space.sm,
  borderRadius: radius.lg,
  '&:hover': { backgroundColor: colors.neutral[100], borderColor: colors.neutral[400] },
};

export const tmtStyles = {
  // ===== Shared / reused =====
  shared: {
    // Standard field label above inputs.
    fieldLabel: {
      fontFamily: PROMPT,
      fontSize: FLUID_FONT,
      lineHeight: 1.3,
      fontWeight: 500,
      color: colors.neutral.black,
      mb: '8px',
      pl: LABEL_INSET,
    } as Sx,

    // Field label with 6px bottom margin (used in DOB/age columns).
    fieldLabelTight: {
      fontFamily: PROMPT,
      fontSize: FLUID_FONT,
      lineHeight: 1.3,
      fontWeight: 500,
      color: colors.neutral.black,
      mb: '6px',
      pl: LABEL_INSET,
    } as Sx,

    // Standard Select box (40px tall, fluid font, Prompt).
    select: {
      height: '40px',
      fontSize: FLUID_FONT,
      fontFamily: PROMPT,
    } as Sx,

    // Standard Select with 0.875rem font (used in a few spots).
    selectSm: {
      height: '40px',
      fontSize: fontSize.base,
    } as Sx,

    // Disabled grey Select (District/Sub-District/Zip).
    selectDisabled: {
      height: '40px',
      fontSize: fontSize.base,
      backgroundColor: colors.neutral[150],
      '&.Mui-disabled': { backgroundColor: colors.neutral[150] },
    } as Sx,

    // Standard 40px text field.
    textField40: {
      '& .MuiInputBase-root': { height: '40px' },
    } as Sx,

    // Disabled grey text field (Activity ID).
    textField40Disabled: {
      '& .MuiInputBase-root': { height: '40px', backgroundColor: colors.neutral[100] },
      '& .Mui-disabled': { WebkitTextFillColor: colors.text.primary },
    } as Sx,

    // Small number text field (age min/max) with fluid small font + placeholder.
    ageTextField: {
      '& .MuiInputBase-input': { fontSize: FLUID_FONT_SM, px: 1.25 },
      '& .MuiInputBase-input::placeholder': { fontSize: FLUID_FONT_SM, opacity: 1 },
    } as Sx,

    // Red checkbox/radio: grey (#999) unchecked -> Toyota red checked.
    redControl999: {
      color: colors.text.disabled,
      '&.Mui-checked': { color: colors.primary.main },
      p: space.xs,
    } as Sx,

    // Same as above but tighter padding (0.4) used in job-detail cards.
    redControl999Tight: {
      color: colors.text.disabled,
      '&.Mui-checked': { color: colors.primary.main },
      p: 0.4,
    } as Sx,

    // Same but 0.3 padding (PNC row radios).
    redControl999XTight: {
      color: colors.text.disabled,
      '&.Mui-checked': { color: colors.primary.main },
      p: 0.3,
    } as Sx,

    // #999 red control with no padding override (activity type radios).
    redControl999NoPad: {
      color: colors.text.disabled,
      '&.Mui-checked': { color: colors.primary.main },
    } as Sx,

    // Red checkbox with #49454F unchecked color (ownership/day/time).
    redControl49: {
      color: colors.text.secondary,
      '&.Mui-checked': { color: colors.primary.main },
      p: space.xs,
    } as Sx,

    // Red checkbox #49454F with no padding override (ownership toggles).
    redControl49NoPad: {
      color: colors.text.secondary,
      '&.Mui-checked': { color: colors.primary.main },
    } as Sx,

    // Menu-item label typography (1rem).
    menuItemLabel: { fontSize: fontSize.xxl } as Sx,

    // Checkbox/radio option label typography (fluid, capitalize, black).
    optionLabel: {
      fontFamily: PROMPT,
      fontSize: FLUID_FONT,
      lineHeight: 1.5,
      fontWeight: 400,
      color: '#000000',
      textTransform: 'capitalize',
    } as Sx,

    // Simple divider spacing between subsections.
    dividerMy: { my: space.xs } as Sx,

    // Column stack container (flex column, gap 3).
    columnGap3: { display: 'flex', flexDirection: 'column', gap: space.xxxl } as Sx,
  },

  // ===== Subsection title (red bar + text) =====
  subsection: {
    wrapper: { display: 'flex', alignItems: 'center', gap: space.md, mb: space.xl } as Sx,
    // Wrapper with larger bottom margin (customer tab subsections).
    wrapperLg: { display: 'flex', alignItems: 'center', gap: space.md, mb: space.xxl } as Sx,
    bar: { width: 4, height: 18, backgroundColor: colors.primary.main, borderRadius: radius.xs } as Sx,
    // Pill-shaped bar (customer tab).
    barPill: { width: 4, height: 20, backgroundColor: colors.primary.main, borderRadius: radius.pill } as Sx,
    title: { fontWeight: 600, fontSize: fontSize.xl } as Sx,
    // Title with Prompt font (customer tab).
    titlePrompt: {
      fontFamily: PROMPT,
      fontWeight: 600,
      fontSize: FLUID_FONT,
      lineHeight: 1.3,
      color: colors.neutral.black,
    } as Sx,
  },

  // ===== Dropdown sub-components (MultiSelect / NumberSpinner / MonthSelector) =====
  dropdown: {
    triggerBox: {
      border: `1.09px solid ${colors.input.border}`,
      borderRadius: radius.sm,
      px: space.xl,
      py: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '40px',
      backgroundColor: colors.background.paper,
      '&:hover': { borderColor: colors.input.border },
    } as Sx,

    // Narrower horizontal padding variant (NumberSpinner / MonthSelector).
    triggerBoxNarrow: {
      border: `1.09px solid ${colors.input.border}`,
      borderRadius: radius.sm,
      px: 1.25,
      py: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '40px',
      backgroundColor: colors.background.paper,
      '&:hover': { borderColor: colors.input.border },
    } as Sx,

    triggerCaret: { fontSize: fontSize.md, color: colors.input.caret, ml: space.md } as Sx,
    triggerCaretSm: { fontSize: fontSize.xs, color: colors.grey.muted, ml: space.xs, flexShrink: 0 } as Sx,

    popoverPaperMulti: {
      mt: space.xs,
      minWidth: 220,
      maxHeight: 300,
      border: `1px solid ${colors.border.light}`,
      boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
    } as Sx,
    popoverPaperNumber: {
      mt: space.xs,
      minWidth: 120,
      maxHeight: 250,
      overflowY: 'auto',
      border: `1px solid ${colors.border.light}`,
      boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
    } as Sx,
    popoverPaperMonth: {
      mt: space.xs,
      minWidth: 160,
      maxHeight: 300,
      overflowY: 'auto',
      border: `1px solid ${colors.border.light}`,
      boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
    } as Sx,

    popoverBody1: { p: space.md } as Sx,
    popoverBodyHalf: { p: space.xs } as Sx,

    checkbox: { color: colors.primary.main, '&.Mui-checked': { color: colors.primary.main }, p: space.xs } as Sx,
    checkboxLabel: { fontSize: fontSize.xxl } as Sx,
    checkboxControl: { display: 'flex', mx: 0, mb: space.xxs } as Sx,

    footerRow: { mt: space.xs, borderTop: `1px solid ${colors.border.light}`, pt: space.xs, display: 'flex', gap: space.md } as Sx,
    selectAllLink: { color: colors.primary.main, textDecoration: 'none', fontWeight: 500, fontSize: fontSize.md } as Sx,
    noneLink: { color: colors.text.disabled, textDecoration: 'none', fontSize: fontSize.md } as Sx,

    optionCheckMark: { color: colors.primary.main } as CSSProperties,
  },

  // ===== Toggle with No/Yes labels =====
  toggle: {
    wrapper: { display: 'flex', alignItems: 'center', gap: space.lg, flexWrap: 'wrap' } as Sx,
    label: {
      fontFamily: PROMPT,
      fontSize: { xs: fontSize.base, md: '16px' },
      lineHeight: 1.3,
      fontWeight: 500,
      color: colors.neutral.black,
    } as Sx,
    noYesText: {
      fontFamily: PROMPT,
      fontSize: FLUID_FONT,
      lineHeight: 1.3,
      color: colors.neutral.black,
      fontWeight: 500,
    } as Sx,
    knobBase: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      backgroundColor: colors.background.paper,
      position: 'absolute',
      top: 3,
      transition: 'left 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    } as Sx,
  },

  // ===== Page shell =====
  page: {
    formStack: { display: 'flex', flexDirection: 'column', gap: space.xxl, mt: -1.4 } as Sx,
    fullWidth: { width: '100%' } as Sx,

    // Activity setup two rows (grid).
    setupRow1: {
      display: 'grid',
      gap: space.xl,
      mb: space.xl,
      alignItems: 'start',
      gridTemplateColumns: {
        xs: '1fr',
        sm: '1fr 1fr',
        md: 'minmax(140px, 180px) minmax(180px, 260px) minmax(0, 1fr)',
      },
    } as Sx,
    setupRow2: {
      display: 'grid',
      gap: space.xl,
      alignItems: 'start',
      gridTemplateColumns: {
        xs: '1fr',
        sm: '1fr 1fr',
        md: 'minmax(140px, 180px) minmax(180px, 260px) minmax(0, 1fr)',
      },
    } as Sx,

    labelGrey: { fontSize: fontSize.xxl, fontWeight: 500, color: colors.nonMandatory, mb: '8px', pl: LABEL_INSET } as Sx,
    labelRed: { fontSize: fontSize.xxl, fontWeight: 500, color: colors.primary.main, mb: '8px', pl: LABEL_INSET } as Sx,

    descriptionCol: { width: '100%', maxWidth: '40rem', minWidth: 0 } as Sx,

    validRangeGrid: {
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      gap: space.xl,
      width: '100%',
      maxWidth: '40rem',
      minWidth: 0,
    } as Sx,

    // Radio option label (activity type / tabs)
    radioOptionLabel: { fontSize: fontSize.xxl } as Sx,

    tabs: {
      borderBottom: `1px solid ${colors.input.border}`,
      mb: space.xxl,
      '& .MuiTab-root': {
        textTransform: 'none',
        fontFamily: PROMPT,
        fontSize: { xs: fontSize.lg, sm: fontSize.xl, md: '16px' },
        lineHeight: '140%',
        fontWeight: 400,
        color: '#767676',
        minHeight: 30,
        minWidth: 'auto',
      },
      '& .Mui-selected': { color: colors.primary.main, fontWeight: 600 },
      '& .MuiTabs-indicator': { backgroundColor: colors.primary.main },
    } as Sx,

    customerTabStack: { display: 'flex', flexDirection: 'column', gap: 4 } as Sx,

    // DOB multi-column layout
    dobColumnsRow: {
      display: 'flex',
      flexDirection: { xs: 'column', lg: 'row' },
      gap: { xs: space.xxxl, lg: 0 },
      borderTop: `1px solid ${colors.input.border}`,
      pt: space.xxl,
    } as Sx,
    dobColFirst: { flex: { xs: '1 1 auto', lg: '1 1 0' }, minWidth: 0, pr: { xs: 0, lg: 2.5 } } as Sx,
    dobColMiddle: { flex: { xs: '1 1 auto', lg: '1 1 0' }, minWidth: 0, px: { xs: 0, lg: 2.5 } } as Sx,
    dobColLast: { flex: { xs: '1 1 auto', lg: '1 1 0' }, minWidth: 0, pl: { xs: 0, lg: 2.5 } } as Sx,
    dobVerticalDividerWrap: { display: { xs: 'none', lg: 'flex' }, justifyContent: 'center', alignItems: 'center', px: 0 } as Sx,
    dobVerticalDivider: { height: '160px' } as Sx,
    dobRangeRadioGroup: { mb: space.xxl, gap: space.xl } as Sx,
    dobRangeGridMb: { mb: space.xxl } as Sx,
    dobColLabelMb15: {
      fontFamily: PROMPT,
      fontSize: FLUID_FONT,
      lineHeight: 1.3,
      fontWeight: 500,
      color: colors.neutral.black,
      mb: space.lg,
      pl: LABEL_INSET,
    } as Sx,
    dobColLabelMb3: {
      fontFamily: PROMPT,
      fontSize: FLUID_FONT,
      lineHeight: 1.3,
      fontWeight: 500,
      color: colors.neutral.black,
      mb: space.xxxl,
      pl: LABEL_INSET,
    } as Sx,
    dobRadioLabel: {
      fontFamily: PROMPT,
      fontSize: FLUID_FONT,
      lineHeight: 1.3,
      fontWeight: 400,
      color: colors.neutral.black,
    } as Sx,
    dobRadioRedAlways: { color: colors.primary.main, '&.Mui-checked': { color: colors.primary.main }, p: space.xs } as Sx,
    dobRadioBlack: { color: colors.neutral.black, '&.Mui-checked': { color: colors.primary.main }, p: space.xs } as Sx,
    dobRangeFirstRadioNoMr: { mr: 0 } as Sx,
    educationEllipsis: {
      display: 'block',
      fontFamily: PROMPT,
      fontSize: 'clamp(0.75rem, 0.35vw + 0.62rem, 0.875rem)',
      lineHeight: 1.3,
      fontWeight: 500,
      color: colors.neutral.black,
      mb: '6px',
      pl: LABEL_INSET,
    } as Sx,
    occupationBlockMb: { mb: space.xxl } as Sx,
    hobbySpacer: { height: '24px', mb: space.xxxl } as Sx,

    // Ownership section
    inlineRow: { display: 'flex', alignItems: 'center', gap: space.xxxl, flexWrap: 'wrap' } as Sx,
    ownershipLabel: {
      fontFamily: PROMPT,
      fontSize: FLUID_FONT,
      lineHeight: 1.3,
      fontWeight: 500,
      color: colors.neutral.black,
      pl: LABEL_INSET,
    } as Sx,
    inlineRowGap4: { display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' } as Sx,
    verticalDividerMx1: { mx: space.md } as Sx,
    numberOfCarsRow: { display: 'flex', alignItems: 'center', gap: space.lg } as Sx,
    smallNumberField: {
      width: 60,
      '& .MuiInputBase-root': { height: '36px' },
      '& input': { textAlign: 'center', fontSize: fontSize.base },
    } as Sx,

    // Preferred contact day & time
    contactDayTimeStack: { display: 'flex', flexDirection: 'column', gap: space.xxl } as Sx,
    convenientDayLabel: {
      fontFamily: PROMPT,
      fontSize: FLUID_FONT,
      lineHeight: 1.3,
      fontWeight: 500,
      color: colors.neutral.black,
      mb: space.md,
      pl: LABEL_INSET,
    } as Sx,
    convenientDayRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: space.md } as Sx,
    convenientDayChecks: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', flex: 1, minWidth: 0, gap: { xs: space.xl, md: 4, lg: 16 } } as Sx,
    convenientDayControl: { mr: space.lg, mb: 0 } as Sx,
    quickSelectRow: { display: 'flex', gap: space.md, flexShrink: 0, mt: -5 } as Sx,
    quickSelectButton: { textTransform: 'none', fontSize: fontSize.md, borderColor: colors.border.light, color: colors.text.primary, whiteSpace: 'nowrap' } as Sx,
    availableRow: { display: 'flex', minHeight: 80 } as Sx,
    availableColAllDay: { flex: '0 0 25%', pr: space.xxxl } as Sx,
    availableColAmPm: { flex: '0 0 30%', px: space.xxxl } as Sx,
    availableColOffHour: { flex: 1, pl: space.xxxl } as Sx,
    availableColTitle: {
      fontFamily: PROMPT,
      fontSize: FLUID_FONT,
      lineHeight: 1.3,
      fontWeight: 500,
      color: colors.neutral.black,
      mb: space.xs,
    } as Sx,
    availableCheckStack: { display: 'flex', flexDirection: 'column', gap: space.xxs } as Sx,

    // Contact channel details table add button
    addButtonIcon: { fontSize: '14px !important' } as Sx,
    addButton: {
      fontSize: fontSize.base,
      px: space.lg,
      py: space.xs,
      mt: space.md,
      mb: space.md,
      color: colors.neutral.black,
      fontWeight: 500,
      textTransform: 'none',
      backgroundColor: colors.background.paper,
    } as Sx,

    // Footer
    footerButton,
    footerButtonIcon: { fontSize: '18px !important', color: colors.neutral.black } as Sx,
  },

  // ===== Vehicle type checkbox row =====
  vehicleType: {
    row: { display: 'flex', gap: space.xl, mt: space.xs } as Sx,
  },

  // ===== Service-In Conditions tab =====
  serviceIn: {
    gridAlignEnd: { alignItems: 'flex-end' } as Sx,
    jobDetailsTitle: { fontWeight: 600, fontSize: fontSize.xl, mb: space.xl } as Sx,
    jobCard: { border: `1px solid ${colors.border.light}`, borderRadius: radius.lg, p: space.xl } as Sx,
    jobCardTitle: { fontWeight: 600, fontSize: fontSize.xxl, mb: space.lg } as Sx,
    jobCardStack: { display: 'flex', flexDirection: 'column', gap: space.xl } as Sx,
    pmControl: { display: 'flex', m: 0, mb: space.xxs } as Sx,
    pmControlLast: { display: 'flex', m: 0 } as Sx,
    grRow: { display: 'flex', gap: space.xl } as Sx,
    oilRow: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: { xs: space.sm, sm: space.lg }, mb: space.sm } as Sx,
    oilLabel: { fontSize: { xs: fontSize.lg, md: fontSize.xxl }, minWidth: 60 } as Sx,
    oilCode: { fontSize: { xs: fontSize.lg, md: fontSize.xxl }, fontWeight: 600, minWidth: 60 } as Sx,
    oilDetailsLabel: { fontSize: { xs: fontSize.lg, md: fontSize.xxl }, color: colors.grey.muted } as Sx,
    oilDetailsText: { fontSize: { xs: fontSize.lg, md: fontSize.xxl }, overflowWrap: 'anywhere', minWidth: 0 } as Sx,
    pncRadioRow: { display: 'flex', alignItems: 'center', gap: space.xs, mb: '6px' } as Sx,
    pncRadioGroup: { '& .MuiFormControlLabel-root': { mr: space.md } } as Sx,
    searchIcon: { fontSize: 18, color: colors.grey.muted } as Sx,
  },

  // ===== Dealer Approval Status tab =====
  dealer: {
    tableWrap: { border: `1px solid ${colors.neutral[300]}`, borderRadius: '5px', overflow: 'hidden' } as Sx,
    exportBar: { display: 'flex', justifyContent: 'flex-end', px: space.lg, pt: space.md, pb: space.xs, backgroundColor: colors.table.headerBgAlt } as Sx,
    exportIcon: { fontSize: '14px !important' } as Sx,
    exportButton: {
      fontSize: fontSize.xxl,
      color: colors.text.primary,
      fontWeight: 500,
      textTransform: 'none',
      backgroundColor: colors.background.paper,
      border: `1px solid ${colors.border.light}`,
      borderRadius: radius.lg,
      px: space.lg,
    } as Sx,
    tableContainer: { overflowX: 'auto' } as Sx,

    // Header cell base (shared by all dealer header cells).
    headerCellBase: {
      backgroundColor: colors.table.headerBgAlt,
      color: `${colors.neutral.black} !important`,
      fontWeight: 700,
      fontSize: 'clamp(0.6875rem, 0.45vw + 0.5rem, 0.8125rem)',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      borderTop: `1px solid ${colors.neutral[300]}`,
      borderBottom: `1px solid ${colors.neutral[300]}`,
      borderRight: `1px solid ${colors.neutral[300]}`,
      py: '12px',
      px: '16px',
    } as Sx,
    headerColNo: { width: '60px' } as const,
    headerSortableRight: { cursor: 'pointer', textAlign: 'right' as const },
    // Status header omits right border and centers.
    headerStatusBase: {
      backgroundColor: colors.table.headerBgAlt,
      color: `${colors.neutral.black} !important`,
      fontWeight: 700,
      fontSize: 'clamp(0.6875rem, 0.45vw + 0.5rem, 0.8125rem)',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      borderTop: `1px solid ${colors.neutral[300]}`,
      borderBottom: `1px solid ${colors.neutral[300]}`,
      py: '12px',
      px: '16px',
      cursor: 'pointer',
      textAlign: 'center',
    } as Sx,

    bodyRow: { '&:hover': { backgroundColor: colors.table.rowHoverAlt } } as Sx,
    bodyCell: { borderBottom: `1px solid ${colors.neutral[300]}`, borderRight: `1px solid ${colors.neutral[300]}`, fontSize: fontSize.base, py: space.lg, px: '16px' } as Sx,
    bodyCellRight: { borderBottom: `1px solid ${colors.neutral[300]}`, borderRight: `1px solid ${colors.neutral[300]}`, fontSize: fontSize.base, py: space.lg, px: '16px', textAlign: 'right' } as Sx,
    bodyCellStatus: { borderBottom: `1px solid ${colors.neutral[300]}`, fontSize: fontSize.base, py: space.lg, px: '16px', textAlign: 'center' } as Sx,

    paginationBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: space.lg, px: space.xl, py: space.lg, borderTop: `1px solid ${colors.neutral[300]}` } as Sx,
    paginationInfo: { fontSize: { xs: fontSize.lg, sm: fontSize.xxl }, color: colors.grey.muted } as Sx,
    paginationControls: { display: 'flex', alignItems: 'center', gap: space.lg, flexWrap: 'wrap' } as Sx,
    goToButton: { fontSize: fontSize.md, textTransform: 'none', minWidth: 'auto', px: space.lg, borderColor: colors.border.light, color: colors.text.primary } as Sx,
    rowsPerPageSelect: { height: 30, fontSize: fontSize.md } as Sx,
    pagination: {
      '& .MuiPaginationItem-root': { fontSize: fontSize.md, minWidth: 28, height: 28 },
      '& .Mui-selected': { backgroundColor: `${colors.primary.main} !important`, color: colors.background.paper },
    } as Sx,
  },

  // ===== Contact Channel Details table columns =====
  contactTable: {
    statusText: { fontSize: fontSize.base, fontWeight: 500 } as Sx,
    fieldSelect: { fontSize: fontSize.base, height: '36px' } as Sx,
    activityDayField: {
      '& input': { textAlign: 'right', fontSize: fontSize.base, py: '10px' },
      '& .MuiInputBase-root': { height: '40px', backgroundColor: colors.neutral[100], borderRadius: radius.lg },
      '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border.light },
      '& .Mui-disabled': { WebkitTextFillColor: colors.text.primary },
    } as Sx,
    deleteIconButton: { color: colors.neutral.black } as Sx,
    deleteIcon: { fontSize: 18 } as Sx,
  },
};

// ===== Dynamic (state-dependent) helpers =====

/** MultiSelect/Number/Month trigger display text color (has value vs placeholder). */
export const getTriggerTextStyle = (hasValue: boolean, small = false): Sx => ({
  fontFamily: PROMPT,
  fontSize: small ? fluidFont.sm : FLUID_FONT,
  lineHeight: 1.5,
  color: hasValue ? colors.neutral.black : 'rgba(26, 26, 26, 0.5)',
  flex: 1,
  minWidth: 0,
});

/** NumberSpinner / MonthSelector option row (selected highlight). */
export const getSpinnerOptionStyle = (selected: boolean): Sx => ({
  px: space.xl,
  py: space.sm,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: selected ? colors.table.headerBg : 'transparent',
  color: selected ? colors.primary.main : colors.text.primary,
  '&:hover': { backgroundColor: colors.neutral[100] },
  fontSize: fontSize.base,
  borderRadius: radius.lg,
});

/** Toggle track color depends on checked state. */
export const getToggleTrackStyle = (checked: boolean): Sx => ({
  width: 52,
  height: 28,
  borderRadius: '14px',
  backgroundColor: checked ? colors.primary.main : colors.neutral[400],
  position: 'relative',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  display: 'flex',
  alignItems: 'center',
});

/** Toggle knob left offset depends on checked state (spread over knobBase). */
export const getToggleKnobLeft = (checked: boolean): Sx => ({ left: checked ? 27 : 3 });

/** Contact-channel status text color (ADD = green). */
export const getContactStatusColor = (isAdd: boolean): string => (isAdd ? colors.status.success : colors.nonMandatory);

/** Dealer status chip style from the status color map. */
export const getStatusChipStyle = (bg: string, color: string): Sx => ({
  backgroundColor: bg,
  color,
  fontWeight: 500,
  fontSize: fontSize.md,
  height: 26,
  border: `1px solid ${color}20`,
});
