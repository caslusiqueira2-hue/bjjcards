import { describe, it, expect } from 'vitest';
import { CareerEngine } from '../src/engine/careerEngine';
import { Athlete } from '../src/types/athlete';
import { TOURNAMENTS_DATA } from '../src/data/tournaments';
import { TRAINING_DRILLS } from '../src/data/trainingData';

const createMockAthlete = (overrides?: Partial<Athlete>): Athlete => ({
  id: 'test_athlete',
  name: 'Bernardo Faria',
  nickname: 'O Leão',
  academy: 'Alliance',
  belt: 'white',
  stripes: 0,
  weightClass: 'Médio',
  style: 'Passador',
  currentEnergy: 100,
  maxEnergy: 100,
  staminaRecoveryRate: 10,
  reputation: 50,
  fatigue: 0,
  skillPoints: 0,
  trainingWeeks: 0,
  opensDisputed: 0,
  opensWon: 0,
  visual: {
    avatarId: 'avatar_pitbull',
    giColor: 'white',
    patchStyle: 'classic',
    avatarSeed: 'test',
    beltStripes: 0
  },
  attributes: {
    quedas: 50,
    defesaQuedas: 50,
    passagemGuarda: 50,
    retencaoGuarda: 50,
    raspagens: 50,
    controlePosicional: 50,
    finalizacoes: 50,
    defesaFinalizacoes: 50,
    forca: 50,
    explosao: 50,
    resistencia: 50,
    mobilidade: 50,
    recuperacao: 50,
    leituraAdversario: 50,
    tomadaDecisao: 50,
    disciplinaEstrategica: 50,
    adaptacao: 50,
    experienciaCompetitiva: 50,
    friezaPressao: 50
  },
  careerRecord: {
    matches: 0,
    wins: 0,
    losses: 0,
    submissions: 0,
    titles: [],
    rivalries: {}
  },
  ...overrides
});

describe('CareerEngine - Graduation & 4 Divisas Progression', () => {
  it('correctly calculates average skill across core competencies', () => {
    const athlete = createMockAthlete();
    const avg = CareerEngine.calculateAverageSkill(athlete);
    expect(avg).toBe(50);
  });

  it('prevents graduation to stripe 1 if requirements are unmet', () => {
    const athlete = createMockAthlete({
      belt: 'white',
      stripes: 0,
      trainingWeeks: 2, // Needs 4
      careerRecord: { matches: 1, wins: 0, losses: 1, submissions: 0, titles: [], rivalries: {} } // Needs 1
    });

    const grad = CareerEngine.evaluateGraduation(athlete);
    expect(grad.canEarnStripe).toBe(false);
    expect(grad.canPromoteBelt).toBe(false);
    expect(grad.requirements.weeks.met).toBe(false);
    expect(grad.requirements.wins.met).toBe(false);
  });

  it('allows awarding 1st stripe when mat time, wins, and skills meet white belt criteria', () => {
    const athlete = createMockAthlete({
      belt: 'white',
      stripes: 0,
      trainingWeeks: 4,
      careerRecord: { matches: 2, wins: 2, losses: 0, submissions: 1, titles: [], rivalries: {} }
    });

    const grad = CareerEngine.evaluateGraduation(athlete);
    expect(grad.canEarnStripe).toBe(true);
    expect(grad.nextStripe).toBe(1);

    const upgraded = CareerEngine.awardStripe(athlete);
    expect(upgraded.stripes).toBe(1);
    expect(upgraded.visual.beltStripes).toBe(1);
    expect(upgraded.maxEnergy).toBe(105);
  });

  it('progresses through stripes 1, 2, 3, 4 before unlocking belt promotion', () => {
    // Athlete at 3 stripes with sufficient mat time and skill
    const athleteStripe3 = createMockAthlete({
      belt: 'white',
      stripes: 3,
      trainingWeeks: 16,
      careerRecord: { matches: 8, wins: 8, losses: 0, submissions: 4, titles: [], rivalries: {} },
      attributes: {
        ...createMockAthlete().attributes,
        passagemGuarda: 60,
        quedas: 60,
        controlePosicional: 60,
        forca: 60,
        resistencia: 60
      }
    });

    const grad3 = CareerEngine.evaluateGraduation(athleteStripe3);
    expect(grad3.canEarnStripe).toBe(true);
    expect(grad3.nextStripe).toBe(4);
    expect(grad3.canPromoteBelt).toBe(false);

    // After 4th stripe awarded, now at 4 stripes
    const athleteStripe4 = createMockAthlete({
      belt: 'white',
      stripes: 4,
      trainingWeeks: 22, // Meets >= 20
      careerRecord: { matches: 12, wins: 11, losses: 1, submissions: 6, titles: [], rivalries: {} }, // Meets >= 5
      attributes: {
        ...createMockAthlete().attributes,
        passagemGuarda: 65,
        quedas: 62,
        controlePosicional: 64,
        forca: 62,
        resistencia: 62
      }
    });

    const grad4 = CareerEngine.evaluateGraduation(athleteStripe4);
    expect(grad4.canEarnStripe).toBe(false);
    expect(grad4.canPromoteBelt).toBe(true);
    expect(grad4.nextBelt).toBe('blue');

    const promoted = CareerEngine.promoteBelt(athleteStripe4, 'blue');
    expect(promoted.belt).toBe('blue');
    expect(promoted.stripes).toBe(0);
    expect(promoted.maxEnergy).toBe(athleteStripe4.maxEnergy + 10);
  });
});

describe('CareerEngine - Training Camps & Energy', () => {
  it('executes camp drill deducting energy, adding weeks and fatigue, and gaining skills', () => {
    const athlete = createMockAthlete({ currentEnergy: 100, maxEnergy: 100, trainingWeeks: 0, fatigue: 0 });
    const initialCareer = CareerEngine.createInitialCareer();
    const drill = TRAINING_DRILLS[0]; // Camp de Quedas & Wrestling

    const { updatedAthlete, updatedCareer } = CareerEngine.executeTraining(athlete, drill, initialCareer);

    expect(updatedAthlete.currentEnergy).toBeLessThan(100);
    expect(updatedAthlete.trainingWeeks).toBe(drill.timeCostWeeks);
    expect(updatedCareer.currentWeek).toBe(1 + drill.timeCostWeeks);
    expect(updatedAthlete.fatigue).toBe(drill.fatigueDelta);
    expect(updatedAthlete.attributes.quedas).toBeGreaterThan(athlete.attributes.quedas);
  });
});

describe('CareerEngine - Tournament Hierarchy & Federations', () => {
  it('restricts White Belt strictly to CBJJA (Amateur) Opens and locks CBJJP', () => {
    const whiteBelt = createMockAthlete({ belt: 'white', opensDisputed: 1, opensWon: 1 });
    const unlocked = CareerEngine.updateTournamentUnlocks(TOURNAMENTS_DATA, whiteBelt);

    // CBJJA Opens should be unlocked
    const cbjjaCuritiba = unlocked.find((t) => t.id === 'cbjja_curitiba_open');
    expect(cbjjaCuritiba?.isUnlocked).toBe(true);

    // CBJJP Tournaments must NOT be unlocked for white belt
    const cbjjpRio = unlocked.find((t) => t.id === 'cbjjp_rio_pro');
    expect(cbjjpRio?.isUnlocked).toBe(false);
  });

  it('locks Brasileiro CBJJA for White Belt unless athlete won ALL disputed opens (min 3)', () => {
    // Only 2 opens won
    const athlete2Wins = createMockAthlete({ belt: 'white', opensDisputed: 2, opensWon: 2 });
    let unlocked = CareerEngine.updateTournamentUnlocks(TOURNAMENTS_DATA, athlete2Wins);
    let brasileiro = unlocked.find((t) => t.id === 'cbjja_brasileiro');
    expect(brasileiro?.isUnlocked).toBe(false);

    // 3 opens disputed but only 2 won (lost one)
    const athleteLostOne = createMockAthlete({ belt: 'white', opensDisputed: 3, opensWon: 2 });
    unlocked = CareerEngine.updateTournamentUnlocks(TOURNAMENTS_DATA, athleteLostOne);
    brasileiro = unlocked.find((t) => t.id === 'cbjja_brasileiro');
    expect(brasileiro?.isUnlocked).toBe(false);

    // 3 opens disputed AND won all 3
    const athleteWonAll = createMockAthlete({ belt: 'white', opensDisputed: 3, opensWon: 3 });
    unlocked = CareerEngine.updateTournamentUnlocks(TOURNAMENTS_DATA, athleteWonAll);
    brasileiro = unlocked.find((t) => t.id === 'cbjja_brasileiro');
    expect(brasileiro?.isUnlocked).toBe(true);
  });

  it('allows Blue Belt into CBJJP Opens and Brasileiro Azul', () => {
    const blueBelt = createMockAthlete({ belt: 'blue' });
    const unlocked = CareerEngine.updateTournamentUnlocks(TOURNAMENTS_DATA, blueBelt);

    const cbjjpRio = unlocked.find((t) => t.id === 'cbjjp_rio_pro');
    const cbjjpBrasileiroAzul = unlocked.find((t) => t.id === 'cbjjp_brasileiro_azul');
    expect(cbjjpRio?.isUnlocked).toBe(true);
    expect(cbjjpBrasileiroAzul?.isUnlocked).toBe(true);

    // White belt amateur tourney should not be available
    const cbjjaBrasileiro = unlocked.find((t) => t.id === 'cbjja_brasileiro');
    expect(cbjjaBrasileiro?.isUnlocked).toBe(false);
  });

  it('locks Brasileiro CBJJP for Purple Belt until winning 3 Opens', () => {
    const purpleBeltWith2Wins = createMockAthlete({ belt: 'purple', opensWon: 2 });
    let unlocked = CareerEngine.updateTournamentUnlocks(TOURNAMENTS_DATA, purpleBeltWith2Wins);
    let brasileiroRoxa = unlocked.find((t) => t.id === 'cbjjp_brasileiro_roxa');
    expect(brasileiroRoxa?.isUnlocked).toBe(false);

    const purpleBeltWith3Wins = createMockAthlete({ belt: 'purple', opensWon: 3 });
    unlocked = CareerEngine.updateTournamentUnlocks(TOURNAMENTS_DATA, purpleBeltWith3Wins);
    brasileiroRoxa = unlocked.find((t) => t.id === 'cbjjp_brasileiro_roxa');
    expect(brasileiroRoxa?.isUnlocked).toBe(true);
  });

  it('allows Brown and Black Belts to dispute Grand Slam circuit: Opens, Brasileiro, Europeu, and Mundial', () => {
    const brownBelt = createMockAthlete({ belt: 'brown' });
    let unlocked = CareerEngine.updateTournamentUnlocks(TOURNAMENTS_DATA, brownBelt);

    expect(unlocked.find((t) => t.id === 'cbjjp_europeu_marrom')?.isUnlocked).toBe(true);
    expect(unlocked.find((t) => t.id === 'cbjjp_mundial_marrom')?.isUnlocked).toBe(true);

    const blackBelt = createMockAthlete({ belt: 'black' });
    unlocked = CareerEngine.updateTournamentUnlocks(TOURNAMENTS_DATA, blackBelt);

    expect(unlocked.find((t) => t.id === 'cbjjp_brasileiro_preta')?.isUnlocked).toBe(true);
    expect(unlocked.find((t) => t.id === 'cbjjp_europeu_preta')?.isUnlocked).toBe(true);
    expect(unlocked.find((t) => t.id === 'cbjjp_mundial_preta')?.isUnlocked).toBe(true);
  });
});
