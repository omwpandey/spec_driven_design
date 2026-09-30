/**
 * useFormValidation
 * ------------------------------------------------------------------
 * Self-contained form-state + validation manager for the iCROP table.
 *
 * This single hook replaces the old multi-file setup
 * (useFormValidation + FormValidationcontext + parts of sharedFunctions/util).
 *
 * The table stores every editable cell in a FLAT, normalized map keyed by
 * `${field}_${rowKey}` (e.g. "name_42", "isActive_42"). From that flat map we
 * can derive whether the table is currently adding, editing or deleting rows,
 * and we can de-normalize the values back into row objects on save.
 *
 * It intentionally has NO external project dependencies except the framework
 * translation hook, so the whole table folder is just 4 files.
 */
import { useCallback, useMemo, useRef, useState } from 'react';

/* ============================================================
 * Shared helpers (previously sharedFunctions/util)
 * ========================================================== */

/**
 * Resolve a template string against a data object.
 * Supports plain field names ("id"), dotted paths ("a.b") and
 * mustache-style templates ("{dealerCode}-{branchCode}").
 */
export function resolveTemplate(template: string, data: Record<string, any> = {}): string {
  if (!template) return '';

  if (!template.includes('{')) {
    const val = getByPath(data, template);
    return val === undefined || val === null ? '' : String(val);
  }

  let result = '';
  let cursor = 0;

  while (cursor < template.length) {
    const startIndex = template.indexOf('{', cursor);
    if (startIndex === -1) {
      result += template.slice(cursor);
      break;
    }

    result += template.slice(cursor, startIndex);
    const endIndex = template.indexOf('}', startIndex + 1);
    if (endIndex === -1) {
      result += template.slice(startIndex);
      break;
    }

    const token = template.slice(startIndex + 1, endIndex).trim();
    const val = getByPath(data, token);
    if (val !== undefined && val !== null) {
      result += String(val);
    }

    cursor = endIndex + 1;
  }

  return result;
}

function getByPath(obj: Record<string, any>, path: string): any {
  if (!obj) return undefined;
  if (Object.prototype.hasOwnProperty.call(obj, path)) return obj[path];
  return path.split('.').reduce<any>((acc, k) => (acc == null ? acc : acc[k]), obj);
}

/** RFC4122-ish GUID check used to tell "added" rows apart from persisted ones. */
export function isValidGUID(value?: string | null): boolean {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value)
  );
}

/** Compare two objects on a given subset of keys. */
export function isEqualByKeys(a: any, b: any, keys: string[]): boolean {
  if (!a || !b) return a === b;
  return keys.every((k) => String(a?.[k] ?? '') === String(b?.[k] ?? ''));
}

/**
 * Turn the flat `${field}_${rowKey}` value map back into an array of row
 * objects (grouped by rowKey). Also reports the action type.
 */
export function denormalizeJson(
  values: Record<string, any>,
  primaryKey: string
): { result: Record<string, any>; actionType: 'ADD' | 'EDIT' | '' } {
  const result: Record<string, any> = {};
  let actionType: 'ADD' | 'EDIT' | '' = '';

  Object.keys(values).forEach((flatKey) => {
    // index_<rowKey> markers tell us which rows are in edit/add mode
    if (flatKey.startsWith('index_')) {
      const rowKey = flatKey.slice('index_'.length);
      result[rowKey] = result[rowKey] || {};
      if (isValidGUID(rowKey)) actionType = 'ADD';
      else if (actionType !== 'ADD') actionType = 'EDIT';
      return;
    }
    if (flatKey.startsWith('selectAll')) return;

    const underscore = flatKey.lastIndexOf('_');
    if (underscore <= 0) return;
    const field = flatKey.slice(0, underscore);
    const rowKey = flatKey.slice(underscore + 1);
    result[rowKey] = result[rowKey] || {};
    result[rowKey][field] = values[flatKey];
    if (primaryKey) result[rowKey][primaryKey] = result[rowKey][primaryKey] ?? rowKey;
  });

  return { result, actionType };
}

/* ============================================================
 * Field validators
 * ========================================================== */
export interface FieldError {
  message: string;
  param?: Record<string, string | number>;
}

export type FieldValidator = (
  value: any,
  values?: Record<string, any>
) => FieldError | string | undefined;

/** Common ready-made validators (i18n keys, resolved by the caller's `t`). */
export const validators = {
  required:
    (message = 'errorMessage.required'): FieldValidator =>
    (value) =>
      value === undefined || value === null || String(value).trim() === ''
        ? message
        : undefined,
  maxLength:
    (max: number, message = 'errorMessage.max_length'): FieldValidator =>
    (value) =>
      value != null && String(value).length > max
        ? { message, param: { max } }
        : undefined,
  minLength:
    (min: number, message = 'errorMessage.min_length'): FieldValidator =>
    (value) =>
      value != null && String(value).length < min
        ? { message, param: { min } }
        : undefined,
  pattern:
    (re: RegExp, message = 'errorMessage.invalid_format'): FieldValidator =>
    (value) =>
      value && !re.test(String(value)) ? message : undefined,
  number:
    (message = 'errorMessage.invalid_number'): FieldValidator =>
    (value) =>
      value !== '' && value != null && Number.isNaN(Number(value)) ? message : undefined,
};

/* ============================================================
 * useFormValidation hook
 * ========================================================== */

export interface UseFormValidationReturn<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<string, FieldError | string | undefined>>;
  touched: Partial<Record<string, boolean>>;
  isBulkEdit: boolean;
  /** Set/replace the whole value map. */
  setValues: (v: T | ((prev: T) => T)) => void;
  /** Set a single value (optionally clearing its touched/error state). */
  setValue: (name: string, value: any, resetTouch?: boolean) => void;
  setErrors: (e: Partial<Record<string, FieldError | string | undefined>>) => void;
  setTouched: (t: Partial<Record<string, boolean>>) => void;
  handleChange: (name: string, value: any) => void;
  /** Bind an input: returns { name, value, onChange, onBlur, isError, errorMessage }. */
  register: (field: string, ...fieldValidators: FieldValidator[]) => {
    name: string;
    value: any;
    checked: boolean | undefined;
    onChange: (nameOrEvent: any, value?: any) => void;
    onBlur: (e?: any) => void;
    isError: boolean;
    errorMessage: string;
  };
  /** Validate; returns null when valid, else a map of translated messages. */
  validateForm: (forceAll?: boolean, scroll?: boolean) => Record<string, string> | null;
  resetForm: (immediate?: boolean) => void;
  isValid: boolean;
  setIsBulkEdit: (v: boolean) => void;
  unRegisterByPartialName: (partial: string, persistValue?: boolean) => void;
  /* Derived table-state helpers (previously FormValidationcontext) */
  selectedRows: string[];
  isRowAdd: boolean;
  isRowEdit: boolean;
  isRowDelete: boolean;
  setBulkEditValue: (all: boolean) => void;
  getUpdatedCollection: (primaryKey: string) => {
    result: Record<string, any>;
    actionType: 'ADD' | 'EDIT' | '';
  };
  setDefaultValue: (rows: any[], primaryKey: string) => void;
}

/**
 * @param initialValues initial flat value map
 * @param translate     the framework `t` function (from `@hooks` useTranslation)
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T = {} as T,
  translate: (key: string, params?: Record<string, string | number>) => string = (k) => k
): UseFormValidationReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<string, FieldError | string | undefined>>
  >({});
  const [touched, setTouchedState] = useState<Partial<Record<string, boolean>>>({});
  const [isBulkEdit, setIsBulkEdit] = useState(false);
  const validatorsRef = useRef<Record<string, FieldValidator[] | undefined>>({});
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setValues = useCallback((v: T | ((prev: T) => T)) => {
    setValuesState((prev) => (typeof v === 'function' ? (v as any)(prev) : v));
  }, []);

  const setTouched = useCallback((patch: Partial<Record<string, boolean>>) => {
    setTouchedState((prev) => ({ ...prev, ...patch }));
  }, []);

  const runValidators = useCallback(
    (list: FieldValidator[] | undefined, value: any, vals: T): FieldError | string | undefined => {
      if (!list) return undefined;
      for (const fn of list) {
        const err = fn(value, vals);
        if (err) return err;
      }
      return undefined;
    },
    []
  );

  const handleChange = useCallback((name: string, value: any) => {
    setValuesState((prev) => ({ ...prev, [name]: value }));
    setTouchedState((prev) => ({ ...prev, [name]: true }));
  }, []);

  const setValue = useCallback((name: string, value: any, resetTouch?: boolean) => {
    setValuesState((prev) => ({ ...prev, [name]: value }));
    if (resetTouch) {
      setTouchedState((prev) => ({ ...prev, [name]: false }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }, []);

  const errorToMessage = useCallback(
    (err: FieldError | string | undefined): string => {
      if (!err) return '';
      if (typeof err === 'string') return translate(err);
      return translate(err.message, err.param);
    },
    [translate]
  );

  const register = useCallback(
    (field: string, ...fieldValidators: FieldValidator[]) => {
      const list = fieldValidators.length ? fieldValidators : undefined;
      validatorsRef.current[field] = list;
      const currentValue = values[field] ?? '';
      return {
        name: field,
        value: currentValue,
        checked: typeof values[field] === 'boolean' ? (values[field] as boolean) : undefined,
        onChange: (nameOrEvent: any, value?: any) => {
          // Support both (name, value) and (event) and (value) signatures.
          if (nameOrEvent && typeof nameOrEvent === 'object' && 'target' in nameOrEvent) {
            const target = nameOrEvent.target;
            const v = target.type === 'checkbox' ? target.checked : target.value;
            handleChange(field, v);
            return;
          }
          if (value === undefined && typeof nameOrEvent !== 'string') {
            handleChange(field, nameOrEvent);
            return;
          }
          if (typeof nameOrEvent === 'string' && value === undefined) {
            handleChange(field, nameOrEvent);
            return;
          }
          handleChange(String(nameOrEvent ?? field), value);
        },
        onBlur: (e?: any) => {
          const name = e?.target?.name ?? field;
          setTouchedState((prev) => ({ ...prev, [name]: true }));
          if (list) {
            setErrors((prev) => ({
              ...prev,
              [name]: runValidators(list, values[field], values),
            }));
          }
        },
        isError: !!errors[field] && !!touched[field],
        errorMessage: touched[field] ? errorToMessage(errors[field]) : '',
      };
    },
    [values, errors, touched, handleChange, runValidators, errorToMessage]
  );

  const validateForm = useCallback(
    (forceAll = true, scroll = false): Record<string, string> | null => {
      const nextErrors: Partial<Record<string, FieldError | string>> = {};
      const nextTouched: Partial<Record<string, boolean>> = {};
      const translated: Record<string, string> = {};

      Object.keys(validatorsRef.current).forEach((field) => {
        if (!forceAll && !touched[field]) return;
        const err = runValidators(validatorsRef.current[field], values[field], values);
        if (err) {
          nextErrors[field] = err;
          nextTouched[field] = true;
          translated[field] = errorToMessage(err);
        }
      });

      setTouchedState((prev) => ({ ...prev, ...nextTouched }));
      setErrors(nextErrors);

      if (scroll && Object.keys(nextErrors).length) {
        const first = document.getElementsByName(Object.keys(nextErrors)[0]);
        first?.[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return Object.keys(translated).length ? translated : null;
    },
    [values, touched, runValidators, errorToMessage]
  );

  const resetForm = useCallback(
    (immediate = false) => {
      const doReset = () => {
        setValuesState({ ...initialValues });
        setErrors({});
        setTouchedState({});
        validatorsRef.current = {};
      };
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      if (immediate) doReset();
      else resetTimeoutRef.current = setTimeout(doReset, 300);
    },
    [initialValues]
  );

  const unRegisterByPartialName = useCallback((partial: string, persistValue = false) => {
    const strip = <U,>(obj: Record<string, U>) => {
      const next = { ...obj };
      Object.keys(next).forEach((k) => {
        if (k.includes(partial)) delete next[k];
      });
      return next;
    };
    validatorsRef.current = strip(validatorsRef.current);
    setTouchedState((prev) => strip(prev));
    setErrors((prev) => strip(prev));
    if (!persistValue) setValuesState((prev) => strip(prev) as T);
  }, []);

  /* ---- Derived table state (was FormValidationcontext) ---- */
  const valuesSignature = Object.keys(values).join('|');

  const selectedRows = useMemo(
    () =>
      Object.keys(values).filter((k) => k.startsWith('selectAll') && values[k]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valuesSignature]
  );

  const isRowAdd = useMemo(
    () =>
      Object.keys(values).some(
        (k) => k.startsWith('index_') && isValidGUID(k.slice('index_'.length))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valuesSignature]
  );

  const isRowEdit = useMemo(
    () => !isRowAdd && Object.keys(values).some((k) => k.startsWith('index_')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valuesSignature, isRowAdd]
  );

  const isRowDelete = selectedRows.length > 0;

  const setBulkEditValue = useCallback((all: boolean) => setIsBulkEdit(all), []);

  const getUpdatedCollection = useCallback(
    (primaryKey: string) => denormalizeJson(values, primaryKey),
    [values]
  );

  const setDefaultValue = useCallback((rows: any[], primaryKey: string) => {
    const result: Record<string, any> = {};
    rows.forEach((row) => {
      const rowKey = resolveTemplate(primaryKey, row);
      Object.keys(row).forEach((field) => {
        result[`${field}_${rowKey}`] = row[field];
      });
    });
    setValuesState((prev) => ({ ...prev, ...result }));
  }, []);

  const isValid = Object.values(errors).filter((e) => e !== undefined).length === 0;

  return {
    values,
    errors,
    touched,
    isBulkEdit,
    setValues,
    setValue,
    setErrors,
    setTouched,
    handleChange,
    register,
    validateForm,
    resetForm,
    isValid,
    setIsBulkEdit,
    unRegisterByPartialName,
    selectedRows,
    isRowAdd,
    isRowEdit,
    isRowDelete,
    setBulkEditValue,
    getUpdatedCollection,
    setDefaultValue,
  };
}

export default useFormValidation;
