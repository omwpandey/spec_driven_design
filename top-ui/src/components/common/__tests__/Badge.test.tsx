import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge', () => {
  it('renders label text', () => {
    render(<Badge label="Active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders with success variant', () => {
    render(<Badge label="Success" variant="success" />);
    const badge = screen.getByText('Success');
    expect(badge).toBeInTheDocument();
  });

  it('renders with error variant', () => {
    render(<Badge label="Error" variant="error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    render(<Badge label="Small" size="small" />);
    expect(screen.getByText('Small')).toBeInTheDocument();
  });
});
