import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Breadcrumb from '../Breadcrumb';

describe('Breadcrumb', () => {
  const items = [
    { label: 'Home', path: '/' },
    { label: 'Activity', path: '/activity' },
    { label: 'Detail' },
  ];

  it('renders all breadcrumb items', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('Detail')).toBeInTheDocument();
  });

  it('last item is not clickable', () => {
    render(<Breadcrumb items={items} />);
    const lastItem = screen.getByText('Detail');
    expect(lastItem.tagName.toLowerCase()).not.toBe('a');
  });

  it('calls onNavigate when non-last item clicked', () => {
    const onNavigate = vi.fn();
    render(<Breadcrumb items={items} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByText('Home'));
    expect(onNavigate).toHaveBeenCalledWith('/');
  });
});
