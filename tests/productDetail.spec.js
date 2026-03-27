import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { ProductDetailPage } from "../pages/ProductDetailPage.js";
import { users } from "../utils/testData.js";

test.describe("Product Detail", () => {
  let inventoryPage;
  let productDetailPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    inventoryPage = new InventoryPage(page);
    productDetailPage = new ProductDetailPage(page);
  });

  // Test 12
  test("should display correct product name and price on detail page", async ({
    page,
  }) => {
    // get first product name & price from inventory page
    const inventoryName = await inventoryPage.getFirstProductName();
    const inventoryPrice = await inventoryPage.getFirstProductPrice();

    // click first product to navigate to detail page
    await inventoryPage.clickFirstProduct();

    // verify URL changed to detail page
    await expect(page).toHaveURL(/inventory-item/);

    // verify name & price match inventory
    const detailName = await productDetailPage.getProductName();
    const detailPrice = await productDetailPage.getProductPrice();

    expect(detailName).toBe(inventoryName);
    expect(detailPrice).toBe(inventoryPrice);
  });

  // Test 13 (new)
  test("should navigate back to inventory using back to products button", async ({
    page,
  }) => {
    // navigate to detail page first
    await inventoryPage.clickFirstProduct();
    await expect(page).toHaveURL(/inventory-item/);

    // click back to products
    await productDetailPage.goBack();

    // verify URL back to inventory
    await expect(page).toHaveURL(/inventory/);

    // verify inventory list is visible
    await expect(inventoryPage.inventoryList).toBeVisible();
  });
});
