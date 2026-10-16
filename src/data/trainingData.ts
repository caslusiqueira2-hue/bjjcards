import { TrainingDrill } from '../types/career';

export const TRAINING_DRILLS: TrainingDrill[] = [
  {
    id: 'camp_quedas',
    title: 'Camp de Quedas & Wrestling',
    category: 'quedas',
    description: 'Drills intensivos de baiana (double leg), single leg e sprawl. Aprimora a iniciativa e estabilidade em pé.',
    energyCost: 30,
    timeCostWeeks: 1,
    fatigueDelta: 16,
    attributeGains: {
      quedas: 4,
      defesaQuedas: 3,
      explosao: 2
    },
    skillPointsEarned: 2,
    coachTips: 'Entre com a cabeça erguida e o quadril baixo para não dar brecha de guilhotina!'
  },
  {
    id: 'camp_passagem',
    title: 'Camp de Passagem de Guarda',
    category: 'passagem',
    description: 'Treino exaustivo de toreando, knee slice e emborcada com foco em matar o quadril do guardeiro.',
    energyCost: 32,
    timeCostWeeks: 1,
    fatigueDelta: 16,
    attributeGains: {
      passagemGuarda: 4,
      controlePosicional: 2
    },
    skillPointsEarned: 2,
    coachTips: 'Conecte a passagem direto no 100kg com o queixo esgrimando o rosto do rival.'
  },
  {
    id: 'camp_guarda',
    title: 'Camp de Guarda & Raspagens',
    category: 'guarda',
    description: 'Aperfeiçoamento de guarda fechada, berimbolos e alavancas de meia-guarda para desequilibrar passadores.',
    energyCost: 30,
    timeCostWeeks: 1,
    fatigueDelta: 15,
    attributeGains: {
      retencaoGuarda: 3,
      raspagens: 4
    },
    skillPointsEarned: 2,
    coachTips: 'Use a força das pernas e o jogo de quadril. Quem tem guarda boa nunca se desespera.'
  },
  {
    id: 'camp_finalizacoes',
    title: 'Camp de Finalizações & Escapes',
    category: 'finalizacao',
    description: 'Ajuste milimétrico de armlocks, estrangulamentos e chaves de ombro, com foco em defesas técnicas.',
    energyCost: 28,
    timeCostWeeks: 1,
    fatigueDelta: 14,
    attributeGains: {
      finalizacoes: 4,
      defesaFinalizacoes: 3
    },
    skillPointsEarned: 2,
    coachTips: 'No armlock, cole bem os calcanhares na axila antes de projetar a bacia.'
  },
  {
    id: 'camp_posicional',
    title: 'Camp de Controle Posicional & Pressão',
    category: 'posicional',
    description: 'Domínio do peso morto nos 100kg, transições cirúrgicas para a montada e estabilização de pegada de costas.',
    energyCost: 26,
    timeCostWeeks: 1,
    fatigueDelta: 12,
    attributeGains: {
      controlePosicional: 4,
      forca: 2
    },
    skillPointsEarned: 2,
    coachTips: 'Distribua o peso nos ossos do oponente, tire o ar dele e espere o erro surgir.'
  },
  {
    id: 'camp_condicionamento',
    title: 'Preparação Física, Força & Gás',
    category: 'condicionamento',
    description: 'Puxadas na corda de kimono, kettlebells e tiros de esteira intervalados para forjar um gás inesgotável.',
    energyCost: 35,
    timeCostWeeks: 1,
    fatigueDelta: 22,
    attributeGains: {
      resistencia: 4,
      forca: 3,
      explosao: 2
    },
    skillPointsEarned: 2,
    coachTips: 'O melhor Jiu-Jitsu do mundo não serve de nada quando os braços abrem de cansaço.'
  },
  {
    id: 'camp_sparring_real',
    title: 'Rola Competitivo (Simulação de Campeonato)',
    category: 'posicional',
    description: 'Luta real de 8 minutos com contagem oficial de pontos, vantagens e pressão psicológica de arbitragem.',
    energyCost: 40,
    timeCostWeeks: 1,
    fatigueDelta: 26,
    attributeGains: {
      experienciaCompetitiva: 4,
      friezaPressao: 3,
      passagemGuarda: 2,
      raspagens: 2
    },
    skillPointsEarned: 4,
    coachTips: 'Excelente para ritmo de luta, mas exige descanso logo em seguida para não lesionar!'
  },
  {
    id: 'camp_recuperacao',
    title: 'Descanso Ativo, Gelo & Fisioterapia',
    category: 'recuperacao',
    description: 'Crioterapia, liberação miofascial e sono restaurador. Reduz a fadiga drasticamente e renova as energias.',
    energyCost: 0,
    timeCostWeeks: 1,
    fatigueDelta: -35,
    attributeGains: {
      recuperacao: 4
    },
    skillPointsEarned: 1,
    coachTips: 'Descanso é parte do treinamento. Quem não recupera, quebra antes da final.'
  }
];
