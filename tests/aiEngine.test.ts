import { describe, it, expect } from 'vitest';
import { AIEngine } from '../src/engine/aiEngine';
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

describe('AIEngine Adaptive & Balanced Logic', () => {
  it('AI chooses an advance or takedown card when standing', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0]);
    match.currentTurn = 'opponent';

    const card = AIEngine.selectBestCard(INITIAL_CARDS, OPPONENT_RIVALS[0], mockPlayer, match);
    expect(card).not.toBeNull();
    // In standing position at distance 4, it should pick an advance or movement card
    expect(['MOVIMENTO', 'QUEDA', 'CONTROLE']).toContain(card?.category);
  });

  it('AI strictly prioritizes defense when in submission danger', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0]);
    match.currentTurn = 'opponent';
    match.technical.position = 'CLOSED_GUARD';
    match.technical.topAthleteId = OPPONENT_RIVALS[0].id;
    match.technical.bottomAthleteId = mockPlayer.id;

    // Simulate player locking an armbar
    match.technical.activeSubmission = {
      techniqueId: 'sub_armlock_guarda',
      techniqueName: 'Armlock da Guarda',
      attackerId: mockPlayer.id,
      defenderId: OPPONENT_RIVALS[0].id,
      lockDepth: 60,
      escapeChance: 40,
      turnsActive: 1
    };

    const card = AIEngine.selectBestCard(INITIAL_CARDS, OPPONENT_RIVALS[0], mockPlayer, match);
    expect(card).not.toBeNull();
    // Must select a defense card
    expect(card?.category).toBe('DEFESA_FINALIZACAO');
  });

  it('AI adapts when trailing behind on points by prioritizing scoring moves', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0]);
    match.currentTurn = 'opponent';
    match.scores.player.points = 6;
    match.scores.opponent.points = 0; // AI is losing 0-6

    // Put them in close clinch
    match.grid.playerPosition = { x: 2, y: 2 };
    match.grid.opponentPosition = { x: 3, y: 2 };

    const card = AIEngine.selectBestCard(INITIAL_CARDS, OPPONENT_RIVALS[0], mockPlayer, match);
    expect(card).not.toBeNull();
    // Must look for points (takedown +2 pts)
    expect(card?.pointsOnSuccess).toBeGreaterThanOrEqual(2);
  });

  it('AI never gets stuck even if energy is critically low (uses breathing/recovery)', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0]);
    match.currentTurn = 'opponent';

    const exhaustedOpponent = {
      ...OPPONENT_RIVALS[0],
      currentEnergy: 2 // Cannot afford normal 15-35 energy cards
    };

    const card = AIEngine.selectBestCard(INITIAL_CARDS, exhaustedOpponent, mockPlayer, match);
    expect(card).not.toBeNull();
    expect(card?.id).toBe('rec_respiracao_base');
  });
});
