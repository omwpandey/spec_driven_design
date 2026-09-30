import type { SxProps, Theme } from '@mui/material/styles';
import { colors, radius } from '@core/theme';

type Sx = SxProps<Theme>;

/**
 * Styles for the Branch Holiday Master / Working Day Calendar feature
 * (WorkingDayCalendar + SchedulerCalendar + related dialogs).
 * Generic primitives come from `commonStyles`; these are feature-specific.
 */

/** Legend swatch colors per day type (matches the design legend). */
export const dayTypeColors = {
  working: '#FFFFFF',
  weekend: '#FBEDEE', // faint pink stripe background
  holiday: colors.primary.main,
  notEditable: '#F5F5F5',
} as const;

export const schedulerStyles = {
  // ─── Calendar Setup / section panels ───
  panel: {
    border: `1px solid ${colors.border.light}`,
    borderRadius: radius.lg,
    backgroundColor: colors.background.paper,
    mb: 2,
  } as Sx,
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: 2,
    py: 1.25,
    borderBottom: `1px solid ${colors.border.light}`,
  } as Sx,
  panelBody: { p: 2 } as Sx,

  // ─── Month navigation row ───
  monthNav: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    border: `1px solid ${colors.border.light}`,
    borderRadius: radius.sm,
    px: 1,
    py: 0.25,
    width: 'fit-content',
  } as Sx,

  // ─── Legend ───
  legendRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    flexWrap: 'wrap',
  } as Sx,
  legendItem: { display: 'flex', alignItems: 'center', gap: 0.75 } as Sx,
  legendSwatch: (bg: string, border = colors.border.light): Sx => ({
    width: 14,
    height: 14,
    borderRadius: '3px',
    backgroundColor: bg,
    border: `1px solid ${border}`,
  }),

  // ─── Calendar grid ───
  weekdayHeaderRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    backgroundColor: colors.table.headerBg,
    borderTop: `1px solid ${colors.border.light}`,
    borderLeft: `1px solid ${colors.border.light}`,
  } as Sx,
  weekdayHeaderCell: {
    textAlign: 'center',
    py: 1,
    fontSize: '0.75rem',
    fontWeight: 700,
    color: colors.text.primary,
    textTransform: 'uppercase',
    borderRight: `1px solid ${colors.border.light}`,
  } as Sx,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    borderLeft: `1px solid ${colors.border.light}`,
  } as Sx,
  dayCell: (opts: {
    weekend: boolean;
    inMonth: boolean;
    editable: boolean;
    clickable: boolean;
  }): Sx => ({
    position: 'relative',
    minHeight: 92,
    p: 1,
    borderRight: `1px solid ${colors.border.light}`,
    borderBottom: `1px solid ${colors.border.light}`,
    backgroundColor: !opts.inMonth
      ? '#FAFAFA'
      : !opts.editable
        ? dayTypeColors.notEditable
        : opts.weekend
          ? dayTypeColors.weekend
          : dayTypeColors.working,
    cursor: opts.clickable && opts.editable && opts.inMonth ? 'pointer' : 'default',
    // Diagonal hatch for non-editable / adjacent-month cells (matches design).
    ...((!opts.inMonth || !opts.editable) && {
      backgroundImage:
        'repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 6px)',
    }),
    '&:hover': {
      backgroundColor:
        opts.clickable && opts.editable && opts.inMonth ? colors.table.rowHover : undefined,
    },
  }),
  dayNumber: (opts: { inMonth: boolean; weekend: boolean }): Sx => ({
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: !opts.inMonth
      ? colors.text.disabled
      : opts.weekend
        ? colors.primary.main
        : colors.text.primary,
  }),
  callPlanTag: {
    position: 'absolute',
    top: 6,
    right: 6,
    fontSize: '0.625rem',
    fontWeight: 600,
    color: '#B7791F',
    backgroundColor: '#FEF6E0',
    border: '1px solid #F5E1A4',
    borderRadius: '3px',
    px: 0.5,
    py: '1px',
    maxWidth: '80%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as Sx,
  holidayTag: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    fontSize: '0.625rem',
    fontWeight: 600,
    color: '#FFFFFF',
    backgroundColor: colors.primary.main,
    borderRadius: '3px',
    px: 0.5,
    py: '1px',
    maxWidth: '85%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as Sx,

  // ─── Dialog field label + legend chips (Call In / Call Out) ───
  fieldLabel: {
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: colors.text.primary,
    mb: 0.75,
  } as Sx,
  callSwatch: (bg: string): Sx => ({
    width: 12,
    height: 12,
    borderRadius: '3px',
    backgroundColor: bg,
    display: 'inline-block',
  }),
} as const;

/** Swatch colors for the Call In (yellow) / Call Out (blue) legend. */
export const callColors = {
  callIn: '#F2C200',
  callOut: '#1FA5D6',
} as const;
