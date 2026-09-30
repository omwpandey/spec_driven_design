import React from 'react';
import { Typography, TextField, InputAdornment } from '@components/common';
import FormFieldWrapper from './FormFieldWrapper';

interface FormCurrencyFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  currencySymbol?: string;
  min?: number;
  max?: number;
  decimalPlaces?: number;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const FormCurrencyField: React.FC<FormCurrencyFieldProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = '0.00',
  currencySymbol = '฿',
  min,
  max,
  decimalPlaces = 2,
  size = 'small',
  fullWidth = true,
}) => {
  const formatCurrency = (value: string | number): string => {
    if (value === '' || value === null || value === undefined) return '';
    const num = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (Number.isNaN(num)) return '';
    return num.toFixed(decimalPlaces);
  };

  return (
    <FormFieldWrapper name={name} label={label} required={required}>
      {({ field, error, hasError }) => (
        <TextField
          {...field}
          type="number"
          size={size}
          fullWidth={fullWidth}
          placeholder={placeholder}
          disabled={disabled}
          error={hasError}
          helperText={error?.message}
          onChange={(e) => {
            const val = e.target.value;
            field.onChange(val === '' ? '' : Number(val));
          }}
          onBlur={(e) => {
            field.onBlur();
            if (field.value !== '' && field.value !== null) {
              field.onChange(Number(formatCurrency(field.value)));
            }
          }}
          slotProps={{
            input: {
              readOnly,
              startAdornment: (
                <InputAdornment position="start">
                  <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    {currencySymbol}
                  </Typography>
                </InputAdornment>
              ),
            },
            htmlInput: {
              min,
              max,
              step: Math.pow(10, -decimalPlaces),
            },
          }}
        />
      )}
    </FormFieldWrapper>
  );
};

export default FormCurrencyField;
