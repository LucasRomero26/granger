import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config for Granger E2E tests.
 *
 * Two execution modes:
 *
 * - Local dev: keep the dev servers running yourself:
 *     - backend  on http://localhost:4001  (PORT=4001 because litellm uses 4000)
 *     - frontend on http://localhost:5173  (VITE_API_URL=http://localhost:4001/api)
 *
 * - CI (and `--ci` profiles): this config spins up `vite preview` on
 *   http://localhost:4173 automatically, with VITE_DEMO_MODE=true so the
 *   frontend mocks the backend and we can assert on the rendered UI
 *   without needing the API up. This makes the E2E job hermetic in CI.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  // In CI we use vite preview (port 4173) via webServer below. In local
  // dev the developer is expected to leave vite running on 5173.
  use: {
    baseURL: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    // i18n: force English so assertions on literal strings are stable,
    // regardless of navigator.language on the machine running the tests.
    locale: 'en-US',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer:
    process.env.CI
      ? {
          command: 'npm run build && npm run preview -- --port 4173 --strictPort',
          url: 'http://localhost:4173',
          timeout: 120_000,
          reuseExistingServer: false,
          env: {
            VITE_API_URL: 'http://localhost:4000/api',
            VITE_DEMO_MODE: 'true',
          },
        }
      : undefined,
})
