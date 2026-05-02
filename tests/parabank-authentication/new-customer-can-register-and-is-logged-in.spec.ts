import { expect, test } from '@playwright/test';
import { defaultCustomerIdentity, fillRegistrationForm, gotoParaBank, uniqueUsername } from './helpers.js';

// spec: specs/parabank-authentication-test-plan.md
// seed: tests/seed.spec.ts

test.describe('ParaBank Authentication', () => {
  test('New Customer Can Register and Is Logged In', async ({ page }) => {
    await gotoParaBank(page);
    const username = uniqueUsername('auth');

    // 1. Click the `Register` link in the `Customer Login` panel.
    await page.getByRole('link', { name: 'Register' }).click();

    // 2. Fill registration fields.
    await fillRegistrationForm(page, username, 'password1');

    // 3. Click the `Register` button in the registration form.
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page).toHaveTitle(/Customer Created/);
    await expect(page.getByRole('heading', { name: `Welcome ${username}` })).toBeVisible();
    await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();
    await expect(page.getByText(`Welcome ${defaultCustomerIdentity.firstName} ${defaultCustomerIdentity.lastName}`)).toBeVisible();
    await expect(page.getByText('Account Services')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toBeVisible();
  });
});
