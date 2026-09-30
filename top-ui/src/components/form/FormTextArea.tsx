import React from 'react';
import { TextField } from '@mui/material';
import FormFieldWrapper from './FormFieldWrapper';

interface FormTextAreaProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  showCharCount?: boolean;
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder,
  maxLength,
  rows = 4,
  minRows,
  maxRows,
  size = 'small',
  fullWidth = true,
  showCharCount = false,
}) => {
  return (
    <FormFieldWrapper name={name} label={label} required={required}>
      {({ field, error, hasError }) => (
        <TextField
          {...field}
          multiline
          rows={!minRows ? rows : undefined}
          minRows={minRows}
          maxRows={maxRows}
          size={size}
          fullWidth={fullWidth}
          placeholder={placeholder}
          disabled={disabled}
          error={hasError}
          helperText={
            error?.message ||
            (showCharCount && maxLength
              ? `${(field.value || '').length}/${maxLength}`
              : undefined)
          }
          slotProps={{
            input: { readOnly },
            htmlInput: { maxLength },
          }}
        />
      )}
    </FormFieldWrapper>
  );
};

export default FormTextArea;
