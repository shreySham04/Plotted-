import React, { useState, useEffect } from 'react';
import { TasteProfile, HistoryItem } from '../types';
import { 
  FolderDown, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Code2, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ExtensionHubViewProps {
  tasteProfile: TasteProfile;
  historyItems: HistoryItem[];
  onDownloadZip: () => void;
}

export const ExtensionHubView: React.FC<ExtensionHubViewProps> = ({
  tasteProfile,
  historyItems,
  onDownloadZip
}) => {
  const [showCode, setShowCode] = useState(false);
  const [extensionFiles, setExtensionFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string>('manifest.json');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/extension/files')
      .then(res => res.json())
      .then(data => setExtensionFiles(data))
      .catch(console.error);
  }, []);

  const handleCopy = () => {
    if (!extensionFiles[activeFile]) return;
    navigator.clipboard.writeText(extensionFiles[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortsCount = historyItems.filter(i => i.type === 'youtube_shorts' || i.isShorts).length;
  const ytCount = historyItems.filter(i => i.type === 'youtube').length;
  const searchCount = historyItems.filter(i => i.type === 'search').length;
  const pirateCount = historyItems.filter(i => i.type === 'pirate_stream').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Banner */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-950/40 via-neutral-900 to-neutral-950 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-indigo-400 font-bold">
              OFFICIAL BROWSER EXTENSION
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Cinzel']">
              Install Plotted on Chrome, Brave & Edge
            </h2>
            <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
              Once installed, Plotted detects streaming-page and media-player signals, YouTube Shorts, video essays, and movie searches using content-script inspection, personalizing your movie recommendations automatically.
            </p>
          </div>

          <button
            onClick={onDownloadZip}
            className="shrink-0 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 font-mono"
          >
            <FolderDown className="w-4 h-4" />
            <span>Download Extension (.ZIP)</span>
          </button>
        </div>
      </div>

      {/* 4-Step Simple Setup Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4 space-y-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 font-mono font-bold flex items-center justify-center text-xs">
            1
          </div>
          <h4 className="text-xs font-bold text-white">Unzip Download</h4>
          <p className="text-[11px] text-neutral-400">
            Extract <code className="text-indigo-300">plotted-extension.zip</code> to any folder on your laptop or PC.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4 space-y-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 font-mono font-bold flex items-center justify-center text-xs">
            2
          </div>
          <h4 className="text-xs font-bold text-white">chrome://extensions</h4>
          <p className="text-[11px] text-neutral-400">
            Open Chrome, navigate to <code className="text-indigo-300">chrome://extensions</code>, and turn on <strong>"Developer mode"</strong>.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4 space-y-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 font-mono font-bold flex items-center justify-center text-xs">
            3
          </div>
          <h4 className="text-xs font-bold text-white">Load Unpacked</h4>
          <p className="text-[11px] text-neutral-400">
            Click <strong>"Load unpacked"</strong> and select the unzipped directory to activate Plotted.
          </p>
        </div>

        <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-xs">
            4
          </div>
          <h4 className="text-xs font-bold text-indigo-200">Gather Past History</h4>
          <p className="text-[11px] text-neutral-400">
            Click <strong>"⏳ History"</strong> in the popup to choose: <em>Week, Month, Year, All Time</em>, or <em>From Now On</em>.
          </p>
        </div>
      </div>

      {/* Extension Toolbar Popup Preview */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
          EXTENSION POPUP PREVIEW (WITH HISTORY GATHERER)
        </h3>

        <div className="max-w-[340px] mx-auto rounded-xl border border-white/15 bg-[#09090b] shadow-2xl p-4 space-y-3 font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-bold text-xs text-white font-['Cinzel'] tracking-wider">
              🎬 PLOTTED
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/30">
                ⏳ History
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                ● Active
              </span>
            </div>
          </div>

          {/* Mini Gather Card */}
          <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 space-y-1.5 text-left">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono font-bold text-indigo-300 uppercase">Gather Previous History</span>
              <span className="text-[8px] font-mono bg-indigo-500/20 text-indigo-200 px-1.5 py-0.2 rounded">Last Month</span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-[8px] font-mono text-center">
              <span className="p-1 bg-neutral-900 rounded text-neutral-400">Week</span>
              <span className="p-1 bg-indigo-600 rounded text-white font-bold">Month</span>
              <span className="p-1 bg-neutral-900 rounded text-neutral-400">Year</span>
              <span className="p-1 bg-neutral-900 rounded text-neutral-400">All</span>
              <span className="p-1 bg-neutral-900 rounded text-neutral-400">Now</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-900 border border-white/5 space-y-1">
            <span className="text-[9px] font-mono text-neutral-400 uppercase">Current Taste Archetype</span>
            <div className="text-xs font-bold text-amber-400 truncate">{tasteProfile.tasteArchetype}</div>
          </div>

          <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-mono">
            <div className="p-1.5 bg-neutral-900 rounded">
              <div className="font-bold text-white">{shortsCount}</div>
              <div className="text-neutral-500 text-[8px]">Shorts</div>
            </div>
            <div className="p-1.5 bg-neutral-900 rounded">
              <div className="font-bold text-white">{ytCount}</div>
              <div className="text-neutral-500 text-[8px]">YouTube</div>
            </div>
            <div className="p-1.5 bg-neutral-900 rounded">
              <div className="font-bold text-white">{searchCount}</div>
              <div className="text-neutral-500 text-[8px]">Searches</div>
            </div>
            <div className="p-1.5 bg-rose-950/20 text-rose-300 rounded border border-rose-500/20">
              <div className="font-bold">{pirateCount}</div>
              <div className="text-rose-400 text-[8px]">Lockers</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[9px] font-mono text-neutral-400 uppercase block">Top Match</span>
            {tasteProfile.recommendations.slice(0, 1).map((r, i) => (
              <div key={i} className="p-2 rounded bg-neutral-900 border border-neutral-800 text-xs space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>{r.title} ({r.year})</span>
                  <span className="text-emerald-400 font-mono text-[10px]">{r.matchScore}%</span>
                </div>
                <p className="text-[10px] text-neutral-400 line-clamp-1">{r.whyItMatched}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Developer Source Code (Collapsible Accordion so it doesn't clutter the UI) */}
      <div className="rounded-xl border border-white/5 bg-neutral-950 overflow-hidden">
        <button
          onClick={() => setShowCode(!showCode)}
          className="w-full px-5 py-3 flex items-center justify-between text-xs text-neutral-400 hover:text-white font-mono transition-colors"
        >
          <span className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>Developer: Inspect Extension Source Code ({Object.keys(extensionFiles).length} files)</span>
          </span>
          {showCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showCode && (
          <div className="p-4 border-t border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
                {Object.keys(extensionFiles).map((fn) => (
                  <button
                    key={fn}
                    onClick={() => setActiveFile(fn)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeFile === fn ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {fn}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white px-2 py-1 bg-neutral-900 rounded"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-3 rounded-xl bg-black border border-white/5 text-[11px] font-mono text-neutral-300 max-h-60 overflow-y-auto">
              {extensionFiles[activeFile]}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
};
