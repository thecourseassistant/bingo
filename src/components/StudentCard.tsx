import React, { useState, useEffect } from 'react';
import {
  BingoCell,
  BoardConfig,
  DauberStyle,
  WinResult
} from '../types';
import {
  checkWinCondition,
  generateProofCode
} from '../utils/bingoLogic';
import {
  Trophy,
  User,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface StudentCardProps {
  cells: BingoCell[];
  setCells: React.Dispatch<React.SetStateAction<BingoCell[]>>;
  config: BoardConfig;
  studentName: string;
  studentId: string;
  onBingoTriggered: (winResult: WinResult, proofCode: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  cells,
  setCells,
  config,
  studentName,
  studentId,
  onBingoTriggered,
}) => {
  const [winResult, setWinResult] = useState<WinResult>({
    hasWon: false,
    patternName: 'None',
    winningCellIds: [],
    winningNumbers: [],
  });

  const gridSize = 4;

  // Evaluate win status whenever cells change
  useEffect(() => {
    const res = checkWinCondition(cells, gridSize);
    setWinResult(res);
  }, [cells]);

  // Toggle cell mark state
  const handleCellClick = (cellId: string) => {
    setCells((prevCells) =>
      prevCells.map((cell) => {
        if (cell.id === cellId) {
          return { ...cell, isMarked: !cell.isMarked };
        }
        return cell;
      })
    );
  };

  // Reset all marks on current card
  const handleResetMarks = () => {
    if (window.confirm('Reset marked numbers on this board?')) {
      setCells((prev) =>
        prev.map((c) => ({
          ...c,
          isMarked: false,
        }))
      );
    }
  };

  // Trigger Bingo Win Claim
  const handleClaimBingo = () => {
    const currentWin = checkWinCondition(cells, gridSize);

    if (!currentWin.hasWon) {
      alert('No complete horizontal, vertical, or diagonal line detected yet!');
      return;
    }

    const proof = generateProofCode(studentName, config.cardSeed, cells);
    onBingoTriggered(currentWin, proof);
  };

  // Dauber style color mappings
  const getDauberStyles = (style: DauberStyle) => {
    switch (style) {
      case 'stamp-red':
        return 'bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-red-500/50 border-red-400';
      case 'stamp-blue':
        return 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/50 border-cyan-300';
      case 'star-gold':
        return 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 shadow-amber-500/50 border-amber-200';
      case 'heart-pink':
        return 'bg-gradient-to-tr from-pink-500 to-fuchsia-600 text-white shadow-pink-500/50 border-pink-300';
      case 'emerald-check':
        return 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-emerald-500/50 border-emerald-300';
      case 'purple-sparkle':
        return 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-purple-500/50 border-purple-300';
      default:
        return 'bg-indigo-600 text-white shadow-indigo-500/50 border-indigo-400';
    }
  };

  return (
    <div className="max-w-md mx-auto px-2 sm:px-4 py-3 space-y-3.5">
      {/* Student Badge & Name Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
            <User className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-extrabold text-white truncate leading-tight">
                {studentName || 'Student'}
              </h2>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                config.gameMode === 'letters'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              }`}>
                {config.gameMode === 'letters' ? '🔤 Alphabet' : '🔢 Numbers'}
              </span>
            </div>
            {studentId && (
              <p className="text-[11px] text-slate-400 truncate">
                {studentId}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleResetMarks}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700 flex items-center gap-1 text-xs font-semibold"
          title="Reset Marks"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Marks</span>
        </button>
      </div>

      {/* Win Status Indicator */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${winResult.hasWon ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
          <span className="text-xs font-semibold text-slate-300">
            Line Status:{' '}
            <strong className={winResult.hasWon ? 'text-emerald-400 font-extrabold' : 'text-slate-400 font-medium'}>
              {winResult.hasWon ? `BINGO! (${winResult.patternName})` : 'Marking numbers...'}
            </strong>
          </span>
        </div>

        {winResult.hasWon && (
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse">
            Ready to Claim!
          </span>
        )}
      </div>

      {/* 4x4 BINGO CARD GRID */}
      <div className="bg-slate-900 border-2 border-indigo-500/30 rounded-3xl p-3 sm:p-4 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {cells.map((cell) => {
            const isWinningCell = winResult.winningCellIds.includes(cell.id);

            return (
              <button
                key={cell.id}
                onClick={() => handleCellClick(cell.id)}
                className={`
                  relative aspect-square rounded-2xl font-black text-2xl sm:text-3xl flex flex-col items-center justify-center
                  transition-all duration-200 transform active:scale-95 touch-manipulation select-none
                  border shadow-md
                  ${
                    cell.isMarked
                      ? isWinningCell
                        ? 'bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-300 text-slate-950 border-amber-300 shadow-amber-500/50 scale-105 z-10 animate-pulse'
                        : `${getDauberStyles(config.dauberStyle)} scale-100`
                      : 'bg-slate-950/90 border-slate-800 text-slate-100 hover:bg-slate-800/80 hover:border-slate-700'
                  }
                `}
              >
                <span className={`leading-none font-extrabold ${cell.isMarked ? 'drop-shadow-md' : ''}`}>
                  {cell.value}
                </span>

                {cell.isMarked && (
                  <span className="absolute inset-0 rounded-2xl ring-2 ring-white/40 flex items-center justify-center pointer-events-none">
                    <Check className="w-7 h-7 sm:w-8 h-8 text-white/90 drop-shadow-md" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* BIG BINGO CLAIM BUTTON */}
      <div className="pt-1">
        <button
          onClick={handleClaimBingo}
          className={`
            w-full py-4 px-6 rounded-2xl font-black text-xl sm:text-2xl tracking-wider uppercase
            flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl transform active:scale-95
            ${
              winResult.hasWon
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-500/40 hover:brightness-110 ring-4 ring-amber-400/40 animate-pulse'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-indigo-600/30 hover:brightness-110'
            }
          `}
        >
          <Trophy className="w-7 h-7" />
          <span>{winResult.hasWon ? 'CLAIM BINGO WIN!' : 'CLICK TO CLAIM BINGO'}</span>
        </button>
      </div>
    </div>
  );
};
