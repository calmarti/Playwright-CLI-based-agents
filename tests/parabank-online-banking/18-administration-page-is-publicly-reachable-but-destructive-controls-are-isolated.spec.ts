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
    await expect(page.getByText('Status:')).toBeVisible();
    await expect(page.getByText(/Running|Stopped/)).toBeVisible();
    await expect(page.getByRole('button', { name: /Shutdown|Startup/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Data Access Mode' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'SOAP', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'REST (XML)', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'REST (JSON)', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'JDBC*', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Web Service' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Application Settings' })).toBeVisible();
    await expect(page.getByText('Init. Balance: $')).toBeVisible();
    await expect(page.getByText('Min. Balance: $')).toBeVisible();
    await expect(page.getByText('Loan Provider:')).toBeVisible();
    await expect(page.getByText('Loan Processor:')).toBeVisible();
    await expect(page.getByText('Threshold:')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });
});
