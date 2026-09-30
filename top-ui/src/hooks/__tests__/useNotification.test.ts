import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import appReducer from '@store/slices/appSlice';
import configReducer from '@store/slices/configSlice';
import authReducer from '@store/slices/authSlice';
import { useNotification } from '../useNotification';

function createWrapper() {
  const store = configureStore({
    reducer: { app: appReducer, config: configReducer, auth: authReducer },
  });
  return {
    wrapper: ({ children }: { children: React.ReactNode }) =>
      React.createElement(Provider, { store, children }),
    store,
  };
}

describe('useNotification', () => {
  it('returns notify methods', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useNotification(), { wrapper });
    expect(result.current.success).toBeInstanceOf(Function);
    expect(result.current.error).toBeInstanceOf(Function);
    expect(result.current.warning).toBeInstanceOf(Function);
    expect(result.current.info).toBeInstanceOf(Function);
  });

  it('dispatches success notification', () => {
    const { wrapper, store } = createWrapper();
    const { result } = renderHook(() => useNotification(), { wrapper });
    act(() => {
      result.current.success('Operation completed');
    });
    const state = store.getState();
    expect(state.app.notifications).toHaveLength(1);
    expect(state.app.notifications[0].type).toBe('success');
    expect(state.app.notifications[0].message).toBe('Operation completed');
  });

  it('dispatches error notification', () => {
    const { wrapper, store } = createWrapper();
    const { result } = renderHook(() => useNotification(), { wrapper });
    act(() => {
      result.current.error('Something failed');
    });
    const state = store.getState();
    expect(state.app.notifications[0].type).toBe('error');
  });

  it('dispatches warning notification', () => {
    const { wrapper, store } = createWrapper();
    const { result } = renderHook(() => useNotification(), { wrapper });
    act(() => {
      result.current.warning('Be careful');
    });
    const state = store.getState();
    expect(state.app.notifications[0].type).toBe('warning');
  });

  it('dispatches info notification', () => {
    const { wrapper, store } = createWrapper();
    const { result } = renderHook(() => useNotification(), { wrapper });
    act(() => {
      result.current.info('FYI');
    });
    const state = store.getState();
    expect(state.app.notifications[0].type).toBe('info');
  });
});
