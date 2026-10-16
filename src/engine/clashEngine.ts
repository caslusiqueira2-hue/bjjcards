import { CombatCard } from '../types/cards';
import { Athlete } from '../types/athlete';
import { CombatState, CombatPosition } from '../types/combat';
import { CombatEngine } from './combatEngine';
import { getPositionNamePt } from './bjjRules';

export interface ClashResolution {
  winner: 'player' | 'opponent' | 'draw';
  playerCard: CombatCard;
  opponentCard: CombatCard;
  headline: string;
  description: string;
  tacticalAdvantageWinner?: 'player' | 'opponent';
  pointsAwarded?: {
    athleteId: string;
    athleteName: string;
    points: number;
    reason: string;
  };
  advantagesAwarded?: {
    athleteId: string;
    athleteName: string;
  };
  newPosition: CombatPosition;
  newPositionName: string;
  playerRoleNow: 'top' | 'bottom' | 'standing';
  opponentRoleNow: 'top' | 'bottom' | 'standing';
  newTopAthleteId?: string | null;
  newBottomAthleteId?: string | null;
  submissionPowerChange?: number;
  isSubmissionFinish?: boolean;
}

export class ClashEngine {
  /**
   * Evaluates the situational rock-paper-scissors matchup between two chosen cards.
   * Returns whether one card naturally counters the other in the current position.
   */
  public static getCardMatchupAdvantage(
    cardA: CombatCard,
    cardB: CombatCard,
    position: CombatPosition
  ): { advantageFor: 'A' | 'B' | 'neutral'; reason: string; bonusRate: number } {
    // 1. STANDING / CLINCH Matchups
    if (position === 'STANDING' || position === 'CLINCH') {
      // Queda vs Defesa de Queda: Sprawl counters Takedown!
      if (cardA.category === 'QUEDA' && cardB.category === 'DEFESA_QUEDA') {
        return { advantageFor: 'B', reason: 'Defesa de Sprawl antecipou e anulou a tentativa de queda!', bonusRate: 35 };
      }
      if (cardB.category === 'QUEDA' && cardA.category === 'DEFESA_QUEDA') {
        return { advantageFor: 'A', reason: 'Defesa de Sprawl antecipou e anulou a tentativa de queda!', bonusRate: 35 };
      }

      // Queda vs Puxada: Takedown scores on a careless pull, or pull takes down
      if (cardA.category === 'QUEDA' && cardB.category === 'PUXADA') {
        return { advantageFor: 'A', reason: 'Ataque de queda explodiu antes da guarda fechar (+2 pts)!', bonusRate: 20 };
      }
      if (cardB.category === 'QUEDA' && cardA.category === 'PUXADA') {
        return { advantageFor: 'B', reason: 'Ataque de queda explodiu antes da guarda fechar (+2 pts)!', bonusRate: 20 };
      }

      // Puxada vs Defesa de Queda: Pulling guard negates the sprawl defense completely!
      if (cardA.category === 'PUXADA' && cardB.category === 'DEFESA_QUEDA') {
        return { advantageFor: 'A', reason: 'Puxada para guarda surpreendeu e anulou a postura de sprawl!', bonusRate: 30 };
      }
      if (cardB.category === 'PUXADA' && cardA.category === 'DEFESA_QUEDA') {
        return { advantageFor: 'B', reason: 'Puxada para guarda surpreendeu e anulou a postura de sprawl!', bonusRate: 30 };
      }

      // Finta/Movimento vs Defesa: Fakes bait out defensive overreactions
      if (cardA.category === 'MOVIMENTO' && cardB.category === 'DEFESA_QUEDA') {
        return { advantageFor: 'A', reason: 'Finta inteligente desequilibrou a postura defensiva!', bonusRate: 25 };
      }
      if (cardB.category === 'MOVIMENTO' && cardA.category === 'DEFESA_QUEDA') {
        return { advantageFor: 'B', reason: 'Finta inteligente desequilibrou a postura defensiva!', bonusRate: 25 };
      }
    }

    // 2. GUARD SITUATIONS (Closed, Open, Half Guard)
    if (position === 'CLOSED_GUARD' || position === 'OPEN_GUARD' || position === 'HALF_GUARD') {
      // Passagem vs Raspagem: Sweep counters forward momentum of passing!
      if (cardA.category === 'PASSAGEM' && cardB.category === 'RASPAGEM') {
        return { advantageFor: 'B', reason: 'Raspagem aproveitou o avanço do passador para invertê-lo!', bonusRate: 30 };
      }
      if (cardB.category === 'PASSAGEM' && cardA.category === 'RASPAGEM') {
        return { advantageFor: 'A', reason: 'Raspagem aproveitou o avanço do passador para invertê-lo!', bonusRate: 30 };
      }

      // Passagem vs Retenção de Guarda: Retention stops passing
      if (cardA.category === 'PASSAGEM' && cardB.category === 'RETENCAO') {
        return { advantageFor: 'B', reason: 'Escudo e reposição de guarda travaram a passagem!', bonusRate: 25 };
      }
      if (cardB.category === 'PASSAGEM' && cardA.category === 'RETENCAO') {
        return { advantageFor: 'A', reason: 'Escudo e reposição de guarda travaram a passagem!', bonusRate: 25 };
      }

      // Raspagem vs Defesa de Raspagem (Base Baixa, Neutralizar Ganchos, Esgrima Pesada)
      if (cardA.category === 'RASPAGEM' && (cardB.id.startsWith('def_base') || cardB.id.startsWith('def_neutralizar') || cardB.id.startsWith('def_esgrima'))) {
        return { advantageFor: 'B', reason: 'Base pesada e quebra de pegada anularam o desequilíbrio da raspagem!', bonusRate: 35 };
      }
      if (cardB.category === 'RASPAGEM' && (cardA.id.startsWith('def_base') || cardA.id.startsWith('def_neutralizar') || cardA.id.startsWith('def_esgrima'))) {
        return { advantageFor: 'A', reason: 'Base pesada e quebra de pegada anularam o desequilíbrio da raspagem!', bonusRate: 35 };
      }

      // Finalização vs Defesa de Finalização: Posture/Grip lock stops submissions
      if (cardA.category === 'FINALIZACAO' && (cardB.category === 'DEFESA_FINALIZACAO' || cardB.id.startsWith('def_'))) {
        return { advantageFor: 'B', reason: 'Defesa técnica de postura quebrou o ataque de finalização!', bonusRate: 35 };
      }
      if (cardB.category === 'FINALIZACAO' && (cardA.category === 'DEFESA_FINALIZACAO' || cardA.id.startsWith('def_'))) {
        return { advantageFor: 'A', reason: 'Defesa técnica de postura quebrou o ataque de finalização!', bonusRate: 35 };
      }

      // Finalização vs Passagem descuidada: Submissions catch unguarded passes!
      if (cardA.category === 'FINALIZACAO' && cardB.category === 'PASSAGEM') {
        return { advantageFor: 'A', reason: 'Bote de finalização surpreendeu a entrada afoita de passagem!', bonusRate: 25 };
      }
      if (cardB.category === 'FINALIZACAO' && cardA.category === 'PASSAGEM') {
        return { advantageFor: 'B', reason: 'Bote de finalização surpreendeu a entrada afoita de passagem!', bonusRate: 25 };
      }
    }

    // 3. DOMINANT POSITIONS (Side Control, Mount, Back Mount, Turtle)
    if (position === 'SIDE_CONTROL' || position === 'MOUNT' || position === 'BACK_MOUNT' || position === 'TURTLE') {
      // Finalização vs Defesa de Finalização
      if (cardA.category === 'FINALIZACAO' && (cardB.category === 'DEFESA_FINALIZACAO' || cardB.id.startsWith('def_'))) {
        return { advantageFor: 'B', reason: 'Defesa desesperada protegeu o pescoço/braço e evitou o arrocho!', bonusRate: 30 };
      }
      if (cardB.category === 'FINALIZACAO' && (cardA.category === 'DEFESA_FINALIZACAO' || cardA.id.startsWith('def_'))) {
        return { advantageFor: 'A', reason: 'Defesa desesperada protegeu o pescoço/braço e evitou o arrocho!', bonusRate: 30 };
      }

      // Transição de Upa vs Controle do Topo
      if ((cardA.id === 'trans_upa_montada' || cardA.category === 'RASPAGEM') && cardB.category === 'CONTROLE') {
        return { advantageFor: 'neutral', reason: 'Disputa de explosão na ponte contra a base estabilizada!', bonusRate: 10 };
      }
    }

    return { advantageFor: 'neutral', reason: 'Ambos os atletas disputam o domínio técnico da posição.', bonusRate: 0 };
  }

  /**
   * Resolves the simultaneous clash of both player's card and opponent's card
   */
  public static resolveClash(
    playerCard: CombatCard,
    opponentCard: CombatCard,
    player: Athlete,
    opponent: Athlete,
    state: CombatState,
    options?: {
      opponentInitiated?: boolean;
      playerStalled?: boolean;
    }
  ): {
    nextState: CombatState;
    nextPlayer: Athlete;
    nextOpponent: Athlete;
    resolution: ClashResolution;
  } {
    const nextState: CombatState = JSON.parse(JSON.stringify(state));
    const nextPlayer: Athlete = JSON.parse(JSON.stringify(player));
    const nextOpponent: Athlete = JSON.parse(JSON.stringify(opponent));

    // Deduct stamina for both cards
    nextPlayer.currentEnergy = Math.max(0, nextPlayer.currentEnergy - playerCard.energyCost);
    nextOpponent.currentEnergy = Math.max(0, nextOpponent.currentEnergy - opponentCard.energyCost);

    if (playerCard.id === 'rec_respiracao_base') {
      nextPlayer.currentEnergy = Math.min(nextPlayer.maxEnergy, nextPlayer.currentEnergy + 25);
    }
    if (opponentCard.id === 'rec_respiracao_base') {
      nextOpponent.currentEnergy = Math.min(nextOpponent.maxEnergy, nextOpponent.currentEnergy + 25);
    }

    // Evaluate situational matchup counter
    const matchup = this.getCardMatchupAdvantage(playerCard, opponentCard, state.technical.position);

    // Calculate base chances
    let playerPower = CombatEngine.calculateSuccessRate(playerCard, player, opponent);
    let opponentPower = CombatEngine.calculateSuccessRate(opponentCard, opponent, player);

    // Apply situational advantage
    if (matchup.advantageFor === 'A') {
      playerPower += matchup.bonusRate;
      opponentPower -= 15;
    } else if (matchup.advantageFor === 'B') {
      opponentPower += matchup.bonusRate;
      playerPower -= 15;
    }

    // Opponent initiative surprise bonus if opponent initiated first
    if (options?.opponentInitiated) {
      opponentPower += 15;
      playerPower -= 15;
    }

    // Apply tactical momentum bonuses
    if (state.momentum > 20) playerPower += 10;
    if (state.momentum < -20) opponentPower += 10;

    // Tactical setup advantage from previous fintas
    if (state.tacticalAdvantage === 'player') playerPower += 15;
    if (state.tacticalAdvantage === 'opponent') opponentPower += 15;

    // Roll for clash resolution with dynamic contest
    const playerRoll = Math.random() * 100 + (playerPower - 50) * 0.7;
    const opponentRoll = Math.random() * 100 + (opponentPower - 50) * 0.7;

    const playerWonClash = playerRoll >= opponentRoll;
    const winnerKey = playerWonClash ? 'player' : 'opponent';
    const winningCard = playerWonClash ? playerCard : opponentCard;
    const losingCard = playerWonClash ? opponentCard : playerCard;
    const winnerAthlete = playerWonClash ? nextPlayer : nextOpponent;
    const loserAthlete = playerWonClash ? nextOpponent : nextPlayer;

    let pointsAwardedInfo = undefined;
    let advantagesAwardedInfo = undefined;
    let newPosition: CombatPosition = state.technical.position;
    let newTop = state.technical.topAthleteId;
    let newBottom = state.technical.bottomAthleteId;
    let isSubFinish = false;

    // Process winning card points
    if (winningCard.pointsOnSuccess) {
      nextState.scores[winnerKey].points += winningCard.pointsOnSuccess;
      pointsAwardedInfo = {
        athleteId: winnerAthlete.id,
        athleteName: winnerAthlete.name,
        points: winningCard.pointsOnSuccess,
        reason: winningCard.name
      };
    }
    if (winningCard.advantageOnSuccess) {
      nextState.scores[winnerKey].advantages += 1;
      advantagesAwardedInfo = {
        athleteId: winnerAthlete.id,
        athleteName: winnerAthlete.name
      };
    }

    // Position & Role updates
    if (winningCard.targetPositionOnSuccess) {
      newPosition = winningCard.targetPositionOnSuccess;
      nextState.technical.position = newPosition;

      if (winningCard.newRoleOnSuccess === 'top') {
        newTop = winnerAthlete.id;
        newBottom = loserAthlete.id;
      } else if (winningCard.newRoleOnSuccess === 'bottom') {
        newBottom = winnerAthlete.id;
        newTop = loserAthlete.id;
      }
      nextState.technical.topAthleteId = newTop;
      nextState.technical.bottomAthleteId = newBottom;
    }

    // Submission resolution
    if (winningCard.isSubmission) {
      const lockPower = winningCard.submissionLockPower || 50;
      if (!nextState.technical.activeSubmission) {
        nextState.technical.activeSubmission = {
          techniqueId: winningCard.id,
          techniqueName: winningCard.name,
          attackerId: winnerAthlete.id,
          defenderId: loserAthlete.id,
          lockDepth: lockPower,
          escapeChance: 40,
          turnsActive: 1
        };
        nextState.scores[winnerKey].advantages += 1;
      } else {
        nextState.technical.activeSubmission.lockDepth += lockPower * 0.6;
      }

      if (nextState.technical.activeSubmission.lockDepth >= 100) {
        nextState.status = 'SUBMISSION';
        nextState.winnerId = winnerAthlete.id;
        nextState.winMethod = `Finalização por ${winningCard.name}`;
        isSubFinish = true;
      }
    } else {
      // If winner defended a submission
      if (
        nextState.technical.activeSubmission &&
        nextState.technical.activeSubmission.defenderId === winnerAthlete.id
      ) {
        nextState.technical.activeSubmission = null;
      }
    }

    // Momentum shift
    const momentumShift = playerWonClash ? 25 : -25;
    nextState.momentum = Math.max(-100, Math.min(100, (nextState.momentum || 0) + momentumShift));

    // Reset tactical advantage or set if winner used a setup move
    if (winningCard.category === 'MOVIMENTO') {
      nextState.tacticalAdvantage = winnerKey;
    } else {
      nextState.tacticalAdvantage = null;
    }

    // Advance clock
    nextState.roundTimeSeconds = Math.max(0, nextState.roundTimeSeconds - 20);
    nextState.turnNumber += 1;

    // Check time expiration (00:00) according to IBJJF scoring protocol
    if (nextState.roundTimeSeconds <= 0 && nextState.status === 'IN_PROGRESS') {
      CombatEngine.evaluateTimeExpiredWinner(nextState, nextPlayer, nextOpponent);
    }

    // Stamina turn recovery
    nextPlayer.currentEnergy = Math.min(nextPlayer.maxEnergy, nextPlayer.currentEnergy + nextPlayer.staminaRecoveryRate);
    nextOpponent.currentEnergy = Math.min(nextOpponent.maxEnergy, nextOpponent.currentEnergy + nextOpponent.staminaRecoveryRate);

    // Compute active roles in next position
    const playerRoleNow: 'top' | 'bottom' | 'standing' =
      newPosition === 'STANDING' || newPosition === 'CLINCH'
        ? 'standing'
        : nextState.technical.topAthleteId === player.id
        ? 'top'
        : 'bottom';

    const opponentRoleNow: 'top' | 'bottom' | 'standing' =
      newPosition === 'STANDING' || newPosition === 'CLINCH'
        ? 'standing'
        : nextState.technical.topAthleteId === opponent.id
        ? 'top'
        : 'bottom';

    const newPositionName = getPositionNamePt(newPosition);

    // Clear and unambiguous headline
    let headline = '';
    if (isSubFinish) {
      headline = `BATEU! FINALIZAÇÃO POR ${winningCard.name.toUpperCase()}!`;
    } else if (winningCard.pointsOnSuccess) {
      headline = playerWonClash
        ? `VOCÊ MARCOU +${winningCard.pointsOnSuccess} PTS COM "${winningCard.name.toUpperCase()}"!`
        : `O ADVERSÁRIO MARCOU +${winningCard.pointsOnSuccess} PTS COM "${winningCard.name.toUpperCase()}"!`;
    } else {
      headline = playerWonClash
        ? `VOCÊ PREVALECEU COM "${winningCard.name.toUpperCase()}"!`
        : `O ADVERSÁRIO PREVALECEU COM "${winningCard.name.toUpperCase()}"!`;
    }

    // Clear positional outcome description
    let positionalOutcomeText = '';
    if (newPosition === 'STANDING' || newPosition === 'CLINCH') {
      positionalOutcomeText = `A luta continua em pé (${newPositionName}).`;
    } else if (playerRoleNow === 'top') {
      positionalOutcomeText = `A luta agora está em: ${newPositionName}. VOCÊ ESTÁ POR CIMA (Passador).`;
    } else {
      positionalOutcomeText = `A luta agora está em: ${newPositionName}. VOCÊ ESTÁ POR BAIXO (Guardeiro).`;
    }

    const initiativePrefix = options?.opponentInitiated
      ? `⚡ [INICIATIVA DO ADVERSÁRIO] ${opponent.name} tomou a iniciativa do combate! `
      : '';
    const description = `${initiativePrefix}${winnerAthlete.name} jogou "${winningCard.name}" e superou "${losingCard.name}" de ${loserAthlete.name}. ${matchup.reason} ${positionalOutcomeText}`;

    const resolution: ClashResolution = {
      winner: winnerKey,
      playerCard,
      opponentCard,
      headline,
      description,
      tacticalAdvantageWinner: winningCard.category === 'MOVIMENTO' ? winnerKey : undefined,
      pointsAwarded: pointsAwardedInfo,
      advantagesAwarded: advantagesAwardedInfo,
      newPosition,
      newPositionName,
      playerRoleNow,
      opponentRoleNow,
      newTopAthleteId: newTop,
      newBottomAthleteId: newBottom,
      isSubmissionFinish: isSubFinish
    };

    // Update clash event for visual presentation
    nextState.lastClash = {
      card: winningCard,
      actorId: winnerAthlete.id,
      targetId: loserAthlete.id,
      isSuccess: true,
      headline,
      pointsAwarded: winningCard.pointsOnSuccess,
      positionChangedTo: winningCard.targetPositionOnSuccess,
      isSubmission: winningCard.isSubmission,
      timestamp: Date.now()
    };

    // Add log
    nextState.actionLogs.unshift({
      id: `log_clash_${Date.now()}`,
      turn: nextState.turnNumber - 1,
      actorId: winnerAthlete.id,
      cardName: winningCard.name,
      category: winningCard.category,
      description,
      pointsAwarded: pointsAwardedInfo
        ? {
            athleteId: pointsAwardedInfo.athleteId,
            amount: pointsAwardedInfo.points,
            reason: pointsAwardedInfo.reason
          }
        : undefined,
      isCritical: (winningCard.pointsOnSuccess && winningCard.pointsOnSuccess >= 3) || isSubFinish,
      timeRemaining: nextState.roundTimeSeconds
    });

    return { nextState, nextPlayer, nextOpponent, resolution };
  }
}
