import { describe, it, expect } from 'vitest';
import { CombatEngine } from '../src/engine/combatEngine';
import { AIEngine } from '../src/engine/aiEngine';
import { CareerEngine } from '../src/engine/careerEngine';
import { OPPONENT_RIVALS } from '../src/data/rivals';
import { INITIAL_CARDS } from '../src/data/initialCards';
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
  visual: {
    giColor: 'white',
    patchStyle: 'classic',
    avatarSeed: 'test',
    beltStripes: 2
  },
  attributes: {
    quedas: 60,
    defesaQuedas: 55,
    passagemGuarda: 65,
    retencaoGuarda: 50,
    raspagens: 45,
    controlePosicional: 60,
    finalizacoes: 50,
    defesaFinalizacoes: 55,
    forca: 60,
    explosao: 55,
    resistencia: 60,
    mobilidade: 55,
    recuperacao: 50,
    leituraAdversario: 50,
    tomadaDecisao: 55,
    disciplinaEstrategica: 55,
    adaptacao: 50,
    experienciaCompetitiva: 40,
    friezaPressao: 45
  },
  careerRecord: {
    matches: 0,
    wins: 0,
    losses: 0,
    submissions: 0,
    titles: [],
    rivalries: {}
  }
};

describe('CombatEngine & BJJ Rules', () => {
  it('calculates spatial grid board distance correctly', () => {
    const p1 = { x: 1, y: 2 };
    const p2 = { x: 5, y: 2 };
    expect(CombatEngine.getBoardDistance(p1, p2)).toBe(4);

    const pAdjacent = { x: 2, y: 2 };
    expect(CombatEngine.getBoardDistance(p1, pAdjacent)).toBe(1);
  });

  it('validates card playable rules according to position and energy', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0]);
    
    // In STANDING, a takedown is valid
    const singleLeg = INITIAL_CARDS.find(c => c.id === 'queda_single_leg')!;
    const checkTakedown = CombatEngine.canPlayCard(singleLeg, mockPlayer, match);
    expect(checkTakedown.valid).toBe(true);

    // Movement/setup card is valid
    const moveCard = INITIAL_CARDS.find(c => c.id === 'mov_finta_aproximar')!;
    const checkMove = CombatEngine.canPlayCard(moveCard, mockPlayer, match);
    expect(checkMove.valid).toBe(true);

    // Guard pass in STANDING must be invalid
    const passCard = INITIAL_CARDS.find(c => c.id === 'pass_toreando')!;
    const checkPassInStanding = CombatEngine.canPlayCard(passCard, mockPlayer, match);
    expect(checkPassInStanding.valid).toBe(false);

    // Card with higher cost than athlete energy
    const tiredPlayer = { ...mockPlayer, currentEnergy: 5 };
    const checkNoEnergy = CombatEngine.canPlayCard(moveCard, tiredPlayer, match);
    expect(checkNoEnergy.valid).toBe(false);
    expect(checkNoEnergy.reason).toContain('Energia insuficiente');
  });

  it('resolves takedown, awards 2 IBJJF points and transitions position', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0]);
    // Set them close for the takedown
    match.grid.playerPosition = { x: 2, y: 2 };
    match.grid.opponentPosition = { x: 3, y: 2 };

    const doubleLeg = INITIAL_CARDS.find(c => c.id === 'queda_double_leg')!;
    
    // Force deterministic success (roll = 10, well below success rate)
    const { nextState, nextActor } = CombatEngine.executeAction(
      doubleLeg,
      mockPlayer,
      OPPONENT_RIVALS[0],
      match,
      10
    );

    // In IBJJF, a takedown awards 2 points
    expect(nextState.scores.player.points).toBe(2);
    // Position transitions to OPEN_GUARD
    expect(nextState.technical.position).toBe('OPEN_GUARD');
    expect(nextState.technical.topAthleteId).toBe(mockPlayer.id);
    // Energy was deducted and then recovered by stamina rate
    expect(nextActor.currentEnergy).toBe(mockPlayer.currentEnergy - doubleLeg.energyCost + mockPlayer.staminaRecoveryRate);
    // Clock ticked down by 20s
    expect(nextState.roundTimeSeconds).toBe(340);
    // Turn flipped to opponent
    expect(nextState.currentTurn).toBe('opponent');
  });

  it('resolves submission lock and tapout win condition', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0]);
    match.technical.position = 'BACK_MOUNT';
    match.technical.topAthleteId = mockPlayer.id;
    match.technical.bottomAthleteId = OPPONENT_RIVALS[0].id;

    const rnc = INITIAL_CARDS.find(c => c.id === 'sub_mata_leao')!;
    
    // First attack: locks in 75% depth
    const res1 = CombatEngine.executeAction(
      rnc,
      mockPlayer,
      OPPONENT_RIVALS[0],
      match,
      10
    );

    expect(res1.nextState.technical.activeSubmission).not.toBeNull();
    expect(res1.nextState.status).toBe('IN_PROGRESS');

    // Second attack finishes it past 100% => TAPOUT SUBMISSION
    const res2 = CombatEngine.executeAction(
      rnc,
      res1.nextActor,
      res1.nextTarget,
      res1.nextState,
      10
    );

    expect(res2.nextState.status).toBe('SUBMISSION');
    expect(res2.nextState.winnerId).toBe(mockPlayer.id);
    expect(res2.nextState.winMethod).toContain('Mata-Leão');
  });

  it('AIEngine selects sensible card according to context', () => {
    const match = CombatEngine.createMatch(mockPlayer, OPPONENT_RIVALS[0]);
    match.currentTurn = 'opponent';
    
    const aiCard = AIEngine.selectBestCard(
      INITIAL_CARDS,
      OPPONENT_RIVALS[0],
      mockPlayer,
      match
    );

    expect(aiCard).not.toBeNull();
    // At standing distance, AI should choose movement or range card
    const check = CombatEngine.canPlayCard(aiCard!, OPPONENT_RIVALS[0], match);
    expect(check.valid).toBe(true);
  });

  it('CareerEngine handles training and belt promotions', () => {
    const unpromoted = CareerEngine.evaluateBeltPromotion(mockPlayer);
    expect(unpromoted.canPromote).toBe(false);

    // Experienced athlete with 300 reputation and 4 wins
    const readyPlayer = {
      ...mockPlayer,
      reputation: 300,
      careerRecord: { ...mockPlayer.careerRecord, wins: 4 }
    };

    const promo = CareerEngine.evaluateBeltPromotion(readyPlayer);
    expect(promo.canPromote).toBe(true);
    expect(promo.nextBelt).toBe('blue');

    const blueBeltPlayer = CareerEngine.promoteBelt(readyPlayer, 'blue');
    expect(blueBeltPlayer.belt).toBe('blue');
    expect(blueBeltPlayer.maxEnergy).toBe(mockPlayer.maxEnergy + 10);
  });
});
