import React from 'react';
import { X, Trophy, Shield, Zap, Skull, Award } from 'lucide-react';
import { BeltBadge } from './BeltBadge';

interface RulesGuideModalProps {
  onClose: () => void;
}

export const RulesGuideModal: React.FC<RulesGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-zinc-950 border border-amber-600/40 p-6 shadow-2xl text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-5">
          <Trophy className="w-6 h-6 text-amber-400" />
          <h2 className="font-title text-2xl font-black text-slate-100 tracking-wide uppercase">
            MANUAL DO JOGADOR: JIU-JITSU LEGACY
          </h2>
        </div>

        <div className="space-y-6 text-xs md:text-sm leading-relaxed">
          {/* Section 1 */}
          <div>
            <h3 className="font-title font-bold text-amber-400 text-base uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              1. O Tabuleiro Tático (Arena 7x5)
            </h3>
            <p className="text-slate-300">
              O combate ocorre em uma grade tática de 7 colunas por 5 linhas (35 casas). A posição espacial representa a disputa por distância e aproximação.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400 font-mono text-xs">
              <li><strong>Zona 1 (Distância em Pé):</strong> Exige fintas e aproximação para encurtar.</li>
              <li><strong>Zona 2 (Engajamento / Clinch):</strong> Distância corpo a corpo para quedas (baiana, single leg) e puxadas para guarda.</li>
              <li><strong>Zona 3 (Combate no Solo):</strong> Os atletas disputam guarda, passagens, raspagens, estabilizações e finalizações.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="font-title font-bold text-emerald-400 text-base uppercase tracking-wider mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              2. Regras Oficiais de Pontuação IBJJF
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs mt-2">
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-slate-800">
                <span className="text-emerald-400 font-bold block text-sm">+2 PONTOS</span>
                <span className="text-slate-300">Queda (Takedown)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-slate-800">
                <span className="text-emerald-400 font-bold block text-sm">+2 PONTOS</span>
                <span className="text-slate-300">Raspagem da Guarda</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-slate-800">
                <span className="text-emerald-400 font-bold block text-sm">+3 PONTOS</span>
                <span className="text-slate-300">Passagem de Guarda</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-slate-800">
                <span className="text-emerald-400 font-bold block text-sm">+4 PONTOS</span>
                <span className="text-slate-300">Montada Estabilizada</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-slate-800">
                <span className="text-emerald-400 font-bold block text-sm">+4 PONTOS</span>
                <span className="text-slate-300">Pegada de Costas</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-slate-800">
                <span className="text-amber-400 font-bold block text-sm">VANTAGENS</span>
                <span className="text-slate-300">Quase quedas/finalizações</span>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="font-title font-bold text-purple-400 text-base uppercase tracking-wider mb-2 flex items-center gap-2">
              <Skull className="w-4 h-4 text-purple-500" />
              3. Sistema de Finalização (Tapout!)
            </h3>
            <p className="text-slate-300">
              Diferente de jogos comuns, o Jiu-Jitsu permite vencer a luta a qualquer segundo por submissão. Técnicas como Armlock, Triângulo e Mata-Leão aumentam a pressão do estrangulamento. Ao atingir 100% de profundidade, o adversário dá os 3 tapinhas e a luta é encerrada imediatamente!
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h3 className="font-title font-bold text-amber-400 text-base uppercase tracking-wider mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              4. O Caminho até a Faixa Preta & Mundial
            </h3>
            <p className="text-slate-300">
              Inicie na Faixa Branca na Copa Regional. Treine seus fundamentos no Dojo, acumule vitórias e reputação, receba graus e conquiste a graduação para as faixas Azul, Roxa, Marrom e a lendária Faixa Preta para disputar a Pirâmide de Long Beach no Mundial IBJJF!
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <BeltBadge belt="white" size="sm" />
              <BeltBadge belt="blue" size="sm" />
              <BeltBadge belt="purple" size="sm" />
              <BeltBadge belt="brown" size="sm" />
              <BeltBadge belt="black" size="sm" />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-title font-bold text-xs uppercase tracking-wider shadow"
          >
            Entendido, Oss!
          </button>
        </div>
      </div>
    </div>
  );
};
