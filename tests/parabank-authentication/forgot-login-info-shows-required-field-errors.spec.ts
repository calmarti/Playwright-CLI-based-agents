import { expect, test } from '@playwright/test';
import { gotoParaBank, requiredLookupErrors } from './helpers.js';

// spec: specs/parabank-authentication-test-plan.md
// seed: tests/seed.spec.ts

test.describe('ParaBank Authentication', () => {
  test('Forgot Login Info Shows Required Field Errors', async ({ page }) => {
    await gotoParaBank(page);

    // 1. Click `Forgot login info?`.
    await page.getByRole('link', { name: 'Forgot login info?' }).click();
    await expect(page.getByRole('heading', { name: 'Customer Lookup' })).toBeVisible();

    // 2. Leave all lookup fields blank.
    for (const textbox of await page.locator('#lookupForm input[type="text"]').all()) {
      await expect(textbox).toHaveValue('');
    }

    // 3. Click `Find My Login Info`.
    await page.getByRole('button', { name: 'Find My Login Info' }).click();

    await expect(page).toHaveURL(/lookup\.htm/);
    await expect(page.getByRole('heading', { name: 'Customer Lookup' })).toBeVisible();
    for (const error of requiredLookupErrors) {
      await expect(page.getByText(error)).toBeVisible();
    }
  });
});
