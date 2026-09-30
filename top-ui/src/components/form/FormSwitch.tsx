import React from 'react';
import { Box, Switch, FormControlLabel, Typography, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

interface FormSwitchProps {
  name: string;
  label: string;
  disabled?: boolean;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
}

const FormSwitch: React.FC<FormSwitchProps> = ({
  name,
  label,
  disabled = false,
  labelPlacement = 'end',
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <FormControlLabel
            labelPlacement={labelPlacement}
            control={
              <Switch
                {...field}
                checked={!!field.value}
                disabled={disabled}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#CC0000',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#CC0000',
                  },
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

export default FormSwitch;
