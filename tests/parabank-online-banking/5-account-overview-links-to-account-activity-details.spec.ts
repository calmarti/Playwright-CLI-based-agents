import { expect, test } from '@playwright/test';

// spec: specs/parabank-online-banking.md

test.describe('ParaBank Online Banking', () => {
  test('Account overview links to account activity details', async ({ page }, testInfo) => {
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

    await page.getByRole('link', { name: 'Accounts Overview' }).click();
    const firstAccount = page.locator('#accountTable a').filter({ hasText: /^\d+$/ }).first();
    await expect(firstAccount).toBeVisible();
    const accountNumber = (await firstAccount.textContent())?.trim() ?? '';
    expect(accountNumber).toMatch(/^\d+$/);
    await firstAccount.click();

    await expect(page).toHaveTitle('ParaBank | Account Activity');
    await expect(page.getByRole('heading', { name: 'Account Details' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Account Activity' })).toBeVisible();
    await expect(page.getByText('Account Number:')).toBeVisible();
    await expect(page.locator('#accountId')).toHaveText(accountNumber);
    await expect(page.getByText('Account Type:')).toBeVisible();
    await expect(page.getByText('Balance:')).toBeVisible();
    await expect(page.getByText('Available:')).toBeVisible();
    await expect(page.locator('#month')).toContainText('All');
    await expect(page.locator('#month')).toContainText('January');
    await expect(page.locator('#transactionType')).toContainText('All');
    await expect(page.locator('#transactionType')).toContainText('Credit');
    await expect(page.locator('#transactionType')).toContainText('Debit');
    await expect(page.getByRole('button', { name: 'Go' })).toBeVisible();
  });
});
