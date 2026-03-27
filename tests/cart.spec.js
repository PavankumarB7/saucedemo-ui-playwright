import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { CartPage } from "../pages/CartPage.js";
import { users } from "../utils/testData.js";

test.describe("Cart", () => {
  let inventoryPage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  // Test 14
  test("should display added item in cart with correct details", async () => {
    // get first product details from inventory
    const inventoryName = await inventoryPage.getFirstProductName();
    const inventoryPrice = await inventoryPage.getFirstProductPrice();

    // add to cart and navigate to cart
    await inventoryPage.addFirstProductToCart();
    await cartPage.navMenu.clickCart();

    // verify item details match inventory
    const cartName = await cartPage.getCartItemName();
    const cartPrice = await cartPage.getCartItemPrice();

    expect(cartName).toBe(inventoryName);
    expect(cartPrice).toBe(inventoryPrice);
  });

  // Test 15
  test("should remove item from cart and update cart", async ({ page }) => {
    // add item and go to cart
    await inventoryPage.addFirstProductToCart();
    await cartPage.navMenu.clickCart();

    // verify item is in cart
    expect(await cartPage.getCartItemCount()).toBe(1);

    // remove item
    await cartPage.removeItem();

    // verify cart is empty
    expect(await cartPage.getCartItemCount()).toBe(0);

    // verify cart badge is gone
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  // Test 16
  test("should navigate back to inventory using continue shopping button", async ({
    page,
  }) => {
    // navigate to cart
    await cartPage.navMenu.clickCart();

    // click continue shopping
    await cartPage.continueShopping();

    // verify back on inventory
    await expect(page).toHaveURL(/inventory/);
    await expect(inventoryPage.inventoryList).toBeVisible();
  });

  // Test 17
  test("should navigate back to inventory using all items menu", async ({
    page,
  }) => {
    // navigate to cart
    await cartPage.navMenu.clickCart();

    // click all items from nav menu
    await cartPage.navMenu.clickAllItems();

    // verify back on inventory
    await expect(page).toHaveURL(/inventory/);
    await expect(inventoryPage.inventoryList).toBeVisible();
  });

  // Test 18
  test("should reset app state and clear cart badge", async ({ page }) => {
    // add item to cart
    await inventoryPage.addFirstProductToCart();
    await expect(inventoryPage.cartBadge).toBeVisible();

    // reset app state
    await cartPage.navMenu.resetAppState();

    // verify cart badge is gone
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  // Test 19
  // Known bug: button should reset to 'Add to cart' after reset app state
  // but SauceDemo keeps showing 'Remove' — test.fail() documents this
  test.fail(
    "should show add to cart button after reset app state",
    async () => {
      await inventoryPage.addFirstProductToCart();
      await cartPage.navMenu.resetAppState();
      await expect(inventoryPage.addToCartButton).toHaveText("Add to cart");
    },
  );
});
