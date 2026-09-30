import React from 'react';
import { Box, Typography, Rating, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

interface FormRatingProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  max?: number;
  precision?: number;
  size?: 'small' | 'medium' | 'large';
}

const FormRating: React.FC<FormRatingProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  max = 5,
  precision = 1,
  size = 'medium',
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2" color={error ? 'error' : 'text.primary'} sx={formLabelStyle}>
            {label}
            {required && (
              <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                *
              </Typography>
            )}
          </Typography>
          <Rating
            value={field.value ?? 0}
            onChange={(_, newValue) => field.onChange(newValue)}
            max={max}
            precision={precision}
            size={size}
            disabled={disabled}
            readOnly={readOnly}
            sx={{ color: '#CC0000' }}
          />
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Box>
      )}
    />
  );
};

export default FormRating;
