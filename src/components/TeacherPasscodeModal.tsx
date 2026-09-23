import React, { useState } from 'react';
import { Lock, KeyRound, X, ArrowRight } from 'lucide-react';

interface TeacherPasscodeModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const TeacherPasscodeModal: React.FC<TeacherPasscodeModalProps> = ({
  onSuccess,
  onClose,
}) => {
  const [passcode, setPasscode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const TEACHER_PASSCODE = '147852';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === TEACHER_PASSCODE) {
      setError('');
      onSuccess();
    } else {
      setError('Incorrect passcode! Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-white space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Teacher Center</h2>
          <p className="text-xs text-slate-400">
            Enter the 6-digit teacher passcode to access controls
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              maxLength={6}
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                if (error) setError('');
              }}
              className="w-full text-center tracking-widest text-xl font-mono py-3 bg-slate-950 border border-slate-700 rounded-2xl text-white focus:outline-none focus:border-indigo-500"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-rose-400 text-center animate-shake">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30"
          >
            <span>Access Teacher Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
