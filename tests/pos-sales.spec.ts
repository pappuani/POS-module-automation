import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SalesPage } from '../pages/SalesPage';

const EMAIL = 'anicafeqr@gmail.com';
const PASSWORD = '123456';

test.describe('POS Module - Sales E2E Automation', () => {
  let loginPage: LoginPage;
  let salesPage: SalesPage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000);
    loginPage = new LoginPage(page);
    salesPage = new SalesPage(page);

    // Navigate to Login Page
    await page.goto('/login');
    await page.waitForLoadState('load');
    
    // Fill credentials and click sign in
    await loginPage.login(EMAIL, PASSWORD);

    // Wait for the main owner menu to load
    await page.waitForURL('**/owner/main-menu');
  });

  test('should complete a dine-in cash sale via kitchen successfully', async ({ page }) => {
    await salesPage.navigate();
    
    // Select Dine in order type
    await salesPage.selectOrderType('Dine in');

    // Self-healing: Clear table WA if it starts as Occupied from a previous run
    const waButton = page.getByRole('button', { name: 'WA', exact: true });
    await expect(waButton).toBeVisible();
    const title = await waButton.getAttribute('title') || '';
    if (title.includes('Occupied') || await waButton.isDisabled()) {
      console.log('Self-healing: Table WA is occupied. Completing the active order first...');
      await salesPage.navigateToOrders();
      await salesPage.clickKDSTableTab();
      await salesPage.selectKDSTableOrder('WA');
      await salesPage.clickKDSCompleteOrder();
      
      // Return to POS Sales Page and wait for table to become enabled
      await salesPage.navigate();
      await salesPage.selectOrderType('Dine in');
      const syncBtn = page.locator('button', { hasText: 'Sync Now' });
      if (await syncBtn.isVisible() && !(await syncBtn.isDisabled())) {
        await syncBtn.click();
      }
      await expect(waButton).toBeEnabled({ timeout: 10000 });
    }

    // Select table WA (which is now available and enabled)
    await salesPage.selectTable('WA');

    const productName = 'Pani poori';
    await test.step('Add item to cart', async () => {
      await salesPage.addProductToCart(productName);
      const cartContainer = page.locator('aside, [role="complementary"]').filter({ hasText: 'Your Cart' });
      await expect(cartContainer).toContainText('1 Item');
    });

    await test.step('Send to Kitchen', async () => {
      await salesPage.clickSendToKitchen();
      // Verify Send to Kitchen becomes hidden/disabled after sending
      await expect(salesPage.sendToKitchenButton).toBeHidden();
      await page.waitForTimeout(3000);
    });

    await test.step('Settle and Checkout in KDS', async () => {
      await salesPage.navigateToOrders();
      await salesPage.clickKDSTableTab();
      await salesPage.selectKDSTableOrder('WA');
      await salesPage.clickKDSCompleteOrder();
    });

    await test.step('Verify in Sales History', async () => {
      await salesPage.navigate();
      await salesPage.clickSalesHistory();
      // Verify KDS page is loaded
      await expect(page).toHaveURL(/.*owner\/orders.*/);
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/sales-history-dinein.png' });
    });
  });

  test('should complete a takeaway cash sale via kitchen successfully', async ({ page }) => {
    await salesPage.navigate();
    
    await salesPage.selectOrderType('Takeaway');

    const productName = 'Burger';
    await test.step('Add item to cart', async () => {
      await salesPage.addProductToCart(productName);
      const cartContainer = page.locator('aside, [role="complementary"]').filter({ hasText: 'Your Cart' });
      await expect(cartContainer).toContainText('1 Item');
    });

    await test.step('Send to Kitchen', async () => {
      await salesPage.clickSendToKitchen();
      await expect(salesPage.sendToKitchenButton).toBeHidden();
      await page.waitForTimeout(3000);
    });

    await test.step('Settle and Checkout in KDS', async () => {
      await salesPage.navigateToOrders();
      await salesPage.clickKDSTakeawayTab();
      await salesPage.selectKDSGuestOrder();
      await salesPage.clickKDSCompleteOrder();
    });

    await test.step('Verify in Sales History', async () => {
      await salesPage.navigate();
      await salesPage.clickSalesHistory();
      await expect(page).toHaveURL(/.*owner\/orders.*/);
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/sales-history-takeaway.png' });
    });
  });

  test('should complete a delivery cash sale via kitchen successfully', async ({ page }) => {
    await salesPage.navigate();
    
    await salesPage.selectOrderType('Delivery');

    const productName = 'Eggs';
    await test.step('Add item to cart', async () => {
      await salesPage.addProductToCart(productName);
      const cartContainer = page.locator('aside, [role="complementary"]').filter({ hasText: 'Your Cart' });
      await expect(cartContainer).toContainText('1 Item');
    });

    await test.step('Send to Kitchen', async () => {
      await salesPage.clickSendToKitchen();
      await expect(salesPage.sendToKitchenButton).toBeHidden();
      await page.waitForTimeout(3000);
    });

    await test.step('Settle and Checkout in KDS', async () => {
      await salesPage.navigateToOrders();
      await salesPage.clickKDSDeliveryTab();
      await salesPage.selectKDSGuestOrder();
      await salesPage.clickKDSCompleteOrder();
    });

    await test.step('Verify in Sales History', async () => {
      await salesPage.navigate();
      await salesPage.clickSalesHistory();
      await expect(page).toHaveURL(/.*owner\/orders.*/);
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/sales-history-delivery.png' });
    });
  });
});
