import React, { useRef } from 'react';
import { Box, Typography, TextField, FormHelperText } from '@components/common';
import { Controller, useFormContext } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

interface FormOtpInputProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  length?: number;
}

const FormOtpInput: React.FC<FormOtpInputProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  length = 6,
}) => {
  const { control } = useFormContext();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value: string = field.value || '';
        const digits = value.split('').concat(new Array(length - value.length).fill(''));

        const handleChange = (index: number, char: string) => {
          if (char.length > 1) char = char[0];
          if (char && !/^\d$/.test(char)) return;

          const newDigits = [...digits];
          newDigits[index] = char;
          const newValue = newDigits.join('').slice(0, length);
          field.onChange(newValue);

          // Move focus to next input
          if (char && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
          }
        };

        const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
          if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
          }
        };

        const handlePaste = (e: React.ClipboardEvent) => {
          e.preventDefault();
          const pasted = e.clipboardData.getData('text').replaceAll(/\D/g, '').slice(0, length);
          field.onChange(pasted);
          const focusIndex = Math.min(pasted.length, length - 1);
          inputRefs.current[focusIndex]?.focus();
        };

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2" color={error ? 'error' : 'text.primary'} sx={formLabelStyle}>
              {label}
              {required && (
                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              )}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {digits.slice(0, length).map((digit, index) => (
                <TextField
                  key={index}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={disabled}
                  inputRef={(el) => { inputRefs.current[index] = el; }}
                  size="small"
                  error={!!error}
                  slotProps={{
                    htmlInput: {
                      maxLength: 1,
                      style: { textAlign: 'center', fontSize: '1.125rem', fontWeight: 600, width: 36 },
                    },
                  }}
                />
              ))}
            </Box>
            {error && <FormHelperText error>{error.message}</FormHelperText>}
          </Box>
        );
      }}
    />
  );
};

export default FormOtpInput;
