import React, { useState } from 'react';
import { CombatActionLog } from '../../types/combat';
import { ScrollText, ChevronDown, ChevronUp } from 'lucide-react';

interface CombatLogProps {
  logs: CombatActionLog[];
}

export const CombatLog: React.FC<CombatLogProps> = ({ logs }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="w-full max-w-4xl mx-auto mt-2 bg-zinc-950/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header Bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between text-xs font-title font-bold text-slate-300 hover:text-amber-400 bg-slate-900/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-amber-500" />
          <span className="uppercase tracking-wider">HISTÓRICO DO COMBATE ({logs.length})</span>
          {logs[0] && (
            <span className="text-[11px] font-normal text-slate-400 truncate max-w-md hidden sm:inline">
              Último: {logs[0].description}
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Expanded Logs Feed */}
      {isExpanded && (
        <div className="max-h-48 overflow-y-auto p-2.5 space-y-1.5 font-mono text-xs text-slate-300 divide-y divide-white/5">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`pt-1.5 flex items-start justify-between gap-2 ${
                log.isCritical ? 'text-amber-300 font-bold bg-amber-500/10 px-2 py-1 rounded' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-[10px] text-slate-500 bg-zinc-900 px-1 rounded flex-shrink-0">
                  T{log.turn}
                </span>
                <p className="leading-snug">{log.description}</p>
              </div>

              {log.pointsAwarded && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold text-[10px] flex-shrink-0">
                  +{log.pointsAwarded.amount} PTS
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
