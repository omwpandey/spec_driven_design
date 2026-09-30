import React from 'react';
import { TextField, InputAdornment, LinkIcon } from '@components/common';
import FormFieldWrapper from './FormFieldWrapper';

interface FormUrlFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const FormUrlField: React.FC<FormUrlFieldProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = 'https://',
  size = 'small',
  fullWidth = true,
}) => {
  return (
    <FormFieldWrapper name={name} label={label} required={required}>
      {({ field, error, hasError }) => (
        <TextField
          {...field}
          type="url"
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
                  <LinkIcon sx={{ fontSize: 18, color: '#999999' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    </FormFieldWrapper>
  );
};

export default FormUrlField;
