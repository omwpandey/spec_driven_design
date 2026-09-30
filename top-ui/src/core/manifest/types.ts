/**
 * Module Manifest Schema
 * 
 * Single source of truth for route, sidebar, permissions, and page metadata.
 * Every module must declare a manifest. The router, sidebar, breadcrumbs,
 * and permission guards are all generated from this manifest.
 */

export interface ModuleManifest {
  /** Unique module identifier */
  id: string;
  /** Route path (without leading slash) */
  path: string;
  /** Translation key for the module title */
  labelKey: string;
  /** MUI icon component name */
  icon: string;
  /** Permission required to view this module */
  permission?: string;
  /** Whether this module appears in the sidebar */
  showInSidebar?: boolean;
  /** Child routes / sub-navigation */
  children?: ModuleRoute[];
  /** CRUD config reference (if this is a CRUD screen) */
  crudConfig?: string;
}

export interface ModuleRoute {
  /** Unique route identifier */
  id: string;
  /** Route path segment (appended to parent path) */
  path: string;
  /** Translation key for the route title */
  labelKey: string;
  /** Permission required */
  permission?: string;
  /** Whether this route appears in the sidebar submenu */
  showInSidebar?: boolean;
  /** Lazy import path for the page component */
  component: string;
}

export interface RouteConfig {
  path: string;
  component: string;
  permission?: string;
  breadcrumbs: { labelKey: string; path?: string }[];
}

/**
 * Screen Manifest Schema
 * 
 * Defines a complete screen layout: metadata, sections, fields, table columns,
 * API endpoints, validators, and conditional visibility rules.
 */
export interface ScreenManifest {
  /** Screen identifier */
  id: string;
  /** Module this screen belongs to */
  module: string;
  /** Route path */
  route: string;
  /** Title translation key */
  titleKey: string;
  /** Breadcrumb trail */
  breadcrumbs: { labelKey: string; path?: string }[];
  /** Required permissions */
  permissions: ScreenPermissions;
  /** Page layout sections */
  sections: ScreenSection[];
  /** API configuration */
  api: ScreenApi;
  /** Footer action buttons */
  actions?: ScreenAction[];
}

export interface ScreenPermissions {
  view: string;
  create?: string;
  edit?: string;
  delete?: string;
}

export interface ScreenSection {
  /** Section identifier */
  id: string;
  /** Title translation key */
  titleKey: string;
  /** Section type */
  type: 'form' | 'table' | 'summary' | 'custom';
  /** Whether the section is collapsible */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Fields in this section (for form type) */
  fields?: ScreenField[];
  /** Table configuration (for table type) */
  table?: ScreenTableConfig;
  /** Conditional visibility */
  visibleWhen?: VisibilityCondition;
}

export interface ScreenField {
  /** Field name (maps to form state) */
  name: string;
  /** Label translation key */
  labelKey: string;
  /** Field type - maps to field renderer registry */
  type: FieldRendererType;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is read-only */
  readOnly?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Placeholder text translation key */
  placeholderKey?: string;
  /** Grid layout */
  grid?: { xs?: number; sm?: number; md?: number; lg?: number };
  /** Options for select/radio/checkbox fields */
  options?: FieldOption[];
  /** Dynamic options from API */
  optionsEndpoint?: string;
  /** Validation rules */
  validation?: FieldValidation;
  /** Conditional visibility */
  visibleWhen?: VisibilityCondition;
  /** Additional component-specific props */
  props?: Record<string, unknown>;
}

export type FieldRendererType =
  | 'text'
  | 'password'
  | 'email'
  | 'url'
  | 'phone'
  | 'textarea'
  | 'search'
  | 'otp'
  | 'number'
  | 'currency'
  | 'slider'
  | 'rating'
  | 'date'
  | 'dateRange'
  | 'time'
  | 'select'
  | 'multiSelect'
  | 'autoComplete'
  | 'radio'
  | 'checkbox'
  | 'checkboxGroup'
  | 'switch'
  | 'file'
  | 'image'
  | 'color';

export interface FieldOption {
  value: string | number;
  label: string;
  labelKey?: string;
}

export interface FieldValidation {
  required?: string;
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: string; message: string };
  custom?: string; // reference to a custom validator function
}

export interface VisibilityCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'in' | 'notIn' | 'isEmpty' | 'isNotEmpty';
  value?: unknown;
}

export interface ScreenTableConfig {
  columns: ScreenTableColumn[];
  editable?: boolean;
  addable?: boolean;
  deletable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  apiEndpoint?: string;
}

export interface ScreenTableColumn {
  name: string;
  labelKey: string;
  type: FieldRendererType;
  required?: boolean;
  sortable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  options?: FieldOption[];
  validation?: FieldValidation;
}

export interface ScreenApi {
  list?: string;
  get?: string;
  create?: string;
  update?: string;
  delete?: string;
}

export interface ScreenAction {
  id: string;
  labelKey: string;
  type: 'submit' | 'delete' | 'navigate' | 'custom';
  variant: 'contained' | 'outlined' | 'text';
  color?: string;
  icon?: string;
  permission?: string;
  confirm?: {
    titleKey: string;
    messageKey: string;
    variant?: 'default' | 'danger';
  };
}
