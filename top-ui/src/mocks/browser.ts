/**
 * MSW Browser Worker (for development mock API)
 *
 * Usage in main.tsx (dev only):
 *   if (import.meta.env.DEV) {
 *     const { worker } = await import('./mocks/browser');
 *     await worker.start({ onUnhandledRequest: 'bypass' });
 *   }
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
