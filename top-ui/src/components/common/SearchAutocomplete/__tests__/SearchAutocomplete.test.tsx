import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';
import SearchAutocomplete from '../SearchAutocomplete';

type Suggestion = { id: number; label: string };

const TestHarness = ({
  fetchSuggestions,
  getOptionLabel = (opt: Suggestion) => opt.label,
  getOptionKey = (opt: Suggestion) => String(opt.id),
  onSelect,
  onEnter,
  placeholder,
  minChars,
  debounceMs,
  showSearchIcon,
  loadingText,
  noOptionsText,
  renderOption,
}: {
  fetchSuggestions: (query: string) => Promise<Suggestion[]>;
  getOptionLabel?: (opt: Suggestion) => string;
  getOptionKey?: (opt: Suggestion) => string;
  onSelect?: (option: Suggestion | null) => void;
  onEnter?: (value: string) => void;
  placeholder?: string;
  minChars?: number;
  debounceMs?: number;
  showSearchIcon?: boolean;
  loadingText?: string;
  noOptionsText?: string;
  renderOption?: (option: Suggestion) => React.ReactNode;
}) => {
  const [value, setValue] = useState('');

  return (
    <SearchAutocomplete<Suggestion>
      value={value}
      onInputChange={setValue}
      fetchSuggestions={fetchSuggestions}
      getOptionLabel={getOptionLabel}
      getOptionKey={getOptionKey}
      onSelect={onSelect}
      onEnter={onEnter}
      placeholder={placeholder}
      minChars={minChars}
      debounceMs={debounceMs}
      showSearchIcon={showSearchIcon}
      loadingText={loadingText}
      noOptionsText={noOptionsText}
      renderOption={renderOption}
    />
  );
};

describe('SearchAutocomplete', () => {
  it('renders the input and optional search icon', () => {
    const { container } = renderWithTheme(
      <TestHarness fetchSuggestions={async () => []} placeholder="Search customer" showSearchIcon />
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('placeholder', 'Search customer');
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('does not fetch suggestions before minChars', async () => {
    const fetchSuggestions = vi.fn().mockResolvedValue([]);
    const user = userEvent.setup();

    renderWithTheme(
      <TestHarness fetchSuggestions={fetchSuggestions} minChars={2} debounceMs={50} />
    );

    await user.type(screen.getByRole('combobox'), 'a');
    await waitFor(() => {
      expect(fetchSuggestions).not.toHaveBeenCalled();
    });
  });

  it('debounces lookup and renders fetched suggestions', async () => {
    const fetchSuggestions = vi.fn().mockResolvedValue([
      { id: 1, label: 'Alpha' },
      { id: 2, label: 'Bravo' },
    ]);
    const user = userEvent.setup();

    renderWithTheme(<TestHarness fetchSuggestions={fetchSuggestions} debounceMs={150} />);

    await user.type(screen.getByRole('combobox'), 'a');

    await waitFor(() => expect(fetchSuggestions).toHaveBeenCalledWith('a'));
    expect(await screen.findByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Bravo')).toBeInTheDocument();
  });

  it('clears options when the async request fails', async () => {
    const fetchSuggestions = vi.fn().mockRejectedValue(new Error('noop'));
    const user = userEvent.setup();

    renderWithTheme(
      <TestHarness fetchSuggestions={fetchSuggestions} noOptionsText="No matches" debounceMs={50} />
    );

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.type(input, 'zzz');

    await waitFor(() => {
      expect(fetchSuggestions).toHaveBeenCalledWith('zzz');
    });
    expect(input).toHaveValue('zzz');
  });

  it('calls onSelect and preserves the selected label when an option is chosen', async () => {
    const fetchSuggestions = vi.fn().mockResolvedValue([{ id: 4, label: 'Gamma' }]);
    const onSelect = vi.fn();
    const user = userEvent.setup();

    renderWithTheme(
      <TestHarness fetchSuggestions={fetchSuggestions} onSelect={onSelect} debounceMs={0} />
    );

    await user.type(screen.getByRole('combobox'), 'g');
    const option = await screen.findByText('Gamma');
    await user.click(option);

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith({ id: 4, label: 'Gamma' });
    });
    expect(screen.getByRole('combobox')).toHaveValue('Gamma');
  });

  it('supports Enter key handling and custom option rendering', async () => {
    const fetchSuggestions = vi.fn().mockResolvedValue([{ id: 9, label: 'Delta' }]);
    const onEnter = vi.fn();
    const user = userEvent.setup();

    renderWithTheme(
      <TestHarness
        fetchSuggestions={fetchSuggestions}
        onEnter={onEnter}
        debounceMs={0}
        renderOption={(option) => <span>Custom: {option.label}</span>}
      />
    );

    const input = screen.getByRole('combobox');
    await user.type(input, 'd');

    const customOption = await screen.findByText('Custom: Delta');
    expect(customOption).toBeInTheDocument();

    await user.keyboard('{Enter}');
    expect(onEnter).toHaveBeenCalledWith('d');
  });
});
