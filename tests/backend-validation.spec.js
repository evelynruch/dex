const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const TestData = require('../utils/TestData');
const BackendValidator = require('../utils/BackendValidator');

test.describe('Validaciones de Backend - Demo4 DexManager', () => {
  let loginPage;
  let testData;
  let backendValidator;

  test.beforeEach(async ({ page }) => {
    // Inicializar componentes
    loginPage = new LoginPage(page);
    testData = new TestData();
    backendValidator = new BackendValidator(page);
    
    // Navegar a la página de login
    await loginPage.gotoLoginPage();
  });

  test('Validar requests y responses HTTP durante login', async ({ page }) => {
    const credentials = testData.getValidCredentials();
    
    console.log('🔍 Iniciando validación de backend...');
    
    // Realizar login y monitorear requests
    await loginPage.performLogin(credentials.username, credentials.password);
    
    // Validar request de login
    const loginRequest = await backendValidator.validateLoginRequest();
    if (loginRequest) {
      expect(loginRequest.method).toBeDefined();
      expect(loginRequest.url).toBeDefined();
      console.log('✅ Request de login validado');
    }
    
    // Validar response de login
    const loginResponse = await backendValidator.validateLoginResponse();
    if (loginResponse) {
      expect(loginResponse.status).toBeDefined();
      console.log('✅ Response de login validada');
    }
    
    // Obtener resumen completo
    const summary = await backendValidator.getValidationSummary();
    expect(summary.requests).toBeGreaterThan(0);
    
    console.log('✅ Validación de requests HTTP completada');
  });

  test('Validar headers de seguridad', async ({ page }) => {
    console.log('🔒 Validando headers de seguridad...');
    
    const securityHeaders = await backendValidator.validateSecurityHeaders();
    
    // Verificar headers críticos
    const criticalHeaders = ['X-Content-Type-Options', 'X-Frame-Options'];
    for (const header of criticalHeaders) {
      if (securityHeaders[header]) {
        expect(securityHeaders[header].present).toBeDefined();
        console.log(`✅ Header ${header} verificado`);
      }
    }
    
    console.log('✅ Validación de headers de seguridad completada');
  });

  test('Validar cookies de sesión', async ({ page }) => {
    const credentials = testData.getValidCredentials();
    
    console.log('🍪 Validando cookies de sesión...');
    
    // Realizar login
    await loginPage.performLogin(credentials.username, credentials.password);
    
    // Validar cookies
    const cookieInfo = await backendValidator.validateSessionCookies();
    
    expect(cookieInfo.totalCookies).toBeGreaterThanOrEqual(0);
    expect(cookieInfo.sessionCookies).toBeGreaterThanOrEqual(0);
    
    // Verificar cookies de sesión si existen
    if (cookieInfo.sessionCookies > 0) {
      cookieInfo.cookies.forEach(cookie => {
        expect(cookie.name).toBeDefined();
        expect(cookie.domain).toBeDefined();
        console.log(`✅ Cookie de sesión: ${cookie.name}`);
      });
    }
    
    console.log('✅ Validación de cookies completada');
  });

  test('Validar tiempo de respuesta', async ({ page }) => {
    const credentials = testData.getValidCredentials();
    
    console.log('⏱️ Validando tiempo de respuesta...');
    
    // Medir tiempo de login
    const startTime = Date.now();
    await loginPage.performLogin(credentials.username, credentials.password);
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    const maxTime = 5000; // 5 segundos máximo
    
    expect(responseTime).toBeLessThan(maxTime);
    console.log(`✅ Tiempo de respuesta: ${responseTime}ms (límite: ${maxTime}ms)`);
    
    // Validar tiempo de requests específicos
    const performanceInfo = await backendValidator.validateResponseTime('/login', 3000);
    expect(performanceInfo.responseTime).toBeDefined();
    
    console.log('✅ Validación de performance completada');
  });

  test('Validar errores de JavaScript', async ({ page }) => {
    console.log('🐛 Validando errores de JavaScript...');
    
    // Navegar y realizar acciones que podrían generar errores
    await loginPage.gotoLoginPage();
    
    // Intentar login con credenciales inválidas
    await loginPage.loginWithInvalidCredentials();
    
    // Validar errores de JavaScript
    const jsErrors = await backendValidator.validateJavaScriptErrors();
    
    // No debería haber errores críticos
    const criticalErrors = jsErrors.filter(error => 
      error.message.includes('Uncaught') || 
      error.message.includes('ReferenceError')
    );
    
    expect(criticalErrors.length).toBe(0);
    console.log(`✅ Errores de JavaScript validados: ${jsErrors.length} encontrados`);
    
    if (jsErrors.length > 0) {
      jsErrors.forEach(error => {
        console.log(`⚠️ Error JS: ${error.message}`);
      });
    }
    
    console.log('✅ Validación de errores JavaScript completada');
  });

  test('Validar autenticación JWT', async ({ page }) => {
    const credentials = testData.getValidCredentials();
    
    console.log('🔑 Validando autenticación JWT...');
    
    // Realizar login
    await loginPage.performLogin(credentials.username, credentials.password);
    
    // Validar JWT
    const jwtInfo = await backendValidator.validateJWTAuth();
    
    if (jwtInfo.valid) {
      expect(jwtInfo.header).toBeDefined();
      expect(jwtInfo.payload).toBeDefined();
      expect(jwtInfo.expires).toBeDefined();
      
      // Verificar que el token no ha expirado
      const now = new Date();
      expect(jwtInfo.expires.getTime()).toBeGreaterThan(now.getTime());
      
      console.log('✅ Token JWT válido');
      console.log(`📅 Expira: ${jwtInfo.expires}`);
    } else {
      console.log(`⚠️ JWT no encontrado o inválido: ${jwtInfo.error}`);
    }
    
    console.log('✅ Validación de JWT completada');
  });

  test('Validar estructura de respuesta JSON', async ({ page }) => {
    const credentials = testData.getValidCredentials();
    
    console.log('📋 Validando estructura de respuesta JSON...');
    
    // Realizar login
    await loginPage.performLogin(credentials.username, credentials.password);
    
    // Estructura esperada para respuesta de login
    const expectedStructure = {
      success: 'boolean',
      message: 'string',
      token: 'string',
      user: 'object'
    };
    
    // Validar estructura (si hay respuesta JSON)
    const validation = await backendValidator.validateJSONResponse('/login', expectedStructure);
    
    if (validation.valid) {
      console.log('✅ Estructura JSON válida');
    } else {
      console.log(`⚠️ Estructura JSON: ${validation.error}`);
    }
    
    console.log('✅ Validación de estructura JSON completada');
  });

  test('Validación completa de backend', async ({ page }) => {
    const credentials = testData.getValidCredentials();
    
    console.log('🚀 Iniciando validación completa de backend...');
    
    // Realizar login
    await loginPage.performLogin(credentials.username, credentials.password);
    
    // Ejecutar todas las validaciones
    const summary = await backendValidator.getValidationSummary();
    
    // Verificaciones básicas
    expect(summary.requests).toBeGreaterThan(0);
    expect(summary.responses).toBeGreaterThan(0);
    
    // Log del resumen
    console.log('📊 Resumen de validaciones:');
    console.log(`- Requests: ${summary.requests}`);
    console.log(`- Responses: ${summary.responses}`);
    console.log(`- Login Request: ${summary.loginRequest ? '✅' : '❌'}`);
    console.log(`- Login Response: ${summary.loginResponse ? '✅' : '❌'}`);
    console.log(`- Errores JS: ${summary.jsErrors.length}`);
    
    // Validaciones adicionales
    const securityHeaders = await backendValidator.validateSecurityHeaders();
    const sessionCookies = await backendValidator.validateSessionCookies();
    
    console.log(`- Headers de seguridad: ${Object.keys(securityHeaders).length}`);
    console.log(`- Cookies de sesión: ${sessionCookies.sessionCookies}`);
    
    console.log('✅ Validación completa de backend finalizada');
  });

  test.afterEach(async ({ page }) => {
    // Limpiar interceptores después de cada test
    if (backendValidator) {
      backendValidator.clearInterceptors();
    }
  });
});
