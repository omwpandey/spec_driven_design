import React from 'react';
import { TextField } from '@components/common';
import FormFieldWrapper from './FormFieldWrapper';

interface FormDatePickerProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  min?: string;
  max?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  min,
  max,
  size = 'small',
  fullWidth = true,
}) => {
  return (
    <FormFieldWrapper name={name} label={label} required={required}>
      {({ field, error, hasError }) => (
        <TextField
          {...field}
          type="date"
          size={size}
          fullWidth={fullWidth}
          disabled={disabled}
          error={hasError}
          helperText={error?.message}
          value={field.value || ''}
          slotProps={{
            input: { readOnly },
            htmlInput: { min, max },
            inputLabel: { shrink: true },
          }}
        />
      )}
    </FormFieldWrapper>
  );
};

export default FormDatePicker;
