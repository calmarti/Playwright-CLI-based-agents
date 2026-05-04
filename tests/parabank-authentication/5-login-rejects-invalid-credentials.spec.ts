// spec: specs/parabank-authentication-test-plan.md

import { expect, test } from '@playwright/test';

test.describe('ParaBank Authentication', () => {
  test('Login Rejects Invalid Credentials', async ({ page }) => {
    const username = `no_such_user_${Date.now()}`;

    await page.goto('index.htm');

    // 1. Submit credentials for a nonexistent customer.
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill('bad-pass');
    await page.getByRole('button', { name: 'Log In' }).click();

    // 2. Verify invalid credentials do not start an authenticated session.
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toHaveCount(0);
    await expect(page.getByText('Welcome John Smith')).toHaveCount(0);
  });
});
