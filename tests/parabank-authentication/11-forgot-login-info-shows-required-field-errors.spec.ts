// spec: specs/parabank-authentication-test-plan.md

import { expect, test } from '@playwright/test';

test.describe('ParaBank Authentication', () => {
  test('Forgot Login Info Shows Required Field Errors', async ({ page }) => {
    await page.goto('index.htm');

    // 1. Open the credential lookup page.
    await page.getByRole('link', { name: 'Forgot login info?' }).click();
    await expect(page).toHaveURL(/lookup\.htm/);
    await expect(page.getByRole('heading', { name: 'Customer Lookup' })).toBeVisible();

    // 2. Submit the lookup form with all fields blank.
    await page.getByRole('button', { name: 'Find My Login Info' }).click();

    // 3. Verify all lookup identity fields are required.
    await expect(page).toHaveURL(/lookup\.htm/);
    await expect(page.getByText('First name is required.')).toBeVisible();
    await expect(page.getByText('Last name is required.')).toBeVisible();
    await expect(page.getByText('Address is required.')).toBeVisible();
    await expect(page.getByText('City is required.')).toBeVisible();
    await expect(page.getByText('State is required.')).toBeVisible();
    await expect(page.getByText('Zip Code is required.')).toBeVisible();
    await expect(page.getByText('Social Security Number is required.')).toBeVisible();
  });
});
