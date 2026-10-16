import React from 'react';
import { Athlete, Belt } from '../../types/athlete';
import { AthletePortrait } from './AthletePortrait';
import { Shield, Sparkles, Award, Flame, Zap, Trophy } from 'lucide-react';

interface AthleteBJJCardProps {
  athlete: Athlete;
  className?: string;
  onEditClick?: () => void;
}

export const AthleteBJJCard: React.FC<AthleteBJJCardProps> = ({
  athlete,
  className = '',
  onEditClick
}) => {
  const { attributes: attrs, belt, stripes = 0 } = athlete;

  // Calculate Overall Rating (OVR)
  const ovr = Math.round(
    ((attrs.quedas || 50) +
      (attrs.passagemGuarda || 50) +
      (attrs.raspagens || 50) +
      (attrs.finalizacoes || 50) +
      (attrs.controlePosicional || 50) +
      (attrs.resistencia || 50)) /
      6
  );

  // Belt-specific thematic card styling & textures
  const getBeltTheme = (b: Belt) => {
    switch (b) {
      case 'white':
        return {
          cardBorder: 'border-slate-200 ring-4 ring-white/60 shadow-[0_0_35px_rgba(255,255,255,0.3)]',
          beltWrapBg: 'bg-gradient-to-b from-slate-100 via-slate-200 to-slate-100',
          beltStitchColor: 'border-zinc-800',
          cardInnerBg: 'bg-gradient-to-b from-[#11141c] via-[#090b10] to-[#040608]',
          badgeText: 'FAIXA BRANCA',
          federation: 'CBJJA AMADOR',
          rankColor: 'text-slate-100',
          ovrBg: 'from-slate-200 to-slate-400 text-black',
          barColor: 'bg-black',
          stripeColor: 'bg-white',
          accentText: 'text-slate-200',
          borderPattern: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 12px, #e2e8f0 12px, #e2e8f0 24px)'
        };
      case 'blue':
        return {
          cardBorder: 'border-blue-500 ring-4 ring-blue-400/60 shadow-[0_0_35px_rgba(37,99,235,0.4)]',
          beltWrapBg: 'bg-gradient-to-b from-blue-600 via-blue-500 to-blue-700',
          beltStitchColor: 'border-blue-900',
          cardInnerBg: 'bg-gradient-to-b from-[#0a1226] via-[#070b18] to-[#03060d]',
          badgeText: 'FAIXA AZUL',
          federation: 'CBJJP PRO',
          rankColor: 'text-blue-300',
          ovrBg: 'from-blue-400 to-blue-600 text-white',
          barColor: 'bg-black',
          stripeColor: 'bg-white',
          accentText: 'text-blue-300',
          borderPattern: 'repeating-linear-gradient(45deg, #2563eb, #2563eb 12px, #1d4ed8 12px, #1d4ed8 24px)'
        };
      case 'purple':
        return {
          cardBorder: 'border-purple-500 ring-4 ring-purple-400/60 shadow-[0_0_35px_rgba(147,51,234,0.4)]',
          beltWrapBg: 'bg-gradient-to-b from-purple-700 via-purple-600 to-purple-800',
          beltStitchColor: 'border-purple-950',
          cardInnerBg: 'bg-gradient-to-b from-[#150a26] via-[#0d0718] to-[#06030d]',
          badgeText: 'FAIXA ROXA',
          federation: 'CBJJP PRO',
          rankColor: 'text-purple-300',
          ovrBg: 'from-purple-400 to-purple-600 text-white',
          barColor: 'bg-black',
          stripeColor: 'bg-white',
          accentText: 'text-purple-300',
          borderPattern: 'repeating-linear-gradient(45deg, #9333ea, #9333ea 12px, #7e22ce 12px, #7e22ce 24px)'
        };
      case 'brown':
        return {
          cardBorder: 'border-amber-800 ring-4 ring-amber-700/60 shadow-[0_0_35px_rgba(180,83,9,0.4)]',
          beltWrapBg: 'bg-gradient-to-b from-amber-900 via-amber-800 to-amber-950',
          beltStitchColor: 'border-stone-950',
          cardInnerBg: 'bg-gradient-to-b from-[#1a0e06] via-[#100904] to-[#080402]',
          badgeText: 'FAIXA MARROM',
          federation: 'ELITE BJJ',
          rankColor: 'text-amber-300',
          ovrBg: 'from-amber-600 to-amber-800 text-white',
          barColor: 'bg-black',
          stripeColor: 'bg-white',
          accentText: 'text-amber-300',
          borderPattern: 'repeating-linear-gradient(45deg, #78350f, #78350f 12px, #92400e 12px, #92400e 24px)'
        };
      case 'black':
      default:
        return {
          cardBorder: 'border-amber-400 ring-4 ring-amber-300/80 shadow-[0_0_45px_rgba(245,158,11,0.55)]',
          beltWrapBg: 'bg-gradient-to-b from-zinc-900 via-black to-zinc-950',
          beltStitchColor: 'border-amber-500/60',
          cardInnerBg: 'bg-gradient-to-b from-[#181308] via-[#0e0c05] to-[#040402]',
          badgeText: 'FAIXA PRETA',
          federation: 'MESTRE IBJJF',
          rankColor: 'text-amber-400',
          ovrBg: 'from-amber-400 via-yellow-300 to-amber-500 text-black',
          barColor: 'bg-red-700', // Tarja vermelha oficial de Faixa Preta
          stripeColor: 'bg-white',
          accentText: 'text-amber-400',
          borderPattern: 'repeating-linear-gradient(45deg, #18181b, #18181b 12px, #09090b 12px, #09090b 24px)'
        };
    }
  };

  const theme = getBeltTheme(belt);

  return (
    <div
      className={`relative rounded-3xl p-2.5 sm:p-3 transition-transform hover:scale-[1.01] duration-300 select-none ${theme.cardBorder} ${className}`}
      style={{ background: theme.borderPattern }}
    >
      {/* Stitching Line Inner Inset */}
      <div className={`relative rounded-2xl p-4 sm:p-5 ${theme.cardInnerBg} border-2 border-white/10 flex flex-col justify-between overflow-hidden shadow-inner`}>
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 inset-x-0 h-48 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />

        {/* 1. Header Card Row: OVR Rating, Belt Rank Badge & Federation */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
          {/* Left: OVR Rating Badge */}
          <div className="flex items-center gap-2">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.ovrBg} flex flex-col items-center justify-center shadow-lg font-black`}>
              <span className="text-[10px] font-mono leading-none tracking-tighter uppercase opacity-80">OVR</span>
              <span className="text-xl font-title leading-tight">{ovr}</span>
            </div>
            <div>
              <span className={`text-[11px] font-mono font-black uppercase tracking-wider block ${theme.rankColor}`}>
                {theme.badgeText}
              </span>
              <span className="text-[9px] font-mono text-slate-400 block tracking-widest">
                {theme.federation}
              </span>
            </div>
          </div>

          {/* Right: Belt Sleeve with Divisas (Graus) Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                Divisas
              </span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {stripes} de 4
              </span>
            </div>

            {/* Official Fabric Sleeve Bar */}
            <div className={`h-8 w-12 rounded ${theme.barColor} border border-white/30 flex items-center justify-end px-1.5 gap-1 shadow`}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-6 rounded-xs transition-all ${
                    i < stripes ? theme.stripeColor : 'bg-white/15'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. Card Center: High-Definition Hero Portrait */}
        <div className="relative my-4 flex flex-col items-center justify-center">
          <div className="relative p-1 rounded-full border-2 border-white/20 shadow-2xl">
            <AthletePortrait
              avatarId={athlete.visual?.avatarId}
              avatarUrl={athlete.visual?.avatarUrl}
              belt={athlete.belt}
              stripes={athlete.stripes}
              size="hero"
              showBeltBorder={true}
            />
          </div>

          {/* Weight Class & Fighting Style Pills */}
          <div className="flex items-center gap-1.5 mt-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-900 border border-slate-700 text-slate-200">
              {athlete.weightClass}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              {athlete.style}
            </span>
          </div>
        </div>

        {/* 3. Athlete Identity Banner */}
        <div className="relative z-10 text-center py-2 border-y border-white/10 bg-black/30 rounded-xl my-1">
          <h3 className="font-title text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-wide">
            {athlete.name}
          </h3>
          {athlete.nickname && (
            <p className="font-title font-bold text-sm text-amber-400 mt-0.5">
              "{athlete.nickname}"
            </p>
          )}
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            {athlete.academy}
          </p>
        </div>

        {/* 4. Core Attributes Matrix (BJJ Trading Card Stats) */}
        <div className="relative z-10 grid grid-cols-3 gap-2 my-3 text-center">
          <div className="p-2 rounded-xl bg-zinc-900/70 border border-white/5 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Quedas</span>
            <span className="font-title text-base sm:text-lg font-black text-slate-100">{attrs.quedas}</span>
          </div>

          <div className="p-2 rounded-xl bg-zinc-900/70 border border-white/5 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Passagem</span>
            <span className="font-title text-base sm:text-lg font-black text-slate-100">{attrs.passagemGuarda}</span>
          </div>

          <div className="p-2 rounded-xl bg-zinc-900/70 border border-white/5 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Guarda</span>
            <span className="font-title text-base sm:text-lg font-black text-slate-100">{attrs.raspagens}</span>
          </div>

          <div className="p-2 rounded-xl bg-zinc-900/70 border border-white/5 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Finalização</span>
            <span className="font-title text-base sm:text-lg font-black text-purple-300">{attrs.finalizacoes}</span>
          </div>

          <div className="p-2 rounded-xl bg-zinc-900/70 border border-white/5 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Força</span>
            <span className="font-title text-base sm:text-lg font-black text-slate-100">{attrs.forca}</span>
          </div>

          <div className="p-2 rounded-xl bg-zinc-900/70 border border-white/5 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Gás</span>
            <span className="font-title text-base sm:text-lg font-black text-emerald-400">{attrs.resistencia}</span>
          </div>
        </div>

        {/* 5. Career Summary & Serial Stamp */}
        <div className="relative z-10 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/10">
          <div>
            <span className="text-slate-300 font-bold">
              {athlete.careerRecord.wins}V - {athlete.careerRecord.losses}D
            </span>{' '}
            ({athlete.careerRecord.submissions} Subs)
          </div>

          {onEditClick && (
            <button
              onClick={onEditClick}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-mono font-bold transition-all hover:scale-105"
            >
              Editar Perfil
            </button>
          )}

          <span className="text-[9px] text-slate-500">
            BJJCARDS • OFFICIAL CARD
          </span>
        </div>
      </div>
    </div>
  );
};
