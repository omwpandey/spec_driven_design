import type { CSSProperties } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { colors, FONT_PROMPT, radius } from '@core/theme';

/**
 * Dashboard — single, page-specific style file.
 *
 * ALL CSS and typography for DashboardPage.tsx (and its in-file sub-components:
 * EChart, Panel, PanelTitle, PreviewPanel, MetricCard, ActivityCard,
 * ActivityGrid, SummaryRow) live here. Components must not declare inline
 * `sx={{ ... }}` / `style={{ ... }}` objects — import from this file instead.
 *
 * Many styles depend on a runtime color (metric/activity/preview color); those
 * are exposed as small factory functions at the bottom. The dashboard palette
 * is exported from here so the page (chart options) and styles share one source.
 */

type Sx = SxProps<Theme>;

// ─── Palette (single source of truth) ───
// All dashboard colors resolve to shared theme tokens (`colors`). The chart
// accents live under `colors.chart` so the page (chart options) and these
// styles share one definition.
export const palette = {
  RED: colors.chart.red,
  BLUE: colors.chart.blue,
  ORANGE: colors.chart.orange,
  GREEN: colors.chart.green,
  GRAY: colors.chart.gray,
  BORDER: colors.border.light,
};

const { RED, GREEN, BORDER } = palette;

export const dashboardStyles = {
  // ─── EChart ───
  // On mobile the donut panels stack in `auto` grid rows, so a chart height of
  // `100%` resolves against a content-sized (effectively 0) parent and the
  // canvas collapses — hiding the donut. A responsive minHeight guarantees the
  // canvas has vertical room on small screens; from `sm` up the panel has a
  // real height so `height: 100%` takes over and this minHeight is harmless.
  chartBox: { width: '100%', minHeight: { xs: 180, sm: 0 }, overflow: 'hidden' } as Sx,

  // ─── Panel / PanelTitle ───
  panel: {
    border: `1px solid ${BORDER}`,
    borderRadius: 1.5,
    bgcolor: colors.background.paper,
    overflow: 'hidden',
  } as Sx,
  panelTitleRow: {
    px: 2,
    pt: 1.5,
    pb: 0.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as Sx,
  panelTitleText: { fontSize: 14, fontWeight: 700, color: colors.text.primary } as Sx,

  // ─── PreviewPanel ───
  previewBackBtn: { color: colors.nonMandatory, px: 0, mb: 1, pl: 1, pr: 1 } as Sx,
  previewLabel: { fontSize: 11, color: colors.grey.muted } as Sx,
  previewTitle: { fontSize: 14, fontWeight: 700, mt: 1 } as Sx,
  previewHint: { fontSize: 11, color: colors.grey.muted, mt: 0.5 } as Sx,

  // ─── MetricCard ───
  metricInner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    p: '10px 12px',
    minHeight: 60,
    flexWrap: 'nowrap',
  } as Sx,
  statusValueLabelWrap: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '6px',
    minWidth: 0,
  } as Sx,
  statusLabelText: {
    fontFamily: FONT_PROMPT,
    fontWeight: 400,
    fontSize: 'clamp(9px, 0.8vw, 12px)',
    lineHeight: 1.3,
    letterSpacing: '0.275px',
    textTransform: 'uppercase',
    color: colors.grey.slate,
    minWidth: 0,
  } as Sx,
  statusViewListWrap: {
    flex: 'none',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '3px',
    ml: 'auto',
  } as Sx,
  statusViewListText: {
    fontFamily: FONT_PROMPT,
    fontWeight: 400,
    fontSize: 'clamp(9px, 0.8vw, 12px)',
    lineHeight: 1.3,
    textDecorationLine: 'underline',
    color: RED,
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  } as Sx,
  statusViewListIcon: { fontSize: 'clamp(10px, 0.9vw, 14px)', color: RED } as Sx,

  trafficRightWrap: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: 0,
  } as Sx,
  trafficTitle: {
    fontFamily: FONT_PROMPT,
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '16px',
    color: colors.grey.slate,
    width: '100%',
  } as Sx,
  trafficValueRow: { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', minWidth: 0 } as Sx,
  trafficValue: {
    fontFamily: FONT_PROMPT,
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '22px',
    color: colors.grey.slate2,
    minWidth: 0,
  } as Sx,
  trafficViewListWrap: { ml: 'auto', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 } as Sx,
  trafficViewListText: {
    fontFamily: FONT_PROMPT,
    fontWeight: 400,
    fontSize: '11px',
    lineHeight: '15px',
    textDecorationLine: 'underline',
    color: RED,
    whiteSpace: 'nowrap',
  } as Sx,
  trafficViewListIcon: { fontSize: 12, color: RED } as Sx,

  // ─── ActivityCard ───
  activityInner: { p: 1.25 } as Sx,
  activityHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } as Sx,
  activityNameWrap: { display: 'flex', gap: 0.75, alignItems: 'center', minWidth: 0 } as Sx,
  activityNameCol: { minWidth: 0 } as Sx,
  activityName: { fontSize: 14, fontWeight: 700 } as Sx,
  activityTotal: { fontSize: 14, color: colors.neutral.dark3 } as Sx,
  activityTotalBold: { fontSize: 16, color: colors.neutral.dark2 } as CSSProperties,
  activityGroupsIcon: { fontSize: 14 } as Sx,
  activityDivider: { my: 1 } as Sx,
  activityFooterRow: { display: 'flex', justifyContent: 'space-between' } as Sx,
  activityFooterText: { fontSize: 12, color: colors.grey.muted } as Sx,

  // ─── ActivityGrid ───
  activityGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' },
    gap: 1.25,
    p: 1.5,
    contentVisibility: 'auto',
    containIntrinsicSize: '0 180px',
  } as Sx,

  // ─── SummaryRow ───
  summaryRow: { display: 'flex', alignItems: 'baseline', gap: 1.5, py: 0.25 } as Sx,
  summaryLabel: { fontSize: 11, color: colors.nonMandatory, minWidth: 130, flexShrink: 0 } as Sx,

  // ─── Page: header actions ───
  syncChipIcon: { fontSize: '14px !important' } as Sx,
  exportIcon: { fontSize: 19 } as Sx,
  roleSelect: { fontSize: 12 } as Sx,

  // ─── Page: Call Center Status ───
  relativeBox: { position: 'relative' } as Sx,
  liveChip: { height: 19, bgcolor: '#e8f7ee', color: GREEN, fontSize: 10, fontWeight: 700 } as Sx,
  statusCardsRow: { display: 'flex', gap: 1.25, p: 1.5, flexWrap: 'wrap', alignItems: 'center' } as Sx,
  statusCardsInner: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 1.25,
    // Wrap when there isn't room for all three cards on one line, so they
    // keep their readable size instead of shrinking into thin lines.
    flexWrap: 'wrap',
    flex: '2 1 380px',
    minWidth: 0,
  } as Sx,
  crossFilters: { display: 'flex', gap: 1, ml: { xs: 0, md: 'auto' }, flexWrap: 'wrap', alignItems: 'flex-end' } as Sx,
  filterControl160: { flex: '1 1 160px', minWidth: 160 } as Sx,
  filterControl150: { flex: '1 1 150px', minWidth: 150 } as Sx,
  filterLabel: { fontSize: '0.75rem', color: colors.grey.muted, mb: 0.25 } as Sx,
  branchSelect: { '& .MuiSelect-select': { textOverflow: 'clip' } } as Sx,
  metricIcon16: { fontSize: 16 } as Sx,

  // ─── Online Staff List overlay ───
  onlineOverlay: {
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 20,
    width: { xs: '100%', sm: 320 },
    mt: 0.5,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    p: 0,
  } as Sx,
  onlineHeaderRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 1 } as Sx,
  onlineHeaderLeft: { display: 'flex', alignItems: 'center', gap: 1 } as Sx,
  onlineTitle: { fontSize: 16, fontWeight: 700, color: GREEN } as Sx,
  onlineCountChip: { bgcolor: GREEN, color: colors.background.paper, fontWeight: 700, height: 22 } as Sx,
  onlineCloseIcon: { fontSize: 18 } as Sx,
  onlineSearchBox: { px: 2, pb: 1 } as Sx,
  onlineSearchIcon: { fontSize: 16 } as Sx,
  onlineList: { maxHeight: 280, overflowY: 'auto', px: 1 } as Sx,
  onlineAvatar: { width: 32, height: 32, bgcolor: RED, fontSize: 12 } as Sx,
  onlineName: { fontSize: 12, fontWeight: 600 } as Sx,
  onlineStatus: { fontSize: 10, color: GREEN } as Sx,

  // ─── Section titles ───
  sectionTitle: { fontSize: 16, fontWeight: 700, color: colors.text.primary } as Sx,
  sectionTitleMt: { fontSize: 16, fontWeight: 700, color: colors.text.primary, mt: 0.5 } as Sx,
  subSectionTitlePad: { fontSize: 16, fontWeight: 700, color: colors.text.primary, px: 2, pt: 1 } as Sx,

  // ─── Appointment Summary ───
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 593px) minmax(0,1fr)' },
    gap: 1.5,
    alignItems: 'stretch',
  } as Sx,
  donutColumn: {
    display: 'grid',
    gap: 1.5,
    gridTemplateRows: { xs: 'auto auto', lg: '1fr 1fr' },
    minHeight: 0,
  } as Sx,
  donutPanel: { height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 } as Sx,
  donutBody: {
    flex: 1,
    minHeight: 0,
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) minmax(280px, 1.2fr)' },
    alignItems: 'center',
    columnGap: 1,
    px: 2,
    pb: 1,
    pt: 0,
  } as Sx,
  dailyNote: { fontSize: 10, color: '#49454FB2', py: 0.25 } as Sx,

  // Bar panel
  barVisibilityIcon: { fontSize: 16, color: colors.text.disabled } as Sx,
  barTotalsRow: { display: 'flex', alignItems: 'center', pl: 1.5, pr: '20px', mb: 0.5 } as Sx,
  barTotalsLabel: { fontSize: 11, color: colors.nonMandatory, width: 40, flexShrink: 0 } as Sx,
  barTotalsGrid: { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' } as Sx,
  barTotalsCell: { display: 'flex', justifyContent: 'center' } as Sx,
  barTotalChip: { height: 20, minWidth: 34, fontSize: 10, fontWeight: 700, bgcolor: colors.neutral[200], color: colors.text.primary } as Sx,

  // ─── Follow-up ───
  followupHeaderRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 } as Sx,
  followupTabsRow: { display: 'flex', gap: 2, px: 2, pt: 1, borderBottom: `1px solid ${BORDER}` } as Sx,
  previewPad: { p: 2 } as Sx,

  // ─── Call Summary & Traffic ───
  trafficGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)', lg: 'repeat(6,1fr)' },
    gap: 1.25,
  } as Sx,
  trafficIcon18: { fontSize: 20 } as Sx,
  statusPreviewPanel: { mt: 1 } as Sx,
};

// ─── Color-dependent factory helpers ───

/** PreviewPanel outer container (color-tinted gradient background). */
export const getPreviewContainer = (color: string): Sx => ({
  p: 2,
  height: '100%',
  minHeight: 160,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background: `linear-gradient(135deg, ${color}12, ${colors.background.paper} 60%)`,
});

/** PreviewPanel big value text (colored). */
export const getPreviewValue = (color: string): Sx => ({
  fontSize: 28,
  fontWeight: 800,
  color,
  lineHeight: 1.2,
});

/** PreviewPanel "Open detail page" button (colored bg). */
export const getPreviewOpenBtn = (color: string): Sx => ({
  alignSelf: 'flex-start',
  mt: 2,
  bgcolor: color,
  '&:hover': { bgcolor: color },
});

/** MetricCard outer Panel sx: status vs traffic variant + color tint. */
export const getMetricPanel = (variant: 'status' | 'traffic', color: string): Sx => ({
  // Status cards need a real minimum width (flex-basis + minWidth) so they never
  // collapse into thin lines when the row is narrow; they wrap to the next line
  // instead. Traffic cards fill their grid cell (minWidth 0 to allow shrinking).
  ...(variant === 'status' ? { flex: '1 1 150px', minWidth: 150 } : { width: '100%', minWidth: 0 }),
  cursor: 'pointer',
  transition: 'transform .15s',
  border: '1px solid #DCE2EA',
  borderRadius: radius.xl,
  bgcolor: variant === 'status' ? `${color}0D` : colors.background.paper,
  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' },
});

/** MetricCard status colored dot. */
export const getStatusDot = (color: string): Sx => ({ flex: 'none', width: 10, height: 10, borderRadius: '50%', bgcolor: color });

/** MetricCard status value text (colored, fluid). */
export const getStatusValue = (color: string): Sx => ({
  fontFamily: FONT_PROMPT,
  fontWeight: 500,
  fontSize: 'clamp(14px, 1.4vw, 22px)',
  lineHeight: 1.3,
  color,
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
});

/** MetricCard traffic icon box (colored, tinted bg). */
export const getTrafficIconBox = (color: string): Sx => ({
  flex: 'none',
  width: 36,
  height: 36,
  borderRadius: radius.xl,
  color,
  bgcolor: `${color}14`,
  display: 'grid',
  placeItems: 'center',
});

/** ActivityCard outer Panel (hover border = item color). */
export const getActivityPanel = (color: string): Sx => ({ cursor: 'pointer', '&:hover': { borderColor: color } });

/** ActivityCard icon box (colored, tinted bg). */
export const getActivityIconBox = (color: string): Sx => ({
  color,
  bgcolor: `${color}16`,
  borderRadius: 0.75,
  p: 0.5,
  display: 'grid',
  placeItems: 'center',
});

/** ActivityCard percent chip (colored). */
export const getActivityChip = (color: string): Sx => ({
  height: 18,
  fontSize: 9,
  fontWeight: 700,
  color,
  bgcolor: `${color}15`,
});

/** SummaryRow value text (emphasis = red). */
export const getSummaryValue = (emphasis?: boolean): Sx => ({
  fontSize: 11,
  fontWeight: 700,
  color: emphasis ? RED : colors.text.primary,
  mr: 'auto',
  whiteSpace: 'nowrap',
});

/** Online staff list row (hover bg + bottom border). */
export const onlineListRow: Sx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.25,
  py: 1,
  px: 1,
  borderBottom: `1px solid ${BORDER}`,
  cursor: 'pointer',
  '&:hover': { bgcolor: '#f9f9f9' },
};

/** Follow-up tab button (active = red text + underline). */
export const getFollowupTab = (active: boolean): Sx => ({
  color: active ? RED : '#78828c',
  borderBottom: active ? `2px solid ${RED}` : '2px solid transparent',
  borderRadius: '5px 5px 0px 0px',
  fontWeight: 600,
  borderTop: 0,
  borderRight: 0,
  borderLeft: 0,
});
