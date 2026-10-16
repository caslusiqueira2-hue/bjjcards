import React from 'react';
import { CombatState } from '../../types/combat';
import { Athlete } from '../../types/athlete';
import { CombatCard } from '../../types/cards';
import { AthleteToken } from './AthleteToken';
import { ClashResolution } from '../../engine/clashEngine';
import { getPositionNamePt } from '../../engine/bjjRules';
import { Zap, Swords, Sparkles, Shield, Trophy, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CombatArenaProps {
  combatState: CombatState;
  player: Athlete;
  opponent: Athlete;
  selectedCard: CombatCard | null;
  activeClash: ClashResolution | null;
  isClashing: boolean;
  onQuickPlaySelected?: () => void;
}

export const CombatArena: React.FC<CombatArenaProps> = ({
  combatState,
  player,
  opponent,
  selectedCard,
  activeClash,
  isClashing,
  onQuickPlaySelected
}) => {
  const { technical, momentum = 0, tacticalAdvantage } = combatState;
  const isStanding = technical.position === 'STANDING' || technical.position === 'CLINCH';
  const isPlayerTop = technical.topAthleteId === player.id;
  const isOpponentTop = technical.topAthleteId === opponent.id;
  const isPlayerBottom = technical.bottomAthleteId === player.id;
  const isOpponentBottom = technical.bottomAthleteId === opponent.id;

  // Convert -100..+100 momentum into 0..100% fill
  const momentumPercent = Math.max(5, Math.min(95, ((momentum + 100) / 200) * 100));

  // Position visual badge
  const positionLabel = getPositionNamePt(technical.position);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* 1. Momentum Bar (Cabo de Guerra Tático) */}
      <div className="w-full mb-2 bg-zinc-950/90 border border-white/10 rounded-2xl p-2.5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1.5 px-1">
          <span className="text-blue-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-blue-400" />
            {player.name.split(' ')[0]} ({Math.max(0, Math.round(momentum))}%)
          </span>

          <span className="text-amber-400 uppercase tracking-widest text-[10px] font-black">
            DOMÍNIO & MOMENTUM DO TATAME
          </span>

          <span className="text-red-400 flex items-center gap-1">
            {opponent.name.split(' ')[0]} ({Math.max(0, Math.round(-momentum))}%)
            <Zap className="w-3.5 h-3.5 fill-red-400" />
          </span>
        </div>

        {/* Tug-of-war Bar */}
        <div className="relative w-full h-3 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/40 z-10" />
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-red-500 transition-all duration-500 shadow-inner"
            style={{ width: `${momentumPercent}%` }}
          />
        </div>

        {/* Advantage Banner */}
        {tacticalAdvantage && (
          <div className="mt-1.5 text-center">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                tacticalAdvantage === 'player'
                  ? 'bg-blue-950/80 text-blue-300 border border-blue-500/50 animate-pulse'
                  : 'bg-red-950/80 text-red-300 border border-red-500/50 animate-pulse'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              {tacticalAdvantage === 'player'
                ? 'FINTA BEM-SUCEDIDA: +15% DE PRECISÃO NO SEU PRÓXIMO EMBATE!'
                : 'ADVERSÁRIO ENCONTROU UMA BRECHA TÁTICA!'}
            </span>
          </div>
        )}
      </div>

      {/* 2. Main Championship Tatame Arena */}
      <div className="relative w-full aspect-[16/9] min-h-[360px] max-h-[440px] rounded-3xl bg-black border-2 border-amber-500/40 shadow-tatame overflow-hidden flex flex-col justify-between p-3 md:p-5">
        {/* Championship Arena Photo Background */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none filter brightness-[0.70] contrast-125 transition-transform duration-700"
          style={{ backgroundImage: `url('/images/arena_tatame_bg.jpg')` }}
        />

        {/* Ambient Darkening & Vignette Overlay for UI clarity and focus */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/80 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.7)_90%)] pointer-events-none" />
        <div className="absolute inset-2 border border-dashed border-amber-500/30 rounded-2xl pointer-events-none" />

        {/* Top: Current Tactical Position Badge & Role Pill */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs md:text-sm font-title font-black uppercase tracking-wider bg-black/80 text-amber-300 border border-amber-500/60 shadow-md">
              POSIÇÃO: {positionLabel}
            </span>
          </div>

          {/* Positional Role Pill */}
          <div className="text-[11px] font-mono px-3 py-1 rounded-lg border bg-black/80 backdrop-blur">
            {isStanding ? (
              <span className="text-slate-300 font-bold">Luta em Pé • Disputa de Pegadas</span>
            ) : isPlayerTop ? (
              <span className="text-amber-300 font-black flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                VOCÊ ESTÁ POR CIMA (PASSADOR)
              </span>
            ) : isPlayerBottom ? (
              <span className="text-blue-300 font-black flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                VOCÊ ESTÁ POR BAIXO (GUARDEIRO)
              </span>
            ) : (
              <span className="text-slate-300">Disputa no Solo</span>
            )}
          </div>
        </div>

        {/* Center: Face-off Athletes and Card Clash Zone */}
        <div className="relative my-auto flex items-center justify-around w-full z-10 px-2 md:px-4">
          {/* Player Fighter Visual */}
          <div className={`flex flex-col items-center transition-all duration-300 ${isClashing ? 'scale-105' : ''}`}>
            <AthleteToken
              athlete={player}
              isPlayer={true}
              facing="right"
              isInSubmissionDanger={technical.activeSubmission?.defenderId === player.id}
              isCurrentTurn={true}
              size="large"
            />
            {/* Player Role Tag */}
            <div className="mt-1.5 flex flex-col items-center">
              <span className="text-xs font-title font-black text-blue-300 uppercase">
                {player.name.split(' ')[0]}
              </span>
              {isStanding ? (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-zinc-800 text-slate-300 border border-slate-600">
                  EM PÉ
                </span>
              ) : isPlayerTop ? (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-amber-950/80 text-amber-300 border border-amber-500 shadow">
                  POR CIMA (PASSADOR)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-blue-950/80 text-blue-300 border border-blue-500 shadow">
                  POR BAIXO (GUARDEIRO)
                </span>
              )}
            </div>
          </div>

          {/* CENTRAL CARD CLASH / RESOLUTION SHOWCASE */}
          <div className="relative flex flex-col items-center justify-center px-1 z-20 max-w-md w-full">
            {activeClash ? (
              <div className="flex flex-col items-center text-center animate-fade-in w-full">
                {/* Points Awarded Flash (IBJJF Official Call) */}
                {activeClash.pointsAwarded && (
                  <div className="mb-2 animate-bounce">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-title text-xs md:text-sm font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-2 border-white shadow-[0_0_25px_rgba(251,191,36,0.8)]">
                      <Trophy className="w-4 h-4 fill-black" />
                      +{activeClash.pointsAwarded.points} PONTOS OFICIAIS ({activeClash.pointsAwarded.reason})!
                    </span>
                  </div>
                )}

                {/* Clash Mini-Cards Duel */}
                <div className="flex items-center gap-2 bg-black/90 border-2 border-amber-500 rounded-2xl p-2.5 shadow-[0_0_35px_rgba(245,158,11,0.6)]">
                  {/* Player Card */}
                  <div
                    className={`p-2 rounded-xl border flex flex-col items-center min-w-[95px] ${
                      activeClash.winner === 'player'
                        ? 'border-emerald-400 bg-emerald-950/70 ring-2 ring-emerald-400'
                        : 'border-slate-700 bg-zinc-900 opacity-60'
                    }`}
                  >
                    <span className="text-[9px] font-mono font-black text-blue-300">VOCÊ</span>
                    <span className="font-title font-bold text-xs text-white truncate max-w-[110px]">
                      {activeClash.playerCard.name}
                    </span>
                    {activeClash.playerCard.pointsOnSuccess && (
                      <span className="text-[9px] font-mono text-emerald-300 font-bold">
                        +{activeClash.playerCard.pointsOnSuccess} pts
                      </span>
                    )}
                  </div>

                  {/* Clash Icon */}
                  <div className="flex flex-col items-center px-1">
                    <Swords className={`w-5 h-5 text-amber-400 ${isClashing ? 'animate-spin' : ''}`} />
                    <span className="text-[9px] font-mono font-black text-amber-300">EMBATE</span>
                  </div>

                  {/* Opponent Card */}
                  <div
                    className={`p-2 rounded-xl border flex flex-col items-center min-w-[95px] ${
                      activeClash.winner === 'opponent'
                        ? 'border-emerald-400 bg-emerald-950/70 ring-2 ring-emerald-400'
                        : 'border-slate-700 bg-zinc-900 opacity-60'
                    }`}
                  >
                    <span className="text-[9px] font-mono font-black text-red-300">OPONENTE</span>
                    <span className="font-title font-bold text-xs text-white truncate max-w-[110px]">
                      {activeClash.opponentCard.name}
                    </span>
                    {activeClash.opponentCard.pointsOnSuccess && (
                      <span className="text-[9px] font-mono text-emerald-300 font-bold">
                        +{activeClash.opponentCard.pointsOnSuccess} pts
                      </span>
                    )}
                  </div>
                </div>

                {/* Outcome Headline Banner */}
                <div className="mt-2 w-full">
                  <span
                    className={`inline-block px-3 py-1 rounded-xl font-title text-xs md:text-sm font-black uppercase tracking-wider shadow-lg border ${
                      activeClash.winner === 'player'
                        ? 'bg-emerald-500 text-black border-emerald-300'
                        : 'bg-red-600 text-white border-red-400'
                    }`}
                  >
                    {activeClash.headline}
                  </span>

                  {/* Clear Positional Transition Note */}
                  <div className="mt-1.5 p-1.5 rounded-lg bg-black/80 border border-white/10 text-[10px] md:text-[11px] font-mono text-slate-200">
                    <p className="leading-snug">
                      {activeClash.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-3.5 bg-black/75 rounded-2xl border border-amber-500/30 backdrop-blur-md shadow-2xl">
                <div className="w-14 h-14 rounded-full bg-gradient-to-b from-amber-500/20 to-black border-2 border-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)] mb-1.5">
                  <Swords className="w-7 h-7 text-amber-400 animate-pulse" />
                </div>
                <span className="text-xs font-title font-black uppercase tracking-wider text-amber-300">
                  DUELO DE CARTAS PRONTO
                </span>
                <span className="text-[10px] font-mono text-slate-300 mt-0.5">
                  Selecione uma carta da sua mão para confrontar o oponente
                </span>
              </div>
            )}
          </div>

          {/* Opponent Fighter Visual */}
          <div className={`flex flex-col items-center transition-all duration-300 ${isClashing ? 'scale-105' : ''}`}>
            <AthleteToken
              athlete={opponent}
              isPlayer={false}
              facing="left"
              isInSubmissionDanger={technical.activeSubmission?.defenderId === opponent.id}
              isCurrentTurn={true}
              size="large"
            />
            {/* Opponent Role Tag */}
            <div className="mt-1.5 flex flex-col items-center">
              <span className="text-xs font-title font-black text-red-300 uppercase">
                {opponent.name.split(' ')[0]}
              </span>
              {isStanding ? (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-zinc-800 text-slate-300 border border-slate-600">
                  EM PÉ
                </span>
              ) : isOpponentTop ? (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-red-950/80 text-red-300 border border-red-500 shadow">
                  POR CIMA (PASSADOR)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-blue-950/80 text-blue-300 border border-blue-500 shadow">
                  POR BAIXO (GUARDEIRO)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Banner: Action Prompt and Big Duel Button */}
        <div className="w-full flex items-center justify-between z-10 pt-2 border-t border-white/10 text-[11px] font-mono">
          <span className="px-3 py-1 rounded-lg bg-black/75 border border-white/10 text-slate-200 backdrop-blur-sm shadow-md">
            {selectedCard
              ? `Carta Selecionada: "${selectedCard.name}"`
              : 'Clique em uma carta válida abaixo para jogar no embate'}
          </span>

          {selectedCard && onQuickPlaySelected && (
            <button
              onClick={onQuickPlaySelected}
              disabled={isClashing}
              className={`px-4 py-2 rounded-xl font-title font-black text-xs md:text-sm uppercase tracking-wider shadow-2xl transition-all flex items-center gap-1.5 ${
                isClashing
                  ? 'bg-zinc-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-amber-400 text-black animate-pulse hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>COMBATER COM ESTA CARTA!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
