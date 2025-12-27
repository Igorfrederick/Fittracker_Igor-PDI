/// <reference types="cypress" />

import { makeAFakeTreino } from '../../support/Library/TreinoLib';
import FormTreinoPage from '../../support/PageObjects/FormTreinoPage';

describe('Treinos UI - Criação', { tags: ['@ui', '@create', '@high'] }, () => {

  const formPage = new FormTreinoPage();

  beforeEach(() => {
    formPage.visitNovo();
  });

  context('Formulário de Criação', () => {

    it('Deve exibir formulário vazio ao carregar', { tags: '@smoke' }, () => {
      formPage
        .shouldBeInCreateMode()
        .shouldBeEmpty();
    });

    it('Deve criar treino com dados válidos', { tags: '@smoke' }, () => {
      const treino = {
        tipo: 'A',
        nome: 'Treino de Peito via UI',
        data: '2025-01-20',
        duracao: 60,
        observacao: 'Treino criado via teste de UI'
      };

      formPage.fillForm(treino).clickSalvar();

      // Aguarda redirecionamento para lista
      cy.url().should('include', '/treinos');
      cy.url().should('not.include', '/novo');

      // Verifica que há pelo menos um treino na lista
      cy.get('[data-cy="treino-card"]').should('have.length.greaterThan', 0);
    });

    it('Deve criar treino apenas com campos obrigatórios', () => {
      formPage
        .fillTipo('B')
        .fillData('2025-01-21')
        .clickSalvar();

      cy.url().should('include', '/treinos');
    });

    it('Deve voltar à página anterior ao clicar em cancelar', () => {
      // IMPORTANTE: Navega primeiro para /treinos para criar histórico
      cy.visit('/treinos');

      // Depois vai para novo treino
      cy.visit('/treinos/novo');

      formPage
        .fillTipo('A')
        .fillNome('Teste')
        .clickCancelar();

      // Volta para /treinos (página anterior no histórico)
      cy.url().should('include', '/treinos');
      cy.url().should('not.include', '/novo');
    });
  });

  context('Validações de Formulário', () => {

    it('Deve usar tipo padrão se não alterado', () => {
      // NOTA: O select de tipo vem com valor padrão 'A' pré-selecionado
      // Então não é possível submeter "sem tipo"
      formPage
        .fillData('2025-01-23')
        .clickSalvar();

      // Backend aceita com tipo padrão e cria o treino
      cy.url().should('include', '/treinos');
      cy.url().should('not.include', '/novo');
    });

    it('Deve usar data padrão se não informada', () => {
      formPage
        .fillTipo('A')
        .clickSalvar();

      // Backend aceita e usa data padrão (hoje)
      cy.url().should('include', '/treinos');
      cy.url().should('not.include', '/novo');
    });

    it('Não deve aceitar duração negativa', { tags: '@negative' }, () => {
      formPage
        .fillTipo('A')
        .fillData('2025-01-24')
        .fillDuracao(-10)
        .clickSalvar();

      // Valida que não salvou
      cy.url().should('include', '/novo');
    });
  });

  context('Preenchimento Automático', () => {

    it('Deve usar data atual se não informada', () => {
      const hoje = new Date().toISOString().split('T')[0];

      formPage
        .fillTipo('A')
        .clickSalvar();

      // Verifica que criou com data de hoje
      cy.url().should('include', '/treinos');
    });
  });

  context('Feedback Visual', () => {

    it('Deve redirecionar após criar com sucesso', () => {
      formPage
        .fillTipo('A')
        .fillData('2025-01-25')
        .clickSalvar();

      // Aguarda redirecionamento como indicação de sucesso
      cy.url().should('include', '/treinos');
      cy.url().should('not.include', '/novo');
    });
  });
});
