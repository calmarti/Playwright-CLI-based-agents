import { expect, test } from '@playwright/test';

// spec: specs/parabank-online-banking.md

test.describe('ParaBank Online Banking', () => {
  test('Blank transfer amount returns an error', async ({ page }, testInfo) => {
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

    await page.getByRole('link', { name: 'Transfer Funds' }).click();
    await expect(page.getByRole('heading', { name: 'Transfer Funds' })).toBeVisible();
    await page.locator('#amount').fill('');
    await page.getByRole('button', { name: 'Transfer' }).click();

    await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible();
    await expect(page.getByText('An internal error has occurred and has been logged.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Transfer Complete!' })).not.toBeVisible();
  });
});
