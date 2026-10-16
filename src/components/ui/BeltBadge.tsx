import React from 'react';
import { Belt } from '../../types/athlete';

interface BeltBadgeProps {
  belt: Belt;
  stripes?: number;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BeltBadge: React.FC<BeltBadgeProps> = ({
  belt,
  stripes = 0,
  className = '',
  showText = true,
  size = 'md'
}) => {
  const getBeltStyles = () => {
    switch (belt) {
      case 'white':
        return {
          bg: 'bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300',
          border: 'border-slate-400',
          text: 'text-slate-900',
          name: 'Faixa Branca',
          barBg: 'bg-black',
          stripeColor: 'bg-white'
        };
      case 'blue':
        return {
          bg: 'bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800',
          border: 'border-blue-400',
          text: 'text-blue-100',
          name: 'Faixa Azul',
          barBg: 'bg-black',
          stripeColor: 'bg-white'
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900',
          border: 'border-purple-400',
          text: 'text-purple-100',
          name: 'Faixa Roxa',
          barBg: 'bg-black',
          stripeColor: 'bg-white'
        };
      case 'brown':
        return {
          bg: 'bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900',
          border: 'border-amber-700',
          text: 'text-amber-100',
          name: 'Faixa Marrom',
          barBg: 'bg-black',
          stripeColor: 'bg-white'
        };
      case 'black':
        return {
          bg: 'bg-gradient-to-r from-zinc-950 via-black to-zinc-900',
          border: 'border-amber-500/80',
          text: 'text-amber-400 font-bold',
          name: 'Faixa Preta',
          barBg: 'bg-red-700', // Black belt in BJJ has a RED bar (ponteira vermelha)!
          stripeColor: 'bg-white'
        };
    }
  };

  const style = getBeltStyles();

  const sizeClasses = {
    sm: 'h-4 w-16 text-[9px]',
    md: 'h-5 w-24 text-[11px]',
    lg: 'h-7 w-36 text-xs'
  }[size];

  const barWidth = {
    sm: 'w-4',
    md: 'w-6',
    lg: 'w-9'
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Authentic BJJ Belt with rank bar & white stripes */}
      <div
        className={`relative ${sizeClasses} ${style.bg} border ${style.border} rounded-sm shadow-sm overflow-hidden flex items-center justify-between px-1`}
      >
        {/* Belt weave texture lines */}
        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#000_2px,#000_4px)] pointer-events-none" />

        {/* Brand label tag */}
        <div className="z-10 text-[7px] font-mono tracking-tighter text-black/50 font-black uppercase">
          JJL
        </div>

        {/* Black or Red rank bar (ponteira) */}
        <div className={`h-full ${barWidth} ${style.barBg} border-l border-r border-black/40 flex items-center justify-evenly px-0.5 z-10`}>
          {Array.from({ length: Math.min(4, stripes) }).map((_, i) => (
            <div
              key={i}
              className={`h-full w-1 ${style.stripeColor} shadow-sm rounded-none`}
            />
          ))}
        </div>
      </div>

      {showText && (
        <span className={`font-semibold tracking-wider uppercase ${style.text}`}>
          {style.name} {stripes > 0 ? `(${stripes}º Grau)` : ''}
        </span>
      )}
    </div>
  );
};
