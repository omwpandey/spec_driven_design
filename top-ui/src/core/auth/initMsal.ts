/**
 * MSAL bootstrap.
 *
 * Initializes the singleton MSAL instance, processes any redirect response
 * that is present after returning from Entra, and sets an active account so
 * silent token acquisition works. Call once before rendering the app.
 */

import { EventType, type AuthenticationResult } from '@azure/msal-browser';
import { msalInstance, isEntraConfigured, isEntraAuthEnabled } from './msalConfig';

let initialized = false;

export async function initMsal(): Promise<void> {
  if (initialized) return;
  initialized = true;

  // Nothing to do if Entra isn't configured — let the app boot in a
  // "logged out" state so local dev/tests keep working.
  if (!isEntraAuthEnabled || !isEntraConfigured) return;

  await msalInstance.initialize();

  // Complete a redirect sign-in if we're coming back from Entra.
  const response = await msalInstance.handleRedirectPromise();
  if (response?.account) {
    msalInstance.setActiveAccount(response.account);
  }

  // If we have accounts but no active one (e.g. page reload), pick the first.
  if (!msalInstance.getActiveAccount()) {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
    }
  }

  // Keep the active account in sync on future logins.
  msalInstance.addEventCallback((event) => {
    if (
      (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
      event.payload
    ) {
      const payload = event.payload as AuthenticationResult;
      if (payload.account) {
        msalInstance.setActiveAccount(payload.account);
      }
    }
  });
}
