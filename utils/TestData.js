/**
 * Datos de prueba para los tests
 */
class TestData {
  constructor() {
    // Credenciales válidas
    this.validCredentials = {
      username: 'challengeqa',
      password: 'Abcd1234'
    };

    // Credenciales inválidas
    this.invalidCredentials = {
      username: 'usuario_incorrecto',
      password: 'contraseña_incorrecta'
    };

    // Caracteres especiales para pruebas
    this.specialCharacters = {
      username: 'test@#$%^&*()',
      password: 'test@#$%^&*()'
    };

    // Strings largos para pruebas de longitud
    this.longStrings = {
      username: 'a'.repeat(1000),
      password: 'b'.repeat(1000)
    };

    // URLs
    this.urls = {
      base: 'https://demo4.dexmanager.com',
      login: '/',
      forgotPassword: '/forgot-password'
    };

    // Selectores
    this.selectors = {
      logo: 'img[alt="DEX Manager"]',
      userField: 'textbox[name="User"]',
      passwordField: 'textbox[name="Password"]',
      loginButton: 'button[name="Login"]',
      forgotPasswordButton: 'button[name="Forgot password?"]',
      serverVersion: 'text=6.1.2505.1408 - 2025-09-04 17:19:14 UTC'
    };

    // Mensajes de error esperados
    this.errorMessages = {
      userRequired: 'User required',
      passwordRequired: 'Password required',
      error401: 'Error code: 401',
      serverError: 'Looks like there\'s a problem with this site'
    };

    // Timeouts
    this.timeouts = {
      short: 2000,
      medium: 5000,
      long: 10000
    };
  }

  /**
   * Obtener credenciales válidas
   * @returns {object} - Credenciales válidas
   */
  getValidCredentials() {
    return this.validCredentials;
  }

  /**
   * Obtener credenciales inválidas
   * @returns {object} - Credenciales inválidas
   */
  getInvalidCredentials() {
    return this.invalidCredentials;
  }

  /**
   * Obtener caracteres especiales
   * @returns {object} - Caracteres especiales
   */
  getSpecialCharacters() {
    return this.specialCharacters;
  }

  /**
   * Obtener strings largos
   * @returns {object} - Strings largos
   */
  getLongStrings() {
    return this.longStrings;
  }

  /**
   * Obtener URLs
   * @returns {object} - URLs
   */
  getUrls() {
    return this.urls;
  }

  /**
   * Obtener selectores
   * @returns {object} - Selectores
   */
  getSelectors() {
    return this.selectors;
  }

  /**
   * Obtener mensajes de error
   * @returns {object} - Mensajes de error
   */
  getErrorMessages() {
    return this.errorMessages;
  }

  /**
   * Obtener timeouts
   * @returns {object} - Timeouts
   */
  getTimeouts() {
    return this.timeouts;
  }
}

module.exports = TestData;
