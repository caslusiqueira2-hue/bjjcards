import React from 'react';
import { CombatPosition } from '../../types/combat';
import { Belt } from '../../types/athlete';

interface PositionIllustrationProps {
  position: CombatPosition;
  playerRole?: 'top' | 'bottom' | 'standing';
  playerBelt?: Belt;
  opponentBelt?: Belt;
  playerGiColor?: string;
  opponentGiColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showPointsBadge?: boolean;
}

export const PositionIllustration: React.FC<PositionIllustrationProps> = ({
  position,
  playerRole = 'standing',
  playerBelt = 'white',
  opponentBelt = 'blue',
  playerGiColor = '#e2e8f0', // default white gi
  opponentGiColor = '#2563eb', // default blue gi
  size = 'md',
  className = '',
  showPointsBadge = true
}) => {
  // Determine who is top/bottom gi colors
  const isPlayerTop = playerRole === 'top';
  const topGiColor = isPlayerTop ? playerGiColor : opponentGiColor;
  const bottomGiColor = isPlayerTop ? opponentGiColor : playerGiColor;
  const topBeltColor = isPlayerTop ? getBeltHex(playerBelt) : getBeltHex(opponentBelt);
  const bottomBeltColor = isPlayerTop ? getBeltHex(opponentBelt) : getBeltHex(playerBelt);

  function getBeltHex(b: Belt): string {
    switch (b) {
      case 'white': return '#f8fafc';
      case 'blue': return '#3b82f6';
      case 'purple': return '#a855f7';
      case 'brown': return '#92400e';
      case 'black': return '#ef4444'; // red bar / black belt
      default: return '#f8fafc';
    }
  }

  // Size dimensions
  const sizeClasses = {
    sm: 'w-24 h-16',
    md: 'w-44 h-28 sm:w-52 sm:h-32',
    lg: 'w-64 h-40 sm:w-80 sm:h-48',
    xl: 'w-full max-w-md h-52 sm:h-64'
  };

  // Render authentic BJJ tactical vector scenes for each position
  const renderPositionScene = () => {
    switch (position) {
      // 1. LUTA EM PÉ (Standing Stance & Grip Fight)
      case 'STANDING':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full select-none">
            <defs>
              <radialGradient id="mat_glow_standing" cx="50%" cy="85%" r="65%">
                <stop offset="0%" stopColor="#eab308" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </radialGradient>
              <linearGradient id="gi_p1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={topGiColor} />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="gi_p2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={bottomGiColor} />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Mat Ring Floor */}
            <ellipse cx="100" cy="105" rx="85" ry="18" fill="url(#mat_glow_standing)" stroke="#eab308" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="25" y1="105" x2="175" y2="105" stroke="#334155" strokeWidth="1.5" />

            {/* Left Grappler (Stance) */}
            <circle cx="68" cy="38" r="9" fill="#fbcfe8" stroke="#334155" strokeWidth="1" />
            {/* Gi Torso & Jacket */}
            <path d="M 60,48 L 76,48 L 84,82 L 54,82 Z" fill={topGiColor} stroke="#1e293b" strokeWidth="1.5" />
            {/* Gi Lapel line */}
            <line x1="68" y1="48" x2="64" y2="82" stroke="#0f172a" strokeWidth="2" />
            {/* Belt */}
            <rect x="52" y="70" width="34" height="4" fill={topBeltColor} rx="1" stroke="#000" strokeWidth="0.5" />
            {/* Extended Arms Gripping Lapel */}
            <path d="M 72,54 Q 92,52 110,58" fill="none" stroke={topGiColor} strokeWidth="5" strokeLinecap="round" />
            {/* Legs in staggered combat base */}
            <path d="M 58,82 L 50,105 M 78,82 L 86,105" stroke={topGiColor} strokeWidth="6" strokeLinecap="round" />

            {/* Right Grappler (Stance) */}
            <circle cx="132" cy="38" r="9" fill="#fed7aa" stroke="#334155" strokeWidth="1" />
            {/* Gi Torso */}
            <path d="M 124,48 L 140,48 L 146,82 L 116,82 Z" fill={bottomGiColor} stroke="#1e293b" strokeWidth="1.5" />
            <line x1="132" y1="48" x2="136" y2="82" stroke="#0f172a" strokeWidth="2" />
            <rect x="114" y="70" width="34" height="4" fill={bottomBeltColor} rx="1" stroke="#000" strokeWidth="0.5" />
            {/* Extended Arms Gripping Sleeve & Collar */}
            <path d="M 126,54 Q 106,58 90,54" fill="none" stroke={bottomGiColor} strokeWidth="5" strokeLinecap="round" />
            {/* Legs */}
            <path d="M 122,82 L 114,105 M 142,82 L 150,105" stroke={bottomGiColor} strokeWidth="6" strokeLinecap="round" />

            {/* Grip Battle Spark */}
            <circle cx="100" cy="56" r="4" fill="#facc15" className="animate-ping" opacity="0.75" />
            <circle cx="100" cy="56" r="2.5" fill="#fef08a" />
          </svg>
        );

      // 2. CLINCH / ESGRIMA
      case 'CLINCH':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full select-none">
            <defs>
              <radialGradient id="mat_clinch" cx="50%" cy="85%" r="65%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </radialGradient>
            </defs>
            <ellipse cx="100" cy="106" rx="80" ry="16" fill="url(#mat_clinch)" stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

            {/* Left Fighter Driving Forward with Collar Tie */}
            <circle cx="85" cy="42" r="9" fill="#fbcfe8" />
            <path d="M 74,52 L 95,50 L 102,86 L 68,86 Z" fill={topGiColor} stroke="#1e293b" strokeWidth="1.5" />
            <rect x="66" y="72" width="38" height="4" fill={topBeltColor} rx="1" />
            <path d="M 90,52 Q 108,44 116,42" fill="none" stroke={topGiColor} strokeWidth="5" strokeLinecap="round" />
            <path d="M 74,86 L 62,106 M 92,86 L 98,106" stroke={topGiColor} strokeWidth="6" strokeLinecap="round" />

            {/* Right Fighter Pummeling Underhook */}
            <circle cx="115" cy="42" r="9" fill="#fed7aa" />
            <path d="M 105,50 L 126,52 L 132,86 L 98,86 Z" fill={bottomGiColor} stroke="#1e293b" strokeWidth="1.5" />
            <rect x="96" y="72" width="38" height="4" fill={bottomBeltColor} rx="1" />
            <path d="M 108,60 Q 94,62 82,68" fill="none" stroke={bottomGiColor} strokeWidth="5" strokeLinecap="round" />
            <path d="M 106,86 L 102,106 M 126,86 L 138,106" stroke={bottomGiColor} strokeWidth="6" strokeLinecap="round" />

            {/* Head Clash Tension Line */}
            <path d="M 94,40 L 106,40" stroke="#f97316" strokeWidth="2" strokeDasharray="2 2" />
          </svg>
        );

      // 3. GUARDA FECHADA (Closed Guard)
      case 'CLOSED_GUARD':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full select-none">
            <defs>
              <radialGradient id="mat_guard" cx="50%" cy="80%" r="60%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </radialGradient>
            </defs>
            <ellipse cx="100" cy="100" rx="85" ry="16" fill="url(#mat_guard)" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

            {/* Guardeiro (Bottom Athlete - on back) */}
            <circle cx="58" cy="92" r="8" fill="#fbcfe8" />
            {/* Torso lying flat on mat */}
            <path d="M 66,88 L 122,88 L 118,102 L 64,102 Z" fill={bottomGiColor} stroke="#1e293b" strokeWidth="1.5" />
            <rect x="90" y="86" width="6" height="18" fill={bottomBeltColor} rx="1" />
            {/* Legs wrapping around passer's waist (Closed Lock!) */}
            <path d="M 112,88 Q 138,70 126,52 Q 110,48 94,66" fill="none" stroke={bottomGiColor} strokeWidth="7" strokeLinecap="round" />
            {/* Crossed Feet Ankle Lock Indicator */}
            <circle cx="126" cy="52" r="4.5" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="1" />
            {/* Arms controlling collar / sleeve */}
            <path d="M 72,90 Q 86,72 96,62" fill="none" stroke={bottomGiColor} strokeWidth="4.5" strokeLinecap="round" />

            {/* Passador (Top Athlete - inside guard maintaining posture) */}
            <circle cx="102" cy="38" r="9" fill="#fed7aa" />
            {/* Upright Torso */}
            <path d="M 92,48 L 114,48 L 122,78 L 86,78 Z" fill={topGiColor} stroke="#1e293b" strokeWidth="1.5" />
            <rect x="84" y="70" width="40" height="4" fill={topBeltColor} rx="1" />
            {/* Hands framing on hips/biceps to avoid sweeps */}
            <path d="M 94,52 Q 88,68 82,88 M 112,52 Q 118,68 116,88" fill="none" stroke={topGiColor} strokeWidth="4.5" strokeLinecap="round" />
            {/* Knees on tatame */}
            <ellipse cx="84" cy="98" rx="8" ry="4" fill={topGiColor} />
            <ellipse cx="120" cy="98" rx="8" ry="4" fill={topGiColor} />
          </svg>
        );

      // 4. GUARDA ABERTA / DE LA RIVA (Open Guard)
      case 'OPEN_GUARD':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full select-none">
            <defs>
              <radialGradient id="mat_open" cx="50%" cy="80%" r="60%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </radialGradient>
            </defs>
            <ellipse cx="100" cy="100" rx="85" ry="16" fill="url(#mat_open)" stroke="#06b6d4" strokeWidth="1" opacity="0.6" />

            {/* Bottom Guardeiro - dynamic hook */}
            <circle cx="56" cy="94" r="8" fill="#fbcfe8" />
            <path d="M 64,90 L 110,92 L 108,104 L 62,104 Z" fill={bottomGiColor} stroke="#1e293b" strokeWidth="1.5" />
            {/* De La Riva Hook wrapping outside passer's leg */}
            <path d="M 98,92 Q 120,78 128,70 Q 134,60 126,54" fill="none" stroke={bottomGiColor} strokeWidth="6" strokeLinecap="round" />
            {/* Foot on hip pushing */}
            <path d="M 94,90 Q 106,72 108,62" fill="none" stroke={bottomGiColor} strokeWidth="5.5" strokeLinecap="round" />
            {/* Sleeve grip pull */}
            <path d="M 68,90 Q 94,76 112,68" fill="none" stroke={bottomGiColor} strokeWidth="4" strokeLinecap="round" />

            {/* Standing / Squatting Passer fighting balance */}
            <circle cx="126" cy="38" r="9" fill="#fed7aa" />
            <path d="M 116,48 L 138,48 L 144,76 L 110,76 Z" fill={topGiColor} stroke="#1e293b" strokeWidth="1.5" />
            <rect x="108" y="70" width="38" height="4" fill={topBeltColor} rx="1" />
            {/* Legs fighting grips */}
            <path d="M 116,76 L 112,100 M 138,76 L 144,100" stroke={topGiColor} strokeWidth="6" strokeLinecap="round" />
            {/* Off-balance kinetic arrow */}
            <path d="M 148,46 Q 160,54 154,64" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 2" />
          </svg>
        );

      // 5. MEIA GUARDA (Half Guard)
      case 'HALF_GUARD':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full select-none">
            <defs>
              <radialGradient id="mat_half" cx="50%" cy="80%" r="60%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </radialGradient>
            </defs>
            <ellipse cx="100" cy="100" rx="85" ry="16" fill="url(#mat_half)" stroke="#8b5cf6" strokeWidth="1" opacity="0.6" />

            {/* Bottom Fighter (on side with underhook and leg weave) */}
            <circle cx="62" cy="88" r="8" fill="#fbcfe8" />
            <path d="M 68,82 L 112,84 L 110,98 L 66,98 Z" fill={bottomGiColor} stroke="#1e293b" strokeWidth="1.5" />
            {/* Legs triangling the trapped leg */}
            <path d="M 106,86 Q 128,84 136,92 Q 126,98 108,94" fill="none" stroke={bottomGiColor} strokeWidth="6" strokeLinecap="round" />
            {/* Underhook reaching up */}
            <path d="M 76,82 Q 92,66 104,58" fill="none" stroke={bottomGiColor} strokeWidth="4.5" strokeLinecap="round" />

            {/* Top Fighter (Crossface & Knee Slide Pressure) */}
            <circle cx="86" cy="52" r="9" fill="#fed7aa" />
            <path d="M 80,60 L 124,56 L 134,80 L 90,82 Z" fill={topGiColor} stroke="#1e293b" strokeWidth="1.5" />
            <rect x="92" y="74" width="38" height="4" fill={topBeltColor} rx="1" />
            {/* Crossface arm turning opponent head */}
            <path d="M 84,62 Q 72,70 60,78" fill="none" stroke={topGiColor} strokeWidth="5" strokeLinecap="round" />
            {/* Trapped Leg & Free Leg slicing */}
            <path d="M 124,78 L 132,92 M 110,80 L 100,98" stroke={topGiColor} strokeWidth="6" strokeLinecap="round" />
          </svg>
        );

      // 6. 100KG / CONTROLE LATERAL (Side Control - +3 PTS PASS)
      case 'SIDE_CONTROL':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full select-none">
            <defs>
              <radialGradient id="mat_side" cx="50%" cy="80%" r="65%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </radialGradient>
            </defs>
            <ellipse cx="100" cy="100" rx="85" ry="16" fill="url(#mat_side)" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />

            {/* Defender on bottom (flattened on back, framing) */}
            <circle cx="56" cy="94" r="8" fill="#fed7aa" />
            <path d="M 64,88 L 140,88 L 138,102 L 62,102 Z" fill={bottomGiColor} stroke="#1e293b" strokeWidth="1.5" />
            <rect x="98" y="86" width="6" height="18" fill={bottomBeltColor} rx="1" />
            {/* Defensive frames on hip and neck */}
            <path d="M 72,88 Q 84,76 88,68 M 80,90 Q 96,82 102,74" fill="none" stroke={bottomGiColor} strokeWidth="4" strokeLinecap="round" />

            {/* Attacker on Top (Perpendicular chest-to-chest pin) */}
            <circle cx="94" cy="46" r="9" fill="#fbcfe8" />
            {/* Torso lying across opponent */}
            <path d="M 82,54 L 116,52 L 126,82 L 84,84 Z" fill={topGiColor} stroke="#1e293b" strokeWidth="1.5" />
            <rect x="88" y="70" width="36" height="4" fill={topBeltColor} rx="1" />
            {/* Crossface arm under head and underhook under far arm */}
            <path d="M 84,54 Q 68,64 54,82 M 114,54 Q 130,68 136,82" fill="none" stroke={topGiColor} strokeWidth="5.5" strokeLinecap="round" />
            {/* Sprawled legs driving toes into mat */}
            <path d="M 112,80 L 142,94 M 94,82 L 96,104" stroke={topGiColor} strokeWidth="6" strokeLinecap="round" />

            {/* Heavy Pressure Downward Waves */}
            <path d="M 92,68 L 92,78 M 98,66 L 98,78 M 104,68 L 104,78" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      // 7. MONTADA COMPLETA (Mount - +4 PTS)
      case 'MOUNT':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full select-none">
            <defs>
              <radialGradient id="mat_mount" cx="50%" cy="80%" r="65%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </radialGradient>
            </defs>
            <ellipse cx="100" cy="102" rx="85" ry="16" fill="url(#mat_mount)" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />

            {/* Defender on bottom (flat on back pinned down) */}
            <circle cx="62" cy="95" r="8" fill="#fed7aa" />
            <path d="M 70,90 L 142,90 L 140,104 L 68,104 Z" fill={bottomGiColor} stroke="#1e293b" strokeWidth="1.5" />
            <rect x="100" y="88" width="6" height="18" fill={bottomBeltColor} rx="1" />
            {/* Defending hands protecting collar */}
            <path d="M 78,92 Q 88,80 94,72 M 82,94 Q 96,82 102,74" fill="none" stroke={bottomGiColor} strokeWidth="4" strokeLinecap="round" />

            {/* Dominant Attacker Sitting High on Mount */}
            <circle cx="100" cy="30" r="10" fill="#fbcfe8" />
            {/* Upright Posture */}
            <path d="M 88,40 L 112,40 L 118,74 L 82,74 Z" fill={topGiColor} stroke="#1e293b" strokeWidth="1.5" />
            <rect x="80" y="64" width="40" height="4" fill={topBeltColor} rx="1" />
            {/* Arms posting or attacking cross choke / armlock */}
            <path d="M 88,44 Q 74,62 76,84 M 112,44 Q 126,62 124,84" fill="none" stroke={topGiColor} strokeWidth="5" strokeLinecap="round" />
            {/* Knees clamped tightly to ribs on mat */}
            <ellipse cx="78" cy="88" rx="8" ry="6" fill={topGiColor} />
            <ellipse cx="122" cy="88" rx="8" ry="6" fill={topGiColor} />

            {/* Supreme Dominance Crown / Aura */}
            <path d="M 94,18 L 97,22 L 100,17 L 103,22 L 106,18" stroke="#fbbf24" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </svg>
        );

      // 8. COSTAS COM GANCHOS (Back Mount / Seatbelt - +4 PTS)
      case 'BACK_MOUNT':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full select-none">
            <defs>
              <radialGradient id="mat_back" cx="50%" cy="80%" r="65%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </radialGradient>
            </defs>
            <ellipse cx="100" cy="104" rx="85" ry="16" fill="url(#mat_back)" stroke="#ec4899" strokeWidth="1.5" opacity="0.7" />

            {/* Defender in front sitting/curled */}
            <circle cx="98" cy="48" r="8.5" fill="#fed7aa" />
            <path d="M 86,58 L 110,58 L 116,92 L 80,92 Z" fill={bottomGiColor} stroke="#1e293b" strokeWidth="1.5" />
            <rect x="82" y="80" width="34" height="4" fill={bottomBeltColor} rx="1" />
            {/* Two defending hands peeling the choke */}
            <path d="M 90,62 Q 94,54 100,52 M 106,62 Q 102,54 96,52" fill="none" stroke={bottomGiColor} strokeWidth="3.5" strokeLinecap="round" />

            {/* Attacker Behind (Backpack / Seatbelt Grip) */}
            <circle cx="102" cy="34" r="9" fill="#fbcfe8" />
            <path d="M 90,44 L 114,44 L 122,86 L 82,86 Z" fill={topGiColor} stroke="#1e293b" strokeWidth="1.5" opacity="0.9" />
            <rect x="84" y="72" width="38" height="4" fill={topBeltColor} rx="1" />
            {/* Seatbelt Grip wrapping over shoulder and under armpit */}
            <path d="M 94,46 Q 90,56 100,54 Q 110,56 108,46" fill="none" stroke={topGiColor} strokeWidth="5" strokeLinecap="round" />
            {/* Both Hooks In inside the thighs */}
            <path d="M 82,82 Q 74,90 86,96 M 118,82 Q 126,90 114,96" fill="none" stroke={topGiColor} strokeWidth="6" strokeLinecap="round" />

            {/* Mata Leão Threat Aura */}
            <circle cx="100" cy="50" r="8" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" className="animate-spin" />
          </svg>
        );

      // 9. TARTARUGA (Turtle Position)
      case 'TURTLE':
      default:
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full select-none">
            <defs>
              <radialGradient id="mat_turtle" cx="50%" cy="80%" r="65%">
                <stop offset="0%" stopColor="#64748b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </radialGradient>
            </defs>
            <ellipse cx="100" cy="102" rx="85" ry="16" fill="url(#mat_turtle)" stroke="#64748b" strokeWidth="1" opacity="0.6" />

            {/* Defender curled in tight 4-point turtle */}
            <circle cx="70" cy="80" r="8" fill="#fed7aa" />
            {/* Shell-like arched back */}
            <path d="M 66,74 Q 90,62 116,74 L 112,96 L 70,96 Z" fill={bottomGiColor} stroke="#1e293b" strokeWidth="1.5" />
            <rect x="88" y="72" width="6" height="24" fill={bottomBeltColor} rx="1" />
            {/* Elbows glued to knees */}
            <ellipse cx="78" cy="94" rx="6" ry="4" fill={bottomGiColor} />
            <ellipse cx="108" cy="94" rx="6" ry="4" fill={bottomGiColor} />

            {/* Attacker riding top-side looking for hooks / clock choke */}
            <circle cx="94" cy="38" r="9" fill="#fbcfe8" />
            <path d="M 84,48 L 120,46 L 128,76 L 86,78 Z" fill={topGiColor} stroke="#1e293b" strokeWidth="1.5" />
            <rect x="88" y="66" width="38" height="4" fill={topBeltColor} rx="1" />
            {/* Seatbelt claw or spiral ride arm */}
            <path d="M 90,52 Q 78,64 74,72 M 116,52 Q 106,68 100,76" fill="none" stroke={topGiColor} strokeWidth="5" strokeLinecap="round" />
            <path d="M 122,74 L 140,94 M 98,76 L 94,102" stroke={topGiColor} strokeWidth="6" strokeLinecap="round" />
          </svg>
        );
    }
  };

  // Get IBJJF points badge text for this position
  const getPointsBadge = () => {
    switch (position) {
      case 'MOUNT':
        return { label: '+4 PTS OFICIAIS', bg: 'bg-amber-500 text-black border-amber-300' };
      case 'BACK_MOUNT':
        return { label: '+4 PTS DE COSTAS', bg: 'bg-pink-500 text-white border-pink-300' };
      case 'SIDE_CONTROL':
        return { label: '+3 PTS DE PASSAGEM', bg: 'bg-emerald-500 text-black border-emerald-300' };
      case 'HALF_GUARD':
        return { label: 'MEIA GUARDA (TRANSIÇÃO)', bg: 'bg-purple-600 text-white border-purple-400' };
      case 'CLOSED_GUARD':
        return { label: 'GUARDA FECHADA', bg: 'bg-blue-600 text-white border-blue-400' };
      case 'OPEN_GUARD':
        return { label: 'GUARDA ABERTA', bg: 'bg-cyan-600 text-white border-cyan-400' };
      case 'STANDING':
        return { label: 'LUTA EM PÉ (QUEDA = +2)', bg: 'bg-zinc-800 text-slate-200 border-slate-600' };
      default:
        return null;
    }
  };

  const badge = getPointsBadge();

  return (
    <div className={`relative flex items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-b from-black/95 via-zinc-950 to-black border border-white/10 shadow-2xl ${sizeClasses[size]} ${className}`}>
      {/* Background radial gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none" />

      {/* Vector Scene */}
      <div className="w-full h-full flex items-center justify-center p-1">
        {renderPositionScene()}
      </div>

      {/* Official Points Pill Overlay */}
      {showPointsBadge && badge && size !== 'sm' && (
        <div className="absolute top-1.5 right-1.5 z-10 animate-fade-in">
          <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-black uppercase tracking-wider border shadow-md ${badge.bg}`}>
            {badge.label}
          </span>
        </div>
      )}
    </div>
  );
};
