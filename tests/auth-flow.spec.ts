import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page).toHaveTitle(/Login/i);
    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
  });

  test('should show validation errors on empty submission', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page.getByText('Email is required')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page).toHaveTitle(/Register/i);
    await expect(page.getByRole('heading', { name: /Create an account/i })).toBeVisible();
  });
});
