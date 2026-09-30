import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomerListPage from '../pages/CustomerListPage';

vi.mock('@core/crud', () => ({
  CrudListPage: ({ config }: { config: { title: string; resource: string } }) => (
    <div data-testid="crud-list-page">
      <span data-testid="config-title">{config.title}</span>
      <span data-testid="config-resource">{config.resource}</span>
    </div>
  ),
}));

describe('CustomerListPage', () => {
  it('renders CrudListPage with customerConfig', () => {
    render(<CustomerListPage />);
    expect(screen.getByTestId('crud-list-page')).toBeInTheDocument();
  });

  it('passes correct config title', () => {
    render(<CustomerListPage />);
    expect(screen.getByTestId('config-title')).toHaveTextContent('Customer Management');
  });

  it('passes correct config resource', () => {
    render(<CustomerListPage />);
    expect(screen.getByTestId('config-resource')).toHaveTextContent('customers');
  });
});
