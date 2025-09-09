const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');
const TestData = require('../utils/TestData');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.testData = new TestData();
    
    // Selectores de elementos de la página de login
    this.selectors = {
      logo: 'img[alt="DEX Manager"]',
      userField: 'textbox[name="User"]',
      passwordField: 'textbox[name="Password"]',
      loginButton: 'button[name="Login"]',
      forgotPasswordButton: 'button[name="Forgot password?"]',
      serverVersion: 'text=6.1.2505.1408 - 2025-09-04 17:19:14 UTC',
      userRequired: 'text=User required',
      passwordRequired: 'text=Password required'
    };

    // URLs
    this.urls = {
      login: '/',
      forgotPassword: '/forgot-password'
    };
  }

  /**
   * Navegar a la página de login
   */
  async gotoLoginPage() {
    await this.goto(this.urls.login);
  }

  /**
   * Verificar que todos los elementos de la página de login están presentes
   */
  async verifyLoginPageElements() {
    // Verificar logo
    await expect(this.page.getByRole('img', { name: 'DEX Manager' })).toBeVisible();
    
    // Verificar campos de entrada
    await expect(this.page.getByRole('textbox', { name: 'User' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    
    // Verificar botones
    await expect(this.page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Forgot password?' })).toBeVisible();
    
    // Verificar versión del servidor
    await expect(this.page.getByText('6.1.2505.1408 - 2025-09-04 17:19:14 UTC')).toBeVisible();
    
    console.log('✅ Todos los elementos de la página de login están presentes');
  }

  /**
   * Llenar el campo de usuario
   * @param {string} username - Nombre de usuario
   */
  async fillUsername(username) {
    await this.page.step('Fill username field', async () => {
      await this.page.getByRole('textbox', { name: 'User' }).fill(username);
    });
  }

  /**
   * Llenar el campo de contraseña
   * @param {string} password - Contraseña
   */
  async fillPassword(password) {
    await this.page.step('Fill password field', async () => {
      await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    });
  }

  /**
   * Hacer clic en el botón de login
   */
  async clickLoginButton() {
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  /**
   * Hacer clic en el botón de forgot password
   */
  async clickForgotPasswordButton() {
    await this.page.getByRole('button', { name: 'Forgot password?' }).click();
  }

  /**
   * Realizar login completo
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   */
  async performLogin(username, password) {
    await this.page.step('Perform login with credentials', async () => {
      await this.fillUsername(username);
      await this.fillPassword(password);
      await this.clickLoginButton();
      await this.waitForPageLoad();
    });
  }

  /**
   * Verificar que el login fue exitoso
   * @returns {boolean} - True si el login fue exitoso
   */
  async isLoginSuccessful() {
    const currentUrl = this.getCurrentUrl();
    const isStillOnLoginPage = currentUrl.includes('login') || 
                              currentUrl.includes('signin') || 
                              currentUrl.includes('auth') ||
                              currentUrl === 'https://demo4.dexmanager.com/';
    
    return !isStillOnLoginPage;
  }

  /**
   * Verificar que el login falló (permanecemos en la página de login)
   * @returns {boolean} - True si el login falló
   */
  async isLoginFailed() {
    const currentUrl = this.getCurrentUrl();
    const isStillOnLoginPage = currentUrl.includes('login') || 
                              currentUrl.includes('signin') || 
                              currentUrl.includes('auth') ||
                              currentUrl === 'https://demo4.dexmanager.com/';
    
    return isStillOnLoginPage;
  }

  /**
   * Verificar mensajes de validación
   * @param {string} fieldType - Tipo de campo ('user' o 'password')
   * @returns {boolean} - True si el mensaje de validación está presente
   */
  async hasValidationMessage(fieldType) {
    if (fieldType === 'user') {
      return await this.page.locator('text=User required').isVisible();
    } else if (fieldType === 'password') {
      return await this.page.locator('text=Password required').isVisible();
    }
    return false;
  }

  /**
   * Limpiar campos de entrada
   */
  async clearFields() {
    await this.page.getByRole('textbox', { name: 'User' }).clear();
    await this.page.getByRole('textbox', { name: 'Password' }).clear();
  }

  /**
   * Verificar que los campos están vacíos
   * @returns {boolean} - True si ambos campos están vacíos
   */
  async areFieldsEmpty() {
    const userValue = await this.page.getByRole('textbox', { name: 'User' }).inputValue();
    const passwordValue = await this.page.getByRole('textbox', { name: 'Password' }).inputValue();
    
    return userValue === '' && passwordValue === '';
  }

  /**
   * Obtener el valor del campo de usuario
   * @returns {string} - Valor del campo de usuario
   */
  async getUsernameValue() {
    return await this.page.getByRole('textbox', { name: 'User' }).inputValue();
  }

  /**
   * Obtener el valor del campo de contraseña
   * @returns {string} - Valor del campo de contraseña
   */
  async getPasswordValue() {
    return await this.page.getByRole('textbox', { name: 'Password' }).inputValue();
  }

  /**
   * Verificar si el botón de login está habilitado
   * @returns {boolean} - True si el botón está habilitado
   */
  async isLoginButtonEnabled() {
    return await this.page.getByRole('button', { name: 'Login' }).isEnabled();
  }

  /**
   * Verificar si el botón de forgot password está habilitado
   * @returns {boolean} - True si el botón está habilitado
   */
  async isForgotPasswordButtonEnabled() {
    return await this.page.getByRole('button', { name: 'Forgot password?' }).isEnabled();
  }

  /**
   * Realizar login con credenciales válidas
   */
  async loginWithValidCredentials() {
    const credentials = this.testData.getValidCredentials();
    await this.performLogin(credentials.username, credentials.password);
  }

  /**
   * Realizar login con credenciales inválidas
   */
  async loginWithInvalidCredentials() {
    await this.performLogin('usuario_incorrecto', 'contraseña_incorrecta');
  }

  /**
   * Realizar login con campo de usuario vacío
   */
  async loginWithEmptyUsername() {
    const credentials = this.testData.getValidCredentials();
    await this.fillPassword(credentials.password);
    await this.clickLoginButton();
    await this.waitForPageLoad();
  }

  /**
   * Realizar login con campo de contraseña vacío
   */
  async loginWithEmptyPassword() {
    const credentials = this.testData.getValidCredentials();
    await this.fillUsername(credentials.username);
    await this.clickLoginButton();
    await this.waitForPageLoad();
  }
}

module.exports = LoginPage;
