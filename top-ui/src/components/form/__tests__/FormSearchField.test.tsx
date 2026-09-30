import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormSearchField from '../FormSearchField';

describe('FormSearchField', () => {
  it('renders with placeholder', () => {
    renderFormComponent(<FormSearchField name="search" placeholder="Search here..." />, { search: '' });
    expect(screen.getByPlaceholderText('Search here...')).toBeInTheDocument();
  });

  it('renders with label', () => {
    renderFormComponent(<FormSearchField name="search" label="Search" />, { search: '' });
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('calls onSearch on Enter key', () => {
    const onSearch = vi.fn();
    renderFormComponent(<FormSearchField name="search" onSearch={onSearch} />, { search: 'test' });
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSearch).toHaveBeenCalled();
  });

  it('accepts user input', () => {
    renderFormComponent(<FormSearchField name="search" />, { search: '' });
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(input).toHaveValue('hello');
  });
});
