import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorState from '../ErrorState';

describe('ErrorState', () => {
  it('renders default title', () => {
    render(<ErrorState />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<ErrorState title="Network Error" />);
    expect(screen.getByText('Network Error')).toBeInTheDocument();
  });

  it('renders retry button', () => {
    render(<ErrorState onRetry={vi.fn()} />);
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('calls onRetry when clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    fireEvent.click(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalled();
  });

  it('hides retry button when not provided', () => {
    render(<ErrorState />);
    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });
});
