# 🏋️ FitTracker

Aplicação full-stack para rastreamento de treinos, desenvolvida como projeto de PDI (Plano de Desenvolvimento Individual) para aprimoramento de habilidades técnicas em desenvolvimento web.

## ✨ Funcionalidades

- ✅ **Dashboard** com estatísticas e resumo dos treinos
- ✅ **Cadastro de treinos** com tipo (A, B, C, Push, Pull, Legs, etc.)
- ✅ **Gerenciamento de exercícios** com séries, cargas e repetições
- ✅ **Visualização detalhada** de cada treino com volume e métricas
- ✅ **Filtros e busca** por tipo e período
- ✅ **Responsividade** para uso em dispositivos móveis
- ✅ **Testes E2E com Cypress** - 87 testes (57 API + 30 UI)
- 🔄 **Gráficos de evolução** (planejado para versão futura)

## 🛠️ Stack Tecnológica

### Backend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Node.js | 18+ | Runtime JavaScript |
| Express | 5.x | Framework web |
| Mongoose | 9.x | ODM para MongoDB |
| MongoDB Atlas | - | Banco de dados na nuvem |

### Frontend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 19.x | Biblioteca UI |
| Vite | 6.x | Build tool |
| React Router | 7.x | Roteamento SPA |
| Axios | 1.x | Cliente HTTP |
| Lucide React | - | Ícones |
| date-fns | - | Manipulação de datas |

### Testes
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Cypress | 13.x | Testes E2E |
| Faker.js | 9.x | Geração de dados fake |
| AJV | 8.x | Validação de schemas |
| @cypress/grep | - | Filtros por tags |

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (gratuita)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/fittracker.git
cd fittracker
```

### 2. Configure o Backend

```bash
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env` com sua connection string do MongoDB Atlas:

```env
PORT=3000
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/fittracker
NODE_ENV=development
```

Inicie o servidor:

```bash
npm run dev
```

O backend estará rodando em `http://localhost:3000`

### 3. Configure o Frontend

Em outro terminal:

```bash
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
fittracker/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuração do banco de dados
│   │   ├── controllers/     # Lógica dos endpoints
│   │   ├── models/          # Schemas Mongoose
│   │   ├── routes/          # Definição de rotas
│   │   └── server.js        # Ponto de entrada
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   │   ├── layout/      # Header, Layout
│   │   │   └── ui/          # Botões, Cards, Modais
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Comunicação com API
│   │   ├── utils/           # Helpers e constantes
│   │   ├── styles/          # CSS global
│   │   └── App.jsx          # Componente raiz
│   └── package.json
│
├── cypress/                # Testes E2E
│   ├── e2e/
│   │   ├── treinos/        # 57 testes de API
│   │   └── treinos-ui/     # 30 testes de UI
│   ├── support/
│   │   ├── Commands/       # Comandos customizados
│   │   ├── Models/         # Models de teste
│   │   ├── Adapters/       # Adaptadores
│   │   ├── Library/        # Fábrica de dados fake
│   │   ├── PageObjects/    # Page Objects (UI)
│   │   └── Contracts/      # Schemas de validação
│   └── fixtures/           # Dados estáticos
│
├── docs/                   # Documentação técnica
│   ├── FASE-01-FUNDACAO.md
│   ├── FASE-02-BACKEND.md
│   ├── FASE-03-FRONTEND.md
│   ├── RESUMO-TESTES-E2E.md
│   ├── ESTRUTURA-TESTES-UI.md
│   └── ROTEIRO-TESTES-CYPRESS.md
│
├── ROADMAP.md              # Planejamento do projeto
└── README.md
```

## 📡 API Endpoints

### Treinos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/treinos` | Lista treinos (com filtros) |
| GET | `/api/treinos/:id` | Busca treino por ID |
| GET | `/api/treinos/stats` | Estatísticas gerais |
| POST | `/api/treinos` | Cria novo treino |
| PUT | `/api/treinos/:id` | Atualiza treino |
| DELETE | `/api/treinos/:id` | Remove treino |

### Exercícios (dentro de treinos)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/treinos/:id/exercicios` | Adiciona exercício |
| PUT | `/api/treinos/:id/exercicios/:exId` | Atualiza exercício |
| DELETE | `/api/treinos/:id/exercicios/:exId` | Remove exercício |

### Filtros disponíveis (GET /api/treinos)

| Parâmetro | Tipo | Exemplo |
|-----------|------|---------|
| tipo | string | `?tipo=A` |
| dataInicio | date | `?dataInicio=2025-01-01` |
| dataFim | date | `?dataFim=2025-01-31` |
| concluido | boolean | `?concluido=true` |
| limite | number | `?limite=10` |
| pagina | number | `?pagina=1` |

## 📊 Modelo de Dados

### Treino

```javascript
{
  tipo: "A",                    // Tipo do treino
  nome: "Peito e Tríceps",      // Nome descritivo (opcional)
  data: "2025-01-15",           // Data do treino
  duracao: 60,                  // Duração em minutos
  exercicios: [...],            // Array de exercícios
  observacao: "...",            // Observações gerais
  concluido: false              // Status de conclusão
}
```

### Exercício

```javascript
{
  nome: "Supino Reto",
  grupoMuscular: "Peito",       // Enum com grupos válidos
  series: [
    { carga: 60, repeticoes: 12, concluida: false },
    { carga: 70, repeticoes: 10, concluida: false },
    { carga: 80, repeticoes: 8, concluida: false }
  ],
  observacao: "Manter cotovelos a 45°"
}
```

### Grupos Musculares

- Peito, Costas, Ombros
- Bíceps, Tríceps, Antebraço
- Quadríceps, Posterior, Glúteos, Panturrilha
- Abdômen, Corpo Inteiro, Cardio

## 📚 Documentação

A pasta `docs/` contém documentação técnica detalhada de cada fase:

### Documentação de Desenvolvimento

| Documento | Conteúdo |
|-----------|----------|
| [FASE-01-FUNDACAO.md](docs/FASE-01-FUNDACAO.md) | Setup, estrutura, middlewares, conexão MongoDB |
| [FASE-02-BACKEND.md](docs/FASE-02-BACKEND.md) | Models, Controllers, Routes, API REST |
| [FASE-03-FRONTEND.md](docs/FASE-03-FRONTEND.md) | React, componentes, páginas, roteamento |

### Documentação de Testes

| Documento | Conteúdo |
|-----------|----------|
| [RESUMO-TESTES-E2E.md](docs/RESUMO-TESTES-E2E.md) | Resumo completo dos testes E2E, arquitetura e ajustes |
| [ESTRUTURA-TESTES-UI.md](docs/ESTRUTURA-TESTES-UI.md) | Estrutura dos testes de UI, Page Objects e padrões |
| [ROTEIRO-TESTES-CYPRESS.md](docs/ROTEIRO-TESTES-CYPRESS.md) | Roteiro completo de implementação dos testes |

## 🎯 Status do Projeto

| Fase | Descrição | Status |
|------|-----------|--------|
| 1 | Fundação e Setup | ✅ Concluído |
| 2 | Backend/API | ✅ Concluído |
| 3 | Frontend React | ✅ Concluído |
| 4 | Testes E2E Cypress | ✅ Concluído - 87 testes |
| 5 | Gráficos | 🔄 Planejado |
| 6 | Polimento | 🔄 Planejado |

## 🧪 Scripts Disponíveis

### Backend

```bash
npm start      # Inicia em produção
npm run dev    # Inicia com nodemon (desenvolvimento)
```

### Frontend

```bash
npm run dev    # Servidor de desenvolvimento
npm run build  # Build de produção
npm run preview # Preview do build
```

### Testes E2E (Cypress)

#### Pré-requisitos para Testes
- Backend rodando em `http://localhost:3000`
- Frontend rodando em `http://localhost:5173`
- MongoDB conectado

#### Comandos de Teste

```bash
# Modo interativo (recomendado para desenvolvimento)
npm run cy:open

# Testes de API (headless)
npm run test:api:all          # Todos os testes de API (57 testes)
npm run test:api:create       # Testes de criação
npm run test:api:read         # Testes de leitura
npm run test:api:update       # Testes de atualização
npm run test:api:delete       # Testes de exclusão

# Testes de UI (interativo - modo headless não funciona)
npm run test:ui:navigation    # Testes de navegação (10 testes)
npm run test:ui:create        # Testes de criação via UI (9 testes)
npm run test:ui:list          # Testes de listagem (11 testes)

# Testes por tag
npm run test:smoke            # Apenas smoke tests
npm run test:negative         # Apenas testes negativos

# Todos os testes
npm run test:all              # API + UI (87 testes)
```

#### Estrutura dos Testes

**Testes de API** (57 testes):
- ✅ `treinosCreate.cy.js` - 11 testes de criação
- ✅ `treinosRead.cy.js` - 15 testes de leitura
- ✅ `treinosUpdate.cy.js` - 16 testes de atualização
- ✅ `treinosDelete.cy.js` - 15 testes de exclusão

**Testes de UI** (30 testes):
- ✅ `treinosUI_Navigation.cy.js` - 10 testes (10 passing)
- ✅ `treinosUI_Create.cy.js` - 9 testes (8 passing, 1 skipped)
- ✅ `treinosUI_List.cy.js` - 11 testes (9 passing, 2 skipped)

**Arquitetura dos Testes**:
- **Page Objects**: Padrão para testes de UI
- **Commands**: Comandos customizados reutilizáveis
- **Models**: Fábrica de objetos de teste
- **Adapters**: Conversão de dados para API
- **Contracts**: Validação de schemas com AJV

Para mais detalhes, consulte a [documentação completa de testes](docs/RESUMO-TESTES-E2E.md).

## 📝 Licença

MIT

---

Desenvolvido por **Igor** como projeto de PDI | 2025
