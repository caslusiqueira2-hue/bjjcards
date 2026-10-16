import { describe, it, expect } from 'vitest';
import { CombatEngine } from '../src/engine/combatEngine';
import { ClashEngine } from '../src/engine/clashEngine';
import { INITIAL_CARDS } from '../src/data/initialCards';
import { OPPONENT_RIVALS } from '../src/data/rivals';
import { Athlete } from '../src/types/athlete';

const mockPlayer: Athlete = {
  id: 'player_test',
  name: 'Rodrigo Gracie',
  academy: 'Gracie Legacy',
  belt: 'white',
  stripes: 2,
  weightClass: 'Médio',
  style: 'Passador',
  currentEnergy: 100,
  maxEnergy: 100,
  staminaRecoveryRate: 10,
  reputation: 100,
  fatigue: 0,
  skillPoints: 5,
  visual: { giColor: 'white', patchStyle: 'classic', avatarSeed: 'test', beltStripes: 2 },
  attributes: {
    quedas: 60, defesaQuedas: 55, passagemGuarda: 65, retencaoGuarda: 50,
    raspagens: 45, controlePosicional: 60, finalizacoes: 50, defesaFinalizacoes: 55,
    forca: 60, explosao: 55, resistencia: 60, mobilidade: 55, recuperacao: 50,
    leituraAdversario: 50, tomadaDecisao: 55, disciplinaEstrategica: 55, adaptacao: 50,
    experienciaCompetitiva: 40, friezaPressao: 45
  },
  careerRecord: { matches: 0, wins: 0, losses: 0, submissions: 0, titles: [], rivalries: {} }
};

describe('Strict Positional BJJ Rules by Role (Top vs Bottom)', () => {
  it('In CLOSED_GUARD: Bottom athlete has sweeps & submissions; Top passes are rejected', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0]);
    match.technical.position = 'CLOSED_GUARD';
    match.technical.topAthleteId = OPPONENT_RIVALS[0].id;
    match.technical.bottomAthleteId = mockPlayer.id; // Player is on BOTTOM

    const sweepScissor = INITIAL_CARDS.find(c => c.id === 'sweep_tesourinha')!;
    const armbarGuard = INITIAL_CARDS.find(c => c.id === 'sub_armlock_guarda')!;
    const stackPass = INITIAL_CARDS.find(c => c.id === 'pass_emborcada')!;

    // Player on bottom can play sweeps and guard submissions
    const checkSweep = CombatEngine.canPlayCard(sweepScissor, mockPlayer, match);
    expect(checkSweep.valid).toBe(true);

    const checkArmbar = CombatEngine.canPlayCard(armbarGuard, mockPlayer, match);
    expect(checkArmbar.valid).toBe(true);

    // Player on bottom CANNOT play guard passing (requires top role)
    const checkPass = CombatEngine.canPlayCard(stackPass, mockPlayer, match);
    expect(checkPass.valid).toBe(false);
    expect(checkPass.reason).toContain('posição superior');
  });

  it('In CLOSED_GUARD: Top athlete has passes & posture; Sweeps are rejected', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0]);
    match.technical.position = 'CLOSED_GUARD';
    match.technical.topAthleteId = mockPlayer.id; // Player is on TOP
    match.technical.bottomAthleteId = OPPONENT_RIVALS[0].id;

    const stackPass = INITIAL_CARDS.find(c => c.id === 'pass_emborcada')!;
    const postureHigh = INITIAL_CARDS.find(c => c.id === 'def_postura_alta')!;
    const sweepScissor = INITIAL_CARDS.find(c => c.id === 'sweep_tesourinha')!;

    // Player on top can play stack pass and posture
    const checkPass = CombatEngine.canPlayCard(stackPass, mockPlayer, match);
    expect(checkPass.valid).toBe(true);

    const checkPosture = CombatEngine.canPlayCard(postureHigh, mockPlayer, match);
    expect(checkPosture.valid).toBe(true);

    // Player on top CANNOT play sweep (requires bottom role)
    const checkSweep = CombatEngine.canPlayCard(sweepScissor, mockPlayer, match);
    expect(checkSweep.valid).toBe(false);
    expect(checkSweep.reason).toContain('posição inferior');
  });

  it('Clash with Sweep in CLOSED_GUARD awards +2 IBJJF points and reverses roles to MOUNT', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0]);
    match.technical.position = 'CLOSED_GUARD';
    match.technical.topAthleteId = OPPONENT_RIVALS[0].id;
    match.technical.bottomAthleteId = mockPlayer.id; // Player is on bottom

    const sweepScissor = INITIAL_CARDS.find(c => c.id === 'sweep_tesourinha')!;
    const passCard = INITIAL_CARDS.find(c => c.id === 'pass_emborcada')!;

    // In rock-paper-scissors, sweep counters pass (+30 bonus rate)
    const matchup = ClashEngine.getCardMatchupAdvantage(sweepScissor, passCard, 'CLOSED_GUARD');
    expect(matchup.advantageFor).toBe('A');

    const { nextState, resolution } = ClashEngine.resolveClash(
      sweepScissor,
      passCard,
      mockPlayer,
      OPPONENT_RIVALS[0],
      match
    );

    // If player won the clash, verify points, new position, and role reversal
    if (resolution.winner === 'player') {
      expect(nextState.scores.player.points).toBe(2);
      expect(nextState.technical.position).toBe('MOUNT');
      expect(nextState.technical.topAthleteId).toBe(mockPlayer.id); // Player is now on TOP!
      expect(nextState.technical.bottomAthleteId).toBe(OPPONENT_RIVALS[0].id);
      expect(resolution.playerRoleNow).toBe('top');
      expect(resolution.opponentRoleNow).toBe('bottom');
    }
  });

  it('In MOUNT: Bottom athlete can execute Upa (+2 pts reversal) to Closed Guard', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0]);
    match.technical.position = 'MOUNT';
    match.technical.topAthleteId = OPPONENT_RIVALS[0].id;
    match.technical.bottomAthleteId = mockPlayer.id; // Player is mounted (bottom)

    const upaCard = INITIAL_CARDS.find(c => c.id === 'trans_upa_montada')!;
    const checkUpa = CombatEngine.canPlayCard(upaCard, mockPlayer, match);
    expect(checkUpa.valid).toBe(true);
    expect(upaCard.pointsOnSuccess).toBe(2);
    expect(upaCard.targetPositionOnSuccess).toBe('CLOSED_GUARD');
  });
});
