import React from 'react';
import { Box, Checkbox, FormControlLabel, Typography, FormHelperText } from '@components/common';
import { Controller, useFormContext } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

interface FormCheckboxProps {
  name: string;
  label: string;
  disabled?: boolean;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({ name, label, disabled = false }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={!!field.value}
                disabled={disabled}
                size="small"
                sx={{
                  color: '#CC0000',
                  '&.Mui-checked': { color: '#CC0000' },
                }}
              />
            }
            label={<Typography variant="body2" sx={formLabelStyle}>{label}</Typography>}
          />
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Box>
      )}
    />
  );
};

export default FormCheckbox;
