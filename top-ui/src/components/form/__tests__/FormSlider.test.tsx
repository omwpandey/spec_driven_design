import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormSlider from '../FormSlider';

describe('FormSlider', () => {
  it('renders with label', () => {
    renderFormComponent(<FormSlider name="volume" label="Volume" />, { volume: 50 });
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('renders slider element', () => {
    renderFormComponent(<FormSlider name="volume" label="Volume" />, { volume: 50 });
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('shows asterisk for required', () => {
    renderFormComponent(<FormSlider name="volume" label="Volume" required />, { volume: 0 });
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
