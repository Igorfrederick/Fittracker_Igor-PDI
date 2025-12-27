/// <reference types="cypress" />

import { makeAFakeTreino } from '../../support/Library/TreinoLib';

describe('Treinos - CREATE', { tags: ['@treinos', '@create', '@high'] }, () => {

  context('Criação de Treinos - Cenários Positivos', () => {

    it('Deve criar um treino com dados completos', { tags: '@smoke' }, () => {
      // Arrange: Prepara os dados
      const fakeTreino = makeAFakeTreino({
        tipo: 'A',
        nome: 'Treino de Peito e Tríceps',
        duracao: 60
      });
      const payload = fakeTreino.adapterToPOST();

      // Act: Executa a criação
      cy.treinoApi_Create(payload).then(response => {
        // Assert: Valida o resultado
        cy.treinoAssert_WasCreated(response, payload);

        const treino = response.body.dados;
        expect(treino).to.have.property('_id');
        expect(treino.tipo).to.eq('A');
        expect(treino.nome).to.eq('Treino de Peito e Tríceps');
        expect(treino.duracao).to.eq(60);
      });
    });

    it('Deve criar um treino apenas com campos obrigatórios', { tags: '@smoke' }, () => {
      const fakeTreino = makeAFakeTreino({
        tipo: 'B'
      });
      const payload = {
        tipo: fakeTreino.tipo,
        data: fakeTreino.data
      };

      cy.treinoApi_Create(payload).then(response => {
        expect(response.status).to.eq(201);
        expect(response.body.dados.tipo).to.eq('B');
      });
    });

    it('Deve criar treino tipo PUSH', () => {
      const fakeTreino = makeAFakeTreino({
        tipo: 'PUSH',
        nome: 'Treino Push - Peito/Ombro/Tríceps'
      });
      const payload = fakeTreino.adapterToPOST();

      cy.treinoApi_Create(payload).then(response => {
        cy.treinoAssert_WasCreated(response, payload);
        expect(response.body.dados.tipo).to.eq('PUSH');
      });
    });

    it('Deve criar treino tipo PULL', () => {
      const fakeTreino = makeAFakeTreino({
        tipo: 'PULL',
        nome: 'Treino Pull - Costas/Bíceps'
      });
      const payload = fakeTreino.adapterToPOST();

      cy.treinoApi_Create(payload).then(response => {
        cy.treinoAssert_WasCreated(response, payload);
        expect(response.body.dados.tipo).to.eq('PULL');
      });
    });

    it('Deve criar treino tipo LEGS', () => {
      const fakeTreino = makeAFakeTreino({
        tipo: 'LEGS',
        nome: 'Treino de Pernas Completo'
      });
      const payload = fakeTreino.adapterToPOST();

      cy.treinoApi_Create(payload).then(response => {
        cy.treinoAssert_WasCreated(response, payload);
        expect(response.body.dados.tipo).to.eq('LEGS');
      });
    });

    it('Deve criar treino com observação', () => {
      const fakeTreino = makeAFakeTreino({
        tipo: 'C',
        observacao: 'Treino pesado, aumentar carga na próxima'
      });
      const payload = fakeTreino.adapterToPOST();

      cy.treinoApi_Create(payload).then(response => {
        expect(response.status).to.eq(201);
        expect(response.body.dados.observacao).to.eq('Treino pesado, aumentar carga na próxima');
      });
    });

    it('Deve criar treino marcado como concluído', () => {
      const fakeTreino = makeAFakeTreino({
        tipo: 'A',
        concluido: true
      });
      const payload = fakeTreino.adapterToPOST();

      cy.treinoApi_Create(payload).then(response => {
        expect(response.status).to.eq(201);
        expect(response.body.dados.concluido).to.be.true;
      });
    });
  });

  context('Criação de Treinos - Cenários Negativos', () => {

    it('Não deve criar treino sem tipo', { tags: '@negative' }, () => {
      const payload = {
        data: new Date().toISOString(),
        nome: 'Treino sem tipo'
      };

      cy.treinoApi_Create(payload).then(response => {
        expect(response.status).to.be.oneOf([400, 500]);
        expect(response.body).to.have.property('erro');
        expect(response.body.sucesso).to.be.false;
      });
    });

    it('Deve criar treino sem data (usa data padrão)', () => {
      const payload = {
        tipo: 'A',
        nome: 'Treino sem data explícita'
      };

      cy.treinoApi_Create(payload).then(response => {
        // Backend preenche automaticamente com Date.now (default)
        expect(response.status).to.eq(201);
        expect(response.body.dados).to.have.property('data');
        expect(response.body.dados.data).to.exist;
      });
    });

    it('Não deve criar treino com tipo vazio', { tags: '@negative' }, () => {
      const payload = {
        tipo: '',
        data: new Date().toISOString()
      };

      cy.treinoApi_Create(payload).then(response => {
        expect(response.status).to.be.oneOf([400, 500]);
      });
    });

    it('Não deve criar treino com duração negativa', { tags: '@negative' }, () => {
      const payload = {
        tipo: 'A',
        data: new Date().toISOString(),
        duracao: -10
      };

      cy.treinoApi_Create(payload).then(response => {
        expect(response.status).to.be.oneOf([400, 500]);
      });
    });
  });
});
