// spec: specs/parabank-authentication-test-plan.md

import { expect, test } from '@playwright/test';

test.describe('ParaBank Authentication', () => {
  test('Registration Rejects Duplicate Username', async ({ page }) => {
    const username = `auth_duplicate_${Date.now()}`;

    await page.goto('register.htm');

    // 1. Register a customer so the username already exists.
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
    await page.locator('input[value="Register"]').click();
    await expect(page.getByRole('heading', { name: `Welcome ${username}` })).toBeVisible();
    await page.getByRole('link', { name: 'Log Out' }).click();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();

    // 2. Try to register the same username again.
    await page.goto('register.htm');
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
    await page.locator('input[value="Register"]').click();

    // 3. Verify the duplicate username is rejected.
    await expect(page.getByText(`This username already exists.`)).toBeVisible();
    await expect(page.getByText('Your account was created successfully. You are now logged in.')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
  });
});
