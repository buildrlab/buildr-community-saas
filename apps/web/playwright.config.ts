import { defineConfig } from '@playwright/test';

const defaultPort = 3100;
const localBaseURL = `http://localhost:${defaultPort}`;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? localBaseURL;

// If PLAYWRIGHT_BASE_URL is set, we assume the server is already running elsewhere
// (e.g. a deployed preview env) and we should NOT start a local Next dev server.
const shouldStartWebServer = !process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL,
  },
  webServer: shouldStartWebServer
    ? {
        // Use a non-default port to avoid colliding with other local Next.js apps.
        command: `pnpm exec next dev . --port ${defaultPort}`,
        // Always wait for the server we actually start.
        url: localBaseURL,
        // Default to FALSE to prevent accidentally reusing an unrelated server.
        reuseExistingServer: process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === 'true' && !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
