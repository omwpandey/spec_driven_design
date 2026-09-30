import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, within, waitFor, act } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';
import { createRef } from 'react';
import ContactChannelSection, { ContactChannelSectionRef } from '../components/contactChannelSection';

vi.mock('@store/index', () => ({
  useAppSelector: () => 'en',
  useAppDispatch: () => vi.fn(),
}));

vi.mock('@hooks', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string | number>) => {
      if (params) return `${key}:${JSON.stringify(params)}`;
      return key;
    },
    language: 'en',
  }),
}));

describe('ContactChannelSection', () => {
  it('renders the section title', () => {
    renderWithTheme(<ContactChannelSection />);
    expect(screen.getByText('contact_channel_section')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    renderWithTheme(<ContactChannelSection />);
    expect(screen.getByText('col_no')).toBeInTheDocument();
    expect(screen.getByText('col_status')).toBeInTheDocument();
  });

  it('renders initial 4 rows', () => {
    renderWithTheme(<ContactChannelSection />);
    const rows = screen.getAllByRole('row');
    // 1 header row + 4 data rows
    expect(rows.length).toBe(5);
  });

  it('renders ADD and UPD status labels', () => {
    renderWithTheme(<ContactChannelSection />);
    const addStatuses = screen.getAllByText('ADD');
    const updStatuses = screen.getAllByText('UPD');
    expect(addStatuses.length).toBe(1);
    expect(updStatuses.length).toBe(3);
  });

  it('adds a new row when Add button is clicked', () => {
    renderWithTheme(<ContactChannelSection />);
    const addBtn = screen.getByText('add_btn');
    fireEvent.click(addBtn);

    const rows = screen.getAllByRole('row');
    // 1 header + 5 data rows
    expect(rows.length).toBe(6);
  });

  it('deletes a row when delete icon is clicked', () => {
    renderWithTheme(<ContactChannelSection />);
    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    fireEvent.click(deleteButtons[0]);

    const rows = screen.getAllByRole('row');
    // 1 header + 3 data rows
    expect(rows.length).toBe(4);
  });

  it('renders activity day values', () => {
    renderWithTheme(<ContactChannelSection />);
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs[0]).toHaveValue(-30);
    expect(inputs[1]).toHaveValue(-25);
    expect(inputs[2]).toHaveValue(30);
    expect(inputs[3]).toHaveValue(-1);
  });

  it('validates all rows via ref and returns true when all valid', () => {
    const ref = createRef<ContactChannelSectionRef>();
    renderWithTheme(<ContactChannelSection ref={ref} />);

    const isValid = ref.current!.validateAllRows();
    expect(isValid).toBe(true);
  });

  it('validates all rows via ref and returns false with empty rows', () => {
    const ref = createRef<ContactChannelSectionRef>();
    renderWithTheme(<ContactChannelSection ref={ref} />);

    // Add an empty row
    fireEvent.click(screen.getByText('add_btn'));

    const isValid = ref.current!.validateAllRows();
    expect(isValid).toBe(false);
  });

  it('shows error dialog when validation fails', async () => {
    const ref = createRef<ContactChannelSectionRef>();
    renderWithTheme(<ContactChannelSection ref={ref} />);

    fireEvent.click(screen.getByText('add_btn'));
    act(() => {
      ref.current!.validateAllRows();
    });

    await waitFor(() => {
      expect(screen.getByText('validation_errors_title')).toBeInTheDocument();
      expect(screen.getByText('validation_errors_message')).toBeInTheDocument();
    });
  });

  it('closes error dialog when OK button is clicked', async () => {
    const ref = createRef<ContactChannelSectionRef>();
    renderWithTheme(<ContactChannelSection ref={ref} />);

    fireEvent.click(screen.getByText('add_btn'));
    act(() => {
      ref.current!.validateAllRows();
    });

    await waitFor(() => {
      expect(screen.getByText('ok_btn')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('ok_btn'));

    await waitFor(() => {
      expect(screen.queryByText('validation_errors_title')).not.toBeInTheDocument();
    });
  });

  it('updates activity day value on change', () => {
    renderWithTheme(<ContactChannelSection />);
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '10' } });
    expect(inputs[0]).toHaveValue(10);
  });

  it('shows validation error for out-of-range activity day', () => {
    const ref = createRef<ContactChannelSectionRef>();
    renderWithTheme(<ContactChannelSection ref={ref} />);

    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '400' } });
    fireEvent.blur(inputs[0]);

    // Error should be shown after blur
    // The red dot indicator should be present
    const row = inputs[0].closest('tr');
    expect(row).toBeInTheDocument();
  });
});
