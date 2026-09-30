import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import appReducer from '@store/slices/appSlice';
import configReducer from '@store/slices/configSlice';
import authReducer from '@store/slices/authSlice';
import { usePermission } from '../usePermission';

function createWrapper(permissions: string[] = []) {
  const store = configureStore({
    reducer: { app: appReducer, config: configReducer, auth: authReducer },
    preloadedState: {
      auth: {
        user: {
          id: '1',
          name: 'Test',
          email: 'test@t.com',
          role: 'Admin',
          permissions,
          dealerCode: 'D1',
          dealerName: 'Dealer',
          branchCode: 'B1',
          branchName: 'Branch',
        },
        accessToken: 'token',
        refreshToken: 'refresh',
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(Provider, { store, children });
}

describe('usePermission', () => {
  it('returns hasPermission, hasAllPermissions, permissions', () => {
    const wrapper = createWrapper(['read', 'write']);
    const { result } = renderHook(() => usePermission(), { wrapper });
    expect(result.current.hasPermission).toBeInstanceOf(Function);
    expect(result.current.hasAllPermissions).toBeInstanceOf(Function);
    expect(result.current.permissions).toEqual(['read', 'write']);
  });

  it('hasPermission returns true for existing permission', () => {
    const wrapper = createWrapper(['read', 'write', 'delete']);
    const { result } = renderHook(() => usePermission(), { wrapper });
    expect(result.current.hasPermission('read')).toBe(true);
    expect(result.current.hasPermission('delete')).toBe(true);
  });

  it('hasPermission returns false for missing permission', () => {
    const wrapper = createWrapper(['read']);
    const { result } = renderHook(() => usePermission(), { wrapper });
    expect(result.current.hasPermission('admin')).toBe(false);
  });

  it('hasPermission accepts array and returns true if any match', () => {
    const wrapper = createWrapper(['read', 'write']);
    const { result } = renderHook(() => usePermission(), { wrapper });
    expect(result.current.hasPermission(['admin', 'write'])).toBe(true);
  });

  it('hasPermission with array returns false if none match', () => {
    const wrapper = createWrapper(['read']);
    const { result } = renderHook(() => usePermission(), { wrapper });
    expect(result.current.hasPermission(['admin', 'delete'])).toBe(false);
  });

  it('hasAllPermissions returns true when all present', () => {
    const wrapper = createWrapper(['read', 'write', 'delete']);
    const { result } = renderHook(() => usePermission(), { wrapper });
    expect(result.current.hasAllPermissions(['read', 'write'])).toBe(true);
  });

  it('hasAllPermissions returns false when some missing', () => {
    const wrapper = createWrapper(['read']);
    const { result } = renderHook(() => usePermission(), { wrapper });
    expect(result.current.hasAllPermissions(['read', 'write'])).toBe(false);
  });

  it('handles null user (no permissions)', () => {
    const store = configureStore({
      reducer: { app: appReducer, config: configReducer, auth: authReducer },
      preloadedState: {
        auth: {
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        },
      },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Provider, { store, children });
    const { result } = renderHook(() => usePermission(), { wrapper });
    expect(result.current.permissions).toEqual([]);
    expect(result.current.hasPermission('read')).toBe(false);
  });
});
