import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { 
  Shield, 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Download, 
  Trash2, 
  Check, 
  RefreshCw, 
  ToggleLeft, 
  ToggleRight,
  Database,
  KeyRound
} from 'lucide-react';

interface PrivacySettingsViewProps {
  historyItems: HistoryItem[];
  onClearHistory: () => void;
  onResetDefaults: () => void;
}

export const PrivacySettingsView: React.FC<PrivacySettingsViewProps> = ({
  historyItems,
  onClearHistory,
  onResetDefaults
}) => {
  const [monitorPirateSites, setMonitorPirateSites] = useState(true);
  const [monitorYouTube, setMonitorYouTube] = useState(true);
  const [monitorSearches, setMonitorSearches] = useState(true);
  const [anonymizeUrls, setAnonymizeUrls] = useState(false);
  const [excludeIncognito, setExcludeIncognito] = useState(true);
  const [copiedJson, setCopiedJson] = useState(false);

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(historyItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `plotted-history-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-white font-['Cinzel']">
            Privacy, Interception & Local Vault Controls
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
            Zero-Cloud Telemetry
          </span>
        </div>
        <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
          Plotted was built with absolute privacy discipline. Your browsing history, YouTube video logs, and illegal stream captures are stored locally in your browser’s extension storage.
        </p>
      </div>

      {/* Interception Toggles */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6 space-y-5 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-mono flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" />
          Active Interceptor Channels
        </h3>

        <div className="space-y-4">
          
          {/* Toggle Pirate Sites */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/80 border border-white/5">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Capture Unofficial / Stream Locker Sites</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Recommended
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Automatically detects HTML5 video players on hosts like Fmovies, 123movies, Soap2day, and Stremio.
              </p>
            </div>
            <button
              onClick={() => setMonitorPirateSites(!monitorPirateSites)}
              className="text-2xl text-indigo-400 focus:outline-none"
            >
              {monitorPirateSites ? (
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                  ACTIVE
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-neutral-800 text-neutral-500 text-xs font-mono font-bold">
                  MUTED
                </span>
              )}
            </button>
          </div>

          {/* Toggle YouTube */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/80 border border-white/5">
            <div>
              <div className="text-xs font-bold text-white">
                YouTube Video Essay & Film Analysis Interception
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Parses video titles, film essayists, and trailer breakdowns on youtube.com/watch.
              </p>
            </div>
            <button
              onClick={() => setMonitorYouTube(!monitorYouTube)}
              className="text-2xl text-indigo-400 focus:outline-none"
            >
              {monitorYouTube ? (
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                  ACTIVE
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-neutral-800 text-neutral-500 text-xs font-mono font-bold">
                  MUTED
                </span>
              )}
            </button>
          </div>

          {/* Toggle Searches */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/80 border border-white/5">
            <div>
              <div className="text-xs font-bold text-white">
                Search Engine Film Query Interception
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Captures Google and DuckDuckGo queries containing movie recommendations, endings explained, and cinema directors.
              </p>
            </div>
            <button
              onClick={() => setMonitorSearches(!monitorSearches)}
              className="text-2xl text-indigo-400 focus:outline-none"
            >
              {monitorSearches ? (
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                  ACTIVE
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-neutral-800 text-neutral-500 text-xs font-mono font-bold">
                  MUTED
                </span>
              )}
            </button>
          </div>

          {/* Exclude Incognito */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/80 border border-white/5">
            <div>
              <div className="text-xs font-bold text-white">
                Exclude Incognito / Private Windows
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                When active, Plotted completely shuts down DOM watchers in private browsing sessions.
              </p>
            </div>
            <button
              onClick={() => setExcludeIncognito(!excludeIncognito)}
              className="text-2xl text-indigo-400 focus:outline-none"
            >
              {excludeIncognito ? (
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                  ACTIVE
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-neutral-800 text-neutral-500 text-xs font-mono font-bold">
                  DISABLED
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Data Export & Management */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-mono flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-400" />
          Data Portability & Sanitization
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleExportJson}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-200 text-xs font-semibold font-mono transition-all"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export History (.JSON)</span>
          </button>

          <button
            onClick={onResetDefaults}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-200 text-xs font-semibold font-mono transition-all"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Reset Demo Signals</span>
          </button>

          <button
            onClick={onClearHistory}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-semibold font-mono transition-all"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Wipe All Stored Data</span>
          </button>
        </div>
      </div>

    </div>
  );
};
