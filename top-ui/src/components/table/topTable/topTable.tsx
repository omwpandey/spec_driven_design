/**
 * TopTable
 * ==================================================================
 * A single, self-contained inline-edit data table for the top-ui framework,
 * reproducing the DDMS iCROP table behaviour:
 *
 *   - Sortable + resizable column headers (client or server sort)
 *   - Per-column filter row (text / dropdown / checkbox / date, client or server)
 *   - Inline EDIT / ADD rows with field validation
 *   - Row select + delete, per-row edit/delete/copy/reset actions
 *   - Client or server pagination with a "go to page" box + rows-per-page picker
 *   - Optional summarized footer row
 *   - Permission-aware columns (hide/read-only)
 *
 * Everything the old 15+ files did is folded into this one component, built on
 * `@components/common` primitives, the framework `useTranslation` (from
 * `@hooks`), and the three sibling hooks (useFormValidation, usePermission,
 * useTablePaginationHook).
 */
import * as React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Tooltip,
  Typography,
  Pagination,
  EditIcon,
  DeleteIcon,
  SaveIcon,
  CancelIcon,
  ClearIcon,
  RefreshIcon,
  SwapVertIcon,
} from '@components/common';
import { colors } from '@core/theme';
import { useTranslation } from '@hooks';
import { resolveTemplate, type FieldValidator } from './useFormValidation';
import { usePermission } from './usePermission';

/* ============================================================
 * Column / prop types (DDMS-style headerCell config)
 * ========================================================== */
export type CellFieldType =
  | 'label'
  | 'textbox'
  | 'number'
  | 'dropdown'
  | 'checkbox'
  | 'toggle'
  | 'date'
  | 'action'
  | 'selectAll'
  | 'custom';

export type FilterType = 'textbox' | 'dropdown' | 'checkbox' | 'date' | 'none';

export interface ICropOption {
  label: string;
  value: string | number | boolean;
}

export interface ICropColumn<T = any> {
  id: string;
  label?: string;
  /** Body cell renderer type. */
  fieldtype?: CellFieldType;
  /** Renderer used when the row is in EDIT mode (defaults to fieldtype). */
  editTemplate?: CellFieldType;
  /** Renderer used when the row is in ADD mode (defaults to editTemplate). */
  addTemplate?: CellFieldType;
  /** Filter control for this column. */
  filterType?: FilterType;
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
  width?: number | string;
  headerMinWidth?: number | string;
  headerMaxWidth?: number | string;
  isRequired?: boolean;
  isSortingRequired?: boolean;
  cellType?: 'Number' | 'Date' | 'String';
  hidden?: boolean;
  /** Permission field name; if set, hide/read-only are enforced. */
  permission?: string;
  /** Options for dropdown fields/filters. */
  preloadData?: ICropOption[];
  labelKey?: string;
  valueKey?: string;
  /** Field validators applied in edit/add mode. */
  validations?: FieldValidator[];
  placeholder?: string;
  maxLength?: number;
  /** Fully custom body renderer. */
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  /** Custom header renderer (overrides `label`). */
  headerRender?: () => React.ReactNode;
  /** Custom action renderer (for fieldtype === 'action'). */
  renderActions?: (row: T, index: number) => React.ReactNode;
  disabled?: boolean | ((row: T) => boolean);
}

export interface ICropSummaryField<T = any> {
  label: string;
  marginRight?: string;
  valueKey?: string;
  valueCallback?: (rows: T[]) => React.ReactNode;
}

/** Minimal form API shape the table consumes (from useFormValidation). */
export interface ICropFormApi {
  values: Record<string, any>;
  setValue: (name: string, value: any, resetTouch?: boolean) => void;
  setValues: (v: any) => void;
  register: (field: string, ...validators: FieldValidator[]) => {
    name: string;
    value: any;
    checked: boolean | undefined;
    onChange: (nameOrEvent: any, value?: any) => void;
    onBlur: (e?: any) => void;
    isError: boolean;
    errorMessage: string;
  };
  selectedRows: string[];
  isRowEdit: boolean;
  isRowAdd: boolean;
}

export interface TopTableProps<T = any> {
  /** Visible (already-paginated when server-side) rows. */
  rows: T[];
  /** Full dataset used for client-side filtering (defaults to `rows`). */
  allData?: T[];
  /** Column definitions. */
  headerCell: ICropColumn<T>[];
  /** Unique-row template, e.g. "id" or "{dealerCode}-{branchCode}". */
  primaryKey: string;

  orderBy: string;
  orderDir: 'asc' | 'desc' | '';
  page: number;
  rowsPerPage: number;
  editRowIndex: Record<string, boolean>;

  isFilterApplied?: boolean;
  isClientSort?: boolean;
  isClientFilter?: boolean;
  isServerPagination?: boolean;
  totalCount?: number;

  handleSort: (event: any, property: string, data?: any) => void;
  handleChangePage: (event: any, newPage: number) => void;
  handleChangeRowsPerPage: (data: any) => void;
  onFilterChange: (data: any) => void;

  onRowEdit?: (row: T, index: number) => void;
  onRowDelete?: (row: T, index: number) => void;
  onRowCancel?: (row: T, index: number) => void;
  onRowCopy?: (row: T, index: number) => void;
  onRowReset?: (row: T, index: number) => void;
  onRowSave?: (row: T, index: number) => void;
  onRowClick?: (row: T, index: number, event?: any) => void;
  onBlurChange?: (data: any) => void;

  /** Form API from useFormValidation — required for inline edit/add. */
  formApi?: ICropFormApi;

  hidePagination?: boolean;
  stickyHeader?: boolean;
  maxTableHeight?: number | string;
  minTableHeight?: number | string;
  selectedRowIndex?: number | null;
  showNoData?: boolean;
  emptyMessage?: string;
  summarizedRow?: ICropSummaryField<T>[];
  tableClassName?: string;
  rowClassName?: (row: T, index: number) => string;
  /** Extra content rendered in the pagination bar (e.g. action buttons). */
  paginationChildren?: React.ReactNode;
  /** Content rendered in a bar above the table (e.g. "+ Add" button). */
  headerActions?: React.ReactNode;

  /* ---- Row selection (leading checkbox column) ---- */
  rowSelection?: boolean;
  multiSelection?: boolean;
  /** Controlled set of selected row keys (resolveTemplate(primaryKey,row)). */
  selectedRowKeys?: string[];
  onSelectionChange?: (selected: T[]) => void;
  bordered?: boolean;
}

/* ============================================================
 * Small internal input components (framework-based)
 * ========================================================== */

const cellSx = {
  py: '4px',
  px: '10px',
  fontSize: '0.9rem',
  borderRight: `1px solid ${colors.table.borderAlt}`,
  borderBottom: `1px solid ${colors.table.borderAlt}`,
} as const;

const headerCellSx = {
  ...cellSx,
  backgroundColor: colors.table.headerBgAlt,
  fontWeight: 600,
  whiteSpace: 'nowrap' as const,
  position: 'relative' as const,
  // Top border on the header row.
  borderTop: `1px solid ${colors.table.borderAlt}`,
};

function getAlign(col: ICropColumn): 'left' | 'center' | 'right' {
  if (col.fieldtype === 'action' || col.id === 'action') return 'center';
  return col.align || 'left';
}

/* ============================================================
 * TopTable component
 * ========================================================== */
function TopTable<T extends Record<string, any>>(props: TopTableProps<T>) {
  const {
    rows,
    allData,
    headerCell,
    primaryKey,
    orderBy,
    orderDir,
    page,
    rowsPerPage,
    editRowIndex,
    isFilterApplied = false,
    isClientSort = true,
    isClientFilter = true,
    isServerPagination = false,
    totalCount,
    handleSort,
    handleChangePage,
    handleChangeRowsPerPage,
    onFilterChange,
    onRowEdit,
    onRowDelete,
    onRowCancel,
    onRowCopy,
    onRowReset,
    onRowSave,
    onRowClick,
    formApi,
    hidePagination = false,
    stickyHeader = true,
    maxTableHeight,
    minTableHeight,
    selectedRowIndex = null,
    showNoData = true,
    emptyMessage,
    summarizedRow,
    tableClassName,
    rowClassName,
    paginationChildren,
    headerActions,
    rowSelection = false,
    multiSelection = true,
    selectedRowKeys,
    onSelectionChange,
    bordered = true,
  } = props;

  const { t } = useTranslation();
  const { isHidden, isReadOnly } = usePermission();
  const tableRef = React.useRef<HTMLTableElement>(null);

  /* ---- Row selection state (uncontrolled unless selectedRowKeys given) ---- */
  const [internalSelected, setInternalSelected] = React.useState<string[]>([]);
  const selectedKeys = selectedRowKeys ?? internalSelected;

  const emitSelection = (keys: string[]) => {
    if (!selectedRowKeys) setInternalSelected(keys);
    const selectedRowObjects = rows.filter((r) =>
      keys.includes(resolveTemplate(primaryKey, r))
    );
    onSelectionChange?.(selectedRowObjects);
  };

  const toggleRowSelection = (rowKey: string) => {
    const next = multiSelection
      ? selectedKeys.includes(rowKey)
        ? selectedKeys.filter((k) => k !== rowKey)
        : [...selectedKeys, rowKey]
      : selectedKeys.includes(rowKey)
        ? []
        : [rowKey];
    emitSelection(next);
  };

  const toggleSelectAll = (checked: boolean) => {
    emitSelection(checked ? rows.map((r) => resolveTemplate(primaryKey, r)) : []);
  };

  /* ---- Permission-aware, non-hidden columns ---- */
  const visibleColumns = React.useMemo(
    () =>
      headerCell.filter((col) => {
        if (col.hidden) return false;
        if (col.permission && isHidden(col.permission)) return false;
        return true;
      }),
    [headerCell, isHidden]
  );

  /* ---- Column resize (mimics the DDMS "resizer" handle) ---- */
  const resizeState = React.useRef<{ index: number; startX: number; startW: number } | null>(
    null
  );
  const onResizeMouseDown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const th = tableRef.current?.querySelectorAll('th')[index] as HTMLElement | undefined;
    resizeState.current = { index, startX: e.clientX, startW: th?.offsetWidth || 0 };
    const onMove = (ev: MouseEvent) => {
      if (!resizeState.current) return;
      const dx = ev.clientX - resizeState.current.startX;
      const target = tableRef.current?.querySelectorAll('th')[resizeState.current.index] as
        | HTMLElement
        | undefined;
      if (target) target.style.minWidth = `${resizeState.current.startW + dx}px`;
    };
    const onUp = () => {
      resizeState.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const totCount = totalCount ?? rows.length;

  /* ---- Visible rows (client pagination slices; server passes as-is) ---- */
  const visibleRows = React.useMemo(() => {
    if (isServerPagination) return rows;
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [rows, page, rowsPerPage, isServerPagination]);

  /* ---- Sorting (client-side comparator by cellType) ---- */
  const onHeaderSort = (event: any, columnId: string) => {
    const col = visibleColumns.find((c) => c.id === columnId);
    if (!col || col.isSortingRequired === false) return;

    if (!isClientSort) {
      handleSort(event, columnId);
      return;
    }
    const isAsc = orderBy === columnId && orderDir === 'asc';
    const dir = isAsc ? 'desc' : 'asc';
    const mult = dir === 'asc' ? 1 : -1;
    const data = [...rows].sort((a, b) => {
      const av = a[columnId];
      const bv = b[columnId];
      const aEmpty = av == null || String(av).trim() === '';
      const bEmpty = bv == null || String(bv).trim() === '';
      if (aEmpty && bEmpty) return 0;
      if (aEmpty) return 1; // empties sink to the bottom
      if (bEmpty) return -1;
      if (col.cellType === 'Number') return (Number(av) - Number(bv)) * mult;
      if (col.cellType === 'Date') {
        return (new Date(av).getTime() - new Date(bv).getTime()) * mult;
      }
      return String(av).localeCompare(String(bv), undefined, { numeric: true }) * mult;
    });
    handleSort(event, columnId, data);
  };

  /* ---- Filtering ---- */
  const [filterState, setFilterState] = React.useState<Record<string, any>>({});
  const applyClientFilter = (nextFilters: Record<string, any>) => {
    const source = (allData ?? rows) as T[];
    const active = Object.entries(nextFilters).filter(
      ([, v]) => v !== '' && v !== 'all' && v != null
    );
    if (active.length === 0) {
      onFilterChange(source);
      return;
    }
    const filtered = source.filter((row) =>
      active.every(([id, val]) => {
        const col = visibleColumns.find((c) => c.id === id);
        const cell = row[id];
        if (col?.filterType === 'checkbox') {
          if (val === 'checked') return cell === true;
          if (val === 'unchecked') return !cell;
          return true;
        }
        if (col?.filterType === 'dropdown') {
          return String(cell ?? '') === String(val);
        }
        return String(cell ?? '')
          .toLowerCase()
          .includes(String(val).toLowerCase());
      })
    );
    onFilterChange(filtered);
  };

  const handleFilter = (id: string, value: any) => {
    const next = { ...filterState, [id]: value };
    setFilterState(next);
    if (isClientFilter) applyClientFilter(next);
    else onFilterChange(next);
  };

  /* ============================================================
   * Cell rendering
   * ========================================================== */
  const getRowKey = (row: T) => (row.uniqueId as string) || resolveTemplate(primaryKey, row);

  const isColDisabled = (col: ICropColumn<T>, row: T): boolean => {
    if (col.permission && isReadOnly(col.permission)) return true;
    if (typeof col.disabled === 'function') return col.disabled(row);
    return !!col.disabled;
  };

  const renderEditableCell = (col: ICropColumn<T>, row: T, rowIndex: number) => {
    const rowKey = getRowKey(row);
    const fieldKey = `${col.id}_${rowKey}`;
    const validators = col.validations ?? [];
    const disabled = isColDisabled(col, row);

    // Seed the flat value store on first render of an editable cell.
    if (formApi && !Object.prototype.hasOwnProperty.call(formApi.values, fieldKey)) {
      const initial = row[col.id];
      formApi.values[fieldKey] =
        initial == null && col.cellType !== 'Number' ? '' : initial ?? '';
    }

    const template = col.addTemplate ?? col.editTemplate ?? col.fieldtype ?? 'textbox';

    if (!formApi) return renderReadCell(col, row, rowIndex);

    const field = formApi.register(fieldKey, ...(disabled ? [] : validators));

    switch (template) {
      case 'dropdown': {
        const opts = col.preloadData ?? [];
        return (
          <FormControl fullWidth size="small" error={field.isError} disabled={disabled}>
            <Select
              value={field.value ?? ''}
              onChange={(e) => field.onChange(fieldKey, e.target.value)}
              onBlur={field.onBlur}
              displayEmpty
            >
              <MenuItem value="">
                <em>{col.placeholder || t('common.select')}</em>
              </MenuItem>
              {opts.map((o) => (
                <MenuItem key={String(o.value)} value={o.value as any}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
            {field.isError && <FormHelperText>{field.errorMessage}</FormHelperText>}
          </FormControl>
        );
      }
      case 'checkbox':
      case 'toggle':
        return (
          <Checkbox
            size="small"
            checked={!!field.value}
            disabled={disabled}
            onChange={(e) => field.onChange(fieldKey, e.target.checked)}
          />
        );
      case 'date':
        return (
          <TextField
            type="date"
            size="small"
            fullWidth
            disabled={disabled}
            value={field.value ?? ''}
            onChange={(e) => field.onChange(fieldKey, e.target.value)}
            onBlur={field.onBlur}
            error={field.isError}
            helperText={field.errorMessage}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        );
      case 'number':
      case 'textbox':
      default:
        return (
          <TextField
            size="small"
            fullWidth
            type={col.cellType === 'Number' || template === 'number' ? 'number' : 'text'}
            disabled={disabled}
            placeholder={col.placeholder}
            value={field.value ?? ''}
            onChange={(e) => field.onChange(fieldKey, e.target.value)}
            onBlur={(e) => {
              field.onBlur(e);
              props.onBlurChange?.({ name: col.id, value: (e.target as any).value, row, index: rowIndex });
            }}
            error={field.isError}
            helperText={field.errorMessage}
            slotProps={{ htmlInput: { maxLength: col.maxLength } }}
          />
        );
    }
  };

  const renderReadCell = (col: ICropColumn<T>, row: T, rowIndex: number): React.ReactNode => {
    const value = row[col.id];
    if (col.render) return col.render(value, row, rowIndex);
    switch (col.fieldtype) {
      case 'checkbox':
      case 'toggle':
        return <Checkbox size="small" checked={!!value} disabled />;
      case 'dropdown': {
        const opt = col.preloadData?.find((o) => String(o.value) === String(value));
        return opt?.label ?? String(value ?? '');
      }
      default:
        return String(value ?? '');
    }
  };

  const renderActionCell = (col: ICropColumn<T>, row: T, rowIndex: number) => {
    if (col.renderActions) return col.renderActions(row, rowIndex);
    const rowKey = getRowKey(row);
    const inEdit = !!editRowIndex[rowKey] || !!row.uniqueId;
    return (
      <Box sx={{ display: 'flex', gap: 0.25, justifyContent: 'center' }}>
        {inEdit ? (
          <>
            {onRowSave && (
              <Tooltip title={t('common.save')}>
                <IconButton size="small" color="primary" onClick={() => onRowSave(row, rowIndex)}>
                  <SaveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onRowCancel && (
              <Tooltip title={t('common.cancel')}>
                <IconButton size="small" onClick={() => onRowCancel(row, rowIndex)}>
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onRowReset && (
              <Tooltip title={t('common.reset')}>
                <IconButton size="small" onClick={() => onRowReset(row, rowIndex)}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </>
        ) : (
          <>
            {onRowEdit && (
              <Tooltip title={t('common.edit')}>
                <IconButton size="small" onClick={() => onRowEdit(row, rowIndex)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onRowCopy && (
              <Tooltip title={t('common.copy')}>
                <IconButton size="small" onClick={() => onRowCopy(row, rowIndex)}>
                  <ClearIcon fontSize="small" sx={{ transform: 'rotate(45deg)' }} />
                </IconButton>
              </Tooltip>
            )}
            {onRowDelete && (
              <Tooltip title={t('common.delete')}>
                <IconButton size="small" color="error" onClick={() => onRowDelete(row, rowIndex)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </Box>
    );
  };

  const renderBodyCell = (col: ICropColumn<T>, row: T, rowIndex: number): React.ReactNode => {
    if (col.fieldtype === 'action' || col.id === 'action') {
      return renderActionCell(col, row, rowIndex);
    }
    const rowKey = getRowKey(row);
    const isEditing = !!editRowIndex[rowKey] || !!row.uniqueId;
    if (isEditing && col.fieldtype !== 'label' && col.fieldtype !== 'custom') {
      return renderEditableCell(col, row, rowIndex);
    }
    return renderReadCell(col, row, rowIndex);
  };

  /* ============================================================
   * Render
   * ========================================================== */
  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          border: bordered ? `1px solid ${colors.table.borderAlt}` : 'none',
          borderRadius: '5px',
          overflow: 'hidden',
        }}
      >
        {headerActions && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              px: 1,
              py: 0.5,
              backgroundColor: colors.table.headerBgAlt,
            }}
          >
            {headerActions}
          </Box>
        )}
        <TableContainer
          sx={{
            maxHeight: maxTableHeight ?? undefined,
            minHeight: minTableHeight ?? undefined,
            overflowX: 'auto',
          }}
        >
          <Table
            ref={tableRef}
            stickyHeader={stickyHeader}
            size="small"
            className={tableClassName}
            sx={{ tableLayout: 'auto' }}
          >
            <TableHead>
              {/* Header row */}
              <TableRow>
                {rowSelection && (
                  <TableCell padding="checkbox" sx={{ ...headerCellSx, textAlign: 'center' }}>
                    {multiSelection && (
                      <Checkbox
                        size="small"
                        indeterminate={selectedKeys.length > 0 && selectedKeys.length < rows.length}
                        checked={rows.length > 0 && selectedKeys.length === rows.length}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                      />
                    )}
                  </TableCell>
                )}
                {visibleColumns.map((col, index) => {
                  const align = getAlign(col);
                  const sortable = col.isSortingRequired && col.fieldtype !== 'action';
                  return (
                    <TableCell
                      key={col.id}
                      align={align}
                      sortDirection={orderBy === col.id ? (orderDir || false) : false}
                      sx={{
                        ...headerCellSx,
                        color: col.isRequired ? colors.mandatory : colors.nonMandatory,
                        minWidth: col.headerMinWidth,
                        maxWidth: col.headerMaxWidth,
                        width: col.width,
                        textAlign: col.headerAlign || align,
                      }}
                    >
                      {sortable ? (
                        <TableSortLabel
                          active={orderBy === col.id}
                          direction={orderBy === col.id ? (orderDir || 'asc') : 'asc'}
                          onClick={(e) => onHeaderSort(e, col.id)}
                          // When the column is the active sort, MUI shows its
                          // directional (up/down) arrow. Otherwise show a neutral
                          // two-headed up/down arrow so the column reads as sortable.
                          IconComponent={orderBy === col.id ? undefined : SwapVertIcon}
                          sx={{
                            // Keep the sort indicator visible at all times on
                            // sortable columns (MUI hides the inactive arrow until
                            // hover by default).
                            '& .MuiTableSortLabel-icon': {
                              opacity: orderBy === col.id ? 1 : 0.5,
                            },
                            '&:hover .MuiTableSortLabel-icon': {
                              opacity: orderBy === col.id ? 1 : 0.8,
                            },
                          }}
                        >
                          {col.headerRender ? col.headerRender() : (
                            <>
                              {col.label}
                              {col.isRequired ? ' *' : ''}
                            </>
                          )}
                        </TableSortLabel>
                      ) : (
                        <span>
                          {col.headerRender ? col.headerRender() : (
                            <>
                              {col.label}
                              {col.isRequired ? ' *' : ''}
                            </>
                          )}
                        </span>
                      )}
                      {/* resize handle */}
                      <Box
                        onMouseDown={(e) => onResizeMouseDown(e, index)}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '5px',
                          height: '100%',
                          cursor: 'col-resize',
                          userSelect: 'none',
                        }}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* Filter row */}
              {isFilterApplied && (
                <TableRow sx={{ backgroundColor: colors.neutral[100] }}>
                  {rowSelection && <TableCell padding="checkbox" sx={{ ...cellSx, py: '2px' }} />}
                  {visibleColumns.map((col) => (
                    <TableCell key={`filter-${col.id}`} sx={{ ...cellSx, py: '2px' }}>
                      {renderFilterControl(col, filterState[col.id], handleFilter, t)}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableHead>

            <TableBody>
              {visibleRows.map((row, index) => {
                const rowIndex = isServerPagination ? index : page * rowsPerPage + index;
                const rowKey = getRowKey(row);
                const editing = !!editRowIndex[rowKey] || !!row.uniqueId;
                const custom = rowClassName ? rowClassName(row, rowIndex) : '';
                return (
                  <TableRow
                    key={rowKey || rowIndex}
                    hover
                    selected={selectedRowIndex === rowIndex}
                    className={`${editing ? 'inline-edit ' : ''}${custom}`.trim()}
                    onClick={(e) => onRowClick?.(row, rowIndex, e)}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {rowSelection && (
                      <TableCell padding="checkbox" sx={{ ...cellSx, textAlign: 'center' }}>
                        <Checkbox
                          size="small"
                          checked={selectedKeys.includes(rowKey)}
                          onChange={() => toggleRowSelection(rowKey)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    {visibleColumns.map((col) => (
                      <TableCell
                        key={col.id}
                        align={getAlign(col)}
                        sx={{ ...cellSx, maxWidth: col.width }}
                      >
                        {renderBodyCell(col, row, rowIndex)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}

              {/* Summarized footer row */}
              {summarizedRow && summarizedRow.length > 0 && visibleRows.length > 0 && (
                <TableRow
                  sx={{ position: 'sticky', bottom: 0, background: colors.neutral[100], zIndex: 1 }}
                >
                  <TableCell
                    colSpan={visibleColumns.length + (rowSelection ? 1 : 0)}
                    align="right"
                    sx={{ fontWeight: 'bold', background: colors.neutral[100] }}
                  >
                    {summarizedRow.map((f, i) => (
                      <Box
                        component="span"
                        key={f.valueKey || i}
                        sx={{ marginRight: f.marginRight || '1.5em' }}
                      >
                        {f.label}: {f.valueCallback ? f.valueCallback(rows) : ''}
                      </Box>
                    ))}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {showNoData && visibleRows.length === 0 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {emptyMessage || t('errorMessage.no_data_found')}
              </Typography>
            </Box>
          )}
        </TableContainer>

        {!hidePagination && totCount > 0 && (
          <TablePaginationBar
            page={page}
            rowsPerPage={rowsPerPage}
            rowsLength={totCount}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          >
            {paginationChildren}
          </TablePaginationBar>
        )}
      </Paper>
    </Box>
  );
}

/* ============================================================
 * Filter control (was TableFilters.tsx)
 * ========================================================== */
function renderFilterControl(
  col: ICropColumn,
  value: any,
  onChange: (id: string, value: any) => void,
  t: (k: string) => string
): React.ReactNode {
  switch (col.filterType) {
    case 'dropdown':
      return (
        <FormControl fullWidth size="small">
          <Select
            value={value ?? ''}
            displayEmpty
            onChange={(e) => onChange(col.id, e.target.value)}
          >
            <MenuItem value="">{t('common.all')}</MenuItem>
            {(col.preloadData ?? []).map((o) => (
              <MenuItem key={String(o.value)} value={o.value as any}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    case 'checkbox':
      return (
        <FormControl fullWidth size="small">
          <Select
            value={value ?? 'all'}
            onChange={(e) => onChange(col.id, e.target.value)}
          >
            <MenuItem value="all">{t('common.all')}</MenuItem>
            <MenuItem value="checked">{t('common.checked')}</MenuItem>
            <MenuItem value="unchecked">{t('common.unchecked')}</MenuItem>
          </Select>
        </FormControl>
      );
    case 'date':
      return (
        <TextField
          type="date"
          size="small"
          fullWidth
          value={value ?? ''}
          onChange={(e) => onChange(col.id, e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      );
    case 'textbox':
      return (
        <TextField
          size="small"
          fullWidth
          placeholder={t('common.search')}
          value={value ?? ''}
          onChange={(e) => onChange(col.id, e.target.value)}
        />
      );
    default:
      return <span>&nbsp;</span>;
  }
}

/* ============================================================
 * Pagination bar (was TblPagination.tsx)
 * ========================================================== */
interface PaginationBarProps {
  page: number;
  rowsPerPage: number;
  rowsLength: number;
  onChangePage: (event: any, newPage: number) => void;
  onChangeRowsPerPage: (data: any) => void;
  children?: React.ReactNode;
}

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

function TablePaginationBar(props: PaginationBarProps) {
  const { t } = useTranslation();
  const [goto, setGoto] = React.useState('');
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalPages = Math.max(1, Math.ceil(props.rowsLength / props.rowsPerPage));

  React.useEffect(() => {
    setGoto('');
  }, [props.page]);

  const from = props.page * props.rowsPerPage + 1;
  const to = Math.min((props.page + 1) * props.rowsPerPage, props.rowsLength);

  const handleGoto = (raw: string) => {
    setGoto(raw);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const n = Number.parseInt(raw, 10);
      if (raw !== '' && n > 0 && n <= totalPages) {
        props.onChangePage(null, n - 1);
      }
    }, 600);
  };

  const gotoError = goto !== '' && Number.parseInt(goto, 10) > totalPages;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
        m: '4px 12px',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {t('pagination.showing')} {from} {t('pagination.to')} {to} {t('pagination.out_of')}{' '}
        {props.rowsLength}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        {props.children}

        <TextField
          size="small"
          placeholder={t('pagination.goto')}
          value={goto}
          onChange={(e) => handleGoto(e.target.value.replaceAll(/[^0-9]/g, ''))}
          error={gotoError}
          helperText={gotoError ? t('pagination.invalid_page') : ''}
          sx={{ width: '6em' }}
        />

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={props.rowsPerPage}
            onChange={(e) => props.onChangeRowsPerPage({ target: { value: e.target.value } })}
          >
            {ROWS_PER_PAGE_OPTIONS.map((n) => (
              <MenuItem key={n} value={n}>
                {n} {t('pagination.rows')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Pagination
          count={totalPages}
          page={props.page + 1}
          onChange={(_e, p) => props.onChangePage(_e, p - 1)}
          showFirstButton
          showLastButton
          siblingCount={1}
          size="small"
          sx={{
            '& .Mui-selected': {
              backgroundColor: `${colors.primary.main} !important`,
              color: colors.primary.contrastText,
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default TopTable;
export { TopTable };
