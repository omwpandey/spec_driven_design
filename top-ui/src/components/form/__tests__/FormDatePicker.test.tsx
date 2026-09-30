import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormDatePicker from '../FormDatePicker';

describe('FormDatePicker', () => {
  it('renders with label', () => {
    renderFormComponent(<FormDatePicker name="date" label="Birth Date" />, { date: '' });
    expect(screen.getByText('Birth Date')).toBeInTheDocument();
  });

  it('shows asterisk for required', () => {
    renderFormComponent(<FormDatePicker name="date" label="Date" required />, { date: '' });
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders the component container', () => {
    const { container } = renderFormComponent(<FormDatePicker name="date" label="Date" />, { date: '2024-01-15' });
    expect(container).toBeInTheDocument();
  });

  it('renders input element', () => {
    const { container } = renderFormComponent(<FormDatePicker name="date" label="Date" />, { date: '' });
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'date');
  });
});
