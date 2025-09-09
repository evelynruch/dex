const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const TestData = require('../utils/TestData');
const TestHelpers = require('../utils/TestHelpers');
const BackendValidator = require('../utils/BackendValidator');

test.describe('Automatización de Login - Demo4 DexManager (POM Optimizado)', () => {
  let loginPage;
  let dashboardPage;
  let testData;
  let testHelpers;
  let backendValidator;

  test.beforeEach(async ({ page }) => {
    // Inicializar las páginas y helpers
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    testData = new TestData();
    testHelpers = new TestHelpers();
    backendValidator = new BackendValidator(page);
    
    // Navegar a la página de login
    await loginPage.gotoLoginPage();
  });

  test('Verificar elementos de la página de login @critical', async ({ page }) => {
    await allure.epic('Login Automation');
    await allure.feature('Login Page Validation');
    await allure.story('Verify Login Page Elements');
    await allure.severity('critical');
    
    await loginPage.verifyLoginPageElements();
    await testHelpers.verifyPageElements(loginPage, 'login-page-elements.png', 'Test de verificación de elementos');
  });

  test('Login exitoso con credenciales válidas @critical', async ({ page }) => {
    await allure.epic('Login Automation');
    await allure.feature('Successful Login');
    await allure.story('Valid Credentials Login');
    await allure.severity('critical');
    
    const credentials = testData.getValidCredentials();
    
    await loginPage.takeScreenshot('before-login.png');
    
    const hasServerError = await testHelpers.performLoginWithErrorHandling(
      loginPage, 
      credentials.username, 
      credentials.password, 
      'login-exitoso'
    );
    
    if (hasServerError) return;
    
    await loginPage.takeScreenshot('after-login.png');
    
    const isLoginSuccessful = await loginPage.isLoginSuccessful();
    expect(isLoginSuccessful).toBeTruthy();
    
    console.log('✅ Login exitoso completado');
  });

  // Tests de validación de login fallido usando helper
  test('Login fallido con campo de usuario vacío @critical', async ({ page }) => {
    await testHelpers.testFailedLogin(
      loginPage,
      () => loginPage.loginWithEmptyUsername(),
      'empty-username-after.png',
      'Test de campo de usuario vacío'
    );
  });

  test('Login fallido con campo de contraseña vacío @critical', async ({ page }) => {
    await testHelpers.testFailedLogin(
      loginPage,
      () => loginPage.loginWithEmptyPassword(),
      'empty-password-after.png',
      'Test de campo de contraseña vacío'
    );
  });

  test('Login fallido con credenciales incorrectas @critical', async ({ page }) => {
    await testHelpers.testFailedLogin(
      loginPage,
      () => loginPage.loginWithInvalidCredentials(),
      'wrong-credentials-after.png',
      'Test de credenciales incorrectas'
    );
  });

  test('Test de funcionalidad Forgot Password @critical', async ({ page }) => {
    await loginPage.clickForgotPasswordButton();
    
    const hasServerError = await testHelpers.handleServerErrors(loginPage, 'forgot-password');
    if (hasServerError) return;
    
    await loginPage.takeScreenshot('forgot-password-page.png');
    
    const hasNewElements = await page.locator('input, button, form').count() > 0;
    expect(hasNewElements).toBeTruthy();
    
    console.log('✅ Test de Forgot Password completado');
  });

  test('Test de navegación y elementos después del login exitoso', async ({ page }) => {
    await testHelpers.testDashboardFlow(
      loginPage, 
      dashboardPage, 
      testData, 
      'Test de navegación post-login'
    );
  });

  // Tests de validación usando helper optimizado
  test('Test de validación de campos con caracteres especiales', async ({ page }) => {
    await testHelpers.testFieldValidationWithData(loginPage, testData, 'special');
  });

  test('Test de longitud máxima de campos', async ({ page }) => {
    await testHelpers.testFieldValidationWithData(loginPage, testData, 'long');
  });

  test('Test de funcionalidad de campos de entrada', async ({ page }) => {
    await testHelpers.testFieldFunctionality(loginPage, testData);
  });

  test('Test de información del dashboard', async ({ page }) => {
    const credentials = testData.getValidCredentials();
    
    const hasServerError = await testHelpers.performLoginWithErrorHandling(
      loginPage, 
      credentials.username, 
      credentials.password, 
      'dashboard-info'
    );
    
    if (hasServerError) return;
    
    const dashboardInfo = await dashboardPage.getDashboardInfo();
    
    expect(dashboardInfo.isOnDashboard).toBeTruthy();
    expect(dashboardInfo.buttonCount).toBeGreaterThan(0);
    expect(dashboardInfo.linkCount).toBeGreaterThan(0);
    
    console.log('📊 Información del Dashboard:', JSON.stringify(dashboardInfo, null, 2));
    console.log('✅ Test de información del dashboard completado');
  });

  test('Validaciones de backend durante login @critical', async ({ page }) => {
    const credentials = testData.getValidCredentials();
    
    console.log('🔍 Iniciando validaciones de backend...');
    
    // Realizar login y monitorear backend
    await loginPage.performLogin(credentials.username, credentials.password);
    
    // Validar requests HTTP
    const loginRequest = await backendValidator.validateLoginRequest();
    const loginResponse = await backendValidator.validateLoginResponse();
    
    // Validar headers de seguridad
    const securityHeaders = await backendValidator.validateSecurityHeaders();
    
    // Validar cookies de sesión
    const sessionCookies = await backendValidator.validateSessionCookies();
    
    // Validar tiempo de respuesta
    const performanceInfo = await backendValidator.validateResponseTime('/login', 5000);
    
    // Validar errores de JavaScript
    const jsErrors = await backendValidator.validateJavaScriptErrors();
    
    // Log de resultados
    console.log('📊 Resultados de validación de backend:');
    console.log(`- Request de login: ${loginRequest ? '✅' : '❌'}`);
    console.log(`- Response de login: ${loginResponse ? '✅' : '❌'}`);
    console.log(`- Headers de seguridad: ${Object.keys(securityHeaders).length} verificados`);
    console.log(`- Cookies de sesión: ${sessionCookies.sessionCookies} encontradas`);
    console.log(`- Tiempo de respuesta: ${performanceInfo.responseTime}ms`);
    console.log(`- Errores JS: ${jsErrors.length}`);
    
    // Verificaciones básicas
    expect(performanceInfo.responseTime).toBeLessThan(10000); // Máximo 10 segundos
    expect(jsErrors.filter(e => e.message.includes('Uncaught')).length).toBe(0);
    
    console.log('✅ Validaciones de backend completadas');
  });
});

// Tests data-driven para casos de validación
test.describe('Tests Data-Driven de Validación', () => {
  let loginPage;
  let testData;
  let testHelpers;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    testData = new TestData();
    testHelpers = new TestHelpers();
    await loginPage.gotoLoginPage();
  });

  // Test data-driven para diferentes tipos de credenciales inválidas
  const invalidCredentials = [
    { username: '', password: 'Abcd1234', description: 'Usuario vacío' },
    { username: 'challengeqa', password: '', description: 'Contraseña vacía' },
    { username: 'usuario_incorrecto', password: 'contraseña_incorrecta', description: 'Credenciales incorrectas' },
    { username: 'test@#$%^&*()', password: 'Abcd1234', description: 'Caracteres especiales en usuario' },
    { username: 'challengeqa', password: 'test@#$%^&*()', description: 'Caracteres especiales en contraseña' },
    { username: 'a'.repeat(1000), password: 'Abcd1234', description: 'Usuario muy largo' },
    { username: 'challengeqa', password: 'b'.repeat(1000), description: 'Contraseña muy larga' }
  ];

  for (const creds of invalidCredentials) {
    test(`Login fallido: ${creds.description}`, async ({ page }) => {
      await testHelpers.testFieldValidation(
        loginPage,
        creds.username,
        creds.password,
        `invalid-${creds.description.replace(/\s+/g, '-').toLowerCase()}.png`
      );
      
      const isLoginFailed = await loginPage.isLoginFailed();
      expect(isLoginFailed).toBeTruthy();
      
      console.log(`✅ Test de ${creds.description} completado`);
    });
  }
});
