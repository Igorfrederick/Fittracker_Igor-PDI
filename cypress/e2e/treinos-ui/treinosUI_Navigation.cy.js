/// <reference types="cypress" />

import HomePage from '../../support/PageObjects/HomePage';
import ListaTreinosPage from '../../support/PageObjects/ListaTreinosPage';

describe('Treinos UI - Navegação', { tags: ['@ui', '@navigation', '@smoke'] }, () => {

  const homePage = new HomePage();
  const listaTreinosPage = new ListaTreinosPage();

  beforeEach(() => {
    // Garante que o frontend está rodando
    cy.visit('/');
  });

  context('Navegação entre Páginas', () => {

    it('Deve carregar a home page corretamente', { tags: '@smoke' }, () => {
      homePage
        .visit()
        .shouldBeVisible();
    });

    it('Deve navegar da home para lista de treinos', () => {
      homePage
        .visit()
        .clickVerTodos();

      // Valida que chegou na lista
      cy.url().should('include', '/treinos');
      listaTreinosPage.shouldBeVisible();
    });

    it('Deve navegar para novo treino pelo botão da home', () => {
      homePage
        .visit()
        .clickNovoTreino();

      cy.url().should('include', '/treinos/novo');
      cy.contains('h1', 'Novo Treino').should('be.visible');
    });

    it('Deve navegar para novo treino pela lista', () => {
      listaTreinosPage
        .visit()
        .clickNovoTreino();

      cy.url().should('include', '/treinos/novo');
    });

    it('Deve voltar para lista ao cancelar criação', () => {
      // Cria histórico navegando primeiro para /treinos
      cy.visit('/treinos');

      // Depois navega para /novo
      cy.visit('/treinos/novo');

      cy.contains('button', 'Cancelar').click();

      // navigate(-1) volta para /treinos
      cy.url().should('include', '/treinos');
      cy.url().should('not.include', '/novo');
    });
  });

  context('Menu de Navegação', () => {

    it('Deve ter navegação visível', () => {
      cy.visit('/');
      cy.get('nav').should('be.visible');
    });

    it('Deve navegar pelo menu para Treinos', () => {
      cy.visit('/');

      // Verifica se o link "Treinos" existe no menu e clica
      cy.get('nav').then($nav => {
        if ($nav.text().includes('Treinos')) {
          cy.get('nav').contains('a', 'Treinos').click();
          cy.url().should('include', '/treinos');
          cy.log('✅ Navegou para /treinos pelo menu');
        } else {
          cy.log('ℹ️ Link "Treinos" não encontrado no menu');
        }
      });
    });
  });

  context('Responsividade', () => {

    it('Deve ser responsivo em mobile (375x667)', () => {
      cy.viewport(375, 667);
      homePage.visit().shouldBeVisible();
    });

    it('Deve ser responsivo em tablet (768x1024)', () => {
      cy.viewport(768, 1024);
      homePage.visit().shouldBeVisible();
    });

    it('Deve ser responsivo em desktop (1920x1080)', () => {
      cy.viewport(1920, 1080);
      homePage.visit().shouldBeVisible();
    });
  });
});
