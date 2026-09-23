import React from 'react';
import {
  HelpCircle,
  Smartphone,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  Trophy,
  User,
  Volume2
} from 'lucide-react';

interface InstructionsViewProps {
  onBackToCard: () => void;
  openAppsScriptModal: () => void;
}

export const InstructionsView: React.FC<InstructionsViewProps> = ({
  onBackToCard,
  openAppsScriptModal,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 text-slate-200">
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-600/30">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">How to Play Classroom Bingo</h2>
            <p className="text-xs text-slate-400">
              Complete guide for students playing on phones and teachers calling numbers
            </p>
          </div>
        </div>

        {/* Student Section */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-indigo-300 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            <span>For Students (Playing on Phones)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-400" /> 1. Enter Your Name
              </span>
              <p className="text-slate-400 leading-relaxed">
                Type your Name at the top of your card before starting so your victory can be verified and credited to you.
              </p>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> 2. Mark Numbers Called
              </span>
              <p className="text-slate-400 leading-relaxed">
                Listen to your teacher call numbers from 1 to 100. Tap the corresponding numbers on your screen to daub them!
              </p>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-yellow-400" /> 3. Claim Bingo!
              </span>
              <p className="text-slate-400 leading-relaxed">
                Form a complete horizontal row, vertical column, diagonal line, or 4 corners and tap <strong>CLAIM BINGO</strong> to trigger celebration fireworks!
              </p>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> 4. Saved to Google Sheet
              </span>
              <p className="text-slate-400 leading-relaxed">
                Your name, timestamp, winning numbers, and proof code will be automatically sent to the teacher's Google Sheet!
              </p>
            </div>
          </div>
        </div>

        {/* Teacher Section */}
        <div className="space-y-3 pt-2 border-t border-slate-700/60">
          <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-purple-400" />
            <span>For Teachers (Caller & Verification Host)</span>
          </h3>

          <ul className="space-y-2 text-xs text-slate-300 list-disc pl-5">
            <li>
              Switch to <strong>Teacher Caller</strong> mode from the top bar to draw random numbers from 1 to 100 on your projector screen.
            </li>
            <li>
              Turn on <strong>Voice Caller</strong> to let the browser automatically speak numbers out loud for the room!
            </li>
            <li>
              Connect your <strong>Google Sheet</strong> in 2 minutes by clicking <strong>Google Sheet</strong> in the top navbar and pasting your Web App URL.
            </li>
            <li>
              Use <strong>Verify Claim</strong> to quickly check any student's Card Seed code against the list of numbers called in current game.
            </li>
          </ul>
        </div>

        {/* Action button */}
        <div className="pt-3 flex flex-col sm:flex-row gap-2">
          <button
            onClick={onBackToCard}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-sm transition-all shadow-lg"
          >
            Start Playing Bingo
          </button>
          <button
            onClick={openAppsScriptModal}
            className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-sm border border-slate-700 transition-all"
          >
            Setup Google Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
