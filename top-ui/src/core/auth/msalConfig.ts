/**
 * MSAL (Microsoft Entra ID / Azure AD) configuration.
 *
 * Reads settings from Vite env vars (see .env.example). A single
 * PublicClientApplication instance is created and reused across the app
 * (provider, hooks, and the axios interceptor).
 */

import {
  PublicClientApplication,
  LogLevel,
  type Configuration,
  type IPublicClientApplication,
  type PopupRequest,
  type RedirectRequest,
  type SilentRequest,
} from '@azure/msal-browser';

const clientId = import.meta.env.TOPS_AUTH_ID;
const tenantId = import.meta.env.TOPS_TENANT_ID || 'common';
const redirectUri = import.meta.env.DEV
  ? window.location.origin
  : import.meta.env.TOPS_REDIRECT_URL || window.location.origin;
const postLogoutRedirectUri = import.meta.env.DEV
  ? `${window.location.origin}/`
  : import.meta.env.TOPS_POST_LOGOUT_REDIRECT_URI || `${window.location.origin}/`;
export const isEntraAuthEnabled = import.meta.env.TOPS_ENABLE_AUTH === 'true';

/**
 * True when the required Entra settings are present. When false, the app still
 * boots but SSO is effectively disabled (login page shows a config warning).
 * This keeps local dev / tests working without real credentials.
 */
export const isEntraConfigured = Boolean(clientId);

export const msalConfig: Configuration = {
  auth: {
    clientId: clientId ?? '',
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
    postLogoutRedirectUri,
  },
  cache: {
    // localStorage keeps the session across tabs and reloads. It also matches
    // the existing app convention of reading tokens from localStorage.
    cacheLocation: 'localStorage',
  },
  system: {
    loggerOptions: {
      logLevel: import.meta.env.DEV ? LogLevel.Warning : LogLevel.Error,
      piiLoggingEnabled: false,
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        // Route MSAL logs through console only in dev to avoid noise in prod.
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.debug(`[MSAL] ${LogLevel[level]}: ${message}`);
        }
      },
    },
  },
};

/** Scopes requested at sign-in (identity/OIDC). */
export const loginRequest: PopupRequest & RedirectRequest = {
  scopes: ['openid', 'profile', 'email'],
};

/** Space-separated API scope(s) used to acquire an access token for the backend. */
export const apiScopes: string[] = (import.meta.env.TOPS_API_SCOPE || '')
  .split(' ')
  .map((s: string) => s.trim())
  .filter(Boolean);

/** Request used by the axios interceptor to silently acquire an API token. */
export const apiTokenRequest: Omit<SilentRequest, 'account'> = {
  scopes: apiScopes.length > 0 ? apiScopes : loginRequest.scopes,
};

/** Acquire an API token silently; the caller decides how to handle interaction errors. */
export async function acquireApiToken(instance: IPublicClientApplication): Promise<string> {
  const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0];
  if (!account) {
    throw new Error('No authenticated Microsoft account');
  }

  const result = await instance.acquireTokenSilent({ ...apiTokenRequest, account });
  return result.accessToken;
}

/**
 * Singleton MSAL instance. Must be `.initialize()`-ed before use (done in
 * main.tsx before render). Import this everywhere instead of constructing new
 * instances.
 */
export const msalInstance = new PublicClientApplication(msalConfig);
