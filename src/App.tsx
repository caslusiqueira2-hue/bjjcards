import React, { useState, useEffect } from 'react';
import { Athlete } from './types/athlete';
import { CareerState, Tournament, TournamentMatch } from './types/career';
import { CombatState } from './types/combat';
import { OPPONENT_RIVALS } from './data/rivals';
import { TOURNAMENTS_DATA } from './data/tournaments';
import { CareerEngine } from './engine/careerEngine';
import { MainMenu } from './components/screens/MainMenu';
import { CharacterCreation } from './components/screens/CharacterCreation';
import { CareerDashboard } from './components/screens/CareerDashboard';
import { CombatScreen } from './components/screens/CombatScreen';
import { DailyChampionshipScreen } from './components/screens/DailyChampionshipScreen';
import { RulesGuideModal } from './components/ui/RulesGuideModal';
import { sound } from './audio/soundEffects';
import { getDeterministicAvatar } from './components/career/AthletePortrait';

type Screen = 'MAIN_MENU' | 'CHARACTER_CREATION' | 'CAREER_DASHBOARD' | 'COMBAT' | 'DAILY_CHAMPIONSHIP';

const DEFAULT_PLAYER: Athlete = {
  id: 'player_main',
  name: 'Rodrigo Gracie',
  nickname: 'O Implacável',
  academy: 'Gracie Legacy BJJ',
  belt: 'white',
  stripes: 1,
  weightClass: 'Médio',
  style: 'Passador',
  currentEnergy: 100,
  maxEnergy: 100,
  staminaRecoveryRate: 10,
  reputation: 60,
  fatigue: 0,
  skillPoints: 2,
  trainingWeeks: 4,
  opensDisputed: 2,
  opensWon: 2,
  visual: {
    avatarId: 'avatar_01_cabelo_castanho',
    avatarUrl: '/avatars/01_cabelo_castanho.png',
    giColor: 'white',
    patchStyle: 'classic',
    avatarSeed: 'player',
    beltStripes: 1
  },
  attributes: {
    quedas: 58,
    defesaQuedas: 55,
    passagemGuarda: 64,
    retencaoGuarda: 52,
    raspagens: 48,
    controlePosicional: 60,
    finalizacoes: 52,
    defesaFinalizacoes: 54,
    forca: 62,
    explosao: 56,
    resistencia: 60,
    mobilidade: 54,
    recuperacao: 52,
    leituraAdversario: 50,
    tomadaDecisao: 54,
    disciplinaEstrategica: 55,
    adaptacao: 52,
    experienciaCompetitiva: 42,
    friezaPressao: 46
  },
  careerRecord: {
    matches: 2,
    wins: 2,
    losses: 0,
    submissions: 1,
    titles: [],
    rivalries: {}
  }
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('MAIN_MENU');
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getIsMuted());

  // Player state
  const [player, setPlayer] = useState<Athlete>(() => {
    const saved = localStorage.getItem('bjj_legacy_player');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_PLAYER;
  });

  // Career state
  const [careerState, setCareerState] = useState<CareerState>(() => {
    const saved = localStorage.getItem('bjj_legacy_career');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return CareerEngine.createInitialCareer();
  });

  // Combat match parameters
  const [currentOpponent, setCurrentOpponent] = useState<Athlete>(OPPONENT_RIVALS[0]);
  const [currentMatchRef, setCurrentMatchRef] = useState<{
    tournament?: Tournament;
    match?: TournamentMatch;
    isQuickFight?: boolean;
  }>({});

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('bjj_legacy_player', JSON.stringify(player));
  }, [player]);

  useEffect(() => {
    localStorage.setItem('bjj_legacy_career', JSON.stringify(careerState));
  }, [careerState]);

  // Handle Match Finish
  const handleFinishMatch = (winnerId: string, winMethod: string, finalState: CombatState) => {
    const isPlayerWin = winnerId === player.id;
    const isSubmission = finalState.status === 'SUBMISSION';

    // 1. Update Athlete record and stats
    const updatedPlayer: Athlete = JSON.parse(JSON.stringify(player));
    updatedPlayer.careerRecord.matches += 1;
    if (isPlayerWin) {
      updatedPlayer.careerRecord.wins += 1;
      if (isSubmission) updatedPlayer.careerRecord.submissions += 1;
      updatedPlayer.reputation += 50;
      updatedPlayer.skillPoints += 3;
    } else {
      updatedPlayer.careerRecord.losses += 1;
      updatedPlayer.reputation += 10;
      updatedPlayer.skillPoints += 1;
    }

    // Recover energy after match
    updatedPlayer.currentEnergy = updatedPlayer.maxEnergy;
    updatedPlayer.fatigue = Math.min(100, updatedPlayer.fatigue + 15);

    // 2. If it was a tournament match, update tournament bracket
    if (currentMatchRef.tournament && currentMatchRef.match) {
      const tournId = currentMatchRef.tournament.id;
      const matchId = currentMatchRef.match.id;

      const updatedTournaments = TOURNAMENTS_DATA.map((t) => {
        if (t.id === tournId) {
          const updatedMatches = t.matches.map((m) => {
            if (m.id === matchId) {
              return {
                ...m,
                completed: true,
                won: isPlayerWin,
                scoreSummary: isPlayerWin
                  ? `Vitória (${winMethod})`
                  : `Derrota (${winMethod})`
              };
            }
            return m;
          });

          // Check if this was the final match
          const isFinal = matchId.includes('final');
          const playerRank = isFinal && isPlayerWin ? ('champion' as const) : undefined;
          const isOpen = t.name.toLowerCase().includes('open');

          if (playerRank === 'champion') {
            updatedPlayer.careerRecord.titles.push(t.name);
            updatedPlayer.reputation += t.reputationReward;
          }

          // Track Open tournaments disputed and won
          if (isOpen) {
            if (isFinal && isPlayerWin) {
              updatedPlayer.opensDisputed = (updatedPlayer.opensDisputed || 0) + 1;
              updatedPlayer.opensWon = (updatedPlayer.opensWon || 0) + 1;
            } else if (!isPlayerWin) {
              // Eliminated from Open
              updatedPlayer.opensDisputed = (updatedPlayer.opensDisputed || 0) + 1;
            }
          }

          return { ...t, matches: updatedMatches, playerRank };
        }
        return t;
      });

      // Update current tournament object
      const currentUpdated = updatedTournaments.find((t) => t.id === tournId) || currentMatchRef.tournament;
      setCareerState((prev) => ({
        ...prev,
        activeTournament: currentUpdated
      }));
    }

    setPlayer(updatedPlayer);

    // Return to appropriate screen
    if (currentMatchRef.isQuickFight) {
      setScreen('MAIN_MENU');
    } else {
      setScreen('CAREER_DASHBOARD');
    }
  };

  // Launch quick sparring fight with random real photo avatar
  const handleQuickFight = () => {
    // Pick an opponent matching or slightly above player rank
    const baseRival = OPPONENT_RIVALS.find((r) => r.belt === player.belt) || OPPONENT_RIVALS[0];
    const randAvatar = getDeterministicAvatar(`sparring_${Date.now()}_${Math.random()}`);
    const rival: Athlete = {
      ...baseRival,
      visual: {
        ...baseRival.visual,
        avatarId: randAvatar.avatarId,
        avatarUrl: randAvatar.avatarUrl
      }
    };
    setCurrentOpponent(rival);
    setCurrentMatchRef({ isQuickFight: true });
    setScreen('COMBAT');
  };

  // Launch tournament match from bracket with deterministic real photo avatar
  const handleStartTournamentMatch = (match: TournamentMatch, tournament: Tournament) => {
    // Generate distinct random realistic avatar based on match and opponent
    const avatarInfo = getDeterministicAvatar(match.opponentName || match.id);
    const baseRival = OPPONENT_RIVALS.find((r) => r.id === match.opponentId) || OPPONENT_RIVALS[0];

    const opponent: Athlete = {
      ...baseRival,
      name: match.opponentName,
      belt: match.opponentBelt,
      academy: match.opponentAcademy,
      visual: {
        ...baseRival.visual,
        avatarId: avatarInfo.avatarId,
        avatarUrl: avatarInfo.avatarUrl,
        avatarSeed: match.id
      }
    };

    setCurrentOpponent(opponent);
    setCurrentMatchRef({ tournament, match, isQuickFight: false });
    setScreen('COMBAT');
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 select-none">
      {screen === 'MAIN_MENU' && (
        <MainMenu
          onStartCareer={() => setScreen('CAREER_DASHBOARD')}
          onQuickFight={handleQuickFight}
          onCreateAthlete={() => setScreen('CHARACTER_CREATION')}
          onOpenRules={() => setIsRulesOpen(true)}
          onDailyChampionship={() => setScreen('DAILY_CHAMPIONSHIP')}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
        />
      )}

      {screen === 'DAILY_CHAMPIONSHIP' && (
        <DailyChampionshipScreen
          playerAthlete={player}
          onBackToMainMenu={() => setScreen('MAIN_MENU')}
        />
      )}

      {screen === 'CHARACTER_CREATION' && (
        <CharacterCreation
          onCreate={(newAthlete) => {
            setPlayer(newAthlete);
            setCareerState(CareerEngine.createInitialCareer());
            setScreen('CAREER_DASHBOARD');
          }}
          onCancel={() => setScreen('MAIN_MENU')}
        />
      )}

      {screen === 'CAREER_DASHBOARD' && (
        <CareerDashboard
          athlete={player}
          careerState={careerState}
          onUpdateAthlete={setPlayer}
          onUpdateCareer={setCareerState}
          onStartTournamentMatch={handleStartTournamentMatch}
          onBackToMenu={() => setScreen('MAIN_MENU')}
        />
      )}

      {screen === 'COMBAT' && (
        <CombatScreen
          player={player}
          opponent={currentOpponent}
          onFinishMatch={handleFinishMatch}
          onExit={() => setScreen(currentMatchRef.isQuickFight ? 'MAIN_MENU' : 'CAREER_DASHBOARD')}
        />
      )}

      {/* Rules & Guide Modal */}
      {isRulesOpen && (
        <RulesGuideModal onClose={() => setIsRulesOpen(false)} />
      )}
    </div>
  );
}
