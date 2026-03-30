import { NavMenu } from "../components/NavMenu.js";

export class InventoryPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.productItems = page.locator(".inventory_item");
    this.productNames = page.locator(".inventory_item_name");
    this.productPrices = page.locator(".inventory_item_price");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
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

  async getProductNameByIndex(index) {
    return await this.productNames.nth(index).textContent();
  }

  async getProductPriceByIndex(index) {
    return await this.productPrices.nth(index).textContent();
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
    await this.addToCartButtons.first().click();
  }

  async addProductToCartByIndex(index) {
    await this.addToCartButtons.nth(index).click();
  }

  async addMultipleProductsToCart(count) {
    const allItems = await this.page.locator(".inventory_item").all();
    for (let i = 0; i < count; i++) {
      await allItems[i].locator("button").click();
    }
  }
}
