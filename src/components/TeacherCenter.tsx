import React, { useState } from 'react';
import { TeacherCaller } from './TeacherCaller';
import {
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Github,
  ArrowLeft,
  Lock
} from 'lucide-react';

interface TeacherCenterProps {
  calledNumbers: number[];
  setCalledNumbers: React.Dispatch<React.SetStateAction<number[]>>;
  soundEnabled: boolean;
  scriptUrlConfigured: boolean;
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
  onOpenVerifier,
  onOpenAppsScript,
  onOpenGithub,
  onExitTeacherCenter,
}) => {
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
                Number generator caller & Google Sheets verification hub
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

      {/* Teacher Number Caller */}
      <TeacherCaller
        calledNumbers={calledNumbers}
        setCalledNumbers={setCalledNumbers}
        soundEnabled={soundEnabled}
        openVerifierModal={onOpenVerifier}
      />
    </div>
  );
};
