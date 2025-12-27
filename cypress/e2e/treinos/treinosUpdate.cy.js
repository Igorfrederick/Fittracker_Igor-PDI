/// <reference types="cypress" />

import { makeAFakeTreino } from '../../support/Library/TreinoLib';

describe('Treinos - UPDATE', { tags: ['@treinos', '@update', '@high'] }, () => {

  let treinoCriado;

  beforeEach(() => {
    // Setup: Cria um treino novo antes de cada teste
    const fakeTreino = makeAFakeTreino({
      tipo: 'A',
      nome: 'Treino Original',
      duracao: 60
    });
    cy.treinoApi_Create(fakeTreino.adapterToPOST()).then(resp => {
      treinoCriado = resp.body.treino;
    });
  });

  context('Atualização de Campos Individuais', () => {

    it('Deve atualizar o nome do treino', { tags: '@smoke' }, () => {
      const updatedData = {
        ...treinoCriado,
        nome: 'Nome Atualizado via Teste'
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        cy.treinoAssert_WasUpdated(response);
        expect(response.body.treino.nome).to.eq('Nome Atualizado via Teste');
      });
    });

    it('Deve atualizar o tipo do treino', { tags: '@smoke' }, () => {
      const updatedData = {
        ...treinoCriado,
        tipo: 'B'
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.treino.tipo).to.eq('B');
      });
    });

    it('Deve atualizar a duração do treino', () => {
      const updatedData = {
        ...treinoCriado,
        duracao: 90
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.treino.duracao).to.eq(90);
      });
    });

    it('Deve atualizar a observação do treino', () => {
      const updatedData = {
        ...treinoCriado,
        observacao: 'Observação atualizada: treino muito produtivo'
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.treino.observacao).to.eq('Observação atualizada: treino muito produtivo');
      });
    });

    it('Deve atualizar a data do treino', () => {
      const novaData = new Date('2025-01-15').toISOString();
      const updatedData = {
        ...treinoCriado,
        data: novaData
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        expect(response.status).to.eq(200);
        // Compara apenas a data (ignora diferenças de milissegundos)
        expect(new Date(response.body.treino.data).toDateString())
          .to.eq(new Date(novaData).toDateString());
      });
    });
  });

  context('Atualização de Status', () => {

    it('Deve marcar treino como concluído', { tags: '@smoke' }, () => {
      const updatedData = {
        ...treinoCriado,
        concluido: true
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.treino.concluido).to.be.true;
      });
    });

    it('Deve marcar treino como não concluído', () => {
      // Primeiro marca como concluído
      cy.treinoApi_Update(treinoCriado._id, {
        ...treinoCriado,
        concluido: true
      });

      // Depois desmarca
      const updatedData = {
        ...treinoCriado,
        concluido: false
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.treino.concluido).to.be.false;
      });
    });
  });

  context('Atualização de Múltiplos Campos', () => {

    it('Deve atualizar nome e duração simultaneamente', () => {
      const updatedData = {
        ...treinoCriado,
        nome: 'Treino Completo Atualizado',
        duracao: 75
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.treino.nome).to.eq('Treino Completo Atualizado');
        expect(response.body.treino.duracao).to.eq(75);
      });
    });

    it('Deve atualizar tipo, nome e status de conclusão', () => {
      const updatedData = {
        ...treinoCriado,
        tipo: 'PUSH',
        nome: 'Treino Push Atualizado',
        concluido: true
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.treino.tipo).to.eq('PUSH');
        expect(response.body.treino.nome).to.eq('Treino Push Atualizado');
        expect(response.body.treino.concluido).to.be.true;
      });
    });

    it('Deve atualizar todos os campos editáveis', () => {
      const updatedData = {
        ...treinoCriado,
        tipo: 'LEGS',
        nome: 'Treino de Pernas Completo',
        duracao: 120,
        observacao: 'Treino intenso de pernas',
        concluido: true
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.treino.tipo).to.eq('LEGS');
        expect(response.body.treino.nome).to.eq('Treino de Pernas Completo');
        expect(response.body.treino.duracao).to.eq(120);
        expect(response.body.treino.observacao).to.eq('Treino intenso de pernas');
        expect(response.body.treino.concluido).to.be.true;
      });
    });
  });

  context('Cenários Negativos de Atualização', () => {

    it('Não deve atualizar treino com ID inválido', { tags: '@negative' }, () => {
      const updatedData = {
        tipo: 'B',
        nome: 'Tentativa de Update'
      };

      cy.treinoApi_Update('123456789012345678901234', updatedData).then(response => {
        expect(response.status).to.eq(404);
      });
    });

    it('Não deve atualizar treino com ID malformado', { tags: '@negative' }, () => {
      const updatedData = {
        tipo: 'B',
        nome: 'Tentativa de Update'
      };

      cy.treinoApi_Update('id-invalido', updatedData).then(response => {
        expect(response.status).to.be.oneOf([400, 500]);
      });
    });

    it('Não deve atualizar com tipo vazio', { tags: '@negative' }, () => {
      const updatedData = {
        ...treinoCriado,
        tipo: ''
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        expect(response.status).to.be.oneOf([400, 500]);
      });
    });

    it('Não deve atualizar com duração negativa', { tags: '@negative' }, () => {
      const updatedData = {
        ...treinoCriado,
        duracao: -30
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        expect(response.status).to.be.oneOf([400, 500]);
      });
    });
  });

  context('Validação de Persistência', () => {

    it('Deve persistir a atualização após buscar novamente', () => {
      const updatedData = {
        ...treinoCriado,
        nome: 'Nome Para Validar Persistência'
      };

      // Atualiza
      cy.treinoApi_Update(treinoCriado._id, updatedData).then(() => {
        // Busca novamente para validar
        cy.treinoApi_GetById(treinoCriado._id).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.treino.nome).to.eq('Nome Para Validar Persistência');
        });
      });
    });

    it('Deve atualizar o campo updatedAt', () => {
      const dataAntes = treinoCriado.updatedAt;

      // Aguarda 1 segundo para garantir diferença no timestamp
      cy.wait(1000);

      const updatedData = {
        ...treinoCriado,
        nome: 'Atualização de Timestamp'
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.treino.updatedAt).to.not.eq(dataAntes);
        expect(new Date(response.body.treino.updatedAt).getTime())
          .to.be.greaterThan(new Date(dataAntes).getTime());
      });
    });
  });
});
