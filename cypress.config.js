const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Frontend
    setupNodeEvents(on, config) {
      // Plugin para cypress-grep (tags) - opcional
      try {
        require('@cypress/grep/src/plugin')(config);
      } catch (e) {
        console.log('cypress-grep plugin não carregado');
      }
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    // watchForFileChanges: false, // Descomente se não quiser auto-reload
  },
  env: {
    language: 'pt-br', // Para traduções futuras
  },
  // Configurações de API
  baseApiUrl: 'http://localhost:3000',
});