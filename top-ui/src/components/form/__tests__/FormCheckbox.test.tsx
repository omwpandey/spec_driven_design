import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormCheckbox from '../FormCheckbox';

describe('FormCheckbox', () => {
  it('renders with label', () => {
    renderFormComponent(<FormCheckbox name="agree" label="I agree" />, { agree: false });
    expect(screen.getByText('I agree')).toBeInTheDocument();
  });

  it('renders unchecked by default', () => {
    renderFormComponent(<FormCheckbox name="agree" label="I agree" />, { agree: false });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders checked when value is true', () => {
    renderFormComponent(<FormCheckbox name="agree" label="I agree" />, { agree: true });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('toggles on click', () => {
    renderFormComponent(<FormCheckbox name="agree" label="I agree" />, { agree: false });
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('renders as disabled', () => {
    renderFormComponent(<FormCheckbox name="agree" label="I agree" disabled />, { agree: false });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });
});
