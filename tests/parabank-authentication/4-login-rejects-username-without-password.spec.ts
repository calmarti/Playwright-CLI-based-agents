// spec: specs/parabank-authentication-test-plan.md

import { expect, test } from '@playwright/test';

test.describe('ParaBank Authentication', () => {
  test('Login Rejects Username Without Password', async ({ page }) => {
    await page.goto('index.htm');

    // 1. Submit username without a password.
    await page.locator('input[name="username"]').fill('john');
    await page.getByRole('button', { name: 'Log In' }).click();

    // 2. Verify partial credentials are rejected.
    await expect(page).toHaveURL(/login\.htm/);
    await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible();
    await expect(page.getByText('Please enter a username and password.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
    await expect(page.getByText('Welcome John Smith')).toHaveCount(0);
  });
});
