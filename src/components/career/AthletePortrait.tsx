import React from 'react';
import { AvatarId, Belt } from '../../types/athlete';

interface AthletePortraitProps {
  avatarId?: AvatarId | string;
  avatarUrl?: string;
  belt?: Belt;
  stripes?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showBeltBorder?: boolean;
}

export interface AvatarOption {
  id: AvatarId;
  name: string;
  archetype: string;
  description: string;
  personality: string;
  imageUrl?: string;
  isRealPhoto?: boolean;
}

export const AVATAR_IMAGE_MAP: Record<string, string> = {
  avatar_01_cabelo_castanho: '/avatars/01_cabelo_castanho.png',
  avatar_02_cabelo_platinado: '/avatars/02_cabelo_platinado.png',
  avatar_03_degrade_platinado: '/avatars/03_degrade_platinado.png',
  avatar_04_moicano: '/avatars/04_moicano.png',
  avatar_05_careca: '/avatars/05_careca.png',
  avatar_06_careca_barbudo: '/avatars/06_careca_barbudo.png',
  avatar_07_cabelo_e_barba: '/avatars/07_cabelo_e_barba.png',
};

export const REAL_AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'avatar_01_cabelo_castanho',
    name: 'Cabelo Castanho',
    archetype: 'Atleta Clássico',
    description: 'Postura compenetrada, corte tradicional e foco absoluto nas pegadas e posicionamento.',
    personality: 'Focado & Técnico',
    imageUrl: '/avatars/01_cabelo_castanho.png',
    isRealPhoto: true
  },
  {
    id: 'avatar_02_cabelo_platinado',
    name: 'Cabelo Platinado',
    archetype: 'Estilo Moderno',
    description: 'Visual arrojado platinado, postura intimidadora e ritmo acelerado de competição.',
    personality: 'Ousado & Agressivo',
    imageUrl: '/avatars/02_cabelo_platinado.png',
    isRealPhoto: true
  },
  {
    id: 'avatar_03_degrade_platinado',
    name: 'Degradê Platinado',
    archetype: 'Prodígio dos Opens',
    description: 'Degradê afiado, olhar fixo na vitória e transições plásticas de alto nível.',
    personality: 'Veloz & Confiante',
    imageUrl: '/avatars/03_degrade_platinado.png',
    isRealPhoto: true
  },
  {
    id: 'avatar_04_moicano',
    name: 'Moicano',
    archetype: 'Guerreiro Implacável',
    description: 'Moicano agressivo de combate, fôlego inabalável e pressão contínua.',
    personality: 'Intenso & Explosivo',
    imageUrl: '/avatars/04_moicano.png',
    isRealPhoto: true
  },
  {
    id: 'avatar_05_careca',
    name: 'Careca',
    archetype: 'Casca-Grossa Puro',
    description: 'Visual clássico de tatame, orelha calejada e pressão esmagadora nos 100kg.',
    personality: 'Frio & Pesado',
    imageUrl: '/avatars/05_careca.png',
    isRealPhoto: true
  },
  {
    id: 'avatar_06_careca_barbudo',
    name: 'Careca Barbudo',
    archetype: 'Pressão Pesada',
    description: 'Barba densa, presença intimidadora e passagens de guarda brutais.',
    personality: 'Implacável & Dominante',
    imageUrl: '/avatars/06_careca_barbudo.png',
    isRealPhoto: true
  },
  {
    id: 'avatar_07_cabelo_e_barba',
    name: 'Cabelo e Barba',
    archetype: 'Lutador Completo',
    description: 'Visual equilibrado e alinhado, jogo completo tanto por cima quanto por baixo.',
    personality: 'Estrategista & Preciso',
    imageUrl: '/avatars/07_cabelo_e_barba.png',
    isRealPhoto: true
  }
];

export const REAL_AVATAR_KEYS: AvatarId[] = [
  'avatar_01_cabelo_castanho',
  'avatar_02_cabelo_platinado',
  'avatar_03_degrade_platinado',
  'avatar_04_moicano',
  'avatar_05_careca',
  'avatar_06_careca_barbudo',
  'avatar_07_cabelo_e_barba'
];

export function getDeterministicAvatar(seed: string = ''): { avatarId: AvatarId; avatarUrl: string } {
  let hash = 0;
  const str = String(seed || 'opponent');
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % REAL_AVATAR_KEYS.length;
  const avatarId = REAL_AVATAR_KEYS[index];
  return {
    avatarId,
    avatarUrl: AVATAR_IMAGE_MAP[avatarId]
  };
}

export const AVATAR_OPTIONS: AvatarOption[] = REAL_AVATAR_OPTIONS;

export const AthletePortrait: React.FC<AthletePortraitProps> = ({
  avatarId = 'avatar_01_cabelo_castanho',
  avatarUrl,
  belt = 'white',
  stripes = 0,
  size = 'md',
  className = '',
  showBeltBorder = true
}) => {
  const [imgError, setImgError] = React.useState(false);
  const fallback = getDeterministicAvatar(avatarId || 'bjj');
  const resolvedImageUrl = avatarUrl || (avatarId && AVATAR_IMAGE_MAP[avatarId]) || fallback.avatarUrl;

  const getBeltBorderHex = () => {
    switch (belt) {
      case 'white': return '#e2e8f0';
      case 'blue': return '#2563eb';
      case 'purple': return '#9333ea';
      case 'brown': return '#854d0e';
      case 'black': return '#eab308'; // Dourado de Faixa Preta
    }
  };

  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24 md:w-28 md:h-28',
    xl: 'w-32 h-32 md:w-36 md:h-36',
    hero: 'w-44 h-44 md:w-52 md:h-52'
  }[size];

  const beltBorderColor = getBeltBorderHex();

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      {/* Outer Belt Halo Glow */}
      {showBeltBorder && (
        <div
          className="absolute inset-0 rounded-full blur-[2px] transition-all duration-300 pointer-events-none"
          style={{ backgroundColor: `${beltBorderColor}40` }}
        />
      )}

      {/* Main Avatar Container */}
      <div
        className={`relative w-full h-full rounded-full overflow-hidden shadow-2xl bg-zinc-950 border-2 transition-transform duration-200 hover:scale-105`}
        style={{ borderColor: showBeltBorder ? beltBorderColor : '#334155' }}
      >
        <img
          src={!imgError && resolvedImageUrl ? resolvedImageUrl : fallback.avatarUrl}
          alt="Retrato do Atleta"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-top select-none pointer-events-none"
        />

        {/* Stripes Indicator Badge */}
        {stripes > 0 && (
          <div className="absolute bottom-0 inset-x-0 bg-black/85 border-t border-white/20 py-0.5 flex items-center justify-center gap-0.5">
            {Array.from({ length: stripes }).map((_, i) => (
              <div key={i} className="w-1 h-2 bg-white rounded-sm shadow-sm" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
