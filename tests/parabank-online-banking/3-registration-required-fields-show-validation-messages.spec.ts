import { expect, test } from '@playwright/test';

// spec: specs/parabank-online-banking.md

test.describe('ParaBank Online Banking', () => {
  test('Registration required fields show validation messages', async ({ page }) => {
    await page.goto('register.htm');
    await page.getByRole('button', { name: 'Register' }).click();

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
    await expect(page.getByText('Your account was created successfully.')).not.toBeVisible();
  });
});
