/// <reference types="cypress" />

// Importa todos os comandos
import './commands';

// Plugin cypress-grep
import '@cypress/grep';

// Configurações globais
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retorna false para evitar que erros não capturados quebrem os testes
  return false;
});
