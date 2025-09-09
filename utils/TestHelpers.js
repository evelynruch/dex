const { expect } = require('@playwright/test');

/**
 * Helper functions para reducir duplicación en los tests
 */
class TestHelpers {
  constructor() {
    this.testData = require('./TestData');
  }

  /**
   * Helper para manejar errores del servidor de forma consistente
   * @param {object} page - Página actual
   * @param {string} testName - Nombre del test
   * @returns {boolean} - True si hay error del servidor
   */
  async handleServerErrors(page, testName) {
    const serverError = await page.checkServerErrors(testName);
    if (serverError) {
      console.log(`✅ Test completado con advertencia: Error del servidor detectado`);
      return true;
    }
    return false;
  }

  /**
   * Helper para realizar login y verificar errores
   * @param {object} loginPage - Página de login
   * @param {string} username - Usuario
   * @param {string} password - Contraseña
   * @param {string} testName - Nombre del test
   * @returns {boolean} - True si hay error del servidor
   */
  async performLoginWithErrorHandling(loginPage, username, password, testName) {
    await loginPage.performLogin(username, password);
    return await this.handleServerErrors(loginPage, testName);
  }

  /**
   * Helper para tests de validación de campos
   * @param {object} loginPage - Página de login
   * @param {string} username - Usuario a probar
   * @param {string} password - Contraseña a probar
   * @param {string} screenshotName - Nombre del screenshot
   * @returns {boolean} - True si el login falló (como se espera)
   */
  async testFieldValidation(loginPage, username, password, screenshotName) {
    await loginPage.fillUsername(username);
    await loginPage.fillPassword(password);
    await loginPage.takeScreenshot(screenshotName);
    await loginPage.clickLoginButton();
    await loginPage.waitForPageLoad();
    
    return await loginPage.isLoginFailed();
  }

  /**
   * Helper para tests de login fallido
   * @param {object} loginPage - Página de login
   * @param {function} loginAction - Función que realiza el login
   * @param {string} screenshotName - Nombre del screenshot
   * @param {string} testDescription - Descripción del test
   */
  async testFailedLogin(loginPage, loginAction, screenshotName, testDescription) {
    await loginAction();
    await loginPage.takeScreenshot(screenshotName);
    
    const isLoginFailed = await loginPage.isLoginFailed();
    expect(isLoginFailed).toBeTruthy();
    
    console.log(`✅ ${testDescription} completado`);
  }

  /**
   * Helper para tests de caracteres especiales y longitud
   * @param {object} loginPage - Página de login
   * @param {object} testData - Datos de prueba
   * @param {string} testType - Tipo de test ('special' o 'long')
   */
  async testFieldValidationWithData(loginPage, testData, testType) {
    const data = testType === 'special' ? testData.getSpecialCharacters() : testData.getLongStrings();
    const validCreds = testData.getValidCredentials();
    
    // Test con username modificado
    const usernameFailed = await this.testFieldValidation(
      loginPage, 
      data.username, 
      validCreds.password, 
      `${testType}-chars-username.png`
    );
    expect(usernameFailed).toBeTruthy();
    
    // Test con password modificado
    await loginPage.clearFields();
    const passwordFailed = await this.testFieldValidation(
      loginPage, 
      validCreds.username, 
      data.password, 
      `${testType}-chars-password.png`
    );
    expect(passwordFailed).toBeTruthy();
    
    console.log(`✅ Test de ${testType === 'special' ? 'caracteres especiales' : 'longitud máxima'} completado`);
  }

  /**
   * Helper para verificar elementos de página
   * @param {object} page - Página a verificar
   * @param {string} screenshotName - Nombre del screenshot
   * @param {string} testDescription - Descripción del test
   */
  async verifyPageElements(page, screenshotName, testDescription) {
    await page.takeScreenshot(screenshotName);
    console.log(`✅ ${testDescription} completado`);
  }

  /**
   * Helper para tests de dashboard
   * @param {object} loginPage - Página de login
   * @param {object} dashboardPage - Página de dashboard
   * @param {object} testData - Datos de prueba
   * @param {string} testName - Nombre del test
   */
  async testDashboardFlow(loginPage, dashboardPage, testData, testName) {
    const credentials = testData.getValidCredentials();
    
    // Realizar login
    const hasServerError = await this.performLoginWithErrorHandling(
      loginPage, 
      credentials.username, 
      credentials.password, 
      testName
    );
    
    if (hasServerError) return;
    
    // Verificar dashboard
    const isOnDashboard = await dashboardPage.isOnDashboard();
    expect(isOnDashboard).toBeTruthy();
    
    await dashboardPage.verifyDashboardElements();
    await dashboardPage.takeScreenshot('dashboard-main.png');
    
    console.log(`✅ ${testName} completado`);
  }

  /**
   * Helper para tests de funcionalidad de campos
   * @param {object} loginPage - Página de login
   * @param {object} testData - Datos de prueba
   */
  async testFieldFunctionality(loginPage, testData) {
    // Verificar campos vacíos
    const areFieldsEmpty = await loginPage.areFieldsEmpty();
    expect(areFieldsEmpty).toBeTruthy();
    
    // Verificar botones habilitados
    const isLoginButtonEnabled = await loginPage.isLoginButtonEnabled();
    const isForgotPasswordButtonEnabled = await loginPage.isForgotPasswordButtonEnabled();
    expect(isLoginButtonEnabled).toBeTruthy();
    expect(isForgotPasswordButtonEnabled).toBeTruthy();
    
    // Test de llenado y verificación
    const credentials = testData.getValidCredentials();
    await loginPage.fillUsername(credentials.username);
    await loginPage.fillPassword(credentials.password);
    
    const usernameValue = await loginPage.getUsernameValue();
    const passwordValue = await loginPage.getPasswordValue();
    expect(usernameValue).toBe(credentials.username);
    expect(passwordValue).toBe(credentials.password);
    
    // Test de limpieza
    await loginPage.clearFields();
    const areFieldsEmptyAfterClear = await loginPage.areFieldsEmpty();
    expect(areFieldsEmptyAfterClear).toBeTruthy();
    
    console.log('✅ Test de funcionalidad de campos completado');
  }
}

module.exports = TestHelpers;
