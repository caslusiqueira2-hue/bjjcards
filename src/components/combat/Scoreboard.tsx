import React from 'react';
import { IBJJFScore } from '../../types/combat';
import { Athlete } from '../../types/athlete';
import { BeltBadge } from '../ui/BeltBadge';
import { Timer, Trophy, Shield, Volume2, VolumeX, Zap } from 'lucide-react';
import { sound } from '../../audio/soundEffects';

interface ScoreboardProps {
  player: Athlete;
  opponent: Athlete;
  playerScore: IBJJFScore;
  opponentScore: IBJJFScore;
  roundTimeSeconds: number;
  currentTurn: 'player' | 'opponent';
  turnNumber: number;
  turnInitiativeSeconds?: number;
  maxTurnInitiativeSeconds?: number;
  opponentIntent?: string;
  onToggleSound?: () => void;
  isMuted?: boolean;
  isAiThinking?: boolean;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  player,
  opponent,
  playerScore,
  opponentScore,
  roundTimeSeconds,
  currentTurn,
  turnNumber,
  turnInitiativeSeconds,
  maxTurnInitiativeSeconds,
  opponentIntent,
  onToggleSound,
  isMuted = false,
  isAiThinking = false
}) => {
  // Format MM:SS
  const mins = Math.floor(roundTimeSeconds / 60);
  const secs = roundTimeSeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const isLowTime = roundTimeSeconds <= 30 && roundTimeSeconds > 0;

  return (
    <div className="w-full max-w-4xl mx-auto mb-3 bg-[#0d0f17] border border-amber-600/30 rounded-2xl p-2.5 md:p-3.5 shadow-2xl backdrop-blur-md">
      {/* Top Bar: Tournament header, Round and Sound control */}
      <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2 mb-2.5 px-2">
        <div className="flex items-center gap-2 text-slate-400">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="font-title font-bold uppercase tracking-widest text-slate-200">
            IBJJF CHAMPIONSHIP ARENA
          </span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-[11px] text-slate-400">
            TURNO {turnNumber}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Turn Alert */}
          <div
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-title font-black uppercase tracking-wider flex items-center gap-1.5 ${
              currentTurn === 'player'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 animate-pulse'
                : 'bg-red-600/30 text-red-300 border border-red-500/50 animate-pulse'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                currentTurn === 'player' ? 'bg-blue-400' : 'bg-red-400'
              }`}
            />
            {currentTurn === 'player'
              ? 'Sua Vez de Jogar'
              : isAiThinking
              ? 'Oponente pensando...'
              : 'Vez do Adversário'}
          </div>

          {/* Sound Toggle Button */}
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className="p-1 rounded text-slate-400 hover:text-amber-400 transition-colors"
              title={isMuted ? 'Ativar Efeitos Sonoros' : 'Mutar Som'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Turn Action & Opponent Autonomous Initiative Countdown Bar */}
      {turnInitiativeSeconds !== undefined && maxTurnInitiativeSeconds !== undefined && (
        <div className="mb-3 px-2 py-1.5 rounded-xl bg-black/60 border border-white/10 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1 px-1">
            <span
              className={`flex items-center gap-1.5 font-bold ${
                turnInitiativeSeconds <= 3
                  ? 'text-red-400 animate-pulse font-black'
                  : turnInitiativeSeconds <= 6
                  ? 'text-amber-400'
                  : 'text-slate-300'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${turnInitiativeSeconds <= 3 ? 'text-red-500 fill-red-500' : 'text-amber-400'}`} />
              {turnInitiativeSeconds <= 3
                ? `PERIGO! ${opponent.name.split(' ')[0]} VAI ATACAR EM ${turnInitiativeSeconds}s!`
                : `TEMPO DE AÇÃO: ${turnInitiativeSeconds}s para jogar`}
            </span>

            <span className="text-[10px] text-amber-300/90 font-mono font-bold flex items-center gap-1">
              <span className="text-slate-400">POSTURA RIVAL:</span>
              <span>{opponentIntent || 'Buscando Abertura'}</span>
            </span>
          </div>

          {/* Animated Countdown Progress Bar */}
          <div className="relative w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                turnInitiativeSeconds <= 3
                  ? 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                  : turnInitiativeSeconds <= 6
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400'
              }`}
              style={{
                width: `${Math.max(0, Math.min(100, (turnInitiativeSeconds / maxTurnInitiativeSeconds) * 100))}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Main Scoreboard Content: Player - Timer - Opponent */}
      <div className="grid grid-cols-12 items-center gap-2 md:gap-4">
        {/* PLAYER SIDE (Columns 1-5) */}
        <div className="col-span-5 flex items-center justify-between bg-blue-950/20 border border-blue-500/20 rounded-xl p-2 md:p-3">
          <div className="flex flex-col">
            <span className="font-title text-sm md:text-base font-black text-blue-200 tracking-wide flex items-center gap-1.5">
              {player.name}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {player.academy}
            </span>
            <div className="mt-1">
              <BeltBadge belt={player.belt} stripes={player.stripes} size="sm" showText={false} />
            </div>
          </div>

          {/* Player Score Digital Readout */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Penalties */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-red-400 font-bold">PUN</span>
              <span className="w-6 h-7 md:w-7 md:h-8 rounded bg-red-950/60 border border-red-800 text-red-400 font-mono font-black text-sm md:text-base flex items-center justify-center">
                {playerScore.penalties}
              </span>
            </div>

            {/* Advantages */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-amber-400 font-bold">VAN</span>
              <span className="w-6 h-7 md:w-7 md:h-8 rounded bg-amber-950/60 border border-amber-800 text-amber-300 font-mono font-black text-sm md:text-base flex items-center justify-center">
                {playerScore.advantages}
              </span>
            </div>

            {/* Points (Big Glow) */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-emerald-400 font-black">PTS</span>
              <span className="w-9 h-9 md:w-12 md:h-11 rounded-lg bg-emerald-950/80 border-2 border-emerald-500 text-emerald-300 font-mono font-black text-xl md:text-2xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                {playerScore.points}
              </span>
            </div>
          </div>
        </div>

        {/* CLOCK TIMER (Columns 6-7) */}
        <div className="col-span-2 flex flex-col items-center justify-center">
          <div
            className={`px-2 py-1 md:px-3 md:py-1.5 rounded-xl border bg-black flex items-center justify-center shadow-inner ${
              isLowTime
                ? 'border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                : 'border-white/10 text-amber-400'
            }`}
          >
            <Timer className="w-3.5 h-3.5 mr-1 text-slate-400 hidden sm:inline" />
            <span className="font-mono text-base md:text-xl font-black tracking-widest">
              {formattedTime}
            </span>
          </div>
          <span className="text-[8px] font-mono uppercase text-slate-500 mt-1">
            CRONÔMETRO
          </span>
        </div>

        {/* OPPONENT SIDE (Columns 8-12) */}
        <div className="col-span-5 flex items-center justify-between bg-red-950/20 border border-red-500/20 rounded-xl p-2 md:p-3">
          {/* Opponent Score Digital Readout */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Points (Big Glow) */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-emerald-400 font-black">PTS</span>
              <span className="w-9 h-9 md:w-12 md:h-11 rounded-lg bg-emerald-950/80 border-2 border-emerald-500 text-emerald-300 font-mono font-black text-xl md:text-2xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                {opponentScore.points}
              </span>
            </div>

            {/* Advantages */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-amber-400 font-bold">VAN</span>
              <span className="w-6 h-7 md:w-7 md:h-8 rounded bg-amber-950/60 border border-amber-800 text-amber-300 font-mono font-black text-sm md:text-base flex items-center justify-center">
                {opponentScore.advantages}
              </span>
            </div>

            {/* Penalties */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-red-400 font-bold">PUN</span>
              <span className="w-6 h-7 md:w-7 md:h-8 rounded bg-red-950/60 border border-red-800 text-red-400 font-mono font-black text-sm md:text-base flex items-center justify-center">
                {opponentScore.penalties}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-title text-sm md:text-base font-black text-red-200 tracking-wide flex items-center gap-1.5">
              {opponent.name}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {opponent.academy}
            </span>
            <div className="mt-1">
              <BeltBadge belt={opponent.belt} stripes={opponent.stripes} size="sm" showText={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Official IBJJF Points Reference Quick Legend */}
      <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 px-2 gap-1">
        <span className="text-amber-400 font-bold uppercase tracking-wider">
          TABELA OFICIAL IBJJF:
        </span>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-slate-300">Queda: <strong className="text-emerald-400">+2</strong></span>
          <span className="text-slate-300">Raspagem / Upa: <strong className="text-emerald-400">+2</strong></span>
          <span className="text-slate-300">Joelho na Barriga: <strong className="text-emerald-400">+2</strong></span>
          <span className="text-slate-300">Passagem: <strong className="text-emerald-400">+3</strong></span>
          <span className="text-slate-300">Montada / Costas: <strong className="text-emerald-400">+4</strong></span>
        </div>
      </div>
    </div>
  );
};
