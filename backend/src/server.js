/**
 * FitTracker API - Servidor Principal
 * 
 * Este é o ponto de entrada da aplicação.
 * Configura o Express, middlewares e inicia o servidor.
 */

// Carrega variáveis de ambiente ANTES de qualquer outra coisa
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Importa as rotas
const { treinosRoutes } = require('./routes');

// Inicializa o Express
const app = express();

// ===========================================
// MIDDLEWARES
// ===========================================

// Habilita CORS para permitir requisições do frontend
app.use(cors());

// Parse de JSON no body das requisições
app.use(express.json());

// Parse de dados URL-encoded (formulários)
app.use(express.urlencoded({ extended: true }));

// Middleware de logging simples (desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
  });
}

// ===========================================
// ROTAS
// ===========================================

// Rota de health check / teste
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: '🏋️ FitTracker API está funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      treinos: '/api/treinos',
      estatisticas: '/api/treinos/stats',
      documentacao: '/api/docs'
    }
  });
});

// Rota de health check para monitoramento
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/api/treinos', treinosRoutes);

// Rota de documentação básica da API
app.get('/api/docs', (req, res) => {
  res.json({
    nome: 'FitTracker API',
    versao: '1.0.0',
    descricao: 'API para rastreamento de treinos',
    endpoints: {
      treinos: {
        'GET /api/treinos': 'Lista todos os treinos (com filtros)',
        'GET /api/treinos/:id': 'Busca treino por ID',
        'GET /api/treinos/stats': 'Estatísticas gerais',
        'POST /api/treinos': 'Cria novo treino',
        'PUT /api/treinos/:id': 'Atualiza treino',
        'DELETE /api/treinos/:id': 'Remove treino'
      },
      exercicios: {
        'POST /api/treinos/:id/exercicios': 'Adiciona exercício ao treino',
        'PUT /api/treinos/:id/exercicios/:exercicioId': 'Atualiza exercício',
        'DELETE /api/treinos/:id/exercicios/:exercicioId': 'Remove exercício'
      }
    },
    filtros: {
      'tipo': 'Filtra por tipo (A, B, C, PUSH, PULL, etc)',
      'dataInicio': 'Data inicial (YYYY-MM-DD)',
      'dataFim': 'Data final (YYYY-MM-DD)',
      'concluido': 'Status de conclusão (true/false)',
      'limite': 'Quantidade por página (padrão: 50)',
      'pagina': 'Número da página (padrão: 1)'
    },
    gruposMusculares: [
      'Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps',
      'Antebraço', 'Abdômen', 'Quadríceps', 'Posterior',
      'Glúteos', 'Panturrilha', 'Corpo Inteiro', 'Cardio'
    ]
  });
});

// ===========================================
// TRATAMENTO DE ERROS
// ===========================================

// Rota não encontrada (404)
app.use((req, res, next) => {
  res.status(404).json({
    sucesso: false,
    erro: 'Rota não encontrada',
    path: req.path,
    method: req.method,
    dica: 'Consulte /api/docs para ver os endpoints disponíveis'
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err.message);
  
  res.status(err.status || 500).json({
    sucesso: false,
    erro: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===========================================
// INICIALIZAÇÃO
// ===========================================

const PORT = process.env.PORT || 3000;

/**
 * Inicia o servidor
 * Conecta ao banco de dados antes de aceitar requisições
 */
const startServer = async () => {
  try {
    // Conecta ao MongoDB
    await connectDB();
    
    // Inicia o servidor HTTP
    app.listen(PORT, () => {
      console.log('');
      console.log('===========================================');
      console.log('🏋️  FitTracker API');
      console.log('===========================================');
      console.log(`📡 Servidor rodando na porta ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`📚 Docs: http://localhost:${PORT}/api/docs`);
      console.log('===========================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar servidor:', error.message);
    process.exit(1);
  }
};

// Inicia a aplicação
startServer();

// Exporta app para testes
module.exports = app;
