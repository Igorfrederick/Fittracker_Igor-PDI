/// <reference types="Cypress"/>
const Entity = require('./Entity');

/**
 * Model: Treino
 * Representa a estrutura de um treino no sistema FitTracker
 */
class Treino extends Entity {
  constructor(tipo, data) {
    super();

    // Validações básicas
    if (!tipo) throw new Error('Tipo do treino é obrigatório');
    if (!data) throw new Error('Data do treino é obrigatória');

    this.tipo = tipo.toUpperCase();
    this.nome = null;
    this.data = data;
    this.duracao = null;
    this.exercicios = [];
    this.observacao = null;
    this.concluido = false;
  }

  /**
   * Define o nome do treino
   */
  setNome(nome) {
    this.nome = nome;
    return this;
  }

  /**
   * Define a duração em minutos
   */
  setDuracao(duracao) {
    if (duracao < 0) throw new Error('Duração não pode ser negativa');
    this.duracao = duracao;
    return this;
  }

  /**
   * Adiciona um exercício ao treino
   */
  addExercicio(exercicio) {
    this.exercicios.push(exercicio);
    return this;
  }

  /**
   * Define observação
   */
  setObservacao(observacao) {
    this.observacao = observacao;
    return this;
  }

  /**
   * Marca como concluído
   */
  marcarConcluido(status = true) {
    this.concluido = status;
    return this;
  }

  /**
   * Converte para payload de POST
   */
  adapterToPOST(validateContract = true) {
    const TreinoAdapter = require('../Adapters/TreinoAdapter');
    return TreinoAdapter.adapterToPOST(this, validateContract);
  }

  /**
   * Converte para payload de PUT
   */
  adapterToPUT(validateContract = true) {
    const TreinoAdapter = require('../Adapters/TreinoAdapter');
    return TreinoAdapter.adapterToPUT(this, validateContract);
  }
}

module.exports = Treino;
