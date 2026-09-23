import React, { useState } from 'react';
import { TeacherCaller } from './TeacherCaller';
import { BingoGameMode } from '../types';
import {
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Github,
  ArrowLeft,
  Lock,
  Share2,
  Copy,
  Check,
  Link2,
  Type,
  Hash
} from 'lucide-react';

interface TeacherCenterProps {
  calledNumbers: (number | string)[];
  setCalledNumbers: React.Dispatch<React.SetStateAction<(number | string)[]>>;
  soundEnabled: boolean;
  scriptUrlConfigured: boolean;
  scriptUrl?: string;
  gameMode: BingoGameMode;
  onToggleGameMode: (mode: BingoGameMode) => void;
  onOpenVerifier: () => void;
  onOpenAppsScript: () => void;
  onOpenGithub: () => void;
  onExitTeacherCenter: () => void;
}

export const TeacherCenter: React.FC<TeacherCenterProps> = ({
  calledNumbers,
  setCalledNumbers,
  soundEnabled,
  scriptUrlConfigured,
  scriptUrl = '',
  gameMode,
  onToggleGameMode,
  onOpenVerifier,
  onOpenAppsScript,
  onOpenGithub,
  onExitTeacherCenter,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate Student Game Link with embedded mode & Apps Script URL
  const getStudentShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const params = new URLSearchParams();
    params.set('gameMode', gameMode);
    if (scriptUrl && scriptUrl.trim() !== '') {
      params.set('scriptUrl', scriptUrl.trim());
    }
    return `${origin}${pathname}?${params.toString()}`;
  };

  const handleCopyLink = () => {
    const link = getStudentShareUrl();
    if (link) {
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto px-2 sm:px-4 py-3 animate-fadeIn">
      {/* Teacher Top Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitTeacherCenter}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Student View</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                Teacher Control Center
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Number & Alphabet Caller Generator with Google Sheet Sync
              </p>
            </div>
          </div>
        </div>

        {/* Teacher Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenVerifier}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-bold transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Verify Claims</span>
          </button>

          <button
            onClick={onOpenAppsScript}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              scriptUrlConfigured
                ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-amber-950/40 border-amber-600/50 text-amber-300 hover:bg-amber-900/40'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Google Sheet</span>
          </button>

          <button
            onClick={onOpenGithub}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="GitHub Pages Guide"
          >
            <Github className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Switcher Banner: Numbers vs Alphabet Mode */}
      <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>BINGO GAME MODE SELECTION</span>
            </h3>
            <p className="text-xs text-slate-400">
              Toggle between Numbers (1-100) or English Alphabet (A-Z). Changing mode updates all student devices when opening the game link.
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 self-stretch sm:self-auto">
            <button
              onClick={() => onToggleGameMode('numbers')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                gameMode === 'numbers'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Hash className="w-4 h-4 text-amber-300" />
              <span>Numbers (1-100)</span>
            </button>

            <button
              onClick={() => onToggleGameMode('letters')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                gameMode === 'letters'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Alphabet (A-Z)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Student Game Link Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-xs sm:text-sm">
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>Student Game Link (Mode: {gameMode === 'letters' ? '🔤 Alphabet A-Z' : '🔢 Numbers 1-100'})</span>
            {scriptUrlConfigured ? (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Google Sheet Linked
              </span>
            ) : (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                No Sheet Linked Yet
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300">
            {scriptUrlConfigured
              ? `When students open this link, they will get the ${gameMode === 'letters' ? 'Alphabet A-Z' : 'Numbers 1-100'} board and auto-post wins to your Google Sheet!`
              : 'Click "Google Sheet" above to attach your Google Sheet URL before sharing with students.'}
          </p>
        </div>

        <button
          onClick={handleCopyLink}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 shrink-0"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              <span>Copy Student Link</span>
            </>
          )}
        </button>
      </div>

      {/* Teacher Number / Letter Caller */}
      <TeacherCaller
        calledNumbers={calledNumbers}
        setCalledNumbers={setCalledNumbers}
        soundEnabled={soundEnabled}
        gameMode={gameMode}
        openVerifierModal={onOpenVerifier}
      />
    </div>
  );
};
