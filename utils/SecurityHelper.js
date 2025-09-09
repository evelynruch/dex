/**
 * Helper para enmascarar datos sensibles en reportes
 */
class SecurityHelper {
  /**
   * Enmascarar credenciales en strings
   * @param {string} text - Texto que puede contener credenciales
   * @returns {string} - Texto con credenciales enmascaradas
   */
  static maskCredentials(text) {
    if (!text || typeof text !== 'string') return text;
    
    // Lista de credenciales conocidas a enmascarar
    const credentials = [
      'challengeqa',
      'Abcd1234',
      // Agregar más credenciales si es necesario
    ];
    
    let maskedText = text;
    
    credentials.forEach(credential => {
      const regex = new RegExp(credential, 'gi');
      maskedText = maskedText.replace(regex, '***MASKED***');
    });
    
    return maskedText;
  }
  
  /**
   * Enmascarar datos sensibles en objetos
   * @param {Object} obj - Objeto que puede contener datos sensibles
   * @returns {Object} - Objeto con datos sensibles enmascarados
   */
  static maskSensitiveData(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sensitiveKeys = ['username', 'password', 'token', 'key', 'secret'];
    const masked = { ...obj };
    
    Object.keys(masked).forEach(key => {
      if (sensitiveKeys.some(sensitiveKey => 
        key.toLowerCase().includes(sensitiveKey.toLowerCase())
      )) {
        masked[key] = '***MASKED***';
      }
    });
    
    return masked;
  }
  
  /**
   * Crear descripción segura para steps
   * @param {string} action - Acción que se está realizando
   * @param {string} field - Campo que se está llenando
   * @returns {string} - Descripción segura
   */
  static createSafeStepDescription(action, field) {
    const safeDescriptions = {
      'username': 'user field',
      'password': 'password field',
      'login': 'login process',
      'credentials': 'authentication data'
    };
    
    const safeField = safeDescriptions[field.toLowerCase()] || field;
    return `${action} ${safeField}`;
  }
}

module.exports = SecurityHelper;
