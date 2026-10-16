import React from 'react';
import { CombatState, GridCoord } from '../../types/combat';
import { Athlete } from '../../types/athlete';
import { CombatCard } from '../../types/cards';
import { AthleteToken } from './AthleteToken';
import { CombatEngine } from '../../engine/combatEngine';

interface TacticalBoardProps {
  combatState: CombatState;
  player: Athlete;
  opponent: Athlete;
  selectedCard: CombatCard | null;
  onCellClick?: (coord: GridCoord) => void;
}

export const TacticalBoard: React.FC<TacticalBoardProps> = ({
  combatState,
  player,
  opponent,
  selectedCard,
  onCellClick
}) => {
  const { grid, technical } = combatState;
  const pPos = grid.playerPosition;
  const oPos = grid.opponentPosition;

  const distance = CombatEngine.getBoardDistance(pPos, oPos);

  // Determine current active zone
  const getZoneLabel = () => {
    if (technical.position !== 'STANDING' && technical.position !== 'CLINCH') {
      return {
        title: 'ZONA 3: COMBATE NO CHÃO',
        desc: 'Disputa de guarda, passagens, raspagens e finalizações na arte suave.',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      };
    }
    if (distance <= 1) {
      return {
        title: 'ZONA 2: ENGAJAMENTO & QUEDAS',
        desc: 'Corpo a corpo: pegadas de gola, esgrima e ataques explosivos de projeção.',
        badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40'
      };
    }
    return {
      title: 'ZONA 1: DISTÂNCIA EM PÉ',
      desc: 'Fintas, estudo de base e controle de posicionamento no tatame.',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
    };
  };

  const zone = getZoneLabel();

  // Column letters (A to G)
  const COL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  // Check if a cell is an advance target when selected card has movement
  const isTargetCell = (x: number, y: number) => {
    if (!selectedCard?.causesMovement) return false;
    if (selectedCard.causesMovement.type === 'advance') {
      // Advancing to the right
      return x === pPos.x + 1 && y === pPos.y && x < oPos.x;
    }
    if (selectedCard.causesMovement.type === 'retreat') {
      // Retreating to the left
      return x === pPos.x - 1 && y === pPos.y && x >= 0;
    }
    return false;
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Zone Status Banner */}
      <div className="w-full mb-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-zinc-950/80 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${zone.badgeBg}`}
          >
            {zone.title}
          </span>
          <span className="text-xs text-slate-300 hidden sm:inline">
            {zone.desc}
          </span>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Distância: <span className="text-amber-400 font-bold">{distance} {distance === 1 ? 'casa' : 'casas'}</span>
        </div>
      </div>

      {/* The 7x5 Tactical Arena Mat (Tatame) */}
      <div className="relative p-3 md:p-5 rounded-2xl bg-gradient-to-b from-[#10141f] via-[#0d101a] to-[#080a12] border-2 border-amber-600/40 shadow-tatame overflow-hidden w-full">
        {/* Championship Mat Outer Safety Border (Linha Amarela & Vermelha Oficial) */}
        <div className="absolute inset-2 border-2 border-dashed border-amber-500/30 rounded-xl pointer-events-none" />
        <div className="absolute inset-1 border border-red-600/20 rounded-xl pointer-events-none" />

        {/* Subtle Watermark IBJJF Tatame Circle */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="w-72 h-72 rounded-full border-8 border-white flex items-center justify-center">
            <span className="text-5xl font-black font-title tracking-widest text-white">
              BJJ
            </span>
          </div>
        </div>

        {/* Column Letters Bar */}
        <div className="grid grid-cols-7 mb-1 text-center font-mono text-[10px] md:text-xs text-slate-500 font-bold select-none">
          {COL_LETTERS.map((col) => (
            <div key={col}>{col}</div>
          ))}
        </div>

        {/* 7x5 Matrix Cells Grid */}
        <div className="grid grid-cols-7 gap-1 md:gap-1.5 relative z-10">
          {Array.from({ length: grid.rows }).map((_, y) => (
            <React.Fragment key={`row_${y}`}>
              {Array.from({ length: grid.cols }).map((_, x) => {
                const isPlayerHere = pPos.x === x && pPos.y === y;
                const isOpponentHere = oPos.x === x && oPos.y === y;
                const isBothHere = isPlayerHere && isOpponentHere;
                const isTarget = isTargetCell(x, y);

                // Is perimeter border tile?
                const isEdge =
                  x === 0 || x === grid.cols - 1 || y === 0 || y === grid.rows - 1;

                return (
                  <div
                    key={`cell_${x}_${y}`}
                    onClick={() => {
                      if (onCellClick) onCellClick({ x, y });
                    }}
                    className={`relative aspect-square rounded-lg border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                      isEdge
                        ? 'bg-[#121829]/70 border-slate-800/80 hover:bg-[#1e293b]/70'
                        : 'bg-[#182035]/90 border-slate-700/60 hover:bg-[#253252]'
                    } ${
                      isTarget
                        ? 'ring-2 ring-amber-400 bg-amber-500/20 animate-pulse'
                        : ''
                    } shadow-inner`}
                  >
                    {/* Small cell coordinate tag */}
                    <span className="absolute top-0.5 left-1 text-[8px] font-mono text-slate-600 select-none">
                      {COL_LETTERS[x]}{y + 1}
                    </span>

                    {/* Both Fighters in Close Clinch or Ground Position */}
                    {isBothHere ? (
                      <div className="relative flex items-center justify-center -space-x-4">
                        <AthleteToken
                          athlete={player}
                          isPlayer={true}
                          facing="right"
                          isInSubmissionDanger={
                            combatState.technical.activeSubmission?.defenderId ===
                            player.id
                          }
                          isCurrentTurn={combatState.currentTurn === 'player'}
                          size="compact"
                        />
                        <AthleteToken
                          athlete={opponent}
                          isPlayer={false}
                          facing="left"
                          isInSubmissionDanger={
                            combatState.technical.activeSubmission?.defenderId ===
                            opponent.id
                          }
                          isCurrentTurn={combatState.currentTurn === 'opponent'}
                          size="compact"
                        />
                      </div>
                    ) : (
                      <>
                        {/* Player Token */}
                        {isPlayerHere && (
                          <AthleteToken
                            athlete={player}
                            isPlayer={true}
                            facing="right"
                            isInSubmissionDanger={
                              combatState.technical.activeSubmission?.defenderId ===
                              player.id
                            }
                            isCurrentTurn={combatState.currentTurn === 'player'}
                            size="normal"
                          />
                        )}

                        {/* Opponent Token */}
                        {isOpponentHere && (
                          <AthleteToken
                            athlete={opponent}
                            isPlayer={false}
                            facing="left"
                            isInSubmissionDanger={
                              combatState.technical.activeSubmission?.defenderId ===
                              opponent.id
                            }
                            isCurrentTurn={combatState.currentTurn === 'opponent'}
                            size="normal"
                          />
                        )}
                      </>
                    )}

                    {/* Target highlight ring */}
                    {isTarget && (
                      <div className="absolute inset-0 rounded-lg border-2 border-amber-400 pointer-events-none flex items-center justify-center">
                        <span className="text-[10px] font-mono text-amber-300 font-black">
                          AVANÇAR
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Dynamic Action FX Notification Banner */}
        {combatState.lastActionFx && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce">
            <div
              className={`px-4 py-1.5 rounded-full font-title text-sm md:text-base font-black uppercase tracking-wider shadow-2xl border ${
                combatState.lastActionFx.type === 'tapout'
                  ? 'bg-red-700 text-white border-red-400 ring-4 ring-red-500'
                  : combatState.lastActionFx.type === 'submission_danger'
                  ? 'bg-purple-900 text-purple-200 border-purple-500 ring-2 ring-purple-400'
                  : combatState.lastActionFx.type === 'takedown' ||
                    combatState.lastActionFx.type === 'pass' ||
                    combatState.lastActionFx.type === 'mount' ||
                    combatState.lastActionFx.type === 'sweep'
                  ? 'bg-amber-500 text-black border-amber-300 ring-2 ring-amber-400'
                  : 'bg-zinc-900/95 text-slate-200 border-slate-600'
              }`}
            >
              {combatState.lastActionFx.text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
