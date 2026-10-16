import React, { useState, useEffect } from 'react';
import { Athlete } from '../../types/athlete';
import { CombatCard } from '../../types/cards';
import { CombatState } from '../../types/combat';
import { CombatEngine } from '../../engine/combatEngine';
import { AIEngine } from '../../engine/aiEngine';
import { ClashEngine, ClashResolution } from '../../engine/clashEngine';
import { INITIAL_CARDS } from '../../data/initialCards';
import { CombatArena } from '../combat/CombatArena';
import { Scoreboard } from '../combat/Scoreboard';
import { TechnicalStateHUD } from '../combat/TechnicalStateHUD';
import { CardHand } from '../combat/CardHand';
import { CombatLog } from '../combat/CombatLog';
import { CombatResultModal } from '../ui/CombatResultModal';
import { sound } from '../../audio/soundEffects';
import { Zap } from 'lucide-react';

interface CombatScreenProps {
  player: Athlete;
  opponent: Athlete;
  onFinishMatch: (winnerId: string, winMethod: string, finalState: CombatState) => void;
  onExit: () => void;
}

export const CombatScreen: React.FC<CombatScreenProps> = ({
  player: initialPlayer,
  opponent: initialOpponent,
  onFinishMatch,
  onExit
}) => {
  const [player, setPlayer] = useState<Athlete>(initialPlayer);
  const [opponent, setOpponent] = useState<Athlete>(initialOpponent);
  const [combatState, setCombatState] = useState<CombatState>(() =>
    CombatEngine.createMatch(initialPlayer, initialOpponent, 360)
  );

  const [selectedCard, setSelectedCard] = useState<CombatCard | null>(null);
  const [isClashing, setIsClashing] = useState<boolean>(false);
  const [activeClash, setActiveClash] = useState<ClashResolution | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getIsMuted());

  // Turn initiative timer calculation: Comfortable 18-24 seconds so the player can analyze the tatame and react comfortably!
  const calculateTurnInitiativeMax = (opp: Athlete, state: CombatState): number => {
    let t = 22; // Base comfortable time for tactical thinking and mobile ergonomics
    if (opp.style === 'Wrestler' || opp.style === 'Passador') t = 20;
    else if (opp.style === 'Finalizador') t = 19;
    // Trailing on points => opponent becomes slightly more urgent
    if (state.scores.player.points > state.scores.opponent.points) {
      t = Math.max(16, t - 3);
    }
    return t;
  };

  const [maxTurnInitiative, setMaxTurnInitiative] = useState<number>(() => calculateTurnInitiativeMax(initialOpponent, combatState));
  const [turnInitiativeSeconds, setTurnInitiativeSeconds] = useState<number>(() => calculateTurnInitiativeMax(initialOpponent, combatState));
  const [playerStallCount, setPlayerStallCount] = useState<number>(0);
  const [opponentIntent, setOpponentIntent] = useState<string>(() => AIEngine.getOpponentTacticalIntent(initialOpponent, combatState));

  // Whistle sound on initial match start
  useEffect(() => {
    sound.playWhistle();
  }, []);

  // Update initiative & opponent intent whenever turn changes
  useEffect(() => {
    if (combatState.status !== 'IN_PROGRESS') return;
    const maxT = calculateTurnInitiativeMax(opponent, combatState);
    setMaxTurnInitiative(maxT);
    setTurnInitiativeSeconds(maxT);
    setOpponentIntent(AIEngine.getOpponentTacticalIntent(opponent, combatState));
  }, [combatState.turnNumber, combatState.status]);

  // Real-time match clock countdown, turn initiative ticker, and automatic opponent attack
  useEffect(() => {
    if (combatState.status !== 'IN_PROGRESS') return;

    // Check if match time expired (00:00)
    if (combatState.roundTimeSeconds <= 0) {
      const finishedState = JSON.parse(JSON.stringify(combatState));
      CombatEngine.evaluateTimeExpiredWinner(finishedState, player, opponent);
      setCombatState(finishedState);
      sound.playWhistle();
      return;
    }

    // Do not tick down during clash animations
    if (isClashing) return;

    const interval = setInterval(() => {
      // 1. Tick match clock down by 1 second
      setCombatState((prev) => {
        if (prev.status !== 'IN_PROGRESS') return prev;
        const newSecs = Math.max(0, prev.roundTimeSeconds - 1);
        if (newSecs <= 0) {
          const finishedState = JSON.parse(JSON.stringify(prev));
          finishedState.roundTimeSeconds = 0;
          CombatEngine.evaluateTimeExpiredWinner(finishedState, player, opponent);
          sound.playWhistle();
          return finishedState;
        }
        return {
          ...prev,
          roundTimeSeconds: newSecs
        };
      });

      // 2. Tick turn initiative countdown
      setTurnInitiativeSeconds((prev) => {
        const nextVal = prev - 1;
        if (nextVal <= 0) {
          // Time ran out for player to decide => Opponent acts autonomously!
          handleOpponentAutonomousInitiative();
          return maxTurnInitiative;
        }
        return nextVal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [combatState.status, combatState.roundTimeSeconds, isClashing, player, opponent, selectedCard, playerStallCount]);

  // Opponent takes autonomous aggressive initiative when player hesitates or stalls
  const handleOpponentAutonomousInitiative = () => {
    if (combatState.status !== 'IN_PROGRESS' || isClashing) return;

    setIsClashing(true);
    sound.playGiGrip();

    // 1. AI aggressively selects its best card
    const aiCard =
      AIEngine.selectBestCard(INITIAL_CARDS, opponent, player, combatState) ||
      INITIAL_CARDS.find((c) => c.id === 'rec_respiracao_base') ||
      INITIAL_CARDS[0];

    // 2. Check if player had a valid card selected or was stalling
    let playerCard = selectedCard;
    let wasStalling = false;

    if (!playerCard || !CombatEngine.canPlayCard(playerCard, player, combatState).valid) {
      wasStalling = true;
      // Auto-react with best available instinctive defensive / recovery card
      const validCards = INITIAL_CARDS.filter((c) =>
        CombatEngine.canPlayCard(c, player, combatState).valid
      );
      playerCard =
        validCards.find((c) => c.category === 'DEFESA_FINALIZACAO' || c.category === 'DEFESA_QUEDA' || c.category === 'RETENCAO') ||
        validCards.find((c) => c.id === 'rec_respiracao_base') ||
        validCards[0];
    }

    // 3. IBJJF Official Passivity Rule: Penalize stalling
    let updatedCombatState = JSON.parse(JSON.stringify(combatState));

    if (wasStalling) {
      const newStallCount = playerStallCount + 1;
      setPlayerStallCount(newStallCount);

      if (newStallCount === 1) {
        // 1st time stalling: Verbal warning
        updatedCombatState.actionLogs.unshift({
          id: `log_warn_${Date.now()}`,
          turn: updatedCombatState.turnNumber,
          actorId: 'referee',
          cardName: 'Advertência de Combatividade',
          category: 'CONTROLE',
          description: `Árbitro: "LUTE!" Advertência verbal a ${player.name} por amarrar a luta. Oponente ${opponent.name} tomou a iniciativa e atacou!`,
          isCritical: true,
          timeRemaining: updatedCombatState.roundTimeSeconds
        });
      } else if (newStallCount === 2) {
        // 2nd time stalling: 1st penalty (+1 advantage to opponent)
        updatedCombatState.scores.player.penalties += 1;
        updatedCombatState.scores.opponent.advantages += 1;
        updatedCombatState.actionLogs.unshift({
          id: `log_pen1_${Date.now()}`,
          turn: updatedCombatState.turnNumber,
          actorId: 'referee',
          cardName: '1ª Punição (Falta de Combatividade)',
          category: 'CONTROLE',
          description: `Árbitro: 1ª Punição a ${player.name} por amarrar a luta! +1 Vantagem oficial para ${opponent.name}.`,
          isCritical: true,
          timeRemaining: updatedCombatState.roundTimeSeconds
        });
      } else if (newStallCount === 3) {
        // 3rd time stalling: 2nd penalty (+2 points to opponent)
        updatedCombatState.scores.player.penalties += 1;
        updatedCombatState.scores.opponent.points += 2;
        updatedCombatState.actionLogs.unshift({
          id: `log_pen2_${Date.now()}`,
          turn: updatedCombatState.turnNumber,
          actorId: 'referee',
          cardName: '2ª Punição (Amarrar)',
          category: 'CONTROLE',
          description: `Árbitro: 2ª Punição a ${player.name} por falta de combatividade! +2 Pontos oficiais concedidos a ${opponent.name}.`,
          isCritical: true,
          timeRemaining: updatedCombatState.roundTimeSeconds
        });
      } else if (newStallCount >= 4) {
        // 4th time stalling: Disqualification (DQ)
        updatedCombatState.scores.player.penalties += 1;
        updatedCombatState.status = 'DISQUALIFICATION';
        updatedCombatState.winnerId = opponent.id;
        updatedCombatState.winMethod = 'Desclassificação por Falta de Combatividade (4 Punições)';
        updatedCombatState.actionLogs.unshift({
          id: `log_dq_${Date.now()}`,
          turn: updatedCombatState.turnNumber,
          actorId: 'referee',
          cardName: 'DESCLASSIFICAÇÃO!',
          category: 'CONTROLE',
          description: `Árbitro: DESCLASSIFICAÇÃO! ${player.name} atingiu 4 punições por recusa de combate. Vitória concedida a ${opponent.name}.`,
          isCritical: true,
          timeRemaining: updatedCombatState.roundTimeSeconds
        });
        setCombatState(updatedCombatState);
        sound.playWhistle();
        setIsClashing(false);
        return;
      }
    } else {
      // If player had a card selected, reset stall streak
      setPlayerStallCount(0);
    }

    // 4. Resolve clash with opponent surprise / initiative bonus
    const { nextState, nextPlayer, nextOpponent, resolution } = ClashEngine.resolveClash(
      playerCard,
      aiCard,
      player,
      opponent,
      updatedCombatState,
      { opponentInitiated: true, playerStalled: wasStalling }
    );

    setActiveClash(resolution);

    const winningCard = resolution.winner === 'player' ? playerCard : aiCard;
    if (winningCard.category === 'QUEDA') sound.playMatThud();
    else if (winningCard.isSubmission) sound.playSubmissionHeartbeat();
    if (resolution.pointsAwarded) sound.playPointBell(resolution.pointsAwarded.points);

    setPlayer(nextPlayer);
    setOpponent(nextOpponent);
    setCombatState(nextState);
    setSelectedCard(null);

    setTimeout(() => {
      setIsClashing(false);
    }, 1200);
  };

  // Handle simultaneous Card Clash Execution when player initiates
  const handleExecuteClash = (playerCard: CombatCard) => {
    if (combatState.status !== 'IN_PROGRESS' || isClashing) return;

    const check = CombatEngine.canPlayCard(playerCard, player, combatState);
    if (!check.valid) return;

    setIsClashing(true);
    setPlayerStallCount(0); // Active combat engagement clears stall streak

    // AI selects its card for the round
    const aiCard =
      AIEngine.selectBestCard(INITIAL_CARDS, opponent, player, combatState) ||
      INITIAL_CARDS.find((c) => c.id === 'rec_respiracao_base') ||
      INITIAL_CARDS[0];

    // Sound effect on clash start
    sound.playGiGrip();

    // Resolve the tactical matchup and rolls
    const { nextState, nextPlayer, nextOpponent, resolution } = ClashEngine.resolveClash(
      playerCard,
      aiCard,
      player,
      opponent,
      combatState,
      { opponentInitiated: false }
    );

    setActiveClash(resolution);

    // Play specific result sounds
    const winningCard = resolution.winner === 'player' ? playerCard : aiCard;
    if (winningCard.category === 'QUEDA') sound.playMatThud();
    else if (winningCard.isSubmission) sound.playSubmissionHeartbeat();
    
    if (resolution.pointsAwarded) {
      sound.playPointBell(resolution.pointsAwarded.points);
    }

    setPlayer(nextPlayer);
    setOpponent(nextOpponent);
    setCombatState(nextState);
    setSelectedCard(null);

    // Allow players to absorb the clash animation before next turn
    setTimeout(() => {
      setIsClashing(false);
    }, 1200);
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleRematch = () => {
    setPlayer(initialPlayer);
    setOpponent(initialOpponent);
    setCombatState(CombatEngine.createMatch(initialPlayer, initialOpponent, 360));
    setSelectedCard(null);
    setActiveClash(null);
    setIsClashing(false);
    setPlayerStallCount(0);
    const maxT = calculateTurnInitiativeMax(initialOpponent, CombatEngine.createMatch(initialPlayer, initialOpponent, 360));
    setMaxTurnInitiative(maxT);
    setTurnInitiativeSeconds(maxT);
    sound.playWhistle();
  };

  return (
    <div className="relative min-h-screen bg-[#08090c] text-slate-100 flex flex-col justify-between p-2 md:p-4 overflow-x-hidden">
      {/* Top Header & Scoreboard */}
      <div>
        <Scoreboard
          player={player}
          opponent={opponent}
          playerScore={combatState.scores.player}
          opponentScore={combatState.scores.opponent}
          roundTimeSeconds={combatState.roundTimeSeconds}
          currentTurn="player"
          turnNumber={combatState.turnNumber}
          turnInitiativeSeconds={turnInitiativeSeconds}
          maxTurnInitiativeSeconds={maxTurnInitiative}
          opponentIntent={opponentIntent}
          onToggleSound={handleToggleSound}
          isMuted={isMuted}
          isAiThinking={isClashing}
        />

        <TechnicalStateHUD
          position={combatState.technical.position}
          player={player}
          opponent={opponent}
          topAthleteId={combatState.technical.topAthleteId}
          bottomAthleteId={combatState.technical.bottomAthleteId}
          activeSubmission={combatState.technical.activeSubmission}
        />
      </div>

      {/* Center: Dynamic BJJ Card Duel Arena */}
      <div className="my-auto py-1">
        <CombatArena
          combatState={combatState}
          player={player}
          opponent={opponent}
          selectedCard={selectedCard}
          activeClash={activeClash}
          isClashing={isClashing}
          onQuickPlaySelected={() => {
            if (selectedCard) handleExecuteClash(selectedCard);
          }}
        />
      </div>

      {/* Bottom Area: Action commentary and Hand of Cards */}
      <div className="w-full">
        <CombatLog logs={combatState.actionLogs} />

        <CardHand
          cards={INITIAL_CARDS}
          player={player}
          combatState={combatState}
          selectedCard={selectedCard}
          onSelectCard={(c) => setSelectedCard(c)}
          onPlayCard={handleExecuteClash}
          isPlayerTurn={combatState.status === 'IN_PROGRESS' && !isClashing}
        />
      </div>

      {/* Mobile Floating Quick Action Trigger for instant reaction */}
      {selectedCard && combatState.status === 'IN_PROGRESS' && !isClashing && (
        <div className="fixed bottom-3 inset-x-3 sm:hidden z-50 animate-bounce">
          <button
            onClick={() => handleExecuteClash(selectedCard)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-black font-title font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.7)] flex items-center justify-between border-2 border-white/60 active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-2 truncate">
              <Zap className="w-5 h-5 text-black flex-shrink-0" />
              <span className="truncate">EXECUTAR: {selectedCard.name}</span>
            </div>
            <span className="text-[11px] font-mono font-black px-2.5 py-1 rounded-lg bg-black text-amber-300">
              {selectedCard.pointsOnSuccess ? `+${selectedCard.pointsOnSuccess} PTS` : selectedCard.isSubmission ? 'FINALIZAR' : 'GOLPE'}
            </span>
          </button>
        </div>
      )}

      {/* Match Result Victory/Defeat Modal */}
      {combatState.status !== 'IN_PROGRESS' && (
        <CombatResultModal
          combatState={combatState}
          player={player}
          opponent={opponent}
          onReturnToCareer={() => {
            onFinishMatch(
              combatState.winnerId || player.id,
              combatState.winMethod || 'Fim de Luta',
              combatState
            );
          }}
          onRematch={handleRematch}
        />
      )}
    </div>
  );
};
