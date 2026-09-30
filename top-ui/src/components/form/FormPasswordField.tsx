import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton, InputAdornment, Visibility, VisibilityOff } from '@components/common';
import { Controller, useFormContext } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

interface FormPasswordFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const FormPasswordField: React.FC<FormPasswordFieldProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  placeholder,
  maxLength,
  size = 'small',
  fullWidth = true,
}) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

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
            type={showPassword ? 'text' : 'password'}
            size={size}
            fullWidth={fullWidth}
            placeholder={placeholder}
            disabled={disabled}
            error={!!error}
            helperText={error?.message}
            slotProps={{
              htmlInput: { maxLength },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      )}
    />
  );
};

export default FormPasswordField;
