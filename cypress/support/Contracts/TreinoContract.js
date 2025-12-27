/// <reference types="Cypress"/>

/**
 * Contract: Treino
 * Define schemas de validação para payloads de Treino
 */

/**
 * Schema para criação de treino (POST)
 */
const treinoPostSchema = {
  type: 'object',
  required: ['tipo', 'data'],
  properties: {
    tipo: {
      type: 'string',
      minLength: 1,
      maxLength: 20
    },
    nome: {
      type: ['string', 'null'],
      maxLength: 100
    },
    data: {
      type: 'string'
    },
    duracao: {
      type: ['number', 'null'],
      minimum: 0
    },
    exercicios: {
      type: 'array',
      items: {
        type: 'object'
      }
    },
    observacao: {
      type: ['string', 'null'],
      maxLength: 1000
    },
    concluido: {
      type: 'boolean'
    }
  }
};

/**
 * Schema para atualização de treino (PUT)
 * Neste caso, mesma estrutura do POST
 */
const treinoPutSchema = treinoPostSchema;

module.exports = {
  treinoPostSchema,
  treinoPutSchema
};
