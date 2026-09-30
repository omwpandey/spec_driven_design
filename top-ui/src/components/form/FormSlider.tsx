import React from 'react';
import { Box, Typography, Slider, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

interface FormSliderProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  marks?: boolean | { value: number; label: string }[];
  showValue?: boolean;
  valueLabelDisplay?: 'auto' | 'on' | 'off';
}

const FormSlider: React.FC<FormSliderProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  min = 0,
  max = 100,
  step = 1,
  marks = false,
  showValue = true,
  valueLabelDisplay = 'auto',
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color={error ? 'error' : 'text.primary'} sx={formLabelStyle}>
              {label}
              {required && (
                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              )}
            </Typography>
            {showValue && (
              <Typography variant="body2" fontWeight={600} color="primary">
                {field.value ?? min}
              </Typography>
            )}
          </Box>
          <Slider
            {...field}
            value={field.value ?? min}
            min={min}
            max={max}
            step={step}
            marks={marks}
            disabled={disabled}
            valueLabelDisplay={valueLabelDisplay}
            sx={{
              color: '#CC0000',
              '& .MuiSlider-thumb': { width: 16, height: 16 },
            }}
          />
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Box>
      )}
    />
  );
};

export default FormSlider;
