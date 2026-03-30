# SauceDemo UI Automation

Automated UI test suite for [SauceDemo](https://www.saucedemo.com) built with Playwright and JavaScript using the Page Object Model pattern.

![Demo](demo.gif)

---

## 🚨 Key Findings (Bugs Identified)

- **Reset App State bug** — After clicking "Reset App State" from the navigation menu, the cart badge clears correctly but product buttons still show "Remove" instead of resetting to "Add to cart". Documented as a known UI bug in test 19 using `test.fail()`.

---

## Tech Stack

- [Playwright](https://playwright.dev/) — UI automation framework
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) — test language
- [Allure Reports](https://allurereport.org/) — visual test reporting dashboard
- [GitHub Actions](https://github.com/features/actions) — CI/CD pipeline

---

## Project Structure

```
saucedemo-ui-playwright/
├── components/
│   └── NavMenu.js               # Shared navigation component — cart, logout, reset, all items
├── pages/
│   ├── LoginPage.js             # Login page — locators and actions
│   ├── InventoryPage.js         # Inventory page — products, sort, cart badge
│   ├── ProductDetailPage.js     # Product detail page — name, price, back navigation
│   ├── CartPage.js              # Cart page — item details, remove, continue shopping
│   └── CheckoutPage.js          # Checkout flow — form, order summary, confirmation
├── tests/
│   ├── login.spec.js            # 5 login tests
│   ├── inventory.spec.js        # 6 inventory tests
│   ├── productDetail.spec.js    # 2 product detail tests
│   ├── cart.spec.js             # 9 cart tests
│   ├── checkout.spec.js         # 5 checkout tests
│   └── logout.spec.js           # 2 logout tests
└── utils/
    └── testData.js              # Centralised test data — users, error messages, checkout info
```

---

## Setup & Installation

**1. Clone the repository**

```bash
git clone https://github.com/PavankumarB7/saucedemo-ui-playwright.git
cd saucedemo-ui-playwright
```

**2. Install dependencies**

```bash
npm install
```

**3. Install Playwright browsers**

```bash
npx playwright install
```

**4. Install Java (required for Allure Reports)**

Download and install from [java.com](https://www.java.com/en/download/)

Verify installation:

```bash
java -version
```

---

## How to Run Tests

**Run all tests (all 3 browsers):**

```bash
npm test
```

**Run all tests on a single browser:**

```bash
npx playwright test --project=chromium
```

**Run a specific test file:**

```bash
npx playwright test tests/login.spec.js --project=chromium
```

**Run a specific test by name:**

```bash
npx playwright test --grep "should login successfully" --project=chromium
```

**Run in headed mode (see browser):**

```bash
npx playwright test --project=chromium --headed
```

**Run in debug mode:**

```bash
npx playwright test --project=chromium --headed --debug
```

---

## Reports

**Playwright HTML Report:**

```bash
npx playwright show-report
```

**Allure Report:**

```bash
npm run allure:report
```

Opens a visual dashboard showing pass/fail charts, step-by-step test breakdown, and failure screenshots.

---

## CI/CD

This project uses GitHub Actions to automatically run all 29 tests on every push to `main`.

**Pipeline runs:**

- Install dependencies
- Install Playwright browsers
- Run all tests across Chromium, Firefox, and WebKit
- Upload test results as artifacts

View pipeline runs under the **Actions** tab in the repository.

---

## Test Coverage

29 tests across 6 feature areas.

| #   | Test                                                                            | File                  |
| --- | ------------------------------------------------------------------------------- | --------------------- |
| 1   | should login successfully with valid credentials                                | login.spec.js         |
| 2   | should show error for locked out user                                           | login.spec.js         |
| 3   | should show error for invalid credentials                                       | login.spec.js         |
| 4   | should show error when username and password fields are empty                   | login.spec.js         |
| 5   | should show error when only password field is empty                             | login.spec.js         |
| 6   | should display all six products on inventory page                               | inventory.spec.js     |
| 7   | should sort products by name A to Z                                             | inventory.spec.js     |
| 8   | should sort products by name Z to A                                             | inventory.spec.js     |
| 9   | should sort products by price low to high                                       | inventory.spec.js     |
| 10  | should sort products by price high to low                                       | inventory.spec.js     |
| 11  | should add product to cart and update cart badge                                | inventory.spec.js     |
| 12  | should display correct product name and price on detail page                    | productDetail.spec.js |
| 13  | should navigate back to inventory using back to products button                 | productDetail.spec.js |
| 14  | should display added item in cart with correct details                          | cart.spec.js          |
| 15  | should remove item from cart and update cart                                    | cart.spec.js          |
| 16  | should navigate back to inventory using continue shopping button                | cart.spec.js          |
| 17  | should navigate back to inventory using all items menu                          | cart.spec.js          |
| 18  | should reset app state and clear cart badge                                     | cart.spec.js          |
| 19  | should show add to cart button after reset app state                            | cart.spec.js          |
| 20  | should update cart badge when multiple products are added                       | cart.spec.js          |
| 21  | should display all added items in cart with correct details                     | cart.spec.js          |
| 22  | should remove one item from cart and keep the other                             | cart.spec.js          |
| 23  | should display error when checkout form is submitted with empty required fields | checkout.spec.js      |
| 24  | should display correct order summary with item total and tax                    | checkout.spec.js      |
| 25  | should complete order and display confirmation message                          | checkout.spec.js      |
| 26  | should allow checkout completion with empty cart showing zero order total       | checkout.spec.js      |
| 27  | should display correct combined total for multiple items in checkout            | checkout.spec.js      |
| 28  | should logout successfully and redirect to login page                           | logout.spec.js        |
| 29  | should not be able to navigate back after logout                                | logout.spec.js        |

---

## 🧠 Test Design Approach

- Designed test scenarios covering positive, negative, edge cases, and known UI bugs
- Followed Page Object Model pattern — locators and actions separated from test logic
- Kept tests independent — each test sets up its own state via `beforeEach`
- Used centralised test data — no hardcoded strings in test files
- Used `data-test` attributes as primary locators for maximum stability
- Identified a real UI bug during manual exploration before automating
- Covered both single and multi-item cart scenarios for thorough e-commerce coverage

---

## Framework Design Decisions

### Page Object Model (`pages/`)

Each page of the application has its own class with locators defined in the constructor and actions as methods. Test files only call methods — they never interact with the browser directly.

If a locator changes, it only needs updating in one place — not across every test file.

### NavMenu Component (`components/NavMenu.js`)

The navigation menu (cart icon, logout, all items, reset app state) appears across multiple pages. Instead of duplicating these locators and methods in every page class, they are centralised in a shared `NavMenu` component.

Page classes that need NavMenu compose it internally:

```javascript
// CartPage.js and InventoryPage.js
this.navMenu = new NavMenu(page);

// used in tests as
await cartPage.navMenu.clickCart();
await inventoryPage.navMenu.logout();
```

### `beforeEach` over Fixtures

For this project, `beforeEach` handles login setup cleanly — every test starts fresh with a new browser page and logs in via `LoginPage`. Fixtures were intentionally skipped as they add complexity without meaningful benefit at this project scale.

### Centralised Test Data (`utils/testData.js`)

All usernames, passwords, error messages, and checkout info are stored in `testData.js`. Tests reference named constants instead of raw strings:

```javascript
// instead of
await loginPage.login("standard_user", "secret_sauce");

// we use
await loginPage.login(users.standard.username, users.standard.password);
```

### Known Bug — `test.fail()`

Test 19 documents a known SauceDemo UI bug using Playwright's `test.fail()`:

```javascript
test.fail("should show add to cart button after reset app state", async () => {
  // expected: button resets to 'Add to cart'
  // actual: button still shows 'Remove' — known bug
  await expect(inventoryPage.addToCartButton).toHaveText("Add to cart");
});
```

If the bug is ever fixed, `test.fail()` will surface it as an unexpected pass — acting as a regression guard.

---
