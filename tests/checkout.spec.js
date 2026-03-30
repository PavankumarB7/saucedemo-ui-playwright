import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { CartPage } from "../pages/CartPage.js";
import { CheckoutPage } from "../pages/CheckoutPage.js";
import { users, checkoutInfo } from "../utils/testData.js";

test.describe("Checkout", () => {
  let inventoryPage;
  let cartPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  // Test 23
  test("should display error when checkout form is submitted with empty required fields", async ({
    page,
  }) => {
    // navigate directly to checkout step one
    await checkoutPage.gotoStepOne();

    // click continue without filling any fields
    await checkoutPage.clickContinue();

    // verify error message is displayed
    await expect(checkoutPage.errorMessage).toBeVisible();
  });

  // Test 24
  test("should display correct order summary with item total and tax", async ({
    page,
  }) => {
    // add product to cart
    await inventoryPage.addFirstProductToCart();
    await cartPage.navMenu.clickCart();

    // proceed to checkout
    await page.locator('[data-test="checkout"]').click();

    // fill checkout info
    await checkoutPage.fillCheckoutInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.zipCode,
    );
    await checkoutPage.clickContinue();

    // get values from page
    const itemTotal = await checkoutPage.getItemTotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    // verify total = item total + tax  (regardless of tax rate)
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  // Test 25
  test("should complete order and display confirmation message", async ({
    page,
  }) => {
    // add product and go through checkout flow
    await inventoryPage.addFirstProductToCart();
    await cartPage.navMenu.clickCart();
    await page.locator('[data-test="checkout"]').click();

    // fill checkout info
    await checkoutPage.fillCheckoutInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.zipCode,
    );
    await checkoutPage.clickContinue();

    // complete order
    await checkoutPage.clickFinish();

    // verify confirmation page
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(checkoutPage.confirmationMsg).toBeVisible();
    await expect(checkoutPage.confirmationMsg).toHaveText(
      "Thank you for your order!",
    );
  });

  // Test 26
  test("should allow checkout completion with empty cart showing zero order total", async ({
    page,
  }) => {
    // navigate directly to checkout step two with empty cart
    await checkoutPage.gotoStepTwo();

    // verify item total is 0
    const itemTotal = await checkoutPage.getItemTotal();
    const total = await checkoutPage.getTotal();

    expect(itemTotal).toBe(0);
    expect(total).toBe(0);
  });

  // Test 27
  test("should display correct combined total for multiple items in checkout", async ({
    page,
  }) => {
    // get prices from inventory before adding
    const price1Raw = await inventoryPage.getProductPriceByIndex(0);
    const price2Raw = await inventoryPage.getProductPriceByIndex(1);

    // convert to numbers for calculation
    const price1 = parseFloat(price1Raw.replace("$", ""));
    const price2 = parseFloat(price2Raw.replace("$", ""));
    const expectedItemTotal = price1 + price2;

    // add both products to cart
    await inventoryPage.addMultipleProductsToCart(2);

    // navigate to cart then checkout
    await inventoryPage.navMenu.clickCart();
    await cartPage.proceedToCheckout();

    // fill checkout info
    await checkoutPage.fillCheckoutInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.zipCode,
    );
    await checkoutPage.clickContinue();

    // get actual values from order summary
    const itemTotal = await checkoutPage.getItemTotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    // verify item total matches sum of both product prices
    expect(itemTotal).toBeCloseTo(expectedItemTotal, 2);

    // verify total = item total + tax
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });
});
