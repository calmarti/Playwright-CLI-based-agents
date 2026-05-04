// spec: specs/parabank-authentication-test-plan.md

import { expect, test } from '@playwright/test';

test.describe('ParaBank Authentication', () => {
  test('Direct Protected Page Access While Logged Out Is Blocked', async ({ page }) => {
    // 1. Navigate directly to the protected account overview page.
    await page.goto('overview.htm');

    // 2. Verify protected account information is not displayed.
    await expect(page).toHaveTitle(/ParaBank \| Error/);
    await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible();
    await expect(page.getByText('An internal error has occurred and has been logged.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
  });
});
