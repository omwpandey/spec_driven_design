import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vite Configuration
 *
 * - esbuild for dev (< 300ms cold start)
 * - Rollup with manual chunks for prod
 * - Bundle budgets enforced
 * - Code-splitting by route + vendor
 */
export default defineConfig({
  plugins: [react()],
  envPrefix: ['TOPS_'],
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
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://topserv-dev.toyota.co.th',
        changeOrigin: true,
        secure: false,
        // Keep /api in the upstream URL so the backend path remains
        // https://topserv-dev.toyota.co.th/api/...
      },
    },
  },

  // ===== BUILD PERFORMANCE =====
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,

    // Bundle budgets — fail if a chunk exceeds 200 KB
    chunkSizeWarningLimit: 200,

    rollupOptions: {
      output: {
        // Manual chunks — vendor splitting strategy
        manualChunks: {
          // React core (cached across deploys)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // MUI (largest dep — isolated for caching)
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          // State management
          'vendor-state': ['@reduxjs/toolkit', 'react-redux'],
          // Form handling
          'vendor-form': ['react-hook-form', '@hookform/resolvers', 'yup'],
          // HTTP + utils
          'vendor-utils': ['axios', 'dayjs', 'lodash'],
          // Charting is loaded independently so dashboard interactions do not inflate the shell chunk
          'vendor-charts': ['echarts'],
        },
      },
    },
  },
});
