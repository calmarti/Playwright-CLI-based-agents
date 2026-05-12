import { expect, test } from '@playwright/test';

// spec: specs/parabank-online-banking.md

test.describe('ParaBank Online Banking', () => {
  test('New customer can register and is logged in automatically', async ({ page }, testInfo) => {
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

    await expect(page).toHaveTitle('ParaBank | Customer Created');
    await expect(page.getByRole('heading', { name: new RegExp(`Welcome ${username}`) })).toBeVisible();
    await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Account Services' })).toBeVisible();
  });
});
