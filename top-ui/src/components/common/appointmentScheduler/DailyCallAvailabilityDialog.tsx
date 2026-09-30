import React from 'react';
import Box from '../Box';
import Typography from '../Typography';
import TextField from '../TextField';
import Checkbox from '../Checkbox';
import Button from '../Button';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '../Table';
import { colors } from '@core/theme';
import { formatLongDate } from '@utils/dateUtils';
import type {
  CallCenterStaff,
  DailyCallAvailability,
  SaveDailyAvailabilityPayload,
} from '../../../types/holiday.types';
import SchedulerDialogShell from './SchedulerDialogShell';
import { schedulerStyles, callColors } from './SchedulerCalendar.styles';

interface DailyCallAvailabilityDialogProps {
  open: boolean;
  branchCode: string;
  branchName?: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  staff: CallCenterStaff[];
  /** Existing availability keyed by staffId. */
  initialAvailability?: Record<string | number, DailyCallAvailability>;
  saving?: boolean;
  onClose: () => void;
  onSave: (payload: SaveDailyAvailabilityPayload) => void;
  onOpenMonthly?: () => void;
}

const headCell = {
  ...schedulerStyles.fieldLabel,
  mb: 0,
  fontSize: '0.75rem',
  textTransform: 'uppercase' as const,
};

/**
 * DailyCallAvailabilityDialog
 *
 * "Daily Call Center Availability" modal: a read-only branch/date header and
 * a staff table with Call In / Call Out checkboxes per row.
 */
const DailyCallAvailabilityDialog: React.FC<DailyCallAvailabilityDialogProps> = ({
  open,
  branchCode,
  branchName,
  date,
  staff,
  initialAvailability = {},
  saving = false,
  onClose,
  onSave,
  onOpenMonthly,
}) => {
  const [rows, setRows] = React.useState<Record<string | number, DailyCallAvailability>>({});

  // Seed row state when the dialog opens. We intentionally key this on `open`
  // only: `staff`/`initialAvailability` are object/array props that are often
  // passed as fresh references each render, so including them here would cause
  // an infinite render loop (effect -> setState -> re-render -> new ref -> effect).
  React.useEffect(() => {
    if (!open) return;
    const seeded: Record<string | number, DailyCallAvailability> = {};
    staff.forEach((s) => {
      seeded[s.id] = initialAvailability[s.id] ?? {
        staffId: s.id,
        callIn: false,
        callOut: false,
      };
    });
    setRows(seeded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = (staffId: string | number, field: 'callIn' | 'callOut') => {
    setRows((prev) => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        staffId,
        [field]: !prev[staffId]?.[field],
      },
    }));
  };

  const handleSave = () => {
    onSave({ branchCode, date, entries: Object.values(rows) });
  };

  return (
    <SchedulerDialogShell
      open={open}
      title="Daily Call Center Availability"
      onClose={onClose}
      maxWidth="md"
    >
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Box sx={{ flex: '1 1 200px' }}>
          <TextField
            label="Branch"
            value={branchName ? `${branchCode} - ${branchName}` : branchCode}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <TextField
            label="Date"
            value={formatLongDate(date)}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </Box>
      </Box>

      <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: '8px', overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headCell}>No.</TableCell>
              <TableCell sx={headCell}>Staff Name</TableCell>
              <TableCell sx={headCell}>Nick Name</TableCell>
              <TableCell sx={headCell}>Position</TableCell>
              <TableCell align="center" sx={headCell}>
                Call In
              </TableCell>
              <TableCell align="center" sx={headCell}>
                Call Out
              </TableCell>
              <TableCell sx={headCell}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((s, idx) => {
              const row = rows[s.id];
              return (
                <TableRow key={s.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.nickName}</TableCell>
                  <TableCell>{s.position}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={Boolean(row?.callIn)}
                      onChange={() => toggle(s.id, 'callIn')}
                      sx={{
                        color: `${callColors.callIn} !important`,
                        '&.Mui-checked': { color: `${callColors.callIn} !important` },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={Boolean(row?.callOut)}
                      onChange={() => toggle(s.id, 'callOut')}
                      sx={{
                        color: `${callColors.callOut} !important`,
                        '&.Mui-checked': { color: `${callColors.callOut} !important` },
                      }}
                    />
                  </TableCell>
                  <TableCell>{row?.status ?? ''}</TableCell>
                </TableRow>
              );
            })}
            {staff.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: colors.text.disabled }}>
                  No staff found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.25, mt: 3 }}>
        {onOpenMonthly && (
          <Button
            variant="outlined"
            onClick={onOpenMonthly}
            sx={{
              borderColor: colors.primary.main,
              color: colors.primary.main,
              fontWeight: 600,
              '&:hover': { borderColor: colors.primary.dark },
            }}
          >
            CALL CENTER AVAILABILITY
          </Button>
        )}
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
          disabled={saving}
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

export default DailyCallAvailabilityDialog;
