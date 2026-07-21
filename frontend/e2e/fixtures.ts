import { test as base, expect } from '@playwright/test'

/**
 * Test credentials for the local E2E suite.
 * The user must already exist in the DB with `confirmed: true`.
 * (Created during Etapa 3 — see AVANCE.md.)
 */
const TEST_EMAIL = 'testlocal@granger.test'
const TEST_PASSWORD = 'TestPass123'

/**
 * Extend the base test fixture with a `login()` helper that performs the
 * full form-based login flow and waits until the dashboard renders.
 */
type Fixtures = {
  login: (email?: string, password?: string) => Promise<void>
}

export const test = base.extend<Fixtures>({
  // oxlint-disable-next-line react-hooks/rules-of-hooks -- this `use` is Playwright's fixture API, not a React hook
  login: async ({ page }, use) => {
    const performLogin = async (email: string = TEST_EMAIL, password: string = TEST_PASSWORD) => {
      await page.goto('/auth/login')
      await page.getByTestId('login-email').fill(email)
      await page.getByTestId('login-password').fill(password)
      await page.getByTestId('login-submit').click()
      // Wait for redirect to dashboard ("/") and the heading to render.
      await expect(page).toHaveURL(/\/$/)
      await expect(page.getByRole('heading', { name: 'My Projects' })).toBeVisible()
    }
    await use(performLogin)
  },
})

export { expect, TEST_EMAIL, TEST_PASSWORD }
