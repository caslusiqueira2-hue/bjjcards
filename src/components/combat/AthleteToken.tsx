import React from 'react';
import { Athlete } from '../../types/athlete';
import { AthletePortrait } from '../career/AthletePortrait';

interface AthleteTokenProps {
  athlete: Athlete;
  isPlayer: boolean;
  facing: 'right' | 'left';
  isInSubmissionDanger?: boolean;
  isCurrentTurn?: boolean;
  lastActionFx?: string | null;
  className?: string;
  size?: 'normal' | 'large' | 'compact';
}

export const AthleteToken: React.FC<AthleteTokenProps> = ({
  athlete,
  isPlayer,
  facing,
  isInSubmissionDanger = false,
  isCurrentTurn = false,
  lastActionFx,
  className = '',
  size = 'normal'
}) => {
  // Energy percentage
  const energyPercent = Math.max(0, Math.min(100, (athlete.currentEnergy / athlete.maxEnergy) * 100));

  // Determine size classes
  const portraitSize = size === 'large' ? 'lg' : size === 'compact' ? 'sm' : 'md';
  const ringRadius = size === 'large' ? 46 : size === 'compact' ? 24 : 32;
  const strokeWidth = size === 'large' ? 4 : 3;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference - (circumference * energyPercent) / 100;

  // Determine stamina color
  const staminaColor =
    energyPercent > 60 ? '#10b981' : energyPercent > 30 ? '#f59e0b' : '#ef4444';

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none transition-all duration-300 ${className}`}
    >
      {/* Dynamic Tatame Spotlight Shadow */}
      <div
        className={`absolute bottom-6 w-20 h-6 rounded-full blur-md transition-all duration-300 pointer-events-none ${
          isCurrentTurn
            ? isPlayer
              ? 'bg-blue-500/40 scale-125'
              : 'bg-red-500/40 scale-125'
            : 'bg-black/60 scale-100'
        } ${isInSubmissionDanger ? 'bg-red-600/70 scale-150 animate-ping' : ''}`}
      />

      {/* Main Fighter Medallion Container */}
      <div
        className={`relative flex items-center justify-center rounded-full p-1 transition-transform duration-300 ${
          isCurrentTurn
            ? isPlayer
              ? 'ring-2 ring-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-105'
              : 'ring-2 ring-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-105'
            : 'ring-1 ring-white/10 shadow-lg'
        } ${isInSubmissionDanger ? 'ring-4 ring-red-500 animate-pulse' : ''}`}
      >
        {/* SVG Circular Stamina Progress Arc */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-20"
          viewBox={`0 0 ${ringRadius * 2 + 12} ${ringRadius * 2 + 12}`}
        >
          {/* Background Track */}
          <circle
            cx={ringRadius + 6}
            cy={ringRadius + 6}
            r={ringRadius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            opacity="0.4"
          />
          {/* Active Energy Meter */}
          <circle
            cx={ringRadius + 6}
            cy={ringRadius + 6}
            r={ringRadius}
            fill="none"
            stroke={staminaColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>

        {/* High-Resolution Illustrated Fighter Portrait */}
        <div className={`relative z-10 ${facing === 'left' ? 'scale-x-[-1]' : ''}`}>
          <AthletePortrait
            avatarId={athlete.visual?.avatarId}
            avatarUrl={athlete.visual?.avatarUrl}
            belt={athlete.belt}
            stripes={athlete.stripes}
            size={portraitSize}
            showBeltBorder={true}
          />
        </div>

        {/* Submission Perigo Hazard Indicator */}
        {isInSubmissionDanger && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-rose-700 text-white font-mono text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg uppercase tracking-wider animate-bounce z-30 border border-white/50">
            PERIGO!
          </div>
        )}
      </div>

      {/* Fighter Name & Energy Status Pill */}
      <div className="mt-2 flex flex-col items-center z-20">
        <div
          className={`px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-title font-black tracking-wide shadow-md border ${
            isPlayer
              ? 'bg-blue-950/90 text-blue-200 border-blue-500/50'
              : 'bg-zinc-900/90 text-amber-300 border-amber-500/50'
          }`}
        >
          {athlete.nickname ? `"${athlete.nickname}"` : athlete.name.split(' ')[0]}
        </div>
        <div className="text-[9px] text-slate-400 font-mono tracking-tight mt-0.5">
          {athlete.style} • <span className="font-bold text-slate-200">{Math.round(athlete.currentEnergy)}</span>/{athlete.maxEnergy} EN
        </div>
      </div>
    </div>
  );
};
