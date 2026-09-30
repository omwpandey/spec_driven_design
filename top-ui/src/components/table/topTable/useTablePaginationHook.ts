/**
 * useTablePaginationAndSort (iCROP table)
 * ------------------------------------------------------------------
 * Owns the table's pagination, sorting and inline add/edit/cancel state.
 *
 * Self-contained: the old version reached into a DirtyFlag context and the
 * FormValidation context. Here the dirty flag is a local boolean (exposed so
 * the host page can react to it), and form resetting is delegated through the
 * `formApi` returned by useFormValidation, which the caller passes in.
 */
import { useCallback, useState } from 'react';
import {
  denormalizeJson,
  isEqualByKeys,
  resolveTemplate,
  type UseFormValidationReturn,
} from './useFormValidation';

/** Minimal slice of the form API this hook needs. */
type FormApi = Pick<
  UseFormValidationReturn<Record<string, any>>,
  'resetForm' | 'values' | 'setValues' | 'setBulkEditValue' | 'isBulkEdit' | 'isRowDelete'
>;

let uid = 0;
const genUniqueId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `row-${Date.now()}-${uid++}`;

export interface UseTablePaginationOptions {
  initialRowsPerPage?: number;
  multiPageEdit?: boolean;
  /** The form API from useFormValidation (optional; enables dirty detection). */
  formApi?: FormApi;
}

export function useTablePaginationAndSort<T extends Record<string, any> = any>(
  options: UseTablePaginationOptions = {}
) {
  const { initialRowsPerPage = 10, multiPageEdit = false, formApi } = options;
  type RowWithId = T & { uniqueId?: string };

  const [orderBy, setOrderBy] = useState('');
  const [orderDir, setOrderDir] = useState<'asc' | 'desc' | ''>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [rows, setRows] = useState<RowWithId[]>([]);
  const [editRowIndex, setEditRowIndex] = useState<Record<string, boolean>>({});
  const [currentAction, setCurrentAction] = useState<'ADD' | 'EDIT' | ''>('');
  const [primaryKey, setPrimaryKey] = useState('');
  const [bulkEdit, setBulkEdit] = useState(false);
  const [dirty, setDirtyState] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [pageData, setPageData] = useState<any>({});
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const values = formApi?.values ?? {};
  const isRowDelete = formApi?.isRowDelete ?? false;
  const isBulkEdit = formApi?.isBulkEdit ?? false;

  const resetForm = useCallback(
    (immediate?: boolean) => formApi?.resetForm(immediate),
    [formApi]
  );

  const setDirty = useCallback((v: boolean) => setDirtyState(v), []);

  /* ---------------- Row add / edit / cancel ---------------- */
  const addRow = useCallback(
    (newRecord: T, reverse = false) => {
      const newRow: RowWithId = { uniqueId: genUniqueId(), ...newRecord };
      setRows((prev) => (reverse ? [...prev, newRow] : [newRow, ...prev]));
      setEditRowIndex((prev) => ({ ...prev, [newRow.uniqueId as string]: true }));
      setCurrentAction('ADD');
      setDirty(true);
    },
    [setDirty]
  );

  const editRow = useCallback(
    (pk: string, updatedData: Partial<T>) => {
      setEditRowIndex((prev) => ({
        ...prev,
        [resolveTemplate(pk, updatedData as Record<string, any>)]: true,
      }));
      setCurrentAction('EDIT');
      setPrimaryKey(pk);
      setDirty(true);
    },
    [setDirty]
  );

  const editRows = useCallback(
    (pk: string, updatedRows: Partial<T>[]) => {
      const next: Record<string, boolean> = {};
      updatedRows.forEach((r) => {
        next[resolveTemplate(pk, r as Record<string, any>)] = true;
      });
      setEditRowIndex(next);
      setCurrentAction('EDIT');
      setPrimaryKey(pk);
      setBulkEdit(true);
      formApi?.setBulkEditValue(true);
      setDirty(true);
    },
    [formApi, setDirty]
  );

  const cancelRow = useCallback(
    (pk: string, data: RowWithId, index: number) => {
      const key = data.uniqueId || resolveTemplate(pk, data as Record<string, any>);
      setEditRowIndex((prev) => {
        const next = { ...prev };
        delete next[key];
        if (Object.keys(next).length === 0) resetForm(true);
        return next;
      });
      if (data.uniqueId) {
        setRows((prev) => prev.filter((_, i) => i !== index));
      }
      setCurrentAction('');
      setDirty(false);
      setPrimaryKey(pk);
    },
    [resetForm, setDirty]
  );

  const cancelAll = useCallback(
    (initialValue?: T[]) => {
      if (initialValue) {
        setRows(initialValue.map((row) => ({ uniqueId: undefined, ...row })));
        resetForm(true);
      } else {
        resetForm();
      }
      setEditRowIndex({});
      setCurrentAction('');
      setOrderBy('');
      setOrderDir('');
      setBulkEdit(false);
      setDirty(false);
    },
    [resetForm, setDirty]
  );

  const resetTable = useCallback(
    (initialValue?: T[]) => {
      if (initialValue) {
        setRows(initialValue.map((row) => ({ uniqueId: undefined, ...row })));
        resetForm(true);
      } else {
        resetForm();
      }
      setEditRowIndex({});
      setCurrentAction('');
      setOrderBy('');
      setOrderDir('');
      setPage(0);
      setDirty(false);
    },
    [resetForm, setDirty]
  );

  /* ---------------- Change detection ---------------- */
  const isRowChanges = useCallback(() => {
    if (bulkEdit) {
      if (!primaryKey) return false;
      const { result, actionType } = denormalizeJson(values, primaryKey);
      if (actionType === 'ADD') return Object.keys(result).length > 0;
      return (
        Object.entries(result).filter(([key, value]: [string, any]) => {
          const original = rows[Number.parseInt(key, 10)];
          return !isEqualByKeys(original, value, Object.keys(value));
        }).length > 0
      );
    }
    return Object.keys(editRowIndex).length > 0;
  }, [bulkEdit, primaryKey, values, rows, editRowIndex]);

  /* ---------------- Pagination / sort handlers ---------------- */
  const handleChangePage = useCallback(
    (_event: any, newPage: number) => {
      if (!isRowChanges() && !isRowDelete) {
        setEditRowIndex({});
        setPage(newPage);
      } else {
        if (multiPageEdit) setPage(newPage);
        setOpenConfirmPopup(true);
        setPageData((prev: any) => ({ ...prev, rows, page: newPage }));
      }
    },
    [isRowChanges, isRowDelete, multiPageEdit, rows]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: any) => {
      const next = Number.parseInt(event.target.value, 10);
      if (!isRowChanges() && !isRowDelete) {
        setRowsPerPage(next);
        setPage(0);
      } else {
        if (multiPageEdit) {
          setRowsPerPage(next);
          setPage(0);
        }
        setOpenConfirmPopup(true);
        setPageData((prev: any) => ({ ...prev, rowsPerPage: next, page: 0 }));
      }
    },
    [isRowChanges, isRowDelete, multiPageEdit]
  );

  const handleSort = useCallback(
    (_event: any, property: string, data?: any) => {
      const isAsc = orderBy === property && orderDir === 'asc';
      const nextDir: 'asc' | 'desc' = isAsc ? 'desc' : 'asc';
      if (isRowChanges() || isRowDelete) {
        setOpenConfirmPopup(true);
        setPageData({ orderBy: property, orderDir: nextDir, rowData: data });
      } else {
        setOrderDir(nextDir);
        setOrderBy(property);
        if (data) setRows([...data]);
      }
    },
    [orderBy, orderDir, isRowChanges, isRowDelete]
  );

  const handlePageChangeEvent = useCallback(
    (value?: string) => {
      setOpenConfirmPopup(false);
      if (value === 'Ok') {
        if (pageData.orderDir) setOrderDir(pageData.orderDir);
        if (pageData.orderBy) setOrderBy(pageData.orderBy);
        if (pageData.rowData) setRows(pageData.rowData);
        if (pageData.rowsPerPage) setRowsPerPage(pageData.rowsPerPage);
        if (typeof pageData.page === 'number') setPage(pageData.page);
        resetForm();
        setEditRowIndex({});
        setCurrentAction('');
        setDirty(false);
      } else {
        setPageData({});
      }
    },
    [pageData, resetForm, setDirty]
  );

  const clearSortingValue = useCallback(() => {
    setOrderBy('');
    setOrderDir('asc');
  }, []);

  const onFilterChange = useCallback(
    (data: any) => {
      setPage(0);
      clearSortingValue();
      setRows(JSON.parse(JSON.stringify(data)));
      if (isBulkEdit) {
        formApi?.setValues({});
        editRows(primaryKey, data);
      }
    },
    [clearSortingValue, isBulkEdit, formApi, editRows, primaryKey]
  );

  return {
    // state
    orderBy,
    orderDir,
    page,
    rowsPerPage,
    rows,
    editRowIndex,
    currentAction,
    dirty,
    openConfirmPopup,
    isDeleteOpen,
    // setters
    setPage,
    setRowsPerPage,
    setRows,
    setEditRowIndex,
    setOpenConfirmPopup,
    setIsDeleteOpen,
    // actions
    addRow,
    editRow,
    editRows,
    cancelRow,
    cancelAll,
    resetTable,
    onFilterChange,
    isRowChanges,
    // pagination / sort handlers
    handleChangePage,
    handleChangeRowsPerPage,
    handleSort,
    handlePageChangeEvent,
  };
}

export default useTablePaginationAndSort;
