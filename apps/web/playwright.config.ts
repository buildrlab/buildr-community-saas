import { defineConfig } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultPort = 3100;
const localBaseURL = `http://localhost:${defaultPort}`;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? localBaseURL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        // Ensure `next dev .` runs from apps/web even when invoked from repo root.
        cwd: __dirname,
        // Always wait for the server we actually start.
        url: localBaseURL,
        // Default to FALSE to prevent accidentally reusing an unrelated server.
        reuseExistingServer: process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === 'true' && !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
