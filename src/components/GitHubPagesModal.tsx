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
                <span className="font-bold text-white">Fixing a Blank White Screen on GitHub Pages:</span>
                <p className="text-slate-300">
                  A blank white screen on GitHub Pages almost always happens because GitHub Pages is serving raw source files (like <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 font-mono">/src/main.tsx</code>) instead of the compiled <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 font-mono">dist/</code> build bundle.
                </p>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 mt-2 text-slate-300">
                  <p className="font-bold text-indigo-300">Solution 1: Use GitHub Actions (Easiest & Automatic)</p>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-300">
                    <li>Go to your GitHub Repository → <strong>Settings</strong> → <strong>Pages</strong>.</li>
                    <li>Under <strong>Source</strong>, change the dropdown from "Deploy from a branch" to <strong>GitHub Actions</strong>.</li>
                    <li>Because we created a <code className="text-emerald-400 font-mono">.github/workflows/deploy.yml</code> file in this repo, GitHub will automatically build and deploy your app every time you push!</li>
                  </ol>
                  
                  <p className="font-bold text-indigo-300 pt-1">Solution 2: Deploy using gh-pages command</p>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-300">
                    <li>In your local terminal, run: <code className="text-amber-300 font-mono">npm run deploy</code></li>
                    <li>In GitHub Repo → <strong>Settings</strong> → <strong>Pages</strong>, set Source to <strong>Deploy from a branch</strong>, select branch <strong>gh-pages</strong>, folder <strong>/ (root)</strong>, and click <strong>Save</strong>.</li>
                  </ol>
                </div>
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
