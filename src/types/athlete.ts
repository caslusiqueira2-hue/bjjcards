// Types for Brazilian Jiu-Jitsu Belt Graduations
export type Belt = 'white' | 'blue' | 'purple' | 'brown' | 'black';

export type WeightClass = 
  | 'Galo'         // Roosteweight (-57.5 kg)
  | 'Pluma'        // Light Feather (-64 kg)
  | 'Pena'         // Feather (-70 kg)
  | 'Leve'         // Light (-76 kg)
  | 'Médio'        // Middle (-82.3 kg)
  | 'Meio-Pesado'  // Medium Heavy (-88.3 kg)
  | 'Pesado'       // Heavy (-94.3 kg)
  | 'Super Pesado';// Super Heavy (+94.3 kg)

export type FightingStyle = 
  | 'Passador'     // Pressure passer, heavy hips, guard passing specialist
  | 'Guardeiro'    // Guard specialist, flexible, sweeps, leg entanglements, berimbolo
  | 'Wrestler'     // High takedown rate, top control, explosive takedowns
  | 'Finalizador'  // High submission hunting, opportunistic chokes & joint locks
  | 'Estrategista';// Point fighter, positional control, clock and advantage management

/**
 * 6 Core Streamlined BJJ Competencies
 * Enxuto, objetivo e focado nas mecânicas reais do Jiu-Jitsu
 */
export interface AthleteAttributes {
  // 1. Quedas & Wrestling (Double leg, Single leg, Judô, Sprawl)
  quedas: number;
  defesaQuedas?: number;

  // 2. Passagem de Guarda (Toreando, Knee slice, Emborcada, Over-under)
  passagemGuarda: number;

  // 3. Guarda & Raspagens (Guarda fechada, aberta, De La Riva, meia, berimbolo, retenção)
  retencaoGuarda: number;
  raspagens: number;

  // 4. Finalizações & Escapes (Armlock, Triângulo, Mata-leão, Kimura, defesas milimétricas)
  finalizacoes: number;
  defesaFinalizacoes: number;

  // 5. Controle Posicional & Pressão (100kg, Montada, Costas, Joelho na barriga, Postura)
  controlePosicional: number;

  // 6. Gás & Condicionamento (Força isométrica, explosão, resistência e recuperação)
  forca: number;
  explosao: number;
  resistencia: number;
  mobilidade?: number;
  recuperacao?: number;

  // Tático / Mental (auxiliares)
  leituraAdversario?: number;
  tomadaDecisao?: number;
  disciplinaEstrategica?: number;
  adaptacao?: number;
  experienciaCompetitiva?: number;
  friezaPressao?: number;
}

export type AvatarId =
  | 'avatar_pitbull'
  | 'avatar_samurai'
  | 'avatar_carcara'
  | 'avatar_predador'
  | 'avatar_mestre'
  | 'avatar_guerreira'
  | 'avatar_fenix'
  | 'avatar_pantera'
  | 'avatar_01_cabelo_castanho'
  | 'avatar_02_cabelo_platinado'
  | 'avatar_03_degrade_platinado'
  | 'avatar_04_moicano'
  | 'avatar_05_careca'
  | 'avatar_06_careca_barbudo'
  | 'avatar_07_cabelo_e_barba'
  | 'avatar_custom';

export interface AthleteVisual {
  giColor: 'white' | 'royal-blue' | 'black' | 'navy';
  patchStyle: 'classic' | 'modern' | 'minimal' | 'heavy';
  avatarSeed: string;
  avatarId: AvatarId | string;
  avatarUrl?: string; // Direct image URL or Base64 uploaded photo
  beltStripes: number; // 0 to 4 degrees (divisas)
}

export interface CareerRecord {
  matches: number;
  wins: number;
  losses: number;
  submissions: number;
  titles: string[];
  rivalries: Record<string, { wins: number; losses: number }>;
}

export interface Athlete {
  id: string;
  name: string;
  nickname?: string;
  academy: string;
  belt: Belt;
  stripes: number; // 0 to 4 graus (divisas)
  weightClass: WeightClass;
  style: FightingStyle;
  attributes: AthleteAttributes;
  visual: AthleteVisual;
  
  // Dynamic in-match state
  currentEnergy: number;
  maxEnergy: number;
  staminaRecoveryRate: number;
  
  // Career progression state
  reputation: number;       // 0-1000
  fatigue: number;          // 0-100 (affects combat energy and injury risk)
  skillPoints: number;      // To upgrade attributes
  trainingWeeks?: number;    // Semanas de tatame acumuladas
  opensDisputed?: number;    // Quantidade de Opens disputados
  opensWon?: number;         // Quantidade de Opens vencidos (Ouro)
  careerRecord: CareerRecord;
}
