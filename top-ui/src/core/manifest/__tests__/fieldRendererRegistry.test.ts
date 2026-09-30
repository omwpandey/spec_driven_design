// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { getFieldRenderer, buildSchemaFromFields } from '../fieldRendererRegistry';
import type { FieldRendererType, ScreenField } from '../types';

/**
 * Contract test: every declared field type must have a registered renderer
 */
const ALL_FIELD_TYPES: FieldRendererType[] = [
  'text', 'password', 'email', 'url', 'phone', 'textarea', 'search', 'otp',
  'number', 'currency', 'slider', 'rating',
  'date', 'dateRange', 'time',
  'select', 'multiSelect', 'autoComplete', 'radio',
  'checkbox', 'checkboxGroup', 'switch',
  'file', 'image', 'color',
];

describe('fieldRendererRegistry', () => {
  it('should have a renderer for every declared field type', () => {
    ALL_FIELD_TYPES.forEach((type) => {
      const renderer = getFieldRenderer(type);
      expect(renderer).toBeDefined();
      expect(renderer.component).toBeDefined();
      expect(typeof renderer.buildSchema).toBe('function');
    });
  });

  it('should fall back to text for unknown types', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const renderer = getFieldRenderer('unknownType' as FieldRendererType);
    const textRenderer = getFieldRenderer('text');
    expect(renderer.component).toBe(textRenderer.component);
    warnSpy.mockRestore();
  });

  it('should build string schema for text type with required', () => {
    const field: ScreenField = {
      name: 'testField',
      labelKey: 'Test Field',
      type: 'text',
      required: true,
    };
    const renderer = getFieldRenderer('text');
    const schema = renderer.buildSchema(field);
    expect(schema).toBeDefined();
    // Required field should fail validation on empty string
    expect(() => schema.validateSync('')).toThrow();
  });

  it('should build number schema for number type with min/max', () => {
    const field: ScreenField = {
      name: 'age',
      labelKey: 'Age',
      type: 'number',
      required: true,
      validation: {
        min: { value: 18, message: 'Must be 18+' },
        max: { value: 100, message: 'Max 100' },
      },
    };
    const renderer = getFieldRenderer('number');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync(10)).toThrow();
    expect(() => schema.validateSync(25)).not.toThrow();
    expect(() => schema.validateSync(200)).toThrow();
  });

  it('should build email schema with email validation', () => {
    const field: ScreenField = {
      name: 'email',
      labelKey: 'Email',
      type: 'email',
      required: true,
    };
    const renderer = getFieldRenderer('email');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync('invalid')).toThrow();
    expect(() => schema.validateSync('valid@email.com')).not.toThrow();
  });

  it('should build array schema for multiSelect', () => {
    const field: ScreenField = {
      name: 'skills',
      labelKey: 'Skills',
      type: 'multiSelect',
      required: true,
    };
    const renderer = getFieldRenderer('multiSelect');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync([])).toThrow();
    expect(() => schema.validateSync(['react'])).not.toThrow();
  });

  it('should build boolean schema for checkbox with required', () => {
    const field: ScreenField = {
      name: 'terms',
      labelKey: 'Terms',
      type: 'checkbox',
      required: true,
    };
    const renderer = getFieldRenderer('checkbox');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync(false)).toThrow();
    expect(() => schema.validateSync(true)).not.toThrow();
  });
});

describe('buildSchemaFromFields', () => {
  it('should build a complete object schema from fields array', () => {
    const fields: ScreenField[] = [
      { name: 'name', labelKey: 'Name', type: 'text', required: true },
      { name: 'email', labelKey: 'Email', type: 'email', required: true },
      { name: 'age', labelKey: 'Age', type: 'number' },
    ];
    const schema = buildSchemaFromFields(fields);
    expect(schema).toBeDefined();

    // Valid data should pass
    expect(() => schema.validateSync({ name: 'John', email: 'john@test.com', age: 25 })).not.toThrow();

    // Missing required should fail
    expect(() => schema.validateSync({ name: '', email: 'john@test.com', age: 25 })).toThrow();
  });
});

describe('fieldRendererRegistry - branch coverage', () => {
  it('builds string schema without required (optional field)', () => {
    const field: ScreenField = { name: 'bio', labelKey: 'Bio', type: 'text', required: false };
    const renderer = getFieldRenderer('text');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync('')).not.toThrow();
  });

  it('builds string schema with minLength validation', () => {
    const field: ScreenField = {
      name: 'name', labelKey: 'Name', type: 'text', required: true,
      validation: { minLength: { value: 3, message: 'Min 3 chars' } },
    };
    const renderer = getFieldRenderer('text');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync('ab')).toThrow('Min 3 chars');
    expect(() => schema.validateSync('abc')).not.toThrow();
  });

  it('builds string schema with maxLength validation', () => {
    const field: ScreenField = {
      name: 'code', labelKey: 'Code', type: 'text', required: false,
      validation: { maxLength: { value: 5, message: 'Max 5' } },
    };
    const renderer = getFieldRenderer('text');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync('123456')).toThrow('Max 5');
    expect(() => schema.validateSync('12345')).not.toThrow();
  });

  it('builds string schema with pattern validation', () => {
    const field: ScreenField = {
      name: 'zip', labelKey: 'Zip', type: 'text', required: false,
      validation: { pattern: { value: '^\\d{5}$', message: 'Must be 5 digits' } },
    };
    const renderer = getFieldRenderer('text');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync('abc')).toThrow('Must be 5 digits');
    expect(() => schema.validateSync('12345')).not.toThrow();
  });

  it('builds number schema without required (optional)', () => {
    const field: ScreenField = { name: 'qty', labelKey: 'Qty', type: 'number', required: false };
    const renderer = getFieldRenderer('number');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync(null)).not.toThrow();
  });

  it('builds number schema transforms NaN to null', () => {
    const field: ScreenField = { name: 'qty', labelKey: 'Qty', type: 'number', required: false };
    const renderer = getFieldRenderer('number');
    const schema = renderer.buildSchema(field);
    const result = schema.cast('abc');
    expect(result).toBeNull();
  });

  it('builds url schema with required', () => {
    const field: ScreenField = { name: 'website', labelKey: 'Website', type: 'url', required: true };
    const renderer = getFieldRenderer('url');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync('')).toThrow();
    expect(() => schema.validateSync('not-a-url')).toThrow();
    expect(() => schema.validateSync('https://example.com')).not.toThrow();
  });

  it('builds url schema without required', () => {
    const field: ScreenField = { name: 'website', labelKey: 'Website', type: 'url', required: false };
    const renderer = getFieldRenderer('url');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync(undefined)).not.toThrow();
  });

  it('builds email schema without required', () => {
    const field: ScreenField = { name: 'email', labelKey: 'Email', type: 'email', required: false };
    const renderer = getFieldRenderer('email');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync(undefined)).not.toThrow();
  });

  it('builds checkbox schema without required', () => {
    const field: ScreenField = { name: 'agree', labelKey: 'Agree', type: 'checkbox', required: false };
    const renderer = getFieldRenderer('checkbox');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync(false)).not.toThrow();
  });

  it('builds checkboxGroup schema with required', () => {
    const field: ScreenField = { name: 'tags', labelKey: 'Tags', type: 'checkboxGroup', required: true };
    const renderer = getFieldRenderer('checkboxGroup');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync([])).toThrow();
    expect(() => schema.validateSync(['a'])).not.toThrow();
  });

  it('builds checkboxGroup schema without required', () => {
    const field: ScreenField = { name: 'tags', labelKey: 'Tags', type: 'checkboxGroup', required: false };
    const renderer = getFieldRenderer('checkboxGroup');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync([])).not.toThrow();
  });

  it('builds switch schema (always boolean)', () => {
    const field: ScreenField = { name: 'active', labelKey: 'Active', type: 'switch', required: false };
    const renderer = getFieldRenderer('switch');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync(true)).not.toThrow();
    expect(() => schema.validateSync(false)).not.toThrow();
  });

  it('builds file schema with required', () => {
    const field: ScreenField = { name: 'doc', labelKey: 'Doc', type: 'file', required: true };
    const renderer = getFieldRenderer('file');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync([])).toThrow();
    expect(() => schema.validateSync(['file.pdf'])).not.toThrow();
  });

  it('builds file schema without required', () => {
    const field: ScreenField = { name: 'doc', labelKey: 'Doc', type: 'file', required: false };
    const renderer = getFieldRenderer('file');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync([])).not.toThrow();
  });

  it('builds image schema with required', () => {
    const field: ScreenField = { name: 'avatar', labelKey: 'Avatar', type: 'image', required: true };
    const renderer = getFieldRenderer('image');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync(null)).toThrow();
    expect(() => schema.validateSync('data:image/png')).not.toThrow();
  });

  it('builds image schema without required', () => {
    const field: ScreenField = { name: 'avatar', labelKey: 'Avatar', type: 'image', required: false };
    const renderer = getFieldRenderer('image');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync(null)).not.toThrow();
  });

  it('builds multiSelect schema without required', () => {
    const field: ScreenField = { name: 'opts', labelKey: 'Options', type: 'multiSelect', required: false };
    const renderer = getFieldRenderer('multiSelect');
    const schema = renderer.buildSchema(field);
    expect(() => schema.validateSync([])).not.toThrow();
  });
});

describe('buildSchemaFromFields', () => {
  it('should build a complete object schema from fields array', () => {
    const fields: ScreenField[] = [
      { name: 'name', labelKey: 'Name', type: 'text', required: true },
      { name: 'email', labelKey: 'Email', type: 'email', required: true },
      { name: 'age', labelKey: 'Age', type: 'number' },
    ];
    const schema = buildSchemaFromFields(fields);
    expect(schema).toBeDefined();
    expect(() => schema.validateSync({ name: 'John', email: 'john@test.com', age: 25 })).not.toThrow();
    expect(() => schema.validateSync({ name: '', email: 'john@test.com', age: 25 })).toThrow();
  });

  it('builds schema with mixed field types', () => {
    const fields: ScreenField[] = [
      { name: 'agree', labelKey: 'Agree', type: 'checkbox', required: true },
      { name: 'website', labelKey: 'Website', type: 'url', required: false },
      { name: 'amount', labelKey: 'Amount', type: 'number', required: false },
    ];
    const schema = buildSchemaFromFields(fields);
    expect(() => schema.validateSync({ agree: true, website: undefined, amount: null })).not.toThrow();
    expect(() => schema.validateSync({ agree: false, website: undefined, amount: null })).toThrow();
  });
});
