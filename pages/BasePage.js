const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navegar a una URL específica
   * @param {string} url - URL a la que navegar
   */
  async goto(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verificar errores del servidor
   * @param {string} testName - Nombre del test para logging
   * @returns {string|null} - Tipo de error o null si no hay error
   */
  async checkServerErrors(testName) {
    // Verificar si hay error 401 del servidor
    const hasError401 = await this.page.locator('text=Error code: 401').isVisible();
    if (hasError401) {
      console.log(`⚠️ [${testName}] Servidor devuelve error 401 - Verificar credenciales o estado del servidor`);
      await this.page.screenshot({ path: `screenshots/${testName}-error-401.png` });
      return 'error-401';
    }
    
    // Verificar si hay otros errores del servidor
    const hasServerError = await this.page.locator('text=Looks like there\'s a problem with this site').isVisible();
    if (hasServerError) {
      console.log(`⚠️ [${testName}] Error del servidor detectado`);
      await this.page.screenshot({ path: `screenshots/${testName}-server-error.png` });
      return 'server-error';
    }
    
    return null;
  }

  /**
   * Tomar screenshot con nombre personalizado
   * @param {string} filename - Nombre del archivo de screenshot
   */
  async takeScreenshot(filename) {
    await this.page.screenshot({ path: `screenshots/${filename}` });
  }

  /**
   * Esperar a que un elemento sea visible
   * @param {string} selector - Selector del elemento
   * @param {number} timeout - Timeout en milisegundos
   */
  async waitForElement(selector, timeout = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Verificar que un elemento es visible
   * @param {string} selector - Selector del elemento
   */
  async expectElementVisible(selector) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Obtener la URL actual
   * @returns {string} - URL actual
   */
  getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Verificar si estamos en una página específica
   * @param {string} pageIdentifier - Identificador de la página (ej: 'login', 'dashboard')
   * @returns {boolean} - True si estamos en la página
   */
  isOnPage(pageIdentifier) {
    const currentUrl = this.getCurrentUrl();
    return currentUrl.includes(pageIdentifier);
  }

  /**
   * Esperar a que la página cargue completamente
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Hacer scroll hasta un elemento
   * @param {string} selector - Selector del elemento
   */
  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Verificar que no hay errores de JavaScript en la consola
   */
  async checkForConsoleErrors() {
    const errors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  }
}

module.exports = BasePage;
