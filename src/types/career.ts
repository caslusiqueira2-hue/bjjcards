import { Belt } from './athlete';

export type Federation = 'CBJJA' | 'CBJJP';

export interface TournamentMatch {
  id: string;
  roundName: 'Quartas de Final' | 'Semifinal' | 'Disputa de Bronze' | 'Grande Final';
  opponentId: string;
  opponentName: string;
  opponentBelt: Belt;
  opponentAcademy: string;
  completed: boolean;
  won?: boolean;
  scoreSummary?: string;
}

export interface Tournament {
  id: string;
  name: string;
  federation: Federation; // 'CBJJA' (Amador) vs 'CBJJP' (Profissional)
  location: string;
  prestige: 'regional' | 'estadual' | 'nacional' | 'europeu' | 'mundial';
  requiredBelt: Belt;
  entryFee: number;
  reputationReward: number;
  trophyIcon: string;
  description: string;
  unlockCriteriaDescription: string;
  isUnlocked: boolean;
  matches: TournamentMatch[];
  championId?: string;
  playerRank?: 'champion' | 'runner_up' | 'bronze' | 'eliminated';
}

export interface TrainingDrill {
  id: string;
  title: string;
  category: 'quedas' | 'passagem' | 'guarda' | 'finalizacao' | 'posicional' | 'condicionamento' | 'recuperacao';
  description: string;
  energyCost: number;       // Consome energia do atleta (20 a 40)
  timeCostWeeks: number;    // Tempo em semanas para assimilar a técnica (geralmente 1 semana)
  fatigueDelta: number;     // Adiciona fadiga (+12% a +25%) ou reduz na recuperação (-35%)
  attributeGains: Record<string, number>;
  skillPointsEarned: number;
  coachTips: string;
}

export interface GraduationCriteria {
  belt: Belt;
  stripe: number;           // 1, 2, 3, 4
  minWeeks: number;         // Semanas de treino necessárias
  minWins: number;          // Vitórias necessárias
  minTitles?: number;       // Títulos necessários
  minAvgSkill: number;      // Média dos atributos requerida
}

export interface CareerState {
  currentWeek: number;
  year: number;
  funds: number;
  coachFeedback: string[];
  activeTournament: Tournament | null;
  completedTournaments: {
    tournamentId: string;
    tournamentName: string;
    federation: Federation;
    result: 'Ouro' | 'Prata' | 'Bronze' | 'Eliminado';
    year: number;
    week: number;
  }[];
}
