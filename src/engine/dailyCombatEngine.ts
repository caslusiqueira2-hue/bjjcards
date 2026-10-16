import { CombatPosition } from '../types/combat';
import {
  DailyCombatSimState,
  DailyFighter,
  PositionalDeck,
  TacticalDecision,
  CombatNarrativeLog
} from '../types/dailyMode';
import { INITIAL_CARDS } from '../data/initialCards';
import { CombatCard } from '../types/cards';

const CARD_DICT: Record<string, CombatCard> = {};
INITIAL_CARDS.forEach((c) => {
  CARD_DICT[c.id] = c;
});

export class DailyCombatEngine {
  /**
   * Initializes a new match simulation between player and opponent
   */
  public static initMatch(
    matchId: string,
    tournamentName: string,
    roundName: string,
    player: DailyFighter,
    opponent: DailyFighter
  ): DailyCombatSimState {
    const initialLog: CombatNarrativeLog = {
      id: `log_${Date.now()}_start`,
      minute: '6:00',
      secondsRemaining: 360,
      actor: 'referee',
      actorName: 'Árbitro Central',
      actionTitle: 'COMBATE! Início da Luta',
      description: `O árbitro central reúne ${player.name} e ${opponent.name} no centro do tatame. Cumprimento respeitoso e voz de comando: "COMBATE!"`,
      position: 'STANDING'
    };

    return {
      matchId,
      tournamentName,
      roundName,
      playerFighter: player,
      opponentFighter: opponent,
      roundTimeSeconds: 360, // 6 minutes
      currentPosition: 'STANDING',
      playerRole: 'standing',
      scores: {
        player: { points: 0, advantages: 0, penalties: 0 },
        opponent: { points: 0, advantages: 0, penalties: 0 }
      },
      playerStamina: 100,
      opponentStamina: 100,
      playerConsecutiveStalls: 0,
      opponentConsecutiveStalls: 0,
      currentDecision: 'CADENCIAR',
      logs: [initialLog],
      status: 'IN_PROGRESS'
    };
  }

  /**
   * Resolves one simulated time step (~30-40 seconds of intense exchange)
   * factoring in player tactical decision and equipped card
   */
  public static advanceTimeStep(
    state: DailyCombatSimState,
    decision: TacticalDecision,
    deck: PositionalDeck
  ): DailyCombatSimState {
    if (state.status === 'FINISHED') return state;

    const nextSeconds = Math.max(0, state.roundTimeSeconds - 40);
    const mins = Math.floor(nextSeconds / 60);
    const secs = nextSeconds % 60;
    const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    // Clone state
    const nextState: DailyCombatSimState = {
      ...state,
      roundTimeSeconds: nextSeconds,
      currentDecision: decision,
      scores: {
        player: { ...state.scores.player },
        opponent: { ...state.scores.opponent }
      },
      logs: [...state.logs]
    };

    const player = nextState.playerFighter;
    const opponent = nextState.opponentFighter;

    // Apply stamina adjustments according to decision
    if (decision === 'ATACAR') {
      nextState.playerStamina = Math.max(10, nextState.playerStamina - 12);
      nextState.playerConsecutiveStalls = 0;
    } else if (decision === 'AMARRAR') {
      nextState.playerStamina = Math.max(10, nextState.playerStamina - 4);
      nextState.playerConsecutiveStalls += 1;
    } else {
      // CADENCIAR
      nextState.playerStamina = Math.min(100, nextState.playerStamina + 14);
      nextState.playerConsecutiveStalls = 0;
    }

    // Opponent stamina drain
    nextState.opponentStamina = Math.max(10, nextState.opponentStamina - 8);

    // 1. Check for Referee stalling penalties if player is excessively stalling
    if (nextState.playerConsecutiveStalls >= 3) {
      if (nextState.playerConsecutiveStalls === 3) {
        nextState.scores.player.penalties += 1;
        nextState.scores.opponent.advantages += 1;
        nextState.logs.unshift({
          id: `log_${Date.now()}_pen1`,
          minute: timeFormatted,
          secondsRemaining: nextSeconds,
          actor: 'referee',
          actorName: 'Árbitro',
          actionTitle: '⚠️ Punição por Falta de Combatividade!',
          description: `Árbitro interrompe: "Lute!" 1ª Punição aplicada a ${player.name} por amarrar a luta! Vantagem concedida a ${opponent.name}.`,
          position: nextState.currentPosition,
          penaltyDelta: { athlete: 'player', reason: 'Amarrar luta' },
          advantageDelta: { athlete: 'opponent', reason: 'Punição rival' },
          decisionImpact: 'AMARRAR'
        });
      } else if (nextState.playerConsecutiveStalls === 4) {
        nextState.scores.player.penalties += 1;
        nextState.scores.opponent.points += 2;
        nextState.logs.unshift({
          id: `log_${Date.now()}_pen2`,
          minute: timeFormatted,
          secondsRemaining: nextSeconds,
          actor: 'referee',
          actorName: 'Árbitro',
          actionTitle: '🚨 2ª Punição por Amarrar! +2 Pontos para o Rival!',
          description: `Árbitro: Falta de combatividade grave! 2ª Punição para ${player.name} e +2 PONTOS oficiais concedidos a ${opponent.name}!`,
          position: nextState.currentPosition,
          penaltyDelta: { athlete: 'player', reason: 'Falta de combatividade' },
          pointsDelta: { athlete: 'opponent', points: 2, reason: 'Punição adversário' },
          decisionImpact: 'AMARRAR'
        });
      } else if (nextState.playerConsecutiveStalls >= 5) {
        // DQ
        nextState.status = 'FINISHED';
        nextState.winnerId = opponent.id;
        nextState.winMethod = 'Desclassificação (Falta de Combatividade - 4 Punições)';
        nextState.logs.unshift({
          id: `log_${Date.now()}_dq`,
          minute: timeFormatted,
          secondsRemaining: nextSeconds,
          actor: 'referee',
          actorName: 'Árbitro',
          actionTitle: '⛔ DESCLASSIFICAÇÃO POR AMARRAR!',
          description: `O árbitro encerra a luta! ${player.name} atingiu o limite de punições por recusa de combate. Vitória concedida a ${opponent.name}.`,
          position: nextState.currentPosition,
          decisionImpact: 'AMARRAR'
        });
        return nextState;
      }
    }

    // 2. Determine action based on current position and equipped card in deck
    const currentPos = nextState.currentPosition;
    const isPlayerTop = nextState.playerRole === 'top';
    const isPlayerBottom = nextState.playerRole === 'bottom';
    const isStanding = currentPos === 'STANDING' || currentPos === 'CLINCH';

    // Identify card assigned for this situation
    let equippedCardId = deck.standing;
    if (isStanding) {
      equippedCardId = deck.standing;
    } else if (isPlayerTop && (currentPos === 'OPEN_GUARD' || currentPos === 'CLOSED_GUARD')) {
      equippedCardId = deck.guardPass;
    } else if (isPlayerBottom && (currentPos === 'OPEN_GUARD' || currentPos === 'CLOSED_GUARD')) {
      equippedCardId = deck.guardBottom;
    } else if (currentPos === 'HALF_GUARD') {
      equippedCardId = deck.halfGuard;
    } else if (isPlayerTop && (currentPos === 'SIDE_CONTROL' || currentPos === 'MOUNT')) {
      equippedCardId = deck.sideMount;
    } else if (isPlayerTop && currentPos === 'BACK_MOUNT') {
      equippedCardId = deck.backControl;
    } else if (isPlayerBottom) {
      equippedCardId = deck.defenseEscape;
    }

    const card = CARD_DICT[equippedCardId] || CARD_DICT['queda_double_leg'];

    // 3. Calculate Action Success Chance
    let successChance = 0.50; // base 50%
    const playerRating = (player.attributes.quedas + player.attributes.passagemGuarda + player.attributes.controlePosicional) / 3;
    const opponentRating = (opponent.attributes.quedas + opponent.attributes.passagemGuarda + opponent.attributes.controlePosicional) / 3;
    const ratingDiff = (playerRating - opponentRating) / 100;

    successChance += ratingDiff;

    // Tactical Decision impact
    if (decision === 'ATACAR') {
      successChance += 0.22; // aggressive bonus
    } else if (decision === 'AMARRAR') {
      successChance -= 0.15; // less offensive, focused on neutralizing
    } else {
      // CADENCIAR
      successChance += 0.05;
    }

    // Stamina impact
    if (nextState.playerStamina < 30) successChance -= 0.15;
    if (nextState.opponentStamina < 30) successChance += 0.12;

    const roll = Math.random();
    const isSuccess = roll < successChance;

    // 4. Generate Positional Exchange & Narrative
    if (decision === 'AMARRAR') {
      // Amarrando com sucesso: neutraliza o rival
      if (Math.random() < 0.7) {
        nextState.logs.unshift({
          id: `log_${Date.now()}_stall_ok`,
          minute: timeFormatted,
          secondsRemaining: nextSeconds,
          actor: 'player',
          actorName: player.name,
          actionTitle: '🛡️ Controle & Travamento de Posição',
          description: `${player.name} adota postura fechada e cadenciada. Trava as lapelas, coloca o peso no quadril e anula os avanços de ${opponent.name}, gastando tempo do cronômetro.`,
          position: currentPos,
          decisionImpact: 'AMARRAR'
        });
      } else {
        // Adversário reage à amarração
        nextState.scores.opponent.advantages += 1;
        nextState.logs.unshift({
          id: `log_${Date.now()}_opp_brecha`,
          minute: timeFormatted,
          secondsRemaining: nextSeconds,
          actor: 'opponent',
          actorName: opponent.name,
          actionTitle: '⚡ Adversário Explode Contra a Amarração!',
          description: `${opponent.name} não aceita a postura travada, ganha a esgrima com explosão e quase inverte a posição! Árbitro assinala Vantagem para ${opponent.name}.`,
          position: currentPos,
          advantageDelta: { athlete: 'opponent', reason: 'Ataque contra amarração' },
          decisionImpact: 'AMARRAR'
        });
      }
    } else if (decision === 'CADENCIAR') {
      // Cadenciando a luta
      nextState.logs.unshift({
        id: `log_${Date.now()}_cadencia`,
        minute: timeFormatted,
        secondsRemaining: nextSeconds,
        actor: 'player',
        actorName: player.name,
        actionTitle: '🧘 Cadenciando o Ritmo & Respirando',
        description: `${player.name} cadencia a disputa, ajusta as pegadas na gola e recupera o fôlego (+14 Estamina). O combate segue equilibrado na posição de ${currentPos.replace('_', ' ')}.`,
        position: currentPos,
        decisionImpact: 'CADENCIAR'
      });
    } else {
      // ATACAR: Executa a técnica armada no deck para esta posição!
      if (isStanding) {
        if (card.category === 'QUEDA') {
          if (isSuccess) {
            nextState.scores.player.points += 2;
            nextState.currentPosition = 'OPEN_GUARD';
            nextState.playerRole = 'top';
            nextState.logs.unshift({
              id: `log_${Date.now()}_queda_ok`,
              minute: timeFormatted,
              secondsRemaining: nextSeconds,
              actor: 'player',
              actorName: player.name,
              actionTitle: `💥 QUEDA EXECUTADA! (${card.name})`,
              description: `Comando ATACAR acionado! ${player.name} dispara o ${card.name} configurado no deck. Encurta a distância, grampea as pernas com firmeza e leva ${opponent.name} ao solo! +2 PONTOS OFICIAIS!`,
              position: 'OPEN_GUARD',
              pointsDelta: { athlete: 'player', points: 2, reason: card.name },
              decisionImpact: 'ATACAR'
            });
          } else {
            nextState.logs.unshift({
              id: `log_${Date.now()}_queda_def`,
              minute: timeFormatted,
              secondsRemaining: nextSeconds,
              actor: 'opponent',
              actorName: opponent.name,
              actionTitle: `🛡️ Sprawl & Defesa de Queda`,
              description: `${player.name} atacou com ${card.name}, mas ${opponent.name} estava atento e mandou um sprawl pesado no peito, defendendo a queda!`,
              position: 'STANDING',
              decisionImpact: 'ATACAR'
            });
          }
        } else if (card.category === 'PUXADA') {
          nextState.currentPosition = 'OPEN_GUARD';
          nextState.playerRole = 'bottom';
          nextState.logs.unshift({
            id: `log_${Date.now()}_puxada`,
            minute: timeFormatted,
            secondsRemaining: nextSeconds,
            actor: 'player',
            actorName: player.name,
            actionTitle: `🎯 Puxada para Guarda (${card.name})`,
            description: `${player.name} fecha as pegadas na gola e manga e senta puxando para a Guarda Aberta com técnica refinada!`,
            position: 'OPEN_GUARD',
            decisionImpact: 'ATACAR'
          });
        }
      } else if (isPlayerTop && (currentPos === 'OPEN_GUARD' || currentPos === 'CLOSED_GUARD')) {
        // Passagem de Guarda
        if (isSuccess) {
          nextState.scores.player.points += 3;
          nextState.currentPosition = 'SIDE_CONTROL';
          nextState.logs.unshift({
            id: `log_${Date.now()}_pass_ok`,
            minute: timeFormatted,
            secondsRemaining: nextSeconds,
            actor: 'player',
            actorName: player.name,
            actionTitle: `🔥 PASSAGEM DE GUARDA! +3 PONTOS (${card.name})`,
            description: `${player.name} impõe o ${card.name} do seu plano tático! Quebra o gancho de ${opponent.name}, avança o quadril com pressão esmagadora e estabiliza no 100kg! O árbitro confirma 3 PONTOS!`,
            position: 'SIDE_CONTROL',
            pointsDelta: { athlete: 'player', points: 3, reason: 'Passagem de Guarda' },
            decisionImpact: 'ATACAR'
          });
        } else {
          nextState.scores.player.advantages += 1;
          nextState.logs.unshift({
            id: `log_${Date.now()}_pass_adv`,
            minute: timeFormatted,
            secondsRemaining: nextSeconds,
            actor: 'player',
            actorName: player.name,
            actionTitle: `⚡ Quase Passou! Vantagem Concedida`,
            description: `${player.name} fez a blitz de ${card.name}, quase passou, mas ${opponent.name} conseguiu repor no último segundo. Vantagem anotada!`,
            position: currentPos,
            advantageDelta: { athlete: 'player', reason: 'Tentativa forte de passagem' },
            decisionImpact: 'ATACAR'
          });
        }
      } else if (isPlayerBottom && (currentPos === 'OPEN_GUARD' || currentPos === 'CLOSED_GUARD' || currentPos === 'HALF_GUARD')) {
        // Raspagem ou Finalização da Guarda
        if (card.isSubmission) {
          if (isSuccess && Math.random() < 0.6) {
            // Submission victory!
            nextState.status = 'FINISHED';
            nextState.winnerId = player.id;
            nextState.winMethod = `Finalização por ${card.name}`;
            nextState.logs.unshift({
              id: `log_${Date.now()}_sub_win`,
              minute: timeFormatted,
              secondsRemaining: nextSeconds,
              actor: 'player',
              actorName: player.name,
              actionTitle: `👑 FINALIZAÇÃO HISTÓRICA! (${card.name})`,
              description: `SENSACIONAL! ${player.name} encaixa milimetricamente o ${card.name}! Ajusta a pegada, estica o quadril... ${opponent.name} BATE TRÊS VEZES NO TATAME! VITÓRIA POR FINALIZAÇÃO!`,
              position: currentPos,
              isSubmissionAttempt: true,
              isSubmissionSuccess: true,
              decisionImpact: 'ATACAR'
            });
            return nextState;
          } else {
            nextState.scores.player.advantages += 1;
            nextState.logs.unshift({
              id: `log_${Date.now()}_sub_danger`,
              minute: timeFormatted,
              secondsRemaining: nextSeconds,
              actor: 'player',
              actorName: player.name,
              actionTitle: `⚠️ Bote de Finalização! (${card.name})`,
              description: `${player.name} disparou o bote perigoso de ${card.name}! ${opponent.name} precisou explodir na defesa para escapar. Vantagem para ${player.name}!`,
              position: currentPos,
              isSubmissionAttempt: true,
              advantageDelta: { athlete: 'player', reason: 'Ataque de finalização' },
              decisionImpact: 'ATACAR'
            });
          }
        } else {
          // Raspagem (+2 pts)
          if (isSuccess) {
            nextState.scores.player.points += 2;
            nextState.currentPosition = 'SIDE_CONTROL';
            nextState.playerRole = 'top';
            nextState.logs.unshift({
              id: `log_${Date.now()}_sweep_ok`,
              minute: timeFormatted,
              secondsRemaining: nextSeconds,
              actor: 'player',
              actorName: player.name,
              actionTitle: `🔄 RASPAGEM PERFEITA! +2 PONTOS (${card.name})`,
              description: `${player.name} utiliza o ${card.name} configurado no deck, desequilibra ${opponent.name} com o quadril, raspa com autoridade e cai por cima! +2 PONTOS!`,
              position: 'SIDE_CONTROL',
              pointsDelta: { athlete: 'player', points: 2, reason: 'Raspagem' },
              decisionImpact: 'ATACAR'
            });
          } else {
            nextState.logs.unshift({
              id: `log_${Date.now()}_sweep_def`,
              minute: timeFormatted,
              secondsRemaining: nextSeconds,
              actor: 'opponent',
              actorName: opponent.name,
              actionTitle: `🛡️ Base Sólida na Guarda`,
              description: `${player.name} tentou a raspagem, mas ${opponent.name} abriu a base e manteve o equilíbrio sem cair.`,
              position: currentPos,
              decisionImpact: 'ATACAR'
            });
          }
        }
      } else if (isPlayerTop && (currentPos === 'SIDE_CONTROL' || currentPos === 'MOUNT' || currentPos === 'BACK_MOUNT')) {
        // Ataque de Finalização do Topo ou Montada (+4 pts)
        if (currentPos === 'SIDE_CONTROL' && card.id === 'trans_montada') {
          if (isSuccess) {
            nextState.scores.player.points += 4;
            nextState.currentPosition = 'MOUNT';
            nextState.logs.unshift({
              id: `log_${Date.now()}_mont_ok`,
              minute: timeFormatted,
              secondsRemaining: nextSeconds,
              actor: 'player',
              actorName: player.name,
              actionTitle: `👑 MONTADA ESTABILIZADA! +4 PONTOS!`,
              description: `${player.name} isola o braço do rival, passa o joelho sobre a barriga e crava a MONTADA COMPLETA! O ginásio vai ao delírio! +4 PONTOS OFICIAIS!`,
              position: 'MOUNT',
              pointsDelta: { athlete: 'player', points: 4, reason: 'Montada' },
              decisionImpact: 'ATACAR'
            });
          }
        } else if (card.isSubmission) {
          if (isSuccess) {
            // Submission victory!
            nextState.status = 'FINISHED';
            nextState.winnerId = player.id;
            nextState.winMethod = `Finalização por ${card.name}`;
            nextState.logs.unshift({
              id: `log_${Date.now()}_sub_top_win`,
              minute: timeFormatted,
              secondsRemaining: nextSeconds,
              actor: 'player',
              actorName: player.name,
              actionTitle: `🏆 VITÓRIA POR FINALIZAÇÃO! (${card.name})`,
              description: `${player.name} encaixa a pegada indefensável do ${card.name}! Pressão cirúrgica sem saída... ${opponent.name} BATE! FIM DE LUTA POR FINALIZAÇÃO!`,
              position: currentPos,
              isSubmissionAttempt: true,
              isSubmissionSuccess: true,
              decisionImpact: 'ATACAR'
            });
            return nextState;
          } else {
            nextState.scores.player.advantages += 1;
            nextState.logs.unshift({
              id: `log_${Date.now()}_sub_top_adv`,
              minute: timeFormatted,
              secondsRemaining: nextSeconds,
              actor: 'player',
              actorName: player.name,
              actionTitle: `⚡ Quase Finalizou! (${card.name})`,
              description: `${player.name} atacou com o ${card.name}, mas ${opponent.name} usou toda a flexibilidade para escapar por um fio! Vantagem para ${player.name}.`,
              position: currentPos,
              advantageDelta: { athlete: 'player', reason: 'Ataque perigoso' },
              decisionImpact: 'ATACAR'
            });
          }
        }
      }
    }

    // 5. Time's Up Verification
    if (nextSeconds <= 0 && nextState.status === 'IN_PROGRESS') {
      nextState.status = 'FINISHED';

      // Decide winner based on IBJJF official priority: Points -> Advantages -> Least Penalties -> Referee Decision
      const ptsA = nextState.scores.player.points;
      const ptsB = nextState.scores.opponent.points;
      const advA = nextState.scores.player.advantages;
      const advB = nextState.scores.opponent.advantages;
      const penA = nextState.scores.player.penalties;
      const penB = nextState.scores.opponent.penalties;

      let winner: 'player' | 'opponent' = 'player';
      let reason = '';

      if (ptsA !== ptsB) {
        winner = ptsA > ptsB ? 'player' : 'opponent';
        reason = `Pontos oficiais (${ptsA > ptsB ? ptsA : ptsB} a ${ptsA > ptsB ? ptsB : ptsA})`;
      } else if (advA !== advB) {
        winner = advA > advB ? 'player' : 'opponent';
        reason = `Vantagens oficiais (${advA > advB ? advA : advB} a ${advA > advB ? advB : advA})`;
      } else if (penA !== penB) {
        winner = penA < penB ? 'player' : 'opponent';
        reason = `Menor número de punições`;
      } else {
        // Decision
        winner = player.attributes.controlePosicional >= opponent.attributes.controlePosicional ? 'player' : 'opponent';
        reason = `Decisão do Árbitro por Maior Combatividade`;
      }

      nextState.winnerId = winner === 'player' ? player.id : opponent.id;
      const winnerName = winner === 'player' ? player.name : opponent.name;
      nextState.winMethod = reason;

      nextState.logs.unshift({
        id: `log_${Date.now()}_timeup`,
        minute: '0:00',
        secondsRemaining: 0,
        actor: 'referee',
        actorName: 'Árbitro Central',
        actionTitle: '⏱️ PAROU! FIM DO TEMPO REGULAMENTAR',
        description: `O cronômetro zera! O árbitro central reúne ambos os atletas no centro do tatame e ergue o braço de ${winnerName}! Vencedor por ${reason}!`,
        position: nextState.currentPosition
      });
    }

    return nextState;
  }
}
