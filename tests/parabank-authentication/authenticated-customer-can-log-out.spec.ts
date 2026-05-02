import { expect, test } from '@playwright/test';
import { loginExistingCustomer } from './helpers.js';

// spec: specs/parabank-authentication-test-plan.md
// seed: tests/seed.spec.ts

test.describe('ParaBank Authentication', () => {
  test('Authenticated Customer Can Log Out', async ({ page }) => {
    await loginExistingCustomer(page);

    // 1. Click the `Log Out` link in the account services list.
    await page.getByRole('link', { name: 'Log Out' }).click();

    await expect(page).toHaveURL(/index\.htm(?:\?ConnType=JDBC)?$/);
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
    await expect(page.getByText('Account Services')).toHaveCount(0);
  });
});
