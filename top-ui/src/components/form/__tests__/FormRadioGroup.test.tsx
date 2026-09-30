import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormRadioGroup from '../FormRadioGroup';

const options = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

describe('FormRadioGroup', () => {
  it('renders all options', () => {
    renderFormComponent(<FormRadioGroup name="gender" options={options} />, { gender: '' });
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('renders with label', () => {
    renderFormComponent(<FormRadioGroup name="gender" label="Gender" options={options} />, { gender: '' });
    expect(screen.getByText('Gender')).toBeInTheDocument();
  });

  it('shows selected value', () => {
    renderFormComponent(<FormRadioGroup name="gender" options={options} />, { gender: 'female' });
    const radios = screen.getAllByRole('radio');
    expect(radios[1]).toBeChecked();
  });

  it('changes selection on click', () => {
    renderFormComponent(<FormRadioGroup name="gender" options={options} row />, { gender: 'male' });
    const otherRadio = screen.getByLabelText('Other');
    fireEvent.click(otherRadio);
    expect(otherRadio).toBeChecked();
  });
});
