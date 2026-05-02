import { expect, test } from '@playwright/test';
import { fillLoginForm, gotoParaBank, uniqueUsername } from './helpers.js';

// spec: specs/parabank-authentication-test-plan.md
// seed: tests/seed.spec.ts

test.describe('ParaBank Authentication', () => {
  test('Login Rejects Invalid Credentials', async ({ page }) => {
    await gotoParaBank(page);
    const username = uniqueUsername('no_such_user');

    // 1. Fill `input[name="username"]` with the nonexistent username.
    // 2. Fill `input[name="password"]` with `bad-pass`.
    await fillLoginForm(page, username, 'bad-pass');

    // 3. Click `Log In`.
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toHaveCount(0);
    await expect(page.getByText('Welcome John Smith')).toHaveCount(0);
  });
});
