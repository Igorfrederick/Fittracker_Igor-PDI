/**
 * Model: Exercício
 * 
 * Define a estrutura de um exercício realizado durante um treino.
 * Cada exercício possui séries com carga e repetições.
 * 
 * Exemplo de documento:
 * {
 *   nome: "Supino Reto",
 *   grupoMuscular: "Peito",
 *   series: [
 *     { carga: 60, repeticoes: 12, concluida: true },
 *     { carga: 70, repeticoes: 10, concluida: true },
 *     { carga: 80, repeticoes: 8, concluida: false }
 *   ],
 *   observacao: "Aumentar carga na próxima"
 * }
 */

const mongoose = require('mongoose');

// ===========================================
// SUB-SCHEMA: Série
// ===========================================

/**
 * Schema para cada série de um exercício
 * Uma série representa uma execução do exercício com carga e repetições específicas
 */
const serieSchema = new mongoose.Schema({
  carga: {
    type: Number,
    required: [true, 'Carga é obrigatória'],
    min: [0, 'Carga não pode ser negativa']
  },
  repeticoes: {
    type: Number,
    required: [true, 'Número de repetições é obrigatório'],
    min: [1, 'Mínimo de 1 repetição']
  },
  concluida: {
    type: Boolean,
    default: false
  },
  observacao: {
    type: String,
    maxlength: [200, 'Observação muito longa (máx. 200 caracteres)']
  }
}, { _id: false }); // _id: false evita criar ID para cada série

// ===========================================
// SCHEMA PRINCIPAL: Exercício
// ===========================================

const exercicioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do exercício é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome muito longo (máx. 100 caracteres)']
  },
  grupoMuscular: {
    type: String,
    required: [true, 'Grupo muscular é obrigatório'],
    enum: {
      values: [
        'Peito',
        'Costas',
        'Ombros',
        'Bíceps',
        'Tríceps',
        'Antebraço',
        'Abdômen',
        'Quadríceps',
        'Posterior',
        'Glúteos',
        'Panturrilha',
        'Corpo Inteiro',
        'Cardio'
      ],
      message: 'Grupo muscular inválido: {VALUE}'
    }
  },
  series: {
    type: [serieSchema],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'Exercício deve ter pelo menos uma série'
    }
  },
  observacao: {
    type: String,
    maxlength: [500, 'Observação muito longa (máx. 500 caracteres)']
  },
  ordem: {
    type: Number,
    default: 0
  }
}, { _id: true });

// ===========================================
// VIRTUALS (campos calculados)
// ===========================================

/**
 * Calcula o volume total do exercício
 * Volume = soma de (carga × repetições) de todas as séries
 */
exercicioSchema.virtual('volumeTotal').get(function() {
  return this.series.reduce((total, serie) => {
    return total + (serie.carga * serie.repeticoes);
  }, 0);
});

/**
 * Calcula a carga máxima utilizada no exercício
 */
exercicioSchema.virtual('cargaMaxima').get(function() {
  if (this.series.length === 0) return 0;
  return Math.max(...this.series.map(s => s.carga));
});

/**
 * Retorna o total de séries do exercício
 */
exercicioSchema.virtual('totalSeries').get(function() {
  return this.series.length;
});

// Garante que virtuals apareçam no JSON
exercicioSchema.set('toJSON', { virtuals: true });
exercicioSchema.set('toObject', { virtuals: true });

module.exports = exercicioSchema;
