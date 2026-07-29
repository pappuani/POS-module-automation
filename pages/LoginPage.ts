import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]', { hasText: 'SIGN IN' });
    this.errorMessage = page.locator('.error-message, [role="alert"], .alert-danger');
  }

  /**
   * Navigates to the POS login page
   * @param path Optional subpath if different from baseUrl
   */
  async navigate(path: string = '/login') {
    await this.page.goto(path);
  }

  /**
   * Performs login action
   * @param username The username or email
   * @param password The password
   */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Gets the text content of any error message shown during login
   */
  async getErrorMessage(): Promise<string | null> {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }
}
