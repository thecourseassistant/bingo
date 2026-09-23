import React, { useState } from 'react';
import { User, Sparkles, ArrowRight } from 'lucide-react';

interface StudentNamePageProps {
  studentName: string;
  setStudentName: (name: string) => void;
  studentId: string;
  setStudentId: (id: string) => void;
  onStartGame: () => void;
  onOpenTeacherPasscode: () => void;
}

export const StudentNamePage: React.FC<StudentNamePageProps> = ({
  studentName,
  setStudentName,
  studentId,
  setStudentId,
  onStartGame,
  onOpenTeacherPasscode,
}) => {
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || studentName.trim() === '') {
      setError('Please enter your name to start playing.');
      return;
    }
    setError('');
    onStartGame();
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 max-w-md mx-auto animate-fadeIn">
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white font-extrabold text-2xl shadow-xl shadow-indigo-600/30 mb-2">
            B
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Classroom Bingo
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Enter your details below to join the game
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Your Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4 text-indigo-400" />
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Alex Smith"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-base font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Class / Student ID <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Grade 5 / #12"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-rose-400 text-center animate-shake">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 text-white font-extrabold text-lg shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <span>JOIN BINGO GAME</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Discree Teacher Passcode Trigger */}
        <div className="pt-2 text-center border-t border-slate-800">
          <button
            onClick={onOpenTeacherPasscode}
            className="text-[11px] text-slate-500 hover:text-slate-400 transition-all font-medium py-1 px-3 rounded-lg hover:bg-slate-800/50"
          >
            Teacher Center Access
          </button>
        </div>
      </div>
    </div>
  );
};
