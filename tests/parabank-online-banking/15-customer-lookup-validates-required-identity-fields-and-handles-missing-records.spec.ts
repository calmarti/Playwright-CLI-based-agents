import { expect, test } from '@playwright/test';

// spec: specs/parabank-online-banking.md

test.describe('ParaBank Online Banking', () => {
  test('Customer lookup validates required identity fields and handles missing records', async ({ page }) => {
    await page.goto('');
    await page.getByRole('link', { name: 'Forgot login info?' }).click();
    await expect(page.getByRole('heading', { name: 'Customer Lookup' })).toBeVisible();

    await page.getByRole('button', { name: 'Find My Login Info' }).click();
    await expect(page.getByText('First name is required.')).toBeVisible();
    await expect(page.getByText('Last name is required.')).toBeVisible();
    await expect(page.getByText('Address is required.')).toBeVisible();
    await expect(page.getByText('City is required.')).toBeVisible();
    await expect(page.getByText('State is required.')).toBeVisible();
    await expect(page.getByText('Zip Code is required.')).toBeVisible();
    await expect(page.getByText('Social Security Number is required.')).toBeVisible();

    await page.locator('#firstName').fill('No');
    await page.locator('#lastName').fill('Record');
    await page.locator('[id="address.street"]').fill('999 Missing St');
    await page.locator('[id="address.city"]').fill('Nowhere');
    await page.locator('[id="address.state"]').fill('ZZ');
    await page.locator('[id="address.zipCode"]').fill('00000');
    await page.locator('#ssn').fill('000-00-0000');
    await page.getByRole('button', { name: 'Find My Login Info' }).click();

    await expect(page.getByText('The customer information provided could not be found.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
  });
});
