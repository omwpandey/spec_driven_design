import React from 'react';
import { Box, Typography, FormControlLabel, Checkbox, FormHelperText, FormGroup } from '@components/common';
import { Controller, useFormContext } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

interface CheckboxOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface FormCheckboxGroupProps {
  name: string;
  label?: string;
  options: CheckboxOption[];
  required?: boolean;
  disabled?: boolean;
  row?: boolean;
  columns?: number;
}

const FormCheckboxGroup: React.FC<FormCheckboxGroupProps> = ({
  name,
  label,
  options,
  required = false,
  disabled = false,
  row = false,
  columns,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedValues: (string | number)[] = field.value || [];

        const handleToggle = (value: string | number) => {
          const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
          field.onChange(newValues);
        };

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {label && (
              <Typography variant="body2" color={error ? 'error' : 'text.primary'} sx={formLabelStyle}>
                {label}
                {required && (
                  <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                    *
                  </Typography>
                )}
              </Typography>
            )}
            <FormGroup
              row={row && !columns}
              sx={
                columns
                  ? { display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '2px 16px' }
                  : undefined
              }
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedValues.includes(option.value)}
                      onChange={() => handleToggle(option.value)}
                      disabled={disabled || option.disabled}
                      sx={{
                        color: '#CC0000',
                        '&.Mui-checked': { color: '#CC0000' },
                        p: 0.4,
                      }}
                    />
                  }
                  label={<Typography variant="body2" sx={formLabelStyle}>{option.label}</Typography>}
                  sx={{ m: 0 }}
                />
              ))}
            </FormGroup>
            {error && <FormHelperText error>{error.message}</FormHelperText>}
          </Box>
        );
      }}
    />
  );
};

export default FormCheckboxGroup;
