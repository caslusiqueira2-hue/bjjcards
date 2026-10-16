import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CombatState } from '../../types/combat';
import { Athlete } from '../../types/athlete';
import { Trophy, Award, Skull, RefreshCw, ArrowRight } from 'lucide-react';
import { sound } from '../../audio/soundEffects';

interface CombatResultModalProps {
  combatState: CombatState;
  player: Athlete;
  opponent: Athlete;
  onReturnToCareer: () => void;
  onRematch?: () => void;
}

export const CombatResultModal: React.FC<CombatResultModalProps> = ({
  combatState,
  player,
  opponent,
  onReturnToCareer,
  onRematch
}) => {
  const isPlayerWinner = combatState.winnerId === player.id;
  const isSubmission = combatState.status === 'SUBMISSION';

  useEffect(() => {
    if (isPlayerWinner) {
      sound.playVictoryChime();
      // Fire confetti burst!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      sound.playWhistle();
    }
  }, [isPlayerWinner]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-lg rounded-2xl border-2 p-6 md:p-8 shadow-2xl flex flex-col items-center text-center bg-gradient-to-b ${
          isPlayerWinner
            ? 'from-zinc-950 via-[#131c12] to-black border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.3)]'
            : 'from-zinc-950 via-[#1c1212] to-black border-red-700 shadow-[0_0_50px_rgba(239,68,68,0.3)]'
        }`}
      >
        {/* Championship Trophy or Skull Icon Header */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center border-2 mb-4 shadow-xl ${
            isPlayerWinner
              ? 'bg-amber-500/20 border-amber-400 text-amber-400 ring-4 ring-amber-500/30 animate-bounce'
              : 'bg-red-500/20 border-red-500 text-red-500 ring-4 ring-red-500/30'
          }`}
        >
          {isPlayerWinner ? (
            <Trophy className="w-10 h-10" />
          ) : isSubmission ? (
            <Skull className="w-10 h-10" />
          ) : (
            <Award className="w-10 h-10" />
          )}
        </div>

        {/* Title */}
        <h2 className="font-title text-2xl md:text-3xl font-black uppercase tracking-wider text-slate-100">
          {isPlayerWinner ? 'GRANDE VITÓRIA NO TATAME!' : 'FIM DE COMBATE: DERROTA'}
        </h2>

        {/* Subtitle / Method */}
        <p className="mt-1 font-mono text-xs md:text-sm text-amber-400 font-bold">
          {combatState.winMethod || (isSubmission ? 'Finalização' : 'Decisão dos Árbitros')}
        </p>

        {/* IBJJF Score Summary Cards */}
        <div className="w-full my-5 bg-black/60 border border-white/10 rounded-xl p-3 flex items-center justify-around">
          {/* Player stats */}
          <div className="flex flex-col items-center">
            <span className="font-title font-bold text-sm text-blue-300">
              {player.name}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-mono font-black text-emerald-400">
                {combatState.scores.player.points} pts
              </span>
              <span className="text-xs font-mono text-amber-400">
                ({combatState.scores.player.advantages} van)
              </span>
            </div>
          </div>

          <div className="font-mono text-lg font-black text-slate-600">VS</div>

          {/* Opponent stats */}
          <div className="flex flex-col items-center">
            <span className="font-title font-bold text-sm text-red-300">
              {opponent.name}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-mono font-black text-emerald-400">
                {combatState.scores.opponent.points} pts
              </span>
              <span className="text-xs font-mono text-amber-400">
                ({combatState.scores.opponent.advantages} van)
              </span>
            </div>
          </div>
        </div>

        {/* Match Career Rewards */}
        <div className="w-full mb-6 grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-zinc-900 border border-slate-800 rounded-lg p-2.5">
            <span className="text-slate-400 block">Reputação:</span>
            <span className="text-amber-400 font-bold text-sm">
              {isPlayerWinner ? '+50 Pontos' : '+10 Pontos (Experiência)'}
            </span>
          </div>
          <div className="bg-zinc-900 border border-slate-800 rounded-lg p-2.5">
            <span className="text-slate-400 block">Pontos de Habilidade:</span>
            <span className="text-emerald-400 font-bold text-sm">
              {isPlayerWinner ? '+3 SP' : '+1 SP'}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex items-center gap-3">
          {onRematch && (
            <button
              onClick={onRematch}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 bg-zinc-900 hover:bg-zinc-800 text-slate-200 font-title font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Revanche
            </button>
          )}

          <button
            onClick={onReturnToCareer}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-title font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            <span>Continuar Carreira</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
