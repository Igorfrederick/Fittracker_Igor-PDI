/**
 * Página: Lista de Treinos
 * 
 * Exibe todos os treinos com filtros e paginação.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Filter,
  Calendar,
  Dumbbell,
  Clock,
  ChevronRight
} from 'lucide-react';
import { treinoService } from '../services/api';
import { formatarData, formatarDuracao, contarSeries } from '../utils/helpers';
import { TIPOS_TREINO } from '../utils/constants';
import { 
  Loading, 
  MensagemErro, 
  EstadoVazio, 
  PageHeader,
  TipoBadge,
  GrupoBadge
} from '../components/ui/UI';
import './ListaTreinos.css';

const ListaTreinos = () => {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [treinos, setTreinos] = useState([]);
  const [paginacao, setPaginacao] = useState({
    total: 0,
    pagina: 1,
    limite: 10,
    totalPaginas: 0
  });
  const [filtros, setFiltros] = useState({
    tipo: '',
    dataInicio: '',
    dataFim: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    carregarTreinos();
  }, [paginacao.pagina, filtros]);

  const carregarTreinos = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const response = await treinoService.listar({
        ...filtros,
        limite: paginacao.limite,
        pagina: paginacao.pagina
      });

      setTreinos(response.dados);
      setPaginacao(prev => ({
        ...prev,
        ...response.paginacao
      }));
    } catch (error) {
      setErro(error.mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPaginacao(prev => ({ ...prev, pagina: 1 }));
  };

  const limparFiltros = () => {
    setFiltros({ tipo: '', dataInicio: '', dataFim: '' });
    setPaginacao(prev => ({ ...prev, pagina: 1 }));
  };

  const temFiltrosAtivos = filtros.tipo || filtros.dataInicio || filtros.dataFim;

  return (
    <div className="lista-treinos">
      <PageHeader
        titulo="Meus Treinos"
        subtitulo={`${paginacao.total} treino${paginacao.total !== 1 ? 's' : ''} registrado${paginacao.total !== 1 ? 's' : ''}`}
        acoes={
          <Link to="/treinos/novo" className="btn btn-primary">
            <PlusCircle size={18} />
            Novo Treino
          </Link>
        }
      />

      {/* Barra de Filtros */}
      <div className="lista-filtros-bar">
        <button 
          className={`btn ${mostrarFiltros ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          <Filter size={18} />
          Filtros
          {temFiltrosAtivos && <span className="filtros-badge">●</span>}
        </button>

        {temFiltrosAtivos && (
          <button className="btn btn-ghost" onClick={limparFiltros}>
            Limpar filtros
          </button>
        )}
      </div>

      {/* Painel de Filtros */}
      {mostrarFiltros && (
        <div className="lista-filtros-panel card">
          <div className="lista-filtros-grid">
            <div className="form-group">
              <label>Tipo de Treino</label>
              <select
                value={filtros.tipo}
                onChange={(e) => handleFiltroChange('tipo', e.target.value)}
              >
                <option value="">Todos</option>
                {TIPOS_TREINO.map(({ valor, nome }) => (
                  <option key={valor} value={valor}>{nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Data Início</label>
              <input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => handleFiltroChange('dataInicio', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Data Fim</label>
              <input
                type="date"
                value={filtros.dataFim}
                onChange={(e) => handleFiltroChange('dataFim', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      {carregando ? (
        <Loading mensagem="Carregando treinos..." />
      ) : erro ? (
        <MensagemErro mensagem={erro} onRetry={carregarTreinos} />
      ) : treinos.length === 0 ? (
        <div className="card">
          <EstadoVazio
            titulo={temFiltrosAtivos ? 'Nenhum treino encontrado' : 'Nenhum treino registrado'}
            descricao={
              temFiltrosAtivos 
                ? 'Tente ajustar os filtros para encontrar seus treinos.'
                : 'Comece registrando seu primeiro treino!'
            }
            icone={Dumbbell}
            acao={
              !temFiltrosAtivos && (
                <Link to="/treinos/novo" className="btn btn-primary">
                  <PlusCircle size={18} />
                  Registrar Treino
                </Link>
              )
            }
          />
        </div>
      ) : (
        <>
          {/* Lista de Treinos */}
          <div className="lista-treinos-cards">
            {treinos.map((treino) => (
              <Link 
                key={treino._id} 
                to={`/treinos/${treino._id}`}
                className="treino-card card"
              >
                <div className="treino-card-header">
                  <TipoBadge tipo={treino.tipo} />
                  <div className="treino-card-data">
                    <Calendar size={14} />
                    {formatarData(treino.data)}
                  </div>
                </div>

                <h3 className="treino-card-nome">
                  {treino.nome || `Treino ${treino.tipo}`}
                </h3>

                {/* Grupos Musculares */}
                {treino.gruposTrabalhados?.length > 0 && (
                  <div className="treino-card-grupos">
                    {treino.gruposTrabalhados.slice(0, 3).map(grupo => (
                      <GrupoBadge key={grupo} grupo={grupo} />
                    ))}
                    {treino.gruposTrabalhados.length > 3 && (
                      <span className="treino-card-mais">
                        +{treino.gruposTrabalhados.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="treino-card-stats">
                  <div className="treino-card-stat">
                    <Dumbbell size={14} />
                    <span>{treino.exercicios?.length || 0} exercícios</span>
                  </div>
                  <div className="treino-card-stat">
                    <span>{contarSeries(treino.exercicios)} séries</span>
                  </div>
                  {treino.duracao && (
                    <div className="treino-card-stat">
                      <Clock size={14} />
                      <span>{formatarDuracao(treino.duracao)}</span>
                    </div>
                  )}
                </div>

                <div className="treino-card-footer">
                  <span className={`treino-card-status ${treino.concluido ? 'concluido' : ''}`}>
                    {treino.concluido ? '✓ Concluído' : 'Em andamento'}
                  </span>
                  <ChevronRight size={18} />
                </div>
              </Link>
            ))}
          </div>

          {/* Paginação */}
          {paginacao.totalPaginas > 1 && (
            <div className="lista-paginacao">
              <button
                className="btn btn-secondary"
                disabled={paginacao.pagina === 1}
                onClick={() => setPaginacao(prev => ({ ...prev, pagina: prev.pagina - 1 }))}
              >
                Anterior
              </button>
              
              <span className="lista-paginacao-info">
                Página {paginacao.pagina} de {paginacao.totalPaginas}
              </span>

              <button
                className="btn btn-secondary"
                disabled={paginacao.pagina === paginacao.totalPaginas}
                onClick={() => setPaginacao(prev => ({ ...prev, pagina: prev.pagina + 1 }))}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListaTreinos;
