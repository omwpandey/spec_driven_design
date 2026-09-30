import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormTimePicker from '../FormTimePicker';

describe('FormTimePicker', () => {
  it('renders with label', () => {
    renderFormComponent(<FormTimePicker name="time" label="Start Time" />, { time: '' });
    expect(screen.getByText('Start Time')).toBeInTheDocument();
  });

  it('shows asterisk for required', () => {
    renderFormComponent(<FormTimePicker name="time" label="Time" required />, { time: '' });
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders with value', () => {
    renderFormComponent(<FormTimePicker name="time" label="Time" />, { time: '09:30' });
    expect(screen.getByDisplayValue('09:30')).toBeInTheDocument();
  });
});
