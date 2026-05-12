import { expect, test } from '@playwright/test';

// spec: specs/parabank-online-banking.md

test.describe('ParaBank Online Banking', () => {
  test('Customer can update contact information', async ({ page }, testInfo) => {
    const username = `codex${Date.now()}${testInfo.workerIndex}`;
    const password = 'Pass123!';

    await page.goto('register.htm');
    await page.locator('[id="customer.firstName"]').fill('Test');
    await page.locator('[id="customer.lastName"]').fill('Planner');
    await page.locator('[id="customer.address.street"]').fill('123 Main St');
    await page.locator('[id="customer.address.city"]').fill('Madrid');
    await page.locator('[id="customer.address.state"]').fill('MD');
    await page.locator('[id="customer.address.zipCode"]').fill('28001');
    await page.locator('[id="customer.phoneNumber"]').fill('5551234567');
    await page.locator('[id="customer.ssn"]').fill('123-45-6789');
    await page.locator('[id="customer.username"]').fill(username);
    await page.locator('[id="customer.password"]').fill(password);
    await page.locator('#repeatedPassword').fill(password);
    await page.getByRole('button', { name: 'Register' }).click();

    await page.getByRole('link', { name: 'Update Contact Info' }).click();
    await expect(page.getByRole('heading', { name: 'Update Profile' })).toBeVisible();
    await expect(page.locator('[id="customer.firstName"]')).toHaveValue('Test');
    await expect(page.locator('[id="customer.lastName"]')).toHaveValue('Planner');
    await expect(page.locator('[id="customer.phoneNumber"]')).toHaveValue('5551234567');

    await page.locator('[id="customer.phoneNumber"]').fill('5559876543');
    await page.getByRole('button', { name: 'Update Profile' }).click();

    await expect(page.getByRole('heading', { name: 'Profile Updated' })).toBeVisible();
    await expect(page.getByText('Your updated address and phone number have been added to the system.')).toBeVisible();

    await page.getByRole('link', { name: 'Update Contact Info' }).click();
    await expect(page.locator('[id="customer.phoneNumber"]')).toHaveValue('5559876543');
  });
});
