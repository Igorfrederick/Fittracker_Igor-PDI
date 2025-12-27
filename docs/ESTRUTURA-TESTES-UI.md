# 📋 Estrutura de Testes de UI - FitTracker

## 🎯 Visão Geral

Testes de interface (UI) criados seguindo o padrão do projeto **nex-web-test**, utilizando **Page Objects** e separação de responsabilidades.

---

## 📁 Estrutura de Arquivos

### **Page Objects** (`cypress/support/PageObjects/`)

Os Page Objects encapsulam seletores e ações de cada página, facilitando manutenção e reutilização.

```
cypress/support/PageObjects/
├── HomePage.js              # Dashboard / Página inicial
├── ListaTreinosPage.js      # Lista de treinos
└── FormTreinoPage.js        # Formulário de criação/edição
```

**Padrão de organização:**
- **elements**: Seletores dos elementos da página
- **Ações**: Métodos para interagir com a página
- **Validações**: Métodos para verificar estados

---

### **Comandos de UI** (`cypress/support/Commands/Treino/`)

Comandos customizados do Cypress para ações comuns de UI.

```
cypress/support/Commands/Treino/
├── Api_commands.js          # Comandos de API (CRUD)
├── Assertions_commands.js   # Validações reutilizáveis
├── Contract_commands.js     # Validação de schemas
├── UI_commands.js           # ⭐ NOVO: Comandos de UI
└── index.js                 # Importa todos os comandos
```

**Comandos disponíveis:**
- `cy.treinoUI_Create(treino)` - Cria treino pela interface
- `cy.treinoUI_GoToList()` - Navega para lista
- `cy.treinoUI_GoToHome()` - Navega para home
- `cy.treinoUI_Delete(index)` - Deleta treino pela UI
- `cy.treinoUI_FilterByTipo(tipo)` - Filtra por tipo
- `cy.treinoUI_Search(text)` - Busca por texto

---

### **Testes de UI** (`cypress/e2e/treinos-ui/`)

Testes organizados por funcionalidade, similar ao padrão API.

```
cypress/e2e/treinos-ui/
├── treinosUI_Navigation.cy.js    # Testes de navegação
├── treinosUI_Create.cy.js        # Testes de criação via UI
└── treinosUI_List.cy.js          # Testes de listagem e filtros
```

---

## 🧪 Arquivos de Teste Criados

### 1. **treinosUI_Navigation.cy.js** - Navegação

**Cobertura:**
- ✅ Navegação entre páginas (Home ↔ Lista ↔ Formulário)
- ✅ Menu de navegação
- ✅ Responsividade (mobile, tablet, desktop)

**Testes:**
- Carregamento da home page
- Navegação para lista de treinos
- Navegação para novo treino
- Voltar ao cancelar
- Links do menu
- Viewports responsivos (375px, 768px, 1920px)

---

### 2. **treinosUI_Create.cy.js** - Criação via Interface

**Cobertura:**
- ✅ Preenchimento de formulário
- ✅ Validações de campos
- ✅ Mensagens de feedback
- ✅ Preenchimento automático

**Testes:**
- Formulário vazio ao carregar
- Criação com dados válidos
- Criação apenas com campos obrigatórios
- Marcar como concluído
- Cancelar criação
- Validações negativas (sem tipo, sem data, duração negativa)
- Data padrão quando não informada
- Mensagem de sucesso

---

### 3. **treinosUI_List.cy.js** - Listagem e Filtros

**Cobertura:**
- ✅ Visualização da lista
- ✅ Filtros (tipo, status)
- ✅ Busca por texto
- ✅ Ações nos cards (ver, editar, excluir)
- ✅ Paginação
- ✅ Estado vazio

**Testes:**
- Exibição de lista de treinos
- Informações nos cards
- Filtro por tipo (A, B, C, etc)
- Filtro por status concluído
- Busca por nome
- Mensagem quando não encontra resultados
- Botões de ação (visualizar, editar, excluir)
- Navegação para detalhes/edição
- Estado vazio sem treinos

---

## 🎨 Padrão Page Object

### **Exemplo de uso:**

```javascript
import HomePage from '../../support/PageObjects/HomePage';

describe('Teste de UI', () => {
  const homePage = new HomePage();

  it('Deve navegar para lista', () => {
    homePage
      .visit()
      .shouldBeVisible()
      .clickVerTodos();

    cy.url().should('include', '/treinos');
  });
});
```

### **Estrutura de um Page Object:**

```javascript
class HomePage {
  // Seletores
  elements = {
    pageTitle: () => cy.contains('h1', 'Dashboard'),
    novoTreinoButton: () => cy.contains('button', 'Novo Treino')
  };

  // Ações
  visit() {
    cy.visit('/');
    return this;
  }

  clickNovoTreino() {
    this.elements.novoTreinoButton().click();
    return this;
  }

  // Validações
  shouldBeVisible() {
    this.elements.pageTitle().should('be.visible');
    return this;
  }
}
```

**Benefícios:**
- ✅ Encapsulamento de seletores
- ✅ Reutilização de código
- ✅ Manutenção facilitada
- ✅ Métodos encadeáveis (fluent interface)
- ✅ Separação de responsabilidades

---

## 📊 Estrutura Completa de Testes

### **Testes de API** (Backend)
```
cypress/e2e/treinos/
├── treinosCreate.cy.js    # 11 testes
├── treinosRead.cy.js      # 15 testes
├── treinosUpdate.cy.js    # 16 testes
└── treinosDelete.cy.js    # 15 testes
Total: 57 testes de API
```

### **Testes de UI** (Frontend)
```
cypress/e2e/treinos-ui/
├── treinosUI_Navigation.cy.js    # 12 testes
├── treinosUI_Create.cy.js        # 11 testes
└── treinosUI_List.cy.js          # 15 testes
Total: 38 testes de UI
```

### **Total Geral: 95 testes E2E** 🎉

---

## 🚀 Como Executar os Testes de UI

### **Modo Interativo** (recomendado para desenvolvimento)
```bash
npm run cy:open
```
Selecione os arquivos em `treinos-ui/`

### **Modo Headless** (CI/CD)

```bash
# Todos os testes de UI
npm run test:ui:all

# Teste específico
npm run test:ui:navigation
npm run test:ui:create
npm run test:ui:list

# Todos os testes (API + UI)
npm run test:all

# Apenas smoke tests
npm run test:smoke
```

---

## ⚙️ Pré-requisitos para Testes de UI

### **1. Backend rodando**
```bash
cd backend
npm run dev
# Deve estar em http://localhost:3000
```

### **2. Frontend rodando**
```bash
cd frontend
npm run dev
# Deve estar em http://localhost:5173
```

### **3. Executar testes**
```bash
npm run cy:open
# ou
npm run test:ui:all
```

---

## 🏗️ Padrão de Desenvolvimento

### **Ao adicionar nova página:**

1. **Criar Page Object** em `cypress/support/PageObjects/NomePage.js`
2. **Adicionar comandos** em `cypress/support/Commands/Treino/UI_commands.js` (se necessário)
3. **Criar arquivo de teste** em `cypress/e2e/treinos-ui/treinosUI_NomeFuncionalidade.cy.js`
4. **Adicionar script** no `package.json`

### **Convenções:**

- **Page Objects**: PascalCase (ex: `HomePage.js`)
- **Arquivos de teste**: `treinosUI_Funcionalidade.cy.js`
- **Comandos**: camelCase com prefixo `treinoUI_` (ex: `treinoUI_Create`)
- **Tags**: `@ui`, `@navigation`, `@create`, `@smoke`, etc.

---

## 📝 Data-TestIds Recomendados

Para facilitar os testes, adicione `data-testid` nos componentes:

```jsx
// Card de treino
<div data-testid="treino-card">
  <span data-testid="tipo">{treino.tipo}</span>
  <h3 data-testid="nome">{treino.nome}</h3>
  <span data-testid="data">{treino.data}</span>
  <span data-testid="status">{treino.concluido ? 'Concluído' : 'Pendente'}</span>
</div>

// Lista de treinos
<div data-testid="treinos-list">
  {/* cards aqui */}
</div>

// Cards de estatísticas
<div data-testid="stats-card">
  {/* conteúdo */}
</div>
```

**Benefícios:**
- ✅ Seletores mais robustos
- ✅ Menos quebras em refatorações de CSS/HTML
- ✅ Melhor legibilidade

---

## 🎯 Próximos Passos (Opcional)

### **Testes de UI adicionais:**

1. **treinosUI_Edit.cy.js** - Edição de treinos via UI
2. **treinosUI_Delete.cy.js** - Exclusão com confirmação
3. **treinosUI_Details.cy.js** - Página de detalhes
4. **treinosUI_Exercises.cy.js** - Gerenciamento de exercícios
5. **treinosUI_Dashboard.cy.js** - Validação de estatísticas

### **Melhorias:**

- Adicionar testes de acessibilidade (a11y)
- Testes de performance (Lighthouse CI)
- Visual regression testing
- Integração com CI/CD (GitHub Actions)

---

## 📚 Referências

- [Cypress Docs](https://docs.cypress.io)
- [Page Object Pattern](https://martinfowler.com/bliki/PageObject.html)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)

---

**Estrutura criada seguindo o padrão do projeto nex-web-test** ✅
