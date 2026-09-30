import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormNumberField from '../FormNumberField';

describe('FormNumberField', () => {
  it('renders with label', () => {
    renderFormComponent(<FormNumberField name="numField" label="Number" />, { numField: 0 });
    expect(screen.getByText('Number')).toBeInTheDocument();
  });

  it('renders with default value', () => {
    renderFormComponent(<FormNumberField name="numField" label="Number" />, { numField: 42 });
    expect(screen.getByDisplayValue('42')).toBeInTheDocument();
  });

  it('accepts number input', () => {
    renderFormComponent(<FormNumberField name="numField" label="Number" />, { numField: '' });
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '99' } });
    expect(input).toHaveValue(99);
  });

  it('shows asterisk for required fields', () => {
    renderFormComponent(<FormNumberField name="numField" label="Amount" required />, { numField: '' });
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders as disabled', () => {
    renderFormComponent(<FormNumberField name="numField" label="Number" disabled />, { numField: 10 });
    const input = screen.getByRole('spinbutton');
    expect(input).toBeDisabled();
  });
});
