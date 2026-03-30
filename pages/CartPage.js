import { NavMenu } from "../components/NavMenu.js";

export class CartPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.cartItems = page.locator(".cart_item");
    this.cartItemNames = page.locator(".inventory_item_name");
    this.cartItemPrices = page.locator(".inventory_item_price");
    this.removeButton = page.locator(".cart_item button");
    this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
    this.checkoutBtn = page.locator('[data-test="checkout"]');

    // NavMenu component
    this.navMenu = new NavMenu(page);
  }

  async getCartItemName() {
    return await this.cartItemNames.first().textContent();
  }

  async getCartItemPrice() {
    return await this.cartItemPrices.first().textContent();
  }

  async getCartItemNames() {
    return await this.cartItemNames.allTextContents();
  }

  async getCartItemPrices() {
    return await this.cartItemPrices.allTextContents();
  }

  async removeItem() {
    await this.removeButton.click();
  }

  async removeItemByIndex(index) {
    await this.cartItems.nth(index).locator("button").click();
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async continueShopping() {
    await this.continueShoppingBtn.click();
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
  }
}
