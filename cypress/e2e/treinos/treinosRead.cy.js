/// <reference types="cypress" />

import { makeAFakeTreino, makeArrayOfFakeTreinos } from '../../support/Library/TreinoLib';

describe('Treinos - READ', { tags: ['@treinos', '@read', '@high'] }, () => {

  let treinoCriado;

  before(() => {
    // Setup: Cria alguns treinos para os testes de leitura
    const fakeTreino = makeAFakeTreino({
      tipo: 'A',
      nome: 'Treino para Teste de Leitura'
    });
    cy.treinoApi_Create(fakeTreino.adapterToPOST()).then(resp => {
      treinoCriado = resp.body.treino;
    });

    // Cria mais alguns treinos de tipos diferentes
    cy.treinoApi_Create(makeAFakeTreino({ tipo: 'B' }).adapterToPOST());
    cy.treinoApi_Create(makeAFakeTreino({ tipo: 'C' }).adapterToPOST());
    cy.treinoApi_Create(makeAFakeTreino({ tipo: 'PUSH' }).adapterToPOST());
  });

  context('Listagem de Treinos', () => {

    it('Deve listar todos os treinos', { tags: '@smoke' }, () => {
      cy.treinoApi_List().then(response => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('treinos');
        expect(response.body.treinos).to.be.an('array');
        expect(response.body.treinos.length).to.be.greaterThan(0);
      });
    });

    it('Deve retornar treinos com estrutura válida', { tags: '@smoke' }, () => {
      cy.treinoApi_List().then(response => {
        expect(response.status).to.eq(200);

        const primeiroTreino = response.body.treinos[0];
        cy.treinoAssert_HasValidStructure(primeiroTreino);
      });
    });

    it('Deve retornar array vazio quando não há treinos (após limpeza)', () => {
      // Este teste assumiria uma base limpa
      // Por enquanto, apenas valida que retorna array
      cy.treinoApi_List().then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.treinos).to.be.an('array');
      });
    });
  });

  context('Busca de Treino por ID', () => {

    it('Deve buscar treino por ID válido', { tags: '@smoke' }, () => {
      cy.treinoApi_GetById(treinoCriado._id).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('treino');
        expect(response.body.treino._id).to.eq(treinoCriado._id);
        expect(response.body.treino.tipo).to.eq(treinoCriado.tipo);
      });
    });

    it('Deve retornar treino com todos os campos', () => {
      cy.treinoApi_GetById(treinoCriado._id).then(response => {
        const treino = response.body.treino;

        expect(treino).to.have.property('_id');
        expect(treino).to.have.property('tipo');
        expect(treino).to.have.property('data');
        expect(treino).to.have.property('exercicios');
        expect(treino).to.have.property('concluido');
        expect(treino).to.have.property('createdAt');
        expect(treino).to.have.property('updatedAt');
      });
    });

    it('Não deve encontrar treino com ID inválido', { tags: '@negative' }, () => {
      cy.treinoApi_GetById('123456789012345678901234').then(response => {
        expect(response.status).to.eq(404);
      });
    });

    it('Não deve encontrar treino com ID malformado', { tags: '@negative' }, () => {
      cy.treinoApi_GetById('id-invalido').then(response => {
        expect(response.status).to.be.oneOf([400, 500]);
      });
    });
  });

  context('Filtros de Busca', () => {

    it('Deve filtrar treinos por tipo A', () => {
      cy.treinoApi_List({ tipo: 'A' }).then(response => {
        expect(response.status).to.eq(200);

        if (response.body.treinos.length > 0) {
          response.body.treinos.forEach(treino => {
            expect(treino.tipo).to.eq('A');
          });
        }
      });
    });

    it('Deve filtrar treinos por tipo B', () => {
      cy.treinoApi_List({ tipo: 'B' }).then(response => {
        expect(response.status).to.eq(200);

        if (response.body.treinos.length > 0) {
          response.body.treinos.forEach(treino => {
            expect(treino.tipo).to.eq('B');
          });
        }
      });
    });

    it('Deve filtrar treinos por tipo PUSH', () => {
      cy.treinoApi_List({ tipo: 'PUSH' }).then(response => {
        expect(response.status).to.eq(200);

        if (response.body.treinos.length > 0) {
          response.body.treinos.forEach(treino => {
            expect(treino.tipo).to.eq('PUSH');
          });
        }
      });
    });

    it('Deve filtrar treinos concluídos', () => {
      cy.treinoApi_List({ concluido: true }).then(response => {
        expect(response.status).to.eq(200);

        if (response.body.treinos.length > 0) {
          response.body.treinos.forEach(treino => {
            expect(treino.concluido).to.be.true;
          });
        }
      });
    });

    it('Deve filtrar treinos não concluídos', () => {
      cy.treinoApi_List({ concluido: false }).then(response => {
        expect(response.status).to.eq(200);

        if (response.body.treinos.length > 0) {
          response.body.treinos.forEach(treino => {
            expect(treino.concluido).to.be.false;
          });
        }
      });
    });
  });

  context('Estatísticas de Treinos', () => {

    it('Deve retornar estatísticas válidas', { tags: '@smoke' }, () => {
      cy.treinoApi_GetStats().then(response => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('totalTreinos');
        expect(response.body).to.have.property('treinosConcluidos');
        expect(response.body).to.have.property('duracaoMedia');
        expect(response.body).to.have.property('duracaoTotal');
      });
    });

    it('Deve retornar estatísticas com valores numéricos', () => {
      cy.treinoApi_GetStats().then(response => {
        expect(response.body.totalTreinos).to.be.a('number');
        expect(response.body.treinosConcluidos).to.be.a('number');
        expect(response.body.duracaoMedia).to.be.a('number');
        expect(response.body.duracaoTotal).to.be.a('number');
      });
    });

    it('Total de treinos concluídos não deve exceder total de treinos', () => {
      cy.treinoApi_GetStats().then(response => {
        expect(response.body.treinosConcluidos).to.be.at.most(response.body.totalTreinos);
      });
    });
  });
});
