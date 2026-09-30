/**
 * Field Renderer Registry
 * 
 * Maps field types to their corresponding form components.
 * This replaces the hardcoded switch statement in CrudFormPage.
 * 
 * To add a new field type:
 * 1. Add the type to FieldRendererType in types.ts
 * 2. Register the renderer here with component, default props, and schema builder
 * 
 * Usage:
 *   const renderer = getFieldRenderer('date');
 *   const Component = renderer.component; // FormDatePicker
 */

import React, { lazy } from 'react';
import * as yup from 'yup';
import type { FieldRendererType, ScreenField } from './types';

export interface FieldRenderer {
  /** The form component to render */
  component: React.ComponentType<any>;
  /** Default props to pass to the component */
  defaultProps?: Record<string, unknown>;
  /** Build yup validation schema for this field type */
  buildSchema: (field: ScreenField) => yup.Schema;
}

// Lazy imports for all form components
const FormTextField = lazy(() => import('@components/form/FormTextField'));
const FormPasswordField = lazy(() => import('@components/form/FormPasswordField'));
const FormTextArea = lazy(() => import('@components/form/FormTextArea'));
const FormEmailField = lazy(() => import('@components/form/FormEmailField'));
const FormUrlField = lazy(() => import('@components/form/FormUrlField'));
const FormPhoneField = lazy(() => import('@components/form/FormPhoneField'));
const FormSearchField = lazy(() => import('@components/form/FormSearchField'));
const FormOtpInput = lazy(() => import('@components/form/FormOtpInput'));
const FormNumberField = lazy(() => import('@components/form/FormNumberField'));
const FormCurrencyField = lazy(() => import('@components/form/FormCurrencyField'));
const FormSlider = lazy(() => import('@components/form/FormSlider'));
const FormRating = lazy(() => import('@components/form/FormRating'));
const FormDatePicker = lazy(() => import('@components/form/FormDatePicker'));
const FormDateRangePicker = lazy(() => import('@components/form/FormDateRangePicker'));
const FormTimePicker = lazy(() => import('@components/form/FormTimePicker'));
const FormSelect = lazy(() => import('@components/form/FormSelect'));
const FormMultiSelect = lazy(() => import('@components/form/FormMultiSelect'));
const FormAutoComplete = lazy(() => import('@components/form/FormAutoComplete'));
const FormRadioGroup = lazy(() => import('@components/form/FormRadioGroup'));
const FormCheckbox = lazy(() => import('@components/form/FormCheckbox'));
const FormCheckboxGroup = lazy(() => import('@components/form/FormCheckboxGroup'));
const FormSwitch = lazy(() => import('@components/form/FormSwitch'));
const FormFileUpload = lazy(() => import('@components/form/FormFileUpload'));
const FormImageUpload = lazy(() => import('@components/form/FormImageUpload'));
const FormColorPicker = lazy(() => import('@components/form/FormColorPicker'));

/**
 * Build a string-based yup schema with optional validation rules
 */
const buildStringSchema = (field: ScreenField): yup.Schema => {
  let schema = yup.string();
  if (field.required) {
    schema = schema.required(field.validation?.required || `${field.labelKey} is required`);
  }
  if (field.validation?.minLength) {
    schema = schema.min(field.validation.minLength.value, field.validation.minLength.message);
  }
  if (field.validation?.maxLength) {
    schema = schema.max(field.validation.maxLength.value, field.validation.maxLength.message);
  }
  if (field.validation?.pattern) {
    schema = schema.matches(new RegExp(field.validation.pattern.value), field.validation.pattern.message);
  }
  return schema;
};

/**
 * Build a number-based yup schema with optional validation rules
 */
const buildNumberSchema = (field: ScreenField): yup.Schema => {
  let schema = yup.number().nullable().transform((v) => (Number.isNaN(v) ? null : v));
  if (field.required) {
    schema = schema.required(field.validation?.required || `${field.labelKey} is required`);
  }
  if (field.validation?.min) {
    schema = schema.min(field.validation.min.value, field.validation.min.message);
  }
  if (field.validation?.max) {
    schema = schema.max(field.validation.max.value, field.validation.max.message);
  }
  return schema;
};

/**
 * Field Renderer Registry Map
 */
const fieldRendererRegistry: Record<FieldRendererType, FieldRenderer> = {
  text: {
    component: FormTextField,
    buildSchema: buildStringSchema,
  },
  password: {
    component: FormPasswordField,
    buildSchema: buildStringSchema,
  },
  email: {
    component: FormEmailField,
    buildSchema: (field) => {
      let schema = yup.string().email('Invalid email format');
      if (field.required) schema = schema.required(field.validation?.required || 'Email is required');
      return schema;
    },
  },
  url: {
    component: FormUrlField,
    buildSchema: (field) => {
      let schema = yup.string().url('Must be a valid URL');
      if (field.required) schema = schema.required(field.validation?.required || 'URL is required');
      return schema;
    },
  },
  phone: {
    component: FormPhoneField,
    buildSchema: buildStringSchema,
  },
  textarea: {
    component: FormTextArea,
    defaultProps: { rows: 3 },
    buildSchema: buildStringSchema,
  },
  search: {
    component: FormSearchField,
    buildSchema: buildStringSchema,
  },
  otp: {
    component: FormOtpInput,
    defaultProps: { length: 6 },
    buildSchema: buildStringSchema,
  },
  number: {
    component: FormNumberField,
    buildSchema: buildNumberSchema,
  },
  currency: {
    component: FormCurrencyField,
    defaultProps: { currencySymbol: '฿' },
    buildSchema: buildNumberSchema,
  },
  slider: {
    component: FormSlider,
    defaultProps: { min: 0, max: 100 },
    buildSchema: buildNumberSchema,
  },
  rating: {
    component: FormRating,
    buildSchema: buildNumberSchema,
  },
  date: {
    component: FormDatePicker,
    buildSchema: buildStringSchema,
  },
  dateRange: {
    component: FormDateRangePicker,
    buildSchema: buildStringSchema,
  },
  time: {
    component: FormTimePicker,
    buildSchema: buildStringSchema,
  },
  select: {
    component: FormSelect,
    buildSchema: buildStringSchema,
  },
  multiSelect: {
    component: FormMultiSelect,
    buildSchema: (field) => {
      let schema = yup.array().of(yup.string());
      if (field.required) schema = schema.min(1, field.validation?.required || 'Select at least one option');
      return schema;
    },
  },
  autoComplete: {
    component: FormAutoComplete,
    buildSchema: buildStringSchema,
  },
  radio: {
    component: FormRadioGroup,
    buildSchema: buildStringSchema,
  },
  checkbox: {
    component: FormCheckbox,
    buildSchema: (field) => {
      if (field.required) return yup.boolean().oneOf([true], field.validation?.required || 'This field is required');
      return yup.boolean();
    },
  },
  checkboxGroup: {
    component: FormCheckboxGroup,
    buildSchema: (field) => {
      let schema = yup.array().of(yup.string());
      if (field.required) schema = schema.min(1, field.validation?.required || 'Select at least one');
      return schema;
    },
  },
  switch: {
    component: FormSwitch,
    buildSchema: () => yup.boolean(),
  },
  file: {
    component: FormFileUpload,
    buildSchema: (field) => {
      if (field.required) return yup.array().min(1, 'File is required');
      return yup.array();
    },
  },
  image: {
    component: FormImageUpload,
    buildSchema: (field) => {
      if (field.required) return yup.mixed().required('Image is required');
      return yup.mixed().nullable();
    },
  },
  color: {
    component: FormColorPicker,
    buildSchema: buildStringSchema,
  },
};

/**
 * Get a field renderer by type
 */
export const getFieldRenderer = (type: FieldRendererType): FieldRenderer => {
  const renderer = fieldRendererRegistry[type];
  if (!renderer) {
    console.warn(`[FieldRegistry] No renderer registered for type: ${type}. Falling back to text.`);
    return fieldRendererRegistry.text;
  }
  return renderer;
};

/**
 * Build complete yup schema from screen fields
 */
export const buildSchemaFromFields = (fields: ScreenField[]): yup.ObjectSchema<any> => {
  const shape: Record<string, yup.Schema> = {};
  fields.forEach((field) => {
    const renderer = getFieldRenderer(field.type);
    shape[field.name] = renderer.buildSchema(field);
  });
  return yup.object().shape(shape) as yup.ObjectSchema<any>;
};

/**
 * Register a custom field renderer (for plugins/extensions)
 */
export const registerFieldRenderer = (type: string, renderer: FieldRenderer) => {
  (fieldRendererRegistry as Record<string, FieldRenderer>)[type] = renderer;
};
