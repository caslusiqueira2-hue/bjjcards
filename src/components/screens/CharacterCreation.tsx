import React, { useState, useRef } from 'react';
import { Athlete, FightingStyle, WeightClass, AvatarId } from '../../types/athlete';
import { AthletePortrait, AVATAR_OPTIONS, REAL_AVATAR_OPTIONS } from '../career/AthletePortrait';
import { BeltBadge } from '../ui/BeltBadge';
import { sound } from '../../audio/soundEffects';
import { ArrowLeft, Check, Sparkles, Shield, User, Camera, Building2, Flame, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

interface CharacterCreationProps {
  onCreate: (athlete: Athlete) => void;
  onCancel: () => void;
}

const FAMOUS_ACADEMIES = [
  'Gracie Barra',
  'Alliance Jiu-Jitsu',
  'Checkmat',
  'Dream Art Project',
  'Atos Jiu-Jitsu',
  'Nova União',
  'GFTeam',
  'Cicero Costha BJJ'
];

const SUGGESTED_NICKNAMES = [
  'Pitbull',
  'Carcará',
  'Samurai',
  'Predador',
  'Mestre',
  'Mão de Pedra',
  'Gavião',
  'Pantera'
];

export const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCreate, onCancel }) => {
  const [name, setName] = useState<string>('Rodrigo Gracie');
  const [nickname, setNickname] = useState<string>('Pitbull');
  const [academy, setAcademy] = useState<string>('Gracie Barra');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>('avatar_01_cabelo_castanho');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [avatarCategory, setAvatarCategory] = useState<'real' | 'custom'>('real');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [weightClass, setWeightClass] = useState<WeightClass>('Médio');
  const [style, setStyle] = useState<FightingStyle>('Passador');
  const [giColor, setGiColor] = useState<'white' | 'royal-blue' | 'black' | 'navy'>('white');

  // 15 customizable bonus points across the 6 core streamlined attributes
  const [bonusPoints, setBonusPoints] = useState<number>(15);
  const [customStats, setCustomStats] = useState({
    quedas: 55,
    passagemGuarda: 60,
    retencaoGuarda: 55,
    raspagens: 55,
    finalizacoes: 50,
    defesaFinalizacoes: 50,
    controlePosicional: 55,
    forca: 55,
    explosao: 55,
    resistencia: 55
  });

  const handleStatAdjust = (key: keyof typeof customStats, delta: number) => {
    if (delta > 0 && bonusPoints > 0) {
      setCustomStats((prev) => ({ ...prev, [key]: prev[key] + 1 }));
      setBonusPoints((prev) => prev - 1);
      sound.playPointBell(2);
    } else if (delta < 0 && customStats[key] > 50) {
      setCustomStats((prev) => ({ ...prev, [key]: prev[key] - 1 }));
      setBonusPoints((prev) => prev + 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomPhotoUrl(reader.result);
        setSelectedAvatar('avatar_custom');
        setAvatarCategory('custom');
        sound.playPointBell(2);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearCustomPhoto = () => {
    setCustomPhotoUrl(null);
    setSelectedAvatar('avatar_01_cabelo_castanho');
    setAvatarCategory('real');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentAvatarMeta = selectedAvatar === 'avatar_custom'
    ? {
        id: 'avatar_custom' as AvatarId,
        name: 'Foto Própria',
        archetype: 'Atleta Personalizado',
        description: 'Sua foto pessoal carregada com registro oficial no tatame.',
        personality: 'Único & Autêntico',
        isRealPhoto: true
      }
    : (AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0]);

  const dummyAthleteForPreview: Athlete = {
    id: `athlete_${Date.now()}`,
    name: name.trim() || 'Atleta Sem Nome',
    nickname: nickname.trim() || undefined,
    academy: academy.trim() || 'Academia Independente',
    belt: 'white',
    stripes: 0,
    weightClass,
    style,
    currentEnergy: 100,
    maxEnergy: 100,
    staminaRecoveryRate: 10,
    reputation: 0,
    fatigue: 0,
    skillPoints: 0,
    trainingWeeks: 0,
    opensDisputed: 0,
    opensWon: 0,
    visual: {
      giColor,
      patchStyle: 'classic',
      avatarSeed: selectedAvatar,
      avatarId: selectedAvatar,
      avatarUrl: customPhotoUrl || undefined,
      beltStripes: 0
    },
    attributes: {
      ...customStats,
      defesaQuedas: customStats.quedas,
      mobilidade: 55,
      recuperacao: 50,
      leituraAdversario: 50,
      tomadaDecisao: 50,
      disciplinaEstrategica: 50,
      adaptacao: 50,
      experienciaCompetitiva: 35,
      friezaPressao: 40
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

  const handleFinish = () => {
    sound.playVictoryChime();
    onCreate(dummyAthleteForPreview);
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 flex flex-col p-4 md:p-8 overflow-x-hidden">
      {/* Top Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Menu</span>
        </button>

        <div className="text-right">
          <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-bold">
            MODO CARREIRA PROFISSIONAL
          </span>
          <h2 className="font-title text-xl md:text-2xl font-black text-slate-100 uppercase tracking-wider">
            CRIAÇÃO DO ATLETA
          </h2>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Customization Forms (7 cols) */}
        <div className="md:col-span-7 space-y-5">
          {/* 1. Nome, Apelido & Academia */}
          <div className="bg-zinc-950/85 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <User className="w-4 h-4 text-amber-400" />
              <h3 className="font-title text-sm font-bold text-amber-400 uppercase tracking-wider">
                1. Identidade no Tatame
              </h3>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-mono block mb-1">Nome Completo do Atleta</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Rodrigo Gracie"
                className="w-full bg-zinc-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-300 font-mono">Apelido de Guerra (Alcunha)</label>
                <span className="text-[10px] font-mono text-slate-500">Sugestões rápidas</span>
              </div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Ex: Pitbull, Carcará, Samurai"
                className="w-full bg-zinc-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none mb-1.5"
              />
              <div className="flex flex-wrap gap-1">
                {SUGGESTED_NICKNAMES.map((nick) => (
                  <button
                    key={nick}
                    type="button"
                    onClick={() => setNickname(nick)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      nickname === nick
                        ? 'bg-amber-500 text-black border-amber-400 font-bold'
                        : 'bg-zinc-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    "{nick}"
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-300 font-mono">Academia / Equipe Oficial</label>
                <span className="text-[10px] font-mono text-slate-500">Escolha ou digite</span>
              </div>
              <input
                type="text"
                value={academy}
                onChange={(e) => setAcademy(e.target.value)}
                placeholder="Ex: Gracie Barra, Alliance, Checkmat"
                className="w-full bg-zinc-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none mb-1.5"
              />
              <div className="flex flex-wrap gap-1">
                {FAMOUS_ACADEMIES.map((acad) => (
                  <button
                    key={acad}
                    type="button"
                    onClick={() => setAcademy(acad)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      academy === acad
                        ? 'bg-blue-600 text-white border-blue-400 font-bold'
                        : 'bg-zinc-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {acad}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Escolha da Foto / Avatar Ilustrado */}
          <div className="bg-zinc-950/85 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <h3 className="font-title text-sm font-bold text-amber-400 uppercase tracking-wider">
                  2. Foto & Retrato do Lutador
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Escolha um avatar oficial ou envie sua própria foto
              </span>
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Category / Source Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setAvatarCategory('real')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  avatarCategory === 'real'
                    ? 'bg-amber-500 text-black shadow-lg font-black'
                    : 'bg-zinc-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Avatares Oficiais ({REAL_AVATAR_OPTIONS.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAvatarCategory('custom');
                  if (!customPhotoUrl && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  avatarCategory === 'custom' || customPhotoUrl
                    ? 'bg-blue-600 text-white shadow-lg border border-blue-400'
                    : 'bg-zinc-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{customPhotoUrl ? 'Minha Foto (Ativa)' : 'Enviar Minha Foto'}</span>
              </button>
            </div>

            {/* Custom Photo Upload Card */}
            {avatarCategory === 'custom' && (
              <div className="p-4 rounded-xl border border-dashed border-blue-500/50 bg-blue-950/20 flex flex-col items-center justify-center text-center space-y-3">
                {customPhotoUrl ? (
                  <div className="flex items-center gap-4">
                    <AthletePortrait
                      avatarUrl={customPhotoUrl}
                      belt="white"
                      size="md"
                      showBeltBorder={true}
                    />
                    <div className="text-left space-y-1">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Foto Pessoal Carregada
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Sua foto oficial registrada para ficha, placar e combate no tatame.
                      </p>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-mono font-bold"
                        >
                          Trocar Foto
                        </button>
                        <button
                          type="button"
                          onClick={handleClearCustomPhoto}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-red-900/60 text-slate-300 hover:text-red-200 text-[10px] font-mono flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remover Foto
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">Envie sua Própria Foto</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Carregue uma imagem do seu computador (PNG, JPG, WEBP)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs shadow-lg transition-transform hover:scale-105"
                    >
                      Selecionar Arquivo
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Official Realistic Avatars Grid (from D:\avatares) */}
            {avatarCategory === 'real' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {REAL_AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(av.id);
                      setCustomPhotoUrl(null);
                      sound.playGiGrip();
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                      selectedAvatar === av.id && !customPhotoUrl
                        ? 'bg-amber-950/50 border-amber-400 ring-2 ring-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.35)] scale-105'
                        : 'bg-zinc-900/70 border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <AthletePortrait
                      avatarId={av.id}
                      avatarUrl={av.imageUrl}
                      belt="white"
                      size="sm"
                      showBeltBorder={selectedAvatar === av.id && !customPhotoUrl}
                    />
                    <span className="font-title font-bold text-xs text-slate-200 mt-2 truncate w-full">
                      {av.name}
                    </span>
                    <span className="text-[9px] font-mono text-amber-400/90 truncate w-full">
                      {av.archetype}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Current Selected Avatar Meta Description */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 text-[11px] font-mono text-slate-300 flex items-center justify-between">
              <span><strong>{currentAvatarMeta.name}:</strong> {currentAvatarMeta.description}</span>
              <span className="text-[10px] text-amber-400 whitespace-nowrap ml-2">⚡ {currentAvatarMeta.personality}</span>
            </div>
          </div>

          {/* 3. Estilo de Combate, Categoria & Kimono */}
          <div className="bg-zinc-950/85 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl space-y-4">
            <h3 className="font-title text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-white/10 pb-2">
              3. Estilo de Combate & Kimono
            </h3>

            {/* Estilo */}
            <div>
              <label className="text-xs text-slate-300 font-mono block mb-1.5">Especialidade / Estilo de Luta</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['Passador', 'Guardeiro', 'Wrestler', 'Finalizador', 'Estrategista'] as FightingStyle[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStyle(st)}
                    className={`p-2 rounded-xl border text-left text-xs font-title font-bold transition-all ${
                      style === st
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md font-black'
                        : 'bg-zinc-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Categoria de Peso */}
            <div>
              <label className="text-xs text-slate-300 font-mono block mb-1.5">Categoria de Peso (IBJJF)</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Pena', 'Leve', 'Médio', 'Meio-Pesado'] as WeightClass[]).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeightClass(w)}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                      weightClass === w
                        ? 'bg-blue-600 text-white border-blue-400'
                        : 'bg-zinc-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Cor do Kimono */}
            <div>
              <label className="text-xs text-slate-300 font-mono block mb-1.5">Kimono Oficial</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'white', label: 'Branco', bg: 'bg-slate-100 text-black' },
                  { id: 'royal-blue', label: 'Azul Royal', bg: 'bg-blue-600 text-white' },
                  { id: 'black', label: 'Preto', bg: 'bg-zinc-900 text-white border border-slate-700' },
                  { id: 'navy', label: 'Marinho', bg: 'bg-slate-900 text-sky-200 border border-slate-700' }
                ].map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setGiColor(col.id as unknown as typeof giColor)}
                    className={`py-2 px-3 rounded-xl text-xs font-title font-bold transition-transform ${
                      col.bg
                    } ${giColor === col.id ? 'ring-2 ring-amber-400 scale-105 shadow-md' : 'opacity-70 hover:opacity-100'}`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Distribuição Enxuta de Atributos */}
          <div className="bg-zinc-950/85 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <h3 className="font-title text-sm font-bold text-amber-400 uppercase tracking-wider">
                4. Atributos Iniciais de Combate
              </h3>
              <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-0.5 rounded-full">
                Pontos Restantes: {bonusPoints}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {[
                { key: 'quedas', label: 'Quedas & Wrestling' },
                { key: 'passagemGuarda', label: 'Passagem de Guarda' },
                { key: 'retencaoGuarda', label: 'Guarda & Retenção' },
                { key: 'raspagens', label: 'Raspagens' },
                { key: 'finalizacoes', label: 'Finalizações' },
                { key: 'controlePosicional', label: 'Controle Posicional' },
                { key: 'forca', label: 'Força & Pegada' },
                { key: 'resistencia', label: 'Gás & Resistência' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between bg-zinc-900/60 border border-white/5 p-2 rounded-xl">
                  <span className="text-slate-300">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatAdjust(item.key as keyof typeof customStats, -1)}
                      className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-200 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="w-7 text-center font-bold text-amber-300">
                      {customStats[item.key as keyof typeof customStats]}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStatAdjust(item.key as keyof typeof customStats, 1)}
                      disabled={bonusPoints <= 0}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold transition-colors ${
                        bonusPoints > 0
                          ? 'bg-amber-500 hover:bg-amber-400 text-black'
                          : 'bg-zinc-800 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Athlete Card Preview (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
            <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest mb-3">
              FOTO OFICIAL DO REGISTRO DE ATLETA
            </span>

            {/* Selected Portrait Display */}
            <div className="my-2">
              <AthletePortrait
                avatarId={selectedAvatar}
                avatarUrl={customPhotoUrl || undefined}
                belt="white"
                stripes={0}
                size="hero"
              />
            </div>

            <div className="mt-3">
              <h4 className="font-title text-2xl font-black text-slate-100 uppercase tracking-wide">
                {dummyAthleteForPreview.name}
              </h4>
              <p className="text-sm font-mono text-amber-400 font-bold mt-0.5">
                "{dummyAthleteForPreview.nickname || 'Guerreiro'}"
              </p>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                {dummyAthleteForPreview.academy}
              </p>
              <div className="mt-2.5 flex justify-center">
                <BeltBadge belt="white" stripes={0} size="md" />
              </div>
            </div>

            {/* Atleta Dossier */}
            <div className="mt-6 w-full border-t border-white/10 pt-4 text-left text-xs font-mono space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Federação Inicial:</span>
                <strong className="text-amber-400 font-bold">CBJJA (Amador)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estilo:</span>
                <strong className="text-slate-100">{style}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Categoria:</span>
                <strong className="text-slate-100">{weightClass}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kimono:</span>
                <strong className="text-slate-100 capitalize">{giColor}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-amber-400 text-black font-title font-black text-base uppercase tracking-wider shadow-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>CONFIRMAR & INICIAR NA CBJJA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
