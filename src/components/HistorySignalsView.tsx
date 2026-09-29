import React, { useState } from 'react';
import { HistoryItem, EventType } from '../types';
import { 
  Zap, 
  Youtube, 
  Search, 
  Film, 
  Tv, 
  Plus, 
  Trash2, 
  Clock, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface HistorySignalsViewProps {
  historyItems: HistoryItem[];
  onOpenCaptureModal: () => void;
  onOpenGatherModal?: () => void;
  onRemoveHistoryItem: (id: string) => void;
  onClearHistory: () => void;
  onRefreshTaste: () => void;
  isAnalyzing: boolean;
}

export const HistorySignalsView: React.FC<HistorySignalsViewProps> = ({
  historyItems,
  onOpenCaptureModal,
  onOpenGatherModal,
  onRemoveHistoryItem,
  onClearHistory,
  onRefreshTaste,
  isAnalyzing
}) => {
  const [filter, setFilter] = useState<'all' | 'shorts' | 'youtube' | 'search' | 'pirate'>('all');

  const shortsCount = historyItems.filter(i => i.type === 'youtube_shorts' || i.isShorts).length;
  const ytCount = historyItems.filter(i => i.type === 'youtube' && !i.isShorts).length;
  const searchCount = historyItems.filter(i => i.type === 'search').length;
  const pirateCount = historyItems.filter(i => i.type === 'pirate_stream').length;

  const filteredItems = historyItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'shorts') return item.type === 'youtube_shorts' || item.isShorts;
    if (filter === 'youtube') return item.type === 'youtube' && !item.isShorts;
    if (filter === 'search') return item.type === 'search';
    if (filter === 'pirate') return item.type === 'pirate_stream';
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white font-['Cinzel']">
              Your Watch & Search Activity
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
              {historyItems.length} Events
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Plotted detects streaming-page and media-player signals, YouTube Shorts, video essays, and search queries using content-script inspection to shape your recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenGatherModal && (
            <button
              onClick={onOpenGatherModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-500/30 text-xs font-semibold shadow-sm transition-all"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Gather History</span>
            </button>
          )}

          <button
            onClick={onOpenCaptureModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all font-sans"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Manual</span>
          </button>

          <button
            onClick={onRefreshTaste}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 text-xs font-semibold transition-all font-mono"
          >
            <Sparkles className={`w-3.5 h-3.5 text-indigo-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-white text-black shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
            }`}
          >
            All Signals ({historyItems.length})
          </button>

          <button
            onClick={() => setFilter('shorts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              filter === 'shorts'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Shorts ({shortsCount})</span>
          </button>

          <button
            onClick={() => setFilter('youtube')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              filter === 'youtube'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube ({ytCount})</span>
          </button>

          <button
            onClick={() => setFilter('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              filter === 'search'
                ? 'bg-amber-500 text-black shadow-sm font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Searches ({searchCount})</span>
          </button>

          <button
            onClick={() => setFilter('pirate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              filter === 'pirate'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Stream Lockers ({pirateCount})</span>
          </button>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-950/20 whitespace-nowrap"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Activity List */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 border border-white/5 rounded-2xl bg-neutral-950 text-neutral-500 text-xs">
            No events found under this filter. Click "+ Capture History" to add some!
          </div>
        ) : (
          filteredItems.map((item) => {
            const isShorts = item.type === 'youtube_shorts' || item.isShorts;
            const isYt = item.type === 'youtube' && !item.isShorts;
            const isSearch = item.type === 'search';
            const isPirate = item.type === 'pirate_stream';

            return (
              <div
                key={item.id}
                className="group rounded-xl border border-white/10 bg-neutral-950 p-3.5 sm:p-4 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    isShorts
                      ? 'bg-red-500/20 border-red-500/30 text-amber-300'
                      : isYt
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : isSearch
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    {isShorts && <Zap className="w-4 h-4" />}
                    {isYt && <Youtube className="w-4 h-4" />}
                    {isSearch && <Search className="w-4 h-4" />}
                    {isPirate && <Film className="w-4 h-4" />}
                    {!isShorts && !isYt && !isSearch && !isPirate && <Tv className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold border ${
                        isShorts
                          ? 'bg-red-950/60 text-amber-300 border-red-500/40'
                          : isYt
                          ? 'bg-red-950/60 text-red-300 border-red-500/40'
                          : isSearch
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                          : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                      }`}>
                        {isShorts ? 'YouTube Short' : isYt ? 'YouTube Video' : isSearch ? 'Search Query' : 'Stream Locker'}
                      </span>

                      {item.channel && (
                        <span className="text-[11px] text-neutral-400 font-mono truncate">
                          {item.channel}
                        </span>
                      )}

                      <span className="text-[10px] text-neutral-500 font-mono ml-auto sm:ml-0">
                        {item.timestamp}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-white truncate max-w-xl">
                      {item.title}
                    </h4>

                    {item.notes && (
                      <p className="text-[11px] text-neutral-400 truncate">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onRemoveHistoryItem(item.id)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-900 transition-colors shrink-0"
                  title="Remove from history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
