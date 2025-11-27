# 🏋️ FitTracker - Roadmap de Desenvolvimento

## Visão Geral

**Projeto:** Aplicação full-stack para rastreamento de treinos  
**Desenvolvedor:** Igor  
**Objetivo PDI:** Aprimorar habilidades técnicas em desenvolvimento web  
**Início:** Novembro/2025

---

## Stack Tecnológica

| Camada | Tecnologia | Status |
|--------|------------|--------|
| Backend | Node.js + Express | 🔲 Pendente |
| Banco de Dados | MongoDB Atlas | 🔲 Pendente |
| Frontend | React + Vite | 🔲 Pendente |
| Gráficos | Recharts | 🔲 Pendente |
| Testes E2E | Cypress | 🔲 Pendente |

---

## Fase 1: Fundação e Setup 🏗️

**Duração estimada:** 1 semana  
**Status:** 🟡 Em andamento

### Checklist

- [ ] 1.1 Configurar ambiente de desenvolvimento
  - [ ] Verificar Node.js instalado (v18+)
  - [ ] Verificar npm/yarn
  - [ ] Instalar extensões VS Code recomendadas

- [ ] 1.2 Criar estrutura do projeto
  - [ ] Criar pasta raiz `fittracker`
  - [ ] Inicializar `backend/` com npm init
  - [ ] Criar estrutura de pastas do backend

- [ ] 1.3 Configurar MongoDB Atlas
  - [ ] Criar conta no MongoDB Atlas
  - [ ] Criar cluster gratuito (M0)
  - [ ] Configurar usuário de banco
  - [ ] Obter connection string
  - [ ] Configurar Network Access

- [ ] 1.4 Conexão inicial com banco
  - [ ] Instalar mongoose
  - [ ] Criar arquivo de configuração de conexão
  - [ ] Testar conexão com sucesso

- [ ] 1.5 Configurar Git
  - [ ] Inicializar repositório
  - [ ] Criar .gitignore
  - [ ] Primeiro commit

### Entregáveis da Fase 1
- Projeto Node.js inicializado
- Conexão funcional com MongoDB Atlas
- Repositório Git configurado

---

## Fase 2: Backend/API 🔧

**Duração estimada:** 2 semanas  
**Status:** 🔲 Pendente

### Checklist

- [ ] 2.1 Configurar Express
  - [ ] Instalar express e dependências
  - [ ] Criar servidor básico
  - [ ] Configurar middlewares (cors, json)

- [ ] 2.2 Modelagem de Dados
  - [ ] Schema: Usuario
  - [ ] Schema: Treino
  - [ ] Schema: Exercicio

- [ ] 2.3 Endpoints de Treino
  - [ ] POST /api/treinos (criar)
  - [ ] GET /api/treinos (listar todos)
  - [ ] GET /api/treinos/:id (buscar um)
  - [ ] PUT /api/treinos/:id (atualizar)
  - [ ] DELETE /api/treinos/:id (remover)

- [ ] 2.4 Endpoints de Exercício
  - [ ] POST /api/exercicios
  - [ ] GET /api/exercicios
  - [ ] GET /api/exercicios/historico/:nome

- [ ] 2.5 Validações e Erros
  - [ ] Middleware de tratamento de erros
  - [ ] Validação de dados de entrada
  - [ ] Mensagens de erro padronizadas

- [ ] 2.6 Documentação
  - [ ] README com endpoints
  - [ ] Exemplos de requisições

### Entregáveis da Fase 2
- API RESTful funcional
- CRUD completo de treinos e exercícios
- Documentação da API

---

## Fase 3: Frontend Base ⚛️

**Duração estimada:** 2 semanas  
**Status:** 🔲 Pendente

### Checklist

- [ ] 3.1 Setup do Projeto React
  - [ ] Criar projeto com Vite
  - [ ] Configurar estrutura de pastas
  - [ ] Instalar dependências (axios, react-router)

- [ ] 3.2 Layout e Navegação
  - [ ] Componente Header
  - [ ] Componente Sidebar/Menu
  - [ ] Configurar rotas

- [ ] 3.3 Páginas Principais
  - [ ] Home/Dashboard
  - [ ] Lista de Treinos
  - [ ] Cadastro de Treino
  - [ ] Detalhes do Treino

- [ ] 3.4 Integração com API
  - [ ] Configurar serviço de API
  - [ ] Hooks customizados (useTreinos, etc)
  - [ ] Tratamento de loading/erro

- [ ] 3.5 Formulários
  - [ ] Form de novo treino
  - [ ] Form de adicionar exercício
  - [ ] Validação de campos

### Entregáveis da Fase 3
- Interface funcional navegável
- Integração completa com backend
- Formulários com validação

---

## Fase 4: Visualização e Gráficos 📊

**Duração estimada:** 1 semana  
**Status:** 🔲 Pendente

### Checklist

- [ ] 4.1 Setup Recharts
  - [ ] Instalar recharts
  - [ ] Criar componentes de gráfico base

- [ ] 4.2 Gráficos de Evolução
  - [ ] Gráfico de linha: evolução de carga
  - [ ] Gráfico de barras: volume por treino
  - [ ] Tooltip e legendas

- [ ] 4.3 Dashboard
  - [ ] Card: Total de treinos
  - [ ] Card: Frequência semanal
  - [ ] Card: Exercício mais trabalhado
  - [ ] Gráfico resumo

- [ ] 4.4 Filtros
  - [ ] Filtro por período
  - [ ] Filtro por tipo de treino
  - [ ] Filtro por grupo muscular

### Entregáveis da Fase 4
- Dashboard com métricas visuais
- Gráficos interativos de evolução
- Sistema de filtros funcional

---

## Fase 5: Polimento ✨

**Duração estimada:** 1 semana  
**Status:** 🔲 Pendente

### Checklist

- [ ] 5.1 Responsividade
  - [ ] Layout mobile-first
  - [ ] Breakpoints tablet/desktop
  - [ ] Menu mobile

- [ ] 5.2 Feedback Visual
  - [ ] Loading states
  - [ ] Toast notifications
  - [ ] Animações sutis

- [ ] 5.3 Estados Vazios
  - [ ] Tela sem treinos
  - [ ] Gráfico sem dados
  - [ ] Mensagens amigáveis

- [ ] 5.4 UX Improvements
  - [ ] Atalhos de teclado
  - [ ] Confirmação de exclusão
  - [ ] Persistência de filtros

### Entregáveis da Fase 5
- Aplicação responsiva
- Experiência de usuário polida
- Estados de interface tratados

---

## Fase 6: Testes Cypress 🧪

**Duração estimada:** 1 semana  
**Status:** 🔲 Pendente

### Checklist

- [ ] 6.1 Setup Cypress
  - [ ] Instalar e configurar Cypress
  - [ ] Estrutura de pastas de testes
  - [ ] Configurar comandos customizados

- [ ] 6.2 Testes de Fluxo Principal
  - [ ] Teste: Criar novo treino
  - [ ] Teste: Adicionar exercício ao treino
  - [ ] Teste: Visualizar histórico

- [ ] 6.3 Testes de Formulário
  - [ ] Teste: Validação de campos obrigatórios
  - [ ] Teste: Submissão com sucesso
  - [ ] Teste: Tratamento de erro

- [ ] 6.4 Testes de Visualização
  - [ ] Teste: Dashboard carrega corretamente
  - [ ] Teste: Gráficos renderizam
  - [ ] Teste: Filtros funcionam

- [ ] 6.5 Documentação de Testes
  - [ ] README de testes
  - [ ] Convenções e padrões

### Entregáveis da Fase 6
- Suite de testes E2E completa
- Testes automatizados dos fluxos críticos
- Documentação de testes

---

## Cronograma Resumido

```
Semana 1  ████░░░░░░░░░░░░  Fase 1: Setup
Semana 2  ░░░░████░░░░░░░░  Fase 2: Backend (parte 1)
Semana 3  ░░░░████░░░░░░░░  Fase 2: Backend (parte 2)
Semana 4  ░░░░░░░░████░░░░  Fase 3: Frontend (parte 1)
Semana 5  ░░░░░░░░████░░░░  Fase 3: Frontend (parte 2)
Semana 6  ░░░░░░░░░░░░██░░  Fase 4: Gráficos
Semana 7  ░░░░░░░░░░░░░░██  Fase 5: Polimento
Semana 8  ░░░░░░░░░░░░░░██  Fase 6: Testes Cypress
```

---

## Registro de Progresso

| Data | Fase | Atividade | Status |
|------|------|-----------|--------|
| -- | 1 | Início do projeto | 🟡 |

---

## Links Úteis

- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [React Documentation](https://react.dev)
- [Recharts](https://recharts.org)
- [Cypress Documentation](https://docs.cypress.io)

---

## Notas e Aprendizados

> Espaço para registrar insights, dificuldades superadas e conceitos aprendidos durante o desenvolvimento.

### Fase 1


### Fase 2


### Fase 3


### Fase 4


### Fase 5


### Fase 6

