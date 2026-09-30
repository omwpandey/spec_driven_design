import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Box,
  Button,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Typography,
  AddIcon,
  DeleteIcon,
  ConfirmDialog,
} from '@components/common';
import { SectionCard } from '@components/layout';
import { TopTable } from '@components/table';
import type { ICropColumn } from '@components/table';
import { useApi, useTranslation } from '@hooks';
import tmtActivityMaintenanceService, {
  type ComboOption,
  type TmtListResponse,
  type TmtPmOnloadData,
} from '../services/tmtActivityMaintenanceService';
import {
  activitySetupStyles,
  getStatusColor,
} from '../index';

const styles = activitySetupStyles.contactChannel;

import type {
  ContactChannelRow,
  ComboSelectOption,
  TmtPmActivitySaveDetail,
  TmtPmContactChannelTableRef,
  TmtPmContactChannelTableProps,
} from '../tmtActivityPm.type';



const ACTIVITY_DAY_MIN = -30;
const ACTIVITY_DAY_MAX = 30;
const ACTIVITY_DAY_MAX_LENGTH = 3;

/** Map a raw combo lookup row to the {value,label} shape used by the Selects. */
const toSelectOption = (opt: ComboOption): ComboSelectOption => ({
  value: opt.code,
  label: opt.name,
});

// No pre-populated rows: users add contact-channel entries via the + button.
const initialRows: ContactChannelRow[] = [];

const TmtPmContactChannelTable = forwardRef<
  TmtPmContactChannelTableRef,
  TmtPmContactChannelTableProps
>(({ activityId, onloadData }, ref) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<ContactChannelRow[]>(initialRows);
  // Baseline snapshot to detect unsaved changes (WRN0001).
  const [savedSnapshot, setSavedSnapshot] = useState<string>(
    JSON.stringify(initialRows),
  );
  const [rowErrors, setRowErrors] = useState<Record<number, Partial<Record<keyof ContactChannelRow, string>>>>({});
  // Lookup options: loaded from local JSON mocks or the API depending on
  // TOPS_USE_MOCK_DATA (both resolved through tmtActivityMaintenanceService).
  const [contactProcessOptions, setContactProcessOptions] = useState<
    ComboSelectOption[]
  >([]);
  const [channelOptions, setChannelOptions] = useState<ComboSelectOption[]>([]);
  const [deleteRowId, setDeleteRowId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const contactProcessApi = useApi<TmtListResponse<ComboOption>>({
    context: 'TmtPmContactChannelTable-ContactProcess',
  });
  const channelApi = useApi<TmtListResponse<ComboOption>>({
    context: 'TmtPmContactChannelTable-ContactChannel',
  });
  const onloadApi = useApi<TmtPmOnloadData>({
    context: 'TmtPmContactChannelTable-Onload',
  });

  useEffect(() => {
    contactProcessApi.execute(() =>
      tmtActivityMaintenanceService.getContactProcessOptions(),
    );
    channelApi.execute(() =>
      tmtActivityMaintenanceService.getContactChannelOptions(),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (onloadData !== undefined) return;

    onloadApi.execute(() =>
      tmtActivityMaintenanceService.getOnloadData({
        activityType: 'PM',
        activityId: activityId ?? '',
        dealerId: 'TMT',
        branchId: 'HO',
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId, onloadData]);

  useEffect(() => {
    if (contactProcessApi.data) {
      setContactProcessOptions(
        contactProcessApi.data.tableData.map(toSelectOption),
      );
    }
  }, [contactProcessApi.data]);

  useEffect(() => {
    if (channelApi.data) {
      setChannelOptions(channelApi.data.tableData.map(toSelectOption));
    }
  }, [channelApi.data]);

  const resolvedOnloadData = onloadData ?? onloadApi.data ?? null;

  useEffect(() => {
    if (!resolvedOnloadData) return;
    if (!contactProcessOptions.length || !channelOptions.length) return;

    if (!resolvedOnloadData.contactChannelDetails?.length) {
      setRows([]);
      setSavedSnapshot(JSON.stringify([]));
      return;
    }

    const mappedRows = resolvedOnloadData.contactChannelDetails.map((item, index) => {
      const matchContactProcess =
        contactProcessOptions.find(
          (opt) =>
            opt.value === item.processType ||
            opt.label === item.processType,
        )?.value ?? item.processType;

      const matchChannel =
        channelOptions.find(
          (opt) => opt.value === item.channelType || opt.label === item.channelType,
        )?.value ?? item.channelType;

      return {
        id: item.id ?? index + 1,
        status: null,
        contactProcess: matchContactProcess,
        channel: matchChannel,
        activityDay: item.activityDay,
      };
    });

    setRows(mappedRows);
    setSavedSnapshot(JSON.stringify(mappedRows));
  }, [resolvedOnloadData, contactProcessOptions, channelOptions]);

  const handleAddRow = () => {
    const newId =
      rows.length > 0
        ? Math.max(...rows.map((r) => r.id)) + 1
        : 1;

    setRowErrors((prev) => {
      if (!prev[newId]) return prev;
      const next = { ...prev };
      delete next[newId];
      return next;
    });
    setRows([
      ...rows,
      {
        id: newId,
        status: 'ADD',
        contactProcess: '',
        channel: '',
        activityDay: '',
      },
    ]);
  };

  const handleDeleteRow = (id: number) => {
    setRowErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setRows((prev) =>
      prev.reduce<ContactChannelRow[]>(
        (acc, row) => {
          if (row.id !== id) {
            acc.push(row);
            return acc;
          }

          if (row.status === 'ADD') {
            return acc;
          }

          acc.push({
            ...row,
            status: 'DEL',
          });

          return acc;
        },
        [],
      ),
    );
  };

  const handleFieldChange = (
    id: number,
    field: keyof ContactChannelRow,
    value: string | number,
  ) => {
    setRowErrors((prev) => {
      if (!prev[id]?.[field]) return prev;
      const nextRowErrors = { ...prev[id] };
      delete nextRowErrors[field];
      return { ...prev, [id]: nextRowErrors };
    });
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
            ...row,
            [field]: value,
            status:
              row.status === 'ADD'
                ? 'ADD'
                : row.status === null
                  ? 'UPD'
                  : row.status,
          }
          : row,
      ),
    );
  };

  const handleActivityDayChange = (id: number, value: string) => {
    if (value.length > ACTIVITY_DAY_MAX_LENGTH) return;

    if (value !== '' && value !== '-') {
      const numericValue = Number(value);
      if (!Number.isInteger(numericValue) || numericValue < ACTIVITY_DAY_MIN || numericValue > ACTIVITY_DAY_MAX) {
        return;
      }
    }

    handleFieldChange(id, 'activityDay', value);
  };

  /** ERR0001 (required) / ERR0005 (duplicate) / ERR0006 (numeric) /
   *  ERR0020 (range) / ERR0002 (length) — checked in DR precedence order. */
  const validateContactChannelRows = (): string | null => {
    const activeRows = rows.filter((row) => row.status !== 'DEL');
    const errors: Record<number, Partial<Record<keyof ContactChannelRow, string>>> = {};

    const comboKeys = activeRows.map(
      (row) => `${row.contactProcess}|${row.channel}`,
    );
    const duplicateKeys = new Set(
      comboKeys.filter((key, index) => comboKeys.indexOf(key) !== index),
    );

    for (const row of activeRows) {
      if (!row.contactProcess) {
        errors[row.id] = { ...errors[row.id], contactProcess: t('validation_required', { field: 'Contact Process' }) };
      }
      if (!row.channel) {
        errors[row.id] = { ...errors[row.id], channel: t('validation_required', { field: 'Channel' }) };
      }
      if (duplicateKeys.has(`${row.contactProcess}|${row.channel}`)) {
        errors[row.id] = { ...errors[row.id], channel: t('psfu_err0005_duplicate') };
      }

      const rawActivityDay = String(row.activityDay).trim();
      if (!rawActivityDay) {
        errors[row.id] = { ...errors[row.id], activityDay: t('validation_required', { field: 'Activity Day' }) };
        continue;
      }

      if (!/^-?\d+$/.test(rawActivityDay)) {
        errors[row.id] = { ...errors[row.id], activityDay: t('validation_invalid_number', { field: 'Activity Day' }) };
        continue;
      }

      if (rawActivityDay.length > ACTIVITY_DAY_MAX_LENGTH) {
        errors[row.id] = {
          ...errors[row.id], activityDay: t('tmt_pm_err0002_max_length', {
            field: 'Activity Day',
            max: ACTIVITY_DAY_MAX_LENGTH,
          })
        };
        continue;
      }

      const activityDayValue = Number(rawActivityDay);
      if (activityDayValue < ACTIVITY_DAY_MIN || activityDayValue > ACTIVITY_DAY_MAX) {
        errors[row.id] = {
          ...errors[row.id], activityDay: t('tmt_pm_err0020_range', {
            field: 'Activity Day',
            min: ACTIVITY_DAY_MIN,
            max: ACTIVITY_DAY_MAX,
          })
        };
      }
    }

    setRowErrors(errors);
    return Object.values(errors).flatMap(Object.values)[0] ?? null;
  };

  const hasChanges = () => JSON.stringify(rows) !== savedSnapshot;

  const commitSaved = () => {
    const persisted = rows
      .filter((row) => row.status !== 'DEL')
      .map((row) => ({ ...row, status: null }));
    setRows(persisted);
    setSavedSnapshot(JSON.stringify(persisted));
  };

  const getPayload = (): TmtPmActivitySaveDetail[] =>
    rows
      .map((row) => ({
        activityId: onloadData?.activityId || activityId || '',
        dealerId: onloadData?.dealerId || 'TMT',
        branchId: onloadData?.branchId || 'HO',
        processType: row.contactProcess,
        channelType: row.channel,
        activityDay: Number(row.activityDay),
        groupId: 1,
        activityMasterId: onloadData?.activityId || activityId || '',
        version: onloadData?.version || 0,
        deleted: row.status === 'DEL',
        id: row.id,
        rowStatus: row.status,
      }));

  useImperativeHandle(ref, () => ({
    validateContactChannelRows,
    hasChanges,
    commitSaved,
    getPayload,
  }));

  const mandatoryHeader =
    (labelKey: string) => () => (
      <>
        {t(labelKey)}
        <span style={styles.mandatoryAsterisk}>
          *
        </span>
      </>
    );

  const confirmDeleteRow = () => {
    if (deleteRowId === null) {
      return;
    }

    handleDeleteRow(deleteRowId);

    setDeleteRowId(null);
    setShowDeleteDialog(false);
  };

  const columns: ICropColumn<ContactChannelRow>[] = [
    {
      id: 'no',
      label: t('col_no'),
      fieldtype: 'label',
      align: 'right',
      width:
        styles.headerColNo?.width as
        | string
        | undefined,
      render: (_value, _row, index) => index + 1,
    },
    {
      id: 'status',
      label: t('col_status'),
      fieldtype: 'label',
      width:
        styles.headerColStatus?.width as
        | string
        | undefined,
      render: (_value, row) => (
        <Typography
          sx={{
            ...(styles.statusText as object),
            color:
              row.status === 'ADD'
                ? getStatusColor(true)
                : row.status === 'DEL'
                  ? '#D32F2F'
                  : getStatusColor(false),

          }}
        >
          {row.status ?? ''}
        </Typography>
      ),
    },
    {
      id: 'contactProcess',
      label: t('col_contact_process'),
      fieldtype: 'label',
      isRequired: true,
      width:
        styles.headerColContactProcess?.width as
        | string
        | undefined,
      headerRender: mandatoryHeader(
        'col_contact_process',
      ),
      render: (_value, row) => (
        <Box sx={{ minHeight: 32 }}>
          <Box
            sx={{
              ...(styles.fieldWrapBase as object),
              ...(rowErrors[row.id]?.contactProcess ? (styles.fieldError as object) : {}),
            }}
          >
            <Select
              size="small"
              fullWidth
              variant="standard"
              disableUnderline
              displayEmpty
              disabled={row.status === 'DEL'}
              value={row.contactProcess}
              onChange={(e) =>
                handleFieldChange(
                  row.id,
                  'contactProcess',
                  e.target.value,
                )
              }
              sx={styles.fieldSelect}
            >
              <MenuItem value="" disabled>
                <em>{t('tmt_select_placeholder')}</em>
              </MenuItem>

              {contactProcessOptions.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {rowErrors[row.id]?.contactProcess ? (
            <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              {rowErrors[row.id]?.contactProcess}
            </Typography>
          ) : null}
        </Box>
      ),
    },
    {
      id: 'channel',
      label: t('col_channel'),
      fieldtype: 'label',
      isRequired: true,
      width:
        styles.headerColChannel?.width as
        | string
        | undefined,
      headerRender: mandatoryHeader(
        'col_channel',
      ),
      render: (_value, row) => (
        <Box sx={{ minHeight: 32 }}>
          <Box
            sx={{
              ...(styles.fieldWrapBase as object),
              ...(rowErrors[row.id]?.channel ? (styles.fieldError as object) : {}),
            }}
          >
            <Select
              size="small"
              fullWidth
              variant="standard"
              disableUnderline
              displayEmpty
              disabled={row.status === 'DEL'}
              value={row.channel}
              onChange={(e) =>
                handleFieldChange(
                  row.id,
                  'channel',
                  e.target.value,
                )
              }
              sx={styles.fieldSelect}
            >
              <MenuItem value="" disabled>
                <em>{t('tmt_select_placeholder')}</em>
              </MenuItem>

              {channelOptions.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {rowErrors[row.id]?.channel ? (
            <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              {rowErrors[row.id]?.channel}
            </Typography>
          ) : null}
        </Box>
      ),
    },
    {
      id: 'activityDay',
      label: t('col_activity_day'),
      fieldtype: 'label',
      align: 'right',
      isRequired: true,
      width:
        styles.headerColActivityDay?.width as
        | string
        | undefined,
      headerRender: mandatoryHeader(
        'col_activity_day',
      ),
      render: (_value, row) => (
        <Box sx={{ minHeight: 32 }}>
          <Box
            sx={{
              ...(styles.fieldWrapBase as object),
              ...(rowErrors[row.id]?.activityDay ? (styles.fieldError as object) : {}),
            }}
          >
            <TextField
              size="small"
              type="number"
              inputMode="numeric"
              variant="standard"
              value={row.activityDay}
              disabled={row.status === 'DEL'}
              onChange={(e) =>
                handleActivityDayChange(
                  row.id,
                  e.target.value,
                )
              }
              slotProps={{
                input: {
                  disableUnderline: true,
                },
                htmlInput: { maxLength: ACTIVITY_DAY_MAX_LENGTH },
              }}
              sx={styles.activityDayField}
            />
          </Box>
          {rowErrors[row.id]?.activityDay ? (
            <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              {rowErrors[row.id]?.activityDay}
            </Typography>
          ) : null}
        </Box>
      ),
    },
    {
      id: 'action',
      label: t('col_action'),
      fieldtype: 'action',
      align: 'center',
      width:
        styles.headerColAction?.width as
        | string
        | undefined,
      renderActions: (row) => (
        <IconButton
          size="small"
          onClick={() => {
            setDeleteRowId(row.id);
            setShowDeleteDialog(true);
          }}
          sx={styles.deleteIconButton}
        >
          <DeleteIcon sx={styles.deleteIcon} />
        </IconButton>
      ),
    },
  ];

  const addAction = (
    <Button
      size="small"
      startIcon={
        <AddIcon sx={styles.addButtonIcon} />
      }
      onClick={handleAddRow}
      variant="text"
      sx={styles.addButton}
    >
      {t('add_btn')}
    </Button>
  );

  return (
    <SectionCard
      title={t('contact_channel_section')}
    >
      <Box>
        <TopTable<ContactChannelRow>
          headerCell={columns}
          rows={rows}
          primaryKey="id"
          orderBy=""
          orderDir=""
          page={0}
          rowsPerPage={rows.length || 1}
          editRowIndex={{}}
          isServerPagination
          hidePagination
          bordered
          headerActions={addAction}
          handleSort={() => { }}
          handleChangePage={() => { }}
          handleChangeRowsPerPage={() => { }}
          onFilterChange={() => { }}
        />
      </Box>
      <ConfirmDialog
        open={showDeleteDialog}
        title={t('common_delete_dialog_title')}
        message={t('common_delete_confirm')}
        onConfirm={confirmDeleteRow}
        onCancel={() => {
          setDeleteRowId(null);
          setShowDeleteDialog(false);
        }}
      />
    </SectionCard>
  );
});

TmtPmContactChannelTable.displayName = 'TmtPmContactChannelTable';

export default TmtPmContactChannelTable;