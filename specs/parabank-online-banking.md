# ParaBank Online Banking Test Plan

## Overview
This plan covers the ParaBank online banking web application at `https://parabank.parasoft.com/parabank/`. Exploration focused on customer registration, authentication, authenticated banking services, public support forms, informational navigation, and public administration controls.

## Scope
- Public home page, navigation, customer login, registration, customer lookup, and customer care forms.
- Authenticated account services: account overview, account details/activity, open account, transfer funds, bill pay, find transactions, update contact info, request loan, and logout.
- Public administration page visibility and configuration controls.
- Form validation, error states, and access-control behavior observable through the UI.

## Out of Scope
- Direct API, SOAP, WSDL, WADL, or OpenAPI contract testing.
- External Parasoft links such as Products, Locations, Forum, and `www.parasoft.com`.
- Destructive admin actions in shared environments, including database initialize, database clean, and JMS shutdown.
- Visual regression testing beyond basic layout/content visibility.

## Assumptions
- Tests start from a fresh browser context unless a scenario explicitly uses a previously created customer.
- A unique disposable customer can be created during setup because no reusable credentials were available in project configuration.
- Account numbers, transaction IDs, and created loan account IDs are dynamic and should be captured from the UI.
- The application date observed during exploration was `05-12-2026`; generated tests should avoid hard-coding the current date unless the environment is fixed.
- Some invalid operations display generic internal error messages rather than field-level validation.

## Test Data and Setup
- Base URL: `https://parabank.parasoft.com/parabank/`
- Disposable customer used during exploration:
  - First name: `Test`
  - Last name: `Planner`
  - Address: `123 Main St`
  - City: `Madrid`
  - State: `MD`
  - Zip Code: `28001`
  - Phone: `5551234567`, later updated to `5559876543`
  - SSN: `123-45-6789`
  - Username pattern: `codex<timestamp>`
  - Password: `Pass123!`
- Payee data:
  - Payee name: `Utility Co`
  - Address: `456 Utility Ave`
  - City: `Madrid`
  - State: `MD`
  - Zip Code: `28002`
  - Phone: `5552223333`
  - Payee account: `9999`
- Recommended setup: create a unique customer through the Register flow and capture the first checking account number from Accounts Overview.

## Explored Areas
- Home page: `index.htm`
- Register: `register.htm`
- Login: `login.htm`
- Customer lookup: `lookup.htm`
- Contact support: `contact.htm`
- Accounts overview: `overview.htm`
- Account activity/detail: `activity.htm?id=<accountId>`
- Open account: `openaccount.htm`
- Transfer funds: `transfer.htm`
- Bill pay: `billpay.htm`
- Find transactions: `findtrans.htm`
- Transaction details: `transaction.htm?id=<transactionId>`
- Update profile: `updateprofile.htm`
- Request loan: `requestloan.htm`
- Administration: `admin.htm`
- Services listing: `services.htm`

## Test Scenarios

### 1. Existing customer can log in and view accounts overview

**Type:** Happy path | Authentication

**Preconditions / Starting State:**
A valid customer exists. If no reusable customer is available, create one through the registration flow first.

**Steps:**
1. Open the ParaBank home page.
2. Enter the valid username in the Customer Login username field.
3. Enter the valid password in the Customer Login password field.
4. Click `Log In`.
5. Click `Accounts Overview` if not already on the overview page.

**Expected Results:**
- The authenticated sidebar displays `Welcome <First Name> <Last Name>`.
- `Account Services` links are visible.
- `Accounts Overview` displays a table with columns `Account`, `Balance*`, and `Available Amount`.
- At least one account link is visible.

**Success Criteria:**
The customer reaches `overview.htm` and can see account balances.

**Failure Conditions:**
- Login returns `Error!`.
- Account Services menu is missing.
- Account overview table is empty for a newly registered customer.

**Suggested Assertions / Locator Hints:**
- `getByRole('heading', { name: 'Accounts Overview' })`
- `getByRole('link', { name: 'Accounts Overview' })`
- `getByText('Welcome Test Planner')`
- `getByRole('columnheader', { name: 'Account' })`
- Account link text is dynamic numeric text, for example `16341`.

**Notes:**
The registration flow created a checking account with a starting balance of `$9999.00` in the explored environment.

### 2. New customer can register and is logged in automatically

**Type:** Happy path | Authentication

**Preconditions / Starting State:**
Use a unique username for every run.

**Steps:**
1. Open the home page.
2. Click `Register`.
3. Fill First Name, Last Name, Address, City, State, Zip Code, SSN, Username, Password, and Confirm.
4. Optionally fill Phone.
5. Click `Register`.

**Expected Results:**
- Page title is `ParaBank | Customer Created`.
- A heading appears with `Welcome <username>`.
- Message appears: `Your account was created successfully. You are now logged in.`
- Authenticated `Account Services` links are visible.

**Success Criteria:**
The created user is authenticated without a separate login step.

**Failure Conditions:**
- Required field errors remain after valid input.
- Duplicate username or server error prevents registration.
- Password confirmation mismatch is accepted.

**Suggested Assertions / Locator Hints:**
- `getByRole('link', { name: 'Register' })`
- `getByRole('button', { name: 'Register' })`
- `getByRole('heading', { name: /Welcome codex/ })`
- `getByText('Your account was created successfully. You are now logged in.')`

**Notes:**
Use CSS IDs with dots carefully, for example `[id="customer.firstName"]`.

### 3. Registration required fields show validation messages

**Type:** Validation | Negative

**Preconditions / Starting State:**
User is on `register.htm` with all fields empty.

**Steps:**
1. Click `Register` without entering any values.

**Expected Results:**
- Required messages appear for First Name, Last Name, Address, City, State, Zip Code, SSN, Username, Password, and Confirm.
- Phone is not required in the observed registration form.

**Success Criteria:**
The form remains on `register.htm` and shows field-level validation beside each required field.

**Failure Conditions:**
- Empty registration creates a customer.
- Required error messages are missing.

**Suggested Assertions / Locator Hints:**
- `getByText('First name is required.')`
- `getByText('Last name is required.')`
- `getByText('Address is required.')`
- `getByText('Social Security Number is required.')`
- `getByText('Username is required.')`
- `getByText('Password confirmation is required.')`

**Notes:**
Add a separate password mismatch case if generator coverage is extended.

### 4. Login rejects empty and invalid credentials

**Type:** Negative | Authentication

**Preconditions / Starting State:**
User is logged out on the home page.

**Steps:**
1. Click `Log In` with username and password empty.
2. Observe the error.
3. Enter an invalid username and password.
4. Click `Log In`.

**Expected Results:**
- Empty credentials show `Please enter a username and password.`
- Invalid credentials remain unauthenticated and show an error.

**Success Criteria:**
The Account Services menu is not visible after invalid login attempts.

**Failure Conditions:**
- User is authenticated with blank or invalid credentials.
- The login form disappears after an invalid attempt.

**Suggested Assertions / Locator Hints:**
- `getByRole('button', { name: 'Log In' })`
- `getByText('Please enter a username and password.')`
- `getByRole('heading', { name: 'Error!' })`
- Assert `getByRole('heading', { name: 'Account Services' })` is not visible.

**Notes:**
Invalid non-empty credentials produced the generic message `An internal error has occurred and has been logged.` during exploration.

### 5. Account overview links to account activity details

**Type:** Navigation | Regression

**Preconditions / Starting State:**
User is authenticated and has at least one account.

**Steps:**
1. Navigate to `Accounts Overview`.
2. Capture the first account number from the table.
3. Click the account number link.
4. Review Account Details and Account Activity.

**Expected Results:**
- Page title is `ParaBank | Account Activity`.
- `Account Details` displays Account Number, Account Type, Balance, and Available.
- `Account Activity` contains Activity Period and Type filters plus a `Go` button.
- If no transactions exist, `No transactions found.` is displayed.

**Success Criteria:**
The clicked account number matches the Account Number shown in details.

**Failure Conditions:**
- Account link is not clickable.
- Account details show a different account number.
- Activity filters fail to render.

**Suggested Assertions / Locator Hints:**
- `getByRole('heading', { name: 'Account Details' })`
- `getByRole('heading', { name: 'Account Activity' })`
- `getByText('Account Type:')`
- `getByRole('button', { name: 'Go' })`
- Period combobox options include `All`, `January`, and other months.
- Type combobox options include `All`, `Credit`, and `Debit`.

**Notes:**
Newly created accounts may initially show `No transactions found.`

### 6. Customer can open an additional account

**Type:** Happy path

**Preconditions / Starting State:**
User is authenticated and has an existing funding account.

**Steps:**
1. Click `Open New Account`.
2. Select `CHECKING` or `SAVINGS`.
3. Select an existing account as the funding account.
4. Click `Open New Account`.
5. Capture the new account number from the confirmation.

**Expected Results:**
- `Account Opened!` heading appears.
- Message appears: `Congratulations, your account is now open.`
- `Your new account number:` is followed by a clickable account link.

**Success Criteria:**
The new account link opens an Account Activity page for the new account.

**Failure Conditions:**
- No confirmation is displayed.
- New account number is missing or not clickable.
- New account does not appear in Accounts Overview after refresh/navigation.

**Suggested Assertions / Locator Hints:**
- `getByRole('link', { name: 'Open New Account' })`
- Account type combobox options: `CHECKING`, `SAVINGS`
- `getByRole('heading', { name: 'Account Opened!' })`
- `getByText('Congratulations, your account is now open.')`

**Notes:**
The explored admin settings showed `Min. Balance: $129999`, but account creation still succeeded with a `$9999.00` starting balance.

### 7. Customer can transfer funds between accounts

**Type:** Happy path

**Preconditions / Starting State:**
User is authenticated and has at least two accounts.

**Steps:**
1. Click `Transfer Funds`.
2. Enter `25.00` in Amount.
3. Select a source account.
4. Select a different target account.
5. Click `Transfer`.

**Expected Results:**
- `Transfer Complete!` heading appears.
- Confirmation states `$25.00 has been transferred from account #<source> to account #<target>.`
- Message appears: `See Account Activity for more details.`

**Success Criteria:**
The transfer confirmation displays the exact amount and account numbers selected.

**Failure Conditions:**
- Transfer completes with the wrong accounts or amount.
- Confirmation is missing.
- Balances do not update after returning to Accounts Overview.

**Suggested Assertions / Locator Hints:**
- `getByRole('link', { name: 'Transfer Funds' })`
- Amount textbox is near text `Amount: $`
- Source and target account comboboxes show account numbers.
- `getByRole('button', { name: 'Transfer' })`
- `getByRole('heading', { name: 'Transfer Complete!' })`

**Notes:**
Selecting the same account as both source and target should be covered as an edge case.

### 8. Blank transfer amount returns an error

**Type:** Negative | Error handling

**Preconditions / Starting State:**
User is authenticated on `transfer.htm`.

**Steps:**
1. Leave Amount blank.
2. Click `Transfer`.

**Expected Results:**
- `Error!` heading appears.
- Message appears: `An internal error has occurred and has been logged.`

**Success Criteria:**
No transfer confirmation is shown.

**Failure Conditions:**
- Transfer succeeds with an empty amount.
- Account balances change.

**Suggested Assertions / Locator Hints:**
- `getByRole('heading', { name: 'Error!' })`
- `getByText('An internal error has occurred and has been logged.')`
- Assert `getByRole('heading', { name: 'Transfer Complete!' })` is not visible.

**Notes:**
This is a server error state, not field-level validation.

### 9. Customer can complete a bill payment

**Type:** Happy path

**Preconditions / Starting State:**
User is authenticated and has at least one account.

**Steps:**
1. Click `Bill Pay`.
2. Fill payee name, address, city, state, zip code, phone, account number, verify account number, and amount.
3. Select a funding account.
4. Click `Send Payment`.

**Expected Results:**
- `Bill Payment Complete` heading appears.
- Confirmation states `Bill Payment to Utility Co in the amount of $10.00 from account <account> was successful.`
- Message appears: `See Account Activity for more details.`

**Success Criteria:**
The payee, amount, and funding account in the confirmation match submitted data.

**Failure Conditions:**
- Payment completes when account and verify account do not match.
- Required payee details are ignored.
- Confirmation shows wrong amount or account.

**Suggested Assertions / Locator Hints:**
- `getByRole('link', { name: 'Bill Pay' })`
- `getByRole('heading', { name: 'Bill Payment Service' })`
- `getByRole('button', { name: 'Send Payment' })`
- `getByRole('heading', { name: 'Bill Payment Complete' })`
- `getByText(/Bill Payment to Utility Co in the amount of \\$10\\.00/)`

**Notes:**
Phone is required on Bill Pay, unlike Registration.

### 10. Bill Pay validates required fields and account confirmation

**Type:** Validation | Negative

**Preconditions / Starting State:**
User is authenticated on `billpay.htm`.

**Steps:**
1. Click `Send Payment` with the form empty.
2. Verify required messages.
3. Fill all fields but use different Account and Verify Account values.
4. Click `Send Payment`.

**Expected Results:**
- Empty form shows required messages for Payee Name, Address, City, State, Zip Code, Phone, Account Number, Verify Account Number, and Amount.
- Mismatched accounts show `The account numbers do not match.`
- Payment is not completed.

**Success Criteria:**
The form stays on the Bill Payment Service page until valid data is provided.

**Failure Conditions:**
- Empty or mismatched values create a payment.
- Required messages are absent.

**Suggested Assertions / Locator Hints:**
- `getByText('Payee name is required.')`
- `getByText('Phone number is required.')`
- `getByText('The amount cannot be empty.')`
- `getByText('The account numbers do not match.')`

**Notes:**
Use `[name="payee.accountNumber"]`, `[name="verifyAccount"]`, and `[name="amount"]` for stable field targeting.

### 11. Customer can find and open transaction details

**Type:** Happy path | Navigation

**Preconditions / Starting State:**
User is authenticated and has a known transaction, such as a bill payment for `$10.00`.

**Steps:**
1. Click `Find Transactions`.
2. Select the account that contains the transaction.
3. Enter `10` in `Find by Amount`.
4. Click the Find Transactions button for amount search.
5. Click the transaction description link in results.

**Expected Results:**
- `Transaction Results` heading appears.
- Results table includes Date, Transaction, Debit (-), and Credit (+) columns.
- Row displays `Bill Payment to Utility Co` and `$10.00`.
- Transaction Details page displays Transaction ID, Date, Description, Type, and Amount.

**Success Criteria:**
The detail page values match the selected transaction result.

**Failure Conditions:**
- No matching transaction is returned.
- Transaction link does not navigate.
- Detail page amount or type differs from the result row.

**Suggested Assertions / Locator Hints:**
- `getByRole('link', { name: 'Find Transactions' })`
- `locator('#amount')`
- `locator('#findByAmount')`
- `getByRole('heading', { name: 'Transaction Results' })`
- `getByRole('link', { name: 'Bill Payment to Utility Co' })`
- `getByRole('heading', { name: 'Transaction Details' })`

**Notes:**
Also cover find by transaction ID, date, date range, no-result searches, and invalid date formats.

### 12. Customer can update contact information

**Type:** Happy path

**Preconditions / Starting State:**
User is authenticated.

**Steps:**
1. Click `Update Contact Info`.
2. Verify existing customer values are prefilled.
3. Change the Phone field to `5559876543`.
4. Click `Update Profile`.

**Expected Results:**
- `Profile Updated` heading appears.
- Message appears: `Your updated address and phone number have been added to the system.`

**Success Criteria:**
Returning to Update Contact Info shows the updated phone number.

**Failure Conditions:**
- Update confirmation is missing.
- Existing profile values are not prefilled.
- Updated value does not persist.

**Suggested Assertions / Locator Hints:**
- `getByRole('link', { name: 'Update Contact Info' })`
- `getByRole('heading', { name: 'Update Profile' })`
- `[id="customer.phoneNumber"]`
- `getByRole('button', { name: 'Update Profile' })`
- `getByRole('heading', { name: 'Profile Updated' })`

**Notes:**
Add negative coverage for blank required profile fields.

### 13. Loan request can be approved or denied based on amount and down payment

**Type:** Happy path | Edge case

**Preconditions / Starting State:**
User is authenticated and has an account with available funds.

**Steps:**
1. Click `Request Loan`.
2. Enter a modest loan amount, such as `1000`.
3. Enter a down payment, such as `100`.
4. Select an account.
5. Click `Apply Now`.
6. Repeat with a very large loan amount, such as `1000000`, and down payment `0`.

**Expected Results:**
- Modest loan request shows `Loan Request Processed` with `Status: Approved`.
- Approved request displays `Congratulations, your loan has been approved.` and a new account link.
- Large request shows `Status: Denied`.
- Denied request displays `We cannot grant a loan in that amount with your available funds.`

**Success Criteria:**
Both approved and denied paths render deterministically based on submitted values.

**Failure Conditions:**
- Empty or invalid loan values are accepted silently.
- Approved loan has no new account link.
- Denied loan creates a loan account.

**Suggested Assertions / Locator Hints:**
- `getByRole('link', { name: 'Request Loan' })`
- `locator('#amount')`
- `locator('#downPayment')`
- `locator('#fromAccountId')`
- `getByRole('button', { name: 'Apply Now' })`
- `getByText('Status:')`
- `getByText('Approved')`
- `getByText('Denied')`

**Notes:**
Submitting blank loan amount/down payment produced the generic internal error message during exploration.

### 14. Logged out user cannot access authenticated account services

**Type:** Authentication | Permission

**Preconditions / Starting State:**
User is authenticated.

**Steps:**
1. Click `Log Out`.
2. Verify the home page shows Customer Login.
3. Navigate directly to authenticated URLs such as `overview.htm`, `transfer.htm`, or `billpay.htm`.

**Expected Results:**
- Logout returns to the public home page.
- Customer Login is visible.
- Authenticated pages should not expose customer data when no session is present.

**Success Criteria:**
No account numbers, balances, or Account Services menu are visible after logout.

**Failure Conditions:**
- Account data remains visible after logout.
- Direct URLs bypass authentication.

**Suggested Assertions / Locator Hints:**
- `getByRole('link', { name: 'Log Out' })`
- `getByRole('heading', { name: 'Customer Login' })`
- Assert `getByRole('heading', { name: 'Account Services' })` is not visible.
- Assert account number links captured before logout are not visible.

**Notes:**
Direct authenticated URL checks were identified for the plan; run them in tests after logout.

### 15. Customer lookup validates required identity fields and handles missing records

**Type:** Validation | Negative

**Preconditions / Starting State:**
User is logged out.

**Steps:**
1. Click `Forgot login info?`.
2. Click `Find My Login Info` with all fields empty.
3. Fill identity fields with data that does not match a customer.
4. Click `Find My Login Info`.

**Expected Results:**
- Empty form shows required messages for First Name, Last Name, Address, City, State, Zip Code, and SSN.
- Non-matching customer data shows `The customer information provided could not be found.`

**Success Criteria:**
Lookup does not reveal credentials without matching identity information.

**Failure Conditions:**
- Empty or non-matching data reveals login information.
- Required validation is missing.

**Suggested Assertions / Locator Hints:**
- `getByRole('link', { name: 'Forgot login info?' })`
- `getByRole('heading', { name: 'Customer Lookup' })`
- `getByText('First name is required.')`
- `getByText('Social Security Number is required.')`
- `getByText('The customer information provided could not be found.')`

**Notes:**
A successful lookup for the disposable user was not observed after profile update; treat successful credential recovery as an open follow-up unless stable seeded customer data is available.

### 16. Public customer care form validates required fields and accepts a message

**Type:** Happy path | Validation

**Preconditions / Starting State:**
User is on `contact.htm`; authentication is not required.

**Steps:**
1. Click `contact` or `Contact Us`.
2. Click `Send to Customer Care` with the form empty.
3. Verify required messages.
4. Fill Name, Email, Phone, and Message.
5. Click `Send to Customer Care`.

**Expected Results:**
- Empty form shows `Name is required.`, `Email is required.`, `Phone is required.`, and `Message is required.`
- Valid submission shows `Thank you Test Planner`.
- Message appears: `A Customer Care Representative will be contacting you.`

**Success Criteria:**
The form enforces required fields and displays a confirmation with the submitted name.

**Failure Conditions:**
- Empty form is submitted.
- Valid form does not show confirmation.

**Suggested Assertions / Locator Hints:**
- `getByRole('heading', { name: 'Customer Care' })`
- `locator('#name')`, `locator('#email')`, `locator('#phone')`, `locator('#message')`
- `getByRole('button', { name: 'Send to Customer Care' })`
- `getByText('Thank you Test Planner')`

**Notes:**
Add email format validation coverage if the app exposes it; only required-field validation was observed.

### 17. Public navigation and services pages render expected content

**Type:** Navigation | Regression

**Preconditions / Starting State:**
User is logged out.

**Steps:**
1. Navigate through Home, About Us, Services, Contact Us, and Site Map links.
2. On Services, verify public service documentation links and service sections render.
3. Verify the login panel remains available on public pages.

**Expected Results:**
- Public pages load without authentication.
- Services page lists available SOAP services, bookstore services, and service links such as WSDL.
- Customer Login remains visible on public content pages.

**Success Criteria:**
Public navigation does not break the login panel or global footer/header.

**Failure Conditions:**
- Public pages return server errors.
- Navigation links route to unexpected internal pages.
- Login panel disappears unexpectedly.

**Suggested Assertions / Locator Hints:**
- Header links: `About Us`, `Services`, `Admin Page`, `home`, `about`, `contact`
- Footer links: `Home`, `About Us`, `Services`, `Site Map`, `Contact Us`
- `getByText('Available Bookstore SOAP services:')`
- `getByRole('heading', { name: 'Customer Login' })`

**Notes:**
External links should be asserted by href or excluded from browser navigation tests.

### 18. Administration page is publicly reachable but destructive controls are isolated

**Type:** Permission | Regression | Edge case

**Preconditions / Starting State:**
Use only an isolated test environment for destructive admin operations.

**Steps:**
1. While logged out, click `Admin Page`.
2. Verify the Administration page renders.
3. Verify Database, JMS Service, Data Access Mode, Web Service, and Application Settings sections are visible.
4. In shared environments, do not click `Initialize`, `Clean`, or `Shutdown`.
5. In isolated environments only, submit a non-destructive settings change and restore defaults.

**Expected Results:**
- `Administration` heading appears without authentication.
- Database buttons `Initialize` and `Clean` are visible.
- JMS `Status: Running` and `Shutdown` button are visible.
- Data Access Mode radio options include `SOAP`, `REST (XML)`, `REST (JSON)`, and `JDBC*`.
- Application Settings include Init. Balance, Min. Balance, Loan Provider, Loan Processor, and Threshold.

**Success Criteria:**
Admin controls are discoverable and, if tested in isolation, setting changes produce predictable confirmation and can be restored.

**Failure Conditions:**
- Public admin page unexpectedly exposes destructive actions in production-like environments.
- Settings fail to persist or cannot be restored in isolated tests.

**Suggested Assertions / Locator Hints:**
- `getByRole('link', { name: 'Admin Page' })`
- `getByRole('heading', { name: 'Administration' })`
- `getByRole('button', { name: 'Initialize' })`
- `getByRole('button', { name: 'Clean' })`
- `getByRole('button', { name: 'Shutdown' })`
- `getByRole('button', { name: 'Submit' })`
- `getByText('REST (JSON)')`
- `getByText('Init. Balance: $')`

**Notes:**
This is a risk-sensitive area. Tests that click destructive controls must not run against shared public state.

## Edge Cases and Negative Coverage
- Register with duplicate username and assert duplicate-user validation.
- Register with password and confirmation mismatch.
- Register with whitespace-only required fields.
- Login with only username or only password.
- Attempt direct access to each authenticated page after logout.
- Transfer zero, negative, non-numeric, very large, and decimal precision amounts.
- Transfer from and to the same account.
- Bill Pay with non-numeric amount, zero/negative amount, invalid phone/email-like text, and very long payee values.
- Bill Pay with same account value and verify value containing spaces or leading zeros.
- Find Transactions by invalid transaction ID, missing ID, invalid date format, reversed date range, future date, and no-result amount.
- Account Activity filters for month and transaction type after creating debit and credit transactions.
- Update Contact Info with blank required fields and very long address values.
- Loan Request with blank fields, non-numeric values, negative amount/down payment, down payment greater than amount, and different loan processor settings in isolated admin mode.
- Customer Care with invalid email format, very long message, and special characters in message.
- Admin settings with invalid numeric values for balances and threshold in isolated environment only.

## Risks and Gaps
- The public ParaBank environment appears stateful and shared; account numbers, balances, and transaction IDs are dynamic.
- Some invalid actions return generic internal errors rather than user-friendly validation. Tests should assert observed behavior but flag it as a product risk.
- Administration controls are publicly reachable and include destructive actions. Destructive paths were not executed during exploration.
- Successful customer lookup was not observed for the disposable user after profile update; use stable seeded data or treat successful lookup as a separate investigation.
- External Parasoft destinations were not followed because they are outside the banking app scope.
- The Services page is large and documentation-oriented; deeper service contract validation belongs in API tests, not UI flow tests.
