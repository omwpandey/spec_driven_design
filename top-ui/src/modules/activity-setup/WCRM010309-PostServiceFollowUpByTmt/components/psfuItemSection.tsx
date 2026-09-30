import { useState, useCallback, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
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
} from '@components/common';
import { SectionCard } from '@components/layout';
import { TopTable } from '@components/table';
import type { ICropColumn } from '@components/table';
import { useTranslation } from '@hooks';
import {
  psfuActivityStyles,
  getPsfuCellBorderStyle,
  getPsfuStatusColor,
} from '../psfuActivity.styles';

const styles = psfuActivityStyles.psfuItem;

/** A single PSFU Item configuration row. Status mirrors the DR (ADD/UPD/DEL). */
export interface PsfuItemRow {
  [key: string]: unknown;
  id: number;
  status: 'ADD' | 'UPD' | 'DEL';
  item: string;
  mandatory: boolean;
}

interface RowError {
  item?: string;
}

/** A selectable PSFU Item option. `label` is a resolved string; `labelKey`
 *  is an i18n key used only by the built-in fallback options. */
export interface PsfuItemOption {
  value: string;
  label?: string;
  labelKey?: string;
}

/** Active PSFU Item master data — used as a fallback when the API provides none. */
const DEFAULT_PSFU_ITEM_OPTIONS: PsfuItemOption[] = [
  { value: 'psfu_1', labelKey: 'psfu_item_1' },
  { value: 'psfu_2', labelKey: 'psfu_item_2' },
  { value: 'psfu_3', labelKey: 'psfu_item_3' },
  { value: 'psfu_4', labelKey: 'psfu_item_4' },
  { value: 'psfu_5', labelKey: 'psfu_item_5' },
];

/** Initial saved configuration fallback (mirrors the Figma default row). */
const DEFAULT_INITIAL_ROWS: PsfuItemRow[] = [
  { id: 1, status: 'ADD', item: 'psfu_1', mandatory: false },
];

export interface PsfuItemSectionRef {
  /** Validate every row; shows the error dialog and returns false if invalid. */
  validateAllRows: () => boolean;
  /** Current rows excluding those marked DEL (used by Save). */
  getActiveRows: () => PsfuItemRow[];
  /** Whether the user made any change since the last saved snapshot. */
  hasChanges: () => boolean;
  /** Snapshot the current rows as the new "saved" baseline (after Save). */
  commitSaved: () => void;
}

export interface PsfuItemSectionProps {
  /** PSFU Item dropdown options, loaded from the API. Falls back to defaults. */
  itemOptions?: PsfuItemOption[];
  /** Saved PSFU rows, loaded from the API. Falls back to the default row. */
  initialRows?: PsfuItemRow[];
}

const PsfuItemSection = forwardRef<PsfuItemSectionRef, PsfuItemSectionProps>((props, ref) => {
  const { t } = useTranslation();

  // Prefer API-provided data; fall back to the built-in defaults.
  const psfuItemOptions =
    props.itemOptions && props.itemOptions.length > 0 ? props.itemOptions : DEFAULT_PSFU_ITEM_OPTIONS;
  const seedRows =
    props.initialRows && props.initialRows.length > 0 ? props.initialRows : DEFAULT_INITIAL_ROWS;

  const [rows, setRows] = useState<PsfuItemRow[]>(seedRows);
  // Baseline snapshot to detect unsaved changes (WRN0001 / WRN0004).
  const [savedSnapshot, setSavedSnapshot] = useState<string>(JSON.stringify(seedRows));

  // When API data arrives after mount, re-seed the rows and saved baseline.
  const seedKey = JSON.stringify(seedRows);
  const lastSeedKey = useRef(seedKey);
  useEffect(() => {
    if (lastSeedKey.current === seedKey) return;
    lastSeedKey.current = seedKey;
    setRows(seedRows);
    setSavedSnapshot(seedKey);
    setRowErrors({});
    setTouchedRows({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedKey]);
  const [rowErrors, setRowErrors] = useState<Record<number, RowError>>({});
  const [touchedRows, setTouchedRows] = useState<Record<number, boolean>>({});

  // ----- Add: append a new editable row (Status = ADD) -----
  // Validation is intentionally NOT run here. The DR requires validation to
  // trigger only when the user clicks Save. Adding a row should always work,
  // even if existing rows are still blank.
  const handleAddRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
    setRows((prev) => [...prev, { id: newId, status: 'ADD', item: '', mandatory: false }]);
  };

  // ----- Delete: physically remove ADD rows, mark existing rows DEL -----
  const handleDeleteRow = (id: number) => {
    setRows((prev) =>
      prev
        .map((r) => (r.id === id && r.status !== 'ADD' ? { ...r, status: 'DEL' as const } : r))
        .filter((r) => !(r.id === id && r.status === 'ADD'))
    );
    setRowErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // ----- Item change: validate on change (required + duplicate), and
  // mandatory can only be set after a valid item -----
  const handleItemChange = (id: number, value: string) => {
    const nextRows: PsfuItemRow[] = rows.map((r) =>
      r.id === id
        ? { ...r, item: value, status: r.status === 'ADD' ? ('ADD' as const) : ('UPD' as const) }
        : r
    );
    setRows(nextRows);

    // Validation runs only on Save. As the user fixes a field, clear any
    // existing error marker for that row so stale errors don't linger, but do
    // not compute new errors here.
    setRowErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // ----- Mandatory toggle (enabled only when a valid item is selected) -----
  const handleMandatoryChange = (id: number, checked: boolean) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, mandatory: checked, status: r.status === 'ADD' ? 'ADD' : 'UPD' }
          : r
      )
    );
  };

  // Compute per-row validation errors (required + duplicate) for the given
  // rows. Shared by onChange, Add, and Save so the rules stay consistent.
  const computeRowErrors = useCallback(
    (currentRows: PsfuItemRow[]): Record<number, RowError> => {
      const active = currentRows.filter((r) => r.status !== 'DEL');
      const errors: Record<number, RowError> = {};

      // ERR0001 — Item is required for every configuration row.
      active.forEach((row) => {
        if (!row.item) {
          errors[row.id] = { item: t('psfu_err0001_field_required_inline', { field: t('psfu_col_items') }) };
        }
      });

      // ERR0005 — the same PSFU Item cannot appear in more than one row.
      const seen = new Set<string>();
      active.forEach((row) => {
        if (!row.item) return;
        if (seen.has(row.item)) {
          errors[row.id] = { ...(errors[row.id] || {}), item: t('psfu_err0005_duplicate') };
        }
        seen.add(row.item);
      });

      return errors;
    },
    [t]
  );

  const visibleRows = rows.filter((r) => r.status !== 'DEL');

  const getActiveRows = useCallback(() => rows.filter((r) => r.status !== 'DEL'), [rows]);

  const hasChanges = useCallback(
    () => JSON.stringify(rows) !== savedSnapshot,
    [rows, savedSnapshot]
  );

  const commitSaved = useCallback(() => {
    // Drop DEL rows on save (logical delete) and reset ADD/UPD statuses.
    const persisted = rows
      .filter((r) => r.status !== 'DEL')
      .map((r) => ({ ...r, status: 'UPD' as const }));
    setRows(persisted);
    setSavedSnapshot(JSON.stringify(persisted));
    setRowErrors({});
    setTouchedRows({});
  }, [rows]);

  // ----- Full validation (required + duplicate) used by Add and Save -----
  // Errors are surfaced inline beneath each field; no summary dialog is shown.
  const validateAllRows = useCallback((): boolean => {
    const active = rows.filter((r) => r.status !== 'DEL');
    const errors = computeRowErrors(rows);

    // Mark every active row touched so inline error markers become visible.
    const touched: Record<number, boolean> = {};
    active.forEach((row) => {
      touched[row.id] = true;
    });

    setRowErrors(errors);
    setTouchedRows((prev) => ({ ...prev, ...touched }));

    return Object.keys(errors).length === 0;
  }, [rows, computeRowErrors]);

  useImperativeHandle(ref, () => ({
    validateAllRows,
    getActiveRows,
    hasChanges,
    commitSaved,
  }));

  const mandatoryHeader = (labelKey: string) => () => (
    <>
      {t(labelKey)}
      <span style={styles.mandatoryAsterisk}>*</span>
    </>
  );

  const columns: ICropColumn<PsfuItemRow>[] = [
    {
      id: 'no',
      label: t('psfu_col_no'),
      fieldtype: 'label',
      align: 'left',
      width: styles.headerColNo?.width as string | undefined,
      render: (_v, _row, index) => index + 1,
    },
    {
      id: 'status',
      label: t('psfu_col_status'),
      fieldtype: 'label',
      align: 'left',
      width: styles.headerColStatus?.width as string | undefined,
      render: (_v, row) => (
        <Typography sx={{ ...(styles.statusText as object), color: getPsfuStatusColor(row.status === 'ADD') }}>
          {row.status}
        </Typography>
      ),
    },
    {
      id: 'item',
      label: t('psfu_col_items'),
      fieldtype: 'label',
      align: 'left',
      isRequired: true,
      width: styles.headerColItems?.width as string | undefined,
      headerRender: mandatoryHeader('psfu_col_items'),
      render: (_v, row) => {
        const err = rowErrors[row.id]?.item;
        const showErr = !!touchedRows[row.id] && !!err;
        return (
          <Box sx={styles.fieldCell}>
            <Box sx={{ ...(styles.fieldWrapBase as object), ...(getPsfuCellBorderStyle(showErr) as object) }}>
              <Select
                size="small"
                fullWidth
                variant="standard"
                disableUnderline
                value={row.item}
                onChange={(e) => handleItemChange(row.id, e.target.value)}
                displayEmpty
                error={showErr}
                sx={styles.fieldSelect}
              >
                <MenuItem value="" disabled>
                  <em>{t('psfu_item_placeholder')}</em>
                </MenuItem>
                {psfuItemOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label ?? (opt.labelKey ? t(opt.labelKey) : opt.value)}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            {showErr && (
              <Typography component="span" sx={styles.errorHelperText}>
                {err}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      id: 'mandatory',
      label: t('psfu_col_mandatory'),
      fieldtype: 'label',
      align: 'center',
      width: styles.headerColMandatory?.width as string | undefined,
      render: (_v, row) => (
        <Box sx={styles.mandatoryCell}>
          <Checkbox
            size="small"
            checked={row.mandatory}
            // Mandatory can be maintained only after a valid Item is selected.
            disabled={!row.item}
            onChange={(e) => handleMandatoryChange(row.id, e.target.checked)}
            sx={styles.mandatoryCheckbox}
          />
        </Box>
      ),
    },
    {
      id: 'action',
      label: t('psfu_col_action'),
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

  const addAction = (
    <Button
      size="small"
      startIcon={<AddIcon sx={styles.addButtonIcon} />}
      onClick={handleAddRow}
      variant="text"
      sx={styles.addButton}
    >
      {t('psfu_add_btn')}
    </Button>
  );

  return (
    <SectionCard title={t('psfu_item_section')}>
      <Box>
        <TopTable<PsfuItemRow>
          headerCell={columns}
          rows={visibleRows}
          primaryKey="id"
          orderBy=""
          orderDir=""
          page={0}
          rowsPerPage={visibleRows.length || 1}
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
    </SectionCard>
  );
});

PsfuItemSection.displayName = 'PsfuItemSection';

export default PsfuItemSection;
