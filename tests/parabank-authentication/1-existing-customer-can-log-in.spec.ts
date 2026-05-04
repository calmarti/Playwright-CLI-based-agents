// spec: specs/parabank-authentication-test-plan.md

import { expect, test } from '@playwright/test';

test.describe('ParaBank Authentication', () => {
  test('Existing Customer Can Log In', async ({ page }) => {
    const username = process.env.USERNAME ?? 'john';
    const password = process.env.PASSWORD ?? 'demo';

    await page.goto('index.htm');

    // 1. Fill existing customer credentials.
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);

    // 2. Submit the login form.
    await page.getByRole('button', { name: 'Log In' }).click();

    // 3. Verify the authenticated account overview is shown.
    await expect(page).toHaveURL(/overview\.htm/);
    await expect(page).toHaveTitle('ParaBank | Accounts Overview');
    await expect(page.getByText('Welcome John Smith')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
    await expect(page.getByText('Account Services')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toHaveCount(0);
  });
});
