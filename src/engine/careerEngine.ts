import { Athlete, Belt } from '../types/athlete';
import { TrainingDrill, Tournament, CareerState } from '../types/career';
import { TOURNAMENTS_DATA } from '../data/tournaments';

export interface StripeProgress {
  canEarnStripe: boolean;
  canPromoteBelt: boolean;
  currentBelt: Belt;
  currentStripes: number; // 0 to 4
  nextStripe: number;
  nextBelt?: Belt;
  progressPercent: number;
  requirements: {
    weeks: { current: number; required: number; met: boolean };
    wins: { current: number; required: number; met: boolean };
    skill: { current: number; required: number; met: boolean };
  };
  feedback: string;
}

export class CareerEngine {
  /**
   * Calculates the average of the 6 core streamlined BJJ attributes
   */
  public static calculateAverageSkill(athlete: Athlete): number {
    const a = athlete.attributes;
    const coreStats = [
      a.quedas,
      a.passagemGuarda,
      a.retencaoGuarda,
      a.raspagens,
      a.finalizacoes,
      a.controlePosicional,
      a.forca,
      a.resistencia
    ];
    const sum = coreStats.reduce((acc, val) => acc + (val || 50), 0);
    return Math.round(sum / coreStats.length);
  }

  /**
   * Evaluates graduation progression: 4 divisas (stripes) per belt until Black Belt
   */
  public static evaluateGraduation(athlete: Athlete): StripeProgress {
    const currentBelt = athlete.belt;
    const currentStripes = athlete.stripes || 0;
    const weeks = athlete.trainingWeeks || 0;
    const wins = athlete.careerRecord?.wins || 0;
    const avgSkill = this.calculateAverageSkill(athlete);

    const nextBeltMap: Record<Belt, Belt | undefined> = {
      white: 'blue',
      blue: 'purple',
      purple: 'brown',
      brown: 'black',
      black: undefined
    };

    if (currentBelt === 'black') {
      return {
        canEarnStripe: false,
        canPromoteBelt: false,
        currentBelt,
        currentStripes: 4,
        nextStripe: 4,
        progressPercent: 100,
        requirements: {
          weeks: { current: weeks, required: 100, met: true },
          wins: { current: wins, required: 50, met: true },
          skill: { current: avgSkill, required: 90, met: true }
        },
        feedback: 'Você alcançou a graduação máxima de Faixa Preta de Jiu-Jitsu. Seu nome está cravado na história!'
      };
    }

    // Requirements per belt and stripe (1 to 4)
    // Belt promotion happens when stripe 4 is completed
    const beltBaseConfig: Record<Belt, { weeksPerStripe: number; winsPerStripe: number; skillBase: number }> = {
      white: { weeksPerStripe: 4, winsPerStripe: 1, skillBase: 50 },
      blue: { weeksPerStripe: 8, winsPerStripe: 2, skillBase: 60 },
      purple: { weeksPerStripe: 10, winsPerStripe: 3, skillBase: 70 },
      brown: { weeksPerStripe: 12, winsPerStripe: 4, skillBase: 80 },
      black: { weeksPerStripe: 20, winsPerStripe: 10, skillBase: 90 }
    };

    const cfg = beltBaseConfig[currentBelt];
    const isAtStripeFour = currentStripes >= 4;

    const targetStep = isAtStripeFour ? 5 : currentStripes + 1;
    const requiredWeeks = targetStep * cfg.weeksPerStripe;
    const requiredWins = targetStep * cfg.winsPerStripe;
    const requiredSkill = cfg.skillBase + (targetStep - 1) * 2;

    const weeksMet = weeks >= requiredWeeks;
    const winsMet = wins >= requiredWins;
    const skillMet = avgSkill >= requiredSkill;

    // Calculate overall completion percent (0-100%)
    const pWeeks = Math.min(1, weeks / requiredWeeks);
    const pWins = Math.min(1, wins / Math.max(1, requiredWins));
    const pSkill = Math.min(1, avgSkill / requiredSkill);
    const progressPercent = Math.round(((pWeeks + pWins + pSkill) / 3) * 100);

    const allMet = weeksMet && winsMet && skillMet;

    if (isAtStripeFour) {
      const nextBelt = nextBeltMap[currentBelt];
      const feedback = allMet
        ? `PARABÉNS! Você completou os 4 graus e preencheu todos os requisitos de tempo, vitórias e técnica para ser promovido à FAIXA ${nextBelt?.toUpperCase()}!`
        : `Para a troca de faixa (${currentBelt.toUpperCase()} ➔ ${nextBelt?.toUpperCase()}), continue evoluindo seu camp e disputando torneios.`;

      return {
        canEarnStripe: false,
        canPromoteBelt: allMet,
        currentBelt,
        currentStripes: 4,
        nextStripe: 4,
        nextBelt,
        progressPercent,
        requirements: {
          weeks: { current: weeks, required: requiredWeeks, met: weeksMet },
          wins: { current: wins, required: requiredWins, met: winsMet },
          skill: { current: avgSkill, required: requiredSkill, met: skillMet }
        },
        feedback
      };
    }

    const nextStripe = currentStripes + 1;
    const feedback = allMet
      ? `O Mestre reconheceu sua evolução! Você está pronto para receber a ${nextStripe}ª divisa (grau) na Faixa ${currentBelt.toUpperCase()}!`
      : `Evolução para o ${nextStripe}º grau da Faixa ${currentBelt.toUpperCase()}: ${progressPercent}% concluído.`;

    return {
      canEarnStripe: allMet,
      canPromoteBelt: false,
      currentBelt,
      currentStripes,
      nextStripe,
      nextBelt: nextBeltMap[currentBelt],
      progressPercent,
      requirements: {
        weeks: { current: weeks, required: requiredWeeks, met: weeksMet },
        wins: { current: wins, required: requiredWins, met: winsMet },
        skill: { current: avgSkill, required: requiredSkill, met: skillMet }
      },
      feedback
    };
  }

  /**
   * Awards a degree / stripe (divisa) to the athlete (up to 4)
   */
  public static awardStripe(athlete: Athlete): Athlete {
    const updated: Athlete = JSON.parse(JSON.stringify(athlete));
    if (updated.stripes < 4) {
      updated.stripes += 1;
      updated.visual.beltStripes = updated.stripes;
      updated.maxEnergy += 5;
      updated.currentEnergy = updated.maxEnergy;
      updated.reputation += 60;
    }
    return updated;
  }

  /**
   * Promotes the athlete to the next belt and resets stripes to 0
   */
  public static promoteBelt(athlete: Athlete, nextBelt: Belt): Athlete {
    const updated: Athlete = JSON.parse(JSON.stringify(athlete));
    updated.belt = nextBelt;
    updated.stripes = 0;
    updated.visual.beltStripes = 0;
    updated.maxEnergy += 10;
    updated.currentEnergy = updated.maxEnergy;
    updated.staminaRecoveryRate += 2;
    updated.reputation += 250;
    return updated;
  }

  /**
   * Executes training drill with energy cost, time advancement (weeks) and fatigue
   */
  public static executeTraining(
    athlete: Athlete,
    drill: TrainingDrill,
    careerState: CareerState
  ): { updatedAthlete: Athlete; updatedCareer: CareerState; message: string; leveledUpAttributes: string[] } {
    const updatedAthlete: Athlete = JSON.parse(JSON.stringify(athlete));
    const updatedCareer: CareerState = JSON.parse(JSON.stringify(careerState));
    const leveledUpAttributes: string[] = [];

    // Deduct energy
    updatedAthlete.currentEnergy = Math.max(0, updatedAthlete.currentEnergy - drill.energyCost);

    // If recovery drill, boost energy restoration
    if (drill.category === 'recuperacao') {
      updatedAthlete.currentEnergy = Math.min(updatedAthlete.maxEnergy, updatedAthlete.currentEnergy + 60);
    }

    // Fatigue adjustment
    updatedAthlete.fatigue = Math.max(0, Math.min(100, updatedAthlete.fatigue + drill.fatigueDelta));

    // Time advancement (Weeks)
    const weeksToAdd = drill.timeCostWeeks || 1;
    updatedCareer.currentWeek += weeksToAdd;
    updatedAthlete.trainingWeeks = (updatedAthlete.trainingWeeks || 0) + weeksToAdd;

    // Reset calendar year if 52 weeks exceeded
    if (updatedCareer.currentWeek > 52) {
      updatedCareer.year += Math.floor(updatedCareer.currentWeek / 52);
      updatedCareer.currentWeek = (updatedCareer.currentWeek % 52) || 1;
    }

    // Skill points
    updatedAthlete.skillPoints += drill.skillPointsEarned;

    // Apply attribute gains
    const attrs = updatedAthlete.attributes as unknown as Record<string, number>;
    for (const [key, baseGain] of Object.entries(drill.attributeGains)) {
      if (typeof attrs[key] === 'number') {
        const currentVal = attrs[key];
        const efficiency = currentVal > 85 ? 0.35 : currentVal > 70 ? 0.65 : 1.0;
        const gain = Math.max(1, Math.round(baseGain * efficiency));
        attrs[key] = Math.min(99, currentVal + gain);
        leveledUpAttributes.push(`${key} (+${gain})`);
      }
    }

    // Weekly stamina recovery
    updatedAthlete.currentEnergy = Math.min(
      updatedAthlete.maxEnergy,
      updatedAthlete.currentEnergy + updatedAthlete.staminaRecoveryRate * 2
    );

    const message = `Semana ${updatedCareer.currentWeek}: ${drill.title} concluído com sucesso! ${drill.coachTips}`;
    updatedCareer.coachFeedback.unshift(message);

    return { updatedAthlete, updatedCareer, message, leveledUpAttributes };
  }

  /**
   * Evaluates tournament unlocks strictly according to CBJJA and CBJJP rules:
   * - Faixa Branca: CBJJA Opens only; Brasileiro CBJJA only if won ALL disputed opens (min 3)!
   * - Faixa Azul: CBJJP Opens & Brasileiro CBJJP.
   * - Faixa Roxa: CBJJP Opens; Brasileiro CBJJP only if won 3 Opens!
   * - Faixa Marrom: CBJJP Opens, Brasileiro, Europeu e Mundial.
   * - Faixa Preta: CBJJP Opens, Brasileiro, Europeu e Mundial.
   */
  public static updateTournamentUnlocks(tournaments: Tournament[], athlete: Athlete): Tournament[] {
    const belt = athlete.belt;
    const opensWon = athlete.opensWon || 0;
    const opensDisputed = athlete.opensDisputed || 0;

    return tournaments.map((t) => {
      let isUnlocked = false;

      // 1. FAIXA BRANCA
      if (belt === 'white') {
        if (t.federation === 'CBJJA') {
          if (t.id === 'cbjja_brasileiro') {
            // Only if won ALL disputed opens and at least 3!
            isUnlocked = opensDisputed >= 3 && opensWon >= opensDisputed;
          } else {
            // Opens are open
            isUnlocked = true;
          }
        } else {
          // CBJJP is locked for white belts
          isUnlocked = false;
        }
      }

      // 2. FAIXA AZUL
      else if (belt === 'blue') {
        if (t.federation === 'CBJJP') {
          // Opens and Brasileiro for Blue belt
          isUnlocked = t.requiredBelt === 'blue';
        } else {
          isUnlocked = false;
        }
      }

      // 3. FAIXA ROXA
      else if (belt === 'purple') {
        if (t.federation === 'CBJJP') {
          if (t.id === 'cbjjp_brasileiro_roxa') {
            // Brasileiro only unlocked if won 3 opens!
            isUnlocked = opensWon >= 3;
          } else {
            // Purple belt opens
            isUnlocked = t.requiredBelt === 'purple';
          }
        } else {
          isUnlocked = false;
        }
      }

      // 4. FAIXA MARROM
      else if (belt === 'brown') {
        // Can fight CBJJP Opens, Brasileiro, Europeu, Mundial
        isUnlocked = t.federation === 'CBJJP' && t.requiredBelt === 'brown';
      }

      // 5. FAIXA PRETA
      else if (belt === 'black') {
        // Can fight CBJJP Opens, Brasileiro, Europeu, Mundial
        isUnlocked = t.federation === 'CBJJP' && t.requiredBelt === 'black';
      }

      return { ...t, isUnlocked };
    });
  }

  /**
   * Initializes Career Mode state
   */
  public static createInitialCareer(): CareerState {
    return {
      currentWeek: 1,
      year: 2026,
      funds: 600,
      coachFeedback: [
        'Bem-vindo ao BJJCARDS! Você iniciou sua jornada na CBJJA (Confederação Brasileira de Jiu-Jitsu Amador).',
        'Dedique-se aos camps semanais de treinamento e vença os Opens da CBJJA para carimbar sua vaga no Campeonato Brasileiro!'
      ],
      activeTournament: null,
      completedTournaments: []
    };
  }

  // Backwards-compatible evaluation method
  public static evaluateBeltPromotion(athlete: Athlete): {
    canPromote: boolean;
    nextBelt?: Belt;
    reason: string;
  } {
    const prog = this.evaluateGraduation(athlete);
    const meetsLegacy = (athlete.reputation >= 200 && (athlete.careerRecord?.wins || 0) >= 3);
    const canPromote = prog.canPromoteBelt || (prog.nextBelt !== undefined && meetsLegacy);
    return {
      canPromote,
      nextBelt: prog.nextBelt,
      reason: prog.feedback
    };
  }
}
