import { expect, test } from '@playwright/test';

// spec: specs/parabank-online-banking.md

test.describe('ParaBank Online Banking', () => {
  test('Customer can find and open transaction details', async ({ page }, testInfo) => {
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

    await page.getByRole('link', { name: 'Bill Pay' }).click();
    const fundingAccount = (await page.locator('select[name="fromAccountId"] option').first().textContent())?.trim() ?? '';
    await page.locator('input[name="payee.name"]').fill('Utility Co');
    await page.locator('input[name="payee.address.street"]').fill('456 Utility Ave');
    await page.locator('input[name="payee.address.city"]').fill('Madrid');
    await page.locator('input[name="payee.address.state"]').fill('MD');
    await page.locator('input[name="payee.address.zipCode"]').fill('28002');
    await page.locator('input[name="payee.phoneNumber"]').fill('5552223333');
    await page.locator('input[name="payee.accountNumber"]').fill('9999');
    await page.locator('input[name="verifyAccount"]').fill('9999');
    await page.locator('input[name="amount"]').fill('10.00');
    await page.locator('select[name="fromAccountId"]').selectOption(fundingAccount);
    await page.getByRole('button', { name: 'Send Payment' }).click();
    await expect(page.getByRole('heading', { name: 'Bill Payment Complete' })).toBeVisible();

    await page.getByRole('link', { name: 'Find Transactions' }).click();
    await page.locator('#accountId').selectOption(fundingAccount);
    await page.locator('#amount').fill('10');
    await page.locator('#findByAmount').click();

    await expect(page.getByRole('heading', { name: 'Transaction Results' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Date' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Transaction' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Debit (-)' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Credit (+)' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Bill Payment to Utility Co' }).first()).toBeVisible();
    await expect(page.getByText('$10.00').first()).toBeVisible();

    await page.getByRole('link', { name: 'Bill Payment to Utility Co' }).first().click();
    await expect(page.getByRole('heading', { name: 'Transaction Details' })).toBeVisible();
    await expect(page.getByText('Transaction ID:')).toBeVisible();
    await expect(page.getByText('Date:')).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Type:')).toBeVisible();
    await expect(page.getByText('Amount:')).toBeVisible();
    await expect(page.getByText('Bill Payment to Utility Co')).toBeVisible();
    await expect(page.getByText('$10.00')).toBeVisible();
  });
});
