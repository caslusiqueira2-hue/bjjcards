import React, { useState, useEffect } from 'react';
import { Athlete } from '../../types/athlete';
import {
  DailyModeState,
  DailyTournamentMatch,
  DailyTrainingDrill,
  DailyCombatSimState,
  PositionalDeck,
  DailyFighter
} from '../../types/dailyMode';
import {
  DEFAULT_POSITIONAL_DECK,
  INITIAL_UNLOCKED_CARDS,
  generateDailyTournament,
  simulateAiVsAiMatch,
  XP_PER_STRIPE,
  BELT_RANKS,
  BELT_NAMES_PT
} from '../../data/dailyModeData';
import { DailyTrainingGym } from '../daily/DailyTrainingGym';
import { PositionalDeckEditor } from '../daily/PositionalDeckEditor';
import { DailyBracketView } from '../daily/DailyBracketView';
import { DailyCombatArena } from '../daily/DailyCombatArena';
import { BeltBadge } from '../ui/BeltBadge';
import { AthletePortrait } from '../career/AthletePortrait';
import { sound } from '../../audio/soundEffects';
import {
  Trophy,
  Dumbbell,
  Layers,
  ArrowLeft,
  Sparkles,
  Zap,
  Award,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface DailyChampionshipScreenProps {
  playerAthlete: Athlete;
  onBackToMainMenu: () => void;
}

export const DailyChampionshipScreen: React.FC<DailyChampionshipScreenProps> = ({
  playerAthlete,
  onBackToMainMenu
}) => {
  // Convert main athlete to DailyFighter
  const playerFighter: DailyFighter = {
    id: playerAthlete.id,
    name: playerAthlete.name,
    nickname: playerAthlete.nickname,
    academy: playerAthlete.academy,
    belt: playerAthlete.belt,
    stripes: playerAthlete.stripes,
    avatarId: playerAthlete.visual?.avatarId || 'avatar_01_cabelo_castanho',
    avatarUrl: playerAthlete.visual?.avatarUrl,
    giColor: playerAthlete.visual?.giColor === 'royal-blue' ? '#2563eb' : playerAthlete.visual?.giColor === 'black' ? '#18181b' : '#f8fafc',
    overallRating: 65,
    attributes: {
      quedas: playerAthlete.attributes.quedas || 60,
      passagemGuarda: playerAthlete.attributes.passagemGuarda || 60,
      retencaoGuarda: playerAthlete.attributes.retencaoGuarda || 55,
      raspagens: playerAthlete.attributes.raspagens || 55,
      controlePosicional: playerAthlete.attributes.controlePosicional || 62,
      finalizacoes: playerAthlete.attributes.finalizacoes || 58,
      defesaFinalizacoes: playerAthlete.attributes.defesaFinalizacoes || 58,
      resistencia: playerAthlete.attributes.resistencia || 60,
      explosao: playerAthlete.attributes.explosao || 58
    }
  };

  // Daily Mode State
  const [state, setState] = useState<DailyModeState>(() => {
    const saved = localStorage.getItem('bjjcards_daily_mode_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        /* fallback */
      }
    }

    return {
      xp: 120,
      level: 1,
      belt: playerAthlete.belt || 'white',
      stripes: playerAthlete.stripes || 1,
      dailyEnergy: 100,
      maxDailyEnergy: 100,
      trainingsCompletedToday: 0,
      lastTrainingDate: new Date().toISOString().split('T')[0],
      unlockedCardIds: [...INITIAL_UNLOCKED_CARDS],
      deck: { ...DEFAULT_POSITIONAL_DECK },
      trophies: [],
      currentTournament: generateDailyTournament(playerAthlete.belt || 'white', playerFighter),
      tournamentWins: 0,
      tournamentMatchesWon: 0,
      tournamentMatchesLost: 0
    };
  });

  // Active view: 'LOBBY' or 'COMBAT'
  const [activeTab, setActiveTab] = useState<'TRAINING' | 'DECK' | 'TOURNAMENT'>('TOURNAMENT');
  const [activeCombatMatch, setActiveCombatMatch] = useState<DailyTournamentMatch | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('bjjcards_daily_mode_state', JSON.stringify(state));
  }, [state]);

  // XP Progress Calculation
  const xpNeeded = XP_PER_STRIPE[state.belt] || 500;
  const currentStripeXp = state.xp % xpNeeded;
  const xpProgressPercent = Math.min(100, (currentStripeXp / xpNeeded) * 100);

  // Handle Training Execution
  const handleExecuteTraining = (drill: DailyTrainingDrill, newCardId: string) => {
    setState((prev) => {
      const nextXp = prev.xp + drill.xpReward;
      const nextEnergy = Math.max(0, prev.dailyEnergy - drill.energyCost);
      const nextUnlocked = prev.unlockedCardIds.includes(newCardId)
        ? prev.unlockedCardIds
        : [...prev.unlockedCardIds, newCardId];

      // Check for Stripe Promotion
      let newBelt = prev.belt;
      let newStripes = prev.stripes;

      const stripesEarned = Math.floor(nextXp / xpNeeded);
      if (stripesEarned > prev.stripes) {
        if (prev.stripes < 4) {
          newStripes = prev.stripes + 1;
        } else {
          // Belt promotion
          const currentIdx = BELT_RANKS.indexOf(prev.belt);
          if (currentIdx < BELT_RANKS.length - 1) {
            newBelt = BELT_RANKS[currentIdx + 1];
            newStripes = 0;
          }
        }
      }

      return {
        ...prev,
        xp: nextXp,
        belt: newBelt,
        stripes: newStripes,
        dailyEnergy: nextEnergy,
        trainingsCompletedToday: prev.trainingsCompletedToday + 1,
        unlockedCardIds: nextUnlocked
      };
    });
  };

  const handleRestoreDailyEnergy = () => {
    setState((prev) => ({
      ...prev,
      dailyEnergy: prev.maxDailyEnergy
    }));
    sound.playGiGrip();
  };

  const handleUpdateDeck = (newDeck: PositionalDeck) => {
    setState((prev) => ({
      ...prev,
      deck: newDeck
    }));
  };

  const handleStartMatch = (match: DailyTournamentMatch) => {
    setActiveCombatMatch(match);
  };

  const handleResetTournament = () => {
    setState((prev) => ({
      ...prev,
      currentTournament: generateDailyTournament(prev.belt, playerFighter)
    }));
  };

  // Handle Combat Match Finish
  const handleFinishMatch = (
    winnerId: string,
    winMethod: string,
    finalSimState: DailyCombatSimState
  ) => {
    if (!activeCombatMatch) return;

    const isPlayerWinner = winnerId === playerFighter.id;
    const isSubmission = winMethod.includes('Finalização');
    const xpEarned = isPlayerWinner ? (isSubmission ? 200 : 120) : 50;

    setState((prev) => {
      const tournament = { ...prev.currentTournament };
      const matches = tournament.matches.map((m) => {
        if (m.id === activeCombatMatch.id) {
          return {
            ...m,
            completed: true,
            winnerId,
            winMethod,
            scoreA: { ...finalSimState.scores.player },
            scoreB: { ...finalSimState.scores.opponent }
          };
        }
        return m;
      });

      let nextPlayerRank = tournament.playerRank;
      let newTrophies = [...prev.trophies];
      let newTourneyWins = prev.tournamentWins;

      if (!isPlayerWinner) {
        nextPlayerRank = 'eliminated';
      } else {
        // Player won this match!
        if (activeCombatMatch.roundLevel === 1) {
          // Won Quarterfinal -> simulate other QFs and update SF1
          nextPlayerRank = 'semi';
          const qf2 = matches.find((m) => m.id === 'match_qf_2');
          const qf3 = matches.find((m) => m.id === 'match_qf_3');
          const qf4 = matches.find((m) => m.id === 'match_qf_4');

          const simQf2 = qf2 && !qf2.completed ? simulateAiVsAiMatch(qf2) : qf2;
          const simQf3 = qf3 && !qf3.completed ? simulateAiVsAiMatch(qf3) : qf3;
          const simQf4 = qf4 && !qf4.completed ? simulateAiVsAiMatch(qf4) : qf4;

          const sfOpponent = simQf2 ? (simQf2.winnerId === simQf2.fighterA.id ? simQf2.fighterA : simQf2.fighterB) : null;

          // Update SF1 fighterB
          const sf1 = matches.find((m) => m.id === 'match_sf_1');
          if (sf1 && sfOpponent) {
            sf1.fighterB = sfOpponent;
          }
          // Update SF2
          const sf2 = matches.find((m) => m.id === 'match_sf_2');
          const sf2A = simQf3 ? (simQf3.winnerId === simQf3.fighterA.id ? simQf3.fighterA : simQf3.fighterB) : null;
          const sf2B = simQf4 ? (simQf4.winnerId === simQf4.fighterA.id ? simQf4.fighterA : simQf4.fighterB) : null;
          if (sf2 && sf2A && sf2B) {
            sf2.fighterA = sf2A;
            sf2.fighterB = sf2B;
          }
        } else if (activeCombatMatch.roundLevel === 2) {
          // Won Semifinal -> simulate SF2 and update Final
          nextPlayerRank = 'runner_up';
          const sf2 = matches.find((m) => m.id === 'match_sf_2');
          const simSf2 = sf2 && !sf2.completed ? simulateAiVsAiMatch(sf2) : sf2;
          const finalOpponent = simSf2 ? (simSf2.winnerId === simSf2.fighterA.id ? simSf2.fighterA : simSf2.fighterB) : null;

          const finalM = matches.find((m) => m.id === 'match_final');
          if (finalM && finalOpponent) {
            finalM.fighterB = finalOpponent;
          }
        } else if (activeCombatMatch.roundLevel === 3) {
          // Won Final -> CHAMPION!
          nextPlayerRank = 'champion';
          tournament.isCompleted = true;
          newTourneyWins += 1;
          newTrophies.push({
            id: `trophy_${Date.now()}`,
            name: tournament.trophyName,
            date: new Date().toLocaleDateString('pt-BR'),
            tournamentId: tournament.id
          });
        }
      }

      tournament.matches = matches;
      tournament.playerRank = nextPlayerRank;

      return {
        ...prev,
        xp: prev.xp + xpEarned + (nextPlayerRank === 'champion' ? 500 : 0),
        tournamentWins: newTourneyWins,
        tournamentMatchesWon: prev.tournamentMatchesWon + (isPlayerWinner ? 1 : 0),
        tournamentMatchesLost: prev.tournamentMatchesLost + (!isPlayerWinner ? 1 : 0),
        trophies: newTrophies,
        currentTournament: tournament
      };
    });

    setActiveCombatMatch(null);
  };

  // If in combat match, render arena
  if (activeCombatMatch) {
    return (
      <DailyCombatArena
        player={playerFighter}
        opponent={activeCombatMatch.fighterB}
        tournamentName={state.currentTournament.name}
        roundName={activeCombatMatch.roundName}
        deck={state.deck}
        onFinishMatch={handleFinishMatch}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#07080b] text-slate-100 flex flex-col justify-between p-3 sm:p-5 md:p-6 select-none overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* Top Bar: Athlete Header & Back Button */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between border-b border-white/10 pb-4 mb-4 z-10">
        <button
          onClick={onBackToMainMenu}
          className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-slate-800 text-slate-300 hover:text-white font-title text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Voltar ao Menu Principal</span>
        </button>

        {/* Player Profile Snapshot */}
        <div className="flex items-center gap-3">
          <AthletePortrait
            avatarId={playerFighter.avatarId}
            avatarUrl={playerFighter.avatarUrl}
            belt={state.belt}
            stripes={state.stripes}
            size="sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-title text-sm md:text-base font-black text-white">
                {playerFighter.name}
              </span>
              <BeltBadge belt={state.belt} stripes={state.stripes} size="sm" showText={false} />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <span className="text-amber-400 font-bold">{BELT_NAMES_PT[state.belt]}</span>
              <span>•</span>
              <span>{state.xp} XP</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{state.tournamentWins} Troféus Diários</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Prototype Banner */}
      <div className="w-full max-w-5xl mx-auto bg-amber-500/10 border border-amber-500/40 rounded-2xl p-3 mb-5 z-10 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500 text-black font-black">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-400">
              PROTÓTIPO DE NOVO FLUXO • INSPIRAÇÃO 7A0
            </span>
            <h3 className="font-title text-sm md:text-base font-black text-white">
              Treino Diário • Montagem de Deck Posicional • Campeonato da Chave
            </h3>
          </div>
        </div>

        {/* XP Bar towards next stripe */}
        <div className="w-full sm:w-56 bg-black/60 rounded-xl p-2 border border-white/10 text-[10px] font-mono">
          <div className="flex justify-between mb-1 text-slate-300">
            <span>Progresso da Faixa:</span>
            <strong className="text-amber-400">{Math.round(xpProgressPercent)}%</strong>
          </div>
          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${xpProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-center gap-2 mb-6 z-10">
        <button
          onClick={() => setActiveTab('TOURNAMENT')}
          className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-title font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeTab === 'TOURNAMENT'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-[0_0_25px_rgba(245,158,11,0.4)]'
              : 'bg-zinc-900/80 hover:bg-zinc-800 text-slate-400 border border-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>3. Campeonato Diário (Chave)</span>
        </button>

        <button
          onClick={() => setActiveTab('DECK')}
          className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-title font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeTab === 'DECK'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-[0_0_25px_rgba(245,158,11,0.4)]'
              : 'bg-zinc-900/80 hover:bg-zinc-800 text-slate-400 border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Montagem de Deck Posicional</span>
        </button>

        <button
          onClick={() => setActiveTab('TRAINING')}
          className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-title font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeTab === 'TRAINING'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-[0_0_25px_rgba(245,158,11,0.4)]'
              : 'bg-zinc-900/80 hover:bg-zinc-800 text-slate-400 border border-slate-800'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>1. Treino Diário & Obtenção de Cartas</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-full flex-1 z-10 mb-6">
        {activeTab === 'TOURNAMENT' && (
          <DailyBracketView
            tournament={state.currentTournament}
            onStartMatch={handleStartMatch}
            onResetTournament={handleResetTournament}
          />
        )}

        {activeTab === 'DECK' && (
          <PositionalDeckEditor
            deck={state.deck}
            unlockedCardIds={state.unlockedCardIds}
            onUpdateDeck={handleUpdateDeck}
          />
        )}

        {activeTab === 'TRAINING' && (
          <DailyTrainingGym
            dailyEnergy={state.dailyEnergy}
            maxDailyEnergy={state.maxDailyEnergy}
            unlockedCardIds={state.unlockedCardIds}
            trainingsCompletedToday={state.trainingsCompletedToday}
            onExecuteTraining={handleExecuteTraining}
            onRestoreDailyEnergy={handleRestoreDailyEnergy}
          />
        )}
      </div>

      {/* Footer */}
      <div className="w-full max-w-5xl mx-auto border-t border-white/5 pt-3 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 z-10 gap-1">
        <span>BJJCARDS • Protótipo de Campeonatos Diários (Regras IBJJF & Simulação 7a0)</span>
        <span>Treine diariamente, conquiste cartas de técnicas e dispute o ouro!</span>
      </div>
    </div>
  );
};
