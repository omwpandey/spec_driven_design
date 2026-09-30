// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, { logout, setEntraAuth, setUser, login } from '../slices/authSlice';
import type { User } from '../slices/authSlice';

describe('authSlice', () => {
  const mockUser: User = {
    id: 'U001',
    name: 'Test User',
    email: 'test@test.com',
    role: 'Admin',
    permissions: ['read', 'write', 'delete'],
    dealerCode: 'D001',
    dealerName: 'Test Dealer',
    branchCode: 'B001',
    branchName: 'Test Branch',
  };

  const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe('reducers', () => {
    it('should handle logout', () => {
      const loggedInState = {
        ...initialState,
        user: mockUser,
        accessToken: 'token123',
        refreshToken: 'refresh123',
        isAuthenticated: true,
      };
      localStorage.setItem('accessToken', 'token123');
      localStorage.setItem('refreshToken', 'refresh123');
      localStorage.setItem('tops.auth.user', JSON.stringify(mockUser));

      const state = authReducer(loggedInState, logout());

      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('tops.auth.user')).toBeNull();
    });

    it('should handle setUser', () => {
      const state = authReducer(initialState, setUser(mockUser));
      expect(state.user).toEqual(mockUser);
      expect(state.user?.name).toBe('Test User');
      expect(state.user?.permissions).toContain('read');
    });

    it('persists Entra user details and the access token', () => {
      const state = authReducer(
        initialState,
        setEntraAuth({ user: mockUser, accessToken: 'entra-access-token' }),
      );

      expect(state.isAuthenticated).toBe(true);
      expect(localStorage.getItem('tops.auth.user')).toBe(JSON.stringify(mockUser));
      expect(localStorage.getItem('accessToken')).toBe('entra-access-token');
    });

    it('rehydrates the authenticated user after reload without a token mirror', () => {
      localStorage.setItem('tops.auth.user', JSON.stringify(mockUser));

      const state = authReducer(undefined, { type: 'auth/rehydrate' });

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('login async thunk', () => {
    it('sets loading on pending', () => {
      const state = authReducer(initialState, { type: login.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('sets auth state on fulfilled', () => {
      const payload = {
        user: mockUser,
        accessToken: 'newToken',
        refreshToken: 'newRefresh',
      };
      const state = authReducer(
        { ...initialState, loading: true },
        { type: login.fulfilled.type, payload }
      );
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe('newToken');
      expect(state.refreshToken).toBe('newRefresh');
    });

    it('sets error on rejected', () => {
      const state = authReducer(
        { ...initialState, loading: true },
        { type: login.rejected.type, payload: 'Login failed' }
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Login failed');
    });
  });
});
