/**
 * Route Guard (ProtectedRoute)
 *
 * Wraps routes that require authentication and/or specific permissions.
 * Redirects unauthenticated users to login.
 * Shows 403 for unauthorized (missing permissions).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Alert, Box, CircularProgress } from '@components/common';
import { InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store';
import { useTranslation } from '@hooks';
import { isEntraAuthEnabled, isEntraConfigured, loginRequest } from './msalConfig';

interface RouteGuardProps {
  /** Required permission(s) to access the route */
  requiredPermission?: string | string[];
  /** Redirect path for unauthorized users (has auth but no permission) */
  unauthorizedPath?: string;
  /** Custom children (optional — falls back to Outlet) */
  children?: React.ReactNode;
}

/**
 * Usage in router:
 *
 * {
 *   element: <RouteGuard requiredPermission="ACTIVITY_VIEW" />,
 *   children: [
 *     { path: 'activity-setup', element: <ActivitySetupPage /> }
 *   ]
 * }
 */
const RouteGuard: React.FC<RouteGuardProps> = ({
  requiredPermission,
  unauthorizedPath = '/unauthorized',
  children,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();
  const { t } = useTranslation();
  const location = useLocation();
  const loginStarted = useRef(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (
      !isEntraAuthEnabled ||
      !isEntraConfigured ||
      isAuthenticated ||
      inProgress !== InteractionStatus.None ||
      loginStarted.current
    ) {
      return;
    }

    loginStarted.current = true;
    const returnTo = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
    void instance.loginRedirect({ ...loginRequest, redirectStartPage: returnTo }).catch((error: unknown) => {
      loginStarted.current = false;
      setLoginError(error instanceof Error ? error.message : 'Microsoft sign-in could not be started.');
    });
  }, [inProgress, instance, isAuthenticated, location.hash, location.pathname, location.search]);

  if (!isEntraAuthEnabled) {
    return <>{children || <Outlet />}</>;
  }

  if (!isEntraConfigured) {
    return <Alert severity="error">{t('auth_entra_not_configured')}</Alert>;
  }

  if (loginError) {
    return <Alert severity="error">{loginError}</Alert>;
  }

  // Start Entra sign-in directly from the requested route.
  if (!isAuthenticated || !user) {
    return (
      <Box
        role="status"
        aria-label="Signing in"
        sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  // Check permissions if specified
  if (requiredPermission) {
    const permissions = user?.permissions || [];
    const required: string[] = Array.isArray(requiredPermission)
      ? requiredPermission
      : [requiredPermission];
    const hasPermission = required.every((p: string) => permissions.includes(p));

    if (!hasPermission) {
      return <Navigate to={unauthorizedPath} replace />;
    }
  }

  // Authorized
  return <>{children || <Outlet />}</>;
};

export default RouteGuard;
