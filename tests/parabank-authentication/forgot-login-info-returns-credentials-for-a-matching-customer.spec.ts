import { expect, test } from '@playwright/test';
import { defaultCustomerIdentity, fillLookupForm, gotoParaBank, registerCustomer, uniqueUsername } from './helpers.js';

// spec: specs/parabank-authentication-test-plan.md
// seed: tests/seed.spec.ts

test.describe('ParaBank Authentication', () => {
  test('Forgot Login Info Returns Credentials for a Matching Customer', async ({ page }) => {
    test.fail(
      true,
      'Live ParaBank currently starts an authenticated session after matching credential lookup.',
    );

    const username = uniqueUsername('auth_lookup');
    const password = 'password1';

    // Preconditions: create a user through registration and preserve the exact identity data.
    await registerCustomer(page, username, password, defaultCustomerIdentity);
    await page.getByRole('link', { name: 'Log Out' }).click();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();

    // 1. Navigate to `lookup.htm`.
    await gotoParaBank(page, '/lookup.htm');

    // 2. Fill lookup fields with identity data for the known customer.
    await fillLookupForm(page, defaultCustomerIdentity);

    // 3. Click `Find My Login Info`.
    await page.getByRole('button', { name: 'Find My Login Info' }).click();

    await expect(page.getByText('Your login information was located successfully. You are now logged in.')).toBeVisible();
    await expect(page.getByText(username)).toBeVisible();
    await expect(page.getByText(password)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
  });
});
