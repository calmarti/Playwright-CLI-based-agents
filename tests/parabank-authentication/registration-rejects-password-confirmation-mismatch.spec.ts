import { expect, test } from '@playwright/test';
import { fillRegistrationForm, gotoParaBank, uniqueUsername } from './helpers.js';

// spec: specs/parabank-authentication-test-plan.md
// seed: tests/seed.spec.ts

test.describe('ParaBank Authentication', () => {
  test('Registration Rejects Password Confirmation Mismatch', async ({ page }) => {
    await gotoParaBank(page, '/register.htm');
    const username = uniqueUsername('auth_mismatch');

    // 1. Fill all required personal information fields with valid data.
    // 2. Fill `input[name="customer.username"]` with a unique username.
    // 3. Fill `input[name="customer.password"]` with `password1`.
    // 4. Fill `input[name="repeatedPassword"]` with `password2`.
    await fillRegistrationForm(page, username, 'password1', 'password2');

    // 5. Click the registration form `Register` button.
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page).toHaveURL(/register\.htm/);
    await expect(page.getByText('Passwords did not match.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: `Welcome ${username}` })).toHaveCount(0);
  });
});
