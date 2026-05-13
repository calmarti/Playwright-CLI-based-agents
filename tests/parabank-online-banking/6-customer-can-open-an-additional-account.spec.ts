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
  test('Customer can open an additional account', async ({ page }, testInfo) => {
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
    await expect(page.getByRole('heading', { name: 'Open New Account' })).toBeVisible();
    await page.locator('#type').selectOption({ label: 'SAVINGS' });
    await expect(page.locator('#fromAccountId option').first()).toHaveText(/^\d+$/);
    await page.getByRole('button', { name: 'Open New Account' }).click();

    await expect(page.getByRole('heading', { name: 'Account Opened!' })).toBeVisible({ timeout: 30000 });
    await expect(page.getByText('Congratulations, your account is now open.')).toBeVisible();
    const newAccount = page.locator('#newAccountId');
    await expect(newAccount).toBeVisible();
    const newAccountNumber = (await newAccount.textContent())?.trim() ?? '';
    expect(newAccountNumber).toMatch(/^\d+$/);

    await newAccount.click();
    await expect(page).toHaveTitle('ParaBank | Account Activity');
    await expect(page.locator('#accountId')).toHaveText(newAccountNumber);
  });
});
