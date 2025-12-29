/// <reference types="Cypress"/>

/**
 * Page Object: Detalhes do Treino
 * Centraliza seletores e ações da página de detalhes/visualização do treino
 */

class DetalhesTreinoPage {
  // ===========================================
  // SELETORES
  // ===========================================

  elements = {
    // Page
    page: () => cy.get('[data-cy="detalhes-treino-page"]'),
    pageTitle: () => cy.get('h1'),
    voltarButton: () => cy.get('.page-header-voltar'),

    // Botões de ação
    editarButton: () => cy.get('[data-cy="btn-editar"]'),
    excluirButton: () => cy.get('[data-cy="btn-excluir"]'),
    concluirButton: () => cy.get('[data-cy="btn-concluir"]'),

    // Informações do treino
    tipoBadge: () => cy.get('.tipo-badge'),
    infoData: () => cy.contains('span', /\d{1,2}\s+de\s+\w+/i),
    infoDuracao: () => cy.contains('span', /\d+\s*min/i),

    // Cards de estatísticas
    statsSection: () => cy.get('.detalhes-stats'),
    exerciciosCard: () => cy.contains('.stat-card', 'Exercícios'),
    seriesCard: () => cy.contains('.stat-card', 'Séries'),
    volumeCard: () => cy.contains('.stat-card', 'Volume'),

    // Exercícios
    exerciciosList: () => cy.get('.detalhes-exercicios'),
    exercicioCard: (index) => cy.get('.detalhes-exercicio').eq(index),

    // Modal de confirmação
    modal: () => cy.get('[data-cy="modal-overlay"]'),
    modalTitulo: () => cy.get('[data-cy="modal-titulo"]'),
    modalConfirmar: () => cy.get('[data-cy="btn-confirmar"]'),
    modalCancelar: () => cy.get('[data-cy="btn-cancelar"]'),
  };

  // ===========================================
  // AÇÕES
  // ===========================================

  /**
   * Visita a página de detalhes de um treino
   */
  visit(treinoId) {
    cy.visit(`/treinos/${treinoId}`);
    return this;
  }

  /**
   * Clica no botão editar
   */
  clickEditar() {
    this.elements.editarButton().click();
    return this;
  }

  /**
   * Clica no botão excluir
   */
  clickExcluir() {
    this.elements.excluirButton().click();
    return this;
  }

  /**
   * Confirma exclusão no modal
   */
  confirmarExclusao() {
    this.elements.modalConfirmar().click();
    return this;
  }

  /**
   * Cancela exclusão no modal
   */
  cancelarExclusao() {
    this.elements.modalCancelar().click();
    return this;
  }

  /**
   * Exclui o treino (clica e confirma)
   */
  excluirTreino() {
    this.clickExcluir();
    this.confirmarExclusao();
    return this;
  }

  /**
   * Clica no botão concluir/marcar como concluído
   */
  clickConcluir() {
    this.elements.concluirButton().click();
    return this;
  }

  /**
   * Clica no botão voltar
   */
  clickVoltar() {
    this.elements.voltarButton().click();
    return this;
  }

  // ===========================================
  // VALIDAÇÕES
  // ===========================================

  /**
   * Verifica se a página carregou
   */
  shouldBeVisible() {
    this.elements.page().should('exist');
    this.elements.pageTitle().should('be.visible');
    return this;
  }

  /**
   * Verifica se o modal de confirmação está aberto
   */
  shouldShowDeleteModal() {
    this.elements.modal().should('be.visible');
    this.elements.modalTitulo().should('be.visible');
    return this;
  }

  /**
   * Verifica informações do treino
   */
  shouldShowTreinoInfo(data) {
    if (data.tipo) {
      this.elements.tipoBadge().should('contain', data.tipo);
    }
    if (data.nome) {
      this.elements.pageTitle().should('contain', data.nome);
    }
    return this;
  }

  /**
   * Verifica se o treino está marcado como concluído
   */
  shouldBeConcluido() {
    this.elements.concluirButton().should('contain', 'Concluído');
    return this;
  }

  /**
   * Verifica se há exercícios listados
   */
  shouldShowExercicios() {
    this.elements.exerciciosList().should('be.visible');
    return this;
  }
}

export default DetalhesTreinoPage;
