import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { users } from "../utils/testData.js";

test.describe("Inventory", () => {
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    inventoryPage = new InventoryPage(page);
  });

  // Test 6
  test("should display all six products on inventory page", async () => {
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  // Test 7
  test("should sort products by name A to Z", async () => {
    await inventoryPage.selectSortOption("az");
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  // Test 8
  test("should sort products by name Z to A", async () => {
    await inventoryPage.selectSortOption("za");
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  // Test 9
  test("should sort products by price low to high", async () => {
    await inventoryPage.selectSortOption("lohi");
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  // Test 10
  test("should sort products by price high to low", async () => {
    await inventoryPage.selectSortOption("hilo");
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  // Test 11
  test("should add product to cart and update cart badge", async () => {
    await inventoryPage.addFirstProductToCart();
    await expect(inventoryPage.cartBadge).toBeVisible();
    const count = await inventoryPage.getCartBadgeCount();
    expect(count).toBe("1");
  });
});
