import { Athlete } from '../types/athlete';
import { CombatCard } from '../types/cards';
import { CombatState } from '../types/combat';
import { CombatEngine } from './combatEngine';

export class AIEngine {
  /**
   * Intelligently selects a tactical card for the clash duel.
   * Ensures the opponent is proactive and attacks aggressively based on fighting style,
   * while making smart situational choices for an intensely contested match.
   */
  public static selectBestCard(
    deck: CombatCard[],
    ai: Athlete,
    player: Athlete,
    state: CombatState
  ): CombatCard | null {
    // 1. Filter playable cards for AI
    const playableCards = deck.filter((card) => {
      const check = CombatEngine.canPlayCard(card, ai, state);
      return check.valid;
    });

    if (playableCards.length === 0) {
      const breathingCard = deck.find((c) => c.id === 'rec_respiracao_base');
      if (breathingCard) {
        const check = CombatEngine.canPlayCard(breathingCard, ai, state);
        if (check.valid) return breathingCard;
      }
      return null;
    }

    const isAiDefendingSubmission =
      state.technical.activeSubmission &&
      state.technical.activeSubmission.defenderId === ai.id;

    const isPlayerDefendingSubmission =
      state.technical.activeSubmission &&
      state.technical.activeSubmission.defenderId === player.id;

    const pointDiff = state.scores.opponent.points - state.scores.player.points;
    const aiEnergy = ai.currentEnergy;

    let bestCard: CombatCard = playableCards[0];
    let highestScore = -99999;

    for (const card of playableCards) {
      let score = 50;

      // 1. Emergency Defense when caught in submission
      if (isAiDefendingSubmission) {
        if (card.category === 'DEFESA_FINALIZACAO' || card.id.startsWith('def_')) {
          score += 2500;
        } else {
          score -= 1500;
        }
      }

      // 2. Lethal Kill Shot when Player is caught in submission
      if (isPlayerDefendingSubmission) {
        if (card.isSubmission) {
          score += 2000; // Finish the submission!
        }
      }

      // 3. Proactive Attacks by Position (OPONENTE ATACA COM VONTADE!)
      if (state.technical.position === 'STANDING' || state.technical.position === 'CLINCH') {
        // High propensity to ATTACK WITH TAKEDOWNS or GUARD PULLS
        if (card.category === 'QUEDA') {
          score += 220; // Aggressive takedowns!
          if (ai.style === 'Wrestler' || ai.style === 'Passador') score += 80;
        } else if (card.category === 'PUXADA') {
          if (ai.style === 'Guardeiro') score += 240;
          else score += 120;
        } else if (card.category === 'MOVIMENTO') {
          score += 110;
        } else if (card.category === 'DEFESA_QUEDA') {
          score += 130;
        }
      } else {
        // GROUND SITUATIONS
        const isAiTop = state.technical.topAthleteId === ai.id;
        const isAiBottom = state.technical.bottomAthleteId === ai.id;

        if (isAiTop) {
          // AI ON TOP: Attack with Guard Pass, Mount transitions, or submissions
          if (card.category === 'PASSAGEM') {
            score += 270; // Attack guard vigorously (+3 pts)
          } else if (card.category === 'TRANSICAO' || card.pointsOnSuccess === 4) {
            score += 290; // Go for mount or back (+4 pts)
          } else if (card.isSubmission && (state.technical.position === 'MOUNT' || state.technical.position === 'BACK_MOUNT')) {
            score += 330; // Choke or armbar from top
          } else if (card.category === 'CONTROLE') {
            score += 140;
          } else if (card.category === 'DEFESA_FINALIZACAO') {
            score += 150; // Defend guard attacks
          }
        } else if (isAiBottom) {
          // AI ON BOTTOM: Attack with Sweeps or Submissions from guard, or escapes
          if (card.category === 'RASPAGEM') {
            score += 260; // Sweep to reverse and score 2 pts
          } else if (card.isSubmission) {
            score += 240; // Armlock / Triângulo / Kimura from bottom
          } else if (card.category === 'RETENCAO') {
            score += 170; // Keep guard or shrimp escape
          } else if (card.category === 'DEFESA_FINALIZACAO' || card.id.startsWith('def_')) {
            score += 160;
          }
        }
      }

      // 4. Style bonuses
      if (ai.style === 'Passador' && (card.category === 'PASSAGEM' || card.category === 'QUEDA')) score += 70;
      if (ai.style === 'Guardeiro' && (card.category === 'RASPAGEM' || card.category === 'PUXADA')) score += 70;
      if (ai.style === 'Wrestler' && card.category === 'QUEDA') score += 90;
      if (ai.style === 'Finalizador' && card.isSubmission) score += 95;
      if (ai.style === 'Estrategista' && card.pointsOnSuccess) score += 60;

      // 5. Point chase if trailing
      if (pointDiff < 0) {
        if (card.pointsOnSuccess) score += card.pointsOnSuccess * 40;
      }

      // 6. Energy consideration
      if (aiEnergy < 25) {
        if (card.id === 'rec_respiracao_base') score += 200;
        else if (card.energyCost > 30) score -= 120;
      }

      // 7. Tactical unpredictability
      score += Math.random() * 25;

      if (score > highestScore) {
        highestScore = score;
        bestCard = card;
      }
    }

    return bestCard;
  }

  /**
   * Returns a dynamic tactical intent phrase describing what the opponent is threatening
   */
  public static getOpponentTacticalIntent(ai: Athlete, state: CombatState): string {
    const pos = state.technical.position;
    const isAiTop = state.technical.topAthleteId === ai.id;

    if (state.technical.activeSubmission?.attackerId === ai.id) {
      return `Ajustando finalização com ${state.technical.activeSubmission.techniqueName}!`;
    }
    if (state.technical.activeSubmission?.defenderId === ai.id) {
      return 'Buscando escape de emergência!';
    }

    if (pos === 'STANDING' || pos === 'CLINCH') {
      if (ai.style === 'Wrestler' || ai.style === 'Passador') return 'Preparando entrada explosiva de queda!';
      if (ai.style === 'Guardeiro') return 'Estudando puxada rápida para a guarda!';
      return 'Disputando pegadas e buscando queda!';
    }

    if (pos === 'CLOSED_GUARD') {
      return isAiTop
        ? 'Colocando pressão para abrir a guarda!'
        : 'Armando raspagem ou bote de finalização!';
    }

    if (pos === 'OPEN_GUARD') {
      return isAiTop
        ? 'Fatiando com velocidade (Knee Slice / Toreando)!'
        : 'Criando ganchos para inverter / berimbolo!';
    }

    if (pos === 'HALF_GUARD') {
      return isAiTop
        ? 'Pesando o ombro no rosto e amassando!'
        : 'Ganhando esgrima profunda para subir!';
    }

    if (pos === 'SIDE_CONTROL' || pos === 'MOUNT' || pos === 'BACK_MOUNT') {
      return isAiTop
        ? 'Estabilizando domínio e caçando finalização!'
        : 'Tentando fuga explosiva de quadril / reposição!';
    }

    return `${ai.name.split(' ')[0]} buscando iniciativa no tatame...`;
  }
}
