import React, { useState } from 'react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../utils/appsScriptCode';
import { submitResultToGoogleSheet } from '../utils/bingoLogic';
import {
  FileSpreadsheet,
  Copy,
  Check,
  ExternalLink,
  Send,
  X,
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface AppsScriptModalProps {
  scriptUrl: string;
  setScriptUrl: (url: string) => void;
  onClose: () => void;
}

export const AppsScriptModal: React.FC<AppsScriptModalProps> = ({
  scriptUrl,
  setScriptUrl,
  onClose,
}) => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTestConnection = async () => {
    if (!scriptUrl || scriptUrl.trim() === '') {
      setTestStatus('error');
      setTestMessage('Please paste your Google Apps Script Web App URL first.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Sending test submission to your Google Sheet...');

    const res = await submitResultToGoogleSheet(scriptUrl, {
      studentName: 'Teacher Test Student',
      studentId: 'TEST-101',
      timestamp: new Date().toLocaleString(),
      winPattern: 'Row 1 (Test)',
      winningNumbers: '5, 12, 34, 56, 89',
      cardSeed: 'TEST-SEED',
      gridSize: 5,
      proofCode: 'BNG-TST-101',
    });

    if (res.success) {
      setTestStatus('success');
      setTestMessage('SUCCESS! Check your Google Sheet — a test row was added!');
    } else {
      setTestStatus('error');
      setTestMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative text-white space-y-6 my-auto max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30 shrink-0">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Google Sheets + Apps Script Integration
            </h2>
            <p className="text-xs text-slate-400">
              Save student Bingo results directly into your personal Google Sheet
            </p>
          </div>
        </div>

        {/* Input Web App URL */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 space-y-3">
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
            <span>Your Google Apps Script Web App URL:</span>
            {scriptUrl ? (
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Configured
              </span>
            ) : (
              <span className="text-[10px] text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                Not Configured
              </span>
            )}
          </label>

          <input
            type="text"
            placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
            value={scriptUrl}
            onChange={(e) => setScriptUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testStatus === 'testing' ? 'Testing...' : 'Test Connection'}</span>
            </button>

            {scriptUrl && (
              <button
                onClick={() => setScriptUrl('')}
                className="text-xs text-rose-400 hover:underline"
              >
                Clear URL
              </button>
            )}
          </div>

          {testMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                testStatus === 'success'
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
              }`}
            >
              {testStatus === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{testMessage}</span>
            </div>
          )}
        </div>

        {/* Step by Step Setup Instructions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Setup Instructions (2 Minutes)
          </h3>

          <ol className="space-y-2.5 text-xs text-slate-300 list-decimal pl-4">
            <li>
              Open a new or existing <strong>Google Sheet</strong> in your Google Drive.
            </li>
            <li>
              Click <strong>Extensions</strong> → <strong>Apps Script</strong> from the top menu.
            </li>
            <li className="flex flex-col gap-1.5">
              <span>
                Paste the code into the Apps Script editor. <strong>Note:</strong> If you created the script inside your sheet via <em>Extensions → Apps Script</em>, leave <code>var SPREADSHEET_URL = "";</code> blank. If using script.google.com, paste your Google Sheet URL into that variable.
              </span>
              <button
                onClick={handleCopyCode}
                className="w-fit px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md mt-1"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Apps Script Code Copied!' : 'Copy Apps Script Code'}</span>
              </button>
            </li>
            <li>
              Paste the code into Apps Script and click the <strong>Save (💾)</strong> icon.
            </li>
            <li>
              Click <strong>Deploy</strong> (top right) → <strong>New Deployment</strong>.
            </li>
            <li>
              Select <strong>Web App</strong> (gear icon). Set <em>Execute as: Me</em> and <em>Who has access: Anyone</em>.
            </li>
            <li>
              Click <strong>Deploy</strong>, grant permissions, and copy the <strong>Web App URL</strong> into the field above!
            </li>
          </ol>
        </div>

        {/* Code Snippet Preview */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Code Preview (google-apps-script.gs)</span>
            <button onClick={handleCopyCode} className="text-indigo-400 hover:underline flex items-center gap-1">
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>
          <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-32 p-2 bg-slate-900/90 rounded-lg">
            {GOOGLE_APPS_SCRIPT_CODE}
          </pre>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
          >
            Done / Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
