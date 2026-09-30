/**
 * MSW Server (for unit/integration tests)
 *
 * Usage in test setup:
 *   import { server } from '@/mocks/server';
 *   beforeAll(() => server.listen());
 *   afterEach(() => server.resetHandlers());
 *   afterAll(() => server.close());
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
