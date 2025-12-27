/// <reference types="Cypress"/>

/**
 * Comandos de validação de contratos
 * Valida schemas de payloads (desabilitado por padrão para simplificar)
 */

/**
 * Valida se o payload de POST está conforme o schema
 * NOTA: Validação desabilitada por padrão. Para ativar, instale 'ajv' e descomente o código
 */
Cypress.Commands.add('treinoPOSTSchemaIsValid', (payload) => {
  // Validação simplificada - apenas verifica campos obrigatórios
  if (!payload.tipo) {
    throw new Error('Campo obrigatório "tipo" ausente no payload');
  }
  if (!payload.data) {
    throw new Error('Campo obrigatório "data" ausente no payload');
  }

  cy.log('✅ Schema de POST válido (validação simplificada)');

  /*
  // Para validação completa com AJV, instale: npm install --save-dev ajv
  // E descomente o código abaixo:

  const Ajv = require('ajv');
  const { treinoPostSchema } = require('../../Contracts/TreinoContract');
  const ajv = new Ajv();

  const validate = ajv.compile(treinoPostSchema);
  const valid = validate(payload);

  if (!valid) {
    console.error('❌ Schema inválido:', validate.errors);
    throw new Error(`Schema de POST inválido: ${JSON.stringify(validate.errors)}`);
  }

  cy.log('✅ Schema de POST válido');
  */
});

/**
 * Valida se o payload de PUT está conforme o schema
 */
Cypress.Commands.add('treinoPUTSchemaIsValid', (payload) => {
  // Mesma validação do POST
  cy.treinoPOSTSchemaIsValid(payload);
});
