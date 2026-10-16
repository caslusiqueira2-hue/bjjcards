import React, { useState } from 'react';
import { Athlete, Belt } from '../../types/athlete';
import { CareerState, Tournament, TournamentMatch, TrainingDrill } from '../../types/career';
import { AthleteProfile } from '../career/AthleteProfile';
import { TrainingGym } from '../career/TrainingGym';
import { TournamentBracket } from '../career/TournamentBracket';
import { TOURNAMENTS_DATA } from '../../data/tournaments';
import { CareerEngine } from '../../engine/careerEngine';
import { BeltBadge } from '../ui/BeltBadge';
import { AthletePortrait } from '../career/AthletePortrait';
import { User, Dumbbell, Trophy, Award, ArrowLeft, Sparkles, Lock, ShieldCheck } from 'lucide-react';
import { sound } from '../../audio/soundEffects';
import confetti from 'canvas-confetti';

interface CareerDashboardProps {
  athlete: Athlete;
  careerState: CareerState;
  onUpdateAthlete: (updated: Athlete) => void;
  onUpdateCareer: (updated: CareerState) => void;
  onStartTournamentMatch: (match: TournamentMatch, tournament: Tournament) => void;
  onBackToMenu: () => void;
}

export const CareerDashboard: React.FC<CareerDashboardProps> = ({
  athlete,
  careerState,
  onUpdateAthlete,
  onUpdateCareer,
  onStartTournamentMatch,
  onBackToMenu
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'training' | 'tournaments' | 'trophies'>('profile');
  const [selectedFederationFilter, setSelectedFederationFilter] = useState<'ALL' | 'CBJJA' | 'CBJJP'>('ALL');
  const [selectedTournament, setSelectedTournament] = useState<Tournament>(() => {
    return TOURNAMENTS_DATA.find((t) => t.requiredBelt === athlete.belt) || TOURNAMENTS_DATA[0];
  });
  const [celebrationBanner, setCelebrationBanner] = useState<string | null>(null);

  // Check graduation progress (4 divisas and belt promotion)
  const grad = CareerEngine.evaluateGraduation(athlete);

  const handleGraduationAction = () => {
    if (grad.canPromoteBelt && grad.nextBelt) {
      const promoted = CareerEngine.promoteBelt(athlete, grad.nextBelt);
      onUpdateAthlete(promoted);
      sound.playVictoryChime();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      setCelebrationBanner(`PARABÉNS! Você foi promovido com honras para a FAIXA ${promoted.belt.toUpperCase()}! (+15 EN, +250 Reputação)`);
    } else if (grad.canEarnStripe) {
      const striped = CareerEngine.awardStripe(athlete);
      onUpdateAthlete(striped);
      sound.playVictoryChime();
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
      setCelebrationBanner(`PARABÉNS! O Mestre concedeu o seu ${striped.stripes}º Grau (Divisa) na Faixa ${striped.belt.toUpperCase()}! (+5 EN)`);
    }
  };

  const handleTrainDrill = (drill: TrainingDrill) => {
    const { updatedAthlete, updatedCareer, message } = CareerEngine.executeTraining(athlete, drill, careerState);
    onUpdateAthlete(updatedAthlete);
    onUpdateCareer(updatedCareer);
  };

  const handleUpgradeAttribute = (attrKey: string) => {
    if (athlete.skillPoints <= 0) return;
    const updated: Athlete = JSON.parse(JSON.stringify(athlete));
    const attrs = updated.attributes as unknown as Record<string, number>;
    if (typeof attrs[attrKey] === 'number') {
      attrs[attrKey] = Math.min(99, attrs[attrKey] + 1);
      updated.skillPoints -= 1;
      onUpdateAthlete(updated);
      sound.playPointBell(2);
    }
  };

  // Evaluate tournament unlock criteria strictly based on federation and belt
  const updatedTournaments = CareerEngine.updateTournamentUnlocks(TOURNAMENTS_DATA, athlete);

  const filteredTournaments = updatedTournaments.filter((t) => {
    if (selectedFederationFilter === 'ALL') return true;
    return t.federation === selectedFederationFilter;
  });

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 flex flex-col p-4 md:p-6 overflow-x-hidden">
      {/* Top Header Bar */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Menu Principal</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <AthletePortrait
              avatarId={athlete.visual.avatarId}
              avatarUrl={athlete.visual?.avatarUrl}
              belt={athlete.belt}
              stripes={athlete.stripes}
              size="xs"
            />
            <span className="font-title text-base font-black text-slate-200 uppercase hidden sm:inline">
              {athlete.name}
            </span>
          </div>
          <BeltBadge belt={athlete.belt} stripes={athlete.stripes} size="sm" />
        </div>
      </div>

      {/* Graduation Ready Action Banner */}
      {(grad.canEarnStripe || grad.canPromoteBelt) && (
        <div className="w-full max-w-5xl mx-auto mb-6 p-4 rounded-3xl bg-gradient-to-r from-amber-500/20 via-amber-600/30 to-amber-500/20 border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-amber-400 animate-spin flex-shrink-0" />
            <div>
              <h4 className="font-title text-base md:text-lg font-black text-amber-300 uppercase tracking-wide">
                {grad.canPromoteBelt ? 'CERIMÔNIA DE TROCA DE FAIXA DISPONÍVEL!' : `CERIMÔNIA DE GRAU: ${grad.nextStripe}ª DIVISA DISPONÍVEL!`}
              </h4>
              <p className="text-xs text-slate-200 mt-0.5 font-mono">{grad.feedback}</p>
            </div>
          </div>

          <button
            onClick={handleGraduationAction}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-black font-title font-black text-xs md:text-sm uppercase tracking-wider shadow-xl hover:scale-105 transition-transform"
          >
            {grad.canPromoteBelt ? 'Receber Nova Faixa!' : `Receber ${grad.nextStripe}ª Divisa!`}
          </button>
        </div>
      )}

      {/* Celebration Alert */}
      {celebrationBanner && (
        <div className="w-full max-w-5xl mx-auto mb-6 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs font-mono text-center flex items-center justify-between">
          <span>{celebrationBanner}</span>
          <button onClick={() => setCelebrationBanner(null)} className="text-emerald-400 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="w-full max-w-5xl mx-auto mb-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-title font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-amber-500 text-black shadow-lg scale-105 font-black'
              : 'bg-zinc-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Perfil & Graduação</span>
        </button>

        <button
          onClick={() => setActiveTab('training')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-title font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'training'
              ? 'bg-amber-500 text-black shadow-lg scale-105 font-black'
              : 'bg-zinc-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Dojo & Camps Semanais</span>
        </button>

        <button
          onClick={() => setActiveTab('tournaments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-title font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'tournaments'
              ? 'bg-amber-500 text-black shadow-lg scale-105 font-black'
              : 'bg-zinc-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Campeonatos (CBJJA & CBJJP)</span>
        </button>

        <button
          onClick={() => setActiveTab('trophies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-title font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'trophies'
              ? 'bg-amber-500 text-black shadow-lg scale-105 font-black'
              : 'bg-zinc-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Galeria de Troféus ({athlete.careerRecord.titles.length})</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="w-full max-w-5xl mx-auto flex-1">
        {activeTab === 'profile' && (
          <AthleteProfile
            athlete={athlete}
            onUpgradeAttribute={handleUpgradeAttribute}
            onGraduationAction={handleGraduationAction}
          />
        )}

        {activeTab === 'training' && (
          <TrainingGym
            athlete={athlete}
            careerState={careerState}
            onTrain={handleTrainDrill}
          />
        )}

        {activeTab === 'tournaments' && (
          <div className="space-y-6">
            {/* Federation Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-slate-400 font-bold mr-1">Filtrar Federação:</span>
                <button
                  onClick={() => setSelectedFederationFilter('ALL')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    selectedFederationFilter === 'ALL'
                      ? 'bg-amber-500 text-black'
                      : 'bg-zinc-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setSelectedFederationFilter('CBJJA')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    selectedFederationFilter === 'CBJJA'
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  CBJJA (Amador)
                </button>
                <button
                  onClick={() => setSelectedFederationFilter('CBJJP')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    selectedFederationFilter === 'CBJJP'
                      ? 'bg-amber-600 text-white'
                      : 'bg-zinc-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  CBJJP (Profissional)
                </button>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Opens Disputados: <strong className="text-slate-200">{athlete.opensDisputed || 0}</strong> • Vencidos com Ouro: <strong className="text-amber-400">{athlete.opensWon || 0}</strong>
              </div>
            </div>

            {/* Tournament Selector Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {filteredTournaments.map((t) => {
                const isSelected = selectedTournament.id === t.id;

                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTournament(t)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-zinc-950 border-amber-500 ring-2 ring-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : t.isUnlocked
                        ? 'bg-zinc-900/80 border-slate-800 hover:border-slate-700'
                        : 'bg-zinc-950/40 border-slate-800/40 opacity-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-black ${
                          t.federation === 'CBJJA' ? 'bg-blue-950 text-blue-300 border border-blue-700' : 'bg-amber-950 text-amber-300 border border-amber-700'
                        }`}>
                          {t.federation}
                        </span>
                        {!t.isUnlocked && <Lock className="w-3 h-3 text-red-400" />}
                      </div>

                      <span className="font-title font-bold text-xs text-slate-100 line-clamp-1">
                        {t.name}
                      </span>
                    </div>

                    <div className="mt-2 text-[10px] font-mono">
                      {t.isUnlocked ? (
                        <span className="text-emerald-400 font-bold">Livre para Lutar</span>
                      ) : (
                        <span className="text-red-400 font-bold">Bloqueado</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Tournament Bracket View */}
            <TournamentBracket
              tournament={selectedTournament}
              athlete={athlete}
              onStartMatch={(match) => onStartTournamentMatch(match, selectedTournament)}
            />
          </div>
        )}

        {activeTab === 'trophies' && (
          <div className="bg-zinc-950/85 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="font-title text-xl font-black text-amber-400 uppercase tracking-wider border-b border-white/10 pb-3">
              MURAL DE CONQUISTAS & MEDALHAS
            </h3>

            {athlete.careerRecord.titles.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
                <Trophy className="w-12 h-12 text-slate-600 mb-2" />
                <p className="font-title text-base font-bold text-slate-300">
                  Nenhum título conquistado ainda.
                </p>
                <p className="text-xs font-mono text-slate-500 mt-1">
                  Dispute os Opens da CBJJA para conquistar sua primeira medalha de ouro!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {athlete.careerRecord.titles.map((title, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/30 to-black border border-amber-500/40 flex items-center gap-3 shadow-md"
                  >
                    <Trophy className="w-8 h-8 text-amber-400 flex-shrink-0" />
                    <div>
                      <span className="font-title font-bold text-sm text-slate-100 block">
                        {title}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400">
                        Campeão Oficial
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
