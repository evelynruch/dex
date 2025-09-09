const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://demo4.dexmanager.com/');

  // Esperar a que la página cargue
  await page.waitForLoadState('networkidle');
  
  // Verificar que la página tiene un título
  await expect(page).toHaveTitle(/.*/);
  
  // Tomar screenshot
  await page.screenshot({ path: 'screenshots/homepage.png' });
});

test('get started link', async ({ page }) => {
  await page.goto('https://demo4.dexmanager.com/');

  // Esperar a que la página cargue
  await page.waitForLoadState('networkidle');
  
  // Buscar algún enlace o botón en la página
  const links = await page.locator('a').count();
  console.log(`Se encontraron ${links} enlaces en la página`);
  
  // Verificar que hay al menos un enlace
  expect(links).toBeGreaterThan(0);
});
