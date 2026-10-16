import React, { useState } from 'react';
import { DAILY_TRAINING_DRILLS } from '../../data/dailyModeData';
import { DailyTrainingDrill } from '../../types/dailyMode';
import { INITIAL_CARDS } from '../../data/initialCards';
import { CombatCard } from '../../types/cards';
import { CardArtwork } from '../combat/CardArtwork';
import { sound } from '../../audio/soundEffects';
import {
  Zap,
  Dumbbell,
  Trophy,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Gift
} from 'lucide-react';

interface DailyTrainingGymProps {
  dailyEnergy: number;
  maxDailyEnergy: number;
  unlockedCardIds: string[];
  trainingsCompletedToday: number;
  onExecuteTraining: (drill: DailyTrainingDrill, newCardId: string) => void;
  onRestoreDailyEnergy: () => void;
}

const CARD_DICT: Record<string, CombatCard> = {};
INITIAL_CARDS.forEach((c) => {
  CARD_DICT[c.id] = c;
});

export const DailyTrainingGym: React.FC<DailyTrainingGymProps> = ({
  dailyEnergy,
  maxDailyEnergy,
  unlockedCardIds,
  trainingsCompletedToday,
  onExecuteTraining,
  onRestoreDailyEnergy
}) => {
  const [rewardModal, setRewardModal] = useState<{
    drill: DailyTrainingDrill;
    card: CombatCard;
  } | null>(null);

  const handleTrain = (drill: DailyTrainingDrill) => {
    if (dailyEnergy < drill.energyCost) {
      sound.playMatThud();
      alert('Energia diária insuficiente! Descanse ou restaure sua energia para continuar treinando.');
      return;
    }

    // Pick a card from reward pool (preferably one not yet unlocked)
    const availablePool = drill.rewardCardIds.map((id) => CARD_DICT[id]).filter(Boolean);
    const lockedCards = availablePool.filter((c) => !unlockedCardIds.includes(c.id));
    const cardToReward = lockedCards.length > 0
      ? lockedCards[Math.floor(Math.random() * lockedCards.length)]
      : availablePool[Math.floor(Math.random() * availablePool.length)] || CARD_DICT['queda_double_leg'];

    sound.playWhistle();
    onExecuteTraining(drill, cardToReward.id);

    setRewardModal({
      drill,
      card: cardToReward
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Gym Top Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#18121a] to-zinc-950 border border-amber-500/30 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
            <Dumbbell className="w-4 h-4 text-amber-400" />
            <span>CENTRO DE TREINAMENTO DIÁRIO • BJJ CARDS</span>
          </div>
          <h2 className="font-title text-2xl md:text-3xl font-black text-slate-100 tracking-wide mt-1">
            Treinos Diários & Conquista de Cartas
          </h2>
          <p className="text-xs md:text-sm font-mono text-slate-400 max-w-xl mt-1 leading-relaxed">
            Afie suas técnicas diariamente. Cada treino concluído concede <strong>XP</strong>, bônus de atributos e <strong>novas cartas de técnicas</strong> para equipar no seu conjunto de luta!
          </p>
        </div>

        {/* Energy Meter & Recharge */}
        <div className="flex flex-col items-end gap-2 bg-black/60 border border-white/10 rounded-2xl p-3.5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-title font-bold text-xs text-slate-200">
              ENERGIA DIÁRIA:
            </span>
            <span className="font-mono text-sm font-black text-amber-400">
              {dailyEnergy} / {maxDailyEnergy}
            </span>
          </div>

          <div className="w-36 h-2 bg-zinc-900 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
              style={{ width: `${Math.min(100, (dailyEnergy / maxDailyEnergy) * 100)}%` }}
            />
          </div>

          {dailyEnergy < 25 && (
            <button
              onClick={onRestoreDailyEnergy}
              className="mt-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-title text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Restaurar Energia</span>
            </button>
          )}
        </div>
      </div>

      {/* List of Drills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DAILY_TRAINING_DRILLS.map((drill) => {
          const hasEnergy = dailyEnergy >= drill.energyCost;

          return (
            <div
              key={drill.id}
              className="bg-zinc-950/90 border border-white/10 hover:border-amber-500/50 rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-400">
                    {drill.category.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300 font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{drill.energyCost} EN</span>
                  </div>
                </div>

                <h3 className="font-title text-base font-black text-slate-100 group-hover:text-amber-300 transition-colors">
                  {drill.title}
                </h3>

                <p className="text-xs font-mono text-slate-400 mt-1 leading-relaxed">
                  {drill.description}
                </p>

                {/* Reward preview */}
                <div className="mt-3 p-2 rounded-xl bg-black/60 border border-white/10 text-[10px] font-mono space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Recompensa de XP:</span>
                    <strong className="text-emerald-400">+{drill.xpReward} XP</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Recompensa de Carta:</span>
                    <strong className="text-amber-300 flex items-center gap-1">
                      <Gift className="w-3 h-3" /> 1 Carta de Técnica
                    </strong>
                  </div>
                </div>

                <p className="text-[10px] font-mono italic text-slate-500 mt-2">
                  "{drill.coachAdvice}"
                </p>
              </div>

              <button
                onClick={() => handleTrain(drill)}
                disabled={!hasEnergy}
                className={`mt-4 w-full py-2.5 px-4 rounded-xl font-title font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 ${
                  hasEnergy
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95'
                    : 'bg-zinc-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <Dumbbell className="w-4 h-4" />
                <span>{hasEnergy ? 'Treinar & Obter Carta' : 'Energia Insuficiente'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Reward Card Reveal Modal */}
      {rewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-zinc-950 via-[#10131d] to-zinc-950 border-2 border-amber-500 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.5)] flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-400">
                TREINO CONCLUÍDO COM SUCESSO!
              </span>
              <h3 className="font-title text-2xl font-black text-white uppercase mt-0.5">
                Nova Técnica Conquistada
              </h3>
              <p className="text-xs font-mono text-emerald-400 font-bold mt-1">
                +{rewardModal.drill.xpReward} XP Adicionados ao Atleta
              </p>
            </div>

            {/* Revealed Card */}
            <div className="w-48 h-64 rounded-2xl bg-black border-2 border-amber-400/80 p-3 flex flex-col justify-between shadow-[0_0_25px_rgba(245,158,11,0.4)] transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-300">
                <span>{rewardModal.card.category}</span>
                <span>{rewardModal.card.energyCost} EN</span>
              </div>

              <div className="w-full h-28 rounded-lg overflow-hidden border border-white/10 my-1">
                <CardArtwork
                  category={rewardModal.card.category}
                  cardId={rewardModal.card.id}
                  isSubmission={rewardModal.card.isSubmission}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-title text-sm font-black text-white leading-tight">
                  {rewardModal.card.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono mt-1 line-clamp-2">
                  {rewardModal.card.description}
                </p>
              </div>
            </div>

            <p className="text-[11px] font-mono text-slate-400 max-w-xs">
              Esta carta agora faz parte da sua coleção e já pode ser equipada para os Campeonatos Diários!
            </p>

            <button
              onClick={() => setRewardModal(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-title font-black text-xs uppercase tracking-wider shadow-lg"
            >
              Guardar Carta na Coleção
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
