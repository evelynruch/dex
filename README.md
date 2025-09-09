# Automatización de Login con Playwright

Este proyecto automatiza el proceso de login en https://demo4.dexmanager.com/ usando Playwright.

## 🔐 Configuración de Secrets

**IMPORTANTE**: Las credenciales se manejan de forma segura usando variables de entorno.

### Para desarrollo local:
1. Copia `env.example` a `.env`
2. Configura tus credenciales en `.env`
3. Verifica con: `npm run check-secrets`

### Para GitHub Actions:
Configura los secrets en: `Settings > Secrets and variables > Actions`

Ver documentación completa en: [SECRETS_SETUP.md](SECRETS_SETUP.md)

## 🛡️ Seguridad en Reportes

**CRÍTICO**: Los reportes están configurados para enmascarar automáticamente datos sensibles.

### Características de Seguridad:
- ✅ **Enmascaramiento automático** de credenciales en reportes
- ✅ **Descripciones genéricas** en steps de Allure
- ✅ **Variables de entorno** para credenciales
- ✅ **Helper de seguridad** para datos sensibles
- ✅ **Configuración segura** de reportes

### Verificación de Seguridad:
```bash
# Verificar que no hay credenciales expuestas
npm run check-secrets

# Revisar reportes antes de compartir
npm run allure:open
```

Ver guías de seguridad en: [SECURITY_GUIDELINES.md](SECURITY_GUIDELINES.md)

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
│   ├── SecurityHelper.js    # Helper para enmascarar datos sensibles
│   └── index.js             # Exportaciones de utilidades
├── tests/                    # Directorio de tests
│   ├── login.spec.js        # Test original (legacy)
│   ├── login-pom.spec.js    # Test con Page Object Model
│   ├── login-pom-optimized.spec.js # Test POM optimizado con backend
│   ├── backend-validation.spec.js  # Tests específicos de backend
│   └── example.spec.js      # Test de ejemplo
├── scripts/                  # Scripts de utilidad
│   └── check-secrets.js     # Verificación de secrets
├── .github/workflows/        # GitHub Actions
│   └── playwright.yml       # Workflow de CI/CD
├── screenshots/             # Directorio para capturas de pantalla
├── env.example              # Ejemplo de variables de entorno
├── SECRETS_SETUP.md         # Documentación de secrets
├── SECURITY_GUIDELINES.md   # Guías de seguridad
├── WORKFLOWS_SETUP.md       # Configuración de workflows
├── FUNDAMENTOS_CONFIGURACION.md # Fundamentos técnicos
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

3. **Configurar variables de entorno**:
   ```bash
   cp env.example .env
   # Edita .env con tus credenciales
   ```

4. **Verificar configuración**:
   ```bash
   npm run check-secrets
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

### Verificar configuración de secrets
```bash
npm run check-secrets
```

### Ejecutar tests con verificación de secrets
```bash
npm run test:with-check
```

### Ejecutar tests por navegador
```bash
# Solo Chrome (todos los tests)
npm run test:chrome

# Solo Firefox (tests críticos)
npm run test:firefox

# Solo Mobile (tests críticos)
npm run test:mobile

# Solo tests críticos
npm run test:critical
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

## 🚀 GitHub Actions (CI/CD)

El proyecto incluye **3 workflows especializados** para diferentes propósitos:

### 1. Workflow Principal (`.github/workflows/playwright.yml`)
- **Triggers**: Push/PR únicamente
- **Tests**: Todos los tests (55)
- **Propósito**: Desarrollo y validación completa

### 2. Workflow Programado (`.github/workflows/scheduled-tests.yml`)
- **Horarios**: 
  - 9:00 AM UTC (6:00 AM Argentina) - Días laborables
  - Cada 6 horas - Monitoreo continuo
  - 6:00 PM UTC (3:00 PM Argentina) - Reportes diarios
- **Tests**: Solo críticos (7 tests)
- **Propósito**: Monitoreo continuo

### 3. Workflow Nocturno (`.github/workflows/nightly-tests.yml`)
- **Horario**: 2:00 AM UTC (11:00 PM Argentina) - Diario
- **Tests**: Todos los tests (55)
- **Propósito**: Validación completa nocturna

### Configuración automática:
- ✅ **Instalación de dependencias**
- ✅ **Instalación de navegadores Playwright**
- ✅ **Validación de secrets**
- ✅ **Ejecución de tests optimizada**
- ✅ **Generación de reportes Allure**
- ✅ **Subida de artifacts seguros**

### Configurar secrets en GitHub:
1. Ve a: `Settings > Secrets and variables > Actions`
2. Agrega estos secrets:
   - `LOGIN_USERNAME`
   - `LOGIN_PASSWORD`
   - `BASE_URL`

## 📊 Reportes y Artifacts

### Reportes generados:
- **HTML Report**: `playwright-report/`
- **Allure Report**: `allure-report/` (con datos enmascarados)
- **Screenshots**: `screenshots/`
- **Videos**: `test-results/`
- **Logs**: Consola de GitHub Actions

### Artifacts en GitHub:
- `allure-report` - Reporte Allure completo (seguro)
- `playwright-report` - Reporte HTML estándar
- `test-results` - Videos y screenshots de fallos
- `scheduled-allure-report` - Reportes de ejecuciones programadas
- `nightly-allure-report` - Reportes de ejecuciones nocturnas

### Características de Seguridad en Reportes:
- ✅ **Credenciales enmascaradas** automáticamente
- ✅ **Descripciones genéricas** en steps
- ✅ **Datos sensibles ocultos** en logs
- ✅ **Environment info segura** en Allure

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

## 📋 Comandos Disponibles

### Tests y Verificación:
```bash
# Verificar configuración de secrets
npm run check-secrets

# Ejecutar tests con verificación
npm run test:with-check

# Ejecutar todos los tests
npm test

# Ejecutar tests con interfaz visual
npm run test:headed

# Ejecutar tests con UI de Playwright
npm run test:ui
```

### Playwright Avanzado:
```bash
# Ver todos los tests disponibles
npx playwright test --list

# Ejecutar tests en modo debug
npx playwright test --debug

# Generar código de test interactivo
npx playwright codegen https://demo4.dexmanager.com/

# Abrir el inspector de Playwright
npx playwright show-trace trace.zip

# Ver reporte HTML
npx playwright show-report
```

### Desarrollo:
```bash
# Instalar dependencias
npm install

# Instalar navegadores Playwright
npm run install

# Configurar variables de entorno
cp env.example .env
```

## 🔗 Enlaces Útiles

- **Repositorio**: [https://github.com/evelynruch/dex](https://github.com/evelynruch/dex)
- **Configuración de Secrets**: [SECRETS_SETUP.md](SECRETS_SETUP.md)
- **Guías de Seguridad**: [SECURITY_GUIDELINES.md](SECURITY_GUIDELINES.md)
- **Configuración de Workflows**: [WORKFLOWS_SETUP.md](WORKFLOWS_SETUP.md)
- **Fundamentos Técnicos**: [FUNDAMENTOS_CONFIGURACION.md](FUNDAMENTOS_CONFIGURACION.md)
- **Análisis POM**: [ANALISIS_POM.md](ANALISIS_POM.md)
- **Configuración de Allure**: [ALLURE_SETUP.md](ALLURE_SETUP.md)
- **GitHub Actions**: `.github/workflows/`

## 🎯 Resumen de Optimizaciones

### **Reducción de Tests:**
- **Antes**: 135 tests (27 × 5 navegadores)
- **Después**: 55 tests totales
- **Mejora**: 59% menos tests, 60% menos tiempo

### **Configuración por Navegador:**
- **Chrome**: 27 tests (desarrollo completo)
- **Firefox/Safari/Mobile**: 7 tests críticos cada uno
- **Estrategia**: Cobertura completa + validación crítica

### **Workflows Especializados:**
- **Principal**: Push/PR con todos los tests
- **Programado**: Monitoreo continuo con tests críticos
- **Nocturno**: Validación completa diaria

### **Seguridad Implementada:**
- ✅ **Enmascaramiento automático** de credenciales
- ✅ **Variables de entorno** para secrets
- ✅ **Reportes seguros** sin datos sensibles
- ✅ **Helper de seguridad** para datos confidenciales
