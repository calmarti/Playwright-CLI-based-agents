// spec: specs/parabank-authentication-test-plan.md

import { expect, test } from '@playwright/test';

test.describe('ParaBank Authentication', () => {
  test('Forgot Login Info Returns Credentials for a Matching Customer', async ({ page }) => {
    const username = `auth_lookup_${Date.now()}`;
    const customer = {
      firstName: 'Lookup',
      lastName: 'User',
      street: '1 Main St',
      city: 'Metropolis',
      state: 'CA',
      zipCode: '90210',
      phoneNumber: '5551234567',
      ssn: '123456789',
      password: 'password1',
    };

    await page.goto('register.htm');

    // 1. Create a customer with known identity data.
    await page.locator('input[name="customer.firstName"]').fill(customer.firstName);
    await page.locator('input[name="customer.lastName"]').fill(customer.lastName);
    await page.locator('input[name="customer.address.street"]').fill(customer.street);
    await page.locator('input[name="customer.address.city"]').fill(customer.city);
    await page.locator('input[name="customer.address.state"]').fill(customer.state);
    await page.locator('input[name="customer.address.zipCode"]').fill(customer.zipCode);
    await page.locator('input[name="customer.phoneNumber"]').fill(customer.phoneNumber);
    await page.locator('input[name="customer.ssn"]').fill(customer.ssn);
    await page.locator('input[name="customer.username"]').fill(username);
    await page.locator('input[name="customer.password"]').fill(customer.password);
    await page.locator('input[name="repeatedPassword"]').fill(customer.password);
    await page.locator('input[value="Register"]').click();
    await expect(page.getByRole('heading', { name: `Welcome ${username}` })).toBeVisible();
    await page.getByRole('link', { name: 'Log Out' }).click();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();

    // 2. Look up credentials with the matching identity data.
    await page.goto('lookup.htm');
    await page.locator('input[name="firstName"]').fill(customer.firstName);
    await page.locator('input[name="lastName"]').fill(customer.lastName);
    await page.locator('input[name="address.street"]').fill(customer.street);
    await page.locator('input[name="address.city"]').fill(customer.city);
    await page.locator('input[name="address.state"]').fill(customer.state);
    await page.locator('input[name="address.zipCode"]').fill(customer.zipCode);
    await page.locator('input[name="ssn"]').fill(customer.ssn);
    await page.getByRole('button', { name: 'Find My Login Info' }).click();

    // 3. Verify matching customer data returns credentials without logging in.
    await expect(page.getByText('Your login information was located successfully. You are now logged in.')).toHaveCount(0);
    await expect(page.getByText(username)).toBeVisible();
    await expect(page.getByText(customer.password)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
  });
});
