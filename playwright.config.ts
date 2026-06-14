import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const BASE = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  use: {
    baseURL: BASE,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: undefined } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run build && PORT=${PORT} npm run start`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: true,
        timeout: 180_000,
      },
});
