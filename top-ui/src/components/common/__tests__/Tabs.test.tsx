import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Tabs from '../Tabs';

const tabs = [
  { id: 'tab1', label: 'General', content: <p>General Content</p> },
  { id: 'tab2', label: 'Settings', content: <p>Settings Content</p> },
  { id: 'tab3', label: 'Advanced', content: <p>Advanced Content</p> },
];

describe('Tabs', () => {
  it('renders all tab labels', () => {
    render(<Tabs tabs={tabs} />);
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('shows first tab content by default', () => {
    render(<Tabs tabs={tabs} />);
    expect(screen.getByText('General Content')).toBeInTheDocument();
  });

  it('switches content on tab click', () => {
    render(<Tabs tabs={tabs} />);
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByText('Settings Content')).toBeInTheDocument();
  });

  it('calls onChange when tab changes', () => {
    const onChange = vi.fn();
    render(<Tabs tabs={tabs} onChange={onChange} />);
    fireEvent.click(screen.getByText('Advanced'));
    expect(onChange).toHaveBeenCalledWith('tab3');
  });
});
