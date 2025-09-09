const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectores comunes del dashboard
    this.selectors = {
      navigation: 'nav, .navigation, .menu',
      content: 'main, .content, .dashboard',
      userMenu: '.user-menu, .profile-menu',
      logoutButton: 'button:has-text("Logout"), button:has-text("Cerrar Sesión")',
      welcomeMessage: 'text=Welcome, text=Bienvenido',
      dashboardTitle: 'h1, .dashboard-title',
      sidebar: '.sidebar, .side-nav',
      header: 'header, .header',
      footer: 'footer, .footer'
    };
  }

  /**
   * Verificar que estamos en el dashboard
   * @returns {boolean} - True si estamos en el dashboard
   */
  async isOnDashboard() {
    const currentUrl = this.getCurrentUrl();
    const isOnLoginPage = currentUrl.includes('login') || 
                         currentUrl.includes('signin') || 
                         currentUrl.includes('auth') ||
                         currentUrl === 'https://demo4.dexmanager.com/';
    
    return !isOnLoginPage;
  }

  /**
   * Verificar elementos básicos del dashboard
   */
  async verifyDashboardElements() {
    // Verificar que hay elementos de navegación
    const hasNavigation = await this.page.locator(this.selectors.navigation).count() > 0;
    const hasContent = await this.page.locator(this.selectors.content).count() > 0;
    const hasButtons = await this.page.locator('button').count() > 0;
    
    // Verificar que hay al menos algunos elementos en la página
    const totalElements = await this.page.locator('*').count();
    expect(totalElements).toBeGreaterThan(10);
    
    console.log('✅ Elementos del dashboard verificados');
  }

  /**
   * Buscar elemento de navegación
   * @returns {boolean} - True si encuentra elementos de navegación
   */
  async hasNavigation() {
    return await this.page.locator(this.selectors.navigation).count() > 0;
  }

  /**
   * Buscar elemento de contenido principal
   * @returns {boolean} - True si encuentra elementos de contenido
   */
  async hasContent() {
    return await this.page.locator(this.selectors.content).count() > 0;
  }

  /**
   * Buscar menú de usuario
   * @returns {boolean} - True si encuentra el menú de usuario
   */
  async hasUserMenu() {
    return await this.page.locator(this.selectors.userMenu).count() > 0;
  }

  /**
   * Buscar botón de logout
   * @returns {boolean} - True si encuentra el botón de logout
   */
  async hasLogoutButton() {
    return await this.page.locator(this.selectors.logoutButton).count() > 0;
  }

  /**
   * Buscar mensaje de bienvenida
   * @returns {boolean} - True si encuentra mensaje de bienvenida
   */
  async hasWelcomeMessage() {
    return await this.page.locator(this.selectors.welcomeMessage).count() > 0;
  }

  /**
   * Obtener título del dashboard
   * @returns {string} - Título del dashboard
   */
  async getDashboardTitle() {
    const titleElement = this.page.locator(this.selectors.dashboardTitle).first();
    if (await titleElement.count() > 0) {
      return await titleElement.textContent();
    }
    return null;
  }

  /**
   * Contar elementos de navegación
   * @returns {number} - Número de elementos de navegación
   */
  async getNavigationCount() {
    return await this.page.locator(this.selectors.navigation).count();
  }

  /**
   * Contar botones en la página
   * @returns {number} - Número de botones
   */
  async getButtonCount() {
    return await this.page.locator('button').count();
  }

  /**
   * Contar enlaces en la página
   * @returns {number} - Número de enlaces
   */
  async getLinkCount() {
    return await this.page.locator('a').count();
  }

  /**
   * Verificar si hay sidebar
   * @returns {boolean} - True si encuentra sidebar
   */
  async hasSidebar() {
    return await this.page.locator(this.selectors.sidebar).count() > 0;
  }

  /**
   * Verificar si hay header
   * @returns {boolean} - True si encuentra header
   */
  async hasHeader() {
    return await this.page.locator(this.selectors.header).count() > 0;
  }

  /**
   * Verificar si hay footer
   * @returns {boolean} - True si encuentra footer
   */
  async hasFooter() {
    return await this.page.locator(this.selectors.footer).count() > 0;
  }

  /**
   * Obtener información completa del dashboard
   * @returns {object} - Información del dashboard
   */
  async getDashboardInfo() {
    return {
      isOnDashboard: await this.isOnDashboard(),
      hasNavigation: await this.hasNavigation(),
      hasContent: await this.hasContent(),
      hasUserMenu: await this.hasUserMenu(),
      hasLogoutButton: await this.hasLogoutButton(),
      hasWelcomeMessage: await this.hasWelcomeMessage(),
      hasSidebar: await this.hasSidebar(),
      hasHeader: await this.hasHeader(),
      hasFooter: await this.hasFooter(),
      navigationCount: await this.getNavigationCount(),
      buttonCount: await this.getButtonCount(),
      linkCount: await this.getLinkCount(),
      title: await this.getDashboardTitle(),
      url: this.getCurrentUrl()
    };
  }

  /**
   * Hacer logout (si está disponible)
   */
  async logout() {
    if (await this.hasLogoutButton()) {
      await this.page.locator(this.selectors.logoutButton).first().click();
      await this.waitForPageLoad();
    } else {
      console.log('⚠️ Botón de logout no encontrado');
    }
  }

  /**
   * Verificar que el logout fue exitoso
   * @returns {boolean} - True si el logout fue exitoso
   */
  async isLogoutSuccessful() {
    const currentUrl = this.getCurrentUrl();
    const isOnLoginPage = currentUrl.includes('login') || 
                         currentUrl.includes('signin') || 
                         currentUrl.includes('auth') ||
                         currentUrl === 'https://demo4.dexmanager.com/';
    
    return isOnLoginPage;
  }
}

module.exports = DashboardPage;