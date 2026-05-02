import { expect, test } from '@playwright/test';
import { gotoParaBank } from './helpers.js';

// spec: specs/parabank-authentication-test-plan.md
// seed: tests/seed.spec.ts

test.describe('ParaBank Authentication', () => {
  test('Login Rejects Empty Username and Password', async ({ page }) => {
    await gotoParaBank(page);

    // 1. Leave `input[name="username"]` blank.
    await expect(page.locator('input[name="username"]')).toHaveValue('');

    // 2. Leave `input[name="password"]` blank.
    await expect(page.locator('input[name="password"]')).toHaveValue('');

    // 3. Click `Log In`.
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page).toHaveURL(/login\.htm/);
    await expect(page).toHaveTitle('ParaBank | Error');
    await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible();
    await expect(page.getByText('Please enter a username and password.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
  });
});
