# ParaBank Authentication Test Plan

## Overview

This test plan covers functional authentication behavior for ParaBank at `https://parabank.parasoft.com/parabank/index.htm`. The explored suite includes customer login, logout, account registration, credential lookup, unauthenticated access to protected pages, validation errors, and observed negative-case behavior.

## Scope

- Customer login from the `Customer Login` panel.
- Logout from authenticated account services.
- Registration for online account access.
- Required-field validation on registration and credential lookup.
- Password confirmation validation during registration.
- Credential lookup through `Forgot login info?`.
- Direct access to authenticated pages while logged out.
- Negative login attempts and expected rejection behavior.

## Out of Scope

- Account-management flows after authentication, such as transfers, bill pay, loan requests, or profile updates.
- Security testing beyond observable functional outcomes.
- Cross-browser, mobile, accessibility, visual, and performance coverage.
- External Parasoft links in the header/footer.

## Assumptions

- Tests start from a fresh browser context unless a scenario explicitly requires an authenticated session.
- The target environment is the live ParaBank demo site and may reset or behave differently between runs.
- Existing-user credentials may be supplied through environment variables. The local `.env` contains `USERNAME=john` and `PASSWORD=demo`.
- Registration tests should generate a unique username per run, such as `auth_<timestamp>`, to avoid duplicate-user collisions.
- The generator should prefer semantic locators where available, but several fields have no accessible labels and may require `input[name="..."]` locators.
- Current exploration observed a likely environment defect: arbitrary invalid credentials posted to `login.htm` received a `302` to `overview.htm` and displayed `Welcome John Smith`. Negative login scenarios below describe the expected functional behavior, and this defect is listed in Risks and Gaps.

## Test Data and Setup

- Existing user:
  - Username: `john`
  - Password: `demo`
  - Expected authenticated greeting: `Welcome John Smith`
- New registration user:
  - First Name: `Test`
  - Last Name: `User`
  - Address: `1 Main St`
  - City: `Metropolis`
  - State: `CA`
  - Zip Code: `90210`
  - Phone: `5551234567`
  - SSN: `123456789`
  - Username: dynamically generated unique value, for example `auth_${Date.now()}`
  - Password: `password1`

## Explored Areas

- Welcome page: `index.htm`, page title `ParaBank | Welcome | Online Banking`.
- Left navigation login panel headed `Customer Login`.
- Login form fields:
  - `input[name="username"]`
  - `input[name="password"]`
  - button `Log In`
- Authenticated accounts page: `overview.htm`, page title `ParaBank | Accounts Overview`, heading `Accounts Overview`, account services list, and `Log Out`.
- Registration page: `register.htm`, page title `ParaBank | Register for Free Online Account Access`, heading `Signing up is easy!`.
- Registration success state: page title `ParaBank | Customer Created`, heading `Welcome <username>`, message `Your account was created successfully. You are now logged in.`
- Credential lookup page: `lookup.htm`, page title `ParaBank | Customer Lookup`, heading `Customer Lookup`.
- Error page states with heading `Error!`.

## Test Scenarios

### 1. Existing Customer Can Log In

**Type:** Happy path | Authentication

**Starting State / Assumptions:**
- Browser context is logged out.
- Existing user `john` / `demo` is available.

**Preconditions:**
- Navigate to `https://parabank.parasoft.com/parabank/index.htm`.

**Steps:**
1. Fill `input[name="username"]` with `john`.
2. Fill `input[name="password"]` with `demo`.
3. Click the `Log In` button.

**Expected Results:**
- User is navigated to `overview.htm`.
- Page title is `ParaBank | Accounts Overview`.
- The left panel shows `Welcome John Smith`.
- `Account Services` and `Log Out` are visible.
- The `Customer Login` form is no longer visible.

**Success Criteria:**
- The authenticated account overview is displayed for John Smith.

**Failure Conditions:**
- The user remains on `index.htm` or `login.htm`.
- An `Error!` message is displayed.
- The account services menu is missing.

**Suggested Assertions / Locator Hints:**
- `await expect(page).toHaveURL(/overview\.htm/)`
- `await expect(page.getByText('Welcome John Smith')).toBeVisible()`
- `await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible()`
- `await expect(page.getByRole('link', { name: 'Log Out' })).toBeVisible()`

**Notes:**
- Local `.env` contains these credentials.

### 2. Authenticated Customer Can Log Out

**Type:** Happy path | Authentication

**Starting State / Assumptions:**
- User is authenticated and on `overview.htm`.

**Preconditions:**
- Complete scenario 1 or authenticate through setup.

**Steps:**
1. Click the `Log Out` link in the account services list.

**Expected Results:**
- User is returned to the welcome page.
- The `Customer Login` panel is visible.
- The `Log Out` link and account services are no longer visible.

**Success Criteria:**
- The session is no longer authenticated and login controls are restored.

**Failure Conditions:**
- User remains on an authenticated page.
- `Account Services` or `Log Out` remains visible after logout.

**Suggested Assertions / Locator Hints:**
- `await expect(page).toHaveURL(/index\.htm/)`
- `await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible()`
- `await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0)`

**Notes:**
- Observed logout URL includes `index.htm?ConnType=JDBC`.

### 3. Login Rejects Empty Username and Password

**Type:** Negative | Validation | Authentication

**Starting State / Assumptions:**
- Browser context is logged out.
- Both login fields are blank.

**Preconditions:**
- Navigate to `index.htm`.

**Steps:**
1. Leave `input[name="username"]` blank.
2. Leave `input[name="password"]` blank.
3. Click `Log In`.

**Expected Results:**
- User is navigated to `login.htm`.
- Page title is `ParaBank | Error`.
- Error heading `Error!` is visible.
- Message `Please enter a username and password.` is visible.
- Login form remains available.

**Success Criteria:**
- Blank login is rejected with the observed validation message.

**Failure Conditions:**
- User reaches `overview.htm`.
- No validation message is displayed.

**Suggested Assertions / Locator Hints:**
- `await expect(page).toHaveURL(/login\.htm/)`
- `await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible()`
- `await expect(page.getByText('Please enter a username and password.')).toBeVisible()`

**Notes:**
- Observed message is the same when only one login field is populated.

### 4. Login Rejects Username Without Password

**Type:** Negative | Validation | Authentication

**Starting State / Assumptions:**
- Browser context is logged out.

**Preconditions:**
- Navigate to `index.htm`.

**Steps:**
1. Fill `input[name="username"]` with `john`.
2. Leave `input[name="password"]` blank.
3. Click `Log In`.

**Expected Results:**
- User remains unauthenticated.
- Error heading `Error!` is visible.
- Message `Please enter a username and password.` is visible.
- Account services are not visible.

**Success Criteria:**
- Partial login submission is rejected.

**Failure Conditions:**
- User reaches `overview.htm`.
- `Welcome John Smith` is visible.

**Suggested Assertions / Locator Hints:**
- `await expect(page.getByText('Please enter a username and password.')).toBeVisible()`
- `await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0)`

**Notes:**
- Reset or reload the page between negative login attempts so prior field values do not leak into the next scenario.

### 5. Login Rejects Invalid Credentials

**Type:** Negative | Authentication | Regression

**Starting State / Assumptions:**
- Browser context is logged out.
- Test username is known not to exist, such as `no_such_user_<timestamp>`.

**Preconditions:**
- Navigate to `index.htm`.

**Steps:**
1. Fill `input[name="username"]` with the nonexistent username.
2. Fill `input[name="password"]` with `bad-pass`.
3. Click `Log In`.

**Expected Results:**
- User remains unauthenticated.
- The application displays an authentication error.
- `Accounts Overview`, `Welcome John Smith`, and `Log Out` are not visible.

**Success Criteria:**
- Invalid credentials cannot start an authenticated session.

**Failure Conditions:**
- User reaches `overview.htm`.
- Account services are visible.
- Any existing user is authenticated.

**Suggested Assertions / Locator Hints:**
- Prefer asserting the absence of authenticated UI:
  - `await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0)`
  - `await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toHaveCount(0)`
- If the environment returns a stable invalid-login message, assert that exact message.

**Notes:**
- During exploration on May 2, 2026, posting `username=no_such_user_1602&password=bad-pass` returned `302` to `overview.htm` and displayed `Welcome John Smith`. Treat that as a defect or environment configuration issue before enabling this as a passing negative test.

### 6. Direct Protected Page Access While Logged Out Is Blocked

**Type:** Negative | Authentication | Navigation

**Starting State / Assumptions:**
- Browser context is logged out.

**Preconditions:**
- Complete logout or start a fresh context.

**Steps:**
1. Navigate directly to `https://parabank.parasoft.com/parabank/overview.htm`.

**Expected Results:**
- User does not see account balances or account services.
- Page title is `ParaBank | Error`.
- Error heading `Error!` is visible.
- Message `An internal error has occurred and has been logged.` is visible.
- Login form remains available in the left panel.

**Success Criteria:**
- Protected account information is not displayed to an unauthenticated user.

**Failure Conditions:**
- Account balances or account service links are visible.
- `Welcome <customer>` is visible.

**Suggested Assertions / Locator Hints:**
- `await expect(page).toHaveTitle(/ParaBank \\| Error/)`
- `await expect(page.getByText('An internal error has occurred and has been logged.')).toBeVisible()`
- `await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toHaveCount(0)`

**Notes:**
- The current behavior shows a generic internal error rather than redirecting to login.

### 7. New Customer Can Register and Is Logged In

**Type:** Happy path | Authentication

**Starting State / Assumptions:**
- Browser context is logged out.
- Registration username is unique for the test run.

**Preconditions:**
- Navigate to `index.htm`.

**Steps:**
1. Click the `Register` link in the `Customer Login` panel.
2. Fill registration fields:
   - `input[name="customer.firstName"]`: `Test`
   - `input[name="customer.lastName"]`: `User`
   - `input[name="customer.address.street"]`: `1 Main St`
   - `input[name="customer.address.city"]`: `Metropolis`
   - `input[name="customer.address.state"]`: `CA`
   - `input[name="customer.address.zipCode"]`: `90210`
   - `input[name="customer.phoneNumber"]`: `5551234567`
   - `input[name="customer.ssn"]`: `123456789`
   - `input[name="customer.username"]`: unique username
   - `input[name="customer.password"]`: `password1`
   - `input[name="repeatedPassword"]`: `password1`
3. Click the `Register` button in the registration form.

**Expected Results:**
- Page title becomes `ParaBank | Customer Created`.
- Heading `Welcome <unique username>` is visible.
- Message `Your account was created successfully. You are now logged in.` is visible.
- Account services and `Log Out` are visible.
- The left panel shows `Welcome Test User`.

**Success Criteria:**
- Registration creates the customer and starts an authenticated session.

**Failure Conditions:**
- Validation messages remain visible.
- User is not logged in after successful registration.
- Duplicate username error appears for a supposedly unique username.

**Suggested Assertions / Locator Hints:**
- `await expect(page).toHaveTitle(/Customer Created/)`
- `await expect(page.getByRole('heading', { name: new RegExp(\`Welcome ${username}\`) })).toBeVisible()`
- `await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible()`
- `await expect(page.getByRole('link', { name: 'Log Out' })).toBeVisible()`

**Notes:**
- Observed success used username `authplan_1603`.

### 8. Registration Shows Required Field Errors

**Type:** Negative | Validation

**Starting State / Assumptions:**
- Browser context is logged out.

**Preconditions:**
- Navigate to `register.htm`.

**Steps:**
1. Leave all registration fields blank.
2. Click the registration form `Register` button.

**Expected Results:**
- User remains on `register.htm`.
- Required-field messages are visible:
  - `First name is required.`
  - `Last name is required.`
  - `Address is required.`
  - `City is required.`
  - `State is required.`
  - `Zip Code is required.`
  - `Social Security Number is required.`
  - `Username is required.`
  - `Password is required.`
  - `Password confirmation is required.`
- `Phone #` is not required.

**Success Criteria:**
- All required registration errors are shown and no account is created.

**Failure Conditions:**
- Registration succeeds with missing required fields.
- Any required error is missing.
- Phone number is incorrectly treated as required.

**Suggested Assertions / Locator Hints:**
- `await expect(page.getByText('First name is required.')).toBeVisible()`
- `await expect(page.getByText('Password confirmation is required.')).toBeVisible()`
- `await expect(page.getByRole('heading', { name: /Welcome / })).toHaveCount(0)`

**Notes:**
- Use the submit input in the registration form, not the left-panel `Register` link.

### 9. Registration Rejects Password Confirmation Mismatch

**Type:** Negative | Validation

**Starting State / Assumptions:**
- Browser context is logged out.
- All required fields except matching password confirmation are valid.

**Preconditions:**
- Navigate to `register.htm`.

**Steps:**
1. Fill all required personal information fields with valid data.
2. Fill `input[name="customer.username"]` with a unique username.
3. Fill `input[name="customer.password"]` with `password1`.
4. Fill `input[name="repeatedPassword"]` with `password2`.
5. Click the registration form `Register` button.

**Expected Results:**
- User remains on `register.htm`.
- Message `Passwords did not match.` is visible in the `Confirm:` row.
- Account services and `Log Out` are not visible.
- The new username is not shown in a `Welcome <username>` heading.

**Success Criteria:**
- Mismatched passwords block registration.

**Failure Conditions:**
- Account is created despite mismatched passwords.
- User becomes authenticated.

**Suggested Assertions / Locator Hints:**
- `await expect(page.getByText('Passwords did not match.')).toBeVisible()`
- `await expect(page.getByRole('link', { name: 'Log Out' })).toHaveCount(0)`

**Notes:**
- The page clears password fields after the failed submission while preserving other entered values.

### 10. Registration Rejects Duplicate Username

**Type:** Negative | Validation | Regression

**Starting State / Assumptions:**
- A customer username already exists.

**Preconditions:**
- Register a unique customer once, then log out.

**Steps:**
1. Navigate to `register.htm`.
2. Fill the registration form with valid personal data.
3. Reuse the previously registered username.
4. Fill matching password and confirmation.
5. Click `Register`.

**Expected Results:**
- Registration is rejected.
- User remains unauthenticated.
- A duplicate-username error is displayed.
- No account services are visible.

**Success Criteria:**
- Existing usernames cannot be registered again.

**Failure Conditions:**
- Duplicate username creates another account.
- User is logged in as the duplicate account.

**Suggested Assertions / Locator Hints:**
- Assert no `Log Out` link is visible.
- Assert no `Your account was created successfully. You are now logged in.` message appears.
- Add the exact duplicate-username message once confirmed in a stable environment.

**Notes:**
- This scenario was not fully executed during exploration. Keep it in the plan because duplicate-username handling is core auth coverage.

### 11. Forgot Login Info Shows Required Field Errors

**Type:** Negative | Validation

**Starting State / Assumptions:**
- Browser context is logged out.

**Preconditions:**
- Navigate to `index.htm`.

**Steps:**
1. Click `Forgot login info?`.
2. Leave all lookup fields blank.
3. Click `Find My Login Info`.

**Expected Results:**
- User remains on `lookup.htm`.
- Required-field messages are visible:
  - `First name is required.`
  - `Last name is required.`
  - `Address is required.`
  - `City is required.`
  - `State is required.`
  - `Zip Code is required.`
  - `Social Security Number is required.`

**Success Criteria:**
- Lookup requires all customer identity fields.

**Failure Conditions:**
- Lookup succeeds with blank fields.
- Any required validation message is missing.

**Suggested Assertions / Locator Hints:**
- `await expect(page.getByRole('heading', { name: 'Customer Lookup' })).toBeVisible()`
- `await expect(page.getByText('Social Security Number is required.')).toBeVisible()`

**Notes:**
- Lookup form fields use names such as `firstName`, `lastName`, `address.street`, `address.city`, `address.state`, `address.zipCode`, and `ssn`.

### 12. Forgot Login Info Rejects Unknown Customer Data

**Type:** Negative | Authentication

**Starting State / Assumptions:**
- Browser context is logged out.
- Provided identity data does not match an existing customer.

**Preconditions:**
- Navigate to `lookup.htm`.

**Steps:**
1. Fill all lookup fields with nonmatching but syntactically valid values.
2. Click `Find My Login Info`.

**Expected Results:**
- Page title is `ParaBank | Error`.
- Error heading `Error!` is visible.
- Message `The customer information provided could not be found.` is visible.
- Login form remains available.

**Success Criteria:**
- Unknown identity data does not reveal login credentials.

**Failure Conditions:**
- Credentials are displayed for unmatched data.
- User becomes authenticated.

**Suggested Assertions / Locator Hints:**
- `await expect(page.getByText('The customer information provided could not be found.')).toBeVisible()`
- `await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible()`

**Notes:**
- This exact error was observed with nonmatching lookup data.

### 13. Forgot Login Info Returns Credentials for a Matching Customer

**Type:** Happy path | Authentication

**Starting State / Assumptions:**
- Browser context is logged out.
- A customer exists with known identity data.

**Preconditions:**
- Either create a user through registration and preserve the exact identity data, or use a seeded customer fixture whose lookup fields are known.

**Steps:**
1. Navigate to `lookup.htm`.
2. Fill lookup fields with identity data for the known customer.
3. Click `Find My Login Info`.

**Expected Results:**
- The page displays the customer login information.
- The username is visible.
- The password is visible only if this is the expected ParaBank demo behavior.
- User remains logged out until explicitly logging in.

**Success Criteria:**
- Matching customer data retrieves the expected login information without starting a session.

**Failure Conditions:**
- Matching data is rejected.
- Credentials for a different user are shown.
- User is automatically logged in from lookup.

**Suggested Assertions / Locator Hints:**
- Assert the recovered username text exactly when stable fixture data is available.
- Assert no `Log Out` link is visible unless the product requirement says lookup should authenticate.

**Notes:**
- Exploration confirmed the lookup page and negative states, but a stable matching fixture was not confirmed.

## Edge Cases and Negative Coverage

- Login with password only and blank username should remain unauthenticated.
- Login with valid username and wrong password should remain unauthenticated.
- Login inputs should not retain sensitive data after a failed submission or logout.
- Leading/trailing whitespace in username and password should be handled consistently.
- Registration should reject usernames that differ only by case if usernames are intended to be case-insensitive.
- Registration should validate unsupported characters and very long values for username/password fields if product requirements define constraints.
- Registration should avoid exposing password values after validation failure.
- Credential lookup should not disclose whether a partial identity field is correct.
- Browser back button after logout should not expose authenticated account data.
- Refreshing `overview.htm` while authenticated should preserve the session; refreshing after logout should not.

## Risks and Gaps

- Invalid login behavior appeared broken in the explored live environment. A nonexistent username and bad password still reached `overview.htm` and displayed `Welcome John Smith`. Confirm environment configuration before treating negative-login tests as stable.
- Unauthenticated direct access to `overview.htm` shows a generic internal error instead of a user-friendly login redirect. This may be expected demo behavior, but it is poor UX.
- Several form fields lack accessible labels in the Playwright accessibility snapshot, so generated tests may need CSS attribute locators.
- Credential lookup happy path requires known fixture identity data. The plan includes the scenario, but the exact success message was not confirmed.
- Duplicate-username registration handling was not fully explored. Confirm the exact error text before asserting it.
- The live demo site may reset data or share state across users, so registration tests must use unique values and avoid depending on long-lived created accounts.

## Open Questions

- What is the intended invalid-login error message for wrong username/password?
- Should unauthenticated direct access to protected pages redirect to login instead of displaying `An internal error has occurred and has been logged.`?
- Is `Phone #` intentionally optional during registration?
- Are usernames case-sensitive?
- Should credential lookup reveal passwords, reset passwords, or only display usernames?
- Is the `john` / `demo` fixture guaranteed in all test environments?
