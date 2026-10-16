import React, { useState, useEffect } from 'react';
import {
  DailyCombatSimState,
  DailyFighter,
  PositionalDeck,
  TacticalDecision
} from '../../types/dailyMode';
import { DailyCombatEngine } from '../../engine/dailyCombatEngine';
import { PositionIllustration } from '../combat/PositionIllustration';
import { AthletePortrait } from '../career/AthletePortrait';
import { BeltBadge } from '../ui/BeltBadge';
import { sound } from '../../audio/soundEffects';
import {
  Swords,
  Shield,
  Wind,
  Flame,
  Trophy,
  Zap,
  Volume2,
  VolumeX,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { INITIAL_CARDS } from '../../data/initialCards';

const CARD_DICT: Record<string, any> = {};
INITIAL_CARDS.forEach((c) => {
  CARD_DICT[c.id] = c;
});

interface DailyCombatArenaProps {
  player: DailyFighter;
  opponent: DailyFighter;
  tournamentName: string;
  roundName: string;
  deck: PositionalDeck;
  onFinishMatch: (winnerId: string, winMethod: string, finalSimState: DailyCombatSimState) => void;
}

export const DailyCombatArena: React.FC<DailyCombatArenaProps> = ({
  player,
  opponent,
  tournamentName,
  roundName,
  deck,
  onFinishMatch
}) => {
  const [simState, setSimState] = useState<DailyCombatSimState>(() =>
    DailyCombatEngine.initMatch('sim_' + Date.now(), tournamentName, roundName, player, opponent)
  );

  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [isSimulatingStep, setIsSimulatingStep] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<TacticalDecision>('CADENCIAR');

  const toggleSound = () => {
    sound.toggleMute();
    setIsMuted(sound.getIsMuted());
  };

  const handleStep = (decision: TacticalDecision) => {
    if (simState.status === 'FINISHED' || isSimulatingStep) return;

    setSelectedDecision(decision);
    setIsSimulatingStep(true);

    if (decision === 'ATACAR') sound.playGiGrip();
    else if (decision === 'AMARRAR') sound.playMatThud();
    else sound.playWhistle();

    setTimeout(() => {
      setSimState((prev) => {
        const next = DailyCombatEngine.advanceTimeStep(prev, decision, deck);
        return next;
      });
      setIsSimulatingStep(false);
    }, 450);
  };

  // Format mm:ss
  const mins = Math.floor(simState.roundTimeSeconds / 60);
  const secs = simState.roundTimeSeconds % 60;
  const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const isPlayerWinner = simState.winnerId === player.id;
  const isMatchOver = simState.status === 'FINISHED';

  // Find currently active card for position
  let activeCardId = deck.standing;
  if (simState.currentPosition === 'OPEN_GUARD' || simState.currentPosition === 'CLOSED_GUARD') {
    activeCardId = simState.playerRole === 'top' ? deck.guardPass : deck.guardBottom;
  } else if (simState.currentPosition === 'HALF_GUARD') {
    activeCardId = deck.halfGuard;
  } else if (simState.currentPosition === 'SIDE_CONTROL' || simState.currentPosition === 'MOUNT') {
    activeCardId = deck.sideMount;
  } else if (simState.currentPosition === 'BACK_MOUNT') {
    activeCardId = deck.backControl;
  }
  const activeCard = CARD_DICT[activeCardId] || CARD_DICT['queda_double_leg'];

  return (
    <div className="relative min-h-screen bg-[#07080b] text-slate-100 flex flex-col justify-between p-2 sm:p-4 md:p-6 overflow-x-hidden select-none">
      {/* 1. Header Bar: Tournament & Round & Sound */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between z-10 border-b border-white/10 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="font-title text-xs md:text-sm font-black text-slate-200 uppercase tracking-wider">
            {tournamentName}
          </span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-xs text-amber-400 font-bold uppercase">
            {roundName}
          </span>
        </div>

        <button
          onClick={toggleSound}
          className="p-1.5 rounded-lg bg-zinc-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Official IBJJF Electronic Scoreboard */}
      <div className="w-full max-w-4xl mx-auto bg-zinc-950/90 border border-amber-500/40 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-md mb-2">
        <div className="flex items-center justify-between gap-2">
          {/* Player Side */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <AthletePortrait
              avatarId={player.avatarId}
              avatarUrl={player.avatarUrl}
              belt={player.belt}
              stripes={player.stripes}
              size="xs"
            />
            <div className="min-w-0">
              <span className="font-title text-xs sm:text-sm font-black text-blue-300 block truncate">
                {player.name}
              </span>
              <BeltBadge belt={player.belt} stripes={player.stripes} size="sm" showText={false} />
            </div>

            {/* Score Boxes */}
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-mono text-red-400 font-bold">PUN</span>
                <span className="w-6 h-6 rounded bg-red-950/60 border border-red-800 text-red-400 font-mono text-xs font-black flex items-center justify-center">
                  {simState.scores.player.penalties}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-mono text-amber-400 font-bold">VAN</span>
                <span className="w-6 h-6 rounded bg-amber-950/60 border border-amber-800 text-amber-300 font-mono text-xs font-black flex items-center justify-center">
                  {simState.scores.player.advantages}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-mono text-emerald-400 font-black">PTS</span>
                <span className="w-8 h-8 rounded-lg bg-emerald-950/80 border-2 border-emerald-500 text-emerald-300 font-mono text-base font-black flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  {simState.scores.player.points}
                </span>
              </div>
            </div>
          </div>

          {/* Central Timer */}
          <div className="flex flex-col items-center px-2 shrink-0">
            <div className="px-2.5 py-1 rounded-xl bg-black border border-amber-500/60 font-mono text-base sm:text-lg font-black text-amber-400 tracking-widest shadow-inner">
              {timeFormatted}
            </div>
            <span className="text-[8px] font-mono text-slate-500 uppercase mt-0.5">
              CRONÔMETRO
            </span>
          </div>

          {/* Opponent Side */}
          <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
            {/* Score Boxes */}
            <div className="flex items-center gap-1.5 mr-auto">
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-mono text-emerald-400 font-black">PTS</span>
                <span className="w-8 h-8 rounded-lg bg-emerald-950/80 border-2 border-emerald-500 text-emerald-300 font-mono text-base font-black flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  {simState.scores.opponent.points}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-mono text-amber-400 font-bold">VAN</span>
                <span className="w-6 h-6 rounded bg-amber-950/60 border border-amber-800 text-amber-300 font-mono text-xs font-black flex items-center justify-center">
                  {simState.scores.opponent.advantages}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-mono text-red-400 font-bold">PUN</span>
                <span className="w-6 h-6 rounded bg-red-950/60 border border-red-800 text-red-400 font-mono text-xs font-black flex items-center justify-center">
                  {simState.scores.opponent.penalties}
                </span>
              </div>
            </div>

            <div className="text-right min-w-0">
              <span className="font-title text-xs sm:text-sm font-black text-red-300 block truncate">
                {opponent.name}
              </span>
              <BeltBadge belt={opponent.belt} stripes={opponent.stripes} size="sm" showText={false} />
            </div>
            <AthletePortrait
              avatarId={opponent.avatarId}
              avatarUrl={opponent.avatarUrl}
              belt={opponent.belt}
              stripes={opponent.stripes}
              size="xs"
            />
          </div>
        </div>

        {/* Stamina Bars */}
        <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-white/5 text-[10px] font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Estamina:</span>
            <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${simState.playerStamina}%` }}
              />
            </div>
            <span className="text-blue-300 font-bold">{Math.round(simState.playerStamina)}%</span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <span className="text-red-300 font-bold">{Math.round(simState.opponentStamina)}%</span>
            <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-rose-400 transition-all duration-300"
                style={{ width: `${simState.opponentStamina}%` }}
              />
            </div>
            <span className="text-slate-400">Rival:</span>
          </div>
        </div>
      </div>

      {/* 3. Central Tatame with Dynamic Position Illustration */}
      <div className="w-full max-w-4xl mx-auto relative rounded-3xl bg-black border-2 border-amber-500/40 p-3 sm:p-4 shadow-2xl flex flex-col items-center justify-between min-h-[190px] sm:min-h-[240px] mb-2 overflow-hidden">
        {/* Background photo & overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none filter brightness-50 contrast-125"
          style={{ backgroundImage: `url('/images/arena_tatame_bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none" />

        {/* Top: Position Label & Tactical Slot */}
        <div className="w-full flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-xl text-xs font-title font-black uppercase tracking-wider bg-black/80 text-amber-300 border border-amber-500/60 shadow-md">
            POSIÇÃO: {simState.currentPosition.replace('_', ' ')}
          </span>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/80 border border-white/20 text-[10px] font-mono">
            <span className="text-slate-400">Técnica Armada no Deck:</span>
            <strong className="text-amber-300">{activeCard.name}</strong>
          </div>
        </div>

        {/* Center: Live Vector Illustration */}
        <div className="z-10 my-1">
          <PositionIllustration
            position={simState.currentPosition}
            playerRole={simState.playerRole}
            playerBelt={player.belt}
            opponentBelt={opponent.belt}
            playerGiColor={player.giColor}
            opponentGiColor={opponent.giColor}
            size="md"
            className="shadow-[0_0_30px_rgba(245,158,11,0.25)] border border-amber-500/30"
          />
        </div>

        {/* Bottom Status Tip */}
        <div className="z-10 text-[11px] font-mono text-slate-300 bg-black/70 px-3 py-0.5 rounded-full border border-white/10">
          {simState.playerRole === 'standing' && 'Disputa de pegadas e tentativas de queda no tatame'}
          {simState.playerRole === 'top' && 'Você está por cima • Pressione para passar ou finalizar'}
          {simState.playerRole === 'bottom' && 'Você está por baixo • Busque a raspagem ou finalização'}
        </div>
      </div>

      {/* 4. Strategic Tactical Decision Control Bar (7a0 inspired) */}
      {!isMatchOver && (
        <div className="w-full max-w-4xl mx-auto bg-zinc-950/95 border-2 border-amber-500/50 rounded-2xl p-2.5 sm:p-3 shadow-2xl mb-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
              COMANDOS TÁTICOS DO COMBATE (ESTILO 7A0)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Escolha a postura do próximo lance:
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* ATACAR */}
            <button
              onClick={() => handleStep('ATACAR')}
              disabled={isSimulatingStep}
              className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-95 text-white font-title font-black text-xs uppercase tracking-wider shadow-lg flex flex-col items-center justify-center gap-0.5 transition-all border border-red-400/50"
            >
              <div className="flex items-center gap-1">
                <Swords className="w-4 h-4" />
                <span>ATACAR</span>
              </div>
              <span className="text-[9px] font-mono text-red-100 font-normal opacity-90 hidden sm:inline">
                Aplica a técnica armada (+2/+3/+4)
              </span>
            </button>

            {/* AMARRAR A LUTA */}
            <button
              onClick={() => handleStep('AMARRAR')}
              disabled={isSimulatingStep}
              className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 active:scale-95 text-black font-title font-black text-xs uppercase tracking-wider shadow-lg flex flex-col items-center justify-center gap-0.5 transition-all border border-amber-400/50"
            >
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>AMARRAR A LUTA</span>
              </div>
              <span className="text-[9px] font-mono text-black font-normal opacity-90 hidden sm:inline">
                Trava o relógio • Cuidado com punição!
              </span>
            </button>

            {/* CADENCIAR A LUTA */}
            <button
              onClick={() => handleStep('CADENCIAR')}
              disabled={isSimulatingStep}
              className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:scale-95 text-white font-title font-black text-xs uppercase tracking-wider shadow-lg flex flex-col items-center justify-center gap-0.5 transition-all border border-blue-400/50"
            >
              <div className="flex items-center gap-1">
                <Wind className="w-4 h-4" />
                <span>CADENCIAR</span>
              </div>
              <span className="text-[9px] font-mono text-blue-100 font-normal opacity-90 hidden sm:inline">
                Respira & recupera +14 Estamina
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Detailed Play-by-Play Narrative Feed (7a0 live commentary) */}
      <div className="w-full max-w-4xl mx-auto flex-1 bg-zinc-950/80 border border-white/10 rounded-2xl p-3 shadow-inner flex flex-col max-h-[160px] sm:max-h-[190px] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            NARRATIVA DETALHADA DO COMBATE
          </span>
          <span className="text-[10px] font-mono text-amber-400">
            {simState.logs.length} eventos registrados
          </span>
        </div>

        <div className="overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-amber-600/40">
          {simState.logs.map((log) => (
            <div
              key={log.id}
              className="p-2 rounded-xl bg-black/60 border border-white/5 text-xs font-mono flex items-start gap-2.5"
            >
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 font-bold text-[10px] shrink-0">
                {log.minute}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <span>{log.actionTitle}</span>
                  {log.pointsDelta && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/90 text-black text-[9px] font-black">
                      +{log.pointsDelta.points} PTS
                    </span>
                  )}
                  {log.advantageDelta && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500 text-black text-[9px] font-black">
                      +1 VANTAGEM
                    </span>
                  )}
                  {log.penaltyDelta && (
                    <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[9px] font-black">
                      PUNIÇÃO!
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {log.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Post-Match Celebration Modal */}
      {isMatchOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-zinc-950 via-[#121622] to-zinc-950 border-2 border-amber-500 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.5)] flex flex-col items-center text-center space-y-4">
            <div
              className={`p-4 rounded-full border-2 ${
                isPlayerWinner
                  ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)]'
                  : 'bg-red-950/60 border-red-500 text-red-400'
              }`}
            >
              {isPlayerWinner ? (
                <Trophy className="w-12 h-12 animate-bounce" />
              ) : (
                <Shield className="w-12 h-12" />
              )}
            </div>

            <div>
              <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-400">
                {isPlayerWinner ? 'VITÓRIA CONQUISTADA!' : 'DERROTA NO CONFRONTO'}
              </span>
              <h3 className="font-title text-3xl font-black text-white uppercase mt-0.5">
                {isPlayerWinner ? player.name : opponent.name}
              </h3>
              <p className="text-xs font-mono text-slate-300 mt-1">
                {simState.winMethod}
              </p>
            </div>

            <div className="w-full bg-black/70 border border-white/10 rounded-2xl p-3 font-mono text-xs space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Placar Oficial:</span>
                <strong>
                  {simState.scores.player.points} x {simState.scores.opponent.points} pts
                </strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>XP da Luta:</span>
                <strong className="text-emerald-400">
                  +{isPlayerWinner ? (simState.winMethod?.includes('Finalização') ? '200' : '120') : '50'} XP
                </strong>
              </div>
            </div>

            <button
              onClick={() => {
                onFinishMatch(simState.winnerId || opponent.id, simState.winMethod || 'Fim de Luta', simState);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 text-black font-title font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
            >
              <span>{isPlayerWinner ? 'Avançar na Chave' : 'Retornar ao Lobby'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
