# 📚 Fase 1: Fundação e Setup

## Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Dependências](#dependências)
4. [Arquivos de Configuração](#arquivos-de-configuração)
5. [Entendendo o server.js](#entendendo-o-serverjs)
6. [Entendendo os Middlewares](#entendendo-os-middlewares)
7. [Conexão com MongoDB](#conexão-com-mongodb)
8. [Conceitos Aprendidos](#conceitos-aprendidos)
9. [Checklist da Fase](#checklist-da-fase)

---

## Visão Geral

A Fase 1 estabelece a **fundação** do projeto FitTracker. Nesta etapa, configuramos:

- Ambiente de desenvolvimento Node.js
- Estrutura de pastas organizada
- Servidor Express básico
- Conexão com MongoDB Atlas
- Controle de versão com Git

**Objetivo:** Ter uma API funcionando que responde requisições e conecta ao banco de dados.

---

## Estrutura do Projeto

```
fittracker/
├── README.md                 # Documentação principal do projeto
├── ROADMAP.md                # Roadmap com checklist de todas as fases
├── .gitignore                # Arquivos ignorados pelo Git
├── docs/                     # Documentação detalhada
│   └── FASE-01-FUNDACAO.md   # Este arquivo
└── backend/
    ├── package.json          # Configuração e dependências do Node.js
    ├── package-lock.json     # Lock das versões das dependências
    ├── .env.example          # Template de variáveis de ambiente
    ├── .env                  # Variáveis de ambiente (NÃO commitado)
    └── src/
        ├── server.js         # Ponto de entrada da aplicação
        ├── config/
        │   └── database.js   # Configuração de conexão MongoDB
        ├── controllers/      # Lógica dos endpoints (Fase 2)
        ├── middlewares/      # Middlewares customizados (Fase 2)
        ├── models/           # Schemas Mongoose (Fase 2)
        └── routes/           # Definição de rotas (Fase 2)
```

### Por que essa estrutura?

| Pasta | Responsabilidade |
|-------|------------------|
| `config/` | Configurações da aplicação (banco, autenticação, etc) |
| `controllers/` | Lógica de negócio dos endpoints |
| `middlewares/` | Funções intermediárias de processamento |
| `models/` | Definição da estrutura dos dados |
| `routes/` | Mapeamento de URLs para controllers |

Essa separação segue o padrão **MVC (Model-View-Controller)** adaptado para APIs, facilitando manutenção e escalabilidade.

---

## Dependências

### Dependências de Produção

```json
{
  "express": "^5.1.0",
  "mongoose": "^9.0.0",
  "dotenv": "^17.2.3",
  "cors": "^2.8.5"
}
```

| Pacote | Descrição |
|--------|-----------|
| **express** | Framework web minimalista para Node.js. Facilita criação de APIs REST com rotas, middlewares e tratamento de requisições. |
| **mongoose** | ODM (Object Document Mapper) para MongoDB. Permite definir schemas, validações e trabalhar com o banco de forma orientada a objetos. |
| **dotenv** | Carrega variáveis de ambiente do arquivo `.env` para `process.env`. Essencial para manter credenciais fora do código. |
| **cors** | Middleware que habilita Cross-Origin Resource Sharing. Permite que o frontend acesse a API de uma origem diferente. |

### Dependências de Desenvolvimento

```json
{
  "nodemon": "^3.1.11"
}
```

| Pacote | Descrição |
|--------|-----------|
| **nodemon** | Monitora alterações nos arquivos e reinicia o servidor automaticamente. Agiliza o desenvolvimento. |

### Comandos npm

```bash
npm start     # Inicia o servidor (produção)
npm run dev   # Inicia com nodemon (desenvolvimento)
```

---

## Arquivos de Configuração

### .env.example

```env
# Porta do servidor (padrão: 3000)
PORT=3000

# String de conexão do MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/fittracker

# Ambiente (development, production, test)
NODE_ENV=development
```

**Por que usar .env?**

1. **Segurança:** Credenciais não ficam expostas no código
2. **Flexibilidade:** Diferentes valores para dev/produção
3. **Praticidade:** Fácil alterar configurações sem modificar código

**Importante:** O arquivo `.env` está no `.gitignore` e NUNCA deve ser commitado.

### .gitignore

```gitignore
# Dependências
node_modules/

# Variáveis de ambiente (NUNCA commitar!)
.env

# Logs
*.log

# Sistema operacional
.DS_Store
```

**Por que ignorar esses arquivos?**

- `node_modules/` → Recriado com `npm install`, muito grande para versionamento
- `.env` → Contém credenciais sensíveis
- `*.log` → Arquivos temporários de debug
- `.DS_Store` → Arquivos de sistema do macOS

---

## Entendendo o server.js

O `server.js` é o **ponto de entrada** da aplicação. Vamos analisar cada seção:

### 1. Carregamento de Módulos

```javascript
// Carrega variáveis de ambiente ANTES de qualquer outra coisa
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
```

**Ordem importa!** O `dotenv` deve ser carregado primeiro para que `process.env.MONGODB_URI` esteja disponível quando `database.js` for executado.

### 2. Inicialização do Express

```javascript
const app = express();
```

Cria uma instância do Express. O objeto `app` é usado para:
- Registrar middlewares
- Definir rotas
- Configurar o servidor

### 3. Registro de Middlewares

```javascript
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

O método `app.use()` registra middlewares que serão executados em **todas** as requisições.

### 4. Definição de Rotas

```javascript
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: '🏋️ FitTracker API está funcionando!'
  });
});
```

Define uma rota GET na raiz. Útil para verificar se a API está no ar.

### 5. Tratamento de Erros

```javascript
// 404 - Rota não encontrada
app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler global
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

Middlewares de erro sempre vêm **depois** das rotas.

### 6. Inicialização do Servidor

```javascript
const startServer = async () => {
  await connectDB();        // Conecta ao banco primeiro
  app.listen(PORT, () => {  // Depois inicia o servidor
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

startServer();
```

Usamos `async/await` para garantir que o banco esteja conectado antes de aceitar requisições.

---

## Entendendo os Middlewares

### O que são Middlewares?

Middlewares são funções que interceptam requisições **antes** de chegarem às rotas finais. Funcionam como uma "esteira de processamento":

```
Requisição HTTP
      ↓
   [Middleware 1]  → Processa e chama next()
      ↓
   [Middleware 2]  → Processa e chama next()
      ↓
   [Rota Final]    → Envia resposta
      ↓
   Resposta HTTP
```

### Anatomia de um Middleware

```javascript
function meuMiddleware(req, res, next) {
  // req  = objeto da requisição (dados enviados pelo cliente)
  // res  = objeto da resposta (métodos para responder)
  // next = função que passa para o próximo middleware
  
  // Faça algo aqui...
  
  next(); // IMPORTANTE: sem isso, a requisição "trava"
}
```

### Middlewares do FitTracker

#### 1. CORS (Cross-Origin Resource Sharing)

```javascript
app.use(cors());
```

**Problema que resolve:** Por segurança, navegadores bloqueiam requisições entre origens diferentes (ex: frontend em `localhost:5173` chamando API em `localhost:3000`).

**O que faz:** Adiciona headers HTTP que autorizam requisições de outras origens.

**Headers adicionados:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
```

**Sem ele:** O React não conseguiria consumir a API — o navegador bloquearia com erro de CORS.

---

#### 2. JSON Parser

```javascript
app.use(express.json());
```

**Problema que resolve:** O body das requisições chega como texto bruto (string JSON).

**O que faz:** Converte automaticamente JSON para objeto JavaScript.

**Exemplo:**

```javascript
// Requisição POST com body:
// '{"nome": "Supino", "carga": 80}'

// ANTES do middleware:
console.log(req.body);  // undefined

// DEPOIS do middleware:
console.log(req.body);  // { nome: "Supino", carga: 80 }
console.log(req.body.nome);  // "Supino"
```

**Sem ele:** `req.body` seria sempre `undefined`.

---

#### 3. URL Encoded Parser

```javascript
app.use(express.urlencoded({ extended: true }));
```

**Problema que resolve:** Formulários HTML tradicionais enviam dados no formato `application/x-www-form-urlencoded`.

**O que faz:** Converte dados de formulário para objeto JavaScript.

**Formato de entrada:**
```
nome=Supino&carga=80&series[0]=10&series[1]=8
```

**Resultado:**
```javascript
{
  nome: "Supino",
  carga: "80",
  series: ["10", "8"]
}
```

**O parâmetro `extended: true`:** Permite parsing de objetos aninhados e arrays. Com `false`, apenas strings simples são suportadas.

---

#### 4. Logger de Desenvolvimento

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
  });
}
```

**O que faz:** Exibe no terminal cada requisição recebida.

**Saída no terminal:**
```
📨 GET /
📨 POST /api/treinos
📨 GET /api/treinos/123
📨 DELETE /api/treinos/456
```

**Por que só em development?** Em produção, logs excessivos podem:
- Impactar performance
- Poluir arquivos de log
- Expor informações sensíveis

**O `next()` é essencial:** Sem ele, a requisição para nesse middleware e nunca chega às rotas.

---

#### 5. Handler de Rota Não Encontrada (404)

```javascript
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method
  });
});
```

**Posição:** Vem **depois** de todas as rotas.

**Por quê?** O Express executa middlewares em ordem. Se a requisição passou por todas as rotas e nenhuma respondeu, esse middleware "captura" e retorna 404.

**Exemplo de resposta:**
```json
{
  "error": "Rota não encontrada",
  "path": "/api/usuarios",
  "method": "GET"
}
```

---

#### 6. Error Handler Global

```javascript
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err.message);
  
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

**Como o Express identifica?** Middlewares com **4 parâmetros** (`err, req, res, next`) são tratados como error handlers.

**Quando é acionado?** Quando algum código lança erro ou chama `next(error)`:

```javascript
// Exemplo em uma rota:
app.get('/api/treinos/:id', async (req, res, next) => {
  try {
    const treino = await Treino.findById(req.params.id);
    res.json(treino);
  } catch (error) {
    next(error);  // Passa o erro para o error handler
  }
});
```

**Stack trace condicional:** Em desenvolvimento, incluímos `err.stack` para debug. Em produção, ocultamos para não expor detalhes internos.

---

### Fluxo Completo de uma Requisição

```
Cliente envia: POST /api/treinos
Body: { "tipo": "A", "data": "2025-01-15" }

      ↓
   [cors]           → Adiciona headers CORS
      ↓
   [express.json]   → Parseia body JSON → req.body disponível
      ↓
   [urlencoded]     → (não usado nessa requisição)
      ↓
   [logger]         → Console: "📨 POST /api/treinos"
      ↓
   [rota POST]      → Controller processa e salva no banco
      ↓
   Resposta: 201 Created
   { "id": "abc123", "tipo": "A", "data": "2025-01-15" }
```

---

## Conexão com MongoDB

### Arquivo database.js

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    
    // Listeners para monitoramento
    mongoose.connection.on('error', (err) => {
      console.error(`❌ Erro: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ Erro ao conectar: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Conceitos Importantes

#### Connection String

```
mongodb+srv://usuario:senha@cluster.mongodb.net/fittracker?retryWrites=true&w=majority
```

| Parte | Significado |
|-------|-------------|
| `mongodb+srv://` | Protocolo MongoDB com DNS seedlist |
| `usuario:senha` | Credenciais de autenticação |
| `cluster.mongodb.net` | Host do cluster Atlas |
| `/fittracker` | Nome do banco de dados |
| `?retryWrites=true` | Retry automático em falhas de escrita |
| `&w=majority` | Write concern - confirma escrita na maioria dos nós |

#### Mongoose Events

```javascript
mongoose.connection.on('connected', () => {});     // Conexão estabelecida
mongoose.connection.on('error', (err) => {});      // Erro na conexão
mongoose.connection.on('disconnected', () => {});  // Conexão perdida
```

#### Graceful Shutdown

```javascript
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
```

**SIGINT** é o sinal enviado quando você pressiona `Ctrl+C`. Esse código garante que a conexão com o banco seja fechada corretamente antes do processo encerrar.

---

## Conceitos Aprendidos

### Node.js

- **Runtime JavaScript** no servidor
- **npm** como gerenciador de pacotes
- **package.json** como manifesto do projeto
- **scripts npm** para automatizar tarefas

### Express

- **Framework web** minimalista
- **Middlewares** como pipeline de processamento
- **Rotas** para mapear URLs a funções
- **app.use()** vs **app.get/post/put/delete()**

### MongoDB & Mongoose

- **NoSQL** vs SQL
- **Documentos** vs Registros
- **Collections** vs Tabelas
- **Connection string** e autenticação
- **ODM** (Object Document Mapper)

### Boas Práticas

- **Variáveis de ambiente** para configurações sensíveis
- **Estrutura de pastas** organizada (MVC)
- **Tratamento de erros** centralizado
- **Graceful shutdown** para encerramento limpo

---

## Checklist da Fase

- [x] Verificar Node.js instalado (v18+)
- [x] Verificar npm
- [x] Criar pasta raiz `fittracker`
- [x] Inicializar `backend/` com npm init
- [x] Criar estrutura de pastas do backend
- [x] Criar conta no MongoDB Atlas
- [x] Criar cluster gratuito (M0)
- [x] Configurar usuário de banco
- [x] Obter connection string
- [x] Configurar Network Access
- [x] Instalar mongoose e dependências
- [x] Criar arquivo de configuração de conexão
- [x] Testar conexão com sucesso
- [x] Criar .gitignore
- [x] Documentar código e conceitos

---

## Próximos Passos

Na **Fase 2**, vamos criar:

1. **Models** — Schemas para Treino e Exercício
2. **Routes** — Endpoints da API REST
3. **Controllers** — Lógica de negócio

[Continuar para Fase 2 →](./FASE-02-BACKEND.md)

---

*Documentação criada em Novembro/2025 — Projeto PDI FitTracker*
