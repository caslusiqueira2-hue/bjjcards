import React, { useState } from 'react';
import { Athlete } from '../../types/athlete';
import { BeltBadge } from '../ui/BeltBadge';
import { AthletePortrait } from './AthletePortrait';
import { AthleteBJJCard } from './AthleteBJJCard';
import { EditAthleteModal } from './EditAthleteModal';
import { CareerEngine } from '../../engine/careerEngine';
import { Shield, Zap, Award, Activity, Plus, Clock, Sparkles, UserCog, Edit3 } from 'lucide-react';

interface AthleteProfileProps {
  athlete: Athlete;
  onUpgradeAttribute?: (attrKey: string) => void;
  onGraduationAction?: () => void;
  onUpdateAthlete?: (updated: Athlete) => void;
}

export const AthleteProfile: React.FC<AthleteProfileProps> = ({
  athlete,
  onUpgradeAttribute,
  onGraduationAction,
  onUpdateAthlete
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const attrs = athlete.attributes;
  const graduation = CareerEngine.evaluateGraduation(athlete);

  // 6 Core Streamlined BJJ Attributes
  const coreCompetencies = [
    {
      key: 'quedas',
      label: 'Quedas & Wrestling',
      val: attrs.quedas,
      desc: 'Baiana (double leg), single leg, osoto gari e defesa de sprawl'
    },
    {
      key: 'passagemGuarda',
      label: 'Passagem de Guarda',
      val: attrs.passagemGuarda,
      desc: 'Toreando, knee slice, emborcada, over-under e pressão'
    },
    {
      key: 'raspagens',
      label: 'Guarda & Raspagens',
      val: attrs.raspagens,
      desc: 'Guarda fechada, De La Riva, meia profunda e berimbolo'
    },
    {
      key: 'finalizacoes',
      label: 'Finalizações & Escapes',
      val: attrs.finalizacoes,
      desc: 'Armlocks, estrangulamentos, triângulos e escapes defensivos'
    },
    {
      key: 'controlePosicional',
      label: 'Controle Posicional & Postura',
      val: attrs.controlePosicional,
      desc: 'Pressão nos 100kg, montada, pegada de costas e postura'
    },
    {
      key: 'resistencia',
      label: 'Gás & Condicionamento',
      val: attrs.resistencia,
      desc: 'Força isométrica de pegada, tanque de estamina e explosão'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* 1. Athlete Hero Section: Collectible BJJ Card + Career Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Collectible BJJ Card with Belt Rank Wrap */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <AthleteBJJCard
            athlete={athlete}
            onEditClick={() => setIsEditModalOpen(true)}
            className="w-full max-w-sm"
          />
        </div>

        {/* Right Column: Athlete Overview, Cartel & Quick Actions */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Info Card */}
          <div className="bg-zinc-950/90 border border-amber-600/40 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-title text-2xl md:text-3xl font-black text-slate-100 tracking-wide uppercase">
                    {athlete.name}
                  </h2>
                  {athlete.nickname && (
                    <span className="text-amber-400 font-title font-bold text-lg">
                      "{athlete.nickname}"
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-slate-400 font-mono mt-0.5">
                  Academia: <strong className="text-slate-200">{athlete.academy}</strong>
                </p>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-title font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 shadow"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar Informações</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <BeltBadge belt={athlete.belt} stripes={athlete.stripes} size="md" />
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-zinc-900 border border-slate-700 text-slate-300">
                {athlete.weightClass}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                Estilo: {athlete.style}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-950/60 border border-blue-600/40 text-blue-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-400" />
                {athlete.trainingWeeks || 0} Semanas de Tatame
              </span>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Cartel Oficial</span>
                <span className="text-base font-mono font-black text-slate-100">
                  {athlete.careerRecord.wins}V - {athlete.careerRecord.losses}D
                </span>
                <span className="text-[10px] text-emerald-400 font-mono block">
                  {athlete.careerRecord.submissions} finalizações
                </span>
              </div>

              <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Reputação</span>
                <span className="text-base font-mono font-black text-amber-400">
                  {athlete.reputation} pts
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  Ranking Nacional
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-zinc-900/60 border border-white/5 p-3 rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Fadiga</span>
                  <span className={`text-xs font-mono font-black ${athlete.fatigue > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {athlete.fatigue}%
                  </span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mt-1.5 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      athlete.fatigue > 60 ? 'bg-red-500' : athlete.fatigue > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${athlete.fatigue}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Graduation & 4 Divisas Progression System */}
      <div className="bg-zinc-950/85 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-title text-base font-black text-slate-100 uppercase tracking-wider">
                SISTEMA DE GRADUAÇÃO & DIVISAS (4 GRAUS POR FAIXA)
              </h3>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              {graduation.feedback}
            </p>
          </div>

          {(graduation.canEarnStripe || graduation.canPromoteBelt) && onGraduationAction && (
            <button
              onClick={onGraduationAction}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-black font-title font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all animate-pulse"
            >
              {graduation.canPromoteBelt ? 'Receber Nova Faixa!' : `Receber ${graduation.nextStripe}º Grau!`}
            </button>
          )}
        </div>

        {/* 4 Divisas Visual Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
          {[1, 2, 3, 4].map((stripeNum) => {
            const isEarned = (athlete.stripes || 0) >= stripeNum;
            const isNext = (athlete.stripes || 0) + 1 === stripeNum;

            return (
              <div
                key={stripeNum}
                className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${
                  isEarned
                    ? 'bg-amber-950/40 border-amber-500/80 text-amber-200'
                    : isNext
                    ? 'bg-zinc-900/80 border-slate-700 text-slate-300'
                    : 'bg-zinc-950/50 border-slate-800/60 opacity-40 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-title font-bold text-xs uppercase tracking-wider">
                    {stripeNum}º Grau (Divisa)
                  </span>
                  <div className={`w-2.5 h-2.5 rounded-full ${isEarned ? 'bg-amber-400' : 'bg-slate-700'}`} />
                </div>
                <span className="text-[10px] font-mono">
                  {isEarned ? 'Conquistado com honras' : isNext ? 'Próximo objetivo' : 'Bloqueado'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Requirements Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl">
            <span className="text-slate-400 block mb-1">Tempo de Tatame:</span>
            <div className="flex justify-between items-center mb-1">
              <span className={graduation.requirements.weeks.met ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                {graduation.requirements.weeks.current} / {graduation.requirements.weeks.required} Semanas
              </span>
              <span className="text-[10px] text-slate-500">
                {Math.min(100, Math.round((graduation.requirements.weeks.current / graduation.requirements.weeks.required) * 100))}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${Math.min(100, (graduation.requirements.weeks.current / graduation.requirements.weeks.required) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl">
            <span className="text-slate-400 block mb-1">Vitórias em Campeonatos:</span>
            <div className="flex justify-between items-center mb-1">
              <span className={graduation.requirements.wins.met ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                {graduation.requirements.wins.current} / {graduation.requirements.wins.required} Vitórias
              </span>
              <span className="text-[10px] text-slate-500">
                {Math.min(100, Math.round((graduation.requirements.wins.current / Math.max(1, graduation.requirements.wins.required)) * 100))}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${Math.min(100, (graduation.requirements.wins.current / Math.max(1, graduation.requirements.wins.required)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl">
            <span className="text-slate-400 block mb-1">Nível Técnico Médio:</span>
            <div className="flex justify-between items-center mb-1">
              <span className={graduation.requirements.skill.met ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                {graduation.requirements.skill.current} / {graduation.requirements.skill.required} pts
              </span>
              <span className="text-[10px] text-slate-500">
                {Math.min(100, Math.round((graduation.requirements.skill.current / graduation.requirements.skill.required) * 100))}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, (graduation.requirements.skill.current / graduation.requirements.skill.required) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Streamlined Competencies (6 Core Skills) */}
      <div className="bg-zinc-950/85 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="font-title text-base font-black text-slate-100 uppercase tracking-wider">
              COMPETÊNCIAS FUNDAMENTAIS DO ATLETA (6 PILARES)
            </h3>
          </div>

          {athlete.skillPoints > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-emerald-950/80 border border-emerald-500 text-emerald-300">
              {athlete.skillPoints} Pontos de Skill Disponíveis
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coreCompetencies.map((comp) => (
            <div
              key={comp.key}
              className="p-4 rounded-2xl bg-zinc-900/70 border border-white/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-title font-bold text-sm text-slate-100">
                    {comp.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-amber-400">
                      {comp.val}
                    </span>
                    {athlete.skillPoints > 0 && onUpgradeAttribute && (
                      <button
                        onClick={() => onUpgradeAttribute(comp.key)}
                        className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center font-black transition-transform hover:scale-110 shadow"
                        title="Evoluir atributo com 1 SP"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[11px] font-mono text-slate-400 leading-tight">
                  {comp.desc}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mt-3 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, comp.val)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Athlete Profile Modal */}
      {isEditModalOpen && (
        <EditAthleteModal
          athlete={athlete}
          onSave={(updated) => {
            onUpdateAthlete?.(updated);
            setIsEditModalOpen(false);
          }}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};
