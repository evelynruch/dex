// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Ejecutar tests en paralelo */
  fullyParallel: true,
  /* Fallar el build en CI si accidentalmente dejaste test.only en el código fuente */
  forbidOnly: !!process.env.CI,
  /* Reintentar en CI solo en caso de fallo */
  retries: process.env.CI ? 2 : 0,
  /* Optar por no ejecutar tests en paralelo en CI */
  workers: process.env.CI ? 1 : undefined,
  /* Configuración de reportes */
  reporter: 'html',
  /* Configuración global compartida para todos los proyectos */
  use: {
    /* URL base para usar en acciones como `await page.goto('/')` */
    baseURL: 'https://demo4.dexmanager.com',
    
    /* Recopilar trace cuando se repite en caso de fallo */
    trace: 'on-first-retry',
    
    /* Tomar screenshot en caso de fallo */
    screenshot: 'only-on-failure',
    
    /* Grabar video en caso de fallo */
    video: 'retain-on-failure',
  },

  /* Configurar proyectos para los principales navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test contra navegadores móviles */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Ejecutar el servidor de desarrollo local antes de iniciar los tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
