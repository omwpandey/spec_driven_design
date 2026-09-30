import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormSelect from '../FormSelect';

const options = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
];

describe('FormSelect', () => {
  it('renders with label', () => {
    renderFormComponent(<FormSelect name="testSelect" label="Select Field" options={options} />, { testSelect: '' });
    expect(screen.getByText('Select Field')).toBeInTheDocument();
  });

  it('shows asterisk for required fields', () => {
    renderFormComponent(<FormSelect name="testSelect" label="Required" options={options} required />, { testSelect: '' });
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows placeholder when no value selected', () => {
    renderFormComponent(<FormSelect name="testSelect" label="Field" options={options} placeholder="Choose..." />, { testSelect: '' });
    expect(screen.getByText('Choose...')).toBeInTheDocument();
  });

  it('displays selected value', () => {
    renderFormComponent(<FormSelect name="testSelect" label="Field" options={options} />, { testSelect: 'opt2' });
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('renders the component', () => {
    const { container } = renderFormComponent(<FormSelect name="testSelect" label="Field" options={options} />, { testSelect: '' });
    expect(container).toBeInTheDocument();
  });
});
