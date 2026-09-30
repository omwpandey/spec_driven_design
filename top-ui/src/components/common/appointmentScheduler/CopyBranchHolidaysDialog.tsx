import React from 'react';
import Box from '../Box';
import Typography from '../Typography';
import Select from '../Select/Select';
import MenuItem from '../MenuItem';
import Button from '../Button';
import FormControl from '../FormControl';
import { colors } from '@core/theme';
import { MONTH_NAMES, yearOptions } from '@utils/dateUtils';
import type { Branch, CopyHolidaysPayload } from '../../../types/holiday.types';
import SchedulerDialogShell from './SchedulerDialogShell';
import { schedulerStyles } from './SchedulerCalendar.styles';

interface CopyBranchHolidaysDialogProps {
  open: boolean;
  branches: Branch[];
  /** Base year used to build the year dropdown options. */
  baseYear?: number;
  defaultSourceMonth?: number; // 1-based
  defaultSourceYear?: number;
  saving?: boolean;
  onClose: () => void;
  onCopy: (payload: CopyHolidaysPayload) => void;
}

const groupLabel = { fontSize: '0.8125rem', fontWeight: 700, color: colors.text.primary, mb: 1.5 };

/**
 * CopyBranchHolidaysDialog
 *
 * "Copy Branch Holidays" modal: choose a source month/year and copy into a
 * target branch/month/year.
 */
const CopyBranchHolidaysDialog: React.FC<CopyBranchHolidaysDialogProps> = ({
  open,
  branches,
  baseYear = new Date().getFullYear(),
  defaultSourceMonth = 1,
  defaultSourceYear,
  saving = false,
  onClose,
  onCopy,
}) => {
  const years = yearOptions(baseYear);
  const [sourceMonth, setSourceMonth] = React.useState(defaultSourceMonth);
  const [sourceYear, setSourceYear] = React.useState(defaultSourceYear ?? baseYear);
  const [targetBranch, setTargetBranch] = React.useState(branches[0]?.code ?? '');
  const [targetMonth, setTargetMonth] = React.useState(defaultSourceMonth);
  const [targetYear, setTargetYear] = React.useState(defaultSourceYear ?? baseYear);

  React.useEffect(() => {
    if (open) {
      setSourceMonth(defaultSourceMonth);
      setSourceYear(defaultSourceYear ?? baseYear);
      setTargetBranch(branches[0]?.code ?? '');
      setTargetMonth(defaultSourceMonth);
      setTargetYear(defaultSourceYear ?? baseYear);
    }
  }, [open, defaultSourceMonth, defaultSourceYear, baseYear, branches]);

  const monthSelect = (value: number, onChange: (v: number) => void) => (
    <FormControl fullWidth>
      <Select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {MONTH_NAMES.map((name, idx) => (
          <MenuItem key={name} value={idx + 1}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const yearSelect = (value: number, onChange: (v: number) => void) => (
    <FormControl fullWidth>
      <Select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {years.map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const handleCopy = () => {
    if (!targetBranch) return;
    onCopy({
      sourceMonth,
      sourceYear,
      targetBranchCode: targetBranch,
      targetMonth,
      targetYear,
    });
  };

  return (
    <SchedulerDialogShell open={open} title="Copy Branch Holidays" onClose={onClose} maxWidth="sm">
      {/* Source */}
      <Box
        sx={{
          border: `1px solid ${colors.border.light}`,
          borderRadius: '8px',
          p: 2,
          mb: 2,
        }}
      >
        <Typography sx={groupLabel}>Source</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 180px' }}>
            <Typography sx={schedulerStyles.fieldLabel}>Source Month</Typography>
            {monthSelect(sourceMonth, setSourceMonth)}
          </Box>
          <Box sx={{ flex: '1 1 180px' }}>
            <Typography sx={schedulerStyles.fieldLabel}>Source Year</Typography>
            {yearSelect(sourceYear, setSourceYear)}
          </Box>
        </Box>
      </Box>

      {/* Target */}
      <Box
        sx={{
          border: `1px solid ${colors.border.light}`,
          borderRadius: '8px',
          p: 2,
        }}
      >
        <Typography sx={groupLabel}>Target</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 180px' }}>
            <Typography sx={schedulerStyles.fieldLabel}>Target Branch</Typography>
            <FormControl fullWidth>
              <Select value={targetBranch} onChange={(e) => setTargetBranch(e.target.value)}>
                {branches.map((b) => (
                  <MenuItem key={b.code} value={b.code}>
                    {b.code} - {b.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: '1 1 180px' }}>
            <Typography sx={schedulerStyles.fieldLabel}>Target Month</Typography>
            {monthSelect(targetMonth, setTargetMonth)}
          </Box>
          <Box sx={{ flex: '1 1 180px' }}>
            <Typography sx={schedulerStyles.fieldLabel}>Target Year</Typography>
            {yearSelect(targetYear, setTargetYear)}
          </Box>
        </Box>
      </Box>

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
          onClick={handleCopy}
          disabled={!targetBranch || saving}
          sx={{
            backgroundColor: colors.primary.main,
            fontWeight: 600,
            '&:hover': { backgroundColor: colors.primary.dark },
          }}
        >
          COPY
        </Button>
      </Box>
    </SchedulerDialogShell>
  );
};

export default CopyBranchHolidaysDialog;
