/**
 * Service Worker Registration
 *
 * Registers the service worker and handles:
 * - First-time install
 * - Update detection with prompt-to-refresh
 * - Registration failures
 */

type SWCallbacks = {
  onInstalled?: () => void;
  onUpdateAvailable?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
};

export function registerServiceWorker(callbacks?: SWCallbacks): void {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  // Only register in production
  if (import.meta.env.DEV) {
    console.log('[SW] Skipping registration in development');
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      // Check for updates periodically (every 60 minutes)
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New version available — notify UI
              callbacks?.onUpdateAvailable?.(registration);
            } else {
              // First install
              callbacks?.onInstalled?.();
            }
          }
        });
      });
    } catch (error) {
      console.error('[SW] Registration failed:', error);
    }
  });
}

/**
 * Signal the service worker to skip waiting and activate immediately
 */
export function skipWaitingAndReload(registration: ServiceWorkerRegistration): void {
  const worker = registration.waiting;
  if (worker) {
    worker.postMessage({ type: 'SKIP_WAITING' });
  }
  globalThis.location.reload();
}
