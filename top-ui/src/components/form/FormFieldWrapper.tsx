import React from 'react';
import { Box, Typography } from '@components/common';
import { Controller, useFormContext, ControllerRenderProps, FieldValues } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

export interface FormFieldWrapperProps {
  name: string;
  label: string;
  required?: boolean;
  children: (props: {
    field: ControllerRenderProps<FieldValues, string>;
    error: { message?: string } | undefined;
    hasError: boolean;
  }) => React.ReactNode;
}

/**
 * Shared wrapper for form fields that provides:
 * - react-hook-form Controller integration
 * - Consistent label rendering with required asterisk
 * - Standardized layout structure
 *
 * Use this to avoid duplicating Controller/label/error patterns
 * across individual form field components.
 */
const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  name,
  label,
  required = false,
  children,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography
            variant="body2"
            color={error ? 'error' : 'text.primary'}
            sx={formLabelStyle}
          >
            {label}
            {required && (
              <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                *
              </Typography>
            )}
          </Typography>
          {children({ field, error, hasError: !!error })}
        </Box>
      )}
    />
  );
};

export default FormFieldWrapper;
