import React from 'react';
import Box from '../Box';
import Typography from '../Typography';
import Select from '../Select/Select';
import MenuItem from '../MenuItem';
import FormControl from '../FormControl';
import { colors } from '@core/theme';
import { ResetButton, SearchButton, PrimaryButton, SecondaryButton } from '../ActionButtons';
import { useApi } from '@hooks/useApi';
import apiService from '@services/apiService';
import { ENDPOINTS } from '@services/endpoints';
import { MONTH_NAMES, yearOptions, stepMonth } from '@utils/dateUtils';
import type {
  Branch,
  CallCenterStaff,
  WorkingDay,
  SetBranchHolidayPayload,
  CopyHolidaysPayload,
  SaveDailyAvailabilityPayload,
  SaveMonthlyAvailabilityPayload,
} from '../../../types/holiday.types';
import WorkingDayCalendar from './WorkingDayCalendar';
import SetBranchHolidayDialog from './SetBranchHolidayDialog';
import CopyBranchHolidaysDialog from './CopyBranchHolidaysDialog';
import DailyCallAvailabilityDialog from './DailyCallAvailabilityDialog';
import MonthlyCallAvailabilityDialog from './MonthlyCallAvailabilityDialog';
import { schedulerStyles } from './SchedulerCalendar.styles';

interface SchedulerCalendarProps {
  /** Branches for the setup + dialogs. */
  branches: Branch[];
  /** Call-center staff for the availability dialogs. */
  staff?: CallCenterStaff[];
  /** Initial selection. */
  defaultBranchCode?: string;
  defaultMonth?: number; // 1-based
  defaultYear?: number;
  /**
   * Seed calendar day metadata keyed by ISO date (YYYY-MM-DD). Useful for
   * demos or offline previews where no backend is wired. When a backend is
   * connected, the fetched calendar takes precedence on load/refresh.
   */
  initialDays?: Record<string, WorkingDay>;
  /**
   * When false, the component skips backend calls and manages the calendar
   * purely from local state (holidays/tags applied optimistically). Handy for
   * demos. Defaults to true.
   */
  useBackend?: boolean;
  /** Override the API endpoints (defaults come from ENDPOINTS). */
  endpoints?: {
    calendar?: string;
    holiday?: string;
    copy?: string;
    dailyAvailability?: string;
    monthlyAvailability?: string;
  };
  /** Called after any successful mutation (save/copy) so parents can refresh. */
  onChange?: () => void;
}

interface CalendarResponse {
  days: WorkingDay[];
}

const SectionPanel: React.FC<{
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, actions, children }) => (
  <Box sx={schedulerStyles.panel}>
    <Box sx={schedulerStyles.panelHeader}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 4, height: 18, backgroundColor: colors.primary.main, borderRadius: '2px' }} />
        <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>{title}</Typography>
      </Box>
      {actions}
    </Box>
    <Box sx={schedulerStyles.panelBody}>{children}</Box>
  </Box>
);

/**
 * SchedulerCalendar
 *
 * Branch Holiday Master container: a "Calendar Setup" panel (Branch / Month /
 * Year with Reset + Search) and a "Working Day Calendar" panel, wired to the
 * backend via useApi + apiService. Clicking a day opens the Set Branch Holiday
 * dialog; top actions open Copy Holidays and Monthly Availability.
 */
const SchedulerCalendar: React.FC<SchedulerCalendarProps> = ({
  branches,
  staff = [],
  defaultBranchCode,
  defaultMonth,
  defaultYear,
  initialDays,
  useBackend = true,
  endpoints,
  onChange,
}) => {
  const now = new Date();
  const baseYear = defaultYear ?? now.getFullYear();

  const ep = {
    calendar: endpoints?.calendar ?? ENDPOINTS.BRANCH_HOLIDAY.CALENDAR,
    holiday: endpoints?.holiday ?? ENDPOINTS.BRANCH_HOLIDAY.BASE,
    copy: endpoints?.copy ?? ENDPOINTS.BRANCH_HOLIDAY.COPY,
    daily: endpoints?.dailyAvailability ?? ENDPOINTS.CALL_CENTER.DAILY,
    monthly: endpoints?.monthlyAvailability ?? ENDPOINTS.CALL_CENTER.MONTHLY,
  };

  // ─── Setup selection (draft) vs the applied query that drives the calendar ───
  const [branchCode, setBranchCode] = React.useState(defaultBranchCode ?? branches[0]?.code ?? '');
  const [month, setMonth] = React.useState(defaultMonth ?? now.getMonth() + 1);
  const [year, setYear] = React.useState(baseYear);
  const [applied, setApplied] = React.useState({
    branchCode: defaultBranchCode ?? branches[0]?.code ?? '',
    month: defaultMonth ?? now.getMonth() + 1,
    year: baseYear,
  });

  // ─── Dialog state ───
  const [holidayDate, setHolidayDate] = React.useState<string | null>(null);
  const [copyOpen, setCopyOpen] = React.useState(false);
  const [dailyOpen, setDailyOpen] = React.useState(false);
  const [monthlyOpen, setMonthlyOpen] = React.useState(false);

  const calendarApi = useApi<CalendarResponse>({ context: 'BranchHolidayCalendar' });
  const holidayApi = useApi({ context: 'SetBranchHoliday', successMessage: 'Holiday saved.' });
  const copyApi = useApi({ context: 'CopyBranchHolidays', successMessage: 'Holidays copied.' });
  const dailyApi = useApi({ context: 'DailyAvailability', successMessage: 'Availability saved.' });
  const monthlyApi = useApi({ context: 'MonthlyAvailability', successMessage: 'Availability saved.' });

  // Local, editable copy of the calendar day metadata (keyed by ISO date).
  // Seeded from `initialDays`, replaced by fetched data on load/refresh, and
  // updated optimistically after a successful save so changes show immediately.
  const [dayMap, setDayMap] = React.useState<Record<string, WorkingDay>>(initialDays ?? {});

  const loadCalendar = React.useCallback(
    (q: { branchCode: string; month: number; year: number }) => {
      if (!useBackend || !q.branchCode) return;
      calendarApi.execute(() =>
        apiService.get<CalendarResponse>(ep.calendar, {
          filters: { branchCode: q.branchCode, month: q.month, year: q.year },
        })
      );
    },
    [calendarApi, ep.calendar, useBackend]
  );

  React.useEffect(() => {
    loadCalendar(applied);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied]);

  // When a backend response arrives, replace local state with the fetched days.
  React.useEffect(() => {
    if (!calendarApi.data) return;
    const map: Record<string, WorkingDay> = {};
    calendarApi.data.days.forEach((d) => {
      map[d.date] = d;
    });
    setDayMap(map);
  }, [calendarApi.data]);

  const handleSearch = () => setApplied({ branchCode, month, year });
  const handleReset = () => {
    const reset = {
      branchCode: defaultBranchCode ?? branches[0]?.code ?? '',
      month: defaultMonth ?? now.getMonth() + 1,
      year: baseYear,
    };
    setBranchCode(reset.branchCode);
    setMonth(reset.month);
    setYear(reset.year);
    setApplied(reset);
  };

  const handleStepMonth = (delta: number) => {
    const next = stepMonth(applied.month, applied.year, delta);
    setBranchCode(applied.branchCode);
    setMonth(next.month);
    setYear(next.year);
    setApplied({ branchCode: applied.branchCode, ...next });
  };

  const refresh = () => {
    loadCalendar(applied);
    onChange?.();
  };

  const handleSaveHoliday = async (payload: SetBranchHolidayPayload) => {
    // Persist to the backend when wired; treat a no-backend setup as success.
    const res = useBackend
      ? await holidayApi.execute(() => apiService.post(ep.holiday, payload))
      : true;
    if (!res) return;

    // Optimistically reflect the holiday on the calendar right away so the
    // change is visible without waiting for a refetch.
    setDayMap((prev) => ({
      ...prev,
      [payload.date]: {
        ...prev[payload.date],
        date: payload.date,
        type: 'holiday',
        editable: prev[payload.date]?.editable ?? true,
        holiday: {
          branchCode: payload.branchCode,
          date: payload.date,
          remark: payload.remark,
          additionalRemark: payload.additionalRemark,
        },
        callPlanTag: prev[payload.date]?.callPlanTag ?? 'Not Effect Call Plan',
      },
    }));

    setHolidayDate(null);
    refresh();
  };

  const handleCopy = async (payload: CopyHolidaysPayload) => {
    const res = useBackend
      ? await copyApi.execute(() => apiService.post(ep.copy, payload))
      : true;
    if (res) {
      setCopyOpen(false);
      refresh();
    }
  };

  const handleSaveDaily = async (payload: SaveDailyAvailabilityPayload) => {
    const res = useBackend
      ? await dailyApi.execute(() => apiService.post(ep.daily, payload))
      : true;
    if (!res) return;

    // Mark the affected day with the call-plan tag so it shows on the calendar.
    setDayMap((prev) => ({
      ...prev,
      [payload.date]: {
        ...prev[payload.date],
        date: payload.date,
        type: prev[payload.date]?.type ?? 'working',
        editable: prev[payload.date]?.editable ?? true,
        callPlanTag: prev[payload.date]?.callPlanTag ?? 'Not Effect Call Plan',
      },
    }));

    setDailyOpen(false);
    refresh();
  };

  const handleSaveMonthly = async (payload: SaveMonthlyAvailabilityPayload) => {
    const res = useBackend
      ? await monthlyApi.execute(() => apiService.post(ep.monthly, payload))
      : true;
    if (!res) return;

    // Tag every day that has a call-in/call-out flag for the selected staff.
    setDayMap((prev) => {
      const next = { ...prev };
      payload.days.forEach((d) => {
        if (!d.callIn && !d.callOut) return;
        next[d.date] = {
          ...next[d.date],
          date: d.date,
          type: next[d.date]?.type ?? 'working',
          editable: next[d.date]?.editable ?? true,
          callPlanTag: next[d.date]?.callPlanTag ?? 'Not Effect Call Plan',
        };
      });
      return next;
    });

    setMonthlyOpen(false);
    refresh();
  };

  const years = yearOptions(baseYear);
  const selectedBranchName = branches.find((b) => b.code === applied.branchCode)?.name;

  return (
    <Box>
      {/* Top actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.25, mb: 1.5 }}>
        <SecondaryButton label="Monthly Availability" onClick={() => setMonthlyOpen(true)} />
        <PrimaryButton label="Copy Holidays" onClick={() => setCopyOpen(true)} />
      </Box>

      {/* Calendar Setup */}
      <SectionPanel title="Calendar Setup">
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 220px' }}>
            <Typography sx={schedulerStyles.fieldLabel}>Branch</Typography>
            <FormControl fullWidth>
              <Select value={branchCode} onChange={(e) => setBranchCode(e.target.value)}>
                {branches.map((b) => (
                  <MenuItem key={b.code} value={b.code}>
                    {b.code} - {b.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: '1 1 180px' }}>
            <Typography sx={schedulerStyles.fieldLabel}>Month</Typography>
            <FormControl fullWidth>
              <Select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {MONTH_NAMES.map((name, idx) => (
                  <MenuItem key={name} value={idx + 1}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: '1 1 180px' }}>
            <Typography sx={schedulerStyles.fieldLabel}>Year</Typography>
            <FormControl fullWidth>
              <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Actions: bottom-right, below the fields (matches design) */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.25, mt: 2 }}>
          <ResetButton label="RESET" onClick={handleReset} />
          <SearchButton label="SEARCH" onClick={handleSearch} />
        </Box>
      </SectionPanel>

      {/* Working Day Calendar */}
      <SectionPanel title="Working Day Calendar">
        <WorkingDayCalendar
          month={applied.month}
          year={applied.year}
          days={dayMap}
          onPrevMonth={() => handleStepMonth(-1)}
          onNextMonth={() => handleStepMonth(1)}
          onDayClick={(iso) => setHolidayDate(iso)}
        />
      </SectionPanel>

      {/* Dialogs */}
      {holidayDate && (
        <SetBranchHolidayDialog
          open={Boolean(holidayDate)}
          branchCode={applied.branchCode}
          date={holidayDate}
          initialRemark={dayMap[holidayDate]?.holiday?.remark ?? ''}
          initialAdditionalRemark={dayMap[holidayDate]?.holiday?.additionalRemark ?? ''}
          saving={holidayApi.loading}
          onClose={() => setHolidayDate(null)}
          onSave={handleSaveHoliday}
          onCallCenterAvailability={() => {
            setDailyOpen(true);
          }}
        />
      )}

      <CopyBranchHolidaysDialog
        open={copyOpen}
        branches={branches}
        baseYear={baseYear}
        defaultSourceMonth={applied.month}
        defaultSourceYear={applied.year}
        saving={copyApi.loading}
        onClose={() => setCopyOpen(false)}
        onCopy={handleCopy}
      />

      <DailyCallAvailabilityDialog
        open={dailyOpen}
        branchCode={applied.branchCode}
        branchName={selectedBranchName}
        date={holidayDate ?? new Date().toISOString().slice(0, 10)}
        staff={staff}
        saving={dailyApi.loading}
        onClose={() => setDailyOpen(false)}
        onSave={handleSaveDaily}
        onOpenMonthly={() => {
          setDailyOpen(false);
          setMonthlyOpen(true);
        }}
      />

      <MonthlyCallAvailabilityDialog
        open={monthlyOpen}
        branches={branches}
        staff={staff}
        baseYear={baseYear}
        defaultBranchCode={applied.branchCode}
        defaultMonth={applied.month}
        defaultYear={applied.year}
        saving={monthlyApi.loading}
        onClose={() => setMonthlyOpen(false)}
        onSave={handleSaveMonthly}
      />
    </Box>
  );
};

export default SchedulerCalendar;
