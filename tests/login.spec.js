import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { users, errorMessages } from "../utils/testData.js";

test.describe("Login", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test("should show error for locked out user", async () => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(errorMessages.lockedOut);
  });

  test("should show error for invalid credentials", async () => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      errorMessages.invalidCredentials,
    );
  });

  test("should show error when username and password fields are empty", async () => {
    await loginPage.login("", "");
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      errorMessages.usernameRequired,
    );
  });

  test("should show error when only password field is empty", async () => {
    await loginPage.login(users.standard.username, "");
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      errorMessages.passwordRequired,
    );
  });
});
