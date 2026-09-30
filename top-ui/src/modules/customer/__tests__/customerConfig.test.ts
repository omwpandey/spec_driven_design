import { describe, it, expect } from 'vitest';
import { customerConfig } from '../customerConfig';

describe('customerConfig', () => {
  it('has the correct resource name', () => {
    expect(customerConfig.resource).toBe('customers');
  });

  it('has the correct endpoint', () => {
    expect(customerConfig.endpoint).toBe('/customers');
  });

  it('has the correct title', () => {
    expect(customerConfig.title).toBe('Customer Management');
  });

  it('has correct page size', () => {
    expect(customerConfig.pageSize).toBe(10);
  });

  it('has correct default sort', () => {
    expect(customerConfig.defaultSort).toEqual({ field: 'customerName', order: 'asc' });
  });

  it('defines all CRUD permissions', () => {
    expect(customerConfig.permissions).toEqual({
      create: 'CUSTOMER_ADD',
      read: 'CUSTOMER_VIEW',
      update: 'CUSTOMER_EDIT',
      delete: 'CUSTOMER_DELETE',
    });
  });

  it('enables all features', () => {
    expect(customerConfig.features).toEqual({
      create: true,
      edit: true,
      delete: true,
      export: true,
      search: true,
      filter: true,
      pagination: true,
    });
  });

  it('defines 5 fields', () => {
    expect(customerConfig.fields).toHaveLength(5);
  });

  it('has customerName as required searchable and sortable field', () => {
    const nameField = customerConfig.fields.find((f) => f.name === 'customerName');
    expect(nameField).toBeDefined();
    expect(nameField!.required).toBe(true);
    expect(nameField!.searchable).toBe(true);
    expect(nameField!.sortable).toBe(true);
    expect(nameField!.type).toBe('text');
    expect(nameField!.maxLength).toBe(200);
  });

  it('has mobile as required searchable field', () => {
    const mobileField = customerConfig.fields.find((f) => f.name === 'mobile');
    expect(mobileField).toBeDefined();
    expect(mobileField!.required).toBe(true);
    expect(mobileField!.searchable).toBe(true);
    expect(mobileField!.maxLength).toBe(20);
  });

  it('has email as optional field', () => {
    const emailField = customerConfig.fields.find((f) => f.name === 'email');
    expect(emailField).toBeDefined();
    expect(emailField!.required).toBeFalsy();
    expect(emailField!.maxLength).toBe(100);
  });

  it('has type field with individual and corporate options', () => {
    const typeField = customerConfig.fields.find((f) => f.name === 'type');
    expect(typeField).toBeDefined();
    expect(typeField!.type).toBe('select');
    expect(typeField!.required).toBe(true);
    expect(typeField!.options).toEqual([
      { value: 'individual', label: 'Individual' },
      { value: 'corporate', label: 'Corporate' },
    ]);
  });

  it('has status field with active and inactive options', () => {
    const statusField = customerConfig.fields.find((f) => f.name === 'status');
    expect(statusField).toBeDefined();
    expect(statusField!.type).toBe('select');
    expect(statusField!.options).toEqual([
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ]);
  });

  it('all fields have gridSize defined', () => {
    customerConfig.fields.forEach((field) => {
      expect(field.gridSize).toBeDefined();
      expect(field.gridSize!.xs).toBe(12);
    });
  });
});
