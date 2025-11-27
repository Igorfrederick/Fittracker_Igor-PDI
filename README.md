# 🏋️ FitTracker

Aplicação full-stack para rastreamento de treinos, desenvolvida como projeto de PDI para aprimoramento de habilidades técnicas.

## 📋 Sobre o Projeto

O FitTracker permite:
- Cadastrar treinos (A, B, C, Push/Pull/Legs, etc.)
- Registrar exercícios com séries, cargas e repetições
- Visualizar evolução através de gráficos
- Acompanhar histórico completo de treinos

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Backend | Node.js + Express |
| Banco de Dados | MongoDB Atlas |
| Frontend | React + Vite |
| Gráficos | Recharts |
| Testes E2E | Cypress |

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no MongoDB Atlas (gratuita)

### Backend

```bash
# Acesse a pasta do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com sua connection string do MongoDB

# Execute em desenvolvimento
npm run dev
```

### Frontend

```bash
# Acesse a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev
```

## 📁 Estrutura do Projeto

```
fittracker/
├── backend/
│   ├── src/
│   │   ├── config/       # Configurações (DB, etc)
│   │   ├── controllers/  # Lógica dos endpoints
│   │   ├── middlewares/  # Middlewares Express
│   │   ├── models/       # Schemas Mongoose
│   │   ├── routes/       # Definição de rotas
│   │   └── server.js     # Entrada da aplicação
│   ├── .env.example
│   └── package.json
├── frontend/
│   └── (a ser criado na Fase 3)
├── cypress/
│   └── (a ser criado na Fase 6)
├── ROADMAP.md
└── README.md
```

## 📈 Roadmap

Consulte o arquivo [ROADMAP.md](./ROADMAP.md) para acompanhar o progresso do desenvolvimento.

## 🧪 Testes

```bash
# Testes E2E com Cypress (Fase 6)
npm run cypress:open
```

## 📝 Licença

MIT

---

Desenvolvido como projeto de PDI por Igor | 2025
