import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusIndicator from '../StatusIndicator';

describe('StatusIndicator', () => {
  it('renders active status', () => {
    render(<StatusIndicator status="active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders inactive status', () => {
    render(<StatusIndicator status="inactive" />);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders custom label', () => {
    render(<StatusIndicator status="pending" label="Awaiting" />);
    expect(screen.getByText('Awaiting')).toBeInTheDocument();
  });

  it('renders error status', () => {
    render(<StatusIndicator status="error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
