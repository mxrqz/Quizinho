import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    css: true,
    globals: true,
    exclude: ['**/e2e/**', '**/node_modules/**', '**/.next/**'],
    coverage: {
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'test/',
        '.next/',
        'coverage/',
        '**/*.config.*',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})