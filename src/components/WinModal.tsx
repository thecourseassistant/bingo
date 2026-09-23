import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { WinResult, SubmissionData } from '../types';
import { submitResultToGoogleSheet } from '../utils/bingoLogic';
import {
  Trophy,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Share2,
  Copy,
  Check,
  X,
  Sparkles,
  Award
} from 'lucide-react';

interface WinModalProps {
  winResult: WinResult;
  proofCode: string;
  studentName: string;
  studentId: string;
  cardSeed: string;
  gridSize: number;
  scriptUrl: string;
  onClose: () => void;
  openAppsScriptModal: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  winResult,
  proofCode,
  studentName,
  studentId,
  cardSeed,
  gridSize,
  scriptUrl,
  onClose,
  openAppsScriptModal,
}) => {
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const formattedTimestamp = new Date().toLocaleString();

  // Trigger celebration confetti cannons on mount
  useEffect(() => {
    // Canvas confetti burst
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f59e0b', '#6366f1', '#ec4899', '#10b981'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f59e0b', '#6366f1', '#ec4899', '#10b981'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Auto-submit to Google Sheet if scriptUrl is set
    if (scriptUrl && scriptUrl.trim() !== '') {
      handleSaveToSheet();
    }
  }, []);

  const handleSaveToSheet = async () => {
    if (!scriptUrl || scriptUrl.trim() === '') {
      setSubmissionStatus('error');
      setStatusMessage('Google Apps Script URL is missing. Click configure below to set it up.');
      return;
    }

    setSubmissionStatus('submitting');
    setStatusMessage('Saving result to Google Sheet...');

    const payload: SubmissionData = {
      studentName,
      studentId: studentId || 'N/A',
      timestamp: formattedTimestamp,
      winPattern: winResult.patternName,
      winningNumbers: winResult.winningNumbers.join(', '),
      cardSeed,
      gridSize,
      proofCode,
    };

    const res = await submitResultToGoogleSheet(scriptUrl, payload);

    if (res.success) {
      setSubmissionStatus('success');
      setStatusMessage(res.message);
    } else {
      setSubmissionStatus('error');
      setStatusMessage(res.message);
    }
  };

  const proofText = `🎉 BINGO WIN PROOF 🎉
Name: ${studentName} ${studentId ? `(${studentId})` : ''}
Pattern: ${winResult.patternName}
Winning Numbers: ${winResult.winningNumbers.join(', ')}
Proof Code: ${proofCode}
Card Seed: ${cardSeed}
Date: ${formattedTimestamp}`;

  const handleCopyProof = () => {
    navigator.clipboard.writeText(proofText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-400/80 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-white space-y-5 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Victory Header Banner */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-xl shadow-amber-500/30 animate-bounce">
            <Trophy className="w-9 h-9" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 uppercase font-display">
            BINGO VICTORY!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-semibold">
            Congratulations <strong className="text-white underline">{studentName}</strong>! Your win is confirmed.
          </p>
        </div>

        {/* Verification Summary Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs font-medium">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-400">Winning Pattern:</span>
            <span className="font-extrabold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              {winResult.patternName}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-400">Winning Numbers:</span>
            <span className="font-bold text-indigo-300 max-w-[200px] truncate text-right">
              {winResult.winningNumbers.join(', ')}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-400">Proof Verification Code:</span>
            <code className="font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded text-sm tracking-widest">
              {proofCode}
            </code>
          </div>

          <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1">
            <span>Timestamp:</span>
            <span>{formattedTimestamp}</span>
          </div>
        </div>

        {/* Google Sheet Submission Status Box */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Google Sheet Status:</span>
            </span>

            {submissionStatus === 'submitting' && (
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> Saving...
              </span>
            )}

            {submissionStatus === 'success' && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle className="w-3.5 h-3.5" /> Recorded
              </span>
            )}

            {submissionStatus === 'error' && (
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                <XCircle className="w-3.5 h-3.5" /> Failed
              </span>
            )}
          </div>

          {statusMessage && (
            <p className={`text-xs ${submissionStatus === 'error' ? 'text-rose-300' : 'text-slate-300'}`}>
              {statusMessage}
            </p>
          )}

          {submissionStatus === 'error' && (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSaveToSheet}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 transition-all"
              >
                Retry Save
              </button>
              <button
                onClick={openAppsScriptModal}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs transition-all"
              >
                Configure Sheet URL
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleCopyProof}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
            <span>{copied ? 'Proof Copied!' : 'Copy Verification'}</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/20"
          >
            <Award className="w-4 h-4" />
            <span>Keep Playing</span>
          </button>
        </div>
      </div>
    </div>
  );
};
