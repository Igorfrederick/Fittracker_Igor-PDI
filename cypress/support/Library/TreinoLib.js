/// <reference types="Cypress"/>
const { faker } = require('@faker-js/faker');
const Treino = require('../Models/Treino');

/**
 * Library: Treino
 * Funções para criar objetos Treino com dados fake
 */

/**
 * Cria um treino fake completo
 * @param {Object} overrides - Sobrescreve propriedades específicas
 * @returns {Treino} Instância de Treino com dados fake
 */
function makeAFakeTreino(overrides = {}) {
  const tipos = ['A', 'B', 'C', 'PUSH', 'PULL', 'LEGS', 'UPPER', 'LOWER'];
  const tipo = overrides.tipo || faker.helpers.arrayElement(tipos);
  const data = overrides.data || faker.date.recent({ days: 30 }).toISOString();

  const treino = new Treino(tipo, data);

  // Define propriedades opcionais
  treino
    .setNome(overrides.nome || faker.lorem.words(3))
    .setDuracao(overrides.duracao || faker.number.int({ min: 30, max: 120 }))
    .setObservacao(overrides.observacao || faker.lorem.sentence())
    .marcarConcluido(overrides.concluido || false);

  // Adiciona exercícios fake se necessário
  if (overrides.exercicios) {
    overrides.exercicios.forEach(ex => treino.addExercicio(ex));
  }

  return treino;
}

/**
 * Cria um exercício fake
 */
function makeAFakeExercicio(overrides = {}) {
  const gruposMusculares = [
    'Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps',
    'Quadríceps', 'Posterior', 'Glúteos', 'Panturrilha', 'Abdômen'
  ];

  return {
    nome: overrides.nome || faker.lorem.words(2),
    grupoMuscular: overrides.grupoMuscular || faker.helpers.arrayElement(gruposMusculares),
    series: overrides.series || [
      { carga: 60, repeticoes: 12, concluida: false },
      { carga: 70, repeticoes: 10, concluida: false },
      { carga: 80, repeticoes: 8, concluida: false }
    ],
    observacao: overrides.observacao || faker.lorem.sentence()
  };
}

/**
 * Cria um array de treinos fake
 */
function makeArrayOfFakeTreinos(quantity = 5) {
  const treinos = [];
  for (let i = 0; i < quantity; i++) {
    treinos.push(makeAFakeTreino());
  }
  return treinos;
}

module.exports = {
  makeAFakeTreino,
  makeAFakeExercicio,
  makeArrayOfFakeTreinos
};
