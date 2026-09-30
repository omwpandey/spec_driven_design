/**
 * useFormErrorHandler Hook
 *
 * Integrates server-side validation errors with react-hook-form.
 * Maps API validation errors to form field errors.
 *
 * Usage:
 *   const { handleSubmitError, serverErrors } = useFormErrorHandler(form);
 *   try { await api.post(...) } catch(e) { handleSubmitError(e); }
 */

import { useCallback, useState } from 'react';
import { UseFormSetError, FieldValues, Path } from 'react-hook-form';
import { AppError, ValidationError } from '@core/errors';
import { normalizeError, getValidationErrors } from '@core/errors';

interface FormErrorHandlerResult<T extends FieldValues> {
  handleSubmitError: (error: unknown) => AppError;
  serverErrors: ValidationError[];
  generalError: string | null;
  clearServerErrors: () => void;
}

export function useFormErrorHandler<T extends FieldValues>(
  setError: UseFormSetError<T>
): FormErrorHandlerResult<T> {
  const [serverErrors, setServerErrors] = useState<ValidationError[]>([]);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmitError = useCallback(
    (error: unknown): AppError => {
      const appError = normalizeError(error);

      // Extract field-level validation errors
      const validationErrors = getValidationErrors(appError);

      if (validationErrors.length > 0) {
        setServerErrors(validationErrors);

        // Set react-hook-form errors for each field
        validationErrors.forEach((ve) => {
          setError(ve.field as Path<T>, {
            type: 'server',
            message: ve.message,
          });
        });
      } else {
        // No field-level errors, show as general form error
        setGeneralError(appError.userMessage);
      }

      return appError;
    },
    [setError]
  );

  const clearServerErrors = useCallback(() => {
    setServerErrors([]);
    setGeneralError(null);
  }, []);

  return {
    handleSubmitError,
    serverErrors,
    generalError,
    clearServerErrors,
  };
}
