import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar from '../Avatar';

describe('Avatar', () => {
  it('renders initials from name', () => {
    render(<Avatar name="Somchai Michai" />);
    expect(screen.getByText('SM')).toBeInTheDocument();
  });

  it('shows name when showName is true', () => {
    render(<Avatar name="John Doe" showName />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows subtitle when provided', () => {
    render(<Avatar name="Jane" showName subtitle="Manager" />);
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('renders single initial for single name', () => {
    render(<Avatar name="Admin" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
