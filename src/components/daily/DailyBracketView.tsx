import React from 'react';
import { DailyTournament, DailyTournamentMatch } from '../../types/dailyMode';
import { BeltBadge } from '../ui/BeltBadge';
import { AthletePortrait } from '../career/AthletePortrait';
import { Trophy, Swords, CheckCircle2, Award, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { sound } from '../../audio/soundEffects';

interface DailyBracketViewProps {
  tournament: DailyTournament;
  onStartMatch: (match: DailyTournamentMatch) => void;
  onResetTournament: () => void;
}

export const DailyBracketView: React.FC<DailyBracketViewProps> = ({
  tournament,
  onStartMatch,
  onResetTournament
}) => {
  // Find player's active match
  const playerMatch = tournament.matches.find(
    (m) => m.isPlayerMatch && !m.completed
  );

  const isChampion = tournament.playerRank === 'champion';
  const isEliminated = tournament.playerRank === 'eliminated';

  const qfMatches = tournament.matches.filter((m) => m.roundLevel === 1);
  const sfMatches = tournament.matches.filter((m) => m.roundLevel === 2);
  const finalMatch = tournament.matches.find((m) => m.roundLevel === 3);

  const renderMatchCard = (match: DailyTournamentMatch) => {
    const isReadyForPlayer = match.id === playerMatch?.id;

    return (
      <div
        key={match.id}
        className={`relative rounded-2xl border p-3 transition-all ${
          isReadyForPlayer
            ? 'bg-gradient-to-b from-amber-950/40 via-zinc-950 to-zinc-950 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] ring-2 ring-amber-400/80 animate-pulse'
            : match.completed
            ? 'bg-zinc-950/70 border-white/10 opacity-80'
            : 'bg-zinc-950/40 border-white/5 opacity-60'
        }`}
      >
        <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/10 pb-1.5 mb-2">
          <span className="font-bold text-slate-400 uppercase">{match.roundName}</span>
          {match.completed && (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Concluída
            </span>
          )}
          {isReadyForPlayer && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black font-black uppercase text-[9px]">
              Sua Luta!
            </span>
          )}
        </div>

        {/* Fighter A */}
        <div
          className={`flex items-center justify-between p-1.5 rounded-xl mb-1 ${
            match.winnerId === match.fighterA.id
              ? 'bg-emerald-950/40 border border-emerald-500/50'
              : ''
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <AthletePortrait
              avatarId={match.fighterA.avatarId}
              avatarUrl={match.fighterA.avatarUrl}
              belt={match.fighterA.belt}
              stripes={match.fighterA.stripes}
              size="xs"
            />
            <div className="min-w-0">
              <span className="font-title text-xs font-bold text-white block truncate">
                {match.fighterA.name}
              </span>
              <span className="text-[9px] font-mono text-slate-400 truncate block">
                {match.fighterA.academy}
              </span>
            </div>
          </div>
          <span className="font-mono text-xs font-black text-amber-300 ml-2">
            {match.completed ? match.scoreA.points : '-'}
          </span>
        </div>

        {/* Fighter B */}
        <div
          className={`flex items-center justify-between p-1.5 rounded-xl ${
            match.winnerId === match.fighterB.id
              ? 'bg-emerald-950/40 border border-emerald-500/50'
              : ''
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <AthletePortrait
              avatarId={match.fighterB.avatarId}
              avatarUrl={match.fighterB.avatarUrl}
              belt={match.fighterB.belt}
              stripes={match.fighterB.stripes}
              size="xs"
            />
            <div className="min-w-0">
              <span className="font-title text-xs font-bold text-white block truncate">
                {match.fighterB.name}
              </span>
              <span className="text-[9px] font-mono text-slate-400 truncate block">
                {match.fighterB.academy}
              </span>
            </div>
          </div>
          <span className="font-mono text-xs font-black text-amber-300 ml-2">
            {match.completed ? match.scoreB.points : '-'}
          </span>
        </div>

        {/* Win Method Note if completed */}
        {match.completed && match.winMethod && (
          <div className="mt-2 text-[9px] font-mono text-slate-400 truncate text-center bg-black/60 py-0.5 rounded">
            {match.winMethod}
          </div>
        )}

        {/* Action Button for Player */}
        {isReadyForPlayer && (
          <button
            onClick={() => {
              sound.playWhistle();
              onStartMatch(match);
            }}
            className="mt-2.5 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-amber-400 text-black font-title font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center justify-center gap-2 transition-transform transform active:scale-95"
          >
            <Swords className="w-4 h-4 text-black" />
            <span>Ir para a Luta</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Tournament Header */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#181512] to-zinc-950 border border-amber-500/40 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{tournament.federation}</span>
          </div>
          <h2 className="font-title text-2xl md:text-3xl font-black text-slate-100 tracking-wide mt-1">
            {tournament.name}
          </h2>
          <p className="text-xs md:text-sm font-mono text-slate-400 max-w-xl mt-1 leading-relaxed">
            {tournament.description}
          </p>
        </div>

        {/* Status Badge */}
        {isChampion ? (
          <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 font-title font-black text-xs uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>CAMPEÃO DO TORNEIO!</span>
          </div>
        ) : isEliminated ? (
          <div className="px-4 py-2 rounded-2xl bg-red-950/60 border border-red-500 text-red-300 font-title font-bold text-xs uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>ELIMINADO</span>
          </div>
        ) : (
          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/10 text-slate-300 font-mono text-xs flex items-center gap-2">
            <span>Chave de 8 Atletas</span>
          </div>
        )}
      </div>

      {/* Champion / Eliminated Banner */}
      {isChampion && (
        <div className="w-full p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-yellow-950/40 to-amber-950/60 border-2 border-amber-400 text-center space-y-3 shadow-[0_0_40px_rgba(245,158,11,0.5)]">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
          <h3 className="font-title text-3xl font-black text-amber-300 uppercase">
            PARABÉNS! VOCÊ É O CAMPEÃO DIÁRIO!
          </h3>
          <p className="text-sm font-mono text-slate-200 max-w-md mx-auto">
            Você superou todos os adversários na chave, impôs suas técnicas e faturou o {tournament.trophyName} e +{tournament.xpRewardChampion} XP!
          </p>
          <button
            onClick={onResetTournament}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-black font-title font-black text-sm uppercase tracking-wider shadow-lg"
          >
            Disputar Novo Campeonato Diário
          </button>
        </div>
      )}

      {isEliminated && (
        <div className="w-full p-6 rounded-3xl bg-red-950/30 border border-red-500/60 text-center space-y-3">
          <ShieldAlert className="w-10 h-10 text-red-400 mx-auto" />
          <h3 className="font-title text-2xl font-black text-red-300 uppercase">
            FIM DA LINHA NESTE CAMPEONATO
          </h3>
          <p className="text-xs font-mono text-slate-300 max-w-md mx-auto">
            Você foi superado na chave, mas conquistou valiosa experiência de combate. Treine no gym diário, aperfeiçoe suas cartas e tente novamente!
          </p>
          <button
            onClick={onResetTournament}
            className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-title font-bold text-xs uppercase tracking-wider"
          >
            Reiniciar Campeonato Diário
          </button>
        </div>
      )}

      {/* Tournament Bracket Columns (Quartas, Semi, Final) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Column 1: Quartas de Final */}
        <div className="space-y-3">
          <div className="text-center py-1.5 px-3 rounded-xl bg-zinc-900 border border-white/10 font-title font-black text-xs text-amber-400 uppercase tracking-widest">
            QUARTAS DE FINAL (8 LUTADORES)
          </div>
          {qfMatches.map(renderMatchCard)}
        </div>

        {/* Column 2: Semifinais */}
        <div className="space-y-3 md:mt-8">
          <div className="text-center py-1.5 px-3 rounded-xl bg-zinc-900 border border-white/10 font-title font-black text-xs text-amber-400 uppercase tracking-widest">
            SEMIFINAIS (4 LUTADORES)
          </div>
          {sfMatches.map(renderMatchCard)}
        </div>

        {/* Column 3: Grande Final */}
        <div className="space-y-3 md:mt-16">
          <div className="text-center py-1.5 px-3 rounded-xl bg-zinc-900 border border-white/10 font-title font-black text-xs text-amber-400 uppercase tracking-widest">
            GRANDE FINAL • DISPUTA DO TÍTULO
          </div>
          {finalMatch && renderMatchCard(finalMatch)}
        </div>
      </div>
    </div>
  );
};
