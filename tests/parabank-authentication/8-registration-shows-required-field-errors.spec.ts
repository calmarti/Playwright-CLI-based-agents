// spec: specs/parabank-authentication-test-plan.md

import { expect, test } from '@playwright/test';

test.describe('ParaBank Authentication', () => {
  test('Registration Shows Required Field Errors', async ({ page }) => {
    await page.goto('register.htm');

    // 1. Submit the empty registration form.
    await page.locator('input[value="Register"]').click();

    // 2. Verify all required field errors are shown and no account is created.
    await expect(page).toHaveURL(/register\.htm/);
    await expect(page.getByText('First name is required.')).toBeVisible();
    await expect(page.getByText('Last name is required.')).toBeVisible();
    await expect(page.getByText('Address is required.')).toBeVisible();
    await expect(page.getByText('City is required.')).toBeVisible();
    await expect(page.getByText('State is required.')).toBeVisible();
    await expect(page.getByText('Zip Code is required.')).toBeVisible();
    await expect(page.getByText('Social Security Number is required.')).toBeVisible();
    await expect(page.getByText('Username is required.')).toBeVisible();
    await expect(page.getByText('Password is required.')).toBeVisible();
    await expect(page.getByText('Password confirmation is required.')).toBeVisible();
    await expect(page.getByText('Phone number is required.')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /Welcome / })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
  });
});
