import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormTextField from '../FormTextField';

describe('FormTextField', () => {
  it('renders with label', () => {
    renderFormComponent(<FormTextField name="testField" label="Test Label" />, { testField: '' });
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('shows asterisk for required fields', () => {
    renderFormComponent(<FormTextField name="testField" label="Required Field" required />, { testField: '' });
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders with default value', () => {
    renderFormComponent(<FormTextField name="testField" label="Field" />, { testField: 'Hello' });
    const input = screen.getByDisplayValue('Hello');
    expect(input).toBeInTheDocument();
  });

  it('renders as readonly when readOnly is true', () => {
    renderFormComponent(<FormTextField name="testField" label="Field" readOnly />, { testField: 'Read Only' });
    const input = screen.getByDisplayValue('Read Only');
    expect(input).toHaveAttribute('readonly');
  });

  it('renders as disabled when disabled is true', () => {
    renderFormComponent(<FormTextField name="testField" label="Field" disabled />, { testField: '' });
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('shows placeholder text', () => {
    renderFormComponent(<FormTextField name="testField" label="Field" placeholder="Enter value" />, { testField: '' });
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  it('accepts user input', () => {
    renderFormComponent(<FormTextField name="testField" label="Field" />, { testField: '' });
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(input).toHaveValue('New Value');
  });
});
