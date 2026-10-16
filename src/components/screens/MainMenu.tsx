import React from 'react';
import { Trophy, Swords, UserPlus, BookOpen, Volume2, VolumeX, Shield, Sparkles } from 'lucide-react';
import { BeltBadge } from '../ui/BeltBadge';
import { sound } from '../../audio/soundEffects';

interface MainMenuProps {
  onStartCareer: () => void;
  onQuickFight: () => void;
  onCreateAthlete: () => void;
  onOpenRules: () => void;
  onDailyChampionship: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartCareer,
  onQuickFight,
  onCreateAthlete,
  onOpenRules,
  onDailyChampionship,
  isMuted,
  onToggleSound
}) => {
  return (
    <div className="relative min-h-screen bg-[#07080b] text-slate-100 flex flex-col justify-between p-6 overflow-hidden">
      {/* Background Ambience: Tatame vinyl mesh & golden spotlight glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.18),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#00000008,#00000008_10px,#ffffff03_10px,#ffffff03_20px)] pointer-events-none" />

      {/* Top Bar with Audio & Version */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <BeltBadge belt="black" stripes={4} size="sm" showText={false} />
          <span className="font-mono text-[11px] text-amber-500/90 tracking-widest font-bold">
            BJJCARDS • TACTICAL ENGINE v1.0
          </span>
        </div>

        <button
          onClick={onToggleSound}
          className="p-2 rounded-xl bg-zinc-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
          title={isMuted ? 'Ativar Efeitos Sonoros' : 'Mutar Som'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Central Hero Brand */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center my-auto py-4 z-10">
        {/* Official BJJCARDS Logo */}
        <div className="relative mb-3 flex items-center justify-center group">
          <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full pointer-events-none transform group-hover:scale-110 transition-transform duration-500" />
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/30 shadow-[0_0_50px_rgba(37,99,235,0.3)] bg-zinc-950 max-w-[280px] sm:max-w-[320px] md:max-w-[360px] transform hover:scale-[1.02] transition-transform duration-300">
            <img
              src="/images/bjjcards_logo.jpg"
              alt="BJJCARDS - O Jogo de Cartas de Jiu-Jitsu"
              className="w-full h-auto object-cover block select-none pointer-events-none"
            />
          </div>
        </div>

        {/* Subtitle & Tagline */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-500/60" />
          <span className="font-title text-xs md:text-sm font-black tracking-widest text-amber-400 uppercase">
            BJJCARDS • TACTICAL CARD COMBAT
          </span>
          <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-500/60" />
        </div>

        <p className="mt-2 font-mono text-xs md:text-sm text-slate-300 tracking-wide max-w-xl leading-relaxed">
          O Duelo Tático Definitivo da Arte Suave: cartas posicionais, regras oficiais IBJJF e jornada de graduação até a Faixa Preta.
        </p>

        {/* Main Action Buttons */}
        <div className="mt-8 w-full max-w-md flex flex-col gap-3.5">
          {/* NEW PROTOTYPE BUTTON: MODO CAMPEONATO DIÁRIO (7A0) */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />
            <button
              onClick={() => {
                sound.playWhistle();
                onDailyChampionship();
              }}
              className="relative w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-title font-black text-base sm:text-lg uppercase tracking-wider shadow-[0_0_35px_rgba(245,158,11,0.6)] transition-all transform hover:scale-[1.02] flex items-center justify-between border-2 border-white/60"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-black flex-shrink-0" />
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="leading-tight">Campeonato Diário</span>
                    <span className="px-2 py-0.5 rounded-full bg-black text-amber-300 text-[10px] font-mono font-black uppercase tracking-normal">
                      NOVO PROTÓTIPO
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-950 block">
                    Treino Diário • Deck Posicional • Chave 7a0
                  </span>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-black flex-shrink-0" />
            </button>
          </div>

          <button
            onClick={() => {
              sound.playWhistle();
              onStartCareer();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-slate-700 hover:border-amber-500/60 text-slate-100 font-title font-bold text-base uppercase tracking-wider shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-3"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Modo Carreira Clássico</span>
          </button>

          <button
            onClick={() => {
              sound.playGiGrip();
              onQuickFight();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-slate-700 hover:border-amber-500/60 text-slate-100 font-title font-bold text-base uppercase tracking-wider shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-3"
          >
            <Swords className="w-5 h-5 text-amber-400" />
            <span>Luta Rápida (Sparring Tático)</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onCreateAthlete}
              className="py-3 px-4 rounded-xl bg-zinc-900/70 hover:bg-zinc-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-title font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-blue-400" />
              <span>Criar Atleta</span>
            </button>

            <button
              onClick={onOpenRules}
              className="py-3 px-4 rounded-xl bg-zinc-900/70 hover:bg-zinc-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-title font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Regras & Guia</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 border-t border-white/5 pt-4 z-10 gap-2">
        <span>© 2026 BJJCARDS. Todos os direitos reservados.</span>
        <span>Regras Oficiais de Pontuação da Federação Internacional de Jiu-Jitsu (IBJJF)</span>
      </div>
    </div>
  );
};
