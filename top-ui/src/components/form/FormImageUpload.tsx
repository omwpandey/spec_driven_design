import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, IconButton, UploadIcon, DeleteIcon, CameraIcon } from '@components/common';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

interface FormImageUploadProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  maxFileSize?: number; // in MB
  accept?: string;
  previewSize?: number;
  shape?: 'circle' | 'square';
}

const FormImageUpload: React.FC<FormImageUploadProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  maxFileSize = 5,
  accept = 'image/jpeg,image/png,image/gif,image/webp',
  previewSize = 100,
  shape = 'square',
}) => {
  const { control, setError, clearErrors } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fieldValue = useWatch({ control, name });
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (fieldValue instanceof File) {
      const url = URL.createObjectURL(fieldValue);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof fieldValue === 'string' && fieldValue) {
      setPreview(fieldValue);
    } else {
      setPreview(null);
    }
  }, [fieldValue]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          clearErrors(name);

          if (!file) return;

          if (file.size > maxFileSize * 1024 * 1024) {
            setError(name, { message: `Image exceeds max size of ${maxFileSize}MB` });
            return;
          }

          field.onChange(file);
          if (fileInputRef.current) fileInputRef.current.value = '';
        };

        const handleRemove = () => {
          field.onChange(null);
          setPreview(null);
        };

        return (
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

            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
              {/* Preview */}
              <Box
                sx={{
                  width: previewSize,
                  height: previewSize,
                  borderRadius: shape === 'circle' ? '50%' : 1,
                  border: `2px dashed ${error ? '#D32F2F' : '#E0E0E0'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: disabled ? 'default' : 'pointer',
                  backgroundColor: '#FAFAFA',
                  '&:hover': disabled ? {} : { borderColor: '#BDBDBD' },
                }}
                onClick={() => !disabled && fileInputRef.current?.click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <CameraIcon sx={{ fontSize: 28, color: '#BDBDBD' }} />
                )}
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  sx={{ border: '1px solid #E0E0E0', borderRadius: 1, p: 0.5 }}
                >
                  <UploadIcon sx={{ fontSize: 16 }} />
                </IconButton>
                {preview && (
                  <IconButton
                    size="small"
                    onClick={handleRemove}
                    disabled={disabled}
                    sx={{ border: '1px solid #E0E0E0', borderRadius: 1, p: 0.5 }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {error && (
              <Typography variant="caption" color="error">
                {error.message}
              </Typography>
            )}
          </Box>
        );
      }}
    />
  );
};

export default FormImageUpload;
