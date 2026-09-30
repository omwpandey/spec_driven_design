import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormPasswordField from '../FormPasswordField';

describe('FormPasswordField', () => {
  it('renders with label', () => {
    renderFormComponent(<FormPasswordField name="pass" label="Password" />, { pass: '' });
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('renders as password type by default', () => {
    renderFormComponent(<FormPasswordField name="pass" label="Password" />, { pass: 'secret' });
    const input = screen.getByDisplayValue('secret');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles visibility on icon click', () => {
    renderFormComponent(<FormPasswordField name="pass" label="Password" />, { pass: 'secret' });
    // Find the toggle button by role
    const buttons = screen.getAllByRole('button');
    const toggleBtn = buttons[0];
    fireEvent.click(toggleBtn);
    const input = screen.getByDisplayValue('secret');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('shows asterisk for required', () => {
    renderFormComponent(<FormPasswordField name="pass" label="Password" required />, { pass: '' });
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
