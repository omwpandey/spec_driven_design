import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import InfoCard from '../InfoCard';

describe('InfoCard', () => {
  it('renders title', () => {
    render(<InfoCard title="Total Users" value={100} />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
  });

  it('renders value', () => {
    render(<InfoCard title="Users" value={12450} />);
    expect(screen.getByText('12,450')).toBeInTheDocument();
  });

  it('renders string value', () => {
    render(<InfoCard title="Revenue" value="$1.2M" />);
    expect(screen.getByText('$1.2M')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<InfoCard title="Users" value={100} subtitle="This month" />);
    expect(screen.getByText('This month')).toBeInTheDocument();
  });

  it('renders positive trend', () => {
    render(<InfoCard title="Users" value={100} trend={{ value: 12.5, label: 'vs last month' }} />);
    expect(screen.getByText(/12.5%/)).toBeInTheDocument();
  });

  it('renders negative trend', () => {
    render(<InfoCard title="Users" value={100} trend={{ value: -5, label: 'vs last month' }} />);
    expect(screen.getByText(/5%/)).toBeInTheDocument();
  });
});
