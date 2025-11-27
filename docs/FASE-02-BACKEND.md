# 📚 Fase 2: Backend/API

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura da API](#arquitetura-da-api)
3. [Models (Schemas)](#models-schemas)
4. [Controllers](#controllers)
5. [Routes](#routes)
6. [Fluxo de uma Requisição](#fluxo-de-uma-requisição)
7. [Testando a API](#testando-a-api)
8. [Conceitos Aprendidos](#conceitos-aprendidos)
9. [Checklist da Fase](#checklist-da-fase)

---

## Visão Geral

A Fase 2 implementa a **API REST** do FitTracker. Nesta etapa, criamos:

- **Models** — Estrutura dos dados com validações
- **Controllers** — Lógica de negócio
- **Routes** — Mapeamento de URLs para funções

**Resultado:** API funcional com CRUD completo de treinos e exercícios.

---

## Arquitetura da API

### Padrão MVC Adaptado

```
┌─────────────────────────────────────────────────────────────┐
│                        Cliente                               │
│                  (Thunder Client, React, etc)                │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP Request
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       server.js                              │
│                     (Middlewares)                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        Routes                                │
│              (Mapeia URL → Controller)                       │
│                                                              │
│   GET /api/treinos  →  treinoController.listar              │
│   POST /api/treinos →  treinoController.criar               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Controllers                             │
│                  (Lógica de Negócio)                         │
│                                                              │
│   - Valida dados de entrada                                  │
│   - Executa operações no banco                               │
│   - Formata resposta                                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        Models                                │
│                  (Schemas Mongoose)                          │
│                                                              │
│   - Define estrutura dos dados                               │
│   - Validações automáticas                                   │
│   - Métodos e virtuals                                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Atlas                           │
│                                                              │
│   Database: fittracker                                       │
│   Collection: treinos                                        │
└─────────────────────────────────────────────────────────────┘
```

### Estrutura de Pastas

```
backend/src/
├── server.js           # Ponto de entrada
├── config/
│   └── database.js     # Conexão MongoDB
├── models/
│   ├── index.js        # Exportações centralizadas
│   ├── Exercicio.js    # Schema de exercício
│   └── Treino.js       # Schema de treino
├── controllers/
│   └── treinoController.js  # Lógica dos endpoints
├── routes/
│   ├── index.js        # Exportações centralizadas
│   └── treinos.js      # Rotas de treinos
└── middlewares/        # (Para uso futuro)
```

---

## Models (Schemas)

### O que são Schemas?

No Mongoose, um **Schema** define a estrutura dos documentos que serão armazenados no MongoDB. É como um "contrato" que especifica:

- Quais campos existem
- Tipos de dados (String, Number, Date, etc)
- Validações (obrigatório, mínimo, máximo, etc)
- Valores padrão
- Campos calculados (virtuals)

### Schema de Exercício

O exercício é um **sub-documento** dentro do treino. Cada exercício possui séries.

```javascript
// Estrutura hierárquica:
Treino
└── exercicios[]
    └── series[]
```

#### Arquivo: `models/Exercicio.js`

```javascript
const serieSchema = new mongoose.Schema({
  carga: {
    type: Number,
    required: [true, 'Carga é obrigatória'],
    min: [0, 'Carga não pode ser negativa']
  },
  repeticoes: {
    type: Number,
    required: [true, 'Número de repetições é obrigatório'],
    min: [1, 'Mínimo de 1 repetição']
  },
  concluida: {
    type: Boolean,
    default: false
  }
}, { _id: false });
```

**Conceitos importantes:**

| Conceito | Explicação |
|----------|------------|
| `type: Number` | Define o tipo do campo |
| `required: [true, 'mensagem']` | Campo obrigatório com mensagem de erro customizada |
| `min: [0, 'mensagem']` | Valor mínimo permitido |
| `default: false` | Valor padrão se não informado |
| `{ _id: false }` | Não cria ID automático para sub-documentos |

#### Schema Principal do Exercício

```javascript
const exercicioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do exercício é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome muito longo (máx. 100 caracteres)']
  },
  grupoMuscular: {
    type: String,
    required: [true, 'Grupo muscular é obrigatório'],
    enum: {
      values: ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', ...],
      message: 'Grupo muscular inválido: {VALUE}'
    }
  },
  series: {
    type: [serieSchema],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'Exercício deve ter pelo menos uma série'
    }
  }
});
```

**Novos conceitos:**

| Conceito | Explicação |
|----------|------------|
| `trim: true` | Remove espaços em branco do início/fim |
| `maxlength` | Tamanho máximo da string |
| `enum` | Lista de valores permitidos |
| `validate` | Validação customizada com função |

### Schema de Treino

#### Arquivo: `models/Treino.js`

```javascript
const treinoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, 'Tipo do treino é obrigatório'],
    trim: true,
    uppercase: true
  },
  nome: {
    type: String,
    trim: true
  },
  data: {
    type: Date,
    required: [true, 'Data do treino é obrigatória'],
    default: Date.now
  },
  duracao: {
    type: Number,
    min: [0, 'Duração não pode ser negativa']
  },
  exercicios: {
    type: [exercicioSchema],
    default: []
  },
  concluido: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
```

**Conceitos das opções do Schema:**

| Opção | Explicação |
|-------|------------|
| `timestamps: true` | Cria automaticamente `createdAt` e `updatedAt` |
| `toJSON: { virtuals: true }` | Inclui campos virtuais ao converter para JSON |
| `uppercase: true` | Converte automaticamente para maiúsculas |

### Virtuals (Campos Calculados)

Virtuals são campos que **não existem no banco** mas são calculados em tempo real.

```javascript
treinoSchema.virtual('volumeTotal').get(function() {
  return this.exercicios.reduce((total, exercicio) => {
    const volumeExercicio = exercicio.series.reduce((sum, serie) => {
      return sum + (serie.carga * serie.repeticoes);
    }, 0);
    return total + volumeExercicio;
  }, 0);
});
```

**Exemplo de uso:**

```javascript
const treino = await Treino.findById(id);
console.log(treino.volumeTotal); // 2500 (calculado, não armazenado)
```

**Virtuals do Treino:**

| Virtual | Cálculo |
|---------|---------|
| `volumeTotal` | Soma de (carga × repetições) de todas as séries |
| `totalExercicios` | Quantidade de exercícios no treino |
| `totalSeries` | Quantidade total de séries |
| `gruposTrabalhados` | Lista única de grupos musculares |

### Índices

Índices aceleram buscas no banco de dados.

```javascript
// Índice simples - busca por data
treinoSchema.index({ data: -1 });  // -1 = decrescente

// Índice simples - busca por tipo
treinoSchema.index({ tipo: 1 });   // 1 = crescente

// Índice composto - busca combinada
treinoSchema.index({ tipo: 1, data: -1 });
```

**Quando usar índices:**

- Campos usados frequentemente em filtros (`find`)
- Campos usados em ordenação (`sort`)
- Campos usados em agregações

### Métodos de Instância

Métodos que operam em um **documento específico**.

```javascript
treinoSchema.methods.adicionarExercicio = function(exercicioData) {
  exercicioData.ordem = this.exercicios.length;
  this.exercicios.push(exercicioData);
  return this.exercicios[this.exercicios.length - 1];
};
```

**Uso:**

```javascript
const treino = await Treino.findById(id);
treino.adicionarExercicio({ nome: 'Supino', ... });
await treino.save();
```

### Métodos Estáticos

Métodos que operam no **Model** (não em um documento específico).

```javascript
treinoSchema.statics.buscarPorPeriodo = function(inicio, fim) {
  return this.find({
    data: { $gte: inicio, $lte: fim }
  }).sort({ data: -1 });
};
```

**Uso:**

```javascript
const treinos = await Treino.buscarPorPeriodo(
  new Date('2025-01-01'),
  new Date('2025-01-31')
);
```

### Middlewares (Hooks)

Funções executadas automaticamente em determinados momentos.

```javascript
// Mongoose 9.x - não usa callback next()
treinoSchema.pre('save', function() {
  this.exercicios.forEach((exercicio, index) => {
    if (exercicio.ordem === undefined) {
      exercicio.ordem = index;
    }
  });
});
```

**Tipos de hooks:**

| Hook | Quando executa |
|------|----------------|
| `pre('save')` | Antes de salvar |
| `post('save')` | Depois de salvar |
| `pre('find')` | Antes de buscar |
| `pre('remove')` | Antes de remover |

**⚠️ Importante (Mongoose 9.x):**

```javascript
// ERRADO (versões antigas):
schema.pre('save', function(next) {
  // ...
  next();  // ❌ Causa erro no Mongoose 9.x
});

// CORRETO (Mongoose 9.x):
schema.pre('save', function() {
  // ...
  // Não precisa de next()
});
```

---

## Controllers

### O que são Controllers?

Controllers contêm a **lógica de negócio** da aplicação. Eles:

1. Recebem dados da requisição (`req`)
2. Processam/validam os dados
3. Interagem com os Models
4. Enviam resposta (`res`)

### Estrutura de um Controller

```javascript
exports.nomeDaFuncao = async (req, res, next) => {
  try {
    // 1. Extrair dados da requisição
    const { id } = req.params;
    const dados = req.body;
    
    // 2. Executar lógica/operação no banco
    const resultado = await Model.operacao();
    
    // 3. Enviar resposta de sucesso
    res.status(200).json({
      sucesso: true,
      dados: resultado
    });
    
  } catch (error) {
    // 4. Passar erro para o middleware de erro
    next(error);
  }
};
```

### Funções do treinoController

#### 1. Listar Treinos

```javascript
exports.listar = async (req, res, next) => {
  try {
    // Extrai query params
    const { tipo, dataInicio, dataFim, limite = 50, pagina = 1 } = req.query;

    // Constrói filtro dinamicamente
    const filtro = {};
    if (tipo) filtro.tipo = tipo.toUpperCase();
    if (dataInicio || dataFim) {
      filtro.data = {};
      if (dataInicio) filtro.data.$gte = new Date(dataInicio);
      if (dataFim) filtro.data.$lte = new Date(dataFim);
    }

    // Executa query com paginação
    const skip = (parseInt(pagina) - 1) * parseInt(limite);
    
    const [treinos, total] = await Promise.all([
      Treino.find(filtro).sort({ data: -1 }).skip(skip).limit(parseInt(limite)),
      Treino.countDocuments(filtro)
    ]);

    res.json({
      sucesso: true,
      dados: treinos,
      paginacao: { total, pagina, limite, totalPaginas }
    });
  } catch (error) {
    next(error);
  }
};
```

**Conceitos:**

| Conceito | Explicação |
|----------|------------|
| `req.query` | Parâmetros da URL (`?tipo=A&limite=10`) |
| `Promise.all()` | Executa múltiplas promises em paralelo |
| `skip()` e `limit()` | Paginação de resultados |
| `$gte` e `$lte` | Operadores MongoDB (greater/less than or equal) |

#### 2. Buscar por ID

```javascript
exports.buscarPorId = async (req, res, next) => {
  try {
    const { id } = req.params;  // /api/treinos/:id

    const treino = await Treino.findById(id);

    if (!treino) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Treino não encontrado'
      });
    }

    res.json({ sucesso: true, dados: treino });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        sucesso: false,
        erro: 'ID inválido'
      });
    }
    next(error);
  }
};
```

**Conceitos:**

| Conceito | Explicação |
|----------|------------|
| `req.params` | Parâmetros da rota (`:id`) |
| `findById()` | Busca por `_id` do MongoDB |
| `CastError` | Erro quando ID não é um ObjectId válido |

#### 3. Criar Treino

```javascript
exports.criar = async (req, res, next) => {
  try {
    const dadosTreino = req.body;

    const treino = new Treino(dadosTreino);
    await treino.save();

    res.status(201).json({
      sucesso: true,
      mensagem: 'Treino criado com sucesso',
      dados: treino
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const erros = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        sucesso: false,
        erro: 'Dados inválidos',
        detalhes: erros
      });
    }
    next(error);
  }
};
```

**Conceitos:**

| Conceito | Explicação |
|----------|------------|
| `req.body` | Corpo da requisição (JSON) |
| `new Model()` | Cria instância do documento |
| `.save()` | Persiste no banco de dados |
| `status(201)` | HTTP 201 Created |
| `ValidationError` | Erro de validação do Mongoose |

#### 4. Atualizar Treino

```javascript
exports.atualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = req.body;

    const treino = await Treino.findByIdAndUpdate(
      id,
      dadosAtualizacao,
      {
        new: true,           // Retorna documento atualizado
        runValidators: true  // Executa validações
      }
    );

    if (!treino) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Treino não encontrado'
      });
    }

    res.json({ sucesso: true, dados: treino });
  } catch (error) {
    next(error);
  }
};
```

**Opções do findByIdAndUpdate:**

| Opção | Explicação |
|-------|------------|
| `new: true` | Retorna o documento após atualização |
| `runValidators: true` | Valida dados mesmo em update |

#### 5. Remover Treino

```javascript
exports.remover = async (req, res, next) => {
  try {
    const { id } = req.params;

    const treino = await Treino.findByIdAndDelete(id);

    if (!treino) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Treino não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Treino removido com sucesso',
      dados: treino  // Retorna o documento removido
    });
  } catch (error) {
    next(error);
  }
};
```

#### 6. Estatísticas (Aggregation)

```javascript
exports.estatisticas = async (req, res, next) => {
  try {
    const porTipo = await Treino.aggregate([
      {
        $group: {
          _id: '$tipo',
          quantidade: { $sum: 1 }
        }
      },
      { $sort: { quantidade: -1 } }
    ]);

    res.json({ sucesso: true, dados: { porTipo } });
  } catch (error) {
    next(error);
  }
};
```

**Aggregation Pipeline:**

O `aggregate()` processa documentos em estágios:

```javascript
[
  { $match: { ... } },    // Filtra documentos
  { $group: { ... } },    // Agrupa e calcula
  { $sort: { ... } },     // Ordena resultados
  { $project: { ... } }   // Seleciona campos
]
```

---

## Routes

### O que são Routes?

Routes mapeiam **URLs + Métodos HTTP** para funções do controller.

```javascript
// Quando receber GET em /api/treinos
// Execute a função listar do controller
router.get('/', treinoController.listar);
```

### Arquivo: `routes/treinos.js`

```javascript
const express = require('express');
const router = express.Router();
const treinoController = require('../controllers/treinoController');

// Rotas de Treinos
router.get('/stats', treinoController.estatisticas);  // Deve vir antes de /:id
router.get('/', treinoController.listar);
router.get('/:id', treinoController.buscarPorId);
router.post('/', treinoController.criar);
router.put('/:id', treinoController.atualizar);
router.delete('/:id', treinoController.remover);

// Rotas de Exercícios (aninhadas)
router.post('/:id/exercicios', treinoController.adicionarExercicio);
router.put('/:id/exercicios/:exercicioId', treinoController.atualizarExercicio);
router.delete('/:id/exercicios/:exercicioId', treinoController.removerExercicio);

module.exports = router;
```

### Ordem das Rotas Importa!

```javascript
// ⚠️ ERRADO - /stats seria interpretado como :id
router.get('/:id', controller.buscarPorId);
router.get('/stats', controller.estatisticas);

// ✅ CORRETO - rotas específicas antes de rotas com parâmetros
router.get('/stats', controller.estatisticas);
router.get('/:id', controller.buscarPorId);
```

### Registro no server.js

```javascript
const { treinosRoutes } = require('./routes');

// Todas as rotas de treinos ficam sob /api/treinos
app.use('/api/treinos', treinosRoutes);
```

**Resultado:**

| Definição na Rota | URL Final |
|-------------------|-----------|
| `router.get('/')` | GET /api/treinos |
| `router.get('/:id')` | GET /api/treinos/123 |
| `router.post('/:id/exercicios')` | POST /api/treinos/123/exercicios |

---

## Fluxo de uma Requisição

### Exemplo: POST /api/treinos

```
1. Cliente envia requisição
   POST http://localhost:3000/api/treinos
   Content-Type: application/json
   Body: { "tipo": "A", "nome": "Peito", "exercicios": [...] }

2. Express recebe a requisição
   ↓
3. Middleware cors() adiciona headers
   ↓
4. Middleware express.json() parseia o body
   req.body = { tipo: "A", nome: "Peito", exercicios: [...] }
   ↓
5. Middleware de logging (dev)
   Console: "📨 POST /api/treinos"
   ↓
6. Router identifica a rota
   POST /api/treinos → treinoController.criar
   ↓
7. Controller executa
   - Extrai dados: const dados = req.body
   - Cria documento: const treino = new Treino(dados)
   - Validações do Schema executam automaticamente
   - Middleware pre('save') executa
   - Salva no banco: await treino.save()
   ↓
8. MongoDB Atlas
   - Recebe o documento
   - Cria _id automático
   - Adiciona createdAt/updatedAt
   - Armazena na collection 'treinos'
   ↓
9. Controller envia resposta
   res.status(201).json({ sucesso: true, dados: treino })
   ↓
10. Cliente recebe
    Status: 201 Created
    Body: { "sucesso": true, "dados": { "_id": "...", ... } }
```

---

## Testando a API

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/treinos | Lista treinos (com filtros) |
| GET | /api/treinos/:id | Busca por ID |
| GET | /api/treinos/stats | Estatísticas |
| POST | /api/treinos | Cria treino |
| PUT | /api/treinos/:id | Atualiza treino |
| DELETE | /api/treinos/:id | Remove treino |
| POST | /api/treinos/:id/exercicios | Adiciona exercício |
| PUT | /api/treinos/:id/exercicios/:exId | Atualiza exercício |
| DELETE | /api/treinos/:id/exercicios/:exId | Remove exercício |

### Exemplos de Requisições

#### Criar Treino

```http
POST /api/treinos
Content-Type: application/json

{
  "tipo": "A",
  "nome": "Peito e Tríceps",
  "data": "2025-01-15",
  "exercicios": [
    {
      "nome": "Supino Reto",
      "grupoMuscular": "Peito",
      "series": [
        { "carga": 60, "repeticoes": 12 },
        { "carga": 70, "repeticoes": 10 },
        { "carga": 80, "repeticoes": 8 }
      ]
    }
  ]
}
```

#### Listar com Filtros

```http
GET /api/treinos?tipo=A&dataInicio=2025-01-01&limite=10&pagina=1
```

#### Adicionar Exercício

```http
POST /api/treinos/507f1f77bcf86cd799439011/exercicios
Content-Type: application/json

{
  "nome": "Tríceps Corda",
  "grupoMuscular": "Tríceps",
  "series": [
    { "carga": 20, "repeticoes": 15 },
    { "carga": 25, "repeticoes": 12 }
  ]
}
```

### Códigos de Status HTTP

| Código | Significado | Quando usar |
|--------|-------------|-------------|
| 200 | OK | Sucesso em GET, PUT, DELETE |
| 201 | Created | Sucesso em POST (criação) |
| 400 | Bad Request | Dados inválidos |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro não tratado |

---

## Conceitos Aprendidos

### Mongoose

- **Schema** — Define estrutura dos documentos
- **Model** — Interface para operações no banco
- **Validações** — required, min, max, enum, custom
- **Virtuals** — Campos calculados em tempo real
- **Índices** — Otimização de buscas
- **Métodos de Instância** — Operam em um documento
- **Métodos Estáticos** — Operam no Model
- **Middlewares/Hooks** — pre/post save, find, etc
- **Sub-documentos** — Documentos aninhados

### Express

- **Router** — Agrupa rotas relacionadas
- **req.params** — Parâmetros de rota (`:id`)
- **req.query** — Query string (`?filtro=valor`)
- **req.body** — Corpo da requisição (JSON)
- **res.status()** — Define código HTTP
- **res.json()** — Envia resposta JSON

### MongoDB

- **Operadores de comparação** — $gte, $lte, $eq, $ne
- **Aggregation** — Pipeline de processamento
- **ObjectId** — Identificador único de documentos
- **Collections** — Agrupamento de documentos

### Padrões de API REST

- **Verbos HTTP** — GET (ler), POST (criar), PUT (atualizar), DELETE (remover)
- **URLs como recursos** — /treinos, /treinos/:id
- **Respostas padronizadas** — { sucesso, dados/erro }
- **Códigos de status** — 200, 201, 400, 404, 500

---

## Checklist da Fase

- [x] Configurar Express com rotas
- [x] Criar Schema de Exercício
- [x] Criar Schema de Treino
- [x] Implementar validações
- [x] Criar virtuals (volumeTotal, etc)
- [x] Criar índices para otimização
- [x] Implementar métodos de instância
- [x] Implementar métodos estáticos
- [x] Criar Controller de Treinos
- [x] Implementar CRUD completo
- [x] Implementar operações com exercícios
- [x] Implementar estatísticas
- [x] Criar rotas da API
- [x] Testar endpoints
- [x] Verificar dados no MongoDB Compass
- [x] Documentar código e conceitos

---

## Próximos Passos

Na **Fase 3**, vamos criar o Frontend com React:

1. Setup do projeto com Vite
2. Estrutura de componentes
3. Integração com a API
4. Formulários e validação
5. Navegação entre páginas

[Continuar para Fase 3 →](./FASE-03-FRONTEND.md)

---

*Documentação criada em Novembro/2025 — Projeto PDI FitTracker*
