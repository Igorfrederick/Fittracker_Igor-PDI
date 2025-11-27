/**
 * Serviço de API
 * 
 * Centraliza todas as chamadas HTTP para o backend.
 * Usa axios para requisições com configuração base.
 */

import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ===========================================
// INTERCEPTORS
// ===========================================

// Interceptor de requisição (antes de enviar)
api.interceptors.request.use(
  (config) => {
    // Pode adicionar token de autenticação aqui futuramente
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta (após receber)
api.interceptors.response.use(
  (response) => {
    // Retorna apenas os dados da resposta
    return response.data;
  },
  (error) => {
    // Tratamento de erros centralizado
    const mensagem = error.response?.data?.erro || 
                     error.message || 
                     'Erro ao conectar com o servidor';
    
    console.error('Erro na API:', mensagem);
    return Promise.reject({ mensagem, status: error.response?.status });
  }
);

// ===========================================
// SERVIÇOS DE TREINOS
// ===========================================

export const treinoService = {
  /**
   * Lista todos os treinos com filtros opcionais
   * @param {Object} filtros - { tipo, dataInicio, dataFim, limite, pagina }
   */
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

  /**
   * Busca um treino por ID
   * @param {string} id - ID do treino
   */
  buscarPorId: async (id) => {
    return api.get(`/treinos/${id}`);
  },

  /**
   * Cria um novo treino
   * @param {Object} dados - Dados do treino
   */
  criar: async (dados) => {
    return api.post('/treinos', dados);
  },

  /**
   * Atualiza um treino existente
   * @param {string} id - ID do treino
   * @param {Object} dados - Dados a atualizar
   */
  atualizar: async (id, dados) => {
    return api.put(`/treinos/${id}`, dados);
  },

  /**
   * Remove um treino
   * @param {string} id - ID do treino
   */
  remover: async (id) => {
    return api.delete(`/treinos/${id}`);
  },

  /**
   * Obtém estatísticas dos treinos
   */
  estatisticas: async () => {
    return api.get('/treinos/stats');
  },

  /**
   * Adiciona exercício a um treino
   * @param {string} treinoId - ID do treino
   * @param {Object} exercicio - Dados do exercício
   */
  adicionarExercicio: async (treinoId, exercicio) => {
    return api.post(`/treinos/${treinoId}/exercicios`, exercicio);
  },

  /**
   * Atualiza exercício de um treino
   * @param {string} treinoId - ID do treino
   * @param {string} exercicioId - ID do exercício
   * @param {Object} dados - Dados a atualizar
   */
  atualizarExercicio: async (treinoId, exercicioId, dados) => {
    return api.put(`/treinos/${treinoId}/exercicios/${exercicioId}`, dados);
  },

  /**
   * Remove exercício de um treino
   * @param {string} treinoId - ID do treino
   * @param {string} exercicioId - ID do exercício
   */
  removerExercicio: async (treinoId, exercicioId) => {
    return api.delete(`/treinos/${treinoId}/exercicios/${exercicioId}`);
  }
};

export default api;
