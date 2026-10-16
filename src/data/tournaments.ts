import { Tournament } from '../types/career';

export const TOURNAMENTS_DATA: Tournament[] = [
  // ==========================================================================
  // 1. CONFEDERAÇÃO AMADORA (CBJJA) - FAIXA BRANCA
  // Opens liberados; Brasileiro somente se vencer todos os Opens disputados!
  // ==========================================================================
  {
    id: 'cbjja_curitiba_open',
    name: 'CBJJA Curitiba Open Amador',
    federation: 'CBJJA',
    location: 'Ginásio do Tarumã, Curitiba / PR',
    prestige: 'regional',
    requiredBelt: 'white',
    entryFee: 80,
    reputationReward: 120,
    trophyIcon: 'Award',
    description: 'Abertura da temporada amadora. Ideal para o atleta faixa-branca sentir a pressão do cronômetro oficial da CBJJA.',
    unlockCriteriaDescription: 'Aberto para todos os atletas Faixa Branca inscritos na CBJJA.',
    isUnlocked: true,
    matches: [
      {
        id: 'cur_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_tanque',
        opponentName: 'Marcus Silva',
        opponentBelt: 'white',
        opponentAcademy: 'Alliance Jiu-Jitsu',
        completed: false
      },
      {
        id: 'cur_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_tanque',
        opponentName: 'Diego "Ogro" Ramos',
        opponentBelt: 'white',
        opponentAcademy: 'Nova União',
        completed: false
      },
      {
        id: 'cur_final',
        roundName: 'Grande Final',
        opponentId: 'rival_tanque',
        opponentName: 'Thiago "Pitbull" Santos',
        opponentBelt: 'white',
        opponentAcademy: 'Checkmat',
        completed: false
      }
    ]
  },
  {
    id: 'cbjja_rio_open',
    name: 'CBJJA Rio Open Amador',
    federation: 'CBJJA',
    location: 'Arena Carioca, Rio de Janeiro / RJ',
    prestige: 'estadual',
    requiredBelt: 'white',
    entryFee: 100,
    reputationReward: 150,
    trophyIcon: 'Award',
    description: 'Tradicional torneio amador no berço do Jiu-Jitsu. Chaves lotadas de competidores duros disputando pegada.',
    unlockCriteriaDescription: 'Aberto para atletas Faixa Branca inscritos na CBJJA.',
    isUnlocked: true,
    matches: [
      {
        id: 'rio_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_tanque',
        opponentName: 'Bruno Alencar',
        opponentBelt: 'white',
        opponentAcademy: 'Carlson Gracie',
        completed: false
      },
      {
        id: 'rio_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_tanque',
        opponentName: 'Renato "Pé de Chumbo" Dias',
        opponentBelt: 'white',
        opponentAcademy: 'BTT',
        completed: false
      },
      {
        id: 'rio_final',
        roundName: 'Grande Final',
        opponentId: 'rival_tanque',
        opponentName: 'Felipe "Trator" Guimarães',
        opponentBelt: 'white',
        opponentAcademy: 'Gracie Barra',
        completed: false
      }
    ]
  },
  {
    id: 'cbjja_sp_open',
    name: 'CBJJA São Paulo Open Amador',
    federation: 'CBJJA',
    location: 'Ginásio do Ibirapuera, São Paulo / SP',
    prestige: 'estadual',
    requiredBelt: 'white',
    entryFee: 110,
    reputationReward: 160,
    trophyIcon: 'Award',
    description: 'Etapa paulista da CBJJA com elevado ritmo de luta em pé e disputa tática de quedas.',
    unlockCriteriaDescription: 'Aberto para atletas Faixa Branca inscritos na CBJJA.',
    isUnlocked: true,
    matches: [
      {
        id: 'sp_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_tanque',
        opponentName: 'Igor "Blindado" Costa',
        opponentBelt: 'white',
        opponentAcademy: 'Dream Art Project',
        completed: false
      },
      {
        id: 'sp_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_tanque',
        opponentName: 'Danilo Pires',
        opponentBelt: 'white',
        opponentAcademy: 'Atos Jiu-Jitsu',
        completed: false
      },
      {
        id: 'sp_final',
        roundName: 'Grande Final',
        opponentId: 'rival_tanque',
        opponentName: 'Rodrigo "Martelo" Siqueira',
        opponentBelt: 'white',
        opponentAcademy: 'Cicero Costha BJJ',
        completed: false
      }
    ]
  },
  {
    id: 'cbjja_brasileiro',
    name: 'Campeonato Brasileiro Amador CBJJA',
    federation: 'CBJJA',
    location: 'Ginásio José Corrêa, Barueri / SP',
    prestige: 'nacional',
    requiredBelt: 'white',
    entryFee: 180,
    reputationReward: 350,
    trophyIcon: 'Medal',
    description: 'O ápice da Faixa Branca no Brasil! Reúne somente os campeões invictos de todos os Opens da confederação.',
    unlockCriteriaDescription: 'EXCLUSIVO FAIXA BRANCA: Desbloqueia SOMENTE se o atleta vencer TODOS os Opens da CBJJA que disputar (mínimo de 3 títulos com Ouro)!',
    isUnlocked: false,
    matches: [
      {
        id: 'bra_amador_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_tanque',
        opponentName: 'Lucas "Furacão" Mendes',
        opponentBelt: 'white',
        opponentAcademy: 'GFTeam',
        completed: false
      },
      {
        id: 'bra_amador_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_tanque',
        opponentName: 'André "Muralha" Bastos',
        opponentBelt: 'white',
        opponentAcademy: 'Alliance Jiu-Jitsu',
        completed: false
      },
      {
        id: 'bra_amador_final',
        roundName: 'Grande Final',
        opponentId: 'rival_tanque',
        opponentName: 'Caio "Monstro" Nogueira',
        opponentBelt: 'white',
        opponentAcademy: 'Checkmat Barueri',
        completed: false
      }
    ]
  },

  // ==========================================================================
  // 2. CONFEDERAÇÃO PROFISSIONAL (CBJJP) - FAIXA AZUL
  // Opens da CBJJP e Brasileiro da CBJJP
  // ==========================================================================
  {
    id: 'cbjjp_rio_pro',
    name: 'CBJJP Rio Pro Open',
    federation: 'CBJJP',
    location: 'Parque Olímpico da Barra, Rio / RJ',
    prestige: 'estadual',
    requiredBelt: 'blue',
    entryFee: 160,
    reputationReward: 260,
    trophyIcon: 'Shield',
    description: 'Estreia no circuito profissional da CBJJP. O nível técnico é elevadíssimo com berimbolos modernos e passagens de pressão.',
    unlockCriteriaDescription: 'Exclusivo para atletas graduados na Faixa Azul pela CBJJP.',
    isUnlocked: false,
    matches: [
      {
        id: 'cbjjp_rio_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_bolo',
        opponentName: 'Lucas Ferreira "Bolo"',
        opponentBelt: 'blue',
        opponentAcademy: 'Cicero Costha BJJ',
        completed: false
      },
      {
        id: 'cbjjp_rio_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_bolo',
        opponentName: 'Matheus "Gavião" Lima',
        opponentBelt: 'blue',
        opponentAcademy: 'Dream Art',
        completed: false
      },
      {
        id: 'cbjjp_rio_final',
        roundName: 'Grande Final',
        opponentId: 'rival_bolo',
        opponentName: 'Gabriel "Samurai" Rocha',
        opponentBelt: 'blue',
        opponentAcademy: 'GFTeam',
        completed: false
      }
    ]
  },
  {
    id: 'cbjjp_sp_pro',
    name: 'CBJJP São Paulo Pro Open',
    federation: 'CBJJP',
    location: 'Ginásio do Pacaembu, São Paulo / SP',
    prestige: 'estadual',
    requiredBelt: 'blue',
    entryFee: 170,
    reputationReward: 280,
    trophyIcon: 'Shield',
    description: 'Open profissional com os guardeiros mais flexíveis e passadores pesados de São Paulo.',
    unlockCriteriaDescription: 'Exclusivo para atletas Faixa Azul da CBJJP.',
    isUnlocked: false,
    matches: [
      {
        id: 'cbjjp_sp_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_bolo',
        opponentName: 'Vitor "Enguia" Morais',
        opponentBelt: 'blue',
        opponentAcademy: 'Alliance',
        completed: false
      },
      {
        id: 'cbjjp_sp_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_bolo',
        opponentName: 'Rafael "Mola" Cavalcanti',
        opponentBelt: 'blue',
        opponentAcademy: 'Atos BJJ',
        completed: false
      },
      {
        id: 'cbjjp_sp_final',
        roundName: 'Grande Final',
        opponentId: 'rival_bolo',
        opponentName: 'Murilo "Cobra" Penteado',
        opponentBelt: 'blue',
        opponentAcademy: 'Checkmat',
        completed: false
      }
    ]
  },
  {
    id: 'cbjjp_brasileiro_azul',
    name: 'Campeonato Brasileiro Pro CBJJP (Faixa Azul)',
    federation: 'CBJJP',
    location: 'Ginásio José Corrêa, Barueri / SP',
    prestige: 'nacional',
    requiredBelt: 'blue',
    entryFee: 240,
    reputationReward: 450,
    trophyIcon: 'Medal',
    description: 'O maior título profissional nacional para os atletas Faixa Azul do país.',
    unlockCriteriaDescription: 'Desbloqueado para todos os atletas Faixa Azul da CBJJP.',
    isUnlocked: false,
    matches: [
      {
        id: 'bra_azul_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_bolo',
        opponentName: 'Alexandre "Relâmpago" Cruz',
        opponentBelt: 'blue',
        opponentAcademy: 'Dream Art',
        completed: false
      },
      {
        id: 'bra_azul_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_bolo',
        opponentName: 'Bernardo "Guilhotina" Prado',
        opponentBelt: 'blue',
        opponentAcademy: 'Nova União',
        completed: false
      },
      {
        id: 'bra_azul_final',
        roundName: 'Grande Final',
        opponentId: 'rival_bolo',
        opponentName: 'Felipe "Predador Jr" Barreto',
        opponentBelt: 'blue',
        opponentAcademy: 'Fight Sports',
        completed: false
      }
    ]
  },

  // ==========================================================================
  // 3. CONFEDERAÇÃO PROFISSIONAL (CBJJP) - FAIXA ROXA
  // Opens liberados; Brasileiro somente se vencer 3 Opens da CBJJP!
  // ==========================================================================
  {
    id: 'cbjjp_brasilia_pro',
    name: 'CBJJP Brasília Pro Open',
    federation: 'CBJJP',
    location: 'Ginásio Nilson Nelson, Brasília / DF',
    prestige: 'estadual',
    requiredBelt: 'purple',
    entryFee: 200,
    reputationReward: 350,
    trophyIcon: 'Shield',
    description: 'Etapa Centro-Oeste da CBJJP na Faixa Roxa. Duelo de especialistas que dominam todas as alavancas e berimbolos.',
    unlockCriteriaDescription: 'Aberto para atletas Faixa Roxa da CBJJP.',
    isUnlocked: false,
    matches: [
      {
        id: 'bsb_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_veneno',
        opponentName: 'Pedro "Veneno" Guimarães',
        opponentBelt: 'purple',
        opponentAcademy: 'Constrictor Team',
        completed: false
      },
      {
        id: 'bsb_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_veneno',
        opponentName: 'Otávio "Nó Cego" Silveira',
        opponentBelt: 'purple',
        opponentAcademy: 'Cerrado MMA BJJ',
        completed: false
      },
      {
        id: 'bsb_final',
        roundName: 'Grande Final',
        opponentId: 'rival_veneno',
        opponentName: 'Cristiano "Fantasma" Maia',
        opponentBelt: 'purple',
        opponentAcademy: 'Gracie Barra DF',
        completed: false
      }
    ]
  },
  {
    id: 'cbjjp_salvador_pro',
    name: 'CBJJP Salvador Pro Open',
    federation: 'CBJJP',
    location: 'Arena Fonte Nova, Salvador / BA',
    prestige: 'regional',
    requiredBelt: 'purple',
    entryFee: 190,
    reputationReward: 330,
    trophyIcon: 'Shield',
    description: 'Circuito Nordeste profissional da CBJJP na Faixa Roxa.',
    unlockCriteriaDescription: 'Aberto para atletas Faixa Roxa da CBJJP.',
    isUnlocked: false,
    matches: [
      {
        id: 'ssa_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_veneno',
        opponentName: 'Denílson "Carcará" Bahia',
        opponentBelt: 'purple',
        opponentAcademy: 'Nordeste BJJ',
        completed: false
      },
      {
        id: 'ssa_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_veneno',
        opponentName: 'Marcelo "Aranha" Peixoto',
        opponentBelt: 'purple',
        opponentAcademy: 'Checkmat Bahia',
        completed: false
      },
      {
        id: 'ssa_final',
        roundName: 'Grande Final',
        opponentId: 'rival_veneno',
        opponentName: 'Everton "Pânico" Santos',
        opponentBelt: 'purple',
        opponentAcademy: 'GFTeam SSA',
        completed: false
      }
    ]
  },
  {
    id: 'cbjjp_floripa_pro',
    name: 'CBJJP Floripa Pro Open',
    federation: 'CBJJP',
    location: 'Arena Multiuso, Florianópolis / SC',
    prestige: 'regional',
    requiredBelt: 'purple',
    entryFee: 190,
    reputationReward: 340,
    trophyIcon: 'Shield',
    description: 'Circuito Sul profissional da CBJJP na Faixa Roxa.',
    unlockCriteriaDescription: 'Aberto para atletas Faixa Roxa da CBJJP.',
    isUnlocked: false,
    matches: [
      {
        id: 'flp_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_veneno',
        opponentName: 'Tiago "Ice" Becker',
        opponentBelt: 'purple',
        opponentAcademy: 'Alliance Sul',
        completed: false
      },
      {
        id: 'flp_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_veneno',
        opponentName: 'Lorenzo "Tubarão" Rossi',
        opponentBelt: 'purple',
        opponentAcademy: 'Sul JJ',
        completed: false
      },
      {
        id: 'flp_final',
        roundName: 'Grande Final',
        opponentId: 'rival_veneno',
        opponentName: 'Gustavo "Tempestade" Schmidt',
        opponentBelt: 'purple',
        opponentAcademy: 'Rilion Gracie',
        completed: false
      }
    ]
  },
  {
    id: 'cbjjp_brasileiro_roxa',
    name: 'Campeonato Brasileiro Pro CBJJP (Faixa Roxa)',
    federation: 'CBJJP',
    location: 'Ginásio José Corrêa, Barueri / SP',
    prestige: 'nacional',
    requiredBelt: 'purple',
    entryFee: 280,
    reputationReward: 600,
    trophyIcon: 'Medal',
    description: 'O campeonato mais cobiçado da Faixa Roxa brasileira.',
    unlockCriteriaDescription: 'EXCLUSIVO FAIXA ROXA: Desbloqueia SOMENTE se o atleta vencer pelo menos 3 Opens da CBJJP!',
    isUnlocked: false,
    matches: [
      {
        id: 'bra_roxa_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_veneno',
        opponentName: 'Arthur "Fenômeno" Toledo',
        opponentBelt: 'purple',
        opponentAcademy: 'Dream Art',
        completed: false
      },
      {
        id: 'bra_roxa_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_veneno',
        opponentName: 'Danilo "Mestre dos Magos" Reis',
        opponentBelt: 'purple',
        opponentAcademy: 'Atos Jiu-Jitsu',
        completed: false
      },
      {
        id: 'bra_roxa_final',
        roundName: 'Grande Final',
        opponentId: 'rival_veneno',
        opponentName: 'Renan "Matador" Fonseca',
        opponentBelt: 'purple',
        opponentAcademy: 'Fratres BJJ',
        completed: false
      }
    ]
  },

  // ==========================================================================
  // 4. CONFEDERAÇÃO PROFISSIONAL (CBJJP) - FAIXA MARROM
  // Opens, Brasileiro, Europeu e Mundial liberados!
  // ==========================================================================
  {
    id: 'cbjjp_marrom_opens',
    name: 'CBJJP Circuito de Opens Pro (Faixa Marrom)',
    federation: 'CBJJP',
    location: 'Circuito Nacional CBJJP',
    prestige: 'estadual',
    requiredBelt: 'brown',
    entryFee: 250,
    reputationReward: 500,
    trophyIcon: 'Award',
    description: 'Opens profissionais com a elite da Faixa Marrom que está prestes a alcançar a Faixa Preta.',
    unlockCriteriaDescription: 'Disponível para atletas Faixa Marrom da CBJJP.',
    isUnlocked: false,
    matches: [
      {
        id: 'mar_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_asfixia',
        opponentName: 'Carlos Eduardo "Asfixia"',
        opponentBelt: 'brown',
        opponentAcademy: 'Alliance SP',
        completed: false
      },
      {
        id: 'mar_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_asfixia',
        opponentName: 'Luciano "Pedra" Fontes',
        opponentBelt: 'brown',
        opponentAcademy: 'Atos San Diego',
        completed: false
      },
      {
        id: 'mar_final',
        roundName: 'Grande Final',
        opponentId: 'rival_asfixia',
        opponentName: 'Igor "Demolidor" Taniguchi',
        opponentBelt: 'brown',
        opponentAcademy: 'Dream Art',
        completed: false
      }
    ]
  },
  {
    id: 'cbjjp_brasileiro_marrom',
    name: 'Campeonato Brasileiro Pro CBJJP (Faixa Marrom)',
    federation: 'CBJJP',
    location: 'Ginásio José Corrêa, Barueri / SP',
    prestige: 'nacional',
    requiredBelt: 'brown',
    entryFee: 320,
    reputationReward: 700,
    trophyIcon: 'Medal',
    description: 'O Campeonato Brasileiro oficial da Faixa Marrom. Teste definitivo para a graduação à Faixa Preta.',
    unlockCriteriaDescription: 'Disponível para atletas Faixa Marrom da CBJJP.',
    isUnlocked: false,
    matches: [
      {
        id: 'bra_mar_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_asfixia',
        opponentName: 'Fábio "Corta-Giro" Prado',
        opponentBelt: 'brown',
        opponentAcademy: 'GFTeam',
        completed: false
      },
      {
        id: 'bra_mar_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_asfixia',
        opponentName: 'Wellington "Queixo Duro" Silva',
        opponentBelt: 'brown',
        opponentAcademy: 'Checkmat',
        completed: false
      },
      {
        id: 'bra_mar_final',
        roundName: 'Grande Final',
        opponentId: 'rival_asfixia',
        opponentName: 'Gabriel "Lâmina" Souza',
        opponentBelt: 'brown',
        opponentAcademy: 'Gracie Barra',
        completed: false
      }
    ]
  },
  {
    id: 'cbjjp_europeu_marrom',
    name: 'Campeonato Europeu Pro CBJJP (Faixa Marrom)',
    federation: 'CBJJP',
    location: 'Pavilhão Multiusos de Odivelas, Lisboa / Portugal',
    prestige: 'europeu',
    requiredBelt: 'brown',
    entryFee: 400,
    reputationReward: 850,
    trophyIcon: 'Trophy',
    description: 'Grand Slam Europeu em Lisboa. Os maiores talentos da Europa e do Brasil duelam pelo prestígio internacional.',
    unlockCriteriaDescription: 'Disponível para atletas Faixa Marrom da CBJJP.',
    isUnlocked: false,
    matches: [
      {
        id: 'eur_mar_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_asfixia',
        opponentName: 'Kjetil "Viking" Lindqvist',
        opponentBelt: 'brown',
        opponentAcademy: 'Frontline Academy Norway',
        completed: false
      },
      {
        id: 'eur_mar_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_asfixia',
        opponentName: 'Jean-Luc "Le Coq" Moreau',
        opponentBelt: 'brown',
        opponentAcademy: 'Gracie Barra Paris',
        completed: false
      },
      {
        id: 'eur_mar_final',
        roundName: 'Grande Final',
        opponentId: 'rival_asfixia',
        opponentName: 'Dmitri "Bear" Volkov',
        opponentBelt: 'brown',
        opponentAcademy: 'Ludus Team Europe',
        completed: false
      }
    ]
  },
  {
    id: 'cbjjp_mundial_marrom',
    name: 'Campeonato Mundial Pro CBJJP (Faixa Marrom)',
    federation: 'CBJJP',
    location: 'Walter Pyramid, Long Beach, Califórnia / EUA',
    prestige: 'mundial',
    requiredBelt: 'brown',
    entryFee: 500,
    reputationReward: 1000,
    trophyIcon: 'Crown',
    description: 'O Campeonato Mundial de Jiu-Jitsu na mítica Walter Pyramid. Quem vence aqui entra na história do esporte.',
    unlockCriteriaDescription: 'Disponível para atletas Faixa Marrom da CBJJP.',
    isUnlocked: false,
    matches: [
      {
        id: 'mun_mar_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_asfixia',
        opponentName: 'Hiroshi "Tsunami" Tanaka',
        opponentBelt: 'brown',
        opponentAcademy: 'Carpe Diem Tokyo',
        completed: false
      },
      {
        id: 'mun_mar_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_asfixia',
        opponentName: 'Mason "The Beast" Cooper',
        opponentBelt: 'brown',
        opponentAcademy: 'AOJ Art of Jiu-Jitsu',
        completed: false
      },
      {
        id: 'mun_mar_final',
        roundName: 'Grande Final',
        opponentId: 'rival_asfixia',
        opponentName: 'Matheus "Invicto" Diniz',
        opponentBelt: 'brown',
        opponentAcademy: 'Alliance New York',
        completed: false
      }
    ]
  },

  // ==========================================================================
  // 5. CONFEDERAÇÃO PROFISSIONAL (CBJJP) - FAIXA PRETA (ÁPICE ABSOLUTO)
  // Opens, Brasileiro, Europeu e Mundial da Faixa Preta!
  // ==========================================================================
  {
    id: 'cbjjp_preta_opens',
    name: 'CBJJP Super Grand Slam Opens (Faixa Preta)',
    federation: 'CBJJP',
    location: 'Circuito Mundial Pro CBJJP',
    prestige: 'estadual',
    requiredBelt: 'black',
    entryFee: 350,
    reputationReward: 700,
    trophyIcon: 'Award',
    description: 'Circuito dos maiores torneios Open mundiais da Faixa Preta.',
    unlockCriteriaDescription: 'Exclusivo para lendas consagradas na Faixa Preta.',
    isUnlocked: false,
    matches: [
      {
        id: 'pre_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_predador',
        opponentName: 'Marcelo "Implacável" Garcia Jr',
        opponentBelt: 'black',
        opponentAcademy: 'Alliance World',
        completed: false
      },
      {
        id: 'pre_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_predador',
        opponentName: 'Rodolfo "Muralha Negra" Vieira',
        opponentBelt: 'black',
        opponentAcademy: 'GFTeam Master',
        completed: false
      },
      {
        id: 'pre_final',
        roundName: 'Grande Final',
        opponentId: 'rival_predador',
        opponentName: 'Lucas "Hulk" Barbosa',
        opponentBelt: 'black',
        opponentAcademy: 'Atos World',
        completed: false
      }
    ]
  },
  {
    id: 'cbjjp_brasileiro_preta',
    name: 'Campeonato Brasileiro de Faixa Preta CBJJP',
    federation: 'CBJJP',
    location: 'Ginásio José Corrêa, Barueri / SP',
    prestige: 'nacional',
    requiredBelt: 'black',
    entryFee: 500,
    reputationReward: 900,
    trophyIcon: 'Medal',
    description: 'O título de Campeão Brasileiro de Faixa Preta. Cada luta é uma guerra lendária entre campeões mundiais.',
    unlockCriteriaDescription: 'Exclusivo para Faixas Pretas federados na CBJJP.',
    isUnlocked: false,
    matches: [
      {
        id: 'bra_pre_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_predador',
        opponentName: 'Fellipe "Mata-Rindo" Andrew',
        opponentBelt: 'black',
        opponentAcademy: 'Alliance SP',
        completed: false
      },
      {
        id: 'bra_pre_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_predador',
        opponentName: 'Erich "Alavanca de Ouro" Munis',
        opponentBelt: 'black',
        opponentAcademy: 'Fratres World',
        completed: false
      },
      {
        id: 'bra_pre_final',
        roundName: 'Grande Final',
        opponentId: 'rival_predador',
        opponentName: 'Mica "Prodígio" Galvão',
        opponentBelt: 'black',
        opponentAcademy: 'Melqui Galvão BJJ',
        completed: false
      }
    ]
  },
  {
    id: 'cbjjp_europeu_preta',
    name: 'Campeonato Europeu de Faixa Preta CBJJP',
    federation: 'CBJJP',
    location: 'Pavilhão Multiusos de Odivelas, Lisboa / Portugal',
    prestige: 'europeu',
    requiredBelt: 'black',
    entryFee: 600,
    reputationReward: 1100,
    trophyIcon: 'Trophy',
    description: 'Grand Slam Europeu da Faixa Preta. O mundo inteiro assiste à elite em Lisboa.',
    unlockCriteriaDescription: 'Exclusivo para Faixas Pretas federados na CBJJP.',
    isUnlocked: false,
    matches: [
      {
        id: 'eur_pre_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_predador',
        opponentName: 'Espen "Tornado" Mathiesen',
        opponentBelt: 'black',
        opponentAcademy: 'Kimura Norway',
        completed: false
      },
      {
        id: 'eur_pre_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_predador',
        opponentName: 'Tommy "The Guard" Langaker',
        opponentBelt: 'black',
        opponentAcademy: 'Wulfing BJJ',
        completed: false
      },
      {
        id: 'eur_pre_final',
        roundName: 'Grande Final',
        opponentId: 'rival_predador',
        opponentName: 'Tainan "Cirúrgico" Dalpra',
        opponentBelt: 'black',
        opponentAcademy: 'Art of Jiu-Jitsu',
        completed: false
      }
    ]
  },
  {
    id: 'cbjjp_mundial_preta',
    name: 'Campeonato Mundial de Faixa Preta CBJJP (Walter Pyramid)',
    federation: 'CBJJP',
    location: 'Walter Pyramid, Long Beach, Califórnia / EUA',
    prestige: 'mundial',
    requiredBelt: 'black',
    entryFee: 800,
    reputationReward: 1500,
    trophyIcon: 'Crown',
    description: 'O ápice supremo da existência de um lutador de Jiu-Jitsu. Campeão Mundial na Pirâmide da Califórnia!',
    unlockCriteriaDescription: 'O maior torneio da Terra. Consagre seu nome na eternidade dos tatames.',
    isUnlocked: false,
    matches: [
      {
        id: 'mun_pre_qf',
        roundName: 'Quartas de Final',
        opponentId: 'rival_predador',
        opponentName: 'Nicholas "Golias" Meregali',
        opponentBelt: 'black',
        opponentAcademy: 'New Wave BJJ',
        completed: false
      },
      {
        id: 'mun_pre_sf',
        roundName: 'Semifinal',
        opponentId: 'rival_predador',
        opponentName: 'Kaynan "Colosso" Duarte',
        opponentBelt: 'black',
        opponentAcademy: 'Atos World HQ',
        completed: false
      },
      {
        id: 'mun_pre_final',
        roundName: 'Grande Final',
        opponentId: 'rival_predador',
        opponentName: 'Leandro "Predador" Barreto',
        opponentBelt: 'black',
        opponentAcademy: 'Fight Sports World',
        completed: false
      }
    ]
  }
];
