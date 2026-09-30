import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';
import ServiceRepairSection from '../components/serviceRepairSection';

vi.mock('@store/index', () => ({
  useAppSelector: () => 'en',
  useAppDispatch: () => vi.fn(),
}));

vi.mock('@hooks', () => ({
  useTranslation: () => ({ t: (key: string) => key, language: 'en' }),
}));

describe('ServiceRepairSection', () => {
  it('renders the section card with title', () => {
    renderWithTheme(<ServiceRepairSection />);
    expect(screen.getByText('service_repair_section')).toBeInTheDocument();
  });

  it('renders the table headers', () => {
    renderWithTheme(<ServiceRepairSection />);
    expect(screen.getByText('col_no')).toBeInTheDocument();
    expect(screen.getByText(/col_repair_code/)).toBeInTheDocument();
    expect(screen.getByText(/col_description/)).toBeInTheDocument();
    expect(screen.getByText(/col_mandatory/)).toBeInTheDocument();
  });

  it('renders initial repair items', () => {
    renderWithTheme(<ServiceRepairSection />);
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('10,000')).toBeInTheDocument();
    expect(screen.getByText('20,000')).toBeInTheDocument();
    expect(screen.getByText('30,000')).toBeInTheDocument();
    expect(screen.getByText('40,000')).toBeInTheDocument();
  });

  it('renders item descriptions', () => {
    renderWithTheme(<ServiceRepairSection />);
    expect(screen.getByText('1000 km Service/ 1 Month')).toBeInTheDocument();
    expect(screen.getByText('10,000 km Service/ 6 Month')).toBeInTheDocument();
  });

  it('renders mandatory column values', () => {
    renderWithTheme(<ServiceRepairSection />);
    const yesCells = screen.getAllByText('Yes');
    const noCells = screen.getAllByText('No');
    expect(yesCells.length).toBeGreaterThanOrEqual(4);
    expect(noCells.length).toBeGreaterThanOrEqual(1);
  });

  it('renders checkboxes for each row', () => {
    renderWithTheme(<ServiceRepairSection />);
    const checkboxes = screen.getAllByRole('checkbox');
    // 5 row checkboxes + 1 select-all = 6
    expect(checkboxes.length).toBe(6);
  });

  it('select-all checkbox checks all rows', () => {
    renderWithTheme(<ServiceRepairSection />);
    const checkboxes = screen.getAllByRole('checkbox');
    const selectAll = checkboxes[0];

    fireEvent.click(selectAll);

    // After check-all, all row checkboxes should be checked
    const updatedCheckboxes = screen.getAllByRole('checkbox');
    updatedCheckboxes.slice(1).forEach((cb) => {
      expect(cb).toBeChecked();
    });
  });

  it('individual checkbox toggles selection', () => {
    renderWithTheme(<ServiceRepairSection />);
    const checkboxes = screen.getAllByRole('checkbox');
    const firstRowCheckbox = checkboxes[1];

    fireEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox).toBeChecked();

    fireEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox).not.toBeChecked();
  });

  it('renders select range dropdown', () => {
    renderWithTheme(<ServiceRepairSection />);
    expect(screen.getByText('select_range')).toBeInTheDocument();
  });

  it('opens popover when clicking select range', () => {
    renderWithTheme(<ServiceRepairSection />);
    const dropdown = screen.getByText('select_range');
    fireEvent.click(dropdown);

    expect(screen.getByText('Select 1K-200K')).toBeInTheDocument();
    expect(screen.getByText('Select 210K-250K')).toBeInTheDocument();
    expect(screen.getByText('Select 260K-300K')).toBeInTheDocument();
  });

  it('toggles mileage range checkboxes in popover', () => {
    renderWithTheme(<ServiceRepairSection />);
    fireEvent.click(screen.getByText('select_range'));

    const rangeCheckbox = screen.getByText('Select 210K-250K').closest('label')?.querySelector('input');
    expect(rangeCheckbox).not.toBeChecked();

    fireEvent.click(rangeCheckbox!);
    expect(rangeCheckbox).toBeChecked();
  });

  it('select all link selects all ranges', () => {
    renderWithTheme(<ServiceRepairSection />);
    fireEvent.click(screen.getByText('select_range'));

    fireEvent.click(screen.getByText('select_all'));

    // All range checkboxes should be checked
    const rangeLabels = ['Select 1K-200K', 'Select 210K-250K', 'Select 260K-300K', 'Select 310K-350K', 'Select 360K-400K'];
    rangeLabels.forEach((label) => {
      const checkbox = screen.getByText(label).closest('label')?.querySelector('input');
      expect(checkbox).toBeChecked();
    });
  });

  it('none link deselects all ranges', () => {
    renderWithTheme(<ServiceRepairSection />);
    fireEvent.click(screen.getByText('select_range'));

    fireEvent.click(screen.getByText('none'));

    const rangeLabels = ['Select 1K-200K', 'Select 210K-250K', 'Select 260K-300K', 'Select 310K-350K', 'Select 360K-400K'];
    rangeLabels.forEach((label) => {
      const checkbox = screen.getByText(label).closest('label')?.querySelector('input');
      expect(checkbox).not.toBeChecked();
    });
  });
});
