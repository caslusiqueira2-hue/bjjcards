import React from 'react';
import { CombatCard } from '../../types/cards';
import { CardArtwork } from './CardArtwork';
import {
  Zap,
  Flame,
  ShieldAlert,
  Anchor,
  RotateCcw,
  Wind,
  Crosshair,
  Layers,
  Scissors,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Minimize2,
  Crown,
  Target,
  AlertTriangle,
  Maximize,
  Skull,
  Lock,
  Shield,
  ShieldCheck,
  CornerDownLeft,
  Footprints,
  Compass,
  LucideIcon
} from 'lucide-react';

interface CardComponentProps {
  card: CombatCard;
  isSelected?: boolean;
  isValid?: boolean;
  invalidReason?: string;
  onSelect?: () => void;
  onPlay?: () => void;
  estimatedSuccessRate?: number;
  compact?: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Flame,
  ShieldAlert,
  Anchor,
  RotateCcw,
  Wind,
  Crosshair,
  Layers,
  Scissors,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Minimize2,
  Crown,
  Target,
  AlertTriangle,
  Maximize,
  Skull,
  Lock,
  Shield,
  ShieldCheck,
  CornerDownLeft,
  Footprints,
  Compass
};

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  isSelected = false,
  isValid = true,
  invalidReason,
  onSelect,
  onPlay,
  estimatedSuccessRate,
  compact = false
}) => {
  const [imageError, setImageError] = React.useState(false);
  const Icon = ICON_MAP[card.iconName] || Zap;

  // Category styling themes
  const getCategoryTheme = () => {
    switch (card.category) {
      case 'QUEDA':
        return {
          border: 'border-red-500/70',
          glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]',
          badgeBg: 'bg-red-950/80 text-red-300 border-red-700/60',
          gemColor: 'from-red-500 to-rose-700',
          gradientBg: 'from-zinc-950 via-neutral-900 to-red-950/30'
        };
      case 'PASSAGEM':
        return {
          border: 'border-blue-500/70',
          glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]',
          badgeBg: 'bg-blue-950/80 text-blue-300 border-blue-700/60',
          gemColor: 'from-blue-500 to-indigo-700',
          gradientBg: 'from-zinc-950 via-neutral-900 to-blue-950/30'
        };
      case 'RASPAGEM':
        return {
          border: 'border-emerald-500/70',
          glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]',
          badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
          gemColor: 'from-emerald-500 to-teal-700',
          gradientBg: 'from-zinc-950 via-neutral-900 to-emerald-950/30'
        };
      case 'FINALIZACAO':
        return {
          border: 'border-purple-500/80',
          glow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]',
          badgeBg: 'bg-purple-950/90 text-purple-300 border-purple-700/70',
          gemColor: 'from-purple-500 to-fuchsia-800',
          gradientBg: 'from-zinc-950 via-neutral-900 to-purple-950/40'
        };
      case 'CONTROLE':
      case 'TRANSICAO':
        return {
          border: 'border-amber-500/70',
          glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]',
          badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
          gemColor: 'from-amber-500 to-orange-700',
          gradientBg: 'from-zinc-950 via-neutral-900 to-amber-950/30'
        };
      case 'DEFESA_FINALIZACAO':
      case 'RETENCAO':
        return {
          border: 'border-cyan-500/70',
          glow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]',
          badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60',
          gemColor: 'from-cyan-500 to-blue-700',
          gradientBg: 'from-zinc-950 via-neutral-900 to-cyan-950/30'
        };
      case 'MOVIMENTO':
      default:
        return {
          border: 'border-slate-500/70',
          glow: 'hover:shadow-[0_0_15px_rgba(148,163,184,0.3)]',
          badgeBg: 'bg-slate-900 text-slate-300 border-slate-700',
          gemColor: 'from-slate-400 to-slate-600',
          gradientBg: 'from-zinc-950 via-neutral-900 to-slate-900/40'
        };
    }
  };

  const theme = getCategoryTheme();

  return (
    <div
      onClick={() => {
        if (isValid && onSelect) onSelect();
      }}
      className={`group relative flex flex-col justify-between rounded-xl border bg-gradient-to-b ${
        theme.gradientBg
      } ${theme.border} p-2 sm:p-3 transition-all duration-200 select-none cursor-pointer ${
        compact ? 'w-40 h-56' : 'w-32 h-48 sm:w-48 sm:h-68 md:w-52 md:h-72'
      } ${
        isSelected
          ? 'scale-105 ring-2 ring-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)] z-20 -translate-y-2'
          : 'hover:-translate-y-1.5'
      } ${
        !isValid
          ? 'opacity-40 grayscale contrast-75 cursor-not-allowed hover:translate-y-0'
          : theme.glow
      }`}
    >
      {/* Top Header: Category and Energy Diamond */}
      <div className="flex items-center justify-between gap-1 z-10">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shadow-sm ${theme.badgeBg}`}
        >
          {card.category}
        </span>

        {/* Energy Cost Gem */}
        <div className="relative flex items-center justify-center">
          <div
            className={`w-7 h-7 rounded-md rotate-45 bg-gradient-to-br ${theme.gemColor} border border-white/40 shadow-md flex items-center justify-center`}
          >
            <span className="-rotate-45 text-white font-mono font-black text-xs">
              {card.energyCost}
            </span>
          </div>
          <span className="absolute -bottom-4 text-[8px] font-mono font-semibold text-slate-400">
            EN
          </span>
        </div>
      </div>

      {/* Central Illustration Area */}
      <div className="relative my-1 sm:my-2 h-14 sm:h-20 md:h-24 rounded-lg bg-black/60 border border-white/10 flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:8px_8px] opacity-20 pointer-events-none" />

        {/* Custom Card Art Image if provided in /cards/<id>.png, fallback to SVG artwork */}
        {!imageError ? (
          <img
            src={`/cards/${card.id}.png`}
            alt={card.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <CardArtwork
            category={card.category}
            cardId={card.id}
            isSubmission={card.isSubmission}
            className="w-full h-full transform group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Martial Art Floating Emblem Icon in Corner */}
        <div className="absolute top-1 left-1.5 p-0.5 sm:p-1 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 z-10">
          <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-200" />
        </div>

        {/* Points or Finalização Badge */}
        {card.pointsOnSuccess && (
          <div className="absolute bottom-1 right-1 bg-amber-500/90 text-black text-[9px] sm:text-[10px] font-mono font-black px-1 sm:px-1.5 py-0.5 rounded shadow z-10">
            +{card.pointsOnSuccess} PTS
          </div>
        )}
        {card.isSubmission && (
          <div className="absolute bottom-1 right-1 bg-purple-600 text-white text-[8px] sm:text-[9px] font-mono font-black px-1 sm:px-1.5 py-0.5 rounded shadow animate-pulse z-10">
            FINALIZAR
          </div>
        )}
      </div>

      {/* Technique Title & Description */}
      <div className="z-10 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-title text-xs sm:text-sm md:text-base font-bold text-slate-100 tracking-wide leading-tight line-clamp-1">
            {card.name}
          </h4>
          <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">
            {card.description}
          </p>
        </div>

        {/* Tactical Requirements & Success Pill */}
        <div className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px]">
          <div className="flex items-center gap-1">
            {card.requiredRole === 'top' && (
              <span className="px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-600/50 font-mono font-bold text-[8px] sm:text-[9px]">
                POR CIMA
              </span>
            )}
            {card.requiredRole === 'bottom' && (
              <span className="px-1.5 py-0.2 rounded bg-blue-950/80 text-blue-300 border border-blue-600/50 font-mono font-bold text-[8px] sm:text-[9px]">
                POR BAIXO
              </span>
            )}
            {card.requiredRole === 'any' && (
              <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-slate-300 border border-slate-600 font-mono text-[8px] sm:text-[9px]">
                LIVRE
              </span>
            )}
          </div>

          {estimatedSuccessRate !== undefined && isValid && (
            <span className="text-emerald-400 font-mono font-bold text-[9px] sm:text-[10px]">
              {estimatedSuccessRate}%
            </span>
          )}
        </div>
      </div>

      {/* Play Action Button when selected */}
      {isSelected && isValid && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onPlay) onPlay();
          }}
          className="mt-1 sm:mt-2 w-full py-1 sm:py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-title font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-md shadow-lg transition-all animate-pulse"
        >
          Executar Técnica
        </button>
      )}

      {/* Tooltip for why card is disabled */}
      {!isValid && invalidReason && (
        <div className="absolute inset-0 bg-black/85 rounded-xl p-2.5 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none">
          <AlertTriangle className="w-6 h-6 text-amber-400 mb-1" />
          <p className="text-[11px] text-slate-200 leading-tight">
            {invalidReason}
          </p>
        </div>
      )}
    </div>
  );
};
