import { Belt } from './athlete';
import { CombatPosition } from './combat';

export type CardCategory =
  | 'MOVIMENTO'          // Deslocamento tático no tatame
  | 'QUEDA'              // Quedas (Double leg, Single, Osoto Gari, etc.)
  | 'DEFESA_QUEDA'       // Defesas em pé (Sprawl, Whizzer, Esgrima)
  | 'PUXADA'             // Puxadas para guarda (Fechada, De La Riva)
  | 'PASSAGEM'           // Passagem de guarda (Toreando, Cruzada, etc.)
  | 'RETENCAO'           // Guarda ativa e reposição
  | 'RASPAGEM'           // Raspagens da guarda para cima
  | 'CONTROLE'           // Pressão, estabilização, domínio de pegada
  | 'TRANSICAO'          // Avanços de posição (Costas, Montada)
  | 'FINALIZACAO'        // Ataques de submissão (Estrangulamentos, Chaves)
  | 'DEFESA_FINALIZACAO';// Escapes técnicos de finalização

export type AthleteRole = 'any' | 'top' | 'bottom';

export interface CombatCard {
  id: string;
  name: string;
  category: CardCategory;
  description: string;
  energyCost: number;             // 10 to 45
  minBelt: Belt;                  // Minimum belt required to use
  
  // Positional preconditions
  validPositions: CombatPosition[];
  requiredRole: AthleteRole;      // Does athlete need to be on top, bottom or any?
  
  // Tactical grid reach
  spatialRange: number;           // 0 = ground/same cell, 1 = adjacent cell, 2 = dash/long shoot
  causesMovement?: {
    type: 'advance' | 'retreat' | 'pull_into_cell' | 'none';
    maxDistance?: number;
  };

  // Combat engine resolution factors
  successStat: string;            // Attribute in AthleteAttributes (e.g. 'quedas', 'passagemGuarda')
  counterStat: string;            // Defender attribute to contest (e.g. 'defesaQuedas')
  baseSuccessRate: number;        // Base percentage (e.g., 55%)

  // Outcomes on Success
  pointsOnSuccess?: number;       // IBJJF rules: 2 (quedas, raspagens), 3 (passagens), 4 (montada, costas)
  advantageOnSuccess?: boolean;
  advantageOnDefense?: boolean;
  targetPositionOnSuccess?: CombatPosition;
  newRoleOnSuccess?: AthleteRole;
  
  // Submission specific
  isSubmission?: boolean;
  submissionLockPower?: number;   // How deep the submission enters (30-70)

  // Visual & Audio Identity
  iconName: string;               // Key for custom SVG martial art graphics
  rarity: 'basic' | 'advanced' | 'signature' | 'master';
  giBonus?: 'any' | 'gi_only' | 'no_gi';
}
