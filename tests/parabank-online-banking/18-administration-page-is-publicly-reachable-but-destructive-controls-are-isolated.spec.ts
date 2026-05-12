import { expect, test } from '@playwright/test';

// spec: specs/parabank-online-banking.md

test.describe('ParaBank Online Banking', () => {
  test('Administration page is publicly reachable but destructive controls are isolated', async ({ page }) => {
    await page.goto('');
    await page.getByRole('link', { name: 'Admin Page' }).click();

    await expect(page).toHaveURL(/admin\.htm/);
    await expect(page.getByRole('heading', { name: 'Administration' })).toBeVisible();
    await expect(page.getByText('Database')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Initialize' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clean' })).toBeVisible();
    await expect(page.getByText('JMS Service')).toBeVisible();
    await expect(page.getByText('Status: Running')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Shutdown' })).toBeVisible();
    await expect(page.getByText('Data Access Mode')).toBeVisible();
    await expect(page.getByText('SOAP')).toBeVisible();
    await expect(page.getByText('REST (XML)')).toBeVisible();
    await expect(page.getByText('REST (JSON)')).toBeVisible();
    await expect(page.getByText('JDBC')).toBeVisible();
    await expect(page.getByText('Web Service')).toBeVisible();
    await expect(page.getByText('Application Settings')).toBeVisible();
    await expect(page.getByText('Init. Balance: $')).toBeVisible();
    await expect(page.getByText('Min. Balance: $')).toBeVisible();
    await expect(page.getByText('Loan Provider:')).toBeVisible();
    await expect(page.getByText('Loan Processor:')).toBeVisible();
    await expect(page.getByText('Threshold:')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });
});
