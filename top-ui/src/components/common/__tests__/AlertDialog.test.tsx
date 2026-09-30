import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@core/theme';
import AlertDialog from '../AlertDialog';

const renderDialog = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
  });
};

describe('AlertDialog', () => {
  it('renders title and message', () => {
    renderDialog(
      <AlertDialog open title="Success" message="Saved" onClose={vi.fn()} />,
    );
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('renders OK button by default', () => {
    renderDialog(
      <AlertDialog open title="Info" message="Test" onClose={vi.fn()} />,
    );
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('calls onClose when button clicked', () => {
    const onClose = vi.fn();
    renderDialog(<AlertDialog open title="Info" message="Test" onClose={onClose} />);
    fireEvent.click(screen.getByText('OK'));
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render when closed', () => {
    renderDialog(
      <AlertDialog open={false} title="Hidden" message="No" onClose={vi.fn()} />,
    );
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('renders custom button text', () => {
    renderDialog(
      <AlertDialog open title="T" message="M" buttonText="Close" onClose={vi.fn()} />,
    );
    expect(screen.getByText('Close')).toBeInTheDocument();
  });
});
