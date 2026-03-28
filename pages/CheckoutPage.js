export class CheckoutPage {
  constructor(page) {
    this.page = page;

    // Step 1 locators
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.zipCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step 2 locators
    this.itemTotal = page.locator(".summary_subtotal_label");
    this.tax = page.locator(".summary_tax_label");
    this.total = page.locator(".summary_total_label");
    this.finishButton = page.locator('[data-test="finish"]');

    // Confirmation locators
    this.confirmationMsg = page.locator('[data-test="complete-header"]');
  }

  async gotoStepOne() {
    await this.page.goto("/checkout-step-one.html");
  }

  async gotoStepTwo() {
    await this.page.goto("/checkout-step-two.html");
  }

  async fillCheckoutInfo(firstName, lastName, zipCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zipCode);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async clickFinish() {
    await this.finishButton.click();
  }

  async getItemTotal() {
    const text = await this.itemTotal.textContent();
    return parseFloat(text.replace("Item total: $", ""));
  }

  async getTax() {
    const text = await this.tax.textContent();
    return parseFloat(text.replace("Tax: $", ""));
  }

  async getTotal() {
    const text = await this.total.textContent();
    return parseFloat(text.replace("Total: $", ""));
  }
}
