import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import {
  Box,
  Button,
  IconButton,
  Select,
  MenuItem,
  Checkbox,
  Typography,
  AddIcon,
  DeleteIcon,
  ErrorBoundary,
  ConfirmDialog,
} from '@components/common';
import { SectionCard } from '@components/layout';
import { TopTable } from '@components/table';
import type { ICropColumn } from '@components/table';
import { useApi, useTranslation } from '@hooks';
import {
  activitySetupStyles,
  getStatusColor,
} from '../index';
import tmtActivityMaintenanceService, {
  type RepairInspectionItem,
  type TmtListResponse,
  type TmtPmOnloadData,
} from '../services/tmtActivityMaintenanceService';
import TmtPmContactChannelTable from './TmtPmContactChannelTable';

import type {
  TmtPmContactChannelTableRef,
  RepairRow,
  RepairCodeOption,
  TmtPmActivitySavePayload,
  TmtPmServiceRepairTableRef,
  TmtPmServiceRepairTableProps,
} from '../tmtActivityPm.type';

const styles = activitySetupStyles.serviceRepair;


/** Map a raw repair/inspection catalogue row to the dropdown option shape. */
const toRepairCodeOption = (
  item: RepairInspectionItem,
): RepairCodeOption => ({
  value: item.repairInspectionCode,
  description: item.description,
});

// No pre-populated rows: users add repair/inspection entries via the + button.

const TmtPmServiceRepairTable = React.forwardRef<
  TmtPmServiceRepairTableRef,
  TmtPmServiceRepairTableProps
>(({ activityId }, ref) => {
  const { t } = useTranslation();
  const contactChannelRef = useRef<TmtPmContactChannelTableRef>(null);

  // Repair/inspection catalogue: loaded from local JSON mocks or the API
  // depending on TOPS_USE_MOCK_DATA (via tmtActivityMaintenanceService).
  const [repairCodeOptions, setRepairCodeOptions] = useState<
    RepairCodeOption[]
  >([]);
  const [rows, setRows] = useState<RepairRow[]>([]);
  // Baseline snapshot to detect unsaved changes (WRN0001).
  const [savedSnapshot, setSavedSnapshot] = useState<string>('[]');
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({});
  const [deleteRowId, setDeleteRowId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const repairInspectionApi = useApi<TmtListResponse<RepairInspectionItem>>({
    context: 'TmtPmServiceRepairTable-RepairInspection',
  });
  const onloadApi = useApi<TmtPmOnloadData>({
    context: 'TmtPmServiceRepairTable-Onload',
  });

  useEffect(() => {
    repairInspectionApi.execute(() =>
      tmtActivityMaintenanceService.getRepairInspectionList(),
    );
    onloadApi.execute(() =>
      tmtActivityMaintenanceService.getOnloadData({
        activityType: 'PM',
        activityId: activityId ?? '',
        dealerId: 'TMT',
        branchId: 'HO',
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId]);

  useEffect(() => {
    if (repairInspectionApi.data) {
      const options =
        repairInspectionApi.data.tableData.map(toRepairCodeOption);
      setRepairCodeOptions(options);
    }
  }, [repairInspectionApi.data]);

  useEffect(() => {
    if (!onloadApi.data?.repairInspectionItems?.length) return;
    if (!repairCodeOptions.length) return;

    const mappedRows = onloadApi.data.repairInspectionItems.map((item, index) => ({
      id: index + 1,
      status: null,
      repairCode: item.repairInspectionCode,
      branchId: item.branchId || 'HO',
      dealerId: item.dealerId || 'TMT',
      description:
        repairCodeOptions.find(
          (opt) => opt.value === item.repairInspectionCode,
        )?.description ?? '',
      mandatory: item.mandatoryFlg === 'Y',
    }));

    setRows(mappedRows);
    setSavedSnapshot(JSON.stringify(mappedRows));
  }, [onloadApi.data, repairCodeOptions]);

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
        repairCode: '',
        description: '',
        mandatory: false,
        branchId: '',
        dealerId: ''
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
      prev.reduce<RepairRow[]>(
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

  const confirmDeleteRow = () => {
    if (deleteRowId === null) {
      return;
    }

    handleDeleteRow(deleteRowId);

    setDeleteRowId(null);
    setShowDeleteDialog(false);
  };

  const handleCodeChange = (
    id: number,
    repairCode: string,
  ) => {
    setRowErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
            ...row,
            repairCode,
            description:
              repairCodeOptions.find(
                (opt) =>
                  opt.value === repairCode,
              )?.description ?? '',
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

  const handleMandatoryToggle = (
    id: number,
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
            ...row,
            mandatory: !row.mandatory,
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

  const validateServiceRepairRows = (): string | null => {
    const payloadRows = rows;
    const activeRows = rows.filter((row) => row.status !== 'DEL');
    const errors: Record<number, string> = {};
    const codes = activeRows.map((row) => row.repairCode.trim()).filter(Boolean);
    const duplicateCodes = new Set(
      codes.filter((code, index) => codes.indexOf(code) !== index),
    );

    activeRows.forEach((row) => {
      if (!row.repairCode.trim()) {
        errors[row.id] = t('validation_required', {
          field: 'Repair Inspection Code',
        });
      } else if (duplicateCodes.has(row.repairCode.trim())) {
        errors[row.id] = t('psfu_err0005_duplicate');
      }
    });

    setRowErrors(errors);
    return Object.values(errors)[0] ?? null;
  };

  const validateAll = (): string | null => {
    const repairError = validateServiceRepairRows();
    const contactChannelError = contactChannelRef.current?.validateContactChannelRows() ?? null;

    return repairError ?? contactChannelError;
  };

  const hasChanges = (): boolean =>
    JSON.stringify(rows) !== savedSnapshot ||
    (contactChannelRef.current?.hasChanges() ?? false);

  const commitSaved = (): void => {
    const persisted = rows
      .filter((row) => row.status !== 'DEL')
      .map((row) => ({ ...row, status: null }));
    setRows(persisted);
    setSavedSnapshot(JSON.stringify(persisted));
    contactChannelRef.current?.commitSaved();
  };

  const reloadOnload = (): void => {
    void onloadApi.execute(() =>
      tmtActivityMaintenanceService.getOnloadData({
        activityType: 'PM',
        activityId: activityId ?? '',
        dealerId: 'TMT',
        branchId: 'HO',
      }),
    );
  };

  const getPayload = (): TmtPmActivitySavePayload | null => {
    const activeRows = rows
    const resolvedActivityId = onloadApi.data?.activityId || activityId || '';
    const resolvedVersion = onloadApi.data?.version || 0;

    if (!activeRows.length && !(contactChannelRef.current?.getPayload().length ?? 0)) {
      return null;
    }

    return {
      activityId: resolvedActivityId,
      dealerId: 'TMT',
      branchId: 'HO',
      activityTypeId: 1,
      activityTypeCode: 'PM',
      activityTypeName: 'Periodic Maintenance',
      version: resolvedVersion,
      contactChannelDetails: contactChannelRef.current?.getPayload() ?? [],
      repairInspectionItems: activeRows.map((row) => ({
        activityId: resolvedActivityId,
        branchId: row.branchId || 'HO',
        dealerId: row.dealerId || 'TMT',
        mandatoryFlg: row.mandatory ? 'Y' : 'N',
        repairInspectionCode: row.repairCode,
        rowStatus: row.status,
        version: resolvedVersion,
      })),
      rowStatus: "UPD",
    };
  };

  useImperativeHandle(ref, () => ({
    validateAll,
    hasChanges,
    commitSaved,
    reloadOnload,
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

  const columns: ICropColumn<RepairRow>[] = [
    {
      id: 'no',
      label: t('col_no'),
      fieldtype: 'label',
      align: 'right',
      render: (_value, _row, index) =>
        index + 1,
    },
    {
      id: 'status',
      label: t('col_status'),
      fieldtype: 'label',
      align: 'left',
      render: (_value, row) => (
        <Typography
          sx={{
            ...(styles.statusText as object),
            color:
              row.status === 'ADD'
                ? '#2E7D32'
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
      id: 'repairCode',
      label: t('col_repair_code'),
      fieldtype: 'label',
      isRequired: true,
      headerRender:
        mandatoryHeader('col_repair_code'),
      render: (_value, row) => (
        <Box sx={{ minHeight: 32 }}>
          <Box
            sx={{
              ...(styles.fieldWrapBase as object),
              border: '1px solid transparent',
              ...(rowErrors[row.id] ? (styles.fieldError as object) : {}),
            }}
          >
            <Select
              size="small"
              fullWidth
              variant="standard"
              disableUnderline
              value={row.repairCode}
              disabled={row.status === 'DEL'}
              onChange={(e) =>
                handleCodeChange(
                  row.id,
                  e.target.value,
                )
              }
              displayEmpty
              sx={styles.fieldSelect}
            >
              <MenuItem value="" disabled>
                <em>Select...</em>
              </MenuItem>

              {repairCodeOptions.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.value}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {rowErrors[row.id] ? (
            <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              {rowErrors[row.id]}
            </Typography>
          ) : null}
        </Box>
      ),
    },
    {
      id: 'description',
      label: t('col_description'),
      fieldtype: 'label',
      isRequired: true,
      headerRender:
        mandatoryHeader('col_description'),
      render: (_value, row) => (
        <Typography
          sx={styles.descriptionText}
        >
          {row.description}
        </Typography>
      ),
    },
    {
      id: 'mandatory',
      label: t('col_mandatory'),
      fieldtype: 'label',
      align: 'center',
      render: (_value, row) => (
        <Checkbox
          size="small"
          checked={row.mandatory}
          disabled={row.status === 'DEL'}
          onChange={() =>
            handleMandatoryToggle(row.id)
          }
        />
      ),
    },
    {
      id: 'action',
      label: t('col_action'),
      fieldtype: 'action',
      align: 'center',
      renderActions: (row) => (
        <IconButton
          size="small"
          onClick={() => {
            setDeleteRowId(row.id);
            setShowDeleteDialog(true);
          }}
          sx={styles.deleteIconButton}
        >
          <DeleteIcon
            sx={styles.deleteIcon}
          />
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
    <>
      <SectionCard
        title={t('service_repair_section')}
      >
        <Box>
          <TopTable<RepairRow>
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
      <ErrorBoundary level="section">
        <TmtPmContactChannelTable
          ref={contactChannelRef}
          activityId={onloadApi.data?.activityId || activityId}
          onloadData={onloadApi.data ?? null}
        />
      </ErrorBoundary>
    </>
  );
});

TmtPmServiceRepairTable.displayName = 'TmtPmServiceRepairTable';

export default TmtPmServiceRepairTable;