import React from 'react';
import { Lock } from 'lucide-react';

interface NavbarProps {
  onOpenTeacherPasscode: () => void;
  isTeacherCenterActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTeacherPasscode,
  isTeacherCenterActive,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3 py-2.5 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-extrabold text-base">
            B
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent leading-tight">
              Classroom Bingo
            </h1>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Teacher Center Trigger */}
          <button
            onClick={onOpenTeacherPasscode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isTeacherCenterActive
                ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Access Teacher Center"
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xs:inline">Teacher Center</span>
          </button>
        </div>
      </div>
    </header>
  );
};
