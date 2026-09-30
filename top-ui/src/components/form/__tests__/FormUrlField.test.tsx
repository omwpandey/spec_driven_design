import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormUrlField from '../FormUrlField';

describe('FormUrlField', () => {
  it('renders with label', () => {
    renderFormComponent(<FormUrlField name="url" label="Website" />, { url: '' });
    expect(screen.getByText('Website')).toBeInTheDocument();
  });

  it('renders url input type', () => {
    renderFormComponent(<FormUrlField name="url" label="Website" />, { url: 'https://test.com' });
    const input = screen.getByDisplayValue('https://test.com');
    expect(input).toHaveAttribute('type', 'url');
  });

  it('shows placeholder', () => {
    renderFormComponent(<FormUrlField name="url" label="URL" placeholder="https://" />, { url: '' });
    expect(screen.getByPlaceholderText('https://')).toBeInTheDocument();
  });
});
