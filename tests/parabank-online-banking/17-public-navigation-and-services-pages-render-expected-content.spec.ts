import { expect, test } from '@playwright/test';

// spec: specs/parabank-online-banking.md

test.describe('ParaBank Online Banking', () => {
  test('Public navigation and services pages render expected content', async ({ page }) => {
    await page.goto('');
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();

    await page.getByRole('link', { name: 'About Us' }).first().click();
    await expect(page).toHaveURL(/about\.htm/);
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();

    await page.getByRole('link', { name: 'Services' }).first().click();
    await expect(page).toHaveURL(/services\.htm/);
    await expect(page.getByText('Available Bookstore SOAP services:')).toBeVisible();
    await expect(page.getByText('Bookstore services:')).toBeVisible();
    await expect(page.getByText('Available ParaBank SOAP services:')).toBeVisible();
    await expect(page.getByRole('link', { name: /WSDL|Bookstore/ }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();

    await page.getByRole('link', { name: 'Contact Us' }).click();
    await expect(page).toHaveURL(/contact\.htm/);
    await expect(page.getByRole('heading', { name: 'Customer Care' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();

    await page.getByRole('link', { name: 'Site Map' }).click();
    await expect(page).toHaveURL(/sitemap\.htm/);
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();

    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL(/index\.htm/);
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
  });
});
