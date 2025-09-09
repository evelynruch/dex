/**
 * Archivo de índice para exportar todas las páginas
 * Facilita la importación de páginas en los tests
 */

const BasePage = require('./BasePage');
const LoginPage = require('./LoginPage');
const DashboardPage = require('./DashboardPage');

module.exports = {
  BasePage,
  LoginPage,
  DashboardPage
};
