// spec: specs/parabank-authentication-test-plan.md

import { expect, test } from '@playwright/test';

test.describe('ParaBank Authentication', () => {
  test('Login Rejects Empty Username and Password', async ({ page }) => {
    await page.goto('index.htm');

    // 1. Submit the login form with both fields blank.
    await page.getByRole('button', { name: 'Log In' }).click();

    // 2. Verify blank credentials are rejected.
    await expect(page).toHaveURL(/login\.htm/);
    await expect(page).toHaveTitle('ParaBank | Error');
    await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible();
    await expect(page.getByText('Please enter a username and password.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
  });
});
