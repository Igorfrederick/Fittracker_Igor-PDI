# 📋 ROTEIRO COMPLETO: Estruturação de Testes CRUD para FitTracker

## 🎯 Objetivo
Criar uma suíte de testes E2E com Cypress para o FitTracker seguindo a arquitetura em camadas do projeto nex-web-test, implementando testes CRUD para **Treinos** e **Exercícios**.

---

## 📦 FASE 1: Setup e Configuração Inicial do Cypress

### **Passo 1.1: Instalação do Cypress e Dependências**

**O que fazer:**
- Instalar Cypress no projeto FitTracker
- Instalar dependências complementares (faker, cypress-grep, etc)

**Como fazer:**
```bash
cd c:\PDI-fittracker
npm install --save-dev cypress @faker-js/faker @cypress/grep
```

**Por que:**
- Cypress é o framework de testes E2E
- Faker gera dados falsos para testes
- cypress-grep permite filtrar testes por tags (como no nex-web-test)

---

### **Passo 1.2: Inicializar Cypress**

**O que fazer:**
- Criar estrutura básica do Cypress

**Como fazer:**
```bash
npx cypress open
```

**O que acontece:**
- Cypress cria automaticamente a pasta `cypress/` com subpastas
- Fecha o Cypress após a criação

---

### **Passo 1.3: Criar Arquivos de Configuração**

**O que fazer:**
- Criar `cypress.config.js`
- Criar `cypress.env.example.json` (modelo)
- Criar `cypress.env.json` (valores reais - não committar)
- Criar `.env.example` e `.env`

**Arquivo: `cypress.config.js`**
```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Frontend
    setupNodeEvents(on, config) {
      // Plugin para cypress-grep (tags)
      require('@cypress/grep/src/plugin')(config);
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    // watchForFileChanges: false, // Descomente se não quiser auto-reload
  },
  env: {
    language: 'pt-br', // Para traduções futuras
  },
  // Configurações de API
  baseApiUrl: 'http://localhost:3000',
});
```

**Arquivo: `cypress.env.example.json`**
```json
{
  "apiBaseUrl": "http://localhost:3000",
  "frontendBaseUrl": "http://localhost:5173"
}
```

**Por que:**
- `cypress.config.js` centraliza todas as configurações
- Arquivos `.env` separam configurações sensíveis
- Padrão similar ao nex-web-test

---

## 📁 FASE 2: Estruturação de Pastas (Arquitetura em Camadas)

### **Passo 2.1: Criar Estrutura de Pastas**

**O que fazer:**
- Replicar a arquitetura do nex-web-test adaptada ao FitTracker

**Estrutura a criar:**
```
cypress/
├── e2e/                          # Arquivos de teste
│   ├── treinos/
│   │   ├── treinosCRUD.cy.js
│   │   └── exerciciosCRUD.cy.js
│   └── Workspace-UnitTests/      # Testes unitários internos (opcional)
│
├── support/
│   ├── Commands/                 # Comandos personalizados
│   │   ├── Treino/
│   │   │   ├── index.js
│   │   │   ├── Api_commands.js
│   │   │   ├── Assertions_commands.js
│   │   │   └── Contract_commands.js
│   │   └── Utils/
│   │       └── NexUtils.js
│   │
│   ├── Models/                   # Modelos de dados
│   │   ├── Entity.js             # Classe base
│   │   └── Treino.js
│   │
│   ├── Adapters/                 # Adaptadores para API
│   │   └── TreinoAdapter.js
│   │
│   ├── Library/                  # Fábrica de dados fake
│   │   └── TreinoLib.js
│   │
│   ├── Services/                 # Lógica de negócio
│   │   └── TreinoServices.js
│   │
│   ├── Contracts/                # Schemas de validação
│   │   └── TreinoContract.js
│   │
│   ├── e2e.js                    # Arquivo de setup
│   └── commands.js               # Importa todos os comandos
│
└── fixtures/                     # Dados estáticos
    └── treinos.json
```

**Por que:**
- Separação de responsabilidades
- Facilita manutenção e reutilização
- Padrão profissional do nex-web-test

---

## 🧱 FASE 3: Implementação das Camadas (Bottom-Up)

### **Passo 3.1: Criar Classe Base Entity**

**O que fazer:**
- Criar classe base para herança de modelos

**Arquivo: `cypress/support/Models/Entity.js`**
```javascript
/**
 * Classe base Entity
 * Fornece funcionalidades comuns para todos os modelos
 */
class Entity {
  constructor() {
    this._id = null;
  }

  /**
   * Define o ID da entidade
   * @param {String} id - ID do MongoDB
   */
  setId(id) {
    this._id = id;
    return this;
  }

  /**
   * Obtém o ID da entidade
   */
  getId() {
    return this._id;
  }
}

module.exports = Entity;
```

**Por que:**
- Reutilização de código
- Padrão OOP do nex-web-test

---

### **Passo 3.2: Criar Model de Treino**

**O que fazer:**
- Criar classe que representa um Treino

**Arquivo: `cypress/support/Models/Treino.js`**
```javascript
/// <reference types="Cypress"/>
const Entity = require('./Entity');

/**
 * Model: Treino
 * Representa a estrutura de um treino no sistema FitTracker
 */
class Treino extends Entity {
  constructor(tipo, data) {
    super();

    // Validações básicas
    if (!tipo) throw new Error('Tipo do treino é obrigatório');
    if (!data) throw new Error('Data do treino é obrigatória');

    this.tipo = tipo.toUpperCase();
    this.nome = null;
    this.data = data;
    this.duracao = null;
    this.exercicios = [];
    this.observacao = null;
    this.concluido = false;
  }

  /**
   * Define o nome do treino
   */
  setNome(nome) {
    this.nome = nome;
    return this;
  }

  /**
   * Define a duração em minutos
   */
  setDuracao(duracao) {
    if (duracao < 0) throw new Error('Duração não pode ser negativa');
    this.duracao = duracao;
    return this;
  }

  /**
   * Adiciona um exercício ao treino
   */
  addExercicio(exercicio) {
    this.exercicios.push(exercicio);
    return this;
  }

  /**
   * Define observação
   */
  setObservacao(observacao) {
    this.observacao = observacao;
    return this;
  }

  /**
   * Marca como concluído
   */
  marcarConcluido(status = true) {
    this.concluido = status;
    return this;
  }

  /**
   * Converte para payload de POST
   */
  adapterToPOST(validateContract = true) {
    const TreinoAdapter = require('../Adapters/TreinoAdapter');
    return TreinoAdapter.adapterToPOST(this, validateContract);
  }

  /**
   * Converte para payload de PUT
   */
  adapterToPUT(validateContract = true) {
    const TreinoAdapter = require('../Adapters/TreinoAdapter');
    return TreinoAdapter.adapterToPUT(this, validateContract);
  }
}

module.exports = Treino;
```

**Por que:**
- Encapsula lógica de criação de objetos
- Validações na criação
- Métodos adapters integrados (padrão nex-web-test)

---

### **Passo 3.3: Criar Adapter de Treino**

**O que fazer:**
- Criar adaptador que transforma Model em payload de API

**Arquivo: `cypress/support/Adapters/TreinoAdapter.js`**
```javascript
/// <reference types="Cypress"/>

/**
 * Adapter: Treino
 * Converte objetos Treino para formatos de API (POST/PUT)
 */
class TreinoAdapter {
  /**
   * Converte Treino para payload de criação (POST)
   * @param {Treino} treino - Instância de Treino
   * @param {Boolean} validateContract - Se deve validar o schema
   * @returns {Object} Payload para POST
   */
  static adapterToPOST(treino, validateContract = true) {
    const Treino = require('../Models/Treino');

    // Validação de tipo
    if (!(treino instanceof Treino)) {
      throw new Error('Instance of Treino is not correct!');
    }

    const payload = {
      tipo: treino.tipo,
      data: treino.data,
      exercicios: treino.exercicios || []
    };

    // Adiciona campos opcionais se existirem
    if (treino.nome) payload.nome = treino.nome;
    if (treino.duracao !== null && treino.duracao !== undefined) {
      payload.duracao = treino.duracao;
    }
    if (treino.observacao) payload.observacao = treino.observacao;
    if (treino.concluido !== undefined) payload.concluido = treino.concluido;

    // Validação de contrato (opcional)
    if (validateContract) {
      cy.treinoPOSTSchemaIsValid(payload);
    }

    return payload;
  }

  /**
   * Converte Treino para payload de atualização (PUT)
   */
  static adapterToPUT(treino, validateContract = true) {
    // PUT tem mesma estrutura que POST neste caso
    return this.adapterToPOST(treino, validateContract);
  }
}

module.exports = TreinoAdapter;
```

**Por que:**
- Centraliza conversão de objetos para API
- Validação de contratos opcional
- Padrão do nex-web-test

---

### **Passo 3.4: Criar Contract (Schema de Validação)**

**O que fazer:**
- Criar validação de schemas de API

**Arquivo: `cypress/support/Contracts/TreinoContract.js`**
```javascript
/// <reference types="Cypress"/>

/**
 * Contract: Treino
 * Define schemas de validação para payloads de Treino
 */

/**
 * Schema para criação de treino (POST)
 */
const treinoPostSchema = {
  type: 'object',
  required: ['tipo', 'data'],
  properties: {
    tipo: {
      type: 'string',
      minLength: 1,
      maxLength: 20
    },
    nome: {
      type: ['string', 'null'],
      maxLength: 100
    },
    data: {
      type: 'string',
      format: 'date-time' // ou apenas 'string' se não usar validação rígida
    },
    duracao: {
      type: ['number', 'null'],
      minimum: 0
    },
    exercicios: {
      type: 'array',
      items: {
        type: 'object'
      }
    },
    observacao: {
      type: ['string', 'null'],
      maxLength: 1000
    },
    concluido: {
      type: 'boolean'
    }
  }
};

/**
 * Schema para atualização de treino (PUT)
 * Neste caso, mesma estrutura do POST
 */
const treinoPutSchema = treinoPostSchema;

module.exports = {
  treinoPostSchema,
  treinoPutSchema
};
```

**Por que:**
- Garante que payloads estejam corretos antes de enviar
- Evita erros de API por dados malformados

---

### **Passo 3.5: Criar Library (Fábrica de Dados Fake)**

**O que fazer:**
- Criar funções que geram objetos Treino com dados falsos

**Arquivo: `cypress/support/Library/TreinoLib.js`**
```javascript
/// <reference types="Cypress"/>
const { faker } = require('@faker-js/faker');
const Treino = require('../Models/Treino');

/**
 * Library: Treino
 * Funções para criar objetos Treino com dados fake
 */

/**
 * Cria um treino fake completo
 * @param {Object} overrides - Sobrescreve propriedades específicas
 * @returns {Treino} Instância de Treino com dados fake
 */
function makeAFakeTreino(overrides = {}) {
  const tipos = ['A', 'B', 'C', 'PUSH', 'PULL', 'LEGS', 'UPPER', 'LOWER'];
  const tipo = overrides.tipo || faker.helpers.arrayElement(tipos);
  const data = overrides.data || faker.date.recent({ days: 30 }).toISOString();

  const treino = new Treino(tipo, data);

  // Define propriedades opcionais
  treino
    .setNome(overrides.nome || faker.lorem.words(3))
    .setDuracao(overrides.duracao || faker.number.int({ min: 30, max: 120 }))
    .setObservacao(overrides.observacao || faker.lorem.sentence())
    .marcarConcluido(overrides.concluido || false);

  // Adiciona exercícios fake se necessário
  if (overrides.exercicios) {
    overrides.exercicios.forEach(ex => treino.addExercicio(ex));
  }

  return treino;
}

/**
 * Cria um exercício fake
 */
function makeAFakeExercicio(overrides = {}) {
  const gruposMusculares = [
    'Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps',
    'Quadríceps', 'Posterior', 'Glúteos', 'Panturrilha', 'Abdômen'
  ];

  return {
    nome: overrides.nome || faker.lorem.words(2),
    grupoMuscular: overrides.grupoMuscular || faker.helpers.arrayElement(gruposMusculares),
    series: overrides.series || [
      { carga: 60, repeticoes: 12, concluida: false },
      { carga: 70, repeticoes: 10, concluida: false },
      { carga: 80, repeticoes: 8, concluida: false }
    ],
    observacao: overrides.observacao || faker.lorem.sentence()
  };
}

/**
 * Cria um array de treinos fake
 */
function makeArrayOfFakeTreinos(quantity = 5) {
  const treinos = [];
  for (let i = 0; i < quantity; i++) {
    treinos.push(makeAFakeTreino());
  }
  return treinos;
}

module.exports = {
  makeAFakeTreino,
  makeAFakeExercicio,
  makeArrayOfFakeTreinos
};
```

**Por que:**
- Automatiza criação de dados de teste
- Faker gera dados realistas e variados
- Reutilização em múltiplos testes

---

### **Passo 3.6: Criar Comandos de API**

**O que fazer:**
- Criar comandos Cypress para operações CRUD via API

**Arquivo: `cypress/support/Commands/Treino/Api_commands.js`**
```javascript
/// <reference types="Cypress"/>

/**
 * Comandos de API para Treinos
 * CRUD completo via requisições HTTP
 */

/**
 * Cria um treino via API
 * @param {Object} treino - Payload do treino (já adaptado)
 * @returns {Object} Resposta da API com treino criado
 */
Cypress.Commands.add('treinoApi_Create', (treino) => {
  let response;

  cy.request({
    url: `${Cypress.config().baseApiUrl}/api/treinos`,
    method: 'POST',
    body: treino,
    failOnStatusCode: false
  }).then(resp => {
    response = resp;

    if (resp.status === 201) {
      cy.log(`✅ Treino criado: ${treino.tipo} - ${treino.nome || 'Sem nome'}`);
    }
  }).then(() => {
    return response;
  });
});

/**
 * Lista treinos via API
 * @param {Object} filters - Filtros opcionais (tipo, dataInicio, etc)
 */
Cypress.Commands.add('treinoApi_List', (filters = {}) => {
  let response;

  const queryString = new URLSearchParams(filters).toString();
  const url = `${Cypress.config().baseApiUrl}/api/treinos${queryString ? '?' + queryString : ''}`;

  cy.request({
    url: url,
    method: 'GET',
    failOnStatusCode: false
  }).then(resp => {
    response = resp;
    cy.log(`📋 Listados ${resp.body.treinos?.length || 0} treinos`);
  }).then(() => {
    return response;
  });
});

/**
 * Busca treino por ID
 */
Cypress.Commands.add('treinoApi_GetById', (id) => {
  let response;

  cy.request({
    url: `${Cypress.config().baseApiUrl}/api/treinos/${id}`,
    method: 'GET',
    failOnStatusCode: false
  }).then(resp => {
    response = resp;
  }).then(() => {
    return response;
  });
});

/**
 * Atualiza treino via API
 */
Cypress.Commands.add('treinoApi_Update', (id, treino) => {
  let response;

  cy.request({
    url: `${Cypress.config().baseApiUrl}/api/treinos/${id}`,
    method: 'PUT',
    body: treino,
    failOnStatusCode: false
  }).then(resp => {
    response = resp;

    if (resp.status === 200) {
      cy.log(`🔄 Treino atualizado: ${id}`);
    }
  }).then(() => {
    return response;
  });
});

/**
 * Deleta treino via API
 */
Cypress.Commands.add('treinoApi_Delete', (id) => {
  let response;

  cy.request({
    url: `${Cypress.config().baseApiUrl}/api/treinos/${id}`,
    method: 'DELETE',
    failOnStatusCode: false
  }).then(resp => {
    response = resp;

    if (resp.status === 200) {
      cy.log(`🗑️ Treino deletado: ${id}`);
    }
  }).then(() => {
    return response;
  });
});

/**
 * Obtém estatísticas de treinos
 */
Cypress.Commands.add('treinoApi_GetStats', () => {
  let response;

  cy.request({
    url: `${Cypress.config().baseApiUrl}/api/treinos/stats`,
    method: 'GET',
    failOnStatusCode: false
  }).then(resp => {
    response = resp;
  }).then(() => {
    return response;
  });
});
```

**Por que:**
- Encapsula chamadas de API
- Reutilização em testes
- Logs automáticos para debugging

---

### **Passo 3.7: Criar Comandos de Validação (Assertions)**

**Arquivo: `cypress/support/Commands/Treino/Assertions_commands.js`**
```javascript
/// <reference types="Cypress"/>

/**
 * Comandos de Assertions para Treinos
 * Validações comuns reutilizáveis
 */

/**
 * Valida que a resposta contém um treino válido
 */
Cypress.Commands.add('treinoAssert_HasValidStructure', (treino) => {
  expect(treino).to.have.property('_id');
  expect(treino).to.have.property('tipo');
  expect(treino).to.have.property('data');
  expect(treino).to.have.property('exercicios');
  expect(treino.exercicios).to.be.an('array');
});

/**
 * Valida que o treino foi criado corretamente
 */
Cypress.Commands.add('treinoAssert_WasCreated', (response, expectedData) => {
  expect(response.status).to.eq(201);
  expect(response.body).to.have.property('treino');

  const treino = response.body.treino;
  expect(treino.tipo).to.eq(expectedData.tipo);

  if (expectedData.nome) {
    expect(treino.nome).to.eq(expectedData.nome);
  }
});

/**
 * Valida que o treino foi atualizado
 */
Cypress.Commands.add('treinoAssert_WasUpdated', (response) => {
  expect(response.status).to.eq(200);
  expect(response.body).to.have.property('treino');
});

/**
 * Valida que o treino foi deletado
 */
Cypress.Commands.add('treinoAssert_WasDeleted', (response) => {
  expect(response.status).to.eq(200);
  expect(response.body).to.have.property('message');
});
```

---

### **Passo 3.8: Criar Comandos de Validação de Contrato**

**O que fazer:**
- Criar comandos que validam schemas usando AJV

**Instalar dependência:**
```bash
npm install --save-dev ajv
```

**Arquivo: `cypress/support/Commands/Treino/Contract_commands.js`**
```javascript
/// <reference types="Cypress"/>
const Ajv = require('ajv');
const { treinoPostSchema, treinoPutSchema } = require('../../Contracts/TreinoContract');

const ajv = new Ajv();

/**
 * Valida se o payload de POST está conforme o schema
 */
Cypress.Commands.add('treinoPOSTSchemaIsValid', (payload) => {
  const validate = ajv.compile(treinoPostSchema);
  const valid = validate(payload);

  if (!valid) {
    console.error('❌ Schema inválido:', validate.errors);
    throw new Error(`Schema de POST inválido: ${JSON.stringify(validate.errors)}`);
  }

  cy.log('✅ Schema de POST válido');
});

/**
 * Valida se o payload de PUT está conforme o schema
 */
Cypress.Commands.add('treinoPUTSchemaIsValid', (payload) => {
  const validate = ajv.compile(treinoPutSchema);
  const valid = validate(payload);

  if (!valid) {
    console.error('❌ Schema inválido:', validate.errors);
    throw new Error(`Schema de PUT inválido: ${JSON.stringify(validate.errors)}`);
  }

  cy.log('✅ Schema de PUT válido');
});
```

---

### **Passo 3.9: Criar Index de Comandos**

**Arquivo: `cypress/support/Commands/Treino/index.js`**
```javascript
// ************************************************************************************************
// Índice de comandos para a entidade Treino
// ************************************************************************************************
import './Api_commands';
import './Assertions_commands';
import './Contract_commands';
```

---

### **Passo 3.10: Configurar Support Files**

**Arquivo: `cypress/support/e2e.js`**
```javascript
/// <reference types="cypress" />

// Importa todos os comandos
import './commands';

// Plugin cypress-grep
import '@cypress/grep';

// Configurações globais
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retorna false para evitar que erros não capturados quebrem os testes
  return false;
});
```

**Arquivo: `cypress/support/commands.js`**
```javascript
/// <reference types="cypress" />

// Importa comandos de todas as entidades
import './Commands/Treino/index';
// Adicione outras entidades aqui conforme necessário
```

---

## 🧪 FASE 4: Criação dos Testes CRUD

### **Passo 4.1: Criar Teste de CRUD de Treinos**

**Arquivo: `cypress/e2e/treinos/treinosCRUD.cy.js`**
```javascript
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
```

**Por que:**
- Testa todos os cenários CRUD
- Usa tags para filtrar execuções
- Testes positivos e negativos
- Setup/Teardown adequados

---

## 🚀 FASE 5: Execução e Validação

### **Passo 5.1: Preparar Ambiente**

**Checklist antes de rodar:**
```bash
# 1. Backend rodando
cd backend
npm run dev

# 2. Frontend rodando (se testar UI)
cd frontend
npm run dev

# 3. MongoDB conectado
# Verificar .env do backend
```

---

### **Passo 5.2: Executar Testes**

**Modos de execução:**

```bash
# Modo interativo (debugging)
npx cypress open

# Modo headless (todos os testes)
npx cypress run

# Por arquivo específico
npx cypress run --spec 'cypress/e2e/treinos/treinosCRUD.cy.js'

# Por tags
npx cypress run --env grepTags=@smoke
npx cypress run --env grepTags=@treinos
npx cypress run --env grepTags=@crud+@high  # AND
```

---

## 📊 FASE 6: Melhorias e Próximos Passos

### **6.1: Testes de Exercícios (CRUD aninhado)**
- Criar comandos para adicionar/editar/remover exercícios
- Testes de validação de séries

### **6.2: Testes de UI**
- Comandos de interação com frontend
- Page Objects para páginas

### **6.3: Integração CI/CD**
- GitHub Actions para rodar testes automaticamente
- Reports de cobertura

### **6.4: Testes de Performance**
- Testes de carga com múltiplas requisições
- Validação de tempos de resposta

---

## 📝 Resumo do Fluxo de Uso

### **Como criar um teste novo:**

```javascript
// 1. Import da Library
import { makeAFakeTreino } from '../../support/Library/TreinoLib';

// 2. Criar objeto fake
const fakeTreino = makeAFakeTreino({ tipo: 'A' });

// 3. Converter para payload
const payload = fakeTreino.adapterToPOST(); // Já valida schema automaticamente

// 4. Usar comando de API
cy.treinoApi_Create(payload).then(response => {
  // 5. Usar comando de assertion
  cy.treinoAssert_WasCreated(response, payload);
});
```

---

## ✅ Checklist Final

- [ ] Cypress instalado
- [ ] Estrutura de pastas criada
- [ ] Models implementados
- [ ] Adapters implementados
- [ ] Contracts implementados
- [ ] Library implementada
- [ ] Comandos de API implementados
- [ ] Comandos de Assertions implementados
- [ ] Testes CRUD criados
- [ ] Testes executando com sucesso
- [ ] Tags configuradas
- [ ] Documentação atualizada

---

## 🎓 Conceitos Importantes

### **Padrão Factory (Library)**
Cria objetos fake prontos para uso nos testes.

### **Model**
Define a estrutura e validações da entidade.

### **Adapter**
Transforma objetos Model em payloads de API.

### **Contract**
Valida se os payloads estão conforme o esperado pela API.

### **Commands**
Encapsulam ações e validações reutilizáveis.

---

## 📚 Referências

- [Cypress Docs](https://docs.cypress.io)
- [Faker.js Docs](https://fakerjs.dev/)
- [Cypress Grep Plugin](https://github.com/cypress-io/cypress-grep)
- [AJV Schema Validator](https://ajv.js.org/)

---

**Desenvolvido seguindo o padrão do projeto nex-web-test**
