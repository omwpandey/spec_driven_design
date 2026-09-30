import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormMultiSelect from '../FormMultiSelect';

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
];

describe('FormMultiSelect', () => {
  it('renders with label', () => {
    renderFormComponent(<FormMultiSelect name="skills" label="Skills" options={options} />, { skills: [] });
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  it('shows placeholder when empty', () => {
    renderFormComponent(<FormMultiSelect name="skills" label="Skills" options={options} placeholder="Choose skills" />, { skills: [] });
    expect(screen.getByText('Choose skills')).toBeInTheDocument();
  });

  it('shows selected values as chips', () => {
    renderFormComponent(<FormMultiSelect name="skills" label="Skills" options={options} />, { skills: ['react', 'vue'] });
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
  });

  it('shows asterisk for required', () => {
    renderFormComponent(<FormMultiSelect name="skills" label="Skills" options={options} required />, { skills: [] });
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
