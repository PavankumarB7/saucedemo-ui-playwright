export class NavMenu {
  constructor(page) {
    this.page = page;

    // Locators
    this.cartIcon = page.locator(".shopping_cart_link");
    this.menuButton = page.locator("#react-burger-menu-btn");
    this.allItemsLink = page.locator("#inventory_sidebar_link");
    this.resetLink = page.locator("#reset_sidebar_link");
    this.logoutLink = page.locator("#logout_sidebar_link");
  }

  async clickCart() {
    await this.cartIcon.click();
  }

  async clickAllItems() {
    await this.menuButton.click();
    await this.allItemsLink.click();
  }

  async resetAppState() {
    await this.menuButton.click();
    await this.resetLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
