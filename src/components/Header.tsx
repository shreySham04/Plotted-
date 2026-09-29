import React from 'react';
import { Film, Sparkles, Compass, Download, Plus, Zap, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'recs' | 'activity' | 'extension';
  setActiveTab: (tab: 'recs' | 'activity' | 'extension') => void;
  eventCount: number;
  pirateCount: number;
  isAnalyzing: boolean;
  onOpenCaptureModal: () => void;
  onRefreshTaste: () => void;
  onDownloadZip: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  eventCount,
  pirateCount,
  isAnalyzing,
  onOpenCaptureModal,
  onRefreshTaste,
  onDownloadZip
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#07080b]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('recs')} 
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-widest text-white font-['Cinzel']">
                PLOTTED
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" title="Passive Monitoring Active" />
            </div>
            <p className="text-[10px] text-neutral-400 font-mono hidden sm:block">
              Taste Engine & History Recommender
            </p>
          </div>
        </div>

        {/* Clean, Simple Main Navigation */}
        <nav className="flex items-center gap-1 p-1 bg-neutral-900/90 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('recs')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'recs'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommendations</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'activity'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Activity</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] font-mono text-neutral-300">
              {eventCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('extension')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'extension'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chrome Extension</span>
            <span className="sm:hidden">Extension</span>
          </button>
        </nav>

        {/* Clean Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCaptureModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 transition-all shadow-sm"
            title="Log YouTube Shorts, Searches, or Movie streams"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Capture</span>
            <span>History</span>
          </button>

          <button
            onClick={onDownloadZip}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all font-mono"
            title="Download Extension ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.ZIP</span>
          </button>
        </div>

      </div>
    </header>
  );
};
