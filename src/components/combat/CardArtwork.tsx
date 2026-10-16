import React from 'react';
import { CardCategory } from '../../types/cards';

interface CardArtworkProps {
  category: CardCategory;
  cardId?: string;
  isSubmission?: boolean;
  className?: string;
}

export const CardArtwork: React.FC<CardArtworkProps> = ({
  category,
  cardId = '',
  isSubmission = false,
  className = ''
}) => {
  // Generate specific authentic BJJ vector silhouettes based on technique category & id
  const renderTechniqueIllustration = () => {
    // 1. FINALIZAÇÕES (Armbar, Triângulo, Mata-Leão, Chave de Pé, etc.)
    if (category === 'FINALIZACAO' || isSubmission) {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full">
          <defs>
            <radialGradient id="sub_glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#581c87" stopOpacity="0.0" />
            </radialGradient>
            <linearGradient id="purple_arm" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>
          </defs>

          {/* Background Aura */}
          <circle cx="80" cy="50" r="45" fill="url(#sub_glow)" />

          {/* Submission Target Lock Reticle */}
          <circle cx="80" cy="50" r="32" fill="none" stroke="#e879f9" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="80" y1="12" x2="80" y2="22" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="80" y1="78" x2="80" y2="88" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="42" y1="50" x2="52" y2="50" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="108" y1="50" x2="118" y2="50" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />

          {/* Grappler 1 - Torso & Leg Pin across opponent's chest (Armbar / Triângulo lock) */}
          <path
            d="M 45,72 C 55,48 70,36 92,34 C 104,33 118,44 125,58 C 114,64 96,62 82,60 C 66,58 54,64 45,72 Z"
            fill="url(#purple_arm)"
            opacity="0.95"
          />
          {/* Entangling Leg trapping shoulder / arm */}
          <path
            d="M 52,28 C 65,22 84,24 100,32 C 108,36 114,44 116,52 C 106,48 94,40 78,38 C 66,36 56,34 52,28 Z"
            fill="#d8b4fe"
          />
          {/* Opponent Trapped Arm Lever */}
          <line x1="72" y1="62" x2="98" y2="38" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
          <circle cx="98" cy="38" r="4" fill="#fbbf24" />

          {/* Joint Leverage Hyper-Extension Flash */}
          <polygon points="85,50 92,43 96,52 103,45 98,55 106,62 94,58 90,66" fill="#facc15" opacity="0.9" />

          {/* Tap Out Kinetic Waves */}
          <path d="M 120,30 Q 128,38 120,46" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 126,26 Q 136,38 126,50" fill="none" stroke="#f43f5e" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        </svg>
      );
    }

    // 2. QUEDAS (Double Leg, Single Leg, Ippon Seoi Nage, etc.)
    if (category === 'QUEDA') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full">
          <defs>
            <radialGradient id="queda_glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0.0" />
            </radialGradient>
            <linearGradient id="red_grappler" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Background Impact Glow */}
          <circle cx="80" cy="50" r="45" fill="url(#queda_glow)" />

          {/* Tatame Mat Baseline */}
          <line x1="20" y1="84" x2="140" y2="84" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Attacking Grappler - Low Level Change Blast Double Leg */}
          {/* Head & Neck driving in */}
          <circle cx="94" cy="46" r="8" fill="#fca5a5" />
          {/* Torso & Driving Back */}
          <path
            d="M 50,78 L 74,54 C 82,48 90,50 96,56 L 82,78 Z"
            fill="url(#red_grappler)"
          />
          {/* Arms wrapping around opponent's knees */}
          <path
            d="M 80,56 C 92,54 104,58 112,66 C 114,68 110,72 104,70 C 96,66 88,62 78,64 Z"
            fill="#f87171"
          />

          {/* Defending Grappler - Airborne / Tilting back */}
          {/* Airborne Legs */}
          <path
            d="M 106,64 L 118,48 L 130,44 L 126,56 L 114,72 Z"
            fill="#94a3b8"
            opacity="0.85"
          />
          {/* Upper Body tilting into mat */}
          <path
            d="M 102,46 L 118,32 C 124,26 132,32 134,40 L 118,52 Z"
            fill="#cbd5e1"
          />
          <circle cx="132" cy="28" r="7" fill="#e2e8f0" />

          {/* Kinetic Takedown Drive Lines */}
          <path d="M 32,56 L 56,56" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
          <path d="M 28,66 L 50,66" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 36,76 L 58,76" stroke="#b91c1c" strokeWidth="1.8" strokeLinecap="round" />

          {/* Impact Burst on Floor */}
          <polygon points="106,84 112,78 114,84 122,80 118,86 128,88 116,90" fill="#f59e0b" />
        </svg>
      );
    }

    // 3. PASSAGEM DE GUARDA (Toreando, Emborcada, Knee Slide)
    if (category === 'PASSAGEM') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full">
          <defs>
            <radialGradient id="pass_glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
            </radialGradient>
            <linearGradient id="blue_pass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Background Aura */}
          <circle cx="80" cy="50" r="45" fill="url(#pass_glow)" />

          {/* Defending Guardero - Flat on back with open legs being bypassed */}
          <path
            d="M 40,78 C 50,70 65,72 82,76 C 96,80 110,80 120,78"
            stroke="#64748b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Guardier's Legs opened / peeled */}
          <path
            d="M 68,72 C 60,54 50,42 42,40 C 38,44 48,58 56,70"
            fill="#94a3b8"
          />
          <path
            d="M 94,74 C 104,58 116,48 126,46 C 128,52 118,62 106,74"
            fill="#94a3b8"
          />

          {/* Passing Grappler - Knee Slice / Low Forward Pressure */}
          {/* Head & Heavy Shoulder Pressure */}
          <circle cx="72" cy="38" r="8" fill="#93c5fd" />
          {/* Cutting Knee across hip */}
          <path
            d="M 62,44 C 74,38 90,40 98,48 L 88,68 L 70,64 Z"
            fill="url(#blue_pass)"
          />
          {/* Base Drive Leg */}
          <path
            d="M 98,48 L 122,58 L 118,66 L 96,56 Z"
            fill="#1d4ed8"
          />

          {/* Kinetic Slice Arrow & Guard Breakdown Vortex */}
          <path
            d="M 52,32 Q 78,22 106,30"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="4 2"
          />
          <polygon points="110,32 102,28 104,36" fill="#38bdf8" />
        </svg>
      );
    }

    // 4. RASPAGEM (Scissor Sweep, Butterfly, De La Riva, Berimbolo)
    if (category === 'RASPAGEM') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full">
          <defs>
            <radialGradient id="sweep_glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0.0" />
            </radialGradient>
            <linearGradient id="emerald_sweep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Background Aura */}
          <circle cx="80" cy="50" r="45" fill="url(#sweep_glow)" />

          {/* Dynamic Spiral Sweep Inversion Vortex */}
          <path
            d="M 54,68 C 42,48 58,26 84,26 C 112,26 126,50 110,72 C 96,88 68,84 62,70"
            fill="none"
            stroke="#34d399"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 3"
          />
          <polygon points="58,66 64,74 54,74" fill="#34d399" />

          {/* Bottom Grappler Elevating with Hook */}
          <path
            d="M 52,74 C 62,60 74,52 88,52 L 80,76 Z"
            fill="url(#emerald_sweep)"
          />
          {/* Elevating Hook Leg lifting opponent's inner thigh */}
          <path
            d="M 76,54 C 84,40 98,34 110,36 L 106,44 C 96,42 86,46 80,58 Z"
            fill="#6ee7b7"
          />

          {/* Top Opponent being tilted / inverted */}
          <path
            d="M 94,48 L 120,38 L 128,46 L 106,62 Z"
            fill="#94a3b8"
            opacity="0.8"
          />
          <circle cx="124" cy="34" r="7" fill="#cbd5e1" />

          {/* Reversal Arrow Indicator */}
          <path d="M 72,20 Q 82,14 94,20" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
          <polygon points="98,22 92,16 94,24" fill="#facc15" />
        </svg>
      );
    }

    // 5. CONTROLE & TRANSIÇÃO (Montada, Costas, Joelho na Barriga, 100kg)
    if (category === 'CONTROLE' || category === 'TRANSICAO') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full">
          <defs>
            <radialGradient id="ctrl_glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.0" />
            </radialGradient>
            <linearGradient id="amber_ctrl" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Background Aura */}
          <circle cx="80" cy="50" r="45" fill="url(#ctrl_glow)" />

          {/* Dominant Posture: Chest-to-Chest Heavy Pressure Pin */}
          {/* Pinned Opponent Base */}
          <ellipse cx="80" cy="68" rx="42" ry="12" fill="#334155" />
          <circle cx="48" cy="66" r="7" fill="#475569" />

          {/* Dominant Grappler on Top (Cross-face + Underhook) */}
          {/* Head driving cross-face into opponent jaw */}
          <circle cx="68" cy="42" r="8" fill="#fde68a" />
          {/* Heavy Torso Sprawled Pin */}
          <path
            d="M 56,48 C 66,42 94,42 104,48 C 108,60 98,72 80,72 C 62,72 52,60 56,48 Z"
            fill="url(#amber_ctrl)"
          />
          {/* Base Hooks / Outspread Knees */}
          <path d="M 60,64 L 46,74 L 54,78 L 66,68 Z" fill="#b45309" />
          <path d="M 100,64 L 114,74 L 106,78 L 94,68 Z" fill="#b45309" />

          {/* Heavy Pressure Weight Vector / Downward Arrows */}
          <path d="M 80,24 L 80,38" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="80,44 75,36 85,36" fill="#fbbf24" />
          <circle cx="80" cy="20" r="3" fill="#fef08a" />
        </svg>
      );
    }

    // 6. RETENÇÃO & DEFESA DE FINALIZAÇÃO (Guarda Fechada, Defesa de Armbar, Frame)
    if (category === 'RETENCAO' || category === 'DEFESA_FINALIZACAO') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full">
          <defs>
            <radialGradient id="def_glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0e7490" stopOpacity="0.0" />
            </radialGradient>
            <linearGradient id="cyan_def" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>

          {/* Background Aura */}
          <circle cx="80" cy="50" r="45" fill="url(#def_glow)" />

          {/* High-Tech Shield Forceframe */}
          <path
            d="M 80,18 L 112,32 L 102,68 L 80,82 L 58,68 L 48,32 Z"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1.8"
            strokeDasharray="4 2"
            opacity="0.75"
          />

          {/* Grappler Framing with Forearms & Knee Shield */}
          {/* Knee Shield Angle */}
          <path
            d="M 64,74 L 86,52 L 80,44 L 56,66 Z"
            fill="url(#cyan_def)"
          />
          {/* Defensive Collar & Bicep Frame */}
          <path
            d="M 72,48 L 94,36 L 98,42 L 78,54 Z"
            fill="#a5f3fc"
          />
          <circle cx="60" cy="56" r="7" fill="#67e8f9" />

          {/* Incoming Pressure Deflection Arcs */}
          <path d="M 116,42 Q 106,50 116,58" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
          <path d="M 124,38 Q 112,50 124,62" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    }

    // 7. MOVIMENTO & POSTURA
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full">
        <defs>
          <radialGradient id="mov_glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        <circle cx="80" cy="50" r="45" fill="url(#mov_glow)" />

        {/* Tatame Grid Floor Perspective */}
        <line x1="30" y1="78" x2="130" y2="78" stroke="#64748b" strokeWidth="1.2" />
        <line x1="45" y1="62" x2="115" y2="62" stroke="#475569" strokeWidth="0.8" />
        <line x1="60" y1="78" x2="68" y2="52" stroke="#475569" strokeWidth="0.8" />
        <line x1="100" y1="78" x2="92" y2="52" stroke="#475569" strokeWidth="0.8" />

        {/* Dynamic Agility Footwork Arrows */}
        <path
          d="M 44,52 C 54,38 72,36 84,44 C 96,52 110,48 116,42"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />
        <polygon points="120,40 112,38 114,46" fill="#f8fafc" />

        {/* Grappling Stance Silhouette */}
        <circle cx="80" cy="34" r="7" fill="#cbd5e1" />
        <path
          d="M 72,42 C 78,38 86,38 90,44 L 84,66 L 74,66 Z"
          fill="#94a3b8"
        />
        <circle cx="70" cy="46" r="3" fill="#cbd5e1" />
        <circle cx="92" cy="48" r="3" fill="#cbd5e1" />
      </svg>
    );
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}>
      {renderTechniqueIllustration()}
    </div>
  );
};
