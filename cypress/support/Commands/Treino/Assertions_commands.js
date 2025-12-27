/// <reference types="Cypress"/>

/**
 * Comandos de Assertions para Treinos
 * Validações comuns reutilizáveis
 */

/**
 * Valida que a resposta contém um treino válido
 */
Cypress.Commands.add('treinoAssert_HasValidStructure', (treino) => {
  expect(treino).to.have.property('_id');
  expect(treino).to.have.property('tipo');
  expect(treino).to.have.property('data');
  expect(treino).to.have.property('exercicios');
  expect(treino.exercicios).to.be.an('array');
});

/**
 * Valida que o treino foi criado corretamente
 */
Cypress.Commands.add('treinoAssert_WasCreated', (response, expectedData) => {
  expect(response.status).to.eq(201);
  expect(response.body).to.have.property('dados');
  expect(response.body.sucesso).to.be.true;

  const treino = response.body.dados;
  expect(treino.tipo).to.eq(expectedData.tipo);

  if (expectedData.nome) {
    expect(treino.nome).to.eq(expectedData.nome);
  }
});

/**
 * Valida que o treino foi atualizado
 */
Cypress.Commands.add('treinoAssert_WasUpdated', (response) => {
  expect(response.status).to.eq(200);
  expect(response.body).to.have.property('dados');
  expect(response.body.sucesso).to.be.true;
});

/**
 * Valida que o treino foi deletado
 */
Cypress.Commands.add('treinoAssert_WasDeleted', (response) => {
  expect(response.status).to.eq(200);
  expect(response.body).to.have.property('mensagem');
  expect(response.body.sucesso).to.be.true;
});
