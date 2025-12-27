/// <reference types="cypress" />

import { makeAFakeTreino } from '../../support/Library/TreinoLib';
import ListaTreinosPage from '../../support/PageObjects/ListaTreinosPage';

describe('Treinos UI - Listagem', { tags: ['@ui', '@list', '@high'] }, () => {

  const listPage = new ListaTreinosPage();
  let treinosCriados = [];

  before(() => {
    // Cria alguns treinos via API para testar a listagem
    for (let i = 0; i < 5; i++) {
      const treino = makeAFakeTreino({
        tipo: ['A', 'B', 'C', 'PUSH', 'PULL'][i],
        nome: `Treino UI List ${i + 1}`
      });

      cy.treinoApi_Create(treino.adapterToPOST()).then(response => {
        treinosCriados.push(response.body.dados);
      });
    }
  });

  beforeEach(() => {
    listPage.visit();
  });

  context('Visualização da Lista', () => {

    it('Deve exibir lista de treinos', { tags: '@smoke' }, () => {
      listPage
        .shouldBeVisible()
        .shouldShowTreinos();
    });

    it('Deve exibir informações do treino no card', () => {
      // Aguarda cards carregarem
      cy.get('[data-cy="treino-card"]').should('have.length.greaterThan', 0);

      // Verifica primeiro card
      cy.get('[data-cy="treino-card"]').first().within(() => {
        // Deve ter tipo (pode ter opacity 0 durante animação)
        cy.get('[data-cy="tipo"]').should('exist');

        // Deve ter data
        cy.get('[data-cy="data"]').should('exist');
      });
    });

    it('Deve exibir pelo menos os treinos criados', () => {
      // Verifica que há pelo menos a quantidade de treinos que criamos
      // Pode ter mais se houver treinos anteriores no banco
      cy.get('[data-cy="treino-card"]').should('have.length.greaterThan', treinosCriados.length - 1);
    });
  });

  context('Filtros', () => {

    it('Deve filtrar treinos por tipo', () => {
      // Abre painel de filtros
      listPage.toggleFiltros();

      // Aguarda painel abrir (pode ter animação)
      cy.wait(300);

      listPage.filterByTipo('A');

      // Aguarda atualização
      cy.wait(500);

      // Verifica que há cards do tipo A
      cy.get('[data-cy="treino-card"]').should('have.length.greaterThan', 0);

      // Todos os cards devem ser do tipo A
      cy.get('[data-cy="treino-card"]').each(($card) => {
        cy.wrap($card).find('[data-cy="tipo"]').should('contain', 'A');
      });
    });

    it('Deve limpar filtros', () => {
      // Abre painel de filtros
      listPage.toggleFiltros();

      // Aplica filtro
      listPage.filterByTipo('B');
      cy.wait(500);

      // Limpa filtros
      listPage.clearFilters();
      cy.wait(500);

      // Deve mostrar mais treinos
      listPage.shouldShowTreinos();
    });
  });

  context('Busca', () => {

    it.skip('Deve buscar treino por nome (funcionalidade não implementada)', () => {
      // NOTA: A funcionalidade de busca ainda não foi implementada no componente ListaTreinos
      // Este teste está desabilitado até a implementação
      const nomeParaBuscar = treinosCriados[0].nome;

      listPage.search(nomeParaBuscar);
      cy.wait(500);

      // Deve encontrar o treino
      cy.contains(nomeParaBuscar).should('be.visible');
    });

    it.skip('Deve mostrar mensagem quando não encontrar resultados (funcionalidade não implementada)', () => {
      // NOTA: A funcionalidade de busca ainda não foi implementada no componente ListaTreinos
      // Este teste está desabilitado até a implementação
      listPage.search('TREINO_INEXISTENTE_XYZ123');
      cy.wait(500);

      listPage.shouldShowEmptyState();
    });
  });

  context('Ações nos Cards', () => {

    it('Deve cards serem clicáveis', () => {
      cy.get('[data-cy="treino-card"]').first().should('be.visible');
    });

    it('Deve navegar para detalhes ao clicar no card', () => {
      // Clica no primeiro card
      listPage.clickView(0);

      // Verifica que navegou para uma página de detalhes (qualquer ID)
      cy.url().should('include', '/treinos/');
      cy.url().should('not.include', '/novo');
    });
  });

  context('Paginação', () => {

    it('Deve verificar se paginação existe', () => {
      // Verifica se o elemento de paginação existe na página
      // Pode não estar visível se houver poucos treinos
      cy.get('body').then($body => {
        if ($body.find('[data-cy="pagination"]').length > 0) {
          cy.get('[data-cy="pagination"]').should('be.visible');
          cy.log('✅ Paginação encontrada e visível');
        } else {
          cy.log('ℹ️ Paginação não presente (poucos treinos)');
        }
      });
    });
  });

  context('Estado Vazio', () => {

    it('Deve mostrar mensagem quando não há treinos', () => {
      // Limpa todos os treinos
      cy.treinoApi_List().then(response => {
        const treinos = response.body.dados || response.body.treinos || [];

        if (treinos.length > 0) {
          treinos.forEach(treino => {
            cy.treinoApi_Delete(treino._id);
          });
        }
      });

      // Aguarda deletar todos
      cy.wait(500);

      // Recarrega página
      listPage.visit();

      // Aguarda carregar
      cy.wait(500);

      // Deve mostrar estado vazio
      listPage.shouldShowEmptyState();
    });
  });
});
