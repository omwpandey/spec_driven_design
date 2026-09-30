import React from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

interface RadioOption {
  value: string | number;
  label: string;
}

interface FormRadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  row?: boolean;
  columns?: number;
  /**
   * When true, option labels use fluid (viewport-relative) font sizing and the
   * radio padding / grid gaps are tightened so the group takes less space and
   * scales down with the screen. Used by compact layouts (e.g. Activity Type).
   */
  dense?: boolean;
}

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  name,
  label,
  options,
  required = false,
  disabled = false,
  row = false,
  columns = 3,
  dense = false,
}) => {
  const { control } = useFormContext();

  // Fluid label style for dense mode: shrinks with the viewport (clamp) instead
  // of the fixed theme label size, so the options don't hog horizontal space.
  const optionLabelSx = dense
    ? { fontFamily: 'Prompt', fontWeight: 400, fontSize: 'clamp(0.625rem, 0.85vw, 0.875rem)', lineHeight: 1.25, letterSpacing: '0px' }
    : formLabelStyle;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
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
          {row ? (
            <RadioGroup {...field} row>
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={
                    <Radio
                      size="small"
                      disabled={disabled}
                      sx={{
                        color: '#999999',
                        '&.Mui-checked': { color: '#EB0A1E' },
                        p: 0.5,
                      }}
                    />
                  }
                  label={<Typography variant="body2" sx={optionLabelSx}>{option.label}</Typography>}
                  sx={{ mr: 2 }}
                />
              ))}
            </RadioGroup>
          ) : (
            <RadioGroup {...field}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, auto))',
                    md: `repeat(${columns}, minmax(0, auto))`,
                  },
                  rowGap: dense ? 'clamp(2px, 0.4vw, 8px)' : '8px',
                  columnGap: dense
                    ? { xs: '12px', md: 'clamp(12px, 2vw, 32px)' }
                    : { xs: '16px', md: '32px' },
                }}
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={
                      <Radio
                        size="small"
                        disabled={disabled}
                        sx={{
                          color: '#999999',
                          '&.Mui-checked': { color: '#EB0A1E' },
                          p: dense ? 0.25 : 0.4,
                          '& svg': dense ? { fontSize: 'clamp(0.9rem, 1.3vw, 1.25rem)' } : undefined,
                        }}
                      />
                    }
                    label={<Typography sx={optionLabelSx}>{option.label}</Typography>}
                    sx={{ m: 0 }}
                  />
                ))}
              </Box>
            </RadioGroup>
          )}
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Box>
      )}
    />
  );
};

export default FormRadioGroup;
