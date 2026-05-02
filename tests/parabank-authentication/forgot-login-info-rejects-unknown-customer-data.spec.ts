import { expect, test } from '@playwright/test';
import { fillLookupForm, gotoParaBank, uniqueCustomerIdentity } from './helpers.js';

// spec: specs/parabank-authentication-test-plan.md
// seed: tests/seed.spec.ts

test.describe('ParaBank Authentication', () => {
  test('Forgot Login Info Rejects Unknown Customer Data', async ({ page }) => {
    const unknownCustomer = {
      ...uniqueCustomerIdentity('Unknown'),
      city: 'Nowhere',
      state: 'ZZ',
      zipCode: '00000',
    };

    await gotoParaBank(page, '/lookup.htm');

    // 1. Fill all lookup fields with nonmatching but syntactically valid values.
    await fillLookupForm(page, unknownCustomer);

    // 2. Click `Find My Login Info`.
    await page.getByRole('button', { name: 'Find My Login Info' }).click();

    await expect(page).toHaveTitle('ParaBank | Error');
    await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible();
    await expect(page.getByText('The customer information provided could not be found.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
  });
});
