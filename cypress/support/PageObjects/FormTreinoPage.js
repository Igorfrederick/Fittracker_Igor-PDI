/// <reference types="Cypress"/>

/**
 * Page Object: Formulário de Treino
 * Centraliza seletores e ações do formulário de criação/edição
 */

class FormTreinoPage {
  // ===========================================
  // SELETORES
  // ===========================================

  elements = {
    // Page
    page: () => cy.get('[data-cy="form-treino-page"]'),
    pageTitle: () => cy.get('h1'),
    form: () => cy.get('[data-cy="form-treino"]'),

    // Campos do formulário
    tipoInput: () => cy.get('[data-cy="input-tipo"]'),
    nomeInput: () => cy.get('[data-cy="input-nome"]'),
    dataInput: () => cy.get('[data-cy="input-data"]'),
    duracaoInput: () => cy.get('[data-cy="input-duracao"]'),
    observacaoTextarea: () => cy.get('[data-cy="input-observacao"]'),

    // Exercícios
    adicionarExercicioButton: () => cy.get('[data-cy="btn-adicionar-exercicio"]'),
    primeiroExercicioButton: () => cy.get('[data-cy="btn-primeiro-exercicio"]'),
    exerciciosLista: () => cy.get('[data-cy="exercicios-lista"]'),

    // Botões de ação
    salvarButton: () => cy.get('[data-cy="btn-salvar"]'),
    cancelarButton: () => cy.get('[data-cy="btn-cancelar"]'),

    // Mensagens
    formErro: () => cy.get('[data-cy="form-erro"]'),
    successMessage: () => cy.contains(/sucesso|criado/i),
    errorMessage: () => cy.get('[data-cy="form-erro"]'),
  };

  // ===========================================
  // AÇÕES
  // ===========================================

  /**
   * Visita a página de novo treino
   */
  visitNovo() {
    cy.visit('/treinos/novo');
    return this;
  }

  /**
   * Visita a página de edição
   */
  visitEdit(treinoId) {
    cy.visit(`/treinos/${treinoId}/editar`);
    return this;
  }

  /**
   * Preenche o campo tipo (select)
   */
  fillTipo(tipo) {
    this.elements.tipoInput().select(tipo);
    return this;
  }

  /**
   * Preenche o campo nome
   */
  fillNome(nome) {
    this.elements.nomeInput().clear().type(nome);
    return this;
  }

  /**
   * Preenche o campo data
   */
  fillData(data) {
    this.elements.dataInput().clear().type(data);
    return this;
  }

  /**
   * Preenche o campo duração
   */
  fillDuracao(duracao) {
    this.elements.duracaoInput().clear().type(duracao.toString());
    return this;
  }

  /**
   * Preenche o campo observação
   */
  fillObservacao(observacao) {
    this.elements.observacaoTextarea().clear().type(observacao);
    return this;
  }

  /**
   * Preenche o formulário completo
   */
  fillForm(treino) {
    if (treino.tipo) this.fillTipo(treino.tipo);
    if (treino.nome) this.fillNome(treino.nome);
    if (treino.data) this.fillData(treino.data);
    if (treino.duracao) this.fillDuracao(treino.duracao);
    if (treino.observacao) this.fillObservacao(treino.observacao);
    return this;
  }

  /**
   * Clica no botão salvar
   */
  clickSalvar() {
    this.elements.salvarButton().click();
    return this;
  }

  /**
   * Clica no botão cancelar
   */
  clickCancelar() {
    this.elements.cancelarButton().click();
    return this;
  }

  /**
   * Submete o formulário (preenche e salva)
   */
  submit(treino) {
    this.fillForm(treino);
    this.clickSalvar();
    return this;
  }

  // ===========================================
  // VALIDAÇÕES
  // ===========================================

  /**
   * Verifica se está na página de criação
   */
  shouldBeInCreateMode() {
    this.elements.pageTitle().should('contain', 'Novo Treino');
    return this;
  }

  /**
   * Verifica se está na página de edição
   */
  shouldBeInEditMode() {
    this.elements.pageTitle().should('contain', 'Editar Treino');
    return this;
  }

  /**
   * Verifica mensagem de sucesso
   */
  shouldShowSuccessMessage() {
    this.elements.successMessage().should('be.visible');
    return this;
  }

  /**
   * Verifica erro em campo específico
   */
  shouldShowFieldError(fieldName) {
    this.elements.fieldError(fieldName).should('be.visible');
    return this;
  }

  /**
   * Verifica se o formulário foi limpo
   */
  shouldBeEmpty() {
    // Tipo terá valor padrão 'A', então checamos apenas nome
    this.elements.nomeInput().should('have.value', '');
    return this;
  }

  /**
   * Verifica se o formulário está preenchido
   */
  shouldHaveValues(treino) {
    if (treino.tipo) {
      this.elements.tipoInput().should('have.value', treino.tipo);
    }
    if (treino.nome) {
      this.elements.nomeInput().should('have.value', treino.nome);
    }
    return this;
  }

  /**
   * Verifica mensagem de erro
   */
  shouldShowError() {
    this.elements.formErro().should('be.visible');
    return this;
  }
}

export default FormTreinoPage;
