import React from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { colors, formLabelStyle } from '@core/theme';

interface FormTextFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  maxLength?: number;
  type?: string;
  multiline?: boolean;
  rows?: number;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

/**
 * Standard Form Text Field
 * 
 * TOPSCRM Standards:
 * - Mandatory fields: label in #EB0A1E with * after text
 * - Non-mandatory fields: label in #58595B
 * - Fixed line height: error display does NOT shift layout
 * - Font: 14px Medium for labels, 14px Regular for input
 */
const FormTextField: React.FC<FormTextFieldProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder,
  maxLength,
  type = 'text',
  multiline = false,
  rows = 1,
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
          {/* Label - follows TOPSCRM mandatory/non-mandatory color standard */}
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
            type={type}
            size={size}
            fullWidth={fullWidth}
            multiline={multiline}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            error={!!error}
            slotProps={{
              input: { readOnly },
              htmlInput: { maxLength },
            }}
            sx={{
              '& .MuiInputBase-root': {
                height: multiline ? 'auto' : '40px',
              },
              '& .MuiInputBase-input': {
                fontSize: '0.875rem',
                fontWeight: 400,
              },
              '& .MuiInputBase-root.Mui-disabled': {
                backgroundColor: '#F5F5F5',
              },
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#333333',
              },
            }}
          />

          {/* Error text */}
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

export default FormTextField;
