import { expect, test } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /production-ready SaaS starter kit/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /docs/i })).toBeVisible();
});
