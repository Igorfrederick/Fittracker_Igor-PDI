# 📚 Fase 3: Frontend React

## Índice

1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Configuração e Setup](#configuração-e-setup)
5. [Arquitetura de Componentes](#arquitetura-de-componentes)
6. [Serviço de API](#serviço-de-api)
7. [Páginas da Aplicação](#páginas-da-aplicação)
8. [Estilização](#estilização)
9. [Roteamento](#roteamento)
10. [Conceitos Aprendidos](#conceitos-aprendidos)
11. [Checklist da Fase](#checklist-da-fase)

---

## Visão Geral

A Fase 3 implementa o **Frontend** do FitTracker usando React. Nesta etapa, criamos:

- Interface visual moderna e responsiva
- Integração completa com a API do backend
- Sistema de navegação entre páginas
- Formulários dinâmicos para gerenciar treinos
- Componentes reutilizáveis

**Resultado:** Aplicação web funcional para registrar e acompanhar treinos.

---

## Tecnologias Utilizadas

### Core

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 19.x | Biblioteca para construção de interfaces |
| **Vite** | 6.x | Build tool e dev server ultrarrápido |
| **React Router** | 7.x | Roteamento e navegação SPA |

### Bibliotecas Auxiliares

| Biblioteca | Uso |
|------------|-----|
| **axios** | Requisições HTTP para a API |
| **lucide-react** | Ícones modernos e leves |
| **recharts** | Gráficos (preparado para Fase 4) |
| **date-fns** | Manipulação e formatação de datas |

### Instalação das Dependências

```bash
# Criar projeto React com Vite
npm create vite@latest frontend -- --template react

# Instalar dependências
cd frontend
npm install axios react-router-dom lucide-react recharts date-fns
```

---

## Estrutura do Projeto

```
frontend/
├── index.html              # HTML principal
├── vite.config.js          # Configuração do Vite
├── package.json            # Dependências e scripts
└── src/
    ├── main.jsx            # Ponto de entrada React
    ├── App.jsx             # Componente raiz com rotas
    ├── styles/
    │   └── global.css      # Estilos globais e variáveis CSS
    ├── services/
    │   └── api.js          # Serviço de comunicação com backend
    ├── utils/
    │   ├── constants.js    # Constantes da aplicação
    │   └── helpers.js      # Funções utilitárias
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx      # Navegação superior
    │   │   ├── Header.css
    │   │   ├── Layout.jsx      # Layout principal
    │   │   └── Layout.css
    │   └── ui/
    │       ├── UI.jsx          # Componentes reutilizáveis
    │       └── UI.css
    └── pages/
        ├── Home.jsx            # Dashboard
        ├── Home.css
        ├── ListaTreinos.jsx    # Lista de treinos
        ├── ListaTreinos.css
        ├── FormTreino.jsx      # Criar/Editar treino
        ├── FormTreino.css
        ├── DetalhesTreino.jsx  # Visualizar treino
        └── DetalhesTreino.css
```

### Responsabilidade de Cada Pasta

| Pasta | Responsabilidade |
|-------|------------------|
| `components/` | Componentes reutilizáveis em múltiplas páginas |
| `pages/` | Componentes de página (uma por rota) |
| `services/` | Comunicação com APIs externas |
| `utils/` | Funções auxiliares e constantes |
| `styles/` | Estilos globais e variáveis CSS |

---

## Configuração e Setup

### Arquivo: `main.jsx`

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**Conceitos:**

| Elemento | Explicação |
|----------|------------|
| `StrictMode` | Modo de desenvolvimento que detecta problemas potenciais |
| `createRoot` | API moderna do React 18+ para renderização |
| `document.getElementById('root')` | Elemento HTML onde o React será montado |

### Arquivo: `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

O Vite oferece:
- Hot Module Replacement (HMR) instantâneo
- Build otimizado para produção
- Suporte nativo a ES Modules

---

## Arquitetura de Componentes

### Hierarquia de Componentes

```
App
└── BrowserRouter
    └── Routes
        └── Layout
            ├── Header
            └── Outlet (páginas)
                ├── Home
                ├── ListaTreinos
                ├── FormTreino
                └── DetalhesTreino
```

### Componentes de Layout

#### Header.jsx

Barra de navegação superior com:
- Logo e nome da aplicação
- Links de navegação (Início, Treinos, Novo Treino, Estatísticas)
- Menu responsivo para mobile
- Indicador visual da página ativa

```jsx
const Header = () => {
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  const links = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/treinos', label: 'Treinos', icon: Dumbbell },
    { path: '/treinos/novo', label: 'Novo Treino', icon: PlusCircle },
    { path: '/estatisticas', label: 'Estatísticas', icon: BarChart3 },
  ];

  const isAtivo = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" className="header-logo">
        <Dumbbell size={28} />
        <span>FitTracker</span>
      </Link>

      {/* Navegação */}
      <nav className="header-nav">
        {links.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`header-link ${isAtivo(path) ? 'ativo' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
};
```

**Hooks utilizados:**

| Hook | Uso |
|------|-----|
| `useLocation()` | Obtém informações da URL atual |
| `useState()` | Controla abertura do menu mobile |

#### Layout.jsx

Wrapper que envolve todas as páginas:

```jsx
const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">
        <div className="layout-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
```

**O componente `<Outlet />`:**

É um placeholder do React Router que renderiza o componente filho da rota atual. Permite criar layouts compartilhados.

### Componentes UI Reutilizáveis

Arquivo `UI.jsx` contém componentes genéricos:

#### Loading

```jsx
export const Loading = ({ mensagem = 'Carregando...', fullscreen = false }) => {
  return (
    <div className={`loading ${fullscreen ? 'loading-fullscreen' : ''}`}>
      <Loader2 className="loading-icon animate-spin" size={32} />
      <span className="loading-text">{mensagem}</span>
    </div>
  );
};
```

#### EstadoVazio

```jsx
export const EstadoVazio = ({ 
  titulo = 'Nenhum item encontrado',
  descricao = '',
  acao = null,
  icone: Icone = Inbox
}) => {
  return (
    <div className="estado-vazio">
      <Icone size={48} className="estado-vazio-icon" />
      <h3>{titulo}</h3>
      {descricao && <p>{descricao}</p>}
      {acao && <div>{acao}</div>}
    </div>
  );
};
```

#### PageHeader

```jsx
export const PageHeader = ({ 
  titulo, 
  subtitulo = '', 
  voltar = false,
  acoes = null 
}) => {
  const navigate = useNavigate();

  return (
    <div className="page-header">
      <div className="page-header-content">
        {voltar && (
          <button onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
        )}
        <div>
          <h1>{titulo}</h1>
          {subtitulo && <p>{subtitulo}</p>}
        </div>
      </div>
      {acoes && <div>{acoes}</div>}
    </div>
  );
};
```

#### StatCard

```jsx
export const StatCard = ({ 
  titulo, 
  valor, 
  icone: Icone,
  cor = 'var(--primary)'
}) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span>{titulo}</span>
        {Icone && (
          <div style={{ backgroundColor: `${cor}15`, color: cor }}>
            <Icone size={20} />
          </div>
        )}
      </div>
      <div className="stat-card-valor">{valor}</div>
    </div>
  );
};
```

#### Badges (TipoBadge, GrupoBadge)

```jsx
export const TipoBadge = ({ tipo }) => {
  const cores = {
    'A': '#3b82f6',
    'B': '#22c55e',
    'C': '#f97316',
    // ...
  };

  const cor = cores[tipo?.toUpperCase()] || '#64748b';

  return (
    <span 
      className="tipo-badge"
      style={{ 
        backgroundColor: `${cor}15`,
        color: cor
      }}
    >
      {tipo}
    </span>
  );
};
```

#### ModalConfirmacao

```jsx
export const ModalConfirmacao = ({
  aberto,
  titulo,
  mensagem,
  onConfirmar,
  onCancelar,
  textoBotao = 'Confirmar',
  variante = 'danger'
}) => {
  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{titulo}</h3>
        <p>{mensagem}</p>
        <div className="modal-acoes">
          <button onClick={onCancelar}>Cancelar</button>
          <button className={`btn-${variante}`} onClick={onConfirmar}>
            {textoBotao}
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## Serviço de API

### Arquivo: `services/api.js`

Centraliza toda comunicação com o backend usando axios.

#### Configuração Base

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

#### Interceptors

**Interceptor de Resposta:**

```javascript
api.interceptors.response.use(
  (response) => {
    // Retorna apenas os dados, não o objeto completo
    return response.data;
  },
  (error) => {
    // Tratamento centralizado de erros
    const mensagem = error.response?.data?.erro || 
                     error.message || 
                     'Erro ao conectar com o servidor';
    
    return Promise.reject({ mensagem, status: error.response?.status });
  }
);
```

**Benefícios dos interceptors:**

- Simplifica o código nas páginas (não precisa fazer `.then(res => res.data)`)
- Tratamento de erro padronizado
- Local único para adicionar autenticação futuramente

#### Serviço de Treinos

```javascript
export const treinoService = {
  // Lista treinos com filtros
  listar: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
    if (filtros.limite) params.append('limite', filtros.limite);
    if (filtros.pagina) params.append('pagina', filtros.pagina);
    
    const queryString = params.toString();
    return api.get(`/treinos${queryString ? `?${queryString}` : ''}`);
  },

  // Busca por ID
  buscarPorId: async (id) => {
    return api.get(`/treinos/${id}`);
  },

  // Cria novo treino
  criar: async (dados) => {
    return api.post('/treinos', dados);
  },

  // Atualiza treino
  atualizar: async (id, dados) => {
    return api.put(`/treinos/${id}`, dados);
  },

  // Remove treino
  remover: async (id) => {
    return api.delete(`/treinos/${id}`);
  },

  // Estatísticas
  estatisticas: async () => {
    return api.get('/treinos/stats');
  },

  // Operações com exercícios
  adicionarExercicio: async (treinoId, exercicio) => {
    return api.post(`/treinos/${treinoId}/exercicios`, exercicio);
  },

  atualizarExercicio: async (treinoId, exercicioId, dados) => {
    return api.put(`/treinos/${treinoId}/exercicios/${exercicioId}`, dados);
  },

  removerExercicio: async (treinoId, exercicioId) => {
    return api.delete(`/treinos/${treinoId}/exercicios/${exercicioId}`);
  }
};
```

---

## Páginas da Aplicação

### 1. Home (Dashboard)

**Arquivo:** `pages/Home.jsx`

**Funcionalidades:**
- Cards de estatísticas (total de treinos, semana, concluídos, tempo)
- Treinos agrupados por tipo
- Lista dos últimos treinos
- Acesso rápido para criar novo treino

**Estrutura:**

```jsx
const Home = () => {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [estatisticas, setEstatisticas] = useState(null);
  const [ultimosTreinos, setUltimosTreinos] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      
      const [statsResponse, treinosResponse] = await Promise.all([
        treinoService.estatisticas(),
        treinoService.listar({ limite: 5 })
      ]);

      setEstatisticas(statsResponse.dados);
      setUltimosTreinos(treinosResponse.dados);
    } catch (error) {
      setErro(error.mensagem);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) return <Loading />;
  if (erro) return <MensagemErro mensagem={erro} onRetry={carregarDados} />;

  return (
    <div className="home">
      {/* Header de boas-vindas */}
      {/* Cards de estatísticas */}
      {/* Treinos por tipo */}
      {/* Últimos treinos */}
    </div>
  );
};
```

**Padrão de carregamento de dados:**

1. Inicializa estados (`carregando`, `erro`, `dados`)
2. Usa `useEffect` para carregar ao montar
3. Exibe `<Loading />` enquanto carrega
4. Exibe `<MensagemErro />` se falhar
5. Renderiza conteúdo quando dados disponíveis

### 2. Lista de Treinos

**Arquivo:** `pages/ListaTreinos.jsx`

**Funcionalidades:**
- Lista todos os treinos em cards
- Filtros por tipo e período
- Paginação
- Link para criar novo treino

**Gerenciamento de Filtros:**

```jsx
const [filtros, setFiltros] = useState({
  tipo: '',
  dataInicio: '',
  dataFim: ''
});

const handleFiltroChange = (campo, valor) => {
  setFiltros(prev => ({ ...prev, [campo]: valor }));
  setPaginacao(prev => ({ ...prev, pagina: 1 })); // Volta para página 1
};
```

**Paginação:**

```jsx
const [paginacao, setPaginacao] = useState({
  total: 0,
  pagina: 1,
  limite: 10,
  totalPaginas: 0
});

// Recarrega quando página ou filtros mudam
useEffect(() => {
  carregarTreinos();
}, [paginacao.pagina, filtros]);
```

### 3. Formulário de Treino

**Arquivo:** `pages/FormTreino.jsx`

**Funcionalidades:**
- Criar novo treino
- Editar treino existente (mesmo componente)
- Adicionar/remover exercícios dinamicamente
- Adicionar/remover séries em cada exercício
- Validação de campos
- Sugestões de exercícios por grupo muscular

**Detectar modo edição:**

```jsx
const { id } = useParams();
const isEdicao = Boolean(id);

useEffect(() => {
  if (isEdicao) {
    carregarTreino();
  }
}, [id]);
```

**Estado do formulário:**

```jsx
const [treino, setTreino] = useState({
  tipo: 'A',
  nome: '',
  data: formatarParaInput(new Date()),
  duracao: '',
  observacao: '',
  exercicios: []
});
```

**Manipulação de exercícios:**

```jsx
const adicionarExercicio = () => {
  const novoExercicio = {
    nome: '',
    grupoMuscular: 'Peito',
    series: [{ carga: 0, repeticoes: 12, concluida: false }],
    observacao: ''
  };
  
  setTreino(prev => ({
    ...prev,
    exercicios: [...prev.exercicios, novoExercicio]
  }));
};

const atualizarExercicio = (index, campo, valor) => {
  setTreino(prev => ({
    ...prev,
    exercicios: prev.exercicios.map((ex, i) => 
      i === index ? { ...ex, [campo]: valor } : ex
    )
  }));
};

const removerExercicio = (index) => {
  setTreino(prev => ({
    ...prev,
    exercicios: prev.exercicios.filter((_, i) => i !== index)
  }));
};
```

**Manipulação de séries:**

```jsx
const adicionarSerie = (exercicioIndex) => {
  const exercicio = treino.exercicios[exercicioIndex];
  const ultimaSerie = exercicio.series[exercicio.series.length - 1];
  
  const novaSerie = {
    carga: ultimaSerie?.carga || 0,
    repeticoes: ultimaSerie?.repeticoes || 12,
    concluida: false
  };

  atualizarExercicio(exercicioIndex, 'series', [...exercicio.series, novaSerie]);
};

const atualizarSerie = (exercicioIndex, serieIndex, campo, valor) => {
  const exercicio = treino.exercicios[exercicioIndex];
  const novasSeries = exercicio.series.map((serie, i) => 
    i === serieIndex ? { ...serie, [campo]: valor } : serie
  );
  atualizarExercicio(exercicioIndex, 'series', novasSeries);
};
```

**Submit do formulário:**

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setSalvando(true);
    
    const dados = {
      ...treino,
      duracao: treino.duracao ? parseInt(treino.duracao) : undefined
    };

    if (isEdicao) {
      await treinoService.atualizar(id, dados);
    } else {
      await treinoService.criar(dados);
    }

    navigate('/treinos');
  } catch (error) {
    setErro(error.mensagem);
  } finally {
    setSalvando(false);
  }
};
```

### 4. Detalhes do Treino

**Arquivo:** `pages/DetalhesTreino.jsx`

**Funcionalidades:**
- Visualização completa do treino
- Estatísticas (exercícios, séries, volume total)
- Lista de exercícios expandível
- Tabela de séries por exercício
- Marcar como concluído
- Editar e excluir

**Cálculos de estatísticas:**

```jsx
import { 
  calcularVolumeTreino,
  calcularVolumeExercicio,
  calcularCargaMaxima,
  contarSeries
} from '../utils/helpers';

const volumeTotal = calcularVolumeTreino(treino.exercicios);
const totalSeries = contarSeries(treino.exercicios);
```

**Exercícios expansíveis:**

```jsx
const [exercicioExpandido, setExercicioExpandido] = useState(null);

// No render:
<div onClick={() => setExercicioExpandido(
  exercicioExpandido === index ? null : index
)}>
  {/* Header do exercício */}
</div>

{exercicioExpandido === index && (
  <div>
    {/* Detalhes e tabela de séries */}
  </div>
)}
```

---

## Estilização

### Variáveis CSS

Arquivo `styles/global.css` define variáveis para consistência:

```css
:root {
  /* Cores principais */
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --primary-light: #60a5fa;
  
  /* Cores de estado */
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
  
  /* Escala de cinzas */
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  /* ... */
  --gray-900: #0f172a;
  
  /* Espaçamentos */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Bordas */
  --border-radius: 8px;
  --border-radius-lg: 12px;
  
  /* Sombras */
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  /* Transições */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
}
```

### Classes Utilitárias

```css
/* Botões */
.btn { /* estilos base */ }
.btn-primary { background-color: var(--primary); color: white; }
.btn-secondary { background-color: var(--gray-100); }
.btn-danger { background-color: var(--danger); color: white; }
.btn-ghost { background-color: transparent; }
.btn-sm { padding: 0.375rem 0.75rem; }
.btn-lg { padding: 0.875rem 1.75rem; }

/* Cards */
.card {
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
}

/* Badges */
.badge { /* estilos base */ }
.badge-primary { background-color: rgba(59, 130, 246, 0.1); color: var(--primary); }
.badge-success { background-color: rgba(34, 197, 94, 0.1); color: var(--success); }

/* Animações */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-fade-in { animation: fadeIn var(--transition-normal); }
.animate-spin { animation: spin 1s linear infinite; }
```

### Responsividade

```css
/* Desktop first, ajustes para mobile */
@media (max-width: 768px) {
  .home-stats {
    grid-template-columns: 1fr; /* 1 coluna no mobile */
  }
  
  .header-nav {
    display: none; /* Esconde nav desktop */
  }
  
  .header-menu-btn {
    display: block; /* Mostra botão hamburguer */
  }
}
```

---

## Roteamento

### Arquivo: `App.jsx`

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ListaTreinos from './pages/ListaTreinos';
import FormTreino from './pages/FormTreino';
import DetalhesTreino from './pages/DetalhesTreino';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Home */}
          <Route index element={<Home />} />
          
          {/* Treinos */}
          <Route path="treinos">
            <Route index element={<ListaTreinos />} />
            <Route path="novo" element={<FormTreino />} />
            <Route path=":id" element={<DetalhesTreino />} />
            <Route path=":id/editar" element={<FormTreino />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### Estrutura de Rotas

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | Home | Dashboard |
| `/treinos` | ListaTreinos | Lista todos os treinos |
| `/treinos/novo` | FormTreino | Criar novo treino |
| `/treinos/:id` | DetalhesTreino | Ver detalhes |
| `/treinos/:id/editar` | FormTreino | Editar treino |

### Rotas Aninhadas

```jsx
<Route path="treinos">
  <Route index element={<ListaTreinos />} />  {/* /treinos */}
  <Route path="novo" element={<FormTreino />} /> {/* /treinos/novo */}
  <Route path=":id" element={<DetalhesTreino />} /> {/* /treinos/123 */}
</Route>
```

**`index`:** Renderiza quando a URL é exatamente `/treinos`
**`:id`:** Parâmetro dinâmico, acessível via `useParams()`

### Navegação Programática

```jsx
import { useNavigate } from 'react-router-dom';

const MeuComponente = () => {
  const navigate = useNavigate();

  const irParaTreinos = () => {
    navigate('/treinos');
  };

  const voltar = () => {
    navigate(-1); // Volta uma página no histórico
  };

  return (/* ... */);
};
```

---

## Conceitos Aprendidos

### React

| Conceito | Descrição |
|----------|-----------|
| **Componentes Funcionais** | Funções que retornam JSX |
| **Hooks** | useState, useEffect, useParams, useNavigate, useLocation |
| **Props** | Passagem de dados entre componentes |
| **Renderização Condicional** | `{condicao && <Componente />}` ou ternário |
| **Listas e Keys** | `.map()` com `key` única |
| **Eventos** | onClick, onChange, onSubmit |
| **Formulários Controlados** | Estado controla valor dos inputs |

### React Router

| Conceito | Descrição |
|----------|-----------|
| **BrowserRouter** | Provedor de contexto de roteamento |
| **Routes/Route** | Definição das rotas |
| **Link** | Navegação declarativa |
| **Outlet** | Placeholder para rotas filhas |
| **useParams** | Acesso a parâmetros da URL |
| **useNavigate** | Navegação programática |
| **useLocation** | Informações da URL atual |

### Padrões de Código

| Padrão | Uso |
|--------|-----|
| **Container/Presentational** | Separar lógica de apresentação |
| **Custom Hooks** | Reutilizar lógica de estado |
| **Service Layer** | Centralizar chamadas de API |
| **CSS Modules/Scoped** | Um CSS por componente |

### Axios

| Conceito | Descrição |
|----------|-----------|
| **Instância** | `axios.create()` com config base |
| **Interceptors** | Processamento global de req/res |
| **Tratamento de Erros** | Catch centralizado |

---

## Checklist da Fase

- [x] Setup do projeto com Vite
- [x] Instalar dependências (axios, router, lucide, date-fns)
- [x] Criar estrutura de pastas
- [x] Configurar estilos globais e variáveis CSS
- [x] Criar serviço de API com axios
- [x] Criar funções utilitárias (helpers)
- [x] Criar constantes da aplicação
- [x] Criar componentes de Layout (Header, Layout)
- [x] Criar componentes UI reutilizáveis
- [x] Criar página Home (Dashboard)
- [x] Criar página Lista de Treinos
- [x] Criar página Formulário de Treino
- [x] Criar página Detalhes do Treino
- [x] Configurar rotas da aplicação
- [x] Testar integração com backend
- [x] Responsividade básica

---

## Próximos Passos

Na **Fase 4**, vamos implementar gráficos e visualizações:

1. Gráfico de evolução de carga por exercício
2. Gráfico de volume por período
3. Dashboard com métricas visuais
4. Filtros interativos nos gráficos

[Continuar para Fase 4 →](./FASE-04-GRAFICOS.md)

---

*Documentação criada em Novembro/2025 — Projeto PDI FitTracker*
