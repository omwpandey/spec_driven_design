import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormSwitch from '../FormSwitch';

describe('FormSwitch', () => {
  it('renders with label', () => {
    renderFormComponent(<FormSwitch name="active" label="Active" />, { active: false });
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders unchecked when false', () => {
    renderFormComponent(<FormSwitch name="active" label="Active" />, { active: false });
    const switchEl = screen.getByRole('switch');
    expect(switchEl).not.toBeChecked();
  });

  it('renders checked when true', () => {
    renderFormComponent(<FormSwitch name="active" label="Active" />, { active: true });
    const switchEl = screen.getByRole('switch');
    expect(switchEl).toBeChecked();
  });

  it('toggles on click', () => {
    renderFormComponent(<FormSwitch name="active" label="Active" />, { active: false });
    fireEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).toBeChecked();
  });
});
