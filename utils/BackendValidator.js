/**
 * Clase para validaciones de backend y APIs
 */
class BackendValidator {
  constructor(page) {
    this.page = page;
    this.requests = [];
    this.responses = [];
    this.setupInterceptors();
  }

  /**
   * Configurar interceptores para capturar requests y responses
   */
  setupInterceptors() {
    // Interceptar requests
    this.page.on('request', request => {
      this.requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData(),
        timestamp: Date.now()
      });
    });

    // Interceptar responses
    this.page.on('response', response => {
      this.responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        timestamp: Date.now()
      });
    });
  }

  /**
   * Validar que se realizó un request de login
   * @param {string} expectedUrl - URL esperada del endpoint de login
   * @returns {object|null} - Request de login encontrado o null
   */
  async validateLoginRequest(expectedUrl = '/api/login') {
    const loginRequest = this.requests.find(req => 
      req.url.includes(expectedUrl) || 
      req.url.includes('login') || 
      req.url.includes('auth')
    );
    
    if (loginRequest) {
      console.log('✅ Request de login detectado:', loginRequest.url);
      return loginRequest;
    }
    
    console.log('⚠️ No se detectó request de login');
    return null;
  }

  /**
   * Validar respuesta de login
   * @param {number} expectedStatus - Status code esperado
   * @returns {object|null} - Response de login encontrada o null
   */
  async validateLoginResponse(expectedStatus = 200) {
    const loginResponse = this.responses.find(resp => 
      resp.url.includes('login') || 
      resp.url.includes('auth')
    );
    
    if (loginResponse) {
      console.log(`✅ Response de login detectada: ${loginResponse.status} ${loginResponse.statusText}`);
      
      if (loginResponse.status === expectedStatus) {
        console.log('✅ Status code correcto');
      } else {
        console.log(`⚠️ Status code inesperado: ${loginResponse.status} (esperado: ${expectedStatus})`);
      }
      
      return loginResponse;
    }
    
    console.log('⚠️ No se detectó response de login');
    return null;
  }

  /**
   * Validar headers de seguridad
   * @returns {object} - Resultado de validación de headers
   */
  async validateSecurityHeaders() {
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000',
      'Content-Security-Policy': 'default-src \'self\''
    };

    const results = {};
    
    for (const [header, expectedValue] of Object.entries(securityHeaders)) {
      const headerValue = await this.page.evaluate((headerName) => {
        const meta = document.querySelector(`meta[http-equiv="${headerName}"]`);
        return meta ? meta.getAttribute('content') : null;
      }, header);
      
      results[header] = {
        present: !!headerValue,
        value: headerValue,
        expected: expectedValue
      };
    }
    
    console.log('🔒 Validación de headers de seguridad:', results);
    return results;
  }

  /**
   * Validar cookies de sesión
   * @returns {object} - Información de cookies
   */
  async validateSessionCookies() {
    const cookies = await this.page.context().cookies();
    const sessionCookies = cookies.filter(cookie => 
      cookie.name.toLowerCase().includes('session') ||
      cookie.name.toLowerCase().includes('auth') ||
      cookie.name.toLowerCase().includes('token')
    );
    
    const cookieInfo = {
      totalCookies: cookies.length,
      sessionCookies: sessionCookies.length,
      cookies: sessionCookies.map(cookie => ({
        name: cookie.name,
        domain: cookie.domain,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite
      }))
    };
    
    console.log('🍪 Información de cookies:', cookieInfo);
    return cookieInfo;
  }

  /**
   * Validar tiempo de respuesta
   * @param {string} url - URL a monitorear
   * @param {number} maxTime - Tiempo máximo esperado en ms
   * @returns {object} - Información de performance
   */
  async validateResponseTime(url, maxTime = 3000) {
    const startTime = Date.now();
    
    // Esperar a que se complete el request
    await this.page.waitForResponse(response => response.url().includes(url));
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const performanceInfo = {
      url: url,
      responseTime: responseTime,
      maxTime: maxTime,
      withinLimit: responseTime <= maxTime
    };
    
    if (performanceInfo.withinLimit) {
      console.log(`✅ Tiempo de respuesta OK: ${responseTime}ms`);
    } else {
      console.log(`⚠️ Tiempo de respuesta lento: ${responseTime}ms (límite: ${maxTime}ms)`);
    }
    
    return performanceInfo;
  }

  /**
   * Validar que no hay errores de JavaScript
   * @returns {array} - Lista de errores encontrados
   */
  async validateJavaScriptErrors() {
    const errors = [];
    
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push({
          message: msg.text(),
          location: msg.location(),
          timestamp: Date.now()
        });
      }
    });
    
    this.page.on('pageerror', error => {
      errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: Date.now()
      });
    });
    
    return errors;
  }

  /**
   * Validar estructura de respuesta JSON
   * @param {string} url - URL del endpoint
   * @param {object} expectedStructure - Estructura esperada
   * @returns {object} - Resultado de validación
   */
  async validateJSONResponse(url, expectedStructure) {
    const response = this.responses.find(resp => resp.url.includes(url));
    
    if (!response) {
      return { valid: false, error: 'Response no encontrada' };
    }
    
    try {
      const responseData = await response.json();
      const validation = this.validateObjectStructure(responseData, expectedStructure);
      
      console.log('📋 Validación de estructura JSON:', validation);
      return validation;
    } catch (error) {
      return { valid: false, error: 'Error al parsear JSON' };
    }
  }

  /**
   * Validar estructura de objeto
   * @param {object} obj - Objeto a validar
   * @param {object} structure - Estructura esperada
   * @returns {object} - Resultado de validación
   */
  validateObjectStructure(obj, structure) {
    const result = { valid: true, missing: [], extra: [] };
    
    for (const key in structure) {
      if (!(key in obj)) {
        result.valid = false;
        result.missing.push(key);
      }
    }
    
    for (const key in obj) {
      if (!(key in structure)) {
        result.extra.push(key);
      }
    }
    
    return result;
  }

  /**
   * Validar autenticación JWT
   * @returns {object} - Información del token JWT
   */
  async validateJWTAuth() {
    const cookies = await this.page.context().cookies();
    const tokenCookie = cookies.find(cookie => 
      cookie.name.toLowerCase().includes('token') ||
      cookie.name.toLowerCase().includes('jwt')
    );
    
    if (!tokenCookie) {
      return { valid: false, error: 'Token JWT no encontrado' };
    }
    
    try {
      // Decodificar JWT (solo header y payload, sin verificar firma)
      const tokenParts = tokenCookie.value.split('.');
      const header = JSON.parse(atob(tokenParts[0]));
      const payload = JSON.parse(atob(tokenParts[1]));
      
      const tokenInfo = {
        valid: true,
        header: header,
        payload: payload,
        expires: new Date(payload.exp * 1000),
        issued: new Date(payload.iat * 1000)
      };
      
      console.log('🔑 Información del token JWT:', tokenInfo);
      return tokenInfo;
    } catch (error) {
      return { valid: false, error: 'Error al decodificar JWT' };
    }
  }

  /**
   * Limpiar interceptores
   */
  clearInterceptors() {
    this.requests = [];
    this.responses = [];
  }

  /**
   * Obtener resumen de todas las validaciones
   * @returns {object} - Resumen completo
   */
  async getValidationSummary() {
    const summary = {
      requests: this.requests.length,
      responses: this.responses.length,
      loginRequest: await this.validateLoginRequest(),
      loginResponse: await this.validateLoginResponse(),
      securityHeaders: await this.validateSecurityHeaders(),
      sessionCookies: await this.validateSessionCookies(),
      jsErrors: await this.validateJavaScriptErrors(),
      timestamp: Date.now()
    };
    
    console.log('📊 Resumen de validaciones de backend:', summary);
    return summary;
  }
}

module.exports = BackendValidator;
