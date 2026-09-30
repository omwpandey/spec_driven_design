import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormCheckboxGroup from '../FormCheckboxGroup';

const options = [
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write' },
  { value: 'delete', label: 'Delete' },
];

describe('FormCheckboxGroup', () => {
  it('renders all options', () => {
    renderFormComponent(<FormCheckboxGroup name="perms" options={options} />, { perms: [] });
    expect(screen.getByText('Read')).toBeInTheDocument();
    expect(screen.getByText('Write')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders with label', () => {
    renderFormComponent(<FormCheckboxGroup name="perms" label="Permissions" options={options} />, { perms: [] });
    expect(screen.getByText('Permissions')).toBeInTheDocument();
  });

  it('shows checked items from value', () => {
    renderFormComponent(<FormCheckboxGroup name="perms" options={options} />, { perms: ['read', 'write'] });
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it('toggles checkbox on click', () => {
    renderFormComponent(<FormCheckboxGroup name="perms" options={options} />, { perms: [] });
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked();
  });
});
