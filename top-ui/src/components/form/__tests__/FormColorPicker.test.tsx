import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormColorPicker from '../FormColorPicker';

describe('FormColorPicker', () => {
  it('renders with label', () => {
    renderFormComponent(<FormColorPicker name="color" label="Color" />, { color: '#FF0000' });
    expect(screen.getByText('Color')).toBeInTheDocument();
  });

  it('shows hex value in input', () => {
    renderFormComponent(<FormColorPicker name="color" label="Color" />, { color: '#CC0000' });
    expect(screen.getByDisplayValue('#CC0000')).toBeInTheDocument();
  });

  it('shows asterisk for required', () => {
    renderFormComponent(<FormColorPicker name="color" label="Color" required />, { color: '' });
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
