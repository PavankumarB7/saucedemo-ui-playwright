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
    await expect(inventoryPage.navMenu.cartBadge).not.toBeVisible();
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
    await expect(inventoryPage.navMenu.cartBadge).toBeVisible();

    // reset app state
    await cartPage.navMenu.resetAppState();

    // verify cart badge is gone
    await expect(inventoryPage.navMenu.cartBadge).not.toBeVisible();
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

  // Test 20
  test("should update cart badge when multiple products are added", async () => {
    // add 2 products to cart
    await inventoryPage.addMultipleProductsToCart(2);

    // verify badge shows correct count
    await expect(inventoryPage.navMenu.cartBadge).toBeVisible();
    const count = await inventoryPage.navMenu.getCartBadgeCount();
    expect(count).toBe("2");
  });

  // Test 21
  test("should display all added items in cart with correct details", async () => {
    // get product details from inventory before adding
    const name1 = await inventoryPage.getProductNameByIndex(0);
    const price1 = await inventoryPage.getProductPriceByIndex(0);
    const name2 = await inventoryPage.getProductNameByIndex(1);
    const price2 = await inventoryPage.getProductPriceByIndex(1);

    // add both products to cart
    await inventoryPage.addMultipleProductsToCart(2);

    // navigate to cart
    await inventoryPage.navMenu.clickCart();

    // verify both items in cart
    const cartNames = await cartPage.getCartItemNames();
    const cartPrices = await cartPage.getCartItemPrices();

    expect(cartNames).toContain(name1);
    expect(cartNames).toContain(name2);
    expect(cartPrices).toContain(price1);
    expect(cartPrices).toContain(price2);
  });

  // Test 22
  test("should remove one item from cart and keep the other", async () => {
    // add 2 products to cart
    await inventoryPage.addMultipleProductsToCart(2);

    // navigate to cart
    await inventoryPage.navMenu.clickCart();

    // get both item names before removal
    const cartNames = await cartPage.getCartItemNames();
    const secondItemName = cartNames[1];

    // remove first item
    await cartPage.removeItemByIndex(0);

    // verify cart count is now 1
    const count = await cartPage.getCartItemCount();
    expect(count).toBe(1);

    // verify second item still present
    const remainingNames = await cartPage.getCartItemNames();
    expect(remainingNames).toContain(secondItemName);
  });
});
