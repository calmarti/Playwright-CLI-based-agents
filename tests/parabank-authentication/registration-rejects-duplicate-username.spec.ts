import { expect, test } from '@playwright/test';
import { fillRegistrationForm, gotoParaBank, registerCustomer, uniqueUsername } from './helpers.js';

// spec: specs/parabank-authentication-test-plan.md
// seed: tests/seed.spec.ts

test.describe('ParaBank Authentication', () => {
  test('Registration Rejects Duplicate Username', async ({ page }) => {
    const username = uniqueUsername('auth_duplicate');

    // Preconditions: Register a unique customer once, then log out.
    await registerCustomer(page, username);
    await page.getByRole('link', { name: 'Log Out' }).click();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();

    // 1. Navigate to `register.htm`.
    await gotoParaBank(page, '/register.htm');

    // 2. Fill the registration form with valid personal data.
    // 3. Reuse the previously registered username.
    // 4. Fill matching password and confirmation.
    await fillRegistrationForm(page, username, 'password1');

    // 5. Click `Register`.
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
    await expect(page.getByText('Your account was created successfully. You are now logged in.')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: `Welcome ${username}` })).toHaveCount(0);
    await expect(page.getByText(/username.*exists|already exists/i)).toBeVisible();
  });
});
