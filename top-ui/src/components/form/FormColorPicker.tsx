import React from 'react';
import { TextField, InputAdornment } from '@components/common';
import FormFieldWrapper from './FormFieldWrapper';

interface FormColorPickerProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const FormColorPicker: React.FC<FormColorPickerProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  size = 'small',
  fullWidth = true,
}) => {
  return (
    <FormFieldWrapper name={name} label={label} required={required}>
      {({ field, error, hasError }) => (
        <TextField
          {...field}
          size={size}
          fullWidth={fullWidth}
          disabled={disabled}
          error={hasError}
          helperText={error?.message}
          value={field.value || '#000000'}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <input
                    type="color"
                    value={field.value || '#000000'}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={disabled}
                    style={{
                      width: 24,
                      height: 24,
                      border: '1px solid #E0E0E0',
                      borderRadius: 8,
                      padding: 0,
                      cursor: 'pointer',
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    </FormFieldWrapper>
  );
};

export default FormColorPicker;
