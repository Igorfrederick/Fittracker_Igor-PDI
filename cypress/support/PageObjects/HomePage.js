/// <reference types="Cypress"/>

/**
 * Page Object: Home Page (Dashboard)
 * Centraliza seletores e ações da página inicial
 */

class HomePage {
  // ===========================================
  // SELETORES
  // ===========================================

  elements = {
    // Page
    page: () => cy.get('[data-cy="home-page"]'),
    pageTitle: () => cy.get('[data-cy="page-title"]'),

    // Cards de estatísticas
    statsSection: () => cy.get('[data-cy="stats-section"]'),
    statTotalTreinos: () => cy.get('[data-cy="stat-total-treinos"]'),
    statSemana: () => cy.get('[data-cy="stat-semana"]'),
    statConcluidos: () => cy.get('[data-cy="stat-concluidos"]'),
    statTempoTotal: () => cy.get('[data-cy="stat-tempo-total"]'),

    // Botões de ação
    novoTreinoButton: () => cy.get('[data-cy="btn-novo-treino"]'),
    verTodosLink: () => cy.get('[data-cy="link-ver-todos"]'),

    // Seção de treinos recentes
    recentWorkoutsList: () => cy.get('[data-cy="recent-workouts-list"]'),
    workoutCards: () => cy.get('[data-cy="workout-card"]'),
    emptyState: () => cy.contains('Nenhum treino registrado'),
  };

  // ===========================================
  // AÇÕES
  // ===========================================

  /**
   * Visita a página inicial
   */
  visit() {
    cy.visit('/');
    return this;
  }

  /**
   * Clica no botão de novo treino
   */
  clickNovoTreino() {
    this.elements.novoTreinoButton().click();
    return this;
  }

  /**
   * Clica em "Ver todos os treinos"
   */
  clickVerTodos() {
    this.elements.verTodosLink().click();
    return this;
  }

  /**
   * Clica em um card de treino específico
   */
  clickTreinoCard(index = 0) {
    this.elements.workoutCards().eq(index).click();
    return this;
  }

  // ===========================================
  // VALIDAÇÕES
  // ===========================================

  /**
   * Verifica se a página carregou corretamente
   */
  shouldBeVisible() {
    this.elements.pageTitle().should('be.visible');
    return this;
  }

  /**
   * Verifica se os cards de estatísticas estão visíveis
   */
  shouldShowStats() {
    this.elements.statsSection().should('be.visible');
    this.elements.statTotalTreinos().should('be.visible');
    this.elements.statConcluidos().should('be.visible');
    this.elements.statTempoTotal().should('be.visible');
    return this;
  }

  /**
   * Verifica se há treinos recentes
   */
  shouldShowRecentWorkouts() {
    this.elements.recentWorkoutsList().should('be.visible');
    this.elements.workoutCards().should('have.length.greaterThan', 0);
    return this;
  }

  /**
   * Verifica estado vazio (sem treinos)
   */
  shouldShowEmptyState() {
    this.elements.emptyState().should('be.visible');
    return this;
  }
}

export default HomePage;
