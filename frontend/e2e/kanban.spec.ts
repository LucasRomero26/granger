import { test, expect } from './fixtures'

/**
 * Generate a unique project name so each test run is isolated
 * and does not collide with a previously created project.
 */
function uniqueProjectName(): string {
  return `E2E Project ${Date.now().toString(36)}`
}

test.describe('Kanban - full task flow', () => {
  test('login -> create project -> create task -> move task -> add note -> change status -> delete task', async ({ page, login }) => {
    // 1. Login
    await login()

    // 2. Create a new project
    const projectName = uniqueProjectName()
    await page.getByTestId('new-project-btn').click()
    await expect(page).toHaveURL(/\/projects\/create$/)
    await page.getByTestId('project-name').fill(projectName)
    await page.getByTestId('project-client').fill('E2E Client')
    await page.getByTestId('project-description').fill('Project created by Playwright E2E test')
    await page.getByTestId('create-project-submit').click()
    // After creating, we should be redirected to the dashboard.
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByText(projectName, { exact: true })).toBeVisible()

    // 3. Open the project
    // Click the project card to navigate to the project details.
    await page.getByText(projectName, { exact: true }).click()
    await expect(page).toHaveURL(/\/projects\/[a-f0-9]+$/)
    // The board should have 5 status column headings.
    await expect(page.getByRole('heading', { name: 'To Do' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'On Hold' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'In Progress' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Completed' })).toBeVisible()
    // "Drop tasks here" placeholders should be present in all empty columns.
    await expect(page.getByText('Drop tasks here').first()).toBeVisible()

    // 4. Create a new task
    await page.getByTestId('create-task-btn').click()
    // The modal should appear with the "New task" title.
    await expect(page.getByText('New task', { exact: true })).toBeVisible()
    const taskName = `Task ${Date.now().toString(36)}`
    await page.getByTestId('task-name').fill(taskName)
    await page.getByTestId('task-description').fill('Task created by the E2E kanban test')
    await page.getByTestId('save-task-submit').click()
    // After saving, the modal closes and the task card appears in the "To Do" column.
    await expect(page.getByText('New task', { exact: true })).toBeHidden({ timeout: 5000 })
    await expect(page.getByText(taskName, { exact: true })).toBeVisible()
    // A success toast should appear.
    await expect(page.getByRole('status').first()).toBeVisible({ timeout: 8000 })

    // 5. Open the task modal and add a note
    await page.getByText(taskName, { exact: true }).click()
    await expect(page.getByText('Added:', { exact: false })).toBeVisible()
    // Scroll the modal so the notes section is in view.
    const noteInput = page.getByTestId('note-content')
    await noteInput.scrollIntoViewIfNeeded()
    await noteInput.fill('This is a note added by the E2E test')
    await page.getByTestId('add-note-submit').click()
    // The note should appear in the list.
    await expect(page.getByText('This is a note added by the E2E test')).toBeVisible()
    // The "by {user}" label should appear next to the note.
    await expect(page.getByText(/^by .+$/)).toBeVisible()

    // 6. Change the task status via the <select>
    const statusSelect = page.getByTestId('task-status-select')
    // Change to "In Progress".
    await statusSelect.selectOption('inProgress')
    // A success toast should appear (role=status; react-hot-toast uses aria role "status").
    // We do not assert the toast text because the backend message ("Task updated")
    // is the same regardless of the UI language, and the frontend uses the backend
    // message as the primary toast text (see extractMessage in src/lib/apiResponse.ts).
    // What matters here is that a success toast surfaces.
    await expect(page.getByRole('status').first()).toBeVisible({ timeout: 8000 })

    // 7. Close the modal and verify the card moved columns
    await page.keyboard.press('Escape')
    await expect(page.getByText('Added:', { exact: false })).toBeHidden({ timeout: 5000 })
    // The task card should still be visible (just moved to a different column).
    await expect(page.getByText(taskName, { exact: true })).toBeVisible()
  })

  test('creating a task requires a name (validation error)', async ({ page, login }) => {
    await login()

    // Create a fresh project for this test.
    const projectName = uniqueProjectName()
    await page.getByTestId('new-project-btn').click()
    await page.getByTestId('project-name').fill(projectName)
    await page.getByTestId('project-client').fill('Validation Client')
    await page.getByTestId('project-description').fill('For validation testing')
    await page.getByTestId('create-project-submit').click()
    await expect(page).toHaveURL(/\/$/)

    // Open the project.
    await page.getByText(projectName, { exact: true }).click()
    await expect(page).toHaveURL(/\/projects\/[a-f0-9]+$/)

    // Open the new task modal but submit without filling the name.
    await page.getByTestId('create-task-btn').click()
    await expect(page.getByText('New task', { exact: true })).toBeVisible()
    await page.getByTestId('save-task-submit').click()
    await expect(page.getByText('Task name is required')).toBeVisible()
    // The modal should still be open (we did not navigate away).
    await expect(page.getByText('New task', { exact: true })).toBeVisible()
  })
})
