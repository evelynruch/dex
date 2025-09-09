module.exports = {
  // Configuración de Allure
  resultsDir: 'allure-results',
  reportDir: 'allure-report',
  
  // Configuración de categorías para fallos
  categories: [
    {
      name: 'Test Failures',
      matchedStatuses: ['failed']
    },
    {
      name: 'Test Errors', 
      matchedStatuses: ['broken']
    },
    {
      name: 'Skipped Tests',
      matchedStatuses: ['skipped']
    }
  ],
  
  // Configuración de enlaces
  links: [
    {
      type: 'issue',
      urlTemplate: 'https://github.com/evelynruch/dex/issues/%s'
    },
    {
      type: 'tms',
      urlTemplate: 'https://github.com/evelynruch/dex/issues/%s'
    }
  ]
};
