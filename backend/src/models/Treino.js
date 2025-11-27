/**
 * Model: Treino
 * 
 * Define a estrutura de uma sessão de treino completa.
 * Um treino possui tipo (A, B, C...), data e lista de exercícios.
 * 
 * Exemplo de documento:
 * {
 *   tipo: "A",
 *   nome: "Peito e Tríceps",
 *   data: "2025-01-15T10:30:00Z",
 *   duracao: 65,
 *   exercicios: [...],
 *   observacao: "Treino pesado, boa evolução",
 *   concluido: true
 * }
 */

const mongoose = require('mongoose');
const exercicioSchema = require('./Exercicio');

// ===========================================
// SCHEMA PRINCIPAL: Treino
// ===========================================

const treinoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, 'Tipo do treino é obrigatório'],
    trim: true,
    uppercase: true,
    maxlength: [20, 'Tipo muito longo (máx. 20 caracteres)']
    // Exemplos: "A", "B", "C", "PUSH", "PULL", "LEGS", "UPPER", "LOWER"
  },
  nome: {
    type: String,
    trim: true,
    maxlength: [100, 'Nome muito longo (máx. 100 caracteres)']
    // Exemplos: "Peito e Tríceps", "Costas e Bíceps", "Pernas"
  },
  data: {
    type: Date,
    required: [true, 'Data do treino é obrigatória'],
    default: Date.now
  },
  duracao: {
    type: Number,
    min: [0, 'Duração não pode ser negativa'],
    // Duração em minutos
  },
  exercicios: {
    type: [exercicioSchema],
    default: []
  },
  observacao: {
    type: String,
    maxlength: [1000, 'Observação muito longa (máx. 1000 caracteres)']
  },
  concluido: {
    type: Boolean,
    default: false
  }
}, {
  // ===========================================
  // OPÇÕES DO SCHEMA
  // ===========================================
  
  // Adiciona createdAt e updatedAt automaticamente
  timestamps: true,
  
  // Configurações de serialização
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ===========================================
// ÍNDICES
// ===========================================

// Índice para busca por data (ordenação e filtros)
treinoSchema.index({ data: -1 });

// Índice para busca por tipo
treinoSchema.index({ tipo: 1 });

// Índice composto para buscas frequentes
treinoSchema.index({ tipo: 1, data: -1 });

// ===========================================
// VIRTUALS (campos calculados)
// ===========================================

/**
 * Calcula o volume total do treino
 * Soma do volume de todos os exercícios
 */
treinoSchema.virtual('volumeTotal').get(function() {
  return this.exercicios.reduce((total, exercicio) => {
    const volumeExercicio = exercicio.series.reduce((sum, serie) => {
      return sum + (serie.carga * serie.repeticoes);
    }, 0);
    return total + volumeExercicio;
  }, 0);
});

/**
 * Conta o total de exercícios no treino
 */
treinoSchema.virtual('totalExercicios').get(function() {
  return this.exercicios.length;
});

/**
 * Conta o total de séries no treino
 */
treinoSchema.virtual('totalSeries').get(function() {
  return this.exercicios.reduce((total, exercicio) => {
    return total + exercicio.series.length;
  }, 0);
});

/**
 * Lista os grupos musculares trabalhados
 */
treinoSchema.virtual('gruposTrabalhados').get(function() {
  const grupos = this.exercicios.map(e => e.grupoMuscular);
  return [...new Set(grupos)]; // Remove duplicatas
});

// ===========================================
// MÉTODOS DE INSTÂNCIA
// ===========================================

/**
 * Adiciona um exercício ao treino
 * @param {Object} exercicioData - Dados do exercício
 * @returns {Object} O exercício adicionado
 */
treinoSchema.methods.adicionarExercicio = function(exercicioData) {
  exercicioData.ordem = this.exercicios.length;
  this.exercicios.push(exercicioData);
  return this.exercicios[this.exercicios.length - 1];
};

/**
 * Remove um exercício do treino pelo ID
 * @param {String} exercicioId - ID do exercício
 * @returns {Boolean} true se removido, false se não encontrado
 */
treinoSchema.methods.removerExercicio = function(exercicioId) {
  const index = this.exercicios.findIndex(e => e._id.toString() === exercicioId);
  if (index === -1) return false;
  this.exercicios.splice(index, 1);
  // Reordena os exercícios restantes
  this.exercicios.forEach((ex, i) => ex.ordem = i);
  return true;
};

/**
 * Marca o treino como concluído
 */
treinoSchema.methods.concluir = function() {
  this.concluido = true;
  return this;
};

// ===========================================
// MÉTODOS ESTÁTICOS
// ===========================================

/**
 * Busca treinos por período
 * @param {Date} inicio - Data inicial
 * @param {Date} fim - Data final
 * @returns {Promise<Array>} Lista de treinos no período
 */
treinoSchema.statics.buscarPorPeriodo = function(inicio, fim) {
  return this.find({
    data: {
      $gte: inicio,
      $lte: fim
    }
  }).sort({ data: -1 });
};

/**
 * Busca treinos por tipo
 * @param {String} tipo - Tipo do treino (A, B, C, etc)
 * @returns {Promise<Array>} Lista de treinos do tipo
 */
treinoSchema.statics.buscarPorTipo = function(tipo) {
  return this.find({ tipo: tipo.toUpperCase() }).sort({ data: -1 });
};

/**
 * Retorna estatísticas gerais dos treinos
 * @returns {Promise<Object>} Objeto com estatísticas
 */
treinoSchema.statics.obterEstatisticas = async function() {
  const resultado = await this.aggregate([
    {
      $group: {
        _id: null,
        totalTreinos: { $sum: 1 },
        treinosConcluidos: {
          $sum: { $cond: ['$concluido', 1, 0] }
        },
        duracaoMedia: { $avg: '$duracao' },
        duracaoTotal: { $sum: '$duracao' }
      }
    }
  ]);
  
  return resultado[0] || {
    totalTreinos: 0,
    treinosConcluidos: 0,
    duracaoMedia: 0,
    duracaoTotal: 0
  };
};

// ===========================================
// MIDDLEWARES (Hooks)
// ===========================================

/**
 * Antes de salvar, ordena exercícios se necessário
 * 
 * NOTA: Mongoose 9.x usa Promises ao invés de callback next()
 * Pode ser função normal ou async - não precisa de next()
 */
treinoSchema.pre('save', function() {
  // Garante que exercícios tenham ordem
  this.exercicios.forEach((exercicio, index) => {
    if (exercicio.ordem === undefined) {
      exercicio.ordem = index;
    }
  });
  // Não precisa de next() nem return - Mongoose 9.x gerencia automaticamente
});

// ===========================================
// EXPORTAÇÃO
// ===========================================

const Treino = mongoose.model('Treino', treinoSchema);

module.exports = Treino;
