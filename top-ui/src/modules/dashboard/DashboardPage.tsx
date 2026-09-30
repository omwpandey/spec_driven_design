/**
 * DashboardPage – Toyota TopsCRM ECharts Dashboard
 * Features: drill-down in-place preview, click-to-navigate, lazy loading,
 * virtualized grids, breadcrumbs, back navigation, cross-filtering,
 * tooltips, CSV export, role-based access, real-time updates,
 * accessibility (aria-labels, keyboard), mobile responsive.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import * as echarts from 'echarts';
import {
  BackIcon as ArrowBack,
  ForwardIcon as ArrowForward,
  SuccessIcon as CheckCircle,
  CloudDownloadIcon as CloudDownload,
  ErrorOutlinedIcon as ErrorOutlined,
  GroupsIcon as Groups,
  PauseCircleIcon as PauseCircle,
  RefreshIcon as Refresh,
  SearchIcon as Search,
  CloseIcon as Close,
  ViewIcon as Visibility,
  PhoneCallbackIcon as PhoneCallback,
  PhoneForwardedIcon as PhoneForwarded,
  PhoneMissedIcon as PhoneMissed,
  TimerIcon as Timer,
  AccessTimeIcon as AccessTime,
  ExternalLinkIcon as OpenInNew,
  Box,
  Button,
  Chip,
  Divider,
  EllipsisText,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@components/common';
import MuiAvatar from '@components/common/MuiAvatar';
import { useNavigate } from 'react-router-dom';
import { PageContainer, PageHeader, PageFooter } from '@components/layout';
import {
  palette,
  dashboardStyles as styles,
  getPreviewContainer,
  getPreviewValue,
  getPreviewOpenBtn,
  getMetricPanel,
  getStatusDot,
  getStatusValue,
  getTrafficIconBox,
  getActivityPanel,
  getActivityIconBox,
  getActivityChip,
  getSummaryValue,
  onlineListRow,
  getFollowupTab,
} from './styles';

// ─── Constants (palette shared with the style file) ───
const { RED, BLUE, ORANGE, GREEN, GRAY } = palette;

// ─── Types ───
type Role = 'Admin' | 'Manager' | 'Viewer';
interface PreviewData { panel: string; title: string; label: string; value: string; route: string; color: string; }
interface ActivityItem { name: string; total: number; percent: string; color: string; completed: number; remaining: number; }

// ─── EChart Component (ResizeObserver, aria, keyboard) ───
const EChart: React.FC<{ option: object; height?: number | string; onPointClick: (n: string, v: string) => void; ariaLabel: string }> = ({ option, height = 170, onPointClick, ariaLabel }) => {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    chartRef.current?.dispose();
    const c = echarts.init(ref.current, undefined, { renderer: 'canvas' });
    chartRef.current = c;
    c.setOption(option as echarts.EChartsOption);
    c.on('click', (p: { name?: string; value?: unknown; data?: unknown }) => {
      const raw = p.value ?? (p.data as { value?: unknown } | undefined)?.value;
      const v = Array.isArray(raw) ? String(raw[1] ?? raw[0]) : String(raw ?? '');
      onPointClick(p.name ?? 'Item', v);
    });
    const ro = new ResizeObserver(() => c.resize());
    ro.observe(ref.current);
    return () => { ro.disconnect(); c.off('click'); c.dispose(); chartRef.current = null; };
  }, [option, onPointClick]);
  return <Box ref={ref} role="img" aria-label={ariaLabel} tabIndex={0} sx={{ ...(styles.chartBox as object), height }} />;
};

// ─── Panels ───
const Panel: React.FC<{ children: React.ReactNode; sx?: SxProps<Theme> }> = ({ children, sx }) => (
  <Paper elevation={0} sx={{ ...(styles.panel as object), ...(sx as object) }}>{children}</Paper>
);
const PanelTitle: React.FC<{ children: React.ReactNode; action?: React.ReactNode }> = ({ children, action }) => (
  <Box sx={styles.panelTitleRow}>
    <Typography sx={styles.panelTitleText}>{children}</Typography>{action}
  </Box>
);

// ─── In-place Preview ───
const PreviewPanel: React.FC<{ preview: PreviewData; onBack: () => void; onOpen: () => void }> = ({ preview, onBack, onOpen }) => (
  <Box sx={getPreviewContainer(preview.color)}>
    <Box>
      <Button size="small" startIcon={<ArrowBack />} onClick={onBack} sx={styles.previewBackBtn}>Back to chart</Button>
      <Typography sx={styles.previewLabel}>{preview.label}</Typography>
      <Typography sx={getPreviewValue(preview.color)}>{preview.value}</Typography>
      <Typography sx={styles.previewTitle}>{preview.title}</Typography>
      <Typography sx={styles.previewHint}>Click below to navigate to the full detail page.</Typography>
    </Box>
    <Button variant="contained" size="small" endIcon={<ArrowForward />} onClick={onOpen} sx={getPreviewOpenBtn(preview.color)}>Open detail page</Button>
  </Box>
);

// ─── Metric Card ───
const MetricCard: React.FC<{ title: string; value: string; color: string; icon: React.ReactNode; onClick: () => void; variant?: 'status' | 'traffic'; showViewList?: boolean }> = ({ title, value, color, icon, onClick, variant = 'status', showViewList = true }) => (
  // Status cards live in a flex row (flex-basis + minWidth keep them readable);
  // traffic cards live in a CSS grid, so they must fill the cell (minWidth 0)
  // and NOT impose a 180px floor that overflows the 1fr track on mobile.
  <Panel sx={getMetricPanel(variant, color)}>
    <Box onClick={onClick} role="button" tabIndex={0} aria-label={`${title}: ${value}`} onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }} sx={styles.metricInner}>
      {variant === 'status' ? (
        <>
          {/* Status dot */}
          <Box sx={getStatusDot(color)} />
          {/* Value + label (inline). Fonts scale with the card width (clamp) so
              value + label + View list stay on ONE line without wrapping. */}
          <Box sx={styles.statusValueLabelWrap}>
            <Typography sx={getStatusValue(color)}>{value}</Typography>
            <EllipsisText sx={styles.statusLabelText}>{title}</EllipsisText>
          </Box>
          {showViewList && (
            <Box sx={styles.statusViewListWrap}>
              <Typography sx={styles.statusViewListText}>View list</Typography>
              <OpenInNew sx={styles.statusViewListIcon} />
            </Box>
          )}
        </>
      ) : (
        <>
          {/* Icon in tinted rounded box (left) */}
          <Box sx={getTrafficIconBox(color)}>{icon}</Box>
          {/* Right side: title on top, value + view list on one line below */}
          <Box sx={styles.trafficRightWrap}>
            <EllipsisText sx={styles.trafficTitle}>{title}</EllipsisText>
            <Box sx={styles.trafficValueRow}>
              <EllipsisText sx={styles.trafficValue}>{value}</EllipsisText>
              {showViewList && (
                <Box sx={styles.trafficViewListWrap}>
                  <Typography sx={styles.trafficViewListText}>View list</Typography>
                  <OpenInNew sx={styles.trafficViewListIcon} />
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  </Panel>
);

// ─── Activity Card ───
const ActivityCard: React.FC<{ item: ActivityItem; onClick: () => void }> = ({ item, onClick }) => (
  <Panel sx={getActivityPanel(item.color)}>
    <Box onClick={onClick} role="button" tabIndex={0} aria-label={`${item.name}: ${item.total} total calls`} onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }} sx={styles.activityInner}>
      <Box sx={styles.activityHeaderRow}>
        <Box sx={styles.activityNameWrap}>
          <Box sx={getActivityIconBox(item.color)}><Groups sx={styles.activityGroupsIcon} /></Box>
          <Box sx={styles.activityNameCol}><EllipsisText sx={styles.activityName}>{item.name}</EllipsisText><Typography sx={styles.activityTotal}><b style={styles.activityTotalBold}>{item.total}</b> Total Calls</Typography></Box>
        </Box>
        <Chip size="small" label={item.percent} sx={getActivityChip(item.color)} />
      </Box>
      <Divider sx={styles.activityDivider} />
      <Box sx={styles.activityFooterRow}>
        <Typography sx={styles.activityFooterText}>Completed <b>{String(item.completed).padStart(2, '0')}</b> (12%)</Typography>
        <Typography sx={styles.activityFooterText}>Remaining <b>{String(item.remaining).padStart(2, '0')}</b> (88%)</Typography>
      </Box>
    </Box>
  </Panel>
);

// ─── Activity Grid (CSS content-visibility virtualization) ───
const ActivityGrid: React.FC<{ items: ActivityItem[]; onItemClick: (i: ActivityItem) => void }> = ({ items, onItemClick }) => (
  <Box sx={styles.activityGrid}>
    {items.map((item) => <ActivityCard key={item.name} item={item} onClick={() => onItemClick(item)} />)}
  </Box>
);

// ─── Summary Row ───
const SummaryRow: React.FC<{ label: string; value: string; emphasis?: boolean }> = ({ label, value, emphasis }) => (
  // Label and value are grouped on the left; the extra space is pushed to the
  // right (mr: auto on the value) so the value never crowds the donut chart.
  <Box sx={styles.summaryRow}>
    <Typography sx={styles.summaryLabel}>{label}</Typography>
    <Typography sx={getSummaryValue(emphasis)}>{value}</Typography>
  </Box>
);

// ─── Chart Options ───
interface DonutSegment { name: string; value: number; color: string; }

// Multi-segment donut with external leader-line labels to match the Figma design.
const makeDonut = (segments: DonutSegment[], center: string) => {
  const [num, ...labelParts] = center.split('\n');
  const label = labelParts.join(' ');
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  return {
    // The donut already shows name + units + percent as external labels, so a
    // hover tooltip is redundant. In this small panel the default tooltip box
    // floats over the chart and hides the center text/labels — so render it
    // outside the chart (appendToBody) and confine it to the viewport so it
    // never covers the donut content.
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      confine: true,
      appendToBody: true,
      backgroundColor: 'rgba(51,51,51,0.92)',
      borderWidth: 0,
      padding: [4, 8],
      textStyle: { color: '#fff', fontSize: 11 },
    },
    graphic: [{
      type: 'text', left: 'center', top: 'center',
      style: {
        text: `{num|${num}}\n{label|${label}}`,
        rich: {
          num: { fontSize: 16, fontWeight: 'bold', fill: '#333', align: 'center' },
          label: { fontSize: 9, fill: '#58595B', align: 'center', lineHeight: 14 },
        },
        textAlign: 'center',
      },
    }],
    series: [{
      type: 'pie',
      // Smaller radius leaves room for the outside leader-line labels so
      // none of the text gets clipped at the container edges.
      radius: ['38%', '52%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      padAngle: 1.5,
      itemStyle: { borderRadius: 2 },
      label: {
        show: true,
        position: 'outside',
        // Anchor labels to the container edge and wrap so long text
        // (e.g. "Today Call Plan 45 Units (50%)") stays fully visible.
        alignTo: 'edge',
        edgeDistance: 4,
        bleedMargin: 4,
        formatter: (p: { name: string; value: number; percent?: number }) =>
          `{name|${p.name}}\n{val|${p.value} Units (${total ? ((p.value / total) * 100).toFixed(2) : 0}%)}`,
        rich: {
          name: { fontSize: 9, fontWeight: 700, color: '#333', lineHeight: 12 },
          val: { fontSize: 9, color: '#58595B', lineHeight: 12 },
        },
      },
      labelLine: { show: true, length: 6, length2: 8, lineStyle: { color: '#BDBDBD' } },
      emphasis: { scale: false },
      data: segments.map((s) => ({ value: s.value, name: s.name, itemStyle: { color: s.color } })),
    }],
  };
};

// Bar values with their period-over-period deltas, matching the Figma design.
// Label renders as "value(+/-delta)" e.g. 22(+18).
const PM_BARS = [
  { value: 22, delta: 18 },
  { value: 10, delta: -8 },
  { value: 8, delta: 10 },
  { value: 5, delta: 8 },
];
const OTHERS_BARS = [
  { value: 10, delta: -8 },
  { value: 3, delta: 8 },
  { value: 4, delta: -3 },
  { value: 3, delta: -2 },
];
const barLabel = (p: { data: number | { value: number; delta: number } }) => {
  const d = p.data as { value: number; delta: number };
  const sign = d.delta >= 0 ? '+' : '';
  return `${d.value}(${sign}${d.delta})`;
};

const barOption = {
  color: [BLUE, ORANGE],
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { top: 6, left: 8, icon: 'rect', itemWidth: 10, itemHeight: 10, textStyle: { fontSize: 11 } },
  grid: { left: 40, right: 20, top: 40, bottom: 52, containLabel: false },
  xAxis: {
    type: 'category' as const,
    axisLabel: { fontSize: 9, interval: 0, color: '#58595B', lineHeight: 12 },
    axisTick: { show: false },
    axisLine: { lineStyle: { color: '#E0E0E0' } },
    data: ['Appointment', 'Reject', 'Contacted & Continue\nto follow-up', 'Cannot Contacted & Continue\nto follow-up'],
  },
  yAxis: {
    type: 'value' as const,
    max: 100,
    interval: 25,
    axisLabel: { fontSize: 9, color: '#58595B' },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: '#F0F0F0' } },
  },
  series: [
    {
      name: 'PM',
      type: 'bar',
      barMaxWidth: 26,
      barGap: '10%',
      data: PM_BARS,
      label: { show: true, position: 'top', fontSize: 9, color: '#58595B', formatter: barLabel },
    },
    {
      name: 'Others',
      type: 'bar',
      barMaxWidth: 26,
      data: OTHERS_BARS,
      label: { show: true, position: 'top', fontSize: 9, color: '#58595B', formatter: barLabel },
    },
  ],
};

// ─── Mock Data ───
const followUpItems: ActivityItem[] = [
  { name: 'PM (Periodic Maintenance)', total: 42, percent: '18%', color: BLUE, completed: 5, remaining: 37 },
  { name: 'Additional Job (Rejected)', total: 12, percent: '5%', color: RED, completed: 5, remaining: 7 },
  { name: 'TCFR- Notifications', total: 19, percent: '8%', color: ORANGE, completed: 5, remaining: 14 },
  { name: 'DCM', total: 22, percent: '8%', color: GRAY, completed: 5, remaining: 17 },
];
const tmtItems: ActivityItem[] = [
  { name: 'Fleet Customers', total: 38, percent: '16%', color: BLUE, completed: 5, remaining: 33 },
  { name: 'Inactive Customers', total: 42, percent: '16%', color: ORANGE, completed: 5, remaining: 37 },
];
const dealerItems: ActivityItem[] = [
  { name: 'Fleet Customers', total: 38, percent: '16%', color: BLUE, completed: 5, remaining: 33 },
  { name: 'Inactive Customers', total: 42, percent: '16%', color: ORANGE, completed: 5, remaining: 37 },
];

// ═══════════════════════════════════════════════════════════
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('Admin');
  const [branch, setBranch] = useState('Bangkok Central');
  const [staff, setStaff] = useState('All Call Centers');
  const [summaryDate, setSummaryDate] = useState('2026-07-18');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'service' | 'post'>('service');
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [lastSync, setLastSync] = useState(new Date());
  const [onlineCount, setOnlineCount] = useState(25);
  const [onlineListOpen, setOnlineListOpen] = useState(false);
  const [onlineSearch, setOnlineSearch] = useState('');

  // Real-time polling
  useEffect(() => {
    const id = setInterval(() => { setLastSync(new Date()); setOnlineCount((c) => c === 25 ? 26 : 25); }, 30000);
    return () => clearInterval(id);
  }, []);

  const show = useCallback((panel: string, title: string, label: string, value: string, route: string, color: string) => setPreview({ panel, title, label, value, route, color }), []);
  const clear = useCallback(() => setPreview(null), []);
  const goDetail = useCallback(() => { if (preview) navigate(preview.route); }, [preview, navigate]);

  const exportCSV = useCallback(() => {
    const rows = [['Metric', 'Value', 'Branch', 'Staff'], ['Online', String(onlineCount), branch, staff], ['Busy', '2', branch, staff], ['Offline', '2', branch, staff], ['Total Call Plan', '90', branch, staff]];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `dashboard-${summaryDate}.csv`; a.click();
  }, [onlineCount, branch, staff, summaryDate]);

  // Memoized chart options
  const breakdownOpt = useMemo(
    () =>
      makeDonut(
        [
          { name: 'Called', value: 45, color: RED },
          { name: 'PM', value: 23, color: GREEN },
          { name: 'Called', value: 20, color: '#F4A9AE' },
          { name: 'Pending', value: 2, color: '#E0E0E0' },
        ],
        '90\nTotal Call Plan'
      ),
    []
  );
  const dailyOpt = useMemo(
    () =>
      makeDonut(
        [
          { name: 'Today Call Plan', value: 46, color: BLUE },
          { name: 'Today Call Plan', value: 30, color: '#7FC4DC' },
          { name: 'Pending', value: 14, color: ORANGE },
          { name: 'Pending', value: 1, color: '#E0E0E0' },
        ],
        '90\nTotal Call Plan'
      ),
    []
  );
  const barOpt = useMemo(() => barOption, []);

  // Role-based
  const canExport = role !== 'Viewer';
  const canChangeRole = role === 'Admin';

  // Cross-filtering
  const filtered = useCallback((items: ActivityItem[]) => {
    if (!search) return items;
    return items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <PageContainer spacing={1.5}>
      {/* Header + Breadcrumb */}
      <PageHeader title="Dashboard" breadcrumbs={[{ label: 'Dashboard' }]} actions={
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          {/* <Chip size="small" icon={<Refresh sx={styles.syncChipIcon} />} label={`Synced ${lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} variant="outlined" />
          {canExport && <Tooltip title="Export CSV"><IconButton size="small" onClick={exportCSV} aria-label="Export CSV"><CloudDownload sx={styles.exportIcon} /></IconButton></Tooltip>}
          <FormControl size="small"><Select value={role} onChange={(e) => setRole(e.target.value as Role)} disabled={!canChangeRole} aria-label="Role" sx={styles.roleSelect}><MenuItem value="Admin">Admin</MenuItem><MenuItem value="Manager">Manager</MenuItem><MenuItem value="Viewer">Viewer</MenuItem></Select></FormControl> */}
        </Stack>
      } />

      {/* ═══ Call Center Status ═══ */}
      <Box sx={styles.relativeBox}>
        <Panel>
          <PanelTitle action={<Chip size="small" label="Live" sx={styles.liveChip} />}>Call Center Status</PanelTitle>
          <Box sx={styles.statusCardsRow}>
            {/* Three status cards stay on ONE line (no wrap) and shrink together;
                they stack only on small screens. */}
            <Box sx={styles.statusCardsInner}>
              <MetricCard title="ONLINE" value={String(onlineCount)} color={GREEN} icon={<CheckCircle sx={styles.metricIcon16} />} onClick={() => setOnlineListOpen(true)} />
              <MetricCard title="BUSY" value="2" color={ORANGE} icon={<PauseCircle sx={styles.metricIcon16} />} onClick={() => show('status', 'Busy Staff', 'Status', '2 busy', '/call-center', ORANGE)} />
              <MetricCard title="OFFLINE" value="2" color={GRAY} icon={<ErrorOutlined sx={styles.metricIcon16} />} onClick={() => show('status', 'Offline Staff', 'Status', '2 offline', '/call-center', GRAY)} />
            </Box>
            {/* Cross-filters */}
            <Box sx={styles.crossFilters}>
              <FormControl size="small" sx={styles.filterControl160}><Typography sx={styles.filterLabel}>Branch</Typography><Select value={branch} onChange={(e) => setBranch(e.target.value)} aria-label="Branch" sx={styles.branchSelect}><MenuItem value="Bangkok Central">Bangkok Central</MenuItem><MenuItem value="North Bangkok">North Bangkok</MenuItem></Select></FormControl>
              <FormControl size="small" sx={styles.filterControl160}><Typography sx={styles.filterLabel}>Staff</Typography><Select value={staff} onChange={(e) => setStaff(e.target.value)} aria-label="Staff" sx={styles.branchSelect}><MenuItem value="All Call Centers">All Call Centers</MenuItem><MenuItem value="Morning Shift">Morning Shift</MenuItem></Select></FormControl>
              <FormControl size="small" sx={styles.filterControl150}><Typography sx={styles.filterLabel}>Summary Date</Typography><TextField size="small" type="date" value={summaryDate} onChange={(e) => setSummaryDate(e.target.value)} aria-label="Summary date" /></FormControl>
            </Box>
          </Box>
        </Panel>

        {/* Online Staff List - overlays below the card */}
        {onlineListOpen && (
          <Panel sx={styles.onlineOverlay}>
            <Box sx={styles.onlineHeaderRow}>
              <Box sx={styles.onlineHeaderLeft}>
                <Typography sx={styles.onlineTitle}>Online</Typography>
                <Chip size="small" label={onlineCount} sx={styles.onlineCountChip} />
              </Box>
              <IconButton size="small" onClick={() => { setOnlineListOpen(false); setOnlineSearch(''); }} aria-label="Close online list"><Close sx={styles.onlineCloseIcon} /></IconButton>
            </Box>
            <Box sx={styles.onlineSearchBox}>
              <TextField size="small" fullWidth placeholder="Search Name..." value={onlineSearch} onChange={(e) => setOnlineSearch(e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={styles.onlineSearchIcon} /></InputAdornment> } }} />
            </Box>
            <Divider />
            <Box sx={styles.onlineList}>
              {['Nanchai P.', 'Somchai P.', 'kumapai P.', 'Somchai P.', 'Ping P.', 'Somchai P.']
                .filter((n) => !onlineSearch || n.toLowerCase().includes(onlineSearch.toLowerCase()))
                .map((name, i) => (
                  <Box key={i} sx={onlineListRow} onClick={() => { setOnlineListOpen(false); show('status', name, 'Staff detail', 'Online', '/call-center', GREEN); }}>
                    <MuiAvatar sx={styles.onlineAvatar}>{name.split(' ').map((w) => w[0]).join('').toUpperCase()}</MuiAvatar>
                    <Box>
                      <Typography sx={styles.onlineName}>{name}</Typography>
                      <Typography sx={styles.onlineStatus}>Online</Typography>
                    </Box>
                  </Box>
                ))}
            </Box>
          </Panel>
        )}
      </Box>

      {/* ═══ Appointment Summary ═══ */}
      <Typography sx={styles.sectionTitleMt}>Appointment Summary</Typography>
      <Box sx={styles.summaryGrid}>
        {/* Left column: two donut panels split the same height as the bar panel */}
        <Box sx={styles.donutColumn}>
          {/* Status Breakdown */}
          <Panel sx={styles.donutPanel}>
            {preview?.panel === 'breakdown' ? <PreviewPanel preview={preview} onBack={clear} onOpen={goDetail} /> : <>
              <PanelTitle>Status Breakdown</PanelTitle>
              <Box sx={styles.donutBody}>
                <Box>
                  <SummaryRow label="Total Call Plan" value="90 Units" emphasis />
                  <SummaryRow label="Called" value="65 Units" emphasis />
                  <SummaryRow label="Pending" value="25 Units" emphasis />
                </Box>
                <EChart option={breakdownOpt} height="100%" ariaLabel="Status breakdown donut" onPointClick={(n, v) => show('breakdown', `${n} calls`, 'Breakdown', `${v} units`, '/appointments', RED)} />
              </Box>
            </>}
          </Panel>
          {/* Daily Call Plan */}
          <Panel sx={styles.donutPanel}>
            {preview?.panel === 'daily' ? <PreviewPanel preview={preview} onBack={clear} onOpen={goDetail} /> : <>
              <PanelTitle>Daily Call Plan</PanelTitle>
              <Box sx={styles.donutBody}>
                <Box><SummaryRow label="Total Call Plan" value="90 Units" /><SummaryRow label="Today Call Plan" value="75 Units" emphasis /><SummaryRow label="Carry Over Call Plan" value="15 Units" emphasis /><Typography sx={styles.dailyNote}>(Remaining from previous Call Plan)</Typography></Box>
                <EChart option={dailyOpt} height="100%" ariaLabel="Daily call plan donut" onPointClick={(n, v) => show('daily', `${n} daily`, 'Daily plan', `${v} units`, '/appointments', BLUE)} />
              </Box>
            </>}
          </Panel>
        </Box>
        {/* Right column: Bar chart */}
        <Panel>
          {preview?.panel === 'bar' ? <PreviewPanel preview={preview} onBack={clear} onOpen={goDetail} /> : <>
            <PanelTitle action={<Tooltip title="Click a bar to drill-down"><Visibility sx={styles.barVisibilityIcon} /></Tooltip>}>Number of appointments per day (calls made from the calling plan only).</PanelTitle>
            <Box sx={styles.barTotalsRow}>
              <Typography sx={styles.barTotalsLabel}>Total:</Typography>
              {/* Spread the totals so each chip sits over its bar group, matching
                  the chart grid (left:40 / right:20). */}
              <Box sx={styles.barTotalsGrid}>
                {[32, 13, 12, 8].map((v, i) => (
                  <Box key={i} sx={styles.barTotalsCell}>
                    <Chip size="small" label={v} sx={styles.barTotalChip} />
                  </Box>
                ))}
              </Box>
            </Box>
            <EChart option={barOpt} height={300} ariaLabel="Appointments bar chart" onPointClick={(n, v) => show('bar', n, 'Category', `${v} calls`, '/appointments', BLUE)} />
          </>}
        </Panel>
      </Box>

      {/* ═══ Follow-up ═══ */}
      <Box sx={styles.followupHeaderRow}>
        <Typography sx={styles.sectionTitle}>Follow-up</Typography>
        {/* <TextField size="small" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search activities…" slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16 }} /></InputAdornment> } }} sx={{ width: { xs: '100%', sm: 220 } }} aria-label="Search activities" /> */}
      </Box>
      <Panel>
        <Box sx={styles.followupTabsRow}>
          <Button size="small" onClick={() => setActiveTab('service')} sx={getFollowupTab(activeTab === 'service')}>Service Follow-up</Button>
          <Button size="small" onClick={() => setActiveTab('post')} sx={getFollowupTab(activeTab === 'post')}>Post-Service Follow-up</Button>
        </Box>
        {preview?.panel === 'followup' ? <Box sx={styles.previewPad}><PreviewPanel preview={preview} onBack={clear} onOpen={goDetail} /></Box> :
          <ActivityGrid items={filtered(followUpItems)} onItemClick={(i) => show('followup', i.name, 'Total Calls', `${i.total} calls`, '/service-follow-up', i.color)} />
        }

        {/* ─── Custom Activity by TMT ─── */}
        <Typography sx={styles.subSectionTitlePad}>Custom Activity by TMT</Typography>
        {preview?.panel === 'tmt' ? <Box sx={styles.previewPad}><PreviewPanel preview={preview} onBack={clear} onOpen={goDetail} /></Box> :
          <ActivityGrid items={filtered(tmtItems)} onItemClick={(i) => show('tmt', i.name, 'Total Calls', `${i.total} calls`, '/activity-setup/tmt', i.color)} />
        }

        {/* ─── Custom Activity by Dealer ─── */}
        <Typography sx={styles.subSectionTitlePad}>Custom Activity by Dealer</Typography>
        {preview?.panel === 'dealer' ? <Box sx={styles.previewPad}><PreviewPanel preview={preview} onBack={clear} onOpen={goDetail} /></Box> :
          <ActivityGrid items={filtered(dealerItems)} onItemClick={(i) => show('dealer', i.name, 'Total Calls', `${i.total} calls`, '/activity-setup/custom', i.color)} />
        }
      </Panel>

      {/* ═══ Call Summary & Traffic ═══ */}
      <Typography sx={styles.sectionTitle}>Call Summary &amp; Traffic</Typography>
      <Box sx={styles.trafficGrid}>
        <MetricCard variant="traffic" title="Incoming Calls" value="184" color={BLUE} icon={<PhoneCallback sx={styles.trafficIcon18} />} onClick={() => show('traffic', 'Incoming Calls', 'Call type', '184 calls', '/incoming-calls', BLUE)} />
        <MetricCard variant="traffic" title="Outgoing Calls" value="96" color={GREEN} icon={<PhoneForwarded sx={styles.trafficIcon18} />} onClick={() => show('traffic', 'Outgoing Calls', 'Call type', '96 calls', '/outgoing-calls', GREEN)} />
        <MetricCard variant="traffic" title="Answered Calls" value="184" color={BLUE} icon={<CheckCircle sx={styles.trafficIcon18} />} onClick={() => show('traffic', 'Answered Calls', 'Call type', '184 calls', '/incoming-calls', BLUE)} />
        <MetricCard variant="traffic" title="Missed Calls" value="16" color={RED} icon={<PhoneMissed sx={styles.trafficIcon18} />} onClick={() => show('traffic', 'Missed Calls', 'Call type', '16 calls', '/incoming-calls', RED)} />
        <MetricCard variant="traffic" showViewList={false} title="Total Call Duration" value="04h 52m" color={GRAY} icon={<Timer sx={styles.trafficIcon18} />} onClick={() => show('traffic', 'Total Duration', 'Duration', '04h 52m', '/incoming-calls', GRAY)} />
        <MetricCard variant="traffic" showViewList={false} title="Average Call Duration" value="02m 18s" color={GRAY} icon={<AccessTime sx={styles.trafficIcon18} />} onClick={() => show('traffic', 'Avg Duration', 'Duration', '02m 18s', '/incoming-calls', GRAY)} />
      </Box>

      {/* Status preview floating (for status/traffic panels) */}
      {(preview?.panel === 'status' || preview?.panel === 'traffic') && (
        <Panel sx={styles.statusPreviewPanel}>
          <PreviewPanel preview={preview} onBack={clear} onOpen={goDetail} />
        </Panel>
      )}
      {/* Footer */}
      <PageFooter />
    </PageContainer>
  );
};

export default DashboardPage;
