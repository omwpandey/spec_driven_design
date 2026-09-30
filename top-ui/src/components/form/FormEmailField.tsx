import React from 'react';
import { TextField, InputAdornment, EmailIcon } from '@components/common';
import FormFieldWrapper from './FormFieldWrapper';

interface FormEmailFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const FormEmailField: React.FC<FormEmailFieldProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = 'email@example.com',
  size = 'small',
  fullWidth = true,
}) => {
  return (
    <FormFieldWrapper name={name} label={label} required={required}>
      {({ field, error, hasError }) => (
        <TextField
          {...field}
          type="email"
          size={size}
          fullWidth={fullWidth}
          placeholder={placeholder}
          disabled={disabled}
          error={hasError}
          helperText={error?.message}
          slotProps={{
            input: {
              readOnly,
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ fontSize: 18, color: '#999999' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    </FormFieldWrapper>
  );
};

export default FormEmailField;
