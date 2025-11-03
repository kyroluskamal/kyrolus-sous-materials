/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    poolOptions: {
      threads: { singleThread: true },
    },
    coverage: { provider: 'v8' },
  },
});
