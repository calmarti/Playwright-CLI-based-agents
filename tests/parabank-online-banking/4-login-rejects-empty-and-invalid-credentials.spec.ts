import { expect, test } from '@playwright/test';

// spec: specs/parabank-online-banking.md

test.describe('ParaBank Online Banking', () => {
  test('Login rejects empty and invalid credentials', async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible();
    await expect(page.getByText('Please enter a username and password.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Account Services' })).not.toBeVisible();

    await page.goto('');
    await page.locator('input[name="username"]').fill(`missing${Date.now()}`);
    await page.locator('input[name="password"]').fill('wrong-password');
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible();
    await expect(page.getByText(/internal error|username and password could not be verified/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Account Services' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
  });
});
