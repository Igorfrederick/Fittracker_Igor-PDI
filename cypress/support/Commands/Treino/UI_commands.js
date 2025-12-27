/// <reference types="Cypress"/>

/**
 * Comandos de UI para Treinos
 * Ações comuns de interface do usuário
 */

/**
 * Cria um treino via interface
 * @param {Object} treino - Dados do treino
 */
Cypress.Commands.add('treinoUI_Create', (treino) => {
  // Navega para o formulário
  cy.visit('/treinos/novo');

  // Preenche campos
  if (treino.tipo) {
    cy.get('input[name="tipo"]').clear().type(treino.tipo);
  }
  if (treino.nome) {
    cy.get('input[name="nome"]').clear().type(treino.nome);
  }
  if (treino.data) {
    cy.get('input[name="data"]').clear().type(treino.data);
  }
  if (treino.duracao) {
    cy.get('input[name="duracao"]').clear().type(treino.duracao.toString());
  }
  if (treino.observacao) {
    cy.get('textarea[name="observacao"]').clear().type(treino.observacao);
  }

  // Salva
  cy.contains('button', 'Salvar').click();
});

/**
 * Navega para a lista de treinos
 */
Cypress.Commands.add('treinoUI_GoToList', () => {
  cy.visit('/treinos');
});

/**
 * Navega para a home/dashboard
 */
Cypress.Commands.add('treinoUI_GoToHome', () => {
  cy.visit('/');
});

/**
 * Deleta um treino pela interface
 * @param {Number} index - Índice do treino na lista
 */
Cypress.Commands.add('treinoUI_Delete', (index = 0) => {
  cy.visit('/treinos');
  cy.get('[data-testid="treino-card"]').eq(index).within(() => {
    cy.contains('button', 'Excluir').click();
  });
  // Confirma no modal (se existir)
  cy.contains('button', 'Confirmar').click({ force: true });
});

/**
 * Filtra treinos por tipo
 */
Cypress.Commands.add('treinoUI_FilterByTipo', (tipo) => {
  cy.get('select[name="tipo"]').select(tipo);
});

/**
 * Busca treinos por texto
 */
Cypress.Commands.add('treinoUI_Search', (text) => {
  cy.get('input[type="search"]').clear().type(text);
});
