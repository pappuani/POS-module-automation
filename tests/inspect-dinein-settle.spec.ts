import { test, expect } from '@playwright/test';

test('inspect dine-in order billing and settlement', async ({ page }) => {
  test.setTimeout(60000);

  console.log('Logging in...');
  await page.goto('https://cafe-test-qr-frontend.vercel.app/login');
  await page.fill('#email', 'anicafeqr@gmail.com');
  await page.fill('#password', '123456');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/owner/main-menu');

  console.log('Navigating to POS Sales...');
  await page.goto('https://cafe-test-qr-frontend.vercel.app/owner/sales');
  
  // Select Dine in and pick table WA
  await page.click('button:has-text("Dine in")');
  
  const waButton = page.getByRole('button', { name: 'WA', exact: true });
  const title = await waButton.getAttribute('title') || '';
  if (title.includes('Occupied') || await waButton.isDisabled()) {
    console.log('WA is occupied. We will cancel it first in KDS.');
    await page.goto('https://cafe-test-qr-frontend.vercel.app/owner/orders');
    await page.waitForSelector('button:has-text("Completed")');
    const tableTab = page.locator('button').filter({ hasText: /Table/ }).first();
    await tableTab.click();
    await page.waitForTimeout(1000);
    const kdsWaBtn = page.getByRole('button', { name: 'WA', exact: true });
    await kdsWaBtn.click();
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Cancel")');
    await page.waitForTimeout(2000);
    console.log('Order cancelled. Returning to sales page.');
    await page.goto('https://cafe-test-qr-frontend.vercel.app/owner/sales');
    await page.click('button:has-text("Dine in")');
  }

  // Create a new Dine-in order on WA
  console.log('Clicking WA...');
  await waButton.click();
  await page.click('div:has-text("Burger")');
  await page.click('button:has-text("Send to Kitchen")');
  await page.waitForTimeout(2000);

  // Navigate to KDS
  console.log('Navigating to KDS...');
  await page.goto('https://cafe-test-qr-frontend.vercel.app/owner/orders');
  await page.waitForSelector('button:has-text("Completed")');
  const tableTab = page.locator('button').filter({ hasText: /Table/ }).first();
  await tableTab.click();
  await page.waitForTimeout(1000);

  // Click WA card on KDS
  console.log('Clicking table WA on KDS...');
  const kdsWaBtn = page.getByRole('button', { name: 'WA', exact: true });
  await kdsWaBtn.click();
  await page.waitForTimeout(2000);

  // Let's click "Bill" or "Edit" to see what happens
  const hasBill = await page.locator('button:has-text("Bill")').isVisible();
  const hasEdit = await page.locator('button:has-text("Edit")').isVisible();
  console.log(`Modal options - Bill visible: ${hasBill}, Edit visible: ${hasEdit}`);

  if (hasBill) {
    console.log('Clicking Bill...');
    await page.click('button:has-text("Bill")');
    await page.waitForTimeout(3000);
    console.log('URL after clicking Bill:', page.url());
    await page.screenshot({ path: 'test-results/after-bill-click.png' });
  } else if (hasEdit) {
    console.log('Clicking Edit...');
    await page.click('button:has-text("Edit")');
    await page.waitForTimeout(3000);
    console.log('URL after clicking Edit:', page.url());
    await page.screenshot({ path: 'test-results/after-edit-click.png' });
  }
});
