/**
 * Rotas: Treinos
 * 
 * Define os endpoints da API para operações com treinos.
 * Cada rota mapeia um método HTTP + URL para uma função do controller.
 * 
 * Base URL: /api/treinos
 * 
 * Endpoints disponíveis:
 * 
 * TREINOS:
 * GET    /api/treinos           → Lista todos os treinos (com filtros)
 * GET    /api/treinos/stats     → Estatísticas gerais
 * GET    /api/treinos/:id       → Busca treino por ID
 * POST   /api/treinos           → Cria novo treino
 * PUT    /api/treinos/:id       → Atualiza treino
 * DELETE /api/treinos/:id       → Remove treino
 * 
 * EXERCÍCIOS (dentro de um treino):
 * POST   /api/treinos/:id/exercicios              → Adiciona exercício
 * PUT    /api/treinos/:id/exercicios/:exercicioId → Atualiza exercício
 * DELETE /api/treinos/:id/exercicios/:exercicioId → Remove exercício
 */

const express = require('express');
const router = express.Router();
const treinoController = require('../controllers/treinoController');

// ===========================================
// ROTAS DE TREINOS
// ===========================================

/**
 * @route   GET /api/treinos/stats
 * @desc    Retorna estatísticas gerais dos treinos
 * @access  Public
 * 
 * IMPORTANTE: Esta rota deve vir ANTES de /:id
 * para não ser interpretada como ID
 */
router.get('/stats', treinoController.estatisticas);

/**
 * @route   GET /api/treinos
 * @desc    Lista todos os treinos com filtros opcionais
 * @access  Public
 * 
 * Query params:
 * - tipo: string (ex: "A", "B", "PUSH")
 * - dataInicio: date (ex: "2025-01-01")
 * - dataFim: date (ex: "2025-01-31")
 * - concluido: boolean
 * - limite: number (padrão: 50)
 * - pagina: number (padrão: 1)
 */
router.get('/', treinoController.listar);

/**
 * @route   GET /api/treinos/:id
 * @desc    Busca um treino específico por ID
 * @access  Public
 */
router.get('/:id', treinoController.buscarPorId);

/**
 * @route   POST /api/treinos
 * @desc    Cria um novo treino
 * @access  Public
 * 
 * Body:
 * {
 *   tipo: "A",
 *   nome: "Peito e Tríceps",
 *   data: "2025-01-15",
 *   exercicios: [...]
 * }
 */
router.post('/', treinoController.criar);

/**
 * @route   PUT /api/treinos/:id
 * @desc    Atualiza um treino existente
 * @access  Public
 */
router.put('/:id', treinoController.atualizar);

/**
 * @route   DELETE /api/treinos/:id
 * @desc    Remove um treino
 * @access  Public
 */
router.delete('/:id', treinoController.remover);

// ===========================================
// ROTAS DE EXERCÍCIOS (aninhadas em treinos)
// ===========================================

/**
 * @route   POST /api/treinos/:id/exercicios
 * @desc    Adiciona um exercício a um treino
 * @access  Public
 * 
 * Body:
 * {
 *   nome: "Supino Reto",
 *   grupoMuscular: "Peito",
 *   series: [
 *     { carga: 60, repeticoes: 12 },
 *     { carga: 70, repeticoes: 10 }
 *   ]
 * }
 */
router.post('/:id/exercicios', treinoController.adicionarExercicio);

/**
 * @route   PUT /api/treinos/:id/exercicios/:exercicioId
 * @desc    Atualiza um exercício específico de um treino
 * @access  Public
 */
router.put('/:id/exercicios/:exercicioId', treinoController.atualizarExercicio);

/**
 * @route   DELETE /api/treinos/:id/exercicios/:exercicioId
 * @desc    Remove um exercício de um treino
 * @access  Public
 */
router.delete('/:id/exercicios/:exercicioId', treinoController.removerExercicio);

module.exports = router;
