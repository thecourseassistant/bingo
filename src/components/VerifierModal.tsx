import React, { useState } from 'react';
import { generateBoardCells, checkWinCondition } from '../utils/bingoLogic';
import {
  CheckCircle2,
  XCircle,
  Search,
  ShieldCheck,
  X,
  Sparkles
} from 'lucide-react';

interface VerifierModalProps {
  calledNumbers: number[];
  onClose: () => void;
}

export const VerifierModal: React.FC<VerifierModalProps> = ({
  calledNumbers,
  onClose,
}) => {
  const [inputSeed, setInputSeed] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [gridSize, setGridSize] = useState<number>(5);
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    isLegit: boolean;
    pattern: string;
    matchedNumbers: number[];
    missingNumbers: number[];
  } | null>(null);

  const handleVerify = () => {
    if (!inputSeed || inputSeed.trim() === '') {
      alert('Please enter the student Card Seed code to reconstruct and verify their board.');
      return;
    }

    // Reconstruct student card with seed
    const boardCells = generateBoardCells(gridSize as 3 | 4 | 5, 100, true, inputSeed.trim());

    // Mark cells that match called numbers
    const markedCells = boardCells.map((cell) => {
      if (cell.isFree) return { ...cell, isMarked: true };
      const isCalled = typeof cell.value === 'number' && calledNumbers.includes(cell.value);
      return { ...cell, isMarked: isCalled };
    });

    const winCheck = checkWinCondition(markedCells, gridSize as 3 | 4 | 5);

    setVerificationResult({
      tested: true,
      isLegit: winCheck.hasWon,
      pattern: winCheck.patternName,
      matchedNumbers: winCheck.winningNumbers.filter((n) => typeof n === 'number') as number[],
      missingNumbers: [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-white space-y-5 my-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Teacher Claim Verifier</h2>
            <p className="text-xs text-slate-400">
              Verify if a student's Bingo claim matches called numbers
            </p>
          </div>
        </div>

        {/* Verification Inputs */}
        <div className="space-y-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Student Card Seed Code:
            </label>
            <input
              type="text"
              placeholder="e.g. CARD-8A92 or CLASS-SEED"
              value={inputSeed}
              onChange={(e) => setInputSeed(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Proof Code (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. BNG-7A9-F22"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400 font-medium">Grid Size:</span>
            <select
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 text-xs font-bold rounded-lg px-2.5 py-1 text-slate-200"
            >
              <option value={3}>3 x 3</option>
              <option value={4}>4 x 4</option>
              <option value={5}>5 x 5</option>
            </select>
          </div>

          <button
            onClick={handleVerify}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-600/30"
          >
            <Search className="w-4 h-4" />
            <span>Verify Student Claim</span>
          </button>
        </div>

        {/* Verification Result Display */}
        {verificationResult && (
          <div
            className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${
              verificationResult.isLegit
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200'
                : 'bg-rose-950/80 border-rose-500/80 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {verificationResult.isLegit ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
              )}
              <h3 className="text-base font-extrabold uppercase">
                {verificationResult.isLegit ? 'VERIFIED LEGIT BINGO!' : 'INVALID / UNFINISHED CLAIM'}
              </h3>
            </div>

            {verificationResult.isLegit ? (
              <div className="text-xs space-y-1 pt-1">
                <p>
                  <strong>Winning Pattern:</strong> {verificationResult.pattern}
                </p>
                <p className="truncate">
                  <strong>Winning Numbers Called:</strong>{' '}
                  {verificationResult.matchedNumbers.join(', ')}
                </p>
              </div>
            ) : (
              <p className="text-xs text-rose-300">
                This student card layout does NOT have a full line or winning pattern formed from the numbers currently called.
              </p>
            )}
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
