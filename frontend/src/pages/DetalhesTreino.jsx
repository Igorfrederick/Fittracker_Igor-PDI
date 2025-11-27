/**
 * Página: Detalhes do Treino
 * 
 * Exibe informações completas de um treino específico.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  Dumbbell,
  TrendingUp,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { treinoService } from '../services/api';
import { 
  formatarData, 
  formatarDuracao, 
  calcularVolumeExercicio,
  calcularVolumeTreino,
  calcularCargaMaxima,
  contarSeries
} from '../utils/helpers';
import { 
  Loading, 
  MensagemErro, 
  PageHeader, 
  TipoBadge, 
  GrupoBadge,
  StatCard,
  ModalConfirmacao
} from '../components/ui/UI';
import './DetalhesTreino.css';

const DetalhesTreino = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [treino, setTreino] = useState(null);
  const [exercicioExpandido, setExercicioExpandido] = useState(null);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    carregarTreino();
  }, [id]);

  const carregarTreino = async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      const response = await treinoService.buscarPorId(id);
      setTreino(response.dados);
    } catch (error) {
      setErro(error.mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluir = async () => {
    try {
      setExcluindo(true);
      await treinoService.remover(id);
      navigate('/treinos');
    } catch (error) {
      setErro(error.mensagem);
      setExcluindo(false);
      setModalExcluir(false);
    }
  };

  const handleConcluir = async () => {
    try {
      await treinoService.atualizar(id, { concluido: !treino.concluido });
      setTreino(prev => ({ ...prev, concluido: !prev.concluido }));
    } catch (error) {
      setErro(error.mensagem);
    }
  };

  if (carregando) {
    return <Loading mensagem="Carregando treino..." />;
  }

  if (erro) {
    return <MensagemErro mensagem={erro} onRetry={carregarTreino} />;
  }

  if (!treino) {
    return <MensagemErro mensagem="Treino não encontrado" />;
  }

  const volumeTotal = calcularVolumeTreino(treino.exercicios);
  const totalSeries = contarSeries(treino.exercicios);

  return (
    <div className="detalhes-treino">
      <PageHeader
        titulo={treino.nome || `Treino ${treino.tipo}`}
        voltar
        acoes={
          <div className="detalhes-acoes">
            <button
              className={`btn ${treino.concluido ? 'btn-success' : 'btn-secondary'}`}
              onClick={handleConcluir}
            >
              <CheckCircle size={18} />
              {treino.concluido ? 'Concluído' : 'Marcar Concluído'}
            </button>
            <Link to={`/treinos/${id}/editar`} className="btn btn-secondary">
              <Edit size={18} />
              Editar
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => setModalExcluir(true)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        }
      />

      {/* Info Card */}
      <div className="card detalhes-info">
        <div className="detalhes-info-item">
          <TipoBadge tipo={treino.tipo} />
        </div>
        <div className="detalhes-info-item">
          <Calendar size={16} />
          <span>{formatarData(treino.data, "EEEE, dd 'de' MMMM 'de' yyyy")}</span>
        </div>
        {treino.duracao && (
          <div className="detalhes-info-item">
            <Clock size={16} />
            <span>{formatarDuracao(treino.duracao)}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="detalhes-stats">
        <StatCard
          titulo="Exercícios"
          valor={treino.exercicios?.length || 0}
          icone={Dumbbell}
          cor="#3b82f6"
        />
        <StatCard
          titulo="Séries"
          valor={totalSeries}
          icone={TrendingUp}
          cor="#22c55e"
        />
        <StatCard
          titulo="Volume Total"
          valor={`${volumeTotal.toLocaleString()} kg`}
          icone={TrendingUp}
          cor="#8b5cf6"
        />
      </div>

      {/* Grupos Trabalhados */}
      {treino.gruposTrabalhados?.length > 0 && (
        <div className="card detalhes-grupos">
          <h3>Grupos Musculares Trabalhados</h3>
          <div className="detalhes-grupos-lista">
            {treino.gruposTrabalhados.map(grupo => (
              <GrupoBadge key={grupo} grupo={grupo} />
            ))}
          </div>
        </div>
      )}

      {/* Lista de Exercícios */}
      <div className="detalhes-section">
        <h2 className="detalhes-section-titulo">Exercícios</h2>

        <div className="detalhes-exercicios">
          {treino.exercicios?.map((exercicio, index) => (
            <div key={exercicio._id || index} className="card detalhes-exercicio">
              <div 
                className="detalhes-exercicio-header"
                onClick={() => setExercicioExpandido(
                  exercicioExpandido === index ? null : index
                )}
              >
                <div className="detalhes-exercicio-info">
                  <span className="detalhes-exercicio-numero">{index + 1}</span>
                  <div>
                    <h3 className="detalhes-exercicio-nome">{exercicio.nome}</h3>
                    <GrupoBadge grupo={exercicio.grupoMuscular} />
                  </div>
                </div>

                <div className="detalhes-exercicio-resumo">
                  <div className="detalhes-exercicio-stat">
                    <span className="stat-valor">{exercicio.series?.length || 0}</span>
                    <span className="stat-label">séries</span>
                  </div>
                  <div className="detalhes-exercicio-stat">
                    <span className="stat-valor">{calcularCargaMaxima(exercicio.series)}</span>
                    <span className="stat-label">kg máx</span>
                  </div>
                  <div className="detalhes-exercicio-stat">
                    <span className="stat-valor">{calcularVolumeExercicio(exercicio.series)}</span>
                    <span className="stat-label">volume</span>
                  </div>
                  {exercicioExpandido === index ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </div>

              {exercicioExpandido === index && (
                <div className="detalhes-exercicio-series">
                  <table>
                    <thead>
                      <tr>
                        <th>Série</th>
                        <th>Carga</th>
                        <th>Repetições</th>
                        <th>Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercicio.series?.map((serie, sIndex) => (
                        <tr key={sIndex}>
                          <td>{sIndex + 1}ª</td>
                          <td>{serie.carga} kg</td>
                          <td>{serie.repeticoes} reps</td>
                          <td>{serie.carga * serie.repeticoes} kg</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {exercicio.observacao && (
                    <div className="detalhes-exercicio-obs">
                      <strong>Observação:</strong> {exercicio.observacao}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Observações do Treino */}
      {treino.observacao && (
        <div className="card detalhes-observacao">
          <h3>Observações</h3>
          <p>{treino.observacao}</p>
        </div>
      )}

      {/* Modal de Exclusão */}
      <ModalConfirmacao
        aberto={modalExcluir}
        titulo="Excluir treino"
        mensagem="Tem certeza que deseja excluir este treino? Esta ação não pode ser desfeita."
        textoBotao={excluindo ? 'Excluindo...' : 'Excluir'}
        onConfirmar={handleExcluir}
        onCancelar={() => setModalExcluir(false)}
      />
    </div>
  );
};

export default DetalhesTreino;
