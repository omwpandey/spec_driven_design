/**
 * useEntraAuth
 *
 * Bridges MSAL (Microsoft Entra ID) state into the app's existing Redux auth
 * slice. When an MSAL account is present, it maps the account/claims into the
 * app `User` shape and dispatches `setEntraAuth`. When no account is present,
 * it clears auth state.
 *
 * This lets the rest of the app (RouteGuard, axios interceptor) keep reading
 * `state.auth.isAuthenticated` and `localStorage.accessToken` unchanged.
 */

import { useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { type AccountInfo } from '@azure/msal-browser';
import { useAppDispatch } from '@store';
import { setEntraAuth, logout } from '@store/slices/authSlice';
import type { User } from '@store/slices/authSlice';

/** ID token claims we may receive from Entra. */
interface EntraClaims {
  oid?: string;
  sub?: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  roles?: string[];
  [key: string]: unknown;
}

/** Maps an MSAL account into the app's User model. */
export function mapAccountToUser(account: AccountInfo): User {
  const claims = (account.idTokenClaims ?? {}) as EntraClaims;
  const roles = claims.roles ?? [];
  return {
    id: claims.oid ?? claims.sub ?? account.localAccountId ?? account.homeAccountId,
    name: account.name ?? claims.name ?? '',
    email: account.username ?? claims.preferred_username ?? claims.email ?? '',
    role: roles[0] ?? '',
    // Entra app roles double as the app's permission list.
    permissions: roles,
    dealerCode: '',
    dealerName: '',
    branchCode: '',
    branchName: '',
  };
}

export function useEntraAuth(): { isAuthenticated: boolean } {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const account = instance.getActiveAccount() ?? accounts[0];

    if (!account) {
      dispatch(logout());
      return;
    }

    const user = mapAccountToUser(account);
    dispatch(setEntraAuth({ user, accessToken: null }));
    // Re-sync whenever MSAL auth state or the account set changes.
  }, [instance, accounts, isAuthenticated, dispatch]);

  return { isAuthenticated };
}
