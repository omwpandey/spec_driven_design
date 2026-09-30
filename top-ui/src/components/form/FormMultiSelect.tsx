import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  OutlinedInput,
  CancelIcon,
} from '@components/common';
import { Controller, useFormContext } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormMultiSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  maxSelections?: number;
}

const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
  name,
  label,
  options,
  required = false,
  disabled = false,
  placeholder = 'Select...',
  size = 'small',
  fullWidth = true,
  maxSelections,
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
          <FormControl fullWidth={fullWidth} size={size} error={!!error}>
            <Select
              {...field}
              multiple
              displayEmpty
              disabled={disabled}
              value={field.value || []}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (!selected || (selected as string[]).length === 0) {
                  return <Typography sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>{placeholder}</Typography>;
                }
                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as (string | number)[]).map((value) => {
                      const option = options.find((o) => o.value === value);
                      return (
                        <Chip
                          key={value}
                          label={option?.label || value}
                          size="small"
                          deleteIcon={<CancelIcon sx={{ fontSize: '14px !important' }} />}
                          onDelete={() => {
                            const newValue = (field.value as (string | number)[]).filter((v) => v !== value);
                            field.onChange(newValue);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          sx={{ height: 22, fontSize: '0.75rem' }}
                        />
                      );
                    })}
                  </Box>
                );
              }}
              onChange={(e) => {
                const value = e.target.value as (string | number)[];
                if (maxSelections && value.length > maxSelections) return;
                field.onChange(value);
              }}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        </Box>
      )}
    />
  );
};

export default FormMultiSelect;
