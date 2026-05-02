import { expect, type Page } from '@playwright/test';

export const PARABANK_BASE_URL = 'https://parabank.parasoft.com/parabank';

export const existingCustomer = {
  username: process.env.PARABANK_USERNAME ?? 'john',
  password: process.env.PARABANK_PASSWORD ?? 'demo',
  greeting: 'Welcome John Smith',
};

export type CustomerIdentity = {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  ssn: string;
};

export const defaultCustomerIdentity: CustomerIdentity = {
  firstName: 'Test',
  lastName: 'User',
  street: '1 Main St',
  city: 'Metropolis',
  state: 'CA',
  zipCode: '90210',
  phoneNumber: '5551234567',
  ssn: '123456789',
};

export const requiredRegistrationErrors = [
  'First name is required.',
  'Last name is required.',
  'Address is required.',
  'City is required.',
  'State is required.',
  'Zip Code is required.',
  'Social Security Number is required.',
  'Username is required.',
  'Password is required.',
  'Password confirmation is required.',
] as const;

export const requiredLookupErrors = [
  'First name is required.',
  'Last name is required.',
  'Address is required.',
  'City is required.',
  'State is required.',
  'Zip Code is required.',
  'Social Security Number is required.',
] as const;

export function uniqueUsername(prefix = 'auth'): string {
  const safePrefix = prefix.replace(/[^a-z0-9]/gi, '').slice(0, 8) || 'auth';
  const entropy = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

  return `${safePrefix}${entropy.slice(-7)}`;
}

export function uniqueCustomerIdentity(prefix = 'Test'): CustomerIdentity {
  const suffix = Math.random().toString(36).slice(2, 7);
  const ssn = Math.floor(100000000 + Math.random() * 900000000).toString();

  return {
    ...defaultCustomerIdentity,
    firstName: prefix,
    lastName: `User${suffix}`,
    street: `${Math.floor(100 + Math.random() * 900)} ${suffix} Main St`,
    ssn,
  };
}

export async function gotoParaBank(page: Page, path = '/index.htm'): Promise<void> {
  await page.goto(`${PARABANK_BASE_URL}${path}`);
}

export async function fillLoginForm(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
}

export async function loginExistingCustomer(page: Page): Promise<void> {
  await gotoParaBank(page);
  await fillLoginForm(page, existingCustomer.username, existingCustomer.password);
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page).toHaveURL(/overview\.htm/);
  await expect(page.getByText(existingCustomer.greeting)).toBeVisible();
}

export async function fillRegistrationForm(
  page: Page,
  username: string,
  password = 'password1',
  repeatedPassword = password,
  identity: CustomerIdentity = defaultCustomerIdentity,
): Promise<void> {
  await page.locator('input[name="customer.firstName"]').fill(identity.firstName);
  await page.locator('input[name="customer.lastName"]').fill(identity.lastName);
  await page.locator('input[name="customer.address.street"]').fill(identity.street);
  await page.locator('input[name="customer.address.city"]').fill(identity.city);
  await page.locator('input[name="customer.address.state"]').fill(identity.state);
  await page.locator('input[name="customer.address.zipCode"]').fill(identity.zipCode);
  await page.locator('input[name="customer.phoneNumber"]').fill(identity.phoneNumber);
  await page.locator('input[name="customer.ssn"]').fill(identity.ssn);
  await page.locator('input[name="customer.username"]').fill(username);
  await page.locator('input[name="customer.password"]').fill(password);
  await page.locator('input[name="repeatedPassword"]').fill(repeatedPassword);
}

export async function registerCustomer(
  page: Page,
  username: string,
  password = 'password1',
  identity: CustomerIdentity = defaultCustomerIdentity,
): Promise<void> {
  await gotoParaBank(page, '/register.htm');
  await fillRegistrationForm(page, username, password, password, identity);
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page).toHaveTitle(/Customer Created/);
  await expect(page.getByRole('heading', { name: `Welcome ${username}` })).toBeVisible();
}

export async function fillLookupForm(
  page: Page,
  identity: CustomerIdentity = defaultCustomerIdentity,
): Promise<void> {
  await page.locator('input[name="firstName"]').fill(identity.firstName);
  await page.locator('input[name="lastName"]').fill(identity.lastName);
  await page.locator('input[name="address.street"]').fill(identity.street);
  await page.locator('input[name="address.city"]').fill(identity.city);
  await page.locator('input[name="address.state"]').fill(identity.state);
  await page.locator('input[name="address.zipCode"]').fill(identity.zipCode);
  await page.locator('input[name="ssn"]').fill(identity.ssn);
}
