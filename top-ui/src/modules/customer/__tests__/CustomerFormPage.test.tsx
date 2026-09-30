import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomerFormPage from '../pages/CustomerFormPage';

vi.mock('@core/crud', () => ({
  CrudFormPage: ({ config, mode }: { config: { title: string; resource: string }; mode: string }) => (
    <div data-testid="crud-form-page">
      <span data-testid="config-title">{config.title}</span>
      <span data-testid="config-resource">{config.resource}</span>
      <span data-testid="mode">{mode}</span>
    </div>
  ),
}));

describe('CustomerFormPage', () => {
  it('renders CrudFormPage with customerConfig', () => {
    render(<CustomerFormPage />);
    expect(screen.getByTestId('crud-form-page')).toBeInTheDocument();
  });

  it('defaults to create mode', () => {
    render(<CustomerFormPage />);
    expect(screen.getByTestId('mode')).toHaveTextContent('create');
  });

  it('passes edit mode when specified', () => {
    render(<CustomerFormPage mode="edit" />);
    expect(screen.getByTestId('mode')).toHaveTextContent('edit');
  });

  it('passes view mode when specified', () => {
    render(<CustomerFormPage mode="view" />);
    expect(screen.getByTestId('mode')).toHaveTextContent('view');
  });

  it('passes correct config title', () => {
    render(<CustomerFormPage />);
    expect(screen.getByTestId('config-title')).toHaveTextContent('Customer Management');
  });

  it('passes correct config resource', () => {
    render(<CustomerFormPage />);
    expect(screen.getByTestId('config-resource')).toHaveTextContent('customers');
  });
});
