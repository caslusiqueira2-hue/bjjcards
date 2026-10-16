import React, { useState } from 'react';
import { CombatPosition } from '../../types/combat';
import { Belt } from '../../types/athlete';
import { BJJ3DScene } from './3d/BJJ3DScene';

interface PositionIllustrationProps {
  position: CombatPosition;
  playerRole?: 'top' | 'bottom' | 'standing';
  playerBelt?: Belt;
  opponentBelt?: Belt;
  playerGiColor?: string;
  opponentGiColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showPointsBadge?: boolean;
}

export const PositionIllustration: React.FC<PositionIllustrationProps> = ({
  position,
  playerRole = 'standing',
  playerBelt = 'white',
  opponentBelt = 'blue',
  playerGiColor = '#f8fafc', // default white gi
  opponentGiColor = '#2563eb', // default blue gi
  size = 'md',
  className = '',
  showPointsBadge = true
}) => {
  const [hasWebGlError, setHasWebGlError] = useState(false);

  // Size dimensions
  const sizeClasses = {
    sm: 'w-36 h-24 sm:w-44 sm:h-28',
    md: 'w-64 h-36 sm:w-80 sm:h-48 md:w-96 md:h-56',
    lg: 'w-72 h-44 sm:w-[420px] sm:h-64',
    xl: 'w-full max-w-lg h-56 sm:h-72'
  };

  // Official IBJJF Points / Situation Badge
  const getPointsBadge = () => {
    switch (position) {
      case 'MOUNT':
        return { label: '+4 PTS OFICIAIS (MONTADA)', bg: 'bg-amber-500 text-black border-amber-300' };
      case 'BACK_MOUNT':
        return { label: '+4 PTS OFICIAIS (PEGADA DE COSTAS)', bg: 'bg-amber-500 text-black border-amber-300' };
      case 'SIDE_CONTROL':
        return { label: '+3 PTS (PASSAGEM ESTABILIZADA)', bg: 'bg-emerald-500 text-black border-emerald-300' };
      case 'HALF_GUARD':
        return { label: 'MEIA GUARDA (DISPUTA DE ESGRIMA)', bg: 'bg-purple-600 text-white border-purple-400' };
      case 'CLOSED_GUARD':
        return { label: 'GUARDA FECHADA (CONTROLE)', bg: 'bg-blue-600 text-white border-blue-400' };
      case 'OPEN_GUARD':
        return { label: 'GUARDA ABERTA (DE LA RIVA)', bg: 'bg-cyan-600 text-white border-cyan-400' };
      case 'STANDING':
        return { label: 'LUTA EM PÉ (QUEDA = +2)', bg: 'bg-zinc-800 text-slate-200 border-slate-600' };
      case 'CLINCH':
        return { label: 'CLINCH • DISPUTA DE ESGRIMA', bg: 'bg-zinc-800 text-amber-300 border-amber-500/50' };
      case 'TURTLE':
        return { label: 'TARTARUGA (DEFESA)', bg: 'bg-zinc-800 text-slate-300 border-slate-600' };
      default:
        return null;
    }
  };

  const badge = getPointsBadge();

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-b from-black/95 via-[#0b0f19] to-black border border-amber-500/30 shadow-2xl ${sizeClasses[size]} ${className}`}
    >
      {/* Ambient background glow matching IBJJF tatame */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.18),transparent_75%)] pointer-events-none" />

      {/* Interactive 3D WebGL BJJ Grappling Scene */}
      {!hasWebGlError ? (
        <BJJ3DScene
          position={position}
          playerRole={playerRole}
          playerBelt={playerBelt}
          opponentBelt={opponentBelt}
          playerGiColor={playerGiColor}
          opponentGiColor={opponentGiColor}
          className="w-full h-full"
        />
      ) : (
        <div className="text-xs font-mono text-slate-400">
          Modo 3D indisponível
        </div>
      )}

      {/* Official Points Pill Overlay */}
      {showPointsBadge && badge && size !== 'sm' && (
        <div className="absolute top-2 right-2 z-10 pointer-events-none animate-fade-in">
          <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-mono font-black uppercase tracking-wider border shadow-md ${badge.bg}`}>
            {badge.label}
          </span>
        </div>
      )}

      {/* Interactive Orbit Hint */}
      {size !== 'sm' && (
        <div className="absolute bottom-1.5 right-2 z-10 pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[8px] font-mono text-slate-400 bg-black/75 px-1.5 py-0.5 rounded border border-white/10 shadow">
            3D Interativo • Gire a câmera
          </span>
        </div>
      )}
    </div>
  );
};
