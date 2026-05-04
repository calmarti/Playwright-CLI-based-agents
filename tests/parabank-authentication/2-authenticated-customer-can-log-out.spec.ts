// spec: specs/parabank-authentication-test-plan.md

import { expect, test } from '@playwright/test';

test.describe('ParaBank Authentication', () => {
  test('Authenticated Customer Can Log Out', async ({ page }) => {
    const username = process.env.USERNAME ?? 'john';
    const password = process.env.PASSWORD ?? 'demo';

    await page.goto('index.htm');
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL(/overview\.htm/);

    // 1. Click the account services logout link.
    await page.getByRole('link', { name: 'Log Out' }).click();

    // 2. Verify the logged-out welcome page is restored.
    await expect(page).toHaveURL(/index\.htm/);
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
    await expect(page.getByText('Account Services')).toHaveCount(0);
  });
});
