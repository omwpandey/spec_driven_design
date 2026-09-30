import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormEmailField from '../FormEmailField';

describe('FormEmailField', () => {
  it('renders with label', () => {
    renderFormComponent(<FormEmailField name="email" label="Email" />, { email: '' });
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders email input type', () => {
    renderFormComponent(<FormEmailField name="email" label="Email" />, { email: 'test@test.com' });
    const input = screen.getByDisplayValue('test@test.com');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('shows placeholder', () => {
    renderFormComponent(<FormEmailField name="email" label="Email" placeholder="your@email.com" />, { email: '' });
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
  });

  it('shows asterisk for required', () => {
    renderFormComponent(<FormEmailField name="email" label="Email" required />, { email: '' });
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
