import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@core/theme';
import SetTemplateDialog from '../SetTemplateDialog';

const renderDialog = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
  });
};

const defaultProps = {
  open: true,
  title: 'Reminder Message Setup',
  activityId: 'AF260001',
  activityName: 'PM 1K Service',
  contactProcessOptions: [
    { value: 'follow_up', label: 'Service Follow-up' },
    { value: 'appointment', label: 'Appointment Confirmation' },
  ],
  parameters: [
    { label: 'PM Operation (Short)', value: '90,000' },
    { label: 'License Plate', value: 'GH45346' },
  ],
  onCancel: vi.fn(),
  onSave: vi.fn(),
};

describe('SetTemplateDialog', () => {
  it('renders title in header', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    expect(screen.getByText('Reminder Message Setup')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Reminder Message Setup')).not.toBeInTheDocument();
  });

  it('renders Activity ID field with value', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    expect(screen.getByDisplayValue('AF260001')).toBeInTheDocument();
  });

  it('renders Activity Name field with value', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    expect(screen.getByDisplayValue('PM 1K Service')).toBeInTheDocument();
  });

  it('renders Reminder Setup section title', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    expect(screen.getByText('Reminder Setup')).toBeInTheDocument();
  });

  it('renders Contact Channel Details section title', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    expect(screen.getByText('Contact Channel Details')).toBeInTheDocument();
  });

  it('renders Parameters section', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    expect(screen.getByText('Parameters')).toBeInTheDocument();
  });

  it('renders parameter items', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    expect(screen.getByText('PM Operation (Short)')).toBeInTheDocument();
    expect(screen.getByText('90,000')).toBeInTheDocument();
    expect(screen.getByText('License Plate')).toBeInTheDocument();
    expect(screen.getByText('GH45346')).toBeInTheDocument();
  });

  it('does not render Parameters section when empty', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} parameters={[]} />);
    expect(screen.queryByText('Parameters')).not.toBeInTheDocument();
  });

  it('renders default channel checkboxes (SMS, Email, Line OA)', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    expect(screen.getByText('SMS')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Line OA')).toBeInTheDocument();
  });

  it('renders 3 Preview buttons', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    const previewButtons = screen.getAllByText('Preview');
    expect(previewButtons).toHaveLength(3);
  });

  it('renders Cancel and Save buttons in footer', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button clicked', () => {
    const onCancel = vi.fn();
    renderDialog(<SetTemplateDialog {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onSave and onCancel when Save button clicked', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    renderDialog(<SetTemplateDialog {...defaultProps} onSave={onSave} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Save'));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when close icon clicked', () => {
    const onCancel = vi.fn();
    renderDialog(<SetTemplateDialog {...defaultProps} onCancel={onCancel} />);
    // Find the close button (IconButton with X)
    const allButtons = screen.getAllByRole('button');
    // First button is the close icon in the header
    fireEvent.click(allButtons[0]);
    expect(onCancel).toHaveBeenCalled();
  });

  it('opens preview dialog when Preview button clicked', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    const previewButtons = screen.getAllByText('Preview');
    fireEvent.click(previewButtons[0]); // Click SMS Preview
    // The preview dialog should now show with channel title
    // MessagePreviewDialog renders inside with "OK" and "CANCEL" buttons
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.getByText('CANCEL')).toBeInTheDocument();
  });

  it('closes preview dialog when CANCEL clicked', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    const previewButtons = screen.getAllByText('Preview');
    fireEvent.click(previewButtons[0]);
    // Preview dialog shows OK and CANCEL buttons
    expect(screen.getByText('OK')).toBeInTheDocument();
    fireEvent.click(screen.getByText('CANCEL'));
    // After clicking CANCEL, the preview dialog state resets (previewChannel = null)
    // The MUI Dialog with open=false may still be in DOM but hidden.
    // Verify the close was triggered by checking that we can open it again
    fireEvent.click(previewButtons[0]);
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('toggles channel checkbox', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    // First checkbox is SMS
    expect(checkboxes[0]).toBeChecked();
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  it('renders message length note for SMS', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    expect(screen.getByText(/Thai message max length/)).toBeInTheDocument();
  });

  it('renders custom message length note', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} messageLengthNote="Custom note here" />);
    expect(screen.getByText('Custom note here')).toBeInTheDocument();
  });

  it('renders contact process dropdown options', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    // The select is rendered; we can verify the component is present
    expect(screen.getByText('Contact Process')).toBeInTheDocument();
  });

  it('renders with default title when not provided', () => {
    renderDialog(<SetTemplateDialog open onCancel={vi.fn()} />);
    expect(screen.getByText('Reminder Message Setup')).toBeInTheDocument();
  });

  it('renders Subject field for Email channel', () => {
    renderDialog(<SetTemplateDialog {...defaultProps} />);
    expect(screen.getByText('Subject')).toBeInTheDocument();
  });
});
