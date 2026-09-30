import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@components': path.resolve(__dirname, './src/components'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@app': path.resolve(__dirname, './src/app'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    include: ['src/**/*.test.{ts,tsx}'],
    reporters: ['default', 'junit'],
    // Pre-bundle the MUI dependency tree with esbuild once, instead of letting
    // Vitest transform + import it inside every worker for every test file.
    // MUI (@mui/material + @emotion) is large; without this the suite spent
    // hundreds of seconds of aggregate import/transform time, which starved
    // workers and pushed individual tests past the default 5s test timeout,
    // producing sporadic "failures" that actually passed when run in isolation.
    deps: {
      optimizer: {
        web: {
          enabled: true,
          include: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
    // Safety net for slow-but-correct component renders under parallel load.
    testTimeout: 20000,
    hookTimeout: 20000,
    coverage: {
      provider: 'v8',
      clean: false,
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        // Test files
        '**/*.test.*',
        '**/*.spec.*',
        '**/__tests__/**',
        'src/tests/**',
        'src/mocks/**',

        // Type definitions & barrel exports
        '**/*.d.ts',
        'src/vite-env.d.ts',

        // Style files (static sx/CSS objects, no logic to test)
        '**/*.styles.{ts,tsx}',
        '**/styles/**',

        // Translation files (static dictionaries + translation utilities)
        'src/core/languages/**',

        // Static data / config (no logic to test)
        'src/core/theme/**',
        'src/core/constants/**',
        'src/core/pwa/**',

        // App entry points & providers (integration-level, not unit-testable)
        'src/main.tsx',
        'src/App.tsx',
        'src/app/router/**',
        'src/app/providers/**',

        // Type-only files (no runtime code)
        'src/core/errors/types.ts',
        'src/core/manifest/types.ts',

        // Index re-export barrels (no logic)
        'src/core/errors/index.ts',
        'src/core/manifest/index.ts',
        'src/core/hooks/index.ts',
        'src/components/common/index.ts',
        'src/components/form/index.ts',
        'src/components/layout/index.ts',
        'src/components/table/index.ts',
        'src/app/store/index.ts',

        // API config (side-effect heavy, needs integration test)
        'src/core/api/axios.ts',
        'src/core/api/endpoints.ts',
        'src/core/api/index.ts',

        // Context providers (need full React tree, tested via integration)
        'src/core/errors/ErrorContext.tsx',
        'src/core/errors/GlobalErrorToast.tsx',
        'src/core/errors/NetworkStatusBanner.tsx',
        'src/core/featureFlags/**',

        // Module pages (tested at integration/E2E level)
        'src/modules/demo/**',
      ],
      thresholds: {
        statements: 50,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
  },
});
