import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRef } from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';
import PsfuItemSection, { PsfuItemSectionRef } from '../components/psfuItemSection';

vi.mock('@store/index', () => ({
  useAppSelector: () => 'en',
  useAppDispatch: () => vi.fn(),
}));

vi.mock('@hooks', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string | number>) => {
      if (params?.field) return `${params.field} is required.`;
      return key;
    },
    language: 'en',
  }),
}));

describe('PsfuItemSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the section title and grid columns', () => {
    renderWithTheme(<PsfuItemSection />);
    expect(screen.getByText('psfu_item_section')).toBeInTheDocument();
    expect(screen.getByText('psfu_col_status')).toBeInTheDocument();
    expect(screen.getByText('psfu_col_mandatory')).toBeInTheDocument();
    expect(screen.getByText('psfu_col_action')).toBeInTheDocument();
  });

  it('renders the Add button', () => {
    renderWithTheme(<PsfuItemSection />);
    expect(screen.getByText('psfu_add_btn')).toBeInTheDocument();
  });

  it('adds a new row when Add is clicked (first row has an item)', () => {
    const ref = createRef<PsfuItemSectionRef>();
    renderWithTheme(<PsfuItemSection ref={ref} />);
    // Baseline: one active row.
    expect(ref.current?.getActiveRows().length).toBe(1);
    fireEvent.click(screen.getByText('psfu_add_btn'));
    expect(ref.current?.getActiveRows().length).toBe(2);
  });

  it('blocks Save with an empty item row (ERR0001) and shows an inline error message', async () => {
    const ref = createRef<PsfuItemSectionRef>();
    renderWithTheme(<PsfuItemSection ref={ref} />);
    // Add an empty row after the pre-filled one.
    fireEvent.click(screen.getByText('psfu_add_btn'));
    const valid = ref.current?.validateAllRows();
    expect(valid).toBe(false);
    // The error is surfaced inline beneath the field, not in a summary dialog.
    await waitFor(() => {
      expect(screen.getByText('psfu_col_items is required.')).toBeInTheDocument();
    });
    expect(screen.queryByText('psfu_validation_errors_title')).not.toBeInTheDocument();
  });

  it('adds consecutive rows without triggering validation, even when the previous row is empty', () => {
    const ref = createRef<PsfuItemSectionRef>();
    renderWithTheme(<PsfuItemSection ref={ref} />);
    // First Add → 2 rows, the new one empty.
    fireEvent.click(screen.getByText('psfu_add_btn'));
    expect(ref.current?.getActiveRows().length).toBe(2);
    // Second Add still works even though the previous row has no item yet.
    fireEvent.click(screen.getByText('psfu_add_btn'));
    expect(ref.current?.getActiveRows().length).toBe(3);
    // Validation only runs on Save, so the error dialog must NOT be shown here.
    expect(screen.queryByText('psfu_validation_errors_title')).not.toBeInTheDocument();
  });

  it('reports hasChanges after a new row is added', () => {
    const ref = createRef<PsfuItemSectionRef>();
    renderWithTheme(<PsfuItemSection ref={ref} />);
    expect(ref.current?.hasChanges()).toBe(false);
    fireEvent.click(screen.getByText('psfu_add_btn'));
    expect(ref.current?.hasChanges()).toBe(true);
  });
});
