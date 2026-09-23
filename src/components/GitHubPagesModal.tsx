import React from 'react';
import { Github, Globe, Check, ExternalLink, X, Terminal, Code2 } from 'lucide-react';

interface GitHubPagesModalProps {
  onClose: () => void;
}

export const GitHubPagesModal: React.FC<GitHubPagesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative text-white space-y-6 my-auto max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-bold border border-slate-700 shrink-0">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Deploy to GitHub Pages
            </h2>
            <p className="text-xs text-slate-400">
              Host this web app on GitHub Pages for free static hosting
            </p>
          </div>
        </div>

        {/* Deploy Steps */}
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-2xl space-y-1">
            <h3 className="font-bold text-indigo-300 flex items-center gap-1.5 text-xs">
              <Globe className="w-4 h-4" /> 100% Client-Side Compatible
            </h3>
            <p className="text-slate-300 text-[11px]">
              This entire app runs completely inside the user's browser. It is fully ready for GitHub Pages or any static host!
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Quick Deployment Steps:
            </h4>

            <ol className="space-y-3 list-decimal pl-4">
              <li className="space-y-1">
                <span className="font-bold text-white">Create GitHub Repository:</span>
                <p>
                  Push this source repository to GitHub (or export code via Settings → Export as ZIP).
                </p>
              </li>

              <li className="space-y-1">
                <span className="font-bold text-white">Build Output:</span>
                <p>
                  In your repository, run <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">npm run build</code> which creates a static bundle in the <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">dist/</code> folder.
                </p>
              </li>

              <li className="space-y-1">
                <span className="font-bold text-white">GitHub Actions / Pages Setup:</span>
                <p>
                  In your GitHub repo settings: Go to <strong>Settings</strong> → <strong>Pages</strong> → set Source to <strong>GitHub Actions</strong> or <strong>Deploy from branch (gh-pages)</strong>.
                </p>
              </li>
            </ol>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 font-mono text-[11px] text-emerald-400">
            <div className="flex items-center gap-1 text-slate-400 text-[10px]">
              <Terminal className="w-3 h-3" /> Sample gh-pages deploy script in package.json:
            </div>
            <code>npm install -D gh-pages</code>
            <br />
            <code>"deploy": "gh-pages -d dist"</code>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
          >
            Got it / Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
