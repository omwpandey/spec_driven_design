/**
 * App Providers
 *
 * Root provider component — wraps the application with all necessary
 * providers in the correct order:
 *
 * 1. Redux Store (State & Data Layer)
 * 2. MUI Theme (Design System)
 * 3. Feature Flags (Cross-Cutting Platform)
 * 4. Error Boundary (Shell & Routing → Error boundaries)
 * 5. Error Provider (Cross-Cutting Platform → Error Handling)
 * 6. Router (Shell & Routing)
 */

import React from 'react';
import { Provider } from 'react-redux';
import { MsalProvider } from '@azure/msal-react';
import { ThemeProvider, CssBaseline } from '@components/common';
import { RouterProvider } from 'react-router-dom';
import { store } from '@store';
import { theme } from '@core/theme';
import { router } from '@app/router';
import { AuthSync, msalInstance } from '@core/auth';
import ErrorBoundary from '@components/common/ErrorBoundary';
import { ErrorProvider } from '@core/errors/ErrorContext';
import GlobalErrorToast from '@core/errors/GlobalErrorToast';
import NetworkStatusBanner from '@core/errors/NetworkStatusBanner';
import { FeatureFlagProvider } from '@core/featureFlags';

const handleAuthError = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const AppProviders: React.FC = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <Provider store={store}>
        <AuthSync />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <FeatureFlagProvider>
            <ErrorBoundary level="app">
              <ErrorProvider onAuthError={handleAuthError}>
                <NetworkStatusBanner />
                <GlobalErrorToast />
                <RouterProvider router={router} />
              </ErrorProvider>
            </ErrorBoundary>
          </FeatureFlagProvider>
        </ThemeProvider>
      </Provider>
    </MsalProvider>
  );
};

export default AppProviders;
