import React, { useState, useEffect, useRef } from 'react';
import { playSound, speakCallItem, ALPHABET_POOL } from '../utils/bingoLogic';
import { BingoGameMode } from '../types';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  History,
  CheckCircle2,
  ListFilter,
  Eye
} from 'lucide-react';

interface TeacherCallerProps {
  calledNumbers: (number | string)[];
  setCalledNumbers: React.Dispatch<React.SetStateAction<(number | string)[]>>;
  soundEnabled: boolean;
  gameMode?: BingoGameMode;
  openVerifierModal: () => void;
}

export const TeacherCaller: React.FC<TeacherCallerProps> = ({
  calledNumbers,
  setCalledNumbers,
  soundEnabled,
  gameMode = 'numbers',
  openVerifierModal,
}) => {
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [autoDraw, setAutoDraw] = useState<boolean>(false);
  const [drawInterval, setDrawInterval] = useState<number>(5); // seconds
  const [timerCountdown, setTimerCountdown] = useState<number>(5);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isLetters = gameMode === 'letters';
  const totalItems = isLetters ? 26 : 100;
  const currentItem = calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] : null;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Call Next Random Item (Number or Letter)
  const drawNextItem = () => {
    let remaining: (number | string)[] = [];

    if (isLetters) {
      remaining = ALPHABET_POOL.filter((lettr) => !calledNumbers.includes(lettr));
    } else {
      for (let i = 1; i <= 100; i++) {
        if (!calledNumbers.includes(i)) {
          remaining.push(i);
        }
      }
    }

    if (remaining.length === 0) {
      alert(`All ${totalItems} ${isLetters ? 'letters' : 'numbers'} have been called!`);
      setAutoDraw(false);
      return;
    }

    const randomIndex = Math.floor(Math.random() * remaining.length);
    const nextItem = remaining[randomIndex];

    setCalledNumbers((prev) => [...prev, nextItem]);

    if (soundEnabled) {
      playSound('draw');
    }

    if (speechEnabled) {
      speakCallItem(nextItem);
    }
  };

  // Reset Game
  const handleResetGame = () => {
    if (window.confirm(`Reset called ${isLetters ? 'letters' : 'numbers'} list and start a fresh Bingo game?`)) {
      setCalledNumbers([]);
      setAutoDraw(false);
    }
  };

  // Handle Auto Draw Timer
  useEffect(() => {
    if (!autoDraw) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimerCountdown(drawInterval);
      return;
    }

    setTimerCountdown(drawInterval);

    timerRef.current = setInterval(() => {
      setTimerCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoDraw, drawInterval]);

  // Execute draw when timerCountdown hits 0
  useEffect(() => {
    if (autoDraw && timerCountdown === 0) {
      drawNextItem();
      setTimerCountdown(drawInterval);
    }
  }, [autoDraw, timerCountdown, drawInterval]);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-5">
      {/* Top Banner Control Panel */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Current Callout Display Sphere */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Current Callout ({isLetters ? 'A-Z Alphabet' : '1-100 Numbers'})</span>
            </span>

            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1 shadow-2xl shadow-indigo-500/40 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center p-2 relative overflow-hidden">
                {currentItem !== null ? (
                  <>
                    <span className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-200 drop-shadow-lg font-display tracking-tight">
                      {currentItem}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                      {isLetters ? `Letter ${currentItem}` : `Drawn #${calledNumbers.length}`}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-500 text-sm font-semibold text-center px-4">
                    Press CALL NEXT to start
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Caller Controls & Options */}
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Primary Call Button */}
              <button
                onClick={drawNextItem}
                disabled={calledNumbers.length >= totalItems}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 disabled:opacity-50 text-white font-extrabold text-base sm:text-lg tracking-wide shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                <span>CALL NEXT {isLetters ? 'LETTER' : 'NUMBER'}</span>
              </button>

              {/* Auto Draw Toggle */}
              <button
                onClick={() => setAutoDraw(!autoDraw)}
                className={`w-full py-3.5 px-5 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  autoDraw
                    ? 'bg-amber-500/20 border-amber-500/80 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {autoDraw ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
                <span>
                  {autoDraw ? `Auto Drawing in ${timerCountdown}s` : 'Start Auto Draw'}
                </span>
              </button>
            </div>

            {/* Sub-controls: Timer Interval, Voice, Reset, Verifier */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Interval:</span>
                <select
                  value={drawInterval}
                  onChange={(e) => setDrawInterval(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-xs font-semibold rounded-lg px-2 py-1 text-slate-200 focus:outline-none"
                >
                  <option value={3}>3 sec</option>
                  <option value={5}>5 sec</option>
                  <option value={8}>8 sec</option>
                  <option value={10}>10 sec</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {/* Speech Synth Toggle */}
                <button
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    speechEnabled
                      ? 'bg-indigo-950/60 border-indigo-600/60 text-indigo-300'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                  title="Toggle Voice Caller"
                >
                  {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>Voice Caller</span>
                </button>

                {/* Claim Verifier */}
                <button
                  onClick={openVerifierModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 hover:bg-slate-700 text-xs font-medium transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify Student</span>
                </button>

                {/* Reset Game */}
                <button
                  onClick={handleResetGame}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-rose-400 hover:bg-slate-700 text-xs font-medium transition-all"
                  title="Reset Called Items"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Called Reels */}
      {calledNumbers.length > 0 && (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-400 shrink-0 pr-2 border-r border-slate-700">
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>Recent:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {calledNumbers
              .slice(-10)
              .reverse()
              .map((item, idx) => (
                <span
                  key={`recent-${item}-${idx}`}
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold shrink-0 ${
                    idx === 0
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md animate-pulse'
                      : 'bg-slate-900 text-indigo-200 border border-slate-700'
                  }`}
                >
                  {isLetters ? `Letter ${item}` : `#${item}`}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Master Board */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Caller Master Board ({isLetters ? 'Alphabet A–Z' : 'Numbers 1–100'})</span>
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {calledNumbers.length} / {totalItems} Called
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              <Eye className="w-3 h-3" /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              <ListFilter className="w-3 h-3" /> Order
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className={`grid ${isLetters ? 'grid-cols-6 sm:grid-cols-9' : 'grid-cols-10'} gap-1.5 pt-1`}>
            {(isLetters ? ALPHABET_POOL : Array.from({ length: 100 }, (_, i) => i + 1)).map((item) => {
              const isCalled = calledNumbers.includes(item);
              const isLatest = currentItem === item;

              return (
                <div
                  key={`master-${item}`}
                  className={`
                    aspect-square rounded-xl flex items-center justify-center font-bold text-sm sm:text-base transition-all
                    ${
                      isLatest
                        ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 font-black scale-110 z-10 animate-bounce shadow-lg shadow-amber-400/40'
                        : isCalled
                        ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                        : 'bg-slate-900/80 text-slate-500 border border-slate-800'
                    }
                  `}
                >
                  {item}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 min-h-32 max-h-60 overflow-y-auto">
            {calledNumbers.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-6">
                No {isLetters ? 'letters' : 'numbers'} called yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {calledNumbers.map((item, idx) => (
                  <span
                    key={`called-order-${item}-${idx}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-indigo-300"
                  >
                    <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                    <strong className="text-white text-sm">{item}</strong>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
