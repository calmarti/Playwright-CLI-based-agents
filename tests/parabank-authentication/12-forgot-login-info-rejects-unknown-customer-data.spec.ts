// spec: specs/parabank-authentication-test-plan.md

import { expect, test } from '@playwright/test';

test.describe('ParaBank Authentication', () => {
  test('Forgot Login Info Rejects Unknown Customer Data', async ({ page }) => {
    const suffix = Date.now().toString();

    await page.goto('lookup.htm');

    // 1. Fill lookup fields with nonmatching identity data.
    await page.locator('input[name="firstName"]').fill(`Unknown${suffix}`);
    await page.locator('input[name="lastName"]').fill('Customer');
    await page.locator('input[name="address.street"]').fill('404 Missing Ave');
    await page.locator('input[name="address.city"]').fill('Nowhere');
    await page.locator('input[name="address.state"]').fill('ZZ');
    await page.locator('input[name="address.zipCode"]').fill('00000');
    await page.locator('input[name="ssn"]').fill(suffix.slice(-9).padStart(9, '0'));

    // 2. Submit the lookup form.
    await page.getByRole('button', { name: 'Find My Login Info' }).click();

    // 3. Verify unknown customer data does not reveal credentials.
    await expect(page).toHaveTitle('ParaBank | Error');
    await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible();
    await expect(page.getByText('The customer information provided could not be found.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
  });
});
