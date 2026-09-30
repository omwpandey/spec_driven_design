import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

const hasWindow = typeof window !== 'undefined';
const hasDocument = typeof document !== 'undefined';

// Mock MUI getScrollbarSize to prevent documentElement errors in jsdom
vi.mock('@mui/utils/getScrollbarSize', () => ({
  default: () => 0,
  __esModule: true,
}));

if (hasWindow) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: class MockIntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  });

  window.scrollTo = (() => undefined) as typeof window.scrollTo;

  URL.createObjectURL = (() => 'mock-url') as typeof URL.createObjectURL;
  URL.revokeObjectURL = (() => undefined) as typeof URL.revokeObjectURL;

  window.getComputedStyle = vi.fn(() => ({
    getPropertyValue: () => undefined,
    overflow: 'visible',
    paddingRight: '0px',
    paddingLeft: '0px',
  })) as unknown as typeof window.getComputedStyle;

  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 1024,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: 768,
  });
}

if (hasDocument && document.documentElement) {
  Object.defineProperty(document.documentElement, 'clientWidth', {
    configurable: true,
    value: 1024,
  });
  Object.defineProperty(document.documentElement, 'clientHeight', {
    configurable: true,
    value: 768,
  });
}