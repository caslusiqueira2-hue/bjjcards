import React, { useState } from 'react';
import { Athlete } from '../../types/athlete';
import { TrainingDrill, CareerState } from '../../types/career';
import { TRAINING_DRILLS } from '../../data/trainingData';
import { Dumbbell, Zap, Clock, ShieldAlert, HeartPulse, CheckCircle2, Flame, Award } from 'lucide-react';
import { sound } from '../../audio/soundEffects';

interface TrainingGymProps {
  athlete: Athlete;
  careerState: CareerState;
  onTrain: (drill: TrainingDrill) => void;
}

export const TrainingGym: React.FC<TrainingGymProps> = ({ athlete, careerState, onTrain }) => {
  const [selectedDrill, setSelectedDrill] = useState<TrainingDrill>(TRAINING_DRILLS[0]);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const handleExecute = (drill: TrainingDrill) => {
    if (athlete.currentEnergy < drill.energyCost && drill.energyCost > 0) return;

    sound.playGiGrip();
    onTrain(drill);
    setLastFeedback(`Camp da Semana ${careerState.currentWeek} concluído: ${drill.title}. ${drill.coachTips}`);
  };

  const isTired = athlete.fatigue >= 80;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* 1. Dojo Banner & Current Athletic Status */}
      <div className="bg-zinc-950/90 border border-amber-600/40 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-title font-bold text-xs uppercase tracking-widest">
            <Dumbbell className="w-4 h-4 text-amber-400" />
            <span>CENTRO DE ALTA PERFORMANCE • CAMPS SEMANAIS</span>
          </div>
          <h2 className="font-title text-2xl md:text-3xl font-black text-slate-100 tracking-wide mt-1">
            Dojo & Preparação Técnica
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Cada camp consome energia diária e exige <strong>1 semana de maturação</strong> para fixar os ajustes técnicos no seu atleta.
          </p>
        </div>

        {/* Athletic Biomarkers */}
        <div className="bg-zinc-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-4 text-xs font-mono shadow-inner">
          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Energia
            </span>
            <span className="text-sm md:text-base font-black text-amber-300 mt-0.5">
              {Math.round(athlete.currentEnergy)} / {athlete.maxEnergy}
            </span>
          </div>

          <div className="border-l border-slate-700 pl-4 flex flex-col items-center">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5 text-red-400" />
              Fadiga
            </span>
            <span className={`text-sm md:text-base font-black mt-0.5 ${athlete.fatigue > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
              {athlete.fatigue}%
            </span>
          </div>

          <div className="border-l border-slate-700 pl-4 flex flex-col items-center">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Calendário
            </span>
            <span className="text-sm md:text-base font-black text-blue-300 mt-0.5">
              Semana {careerState.currentWeek}
            </span>
          </div>
        </div>
      </div>

      {/* Warning if fatigued */}
      {isTired && (
        <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/70 flex items-center gap-3 text-xs text-red-200 font-mono shadow-lg animate-pulse">
          <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>
            <strong>ALERTA DE FADIGA ALTA ({athlete.fatigue}%):</strong> O corpo está no limite de estafa física. Priorize o camp de <em>"Descanso Ativo, Gelo & Fisioterapia"</em> para evitar lesões graves!
          </span>
        </div>
      )}

      {/* Coach Feedback Banner */}
      {lastFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/60 flex items-start gap-3 text-xs text-emerald-200 font-mono shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>{lastFeedback}</span>
        </div>
      )}

      {/* Streamlined Training Camps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TRAINING_DRILLS.map((drill) => {
          const hasEnergy = athlete.currentEnergy >= drill.energyCost;
          const isFatigueDangerous = athlete.fatigue + drill.fatigueDelta > 95 && drill.fatigueDelta > 0;
          const isSelected = selectedDrill.id === drill.id;

          return (
            <div
              key={drill.id}
              onClick={() => setSelectedDrill(drill)}
              className={`bg-zinc-950/85 border rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/50 bg-zinc-900/90 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header: Title and Category badge */}
                <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2.5 mb-2.5">
                  <div>
                    <h3 className="font-title text-base font-bold text-slate-100 leading-tight">
                      {drill.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-400" />
                        Duração: <strong>{drill.timeCostWeeks} Semana</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        Custo: <strong>{drill.energyCost} EN</strong>
                      </span>
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                      drill.category === 'recuperacao'
                        ? 'bg-blue-950 text-blue-300 border border-blue-600'
                        : drill.category === 'condicionamento'
                        ? 'bg-rose-950 text-rose-300 border border-rose-600'
                        : 'bg-amber-950 text-amber-300 border border-amber-600'
                    }`}
                  >
                    {drill.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {drill.description}
                </p>

                {/* Attribute Gains */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {Object.entries(drill.attributeGains).map(([attr, gain]) => (
                    <span
                      key={attr}
                      className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-slate-700 text-[10px] font-mono text-emerald-400 font-bold"
                    >
                      +{gain} {attr}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded-lg bg-amber-950/70 border border-amber-600 text-[10px] font-mono text-amber-300 font-bold">
                    +{drill.skillPointsEarned} SP
                  </span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="text-[11px] font-mono text-slate-400">
                  Impacto na Fadiga:{' '}
                  <span
                    className={drill.fatigueDelta > 0 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}
                  >
                    {drill.fatigueDelta > 0 ? `+${drill.fatigueDelta}%` : `${drill.fatigueDelta}% (Recuperação)`}
                  </span>
                </div>

                <button
                  disabled={!hasEnergy || isFatigueDangerous}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExecute(drill);
                  }}
                  className={`px-4 py-2 rounded-xl font-title font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
                    !hasEnergy
                      ? 'bg-zinc-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : isFatigueDangerous
                      ? 'bg-red-950 text-red-400 cursor-not-allowed border border-red-700'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black hover:scale-105 font-black'
                  }`}
                >
                  {!hasEnergy
                    ? 'Energia Insuficiente'
                    : isFatigueDangerous
                    ? 'Risco de Lesão'
                    : 'Realizar Camp (1 Sem)'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
