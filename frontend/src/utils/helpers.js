/**
 * Funções Utilitárias
 * 
 * Helpers para formatação e manipulação de dados.
 */

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ===========================================
// FORMATAÇÃO DE DATAS
// ===========================================

/**
 * Formata uma data para exibição
 * @param {string|Date} data - Data a formatar
 * @param {string} formato - Formato desejado (padrão: 'dd/MM/yyyy')
 * @returns {string} Data formatada
 */
export const formatarData = (data, formato = 'dd/MM/yyyy') => {
  if (!data) return '-';
  
  const dataObj = typeof data === 'string' ? parseISO(data) : data;
  
  if (!isValid(dataObj)) return '-';
  
  return format(dataObj, formato, { locale: ptBR });
};

/**
 * Formata data com hora
 * @param {string|Date} data - Data a formatar
 * @returns {string} Data e hora formatadas
 */
export const formatarDataHora = (data) => {
  return formatarData(data, "dd/MM/yyyy 'às' HH:mm");
};

/**
 * Retorna tempo relativo (ex: "há 2 dias")
 * @param {string|Date} data - Data de referência
 * @returns {string} Tempo relativo
 */
export const tempoRelativo = (data) => {
  if (!data) return '-';
  
  const dataObj = typeof data === 'string' ? parseISO(data) : data;
  
  if (!isValid(dataObj)) return '-';
  
  return formatDistanceToNow(dataObj, { 
    addSuffix: true, 
    locale: ptBR 
  });
};

/**
 * Formata data para input type="date"
 * @param {string|Date} data - Data a formatar
 * @returns {string} Data no formato yyyy-MM-dd
 */
export const formatarParaInput = (data) => {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? parseISO(data) : data;
  
  if (!isValid(dataObj)) return '';
  
  return format(dataObj, 'yyyy-MM-dd');
};

// ===========================================
// FORMATAÇÃO DE NÚMEROS
// ===========================================

/**
 * Formata número com separador de milhar
 * @param {number} numero - Número a formatar
 * @returns {string} Número formatado
 */
export const formatarNumero = (numero) => {
  if (numero === null || numero === undefined) return '-';
  return numero.toLocaleString('pt-BR');
};

/**
 * Formata peso (kg)
 * @param {number} peso - Peso em kg
 * @returns {string} Peso formatado
 */
export const formatarPeso = (peso) => {
  if (!peso && peso !== 0) return '-';
  return `${peso} kg`;
};

/**
 * Formata duração em minutos para horas e minutos
 * @param {number} minutos - Duração em minutos
 * @returns {string} Duração formatada
 */
export const formatarDuracao = (minutos) => {
  if (!minutos && minutos !== 0) return '-';
  
  if (minutos < 60) {
    return `${minutos} min`;
  }
  
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  
  if (mins === 0) {
    return `${horas}h`;
  }
  
  return `${horas}h ${mins}min`;
};

// ===========================================
// CÁLCULOS DE TREINO
// ===========================================

/**
 * Calcula o volume total de um exercício
 * @param {Array} series - Array de séries
 * @returns {number} Volume total (carga × repetições)
 */
export const calcularVolumeExercicio = (series = []) => {
  return series.reduce((total, serie) => {
    return total + (serie.carga || 0) * (serie.repeticoes || 0);
  }, 0);
};

/**
 * Calcula o volume total de um treino
 * @param {Array} exercicios - Array de exercícios
 * @returns {number} Volume total do treino
 */
export const calcularVolumeTreino = (exercicios = []) => {
  return exercicios.reduce((total, exercicio) => {
    return total + calcularVolumeExercicio(exercicio.series);
  }, 0);
};

/**
 * Encontra a carga máxima de um exercício
 * @param {Array} series - Array de séries
 * @returns {number} Carga máxima
 */
export const calcularCargaMaxima = (series = []) => {
  if (series.length === 0) return 0;
  return Math.max(...series.map(s => s.carga || 0));
};

/**
 * Conta o total de séries de um treino
 * @param {Array} exercicios - Array de exercícios
 * @returns {number} Total de séries
 */
export const contarSeries = (exercicios = []) => {
  return exercicios.reduce((total, exercicio) => {
    return total + (exercicio.series?.length || 0);
  }, 0);
};

// ===========================================
// VALIDAÇÕES
// ===========================================

/**
 * Verifica se um objeto está vazio
 * @param {Object} obj - Objeto a verificar
 * @returns {boolean}
 */
export const objetoVazio = (obj) => {
  return !obj || Object.keys(obj).length === 0;
};

/**
 * Verifica se uma string está vazia
 * @param {string} str - String a verificar
 * @returns {boolean}
 */
export const stringVazia = (str) => {
  return !str || str.trim() === '';
};

// ===========================================
// HELPERS
// ===========================================

/**
 * Gera uma cor baseada em uma string (para badges, avatars, etc)
 * @param {string} str - String de entrada
 * @returns {string} Cor em formato hex
 */
export const gerarCorDeString = (str) => {
  if (!str) return '#64748b';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const cores = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', 
    '#84cc16', '#22c55e', '#14b8a6', '#06b6d4',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
    '#d946ef', '#ec4899', '#f43f5e'
  ];
  
  return cores[Math.abs(hash) % cores.length];
};

/**
 * Agrupa array por uma propriedade
 * @param {Array} array - Array a agrupar
 * @param {string} propriedade - Nome da propriedade
 * @returns {Object} Objeto agrupado
 */
export const agruparPor = (array, propriedade) => {
  return array.reduce((grupos, item) => {
    const chave = item[propriedade];
    if (!grupos[chave]) {
      grupos[chave] = [];
    }
    grupos[chave].push(item);
    return grupos;
  }, {});
};

/**
 * Ordena array por propriedade
 * @param {Array} array - Array a ordenar
 * @param {string} propriedade - Nome da propriedade
 * @param {string} direcao - 'asc' ou 'desc'
 * @returns {Array} Array ordenado
 */
export const ordenarPor = (array, propriedade, direcao = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[propriedade] < b[propriedade]) return direcao === 'asc' ? -1 : 1;
    if (a[propriedade] > b[propriedade]) return direcao === 'asc' ? 1 : -1;
    return 0;
  });
};
