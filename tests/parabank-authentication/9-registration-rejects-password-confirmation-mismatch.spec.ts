// spec: specs/parabank-authentication-test-plan.md

import { expect, test } from '@playwright/test';

test.describe('ParaBank Authentication', () => {
  test('Registration Rejects Password Confirmation Mismatch', async ({ page }) => {
    const username = `auth_mismatch_${Date.now()}`;

    await page.goto('register.htm');

    // 1. Fill valid customer data with mismatched password confirmation.
    await page.locator('input[name="customer.firstName"]').fill('Test');
    await page.locator('input[name="customer.lastName"]').fill('User');
    await page.locator('input[name="customer.address.street"]').fill('1 Main St');
    await page.locator('input[name="customer.address.city"]').fill('Metropolis');
    await page.locator('input[name="customer.address.state"]').fill('CA');
    await page.locator('input[name="customer.address.zipCode"]').fill('90210');
    await page.locator('input[name="customer.ssn"]').fill('123456789');
    await page.locator('input[name="customer.username"]').fill(username);
    await page.locator('input[name="customer.password"]').fill('password1');
    await page.locator('input[name="repeatedPassword"]').fill('password2');

    // 2. Submit the registration form.
    await page.locator('input[value="Register"]').click();

    // 3. Verify mismatched passwords block registration.
    await expect(page).toHaveURL(/register\.htm/);
    await expect(page.getByText('Passwords did not match.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: `Welcome ${username}` })).toHaveCount(0);
  });
});
