import { describe, it, expect } from 'vitest';
import { DailyCombatEngine } from '../src/engine/dailyCombatEngine';
import { DEFAULT_POSITIONAL_DECK, DAILY_RIVALS_POOL } from '../src/data/dailyModeData';
import { DailyFighter } from '../src/types/dailyMode';

const mockPlayer: DailyFighter = {
  id: 'player_test',
  name: 'Rodrigo Teste',
  academy: 'Gracie Legacy',
  belt: 'white',
  stripes: 2,
  avatarId: 'avatar_01_cabelo_castanho',
  giColor: '#ffffff',
  overallRating: 65,
  attributes: {
    quedas: 65,
    passagemGuarda: 65,
    retencaoGuarda: 60,
    raspagens: 60,
    controlePosicional: 65,
    finalizacoes: 60,
    defesaFinalizacoes: 60,
    resistencia: 65,
    explosao: 65
  }
};

const mockOpponent = DAILY_RIVALS_POOL[0];

describe('DailyCombatEngine (7a0 Inspired BJJ Combat)', () => {
  it('should initialize a match with 6:00 clock, STANDING position and 0-0 score', () => {
    const match = DailyCombatEngine.initMatch(
      'match_test_1',
      'Copa Diária',
      'Quartas de Final',
      mockPlayer,
      mockOpponent
    );

    expect(match.roundTimeSeconds).toBe(360);
    expect(match.currentPosition).toBe('STANDING');
    expect(match.scores.player.points).toBe(0);
    expect(match.scores.opponent.points).toBe(0);
    expect(match.playerStamina).toBe(100);
    expect(match.status).toBe('IN_PROGRESS');
    expect(match.logs.length).toBeGreaterThan(0);
  });

  it('should advance time when ATACAR is selected and generate detailed play-by-play logs', () => {
    const match = DailyCombatEngine.initMatch(
      'match_test_2',
      'Copa Diária',
      'Quartas de Final',
      mockPlayer,
      mockOpponent
    );

    const nextMatch = DailyCombatEngine.advanceTimeStep(
      match,
      'ATACAR',
      DEFAULT_POSITIONAL_DECK
    );

    expect(nextMatch.roundTimeSeconds).toBeLessThan(360);
    expect(nextMatch.logs.length).toBeGreaterThan(match.logs.length);
    expect(nextMatch.currentDecision).toBe('ATACAR');
  });

  it('should recover stamina when CADENCIAR is selected', () => {
    const match = DailyCombatEngine.initMatch(
      'match_test_3',
      'Copa Diária',
      'Quartas de Final',
      mockPlayer,
      mockOpponent
    );

    match.playerStamina = 50;
    const nextMatch = DailyCombatEngine.advanceTimeStep(
      match,
      'CADENCIAR',
      DEFAULT_POSITIONAL_DECK
    );

    expect(nextMatch.playerStamina).toBeGreaterThan(50);
  });

  it('should penalize repeated AMARRAR with referee stalling penalties', () => {
    let match = DailyCombatEngine.initMatch(
      'match_test_4',
      'Copa Diária',
      'Quartas de Final',
      mockPlayer,
      mockOpponent
    );

    // Amarra 3 vezes consecutivas
    match = DailyCombatEngine.advanceTimeStep(match, 'AMARRAR', DEFAULT_POSITIONAL_DECK);
    match = DailyCombatEngine.advanceTimeStep(match, 'AMARRAR', DEFAULT_POSITIONAL_DECK);
    match = DailyCombatEngine.advanceTimeStep(match, 'AMARRAR', DEFAULT_POSITIONAL_DECK);

    expect(match.playerConsecutiveStalls).toBe(3);
    expect(match.scores.player.penalties).toBeGreaterThanOrEqual(1);
    expect(match.scores.opponent.advantages).toBeGreaterThanOrEqual(1);
  });
});
