import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Divider from '../Divider';

describe('Divider', () => {
  it('renders without label', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Divider label="OR" />);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });
});
