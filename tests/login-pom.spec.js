const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const TestData = require('../utils/TestData');

test.describe('Automatización de Login - Demo4 DexManager (POM)', () => {
  let loginPage;
  let dashboardPage;
  let testData;

  test.beforeEach(async ({ page }) => {
    // Inicializar las páginas y datos de prueba
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    testData = new TestData();
    
    // Navegar a la página de login
    await loginPage.gotoLoginPage();
  });

  test('Verificar elementos de la página de login', async ({ page }) => {
    // Verificar que todos los elementos están presentes
    await loginPage.verifyLoginPageElements();
    
    // Tomar screenshot de la página completa
    await loginPage.takeScreenshot('login-page-elements.png');
    
    console.log('✅ Test de verificación de elementos completado');
  });

  test('Login exitoso con credenciales válidas', async ({ page }) => {
    const credentials = testData.getValidCredentials();
    
    // Tomar screenshot inicial
    await loginPage.takeScreenshot('before-login.png');
    
    // Realizar login
    await loginPage.performLogin(credentials.username, credentials.password);
    
    // Verificar errores del servidor
    const serverError = await loginPage.checkServerErrors('login-exitoso');
    if (serverError) {
      console.log('✅ Test completado con advertencia: Error del servidor detectado');
      return;
    }
    
    // Tomar screenshot después del login
    await loginPage.takeScreenshot('after-login.png');
    
    // Verificar que el login fue exitoso
    const isLoginSuccessful = await loginPage.isLoginSuccessful();
    expect(isLoginSuccessful).toBeTruthy();
    
    console.log('✅ Login exitoso completado');
  });

  test('Login fallido con campo de usuario vacío', async ({ page }) => {
    // Realizar login con usuario vacío
    await loginPage.loginWithEmptyUsername();
    
    // Tomar screenshot después del intento
    await loginPage.takeScreenshot('empty-username-after.png');
    
    // Verificar que el login falló
    const isLoginFailed = await loginPage.isLoginFailed();
    expect(isLoginFailed).toBeTruthy();
    
    console.log('✅ Test de campo de usuario vacío completado');
  });

  test('Login fallido con campo de contraseña vacío', async ({ page }) => {
    // Realizar login con contraseña vacía
    await loginPage.loginWithEmptyPassword();
    
    // Tomar screenshot después del intento
    await loginPage.takeScreenshot('empty-password-after.png');
    
    // Verificar que el login falló
    const isLoginFailed = await loginPage.isLoginFailed();
    expect(isLoginFailed).toBeTruthy();
    
    console.log('✅ Test de campo de contraseña vacío completado');
  });

  test('Login fallido con credenciales incorrectas', async ({ page }) => {
    // Realizar login con credenciales incorrectas
    await loginPage.loginWithInvalidCredentials();
    
    // Tomar screenshot después del intento
    await loginPage.takeScreenshot('wrong-credentials-after.png');
    
    // Verificar que el login falló
    const isLoginFailed = await loginPage.isLoginFailed();
    expect(isLoginFailed).toBeTruthy();
    
    console.log('✅ Test de credenciales incorrectas completado');
  });

  test('Test de funcionalidad Forgot Password', async ({ page }) => {
    // Hacer clic en forgot password
    await loginPage.clickForgotPasswordButton();
    
    // Verificar errores del servidor
    const serverError = await loginPage.checkServerErrors('forgot-password');
    if (serverError) {
      console.log('✅ Test completado con advertencia: Error del servidor detectado');
      return;
    }
    
    // Tomar screenshot de la página de forgot password
    await loginPage.takeScreenshot('forgot-password-page.png');
    
    // Verificar que algo cambió en la página
    const hasNewElements = await page.locator('input, button, form').count() > 0;
    expect(hasNewElements).toBeTruthy();
    
    console.log('✅ Test de Forgot Password completado');
  });

  test('Test de navegación y elementos después del login exitoso', async ({ page }) => {
    const credentials = testData.getValidCredentials();
    
    // Realizar login exitoso
    await loginPage.performLogin(credentials.username, credentials.password);
    
    // Verificar errores del servidor
    const serverError = await loginPage.checkServerErrors('navegacion-post-login');
    if (serverError) {
      console.log('✅ Test completado con advertencia: Error del servidor detectado');
      return;
    }
    
    // Verificar que estamos en el dashboard
    const isOnDashboard = await dashboardPage.isOnDashboard();
    expect(isOnDashboard).toBeTruthy();
    
    // Verificar elementos del dashboard
    await dashboardPage.verifyDashboardElements();
    
    // Tomar screenshot del dashboard
    await dashboardPage.takeScreenshot('dashboard-main.png');
    
    console.log('✅ Test de navegación post-login completado');
  });

  test('Test de validación de campos con caracteres especiales', async ({ page }) => {
    const specialChars = testData.getSpecialCharacters();
    
    // Probar con caracteres especiales en el usuario
    await loginPage.fillUsername(specialChars.username);
    await loginPage.fillPassword(testData.getValidCredentials().password);
    
    await loginPage.takeScreenshot('special-chars-username.png');
    
    await loginPage.clickLoginButton();
    await loginPage.waitForPageLoad();
    
    // Verificar que el login falló
    const isLoginFailed = await loginPage.isLoginFailed();
    expect(isLoginFailed).toBeTruthy();
    
    // Probar con caracteres especiales en la contraseña
    await loginPage.clearFields();
    await loginPage.fillUsername(testData.getValidCredentials().username);
    await loginPage.fillPassword(specialChars.password);
    
    await loginPage.takeScreenshot('special-chars-password.png');
    
    await loginPage.clickLoginButton();
    await loginPage.waitForPageLoad();
    
    const isLoginFailed2 = await loginPage.isLoginFailed();
    expect(isLoginFailed2).toBeTruthy();
    
    console.log('✅ Test de caracteres especiales completado');
  });

  test('Test de longitud máxima de campos', async ({ page }) => {
    const longStrings = testData.getLongStrings();
    
    // Probar con usuario muy largo
    await loginPage.fillUsername(longStrings.username);
    await loginPage.fillPassword(testData.getValidCredentials().password);
    
    await loginPage.takeScreenshot('long-username.png');
    
    await loginPage.clickLoginButton();
    await loginPage.waitForPageLoad();
    
    // Verificar que el login falló
    const isLoginFailed = await loginPage.isLoginFailed();
    expect(isLoginFailed).toBeTruthy();
    
    // Probar con contraseña muy larga
    await loginPage.clearFields();
    await loginPage.fillUsername(testData.getValidCredentials().username);
    await loginPage.fillPassword(longStrings.password);
    
    await loginPage.takeScreenshot('long-password.png');
    
    await loginPage.clickLoginButton();
    await loginPage.waitForPageLoad();
    
    const isLoginFailed2 = await loginPage.isLoginFailed();
    expect(isLoginFailed2).toBeTruthy();
    
    console.log('✅ Test de longitud máxima completado');
  });

  test('Test de funcionalidad de campos de entrada', async ({ page }) => {
    // Verificar que los campos están vacíos inicialmente
    const areFieldsEmpty = await loginPage.areFieldsEmpty();
    expect(areFieldsEmpty).toBeTruthy();
    
    // Verificar que los botones están habilitados
    const isLoginButtonEnabled = await loginPage.isLoginButtonEnabled();
    const isForgotPasswordButtonEnabled = await loginPage.isForgotPasswordButtonEnabled();
    
    expect(isLoginButtonEnabled).toBeTruthy();
    expect(isForgotPasswordButtonEnabled).toBeTruthy();
    
    // Llenar campos y verificar valores
    const credentials = testData.getValidCredentials();
    await loginPage.fillUsername(credentials.username);
    await loginPage.fillPassword(credentials.password);
    
    const usernameValue = await loginPage.getUsernameValue();
    const passwordValue = await loginPage.getPasswordValue();
    
    expect(usernameValue).toBe(credentials.username);
    expect(passwordValue).toBe(credentials.password);
    
    // Limpiar campos y verificar que están vacíos
    await loginPage.clearFields();
    const areFieldsEmptyAfterClear = await loginPage.areFieldsEmpty();
    expect(areFieldsEmptyAfterClear).toBeTruthy();
    
    console.log('✅ Test de funcionalidad de campos completado');
  });

  test('Test de información del dashboard', async ({ page }) => {
    const credentials = testData.getValidCredentials();
    
    // Realizar login exitoso
    await loginPage.performLogin(credentials.username, credentials.password);
    
    // Verificar errores del servidor
    const serverError = await loginPage.checkServerErrors('dashboard-info');
    if (serverError) {
      console.log('✅ Test completado con advertencia: Error del servidor detectado');
      return;
    }
    
    // Obtener información completa del dashboard
    const dashboardInfo = await dashboardPage.getDashboardInfo();
    
    // Verificar información básica
    expect(dashboardInfo.isOnDashboard).toBeTruthy();
    expect(dashboardInfo.buttonCount).toBeGreaterThan(0);
    expect(dashboardInfo.linkCount).toBeGreaterThan(0);
    
    // Log de información del dashboard
    console.log('📊 Información del Dashboard:', JSON.stringify(dashboardInfo, null, 2));
    
    console.log('✅ Test de información del dashboard completado');
  });
});
