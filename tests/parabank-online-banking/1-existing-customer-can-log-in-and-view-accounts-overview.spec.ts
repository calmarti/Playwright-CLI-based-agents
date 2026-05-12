import { expect, test } from '@playwright/test';

// spec: specs/parabank-online-banking.md

test.describe('ParaBank Online Banking', () => {
  test('Existing customer can log in and view accounts overview', async ({ page }, testInfo) => {
    const username = `codex${Date.now()}${testInfo.workerIndex}`;
    const password = 'Pass123!';

    await page.goto('');
    await page.getByRole('link', { name: 'Register' }).click();
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
    await expect(page.getByRole('heading', { name: new RegExp(`Welcome ${username}`) })).toBeVisible();

    await page.getByRole('link', { name: 'Log Out' }).click();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('link', { name: 'Accounts Overview' }).click();

    await expect(page).toHaveURL(/overview\.htm/);
    await expect(page.getByText('Welcome Test Planner')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Account Services' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Account' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Balance*' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Available Amount' })).toBeVisible();
    await expect(page.locator('#accountTable a').filter({ hasText: /^\d+$/ }).first()).toBeVisible();
  });
});
