import React, { useState } from 'react';
import { PositionalDeck } from '../../types/dailyMode';
import { INITIAL_CARDS } from '../../data/initialCards';
import { CombatCard } from '../../types/cards';
import { CardArtwork } from '../combat/CardArtwork';
import {
  Shield,
  Zap,
  Flame,
  RotateCcw,
  Footprints,
  Crosshair,
  Lock,
  Layers,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface PositionalDeckEditorProps {
  deck: PositionalDeck;
  unlockedCardIds: string[];
  onUpdateDeck: (newDeck: PositionalDeck) => void;
}

const CARD_MAP: Record<string, CombatCard> = {};
INITIAL_CARDS.forEach((c) => {
  CARD_MAP[c.id] = c;
});

interface SlotConfig {
  key: keyof PositionalDeck;
  label: string;
  categoryName: string;
  description: string;
  icon: React.ReactNode;
  filterFn: (card: CombatCard) => boolean;
}

const SLOTS_CONFIG: SlotConfig[] = [
  {
    key: 'standing',
    label: '1. Em Pé (Quedas & Puxadas)',
    categoryName: 'QUEDA / PUXADA',
    description: 'Técnica inicial para ditar o ritmo em pé e buscar os primeiros 2 pontos ou puxar para a guarda.',
    icon: <Footprints className="w-5 h-5 text-amber-400" />,
    filterFn: (c) => c.category === 'QUEDA' || c.category === 'PUXADA' || c.validPositions.includes('STANDING')
  },
  {
    key: 'guardPass',
    label: '2. Passagem de Guarda',
    categoryName: 'PASSAGEM',
    description: 'Técnica ativa quando você estiver por cima na guarda do rival para amassar e pontuar +3.',
    icon: <Zap className="w-5 h-5 text-blue-400" />,
    filterFn: (c) => c.category === 'PASSAGEM'
  },
  {
    key: 'guardBottom',
    label: '3. Guarda Fechada / Aberta',
    categoryName: 'RASPAGEM / FINALIZAÇÃO',
    description: 'Técnica ativa quando você estiver por baixo para raspar (+2 pts) ou finalizar da guarda.',
    icon: <RotateCcw className="w-5 h-5 text-emerald-400" />,
    filterFn: (c) => c.category === 'RASPAGEM' || (c.category === 'FINALIZACAO' && c.requiredRole === 'bottom')
  },
  {
    key: 'halfGuard',
    label: '4. Meia Guarda (Esgrima & Raspagem)',
    categoryName: 'MEIA GUARDA',
    description: 'Técnica na meia guarda para esgrimar, raspar na profunda ou passar amassando.',
    icon: <Layers className="w-5 h-5 text-purple-400" />,
    filterFn: (c) => c.validPositions.includes('HALF_GUARD')
  },
  {
    key: 'sideMount',
    label: '5. Controle Lateral (100kg) & Montada',
    categoryName: 'DOMÍNIO & FINALIZAÇÃO',
    description: 'Técnica após passar para estabilizar a montada (+4 pts) ou arrochar uma finalização do topo.',
    icon: <Flame className="w-5 h-5 text-rose-400" />,
    filterFn: (c) => c.category === 'FINALIZACAO' || c.id === 'trans_montada' || c.category === 'CONTROLE'
  },
  {
    key: 'backControl',
    label: '6. Pegada de Costas (Back Mount)',
    categoryName: 'FINALIZAÇÃO DAS COSTAS',
    description: 'Técnica letal com os ganchos cravados nas costas para estrangular no mata-leão ou arco e flecha.',
    icon: <Crosshair className="w-5 h-5 text-amber-500" />,
    filterFn: (c) => c.validPositions.includes('BACK_MOUNT') || c.category === 'FINALIZACAO'
  },
  {
    key: 'defenseEscape',
    label: '7. Defesas, Fugas & Sobrevivência',
    categoryName: 'DEFESA & ESCAPES',
    description: 'Técnica defensiva para sair do sufoco: fuga de quadril, ponte/upa ou reposição de guarda.',
    icon: <Shield className="w-5 h-5 text-cyan-400" />,
    filterFn: (c) => c.category === 'RETENCAO' || c.category === 'DEFESA_FINALIZACAO' || c.category === 'MOVIMENTO' || c.id.startsWith('def_') || c.id.startsWith('trans_upa')
  }
];

export const PositionalDeckEditor: React.FC<PositionalDeckEditorProps> = ({
  deck,
  unlockedCardIds,
  onUpdateDeck
}) => {
  const [activeSlot, setActiveSlot] = useState<SlotConfig | null>(null);

  const handleSelectCard = (slotKey: keyof PositionalDeck, cardId: string) => {
    onUpdateDeck({
      ...deck,
      [slotKey]: cardId
    });
    setActiveSlot(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#13151f] to-zinc-950 border border-amber-500/30 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ESTRATÉGIA POSICIONAL PRÉ-LUTA</span>
          </div>
          <h2 className="font-title text-2xl md:text-3xl font-black text-slate-100 tracking-wide mt-1">
            Conjunto de Técnicas por Posição
          </h2>
          <p className="text-xs md:text-sm font-mono text-slate-400 max-w-xl mt-1 leading-relaxed">
            Selecione qual técnica titular seu atleta executará em cada situação do combate. Essas cartas serão ativadas durante a simulação conforme você comanda <strong>ATACAR</strong>, <strong>AMARRAR</strong> ou <strong>CADENCIAR</strong>!
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
          <span>{unlockedCardIds.length} Cartas na Coleção</span>
        </div>
      </div>

      {/* Grid of 7 Positional Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SLOTS_CONFIG.map((slot) => {
          const cardId = deck[slot.key];
          const card = CARD_MAP[cardId] || CARD_MAP['queda_double_leg'];

          return (
            <div
              key={slot.key}
              className="bg-zinc-950/90 border border-white/10 hover:border-amber-500/50 rounded-2xl p-4 shadow-xl transition-all flex flex-col justify-between"
            >
              {/* Slot Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-black border border-white/10">
                    {slot.icon}
                  </div>
                  <div>
                    <h3 className="font-title text-sm md:text-base font-black text-slate-100 uppercase tracking-wide">
                      {slot.label}
                    </h3>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                      {slot.categoryName}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSlot(slot)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-title font-black text-xs uppercase tracking-wider transition-colors shadow"
                >
                  Trocar
                </button>
              </div>

              {/* Equipped Card Card Component */}
              <div className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-xl p-3">
                <div className="w-14 h-14 rounded-lg bg-zinc-900 border border-white/10 overflow-hidden flex-shrink-0">
                  <CardArtwork
                    category={card.category}
                    cardId={card.id}
                    isSubmission={card.isSubmission}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-title text-xs md:text-sm font-black text-white truncate">
                      {card.name}
                    </span>
                    {card.pointsOnSuccess && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/90 text-black text-[9px] font-mono font-black">
                        +{card.pointsOnSuccess} PTS
                      </span>
                    )}
                    {card.isSubmission && (
                      <span className="px-1.5 py-0.2 rounded bg-purple-600 text-white text-[8px] font-mono font-black animate-pulse">
                        FINALIZAÇÃO
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-2 leading-tight">
                    {card.description}
                  </p>
                </div>
              </div>

              <p className="text-[10px] font-mono text-slate-500 mt-2">
                {slot.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Card Selection Modal */}
      {activeSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-zinc-950 border-2 border-amber-500/60 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  ESCOLHA A TÉCNICA TITULAR
                </span>
                <h3 className="font-title text-xl font-black text-white uppercase">
                  {activeSlot.label}
                </h3>
              </div>
              <button
                onClick={() => setActiveSlot(null)}
                className="px-3 py-1 rounded-xl bg-zinc-800 text-slate-300 hover:text-white font-mono text-xs"
              >
                Fechar
              </button>
            </div>

            {/* List of cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1">
              {INITIAL_CARDS.filter(
                (c) => unlockedCardIds.includes(c.id) && activeSlot.filterFn(c)
              ).map((card) => {
                const isCurrent = deck[activeSlot.key] === card.id;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelectCard(activeSlot.key, card.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isCurrent
                        ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-zinc-900/80 border-white/10 hover:border-amber-500/40 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-black border border-white/10 overflow-hidden flex-shrink-0">
                      <CardArtwork
                        category={card.category}
                        cardId={card.id}
                        isSubmission={card.isSubmission}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-title text-xs font-bold text-white truncate">
                          {card.name}
                        </span>
                        {isCurrent && (
                          <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-amber-300 font-bold block">
                        {card.pointsOnSuccess ? `+${card.pointsOnSuccess} PTS` : card.isSubmission ? 'FINALIZAR' : card.category}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
