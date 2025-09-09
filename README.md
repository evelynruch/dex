# Automatización de Login con Playwright

Este proyecto automatiza el proceso de login en https://demo4.dexmanager.com/ usando Playwright.

## Credenciales
- **Usuario**: challengeqa
- **Contraseña**: Abcd1234

## Estructura del Proyecto (Page Object Model - POM)

```
demo/
├── package.json              # Configuración del proyecto y dependencias
├── playwright.config.js      # Configuración de Playwright
├── pages/                    # Page Object Model - Páginas
│   ├── BasePage.js          # Clase base con métodos comunes
│   ├── LoginPage.js         # Página de login con métodos específicos
│   ├── DashboardPage.js     # Página del dashboard
│   └── index.js             # Exportaciones de páginas
├── utils/                    # Utilidades y datos de prueba
│   ├── TestData.js          # Datos de prueba centralizados
│   ├── TestHelpers.js       # Funciones helper para tests
│   ├── BackendValidator.js  # Validaciones de backend y APIs
│   └── index.js             # Exportaciones de utilidades
├── tests/                    # Directorio de tests
│   ├── login.spec.js        # Test original (legacy)
│   ├── login-pom.spec.js    # Test con Page Object Model
│   ├── login-pom-optimized.spec.js # Test POM optimizado con backend
│   ├── backend-validation.spec.js  # Tests específicos de backend
│   └── example.spec.js      # Test de ejemplo
├── screenshots/             # Directorio para capturas de pantalla
└── README.md               # Este archivo
```

## Instalación

1. **Instalar dependencias de Node.js**:
   ```bash
   npm install
   ```

2. **Instalar navegadores de Playwright**:
   ```bash
   npm run install
   ```

## Ejecución de Tests

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests con interfaz visual
```bash
npm run test:headed
```

### Ejecutar tests con UI de Playwright
```bash
npm run test:ui
```

### Ejecutar solo el test de login (POM)
```bash
npx playwright test tests/login-pom.spec.js
```

### Ejecutar test de login original (legacy)
```bash
npx playwright test tests/login.spec.js
```

### Ejecutar test de login con interfaz visual
```bash
npx playwright test tests/login-pom.spec.js --headed
```

### Ejecutar test optimizado con validaciones de backend
```bash
npx playwright test tests/login-pom-optimized.spec.js
```

### Ejecutar tests específicos de backend
```bash
npx playwright test tests/backend-validation.spec.js
```

## Page Object Model (POM)

### Ventajas del POM:
- **Mantenibilidad**: Cambios en la UI solo requieren actualizar las páginas
- **Reutilización**: Métodos de página pueden ser reutilizados en múltiples tests
- **Legibilidad**: Tests más limpios y fáciles de entender
- **Escalabilidad**: Fácil agregar nuevas páginas y funcionalidades
- **Separación de responsabilidades**: Lógica de página separada de lógica de test

### Estructura POM:

#### **BasePage.js**
- Métodos comunes para todas las páginas
- Manejo de errores del servidor
- Screenshots automáticos
- Navegación y esperas

#### **LoginPage.js**
- Métodos específicos de la página de login
- Verificación de elementos
- Acciones de login (llenar campos, hacer clic)
- Validaciones de login exitoso/fallido

#### **DashboardPage.js**
- Métodos específicos del dashboard
- Verificación de elementos del dashboard
- Información del dashboard
- Funcionalidades de logout

#### **TestData.js**
- Datos de prueba centralizados
- Credenciales válidas/inválidas
- Selectores y URLs
- Timeouts y configuraciones

#### **TestHelpers.js**
- Funciones helper para reducir duplicación
- Manejo de errores centralizado
- Tests de validación parametrizados
- Flujos de testing reutilizables

#### **BackendValidator.js**
- Validaciones de backend y APIs
- Interceptación de requests/responses HTTP
- Verificación de headers de seguridad
- Validación de cookies de sesión
- Tests de performance y tiempo de respuesta
- Validación de errores de JavaScript
- Verificación de autenticación JWT

## Características del Test de Login (POM)

El test `login-pom.spec.js` incluye:

- **Arquitectura POM**: Separación clara entre páginas y tests
- **Datos centralizados**: Todos los datos de prueba en un solo lugar
- **Métodos reutilizables**: Funciones de página que se pueden usar en múltiples tests
- **Manejo robusto de errores**: Detección automática de errores 401 y del servidor
- **Capturas de pantalla automáticas**: Screenshots en cada paso importante
- **Logs detallados**: Información completa sobre el proceso de testing

## Validaciones de Backend

### **BackendValidator.js - Características:**

#### **🔍 Interceptación de Requests/Responses**
- Captura automática de requests HTTP
- Monitoreo de responses del servidor
- Validación de endpoints de login
- Análisis de códigos de estado HTTP

#### **🔒 Validaciones de Seguridad**
- Verificación de headers de seguridad (X-Frame-Options, CSP, etc.)
- Validación de cookies de sesión
- Verificación de autenticación JWT
- Análisis de tokens de acceso

#### **⏱️ Tests de Performance**
- Medición de tiempo de respuesta
- Validación de límites de tiempo
- Análisis de requests lentos
- Monitoreo de performance general

#### **🐛 Validaciones de JavaScript**
- Detección de errores de JavaScript
- Monitoreo de errores de consola
- Validación de errores críticos
- Análisis de stack traces

#### **📋 Validaciones de Estructura**
- Verificación de estructura JSON
- Validación de esquemas de respuesta
- Análisis de campos requeridos
- Verificación de tipos de datos

### **Tests de Backend Disponibles:**

1. **Validación de requests HTTP** - Verifica que se realizan los requests correctos
2. **Validación de headers de seguridad** - Verifica headers de seguridad
3. **Validación de cookies de sesión** - Analiza cookies de autenticación
4. **Validación de tiempo de respuesta** - Mide performance del servidor
5. **Validación de errores JavaScript** - Detecta errores del frontend
6. **Validación de autenticación JWT** - Verifica tokens de autenticación
7. **Validación de estructura JSON** - Verifica respuestas de API
8. **Validación completa de backend** - Ejecuta todas las validaciones

## Screenshots

El test genera automáticamente capturas de pantalla en el directorio `screenshots/`:
- `login-page.png`: Página inicial de login
- `before-login.png`: Formulario lleno antes de enviar
- `after-login.png`: Página después del login
- `dashboard.png`: Página principal después del login exitoso

## Configuración

El archivo `playwright.config.js` está configurado para:
- Ejecutar tests en múltiples navegadores (Chrome, Firefox, Safari)
- Incluir tests móviles
- Generar reportes HTML
- Tomar screenshots y videos en caso de fallo
- Configurar timeouts y reintentos

## Solución de Problemas

### Si el test falla:
1. Verifica que la URL https://demo4.dexmanager.com/ esté accesible
2. Revisa las capturas de pantalla en el directorio `screenshots/`
3. Verifica que las credenciales sean correctas
4. Ejecuta el test con `--headed` para ver el proceso visualmente

## Reportes

Después de ejecutar los tests, se genera un reporte HTML en el directorio `playwright-report/`. Puedes abrirlo en tu navegador para ver los resultados detallados.

## Navegadores Soportados

- Chrome/Chromium
- Firefox
- Safari/WebKit
- Chrome Mobile
- Safari Mobile

## Comandos Útiles

```bash
# Ver todos los tests disponibles
npx playwright test --list

# Ejecutar tests en modo debug
npx playwright test --debug

# Generar código de test interactivo
npx playwright codegen https://demo4.dexmanager.com/

# Abrir el inspector de Playwright
npx playwright show-trace trace.zip
```
