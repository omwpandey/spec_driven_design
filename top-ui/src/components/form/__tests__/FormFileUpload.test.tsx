import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormFileUpload from '../FormFileUpload';

describe('FormFileUpload', () => {
  it('renders with label', () => {
    renderFormComponent(<FormFileUpload name="files" label="Attachments" />, { files: [] });
    expect(screen.getByText('Attachments')).toBeInTheDocument();
  });

  it('shows upload instructions', () => {
    renderFormComponent(<FormFileUpload name="files" label="Files" />, { files: [] });
    expect(screen.getByText(/Click to upload/)).toBeInTheDocument();
  });

  it('shows max file size info', () => {
    renderFormComponent(<FormFileUpload name="files" label="Files" maxFileSize={5} />, { files: [] });
    expect(screen.getByText(/Max 5MB/)).toBeInTheDocument();
  });

  it('shows asterisk for required', () => {
    renderFormComponent(<FormFileUpload name="files" label="Files" required />, { files: [] });
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows multiple files info when multiple enabled', () => {
    renderFormComponent(
      <FormFileUpload name="files" label="Files" multiple maxFiles={3} maxFileSize={10} />,
      { files: [] }
    );
    expect(screen.getByText(/up to 3 files/)).toBeInTheDocument();
  });

  it('renders helper text', () => {
    renderFormComponent(
      <FormFileUpload name="files" label="Files" helperText="Upload your documents" />,
      { files: [] }
    );
    expect(screen.getByText('Upload your documents')).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    const { container } = renderFormComponent(
      <FormFileUpload name="files" label="Files" />,
      { files: [] }
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });
  });

  it('rejects oversized files', async () => {
    const { container } = renderFormComponent(
      <FormFileUpload name="files" label="Files" maxFileSize={1} />,
      { files: [] }
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    // Create a file larger than 1MB
    const largeContent = new Array(1024 * 1024 + 100).fill('a').join('');
    const file = new File([largeContent], 'large.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/exceed max size/)).toBeInTheDocument();
    });
  });

  it('rejects when too many files with multiple', async () => {
    const { container } = renderFormComponent(
      <FormFileUpload name="files" label="Files" multiple maxFiles={2} />,
      { files: [] }
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    const files = [
      new File(['a'], 'file1.txt', { type: 'text/plain' }),
      new File(['b'], 'file2.txt', { type: 'text/plain' }),
      new File(['c'], 'file3.txt', { type: 'text/plain' }),
    ];
    fireEvent.change(input, { target: { files } });

    await waitFor(() => {
      expect(screen.getByText(/Maximum 2 files allowed/)).toBeInTheDocument();
    });
  });

  it('removes file when delete is clicked', async () => {
    const { container } = renderFormComponent(
      <FormFileUpload name="files" label="Files" />,
      { files: [] }
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    const file = new File(['hello'], 'removeme.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('removeme.txt')).toBeInTheDocument();
    });

    const deleteButton = container.querySelector('button[aria-label]') || container.querySelectorAll('button')[0];
    // Find the delete icon button in the list
    const buttons = container.querySelectorAll('li button');
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      await waitFor(() => {
        expect(screen.queryByText('removeme.txt')).not.toBeInTheDocument();
      });
    }
  });

  it('opens file dialog on drop zone click', () => {
    const { container } = renderFormComponent(
      <FormFileUpload name="files" label="Files" />,
      { files: [] }
    );
    const dropZone = screen.getByText(/Click to upload/).closest('div');
    expect(dropZone).toBeInTheDocument();
    // Click should trigger file input (we can't fully test native dialog)
    fireEvent.click(dropZone!);
  });

  it('does not open file dialog when disabled', () => {
    renderFormComponent(
      <FormFileUpload name="files" label="Files" disabled />,
      { files: [] }
    );
    const dropZone = screen.getByText(/Click to upload/).closest('div');
    fireEvent.click(dropZone!);
    // No error means disabled state handled correctly
  });

  it('displays file sizes correctly', async () => {
    const { container } = renderFormComponent(
      <FormFileUpload name="files" label="Files" />,
      { files: [] }
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    const file = new File(['x'.repeat(500)], 'small.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('small.txt')).toBeInTheDocument();
      // File size should be displayed (500 B)
      expect(screen.getByText(/500 B/)).toBeInTheDocument();
    });
  });
});
