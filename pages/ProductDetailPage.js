export class ProductDetailPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.backToProductsBtn = page.locator('[data-test="back-to-products"]');
  }

  async getProductName() {
    return await this.productName.textContent();
  }

  async getProductPrice() {
    return await this.productPrice.textContent();
  }

  async goBack() {
    await this.backToProductsBtn.click();
  }
}
