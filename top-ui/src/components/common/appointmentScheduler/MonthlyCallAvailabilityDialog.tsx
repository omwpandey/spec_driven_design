import React from 'react';
import Box from '../Box';
import Typography from '../Typography';
import Select from '../Select/Select';
import MenuItem from '../MenuItem';
import Checkbox from '../Checkbox';
import Button from '../Button';
import FormControl from '../FormControl';
import TextField from '../TextField';
import { colors } from '@core/theme';
import { MONTH_NAMES, WEEKDAY_NAMES, buildMonthGrid, yearOptions } from '@utils/dateUtils';
import type {
  Branch,
  CallCenterStaff,
  MonthlyAvailabilityDay,
  SaveMonthlyAvailabilityPayload,
} from '../../../types/holiday.types';
import SchedulerDialogShell from './SchedulerDialogShell';
import { schedulerStyles, callColors } from './SchedulerCalendar.styles';

interface MonthlyCallAvailabilityDialogProps {
  open: boolean;
  branches: Branch[];
  staff: CallCenterStaff[];
  baseYear?: number;
  defaultBranchCode?: string;
  defaultMonth?: number; // 1-based
  defaultYear?: number;
  /** Existing per-day flags keyed by ISO date. */
  initialDays?: Record<string, MonthlyAvailabilityDay>;
  saving?: boolean;
  onClose: () => void;
  onSave: (payload: SaveMonthlyAvailabilityPayload) => void;
}

const CallLegend: React.FC = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Box sx={schedulerStyles.callSwatch(callColors.callIn)} />
      <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>Call In</Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Box sx={schedulerStyles.callSwatch(callColors.callOut)} />
      <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>Call Out</Typography>
    </Box>
  </Box>
);

/**
 * MonthlyCallAvailabilityDialog
 *
 * "Monthly Call Center Availability" modal. Starts as a selector form
 * (Branch / Staff / Nick Name / Month / Year); once a staff member is chosen
 * it reveals a month grid where each day has Call In / Call Out checkboxes.
 */
const MonthlyCallAvailabilityDialog: React.FC<MonthlyCallAvailabilityDialogProps> = ({
  open,
  branches,
  staff,
  baseYear = new Date().getFullYear(),
  defaultBranchCode,
  defaultMonth = 1,
  defaultYear,
  initialDays = {},
  saving = false,
  onClose,
  onSave,
}) => {
  const years = yearOptions(baseYear);
  const [branchCode, setBranchCode] = React.useState(defaultBranchCode ?? branches[0]?.code ?? '');
  const [staffCode, setStaffCode] = React.useState('');
  const [nickName, setNickName] = React.useState('');
  /** Tracks whether the user has manually edited the nick name so we stop
   *  auto-overwriting it from the selected staff. */
  const [nickNameTouched, setNickNameTouched] = React.useState(false);
  const [month, setMonth] = React.useState(defaultMonth);
  const [year, setYear] = React.useState(defaultYear ?? baseYear);
  const [days, setDays] = React.useState<Record<string, MonthlyAvailabilityDay>>({});

  // Seed state when the dialog opens. Keyed on `open` + stable primitives only;
  // `branches`/`initialDays` are object props often passed as fresh references
  // each render, so including them would cause an infinite render loop.
  React.useEffect(() => {
    if (open) {
      setBranchCode(defaultBranchCode ?? branches[0]?.code ?? '');
      setStaffCode('');
      setNickName('');
      setNickNameTouched(false);
      setMonth(defaultMonth);
      setYear(defaultYear ?? baseYear);
      setDays(initialDays);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultBranchCode, defaultMonth, defaultYear, baseYear]);

  const handleStaffChange = (code: string) => {
    setStaffCode(code);
    // Pre-fill the nick name from the chosen staff, but only if the user
    // hasn't manually typed their own value yet.
    if (!nickNameTouched) {
      const match = staff.find((s) => s.code === code);
      setNickName(match?.nickName ?? '');
    }
  };
  const showGrid = Boolean(staffCode);
  const cells = buildMonthGrid(month, year);

  const toggle = (iso: string, field: 'callIn' | 'callOut') => {
    setDays((prev) => {
      const existing = prev[iso] ?? { date: iso, callIn: false, callOut: false };
      return { ...prev, [iso]: { ...existing, [field]: !existing[field] } };
    });
  };

  const handleSave = () => {
    if (!branchCode || !staffCode) return;
    onSave({
      branchCode,
      staffCode,
      nickName: nickName.trim() || undefined,
      month,
      year,
      days: Object.values(days),
    });
  };

  return (
    <SchedulerDialogShell
      open={open}
      title="Monthly Call Center Availability"
      onClose={onClose}
      maxWidth="lg"
    >
      {/* Selectors */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 180px' }}>
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
          <Typography sx={schedulerStyles.fieldLabel}>Staff Name</Typography>
          <FormControl fullWidth>
            <Select
              displayEmpty
              value={staffCode}
              onChange={(e) => handleStaffChange(e.target.value)}
              renderValue={(val) =>
                val || (
                  <Box component="span" sx={{ color: colors.text.disabled }}>
                    Select Staff Name
                  </Box>
                )
              }
            >
              {staff.map((s) => (
                <MenuItem key={s.code} value={s.code}>
                  {s.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: '1 1 180px' }}>
          <Typography sx={schedulerStyles.fieldLabel}>Nick Name</Typography>
          <TextField
            value={nickName}
            onChange={(e) => {
              setNickName(e.target.value);
              setNickNameTouched(true);
            }}
            placeholder="Nick Name"
            fullWidth
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
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
        <Box sx={{ flex: '1 1 180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          <CallLegend />
        </Box>
      </Box>

      {/* Per-day grid (revealed when a staff member is chosen) */}
      {showGrid && (
        <Box sx={{ mt: 2 }}>
          <Box sx={schedulerStyles.weekdayHeaderRow}>
            {WEEKDAY_NAMES.map((wd) => (
              <Box key={wd} sx={{ ...schedulerStyles.weekdayHeaderCell, py: 0.75 }}>
                <Typography component="div" sx={{ fontSize: '0.6875rem', fontWeight: 700, mb: 0.25 }}>
                  {wd}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={schedulerStyles.grid}>
            {cells.map((cell) => {
              const dayFlags = days[cell.date];
              return (
                <Box
                  key={cell.date}
                  sx={{
                    minHeight: 58,
                    p: 0.5,
                    borderRight: `1px solid ${colors.border.light}`,
                    borderBottom: `1px solid ${colors.border.light}`,
                    backgroundColor: cell.inCurrentMonth ? '#FFFFFF' : '#FAFAFA',
                    ...(!cell.inCurrentMonth && {
                      backgroundImage:
                        'repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 6px)',
                    }),
                  }}
                >
                  {cell.inCurrentMonth && (
                    <>
                      <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600 }}>
                        {cell.day}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                        <Checkbox
                          size="small"
                          checked={Boolean(dayFlags?.callIn)}
                          onChange={() => toggle(cell.date, 'callIn')}
                          sx={{ p: 0.25, '&.Mui-checked': { color: callColors.callIn } }}
                        />
                        <Checkbox
                          size="small"
                          checked={Boolean(dayFlags?.callOut)}
                          onChange={() => toggle(cell.date, 'callOut')}
                          sx={{ p: 0.25, '&.Mui-checked': { color: callColors.callOut } }}
                        />
                      </Box>
                    </>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.25, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ borderColor: colors.border.main, color: colors.text.secondary }}
        >
          CANCEL
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!staffCode || saving}
          sx={{
            backgroundColor: colors.primary.main,
            fontWeight: 600,
            '&:hover': { backgroundColor: colors.primary.dark },
          }}
        >
          SAVE AVAILABILITY
        </Button>
      </Box>
    </SchedulerDialogShell>
  );
};

export default MonthlyCallAvailabilityDialog;
