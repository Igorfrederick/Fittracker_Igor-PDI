/**
 * Componentes UI Reutilizáveis
 * 
 * Componentes pequenos usados em toda a aplicação.
 */

import { Loader2, AlertCircle, Inbox, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './UI.css';

// ===========================================
// LOADING
// ===========================================

/**
 * Indicador de carregamento
 * @param {string} mensagem - Mensagem opcional
 * @param {boolean} fullscreen - Se ocupa a tela toda
 */
export const Loading = ({ mensagem = 'Carregando...', fullscreen = false }) => {
  return (
    <div className={`loading ${fullscreen ? 'loading-fullscreen' : ''}`}>
      <Loader2 className="loading-icon animate-spin" size={32} />
      <span className="loading-text">{mensagem}</span>
    </div>
  );
};

// ===========================================
// ESTADO VAZIO
// ===========================================

/**
 * Exibido quando não há dados
 * @param {string} titulo - Título principal
 * @param {string} descricao - Descrição secundária
 * @param {React.ReactNode} acao - Botão de ação opcional
 * @param {React.ReactNode} icone - Ícone customizado
 */
export const EstadoVazio = ({ 
  titulo = 'Nenhum item encontrado',
  descricao = '',
  acao = null,
  icone: Icone = Inbox
}) => {
  return (
    <div className="estado-vazio">
      <Icone size={48} className="estado-vazio-icon" />
      <h3 className="estado-vazio-titulo">{titulo}</h3>
      {descricao && <p className="estado-vazio-descricao">{descricao}</p>}
      {acao && <div className="estado-vazio-acao">{acao}</div>}
    </div>
  );
};

// ===========================================
// MENSAGEM DE ERRO
// ===========================================

/**
 * Exibe mensagem de erro
 * @param {string} mensagem - Mensagem de erro
 * @param {function} onRetry - Callback para tentar novamente
 */
export const MensagemErro = ({ 
  mensagem = 'Ocorreu um erro inesperado',
  onRetry = null
}) => {
  return (
    <div className="mensagem-erro">
      <AlertCircle size={32} className="mensagem-erro-icon" />
      <p className="mensagem-erro-texto">{mensagem}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
};

// ===========================================
// CABEÇALHO DE PÁGINA
// ===========================================

/**
 * Cabeçalho padronizado para páginas
 * @param {string} titulo - Título da página
 * @param {string} subtitulo - Subtítulo opcional
 * @param {boolean} voltar - Mostrar botão voltar
 * @param {React.ReactNode} acoes - Botões de ação
 */
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
          <button 
            className="page-header-voltar btn-ghost btn-icon"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="page-header-text">
          <h1 className="page-header-titulo">{titulo}</h1>
          {subtitulo && <p className="page-header-subtitulo">{subtitulo}</p>}
        </div>
      </div>
      {acoes && <div className="page-header-acoes">{acoes}</div>}
    </div>
  );
};

// ===========================================
// CARD DE ESTATÍSTICA
// ===========================================

/**
 * Card para exibir métricas
 * @param {string} titulo - Título da métrica
 * @param {string|number} valor - Valor principal
 * @param {React.ReactNode} icone - Ícone do card
 * @param {string} cor - Cor do ícone
 * @param {string} variacao - Texto de variação (ex: "+5% esta semana")
 */
export const StatCard = ({ 
  titulo, 
  valor, 
  icone: Icone,
  cor = 'var(--primary)',
  variacao = ''
}) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-titulo">{titulo}</span>
        {Icone && (
          <div className="stat-card-icon" style={{ backgroundColor: `${cor}15`, color: cor }}>
            <Icone size={20} />
          </div>
        )}
      </div>
      <div className="stat-card-valor">{valor}</div>
      {variacao && <span className="stat-card-variacao">{variacao}</span>}
    </div>
  );
};

// ===========================================
// BADGE DE TIPO DE TREINO
// ===========================================

/**
 * Badge colorido para tipo de treino
 * @param {string} tipo - Tipo do treino (A, B, C, etc)
 */
export const TipoBadge = ({ tipo, dataCy }) => {
  const cores = {
    'A': '#3b82f6',
    'B': '#22c55e',
    'C': '#f97316',
    'D': '#8b5cf6',
    'PUSH': '#ef4444',
    'PULL': '#06b6d4',
    'LEGS': '#22c55e',
    'UPPER': '#f97316',
    'LOWER': '#8b5cf6',
    'FULL': '#64748b'
  };

  const cor = cores[tipo?.toUpperCase()] || '#64748b';

  return (
    <span
      className="tipo-badge"
      data-cy={dataCy}
      style={{
        backgroundColor: `${cor}15`,
        color: cor,
        borderColor: `${cor}30`
      }}
    >
      {tipo}
    </span>
  );
};

// ===========================================
// BADGE DE GRUPO MUSCULAR
// ===========================================

/**
 * Badge para grupo muscular
 * @param {string} grupo - Nome do grupo muscular
 */
export const GrupoBadge = ({ grupo }) => {
  const cores = {
    'Peito': '#ef4444',
    'Costas': '#3b82f6',
    'Ombros': '#f97316',
    'Bíceps': '#8b5cf6',
    'Tríceps': '#ec4899',
    'Antebraço': '#6366f1',
    'Abdômen': '#14b8a6',
    'Quadríceps': '#22c55e',
    'Posterior': '#84cc16',
    'Glúteos': '#eab308',
    'Panturrilha': '#06b6d4',
    'Corpo Inteiro': '#64748b',
    'Cardio': '#f43f5e'
  };

  const cor = cores[grupo] || '#64748b';

  return (
    <span 
      className="grupo-badge"
      style={{ 
        backgroundColor: `${cor}15`,
        color: cor
      }}
    >
      {grupo}
    </span>
  );
};

// ===========================================
// CONFIRMAÇÃO DE AÇÃO
// ===========================================

/**
 * Modal de confirmação
 * @param {boolean} aberto - Se o modal está aberto
 * @param {string} titulo - Título do modal
 * @param {string} mensagem - Mensagem de confirmação
 * @param {function} onConfirmar - Callback de confirmação
 * @param {function} onCancelar - Callback de cancelamento
 * @param {string} textoBotao - Texto do botão de confirmação
 * @param {string} variante - Variante do botão (danger, primary)
 */
export const ModalConfirmacao = ({
  aberto,
  titulo = 'Confirmar ação',
  mensagem = 'Tem certeza que deseja continuar?',
  onConfirmar,
  onCancelar,
  textoBotao = 'Confirmar',
  variante = 'danger'
}) => {
  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 className="modal-titulo">{titulo}</h3>
        <p className="modal-mensagem">{mensagem}</p>
        <div className="modal-acoes">
          <button className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
          <button className={`btn btn-${variante}`} onClick={onConfirmar}>
            {textoBotao}
          </button>
        </div>
      </div>
    </div>
  );
};
