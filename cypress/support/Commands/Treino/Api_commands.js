/// <reference types="Cypress"/>

/**
 * Comandos de API para Treinos
 * CRUD completo via requisições HTTP
 */

/**
 * Cria um treino via API
 * @param {Object} treino - Payload do treino (já adaptado)
 * @returns {Object} Resposta da API com treino criado
 */
Cypress.Commands.add('treinoApi_Create', (treino) => {
  let response;

  cy.request({
    url: `${Cypress.config().baseApiUrl}/api/treinos`,
    method: 'POST',
    body: treino,
    failOnStatusCode: false
  }).then(resp => {
    response = resp;

    if (resp.status === 201) {
      cy.log(`✅ Treino criado: ${treino.tipo} - ${treino.nome || 'Sem nome'}`);
    }
  }).then(() => {
    return response;
  });
});

/**
 * Lista treinos via API
 * @param {Object} filters - Filtros opcionais (tipo, dataInicio, etc)
 */
Cypress.Commands.add('treinoApi_List', (filters = {}) => {
  let response;

  const queryString = new URLSearchParams(filters).toString();
  const url = `${Cypress.config().baseApiUrl}/api/treinos${queryString ? '?' + queryString : ''}`;

  cy.request({
    url: url,
    method: 'GET',
    failOnStatusCode: false
  }).then(resp => {
    response = resp;
    cy.log(`📋 Listados ${resp.body.treinos?.length || 0} treinos`);
  }).then(() => {
    return response;
  });
});

/**
 * Busca treino por ID
 */
Cypress.Commands.add('treinoApi_GetById', (id) => {
  let response;

  cy.request({
    url: `${Cypress.config().baseApiUrl}/api/treinos/${id}`,
    method: 'GET',
    failOnStatusCode: false
  }).then(resp => {
    response = resp;
  }).then(() => {
    return response;
  });
});

/**
 * Atualiza treino via API
 */
Cypress.Commands.add('treinoApi_Update', (id, treino) => {
  let response;

  cy.request({
    url: `${Cypress.config().baseApiUrl}/api/treinos/${id}`,
    method: 'PUT',
    body: treino,
    failOnStatusCode: false
  }).then(resp => {
    response = resp;

    if (resp.status === 200) {
      cy.log(`🔄 Treino atualizado: ${id}`);
    }
  }).then(() => {
    return response;
  });
});

/**
 * Deleta treino via API
 */
Cypress.Commands.add('treinoApi_Delete', (id) => {
  let response;

  cy.request({
    url: `${Cypress.config().baseApiUrl}/api/treinos/${id}`,
    method: 'DELETE',
    failOnStatusCode: false
  }).then(resp => {
    response = resp;

    if (resp.status === 200) {
      cy.log(`🗑️ Treino deletado: ${id}`);
    }
  }).then(() => {
    return response;
  });
});

/**
 * Obtém estatísticas de treinos
 */
Cypress.Commands.add('treinoApi_GetStats', () => {
  let response;

  cy.request({
    url: `${Cypress.config().baseApiUrl}/api/treinos/stats`,
    method: 'GET',
    failOnStatusCode: false
  }).then(resp => {
    response = resp;
  }).then(() => {
    return response;
  });
});
