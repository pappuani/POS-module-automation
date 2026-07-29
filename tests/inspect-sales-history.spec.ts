import { test, expect } from '@playwright/test';

test('inspect sales history active orders', async ({ page }) => {
  console.log('Logging in...');
  await page.goto('https://cafe-test-qr-frontend.vercel.app/login');
  await page.fill('#email', 'anicafeqr@gmail.com');
  await page.fill('#password', '123456');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/owner/main-menu');

  console.log('Navigating to POS Sales...');
  await page.goto('https://cafe-test-qr-frontend.vercel.app/owner/sales');
  
  // Select Takeaway
  await page.click('button:has-text("Takeaway")');
  await page.waitForTimeout(1000);

  // Add Burger
  await page.click('div:has-text("Burger")');
  await page.waitForTimeout(1000);
  
  // Click Send to Kitchen
  await page.click('button:has-text("Send to Kitchen")');
  await page.waitForTimeout(2000);

  console.log('URL after Send to Kitchen:', page.url());

  // Click Sales History
  console.log('Clicking Sales History...');
  await page.click('button:has-text("Sales History")');
  await page.waitForTimeout(2000);

  // Print all text snippets in Sales History
  const historyText = await page.$$eval('div, table, tr, td, button', (elements) =>
    elements
      .filter((el) => el.textContent?.includes('Burger') || el.textContent?.includes('Takeaway') || el.textContent?.includes('Unpaid') || el.textContent?.includes('Settle'))
      .map((el) => ({
        tagName: el.tagName,
        text: el.textContent?.trim().slice(0, 100),
      }))
  );
  console.log('Sales History matches:', historyText.slice(0, 20));
});
