/**
 * Controller: Treinos
 * 
 * Contém a lógica de negócio para operações com treinos.
 * Cada função corresponde a um endpoint da API.
 * 
 * Endpoints:
 * - GET    /api/treinos          → listar todos
 * - GET    /api/treinos/:id      → buscar por ID
 * - POST   /api/treinos          → criar novo
 * - PUT    /api/treinos/:id      → atualizar
 * - DELETE /api/treinos/:id      → remover
 * - GET    /api/treinos/stats    → estatísticas
 */

const { Treino } = require('../models');

// ===========================================
// LISTAR TODOS OS TREINOS
// ===========================================

/**
 * Lista todos os treinos com filtros opcionais
 * 
 * Query params:
 * - tipo: filtra por tipo (A, B, C, etc)
 * - dataInicio: filtra treinos a partir desta data
 * - dataFim: filtra treinos até esta data
 * - concluido: filtra por status (true/false)
 * - limite: quantidade máxima de resultados (padrão: 50)
 * - pagina: página para paginação (padrão: 1)
 * 
 * @route GET /api/treinos
 */
exports.listar = async (req, res, next) => {
  try {
    const {
      tipo,
      dataInicio,
      dataFim,
      concluido,
      limite = 50,
      pagina = 1
    } = req.query;

    // Constrói o filtro dinamicamente
    const filtro = {};

    if (tipo) {
      filtro.tipo = tipo.toUpperCase();
    }

    if (dataInicio || dataFim) {
      filtro.data = {};
      if (dataInicio) filtro.data.$gte = new Date(dataInicio);
      if (dataFim) filtro.data.$lte = new Date(dataFim);
    }

    if (concluido !== undefined) {
      filtro.concluido = concluido === 'true';
    }

    // Calcula skip para paginação
    const skip = (parseInt(pagina) - 1) * parseInt(limite);

    // Executa a query
    const [treinos, total] = await Promise.all([
      Treino.find(filtro)
        .sort({ data: -1 }) // Mais recentes primeiro
        .skip(skip)
        .limit(parseInt(limite)),
      Treino.countDocuments(filtro)
    ]);

    res.json({
      sucesso: true,
      dados: treinos,
      paginacao: {
        total,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        totalPaginas: Math.ceil(total / parseInt(limite))
      }
    });

  } catch (error) {
    next(error);
  }
};

// ===========================================
// BUSCAR TREINO POR ID
// ===========================================

/**
 * Busca um treino específico pelo ID
 * 
 * @route GET /api/treinos/:id
 */
exports.buscarPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const treino = await Treino.findById(id);

    if (!treino) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Treino não encontrado'
      });
    }

    res.json({
      sucesso: true,
      dados: treino
    });

  } catch (error) {
    // Erro de ID inválido do MongoDB
    if (error.name === 'CastError') {
      return res.status(400).json({
        sucesso: false,
        erro: 'ID inválido'
      });
    }
    next(error);
  }
};

// ===========================================
// CRIAR NOVO TREINO
// ===========================================

/**
 * Cria um novo treino
 * 
 * Body esperado:
 * {
 *   tipo: "A",
 *   nome: "Peito e Tríceps",
 *   data: "2025-01-15",
 *   duracao: 60,
 *   exercicios: [...],
 *   observacao: "..."
 * }
 * 
 * @route POST /api/treinos
 */
exports.criar = async (req, res, next) => {
  try {
    const dadosTreino = req.body;

    // Cria o treino
    const treino = new Treino(dadosTreino);
    
    // Salva no banco
    await treino.save();

    res.status(201).json({
      sucesso: true,
      mensagem: 'Treino criado com sucesso',
      dados: treino
    });

  } catch (error) {
    // Erro de validação do Mongoose
    if (error.name === 'ValidationError') {
      const erros = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        sucesso: false,
        erro: 'Dados inválidos',
        detalhes: erros
      });
    }
    next(error);
  }
};

// ===========================================
// ATUALIZAR TREINO
// ===========================================

/**
 * Atualiza um treino existente
 * 
 * @route PUT /api/treinos/:id
 */
exports.atualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = req.body;

    // Remove campos que não devem ser atualizados diretamente
    delete dadosAtualizacao._id;
    delete dadosAtualizacao.createdAt;

    const treino = await Treino.findByIdAndUpdate(
      id,
      dadosAtualizacao,
      {
        new: true,           // Retorna o documento atualizado
        runValidators: true  // Executa validações do schema
      }
    );

    if (!treino) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Treino não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Treino atualizado com sucesso',
      dados: treino
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        sucesso: false,
        erro: 'ID inválido'
      });
    }
    if (error.name === 'ValidationError') {
      const erros = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        sucesso: false,
        erro: 'Dados inválidos',
        detalhes: erros
      });
    }
    next(error);
  }
};

// ===========================================
// REMOVER TREINO
// ===========================================

/**
 * Remove um treino pelo ID
 * 
 * @route DELETE /api/treinos/:id
 */
exports.remover = async (req, res, next) => {
  try {
    const { id } = req.params;

    const treino = await Treino.findByIdAndDelete(id);

    if (!treino) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Treino não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Treino removido com sucesso',
      dados: treino
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        sucesso: false,
        erro: 'ID inválido'
      });
    }
    next(error);
  }
};

// ===========================================
// ESTATÍSTICAS
// ===========================================

/**
 * Retorna estatísticas gerais dos treinos
 * 
 * @route GET /api/treinos/stats
 */
exports.estatisticas = async (req, res, next) => {
  try {
    const stats = await Treino.obterEstatisticas();

    // Busca contagem por tipo
    const porTipo = await Treino.aggregate([
      {
        $group: {
          _id: '$tipo',
          quantidade: { $sum: 1 }
        }
      },
      { $sort: { quantidade: -1 } }
    ]);

    // Busca treinos da última semana
    const umaSemanaAtras = new Date();
    umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);

    const treinosSemana = await Treino.countDocuments({
      data: { $gte: umaSemanaAtras }
    });

    res.json({
      sucesso: true,
      dados: {
        ...stats,
        treinosSemana,
        porTipo
      }
    });

  } catch (error) {
    next(error);
  }
};

// ===========================================
// OPERAÇÕES COM EXERCÍCIOS
// ===========================================

/**
 * Adiciona um exercício a um treino existente
 * 
 * @route POST /api/treinos/:id/exercicios
 */
exports.adicionarExercicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exercicioData = req.body;

    const treino = await Treino.findById(id);

    if (!treino) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Treino não encontrado'
      });
    }

    treino.adicionarExercicio(exercicioData);
    await treino.save();

    res.status(201).json({
      sucesso: true,
      mensagem: 'Exercício adicionado com sucesso',
      dados: treino
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const erros = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        sucesso: false,
        erro: 'Dados inválidos',
        detalhes: erros
      });
    }
    next(error);
  }
};

/**
 * Remove um exercício de um treino
 * 
 * @route DELETE /api/treinos/:id/exercicios/:exercicioId
 */
exports.removerExercicio = async (req, res, next) => {
  try {
    const { id, exercicioId } = req.params;

    const treino = await Treino.findById(id);

    if (!treino) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Treino não encontrado'
      });
    }

    const removido = treino.removerExercicio(exercicioId);

    if (!removido) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Exercício não encontrado neste treino'
      });
    }

    await treino.save();

    res.json({
      sucesso: true,
      mensagem: 'Exercício removido com sucesso',
      dados: treino
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza um exercício específico de um treino
 * 
 * @route PUT /api/treinos/:id/exercicios/:exercicioId
 */
exports.atualizarExercicio = async (req, res, next) => {
  try {
    const { id, exercicioId } = req.params;
    const dadosAtualizacao = req.body;

    const treino = await Treino.findById(id);

    if (!treino) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Treino não encontrado'
      });
    }

    const exercicio = treino.exercicios.id(exercicioId);

    if (!exercicio) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Exercício não encontrado neste treino'
      });
    }

    // Atualiza os campos do exercício
    Object.assign(exercicio, dadosAtualizacao);
    
    await treino.save();

    res.json({
      sucesso: true,
      mensagem: 'Exercício atualizado com sucesso',
      dados: treino
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const erros = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        sucesso: false,
        erro: 'Dados inválidos',
        detalhes: erros
      });
    }
    next(error);
  }
};
