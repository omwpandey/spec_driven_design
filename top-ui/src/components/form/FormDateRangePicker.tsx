import React from 'react';
import { Box, Typography, TextField, Grid } from '@components/common';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from '@hooks';
import { formLabelStyle } from '@core/theme';

interface FormDateRangePickerProps {
  nameFrom: string;
  nameTo: string;
  label: string;
  labelFrom?: string;
  labelTo?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const FormDateRangePicker: React.FC<FormDateRangePickerProps> = ({
  nameFrom,
  nameTo,
  label,
  labelFrom,
  labelTo,
  required = false,
  disabled = false,
  size = 'small',
  fullWidth = true,
}) => {
  const { control } = useFormContext();
  const { t } = useTranslation();

  const fromLabel = labelFrom || t('date_from');
  const toLabel = labelTo || t('date_to');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography variant="body2" sx={{ ...formLabelStyle, color: 'text.primary' }}>
        {label}
        {required && (
          <Typography component="span" color="error" sx={{ ml: 0.5 }}>
            *
          </Typography>
        )}
      </Typography>
      <Grid container spacing={1} sx={{ alignItems: 'center' }}>
        <Grid size={{ xs: 5.5 }}>
          <Controller
            name={nameFrom}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                type="date"
                size={size}
                fullWidth={fullWidth}
                disabled={disabled}
                error={!!error}
                helperText={error?.message}
                value={field.value || ''}
                placeholder={fromLabel}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 1 }}>
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            —
          </Typography>
        </Grid>
        <Grid size={{ xs: 5.5 }}>
          <Controller
            name={nameTo}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                type="date"
                size={size}
                fullWidth={fullWidth}
                disabled={disabled}
                error={!!error}
                helperText={error?.message}
                value={field.value || ''}
                placeholder={toLabel}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormDateRangePicker;
