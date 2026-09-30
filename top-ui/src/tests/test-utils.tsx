import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@components/common';
import { FormProvider, useForm } from 'react-hook-form';
import { theme } from '@core/theme';

const ThemeOnlyProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export const renderWithTheme = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: ThemeOnlyProviders, ...options });

// Form wrapper for form component tests
const FormWrapper: React.FC<{ children: React.ReactNode; defaultValues?: Record<string, any> }> = ({
  children,
  defaultValues = {},
}) => {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

// Render a form component with all needed providers
export const renderFormComponent = (
  ui: React.ReactElement,
  defaultValues: Record<string, any> = {}
) => {
  return render(
    <ThemeOnlyProviders>
      <FormWrapper defaultValues={defaultValues}>{ui}</FormWrapper>
    </ThemeOnlyProviders>
  );
};

export * from '@testing-library/react';
