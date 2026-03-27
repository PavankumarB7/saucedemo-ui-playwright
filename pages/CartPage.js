import { NavMenu } from "../components/NavMenu.js";

export class CartPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.cartItems = page.locator(".cart_item");
    this.cartItemName = page.locator(".inventory_item_name");
    this.cartItemPrice = page.locator(".inventory_item_price");
    this.removeButton = page.locator(".cart_item button");
    this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
    this.cartBadge = page.locator(".shopping_cart_badge");

    // NavMenu component
    this.navMenu = new NavMenu(page);
  }

  async getCartItemName() {
    return await this.cartItemName.textContent();
  }

  async getCartItemPrice() {
    return await this.cartItemPrice.textContent();
  }

  async removeItem() {
    await this.removeButton.click();
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async continueShopping() {
    await this.continueShoppingBtn.click();
  }
}
