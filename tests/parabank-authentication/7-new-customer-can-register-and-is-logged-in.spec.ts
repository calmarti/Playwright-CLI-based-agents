// spec: specs/parabank-authentication-test-plan.md

import { expect, test } from '@playwright/test';

test.describe('ParaBank Authentication', () => {
  test('New Customer Can Register and Is Logged In', async ({ page }) => {
    const username = `auth_${Date.now()}`;

    await page.goto('index.htm');

    // 1. Open the registration page.
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL(/register\.htm/);
    await expect(page.getByRole('heading', { name: 'Signing up is easy!' })).toBeVisible();

    // 2. Fill the registration form with a unique username.
    await page.locator('input[name="customer.firstName"]').fill('Test');
    await page.locator('input[name="customer.lastName"]').fill('User');
    await page.locator('input[name="customer.address.street"]').fill('1 Main St');
    await page.locator('input[name="customer.address.city"]').fill('Metropolis');
    await page.locator('input[name="customer.address.state"]').fill('CA');
    await page.locator('input[name="customer.address.zipCode"]').fill('90210');
    await page.locator('input[name="customer.phoneNumber"]').fill('5551234567');
    await page.locator('input[name="customer.ssn"]').fill('123456789');
    await page.locator('input[name="customer.username"]').fill(username);
    await page.locator('input[name="customer.password"]').fill('password1');
    await page.locator('input[name="repeatedPassword"]').fill('password1');

    // 3. Submit the registration form.
    await page.locator('input[value="Register"]').click();

    // 4. Verify registration succeeded and the customer is logged in.
    await expect(page).toHaveTitle(/Customer Created/);
    await expect(page.getByRole('heading', { name: `Welcome ${username}` })).toBeVisible();
    await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();
    await expect(page.getByText('Welcome Test User')).toBeVisible();
    await expect(page.getByText('Account Services')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toBeVisible();
  });
});
