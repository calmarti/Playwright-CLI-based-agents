import { expect, test } from '@playwright/test';
import { existingCustomer, fillLoginForm, gotoParaBank } from './helpers.js';

// spec: specs/parabank-authentication-test-plan.md
// seed: tests/seed.spec.ts

test.describe('ParaBank Authentication', () => {
  test('Existing Customer Can Log In', async ({ page }) => {
    await gotoParaBank(page);

    // 1. Fill `input[name="username"]` with `john`.
    // 2. Fill `input[name="password"]` with `demo`.
    await fillLoginForm(page, existingCustomer.username, existingCustomer.password);

    // 3. Click the `Log In` button.
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page).toHaveURL(/overview\.htm/);
    await expect(page).toHaveTitle('ParaBank | Accounts Overview');
    await expect(page.getByText(existingCustomer.greeting)).toBeVisible();
    await expect(page.getByText('Account Services')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toHaveCount(0);
  });
});
