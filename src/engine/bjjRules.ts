import { Belt } from '../types/athlete';
import { CombatPosition } from '../types/combat';

export const IBJJF_POINTS = {
  TAKEDOWN: 2,
  SWEEP: 2,
  KNEE_ON_BELLY: 2,
  GUARD_PASS: 3,
  MOUNT: 4,
  BACK_MOUNT: 4
} as const;

export interface MoveLegalityCheck {
  isLegal: boolean;
  reason?: string;
}

export function isTechniqueLegalForBelt(techniqueId: string, belt: Belt): MoveLegalityCheck {
  // IBJJF Official Gi Rules:
  // Heelhooks / Chave de Calcanhar are strictly ILLEGAL in Gi for all belts
  if (techniqueId.includes('heelhook') || techniqueId.includes('calcanhar')) {
    return {
      isLegal: false,
      reason: 'Chave de calcanhar é expressamente proibida em competições de kimono da IBJJF.'
    };
  }

  // Kneebar / Chave de Joelho e Biceps Slicer are only legal for Brown & Black belts
  if (techniqueId.includes('kneebar') || techniqueId.includes('biceps_slicer')) {
    if (belt === 'white' || belt === 'blue' || belt === 'purple') {
      return {
        isLegal: false,
        reason: 'Chave de joelho reta e compressão de bíceps só são permitidas para Faixas Marrom e Preta.'
      };
    }
  }

  // Jumping Guard / Puxada saltando fechando triângulo direto proibida na branca
  if (techniqueId.includes('jumping_guard') && belt === 'white') {
    return {
      isLegal: false,
      reason: 'Pular na guarda é proibido para a Faixa Branca pelo risco de lesão nos joelhos.'
    };
  }

  return { isLegal: true };
}

export function getPositionNamePt(pos: CombatPosition): string {
  switch (pos) {
    case 'STANDING': return 'Luta em Pé (Distância)';
    case 'CLINCH': return 'Engajamento no Clinch & Pegadas';
    case 'CLOSED_GUARD': return 'Guarda Fechada';
    case 'OPEN_GUARD': return 'Guarda Aberta';
    case 'HALF_GUARD': return 'Meia-Guarda';
    case 'SIDE_CONTROL': return 'Controle Lateral (100kg)';
    case 'MOUNT': return 'Montada';
    case 'BACK_MOUNT': return 'Pegada de Costas com Ganchos';
    case 'TURTLE': return 'Tartaruga (4 Apoios)';
    default: return pos;
  }
}
