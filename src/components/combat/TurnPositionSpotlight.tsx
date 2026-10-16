import React, { useEffect, useState } from 'react';
import { CombatState } from '../../types/combat';
import { Athlete } from '../../types/athlete';
import { ClashResolution } from '../../engine/clashEngine';
import { getPositionNamePt } from '../../engine/bjjRules';
import { PositionIllustration } from './PositionIllustration';
import { AthletePortrait } from '../career/AthletePortrait';
import { BeltBadge } from '../ui/BeltBadge';
import { Trophy, Swords, Zap, ArrowRight, ShieldCheck, Flame, ChevronRight } from 'lucide-react';
import { sound } from '../../audio/soundEffects';

interface TurnPositionSpotlightProps {
  clash: ClashResolution;
  combatState: CombatState;
  player: Athlete;
  opponent: Athlete;
  turnNumber: number;
  onContinue: () => void;
}

export const TurnPositionSpotlight: React.FC<TurnPositionSpotlightProps> = ({
  clash,
  combatState,
  player,
  opponent,
  turnNumber,
  onContinue
}) => {
  const [countdown, setCountdown] = useState<number>(2);

  const position = clash.newPosition || combatState.technical.position;
  const positionName = clash.newPositionName || getPositionNamePt(position);
  const isStanding = position === 'STANDING' || position === 'CLINCH';

  const topAthleteId = clash.newTopAthleteId ?? combatState.technical.topAthleteId;
  const bottomAthleteId = clash.newBottomAthleteId ?? combatState.technical.bottomAthleteId;

  const isPlayerTop = topAthleteId === player.id;
  const isOpponentTop = topAthleteId === opponent.id;

  const topAthlete = isPlayerTop ? player : isOpponentTop ? opponent : null;
  const bottomAthlete = isPlayerTop ? opponent : isOpponentTop ? player : null;

  // Auto-advance timer (3 seconds)
  useEffect(() => {
    // Play impact chime
    sound.playGiGrip();
    if (clash.pointsAwarded) {
      sound.playPointBell(clash.pointsAwarded.points);
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [clash, onContinue]);

  // Keyboard shortcut (Space / Enter to continue)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-zinc-950 via-[#0a0d14] to-zinc-950 border-2 border-amber-500/80 rounded-3xl p-3 md:p-7 shadow-[0_0_50px_rgba(245,158,11,0.4)] flex flex-col items-center text-center space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Glow ambient background aura */}
        <div className="absolute -top-20 inset-x-0 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header: Turn End & Clash Resolution */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-amber-500 text-black">
              FIM DO TURNO {turnNumber}
            </span>
            <span className="text-xs font-mono font-bold text-slate-300">
              TRANSIÇÃO DE COMBATE
            </span>
          </div>

          {clash.pointsAwarded && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-title font-black text-xs uppercase shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-bounce">
              <Trophy className="w-3.5 h-3.5 fill-black" />
              <span>+{clash.pointsAwarded.points} PTS ({clash.pointsAwarded.reason})!</span>
            </div>
          )}
        </div>

        {/* 2. Clash Outcome Headline */}
        <div className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl p-3 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-3 py-1 rounded-xl font-title text-xs md:text-sm font-black uppercase tracking-wider border shadow-md ${
                clash.winner === 'player'
                  ? 'bg-emerald-500 text-black border-emerald-300'
                  : clash.winner === 'opponent'
                  ? 'bg-red-600 text-white border-red-400'
                  : 'bg-zinc-700 text-slate-200 border-slate-500'
              }`}
            >
              {clash.headline}
            </span>
          </div>
          <p className="text-xs md:text-sm font-mono text-slate-200 leading-relaxed max-w-lg">
            {clash.description}
          </p>
        </div>

        {/* 3. EMPHATIC POSITION SHOWCASE WITH ILLUSTRATION */}
        <div className="w-full bg-black/90 border-2 border-amber-500/60 rounded-3xl p-4 md:p-5 shadow-2xl flex flex-col items-center space-y-3">
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              NOVA SITUAÇÃO NO TATAME
            </span>
            <h2 className="font-title text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 uppercase tracking-wide mt-0.5">
              {positionName}
            </h2>
          </div>

          {/* Authentic Vector Illustration of the Position */}
          <div className="w-full flex justify-center py-1">
            <PositionIllustration
              position={position}
              playerRole={clash.playerRoleNow}
              playerBelt={player.belt}
              opponentBelt={opponent.belt}
              playerGiColor={player.visual?.giColor === 'royal-blue' ? '#2563eb' : player.visual?.giColor === 'black' ? '#18181b' : '#f8fafc'}
              opponentGiColor={opponent.visual?.giColor === 'royal-blue' ? '#2563eb' : opponent.visual?.giColor === 'black' ? '#18181b' : '#3b82f6'}
              size="md"
              className="border-2 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.25)]"
            />
          </div>

          {/* Spatial Breakdown: Quem está por Cima vs Quem está por Baixo */}
          <div className="w-full hidden sm:grid sm:grid-cols-2 gap-3 pt-1">
            {isStanding ? (
              <div className="col-span-full p-3 rounded-2xl bg-zinc-900/80 border border-slate-700 flex items-center justify-center gap-3">
                <span className="font-title text-sm font-black text-slate-200 uppercase">
                  AMBOS OS ATLETAS EM PÉ • DISPUTA DE PEGADAS & QUEDAS
                </span>
              </div>
            ) : (
              <>
                {/* Top Grappler (Dominant / Passer) */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 to-black border border-amber-500/50 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2.5">
                    {topAthlete && (
                      <AthletePortrait
                        avatarId={topAthlete.visual.avatarId}
                        avatarUrl={topAthlete.visual?.avatarUrl}
                        belt={topAthlete.belt}
                        stripes={topAthlete.stripes}
                        size="xs"
                      />
                    )}
                    <div className="text-left">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-black block">
                        POR CIMA (PASSADOR / TOPO)
                      </span>
                      <span className="font-title text-xs md:text-sm font-black text-slate-100 uppercase">
                        {topAthlete?.name}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Pressão
                  </span>
                </div>

                {/* Bottom Grappler (Guard Player / Defender) */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/40 to-black border border-blue-500/50 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2.5">
                    {bottomAthlete && (
                      <AthletePortrait
                        avatarId={bottomAthlete.visual.avatarId}
                        avatarUrl={bottomAthlete.visual?.avatarUrl}
                        belt={bottomAthlete.belt}
                        stripes={bottomAthlete.stripes}
                        size="xs"
                      />
                    )}
                    <div className="text-left">
                      <span className="text-[10px] font-mono text-blue-400 uppercase font-black block">
                        POR BAIXO (GUARDEIRO / FUNDO)
                      </span>
                      <span className="font-title text-xs md:text-sm font-black text-slate-100 uppercase">
                        {bottomAthlete?.name}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    Defesa / Raspagem
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 4. Action Button to Continue Immediately */}
        <div className="w-full pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-slate-400">
            Avançando automaticamente em <strong className="text-amber-400 font-bold">{countdown}s</strong>...
          </span>

          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-amber-400 text-black font-title font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.6)] flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <span>CONTINUAR COMBATE</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
