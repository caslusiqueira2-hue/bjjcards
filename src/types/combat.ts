import { CombatCard } from './cards';

export interface GridCoord {
  x: number; // Retained for backwards compatibility
  y: number;
}

export type CombatPosition = 
  | 'STANDING'      // Luta em Pé / Pegadas
  | 'CLINCH'        // Engajamento em Pé / Disputa de Pegadas & Esgrima
  | 'CLOSED_GUARD'  // Guarda Fechada
  | 'OPEN_GUARD'    // Guarda Aberta (De La Riva, Aranha)
  | 'HALF_GUARD'    // Meia-Guarda
  | 'SIDE_CONTROL'  // 100kg / Controle Lateral
  | 'MOUNT'         // Montada
  | 'BACK_MOUNT'    // Costas (com ganchos)
  | 'TURTLE';       // Posição de 4 apoios / Tartaruga

export interface IBJJFScore {
  points: number;      // 2, 3, 4
  advantages: number;  // Vantagens
  penalties: number;   // Punições
}

export interface SubmissionThreat {
  techniqueId: string;
  techniqueName: string;
  attackerId: string;
  defenderId: string;
  lockDepth: number;       // 0 to 100. At 100 => TAPOUT (Finalização!)
  escapeChance: number;    // Calculated per turn
  turnsActive: number;
}

export type CombatOutcome = 
  | 'IN_PROGRESS'
  | 'SUBMISSION'
  | 'POINTS'
  | 'DISQUALIFICATION';

export interface CombatActionLog {
  id: string;
  turn: number;
  actorId: string;
  cardName: string;
  category: string;
  description: string;
  pointsAwarded?: { athleteId: string; amount: number; reason: string };
  advantageAwarded?: { athleteId: string; reason: string };
  penaltyAwarded?: { athleteId: string; reason: string };
  isCritical?: boolean;
  isSubmissionAttempt?: boolean;
  isDefenseSuccess?: boolean;
  timeRemaining: number;
}

export interface CardClashEvent {
  card: CombatCard;
  actorId: string;
  targetId: string;
  isSuccess: boolean;
  headline: string;
  pointsAwarded?: number;
  positionChangedTo?: CombatPosition;
  isSubmission?: boolean;
  timestamp: number;
}

export interface CombatState {
  matchId: string;
  roundTimeSeconds: number; // 360 = 6 min
  turnNumber: number;
  currentTurn: 'player' | 'opponent';
  
  // Dynamic Mat Momentum (-100 to +100)
  momentum: number; // >0 is player dominating, <0 is opponent dominating

  // Tactical setup advantage (from fakes, guard breaks, grips)
  tacticalAdvantage: 'player' | 'opponent' | null;

  // Grid retained for compatibility
  grid: {
    cols: number;
    rows: number;
    playerPosition: GridCoord;
    opponentPosition: GridCoord;
  };

  // Technical BJJ State
  technical: {
    position: CombatPosition;
    topAthleteId: string | null;     // ID do atleta por cima / dominante
    bottomAthleteId: string | null;  // ID do atleta por baixo / defensivo
    activeSubmission: SubmissionThreat | null;
    isPassageStabilized: boolean;
    timeInPosition: number;
  };

  // IBJJF Official Scoring
  scores: {
    player: IBJJFScore;
    opponent: IBJJFScore;
  };

  // Outcome
  status: CombatOutcome;
  winnerId: string | null;
  winMethod?: string;

  // Active Clash Event for dramatic card duel animations
  lastClash: CardClashEvent | null;

  // Commentary & Combat Logs
  actionLogs: CombatActionLog[];

  // Visual/Animation Feedback
  lastActionFx: {
    type: 'takedown' | 'pass' | 'sweep' | 'mount' | 'submission_danger' | 'tapout' | 'escape' | 'point' | 'move' | null;
    athleteId?: string;
    text?: string;
    timestamp?: number;
  } | null;
}
