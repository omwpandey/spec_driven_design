import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { colors, formLabelStyle } from '@core/theme';

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  multiple?: boolean;
}

/**
 * Standard Form Select
 * 
 * TOPSCRM Standards:
 * - Mandatory fields: label in #EB0A1E with * after text
 * - Non-mandatory fields: label in #58595B
 * - Fixed line height for validation
 */
const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  required = false,
  disabled = false,
  placeholder = 'Select...',
  size = 'small',
  fullWidth = true,
  multiple = false,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ marginBottom: 0 }}>
          {/* Label */}
          <Typography
            sx={{
              ...formLabelStyle,
              color: required ? colors.mandatory : colors.nonMandatory,
              marginBottom: '8px',
            }}
          >
            {label}
            {required && (
              <span style={{ color: colors.mandatory, marginLeft: '2px' }}>*</span>
            )}
          </Typography>

          {/* Select */}
          <FormControl fullWidth={fullWidth} size={size} error={!!error}>
            <Select
              {...field}
              multiple={multiple}
              displayEmpty
              disabled={disabled}
              value={field.value ?? (multiple ? [] : '')}
              sx={{ fontSize: '0.875rem', height: '40px' }}
            >
              <MenuItem value="" disabled>
                <em>{placeholder}</em>
              </MenuItem>
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Error */}
          {error && (
            <Typography sx={{ fontSize: '0.75rem', color: colors.mandatory, lineHeight: 1.3, mt: '4px' }}>
              {error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};

export default FormSelect;
