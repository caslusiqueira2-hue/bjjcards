import React from 'react';
import { CombatPosition, SubmissionThreat } from '../../types/combat';
import { Athlete } from '../../types/athlete';
import { getPositionNamePt } from '../../engine/bjjRules';
import { Shield, Skull, Zap, AlertCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface TechnicalStateHUDProps {
  position: CombatPosition;
  player: Athlete;
  opponent: Athlete;
  topAthleteId: string | null;
  bottomAthleteId: string | null;
  activeSubmission: SubmissionThreat | null;
}

export const TechnicalStateHUD: React.FC<TechnicalStateHUDProps> = ({
  position,
  player,
  opponent,
  topAthleteId,
  bottomAthleteId,
  activeSubmission
}) => {
  const isStanding = position === 'STANDING' || position === 'CLINCH';

  const getAthleteRoleDetails = (athleteId: string) => {
    if (isStanding) {
      return {
        roleTitle: 'Luta em Pé',
        roleBadge: 'Em Pé',
        roleClass: 'bg-zinc-800 text-slate-200 border-slate-600',
        objective: 'Disputar pegadas, aplicar quedas (+2 pts) ou puxar para a guarda.'
      };
    }
    if (athleteId === topAthleteId) {
      return {
        roleTitle: 'Posição Superior (Passador / Topo)',
        roleBadge: 'POR CIMA',
        roleClass: 'bg-amber-950/80 text-amber-300 border-amber-500/70',
        objective: position === 'CLOSED_GUARD' || position === 'OPEN_GUARD' || position === 'HALF_GUARD'
          ? 'Manter postura, evitar raspagens e passar a guarda (+3 pts).'
          : 'Estabilizar o peso, avançar para a montada/costas (+4 pts) ou finalizar.'
      };
    }
    if (athleteId === bottomAthleteId) {
      return {
        roleTitle: 'Posição Inferior (Guardeiro / Defesa)',
        roleBadge: 'POR BAIXO',
        roleClass: 'bg-blue-950/80 text-blue-300 border-blue-500/70',
        objective: position === 'CLOSED_GUARD' || position === 'OPEN_GUARD' || position === 'HALF_GUARD'
          ? 'Raspar para ficar por cima (+2 pts), aplicar armlock/triângulo ou reter a guarda.'
          : 'Fazer pontes/upas (+2 reversão), fugir de quadril/cotovelo e recompor a guarda.'
      };
    }
    return {
      roleTitle: 'Disputa de Solo',
      roleBadge: 'Disputa',
      roleClass: 'bg-zinc-800 text-slate-300 border-slate-600',
      objective: 'Transição tática.'
    };
  };

  const playerRole = getAthleteRoleDetails(player.id);
  const opponentRole = getAthleteRoleDetails(opponent.id);

  return (
    <div className="w-full max-w-4xl mx-auto mb-2.5 flex flex-col md:flex-row gap-2">
      {/* Position Status Panel */}
      <div className="flex-1 bg-zinc-950/90 border border-slate-700/60 rounded-xl p-3 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
              SITUAÇÃO DO COMBATE
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-title font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
            {getPositionNamePt(position)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Player Role Box */}
          <div className="bg-blue-950/30 border border-blue-600/30 rounded-lg p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-title font-black text-blue-300 uppercase">
                {player.name}
              </span>
              <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-black border ${playerRole.roleClass}`}>
                {playerRole.roleBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              {playerRole.objective}
            </p>
          </div>

          {/* Opponent Role Box */}
          <div className="bg-red-950/30 border border-red-600/30 rounded-lg p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-title font-black text-red-300 uppercase">
                {opponent.name}
              </span>
              <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-black border ${opponentRole.roleClass}`}>
                {opponentRole.roleBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              {opponentRole.objective}
            </p>
          </div>
        </div>
      </div>

      {/* Submission Danger Threat Gauge (if active) */}
      {activeSubmission && (
        <div className="w-full md:w-80 bg-purple-950/50 border-2 border-purple-500 rounded-xl p-3 shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-pulse-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-purple-500/40 pb-1 mb-1.5">
            <div className="flex items-center gap-1.5 text-purple-300">
              <Skull className="w-4 h-4 text-purple-400 animate-bounce" />
              <span className="font-title font-black text-xs uppercase tracking-wider">
                ATAQUE DE FINALIZAÇÃO!
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-red-400 animate-pulse">
              {Math.round(activeSubmission.lockDepth)}% PRESSÃO
            </span>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
              <span>{activeSubmission.techniqueName}</span>
              <span className="text-[10px] font-mono text-purple-300 font-bold">
                {activeSubmission.attackerId === player.id ? 'Você está atacando!' : 'Você está em perigo!'}
              </span>
            </div>

            {/* Lock Depth Progress Bar */}
            <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden mt-1.5 border border-purple-400/50 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 rounded-full transition-all duration-300 shadow"
                style={{ width: `${Math.min(100, activeSubmission.lockDepth)}%` }}
              />
            </div>
          </div>

          <div className="text-[10px] text-red-300 flex items-center gap-1 mt-1 font-mono">
            <AlertCircle className="w-3 h-3 text-red-400" />
            <span>
              {activeSubmission.attackerId === player.id
                ? 'Pressione o golpe para forçar os 3 tapinhas!'
                : 'Jogue defesas técnicas de imediato para não bater!'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
