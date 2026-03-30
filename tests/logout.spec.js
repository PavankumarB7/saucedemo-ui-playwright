import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { users } from "../utils/testData.js";

test.describe("Logout", () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    inventoryPage = new InventoryPage(page);
  });

  // Test 28
  test("should logout successfully and redirect to login page", async ({
    page,
  }) => {
    // logout via NavMenu
    await inventoryPage.navMenu.logout();

    // verify redirected to login page
    await expect(page).toHaveURL("/");

    // verify login button is visible
    await expect(loginPage.loginButton).toBeVisible();
  });

  // Test 29
  test("should not be able to navigate back after logout", async ({ page }) => {
    // logout via NavMenu
    await inventoryPage.navMenu.logout();

    // try to navigate back
    await page.goBack();

    // verify still on login page — inventory not accessible
    await expect(page).toHaveURL("/");
    await expect(loginPage.loginButton).toBeVisible();
  });
});
