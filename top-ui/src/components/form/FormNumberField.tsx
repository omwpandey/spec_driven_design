import React from 'react';
import { Box, Typography, TextField } from '@components/common';
import { Controller, useFormContext } from 'react-hook-form';
import { colors, formLabelStyle } from '@core/theme';

interface FormNumberFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

/**
 * Standard Form Number Field
 * 
 * TOPSCRM Standards:
 * - Numeric values display in US format: 1,000.00
 * - Mandatory: #EB0A1E with *, Non-mandatory: #58595B
 * - Fixed line height for validation
 */
const FormNumberField: React.FC<FormNumberFieldProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder,
  min,
  max,
  size = 'small',
  fullWidth = true,
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

          {/* Input */}
          <TextField
            {...field}
            type="number"
            size={size}
            fullWidth={fullWidth}
            placeholder={placeholder}
            disabled={disabled}
            error={!!error}
            onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
            slotProps={{
              input: { readOnly },
              htmlInput: { min, max },
            }}
            sx={{
              '& .MuiInputBase-root': {
                height: '40px',
              },
              '& .MuiInputBase-input': {
                fontSize: '0.875rem',
                fontWeight: 400,
              },
            }}
          />

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

export default FormNumberField;
