/**
 * Página: Formulário de Treino
 * 
 * Formulário para criar ou editar um treino.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  PlusCircle, 
  Trash2, 
  GripVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { treinoService } from '../services/api';
import { formatarParaInput } from '../utils/helpers';
import { TIPOS_TREINO, GRUPOS_MUSCULARES, EXERCICIOS_SUGERIDOS } from '../utils/constants';
import { Loading, MensagemErro, PageHeader, GrupoBadge, ModalConfirmacao } from '../components/ui/UI';
import './FormTreino.css';

const FormTreino = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdicao = Boolean(id);

  const [carregando, setCarregando] = useState(isEdicao);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [exercicioExpandido, setExercicioExpandido] = useState(null);
  const [modalExcluir, setModalExcluir] = useState({ aberto: false, index: null });

  const [treino, setTreino] = useState({
    tipo: 'A',
    nome: '',
    data: formatarParaInput(new Date()),
    duracao: '',
    observacao: '',
    exercicios: []
  });

  useEffect(() => {
    if (isEdicao) {
      carregarTreino();
    }
  }, [id]);

  const carregarTreino = async () => {
    try {
      setCarregando(true);
      const response = await treinoService.buscarPorId(id);
      const dados = response.dados;
      
      setTreino({
        ...dados,
        data: formatarParaInput(dados.data),
        duracao: dados.duracao || ''
      });
    } catch (error) {
      setErro(error.mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (campo, valor) => {
    setTreino(prev => ({ ...prev, [campo]: valor }));
  };

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
    
    setExercicioExpandido(treino.exercicios.length);
  };

  const removerExercicio = (index) => {
    setTreino(prev => ({
      ...prev,
      exercicios: prev.exercicios.filter((_, i) => i !== index)
    }));
    setModalExcluir({ aberto: false, index: null });
    setExercicioExpandido(null);
  };

  const atualizarExercicio = (index, campo, valor) => {
    setTreino(prev => ({
      ...prev,
      exercicios: prev.exercicios.map((ex, i) => 
        i === index ? { ...ex, [campo]: valor } : ex
      )
    }));
  };

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

  const removerSerie = (exercicioIndex, serieIndex) => {
    const exercicio = treino.exercicios[exercicioIndex];
    if (exercicio.series.length <= 1) return;

    atualizarExercicio(
      exercicioIndex, 
      'series', 
      exercicio.series.filter((_, i) => i !== serieIndex)
    );
  };

  const atualizarSerie = (exercicioIndex, serieIndex, campo, valor) => {
    const exercicio = treino.exercicios[exercicioIndex];
    const novasSeries = exercicio.series.map((serie, i) => 
      i === serieIndex ? { ...serie, [campo]: valor } : serie
    );
    atualizarExercicio(exercicioIndex, 'series', novasSeries);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações básicas
    if (!treino.tipo) {
      setErro('Selecione o tipo do treino');
      return;
    }

    try {
      setSalvando(true);
      setErro(null);

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
      setErro(error.mensagem || 'Erro ao salvar treino');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return <Loading mensagem="Carregando treino..." />;
  }

  return (
    <div className="form-treino" data-cy="form-treino-page">
      <PageHeader
        titulo={isEdicao ? 'Editar Treino' : 'Novo Treino'}
        subtitulo={isEdicao ? 'Atualize os dados do treino' : 'Registre um novo treino'}
        voltar
      />

      {erro && (
        <div className="form-erro" data-cy="form-erro">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} data-cy="form-treino">
        {/* Dados Básicos */}
        <div className="card form-section">
          <h2 className="form-section-titulo">Informações Básicas</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="tipo">Tipo do Treino *</label>
              <select
                id="tipo"
                value={treino.tipo}
                onChange={(e) => handleChange('tipo', e.target.value)}
                required
                data-cy="input-tipo"
              >
                {TIPOS_TREINO.map(({ valor, nome }) => (
                  <option key={valor} value={valor}>{nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="nome">Nome (opcional)</label>
              <input
                type="text"
                id="nome"
                value={treino.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Ex: Peito e Tríceps"
                data-cy="input-nome"
              />
            </div>

            <div className="form-group">
              <label htmlFor="data">Data *</label>
              <input
                type="date"
                id="data"
                value={treino.data}
                onChange={(e) => handleChange('data', e.target.value)}
                required
                data-cy="input-data"
              />
            </div>

            <div className="form-group">
              <label htmlFor="duracao">Duração (minutos)</label>
              <input
                type="number"
                id="duracao"
                value={treino.duracao}
                onChange={(e) => handleChange('duracao', e.target.value)}
                placeholder="60"
                min="0"
                data-cy="input-duracao"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="observacao">Observações</label>
            <textarea
              id="observacao"
              value={treino.observacao}
              onChange={(e) => handleChange('observacao', e.target.value)}
              placeholder="Anotações sobre o treino..."
              rows={3}
              data-cy="input-observacao"
            />
          </div>
        </div>

        {/* Exercícios */}
        <div className="form-section">
          <div className="form-section-header">
            <h2 className="form-section-titulo">
              Exercícios ({treino.exercicios.length})
            </h2>
            <button
              type="button"
              className="btn btn-primary"
              onClick={adicionarExercicio}
              data-cy="btn-adicionar-exercicio"
            >
              <PlusCircle size={18} />
              Adicionar Exercício
            </button>
          </div>

          {treino.exercicios.length === 0 ? (
            <div className="card form-exercicios-vazio">
              <p>Nenhum exercício adicionado</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={adicionarExercicio}
                data-cy="btn-primeiro-exercicio"
              >
                <PlusCircle size={18} />
                Adicionar primeiro exercício
              </button>
            </div>
          ) : (
            <div className="form-exercicios-lista" data-cy="exercicios-lista">
              {treino.exercicios.map((exercicio, exIndex) => (
                <div key={exIndex} className="card form-exercicio-card">
                  {/* Header do Exercício */}
                  <div 
                    className="form-exercicio-header"
                    onClick={() => setExercicioExpandido(
                      exercicioExpandido === exIndex ? null : exIndex
                    )}
                  >
                    <div className="form-exercicio-header-left">
                      <GripVertical size={18} className="form-exercicio-grip" />
                      <span className="form-exercicio-numero">{exIndex + 1}</span>
                      <div className="form-exercicio-info">
                        <span className="form-exercicio-nome">
                          {exercicio.nome || 'Novo Exercício'}
                        </span>
                        <GrupoBadge grupo={exercicio.grupoMuscular} />
                      </div>
                    </div>
                    <div className="form-exercicio-header-right">
                      <span className="form-exercicio-series">
                        {exercicio.series.length} série{exercicio.series.length > 1 ? 's' : ''}
                      </span>
                      {exercicioExpandido === exIndex ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </div>

                  {/* Conteúdo Expandido */}
                  {exercicioExpandido === exIndex && (
                    <div className="form-exercicio-content">
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Nome do Exercício *</label>
                          <input
                            type="text"
                            value={exercicio.nome}
                            onChange={(e) => atualizarExercicio(exIndex, 'nome', e.target.value)}
                            placeholder="Ex: Supino Reto"
                            list={`sugestoes-${exIndex}`}
                            required
                          />
                          <datalist id={`sugestoes-${exIndex}`}>
                            {(EXERCICIOS_SUGERIDOS[exercicio.grupoMuscular] || []).map(nome => (
                              <option key={nome} value={nome} />
                            ))}
                          </datalist>
                        </div>

                        <div className="form-group">
                          <label>Grupo Muscular *</label>
                          <select
                            value={exercicio.grupoMuscular}
                            onChange={(e) => atualizarExercicio(exIndex, 'grupoMuscular', e.target.value)}
                            required
                          >
                            {GRUPOS_MUSCULARES.map(grupo => (
                              <option key={grupo} value={grupo}>{grupo}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Séries */}
                      <div className="form-series">
                        <div className="form-series-header">
                          <span>Séries</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => adicionarSerie(exIndex)}
                          >
                            <PlusCircle size={14} />
                            Série
                          </button>
                        </div>

                        <div className="form-series-lista">
                          <div className="form-series-cabecalho">
                            <span>#</span>
                            <span>Carga (kg)</span>
                            <span>Repetições</span>
                            <span></span>
                          </div>

                          {exercicio.series.map((serie, serieIndex) => (
                            <div key={serieIndex} className="form-serie-row">
                              <span className="form-serie-numero">{serieIndex + 1}</span>
                              <input
                                type="number"
                                value={serie.carga}
                                onChange={(e) => atualizarSerie(
                                  exIndex, 
                                  serieIndex, 
                                  'carga', 
                                  parseFloat(e.target.value) || 0
                                )}
                                min="0"
                                step="0.5"
                              />
                              <input
                                type="number"
                                value={serie.repeticoes}
                                onChange={(e) => atualizarSerie(
                                  exIndex, 
                                  serieIndex, 
                                  'repeticoes', 
                                  parseInt(e.target.value) || 0
                                )}
                                min="1"
                              />
                              <button
                                type="button"
                                className="btn-icon btn-ghost"
                                onClick={() => removerSerie(exIndex, serieIndex)}
                                disabled={exercicio.series.length <= 1}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ações do Exercício */}
                      <div className="form-exercicio-acoes">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setModalExcluir({ aberto: true, index: exIndex })}
                        >
                          <Trash2 size={16} />
                          Remover Exercício
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="form-acoes">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            disabled={salvando}
            data-cy="btn-cancelar"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={salvando}
            data-cy="btn-salvar"
          >
            {salvando ? (
              <>Salvando...</>
            ) : (
              <>
                <Save size={18} />
                {isEdicao ? 'Salvar Alterações' : 'Criar Treino'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal de Confirmação */}
      <ModalConfirmacao
        aberto={modalExcluir.aberto}
        titulo="Remover exercício"
        mensagem="Tem certeza que deseja remover este exercício? Esta ação não pode ser desfeita."
        textoBotao="Remover"
        onConfirmar={() => removerExercicio(modalExcluir.index)}
        onCancelar={() => setModalExcluir({ aberto: false, index: null })}
      />
    </div>
  );
};

export default FormTreino;
