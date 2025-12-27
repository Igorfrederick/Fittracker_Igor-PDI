/// <reference types="cypress" />

import { makeAFakeTreino } from '../../support/Library/TreinoLib';

describe('Treinos - CRUD Completo', { tags: ['@treinos', '@crud', '@high'] }, () => {
  let treinoCriado;

  context('CREATE - Criação de Treinos', () => {
    it('Deve criar um treino com dados válidos', { tags: '@smoke' }, () => {
      // 1. Arrange: Prepara os dados
      const fakeTreino = makeAFakeTreino({
        tipo: 'A',
        nome: 'Treino de Peito'
      });
      const payload = fakeTreino.adapterToPOST();

      // 2. Act: Executa a ação
      cy.treinoApi_Create(payload).then(response => {
        // 3. Assert: Valida o resultado
        cy.treinoAssert_WasCreated(response, payload);

        // Salva para usar em outros testes
        treinoCriado = response.body.treino;
      });
    });

    it('Não deve criar treino sem tipo', { tags: '@negative' }, () => {
      const payload = {
        data: new Date().toISOString(),
        nome: 'Treino sem tipo'
      };

      cy.treinoApi_Create(payload).then(response => {
        expect(response.status).to.be.oneOf([400, 500]);
        expect(response.body).to.have.property('error');
      });
    });

    it('Não deve criar treino sem data', { tags: '@negative' }, () => {
      const payload = {
        tipo: 'A',
        nome: 'Treino sem data'
      };

      cy.treinoApi_Create(payload).then(response => {
        expect(response.status).to.be.oneOf([400, 500]);
      });
    });
  });

  context('READ - Leitura de Treinos', () => {
    before(() => {
      // Setup: Cria treino para testes de leitura
      const fakeTreino = makeAFakeTreino({ tipo: 'B' });
      cy.treinoApi_Create(fakeTreino.adapterToPOST()).then(resp => {
        treinoCriado = resp.body.treino;
      });
    });

    it('Deve listar todos os treinos', { tags: '@smoke' }, () => {
      cy.treinoApi_List().then(response => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('treinos');
        expect(response.body.treinos).to.be.an('array');
      });
    });

    it('Deve buscar treino por ID', { tags: '@smoke' }, () => {
      cy.treinoApi_GetById(treinoCriado._id).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.treino._id).to.eq(treinoCriado._id);
      });
    });

    it('Deve filtrar treinos por tipo', () => {
      cy.treinoApi_List({ tipo: 'B' }).then(response => {
        expect(response.status).to.eq(200);
        response.body.treinos.forEach(treino => {
          expect(treino.tipo).to.eq('B');
        });
      });
    });

    it('Não deve encontrar treino com ID inválido', { tags: '@negative' }, () => {
      cy.treinoApi_GetById('123456789012345678901234').then(response => {
        expect(response.status).to.eq(404);
      });
    });
  });

  context('UPDATE - Atualização de Treinos', () => {
    beforeEach(() => {
      // Setup: Cria treino para cada teste de update
      const fakeTreino = makeAFakeTreino();
      cy.treinoApi_Create(fakeTreino.adapterToPOST()).then(resp => {
        treinoCriado = resp.body.treino;
      });
    });

    it('Deve atualizar nome do treino', { tags: '@smoke' }, () => {
      const updatedData = {
        ...treinoCriado,
        nome: 'Nome Atualizado via Teste'
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        cy.treinoAssert_WasUpdated(response);
        expect(response.body.treino.nome).to.eq('Nome Atualizado via Teste');
      });
    });

    it('Deve marcar treino como concluído', () => {
      const updatedData = {
        ...treinoCriado,
        concluido: true
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.treino.concluido).to.be.true;
      });
    });

    it('Deve atualizar duração do treino', () => {
      const updatedData = {
        ...treinoCriado,
        duracao: 90
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        expect(response.body.treino.duracao).to.eq(90);
      });
    });
  });

  context('DELETE - Exclusão de Treinos', () => {
    beforeEach(() => {
      // Setup: Cria treino para cada teste de delete
      const fakeTreino = makeAFakeTreino();
      cy.treinoApi_Create(fakeTreino.adapterToPOST()).then(resp => {
        treinoCriado = resp.body.treino;
      });
    });

    it('Deve deletar um treino existente', { tags: '@smoke' }, () => {
      cy.treinoApi_Delete(treinoCriado._id).then(response => {
        cy.treinoAssert_WasDeleted(response);
      });

      // Verifica que foi realmente deletado
      cy.treinoApi_GetById(treinoCriado._id).then(response => {
        expect(response.status).to.eq(404);
      });
    });

    it('Não deve deletar treino com ID inválido', { tags: '@negative' }, () => {
      cy.treinoApi_Delete('123456789012345678901234').then(response => {
        expect(response.status).to.be.oneOf([404, 500]);
      });
    });
  });

  context('STATS - Estatísticas de Treinos', () => {
    it('Deve retornar estatísticas válidas', () => {
      cy.treinoApi_GetStats().then(response => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('totalTreinos');
        expect(response.body).to.have.property('treinosConcluidos');
      });
    });
  });
});
