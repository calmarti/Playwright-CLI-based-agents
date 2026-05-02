import { expect, test } from '@playwright/test';
import { gotoParaBank } from './helpers.js';

// spec: specs/parabank-authentication-test-plan.md
// seed: tests/seed.spec.ts

test.describe('ParaBank Authentication', () => {
  test('Login Rejects Username Without Password', async ({ page }) => {
    await gotoParaBank(page);

    // 1. Fill `input[name="username"]` with `john`.
    await page.locator('input[name="username"]').fill('john');

    // 2. Leave `input[name="password"]` blank.
    await expect(page.locator('input[name="password"]')).toHaveValue('');

    // 3. Click `Log In`.
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible();
    await expect(page.getByText('Please enter a username and password.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
    await expect(page.getByText('Welcome John Smith')).toHaveCount(0);
  });
});
