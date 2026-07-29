import { test, expect } from '@playwright/test';

test('inspect kitchen and settlement flows', async ({ page }) => {
  console.log('Logging in...');
  await page.goto('https://cafe-test-qr-frontend.vercel.app/login');
  await page.fill('#email', 'anicafeqr@gmail.com');
  await page.fill('#password', '123456');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/owner/main-menu');

  console.log('Navigating to POS Sales...');
  await page.goto('https://cafe-test-qr-frontend.vercel.app/owner/sales');
  
  // Create a Dine-in order and send to kitchen
  console.log('Clicking Dine in and table WA...');
  await page.click('button:has-text("Dine in")');
  await page.click('button:has-text("WA")');
  await page.waitForTimeout(1000);
  
  console.log('Adding product and sending to kitchen...');
  // Add Burger
  await page.click('div:has-text("Burger")');
  await page.waitForTimeout(1000);
  
  // Click Send to Kitchen
  await page.click('button:has-text("Send to Kitchen")');
  await page.waitForTimeout(2000);
  
  console.log('URL after Send to Kitchen:', page.url());

  // Let's check the elements on /owner/sales now
  const salesButtons = await page.$$eval('button', (elements) =>
    elements.map((el) => ({
      text: el.textContent?.trim(),
      disabled: (el as HTMLButtonElement).disabled,
      title: el.getAttribute('title') || '',
    }))
  );
  console.log('Sales page buttons after sending Dine-in to kitchen:', salesButtons);

  // Let's navigate to /owner/orders (Kitchen/Orders page)
  console.log('Navigating to /owner/orders...');
  await page.goto('https://cafe-test-qr-frontend.vercel.app/owner/orders');
  await page.waitForLoadState('networkidle');
  console.log('Orders page URL:', page.url());

  // Print tabs/headers on orders page
  const ordersButtons = await page.$$eval('button', (elements) =>
    elements.map((el) => el.textContent?.trim())
  );
  console.log('Orders page buttons:', ordersButtons);

  // Let's look for any orders in the list
  const ordersList = await page.$$eval('div', (elements) =>
    elements
      .filter((el) => el.textContent?.includes('Burger') || el.textContent?.includes('WA'))
      .map((el) => el.textContent?.trim().slice(0, 100))
  );
  console.log('Orders list matching Burger/WA:', ordersList.slice(0, 10));
});
