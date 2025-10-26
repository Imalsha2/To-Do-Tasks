import { test, expect } from '@playwright/test';

test('create task via UI', async ({ page }) => {
  await page.goto('/');
  const titleInput = page.locator('input[placeholder="Title"]');
  await expect(titleInput).toBeVisible();

  await titleInput.fill('E2E Task');
  await page.locator('textarea[placeholder^="Description"]').fill('Created by Playwright');
  await page.locator('button:has-text("Add Task")').click();

  // After adding, the new task should appear in Recent Tasks
  const firstTask = page.locator('.tasks-grid .task-card').first();
  await expect(firstTask).toContainText('E2E Task');
  await expect(firstTask).toContainText('Created by Playwright');
});
