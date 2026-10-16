import React from 'react';
import { Tournament, TournamentMatch } from '../../types/career';
import { Athlete } from '../../types/athlete';
import { BeltBadge } from '../ui/BeltBadge';
import { AthletePortrait, getDeterministicAvatar } from './AthletePortrait';
import { Trophy, Swords, MapPin, CheckCircle2, Lock, ShieldAlert } from 'lucide-react';

interface TournamentBracketProps {
  tournament: Tournament;
  athlete: Athlete;
  onStartMatch: (match: TournamentMatch) => void;
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({
  tournament,
  athlete,
  onStartMatch
}) => {
  // Find current active match
  const currentMatchIndex = tournament.matches.findIndex((m) => !m.completed);
  const isChampion = tournament.playerRank === 'champion';

  if (!tournament.isUnlocked) {
    return (
      <div className="w-full max-w-5xl mx-auto p-8 rounded-3xl bg-zinc-950/90 border-2 border-red-500/40 text-center shadow-2xl space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-500/60 flex items-center justify-center mx-auto text-red-400">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-700">
            TORNEIO BLOQUEADO • FEDERAÇÃO {tournament.federation}
          </span>
          <h2 className="font-title text-2xl font-black text-slate-100 uppercase tracking-wide mt-2">
            {tournament.name}
          </h2>
          <p className="text-sm font-mono text-amber-400 max-w-lg mx-auto mt-2">
            <strong>Critério de Desbloqueio:</strong> {tournament.unlockCriteriaDescription}
          </p>
        </div>
        <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
          Cumpra os requisitos de títulos e graduação exigidos pela {tournament.federation} para liberar sua vaga nesta chave de campeonato.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Tournament Header */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#181610] to-zinc-950 border border-amber-500/50 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-title font-bold text-xs uppercase tracking-widest">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>CIRCUITO OFICIAL DA {tournament.federation}</span>
          </div>

          <h2 className="font-title text-2xl md:text-3xl font-black text-slate-100 tracking-wide mt-1">
            {tournament.name}
          </h2>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              {tournament.location}
            </span>
            <span>•</span>
            <span>Graduação: <strong className="text-slate-200 capitalize">Faixa {tournament.requiredBelt}</strong></span>
            <span>•</span>
            <span className="text-amber-400 font-bold">+{tournament.reputationReward} Reputação</span>
          </div>
        </div>

        {isChampion && (
          <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-title font-black text-sm uppercase tracking-wider animate-bounce flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>CAMPEÃO DO TORNEIO!</span>
          </div>
        )}
      </div>

      {/* Bracket Tree: Quartas -> Semi -> Final */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tournament.matches.map((match, idx) => {
          const isCurrent = idx === currentMatchIndex;
          const isLocked = idx > currentMatchIndex;

          return (
            <div
              key={match.id}
              className={`relative rounded-2xl border p-4 shadow-xl flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'bg-zinc-950 border-amber-500 ring-2 ring-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : match.completed
                  ? 'bg-zinc-950/70 border-slate-800 opacity-90'
                  : 'bg-zinc-950/40 border-slate-800/60 opacity-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="font-title text-sm font-black text-amber-400 uppercase tracking-wider">
                    {match.roundName}
                  </span>
                  {match.completed && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {match.won ? 'Vitória' : 'Derrota'}
                    </span>
                  )}
                </div>

                {/* Fighters in this match */}
                <div className="space-y-2.5">
                  {/* Player */}
                  <div className="p-2 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <AthletePortrait
                        avatarId={athlete.visual.avatarId}
                        avatarUrl={athlete.visual.avatarUrl}
                        belt={athlete.belt}
                        stripes={athlete.stripes}
                        size="xs"
                      />
                      <span className="font-title font-bold text-blue-200">
                        {athlete.name}
                      </span>
                    </div>
                    <BeltBadge belt={athlete.belt} stripes={athlete.stripes} size="sm" showText={false} />
                  </div>

                  <div className="text-center font-mono text-[10px] text-slate-500 font-bold">
                    VS
                  </div>

                  {/* Opponent with Randomized Real Photo Avatar */}
                  {(() => {
                    const oppAvatar = getDeterministicAvatar(match.opponentName || match.id);
                    return (
                      <div className="p-2 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <AthletePortrait
                            avatarId={oppAvatar.avatarId}
                            avatarUrl={oppAvatar.avatarUrl}
                            belt={match.opponentBelt}
                            stripes={0}
                            size="xs"
                          />
                          <div>
                            <span className="font-title font-bold text-red-200 block">
                              {match.opponentName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {match.opponentAcademy}
                            </span>
                          </div>
                        </div>
                        <BeltBadge belt={match.opponentBelt} size="sm" showText={false} />
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Action button */}
              <div className="mt-4 pt-3 border-t border-white/5">
                {isCurrent && (
                  <button
                    onClick={() => onStartMatch(match)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-title font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] animate-pulse"
                  >
                    <Swords className="w-4 h-4" />
                    <span>Entrar no Tatame</span>
                  </button>
                )}

                {isLocked && (
                  <div className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-mono text-slate-500">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Aguardando rodada anterior</span>
                  </div>
                )}

                {match.completed && (
                  <div className="text-center text-xs font-mono text-slate-400">
                    {match.scoreSummary || (match.won ? 'Classificado' : 'Eliminado')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
