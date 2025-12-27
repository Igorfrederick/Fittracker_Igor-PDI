/// <reference types="Cypress"/>

/**
 * Adapter: Treino
 * Converte objetos Treino para formatos de API (POST/PUT)
 */
class TreinoAdapter {
  /**
   * Converte Treino para payload de criação (POST)
   * @param {Treino} treino - Instância de Treino
   * @param {Boolean} validateContract - Se deve validar o schema
   * @returns {Object} Payload para POST
   */
  static adapterToPOST(treino, validateContract = false) {
    const Treino = require('../Models/Treino');

    // Validação de tipo
    if (!(treino instanceof Treino)) {
      throw new Error('Instance of Treino is not correct!');
    }

    const payload = {
      tipo: treino.tipo,
      data: treino.data,
      exercicios: treino.exercicios || []
    };

    // Adiciona campos opcionais se existirem
    if (treino.nome) payload.nome = treino.nome;
    if (treino.duracao !== null && treino.duracao !== undefined) {
      payload.duracao = treino.duracao;
    }
    if (treino.observacao) payload.observacao = treino.observacao;
    if (treino.concluido !== undefined) payload.concluido = treino.concluido;

    // Validação de contrato (opcional)
    if (validateContract) {
      cy.treinoPOSTSchemaIsValid(payload);
    }

    return payload;
  }

  /**
   * Converte Treino para payload de atualização (PUT)
   */
  static adapterToPUT(treino, validateContract = false) {
    // PUT tem mesma estrutura que POST neste caso
    return this.adapterToPOST(treino, validateContract);
  }
}

module.exports = TreinoAdapter;
