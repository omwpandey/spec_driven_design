import React from 'react';
import { TextField } from '@mui/material';
import FormFieldWrapper from './FormFieldWrapper';

interface FormTimePickerProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const FormTimePicker: React.FC<FormTimePickerProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  size = 'small',
  fullWidth = true,
}) => {
  return (
    <FormFieldWrapper name={name} label={label} required={required}>
      {({ field, error, hasError }) => (
        <TextField
          {...field}
          type="time"
          size={size}
          fullWidth={fullWidth}
          disabled={disabled}
          error={hasError}
          helperText={error?.message}
          value={field.value || ''}
          slotProps={{
            input: { readOnly },
            inputLabel: { shrink: true },
          }}
        />
      )}
    </FormFieldWrapper>
  );
};

export default FormTimePicker;
