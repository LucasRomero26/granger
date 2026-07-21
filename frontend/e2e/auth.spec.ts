import { test, expect } from './fixtures'

test.describe('Auth — login flow', () => {
  test('successful login with valid credentials redirects to the dashboard', async ({ page, login }) => {
    await login()
    // The dashboard heading should be visible after a successful login.
    await expect(page.getByRole('heading', { name: 'My Projects' })).toBeVisible()
    // The "New Project" button should be available on the dashboard.
    await expect(page.getByTestId('new-project-btn')).toBeVisible()
  })

  test('shows a validation error when submitting an empty form', async ({ page }) => {
    await page.goto('/auth/login')
    // Click submit without filling the form.
    await page.getByTestId('login-submit').click()
    // The email field should show a required error message.
    await expect(page.getByText('Email is required')).toBeVisible()
    // The password field should show a required error message.
    await expect(page.getByText('Password is required')).toBeVisible()
    // We should still be on the login page.
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('shows an error toast for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByTestId('login-email').fill('noexist@granger.test')
    await page.getByTestId('login-password').fill('WrongPass123')
    await page.getByTestId('login-submit').click()
    // react-hot-toast renders a toast with role="status"
    await expect(page.getByRole('status').first()).toBeVisible({ timeout: 8000 })
    // The user should remain on the login page (not redirected to "/").
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('invalid email format triggers a validation error', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByTestId('login-email').fill('not-an-email')
    await page.getByTestId('login-password').fill('TestPass123')
    await page.getByTestId('login-submit').click()
    await expect(page.getByText('Invalid email')).toBeVisible()
    await expect(page).toHaveURL(/\/auth\/login/)
  })
})
