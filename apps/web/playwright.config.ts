import { defineConfig } from '@playwright/test';

const defaultPort = 3100;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${defaultPort}`;

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL,
  },
  webServer: {
    // Use a non-default port to avoid colliding with other local Next.js apps.
    command: `pnpm exec next dev . --port ${defaultPort}`,
    url: baseURL,
    // Default to FALSE to prevent accidentally reusing an unrelated server.
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === 'true' && !process.env.CI,
    timeout: 120_000,
  },
});
