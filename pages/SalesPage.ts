import { Locator, Page, expect } from '@playwright/test';

export class SalesPage {
  readonly page: Page;
  readonly takeawayButton: Locator;
  readonly dineInButton: Locator;
  readonly deliveryButton: Locator;
  readonly searchInput: Locator;
  readonly settleTabButton: Locator;
  readonly completeSaleButton: Locator;
  readonly settleFinishButton: Locator;
  readonly salesHistoryButton: Locator;
  readonly sendToKitchenButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.takeawayButton = page.locator('button', { hasText: 'Takeaway' });
    this.dineInButton = page.locator('button', { hasText: 'Dine in' });
    this.deliveryButton = page.locator('button', { hasText: 'Delivery' });
    this.searchInput = page.locator('input[placeholder*="Search menu items"]');
    this.settleTabButton = page.locator('button', { hasText: 'Settle' });
    this.completeSaleButton = page.locator('button', { hasText: 'Complete Sale' });
    this.settleFinishButton = page.locator('button', { hasText: 'Settle & Finish' });
    this.salesHistoryButton = page.locator('button', { hasText: 'Sales History' });
    this.sendToKitchenButton = page.locator('button', { hasText: 'Send to Kitchen' });
  }

  /**
   * Navigates to the POS Sales Page
   */
  async navigate() {
    await this.page.goto('/owner/sales');
  }

  /**
   * Selects order type (e.g. Dine in, Takeaway, Delivery)
   */
  async selectOrderType(type: 'Dine in' | 'Takeaway' | 'Delivery') {
    if (type === 'Takeaway') {
      await this.takeawayButton.click();
    } else if (type === 'Dine in') {
      await this.dineInButton.click();
    } else {
      await this.deliveryButton.click();
    }
  }

  /**
   * Selects a table by name on Dine-in screen (e.g. WA)
   */
  async selectTable(tableName: string) {
    const tableBtn = this.page.getByRole('button', { name: tableName, exact: true });
    await tableBtn.waitFor({ state: 'visible' });
    await tableBtn.click();
  }

  /**
   * Adds a product to the cart by its name
   */
  async addProductToCart(productName: string) {
    // Find the card containing product name and click it
    const productCard = this.page.locator('div').filter({ hasText: new RegExp(`^${productName}$|^${productName}\\s`) }).first();
    await productCard.waitFor({ state: 'visible' });
    await productCard.click();
  }

  /**
   * Sends items in cart to the kitchen
   */
  async clickSendToKitchen() {
    await this.sendToKitchenButton.waitFor({ state: 'visible' });
    await this.sendToKitchenButton.click();
  }

  /**
   * Switches to the Settle tab/view
   */
  async clickSettleTab() {
    await this.settleTabButton.click();
  }

  /**
   * Initiates payment checkout
   */
  async clickCompleteSale() {
    await this.completeSaleButton.click();
  }

  /**
   * Settles payment and finishes the order
   */
  async clickSettleAndFinish() {
    await this.settleFinishButton.click();
  }

  /**
   * Navigates to the KDS/Orders page
   */
  async navigateToOrders() {
    await this.page.goto('/owner/orders');
    await this.page.waitForSelector('button:has-text("Completed")');
    await this.page.waitForTimeout(2000);
  }

  /**
   * Clicks KDS Dine-in table tab
   */
  async clickKDSTableTab() {
    const tab = this.page.locator('button').filter({ hasText: /Table/ }).first();
    await tab.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Clicks KDS Takeaway tab
   */
  async clickKDSTakeawayTab() {
    const tab = this.page.locator('button').filter({ hasText: /Takeaway/ }).first();
    await tab.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Clicks KDS Delivery tab
   */
  async clickKDSDeliveryTab() {
    const tab = this.page.locator('button').filter({ hasText: /Delivery/ }).first();
    await tab.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Clicks a table order card (like WA) on KDS page
   */
  async selectKDSTableOrder(tableName: string) {
    const tableCard = this.page.getByRole('button', { name: tableName, exact: true });
    await tableCard.waitFor({ state: 'visible' });
    await tableCard.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Clicks the first active Guest card on KDS page
   */
  async selectKDSGuestOrder() {
    const guestCard = this.page.locator('div, button').filter({ hasText: /^#\d+\s*Guest$/ }).first();
    await guestCard.waitFor({ state: 'visible' });
    await guestCard.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Clicks Complete Order inside KDS order detail modal and handles payment checkout if needed
   */
  async clickKDSCompleteOrder() {
    const completeBtn = this.page.locator('button', { hasText: 'Complete Order' });
    await completeBtn.waitFor({ state: 'visible' });
    await completeBtn.click();
    await this.page.waitForTimeout(1000);

    // If checkout dialog opens with Settle & Finish, click it to complete payment
    const settleFinishBtn = this.page.locator('button', { hasText: 'Settle & Finish' });
    if (await settleFinishBtn.isVisible()) {
      console.log('KDS checkout dialog visible. Clicking Settle & Finish...');
      await settleFinishBtn.click();
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Navigates to the Sales History view
   */
  async clickSalesHistory() {
    await this.salesHistoryButton.click();
  }
}
