/**
 * Constantes da Aplicação
 * 
 * Centraliza valores fixos usados em toda a aplicação.
 */

// Grupos musculares disponíveis (deve coincidir com o backend)
export const GRUPOS_MUSCULARES = [
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
];

// Tipos de treino comuns
export const TIPOS_TREINO = [
  { valor: 'A', nome: 'Treino A' },
  { valor: 'B', nome: 'Treino B' },
  { valor: 'C', nome: 'Treino C' },
  { valor: 'D', nome: 'Treino D' },
  { valor: 'PUSH', nome: 'Push (Empurrar)' },
  { valor: 'PULL', nome: 'Pull (Puxar)' },
  { valor: 'LEGS', nome: 'Legs (Pernas)' },
  { valor: 'UPPER', nome: 'Upper (Superior)' },
  { valor: 'LOWER', nome: 'Lower (Inferior)' },
  { valor: 'FULL', nome: 'Full Body' }
];

// Cores para gráficos por grupo muscular
export const CORES_GRUPOS = {
  'Peito': '#ef4444',
  'Costas': '#3b82f6',
  'Ombros': '#f97316',
  'Bíceps': '#8b5cf6',
  'Tríceps': '#ec4899',
  'Antebraço': '#6366f1',
  'Abdômen': '#14b8a6',
  'Quadríceps': '#22c55e',
  'Posterior': '#84cc16',
  'Glúteos': '#eab308',
  'Panturrilha': '#06b6d4',
  'Corpo Inteiro': '#64748b',
  'Cardio': '#f43f5e'
};

// Cores para tipos de treino
export const CORES_TIPOS = {
  'A': '#3b82f6',
  'B': '#22c55e',
  'C': '#f97316',
  'D': '#8b5cf6',
  'PUSH': '#ef4444',
  'PULL': '#06b6d4',
  'LEGS': '#22c55e',
  'UPPER': '#f97316',
  'LOWER': '#8b5cf6',
  'FULL': '#64748b'
};

// Exercícios sugeridos por grupo muscular
export const EXERCICIOS_SUGERIDOS = {
  'Peito': [
    'Supino Reto',
    'Supino Inclinado',
    'Supino Declinado',
    'Crucifixo',
    'Crossover',
    'Flexão de Braço',
    'Fly na Máquina'
  ],
  'Costas': [
    'Puxada Frontal',
    'Puxada Triângulo',
    'Remada Curvada',
    'Remada Unilateral',
    'Remada Cavalinho',
    'Pulldown',
    'Levantamento Terra'
  ],
  'Ombros': [
    'Desenvolvimento',
    'Elevação Lateral',
    'Elevação Frontal',
    'Crucifixo Inverso',
    'Remada Alta',
    'Arnold Press'
  ],
  'Bíceps': [
    'Rosca Direta',
    'Rosca Alternada',
    'Rosca Martelo',
    'Rosca Scott',
    'Rosca Concentrada',
    'Rosca no Cabo'
  ],
  'Tríceps': [
    'Tríceps Corda',
    'Tríceps Testa',
    'Tríceps Francês',
    'Tríceps Banco',
    'Mergulho',
    'Tríceps Coice'
  ],
  'Quadríceps': [
    'Agachamento Livre',
    'Leg Press',
    'Cadeira Extensora',
    'Agachamento Hack',
    'Afundo',
    'Passada'
  ],
  'Posterior': [
    'Mesa Flexora',
    'Cadeira Flexora',
    'Stiff',
    'Levantamento Terra Romeno',
    'Good Morning'
  ],
  'Glúteos': [
    'Hip Thrust',
    'Elevação Pélvica',
    'Abdução de Quadril',
    'Agachamento Sumô',
    'Glúteo na Máquina'
  ],
  'Panturrilha': [
    'Panturrilha em Pé',
    'Panturrilha Sentado',
    'Panturrilha no Leg Press',
    'Panturrilha Unilateral'
  ],
  'Abdômen': [
    'Abdominal Crunch',
    'Prancha',
    'Elevação de Pernas',
    'Abdominal Infra',
    'Abdominal Oblíquo',
    'Roda Abdominal'
  ],
  'Cardio': [
    'Esteira',
    'Bicicleta',
    'Elíptico',
    'Escada',
    'Remo',
    'Pular Corda'
  ]
};
