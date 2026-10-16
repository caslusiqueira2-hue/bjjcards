import { Athlete } from '../types/athlete';
import { CombatCard } from '../types/cards';
import { CombatState, GridCoord, CombatActionLog } from '../types/combat';

export class CombatEngine {
  /**
   * Calculates Chebyshev distance on the 7x5 tactical board
   */
  public static getBoardDistance(a: GridCoord, b: GridCoord): number {
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  }

  /**
   * Initializes a brand new championship match
   */
  public static createMatch(
    player: Athlete,
    opponent: Athlete,
    roundTimeSeconds: number = 360 // 6 minutes IBJJF standard
  ): CombatState {
    return {
      matchId: `match_${Date.now()}`,
      roundTimeSeconds,
      turnNumber: 1,
      currentTurn: 'player',
      momentum: 0, // Starts balanced in the center
      tacticalAdvantage: null,
      lastClash: null,
      grid: {
        cols: 7,
        rows: 5,
        playerPosition: { x: 1, y: 2 },
        opponentPosition: { x: 5, y: 2 }
      },
      technical: {
        position: 'STANDING',
        topAthleteId: null,
        bottomAthleteId: null,
        activeSubmission: null,
        isPassageStabilized: false,
        timeInPosition: 0
      },
      scores: {
        player: { points: 0, advantages: 0, penalties: 0 },
        opponent: { points: 0, advantages: 0, penalties: 0 }
      },
      status: 'IN_PROGRESS',
      winnerId: null,
      actionLogs: [
        {
          id: `log_init_${Date.now()}`,
          turn: 1,
          actorId: 'referee',
          cardName: 'Combate!',
          category: 'MOVIMENTO',
          description: 'O árbitro central ajusta os atletas e autoriza: "COMBATE!" Começa o duelo de cartas no tatame.',
          timeRemaining: roundTimeSeconds
        }
      ],
      lastActionFx: null
    };
  }

  /**
   * Validates whether a card can be executed by an athlete in the current state
   */
  public static canPlayCard(
    card: CombatCard,
    athlete: Athlete,
    state: CombatState
  ): { valid: boolean; reason?: string } {
    // 1. Match must still be in progress
    if (state.status !== 'IN_PROGRESS') {
      return { valid: false, reason: 'O combate já foi encerrado.' };
    }

    // 2. Check stamina / energy
    if (athlete.currentEnergy < card.energyCost) {
      return {
        valid: false,
        reason: `Energia insuficiente (${Math.round(athlete.currentEnergy)}/${card.energyCost}). Descanse ou use Recuperar Fôlego.`
      };
    }

    // 3. Check technical position
    if (!card.validPositions.includes(state.technical.position)) {
      return {
        valid: false,
        reason: `Esta técnica só pode ser aplicada a partir de: ${card.validPositions.join(', ')}.`
      };
    }

    // 4. Check required role (Top vs Bottom)
    if (card.requiredRole !== 'any') {
      const isTop = state.technical.topAthleteId === athlete.id;
      const isBottom = state.technical.bottomAthleteId === athlete.id;

      if (card.requiredRole === 'top' && !isTop) {
        return {
          valid: false,
          reason: 'Esta técnica exige que o atleta esteja na posição superior (por cima).'
        };
      }

      if (card.requiredRole === 'bottom' && !isBottom) {
        return {
          valid: false,
          reason: 'Esta técnica exige que o atleta esteja na posição inferior (fazendo guarda / por baixo).'
        };
      }
    }

    return { valid: true };
  }

  /**
   * Resolves a card action and transitions the state
   */
  public static executeAction(
    card: CombatCard,
    actor: Athlete,
    target: Athlete,
    state: CombatState,
    deterministicRoll?: number // For testing
  ): { nextState: CombatState; nextActor: Athlete; nextTarget: Athlete } {
    const actorKey = state.currentTurn === 'player' ? 'player' : 'opponent';
    const targetKey = actorKey === 'player' ? 'opponent' : 'player';

    // Clone objects immutably
    const nextState: CombatState = JSON.parse(JSON.stringify(state));
    const nextActor: Athlete = JSON.parse(JSON.stringify(actor));
    const nextTarget: Athlete = JSON.parse(JSON.stringify(target));

    // Deduct energy & handle recovery cards
    nextActor.currentEnergy = Math.max(0, nextActor.currentEnergy - card.energyCost);
    if (card.id === 'rec_respiracao_base') {
      nextActor.currentEnergy = Math.min(nextActor.maxEnergy, nextActor.currentEnergy + 25);
    }

    // Calculate success probability
    const successRate = this.calculateSuccessRate(card, actor, target);
    const roll = deterministicRoll !== undefined ? deterministicRoll : Math.random() * 100;
    const isSuccess = roll < successRate;

    const currentSecs = nextState.roundTimeSeconds;

    if (isSuccess) {
      // 1. Points on success (IBJJF)
      if (card.pointsOnSuccess) {
        nextState.scores[actorKey].points += card.pointsOnSuccess;
      }
      if (card.advantageOnSuccess) {
        nextState.scores[actorKey].advantages += 1;
      }

      // 2. Position updates
      if (card.targetPositionOnSuccess) {
        nextState.technical.position = card.targetPositionOnSuccess;
        if (card.newRoleOnSuccess === 'top') {
          nextState.technical.topAthleteId = actor.id;
          nextState.technical.bottomAthleteId = target.id;
        } else if (card.newRoleOnSuccess === 'bottom') {
          nextState.technical.bottomAthleteId = actor.id;
          nextState.technical.topAthleteId = target.id;
        }
      }

      // 3. Submission mechanics
      if (card.isSubmission) {
        const lockPower = card.submissionLockPower || 50;
        if (!nextState.technical.activeSubmission) {
          nextState.technical.activeSubmission = {
            techniqueId: card.id,
            techniqueName: card.name,
            attackerId: actor.id,
            defenderId: target.id,
            lockDepth: lockPower,
            escapeChance: Math.max(10, 100 - (actor.attributes.finalizacoes - target.attributes.defesaFinalizacoes)),
            turnsActive: 1
          };
          nextState.scores[actorKey].advantages += 1; // Real submission danger gives advantage!
        } else {
          nextState.technical.activeSubmission.lockDepth += lockPower * 0.6;
        }

        // Check if lockDepth reached 100% => SUBMISSION!
        if (nextState.technical.activeSubmission.lockDepth >= 100) {
          nextState.status = 'SUBMISSION';
          nextState.winnerId = actor.id;
          nextState.winMethod = `Finalização por ${card.name}`;
          nextState.lastActionFx = {
            type: 'tapout',
            athleteId: actor.id,
            text: `BATEU! FINALIZAÇÃO POR ${card.name.toUpperCase()}!`
          };

          nextState.actionLogs.unshift({
            id: `log_${Date.now()}_sub`,
            turn: nextState.turnNumber,
            actorId: actor.id,
            cardName: card.name,
            category: card.category,
            description: `ESPACULAR! ${actor.name} encaixou com precisão cirúrgica o golpe "${card.name}"! O adversário foi forçado a dar os 3 tapinhas no tatame! Fim de luta!`,
            isCritical: true,
            isSubmissionAttempt: true,
            timeRemaining: currentSecs
          });

          return { nextState, nextActor, nextTarget };
        } else {
          nextState.lastActionFx = {
            type: 'submission_danger',
            athleteId: actor.id,
            text: `Perigo real de finalização (${card.name})!`
          };
        }
      } else {
        // If actor was in submission and defended/escaped
        if (
          nextState.technical.activeSubmission &&
          nextState.technical.activeSubmission.defenderId === actor.id
        ) {
          nextState.technical.activeSubmission = null;
          nextState.lastActionFx = {
            type: 'escape',
            athleteId: actor.id,
            text: 'Escapou da finalização com maestria!'
          };
        } else {
          // Set visual action FX
          if (card.category === 'QUEDA') {
            nextState.lastActionFx = { type: 'takedown', athleteId: actor.id, text: `Queda concluída! (+${card.pointsOnSuccess || 2} pts)` };
          } else if (card.category === 'PASSAGEM') {
            nextState.lastActionFx = { type: 'pass', athleteId: actor.id, text: `Passagem de guarda estabilizada! (+3 pts)` };
          } else if (card.category === 'RASPAGEM') {
            nextState.lastActionFx = { type: 'sweep', athleteId: actor.id, text: `Raspagem executada! (+2 pts)` };
          } else if (card.targetPositionOnSuccess === 'MOUNT' || card.targetPositionOnSuccess === 'BACK_MOUNT') {
            nextState.lastActionFx = { type: 'mount', athleteId: actor.id, text: `Domínio absoluto conquistado! (+4 pts)` };
          } else {
            nextState.lastActionFx = { type: 'move', athleteId: actor.id, text: `${card.name} com sucesso!` };
          }
        }
      }

      // Dynamic Momentum Shift on Success
      const momentumDelta = actorKey === 'player' ? 22 : -22;
      nextState.momentum = Math.max(-100, Math.min(100, (nextState.momentum || 0) + momentumDelta));

      // Tactical Setup Advantage
      if (card.category === 'MOVIMENTO' || card.id === 'ctrl_pressao_100kg') {
        nextState.tacticalAdvantage = actorKey;
      } else {
        nextState.tacticalAdvantage = null;
      }

      // Record Card Clash Event for high-impact visual duel feedback
      nextState.lastClash = {
        card,
        actorId: actor.id,
        targetId: target.id,
        isSuccess: true,
        headline: card.pointsOnSuccess ? `+${card.pointsOnSuccess} PONTOS!` : card.isSubmission ? 'GOLPE ENCAIXADO!' : 'TÉCNICA EXECUTADA!',
        pointsAwarded: card.pointsOnSuccess,
        positionChangedTo: card.targetPositionOnSuccess,
        isSubmission: card.isSubmission,
        timestamp: Date.now()
      };

      // 4. Board movement
      this.resolveMovement(card, actorKey, nextState);

      // Add log
      nextState.actionLogs.unshift({
        id: `log_${Date.now()}_${Math.random()}`,
        turn: nextState.turnNumber,
        actorId: actor.id,
        cardName: card.name,
        category: card.category,
        description: `${actor.name} executou "${card.name}" com sucesso!`,
        pointsAwarded: card.pointsOnSuccess ? { athleteId: actor.id, amount: card.pointsOnSuccess, reason: card.name } : undefined,
        isCritical: (card.pointsOnSuccess && card.pointsOnSuccess >= 3) || card.isSubmission,
        timeRemaining: currentSecs
      });
    } else {
      // Failed action / Defense Counter
      const momentumDelta = actorKey === 'player' ? -15 : 15;
      nextState.momentum = Math.max(-100, Math.min(100, (nextState.momentum || 0) + momentumDelta));
      nextState.tacticalAdvantage = null;

      // Record Defense Clash
      nextState.lastClash = {
        card,
        actorId: actor.id,
        targetId: target.id,
        isSuccess: false,
        headline: 'DEFENDIDO!',
        timestamp: Date.now()
      };

      if (card.isSubmission) {
        nextState.lastActionFx = {
          type: 'escape',
          athleteId: target.id,
          text: `Defesa firme! ${target.name} anulou o ataque.`
        };
      } else {
        nextState.lastActionFx = {
          type: 'move',
          athleteId: target.id,
          text: `${target.name} antecipou e defendeu a ação.`
        };
      }

      // Target might get advantage on great defense
      if (card.advantageOnDefense) {
        nextState.scores[targetKey].advantages += 1;
      }

      nextState.actionLogs.unshift({
        id: `log_${Date.now()}_${Math.random()}`,
        turn: nextState.turnNumber,
        actorId: actor.id,
        cardName: card.name,
        category: card.category,
        description: `${actor.name} tentou "${card.name}", mas ${target.name} manteve a base firme e neutralizou o movimento.`,
        isDefenseSuccess: true,
        timeRemaining: currentSecs
      });
    }

    // Advance round time by 20 seconds
    nextState.roundTimeSeconds = Math.max(0, nextState.roundTimeSeconds - 20);
    nextState.turnNumber += 1;

    // Stamina recovery per turn
    nextActor.currentEnergy = Math.min(nextActor.maxEnergy, nextActor.currentEnergy + nextActor.staminaRecoveryRate);
    nextTarget.currentEnergy = Math.min(nextTarget.maxEnergy, nextTarget.currentEnergy + nextTarget.staminaRecoveryRate);

    // Switch turn
    nextState.currentTurn = actorKey === 'player' ? 'opponent' : 'player';

    // Check time expiration
    if (nextState.roundTimeSeconds <= 0 && nextState.status === 'IN_PROGRESS') {
      this.evaluateTimeExpiredWinner(nextState, actor, target);
    }

    return { nextState, nextActor, nextTarget };
  }

  /**
   * Calculates success rate considering attributes, style bonuses, and stamina
   */
  public static calculateSuccessRate(
    card: CombatCard,
    actor: Athlete,
    defender: Athlete
  ): number {
    const actorAttrs = actor.attributes as unknown as Record<string, number>;
    const defenderAttrs = defender.attributes as unknown as Record<string, number>;

    const attackStat = actorAttrs[card.successStat] || 50;
    const defenseStat = defenderAttrs[card.counterStat] || 50;

    let rate = card.baseSuccessRate;

    // Stat differential modifier
    const delta = attackStat - defenseStat;
    rate += delta * 0.45;

    // Stamina modifier
    const actorStaminaRatio = actor.currentEnergy / Math.max(1, actor.maxEnergy);
    const defenderStaminaRatio = defender.currentEnergy / Math.max(1, defender.maxEnergy);
    rate += (actorStaminaRatio - defenderStaminaRatio) * 15;

    // Style synergy
    if (actor.style === 'Passador' && card.category === 'PASSAGEM') rate += 10;
    if (actor.style === 'Guardeiro' && (card.category === 'RASPAGEM' || card.category === 'RETENCAO')) rate += 10;
    if (actor.style === 'Wrestler' && card.category === 'QUEDA') rate += 10;
    if (actor.style === 'Finalizador' && card.category === 'FINALIZACAO') rate += 12;
    if (actor.style === 'Estrategista' && card.category === 'CONTROLE') rate += 10;

    // Keep between 15% and 88%
    return Math.min(88, Math.max(15, Math.round(rate)));
  }

  /**
   * Resolves physical coordinate movement on the 7x5 tactical board
   */
  private static resolveMovement(
    card: CombatCard,
    actorKey: 'player' | 'opponent',
    state: CombatState
  ) {
    if (!card.causesMovement) return;

    const pPos = state.grid.playerPosition;
    const oPos = state.grid.opponentPosition;

    if (card.causesMovement.type === 'advance') {
      if (actorKey === 'player') {
        if (pPos.x < oPos.x - 1) {
          pPos.x = Math.min(state.grid.cols - 1, pPos.x + (card.causesMovement.maxDistance || 1));
        }
      } else {
        if (oPos.x > pPos.x + 1) {
          oPos.x = Math.max(0, oPos.x - (card.causesMovement.maxDistance || 1));
        }
      }
    } else if (card.causesMovement.type === 'retreat') {
      if (actorKey === 'player') {
        pPos.x = Math.max(0, pPos.x - (card.causesMovement.maxDistance || 1));
      } else {
        oPos.x = Math.min(state.grid.cols - 1, oPos.x + (card.causesMovement.maxDistance || 1));
      }
    } else if (card.causesMovement.type === 'pull_into_cell') {
      // Pulling to guard aligns them on the mat
      if (actorKey === 'player') {
        oPos.x = Math.min(state.grid.cols - 1, pPos.x + 1);
        oPos.y = pPos.y;
      } else {
        pPos.x = Math.max(0, oPos.x - 1);
        pPos.y = oPos.y;
      }
    }
  }

  /**
   * Decides match winner when time runs out according to IBJJF protocol
   */
  public static evaluateTimeExpiredWinner(
    state: CombatState,
    player: Athlete,
    opponent: Athlete
  ) {
    state.status = 'POINTS';
    const p = state.scores.player;
    const o = state.scores.opponent;

    // 1. Points
    if (p.points > o.points) {
      state.winnerId = player.id;
      state.winMethod = `Decisão por Pontos (${p.points} x ${o.points})`;
    } else if (o.points > p.points) {
      state.winnerId = opponent.id;
      state.winMethod = `Decisão por Pontos (${o.points} x ${p.points})`;
    }
    // 2. Advantages
    else if (p.advantages > o.advantages) {
      state.winnerId = player.id;
      state.winMethod = `Decisão por Vantagens (${p.advantages} x ${o.advantages})`;
    } else if (o.advantages > p.advantages) {
      state.winnerId = opponent.id;
      state.winMethod = `Decisão por Vantagens (${o.advantages} x ${p.advantages})`;
    }
    // 3. Penalties (fewer penalties wins)
    else if (p.penalties < o.penalties) {
      state.winnerId = player.id;
      state.winMethod = `Decisão por Punições do Adversário`;
    } else if (o.penalties < p.penalties) {
      state.winnerId = opponent.id;
      state.winMethod = `Decisão por Punições`;
    }
    // 4. Referee Decision based on initiative and tatame momentum
    else {
      if ((state.momentum || 0) > 0) {
        state.winnerId = player.id;
        state.winMethod = `Decisão Unânime dos Árbitros (Maior Agressividade e Controle de Tatame)`;
      } else if ((state.momentum || 0) < 0) {
        state.winnerId = opponent.id;
        state.winMethod = `Decisão Unânime dos Árbitros (Maior Agressividade do Adversário)`;
      } else {
        state.winnerId = player.id;
        state.winMethod = `Decisão dos Árbitros (Iniciativa e Domínio Tático)`;
      }
    }

    state.actionLogs.unshift({
      id: `log_time_expired_${Date.now()}`,
      turn: state.turnNumber,
      actorId: 'referee',
      cardName: 'Tempo Esgotado!',
      category: 'CONTROLE',
      description: `O cronômetro zerou! Fim de luta. Árbitro central ergue o braço do vencedor: ${state.winnerId === player.id ? player.name : opponent.name} (${state.winMethod}).`,
      isCritical: true,
      timeRemaining: 0
    });
  }
}
