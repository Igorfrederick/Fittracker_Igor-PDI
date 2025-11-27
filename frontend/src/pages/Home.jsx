/**
 * Página: Home (Dashboard)
 * 
 * Página inicial com resumo e acesso rápido às funcionalidades.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  PlusCircle,
  ArrowRight,
  Flame
} from 'lucide-react';
import { treinoService } from '../services/api';
import { formatarData, tempoRelativo, formatarDuracao } from '../utils/helpers';
import { Loading, MensagemErro, StatCard, TipoBadge, EstadoVazio } from '../components/ui/UI';
import './Home.css';

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
      setErro(null);

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

  if (carregando) {
    return <Loading mensagem="Carregando dashboard..." />;
  }

  if (erro) {
    return <MensagemErro mensagem={erro} onRetry={carregarDados} />;
  }

  return (
    <div className="home">
      {/* Header de Boas-vindas */}
      <div className="home-header">
        <div>
          <h1 className="home-titulo">Bora treinar! 💪🏽</h1>
          <p className="home-subtitulo">
            Registre seus treinos e deixe de ser frango! 🐔
          </p>
        </div>
        <Link to="/treinos/novo" className="btn btn-primary btn-lg">
          <PlusCircle size={20} />
          Novo Treino
        </Link>
      </div>

      {/* Cards de Estatísticas */}
      <div className="home-stats">
        <StatCard
          titulo="Total de Treinos"
          valor={estatisticas?.totalTreinos || 0}
          icone={Dumbbell}
          cor="#3b82f6"
        />
        <StatCard
          titulo="Esta Semana"
          valor={estatisticas?.treinosSemana || 0}
          icone={Calendar}
          cor="#22c55e"
        />
        <StatCard
          titulo="Treinos Concluídos"
          valor={estatisticas?.treinosConcluidos || 0}
          icone={TrendingUp}
          cor="#8b5cf6"
        />
        <StatCard
          titulo="Tempo Total"
          valor={formatarDuracao(estatisticas?.duracaoTotal || 0)}
          icone={Flame}
          cor="#f97316"
        />
      </div>

      {/* Treinos por Tipo */}
      {estatisticas?.porTipo?.length > 0 && (
        <div className="home-section">
          <h2 className="home-section-titulo">Treinos por Tipo</h2>
          <div className="home-tipos">
            {estatisticas.porTipo.map(({ _id, quantidade }) => (
              <div key={_id} className="home-tipo-item">
                <TipoBadge tipo={_id} />
                <span className="home-tipo-quantidade">{quantidade} treino{quantidade > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Últimos Treinos */}
      <div className="home-section">
        <div className="home-section-header">
          <h2 className="home-section-titulo">Últimos Treinos</h2>
          <Link to="/treinos" className="home-section-link">
            Ver todos
            <ArrowRight size={16} />
          </Link>
        </div>

        {ultimosTreinos.length === 0 ? (
          <div className="card">
            <EstadoVazio
              titulo="Nenhum treino registrado"
              descricao="Comece registrando seu primeiro treino!"
              acao={
                <Link to="/treinos/novo" className="btn btn-primary">
                  <PlusCircle size={18} />
                  Registrar Treino
                </Link>
              }
            />
          </div>
        ) : (
          <div className="home-treinos-lista">
            {ultimosTreinos.map((treino) => (
              <Link 
                key={treino._id} 
                to={`/treinos/${treino._id}`}
                className="home-treino-card"
              >
                <div className="home-treino-header">
                  <TipoBadge tipo={treino.tipo} />
                  <span className="home-treino-data">
                    {tempoRelativo(treino.data)}
                  </span>
                </div>
                <h3 className="home-treino-nome">
                  {treino.nome || `Treino ${treino.tipo}`}
                </h3>
                <div className="home-treino-info">
                  <span>{treino.exercicios?.length || 0} exercícios</span>
                  {treino.duracao && (
                    <span>{formatarDuracao(treino.duracao)}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
