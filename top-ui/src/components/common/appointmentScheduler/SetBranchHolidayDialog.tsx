import React from 'react';
import Box from '../Box';
import Typography from '../Typography';
import TextField from '../TextField';
import Select from '../Select/Select';
import MenuItem from '../MenuItem';
import Button from '../Button';
import FormControl from '../FormControl';
import { colors } from '@core/theme';
import { formatLongDate } from '@utils/dateUtils';
import type { HolidayRemark, SetBranchHolidayPayload } from '../../../types/holiday.types';
import SchedulerDialogShell from './SchedulerDialogShell';
import { schedulerStyles } from './SchedulerCalendar.styles';

const REMARK_OPTIONS: { value: HolidayRemark; label: string }[] = [
  { value: 'PUBLIC_HOLIDAY', label: 'Public Holiday' },
  { value: 'SPECIAL_HOLIDAY', label: 'Special Holiday' },
  { value: 'SUBSTITUTE_HOLIDAY', label: 'Substitute Holiday' },
  { value: 'BRANCH_HOLIDAY', label: 'Branch Holiday' },
  { value: 'COMPANY_HOLIDAY', label: 'Company Holiday' },
];

interface SetBranchHolidayDialogProps {
  open: boolean;
  branchCode: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  initialRemark?: HolidayRemark | '';
  initialAdditionalRemark?: string;
  saving?: boolean;
  onClose: () => void;
  onSave: (payload: SetBranchHolidayPayload) => void;
  onCallCenterAvailability?: () => void;
}

/**
 * SetBranchHolidayDialog
 *
 * "Set Branch Holiday" modal: read-only date, a required Remark select, an
 * additional remark textarea, and Call Center Availability / Cancel / Save
 * Holiday actions.
 */
const SetBranchHolidayDialog: React.FC<SetBranchHolidayDialogProps> = ({
  open,
  branchCode,
  date,
  initialRemark = '',
  initialAdditionalRemark = '',
  saving = false,
  onClose,
  onSave,
  onCallCenterAvailability,
}) => {
  const [remark, setRemark] = React.useState<HolidayRemark | ''>(initialRemark);
  const [additionalRemark, setAdditionalRemark] = React.useState(initialAdditionalRemark);

  React.useEffect(() => {
    if (open) {
      setRemark(initialRemark);
      setAdditionalRemark(initialAdditionalRemark);
    }
  }, [open, initialRemark, initialAdditionalRemark]);

  const handleSave = () => {
    if (!remark) return;
    onSave({ branchCode, date, remark, additionalRemark: additionalRemark.trim() || undefined });
  };

  return (
    <SchedulerDialogShell open={open} title="Set Branch Holiday" onClose={onClose}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 200px' }}>
          <Typography sx={schedulerStyles.fieldLabel}>Date</Typography>
          <TextField value={formatLongDate(date)} fullWidth disabled />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <Typography sx={schedulerStyles.fieldLabel}>
            Remark <Box component="span" sx={{ color: colors.mandatory }}>*</Box>
          </Typography>
          <FormControl fullWidth>
            <Select
              displayEmpty
              value={remark}
              onChange={(e) => setRemark(e.target.value as HolidayRemark)}
              renderValue={(val) =>
                val ? (
                  REMARK_OPTIONS.find((o) => o.value === val)?.label
                ) : (
                  <Box component="span" sx={{ color: colors.text.disabled }}>
                    Select Remark
                  </Box>
                )
              }
            >
              {REMARK_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={schedulerStyles.fieldLabel}>Additional Remark</Typography>
        <TextField
          value={additionalRemark}
          onChange={(e) => setAdditionalRemark(e.target.value)}
          placeholder="Enter Additional Remark"
          fullWidth
          multiline
          minRows={3}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 1.25,
          mt: 3,
        }}
      >
        {onCallCenterAvailability && (
          <Button
            variant="outlined"
            onClick={onCallCenterAvailability}
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
          disabled={!remark || saving}
          sx={{
            backgroundColor: colors.primary.main,
            fontWeight: 600,
            '&:hover': { backgroundColor: colors.primary.dark },
          }}
        >
          SAVE HOLIDAY
        </Button>
      </Box>
    </SchedulerDialogShell>
  );
};

export default SetBranchHolidayDialog;
