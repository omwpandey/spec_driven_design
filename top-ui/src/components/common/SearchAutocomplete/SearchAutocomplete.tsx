/**
 * SearchAutocomplete
 * ------------------------------------------------------------------
 * A reusable, debounced auto-suggestion search box built on MUI
 * Autocomplete. The component owns the interaction concerns
 * (debouncing, loading state, open/close, minimum characters) but is
 * intentionally *decoupled from any specific API*: the caller injects a
 * `fetchSuggestions(query)` callback that returns the option list.
 *
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Autocomplete,
  type AutocompleteProps,
  type AutocompleteRenderInputParams,
} from '@mui/material';
import { TextField, CircularProgress, InputAdornment, SearchIcon } from '@components/common';
import type { SxProps, Theme } from '@mui/material/styles';

export interface SearchAutocompleteProps<TOption> {
  /** Current text value of the input (controlled). */
  value: string;
  /** Fired on every keystroke with the raw input text. */
  onInputChange: (value: string) => void;
  /**
   * Async loader that returns the list of suggestions for a query.
   * The caller owns the API/transport; this component only orchestrates
   * debouncing and rendering. Return `[]` for "no matches".
   */
  fetchSuggestions: (query: string) => Promise<TOption[]>;
  /** Fired when the user picks a suggestion (or clears it -> null). */
  onSelect?: (option: TOption | null) => void;
  /** Map an option to its display label. */
  getOptionLabel: (option: TOption) => string;
  /** Map an option to a stable React key (defaults to the label). */
  getOptionKey?: (option: TOption) => string;
  /** Custom rendering for a single suggestion row (optional). */
  renderOption?: (option: TOption) => React.ReactNode;
  /** Placeholder text for the input. */
  placeholder?: string;
  /** Minimum characters before suggestions are requested (default: 1). */
  minChars?: number;
  /** Debounce delay in ms before calling fetchSuggestions (default: 300). */
  debounceMs?: number;
  /** Max length for the input (passed to the underlying field). */
  maxLength?: number;
  disabled?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  /**
   * Show the leading search icon adornment. Defaults to `false` so the icon
   * is opt-in per usage (flag-based), keeping the box clean unless a screen
   * explicitly wants the search affordance.
   */
  showSearchIcon?: boolean;
  /** Text shown while a request is in flight. */
  loadingText?: string;
  /** Text shown when there are no matches. */
  noOptionsText?: string;
  /** sx applied to the underlying TextField. */
  sx?: SxProps<Theme>;
  /** Optional id for accessibility / testing. */
  id?: string;
  /** Called when the user presses Enter in the input. */
  onEnter?: (value: string) => void;
}

const SearchAutocomplete = <TOption,>({
  value,
  onInputChange,
  fetchSuggestions,
  onSelect,
  getOptionLabel,
  getOptionKey,
  renderOption,
  placeholder,
  minChars = 1,
  debounceMs = 300,
  maxLength,
  disabled = false,
  size = 'small',
  fullWidth = true,
  showSearchIcon = false,
  loadingText = 'Loading...',
  noOptionsText = 'No options',
  sx,
  id,
  onEnter,
}: SearchAutocompleteProps<TOption>): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<TOption[]>([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guards against stale responses overwriting fresher ones (out-of-order
  // resolution): only the most recent request may commit its result.
  const requestIdRef = useRef(0);

  const runSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (trimmed.length < minChars) {
        setOptions([]);
        setLoading(false);
        return;
      }

      const requestId = ++requestIdRef.current;
      setLoading(true);

      fetchSuggestions(trimmed)
        .then((results) => {
          if (requestId !== requestIdRef.current) return; // stale
          setOptions(results ?? []);
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) return;
          setOptions([]);
        })
        .finally(() => {
          if (requestId !== requestIdRef.current) return;
          setLoading(false);
        });
    },
    [fetchSuggestions, minChars]
  );

  const handleInputChange = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      onInputChange(newValue);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => runSearch(newValue), debounceMs);
    },
    [onInputChange, runSearch, debounceMs]
  );

  // Clean up any pending debounce timer on unmount.
  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  const resolveKey = useMemo(
    () => getOptionKey ?? getOptionLabel,
    [getOptionKey, getOptionLabel]
  );

  const renderInput = (params: AutocompleteRenderInputParams) => {
    const { slotProps: paramSlotProps, ...rest } = params;
    return (
      <TextField
        {...rest}
        size={size}
        placeholder={placeholder}
        sx={sx}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onEnter?.(value);
        }}
        slotProps={{
          inputLabel: paramSlotProps.inputLabel,
          htmlInput: {
            ...paramSlotProps.htmlInput,
            maxLength,
          },
          input: {
            ...paramSlotProps.input,
            startAdornment: showSearchIcon ? (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: '#999999' }} />
              </InputAdornment>
            ) : (
              paramSlotProps.input.startAdornment
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={16} /> : null}
                {paramSlotProps.input.endAdornment}
              </>
            ),
          },
        }}
      />
    );
  };

  // We manage `options` ourselves (server-side filtering), so disable the
  // built-in client filter and treat the list as always-matching.
  const filterOptions: AutocompleteProps<TOption, false, false, true>['filterOptions'] = (x) => x;

  return (
    <Autocomplete<TOption, false, false, true>
      id={id}
      freeSolo
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      disabled={disabled}
      fullWidth={fullWidth}
      options={options}
      loading={loading}
      loadingText={loadingText}
      noOptionsText={noOptionsText}
      filterOptions={filterOptions}
      inputValue={value}
      onInputChange={handleInputChange}
      // `freeSolo` means the value can be a raw string or a TOption.
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : getOptionLabel(option)
      }
      renderOption={(props, option) => {
        const { key: _key, ...liProps } = props as React.HTMLAttributes<HTMLLIElement> & {
          key?: React.Key;
        };
        return (
          <li {...liProps} key={resolveKey(option)}>
            {renderOption ? renderOption(option) : getOptionLabel(option)}
          </li>
        );
      }}
      onChange={(_event, selected) => {
        if (selected == null || typeof selected === 'string') {
          onSelect?.(null);
          return;
        }
        onInputChange(getOptionLabel(selected));
        onSelect?.(selected);
      }}
      renderInput={renderInput}
    />
  );
};

export default SearchAutocomplete;
