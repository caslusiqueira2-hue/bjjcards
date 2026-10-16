import { Belt } from './athlete';
import { CombatPosition } from './combat';
import { CombatCard } from './cards';

export type TacticalDecision = 'ATACAR' | 'AMARRAR' | 'CADENCIAR';

export type PositionalSlot =
  | 'STANDING'
  | 'GUARD_PASS'
  | 'GUARD_BOTTOM'
  | 'HALF_GUARD'
  | 'SIDE_MOUNT'
  | 'BACK_CONTROL'
  | 'DEFENSE_ESCAPE';

export interface PositionalDeck {
  standing: string; // cardId
  guardPass: string;
  guardBottom: string;
  halfGuard: string;
  sideMount: string;
  backControl: string;
  defenseEscape: string;
}

export interface DailyTrainingDrill {
  id: string;
  title: string;
  category: 'quedas' | 'passagem' | 'guarda' | 'meia_guarda' | 'finalizacao' | 'defesa';
  description: string;
  energyCost: number;
  xpReward: number;
  statBonus: { stat: string; amount: number };
  rewardCardIds: string[];
  minBelt: Belt;
  coachAdvice: string;
}

export interface DailyFighter {
  id: string;
  name: string;
  nickname?: string;
  academy: string;
  belt: Belt;
  stripes: number;
  avatarId: string;
  avatarUrl?: string;
  giColor: string;
  overallRating: number;
  attributes: {
    quedas: number;
    passagemGuarda: number;
    retencaoGuarda: number;
    raspagens: number;
    controlePosicional: number;
    finalizacoes: number;
    defesaFinalizacoes: number;
    resistencia: number;
    explosao: number;
  };
  preferredStrategy?: TacticalDecision;
}

export interface DailyTournamentMatch {
  id: string;
  roundName: 'Quartas de Final' | 'Semifinal' | 'Grande Final';
  roundLevel: 1 | 2 | 3;
  fighterA: DailyFighter;
  fighterB: DailyFighter;
  winnerId?: string;
  winMethod?: string;
  scoreA: { points: number; advantages: number; penalties: number };
  scoreB: { points: number; advantages: number; penalties: number };
  isPlayerMatch: boolean;
  completed: boolean;
}

export interface DailyTournament {
  id: string;
  name: string;
  federation: string;
  requiredBelt: Belt;
  xpRewardChampion: number;
  trophyName: string;
  description: string;
  matches: DailyTournamentMatch[];
  isCompleted: boolean;
  playerRank?: 'quarter' | 'semi' | 'runner_up' | 'champion' | 'eliminated';
}

export interface CombatNarrativeLog {
  id: string;
  minute: string; // "5:20"
  secondsRemaining: number;
  actor: 'player' | 'opponent' | 'referee';
  actorName: string;
  actionTitle: string;
  description: string;
  position: CombatPosition;
  pointsDelta?: { athlete: 'player' | 'opponent'; points: number; reason: string };
  advantageDelta?: { athlete: 'player' | 'opponent'; reason: string };
  penaltyDelta?: { athlete: 'player' | 'opponent'; reason: string };
  isSubmissionAttempt?: boolean;
  isSubmissionSuccess?: boolean;
  decisionImpact?: TacticalDecision;
}

export interface DailyCombatSimState {
  matchId: string;
  tournamentName: string;
  roundName: string;
  playerFighter: DailyFighter;
  opponentFighter: DailyFighter;
  roundTimeSeconds: number; // starts at 360 (6 minutes)
  currentPosition: CombatPosition;
  playerRole: 'standing' | 'top' | 'bottom';
  scores: {
    player: { points: number; advantages: number; penalties: number };
    opponent: { points: number; advantages: number; penalties: number };
  };
  playerStamina: number; // 0 - 100
  opponentStamina: number; // 0 - 100
  playerConsecutiveStalls: number; // warnings for amarrar
  opponentConsecutiveStalls: number;
  currentDecision: TacticalDecision;
  logs: CombatNarrativeLog[];
  status: 'IN_PROGRESS' | 'FINISHED';
  winnerId?: string;
  winMethod?: string;
}

export interface DailyModeState {
  xp: number;
  level: number;
  belt: Belt;
  stripes: number;
  dailyEnergy: number; // e.g. 100 max
  maxDailyEnergy: number;
  trainingsCompletedToday: number;
  lastTrainingDate: string;
  unlockedCardIds: string[];
  deck: PositionalDeck;
  trophies: { id: string; name: string; date: string; tournamentId: string }[];
  currentTournament: DailyTournament;
  tournamentWins: number;
  tournamentMatchesWon: number;
  tournamentMatchesLost: number;
}
