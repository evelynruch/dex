# 📊 Configuración de Allure Reports

Este documento explica cómo configurar y usar Allure para generar reportes detallados de las pruebas automatizadas.

## 🚀 Instalación Completada

Las dependencias de Allure ya están instaladas:
- `allure-playwright`: Integración con Playwright
- `allure-commandline`: Herramientas de línea de comandos

## 📋 Comandos Disponibles

### Ejecutar tests y generar reporte Allure:
```bash
npm run test:allure
```
Este comando:
1. Ejecuta todos los tests
2. Genera el reporte Allure
3. Abre automáticamente el reporte en el navegador

### Comandos individuales:
```bash
# Solo generar reporte (después de ejecutar tests)
npm run allure:generate

# Abrir reporte existente
npm run allure:open

# Servir reporte en modo desarrollo
npm run allure:serve
```

## 🎯 Características de Allure

### Reportes Generados:
- **Dashboard**: Vista general de todos los tests
- **Suites**: Agrupación por funcionalidades
- **Graphs**: Gráficos de tendencias y estadísticas
- **Timeline**: Cronología de ejecución
- **Behaviors**: Agrupación por comportamiento (BDD)
- **Packages**: Agrupación por paquetes/modulos

### Anotaciones Implementadas:
- `@allure.epic`: Agrupación de alto nivel
- `@allure.feature`: Funcionalidades específicas
- `@allure.story`: Historias de usuario
- `@allure.severity`: Nivel de criticidad
- `@allure.step`: Pasos detallados
- `@allure.attachment`: Archivos adjuntos

## 📁 Estructura de Archivos

```
demo/
├── allure-results/          # Resultados de tests (generado)
├── allure-report/           # Reporte HTML (generado)
├── allure.config.js         # Configuración de Allure
└── ALLURE_SETUP.md         # Este archivo
```

## 🔧 Configuración

### playwright.config.js:
```javascript
reporter: [
  ['html'],
  ['allure-playwright', { 
    outputFolder: 'allure-results',
    detail: true,
    suiteTitle: false 
  }]
]
```

### allure.config.js:
- Configuración de categorías de fallos
- Enlaces a issues y TMS
- Personalización de reportes

## 📊 Ejemplo de Uso

### En los tests:
```javascript
const { allure } = require('allure-playwright');

test('Login exitoso', async ({ page }) => {
  await allure.epic('Login Automation');
  await allure.feature('Successful Login');
  await allure.story('Valid Credentials Login');
  await allure.severity('critical');
  
  // ... código del test
});
```

## 🚀 GitHub Actions

El workflow de GitHub Actions incluye:
- Generación automática de reportes Allure
- Subida de artifacts con reportes
- Disponibilidad de reportes por 30 días

### Artifacts generados:
- `allure-report`: Reporte HTML completo
- `playwright-report`: Reporte estándar de Playwright
- `test-results`: Videos y screenshots

## 📈 Ventajas de Allure

1. **Reportes Visuales**: Interfaz web moderna y atractiva
2. **Agrupación Inteligente**: Organización por epics, features, stories
3. **Tendencias**: Gráficos de evolución de tests
4. **Detalles Granulares**: Pasos, attachments, logs
5. **Integración CI/CD**: Compatible con GitHub Actions
6. **Histórico**: Comparación entre ejecuciones
7. **Filtros Avanzados**: Búsqueda y filtrado por múltiples criterios

## 🔍 Interpretación de Reportes

### Dashboard:
- **Total**: Número total de tests
- **Passed**: Tests exitosos
- **Failed**: Tests fallidos
- **Broken**: Tests con errores
- **Skipped**: Tests omitidos

### Suites:
- Agrupación por archivos de test
- Tiempo de ejecución por suite
- Estadísticas de cada suite

### Graphs:
- **Duration**: Tiempo de ejecución
- **Status**: Distribución de resultados
- **Severity**: Distribución por criticidad

## 🛠️ Troubleshooting

### Error: "allure command not found"
```bash
npx allure --version
```

### Error: "No test results found"
Asegúrate de ejecutar los tests primero:
```bash
npx playwright test
npm run allure:generate
```

### Reporte no se abre automáticamente
```bash
npm run allure:open
```

## 📚 Recursos Adicionales

- [Documentación oficial de Allure](https://docs.qameta.io/allure/)
- [Allure Playwright Integration](https://github.com/allure-framework/allure-js/tree/master/packages/allure-playwright)
- [Ejemplos de anotaciones](https://docs.qameta.io/allure/#_allure_annotations)

## 🎉 ¡Listo para usar!

Ahora puedes ejecutar `npm run test:allure` para generar reportes profesionales con Allure.
