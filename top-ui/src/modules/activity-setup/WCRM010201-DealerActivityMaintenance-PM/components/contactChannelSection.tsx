import { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import {
  Box,
  Button,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Typography,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  AddIcon,
  DeleteIcon,
  CloseIcon,
} from '@components/common';
import { List, ListItem, ListItemText } from '@components/common';
import { SectionCard } from '@components/layout';
import { TopTable } from '@components/table';
import type { ICropColumn } from '@components/table';
import { useTranslation } from '@hooks';
import {
  activitySetupStyles,
  getCellBorderStyle,
  activityDayDisabledStyle,
  getAssignGroupWrapStyle,
  getStatusColor,
} from '../activitySetup.styles';

const styles = activitySetupStyles.contactChannel;

interface ContactChannel {
  [key: string]: unknown;
  id: number;
  status: 'ADD' | 'UPD' | 'DEL';
  contactProcess: string;
  channel: string;
  activityDay: number | string;
  assignGroup: string;
}

interface RowError {
  contactProcess?: string;
  channel?: string;
  activityDay?: string;
  assignGroup?: string;
}

const contactProcessKeys = [
  { value: 'service_followup', labelKey: 'opt_service_followup' },
  { value: 'appointment_confirmation', labelKey: 'opt_appointment_confirmation' },
  { value: 'reminder', labelKey: 'opt_reminder' },
];

const channelKeys = [
  { value: 'call_out', labelKey: 'opt_call_out' },
  { value: 'email', labelKey: 'opt_email' },
  { value: 'sms', labelKey: 'opt_sms' },
  { value: 'line_oa', labelKey: 'opt_line_oa' },
];

const assignGroupOptions = [
  { value: 'go01_group', label: 'GO01 GROUP' },
  { value: 'go02_group', label: 'GO02 GROUP' },
  { value: 'go03_group', label: 'GO03 GROUP' },
];

const initialChannels: ContactChannel[] = [
  { id: 1, status: 'ADD', contactProcess: 'service_followup', channel: 'call_out', activityDay: -30, assignGroup: 'go01_group' },
  { id: 2, status: 'UPD', contactProcess: 'service_followup', channel: 'email', activityDay: -25, assignGroup: '' },
  { id: 3, status: 'UPD', contactProcess: 'service_followup', channel: 'sms', activityDay: 30, assignGroup: '' },
  { id: 4, status: 'UPD', contactProcess: 'appointment_confirmation', channel: 'line_oa', activityDay: -1, assignGroup: '' },
];

export interface ContactChannelSectionRef {
  validateAllRows: () => boolean;
}

const ContactChannelSection = forwardRef<ContactChannelSectionRef>((_, ref) => {
  const [channels, setChannels] = useState<ContactChannel[]>(initialChannels);
  const [rowErrors, setRowErrors] = useState<Record<number, RowError>>({});
  const [touchedCells, setTouchedCells] = useState<Record<string, boolean>>({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { t } = useTranslation();

  const handleAddRow = () => {
    const newId = channels.length > 0 ? Math.max(...channels.map((c) => c.id)) + 1 : 1;
    setChannels([
      ...channels,
      { id: newId, status: 'ADD', contactProcess: '', channel: '', activityDay: '', assignGroup: '' },
    ]);
  };

  const handleDeleteRow = (id: number) => {
    setChannels(channels.filter((c) => c.id !== id));
    const newErrors = { ...rowErrors };
    delete newErrors[id];
    setRowErrors(newErrors);
  };

  // Mark cell as touched (for showing validation after interaction)
  const markTouched = (rowId: number, field: string) => {
    setTouchedCells((prev) => ({ ...prev, [`${rowId}_${field}`]: true }));
  };

  const isTouched = (rowId: number, field: string) => {
    return touchedCells[`${rowId}_${field}`] === true;
  };

  // Validate a single field and return error message
  const getFieldError = useCallback((field: string, value: string | number): string | undefined => {
    switch (field) {
      case 'contactProcess':
        if (!value || value === '') return t('validation_required', { field: t('col_contact_process') });
        return undefined;
      case 'channel':
        if (!value || value === '') return t('validation_required', { field: t('col_channel') });
        return undefined;
      case 'activityDay':
        if (value === '' || value === null || value === undefined) return t('validation_required', { field: t('col_activity_day') });
        if (Number.isNaN(Number(value))) return t('validation_invalid_number');
        if (Number(value) < -365 || Number(value) > 365) return t('validation_range', { min: '-365', max: '365' });
        return undefined;
      default:
        return undefined;
    }
  }, [t]);

  // Run validation for a row and update errors state
  const validateRow = useCallback((row: ContactChannel) => {
    const rowError: RowError = {};
    const cpErr = getFieldError('contactProcess', row.contactProcess);
    const chErr = getFieldError('channel', row.channel);
    // Skip activityDay validation for appointment_confirmation
    const adErr = row.contactProcess === 'appointment_confirmation' ? undefined : getFieldError('activityDay', row.activityDay);

    if (cpErr) rowError.contactProcess = cpErr;
    if (chErr) rowError.channel = chErr;
    if (adErr) rowError.activityDay = adErr;

    return rowError;
  }, [getFieldError]);

  // Handle field change + validate ALL fields in the row immediately
  const handleFieldChange = (id: number, field: keyof ContactChannel, value: string | number) => {
    const updatedChannels = channels.map((c) =>
      c.id === id ? { ...c, [field]: value, status: c.status === 'ADD' ? 'ADD' as const : 'UPD' as const } : c
    );
    setChannels(updatedChannels);

    // Mark ALL fields in this row as touched (so errors show on the spot)
    markTouched(id, 'contactProcess');
    markTouched(id, 'channel');
    markTouched(id, 'activityDay');

    // Validate the ENTIRE row (not just the changed field)
    const updatedRow = updatedChannels.find((c) => c.id === id)!;
    const rowError: RowError = {};
    const cpErr = getFieldError('contactProcess', updatedRow.contactProcess);
    const chErr = getFieldError('channel', updatedRow.channel);
    // Skip activityDay validation for appointment_confirmation
    const adErr = updatedRow.contactProcess === 'appointment_confirmation' ? undefined : getFieldError('activityDay', updatedRow.activityDay);

    if (cpErr) rowError.contactProcess = cpErr;
    if (chErr) rowError.channel = chErr;
    if (adErr) rowError.activityDay = adErr;

    setRowErrors((prev) => {
      const newErrors = { ...prev };
      if (Object.keys(rowError).length > 0) {
        newErrors[id] = rowError;
      } else {
        delete newErrors[id];
      }
      return newErrors;
    });
  };

  // Handle blur - validate the entire row (same as onChange)
  const handleFieldBlur = (id: number, _field: keyof ContactChannel) => {
    markTouched(id, 'contactProcess');
    markTouched(id, 'channel');
    markTouched(id, 'activityDay');

    const row = channels.find((c) => c.id === id);
    if (!row) return;

    // Validate entire row
    const rowError: RowError = {};
    const cpErr = getFieldError('contactProcess', row.contactProcess);
    const chErr = getFieldError('channel', row.channel);
    // Skip activityDay validation for appointment_confirmation
    const adErr = row.contactProcess === 'appointment_confirmation' ? undefined : getFieldError('activityDay', row.activityDay);

    if (cpErr) rowError.contactProcess = cpErr;
    if (chErr) rowError.channel = chErr;
    if (adErr) rowError.activityDay = adErr;

    setRowErrors((prev) => {
      const newErrors = { ...prev };
      if (Object.keys(rowError).length > 0) {
        newErrors[id] = rowError;
      } else {
        delete newErrors[id];
      }
      return newErrors;
    });
  };

  // Validate all rows - call this on Save button
  const validateAllRows = (): boolean => {
    const errors: Record<number, RowError> = {};
    const touched: Record<string, boolean> = { ...touchedCells };
    let hasErrors = false;

    channels.forEach((row) => {
      const rowError = validateRow(row);
      if (Object.keys(rowError).length > 0) {
        errors[row.id] = rowError;
        hasErrors = true;
        // Mark all fields as touched
        touched[`${row.id}_contactProcess`] = true;
        touched[`${row.id}_channel`] = true;
        touched[`${row.id}_activityDay`] = true;
      }
    });

    setRowErrors(errors);
    setTouchedCells(touched);

    if (hasErrors) {
      setShowErrorDialog(true);
    }

    return !hasErrors;
  };

  useImperativeHandle(ref, () => ({ validateAllRows }));

  // Collect all error messages for the dialog
  const allErrorMessages = Object.entries(rowErrors).flatMap(([id, errors]) => {
    const rowIndex = channels.findIndex((c) => c.id === Number(id)) + 1;
    return Object.entries(errors).map(([, message]) => ({
      row: rowIndex,
      message: message as string,
    }));
  });

  // Mandatory column header (label + red asterisk)
  const mandatoryHeader = (labelKey: string) => () => (
    <>
      {t(labelKey)}<span style={styles.mandatoryAsterisk}>*</span>
    </>
  );

  // Column definitions rendered through the shared iCROP table component so the
  // table shares one source of truth for header padding/alignment/borders.
  const columns: ICropColumn<ContactChannel>[] = [
    {
      id: 'no',
      label: t('col_no'),
      fieldtype: 'label',
      align: 'left',
      width: styles.headerColNo?.width as string | undefined,
      render: (_value, _row, index) => index + 1,
    },
    {
      id: 'status',
      label: t('col_status'),
      fieldtype: 'label',
      align: 'left',
      width: styles.headerColStatus?.width as string | undefined,
      render: (_value, row) => (
        <Typography sx={{ ...(styles.statusText as object), color: getStatusColor(row.status === 'ADD') }}>
          {row.status}
        </Typography>
      ),
    },
    {
      id: 'contactProcess',
      label: t('col_contact_process'),
      fieldtype: 'label',
      align: 'left',
      isRequired: true,
      width: styles.headerColContactProcess?.width as string | undefined,
      headerRender: mandatoryHeader('col_contact_process'),
      render: (_value, row) => {
        const errors = rowErrors[row.id] || {};
        const showCpError = isTouched(row.id, 'contactProcess') && !!errors.contactProcess;
        return (
          <Box sx={{ ...(styles.fieldWrapBase as object), ...(getCellBorderStyle(showCpError) as object) }}>
            {showCpError && (
              <Tooltip title={errors.contactProcess!} arrow placement="top">
                <Box sx={styles.errorDot} />
              </Tooltip>
            )}
            <Select
              size="small"
              fullWidth
              variant="standard"
              disableUnderline
              value={row.contactProcess}
              onChange={(e) => handleFieldChange(row.id, 'contactProcess', e.target.value)}
              onClose={() => handleFieldBlur(row.id, 'contactProcess')}
              displayEmpty
              sx={styles.fieldSelect}
            >
              <MenuItem value="" disabled><em>Select...</em></MenuItem>
              {contactProcessKeys.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{t(opt.labelKey)}</MenuItem>
              ))}
            </Select>
          </Box>
        );
      },
    },
    {
      id: 'channel',
      label: t('col_channel'),
      fieldtype: 'label',
      align: 'left',
      isRequired: true,
      width: styles.headerColChannel?.width as string | undefined,
      headerRender: mandatoryHeader('col_channel'),
      render: (_value, row) => {
        const errors = rowErrors[row.id] || {};
        const showChError = isTouched(row.id, 'channel') && !!errors.channel;
        return (
          <Box sx={{ ...(styles.fieldWrapBase as object), ...(getCellBorderStyle(showChError) as object) }}>
            {showChError && (
              <Tooltip title={errors.channel!} arrow placement="top">
                <Box sx={styles.errorDot} />
              </Tooltip>
            )}
            <Select
              size="small"
              fullWidth
              variant="standard"
              disableUnderline
              value={row.channel}
              onChange={(e) => handleFieldChange(row.id, 'channel', e.target.value)}
              onClose={() => handleFieldBlur(row.id, 'channel')}
              displayEmpty
              sx={styles.fieldSelect}
            >
              <MenuItem value="" disabled><em>Select...</em></MenuItem>
              {channelKeys.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{t(opt.labelKey)}</MenuItem>
              ))}
            </Select>
          </Box>
        );
      },
    },
    {
      id: 'activityDay',
      label: t('col_activity_day'),
      fieldtype: 'label',
      align: 'center',
      isRequired: true,
      width: styles.headerColActivityDay?.width as string | undefined,
      headerRender: mandatoryHeader('col_activity_day'),
      render: (_value, row) => {
        const errors = rowErrors[row.id] || {};
        const showAdError = isTouched(row.id, 'activityDay') && !!errors.activityDay;
        const isAppointmentConfirmation = row.contactProcess === 'appointment_confirmation';
        return (
          <Box
            sx={{
              ...(styles.fieldWrapBase as object),
              ...((isAppointmentConfirmation
                ? activityDayDisabledStyle
                : getCellBorderStyle(showAdError)) as object),
            }}
          >
            {!isAppointmentConfirmation && showAdError && (
              <Tooltip title={errors.activityDay!} arrow placement="top">
                <Box sx={styles.errorDot} />
              </Tooltip>
            )}
            <TextField
              size="small"
              type="number"
              variant="standard"
              value={row.activityDay}
              onChange={(e) => handleFieldChange(row.id, 'activityDay', e.target.value === '' ? '' : Number(e.target.value))}
              onBlur={() => handleFieldBlur(row.id, 'activityDay')}
              disabled={isAppointmentConfirmation}
              slotProps={{ input: { disableUnderline: true } }}
              sx={styles.activityDayField}
            />
          </Box>
        );
      },
    },
    {
      id: 'assignGroup',
      label: t('col_assign_group'),
      fieldtype: 'label',
      align: 'left',
      isRequired: true,
      width: styles.headerColAssignGroup?.width as string | undefined,
      headerRender: mandatoryHeader('col_assign_group'),
      render: (_value, row) => {
        const isAssignGroupEnabled = row.channel === 'call_out';
        return (
          <Box sx={getAssignGroupWrapStyle(isAssignGroupEnabled)}>
            <Select
              size="small"
              fullWidth
              variant="standard"
              disableUnderline
              value={row.assignGroup}
              onChange={(e) => handleFieldChange(row.id, 'assignGroup', e.target.value)}
              disabled={!isAssignGroupEnabled}
              displayEmpty
              sx={styles.fieldSelect}
            >
              <MenuItem value="" disabled><em></em></MenuItem>
              {assignGroupOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </Box>
        );
      },
    },
    {
      id: 'action',
      label: t('col_action'),
      fieldtype: 'action',
      align: 'center',
      width: styles.headerColAction?.width as string | undefined,
      renderActions: (row) => (
        <IconButton size="small" onClick={() => handleDeleteRow(row.id)} sx={styles.deleteIconButton}>
          <DeleteIcon sx={styles.deleteIcon} />
        </IconButton>
      ),
    },
  ];

  // + Add button (top-right of the table)
  const addAction = (
    <Button
      size="small"
      startIcon={<AddIcon sx={styles.addButtonIcon} />}
      onClick={handleAddRow}
      variant="text"
      sx={styles.addButton}
    >
      {t('add_btn')}
    </Button>
  );

  return (
    <SectionCard title={t('contact_channel_section')}>
      {/* No extra wrapper border here — TopTable's own `bordered` border is
          the standard (matches ServiceRepairSection). Wrapping it in another
          bordered Box produced a double border. */}
      <Box>
        <TopTable<ContactChannel>
          headerCell={columns}
          rows={channels}
          primaryKey="id"
          orderBy=""
          orderDir=""
          page={0}
          rowsPerPage={channels.length || 1}
          editRowIndex={{}}
          isServerPagination
          hidePagination
          bordered
          headerActions={addAction}
          handleSort={() => {}}
          handleChangePage={() => {}}
          handleChangeRowsPerPage={() => {}}
          onFilterChange={() => {}}
        />
      </Box>

      {/* Error Dialog - shown on Save when there are errors (TOPSCRM standard) */}
      <Dialog
        open={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: styles.dialogPaper,
        }}
      >
        {/* Header - white background, red title, black X, border */}
        <Box sx={styles.dialogHeader}>
          <Typography sx={styles.dialogTitle}>
            {t('validation_errors_title')}
          </Typography>
          <IconButton
            onClick={() => setShowErrorDialog(false)}
            size="small"
            sx={styles.dialogCloseButton}
          >
            <CloseIcon sx={styles.dialogCloseIcon} />
          </IconButton>
        </Box>

        {/* Body */}
        <DialogContent sx={styles.dialogContent}>
          <Typography sx={styles.dialogMessage}>
            {t('validation_errors_message')}
          </Typography>
          <List dense sx={styles.dialogList}>
            {allErrorMessages.map((err, i) => (
              <ListItem key={i} sx={styles.dialogListItem}>
                <ListItemText
                  primary={`Row ${err.row}: ${err.message}`}
                  sx={styles.dialogListItemText}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>

        {/* Footer */}
        <DialogActions sx={styles.dialogActions}>
          <Button
            onClick={() => setShowErrorDialog(false)}
            variant="contained"
            sx={styles.dialogOkButton}
          >
            {t('ok_btn')}
          </Button>
        </DialogActions>
      </Dialog>
    </SectionCard>
  );
});

export default ContactChannelSection;
