import { describe, it, expect } from 'vitest';
import { ClashEngine } from '../src/engine/clashEngine';
import { CombatEngine } from '../src/engine/combatEngine';
import { INITIAL_CARDS } from '../src/data/initialCards';
import { OPPONENT_RIVALS } from '../src/data/rivals';
import { Athlete } from '../src/types/athlete';

const mockPlayer: Athlete = {
  id: 'player_test',
  name: 'Rodrigo Gracie',
  academy: 'Gracie Legacy',
  belt: 'white',
  stripes: 1,
  weightClass: 'Médio',
  style: 'Passador',
  currentEnergy: 100,
  maxEnergy: 100,
  staminaRecoveryRate: 10,
  reputation: 100,
  fatigue: 0,
  skillPoints: 5,
  visual: { giColor: 'white', patchStyle: 'classic', avatarSeed: 'test', beltStripes: 1 },
  attributes: {
    quedas: 60, defesaQuedas: 55, passagemGuarda: 65, retencaoGuarda: 50,
    raspagens: 45, controlePosicional: 60, finalizacoes: 50, defesaFinalizacoes: 55,
    forca: 60, explosao: 55, resistencia: 60, mobilidade: 55, recuperacao: 50,
    leituraAdversario: 50, tomadaDecisao: 55, disciplinaEstrategica: 55, adaptacao: 50,
    experienciaCompetitiva: 40, friezaPressao: 45
  },
  careerRecord: { matches: 0, wins: 0, losses: 0, submissions: 0, titles: [], rivalries: {} }
};

describe('ClashEngine Card Duel Situational Counters', () => {
  it('Sprawl defense counters Takedowns with bonus', () => {
    const doubleLeg = INITIAL_CARDS.find((c) => c.id === 'queda_double_leg')!;
    const sprawlDef = {
      ...INITIAL_CARDS[0],
      id: 'def_sprawl',
      category: 'DEFESA_QUEDA' as const
    };

    const matchup = ClashEngine.getCardMatchupAdvantage(doubleLeg, sprawlDef, 'STANDING');
    expect(matchup.advantageFor).toBe('B'); // Sprawl wins matchup
    expect(matchup.bonusRate).toBeGreaterThanOrEqual(30);
  });

  it('Sweeps counter aggressive Guard Passes with bonus', () => {
    const passKneeSlice = INITIAL_CARDS.find((c) => c.id === 'pass_knee_slice')!;
    const sweepScissor = INITIAL_CARDS.find((c) => c.id === 'sweep_tesourinha')!;

    const matchup = ClashEngine.getCardMatchupAdvantage(passKneeSlice, sweepScissor, 'CLOSED_GUARD');
    expect(matchup.advantageFor).toBe('B'); // Sweep counters forward pass
    expect(matchup.bonusRate).toBe(30);
  });

  it('Resolves simultaneous clash and awards points to winner', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0]);
    const takedown = INITIAL_CARDS.find((c) => c.id === 'queda_double_leg')!;
    const finta = INITIAL_CARDS.find((c) => c.id === 'mov_finta_aproximar')!;

    const { nextState, resolution } = ClashEngine.resolveClash(
      takedown,
      finta,
      mockPlayer,
      OPPONENT_RIVALS[0],
      match
    );

    expect(resolution).toBeDefined();
    expect(resolution.winner).toBeDefined();
    expect(nextState.actionLogs.length).toBeGreaterThan(1);
  });

  it('Finishes fight when timer reaches 00:00 (roundTimeSeconds <= 0) and declares winner by points/decision', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0], 10); // 10 seconds left
    match.scores.player.points = 4;
    match.scores.opponent.points = 2;

    const takedown = INITIAL_CARDS.find((c) => c.id === 'queda_double_leg')!;
    const finta = INITIAL_CARDS.find((c) => c.id === 'mov_finta_aproximar')!;

    const { nextState } = ClashEngine.resolveClash(
      takedown,
      finta,
      mockPlayer,
      OPPONENT_RIVALS[0],
      match
    );

    // Timer reduced by 20s, hitting 0
    expect(nextState.roundTimeSeconds).toBe(0);
    // Match must no longer be IN_PROGRESS
    expect(nextState.status).toBe('POINTS');
    expect(nextState.winnerId).toBe(mockPlayer.id);
    expect(nextState.winMethod).toContain('Pontos');
  });

  it('Applies opponent initiative bonus and logs initiative note when player hesitates/stalls', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0]);
    const takedown = INITIAL_CARDS.find((c) => c.id === 'queda_double_leg')!;
    const finta = INITIAL_CARDS.find((c) => c.id === 'mov_finta_aproximar')!;

    const { resolution } = ClashEngine.resolveClash(
      finta,
      takedown,
      mockPlayer,
      OPPONENT_RIVALS[0],
      match,
      { opponentInitiated: true, playerStalled: true }
    );

    expect(resolution).toBeDefined();
    expect(resolution.description).toContain('INICIATIVA DO ADVERSÁRIO');
  });
});
