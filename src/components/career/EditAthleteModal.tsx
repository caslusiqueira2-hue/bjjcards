import React, { useState, useRef } from 'react';
import { Athlete, AvatarId, FightingStyle, WeightClass } from '../../types/athlete';
import { AthletePortrait, REAL_AVATAR_OPTIONS, AvatarOption } from './AthletePortrait';
import { sound } from '../../audio/soundEffects';
import { User, Camera, Upload, Trash2, Check, X, Shield, Building2, Sparkles } from 'lucide-react';

interface EditAthleteModalProps {
  athlete: Athlete;
  onSave: (updated: Athlete) => void;
  onClose: () => void;
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

export const EditAthleteModal: React.FC<EditAthleteModalProps> = ({
  athlete,
  onSave,
  onClose
}) => {
  const [name, setName] = useState<string>(athlete.name);
  const [nickname, setNickname] = useState<string>(athlete.nickname || '');
  const [academy, setAcademy] = useState<string>(athlete.academy);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>(
    (athlete.visual?.avatarId as AvatarId) || 'avatar_01_cabelo_castanho'
  );
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(athlete.visual?.avatarUrl || null);
  const [giColor, setGiColor] = useState<'white' | 'royal-blue' | 'black' | 'navy'>(athlete.visual?.giColor || 'white');
  const [avatarTab, setAvatarTab] = useState<'gallery' | 'upload'>('gallery');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomPhotoUrl(reader.result);
        setSelectedAvatar('avatar_custom');
        setAvatarTab('upload');
        sound.playPointBell(2);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    setCustomPhotoUrl(null);
    setSelectedAvatar('avatar_01_cabelo_castanho');
    setAvatarTab('gallery');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    const updated: Athlete = {
      ...athlete,
      name: name.trim() || athlete.name,
      nickname: nickname.trim() || undefined,
      academy: academy.trim() || athlete.academy,
      visual: {
        ...athlete.visual,
        avatarId: selectedAvatar,
        avatarUrl: customPhotoUrl || undefined,
        giColor
      }
    };

    sound.playVictoryChime();
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-zinc-950 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 my-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <h3 className="font-title text-lg sm:text-xl font-black uppercase tracking-wider text-slate-100">
              Editar Registro de Atleta
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-600/30">
          {/* 1. Nome & Apelido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Apelido (Alcunha)</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Ex: Pitbull, Carcará"
                className="w-full bg-zinc-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Academia */}
          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Academia / Equipe Oficial</label>
            <input
              type="text"
              value={academy}
              onChange={(e) => setAcademy(e.target.value)}
              className="w-full bg-zinc-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none mb-1.5"
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

          {/* 3. Foto & Avatar */}
          <div className="border-t border-white/10 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5">
                <Camera className="w-4 h-4" /> Foto Oficial do Lutador
              </label>

              {/* Source tabs */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setAvatarTab('gallery')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    avatarTab === 'gallery'
                      ? 'bg-amber-500 text-black font-black'
                      : 'bg-zinc-900 text-slate-400'
                  }`}
                >
                  Galeria ({REAL_AVATAR_OPTIONS.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAvatarTab('upload');
                    if (!customPhotoUrl && fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    avatarTab === 'upload'
                      ? 'bg-blue-600 text-white font-black'
                      : 'bg-zinc-900 text-slate-400'
                  }`}
                >
                  {customPhotoUrl ? 'Minha Foto (Ativa)' : 'Enviar Foto'}
                </button>
              </div>
            </div>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {avatarTab === 'upload' ? (
              <div className="p-4 rounded-xl border border-dashed border-blue-500/50 bg-blue-950/20 flex items-center justify-between gap-4">
                {customPhotoUrl ? (
                  <>
                    <AthletePortrait
                      avatarUrl={customPhotoUrl}
                      belt={athlete.belt}
                      stripes={athlete.stripes}
                      size="sm"
                    />
                    <div className="flex-1 text-left">
                      <span className="text-xs font-bold text-emerald-400 block">Foto Pessoal Ativa</span>
                      <span className="text-[10px] text-slate-400">Pronta para uso no tatame e card de perfil.</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-mono font-bold"
                      >
                        Trocar
                      </button>
                      <button
                        type="button"
                        onClick={handleClearPhoto}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-red-900 text-slate-300 text-[10px] font-mono"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 text-center text-xs font-mono text-blue-300 hover:text-white flex flex-col items-center gap-1"
                  >
                    <Upload className="w-6 h-6 text-blue-400" />
                    <span>Clique para carregar foto do celular ou computador</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {REAL_AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(av.id);
                      setCustomPhotoUrl(null);
                      sound.playGiGrip();
                    }}
                    className={`p-1.5 rounded-xl border flex flex-col items-center transition-all ${
                      selectedAvatar === av.id && !customPhotoUrl
                        ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400 scale-105'
                        : 'bg-zinc-900 border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <AthletePortrait
                      avatarId={av.id}
                      avatarUrl={av.imageUrl}
                      belt={athlete.belt}
                      size="xs"
                      showBeltBorder={selectedAvatar === av.id && !customPhotoUrl}
                    />
                    <span className="text-[9px] font-mono font-bold text-slate-200 mt-1 truncate max-w-full">
                      {av.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Kimono Color */}
          <div className="border-t border-white/10 pt-4">
            <label className="text-xs font-mono text-slate-300 block mb-1.5">Kimono Oficial</label>
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
                  className={`py-2 px-2 rounded-xl text-xs font-title font-bold transition-all ${
                    col.bg
                  } ${giColor === col.id ? 'ring-2 ring-amber-400 scale-105 shadow-md' : 'opacity-70 hover:opacity-100'}`}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/10 pt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs font-bold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-title font-black text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 text-black" />
            <span>Salvar Informações</span>
          </button>
        </div>
      </div>
    </div>
  );
};
