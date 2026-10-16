import React, { useState, useMemo } from 'react';
import { CombatCard } from '../../types/cards';
import { Athlete } from '../../types/athlete';
import { CombatState } from '../../types/combat';
import { CardComponent } from './CardComponent';
import { CombatEngine } from '../../engine/combatEngine';
import { getPositionNamePt } from '../../engine/bjjRules';
import { Zap, Filter, Wind, Shield, Swords, Sparkles } from 'lucide-react';

interface CardHandProps {
  cards: CombatCard[];
  player: Athlete;
  combatState: CombatState;
  selectedCard: CombatCard | null;
  onSelectCard: (card: CombatCard) => void;
  onPlayCard: (card: CombatCard) => void;
  isPlayerTurn: boolean;
}

export const CardHand: React.FC<CardHandProps> = ({
  cards,
  player,
  combatState,
  selectedCard,
  onSelectCard,
  onPlayCard,
  isPlayerTurn
}) => {
  // Default filter to CURRENT_POSITION so only position-legal cards are shown first!
  const [activeFilter, setActiveFilter] = useState<string>('CURRENT_POSITION');

  const { technical } = combatState;
  const isStanding = technical.position === 'STANDING' || technical.position === 'CLINCH';
  const isPlayerTop = technical.topAthleteId === player.id;
  const isPlayerBottom = technical.bottomAthleteId === player.id;

  const playerRole = isStanding ? 'standing' : isPlayerTop ? 'top' : 'bottom';

  // Role Banner Text & Style
  const roleInfo = useMemo(() => {
    if (isStanding) {
      return {
        badge: '⚪ LUTA EM PÉ',
        badgeClass: 'bg-zinc-800 text-slate-200 border-slate-600',
        text: 'Disputa de pegadas, quedas (+2 pts), fintas e puxadas para guarda.',
        roleName: 'Em Pé'
      };
    }
    if (isPlayerTop) {
      return {
        badge: '🟠 VOCÊ ESTÁ POR CIMA (PASSADOR / TOPO)',
        badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
        text: technical.position === 'CLOSED_GUARD' || technical.position === 'OPEN_GUARD' || technical.position === 'HALF_GUARD'
          ? 'Mão ativa com passagens de guarda (+3 pts), postura alta e defesas de raspagem.'
          : 'Mão ativa com avanços de montada/costas (+4 pts), estabilização e finalizações.',
        roleName: 'Por Cima (Passador)'
      };
    }
    return {
      badge: '🔵 VOCÊ ESTÁ POR BAIXO (GUARDEIRO / FUNDO)',
      badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.25)]',
      text: technical.position === 'CLOSED_GUARD' || technical.position === 'OPEN_GUARD' || technical.position === 'HALF_GUARD'
        ? 'Mão ativa com raspagens (+2 pts), finalizações da guarda (armlock, triângulo) e retenção.'
        : 'Mão ativa com pontes/upas (+2 pts reversão), fuga de cotovelo/quadril e defesa.',
      roleName: 'Por Baixo (Guardeiro)'
    };
  }, [isStanding, isPlayerTop, technical.position]);

  // Context-aware filter tabs
  const filterTabs = useMemo(() => {
    const base = [
      { label: '⚡ Na Posição Atual', value: 'CURRENT_POSITION' }
    ];

    if (isStanding) {
      base.push(
        { label: 'Quedas (+2)', value: 'QUEDA' },
        { label: 'Puxadas', value: 'PUXADA' },
        { label: 'Defesa de Sprawl', value: 'DEFESA_QUEDA' },
        { label: 'Fintas & Postura', value: 'MOVIMENTO' }
      );
    } else if (isPlayerTop) {
      base.push(
        { label: 'Passagens (+3)', value: 'PASSAGEM' },
        { label: 'Avanços (+4)', value: 'TRANSICAO' },
        { label: 'Defesa de Raspagem / Postura', value: 'DEFESA_FINALIZACAO' },
        { label: 'Finalizações', value: 'FINALIZACAO' }
      );
    } else {
      // Bottom
      base.push(
        { label: 'Raspagens (+2/+4)', value: 'RASPAGEM' },
        { label: 'Finalizações', value: 'FINALIZACAO' },
        { label: 'Defesa de Passagem / Escapes', value: 'RETENCAO' },
        { label: 'Defesa de Finalização', value: 'DEFESA_FINALIZACAO' }
      );
    }

    base.push({ label: 'Todas as Cartas', value: 'ALL' });
    return base;
  }, [isStanding, isPlayerTop]);

  // Filter cards based on selection
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // 1. Current position filter: cards that match position AND role
      if (activeFilter === 'CURRENT_POSITION') {
        const matchesPosition = card.validPositions.includes(technical.position);
        if (!matchesPosition) return false;

        if (card.requiredRole === 'any') return true;
        if (card.requiredRole === 'top' && isPlayerTop) return true;
        if (card.requiredRole === 'bottom' && isPlayerBottom) return true;
        return false;
      }

      if (activeFilter === 'ALL') return true;

      if (activeFilter === 'RASPAGEM') {
        return card.category === 'RASPAGEM';
      }
      if (activeFilter === 'PASSAGEM') {
        return card.category === 'PASSAGEM';
      }
      if (activeFilter === 'RETENCAO') {
        return card.category === 'RETENCAO';
      }
      if (activeFilter === 'TRANSICAO') {
        return card.category === 'TRANSICAO';
      }
      if (activeFilter === 'FINALIZACAO') {
        return card.category === 'FINALIZACAO';
      }
      if (activeFilter === 'DEFESA_FINALIZACAO') {
        return card.category === 'DEFESA_FINALIZACAO';
      }
      if (activeFilter === 'MOVIMENTO') {
        return card.category === 'MOVIMENTO' || card.category === 'CONTROLE' || card.id === 'rec_respiracao_base';
      }

      return card.category === activeFilter;
    });
  }, [cards, activeFilter, technical.position, isPlayerTop, isPlayerBottom]);

  const recoveryCard = cards.find((c) => c.id === 'rec_respiracao_base');

  return (
    <div className="w-full max-w-4xl mx-auto mt-2 bg-gradient-to-t from-black via-zinc-950/95 to-zinc-900/90 border-t-2 border-amber-500/50 rounded-t-3xl p-2 sm:p-3 md:p-4 shadow-2xl backdrop-blur-md">
      {/* 1. Tactical Role & Position Clarity Banner */}
      <div className="hidden sm:flex sm:flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-900/80 border border-white/10 rounded-2xl p-2 px-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full font-title text-[11px] md:text-xs font-black uppercase tracking-wider border ${roleInfo.badgeClass}`}>
            {roleInfo.badge}
          </span>
          <span className="text-[11px] font-mono text-slate-300 hidden md:inline">
            Posição: <strong className="text-amber-300">{getPositionNamePt(technical.position)}</strong>
          </span>
        </div>

        <div className="text-[11px] font-mono text-slate-300">
          {roleInfo.text}
        </div>
      </div>

      {/* 2. Hand Header: Energy Meter, Quick Recovery Action & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-2">
        {/* Player Energy Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-amber-400 font-title font-bold text-xs">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">ENERGIA:</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-28 md:w-40 h-3 bg-zinc-900 rounded-full border border-slate-700 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (player.currentEnergy / player.maxEnergy) * 100)}%`
                }}
              />
            </div>
            <span className="font-mono text-xs font-black text-slate-200">
              {Math.round(player.currentEnergy)} / {player.maxEnergy}
            </span>
          </div>
        </div>

        {/* Quick Recovery Button */}
        {recoveryCard && isPlayerTurn && (
          <button
            onClick={() => onPlayCard(recoveryCard)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-slate-600 text-slate-200 font-mono text-[11px] font-bold transition-colors shadow"
            title="Recupera 25 pontos de energia e ajusta a postura"
          >
            <Wind className="w-3.5 h-3.5 text-blue-400" />
            <span>Respirar & Postura (+25 EN)</span>
          </button>
        )}

        {/* Contextual Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1 flex-shrink-0" />
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] md:text-[11px] font-title font-bold whitespace-nowrap transition-all ${
                activeFilter === tab.value
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'bg-zinc-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Cards Scrollable Carousel */}
      <div className="flex items-center gap-3 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-amber-600/40">
        {filteredCards.length === 0 ? (
          <div className="w-full py-6 text-center text-xs font-mono text-slate-400 bg-zinc-900/50 rounded-2xl border border-dashed border-white/10">
            Nenhuma carta encontrada nesta categoria para sua posição atual. Mude o filtro para "⚡ Na Posição Atual" ou "Todas as Cartas".
          </div>
        ) : (
          filteredCards.map((card) => {
            const check = isPlayerTurn
              ? CombatEngine.canPlayCard(card, player, combatState)
              : { valid: false, reason: 'Aguarde o turno do adversário.' };

            let successRate = CombatEngine.calculateSuccessRate(
              card,
              player,
              { attributes: player.attributes } as Athlete
            );

            // Add bonus if tactical setup is active
            if (combatState.tacticalAdvantage === 'player') {
              successRate = Math.min(95, successRate + 15);
            }

            const isSelected = selectedCard?.id === card.id;

            return (
              <div key={card.id} className="flex-shrink-0">
                <CardComponent
                  card={card}
                  isSelected={isSelected}
                  isValid={check.valid}
                  invalidReason={check.reason}
                  estimatedSuccessRate={check.valid ? successRate : undefined}
                  onSelect={() => onSelectCard(card)}
                  onPlay={() => onPlayCard(card)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
