import { test, expect } from '@playwright/test';

test.describe('Billing & Checkout Flow', () => {
  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/');
    // Check if the pricing cards are visible
    await expect(page.getByText('Developer Starter')).toBeVisible();
    await expect(page.getByText('Launch Professional')).toBeVisible();
    await expect(page.getByText('Enterprise Core')).toBeVisible();
  });
});
