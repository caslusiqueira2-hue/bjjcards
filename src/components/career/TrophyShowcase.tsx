import React, { useState } from 'react';
import { Athlete } from '../../types/athlete';
import { TOURNAMENTS_DATA } from '../../data/tournaments';
import { Tournament } from '../../types/career';
import { Trophy, Award, Medal, Crown, Star, Lock, CheckCircle2, Flame, MapPin } from 'lucide-react';

interface TrophyShowcaseProps {
  athlete: Athlete;
}

export const TrophyShowcase: React.FC<TrophyShowcaseProps> = ({ athlete }) => {
  const [filter, setFilter] = useState<'ALL' | 'CBJJA' | 'CBJJP' | 'WON'>('ALL');

  const wonTitles = athlete.careerRecord?.titles || [];

  // Map championships with their trophy tiers
  const allTrophies = TOURNAMENTS_DATA.map((t) => {
    const isWon = wonTitles.some((title) =>
      title.toLowerCase().includes(t.name.toLowerCase()) ||
      t.name.toLowerCase().includes(title.toLowerCase())
    );

    let trophyTier: 'gold' | 'silver' | 'diamond' = 'gold';
    if (t.prestige === 'mundial' || t.prestige === 'europeu') trophyTier = 'diamond';
    else if (t.prestige === 'nacional') trophyTier = 'gold';
    else trophyTier = 'silver';

    return {
      ...t,
      isWon,
      trophyTier
    };
  });

  const filteredTrophies = allTrophies.filter((t) => {
    if (filter === 'WON') return t.isWon;
    if (filter === 'CBJJA') return t.federation === 'CBJJA';
    if (filter === 'CBJJP') return t.federation === 'CBJJP';
    return true;
  });

  const totalWon = allTrophies.filter((t) => t.isWon).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* 1. Trophy Room Hero Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#191408] to-zinc-950 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] flex-shrink-0">
            <Trophy className="w-8 h-8 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-400">
                SALA DE TROFÉUS & CONQUISTAS
              </span>
            </div>
            <h2 className="font-title text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wide">
              Mural de Troféus do Tatame
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Acervo oficial de medalhas e taças conquistadas nos circuitos CBJJA e CBJJP.
            </p>
          </div>
        </div>

        {/* Counter Stats Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-zinc-900 border border-amber-500/40 text-center shadow-lg">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Taças de Ouro</span>
            <span className="font-title text-2xl font-black text-amber-400">{totalWon}</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-zinc-900 border border-slate-700 text-center shadow-lg">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Disputadas</span>
            <span className="font-title text-2xl font-black text-slate-200">{athlete.opensDisputed || wonTitles.length}</span>
          </div>
        </div>
      </div>

      {/* 2. Filter Navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              filter === 'ALL'
                ? 'bg-amber-500 text-black shadow font-black'
                : 'bg-zinc-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos os Torneios ({allTrophies.length})
          </button>

          <button
            onClick={() => setFilter('WON')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              filter === 'WON'
                ? 'bg-amber-500 text-black shadow font-black'
                : 'bg-zinc-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Conquistados ({totalWon})
          </button>

          <button
            onClick={() => setFilter('CBJJA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              filter === 'CBJJA'
                ? 'bg-blue-600 text-white shadow font-black'
                : 'bg-zinc-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            CBJJA Amador
          </button>

          <button
            onClick={() => setFilter('CBJJP')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              filter === 'CBJJP'
                ? 'bg-amber-600 text-white shadow font-black'
                : 'bg-zinc-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            CBJJP Profissional
          </button>
        </div>
      </div>

      {/* 3. Trophies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredTrophies.map((trophy) => (
          <div
            key={trophy.id}
            className={`relative rounded-3xl border p-5 flex flex-col justify-between transition-all duration-300 ${
              trophy.isWon
                ? 'bg-gradient-to-b from-zinc-900/90 via-amber-950/20 to-black border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:scale-[1.02]'
                : trophy.isUnlocked
                ? 'bg-zinc-950/80 border-slate-800 opacity-80 hover:opacity-100 hover:border-slate-700'
                : 'bg-zinc-950/40 border-slate-900 opacity-40'
            }`}
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    trophy.federation === 'CBJJA'
                      ? 'bg-blue-950/80 text-blue-300 border border-blue-600/50'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-600/50'
                  }`}
                >
                  {trophy.federation}
                </span>

                {trophy.isWon ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono font-black text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    CAMPEÃO
                  </span>
                ) : trophy.isUnlocked ? (
                  <span className="text-[10px] font-mono text-slate-400">
                    Disponível no circuito
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    <Lock className="w-3 h-3" /> Bloqueado
                  </span>
                )}
              </div>

              {/* Central Trophy Icon Display */}
              <div className="py-4 flex flex-col items-center justify-center text-center">
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-transform ${
                    trophy.isWon
                      ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 shadow-[0_0_35px_rgba(245,158,11,0.5)] rotate-3'
                      : 'bg-zinc-900 border border-slate-800 text-slate-600'
                  }`}
                >
                  {trophy.trophyTier === 'diamond' ? (
                    <Crown className={`w-10 h-10 ${trophy.isWon ? 'text-black' : 'text-slate-600'}`} />
                  ) : (
                    <Trophy className={`w-10 h-10 ${trophy.isWon ? 'text-black' : 'text-slate-600'}`} />
                  )}
                </div>

                <h4 className="font-title text-base sm:text-lg font-black text-slate-100 uppercase tracking-wide mt-3 line-clamp-1">
                  {trophy.name}
                </h4>

                <p className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-amber-500" />
                  {trophy.location}
                </p>
              </div>
            </div>

            {/* Bottom Trophy Details */}
            <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Graduação Exigida:</span>
                <strong className="text-slate-200 capitalize">Faixa {trophy.requiredBelt}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Recompensa:</span>
                <strong className="text-amber-400 font-bold">+{trophy.reputationReward} Reputação</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
