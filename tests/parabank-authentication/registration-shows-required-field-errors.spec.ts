import { expect, test } from '@playwright/test';
import { gotoParaBank, requiredRegistrationErrors } from './helpers.js';

// spec: specs/parabank-authentication-test-plan.md
// seed: tests/seed.spec.ts

test.describe('ParaBank Authentication', () => {
  test('Registration Shows Required Field Errors', async ({ page }) => {
    await gotoParaBank(page, '/register.htm');

    // 1. Leave all registration fields blank.
    for (const textbox of await page.locator('#customerForm input[type="text"], #customerForm input[type="password"]').all()) {
      await expect(textbox).toHaveValue('');
    }

    // 2. Click the registration form `Register` button.
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page).toHaveURL(/register\.htm/);
    for (const error of requiredRegistrationErrors) {
      await expect(page.getByText(error)).toBeVisible();
    }
    await expect(page.getByText('Phone number is required.')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /Welcome / })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0);
  });
});
