import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@core/theme';
import MessagePreviewDialog from '../MessagePreviewDialog';

const renderDialog = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
  });
};

const defaultProps = {
  open: true,
  title: 'SMS',
  channelLabel: 'SMS',
  message: 'Toyota XXXXXXX invites you to bring your vehicle in for its 100,000 km service.',
  maxLength: 70,
  onClose: vi.fn(),
};

describe('MessagePreviewDialog', () => {
  it('renders title in header', () => {
    renderDialog(<MessagePreviewDialog {...defaultProps} />);
    const elements = screen.getAllByText('SMS');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders message content', () => {
    renderDialog(<MessagePreviewDialog {...defaultProps} />);
    expect(screen.getByDisplayValue(defaultProps.message)).toBeInTheDocument();
  });

  it('renders character count when maxLength provided', () => {
    renderDialog(<MessagePreviewDialog {...defaultProps} />);
    expect(screen.getByText(`${defaultProps.message.length} / 70`)).toBeInTheDocument();
  });

  it('does not render character count when maxLength not provided', () => {
    renderDialog(<MessagePreviewDialog {...defaultProps} maxLength={undefined} />);
    expect(screen.queryByText(/\/ 70/)).not.toBeInTheDocument();
  });

  it('renders CANCEL and OK buttons by default', () => {
    renderDialog(<MessagePreviewDialog {...defaultProps} />);
    expect(screen.getByText('CANCEL')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('renders custom button text', () => {
    renderDialog(<MessagePreviewDialog {...defaultProps} confirmText="CONFIRM" cancelText="CLOSE" />);
    expect(screen.getByText('CONFIRM')).toBeInTheDocument();
    expect(screen.getByText('CLOSE')).toBeInTheDocument();
  });

  it('calls onClose when CANCEL button clicked', () => {
    const onClose = vi.fn();
    renderDialog(<MessagePreviewDialog {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText('CANCEL'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when OK button clicked', () => {
    const onConfirm = vi.fn();
    renderDialog(<MessagePreviewDialog {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText('OK'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when OK clicked and no onConfirm provided', () => {
    const onClose = vi.fn();
    renderDialog(<MessagePreviewDialog {...defaultProps} onClose={onClose} onConfirm={undefined} />);
    fireEvent.click(screen.getByText('OK'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close icon button clicked', () => {
    const onClose = vi.fn();
    renderDialog(<MessagePreviewDialog {...defaultProps} onClose={onClose} />);
    // Close icon button is the IconButton with CloseIcon
    const closeButtons = screen.getAllByRole('button');
    // First button is the X icon in header
    fireEvent.click(closeButtons[0]);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render when open is false', () => {
    renderDialog(<MessagePreviewDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('SMS')).not.toBeInTheDocument();
  });

  it('renders with different channel title', () => {
    renderDialog(<MessagePreviewDialog {...defaultProps} title="Email" channelLabel="Email" />);
    const elements = screen.getAllByText('Email');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('message textarea is read-only', () => {
    renderDialog(<MessagePreviewDialog {...defaultProps} />);
    const textarea = screen.getByDisplayValue(defaultProps.message);
    expect(textarea).toHaveAttribute('readonly');
  });
});
