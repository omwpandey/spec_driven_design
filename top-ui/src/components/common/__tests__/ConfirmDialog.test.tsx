import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDialog from '../ConfirmDialog';

vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}));

const renderDialog = (ui: React.ReactElement) => {
  return render(ui);
};


const defaultProps = {
  open: true,
  title: 'Delete Record',
  message: 'Are you sure you want to delete?',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
};


describe('ConfirmDialog', () => {
  it('renders title and message', () => {
    renderDialog(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Delete Record')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete?')).toBeInTheDocument();
  });

  it('renders confirm and cancel buttons', () => {
    renderDialog(<ConfirmDialog {...defaultProps} confirmText="Yes" cancelText="No" />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn();
    renderDialog(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} confirmText="Confirm" />);
    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn();
    renderDialog(<ConfirmDialog {...defaultProps} onCancel={onCancel} cancelText="Cancel" />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not render when open is false', () => {
    renderDialog(<ConfirmDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Delete Record')).not.toBeInTheDocument();
  });
});
