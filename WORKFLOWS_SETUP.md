# ⏰ Configuración de Workflows Programados

Este documento explica la configuración de los workflows de GitHub Actions para ejecución automática de tests.

## 📋 Workflows Configurados

### **1. Playwright Tests (Principal)**
- **Archivo**: `.github/workflows/playwright.yml`
- **Triggers**: 
  - Push a `main` o `develop`
  - Pull requests a `main`
- **Tests**: Todos los tests (55 tests)
- **Propósito**: Validación completa en desarrollo

### **2. Scheduled Tests (Programado)**
- **Archivo**: `.github/workflows/scheduled-tests.yml`
- **Triggers**:
  - **Desarrollo diario**: 9:00 AM UTC (6:00 AM Argentina) - Días laborables
  - **Monitoreo continuo**: Cada 6 horas
  - **Reportes diarios**: 6:00 PM UTC (3:00 PM Argentina) - Todos los días
  - **Ejecución manual**: `workflow_dispatch`
- **Tests**: Solo tests críticos (7 tests)
- **Propósito**: Monitoreo continuo y validación rápida

### **3. Nightly Tests (Nocturno)**
- **Archivo**: `.github/workflows/nightly-tests.yml`
- **Triggers**:
  - **Ejecución nocturna**: 2:00 AM UTC (11:00 PM Argentina) - Todos los días
  - **Ejecución manual**: `workflow_dispatch`
- **Tests**: Todos los tests (55 tests)
- **Propósito**: Validación completa nocturna

## ⏰ Horarios de Ejecución

### **Zona Horaria**: UTC-3 (Argentina)

| Workflow | Frecuencia | Hora UTC | Hora Argentina | Tests |
|----------|------------|----------|----------------|-------|
| **Principal** | Push/PR | - | - | 55 tests |
| **Programado** | Días laborables | 9:00 AM | 6:00 AM | 7 tests críticos |
| **Programado** | Cada 6 horas | 0,6,12,18 | 21,3,9,15 | 7 tests críticos |
| **Programado** | Diario | 6:00 PM | 3:00 PM | 7 tests críticos |
| **Nocturno** | Diario | 2:00 AM | 11:00 PM | 55 tests |

## 🎯 Estrategia de Testing

### **Desarrollo (Push/PR)**
- ✅ **Todos los tests** (55)
- ✅ **Todos los navegadores**
- ✅ **Validación completa**
- ✅ **Reportes detallados**

### **Monitoreo Continuo**
- ✅ **Tests críticos** (7)
- ✅ **Validación rápida**
- ✅ **Detección temprana de problemas**
- ✅ **Menor consumo de recursos**

### **Validación Nocturna**
- ✅ **Todos los tests** (55)
- ✅ **Validación completa**
- ✅ **Reportes de tendencias**
- ✅ **Análisis de regresiones**

## 📊 Tests Críticos Incluidos

Los tests críticos (`@critical`) que se ejecutan en el monitoreo continuo:

1. ✅ **Verificar elementos de la página de login**
2. ✅ **Login exitoso con credenciales válidas**
3. ✅ **Login fallido: Usuario vacío**
4. ✅ **Login fallido: Contraseña vacía**
5. ✅ **Login fallido: Credenciales incorrectas**
6. ✅ **Funcionalidad Forgot Password**
7. ✅ **Validaciones de backend durante login**

## 🚀 Comandos de Ejecución Manual

### **Ejecutar workflows manualmente:**

```bash
# En GitHub Actions, usar el botón "Run workflow"
# O usar GitHub CLI:
gh workflow run "Scheduled Playwright Tests"
gh workflow run "Nightly Full Test Suite"
```

### **Ejecutar localmente:**

```bash
# Tests críticos (como el workflow programado)
npm run test:critical

# Todos los tests (como el workflow nocturno)
npm test

# Solo Chrome (desarrollo)
npm run test:chrome
```

## 📈 Reportes y Artifacts

### **Artifacts generados:**

- **`allure-report`**: Reporte HTML de Allure
- **`playwright-report`**: Reporte estándar de Playwright
- **`test-results`**: Videos y screenshots

### **Retención de artifacts:**

- **Workflows principales**: 30 días
- **Workflows nocturnos**: 7 días
- **Workflows programados**: 30 días

## 🔧 Configuración de Secrets

Todos los workflows requieren estos secrets:

- `LOGIN_USERNAME`: Usuario para login
- `LOGIN_PASSWORD`: Contraseña para login
- `BASE_URL`: URL base del sitio

## 📱 Notificaciones

### **Configurar notificaciones:**

1. Ve a: `Settings > Notifications > Actions`
2. Configura notificaciones para:
   - Fallos en workflows
   - Ejecuciones programadas
   - Reportes diarios

## 🛠️ Troubleshooting

### **Workflow no se ejecuta:**
- Verificar que los secrets estén configurados
- Revisar la sintaxis del cron
- Verificar permisos del repositorio

### **Tests fallan en schedule:**
- Revisar logs del workflow
- Verificar conectividad del sitio
- Revisar configuración de secrets

### **Horarios incorrectos:**
- Verificar zona horaria UTC
- Ajustar cron según necesidad
- Considerar horario de verano

## 📚 Recursos Adicionales

- [GitHub Actions Cron Syntax](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)
- [Playwright CI/CD Best Practices](https://playwright.dev/docs/ci)
- [Allure Reports](https://docs.qameta.io/allure/)

## 🎉 ¡Configuración Completa!

Los workflows están configurados para:
- ✅ **Desarrollo continuo** con validación completa
- ✅ **Monitoreo automático** con tests críticos
- ✅ **Validación nocturna** con suite completa
- ✅ **Reportes detallados** con Allure
- ✅ **Ejecución manual** cuando sea necesario
