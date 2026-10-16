import { Belt } from '../types/athlete';
import {
  DailyTrainingDrill,
  DailyFighter,
  DailyTournament,
  DailyTournamentMatch,
  PositionalDeck
} from '../types/dailyMode';

export const BELT_RANKS: Belt[] = ['white', 'blue', 'purple', 'brown', 'black'];

export const BELT_NAMES_PT: Record<Belt, string> = {
  white: 'Faixa Branca',
  blue: 'Faixa Azul',
  purple: 'Faixa Roxa',
  brown: 'Faixa Marrom',
  black: 'Faixa Preta'
};

// XP required to earn each stripe (4 stripes per belt, then belt promotion)
export const XP_PER_STRIPE: Record<Belt, number> = {
  white: 250,   // 4 * 250 = 1000 XP to Blue
  blue: 500,    // 4 * 500 = 2000 XP to Purple
  purple: 1000, // 4 * 1000 = 4000 XP to Brown
  brown: 2000,  // 4 * 2000 = 8000 XP to Black
  black: 5000   // Master degrees
};

export const DEFAULT_POSITIONAL_DECK: PositionalDeck = {
  standing: 'queda_double_leg',
  guardPass: 'pass_over_under',
  guardBottom: 'sub_triangulo',
  halfGuard: 'sweep_meia_guarda',
  sideMount: 'sub_armlock_montada',
  backControl: 'sub_mata_leao',
  defenseEscape: 'def_fuga_quadril'
};

export const INITIAL_UNLOCKED_CARDS: string[] = [
  // Em pé
  'queda_double_leg',
  'queda_single_leg',
  'puxada_dela_riva',
  'def_sprawl',
  'mov_finta_aproximar',
  // Passagem
  'pass_over_under',
  'pass_toreando',
  'pass_knee_slice',
  'pass_emborcada',
  // Guarda
  'sub_triangulo',
  'sub_armlock_guarda',
  'sweep_pendulo',
  'sweep_tesourinha',
  // Meia Guarda
  'sweep_meia_guarda',
  'pass_knee_slice_meia',
  'sub_kimura_meia',
  // 100kg & Montada
  'ctrl_pressao_100kg',
  'sub_armlock_montada',
  'sub_kimura_100kg',
  'trans_montada',
  // Costas
  'sub_mata_leao',
  'sub_arco_e_flecha',
  // Defesas
  'def_fuga_quadril',
  'trans_upa_montada',
  'def_escape_costas'
];

export const DAILY_TRAINING_DRILLS: DailyTrainingDrill[] = [
  {
    id: 'drill_quedas',
    title: 'Drill de Quedas & Wrestling',
    category: 'quedas',
    description: 'Treino intensivo de double leg, single leg e entradas de quadril. Aprimora sua iniciativa e poder de projeção.',
    energyCost: 25,
    xpReward: 60,
    statBonus: { stat: 'quedas', amount: 2 },
    rewardCardIds: ['queda_double_leg', 'queda_single_leg', 'queda_osoto_gari', 'def_sprawl', 'puxada_dela_riva'],
    minBelt: 'white',
    coachAdvice: 'Mantenha a postura ereta e entre explosivo sem telegrafar as pegadas!'
  },
  {
    id: 'drill_passagem',
    title: 'Drill de Passagem na Pressão & Toreando',
    category: 'passagem',
    description: 'Repetição de Over-Under, Toreada rápida e Knee Slice para amassar e quebrar a postura do guardeiro.',
    energyCost: 25,
    xpReward: 65,
    statBonus: { stat: 'passagemGuarda', amount: 2 },
    rewardCardIds: ['pass_over_under', 'pass_toreando', 'pass_knee_slice', 'pass_emborcada', 'pass_pressao_quadril'],
    minBelt: 'white',
    coachAdvice: 'Conecte a passagem direto com o queixo esgrimando no ombro do oponente!'
  },
  {
    id: 'drill_guarda',
    title: 'Drill de Guarda Aberta & Raspagens',
    category: 'guarda',
    description: 'Trabalho de guarda De La Riva, berimbolo, raspagens de pêndulo e ataques velozes de triângulo e armlock.',
    energyCost: 25,
    xpReward: 65,
    statBonus: { stat: 'raspagens', amount: 2 },
    rewardCardIds: ['sub_triangulo', 'sub_armlock_guarda', 'sweep_pendulo', 'sweep_tesourinha', 'sweep_berimbolo', 'sweep_gancho_borboleta'],
    minBelt: 'white',
    coachAdvice: 'Quem joga por baixo tem que ter quadril vivo e pegadas fortes no calcanhar e gola.'
  },
  {
    id: 'drill_meia',
    title: 'Drill de Meia Guarda & Deep Half',
    category: 'meia_guarda',
    description: 'Estudo de esgrima, meia guarda profunda, raspagens de gancho e passagem cruzando o joelho.',
    energyCost: 25,
    xpReward: 60,
    statBonus: { stat: 'retencaoGuarda', amount: 2 },
    rewardCardIds: ['sweep_meia_guarda', 'sweep_meia_profunda', 'sub_kimura_meia', 'pass_knee_slice_meia', 'pass_meia_amassando'],
    minBelt: 'white',
    coachAdvice: 'A meia guarda ganha quem esgrimar primeiro. Conquiste a esgrima alta!'
  },
  {
    id: 'drill_finalizacoes',
    title: 'Drill de Finalizações & Chaves Clássicas',
    category: 'finalizacao',
    description: 'Ajuste milimétrico de Armlock na montada, Mata-Leão pelas costas, estrangulamento cruzado e chaves de braço.',
    energyCost: 30,
    xpReward: 80,
    statBonus: { stat: 'finalizacoes', amount: 3 },
    rewardCardIds: ['sub_mata_leao', 'sub_armlock_montada', 'sub_arco_e_flecha', 'sub_estrangulamento_cruzado', 'sub_kimura_100kg'],
    minBelt: 'white',
    coachAdvice: 'Finalização boa não depende de força bruta, mas sim de isolar os apoios de fuga do rival.'
  },
  {
    id: 'drill_defesa',
    title: 'Drill de Escapes, Pontes & Fugas de Quadril',
    category: 'defesa',
    description: 'Treino de sobrevivência: saída de 100kg, fuga de quadril da montada, ponte/upa e defesa de estrangulamentos.',
    energyCost: 20,
    xpReward: 55,
    statBonus: { stat: 'defesaFinalizacoes', amount: 2 },
    rewardCardIds: ['def_fuga_quadril', 'trans_upa_montada', 'def_escape_costas', 'def_ponte_repor_guarda', 'def_sprawl'],
    minBelt: 'white',
    coachAdvice: 'Não entre em pânico quando estiver sufocado. Proteja o pescoço e faça a ponte no tempo certo.'
  }
];

export const DAILY_RIVALS_POOL: DailyFighter[] = [
  {
    id: 'riv_marcus_silva',
    name: 'Marcus Silva',
    nickname: 'O Tanque',
    academy: 'Alliance Jiu-Jitsu',
    belt: 'white',
    stripes: 3,
    avatarId: 'avatar_05_careca',
    avatarUrl: '/avatars/05_careca.png',
    giColor: '#18181b',
    overallRating: 64,
    attributes: {
      quedas: 66,
      passagemGuarda: 68,
      retencaoGuarda: 40,
      raspagens: 42,
      controlePosicional: 70,
      finalizacoes: 48,
      defesaFinalizacoes: 56,
      resistencia: 62,
      explosao: 65
    },
    preferredStrategy: 'ATACAR'
  },
  {
    id: 'riv_lucas_ferreira',
    name: 'Lucas Ferreira',
    nickname: 'Bolo',
    academy: 'Cicero Costha BJJ',
    belt: 'white',
    stripes: 2,
    avatarId: 'avatar_02_loiro_curto',
    avatarUrl: '/avatars/02_loiro_curto.png',
    giColor: '#2563eb',
    overallRating: 62,
    attributes: {
      quedas: 45,
      passagemGuarda: 55,
      retencaoGuarda: 68,
      raspagens: 70,
      controlePosicional: 52,
      finalizacoes: 64,
      defesaFinalizacoes: 58,
      resistencia: 60,
      explosao: 52
    },
    preferredStrategy: 'CADENCIAR'
  },
  {
    id: 'riv_diego_ramos',
    name: 'Diego Ramos',
    nickname: 'Ogro',
    academy: 'Nova União',
    belt: 'white',
    stripes: 4,
    avatarId: 'avatar_03_negro_curto',
    avatarUrl: '/avatars/03_negro_curto.png',
    giColor: '#ffffff',
    overallRating: 67,
    attributes: {
      quedas: 70,
      passagemGuarda: 65,
      retencaoGuarda: 48,
      raspagens: 50,
      controlePosicional: 68,
      finalizacoes: 60,
      defesaFinalizacoes: 62,
      resistencia: 68,
      explosao: 72
    },
    preferredStrategy: 'ATACAR'
  },
  {
    id: 'riv_thiago_santos',
    name: 'Thiago Santos',
    nickname: 'Pitbull',
    academy: 'Checkmat',
    belt: 'white',
    stripes: 3,
    avatarId: 'avatar_04_cavanhaque',
    avatarUrl: '/avatars/04_cavanhaque.png',
    giColor: '#18181b',
    overallRating: 65,
    attributes: {
      quedas: 62,
      passagemGuarda: 66,
      retencaoGuarda: 55,
      raspagens: 54,
      controlePosicional: 64,
      finalizacoes: 62,
      defesaFinalizacoes: 60,
      resistencia: 66,
      explosao: 68
    },
    preferredStrategy: 'ATACAR'
  },
  {
    id: 'riv_gabriel_albuquerque',
    name: 'Gabriel Albuquerque',
    nickname: 'Aranha',
    academy: 'Gracie Barra',
    belt: 'white',
    stripes: 2,
    avatarId: 'avatar_06_barba_cheia',
    avatarUrl: '/avatars/06_barba_cheia.png',
    giColor: '#2563eb',
    overallRating: 60,
    attributes: {
      quedas: 48,
      passagemGuarda: 52,
      retencaoGuarda: 66,
      raspagens: 64,
      controlePosicional: 55,
      finalizacoes: 60,
      defesaFinalizacoes: 58,
      resistencia: 64,
      explosao: 50
    },
    preferredStrategy: 'AMARRAR'
  },
  {
    id: 'riv_felipe_costa',
    name: 'Felipe Costa',
    nickname: 'Relógio',
    academy: 'Atos Jiu-Jitsu',
    belt: 'white',
    stripes: 4,
    avatarId: 'avatar_07_japa',
    avatarUrl: '/avatars/07_japa.png',
    giColor: '#ffffff',
    overallRating: 66,
    attributes: {
      quedas: 58,
      passagemGuarda: 68,
      retencaoGuarda: 62,
      raspagens: 60,
      controlePosicional: 66,
      finalizacoes: 58,
      defesaFinalizacoes: 64,
      resistencia: 70,
      explosao: 58
    },
    preferredStrategy: 'CADENCIAR'
  },
  {
    id: 'riv_rodrigo_machado',
    name: 'Rodrigo Machado',
    nickname: 'Navalha',
    academy: 'Carlson Gracie Team',
    belt: 'white',
    stripes: 3,
    avatarId: 'avatar_08_cabeludo',
    avatarUrl: '/avatars/08_cabeludo.png',
    giColor: '#2563eb',
    overallRating: 63,
    attributes: {
      quedas: 64,
      passagemGuarda: 62,
      retencaoGuarda: 50,
      raspagens: 52,
      controlePosicional: 62,
      finalizacoes: 66,
      defesaFinalizacoes: 54,
      resistencia: 60,
      explosao: 64
    },
    preferredStrategy: 'ATACAR'
  }
];

export function generateDailyTournament(
  playerBelt: Belt,
  playerFighter: DailyFighter
): DailyTournament {
  const tournamentNames: Record<Belt, string> = {
    white: 'Copa Diária Amadora de BJJ (Faixa Branca)',
    blue: 'Torneio Estadual Diário de Jiu-Jitsu (Faixa Azul)',
    purple: 'Open Nacional Diário de Inverno (Faixa Roxa)',
    brown: 'Grand Slam Diário de Submission (Faixa Marrom)',
    black: 'Mundial Diário de Campeões IBJJF (Faixa Preta)'
  };

  const name = tournamentNames[playerBelt] || 'Copa Diária BJJ Cards';

  // Shuffle rivals and pick 7
  const shuffledRivals = [...DAILY_RIVALS_POOL].sort(() => Math.random() - 0.5);
  // Adjust rivals belt to player belt for immersion
  const rivals = shuffledRivals.slice(0, 7).map((r) => ({
    ...r,
    belt: playerBelt,
    stripes: Math.floor(Math.random() * 4) + 1
  }));

  // Quarterfinals (4 matches, 8 competitors)
  // Match 1: Player vs Rival 0
  // Match 2: Rival 1 vs Rival 2
  // Match 3: Rival 3 vs Rival 4
  // Match 4: Rival 5 vs Rival 6
  const qf1: DailyTournamentMatch = {
    id: 'match_qf_1',
    roundName: 'Quartas de Final',
    roundLevel: 1,
    fighterA: playerFighter,
    fighterB: rivals[0],
    isPlayerMatch: true,
    completed: false,
    scoreA: { points: 0, advantages: 0, penalties: 0 },
    scoreB: { points: 0, advantages: 0, penalties: 0 }
  };

  const qf2: DailyTournamentMatch = {
    id: 'match_qf_2',
    roundName: 'Quartas de Final',
    roundLevel: 1,
    fighterA: rivals[1],
    fighterB: rivals[2],
    isPlayerMatch: false,
    completed: false,
    scoreA: { points: 0, advantages: 0, penalties: 0 },
    scoreB: { points: 0, advantages: 0, penalties: 0 }
  };

  const qf3: DailyTournamentMatch = {
    id: 'match_qf_3',
    roundName: 'Quartas de Final',
    roundLevel: 1,
    fighterA: rivals[3],
    fighterB: rivals[4],
    isPlayerMatch: false,
    completed: false,
    scoreA: { points: 0, advantages: 0, penalties: 0 },
    scoreB: { points: 0, advantages: 0, penalties: 0 }
  };

  const qf4: DailyTournamentMatch = {
    id: 'match_qf_4',
    roundName: 'Quartas de Final',
    roundLevel: 1,
    fighterA: rivals[5],
    fighterB: rivals[6],
    isPlayerMatch: false,
    completed: false,
    scoreA: { points: 0, advantages: 0, penalties: 0 },
    scoreB: { points: 0, advantages: 0, penalties: 0 }
  };

  // Semifinal placeholders
  const sf1: DailyTournamentMatch = {
    id: 'match_sf_1',
    roundName: 'Semifinal',
    roundLevel: 2,
    fighterA: playerFighter,
    fighterB: rivals[1], // will be updated when QF2 completes
    isPlayerMatch: true,
    completed: false,
    scoreA: { points: 0, advantages: 0, penalties: 0 },
    scoreB: { points: 0, advantages: 0, penalties: 0 }
  };

  const sf2: DailyTournamentMatch = {
    id: 'match_sf_2',
    roundName: 'Semifinal',
    roundLevel: 2,
    fighterA: rivals[3],
    fighterB: rivals[5],
    isPlayerMatch: false,
    completed: false,
    scoreA: { points: 0, advantages: 0, penalties: 0 },
    scoreB: { points: 0, advantages: 0, penalties: 0 }
  };

  // Final placeholder
  const finalMatch: DailyTournamentMatch = {
    id: 'match_final',
    roundName: 'Grande Final',
    roundLevel: 3,
    fighterA: playerFighter,
    fighterB: rivals[3],
    isPlayerMatch: true,
    completed: false,
    scoreA: { points: 0, advantages: 0, penalties: 0 },
    scoreB: { points: 0, advantages: 0, penalties: 0 }
  };

  return {
    id: `tourney_daily_${Date.now()}`,
    name,
    federation: 'CBJJA / IBJJF Oficial',
    requiredBelt: playerBelt,
    xpRewardChampion: 500,
    trophyName: `Troféu ${name}`,
    description: 'Chave eliminatória de 8 atletas. Vença 3 lutas seguidas para se sagrar campeão e faturar o Troféu do Dia.',
    matches: [qf1, qf2, qf3, qf4, sf1, sf2, finalMatch],
    isCompleted: false,
    playerRank: 'quarter'
  };
}

export function simulateAiVsAiMatch(match: DailyTournamentMatch): DailyTournamentMatch {
  const ratingA = match.fighterA.overallRating || 60;
  const ratingB = match.fighterB.overallRating || 60;
  const delta = (ratingA - ratingB) * 1.5;
  const probA = Math.max(0.2, Math.min(0.8, 0.5 + delta / 100));

  const aWins = Math.random() < probA;
  const isSubmission = Math.random() < 0.35;

  const pointsA = aWins ? Math.floor(Math.random() * 5) + 2 : Math.floor(Math.random() * 3);
  const pointsB = !aWins ? Math.floor(Math.random() * 5) + 2 : Math.floor(Math.random() * 3);

  const subMethods = ['Armlock da Montada', 'Estrangulamento Mata-Leão', 'Triângulo da Guarda', 'Kimura no 100kg', 'Guilhotina'];
  const winMethod = isSubmission
    ? `Finalização (${subMethods[Math.floor(Math.random() * subMethods.length)]})`
    : `Pontos oficiais (${aWins ? pointsA : pointsB} a ${aWins ? pointsB : pointsA})`;

  return {
    ...match,
    completed: true,
    winnerId: aWins ? match.fighterA.id : match.fighterB.id,
    winMethod,
    scoreA: { points: pointsA, advantages: Math.floor(Math.random() * 2), penalties: 0 },
    scoreB: { points: pointsB, advantages: Math.floor(Math.random() * 2), penalties: 0 }
  };
}
