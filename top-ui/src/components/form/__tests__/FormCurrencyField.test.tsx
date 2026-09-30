import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormCurrencyField from '../FormCurrencyField';

describe('FormCurrencyField', () => {
  it('renders with label', () => {
    renderFormComponent(<FormCurrencyField name="amount" label="Amount" />, { amount: '' });
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  it('shows currency symbol', () => {
    renderFormComponent(<FormCurrencyField name="amount" label="Amount" currencySymbol="$" />, { amount: 100 });
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('shows default currency symbol (฿)', () => {
    renderFormComponent(<FormCurrencyField name="amount" label="Amount" />, { amount: 100 });
    expect(screen.getByText('฿')).toBeInTheDocument();
  });

  it('renders with value', () => {
    renderFormComponent(<FormCurrencyField name="amount" label="Amount" />, { amount: 1500 });
    expect(screen.getByDisplayValue('1500')).toBeInTheDocument();
  });

  it('shows asterisk for required', () => {
    renderFormComponent(<FormCurrencyField name="amount" label="Amount" required />, { amount: '' });
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('handles onChange - sets numeric value', () => {
    renderFormComponent(<FormCurrencyField name="amount" label="Amount" />, { amount: '' });
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '250' } });
    expect(input).toHaveValue(250);
  });

  it('handles onChange - clears to empty string', () => {
    renderFormComponent(<FormCurrencyField name="amount" label="Amount" />, { amount: 100 });
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '' } });
    expect(input).toHaveValue(null);
  });

  it('formats value on blur', () => {
    renderFormComponent(<FormCurrencyField name="amount" label="Amount" decimalPlaces={2} />, { amount: 99.9 });
    const input = screen.getByRole('spinbutton');
    fireEvent.blur(input);
    // After blur, value should be formatted to 2 decimal places
    expect(input).toHaveValue(99.9);
  });

  it('does not format empty value on blur', () => {
    renderFormComponent(<FormCurrencyField name="amount" label="Amount" />, { amount: '' });
    const input = screen.getByRole('spinbutton');
    fireEvent.blur(input);
    expect(input).toHaveValue(null);
  });

  it('renders as disabled', () => {
    renderFormComponent(<FormCurrencyField name="amount" label="Amount" disabled />, { amount: 50 });
    const input = screen.getByRole('spinbutton');
    expect(input).toBeDisabled();
  });

  it('renders with placeholder', () => {
    renderFormComponent(<FormCurrencyField name="amount" label="Amount" placeholder="0.00" />, { amount: '' });
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });

  it('renders with custom decimal places', () => {
    renderFormComponent(<FormCurrencyField name="amount" label="Amount" decimalPlaces={3} />, { amount: 10.123 });
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(10.123);
  });
});
