import { NavMenu } from "../components/NavMenu.js";

export class InventoryPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.productItems = page.locator(".inventory_item");
    this.productNames = page.locator(".inventory_item_name");
    this.productPrices = page.locator(".inventory_item_price");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.addToCartButton = page
      .locator(".inventory_item")
      .first()
      .locator("button");
    this.inventoryList = page.locator(".inventory_list");

    // NavMenu component
    this.navMenu = new NavMenu(page);
  }

  async getFirstProductName() {
    return await this.productNames.first().textContent();
  }

  async getFirstProductPrice() {
    return await this.productPrices.first().textContent();
  }

  async clickFirstProduct() {
    await this.productNames.first().click();
  }

  async selectSortOption(value) {
    await this.sortDropdown.selectOption(value);
  }

  async getProductNames() {
    return await this.productNames.allTextContents();
  }

  async getProductPrices() {
    const priceTexts = await this.productPrices.allTextContents();
    return priceTexts.map((price) => parseFloat(price.replace("$", "")));
  }

  async getProductCount() {
    return await this.productItems.count();
  }

  async addFirstProductToCart() {
    await this.addToCartButton.click();
  }

  async getCartBadgeCount() {
    return await this.cartBadge.textContent();
  }
}
