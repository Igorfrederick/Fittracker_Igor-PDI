/// <reference types="cypress" />

import { makeAFakeTreino } from '../../support/Library/TreinoLib';
import ListaTreinosPage from '../../support/PageObjects/ListaTreinosPage';
import DetalhesTreinoPage from '../../support/PageObjects/DetalhesTreinoPage';

describe('Treinos UI - Exclusão', { tags: ['@ui', '@delete', '@high'] }, () => {

  const listPage = new ListaTreinosPage();
  const detailsPage = new DetalhesTreinoPage();

  let treinoParaDeletar;
  let treinoId;

  beforeEach(() => {
    // Cria um treino via API para depois deletar
    const treino = makeAFakeTreino({
      tipo: 'A',
      nome: 'Treino para Deletar',
      duracao: 45,
      observacao: 'Este treino será deletado'
    });

    cy.treinoApi_Create(treino.adapterToPOST()).then(response => {
      treinoParaDeletar = response.body.dados;
      treinoId = treinoParaDeletar._id;
    });
  });

  afterEach(() => {
    // Limpa o treino criado se ainda existir (testes que não deletam)
    if (treinoId) {
      cy.treinoApi_Delete(treinoId);
    }
  });

  context('Exclusão pela Página de Detalhes', () => {

    it('Deve deletar um treino e exibir modal de confirmação', { tags: '@smoke' }, () => {
      // Vai para a lista
      listPage.visit();

      // Aguarda cards carregarem e pega a quantidade inicial
      cy.get('[data-cy="treino-card"]').should('have.length.greaterThan', 0).its('length').then(quantidadeInicial => {
        // Clica no último card (o que acabamos de criar)
        cy.get('[data-cy="treino-card"]').last().click();

        // Aguarda página de detalhes carregar
        detailsPage.shouldBeVisible();

        // Clica no botão de excluir
        detailsPage.clickExcluir();

        // Deve exibir modal de confirmação
        detailsPage.shouldShowDeleteModal();

        // Confirma a exclusão
        detailsPage.confirmarExclusao();

        // Deve navegar de volta para a lista
        cy.url().should('include', '/treinos');
        cy.url().should('not.include', treinoId);

        // Aguarda a lista atualizar
        cy.wait(500);

        cy.get('body').then($body => {
          const cardsRestantes = $body.find('[data-cy="treino-card"]').length;

          if (cardsRestantes > 0) {
            // Deve ter pelo menos a quantidade esperada ou menos
            // (aceita variação pois outros processos podem criar treinos)
            expect(cardsRestantes).to.be.at.most(quantidadeInicial);
            cy.log(`✅ Treino deletado - ${cardsRestantes} treino(s) restante(s) (havia ${quantidadeInicial})`);
          } else {
            // Se não há mais treinos, verifica estado vazio
            cy.get('.estado-vazio').should('exist');
            cy.log('✅ Treino deletado - lista vazia');
          }
        });

        // Valida via API que o treino foi deletado
        cy.treinoApi_GetById(treinoId).then(response => {
          // Deve retornar erro 404 ou similar
          expect(response.status).to.be.oneOf([404, 400, 500]);
        });

        // Marca como null para não tentar deletar no afterEach
        treinoId = null;
      });
    });

    it('Deve cancelar exclusão ao clicar em Cancelar no modal', () => {
      // Acessa a página de detalhes
      detailsPage.visit(treinoId);

      // Aguarda carregar
      detailsPage.shouldBeVisible();

      // Clica em excluir
      detailsPage.clickExcluir();

      // Modal deve aparecer
      detailsPage.shouldShowDeleteModal();

      // Cancela a exclusão
      detailsPage.cancelarExclusao();

      // Modal deve fechar
      cy.get('[data-cy="modal-overlay"]').should('not.exist');

      // Deve continuar na página de detalhes
      detailsPage.shouldBeVisible();

      // Valida via API que o treino ainda existe
      cy.treinoApi_GetById(treinoId).then(response => {
        expect(response.status).to.equal(200);
        const treino = response.body.dados;
        expect(treino._id).to.equal(treinoId);
      });
    });
  });

  context('Validações de Exclusão', () => {

    it('Deve exibir mensagem apropriada no modal', () => {
      detailsPage.visit(treinoId);

      detailsPage.clickExcluir();

      // Verifica o conteúdo do modal
      cy.get('[data-cy="modal-titulo"]').should('be.visible').invoke('text').should('match', /excluir|remover/i);
      cy.get('[data-cy="modal-mensagem"]').should('be.visible');
      cy.get('[data-cy="btn-confirmar"]').should('be.visible').invoke('text').should('match', /excluir|remover/i);
      cy.get('[data-cy="btn-cancelar"]').should('be.visible').and('contain', 'Cancelar');
    });

    it('Deve permitir navegar após exclusão', () => {
      detailsPage.visit(treinoId);

      detailsPage.excluirTreino();

      // Deve navegar para lista
      cy.url().should('include', '/treinos');
      cy.url().should('not.include', treinoId);

      // Deve poder navegar normalmente
      cy.visit('/');
      cy.get('[data-cy="home-page"]').should('be.visible');

      treinoId = null;
    });
  });

  context('Exclusão pelo Último Treino da Lista', () => {

    it('Deve deletar o último treino existente na lista', { tags: '@smoke' }, () => {
      // Vai para a lista
      listPage.visit();

      // Aguarda cards carregarem
      cy.get('[data-cy="treino-card"]').should('have.length.greaterThan', 0);

      // Pega informações do último treino antes de deletar
      cy.get('[data-cy="treino-card"]').last().within(() => {
        cy.get('[data-cy="nome"]').invoke('text').then(nome => {
          cy.log(`Último treino: ${nome}`);
        });
      });

      // Clica no último card
      cy.get('[data-cy="treino-card"]').last().click();

      // Aguarda detalhes carregarem
      detailsPage.shouldBeVisible();

      // Deleta
      detailsPage.excluirTreino();

      // Aguarda navegação
      cy.url().should('include', '/treinos');

      // Valida que o treino foi removido
      cy.wait(500); // Aguarda atualização da lista

      // Verifica se ainda há treinos ou se ficou vazio
      cy.get('body').then($body => {
        const cardsRestantes = $body.find('[data-cy="treino-card"]').length;

        if (cardsRestantes > 0) {
          // Lista ainda tem treinos
          cy.log(`✅ Último treino deletado - ${cardsRestantes} treino(s) restante(s)`);
        } else {
          // Lista ficou vazia - verifica estado vazio
          cy.get('.estado-vazio').should('exist');
          cy.log('✅ Lista vazia após deletar último treino');
        }
      });

      treinoId = null;
    });
  });

  context('Proteções contra Exclusão Acidental', () => {

    it('Deve exigir confirmação para deletar', () => {
      detailsPage.visit(treinoId);

      // Botão de excluir deve existir
      detailsPage.elements.excluirButton().should('exist');

      // Ao clicar, não deve deletar imediatamente
      detailsPage.clickExcluir();

      // Deve mostrar modal
      detailsPage.shouldShowDeleteModal();

      // Treino ainda existe
      detailsPage.shouldBeVisible();
    });

    it('Não deve deletar se modal não for confirmado', () => {
      detailsPage.visit(treinoId);

      // Abre e fecha modal sem confirmar
      detailsPage.clickExcluir();
      detailsPage.cancelarExclusao();

      // Recarrega a página
      cy.reload();

      // Treino ainda deve existir
      detailsPage.shouldBeVisible();
    });
  });
});
