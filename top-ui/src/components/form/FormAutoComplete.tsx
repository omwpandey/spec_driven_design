import React from 'react';
import { Box, Typography, TextField, Chip } from '@components/common';
import { Autocomplete } from '@components/common/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

interface AutoCompleteOption {
  value: string | number;
  label: string;
}

interface FormAutoCompleteProps {
  name: string;
  label: string;
  options: AutoCompleteOption[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  multiple?: boolean;
  freeSolo?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  loading?: boolean;
  onInputChange?: (value: string) => void;
}

const FormAutoComplete: React.FC<FormAutoCompleteProps> = ({
  name,
  label,
  options,
  required = false,
  disabled = false,
  placeholder = 'Search...',
  multiple = false,
  freeSolo = false,
  size = 'small',
  fullWidth = true,
  loading = false,
  onInputChange,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography
            variant="body2"
            color={error ? 'error' : 'text.primary'}
            sx={formLabelStyle}
          >
            {label}
            {required && (
              <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                *
              </Typography>
            )}
          </Typography>
          <Autocomplete
            multiple={multiple}
            freeSolo={freeSolo}
            options={options}
            loading={loading}
            disabled={disabled}
            size={size}
            fullWidth={fullWidth}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : (option as AutoCompleteOption).label
            }
            isOptionEqualToValue={(option, value) =>
              (option as AutoCompleteOption).value === (value as AutoCompleteOption).value
            }
            value={
              multiple
                ? options.filter((o) =>
                    (field.value as (string | number)[] || []).includes(o.value)
                  )
                : options.find((o) => o.value === field.value) || null
            }
            onChange={(_, newValue) => {
              if (multiple) {
                field.onChange(
                  (newValue as AutoCompleteOption[]).map((v) => v.value)
                );
              } else {
                field.onChange(
                  newValue ? (newValue as AutoCompleteOption).value : ''
                );
              }
            }}
            onInputChange={(_, value) => onInputChange?.(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                error={!!error}
                helperText={error?.message}
              />
            )}
            {...(multiple ? {
              renderTags: (value: AutoCompleteOption[], getTagProps: (params: { index: number }) => object) =>
                value.map((option: AutoCompleteOption, index: number) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.value}
                    label={option.label}
                    size="small"
                    sx={{ height: 22, fontSize: '0.75rem' }}
                  />
                ))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any : {})}
          />
        </Box>
      )}
    />
  );
};

export default FormAutoComplete;
