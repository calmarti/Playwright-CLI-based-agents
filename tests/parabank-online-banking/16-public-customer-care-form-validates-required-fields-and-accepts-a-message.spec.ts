import { expect, test } from '@playwright/test';

// spec: specs/parabank-online-banking.md

test.describe('ParaBank Online Banking', () => {
  test('Public customer care form validates required fields and accepts a message', async ({ page }) => {
    await page.goto('');
    await page.getByRole('link', { name: 'contact', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Customer Care' })).toBeVisible();

    await page.getByRole('button', { name: 'Send to Customer Care' }).click();
    await expect(page.getByText('Name is required.')).toBeVisible();
    await expect(page.getByText('Email is required.')).toBeVisible();
    await expect(page.getByText('Phone is required.')).toBeVisible();
    await expect(page.getByText('Message is required.')).toBeVisible();

    await page.locator('#name').fill('Test Planner');
    await page.locator('#email').fill('test.planner@example.com');
    await page.locator('#phone').fill('5551234567');
    await page.locator('#message').fill('Please contact me about online banking support.');
    await page.getByRole('button', { name: 'Send to Customer Care' }).click();

    await expect(page.getByText('Thank you Test Planner')).toBeVisible();
    await expect(page.getByText('A Customer Care Representative will be contacting you.')).toBeVisible();
  });
});
