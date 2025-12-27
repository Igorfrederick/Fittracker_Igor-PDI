/// <reference types="cypress" />

import { makeAFakeTreino } from '../../support/Library/TreinoLib';

describe('Treinos - DELETE', { tags: ['@treinos', '@delete', '@high'] }, () => {

  let treinoCriado;

  beforeEach(() => {
    // Setup: Cria um treino novo antes de cada teste
    const fakeTreino = makeAFakeTreino({
      tipo: 'A',
      nome: 'Treino Para Deletar'
    });
    cy.treinoApi_Create(fakeTreino.adapterToPOST()).then(resp => {
      treinoCriado = resp.body.treino;
    });
  });

  context('Exclusão de Treinos - Cenários Positivos', () => {

    it('Deve deletar um treino existente', { tags: '@smoke' }, () => {
      cy.treinoApi_Delete(treinoCriado._id).then(response => {
        cy.treinoAssert_WasDeleted(response);
      });
    });

    it('Deve deletar e confirmar que não existe mais', { tags: '@smoke' }, () => {
      // Deleta o treino
      cy.treinoApi_Delete(treinoCriado._id).then(response => {
        expect(response.status).to.eq(200);
      });

      // Verifica que foi realmente deletado
      cy.treinoApi_GetById(treinoCriado._id).then(response => {
        expect(response.status).to.eq(404);
      });
    });

    it('Deve deletar treino do tipo A', () => {
      cy.treinoApi_Delete(treinoCriado._id).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message');
      });
    });

    it('Deve deletar treino do tipo PUSH', () => {
      // Cria treino PUSH
      const fakeTreino = makeAFakeTreino({ tipo: 'PUSH' });

      cy.treinoApi_Create(fakeTreino.adapterToPOST()).then(createResp => {
        const treinoPush = createResp.body.treino;

        // Deleta o treino PUSH
        cy.treinoApi_Delete(treinoPush._id).then(deleteResp => {
          expect(deleteResp.status).to.eq(200);
        });
      });
    });

    it('Deve deletar treino concluído', () => {
      // Atualiza para concluído
      const updatedData = {
        ...treinoCriado,
        concluido: true
      };

      cy.treinoApi_Update(treinoCriado._id, updatedData).then(() => {
        // Deleta o treino concluído
        cy.treinoApi_Delete(treinoCriado._id).then(response => {
          expect(response.status).to.eq(200);
        });
      });
    });

    it('Deve deletar treino não concluído', () => {
      cy.treinoApi_Delete(treinoCriado._id).then(response => {
        expect(response.status).to.eq(200);
      });
    });
  });

  context('Exclusão de Treinos - Cenários Negativos', () => {

    it('Não deve deletar treino com ID inexistente', { tags: '@negative' }, () => {
      cy.treinoApi_Delete('123456789012345678901234').then(response => {
        expect(response.status).to.be.oneOf([404, 500]);
      });
    });

    it('Não deve deletar treino com ID malformado', { tags: '@negative' }, () => {
      cy.treinoApi_Delete('id-invalido').then(response => {
        expect(response.status).to.be.oneOf([400, 500]);
      });
    });

    it('Não deve deletar treino com ID vazio', { tags: '@negative' }, () => {
      cy.treinoApi_Delete('').then(response => {
        expect(response.status).to.be.oneOf([400, 404, 500]);
      });
    });

    it('Não deve encontrar treino já deletado', { tags: '@negative' }, () => {
      const idDeletado = treinoCriado._id;

      // Deleta pela primeira vez
      cy.treinoApi_Delete(idDeletado).then(response => {
        expect(response.status).to.eq(200);
      });

      // Tenta deletar novamente
      cy.treinoApi_Delete(idDeletado).then(response => {
        expect(response.status).to.be.oneOf([404, 500]);
      });
    });
  });

  context('Validação de Integridade após Exclusão', () => {

    it('Não deve listar treino deletado', () => {
      const tipoTreino = treinoCriado.tipo;

      // Deleta o treino
      cy.treinoApi_Delete(treinoCriado._id).then(() => {
        // Lista treinos do mesmo tipo
        cy.treinoApi_List({ tipo: tipoTreino }).then(response => {
          expect(response.status).to.eq(200);

          // Verifica que o treino deletado não está na lista
          const treinoEncontrado = response.body.treinos.find(
            t => t._id === treinoCriado._id
          );
          expect(treinoEncontrado).to.be.undefined;
        });
      });
    });

    it('Deve atualizar estatísticas após exclusão', () => {
      let totalAntes;

      // Obtém estatísticas antes
      cy.treinoApi_GetStats().then(response => {
        totalAntes = response.body.totalTreinos;
      });

      // Deleta um treino
      cy.treinoApi_Delete(treinoCriado._id).then(() => {
        // Obtém estatísticas depois
        cy.treinoApi_GetStats().then(response => {
          expect(response.body.totalTreinos).to.eq(totalAntes - 1);
        });
      });
    });

    it('Não deve permitir atualizar treino deletado', () => {
      // Deleta o treino
      cy.treinoApi_Delete(treinoCriado._id).then(() => {
        // Tenta atualizar o treino deletado
        const updatedData = {
          ...treinoCriado,
          nome: 'Tentativa de Atualizar Deletado'
        };

        cy.treinoApi_Update(treinoCriado._id, updatedData).then(response => {
          expect(response.status).to.eq(404);
        });
      });
    });
  });

  context('Exclusão em Massa (Múltiplos Treinos)', () => {

    it('Deve deletar múltiplos treinos sequencialmente', () => {
      // Cria mais 2 treinos
      const treino2 = makeAFakeTreino({ tipo: 'B' });
      const treino3 = makeAFakeTreino({ tipo: 'C' });

      cy.treinoApi_Create(treino2.adapterToPOST()).then(resp2 => {
        cy.treinoApi_Create(treino3.adapterToPOST()).then(resp3 => {
          // Deleta os 3 treinos
          cy.treinoApi_Delete(treinoCriado._id).then(r1 => {
            expect(r1.status).to.eq(200);
          });

          cy.treinoApi_Delete(resp2.body.treino._id).then(r2 => {
            expect(r2.status).to.eq(200);
          });

          cy.treinoApi_Delete(resp3.body.treino._id).then(r3 => {
            expect(r3.status).to.eq(200);
          });
        });
      });
    });

    it('Deve deletar todos os treinos de um tipo específico', () => {
      // Cria 3 treinos do tipo 'TEST'
      const tipoTeste = 'TEST';

      cy.treinoApi_Create(makeAFakeTreino({ tipo: tipoTeste }).adapterToPOST());
      cy.treinoApi_Create(makeAFakeTreino({ tipo: tipoTeste }).adapterToPOST());
      cy.treinoApi_Create(makeAFakeTreino({ tipo: tipoTeste }).adapterToPOST());

      // Lista todos do tipo TEST
      cy.treinoApi_List({ tipo: tipoTeste }).then(response => {
        const treinos = response.body.treinos;

        // Deleta cada um
        treinos.forEach(treino => {
          cy.treinoApi_Delete(treino._id).then(delResp => {
            expect(delResp.status).to.eq(200);
          });
        });

        // Verifica que não há mais treinos desse tipo
        cy.treinoApi_List({ tipo: tipoTeste }).then(finalResp => {
          expect(finalResp.body.treinos).to.have.length(0);
        });
      });
    });
  });
});
