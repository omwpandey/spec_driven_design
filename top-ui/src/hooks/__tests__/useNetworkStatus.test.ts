import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNetworkStatus } from '../useNetworkStatus';

describe('useNetworkStatus', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
  });

  it('returns initial online status', () => {
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isOnline).toBe(true);
    expect(result.current.isSlowConnection).toBe(false);
    expect(result.current.wasOffline).toBe(false);
    expect(result.current.lastChecked).toBeDefined();
  });

  it('updates status when going offline', () => {
    const { result } = renderHook(() => useNetworkStatus());
    act(() => {
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current.isOnline).toBe(false);
  });

  it('sets wasOffline flag when coming back online', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useNetworkStatus());

    act(() => {
      Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current.wasOffline).toBe(true);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.wasOffline).toBe(false);
    vi.useRealTimers();
  });

  it('cleans up event listeners on unmount', () => {
    const removeListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useNetworkStatus());
    unmount();
    expect(removeListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    removeListenerSpy.mockRestore();
  });

  it('detects slow connection via navigator.connection', () => {
    const changeListeners: Array<() => void> = [];
    const mockConnection = {
      effectiveType: '2g',
      downlink: 0.5,
      addEventListener: (event: string, fn: () => void) => { changeListeners.push(fn); },
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(navigator, 'connection', { value: mockConnection, configurable: true });

    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isSlowConnection).toBe(true);

    // Clean up
    delete (navigator as any).connection;
  });

  it('detects fast connection via navigator.connection', () => {
    const mockConnection = {
      effectiveType: '4g',
      downlink: 10,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(navigator, 'connection', { value: mockConnection, configurable: true });

    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isSlowConnection).toBe(false);

    delete (navigator as any).connection;
  });

  it('detects slow-2g as slow connection', () => {
    const mockConnection = {
      effectiveType: 'slow-2g',
      downlink: 0.2,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(navigator, 'connection', { value: mockConnection, configurable: true });

    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isSlowConnection).toBe(true);

    delete (navigator as any).connection;
  });

  it('responds to connection change events', () => {
    const changeListeners: Array<() => void> = [];
    const mockConnection = {
      effectiveType: '4g',
      downlink: 10,
      addEventListener: (_event: string, fn: () => void) => { changeListeners.push(fn); },
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(navigator, 'connection', { value: mockConnection, configurable: true });

    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isSlowConnection).toBe(false);

    // Simulate connection degradation
    act(() => {
      mockConnection.effectiveType = '2g';
      mockConnection.downlink = 0.3;
      changeListeners.forEach(fn => fn());
    });
    expect(result.current.isSlowConnection).toBe(true);

    delete (navigator as any).connection;
  });

  it('cleans up connection listener on unmount', () => {
    const mockConnection = {
      effectiveType: '4g',
      downlink: 10,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(navigator, 'connection', { value: mockConnection, configurable: true });

    const { unmount } = renderHook(() => useNetworkStatus());
    unmount();
    expect(mockConnection.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    delete (navigator as any).connection;
  });
});
