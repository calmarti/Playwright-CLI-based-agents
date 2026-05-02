import { expect, test } from '@playwright/test';
import { gotoParaBank } from './helpers.js';

// spec: specs/parabank-authentication-test-plan.md
// seed: tests/seed.spec.ts

test.describe('ParaBank Authentication', () => {
  test('Direct Protected Page Access While Logged Out Is Blocked', async ({ page }) => {
    // 1. Navigate directly to `https://parabank.parasoft.com/parabank/overview.htm`.
    await gotoParaBank(page, '/overview.htm');

    await expect(page).toHaveTitle(/ParaBank \| Error/);
    await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible();
    await expect(page.getByText('An internal error has occurred and has been logged.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toHaveCount(0);
    await expect(page.getByText(/Welcome /)).toHaveCount(0);
  });
});
