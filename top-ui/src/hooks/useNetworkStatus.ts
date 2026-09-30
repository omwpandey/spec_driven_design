/**
 * useNetworkStatus Hook
 *
 * Provides reactive network status information.
 * Tracks online/offline state and connection quality.
 *
 * Usage:
 *   const { isOnline, isSlowConnection, connectionType } = useNetworkStatus();
 */

import { useState, useEffect, useCallback } from 'react';
import { NetworkStatus } from '@core/errors';

export function useNetworkStatus(): NetworkStatus & { wasOffline: boolean } {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    lastChecked: new Date().toISOString(),
  });
  const [wasOffline, setWasOffline] = useState(false);

  const updateStatus = useCallback(() => {
    setStatus((prev) => ({
      ...prev,
      isOnline: navigator.onLine,
      lastChecked: new Date().toISOString(),
    }));
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setWasOffline(true);
      updateStatus();
      // Clear wasOffline flag after a short time
      setTimeout(() => setWasOffline(false), 5000);
    };

    const handleOffline = () => {
      updateStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitor connection quality
    if ('connection' in navigator) {
      const connection = (navigator as unknown as { connection: { effectiveType?: string; downlink?: number; addEventListener: (e: string, fn: () => void) => void; removeEventListener: (e: string, fn: () => void) => void } }).connection;

      const handleConnectionChange = () => {
        const isSlow = connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g' || (connection.downlink !== undefined && connection.downlink < 1);
        setStatus((prev) => ({
          ...prev,
          isSlowConnection: isSlow,
          connectionType: connection.effectiveType,
          downlinkSpeed: connection.downlink,
          lastChecked: new Date().toISOString(),
        }));
      };

      handleConnectionChange();
      connection.addEventListener('change', handleConnectionChange);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [updateStatus]);

  return { ...status, wasOffline };
}
