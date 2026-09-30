import React from 'react';
import { Box, Typography, TextField, InputAdornment, Select, MenuItem } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

interface FormPhoneFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  countryCodeName?: string;
  defaultCountryCode?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const countryCodes = [
  { code: '+66', label: '🇹🇭 +66', country: 'Thailand' },
  { code: '+1', label: '🇺🇸 +1', country: 'USA' },
  { code: '+81', label: '🇯🇵 +81', country: 'Japan' },
  { code: '+86', label: '🇨🇳 +86', country: 'China' },
  { code: '+91', label: '🇮🇳 +91', country: 'India' },
  { code: '+44', label: '🇬🇧 +44', country: 'UK' },
];

const FormPhoneField: React.FC<FormPhoneFieldProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = '0812345678',
  countryCodeName,
  defaultCountryCode = '+66',
  size = 'small',
  fullWidth = true,
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
          <TextField
            {...field}
            type="tel"
            size={size}
            fullWidth={fullWidth}
            placeholder={placeholder}
            disabled={disabled}
            error={!!error}
            helperText={error?.message}
            slotProps={{
              input: {
                readOnly,
                startAdornment: countryCodeName ? (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    <Controller
                      name={countryCodeName}
                      control={control}
                      render={({ field: codeField }) => (
                        <Select
                          {...codeField}
                          variant="standard"
                          disableUnderline
                          size="small"
                          value={codeField.value || defaultCountryCode}
                          disabled={disabled}
                          sx={{ fontSize: '0.8125rem', minWidth: 70, mr: 0.5 }}
                        >
                          {countryCodes.map((cc) => (
                            <MenuItem key={cc.code} value={cc.code} sx={{ fontSize: '0.8125rem' }}>
                              {cc.label}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />
        </Box>
      )}
    />
  );
};

export default FormPhoneField;
