import { expect, test, type Page } from '@playwright/test';

// spec: specs/parabank-online-banking.md

async function allowAdditionalAccountOpening(page: Page) {
  await page.goto('admin.htm');
  await expect(page.getByRole('heading', { name: 'Administration' })).toBeVisible({ timeout: 15000 });

  await page
    .getByRole('row', { name: /Min\. Balance:/ })
    .getByRole('textbox')
    .fill('100');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByRole('heading', { name: 'Administration' })).toBeVisible();
  await expect(page.getByRole('row', { name: /Min\. Balance:/ }).getByRole('textbox')).toHaveValue('100');
}

test.describe('ParaBank Online Banking', () => {
  test('Customer can transfer funds between accounts', async ({ page }, testInfo) => {
    const username = `codex${Date.now()}${testInfo.workerIndex}`;
    const password = 'Pass123!';

    await allowAdditionalAccountOpening(page);

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

    await page.getByRole('link', { name: 'Open New Account' }).click();
    await page.locator('#type').selectOption({ label: 'SAVINGS' });
    await expect(page.locator('#fromAccountId option').first()).toHaveText(/^\d+$/);
    await page.getByRole('button', { name: 'Open New Account' }).click();
    await expect(page.getByRole('heading', { name: 'Account Opened!' })).toBeVisible({ timeout: 30000 });

    await page.getByRole('link', { name: 'Transfer Funds' }).click();
    const fromAccount = page.locator('#fromAccountId');
    const toAccount = page.locator('#toAccountId');
    await expect(page.getByRole('heading', { name: 'Transfer Funds' })).toBeVisible();
    await expect.poll(async () => fromAccount.locator('option').count()).toBeGreaterThanOrEqual(2);
    const accounts = (await fromAccount.locator('option').allTextContents()).map((account) => account.trim());
    expect(accounts.length).toBeGreaterThanOrEqual(2);
    const sourceAccount = accounts[0];
    const targetAccount = accounts[1];

    await page.locator('#amount').fill('25.00');
    await fromAccount.selectOption(sourceAccount);
    await toAccount.selectOption(targetAccount);
    await page.getByRole('button', { name: 'Transfer' }).click();

    await expect(page.getByRole('heading', { name: 'Transfer Complete!' })).toBeVisible();
    await expect(page.getByText(`$25.00 has been transferred from account #${sourceAccount} to account #${targetAccount}.`)).toBeVisible();
    await expect(page.getByText('See Account Activity for more details.')).toBeVisible();
  });
});
