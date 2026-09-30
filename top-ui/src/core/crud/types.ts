export type FieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiSelect'
  | 'date'
  | 'dateRange'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'textarea'
  | 'password'
  | 'currency'
  | 'file'
  | 'image';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: { value: string | number; label: string }[];
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number };
  validation?: {
    required?: string;
    min?: { value: number; message: string };
    max?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
  };
  visibleInTable?: boolean;
  visibleInForm?: boolean;
  visibleInFilter?: boolean;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: unknown, row: unknown) => React.ReactNode;
}

export interface CrudConfig {
  resource: string;
  endpoint: string;
  title: string;
  fields: FieldConfig[];
  permissions?: {
    create?: string;
    read?: string;
    update?: string;
    delete?: string;
  };
  features?: {
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
    export?: boolean;
    import?: boolean;
    search?: boolean;
    filter?: boolean;
    pagination?: boolean;
  };
  defaultSort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  pageSize?: number;
}
